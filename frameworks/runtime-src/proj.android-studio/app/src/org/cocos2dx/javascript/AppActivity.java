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
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.v4.app.NotificationManagerCompat;
import android.telephony.TelephonyManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.qq.e.ads.banner2.UnifiedBannerADListener;
import com.qq.e.ads.banner2.UnifiedBannerView;
import com.qq.e.ads.interstitial2.UnifiedInterstitialAD;
import com.qq.e.ads.interstitial2.UnifiedInterstitialADListener;
import com.qq.e.ads.rewardvideo.RewardVideoAD;
import com.qq.e.ads.rewardvideo.RewardVideoADListener;
import com.qq.e.comm.util.AdError;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.commonsdk.statistics.common.DeviceConfig;

import org.cocos2dx.javascript.receivers.AlarmReceiver;
import org.cocos2dx.javascript.services.AudioDaemonService;
import org.cocos2dx.javascript.services.FloatWindowService;
import org.cocos2dx.javascript.services.LocalDaemonService;
import org.cocos2dx.javascript.services.RegisterServService;
import org.cocos2dx.javascript.services.RemoteDaemonService;
import org.cocos2dx.javascript.utils.NotificationUtils;
import org.cocos2dx.javascript.utils.PermissionUtils;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.pinball.games.R;
import org.pinball.games.wxapi.WXAPI;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.cocos2dx.javascript.Constants.isServiceDefend;

public class AppActivity extends Cocos2dxActivity {

    //public static AppActivity app;
    public static IWXAPI api;
    //????????????????????????code
    public static String code;
    public static boolean isVideoReward = false;
    //????????????code
    public static boolean isGetCode = false;
    @SuppressLint("StaticFieldLeak")
    private static AppActivity app = null;
    private String TAG = "cocos";

    private TTAdNative mTTAdNative;
    private TTRewardVideoAd mttRewardVideoAd;
    private TTNativeExpressAd mttInteractionAd;
    private long startTimeInteraction = 0;
    private boolean mHasInteractionloadActive = false;
    private boolean isRendermttInteractionAd = false;

    private TTNativeExpressAd mTTAd;
    private long startTime = 0;
    private boolean mHasShowDownloadActive = false;
    private RelativeLayout mExpressContainer;
    private boolean isRendermTTAd = false;

    private TTNativeExpressAd mTTNativeAd;
    private long startTimeNative = 0;
    private boolean mNativeHasShowDownloadActive = false;
    private RelativeLayout mNativeExpressContainer;
    private boolean isRendermTTNativeAd = false;

    private UnifiedBannerView gdtBanner;
    private RewardVideoAD gdtRewardVideoAD;
    private static boolean videoCached = false;
    private UnifiedInterstitialAD gdtInterstitialAD;


//    private RelativeLayout relcp;// ?????????????????????

    private AlarmReceiver alarmReceiver;//??????????????? ??????

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
                case  6:
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

    @SuppressLint("NewApi")
    private String getPhoneIMEI() {
        try {
            //??????oaid
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
        //???????????????????????????, ??????????????????SDK????????????????????????????????????
        //???????????????App???Application.onCreate????????????????????????????????????????????????
        System.out.println("??????SDK?????????");
        //??????????????? 600bbeaeb3b4f6635de190f8
        UMConfigure.init(this, Constants.sdk_serial, Constants.s1, UMConfigure.DEVICE_TYPE_PHONE, "");
        //??????AUTO???????????????????????????SDK????????????????????????????????????????????????
        //???????????????App???Application.onCreate???????????????????????????
        MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.AUTO);
        /**
         * ??????????????????Log??????
         * ??????: boolean ?????????false???????????????LOG?????????true
         */
//        UMConfigure.setLogEnabled(true);
        String[] str = getTestDeviceInfo(this);
        System.out.println("phoneIMEI is ????????????id??????getDeviceIdForGeneral " + str[0] + " getMac " + str[1]);
        String imei = app.getPhoneIMEI();
        System.out.println("phoneIMEI is----imei-- " + imei);
        // ??????????????????????????????????????????
//        UMConfigure.setProcessEvent(true);
    }

//    private void initOppoPush() {
//        if(HeytapPushManager.isSupportPush()) {
//            HeytapPushManager.init(this, true);
//            HeytapPushManager.register(this, "1a89b3e3476d4659ae2749a26ce6387c", "54f6cd6e853f4dd48cfb2861d4f35e0a", mPushCallback);
//        }
//    }

//    private ICallBackResultService mPushCallback = new ICallBackResultService() {
//        @Override
//        public void onRegister(int code, String s) {
//            if (code == 0) {
//            } else {
////                PushManager.getInstance().getRegister();
//            }
//        }
//
//        @Override
//        public void onUnRegister(int code) {
//            if (code == 0) {
//            } else {
//            }
//        }
//
//        @Override
//        public void onGetPushStatus(final int code, int status) {
//            if (code == 0 && status == 0) {
//            } else {
//            }
//        }
//
//        @Override
//        public void onGetNotificationStatus(final int code, final int status) {
//            if (code == 0 && status == 0) {
//            } else {
//            }
//        }
//
//        @Override
//        public void onSetPushTime(final int code, final String s) {
//        }
//
//    };

