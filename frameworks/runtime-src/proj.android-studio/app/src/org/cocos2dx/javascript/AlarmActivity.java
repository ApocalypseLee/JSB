package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import org.cocos2dx.javascript.utils.UIUtils;
import org.pinball.games.R;

import static org.cocos2dx.javascript.services.FloatWindowService.FLAG_RES_ID;

/**
 * @author liyihe
 */
public class AlarmActivity extends BaseAlarmActivity {
    ImageView imageView;
    TextView textView;
    String flag;
    int resId;

    public void onAlarmClick(View v) {
        Intent intent = new Intent(this, AppActivity.class);
        startActivity(intent);
    }

    public void onAlarmCloseClick(View v) {
        finish();
    }

    @Override
    protected void onInit() {
        setContentView(R.layout.alarm);

        //下面就是根据自己的跟你需求来写，跟写一个Activity一样的
        //拿到传过来的数据
        flag = getIntent().getStringExtra("flag");
        if (getIntent().hasExtra(FLAG_RES_ID)) {
            resId = getIntent().getIntExtra(FLAG_RES_ID, 0);
            initRes(resId);
        } else {
            if (flag.equals(Intent.ACTION_SCREEN_OFF)) {
                resId = UIUtils.getIntegerRandomBound(1, 3);
            } else if (flag.equals(Intent.ACTION_TIME_TICK)) {
                resId = UIUtils.getIntegerRandomBound(1, 2);
            }
            initRes(resId);
        }
    }

    private void initRes(int resId) {
        textView = getTextRes(R.id.close);
        if (flag.equals(Intent.ACTION_SCREEN_OFF)) {
            textView.setVisibility(View.GONE);
            imageView = getImageRes(R.id.imageView);
            switch (resId) {
                case 1:
                    imageView.setImageDrawable(getResources().getDrawable(R.drawable.hint_iphone));
                    break;
                case 2:
                    imageView.setImageDrawable(getResources().getDrawable(R.drawable.hint_bonus));
                    break;
                case 3:
                    imageView.setImageDrawable(getResources().getDrawable(R.drawable.hint_money2));
                    break;
            }
        } else if (flag.equals(Intent.ACTION_TIME_TICK)) {
            textView.setVisibility(View.VISIBLE);

            imageView = getImageRes(R.id.imageView);

            switch (resId) {
                case 1:
                    imageView.setImageDrawable(getResources().getDrawable(R.drawable.alarm_iphone));
                    break;
                case 2:
                    imageView.setImageDrawable(getResources().getDrawable(R.drawable.alarm_money));
                    break;
            }
        }
    }

    @SuppressLint("WakelockTimeout")
    @Override
    protected void initNewIntent(Intent intent) {
        flag = intent.getStringExtra("flag");
        resId = intent.getIntExtra("resId", 0);
        PowerManager pm = (PowerManager) this.getSystemService(Context.POWER_SERVICE);
        initRes(resId);
        if (!pm.isScreenOn() && flag.equals(Intent.ACTION_TIME_TICK)) {
            //点亮屏幕
            @SuppressLint
                    ("InvalidWakeLockTag") PowerManager.WakeLock wl =
                    pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP
                            | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "bright");
            wl.acquire();
            wl.release();
        }
    }
}
