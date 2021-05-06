package org.cocos2dx.javascript;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

import com.squareup.leakcanary.LeakCanary;
import com.vivo.mobilead.manager.VivoAdManager;
import com.vivo.mobilead.util.VOpenLog;
import com.vivo.unionsdk.open.VivoUnionSDK;

import org.cocos2dx.javascript.utils.VivoSettingSp;


public class MyApplication extends Application {

    private static final String TAG = "App";
    private static MyApplication myApplication;
    private AppActivityLifecycleCallbacks appActivityLifecycleCallbacks;

    public static MyApplication getInstance() {
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        if (Constants.isDebug) {
            LeakCanary.install(this);
        }

        //vivo 广告联盟sdk 初始化
        // 这里完成 SDK 的初始化
        VivoUnionSDK.initSdk(this, Constants.appId_Vivo, false);
        VivoAdManager.getInstance().init(this, Constants.DefaultConfigValue.MEDIA_ID);
        VivoAdManager.getInstance().repairNavigationBar(true);
        //开启日志输出
        VOpenLog.setEnableLog(true);
        // 开启热启动开屏功能，SDK 默认关闭此功能需要手动开启才能生效
        // 广告位 id 可以共用冷启动开屏广告位 id，也可单独为热启动再申请一个新广告位 id
        // 方向参数只能是 SplashAdParams.ORIENTATION_LANDSCAPE 或 SplashAdParams.ORIENTATION_PORTRAIT 之一
        // 热启动开屏可以和冷启动开屏方向不一致，但是强烈建议两者保持一致
        int splashOrientation = VivoSettingSp.getInstance().getInt(Constants.ConfigureKey.HOT_SPLASH,
                Constants.DefaultConfigValue.HOT_SPLASH);
        if (splashOrientation > 0) {
            VivoAdManager.getInstance().enableHotSplash(this,
                    Constants.DefaultConfigValue.SPLASH_POSITION_ID, splashOrientation);
        }
        /**
         * 若想查看接入问题，可开启日志
         */
        VOpenLog.setEnableLog(true);
        /***********************结束初始化******************************/

        appActivityLifecycleCallbacks = new AppActivityLifecycleCallbacks();
        registerActivityLifecycleCallbacks(appActivityLifecycleCallbacks);
    }

    public boolean isForceground() {
        return appActivityLifecycleCallbacks.mIsForceground;
    }

    public boolean isProgressSwitch() {
        return appActivityLifecycleCallbacks.mIsProgressSwitch;
    }

    /**
     * 应用级生命周期回调监听, 通过在onActivityStarted、onActivityStopped中进行统计计数判断应用是否进行了前后台切换
     * <p>
     * 注意: 本监听方案只在单进程场景下有效，不支持多进程场景
     */
    private static class AppActivityLifecycleCallbacks implements ActivityLifecycleCallbacks {
        /**
         * 当前处于前台还是后台
         */
        private boolean mIsForceground = true;
        /**
         * 本次生命周期回调是否由应用从后台切回前台触发
         */
        private boolean mIsProgressSwitch = false;
        /**
         * 计数器
         */
        private int mCounter = 0;


        @Override
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

        }

        @Override
        public void onActivityStarted(Activity activity) {
            /**
             * 过滤掉 冷启动开屏 界面从后台切回前台时的统计,具体参见{@link BaseSplashActivity#needStatistics}
             */
            if (activity instanceof AppActivity && !((AppActivity) activity).needStatistics(true)) {
                return;
            }

            mCounter++;
            if (!mIsForceground && mCounter == 1) {
                mIsForceground = true;
                mIsProgressSwitch = true;
            } else {
                mIsProgressSwitch = false;
            }
        }

        @Override
        public void onActivityResumed(Activity activity) {
        }

        @Override
        public void onActivityPaused(Activity activity) {
        }

        @Override
        public void onActivityStopped(Activity activity) {
            /**
             * 过滤掉 冷启动开屏 界面从后台切回前台时的统计,具体参见{@link BaseSplashActivity#needStatistics}
             */
            if (activity instanceof AppActivity && !((AppActivity) activity).needStatistics(false)) {
                return;
            }

            mCounter--;
            if (mIsForceground && mCounter == 0) {
                mIsForceground = false;
            }
        }

        @Override
        public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

        }

        @Override
        public void onActivityDestroyed(Activity activity) {

        }
    }
}