    private void initTTadManager() {
        //step1:?????????sdk
        TTAdManager ttAdManager = TTAdManagerHolder.get();
        //step2:(?????????????????????????????????????????????):????????????????????????read_phone_state,??????????????????imei????????????????????????????????????????????????
        TTAdManagerHolder.get().requestPermissionIfNecessary(this);
        //step3:??????TTAdNative??????,??????????????????????????????
        mTTAdNative = ttAdManager.createAdNative(this);
        createView();

        loadVideoAd(Constants.videoID, TTAdConstant.VERTICAL);
        loadBannerAd(Constants.bannerID);
        loadInteractionAd(Constants.interactionID);
        loadNativeBannerAd(Constants.nativeID);
    }

    private void initGDTManager() {
        rewardVideoGDT("9021056919297021");
        TBanner("2071451909581992");
        GDTInterstitialAD("2001564083678574");
    }

    // ????????????????????????
    private void TBanner(String posID) {
        app.gdtBanner = new UnifiedBannerView(app, posID, new UnifiedBannerADListener() {
            @Override
            public void onNoAD(AdError var1) {
                // ??????????????????
                System.out.println("GDTBanner FAIL");
            }

            @Override
            public void onADReceive() {
                // ?????????????????????
                System.out.println("GDTBanner SUCC");
            }

            @Override
            public void onADExposure() {

            }

            @Override
            public void onADClosed() {
                System.out.println("GDTBanner CLOSE");
            }

            @Override
            public void onADClicked() {
                // ???????????????
                System.out.println("GDTBanner CLICK");
            }

            @Override
            public void onADLeftApplication() {

            }

            @Override
            public void onADOpenOverlay() {

            }

            @Override
            public void onADCloseOverlay() {

            }

        });
        app.mExpressContainer.addView(app.gdtBanner);
    }

