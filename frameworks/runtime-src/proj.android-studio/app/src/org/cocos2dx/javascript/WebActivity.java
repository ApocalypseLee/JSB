package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.Window;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;

import com.bjyt.game.vivo.R;


public class WebActivity extends Activity {
    private WebView webView;
    private ImageButton webViewGobackBtn;
    private ImageButton webViewCloseBtn;
    private static WebActivity app = null;
    private String URL = "https://engine.tuicoco.com/index/activity?appKey=4WDkE6cqDnVH2iCYFqGnXB9RTTb7&adslotId=381668&tu_a1=__IMEI__&tu_a2=__IMEI2__&tu_a3=__MUID__&tu_b1=__IDFA__&tu_b2=__IDFA2__&tu_c1=__OAID__";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        app = this;
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.active_webview);
        webViewGobackBtn = findViewById(R.id.gobackWebView);
        webViewCloseBtn = findViewById(R.id.closeWebView);
        webViewGobackBtn.setOnClickListener(goback);
        webViewCloseBtn.setOnClickListener(goback);
        webView = findViewById(R.id.tuia_xuanfu);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAppCacheEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.supportMultipleWindows();
        webSettings.setAllowContentAccess(true);
        webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setSavePassword(true);
        webSettings.setSaveFormData(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setLoadsImagesAutomatically(true);
        webSettings.setBuiltInZoomControls(true);
        Intent intent = getIntent();
        if(intent == null) {
            return;
        }
        String ID = intent.getStringExtra("ID");
        if (!TextUtils.isEmpty(ID)){
            if(ID.equals("1")) {
                URL = "https://engine.tuicoco.com/index/activity?appKey=4WDkE6cqDnVH2iCYFqGnXB9RTTb7&adslotId=381668&tu_a1=__IMEI__&tu_a2=__IMEI2__&tu_a3=__MUID__&tu_b1=__IDFA__&tu_b2=__IDFA2__&tu_c1=__OAID__";
            } else if(ID.equals("2")) {
                URL = "https://engine.tuiaaag.com/index/activity?appKey=2rEKcSZ1F7U72X9omYSV9iGUxr8E&adslotId=381669&tu_a1=__IMEI__&tu_a2=__IMEI2__&tu_a3=__MUID__&tu_b1=__IDFA__&tu_b2=__IDFA2__&tu_c1=__OAID__";
            } else if(ID.equals("3")) {
                URL = "https://i.iwanbei.cn/activities?appKey=589d000a827049b99922720eb54c25c9&appEntrance=2&business=money";
            } else {
                URL = ID;
            }
        } else {
            URL = "https://engine.tuicoco.com/index/activity?appKey=4WDkE6cqDnVH2iCYFqGnXB9RTTb7&adslotId=381668&tu_a1=__IMEI__&tu_a2=__IMEI2__&tu_a3=__MUID__&tu_b1=__IDFA__&tu_b2=__IDFA2__&tu_c1=__OAID__";
        }
        System.out.println(ID + "::互动广告厂商：：" + URL);
        webView.loadUrl(URL);

        webView.setWebViewClient(new WebViewClient(){
            @Override
//            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//                    view.loadUrl(request.getUrl().toString());
//                    return true;
//                }
//                return super.shouldOverrideUrlLoading(view, request);
//            }
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
//                return super.shouldOverrideUrlLoading(view,url);
                webView.setWebChromeClient(new WebChromeClient());
                view.loadUrl(url);
                return true;
            }
        });

        class MyDownLoad implements DownloadListener {
            @Override
            public void onDownloadStart(String url, String userAgent,
                                        String contentDisposition, String mimetype, long contentLength) {
                if (url.endsWith(".apk")) {
                    /**
                     * 通过系统下载apk
                     */
                    Uri uri = Uri.parse(url);
                    Intent intent = new Intent(Intent.ACTION_VIEW,uri);
                    startActivity(intent);
                }
            }
        }
        webView.setDownloadListener(new MyDownLoad());
    }

    private final View.OnClickListener goback = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (v.getId() == R.id.gobackWebView) {
                app.webView.goBack();
            }else if (v.getId() == R.id.closeWebView){
                webView.clearCache(true);
                Intent intent = new Intent(WebActivity.this, AppActivity.class);
                startActivity(intent);
                app.finish();
            }
        }
    };
}
