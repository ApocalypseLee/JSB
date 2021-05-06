package com.bjyt.game.vivo.wxapi;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.blankj.utilcode.util.ToastUtils;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Constants;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    private IWXAPI api;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        System.out.println("WXEntryActivity onCreate SUCC!!!!");
        super.onCreate(savedInstanceState);

        api = WXAPIFactory.createWXAPI(this, Constants.appId, false);

        try {
            Intent intent = getIntent();
            api.handleIntent(intent, this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq req) {
        System.out.println("onReq SUCC!!");
    }

    @Override
    public void onResp(BaseResp baseResp) {
        System.out.println("pinball接收请求微信返回onResp");
        System.out.println("api is" + api);
        if (Constants.isDebug) {
            Toast.makeText(AppActivity.getContext(), "errCode：" + baseResp.errCode, Toast.LENGTH_LONG).show();
        }
        if (baseResp.errCode == BaseResp.ErrCode.ERR_OK) {
            String code = ((SendAuth.Resp) baseResp).code;
            System.out.println("===code is======" + code);
            AppActivity.callJsFunction("1", code);
            finish();
        } else {
            System.out.println("errCode is" + baseResp.errCode);
        }
    }
}