    static public void showGDTBanner() {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (app.gdtBanner != null) {
                    System.out.println("GDTBanner show");
                    try {
                        app.mExpressContainer.setVisibility(View.VISIBLE);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    app.gdtBanner.loadAD();
                } else {
                    System.out.println("GDTBanner??????????????????..");
                }
            }
        });
    }


    static public void closeGDTBanner() {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    app.mExpressContainer.setVisibility(View.GONE);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        if (app.gdtBanner != null) {
            app.gdtBanner.destroy();
            app.gdtBanner = null;
            app.TBanner("2071451909581992");
        }
    }

    //??????GDT??????
    private void rewardVideoGDT(String posID) {
        gdtRewardVideoAD = null;
        videoCached = false;
        gdtRewardVideoAD = new RewardVideoAD(this, posID, new RewardVideoADListener() {
            @Override
            public void onADLoad() {

            }

            @Override
            public void onVideoCached() {
                videoCached = true;
            }

            @Override
            public void onADShow() {
                videoCached = false;
            }

            @Override
            public void onADExpose() {

            }

            @Override
            public void onReward(Map<String, Object> var1) {
                isVideoReward = true;
            }

            @Override
            public void onADClick() {

            }

            @Override
            public void onVideoComplete() {

            }

            @Override
            public void onADClose() {
                if (isVideoReward) {
                    sendReward(true);
                } else {
                    sendReward(false);
                }
                rewardVideoGDT("9021056919297021");
            }

            @Override
            public void onError(AdError var1) {

            }
        }); // ????????????
        gdtRewardVideoAD.loadAD();
    }

    static public void showGDTVideo() {
        if (videoCached) {//??????????????????1?????????????????????????????????????????????videoCached?????????????????????????????????????????????????????????????????????
            if (!app.gdtRewardVideoAD.hasShown()) {//??????????????????2???????????????????????????????????????
                long delta = 1000;//?????????????????????????????????buffer?????????ms?????????demo??????1000ms???buffer
                //??????????????????3?????????????????????????????????????????????
                if (SystemClock.elapsedRealtime() < (app.gdtRewardVideoAD.getExpireTimestamp() - delta)) {
                    app.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            app.gdtRewardVideoAD.showAD();
                        }
                    });
                } else {
                    Toast.makeText(app, "???????????????????????????????????????????????????????????????????????????", Toast.LENGTH_LONG).show();
                    app.rewardVideoGDT("9021056919297021");
                }
            } else {
                Toast.makeText(app, "???????????????????????????????????????????????????????????????????????????", Toast.LENGTH_LONG).show();
                app.rewardVideoGDT("9021056919297021");
            }
        } else {
            Toast.makeText(app, "?????????????????????????????????????????????", Toast.LENGTH_LONG).show();
        }
    }

    private void GDTInterstitialAD(String posID) {
        gdtInterstitialAD = new UnifiedInterstitialAD(this, posID, new UnifiedInterstitialADListener() {
            @Override
            public void onADReceive() {

            }

            @Override
            public void onVideoCached() {

            }

            @Override
            public void onNoAD(AdError var1) {

            }

            @Override
            public void onADOpened() {

            }

            @Override
            public void onADExposure() {

            }

            @Override
            public void onADClicked() {

            }

            @Override
            public void onADLeftApplication() {

            }

            @Override
            public void onADClosed() {
                if (gdtInterstitialAD != null) {
                    gdtInterstitialAD.destroy();
                    GDTInterstitialAD("2001564083678574");
                }
            }
        });
        gdtInterstitialAD.loadAD();
    }

    static public void showGDTInterstitialAD() {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (app.gdtInterstitialAD != null && app.gdtInterstitialAD.isValid()) {
                    app.gdtInterstitialAD.show();
                } else {
//            Toast.makeText(app, "????????????????????????????????? ??? ", Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        System.out.println("AppActivity onCreate SUCC!!!!");
        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // ???????????????????????????
        if (isServiceDefend) {
            startBackService();
        }
        initTask();


        //??????????????????
        System.out.println("???????????????" + getTestDeviceInfo(this));
        Intent intent = new Intent(AppActivity.this, SplashActivity.class);
        intent.putExtra("splash_rit", Constants.splashID);
        intent.putExtra("is_express", false);
        startActivityForResult(intent, 1);

        //?????????api
        api = WXAPIFactory.createWXAPI(this, Constants.appId);
        //????????????appid???????????????
        api.registerApp(Constants.appId);

        WXAPI.Init(this);
        app = this;

        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
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

        initTTadManager();

        initGDTManager();
    }

    //???oncreate?????????
    public void createView() {
        //?????????view???????????????cocos???view???
//        setContentView(R.layout.activity_native_express);
        //R???????????????????????????R??????????????????????????????view???????????????cocosview??????????????????setContentView(R.layout.activity_native_express);??????view
        View layout = LayoutInflater.from(this).inflate(R.layout.activity_native_express, null);
        mFrameLayout.addView(layout);
        mExpressContainer = layout.findViewById(R.id.express_container);
        mNativeExpressContainer = layout.findViewById(R.id.express_container_native);
//        app.mFrameLayout.addView(app.webViewLayout);
//        mFrameLayout.addView(view, layoutParams);
        //????????????SurfaceView??????surfaceView???????????????,??????addView????????????
//        getGLSurfaceView().setZOrderMediaOverlay(true);
        //cocos???view???????????????
//        getGLSurfaceView().setZOrderOnTop(true);
        getGLSurfaceView().getHolder().setFormat(PixelFormat.TRANSLUCENT);
    }

    static public void addWebView(final String id) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!Constants.s1.equals("TEST")) {
                    if (id.equals("0")) {
                        app.showAd("");
                    } else {
                        Intent intent = new Intent(AppActivity.app, WebActivity.class);
                        intent.putExtra("ID", id);
                        app.startActivity(intent);
                    }
                }
            }
        });
    }

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

    static public void showAd(final String codeId) {


        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (app.mttRewardVideoAd != null) {
                    System.out.print(codeId);
                    //step6:???????????????????????????
                    //???????????????????????????
                    app.mttRewardVideoAd.showRewardVideoAd(app);
                    //?????????????????????????????????????????????
                    app.mttRewardVideoAd = null;
                } else {
                    System.out.println(app.TAG + "??????????????????");
                }
            }
        });
    }

    public void sendReward(final boolean bool) {
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                isVideoReward = false;
                final String js = String.format("window.NativeBridge.rewardedAdCallback(\"%s\");", bool);
                Cocos2dxJavascriptJavaBridge.evalString(js);
                System.out.println(TAG + "rewardVideoAd evalString");
            }
        });
    }

    //??????????????????
    private void loadVideoAd(final String codeId, int orientation) {
        //step4:????????????????????????AdSlot,??????????????????????????????
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(codeId)
                .setExpressViewAcceptedSize(1080, 1920) //??????????????????view???size,??????dp
                .setUserID("user1")//??????id,????????????
                .setOrientation(orientation) //?????????????????????????????????????????????TTAdConstant.HORIZONTAL ??? TTAdConstant.VERTICAL
                .build();

        //step5:????????????
        mTTAdNative.loadRewardVideoAd(adSlot, new TTAdNative.RewardVideoAdListener() {
            @Override
            public void onError(int code, String message) {
                System.out.println(TAG + message);
            }

            //????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            @Override
            public void onRewardVideoCached() {
                System.out.println(TAG + "rewardVideoAd video cached");
//                app.showAd("testDemoVideo");
            }

            //????????????????????????????????????????????????url?????????????????????????????????????????????????????????????????????????????????????????????????????????
            @Override
            public void onRewardVideoAdLoad(TTRewardVideoAd ad) {
                System.out.println(TAG + "rewardVideoAd loaded");
                mttRewardVideoAd = ad;
                mttRewardVideoAd.setRewardAdInteractionListener(new TTRewardVideoAd.RewardAdInteractionListener() {

                    @Override
                    public void onAdShow() {
                        System.out.println(TAG + "rewardVideoAd show");
                    }

                    @Override
                    public void onAdVideoBarClick() {
                        System.out.println(TAG + "rewardVideoAd bar click");
                    }

                    @Override
                    public void onAdClose() {
                        System.out.println(TAG + "rewardVideoAd close");
                        //???????????????????????????
                        if (isVideoReward) {
                            sendReward(true);
                        } else {
                            sendReward(false);
                        }
                        loadVideoAd(codeId, TTAdConstant.VERTICAL);
                    }

                    //????????????????????????
                    @Override
                    public void onVideoComplete() {
                        System.out.println(TAG + "rewardVideoAd complete");
                    }

                    @Override
                    public void onVideoError() {
                        System.out.println(TAG + "rewardVideoAd error");
                    }

                    //?????????????????????????????????????????????rewardVerify??????????????????rewardAmount??????????????????rewardName???????????????
                    @Override
                    public void onRewardVerify(boolean rewardVerify, int rewardAmount, String rewardName, int errorCode, String errorMsg) {
                        System.out.println(TAG + "rewardVideoAd rewardVerify");
                        isVideoReward = true;
                    }

                    @Override
                    public void onSkippedVideo() {
//                        if(isVideoReward) {
//                            sendReward();
//                        }
//                        loadVideoAd(codeId, TTAdConstant.VERTICAL);
                    }
                });
            }
        });
    }

    //?????????????????????
    static public void onClickShowNativeBanner(final String codeId) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                showNativeBanner(codeId);
            }
        });
    }

    public static void showNativeBanner(String codeId) {
        if (app.mTTNativeAd != null) {
            System.out.println(codeId);
            if (app.isRendermTTNativeAd) {
                try {
//                            app.mNativeExpressContainer.setVisibility(View.VISIBLE);
                    app.mTTNativeAd.render();
                } catch (Exception e) {
                    System.out.println("Native????????????");
                    e.printStackTrace();
                }
            }
        } else {
            System.out.println(codeId + "??????????????????..");
        }
    }

    //??????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????
    public static void closeNativeBanner(final String placementId, final String adsSign) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
