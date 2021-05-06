package org.cocos2dx.javascript.widget;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import org.cocos2dx.javascript.services.FloatWindowService;
import org.pinball.games.R;

/**
 * @author liyihe
 */
public class FullScreenTouchAbleFloatWindow extends BaseFloatWindow {

    public FullScreenTouchAbleFloatWindow(Context context) {
        super(context);
    }

    @Override
    public void create() {
        super.create();

        mViewMode = FULLSCREEN_TOUCHABLE;

        inflate(R.layout.fullscreen_float_window);

        findView(R.id.fw_close).setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.KITKAT)
            @Override
            public void onClick(View v) {
                Toast.makeText(mContext, "已关闭", Toast.LENGTH_SHORT).show();
                remove();
                Intent fwIntent = new Intent(mContext, FloatWindowService.class);
                mContext.stopService(fwIntent);
            }
        });
    }

    @Override
    protected void onAddWindowFailed(Exception e) {

        Log.e(TAG, "添加悬浮窗失败");
        Toast.makeText(mContext, "添加悬浮窗失败,请检查悬浮窗权限!", Toast.LENGTH_SHORT).show();
    }
}
