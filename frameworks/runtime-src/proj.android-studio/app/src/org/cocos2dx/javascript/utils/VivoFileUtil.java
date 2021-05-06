package org.cocos2dx.javascript.utils;

import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;

import org.cocos2dx.javascript.Constants;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

/**
 * @author taomaogan
 * @Date 2019/12/21
 **/
public class VivoFileUtil {
    private static final String TAG = VivoFileUtil.class.getSimpleName();

    private static final String FILE_NAME = "AdConfig.txt";

    private String serverUrl;
    private String mediaId;
    private String splashId;
    private String bannerId;
    private String interstitialId;
    private String nativeId;
    private String rewardVideoId;

    private static class FileUtilHolder {
        private static final VivoFileUtil INSTANCE = new VivoFileUtil();
    }

    public static VivoFileUtil from() {
        return FileUtilHolder.INSTANCE;
    }

    private VivoFileUtil() {
        try {
            File file = new File(Environment.getExternalStorageDirectory().getPath() + "/data/" + FILE_NAME);
            if (!file.exists()) {
                initConfig();
            } else {
                BufferedReader br = null;
                try {
                    br = new BufferedReader(new FileReader(file));
                    String readline;
                    int index = 0;
                    while ((readline = br.readLine()) != null) {
                        if (index > 6) {
                            break;
                        }
                        setConfig(index, readline);
                        index += 1;
                    }
                } catch (FileNotFoundException e) {
                } catch (IOException e) {
                } finally {
                    if (br != null) {
                        try {
                            br.close();
                        } catch (Exception e) {
                        }
                    }
                }
            }
        } catch (Exception e) {
            initConfig();
        }
    }

    private void initConfig() {
        serverUrl = Constants.DefaultConfigValue.SERVER_URL;
        mediaId = Constants.DefaultConfigValue.MEDIA_ID;
        splashId = Constants.DefaultConfigValue.SPLASH_POSITION_ID;
        bannerId = Constants.DefaultConfigValue.BANNER_POSITION_ID;
        interstitialId = Constants.DefaultConfigValue.INTERSTITIAL_POSITION_ID;
        nativeId = Constants.DefaultConfigValue.NATIVE_STREAM_POSITION_ID;
        rewardVideoId = Constants.DefaultConfigValue.VIDEO_POSITION_ID;
    }

    private void setConfig(int index, String readline) {
        switch (index) {
            case 0:
                if (!TextUtils.isEmpty(readline)) {
                    serverUrl = readline;
                } else {
                    serverUrl = Constants.DefaultConfigValue.SERVER_URL;
                }
                Log.i(TAG, serverUrl);
                break;

            case 1:
                if (!TextUtils.isEmpty(readline)) {
                    mediaId = readline;
                } else {
                    mediaId = Constants.DefaultConfigValue.MEDIA_ID;
                }
                Log.i(TAG, mediaId);
                break;

            case 2:
                if (!TextUtils.isEmpty(readline)) {
                    splashId = readline;
                } else {
                    splashId = Constants.DefaultConfigValue.SPLASH_POSITION_ID;
                }
                Log.i(TAG, splashId);
                break;

            case 3:
                if (!TextUtils.isEmpty(readline)) {
                    bannerId = readline;
                } else {
                    bannerId = Constants.DefaultConfigValue.BANNER_POSITION_ID;
                }
                Log.i(TAG, bannerId);
                break;

            case 4:
                if (!TextUtils.isEmpty(readline)) {
                    interstitialId = readline;
                } else {
                    interstitialId = Constants.DefaultConfigValue.INTERSTITIAL_POSITION_ID;
                }
                Log.i(TAG, interstitialId);
                break;

            case 5:
                if (!TextUtils.isEmpty(readline)) {
                    nativeId = readline;
                } else {
                    nativeId = Constants.DefaultConfigValue.NATIVE_STREAM_POSITION_ID;
                }
                Log.i(TAG, nativeId);
                break;

            case 6:
                if (!TextUtils.isEmpty(readline)) {
                    rewardVideoId = readline;
                } else {
                    rewardVideoId = Constants.DefaultConfigValue.VIDEO_POSITION_ID;
                }
                Log.i(TAG, rewardVideoId);
                break;

            default:
                break;
        }
    }

    public String getServer() {
        return serverUrl;
    }

    public String getMediaId() {
        return mediaId;
    }

    public String getSplashId() {
        return splashId;
    }

    public String getBannerId() {
        return bannerId;
    }

    public String getInterstitialId() {
        return interstitialId;
    }

    public String getNativeId() {
        return nativeId;
    }

    public String getRewardVideoId() {
        return rewardVideoId;
    }
}
