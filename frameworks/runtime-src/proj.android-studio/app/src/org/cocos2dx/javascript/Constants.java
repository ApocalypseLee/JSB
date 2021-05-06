package org.cocos2dx.javascript;

/**
 * @author liyihe
 */

public enum Constants {
    //枚举类型实现单例
    INSTANCE;
    public static final int openServiceDefend = 1;
    public static final int stopServiceDefend = 0;
    public static int isOpenServiceDefend = 1;//是否开启进程守护，默认开启

    public static void setIsOpenServiceDefend(int isOpenServiceDefend) {
        Constants.isOpenServiceDefend = isOpenServiceDefend;
    }

    public static final boolean isDebug = !true;
    public static final String appId = "wx4d93c7030d855812";
    public static final String sdk_serial = "600bbeaeb3b4f6635de190f8";
    public static final String appId_Vivo = "105475860";

    public static final String s1 = "VIVO";

    public static boolean isDeepLink = false;

    public interface IntentKey {
        String POSITION_ID = "position_id";
    }

    public interface ConfigureKey {
        String SERVER_URL = "server_url";
        String MEDIA_ID = "media_id";
        String SPLASH_POSITION_ID = "splash_position_id";
        String BANNER_POSITION_ID = "banner_position_id";
        String INTERSTITIAL_POSITION_ID = "interstitial_position_id";
        String VIDEO_INTERSTITIAL_POSITION_ID = "interstitial_video_position_id";
        String NATIVE_POSITION_ID = "native_position_id";
        String NATIVE_STREAM_POSITION_ID = "native_stream_position_id";
        String VIDEO_POSITION_ID = "video_position_id";
        String SPLASH_AD_TIME = "splash_ad_time";
        String BANNER_AD_TIME = "banner_ad_time";
        String APP_TITLE = "app_title";
        String APP_DESC = "app_desc";
        String HOT_SPLASH = "hot_splash";
        String FLOAT_ICON = "float_icon";
    }


    public interface DefaultConfigValue {
        /**
         * 测试用，接入方置空即可
         */
        String SERVER_URL = "http://10.101.19.148";
        /**
         * 以下ID需填入自己在广告后台申请的相关id
         */
        String MEDIA_ID = "83d9ed37cbb54486aa52a2d29b644263";
        String SPLASH_POSITION_ID = "f77100cdd1664001be694e1e0a9d62d3";
        String BANNER_POSITION_ID = "88139a5007d84bdf88693c4a0f5460f0";
        String INTERSTITIAL_POSITION_ID = "7c7436d5b6cb46378976461499942d2b";
        String VIDEO_INTERSTITIAL_POSITION_ID = "0f001688d45145da9ed8fdf8f5e24eb5";
        String NATIVE_STREAM_POSITION_ID = "42280f20000340a5a56a09b9a6ddf3e8";
        String VIDEO_POSITION_ID = "caf0940e988b4f899005f14bc1c582c4";
        String FLOAT_ICON = "9954870b8b2f4d729ccaffab31241ad7";
        /**
         * 原生模板化-横板纯图
         **/
        String NATIVE_EXPRESS_MATERIAL_ID = "359f63373ba34df89d569e7090718d04";

        /**
         * 原生模板化-三图模板
         **/
        String NATIVE_EXPRESS_MATERIAL_GROUP_ID = "47adb3b4b4b541f1a8b6c3ea587ff2c8";

        /**
         * 原生模板化-左文右图
         **/
        String NATIVE_EXPRESS_MATERIAL_RIGHT_ID = "70d40dfdb7944ad7a0e827487d50ab9c";

        /**
         * 原生模板化-左图右文
         **/
        String NATIVE_EXPRESS_MATERIAL_LEFT_ID = "233d61e29feb43b3ab957c39cc88879a";

        /**
         * 原生模板化-上图下文
         **/
        String NATIVE_EXPRESS_MATERIAL_TOP_ID = "9802782c25904370b6ebd51954088422";

        /**
         * 原生模板化-上文下图
         **/
        String NATIVE_EXPRESS_MATERIAL_BOTTOM_ID = "389db372d5314f99b54addd351b394f8";

        int SPLASH_AD_TIME = 3;
        int BANNER_AD_TIME = 15;
        String APP_TITLE = "开心消消乐";
        String APP_DESC = "娱乐休闲首选游戏";

        int HOT_SPLASH = 1; //-1: 关、1:竖屏、2:横屏
    }
}

