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

    public static final boolean isServiceDefend = true;
    public static final boolean isDebug = !true;
    public static final String appId = "wxc1237e9442f71a99";
    public static final String sdk_serial = "600bbeaeb3b4f6635de190f8";

    public static final String s1 = "hw";

    public static final  String videoID = "945990831"; //shxs 945927425 myx 945898936 szrc 945955778 gzyh 945979859 hw 945990831 oppo 946045794 ks 946011282
    public static final  String bannerID = "";//shxs 945927419 myx 945898927 szrc 945955765 gzyh
    public static final  String nativeID = "945990828";//shxs 945927411 myx 945898923 szrc 945955754 gzyh 945979854 hw 945990828 oppo 946045797 ks 946011424
    public static final  String interactionID = "945990830";//shxs 945927423 myx 945898930 szrc 945955770 gzyh 945979857 hw 945990830 oppo 946045796 ks 946011264
    public static final  String splashID = "887458000";//shxs 887449241 myx 887445670 szrc 887453267 gzyh 887456207 hw 887458000 oppo 887465616 ks 887460599

    public static boolean isDeepLink = false;
}

