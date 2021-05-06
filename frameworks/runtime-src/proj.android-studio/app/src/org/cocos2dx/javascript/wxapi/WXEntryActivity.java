package org.cocos2dx.javascript.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Bundle;

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
    private static final String app_id = "wxd98e5c025bb87c2f";

    private IWXAPI api;

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        System.out.println("WXEntryActivity onCreate SUCC!!!!");
        super.onCreate(savedInstanceState);

        api = WXAPIFactory.createWXAPI(this, app_id, false);

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
        System.out.println("javascript接收请求微信返回onResp");
        System.out.println("api is" + api);
        if (Constants.isDebug) {
            ToastUtils.showLong("errCode：" + baseResp.errCode);
        }
        if (baseResp.errCode == BaseResp.ErrCode.ERR_OK) {
            String code = ((SendAuth.Resp) baseResp).code;
            System.out.println("===code is======" + code);
            AppActivity.callJsFunction("1", code);
            finish();
        }
        }
    }