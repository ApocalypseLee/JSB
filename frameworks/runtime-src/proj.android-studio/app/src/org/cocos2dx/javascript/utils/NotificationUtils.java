package org.cocos2dx.javascript.utils;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.support.annotation.RequiresApi;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.widget.RemoteViews;
import android.widget.Toast;

import com.blankj.utilcode.util.AppUtils;

import org.cocos2dx.javascript.AlarmActivity;
import org.cocos2dx.javascript.services.FloatWindowService;
import org.pinball.games.R;

import static android.app.Notification.EXTRA_CHANNEL_ID;
import static android.provider.Settings.EXTRA_APP_PACKAGE;

/**
 * @author liyihe
 */
public class NotificationUtils extends ContextWrapper {

    public static final String TAG = NotificationUtils.class.getSimpleName();

    public static final String id = "channel_1";
    public static final String name = "notification";
    public static final String flag = "flag";
    public static final String resId = "resId";
    private NotificationManager manager;
    private Context mContext;
    private int resID;

    public NotificationUtils(Context base) {
        super(base);
        mContext = base;
        getManager(this);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void createNotificationChannel(String id, String name, int importance) {
        NotificationChannel channel = new NotificationChannel(id, name, importance);
        getManager(this).createNotificationChannel(channel);
    }

    public NotificationManager getManager(Context context) {
        if (manager == null) {
            manager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
        }
        return manager;
    }

    public void sendNotificationFullScreen(Class<?> targetClass, String title, String content, String type, int resID) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.resID = resID;
            createNotificationChannel(id, name, NotificationManager.IMPORTANCE_HIGH);
            Notification notification = getChannelNotificationQ(targetClass, title, content, type);

            if (targetClass.getSimpleName().equals(AlarmActivity.class.getSimpleName())) {
                RemoteViews remoteViews = new RemoteViews(getPackageName(), R.layout.notification);
                initRes(getResources(), remoteViews, resID, type);
                notification.contentView = remoteViews;
            } else if (type.equals(Intent.ACTION_BOOT_COMPLETED)) {
                RemoteViews remoteViews = new RemoteViews(getPackageName(), R.layout.notification);
                Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.hint_iphone);
                remoteViews.setImageViewBitmap(R.id.notify_bg, bitmap);
                notification.contentView = remoteViews;
                notification.flags |= Notification.FLAG_ONGOING_EVENT; //??????????????????????????????"Ongoing"???"????????????"??????
                notification.flags |= Notification.FLAG_NO_CLEAR; //?????????????????????????????????"????????????"?????????????????????????????????FLAG_ONGOING_EVENT????????????
            }
            getManager(this).notify(1, notification);
        }
    }

    public void clearAllNotification() {
        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

    public Notification getChannelNotificationQ(Class<?> targetClass, String title, String content, String type) {
        Intent fullScreenIntent = new Intent(this, targetClass);
        fullScreenIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        fullScreenIntent.putExtra(flag, type);
        fullScreenIntent.putExtra(resId, resID);
        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity
                (this, 0, fullScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, id)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(title)
                        .setTicker(content)
                        .setContentText(content)
                        .setAutoCancel(true)
                        .setDefaults(Notification.DEFAULT_ALL)
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setCategory(Notification.CATEGORY_CALL)
                        .setFullScreenIntent(fullScreenPendingIntent, true);

        return notificationBuilder.build();
    }

    private static void initRes(Resources resources, RemoteViews remoteViews, int resID, String type) {
        Bitmap bitmap = null;
        if (type.equals(Intent.ACTION_SCREEN_OFF)) {
            switch (resID) {
                case 1:
                    bitmap = BitmapFactory.decodeResource(resources, R.drawable.hint_iphone);
                    break;
                case 2:
                    bitmap = BitmapFactory.decodeResource(resources, R.drawable.hint_bonus);
                    break;
                case 3:
                    bitmap = BitmapFactory.decodeResource(resources, R.drawable.hint_money2);
                    break;
            }
        } else if (type.equals(Intent.ACTION_TIME_TICK)) {
            switch (resID) {
                case 1:
                    bitmap = BitmapFactory.decodeResource(resources, R.drawable.alarm_iphone);
                    break;
                case 2:
                    bitmap = BitmapFactory.decodeResource(resources, R.drawable.alarm_money);
                    break;
            }
        }
        if (bitmap != null)
            remoteViews.setImageViewBitmap(R.id.notify_bg, bitmap);
    }


    public static Notification getForegroundNotification
            (Context context, String channelId, String title, String content, Bitmap bitmap) {

        createNotificationChannelForeground(channelId, context);

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setLargeIcon(((BitmapDrawable) context.getResources().getDrawable(R.mipmap.ic_launcher)).getBitmap())
                        .setContentTitle(title)
                        .setContentText(content)
                        .setWhen(System.currentTimeMillis())
                        .setPriority(NotificationCompat.PRIORITY_MAX);

        Intent msgIntent = getStartAppIntent(context.getApplicationContext());
        PendingIntent mainPendingIntent = PendingIntent.getActivity(context.getApplicationContext(), 0,
                msgIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification = mBuilder.setContentIntent(mainPendingIntent).setAutoCancel(false).build();
        if (bitmap != null) {
            RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.notification);
            remoteViews.setImageViewBitmap(R.id.notify_bg, bitmap);
            notification.contentView = remoteViews;
        }
        notification.flags |= Notification.FLAG_ONGOING_EVENT; //??????????????????????????????"Ongoing"???"????????????"??????
        notification.flags |= Notification.FLAG_NO_CLEAR; //?????????????????????????????????"????????????"?????????????????????????????????FLAG_ONGOING_EVENT????????????
        return notification;
    }

    private static void createNotificationChannelForeground(String channelId, Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Name";
            String description = "Description";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(channelId, name, importance);
            channel.setDescription(description);
            channel.setShowBadge(false);
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private static Intent getStartAppIntent(Context context) {
        Intent intent = context.getPackageManager()
                .getLaunchIntentForPackage(AppUtils.getAppPackageName());
        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                    | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        }

        return intent;
    }

    /**
     * ??????????????????????????????????????????
     *
     * @param context
     */
    public static void notificationGuide(Context context) {
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) {
            Toast.makeText(context, "????????????????????????", Toast.LENGTH_LONG).show();
            try {
                // ??????isOpened?????????????????????????????????????????????AppInfo??????????????????App????????????
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                //????????????????????? API 26, ???8.0??????8.0??????????????????
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    intent.putExtra(EXTRA_APP_PACKAGE, context.getPackageName());
                    intent.putExtra(EXTRA_CHANNEL_ID, context.getApplicationInfo().uid);
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    //????????????????????? API21??????25?????? 5.0??????7.1 ???????????????????????????
                    intent.putExtra("app_package", context.getPackageName());
                    intent.putExtra("app_uid", context.getApplicationInfo().uid);
                }
                // ??????6 -MIUI9.6-8.0.0??????????????????????????????????????????????????????"????????????????????????"??????????????????????????????????????????????????????????????????I'm not ok!!!
                //  if ("MI 6".equals(Build.MODEL)) {
                //      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                //      Uri uri = Uri.fromParts("package", getPackageName(), null);
                //      intent.setData(uri);
                //      // intent.setAction("com.android.settings/.SubSettings");
                //  }
                context.startActivity(intent);
            } catch (Exception e) {
                e.printStackTrace();
                // ?????????????????????????????????????????????????????????3??????OC105 API25
                Intent intent = new Intent();

                //??????????????????????????????????????????????????????????????????
                //https://blog.csdn.net/ysy950803/article/details/71910806
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", context.getPackageName(), null);
                intent.setData(uri);
                context.startActivity(intent);
            }
        }

    }
}
