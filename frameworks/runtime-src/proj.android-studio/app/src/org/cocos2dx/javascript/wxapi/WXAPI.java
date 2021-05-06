package org.cocos2dx.javascript.wxapi;

import android.app.Activity;

import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;


public class WXAPI {
    private static String appId = "wxd98e5c025bb87c2f";
    public static IWXAPI api;
    public static Activity instance;
    public static boolean isLogin = false;
    public static void Init(Activity context){
        WXAPI.instance = context;
        api = WXAPIFactory.createWXAPI(context, appId, true);
        api.registerApp(appId);
    }

    private static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    public static void Login(){
        if (!api.isWXAppInstalled()) {
//            Toasty.info(this, "您还未安装微信客户端");
            System.out.println("您还未安装微信客户端");
            return;
        }
        final SendAuth.Req req = new SendAuth.Req();
//        req.scope = "snsapi_userinfo";
//        req.state = "none";
//        System.out.println("req is " + req);
//        //利用微信api发送请求
//        api.sendReq(req);
        req.scope = "snsapi_userinfo,snsapi_friend,snsapi_message,snsapi_contact";
        req.state = "none";
        api.sendReq(req);
        System.out.println("发送请求完毕");
        System.out.println("In AppActivity api is " + api);
    }
}
