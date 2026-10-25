import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  Terminal, 
  ExternalLink,
  FolderGit2
} from 'lucide-react';

export const AndroidCompanionView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'main' | 'service' | 'layout' | 'strings_bn' | 'readme'>('main');
  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets: Record<string, { title: string; lang: string; code: string }> = {
    main: {
      title: 'MainActivity.kt (Dailymotion, Restream, Zoom Bar & Local Record)',
      lang: 'kotlin',
      code: `// MobileStudio - MainActivity.kt (Updated with Zoom Bar, Local Record & File Path)
package com.example.mobilestudio

import android.Manifest
import android.content.*
import android.graphics.*
import android.net.Uri
import android.os.*
import android.widget.*
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts

class MainActivity : ComponentActivity() {
    private lateinit var spPlatform: Spinner
    private lateinit var cbLocalRecord: CheckBox
    private lateinit var cbLiveVoiceOver: CheckBox
    private lateinit var layoutZoomBar: LinearLayout
    private lateinit var sbZoom: SeekBar
    private lateinit var tvFileLocation: TextView
    private lateinit var btnRemoveFile: Button
    // ... handles Dailymotion, Restream, Zoom (50%-300%) & simultaneously starts MP4 record in StreamService
}`,
    },
    service: {
      title: 'StreamService.kt (Simultaneous Local MP4 Record Pipeline)',
      lang: 'kotlin',
      code: `// MobileStudio - StreamService.kt (Simultaneous Local MP4 Storage)
// Uses pedroSG94 RootEncoder GenericStream.startRecord() along with startStream()
val enableLocalRecord = intent.getBooleanExtra("extra_enable_local_record", true)
if (enableLocalRecord) {
    val moviesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES)
    val studioDir = java.io.File(moviesDir, "MobileStudio").apply { mkdirs() }
    val recFile = java.io.File(studioDir, "stream_\${System.currentTimeMillis()}.mp4")
    stream.startRecord(recFile.absolutePath)
    localRecordPath = recFile.absolutePath
    isLocalRecordingActive = true
}`,
    },
    layout: {
      title: 'activity_main.xml (UI with Zoom Bar, File Path & Local Record)',
      lang: 'xml',
      code: `<!-- activity_main.xml with Platform Selector, Local Record Toggle & Zoom Slider -->
<LinearLayout android:id="@+id/layoutZoomBar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#161B22"
    android:padding="8dp">
    <TextView android:text="🔍 Zoom:" android:textSize="11sp"/>
    <Button android:id="@+id/btnZoomOut" android:text="-"/>
    <SeekBar android:id="@+id/sbZoom" android:max="300" android:progress="100"/>
    <Button android:id="@+id/btnZoomIn" android:text="+"/>
    <TextView android:id="@+id/tvZoomValue" android:text="100%"/>
</LinearLayout>`,
    },
    strings_bn: {
      title: 'values-bn/strings.xml (বাংলা অনুবাদ)',
      lang: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">মোবাইল স্টুডিও</string>
    <string name="pick_file">ফাইল বাছুন</string>
    <string name="remove_file">ফাইল কেটে দিন</string>
    <string name="platform_dailymotion">ডেইলি মোশন (Dailymotion)</string>
    <string name="platform_restream">রিস্ট্রিম (Restream.io)</string>
    <string name="local_record_title">লোকাল রেকর্ড (MP4)</string>
    <string name="local_record_desc">লাইভ চলাকালীন একই সাথে ফোনে MP4 ভিডিও সেভ রাখুন</string>
    <string name="zoom_label">জুম ইন / আউট:</string>
    <string name="voice_over_label">লাইভ ভয়েস ওভার (মাইক্রোফোন)</string>
</resources>`,
    },
    readme: {
      title: 'README & APK Build Guide',
      lang: 'markdown',
      code: `# Mobile Studio Android APK Guide
1. Push repository with updated MainActivity.kt, StreamService.kt & layout to GitHub.
2. In GitHub Actions, click 'Run workflow' on .github/workflows/build.yml
3. Download MobileStudio-APK artifact (.apk) directly to your phone.
4. Enjoy streaming to Dailymotion, Restream, YouTube, and Twitch with simultaneous local MP4 recording!`,
    },
  };

  const currentSnippet = codeSnippets[selectedFile];

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21262D]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Android Studio Kotlin Project Suite</span>
              <span className="text-[11px] font-mono font-medium text-[#38EF7D] bg-[#38EF7D]/10 px-2 py-0.5 rounded border border-[#38EF7D]/30">
                v1.2 Synchronized
              </span>
            </h2>
            <p className="text-xs text-[#8B949E]">
              Updated native source code with Dailymotion, Restream, Local MP4 recording & Zoom bar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/assets/aistudio/MobileStudio-Android-Project_0018eec5.zip"
            download="MobileStudio-Android-Project.zip"
            className="px-3.5 py-1.5 bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Android Project ZIP</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#21262D] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setSelectedFile('main')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFile === 'main'
              ? 'bg-[#21262D] text-white border border-[#30363D]'
              : 'text-[#8B949E] hover:text-white'
          }`}
        >
          MainActivity.kt
        </button>
        <button
          type="button"
          onClick={() => setSelectedFile('service')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFile === 'service'
              ? 'bg-[#21262D] text-white border border-[#30363D]'
              : 'text-[#8B949E] hover:text-white'
          }`}
        >
          StreamService.kt (Record)
        </button>
        <button
          type="button"
          onClick={() => setSelectedFile('layout')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFile === 'layout'
              ? 'bg-[#21262D] text-white border border-[#30363D]'
              : 'text-[#8B949E] hover:text-white'
          }`}
        >
          activity_main.xml (Zoom Bar)
        </button>
        <button
          type="button"
          onClick={() => setSelectedFile('strings_bn')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFile === 'strings_bn'
              ? 'bg-[#21262D] text-white border border-[#30363D]'
              : 'text-[#8B949E] hover:text-white'
          }`}
        >
          values-bn/strings.xml (বাংলা)
        </button>
        <button
          type="button"
          onClick={() => setSelectedFile('readme')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedFile === 'readme'
              ? 'bg-[#21262D] text-white border border-[#30363D]'
              : 'text-[#8B949E] hover:text-white'
          }`}
        >
          Build & Run Guide
        </button>
      </div>

      {/* Code Viewer */}
      <div className="bg-[#0D1117] border border-[#21262D] rounded-xl overflow-hidden flex flex-col">
        <div className="px-4 py-2 bg-[#161B22] border-b border-[#21262D] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#C9D1D9] font-mono text-[11px]">
            <FileCode className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span>{currentSnippet.title}</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(currentSnippet.code)}
            className="text-[11px] text-[#58A6FF] hover:text-[#79C0FF] flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-[#F0F6FC] overflow-x-auto leading-relaxed max-h-[380px]">
          <code>{currentSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
