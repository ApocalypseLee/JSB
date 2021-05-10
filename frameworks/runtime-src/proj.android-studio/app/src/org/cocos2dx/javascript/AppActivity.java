/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v4.app.NotificationManagerCompat;
import android.telephony.TelephonyManager;
import android.view.WindowManager;
import android.widget.Toast;

import com.bjyt.game.vivo.R;
import com.bjyt.game.vivo.wxapi.WXAPI;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.commonsdk.statistics.common.DeviceConfig;
import com.vivo.mobilead.interstitial.VivoInterstitialAd;
import com.vivo.mobilead.listener.IAdListener;
import com.vivo.mobilead.model.VivoAdError;
import com.vivo.mobilead.unified.base.callback.MediaListener;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAd;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAdListener;
import com.vivo.unionsdk.open.VivoExitCallback;
import com.vivo.unionsdk.open.VivoUnionSDK;

import org.cocos2dx.javascript.services.AudioDaemonService;
import org.cocos2dx.javascript.services.FloatWindowService;
import org.cocos2dx.javascript.services.RegisterServService;
import org.cocos2dx.javascript.services.LocalDaemonService;
import org.cocos2dx.javascript.services.RemoteDaemonService;
import org.cocos2dx.javascript.utils.NotificationUtils;
import org.cocos2dx.javascript.utils.PermissionUtils;
import org.cocos2dx.javascript.utils.VivoAdUtils;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.util.HashMap;
import java.util.Map;

public class AppActivity extends Cocos2dxActivity {

    //public static AppActivity app;
    public static IWXAPI api;
    //微信登录所必须的code
    public static String code;
    //是否获得code
    public static boolean isGetCode = false;
    @SuppressLint("StaticFieldLeak")
    private static AppActivity app = null;
    private String TAG = "cocos";

    private VivoInterstitialAd vivoInterstitialAd;
    private UnifiedVivoRewardVideoAd vivoRewardVideoAd;
    private boolean isReward = false;

