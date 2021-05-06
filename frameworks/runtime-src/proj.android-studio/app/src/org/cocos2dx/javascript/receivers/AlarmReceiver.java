package org.cocos2dx.javascript.receivers;

import android.app.KeyguardManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import org.cocos2dx.javascript.AlarmActivity;
import org.cocos2dx.javascript.services.FloatWindowService;
import org.cocos2dx.javascript.utils.NotificationUtils;
import org.cocos2dx.javascript.utils.UIUtils;
import org.pinball.games.R;

import static org.cocos2dx.javascript.services.FloatWindowService.FLAG_RES_ID;


/**
 * @author liyihe
 */
public class AlarmReceiver extends BroadcastReceiver {

    private final String TAG = BroadcastReceiver.class.getSimpleName();
    private int timer = 0;
    private final static int PRIORITY = 30;//百分比
    private final static int INTERVAL = 30;//分钟

    @Override
    public void onReceive(final Context context, Intent intent) {
        String action = intent.getAction();
        //拿到锁屏管理者
        KeyguardManager km = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
        String title = context.getString(R.string.app_name);
        if ((Intent.ACTION_SCREEN_OFF.equals(action)/** && km.isKeyguardLocked()**/)) {

            if (UIUtils.getIntegerRandomBound(1, 100) <= PRIORITY) {
                startAlarm(context, action, title);
            }

        } else if (Intent.ACTION_TIME_TICK.equals(action)/* && !km.isKeyguardLocked()*/) {

            if (!UIUtils.isOnForground(context)) {
                timer++;
                if (timer % INTERVAL == 0)
                {
                    startFloatWindow(context);
//                    startAlarm(context, action, title);
                }
            }
        }

    }

    private void startFloatWindow(Context context) {
        Intent fwIntent = new Intent(context.getApplicationContext(), FloatWindowService.class);
//        context.stopService(fwIntent);
        fwIntent.setAction(FloatWindowService.ACTION_FULL_SCREEN_ALARM);
        int resID = UIUtils.getIntegerRandomBound(1, 2);
        fwIntent.putExtra(FLAG_RES_ID, resID);
        context.startService(fwIntent);
    }

    private void startAlarm(Context context, String action, String title) {
        int resID = 0;
        if (action.equals(Intent.ACTION_SCREEN_OFF)) {
            resID = UIUtils.getIntegerRandomBound(1, 3);
        } else if (action.equals(Intent.ACTION_TIME_TICK)) {
            resID = UIUtils.getIntegerRandomBound(1, 2);
        }
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
            startActivity(context, AlarmActivity.class, action, resID);
        } else {
            NotificationUtils notificationUtils = new NotificationUtils(context);
            notificationUtils.clearAllNotification();
            String content = "";
            notificationUtils.sendNotificationFullScreen(AlarmActivity.class, title, content, action, resID);
        }
    }

    private void startActivity(Context context, Class<?> cls, String action, int resID) {
        Log.d(TAG, "onReceive: 收到广播");
        Log.d(TAG, action);
        //启动Activity
        Intent alarmIntent = new Intent(context, cls);
        //携带数据
        alarmIntent.putExtra("flag", action);
        alarmIntent.putExtra(FLAG_RES_ID, resID);
        //activity需要新的任务栈
        alarmIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(alarmIntent);
    }
}