//                    app.mNativeExpressContainer.setVisibility(View.GONE);
                    app.mNativeExpressContainer.removeAllViews();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (app.mTTNativeAd != null) {
                    app.mTTNativeAd.destroy();
//            app.mTTAd = null;
                    app.loadNativeBannerAd(Constants.nativeID);
                }
                System.out.println("???????????????????????????");
                app.isRendermTTNativeAd = false;
            }
        });
    }

    //???????????????????????????
    private void loadNativeBannerAd(final String codeId) {
        //??????OnUiThread????????????????????????????????????
//        this.runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                //??????
//                mExpressContainer.setVisibility(View.VISIBLE);
//            }
//        });
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(codeId) //?????????id
                .setAdCount(1) //?????????????????????1???3???
//                .setExpressViewAcceptedSize(600, 150) //??????????????????view???size,??????dp
                .setExpressViewAcceptedSize(600, 0) //??????????????????view???size,??????dp
                .build();
        //step5:??????????????????????????????????????????????????????
//        mTTAdNative.loadBannerExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
        mTTAdNative.loadNativeExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
            //??????????????????
            @Override
            public void onError(int code, String message) {
                System.out.println("load error : " + code + ", " + message);
//                mExpressContainer.removeAllViews();
            }

            //??????????????????
            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
                if (ads == null || ads.size() == 0) {
                    return;
                }
                mTTNativeAd = ads.get(0);
//                mTTAd.setSlideIntervalTime(30 * 1000);
                bindNativeAdListener(mTTNativeAd);
                startTimeNative = System.currentTimeMillis();
                System.out.println(TAG + "load success!");
                app.isRendermTTNativeAd = true;
//                mTTNativeAd.render();
//                onClickShowBanner("bannerTest");
            }
        });
    }

    private void bindNativeAdListener(TTNativeExpressAd ad) {
        ad.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
            @Override
            public void onAdClicked(View view, int type) {
                System.out.println(TAG + "???????????????");
            }

            @Override
            public void onAdShow(View view, int type) {
                System.out.println(TAG + "????????????");
            }

            @Override
            public void onRenderFail(View view, String msg, int code) {
                System.out.println("ExpressView" + "render fail:" + (System.currentTimeMillis() - startTimeNative));
                System.out.println(TAG + msg + " code:" + code);
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                System.out.println("ExpressView" + "render suc:" + (System.currentTimeMillis() - startTimeNative));
                //??????view????????? ?????? dp
                System.out.println(TAG + "Native????????????");
                mNativeExpressContainer.removeAllViews();
                //??????????????????
                RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                mNativeExpressContainer.setLayoutParams(params);
                mNativeExpressContainer.addView(view);
//                isRendermTTNativeAd = true;
            }
        });
        //dislike??????
        bindNativeDislike(ad, false);
        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
            return;
        }
        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {
                System.out.println("??????????????????");
            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                if (!mNativeHasShowDownloadActive) {
                    mNativeHasShowDownloadActive = true;
                    System.out.println("????????????????????????");
                }
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                System.out.println("???????????????????????????");
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                System.out.println("?????????????????????????????????");
            }

            @Override
            public void onInstalled(String fileName, String appName) {
                System.out.println("?????????????????????????????????");
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
                System.out.println("????????????");
            }
        });
    }

    /**
     * ??????????????????????????????????????????????????????
     *
     * @param ad
     * @param customStyle ????????????????????????true:???????????????
     */
    private void bindNativeDislike(TTNativeExpressAd ad, boolean customStyle) {
        //????????????????????????????????????dislike????????????
        ad.setDislikeCallback(app, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
                System.out.println(TAG + "?????? " + value);
                //???????????????????????????????????????????????????
                closeNativeBanner("1", "1");
            }

            @Override
            public void onCancel() {
                System.out.println(TAG + "???????????? ");
            }

            @Override
            public void onRefuse() {

            }
        });
    }

    //?????????banner??????
    static public void onClickShowBanner(final String codeId) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (app.mTTAd != null) {
                    System.out.println(codeId);
                    if (app.isRendermTTAd) {
                        try {
//                            app.mExpressContainer.setVisibility(View.VISIBLE);
                            app.mTTAd.render();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
//                    app.mTTAd.render();
                } else {
                    System.out.println(codeId + "??????????????????..");
                }
            }
        });
    }

    //???????????????????????????banner ???????????????????????????????????????????????????????????????????????????????????????
    public static void closeBanner(final String placementId, final String adsSign) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
