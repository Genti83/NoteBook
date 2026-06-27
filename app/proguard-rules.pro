-keep class al.gen.notebook.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
