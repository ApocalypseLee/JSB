package org.cocos2dx.javascript.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.blankj.utilcode.util.AppUtils;
import com.google.common.base.Strings;

import org.cocos2dx.javascript.utils.FloatWindowParamManager;
import org.cocos2dx.javascript.utils.NotificationUtils;
import org.cocos2dx.javascript.utils.PermissionUtils;
import org.cocos2dx.javascript.utils.RomUtils;
import org.cocos2dx.javascript.widget.AlarmFloatWindow;
import org.cocos2dx.javascript.widget.AnimRevealFloatView;
import org.cocos2dx.javascript.widget.FloatPermissionDetectView;
import org.cocos2dx.javascript.widget.FollowTouchView;
import org.cocos2dx.javascript.widget.FullScreenTouchAbleFloatWindow;
import org.cocos2dx.javascript.widget.FullScreenTouchDisableFloatWindow;
import org.cocos2dx.javascript.widget.InputWindow;
import org.cocos2dx.javascript.widget.NotFullScreenTouchDisableFloatWindow;
import com.bjyt.game.vivo.R;

/**
 * @author liyihe
 */
public class FloatWindowService extends Service {

    public static final String TAG =  FloatWindowService.class.getName();

    public static final String NOTIFICATION_CHANNEL_ID = FloatWindowService.class.getSimpleName();
    public static final int MANAGER_NOTIFICATION_ID = 0x1001;
    public static final int HANDLER_DETECT_PERMISSION = 0x2001;

    public static final String ACTION_CHECK_PERMISSION_AND_TRY_ADD = "action_check_permission_and_try_add";
    public static final String ACTION_FULL_SCREEN_TOUCH_ABLE = "action_full_screen_touch_able";
    public static final String ACTION_FULL_SCREEN_TOUCH_DISABLE = "action_full_screen_touch_disable";
    public static final String ACTION_NOT_FULL_SCREEN_TOUCH_ABLE = "action_not_full_screen_touch_able";
    public static final String ACTION_NOT_FULL_SCREEN_TOUCH_DISABLE = "action_not_full_screen_touch_disable";
    public static final String ACTION_INPUT = "action_input";
    public static final String ACTION_ANIM = "action_anim";
    public static final String ACTION_FOLLOW_TOUCH = "action_follow_touch";
    public static final String ACTION_KILL = "action_kill";
    public static final String ACTION_FULL_SCREEN_ALARM = "action_full_screen_alarm";

    public static final String FLAG_RES_ID = "resID";

    private int resId;

