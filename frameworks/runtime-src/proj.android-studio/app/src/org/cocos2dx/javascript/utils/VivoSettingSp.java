package org.cocos2dx.javascript.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import org.cocos2dx.javascript.MyApplication;

/**
 * 保存设置或其他配置数据
 *
 * @author 11101035
 */
public final class VivoSettingSp {
    private volatile static VivoSettingSp vivoSettingSp;
    private static final String SHARED_PREFS_FILE_NAME = "com.vivo.mobilead_settings";
    private static final byte[] LOCK = new byte[0];

    private SharedPreferences.Editor mEdit;
    private SharedPreferences mSp;

    private VivoSettingSp(Context ctx) {
        init(ctx, SHARED_PREFS_FILE_NAME);
    }
    
    private void init(Context ctx, String sharedPrefsFileName) {
        mSp = ctx.getSharedPreferences(sharedPrefsFileName, Context.MODE_PRIVATE);
        mEdit = mSp.edit();
    }

    public static VivoSettingSp getInstance() {
        if (vivoSettingSp == null) {
            synchronized (LOCK) {
                if (vivoSettingSp == null) {
                    vivoSettingSp = new VivoSettingSp(MyApplication.getInstance());
                }
            }
        }
        return vivoSettingSp;
    }
    
    public String getStringValue(String key) {
        return mSp.getString(key, "");
    }
    
    public void setStringValue(String key, String value) {
        mEdit.putString(key, value);
        mEdit.commit();
    }
    
    public void setIntValue(String key, int value) {
        mEdit.putInt(key, value);
        mEdit.commit();
    }
    
    public int getIntValue(String key) {
        return mSp.getInt(key, 0);
    }
    
    public String getStringValue(String key, String defaultValue) {
        String positionId = getStringValue(key);
        if (TextUtils.isEmpty(positionId)) {
            positionId = defaultValue;
        }
        return positionId;
    }
    
    public int getInt(String key, int defaultValue) {
        int result = getIntValue(key);
        if (result == 0) {
            result = defaultValue;
        }
        return result;
    }
}
