package org.cocos2dx.javascript.widget;

import android.content.Context;
import android.content.Intent;
import android.view.View;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.services.FloatWindowService;
import org.pinball.games.R;

public class AlarmFloatWindow extends FullScreenTouchAbleFloatWindow  {
    public AlarmFloatWindow(Context context) {
        super(context);
        findView(R.id.fw_imageView).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(mContext, AppActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(intent);
                remove();
                Intent fwIntent = new Intent(mContext, FloatWindowService.class);
                mContext.stopService(fwIntent);
            }
        });
    }

    public void setBG(int resId) {
        findView(R.id.fw_imageView).setBackground(mContext.getResources().getDrawable(resId));
    }


}
