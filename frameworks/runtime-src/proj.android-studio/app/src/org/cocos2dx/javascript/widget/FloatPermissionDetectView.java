package org.cocos2dx.javascript.widget;

import android.content.Context;
import android.view.Gravity;
import android.view.View;

import com.bjyt.game.vivo.R;

/**
 * @author sun on 2018/12/27.
 */
public class FloatPermissionDetectView extends BaseFloatWindow {

    public FloatPermissionDetectView(Context context) {
        super(context);
    }

    @Override
    public void create() {
        super.create();

        mViewMode = WRAP_CONTENT_TOUCHABLE;

        mGravity = Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL;

        inflate(R.layout.main_layout_float_permission_detect);

        findView(R.id.btn_close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                remove();
            }
        });
    }

    @Override
    protected void onAddWindowFailed(Exception e) {

    }
}
