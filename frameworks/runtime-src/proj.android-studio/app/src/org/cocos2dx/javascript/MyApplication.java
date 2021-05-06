package org.cocos2dx.javascript;

import android.app.Application;

import com.qq.e.comm.managers.GDTADManager;


public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        //穿山甲SDK初始化
        System.out.println("穿山甲SDK初始化");
        //强烈建议在应用对应的Application#onCreate()方法中调用，避免出现content为null的异常
        TTAdManagerHolder.init(this);

        //初始化广点通
        GDTADManager.getInstance().initWith(this, "1111479454");
    }
}
