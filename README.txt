========================================================================
Mobile Studio - OBS-style Live Streaming Android App (MVP)
Developed by: Al-Amin Islam
Facebook: https://www.facebook.com/alaminislam.nk
Instagram: https://www.instagram.com/alaminislam.nk
========================================================================

Mobile Studio allows Android users to pick local media files (images,
videos, audio tracks, PDF documents, or HTML pages) from their phone's
storage, preview them in an uncluttered view, and stream their screen and
internal audio live to YouTube, Facebook, Twitch, or any custom RTMP server.

1. ARCHITECTURE OVERVIEW
- MainActivity: UI, SAF file picker, layout & orientation, PDF rendering, StreamService start/stop.
- StreamService: Foreground service with MediaProjection and RootEncoder GenericStream.
- Unified Capture: ScreenSource + InternalAudioSource (Android 10+ AudioPlaybackCapture) -> RTMP.

2. TECH STACK
- Kotlin 1.9.24 / AGP 8.5.2 / Gradle 8.7 / JVM target 17 / minSdk 29 / compileSdk 34
- RootEncoder 2.5.5 via JitPack
- Activity Result API, Material Theme with custom studio colors

3. HOW TO GET APK FILE (1-CLICK CLOUD BUILD)
- Push this repo to GitHub on main/master.
- Click 'Actions' > 'Build Mobile Studio APK' > 'Run workflow'.
- Download the generated 'MobileStudio-APK' artifact containing 'app-debug.apk'.
- Transfer to phone & install!

4. LOCAL BUILD WITH ANDROID STUDIO
- Open Android Studio -> File -> Open -> select root folder with settings.gradle.kts.
- Allow Gradle sync to complete, connect Android 10+ phone, click Run.