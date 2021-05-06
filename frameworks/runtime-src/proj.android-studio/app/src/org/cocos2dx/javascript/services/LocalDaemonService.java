package org.cocos2dx.javascript.services;

import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.Constants;
import org.pinball.games.IMyAidlInterface;

import java.util.Calendar;
import java.util.Timer;
import java.util.TimerTask;


/**
 * @author liyihe
 */

public class LocalDaemonService extends Service {

    private final static String TAG = LocalDaemonService.class.getSimpleName();
    public static final String NOTIFICATION_CHANNEL_ID = LocalDaemonService.class.getSimpleName();
    private static int count = 0;
    private static Timer timer = null;
    private MyBinder mBinder;
    private final Handler handler = new Handler(Looper.myLooper());

    private ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            IMyAidlInterface iMyAidlInterface = IMyAidlInterface.Stub.asInterface(service);
            try {
                Log.i("LocalService", "connected with " + iMyAidlInterface.getServiceName());
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            if (Constants.INSTANCE.isOpenServiceDefend == 1) {
                if (Constants.isDebug) {
                    Toast.makeText(LocalDaemonService.this, "链接断开，重新启动 RemoteService", Toast.LENGTH_LONG).show();
                }
                Log.i(TAG, "链接断开，重新启动 RemoteService......");
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    startForegroundService(new Intent(LocalDaemonService.this, RemoteDaemonService.class));
                } else {
                    startService(new Intent(LocalDaemonService.this, RemoteDaemonService.class));
                }
                bindService(new Intent(LocalDaemonService.this, RemoteDaemonService.class), connection, Context.BIND_IMPORTANT);
            }

        }
    };

    public LocalDaemonService() {
    }

    @Override
    public void onCreate() {
        super.onCreate();
        getLock(LocalDaemonService.this);
        if (timer == null) {
            timer = new Timer();
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    Log.i(TAG, "--" + count++);
                }
            }, 0, 1000);
        }

//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            //前台服务通知
//            String title = "", content = "";
//            Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.hint_bonus);
//            Notification notification = NotificationUtils.getForegroundNotification
//                    (LocalDaemonService.this, NOTIFICATION_CHANNEL_ID, title, content, bitmap);
//            startForeground(1, notification);
//            handler.postDelayed(new Runnable() {
//                @Override
//                public void run() {
//                    stopForeground(true);
//                }
//            }, 1000);
//        }


    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (Constants.INSTANCE.isOpenServiceDefend == 1) {
            Log.i(TAG, "本地服务启动......");
            if (Constants.isDebug) {
                Toast.makeText(LocalDaemonService.this, "本地服务启动", Toast.LENGTH_LONG).show();
            }
            startService(new Intent(LocalDaemonService.this, RemoteDaemonService.class));
            bindService(new Intent(LocalDaemonService.this, RemoteDaemonService.class), connection, Context.BIND_IMPORTANT);
        }
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        mBinder = new MyBinder();
        return mBinder;
    }

    private class MyBinder extends IMyAidlInterface.Stub {
        @Override
        public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat,
                               double aDouble, String aString) throws RemoteException {

        }

        @Override
        public String getServiceName() throws RemoteException {
            return LocalDaemonService.class.getName();
        }

    }

    @Override
    public void onDestroy() {
        // TODO 自动生成的sss方法存根
        super.onDestroy();
        releaseLock();
        try {
            if (timer != null) {
                timer.cancel();
                timer = null;
            }
            unbindService(connection);
        } catch (Exception e) {
            System.exit(0);
        }

    }

    private PowerManager.WakeLock mWakeLock;

    /**
     *      * 同步方法   得到休眠锁
     *      * @param context
     *      * @return
     *     
     */
    synchronized private void getLock(Context context) {
        if (mWakeLock == null) {
            PowerManager mgr = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            mWakeLock = mgr.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, LocalDaemonService.class.getName());
            mWakeLock.setReferenceCounted(true);
            Calendar c = Calendar.getInstance();
            c.setTimeInMillis((System.currentTimeMillis()));
            int hour = c.get(Calendar.HOUR_OF_DAY);
            if (hour >= 23 || hour <= 6) {
                mWakeLock.acquire(5000);
            } else {
                mWakeLock.acquire(300000);
            }
        }
        Log.v(TAG, "get lock");
    }

    synchronized private void releaseLock() {
        if (mWakeLock != null) {
            if (mWakeLock.isHeld()) {
                mWakeLock.release();
                Log.v(TAG, "release lock");
            }
            mWakeLock = null;
        }
    }
}

