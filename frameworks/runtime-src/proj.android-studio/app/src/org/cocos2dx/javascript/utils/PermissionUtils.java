package org.cocos2dx.javascript.utils;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.AppOpsManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.PowerManager;
import android.provider.Settings;
import android.support.annotation.RequiresApi;

import com.blankj.utilcode.util.AppUtils;

import org.cocos2dx.javascript.services.FloatWindowService;
import com.bjyt.game.vivo.R;

import java.lang.reflect.Method;

import static org.cocos2dx.lib.Cocos2dxHelper.getPackageName;

/**
 * @author liyihe
 */
public class PermissionUtils {


    @RequiresApi(api = Build.VERSION_CODES.M)
    public static boolean isIgnoringBatteryOptimizations(final Context context) {
        boolean isIgnoring = false;
        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        if (powerManager != null) {
            isIgnoring = powerManager.isIgnoringBatteryOptimizations(getPackageName());
        }
        return isIgnoring;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public static void requestIgnoreBatteryOptimizations(final Context context) {
        try {
            @SuppressLint("BatteryLife") Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + getPackageName()));
            context.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void showOpenPermissionDialog(final Context context, final Handler handler) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(R.string.no_float_permission);
        builder.setMessage(R.string.go_t0_open_float_ask);
        builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                FloatWindowParamManager.tryJumpToPermissionPage(context.getApplicationContext());

                Intent intent = new Intent(context.getApplicationContext(), FloatWindowService.class);
                intent.setAction(FloatWindowService.ACTION_CHECK_PERMISSION_AND_TRY_ADD);
                context.startService(intent);
                handler.sendEmptyMessage(6);
            }
        });

        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                handler.sendEmptyMessage(6);
            }
        });
        builder.show();
    }

    public static boolean checkOPsPermission(final Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(context);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            return checkOps(context);
        }
        return true;
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private static boolean checkOverlayPermission(final Context context) {
        AppOpsManager appOpsMgr = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        try {
            if (appOpsMgr != null) {
                int mode = appOpsMgr.checkOpNoThrow("android:system_alert_window",
                        android.os.Process.myUid(), context.getPackageName());
                if (mode == 0) {
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private static boolean checkOps(final Context context) {
        try {
            Object object = context.getSystemService(Context.APP_OPS_SERVICE);
            if (object == null) {
                return false;
            }
            Class localClass = object.getClass();
            Class[] arrayOfClass = new Class[3];
            arrayOfClass[0] = Integer.TYPE;
            arrayOfClass[1] = Integer.TYPE;
            arrayOfClass[2] = String.class;
            Method method = localClass.getMethod("checkOp", arrayOfClass);
            if (method == null) {
                return false;
            }
            Object[] arrayOfObject1 = new Object[3];
            arrayOfObject1[0] = 24;
            arrayOfObject1[1] = Binder.getCallingUid();
            arrayOfObject1[2] = AppUtils.getAppPackageName();
            int m = (Integer) method.invoke(object, arrayOfObject1);
            return m == AppOpsManager.MODE_ALLOWED || !RomUtils.isDomesticSpecialRom();
        } catch (Exception ignore) {
        }
        return false;
    }
}
