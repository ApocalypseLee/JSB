package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.PowerManager;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bjyt.game.vivo.R;

import org.cocos2dx.javascript.utils.UIUtils;

import static android.content.ContentValues.TAG;

/**
 * @author liyihe
 */
public abstract class BaseAlarmActivity extends Activity {
    String flag;
    int resId;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final Window win = getWindow();
        win.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);

        onInit();
    }

    protected abstract void onInit();

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    /**
     * 这个方法是当这个activity没有销毁的时候，人为的按下锁屏键，然后再启动这个Activity的时候会去调用
     *
     * @param intent
     */
    @Override
    protected void onNewIntent(Intent intent) {
        Log.i(TAG, "onNewIntent: 调用");
        initNewIntent(intent);
    }

    protected abstract void initNewIntent(Intent intent);

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        return super.onTouchEvent(event);
    }

    protected TextView getTextRes(int id) {
        if (id > 0) {
            return findViewById(id);
        }
        return null;
    }

    protected ImageView getImageRes(int id) {
        if (id > 0) {
            return findViewById(id);
        }
        return null;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }


    /**
     * @param msg
     */
    protected void showTip(String msg) {
        if (Constants.isDebug)
            Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }

    /**
     * 当前Activity是否需要对本次 onActivityStarted、onActivityStopped 生命周期进行监听统计
     *
     * @return 默认都需要统计
     */
    public boolean needStatistics(boolean isOnStartCall) {
        return true;
    }
}
