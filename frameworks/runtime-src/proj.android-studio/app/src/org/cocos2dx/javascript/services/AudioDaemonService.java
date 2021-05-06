package org.cocos2dx.javascript.services;

import android.app.ActivityManager;
import android.app.Notification;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.blankj.utilcode.util.LogUtils;

import org.cocos2dx.javascript.utils.NotificationUtils;
import com.bjyt.game.vivo.R;

import java.util.List;

public class AudioDaemonService extends Service {

    private final static String TAG = AudioDaemonService.class.getSimpleName();
    public static final String NOTIFICATION_CHANNEL_ID = AudioDaemonService.class.getSimpleName();
    private MediaPlayer mMediaPlayer;
    private Thread thread;
    public static final int MANAGER_NOTIFICATION_ID = 0x1002;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
//        throw new UnsupportedOperationException("Not yet implemented");
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, TAG + "---->onCreate,启动服务");
        MyThread myThread = new MyThread();
        thread = new Thread(myThread);
        mMediaPlayer = MediaPlayer.create(getApplicationContext(), R.raw.mute);
        mMediaPlayer.setLooping(true);

//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            NotificationUtils notificationUtils = new NotificationUtils(getApplicationContext());
//            notificationUtils.createNotificationChannel("channel_2", "audio", NotificationManager.IMPORTANCE_HIGH);
//        }

        //前台服务通知
        String title = "", content = "";
        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.hint_bonus);
        Notification notification = NotificationUtils.getForegroundNotification
                (AudioDaemonService.this, NOTIFICATION_CHANNEL_ID, title, content, bitmap);
        startForeground(MANAGER_NOTIFICATION_ID, notification);

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        thread.start();
        return START_STICKY;
    }

    private void startPlayMusic() {
        if (mMediaPlayer == null) {
            mMediaPlayer = MediaPlayer.create(getApplicationContext(), R.raw.mute);
            LogUtils.d("音乐启动播放,播放对象为： " + mMediaPlayer.hashCode());
            mMediaPlayer.start();
        } else {
            mMediaPlayer.start();
            LogUtils.d("音乐启动播放,播放对象为： " + mMediaPlayer.hashCode());
        }
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void stopPlayMusic() {
        if (mMediaPlayer != null) {
            mMediaPlayer.stop();
            LogUtils.d("音乐停止播放,播放对象为：" + mMediaPlayer.hashCode());
            LogUtils.d("音乐播放器是否在循环：" + mMediaPlayer.isLooping());
            LogUtils.d("音乐播放器是否还在播放：" + mMediaPlayer.isPlaying());
            mMediaPlayer.release();
            LogUtils.d("播放对象销毁,播放对象为：" + mMediaPlayer.hashCode());
            mMediaPlayer = null;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mMediaPlayer.pause();
        LogUtils.d("恢复播放 时当前播放器对象：" + mMediaPlayer.hashCode());
        stopPlayMusic();
        LogUtils.d("应用播放服务被杀死，正在重启");
        LogUtils.d("目标播放工作线程是否存活：" + thread.isAlive());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(new Intent(getApplicationContext(), AudioDaemonService.class));
        } else {
            startService(new Intent(getApplicationContext(), AudioDaemonService.class));
        }

//        startService(new Intent(getApplicationContext(), LocalDaemonService.class));
    }

    // 服务是否运行
    public boolean isServiceRunning(Context context, String serviceName) {
        boolean isRunning = false;
        ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> lists = am.getRunningAppProcesses();


        for (ActivityManager.RunningAppProcessInfo info : lists) {// 获取运行服务再启动
            System.out.println(info.processName);
            if (info.processName.equals(serviceName)) {
                isRunning = true;
            }
        }
        return isRunning;

    }

    private class MyThread implements Runnable {
        @Override
        public void run() {
            startPlayMusic();
        }
    }
}
