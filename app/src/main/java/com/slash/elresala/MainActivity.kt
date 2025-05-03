package com.slash.elresala

import android.Manifest
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val PERMISSIONS_REQUEST_CODE = 100

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // تفعيل وضع الشاشة الكاملة
        hideSystemUI()

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        // Check for permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            checkPermissions()
        } else {
            loadWebPage()
        }
    }

    private fun checkPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.INTERNET), PERMISSIONS_REQUEST_CODE)
        } else {
            loadWebPage()
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSIONS_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                loadWebPage()
            } else {
                Toast.makeText(this, "Permission denied, app won't work properly", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadWebPage() {
        val connectivityManager = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val networkInfo = connectivityManager.activeNetworkInfo

        if (networkInfo != null && networkInfo.isConnected) {
            // إعدادات WebView الأساسية
            val webSettings: WebSettings = webView.settings
            webSettings.javaScriptEnabled = true // تأكد من تمكين JavaScript
            webSettings.domStorageEnabled = true // تمكين التخزين المحلي
            webSettings.databaseEnabled = true // تمكين قاعدة البيانات
            webSettings.cacheMode = WebSettings.LOAD_DEFAULT

            // تحميل صفحة HTML من الأصول
            webView.loadUrl("file:///android_asset/index.html")
        } else {
            Toast.makeText(this, "No internet connection", Toast.LENGTH_LONG).show()
        }
    }

    // إخفاء أشرطة النظام (شريط التنقل وشريط الحالة)
    private fun hideSystemUI() {
        val decorView = window.decorView
        decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN)
    }

    // إعادة إظهار أشرطة النظام عند الحاجة (في حال أردت)
    private fun showSystemUI() {
        val decorView = window.decorView
        decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN)
    }

}