    private Handler mHandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message msg) {
            int what = msg.what;
            switch (what) {
                case HANDLER_DETECT_PERMISSION:
                    if (PermissionUtils.checkOPsPermission(getApplicationContext())) {
                        //对沙雕VIVO机型特殊处理,应用处于后台检查悬浮窗权限成功才能确认真的获取了悬浮窗权限
//                        if (RomUtils.isVivoRom() && AppUtils.isAppForeground()) {
//                            Log.e(TAG, "悬浮窗权限检查成功，但App处于前台状态，特殊机型会允许App获取权限，特殊机型就是指Vivo这个沙雕");
//                            mHandler.sendEmptyMessageDelayed(HANDLER_DETECT_PERMISSION, 500);
//                            return;
//                        }

                        mHandler.removeMessages(HANDLER_DETECT_PERMISSION);
                        Log.e(TAG, "悬浮窗权限检查成功");
//                        showFloatPermissionWindow();
                    } else {
                        Log.e(TAG, "悬浮窗权限检查失败");
                        mHandler.sendEmptyMessageDelayed(HANDLER_DETECT_PERMISSION, 500);
                    }
                    break;
            }
        }
    };
    private FloatPermissionDetectView mFloatPermissionDetectView;
    private FullScreenTouchAbleFloatWindow mFullScreenTouchAbleFloatWindow;
    private FullScreenTouchDisableFloatWindow mFullScreenTouchDisableFloatWindow;
    private NotFullScreenTouchDisableFloatWindow mNotFullScreenTouchDisableFloatWindow;
    private InputWindow mInputWindow;
    private AnimRevealFloatView animRevealFloatView;
    private FollowTouchView mFollowTouchView;
    private AlarmFloatWindow alarmFloatWindow;

    public FloatWindowService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        //前台服务通知
        String title = "", content = "";
        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.hint_money2);
        Notification notification = NotificationUtils.getForegroundNotification
                (FloatWindowService.this, NOTIFICATION_CHANNEL_ID, title, content, bitmap);
        startForeground(MANAGER_NOTIFICATION_ID, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = Strings.nullToEmpty(intent.getAction());
        if (intent.hasExtra(FLAG_RES_ID)) {
            resId = intent.getIntExtra(FLAG_RES_ID, 0);
        }
        switch (action) {
            case ACTION_CHECK_PERMISSION_AND_TRY_ADD:
                //对沙雕Vivo做特殊处理
                if (RomUtils.isVivoRom()) {
                    mHandler.sendEmptyMessageDelayed(HANDLER_DETECT_PERMISSION, 1000);
                } else {
                    mHandler.sendEmptyMessage(HANDLER_DETECT_PERMISSION);
                }
                break;
            case ACTION_FULL_SCREEN_TOUCH_ABLE:
                showFullTouchWindow();
                break;
            case ACTION_FULL_SCREEN_TOUCH_DISABLE:
                showFullTouchDisableWindow();
                break;
            case ACTION_NOT_FULL_SCREEN_TOUCH_ABLE:
                showNotFullTouchWindow();
                break;
            case ACTION_NOT_FULL_SCREEN_TOUCH_DISABLE:
                showNotFullTouchDisableWindow();
                break;

            case ACTION_INPUT:
                showInputWindow();
                break;

            case ACTION_ANIM:
                showAnimWindow();
                break;

            case ACTION_FOLLOW_TOUCH:
                showFollowTouch();
                break;
            case ACTION_KILL:
                stopSelf();
                break;

            case ACTION_FULL_SCREEN_ALARM:
                showAlarmFloatWindow();
                break;
        }
        return START_REDELIVER_INTENT;
    }

    private void showFollowTouch() {
        dismissFollowTouch();
        mFollowTouchView = new FollowTouchView(FloatWindowService.this);
        mFollowTouchView.show();
    }

    private void dismissFollowTouch() {
        if (mFollowTouchView != null) {
            mFollowTouchView.remove();
            mFollowTouchView = null;
        }
    }

    private void showAnimWindow() {
        dismissAnimRevealFloatView();
        animRevealFloatView = new AnimRevealFloatView(FloatWindowService.this);
        animRevealFloatView.show();
    }

    @Override
    public void onDestroy() {
        if (mFloatPermissionDetectView != null) {
            mFloatPermissionDetectView.remove();
            mFloatPermissionDetectView = null;
        }

        if (mFullScreenTouchAbleFloatWindow != null) {
            mFullScreenTouchAbleFloatWindow.remove();
            mFullScreenTouchAbleFloatWindow = null;
        }

        if (alarmFloatWindow != null) {
            alarmFloatWindow.remove();
            alarmFloatWindow = null;
        }

        if (mFullScreenTouchDisableFloatWindow != null) {
            mFullScreenTouchDisableFloatWindow.remove();
            mFullScreenTouchDisableFloatWindow = null;
        }

        if (mNotFullScreenTouchDisableFloatWindow != null) {
            mNotFullScreenTouchDisableFloatWindow.remove();
            mNotFullScreenTouchDisableFloatWindow = null;
        }

        if (mInputWindow != null) {
            mInputWindow.remove();
            mInputWindow = null;
        }

        dismissAnimRevealFloatView();

        dismissFollowTouch();

        super.onDestroy();
    }

    private void dismissAnimRevealFloatView() {
        if (animRevealFloatView != null) {
            animRevealFloatView.remove();
            animRevealFloatView = null;
        }
    }

    private synchronized void showFloatPermissionWindow() {
        if (mFloatPermissionDetectView != null) {
            mFloatPermissionDetectView.remove();
            mFloatPermissionDetectView = null;
        }
        mFloatPermissionDetectView = new FloatPermissionDetectView(getApplicationContext());
        mFloatPermissionDetectView.show();
    }

    private void showFullTouchWindow() {
        if (mFullScreenTouchAbleFloatWindow != null) {
            mFullScreenTouchAbleFloatWindow.remove();
            mFullScreenTouchAbleFloatWindow = null;
        }
        mFullScreenTouchAbleFloatWindow = new FullScreenTouchAbleFloatWindow(getApplicationContext());
        mFullScreenTouchAbleFloatWindow.show();
    }


    private void showAlarmFloatWindow() {
        if (alarmFloatWindow != null) {
            alarmFloatWindow.remove();
            alarmFloatWindow = null;
        }
        alarmFloatWindow = new AlarmFloatWindow(getApplicationContext());
        alarmFloatWindow.setBG(resId == 1 ? R.drawable.alarm_iphone : R.drawable.alarm_money);
        alarmFloatWindow.show();
    }

    private void showFullTouchDisableWindow() {
        if (mFullScreenTouchDisableFloatWindow != null) {
            mFullScreenTouchDisableFloatWindow.remove();
            mFullScreenTouchDisableFloatWindow = null;
        }
        mFullScreenTouchDisableFloatWindow = new FullScreenTouchDisableFloatWindow(getApplicationContext());
        mFullScreenTouchDisableFloatWindow.show();
    }

    private void showNotFullTouchWindow() {
        showFloatPermissionWindow();
    }

    private void showNotFullTouchDisableWindow() {
        if (mNotFullScreenTouchDisableFloatWindow != null) {
            mNotFullScreenTouchDisableFloatWindow.remove();
            mNotFullScreenTouchDisableFloatWindow = null;
        }
        mNotFullScreenTouchDisableFloatWindow = new NotFullScreenTouchDisableFloatWindow(getApplicationContext());
        mNotFullScreenTouchDisableFloatWindow.show();
    }

    private void showInputWindow() {
        if (mInputWindow != null) {
            mInputWindow.remove();
            mInputWindow = null;
        }
        mInputWindow = new InputWindow(getApplicationContext());
        mInputWindow.show();
    }
}
