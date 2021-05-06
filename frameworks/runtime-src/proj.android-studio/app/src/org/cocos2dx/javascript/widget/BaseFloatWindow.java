package org.cocos2dx.javascript.widget;

import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.CallSuper;
import android.support.annotation.IdRes;
import android.support.annotation.LayoutRes;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

import org.cocos2dx.javascript.utils.FloatWindowParamManager;

/**
 * @author liyihe
 */
public abstract class BaseFloatWindow {

    public static final String TAG = "FloatWindowBase";

    static final int FULLSCREEN_TOUCHABLE = 1;
    static final int FULLSCREEN_NOT_TOUCHABLE = 2;
    static final int WRAP_CONTENT_TOUCHABLE = 3;
    static final int WRAP_CONTENT_NOT_TOUCHABLE = 4;

    WindowManager.LayoutParams mLayoutParams;

    View mInflate;
    Context mContext;
    WindowManager mWindowManager;
    private boolean mAdded;
    //设置隐藏时是否是INVISIBLE
    private boolean mInvisibleNeed = false;
    private boolean mRequestFocus = false;
    int mGravity = Gravity.CENTER_HORIZONTAL | Gravity.CENTER_VERTICAL;
    int mViewMode = WRAP_CONTENT_NOT_TOUCHABLE;
    Handler mHandler = new Handler(Looper.getMainLooper());

    public BaseFloatWindow(Context context) {
        mContext = context;

        create();
    }

    /**
     * 设置隐藏View的方式是否为Invisible，默认为Gone
     *
     * @param invisibleNeed 是否是Invisible
     */
    public void setInvisibleNeed(boolean invisibleNeed) {
        mInvisibleNeed = invisibleNeed;
    }

    /**
     * 悬浮窗是否需要获取焦点，通常获取焦点后，悬浮窗可以和软键盘发生交互，被覆盖的应用失去焦点。
     * 例如：游戏将失去背景音乐
     *
     * @param requestFocus
     */
    public void requestFocus(boolean requestFocus) {
        mRequestFocus = requestFocus;
    }

    @CallSuper
    public void create() {
        mWindowManager = (WindowManager) mContext.getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
    }

    @CallSuper
    public synchronized void show() {
        if (mInflate == null)
            throw new IllegalStateException("FloatView can not be null");

        if (mAdded) {
            mInflate.setVisibility(View.VISIBLE);
            return;
        }

        getLayoutParam(mViewMode);

        mInflate.setVisibility(View.VISIBLE);

        try {
            mWindowManager.addView(mInflate, mLayoutParams);
            mAdded = true;
        } catch (Exception e) {
            onAddWindowFailed(e);
        }
    }

    @CallSuper
    public void hide() {
        if (mInflate != null) {
            mInflate.setVisibility(View.INVISIBLE);
        }
    }

    @CallSuper
    public void gone() {
        if (mInflate != null) {
            mInflate.setVisibility(View.GONE);
        }
    }

    @CallSuper
    public void remove() {
        if (mInflate != null && mWindowManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                if (mInflate.isAttachedToWindow()) {
                    mWindowManager.removeView(mInflate);
                }
            }
            mAdded = false;
        }

        if (mHandler != null) {
            mHandler.removeCallbacksAndMessages(null);
        }
    }

    @CallSuper
    protected View inflate(@LayoutRes int layout) {
        mInflate = View.inflate(mContext, layout, null);
        return mInflate;
    }

    @SuppressWarnings("unchecked")
    protected <T extends View> T findView(@IdRes int id) {
        if (mInflate != null) {
            return (T) mInflate.findViewById(id);
        }
        return null;
    }


    /**
     * 获取悬浮窗LayoutParam
     *
     * @param mode
     */
    protected void getLayoutParam(int mode) {
        switch (mode) {
            case FULLSCREEN_TOUCHABLE:
                mLayoutParams = FloatWindowParamManager.getFloatLayoutParam(true, true);
                break;

            case FULLSCREEN_NOT_TOUCHABLE:
                mLayoutParams = FloatWindowParamManager.getFloatLayoutParam(true, false);
                break;

            case WRAP_CONTENT_NOT_TOUCHABLE:
                mLayoutParams = FloatWindowParamManager.getFloatLayoutParam(false, false);
                break;

            case WRAP_CONTENT_TOUCHABLE:
                mLayoutParams = FloatWindowParamManager.getFloatLayoutParam(false, true);
                break;
        }

        if (mRequestFocus) {
            mLayoutParams.flags = mLayoutParams.flags & ~WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        }

        mLayoutParams.gravity = mGravity;
    }

    /**
     * 获取可见性
     *
     * @return
     */
    public boolean getVisibility() {
        if (mInflate != null && mInflate.getVisibility() == View.VISIBLE) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 改变可见性
     */
    public void toggleVisibility() {
        if (mInflate != null) {
            if (getVisibility()) {
                if (mInvisibleNeed) {
                    hide();
                } else {
                    gone();
                }
            } else {
                show();
            }
        }
    }

    protected abstract void onAddWindowFailed(Exception e);
}
