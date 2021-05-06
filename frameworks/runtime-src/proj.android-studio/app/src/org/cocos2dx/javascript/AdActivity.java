package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;

import com.bjyt.game.vivo.R;
import com.vivo.mobilead.interstitial.VivoInterstitialAd;
import com.vivo.mobilead.listener.IAdListener;
import com.vivo.mobilead.unified.base.VivoAdError;
import com.vivo.mobilead.unified.base.callback.MediaListener;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAd;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAdListener;

import org.cocos2dx.javascript.utils.VivoAdUtils;

/**
 * @author liyihe
 */
public class AdActivity extends BaseAlarmActivity {
    private VivoInterstitialAd vivoInterstitialAd;
    private UnifiedVivoRewardVideoAd vivoRewardVideoAd;

    private final IAdListener interstitialADListener = new IAdListener() {
        @Override
        public void onAdShow() {

        }

        @Override
        public void onAdFailed(com.vivo.mobilead.model.VivoAdError vivoAdError) {
            AdActivity.this.finish();
        }

        @Override
        public void onAdReady() {
            showInterstitial();
        }

        @Override
        public void onAdClick() {

        }

        @Override
        public void onAdClosed() {
            finish();
        }
    };

    private final UnifiedVivoRewardVideoAdListener rewardVideoAdListener = new UnifiedVivoRewardVideoAdListener() {
        @Override
        public void onAdReady() {
            showVideo();
        }

        @Override
        public void onAdFailed(VivoAdError vivoAdError) {
            finish();
        }

        @Override
        public void onAdClick() {

        }

        @Override
        public void onAdShow() {

        }

        @Override
        public void onAdClose() {
            finish();
        }
    };

    private final MediaListener mediaListener = new MediaListener() {
        @Override
        public void onVideoStart() {

        }

        @Override
        public void onVideoPause() {

        }

        @Override
        public void onVideoPlay() {

        }

        @Override
        public void onVideoError(VivoAdError vivoAdError) {
            finish();
        }

        @Override
        public void onVideoCompletion() {
            finish();
        }
    };

    @Override
    protected void onInit() {
        setContentView(R.layout.ad);
        flag = getIntent().getStringExtra("flag");
        resId = getIntent().getIntExtra("resId", 0);
        initRes();
    }

    private void initRes() {
        switch (resId) {
            case 1:
                vivoInterstitialAd = VivoAdUtils.loadInterstitialAd(this, interstitialADListener);
                vivoInterstitialAd.load();
                break;
            case 2:
                vivoRewardVideoAd = VivoAdUtils.loadRewardVideoAd(this, rewardVideoAdListener);
                vivoRewardVideoAd.setMediaListener(mediaListener);
                vivoRewardVideoAd.loadAd();
                break;
        }
    }


    @SuppressLint("WakelockTimeout")
    @Override
    protected void initNewIntent(Intent intent) {
        flag = intent.getStringExtra("flag");
        resId = intent.getIntExtra("resId", 0);
        PowerManager pm = (PowerManager) this.getSystemService(Context.POWER_SERVICE);
        if (!pm.isScreenOn() && flag.equals(Intent.ACTION_TIME_TICK)) {
            //点亮屏幕
            @SuppressLint
                    ("InvalidWakeLockTag") PowerManager.WakeLock wl =
                    pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP
                            | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "bright");
            wl.acquire();
            wl.release();
        }
    }

    private void showVideo() {
        if (vivoRewardVideoAd != null) {
            vivoRewardVideoAd.showAd(this);
        }
    }

    private void showInterstitial() {
        if (vivoInterstitialAd != null) {
            vivoInterstitialAd.showAd();
        }
    }
}
