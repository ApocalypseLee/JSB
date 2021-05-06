package org.cocos2dx.javascript.services;

import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import org.cocos2dx.javascript.receivers.AlarmReceiver;

import static android.content.ContentValues.TAG;

/**
 * @author liyihe
 */
public class RegisterServService extends Service {
    private Handler mHandler = new Handler();

    public RegisterServService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate: ");
        registerAlarm();
    }

    protected void registerAlarm() {
        AlarmReceiver alarmReceiver = new AlarmReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_OFF);//熄屏
        filter.addAction(Intent.ACTION_TIME_TICK);//系统时间过去一分钟
        registerReceiver(alarmReceiver, filter);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}