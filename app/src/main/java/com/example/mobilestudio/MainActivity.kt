package com.example.mobilestudio

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ActivityInfo
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.media.projection.MediaProjectionManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.ParcelFileDescriptor
import android.view.View
import android.webkit.WebView
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.SeekBar
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import android.widget.VideoView
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {

    private lateinit var controlPanel: LinearLayout
    private lateinit var contentArea: FrameLayout
    private lateinit var btnPickFile: Button
    private lateinit var btnRemoveFile: Button
    private lateinit var btnOrientation: Button
    private lateinit var btnGoLive: Button
    private lateinit var btnStopLive: Button

    private lateinit var spPlatform: Spinner
    private lateinit var spResolution: Spinner
    private lateinit var spFps: Spinner
    private lateinit var spBitrate: Spinner

    private lateinit var cbLocalRecord: CheckBox
    private lateinit var cbLiveVoiceOver: CheckBox

    private lateinit var layoutFileLocation: LinearLayout
    private lateinit var tvFileLocation: TextView

    private lateinit var etStreamUrl: EditText
    private lateinit var etStreamKey: EditText

    private lateinit var ivPreview: ImageView
    private lateinit var videoView: VideoView
    private lateinit var webView: WebView
    private lateinit var tvAudioLabel: TextView

    // Bottom Zoom Bar Controls
    private lateinit var layoutZoomBar: LinearLayout
    private lateinit var btnZoomOut: Button
    private lateinit var btnZoomIn: Button
    private lateinit var btnResetZoom: Button
    private lateinit var sbZoom: SeekBar
    private lateinit var tvZoomValue: TextView
    private var currentZoomFactor: Float = 1.0f

    // Live Stream Health Monitor HUD
    private lateinit var layoutStreamStatsHUD: LinearLayout
    private lateinit var tvLiveStatusIndicator: TextView
    private lateinit var tvLiveBitrate: TextView
    private lateinit var tvLiveFps: TextView
    private lateinit var tvLocalRecordStatus: TextView
    private lateinit var tvLiveDrops: TextView
    private lateinit var tvLiveJitter: TextView
    private lateinit var tvReconnectWarning: TextView

    private var isLive: Boolean = false
    private var isPortrait: Boolean = false

    // Stream Stats BroadcastReceiver
    private val statsReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == StreamService.ACTION_STREAM_STATS) {
                val dropped = intent.getLongExtra(StreamService.EXTRA_DROPPED_FRAMES, 0L)
                val bitrateBps = intent.getLongExtra(StreamService.EXTRA_LIVE_BITRATE, 3000 * 1000L)
                val fps = intent.getDoubleExtra(StreamService.EXTRA_LIVE_FPS, 30.0)
                val jitterMs = intent.getLongExtra(StreamService.EXTRA_JITTER_MS, 4L)
                val isReconnecting = intent.getBooleanExtra(StreamService.EXTRA_IS_RECONNECTING, false)
                val reconnectAttempt = intent.getIntExtra(StreamService.EXTRA_RECONNECT_ATTEMPT, 0)
                val isFailed = intent.getBooleanExtra("extra_is_failed", false)

                updateHealthMonitorUI(dropped, bitrateBps, fps, jitterMs, isReconnecting, reconnectAttempt, isFailed)
            }
        }
    }
    private var isReceiverRegistered: Boolean = false

    private var currentPdfUri: Uri? = null
    private var pdfFileDescriptor: ParcelFileDescriptor? = null
    private var pdfRenderer: PdfRenderer? = null
    private var currentPdfPage: Int = 0

    private val requestPermissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val audioGranted = permissions[Manifest.permission.RECORD_AUDIO] == true
        if (!audioGranted) {
            Toast.makeText(this, R.string.toast_audio_permission_denied, Toast.LENGTH_LONG).show()
            return@registerForActivityResult
        }
        startScreenCaptureFlow()
    }

    private val screenCaptureLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            startStreamingService(result.resultCode, result.data!!)
        } else {
            Toast.makeText(this, "Screen capture permission denied", Toast.LENGTH_SHORT).show()
        }
    }

    private val openDocumentLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
        uri?.let { handleSelectedFile(it) }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        setupSpinners()
        setupListeners()
        setupZoomControls()
        registerStatsReceiver()
    }

    private fun initViews() {
        controlPanel = findViewById(R.id.controlPanel)
        contentArea = findViewById(R.id.contentArea)
        btnPickFile = findViewById(R.id.btnPickFile)
        btnRemoveFile = findViewById(R.id.btnRemoveFile)
        btnOrientation = findViewById(R.id.btnOrientation)
        btnGoLive = findViewById(R.id.btnGoLive)
        btnStopLive = findViewById(R.id.btnStopLive)

        spPlatform = findViewById(R.id.spPlatform)
        spResolution = findViewById(R.id.spResolution)
        spFps = findViewById(R.id.spFps)
        spBitrate = findViewById(R.id.spBitrate)

        cbLocalRecord = findViewById(R.id.cbLocalRecord)
        cbLiveVoiceOver = findViewById(R.id.cbLiveVoiceOver)

        layoutFileLocation = findViewById(R.id.layoutFileLocation)
        tvFileLocation = findViewById(R.id.tvFileLocation)

        etStreamUrl = findViewById(R.id.etStreamUrl)
        etStreamKey = findViewById(R.id.etStreamKey)

        ivPreview = findViewById(R.id.ivPreview)
        videoView = findViewById(R.id.videoView)
        webView = findViewById(R.id.webView)
        tvAudioLabel = findViewById(R.id.tvAudioLabel)

        layoutZoomBar = findViewById(R.id.layoutZoomBar)
        btnZoomOut = findViewById(R.id.btnZoomOut)
        btnZoomIn = findViewById(R.id.btnZoomIn)
        btnResetZoom = findViewById(R.id.btnResetZoom)
        sbZoom = findViewById(R.id.sbZoom)
        tvZoomValue = findViewById(R.id.tvZoomValue)

        layoutStreamStatsHUD = findViewById(R.id.layoutStreamStatsHUD)
        tvLiveStatusIndicator = findViewById(R.id.tvLiveStatusIndicator)
        tvLiveBitrate = findViewById(R.id.tvLiveBitrate)
        tvLiveFps = findViewById(R.id.tvLiveFps)
        tvLocalRecordStatus = findViewById(R.id.tvLocalRecordStatus)
        tvLiveDrops = findViewById(R.id.tvLiveDrops)
        tvLiveJitter = findViewById(R.id.tvLiveJitter)
        tvReconnectWarning = findViewById(R.id.tvReconnectWarning)

        webView.settings.javaScriptEnabled = true
    }

    private fun registerStatsReceiver() {
        if (!isReceiverRegistered) {
            val filter = IntentFilter(StreamService.ACTION_STREAM_STATS)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                ContextCompat.registerReceiver(this, statsReceiver, filter, ContextCompat.RECEIVER_NOT_EXPORTED)
            } else {
                @Suppress("UnspecifiedRegisterReceiverFlag")
                registerReceiver(statsReceiver, filter)
            }
            isReceiverRegistered = true
        }
    }

    private fun unregisterStatsReceiver() {
        if (isReceiverRegistered) {
            try { unregisterReceiver(statsReceiver) } catch (ignored: Exception) {}
            isReceiverRegistered = false
        }
    }

    private fun updateHealthMonitorUI(
        dropped: Long,
        bitrateBps: Long,
        fps: Double,
        jitterMs: Long,
        isReconnecting: Boolean,
        reconnectAttempt: Int,
        isFailed: Boolean
    ) {
        if (!isLive) return

        val kbps = bitrateBps / 1000
        tvLiveBitrate.text = "${kbps} kbps"
        tvLiveFps.text = String.format("%.1f fps", fps)
        tvLiveDrops.text = "Drops: $dropped"
        tvLiveJitter.text = "Jitter: ${jitterMs}ms"

        if (isFailed) {
            tvLiveStatusIndicator.text = "❌ FAILED"
            tvReconnectWarning.visibility = View.VISIBLE
            tvReconnectWarning.text = "Connection lost. Reconnect failed."
            tvReconnectWarning.setTextColor(Color.RED)
            stopLiveStream()
            return
        }

        if (isReconnecting) {
            tvLiveStatusIndicator.text = "⚠️ RETRYING"
            tvReconnectWarning.visibility = View.VISIBLE
            tvReconnectWarning.text = "⚠️ Connection dropped. Reconnecting (Attempt $reconnectAttempt/5)..."
            tvReconnectWarning.setTextColor(Color.parseColor("#FFA500"))
        } else {
            tvLiveStatusIndicator.text = "🔴 LIVE"
            tvReconnectWarning.visibility = View.GONE
        }
    }

    private fun setupSpinners() {
        // Platform selection presets: Dailymotion, Restream, YouTube, Facebook, Twitch, Kick, Custom
        val platforms = listOf(
            "Dailymotion Live",
            "Restream.io (Multi-stream)",
            "YouTube Live",
            "Facebook Live",
            "Twitch",
            "Kick Live",
            "Custom RTMP Preset"
        )
        spPlatform.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, platforms)
        spPlatform.setSelection(0)
        spPlatform.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                when (position) {
                    0 -> { // Dailymotion
                        etStreamUrl.setText("rtmp://publish.dailymotion.com/live")
                        etStreamKey.hint = "Dailymotion stream key"
                    }
                    1 -> { // Restream
                        etStreamUrl.setText("rtmp://live.restream.io/live")
                        etStreamKey.hint = "Restream broadcast key"
                    }
                    2 -> { // YouTube
                        etStreamUrl.setText("rtmp://a.rtmp.youtube.com/live2")
                        etStreamKey.hint = "YouTube stream key"
                    }
                    3 -> { // Facebook
                        etStreamUrl.setText("rtmps://live-api-s.facebook.com:443/rtmp/")
                        etStreamKey.hint = "Facebook stream key"
                    }
                    4 -> { // Twitch
                        etStreamUrl.setText("rtmp://live.twitch.tv/app/")
                        etStreamKey.hint = "Twitch live_... key"
                    }
                    5 -> { // Kick
                        etStreamUrl.setText("rtmps://fa723fc1b171.global-contribute.live-video.net/app/")
                        etStreamKey.hint = "Kick sk_... key"
                    }
                    6 -> { // Custom RTMP
                        etStreamUrl.setText("rtmp://")
                        etStreamKey.hint = "Custom stream key"
                    }
                }
            }
            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }

        val resolutions = listOf(
            "720p HD (1280x720)",
            "360p (640x360)",
            "480p (854x480)",
            "1080p Full HD (1920x1080)",
            "1440p 2K (2560x1440)"
        )
        spResolution.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, resolutions)
        spResolution.setSelection(0)

        val fpsList = listOf("30 fps", "24 fps", "25 fps", "50 fps", "60 fps")
        spFps.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, fpsList)
        spFps.setSelection(0)

        val bitrates = listOf("Auto", "1 Mbps", "2.5 Mbps", "4 Mbps", "6 Mbps", "9 Mbps", "12 Mbps")
        spBitrate.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, bitrates)
        spBitrate.setSelection(0)
    }

    private fun setupListeners() {
        btnPickFile.setOnClickListener {
            openDocumentLauncher.launch(
                arrayOf("image/*", "video/*", "audio/*", "application/pdf", "text/html")
            )
        }

        btnRemoveFile.setOnClickListener {
            resetMediaSources()
            layoutFileLocation.visibility = View.GONE
            btnRemoveFile.visibility = View.GONE
            applyZoom(100)
            sbZoom.progress = 100
            Toast.makeText(this, "File removed from live stage", Toast.LENGTH_SHORT).show()
        }

        btnOrientation.setOnClickListener {
            toggleOrientation()
        }

        btnGoLive.setOnClickListener {
            initiateGoLive()
        }

        btnStopLive.setOnClickListener {
            stopLiveStream()
        }

        ivPreview.setOnClickListener {
            if (pdfRenderer != null) {
                renderPdfPage(currentPdfPage + 1)
            }
        }

        ivPreview.setOnLongClickListener {
            if (pdfRenderer != null) {
                renderPdfPage(currentPdfPage - 1)
                true
            } else {
                false
            }
        }
    }

    private fun setupZoomControls() {
        sbZoom.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                val clamped = progress.coerceIn(50, 300)
                applyZoom(clamped)
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })

        btnZoomIn.setOnClickListener {
            val next = (sbZoom.progress + 25).coerceAtMost(300)
            sbZoom.progress = next
            applyZoom(next)
        }

        btnZoomOut.setOnClickListener {
            val next = (sbZoom.progress - 25).coerceAtLeast(50)
            sbZoom.progress = next
            applyZoom(next)
        }

        btnResetZoom.setOnClickListener {
            sbZoom.progress = 100
            applyZoom(100)
        }
    }

    private fun applyZoom(percent: Int) {
        currentZoomFactor = percent / 100f
        tvZoomValue.text = "$percent%"
        contentArea.scaleX = currentZoomFactor
        contentArea.scaleY = currentZoomFactor
        contentArea.pivotX = contentArea.width / 2f
        contentArea.pivotY = contentArea.height / 2f
    }

    private fun toggleOrientation() {
        if (isLive) return

        isPortrait = !isPortrait
        if (isPortrait) {
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            btnOrientation.text = getString(R.string.orientation_portrait)
        } else {
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
            btnOrientation.text = getString(R.string.orientation_landscape)
        }

        if (currentPdfUri != null) {
            contentArea.post { renderPdfPage(currentPdfPage) }
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        if (currentPdfUri != null) {
            contentArea.post { renderPdfPage(currentPdfPage) }
        }
    }

    private fun resetMediaSources() {
        try {
            if (videoView.isPlaying) {
                videoView.stopPlayback()
            }
        } catch (ignored: Exception) {}
        videoView.visibility = View.GONE

        closePdf()

        ivPreview.setImageDrawable(null)
        ivPreview.visibility = View.GONE

        webView.loadUrl("about:blank")
        webView.visibility = View.GONE

        tvAudioLabel.visibility = View.GONE
    }

    private fun closePdf() {
        try { pdfRenderer?.close() } catch (ignored: Exception) {}
        pdfRenderer = null
        try { pdfFileDescriptor?.close() } catch (ignored: Exception) {}
        pdfFileDescriptor = null
        currentPdfUri = null
        currentPdfPage = 0
    }

    private fun handleSelectedFile(uri: Uri) {
        resetMediaSources()

        // Display exact file path/folder location in UI
        val friendlyPath = extractPathFromUri(uri)
        layoutFileLocation.visibility = View.VISIBLE
        tvFileLocation.text = friendlyPath
        btnRemoveFile.visibility = View.VISIBLE

        val mimeType = contentResolver.getType(uri) ?: "application/octet-stream"
        when {
            mimeType.startsWith("image/") -> {
                ivPreview.visibility = View.VISIBLE
                ivPreview.setImageURI(uri)
            }
            mimeType.startsWith("video/") -> {
                videoView.visibility = View.VISIBLE
                videoView.setVideoURI(uri)
                videoView.setOnPreparedListener { mp ->
                    mp.isLooping = true
                    videoView.start()
                }
            }
            mimeType.startsWith("audio/") -> {
                videoView.visibility = View.VISIBLE
                tvAudioLabel.visibility = View.VISIBLE
                videoView.setVideoURI(uri)
                videoView.setOnPreparedListener { mp ->
                    mp.isLooping = true
                    videoView.start()
                }
            }
            mimeType == "application/pdf" -> loadPdf(uri)
            mimeType == "text/html" -> loadHtml(uri)
            else -> Toast.makeText(this, R.string.toast_unsupported_file, Toast.LENGTH_SHORT).show()
        }
    }

    private fun extractPathFromUri(uri: Uri): String {
        return try {
            val docId = uri.path ?: uri.toString()
            if (docId.contains(":")) {
                val parts = docId.split(":")
                "/storage/emulated/0/${parts.last()}"
            } else {
                docId
            }
        } catch (e: Exception) {
            uri.toString()
        }
    }

    private fun loadPdf(uri: Uri) {
        try {
            val pfd = contentResolver.openFileDescriptor(uri, "r") ?: return
            pdfFileDescriptor = pfd
            pdfRenderer = PdfRenderer(pfd)
            currentPdfUri = uri
            currentPdfPage = 0
            ivPreview.visibility = View.VISIBLE
            contentArea.post { renderPdfPage(0) }
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to load PDF: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            closePdf()
        }
    }

    private fun renderPdfPage(pageIndex: Int) {
        val renderer = pdfRenderer ?: return
        val pageCount = renderer.pageCount
        if (pageCount == 0) return

        val clampedPage = pageIndex.coerceIn(0, pageCount - 1)
        currentPdfPage = clampedPage

        var page: PdfRenderer.Page? = null
        try {
            page = renderer.openPage(clampedPage)
            val viewHeight = contentArea.height.takeIf { it > 0 } ?: resources.displayMetrics.heightPixels
            val scale = viewHeight.toFloat() / page.height.toFloat()
            val targetWidth = (page.width * scale).toInt().coerceAtLeast(1)
            val targetHeight = (page.height * scale).toInt().coerceAtLeast(1)

            val bitmap = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            canvas.drawColor(Color.WHITE)

            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
            ivPreview.setImageBitmap(bitmap)
        } catch (e: Exception) {
            Toast.makeText(this, "Error rendering page", Toast.LENGTH_SHORT).show()
        } finally {
            try { page?.close() } catch (ignored: Exception) {}
        }
    }

    private fun loadHtml(uri: Uri) {
        try {
            contentResolver.openInputStream(uri)?.use { stream ->
                val htmlContent = stream.bufferedReader().use { it.readText() }
                webView.visibility = View.VISIBLE
                webView.loadDataWithBaseURL(null, htmlContent, "text/html", "utf-8", null)
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to load HTML", Toast.LENGTH_SHORT).show()
        }
    }

    private fun initiateGoLive() {
        val streamUrl = etStreamUrl.text.toString().trim().removeSuffix("/")
        val streamKey = etStreamKey.text.toString().trim()

        if (streamUrl.isBlank() || streamKey.isBlank()) {
            Toast.makeText(this, R.string.toast_empty_credentials, Toast.LENGTH_SHORT).show()
            return
        }

        val permissionsToRequest = mutableListOf(Manifest.permission.RECORD_AUDIO)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        val missing = permissionsToRequest.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missing.isNotEmpty()) {
            requestPermissionsLauncher.launch(missing.toTypedArray())
        } else {
            startScreenCaptureFlow()
        }
    }

    private fun startScreenCaptureFlow() {
        val projectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as? MediaProjectionManager
        projectionManager?.let {
            screenCaptureLauncher.launch(it.createScreenCaptureIntent())
        }
    }

    private fun startStreamingService(resultCode: Int, resultData: Intent) {
        val (width, height) = calculateResolution()
        val fps = calculateFps()
        val bitrate = calculateBitrate(width, height, fps)

        val endpoint = "${etStreamUrl.text.toString().trim().removeSuffix("/")}/${etStreamKey.text.toString().trim()}"

        val serviceIntent = Intent(this, StreamService::class.java).apply {
            action = StreamService.ACTION_START
            putExtra(StreamService.EXTRA_RESULT_CODE, resultCode)
            putExtra(StreamService.EXTRA_RESULT_DATA, resultData)
            putExtra(StreamService.EXTRA_URL, endpoint)
            putExtra(StreamService.EXTRA_WIDTH, width)
            putExtra(StreamService.EXTRA_HEIGHT, height)
            putExtra(StreamService.EXTRA_FPS, fps)
            putExtra(StreamService.EXTRA_BITRATE, bitrate)
            putExtra("extra_enable_local_record", cbLocalRecord.isChecked)
            putExtra("extra_enable_voice_over", cbLiveVoiceOver.isChecked)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }

        isLive = true
        controlPanel.visibility = View.GONE
        btnStopLive.visibility = View.VISIBLE
        layoutStreamStatsHUD.visibility = View.VISIBLE
        btnOrientation.isEnabled = false

        if (cbLocalRecord.isChecked) {
            tvLocalRecordStatus.visibility = View.VISIBLE
        } else {
            tvLocalRecordStatus.visibility = View.GONE
        }
    }

    private fun stopLiveStream() {
        val serviceIntent = Intent(this, StreamService::class.java).apply {
            action = StreamService.ACTION_STOP
        }
        startService(serviceIntent)

        isLive = false
        controlPanel.visibility = View.VISIBLE
        btnStopLive.visibility = View.GONE
        layoutStreamStatsHUD.visibility = View.GONE
        btnOrientation.isEnabled = true
    }

    private fun calculateResolution(): Pair<Int, Int> {
        val (baseW, baseH) = when (spResolution.selectedItemPosition) {
            1 -> Pair(640, 360)
            2 -> Pair(854, 480)
            3 -> Pair(1920, 1080)
            4 -> Pair(2560, 1440)
            else -> Pair(1280, 720)
        }
        return if (isPortrait) Pair(baseH, baseW) else Pair(baseW, baseH)
    }

    private fun calculateFps(): Int {
        return when (spFps.selectedItemPosition) {
            1 -> 24
            2 -> 25
            3 -> 50
            4 -> 60
            else -> 30
        }
    }

    private fun calculateBitrate(width: Int, height: Int, fps: Int): Int {
        val selected = spBitrate.selectedItem?.toString().orEmpty()
        val kbps = when {
            selected.contains("1 Mbps") -> 1000
            selected.contains("2.5 Mbps") -> 2500
            selected.contains("4 Mbps") -> 4000
            selected.contains("6 Mbps") -> 6000
            selected.contains("9 Mbps") -> 9000
            selected.contains("12 Mbps") -> 12000
            else -> {
                val pixels = width * height
                var autoKbps = when {
                    pixels >= 2560 * 1440 -> 9000
                    pixels >= 1920 * 1080 -> 4500
                    pixels >= 1280 * 720 -> 3000
                    pixels >= 854 * 480 -> 1500
                    else -> 1000
                }
                if (fps > 30) autoKbps = (autoKbps * 1.5).toInt()
                autoKbps
            }
        }
        return kbps * 1000
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        if (isLive && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                val aspectRatio = if (isPortrait) android.util.Rational(9, 16) else android.util.Rational(16, 9)
                val params = android.app.PictureInPictureParams.Builder()
                    .setAspectRatio(aspectRatio)
                    .build()
                enterPictureInPictureMode(params)
            } catch (ignored: Exception) {}
        }
    }

    override fun onDestroy() {
        unregisterStatsReceiver()
        closePdf()
        super.onDestroy()
    }
}