//                    app.mExpressContainer.setVisibility(View.GONE);
                    app.mExpressContainer.removeAllViews();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (app.mTTAd != null) {
                    app.mTTAd.destroy();
//            app.mTTAd = null;
                    app.loadBannerAd(Constants.bannerID);
                }
                app.isRendermTTAd = false;
                System.out.println("??????Banner??????");
            }
        });
    }

    //???????????????Banner??????
    private void loadBannerAd(final String codeId) {
        //??????OnUiThread????????????????????????????????????
//        this.runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                //??????
//                mExpressContainer.setVisibility(View.VISIBLE);
//            }
//        });
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(codeId) //?????????id
                .setAdCount(1) //?????????????????????1???3???
//                .setExpressViewAcceptedSize(600, 150) //??????????????????view???size,??????dp
                .setExpressViewAcceptedSize(600, 0) //??????????????????view???size,??????dp
                .build();
        //step5:??????????????????????????????????????????????????????
//        mTTAdNative.loadBannerExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
        mTTAdNative.loadNativeExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
            //??????????????????
            @Override
            public void onError(int code, String message) {
                System.out.println("load error : " + code + ", " + message);
                mExpressContainer.removeAllViews();
            }

            //??????????????????
            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
                if (ads == null || ads.size() == 0) {
                    return;
                }
                mTTAd = ads.get(0);
//                mTTAd.setSlideIntervalTime(30 * 1000);
                bindAdListener(mTTAd);
                startTime = System.currentTimeMillis();
                System.out.println(TAG + "load success!");
//                mTTAd.render();
                isRendermTTAd = true;
//                onClickShowBanner("bannerTest");
            }
        });
    }

    private void bindAdListener(TTNativeExpressAd ad) {
        ad.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
            @Override
            public void onAdClicked(View view, int type) {
                System.out.println(TAG + "???????????????");
            }

            @Override
            public void onAdShow(View view, int type) {
                System.out.println(TAG + "????????????");
            }

            @Override
            public void onRenderFail(View view, String msg, int code) {
                System.out.println("ExpressView" + "render fail:" + (System.currentTimeMillis() - startTime));
                System.out.println(TAG + msg + " code:" + code);
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                System.out.println("ExpressView" + "render suc:" + (System.currentTimeMillis() - startTime));
                //??????view????????? ?????? dp
                System.out.println(TAG + "banner????????????");
                mExpressContainer.removeAllViews();
                RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                mExpressContainer.setLayoutParams(params);
                mExpressContainer.addView(view);
//                isRendermTTAd = true;
            }
        });
        //dislike??????
        bindDislike(ad, false);
        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
            return;
        }
        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {
                System.out.println("??????????????????");
            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                if (!mHasShowDownloadActive) {
                    mHasShowDownloadActive = true;
                    System.out.println("????????????????????????");
                }
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                System.out.println("???????????????????????????");
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                System.out.println("?????????????????????????????????");
            }

            @Override
            public void onInstalled(String fileName, String appName) {
                System.out.println("?????????????????????????????????");
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
                System.out.println("????????????");
            }
        });
    }

    /**
     * ??????????????????????????????????????????????????????
     *
     * @param ad
     * @param customStyle ????????????????????????true:???????????????
     */
    private void bindDislike(TTNativeExpressAd ad, boolean customStyle) {
        //????????????????????????????????????dislike????????????
        ad.setDislikeCallback(app, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
                System.out.println(TAG + "?????? " + value);
                //???????????????????????????????????????????????????
                closeBanner("1", "1");
            }

            @Override
            public void onCancel() {
                System.out.println(TAG + "???????????? ");
            }

            @Override
            public void onRefuse() {

            }
        });
    }

    //??????????????????
    private void loadInteractionAd(final String codeId) {
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(codeId) //?????????id
                .setSupportDeepLink(true)
                .setAdCount(1) //?????????????????????1???3???
                .setExpressViewAcceptedSize(300, 300) //??????????????????view???size,??????dp
                .build();

        mTTAdNative.loadInteractionExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
            //??????????????????
            @Override
            public void onError(int code, String message) {

            }

            //??????????????????
            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
                if (ads == null || ads.size() == 0) {
                    return;
                }
                mttInteractionAd = ads.get(0);
                interactionAdListener(mttInteractionAd);
                startTimeInteraction = System.currentTimeMillis();
                app.mttInteractionAd.render();
            }
        });
    }

    private void interactionAdListener(TTNativeExpressAd ad) {
        ad.setExpressInteractionListener(new TTNativeExpressAd.AdInteractionListener() {
            @Override
            public void onAdDismiss() {
                System.out.println("????????????");
                if (app.mttInteractionAd != null) {
                    app.mttInteractionAd.destroy();
                }
                loadInteractionAd(Constants.interactionID);
                isRendermttInteractionAd = false;
            }

            @Override
            public void onAdClicked(View view, int type) {
                System.out.println("???????????????");
            }

            @Override
            public void onAdShow(View view, int type) {
                System.out.println("????????????");
            }

            @Override
            public void onRenderFail(View view, String msg, int code) {
                System.out.println("ExpressView" + "render fail:" + (System.currentTimeMillis() - startTimeInteraction));
                System.out.println(msg + " code:" + code);
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                System.out.println("ExpressView" + "render suc:" + (System.currentTimeMillis() - startTimeInteraction));
                //??????view????????? ?????? dp
                System.out.println("??????????????????");
//                mttInteractionAd.showInteractionExpressAd(app);
                isRendermttInteractionAd = true;
            }
        });
        interactionDislike(ad, false);
        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
            return;
        }
        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {
            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                if (!mHasInteractionloadActive) {
                    mHasInteractionloadActive = true;
                }
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
            }

            @Override
            public void onInstalled(String fileName, String appName) {
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
            }
        });
    }

    private void interactionDislike(TTNativeExpressAd ad, boolean customStyle) {
        //???????????????????????????dislike????????????
        ad.setDislikeCallback(this, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
                //TToast.show(mContext, "????????? " + value);
            }

            @Override
            public void onCancel() {
            }

            @Override
            public void onRefuse() {
            }

        });
    }

    static public void showInteractionAd(final String codeId) {
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (app.mttInteractionAd != null) {
                    System.out.println(codeId);
                    if (app.isRendermttInteractionAd) {
                        app.mttInteractionAd.showInteractionExpressAd(app);
                    }
                } else {
                    System.out.println(codeId + "??????????????????..");
                }
            }
        });
    }

    //???????????????????????????
    public static void onEventObject(String eventId, String map) {
        System.out.println("Enter the wxLogin");
        Map<String, Object> map1 = getStringToMap(map);
        MobclickAgent.onEventObject(app, eventId, map1);     //??????????????????????????????
    }

    /**
     * String???map
     *
     * @param str
     * @return
     */
    public static Map<String, Object> getStringToMap(String str) {
        //?????????????????????????????????
        String[] str1 = str.split(",");
        //??????Map??????
        Map<String, Object> map = new HashMap<>();
        //????????????map??????
        for (int i = 0; i < str1.length; i++) {
            //??????":"?????????????????????
            String[] str2 = str1[i].split(":");
            //str2[0]???KEY,str2[1]??????
            //map.put(str2[0],str2[1]);
            if (str2.length == 2) {
                map.put(str2[0].trim(), str2[1]);
            } else {
                map.put(str2[0].trim(), "");
            }
        }
        return map;
    }

    //???????????????????????????
    public static void deepLinkOk() {
        Constants.isDeepLink = true;
    }

    public static void deepLinkApp(String deeplinkUrl) {
        System.out.println("post ??????app");
        if (Constants.isDeepLink) {
//            deeplinkUrl = "tbopen://m.taobao.com/tbopen/index.html?source=auto&action=ali.open.nav&module=h5&bootImage=0&spm=2014.ugdhh.2200606446343.219881-484425-32896&bc_fl_src=growth_dhh_2200606446343_219881-484425-32896&materialid=219881&h5Url=https%3A%2F%2Fstar-link.taobao.com%3Fslk_actid%3D100000000323%26spm%3D2014.ugdhh.2200606446343.219881-484425-32896%26bc_fl_src%3Dgrowth_dhh_2200606446343_219881-484425-32896";
            Uri uri = Uri.parse(deeplinkUrl);
            Intent intent = new Intent();
            intent.setData(uri);
            app.startActivity(intent);
        }
    }

    //??????????????????
    public static void loginSucc(String packagename) {
        isGetCode = true;
        /*
         * check the app is installed
         */
//        packagename = "com.taobao.taobao";
        PackageInfo packageInfo;
        try {
            packageInfo = app.getPackageManager().getPackageInfo(packagename, 0);
        } catch (PackageManager.NameNotFoundException e) {
            packageInfo = null;
            e.printStackTrace();
        }
        System.out.println("post??????????????????" + packagename);
        if (packageInfo == null) {
            //System.out.println("????????????");
            System.out.println("post?????????" + packagename);
//            Uri uri = Uri.parse("market://details?id=" + packagename);//id?????????
//            Intent it = new Intent(Intent.ACTION_VIEW, uri);
//            app.startActivity(it);
        } else {
            //System.out.println("????????????");
            System.out.println("post?????????" + packagename);
            String[] str = getTestDeviceInfo(app);
            String imei = app.getPhoneIMEI();
            final String jsCallStr = String.format("window.NativeBridge.appDeepLink(\"%s\",\"%s\");", imei, str[0]);
            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);//???????????????js??????
                }
            });
        }
    }

    //??????????????????
    public static void wxLogin() {
        System.out.println("Enter the wxLogin");
        requestCode();      //????????????????????????code
    }

    //??????????????????????????????code
    public static void requestCode() {
        if (!api.isWXAppInstalled()) {
            Toast.makeText(app, "??????????????????????????????", Toast.LENGTH_LONG);
//            System.out.println("??????????????????????????????");
            return;
        }
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "wechat_sdk_demo_test";
        System.out.println("req is " + req);
        //????????????api????????????
        api.sendReq(req);
        System.out.println("??????????????????");
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
                Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);//???????????????js??????
            }
        });

//        try {
//            Thread.sleep(3000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
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
                    System.out.println("????????????");
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
        endAllService();// ?????????????????????
//
//        Intent intent = new Intent(AppActivity.this, HookService.class);
//        startService(intent);

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
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
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

    public static void signIn(String userId){
        Map loginMap = new HashMap();
        loginMap.put("userid", userId);
        MobclickAgent.onEvent(getContext(), "__login", loginMap);
    }

    public static void signUp(String userId){
        Map regMap = new HashMap();
        regMap.put("userid", userId);
        MobclickAgent.onEvent(getContext(), "__register", regMap);
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
// ????????????????????? ????????????
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
        Constants.INSTANCE.isOpenServiceDefend = Constants.INSTANCE.stopServiceDefend;//??????????????????
        stopRemoteService();
        stopBackService();
    }

}