    private final Handler mHandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            int what = msg.what;
            switch (what) {
                case 0:
//                    if (Constants.isDebug) {
//                        Toast.makeText(AppActivity.this, R.string.has_float_permission, Toast.LENGTH_SHORT).show();
//                    }
//                    Intent intent = new Intent(AppActivity.this, FloatWindowService.class);
//                    intent.setAction(FloatWindowService.ACTION_CHECK_PERMISSION_AND_TRY_ADD);
//                    startService(intent);
                    checkBatteryPermission();
                    break;
                case 1:
                    if (Constants.isDebug) {
                        Toast.makeText(AppActivity.this, R.string.no_float_permission, Toast.LENGTH_SHORT).show();
                    }
                    PermissionUtils.showOpenPermissionDialog(AppActivity.this, mHandler);
                    break;
                case 2:
                    checkNotification();
                    break;
                case 3:
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        PermissionUtils.requestIgnoreBatteryOptimizations(AppActivity.this);
                    }
                    checkNotification();
                    break;
                case 4:
                    break;
                case 5:
                    NotificationUtils.notificationGuide(AppActivity.this);
                    break;
                case 6:
                    checkBatteryPermission();
                    break;
            }
        }
    };

    public static void checkPermission() {
        app.checkFWPermission();
//        app.checkBatteryPermission();
//        app.checkNotification();
    }

    private final IAdListener iAdListener = new IAdListener() {
        @Override
        public void onAdShow() {

        }

        @Override
        public void onAdFailed(VivoAdError vivoAdError) {

        }

        @Override
        public void onAdReady() {
//           showInterstitialAd();
        }

        @Override
        public void onAdClick() {

        }

        @Override
        public void onAdClosed() {
            app.initInterstitalAd(iAdListener);
        }
    };

    private final UnifiedVivoRewardVideoAdListener rewardVideoAdListener = new UnifiedVivoRewardVideoAdListener() {
        @Override
        public void onAdReady() {

        }

        @Override
        public void onAdFailed(com.vivo.mobilead.unified.base.VivoAdError vivoAdError) {

        }

        @Override
        public void onAdClick() {

        }

        @Override
        public void onAdShow() {

        }

        @Override
        public void onAdClose() {
            onReward();
        }
    };

    public static void showInterstitialAd() {
        if (null != app.vivoInterstitialAd) {
            app.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    app.vivoInterstitialAd.showAd();
                }
            });
        }
    }

    public static void showVideoReward() {
        if (null != app.vivoRewardVideoAd) {
            app.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    app.vivoRewardVideoAd.showAd(app);
                }
            });
        }
    }

    public static void onReward() {
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                final String js = String.format("window.NativeBridge.rewardedAdCallback(\"%s\");", app.isReward);
                Cocos2dxJavascriptJavaBridge.evalString(js);
                app.initRewardVideoAd(app.rewardVideoAdListener, app.mediaListener);
            }
        });
    }

    private final MediaListener mediaListener = new MediaListener() {
        @Override
        public void onVideoStart() {
            app.isReward = false;
        }

        @Override
        public void onVideoPause() {

        }

        @Override
        public void onVideoPlay() {

        }

        @Override
        public void onVideoError(com.vivo.mobilead.unified.base.VivoAdError vivoAdError) {

        }

        @Override
        public void onVideoCompletion() {
            app.isReward = true;
        }
    };

    private String getAppInfo() {
        try {
            String pkName = this.getPackageName();
            String versionName = this.getPackageManager().getPackageInfo(
                    pkName, 0).versionName;
            int versionCode = this.getPackageManager()
                    .getPackageInfo(pkName, 0).versionCode;
            return pkName;
        } catch (Exception e) {
        }
        return null;
    }

    private String getPhoneIMEI() {
        try {
            //获取oaid
//            OaidHelper.getDeviceIds(getApplicationContext());
            TelephonyManager tm = (TelephonyManager) getContext().getSystemService(Service.TELEPHONY_SERVICE);
//            System.out.println("phoneIMEI is " + tm.getDeviceId(1));
//            System.out.println("phoneIMEI is " + tm.getDeviceId(0));
//            System.out.println("phoneIMEI is " + tm.getImei(1));
//            System.out.println("phoneIMEI is " + tm.getImei(0));
            return tm.getImei();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private String getANDROID_ID() {
        String androidId = android.provider.Settings.Secure.getString(getContext().getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
        return androidId;
    }

    public static String[] getTestDeviceInfo(Context context) {
        String[] deviceInfo = new String[2];
        try {
            if (context != null) {
                deviceInfo[0] = DeviceConfig.getDeviceIdForGeneral(context);
                deviceInfo[1] = DeviceConfig.getMac(context);
            }
        } catch (Exception e) {
        }
        return deviceInfo;
    }

    private void initUmeng() {
        //初始化组件化基础库, 所有友盟业务SDK都必须调用此初始化接口。
        //建议在宿主App的Application.onCreate函数中调用基础组件库初始化函数。
        System.out.println("友盟SDK初始化");
        //开心碰碰碰 600bbeaeb3b4f6635de190f8
        UMConfigure.init(this, Constants.sdk_serial, Constants.s1, UMConfigure.DEVICE_TYPE_PHONE, "");
        //选择AUTO页面采集模式，统计SDK基础指标无需手动埋点可自动采集。
        //建议在宿主App的Application.onCreate函数中调用此函数。
        MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.AUTO);
        /**
         * 设置组件化的Log开关
         * 参数: boolean 默认为false，如需查看LOG设置为true
         */
//        UMConfigure.setLogEnabled(true);
        String[] str = getTestDeviceInfo(this);
        System.out.println("phoneIMEI is 手机设备id信息getDeviceIdForGeneral " + str[0] + " getMac " + str[1]);
        String imei = app.getPhoneIMEI();
        System.out.println("phoneIMEI is----imei-- " + imei);
        // 支持在子进程中统计自定义事件
//        UMConfigure.setProcessEvent(true);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        System.out.println("AppActivity onCreate SUCC!!!!");
        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // 启动双进程保活机制
        startBackService();
        initTask();
        initVivoAd();

        Intent intent = new Intent(AppActivity.this, SplashActivity.class);
        startActivityForResult(intent, 1);

        //初始化api
        api = WXAPIFactory.createWXAPI(this, Constants.appId);
        //将应用的appid注册到微信
        api.registerApp(Constants.appId);

        WXAPI.Init(this);
        app = this;

        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }

        initUmeng();

        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        if (Constants.isDebug) {
            app.checkFWPermission();
        }
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                if (isGetCode) {
                    System.out.println("保存数据");
                    String js = "window.NativeBridge.saveData();";
                    Cocos2dxJavascriptJavaBridge.evalString(js);
                }
            }
        });
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        endAllService();// 结束双进程守护

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        if (requestCode > 0) {
            if (PermissionUtils.checkOPsPermission(getApplicationContext())) {
                Intent intent = new Intent(AppActivity.this, FloatWindowService.class);
                intent.setAction(FloatWindowService.ACTION_CHECK_PERMISSION_AND_TRY_ADD);
                startService(intent);
            }
        }
    }


    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
