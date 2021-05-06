package org.cocos2dx.javascript;

import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;

import com.vivo.ad.model.AdError;
import com.vivo.ad.splash.SplashAdListener;
import com.vivo.mobilead.splash.VivoSplashAd;

import org.cocos2dx.javascript.utils.VivoAdUtils;

public class SplashActivity extends BaseAlarmActivity {

    private static final String TAG = SplashActivity.class.getSimpleName();
    protected VivoSplashAd vivoSplashAd;
    public boolean clicked = false, paused = false;

    private int mStartedCount = 0;
    private final Handler handler = new Handler();

    @Override
    protected void onInit() {
        vivoSplashAd = VivoAdUtils.fetchSplashAd(this, mSplashAdListener);
        vivoSplashAd.loadAd();
    }

    @Override
    protected void onStart() {
        super.onStart();
        mStartedCount++;
    }

    private final SplashAdListener mSplashAdListener = new SplashAdListener() {
        @Override
        public void onADDismissed() {
            Log.d(TAG, "onADDismissed");
            showTip("广告消失");
            next();
        }

        @Override
        public void onNoAD(AdError error) {
            Log.d(TAG, "onNoAD:" + error.getErrorMsg());
            showTip("没有广告：" + error.toString());
            if (vivoSplashAd != null) {
                vivoSplashAd.close();
            }
            toNextActivity();
        }

        @Override
        public void onADPresent() {
            Log.d(TAG, "onADPresent");
            showTip("广告展示成功");
        }

        @Override
        public void onADClicked() {
            Log.d(TAG, "onADClicked");
            showTip("广告被点击");
            clicked = true;

            /**
             * 针对点击不跳转的广告，需要设置一个定时任务执行跳转
             */
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if (!paused) {
                        toNextActivity();
                    }
                }
            }, 200);
        }
    };


    /**
     * 设置一个变量来控制当前开屏页面是否可以跳转，当广告被点击，可能会跳转其他页面，此时开发者还不能打开自己的App主页。当从其他页面返回以后， 才可以跳转到开发者自己的App主页；
     */
    private void next() {
        if (!clicked) {
            toNextActivity();
        }
    }

    private void toNextActivity() {
        Intent intent = new Intent(SplashActivity.this, AppActivity.class);
        startActivity(intent);
//        mSplashContainer.removeAllViews();
        this.finish();
    }

    @Override
    protected void onPause() {
        super.onPause();
        paused = true;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (clicked) {
            toNextActivity();
        }
    }

    @Override
    protected void initNewIntent(Intent intent) {

    }

    /**
     * 开屏页一定要禁止用户对返回按钮的控制，
     * 否则将可能导致用户手动退出了App而广告无法正常曝光和计费
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK || keyCode == KeyEvent.KEYCODE_HOME) {
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    /**
     * 过滤掉 冷启动界面 从后台切回到前台时的计数统计
     *
     * @return
     */
    @Override
    public boolean needStatistics(boolean isOnStartCall) {
        return isOnStartCall ? mStartedCount < 1 : mStartedCount < 2;
    }
}
