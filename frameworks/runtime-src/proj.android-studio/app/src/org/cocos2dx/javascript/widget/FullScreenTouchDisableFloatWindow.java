package org.cocos2dx.javascript.widget;

import android.content.Context;

import com.bjyt.game.vivo.R;


/**
 * @author sun on 2018/12/26.
 */
public class FullScreenTouchDisableFloatWindow extends BaseFloatWindow {

    public FullScreenTouchDisableFloatWindow(Context context) {
        super(context);
    }

    @Override
    public void create() {
        super.create();

        mViewMode = FULLSCREEN_NOT_TOUCHABLE;

        inflate(R.layout.main_layout_float_full_screen_touch_disable);


    }

    @Override
    protected void onAddWindowFailed(Exception e) {

    }
}