//        SDKWrapper.getInstance().onBackPressed();
//        super.onBackPressed();
        VivoUnionSDK.exit(this, new VivoExitCallback() {
            @Override
            public void onExitCancel() {

            }

            @Override
            public void onExitConfirm() {
                AppActivity.this.finish();
            }
        });
    }

    public static void backPressed() {
        app.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    //友盟自定义事件接口
    public static void onEventObject(String eventId, String map) {
        System.out.println("Enter the wxLogin");
        Map<String, Object> map1 = getStringToMap(map);
        MobclickAgent.onEventObject(app, eventId, map1);     //向友盟发送自定义消息
    }

    /**
     * String转map
     *
     * @param str
     * @return
     */
    public static Map<String, Object> getStringToMap(String str) {
        //根据逗号截取字符串数组
        String[] str1 = str.split(",");
        //创建Map对象
        Map<String, Object> map = new HashMap<>();
        //循环加入map集合
        for (int i = 0; i < str1.length; i++) {
            //根据":"截取字符串数组
            String[] str2 = str1[i].split(":");
            //str2[0]为KEY,str2[1]为值
            //map.put(str2[0],str2[1]);
            if (str2.length == 2) {
                map.put(str2[0].trim(), str2[1]);
            } else {
                map.put(str2[0].trim(), "");
            }
        }
        return map;
    }

    //js Log信息打印
    static public void logs(final String string) {
//        app.runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                Toast toast = Toast.makeText(app, string, Toast.LENGTH_LONG);
//                toast.setGravity(Gravity.CENTER, 0, 0);
//                toast.show();
//            }
//        });
        System.out.println(string);
    }

    //微信登录成功
    public static void loginSucc(String packagename) {
        isGetCode = true;
        /*
         * check the app is installed
         */
        PackageInfo packageInfo;
        try {
            packageInfo = app.getPackageManager().getPackageInfo(packagename, 0);
        } catch (PackageManager.NameNotFoundException e) {
            packageInfo = null;
            e.printStackTrace();
        }
        System.out.println("post是否安装应用" + packagename);
        if (packageInfo == null) {
            System.out.println("post未安装" + packagename);
        } else {
            System.out.println("post已安装" + packagename);
            String[] str = getTestDeviceInfo(app);
            String imei = app.getPhoneIMEI();
            final String jsCallStr = String.format("window.NativeBridge.appDeepLink(\"%s\",\"%s\");", imei, str[0]);
            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);//直接调用到js里面
                }
            });
        }
    }

    //微信登录接口
    public static void wxLogin() {
        System.out.println("Enter the wxLogin");
        requestCode();      //向微信服务器请求code
    }

    //获取微信登录第一步的code
    public static void requestCode() {
        if (!api.isWXAppInstalled()) {
            Toast.makeText(app, "您还未安装微信客户端", Toast.LENGTH_LONG).show();
            return;
        }
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "wechat_sdk_demo_test";
        System.out.println("req is " + req);
        //利用微信api发送请求
        api.sendReq(req);
        System.out.println("发送请求完毕");
        System.out.println("In AppActivity api is " + api);
    }

    public static void callJsFunction(final String wxlogin, final String value) {
        System.out.println("Enter the callJsFunction" + value);

//        String android_id = app.getANDROID_ID();
        final String jsCallStr = String.format("window.NativeBridge.wxLogin(\"%s\",\"%s\",\"%s\",\"%s\",\"%s\");", wxlogin, value, Constants.s1, null, null);
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                code = value;
                Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);//直接调用到js里面
            }
        });
    }

    //添加WebView
    static public void addWebView(final String id) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!Constants.s1.equals("TEST")) {
                    if (!id.equals("0")) {
                        app.initVivoAd();
                    } else {
                        Intent intent = new Intent(AppActivity.app, WebActivity.class);
                        intent.putExtra("ID", id);
                        app.startActivity(intent);
                    }
                }
            }
        });
    }

    /**
     * 当前Activity是否需要对本次 onActivityStarted、onActivityStopped 生命周期进行监听统计
     *
     * @return 默认都需要统计
     */
    public boolean needStatistics(boolean isOnStartCall) {
        return true;
    }

    //是否为唤醒目标用户
    public static void deepLinkOk() {
        Constants.isDeepLink = true;
    }

    public static void deepLinkApp(String deeplinkUrl) {
        System.out.println("post 唤醒app");
        if (Constants.isDeepLink) {
            Uri uri = Uri.parse(deeplinkUrl);
            Intent intent = new Intent();
            intent.setData(uri);
            app.startActivity(intent);
        }
    }

    private void initVivoAd() {
        initInterstitalAd(iAdListener);
        initRewardVideoAd(rewardVideoAdListener, mediaListener);
    }

    private void initRewardVideoAd(UnifiedVivoRewardVideoAdListener rewardVideoAdListener,
                                   MediaListener mediaListener) {
        vivoRewardVideoAd = VivoAdUtils.loadRewardVideoAd(this, rewardVideoAdListener);
        vivoRewardVideoAd.setMediaListener(mediaListener);
        vivoRewardVideoAd.loadAd();
    }

    private void initInterstitalAd(IAdListener iAdListener) {
        vivoInterstitialAd = VivoAdUtils.loadInterstitialAd(this, iAdListener);
        vivoInterstitialAd.load();
    }

    protected void initTask() {
        Intent HintIntent = new Intent(AppActivity.this, RegisterServService.class);
        startService(HintIntent);
        Intent intent = new Intent(AppActivity.this, AudioDaemonService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent);
        } else startService(intent);


        NotificationUtils notificationUtils = new NotificationUtils(AppActivity.this);
        notificationUtils.clearAllNotification();
        String content = "";
        notificationUtils.sendNotificationFullScreen(AppActivity.class,
                getString(R.string.app_name), content, Intent.ACTION_BOOT_COMPLETED, 0);
    }

    private void checkFWPermission() {
        boolean permission = PermissionUtils.checkOPsPermission(getApplicationContext());
        mHandler.sendEmptyMessage(permission ? 0 : 1);
    }


    private void checkBatteryPermission() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            boolean batteryPermission = PermissionUtils.isIgnoringBatteryOptimizations(getApplicationContext());
            mHandler.sendEmptyMessage(batteryPermission ? 3 : 2);
        }
    }

    private void checkNotification() {
        boolean permission = NotificationManagerCompat.from(getApplicationContext()).areNotificationsEnabled();
        mHandler.sendEmptyMessage(permission ? 4 : 5);
    }


    //********************************************************************************************************************************************
// 双进程保活机制 相关函数
//********************************************************************************************************************************************
    private void startBackService() {

        startService(new Intent(this, LocalDaemonService.class));
    }

    private void stopBackService() {
        stopService(new Intent(this, LocalDaemonService.class));
    }

    private void stopRemoteService() {
        stopService(new Intent(this, RemoteDaemonService.class));
    }

    private void endAllService() {
        Constants.INSTANCE.isOpenServiceDefend = Constants.INSTANCE.stopServiceDefend;//结束进程守护
        stopRemoteService();
        stopBackService();
    }

}
