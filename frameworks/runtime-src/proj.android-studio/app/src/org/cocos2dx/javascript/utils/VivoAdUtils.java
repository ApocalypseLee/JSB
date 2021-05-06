package org.cocos2dx.javascript.utils;

import android.app.Activity;

import com.vivo.ad.splash.SplashAdListener;
import com.vivo.mobilead.interstitial.InterstitialAdParams;
import com.vivo.mobilead.interstitial.VivoInterstitialAd;
import com.vivo.mobilead.listener.IAdListener;
import com.vivo.mobilead.splash.SplashAdParams;
import com.vivo.mobilead.splash.VivoSplashAd;
import com.vivo.mobilead.unified.base.AdParams;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAd;
import com.vivo.mobilead.unified.reward.UnifiedVivoRewardVideoAdListener;

import org.cocos2dx.javascript.Constants;

public class VivoAdUtils {

    public static VivoInterstitialAd loadInterstitialAd(Activity activity, IAdListener listener) {
        String posId = VivoSettingSp.getInstance().getStringValue(Constants.ConfigureKey.INTERSTITIAL_POSITION_ID,
                Constants.DefaultConfigValue.INTERSTITIAL_POSITION_ID);
        InterstitialAdParams.Builder builder = new InterstitialAdParams.Builder(posId);

//        String backUrl = "vivobrowser://browser.vivo.com";
//        String btnName = "testabcdteststststststtsst";
//        BackUrlInfo backUrlInfo = new BackUrlInfo(backUrl, btnName);
//        builder.setBackUrlInfo(backUrlInfo);
        return new VivoInterstitialAd(activity, builder.build(), listener);
    }

    public static UnifiedVivoRewardVideoAd loadRewardVideoAd(Activity activity,
                                                             UnifiedVivoRewardVideoAdListener adListener) {
        String posId = VivoSettingSp.getInstance().getStringValue(Constants.ConfigureKey.VIDEO_POSITION_ID,
                Constants.DefaultConfigValue.VIDEO_POSITION_ID);
        AdParams.Builder builder = new AdParams.Builder(posId);

//        String backUrl = "vivobrowser://browser.vivo.com";
//        String btnName = "testabcdteststststststtsst";
//        BackUrlInfo backUrlInfo = new BackUrlInfo(backUrl, btnName);
//        builder.setBackUrlInfo(backUrlInfo);
        return new UnifiedVivoRewardVideoAd(activity, builder.build(), adListener);
    }

    public static VivoSplashAd fetchSplashAd(Activity activity, SplashAdListener listener) {
        String splashId = VivoSettingSp.getInstance().getStringValue(Constants.ConfigureKey.SPLASH_POSITION_ID,
                Constants.DefaultConfigValue.SPLASH_POSITION_ID);
        SplashAdParams.Builder builder = new SplashAdParams.Builder(splashId);
        // 拉取广告的超时时长：即开屏广告从请求到展示所花的最大时长（并不是指广告曝光时长）取值范围[3000, 5000]
        builder.setFetchTimeout(VivoSettingSp.getInstance().getInt(Constants.ConfigureKey.SPLASH_AD_TIME, Constants.DefaultConfigValue.SPLASH_AD_TIME));
        /**
         * 标题最长5个中文字符 描述最长8个中文字符
         */
        builder.setAppTitle(VivoSettingSp.getInstance().getStringValue(Constants.ConfigureKey.APP_TITLE, Constants.DefaultConfigValue.APP_TITLE));
        /**
         * 广告下面半屏的应用标题+应用描述:应用标题和应用描述是必传字段，不传将抛出异常
         */
        builder.setAppDesc(VivoSettingSp.getInstance().getStringValue(Constants.ConfigureKey.APP_DESC, Constants.DefaultConfigValue.APP_DESC));
//            String backUrl = "vivobrowser://browser.vivo.com?i=12";
//            String btnName = "test";
//            builder.setBackUrlInfo(new BackUrlInfo(backUrl, btnName));

        builder.setSplashOrientation(SplashAdParams.ORIENTATION_PORTRAIT);
        return new VivoSplashAd(activity, listener, builder.build());
    }
}
