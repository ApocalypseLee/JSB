window.__require = function e(a, n, c) {
function l(i, o) {
if (!n[i]) {
if (!a[i]) {
var b = i.split("/");
b = b[b.length - 1];
if (!a[b]) {
var r = "function" == typeof __require && __require;
if (!o && r) return r(b, !0);
if (t) return t(b, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = b;
}
var g = n[i] = {
exports: {}
};
a[i][0].call(g.exports, function(e) {
return l(a[i][1][e] || e);
}, g, g.exports, e, a, n, c);
}
return n[i].exports;
}
for (var t = "function" == typeof __require && __require, i = 0; i < c.length; i++) l(c[i]);
return l;
}({
Audio: [ function(e, a) {
"use strict";
cc._RF.push(a, "c37c6x6iVVEeIfnINnQJ4Op", "Audio");
cc.Class({
extends: cc.Component,
properties: {
bgmAudioID: -1,
sfxAudioID: -1
},
init: function() {},
getUrl: function(e) {
return "music/" + e;
},
playBGM: function() {
var e = this;
if (0 != cc.engine.gameModel.sound) {
var a = this.getUrl("bg");
this.bgmAudioID >= 0 && cc.audioEngine.stop(this.bgmAudioID);
cc.resources.load(a, cc.AudioClip, function(a, n) {
e.bgmAudioID = cc.audioEngine.play(n, !0, 1);
});
}
},
stopBGM: function() {
this.bgmAudioID >= 0 && cc.audioEngine.stop(this.bgmAudioID);
},
playSFX: function(e) {
if (0 != cc.engine.gameModel.sound) {
var a = this.getUrl(e), n = this;
cc.resources.load(a, cc.AudioClip, function(e, a) {
n.sfxAudioID = cc.audioEngine.play(a, !1, 1);
});
}
},
pauseAll: function() {
cc.audioEngine.pauseAll();
},
resumeAll: function() {
cc.audioEngine.resumeAll();
},
playLevel: function() {
this.playSFX("level");
},
playHit: function() {
this.playSFX("hit");
},
playGetNew: function() {
this.playSFX("getNew");
},
playPass: function() {
this.playSFX("pass");
}
});
cc._RF.pop();
}, {} ],
Ball: [ function(e, a) {
"use strict";
cc._RF.push(a, "9b280YbFuZJv4QPGPL8e8iv", "Ball");
cc.Class({
extends: cc.Component,
properties: {
_isSpeed: !1,
speed: 800,
_ball: null,
_body: cc.RigidBody,
_buff: 1
},
onLoad: function() {
cc.systemEvent.on("BUFF_TAKE_EFFECT", this.SpeedUp, this);
cc.systemEvent.on("BUFF_EXPIRED", this.SpeedRestore, this);
cc.systemEvent.on("Frezz_Ball", this.Frezz, this);
this._body = this.node.getComponent(cc.RigidBody);
},
init: function(e) {
var a = this;
this._ball = cc.engine.petDict[e];
cc.resources.load("ball/" + this._ball.icon, cc.SpriteFrame, function(e, n) {
n && (a.node.getComponent("cc.Sprite").spriteFrame = n);
});
this.node.position = cc.v2(parseInt(700 * Math.random() + 25), parseInt(50 * Math.random() + 25));
this._orgVelocity = this.GetBallBornRandomAngle(Math.round(this.speed * this._ball.speed));
this.getComponent(cc.RigidBody).applyLinearImpulse(this._orgVelocity, this.getComponent(cc.RigidBody).getWorldCenter(), !0);
this.SpeedBuff();
},
GetBallBornRandomAngle: function(e) {
var a = e * (Math.random() < Math.random() ? -1 : 1), n = e * (Math.random() < Math.random() ? -1 : 1);
return cc.v2(a, n);
},
onBeginContact: function(e, a, n) {
switch (n.tag) {
case 1:
cc.engine.gameCtl.onBallContactBrick(a.node, n.node);
break;

case 4:
cc.engine.gameCtl.onBallContactWall(a.node, n.node);
}
},
SpeedBuff: function() {
if (this._ball && cc.engine.gameCtl._buffMap.get("SPEED")) {
this._buff = 2;
var e = this._body.getLinearVelocityFromWorldPoint(this._body.getWorldCenter());
this._body.linearVelocity = e.mul(this._buff);
}
},
SpeedUp: function(e) {
if ("SPEED" == e.btype && this._ball) {
this._buff = 2;
var a = this._body.getLinearVelocityFromWorldPoint(this._body.getWorldCenter());
this._body.linearVelocity = a.mul(this._buff);
}
},
SpeedRestore: function(e) {
if ("SPEED" == e.btype && this._ball) {
var a = this._body.getLinearVelocityFromWorldPoint(this._body.getWorldCenter());
this._body.linearVelocity = a.div(this._buff);
}
},
Frezz: function() {
this._body.linearVelocity = cc.Vec2.ZERO;
},
update: function() {
this.xSpeed = Math.round(this.speed * this._ball.speed) * (cc.engine.gameCtl._buffMap.get("SPEED") ? 2 : 1);
this.ySpeed = Math.round(this.speed * this._ball.speed) * (cc.engine.gameCtl._buffMap.get("SPEED") ? 2 : 1);
var e = this.getComponent(cc.RigidBody).linearVelocity.x, a = this.getComponent(cc.RigidBody).linearVelocity.y;
if (e * e + a * a < this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed || e * e + a * a > this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed || e < 33 && e > -33 || a < 33 && a > -33) if (e < 0) if (a < 0) {
this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
this.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.xSpeed, -this.ySpeed), this.getComponent(cc.RigidBody).getWorldCenter(), !0);
} else {
this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
this.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.xSpeed, this.ySpeed), this.getComponent(cc.RigidBody).getWorldCenter(), !0);
} else if (a < 0) {
this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
this.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.xSpeed, -this.ySpeed), this.getComponent(cc.RigidBody).getWorldCenter(), !0);
} else {
this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
this.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.xSpeed, this.ySpeed), this.getComponent(cc.RigidBody).getWorldCenter(), !0);
}
}
});
cc._RF.pop();
}, {} ],
BrickLayout: [ function(e, a) {
"use strict";
cc._RF.push(a, "62398FSMJtHJ55jmSoqf4WF", "BrickLayout");
var n = [ [ cc.v2(-207, 249), cc.v2(-48, 165), cc.v2(180, 230), cc.v2(-213, 10), cc.v2(96, -63), cc.v2(-171, -138), cc.v2(90, 92), cc.v2(241, -247), cc.v2(-10, -199), cc.v2(-255, -255) ], [ cc.v2(-224, 245), cc.v2(-113, 130), cc.v2(149, 50), cc.v2(-213, -105), cc.v2(-48, -167), cc.v2(103, -92), cc.v2(19, 254), cc.v2(251, 203), cc.v2(226, -228), cc.v2(-222, -255) ], [ cc.v2(-101, 209), cc.v2(-247, 140), cc.v2(-41, 8), cc.v2(-236, -30), cc.v2(-115, -182), cc.v2(239, 36), cc.v2(92, 245), cc.v2(52, -186), cc.v2(230, -138), cc.v2(-222, -255) ], [ cc.v2(-224, 211), cc.v2(-11, 249), cc.v2(22, 16), cc.v2(-142, 83), cc.v2(-228, -86), cc.v2(262, 34), cc.v2(188, 195), cc.v2(46, -234), cc.v2(142, -90), cc.v2(-155, -209) ], [ cc.v2(-249, 245), cc.v2(39, 216), cc.v2(106, -66), cc.v2(-92, 114), cc.v2(-182, -38), cc.v2(262, 34), cc.v2(209, 162), cc.v2(238, -211), cc.v2(21, -230), cc.v2(-234, -251) ], [ cc.v2(-144, 222), cc.v2(77, 254), cc.v2(91, -248), cc.v2(-245, 99), cc.v2(-182, -38), cc.v2(247, -104), cc.v2(261, 147), cc.v2(79, 0), cc.v2(-50, -142), cc.v2(-211, -184) ], [ cc.v2(-39, 136), cc.v2(125, 197), cc.v2(127, -206), cc.v2(-224, 237), cc.v2(-232, 50), cc.v2(262, -154), cc.v2(238, 47), cc.v2(8, -13), cc.v2(-60, -217), cc.v2(-196, -115) ], [ cc.v2(-200, 150), cc.v2(94, 205), cc.v2(87, -249), cc.v2(-117, 246), cc.v2(-241, -65), cc.v2(224, -202), cc.v2(261, 110), cc.v2(58, -46), cc.v2(-54, -142), cc.v2(-188, -236) ], [ cc.v2(-242, 238), cc.v2(236, -48), cc.v2(116, 97), cc.v2(-52, 183), cc.v2(-245, -121), cc.v2(224, -202), cc.v2(240, 244), cc.v2(-96, 11), cc.v2(-2, -167), cc.v2(-188, -255) ], [ cc.v2(-146, 225), cc.v2(261, 121), cc.v2(106, 145), cc.v2(-194, 91), cc.v2(-249, -71), cc.v2(126, -254), cc.v2(112, -34), cc.v2(-27, 36), cc.v2(-50, -119), cc.v2(-213, -242) ] ];
cc.Class({
extends: cc.Component,
properties: {
brickPrefab: cc.Prefab,
label: cc.Prefab,
bricksNumber: 0,
label_layout: cc.Node
},
init: function() {
this.bricksNumber = cc.engine.gameModel.bricksNumber;
cc.engine.gameModel.brickArr = [];
this.node.getComponent("cc.Widget").updateAlignment();
this.label_layout.getComponent("cc.Widget").updateAlignment();
for (var e = n[cc.engine.gameModel.random(0, n.length - 1)], a = 0; a < this.bricksNumber; a++) {
var c = null;
c = cc.engine.brickPool.size() > 0 ? cc.engine.brickPool.get() : cc.instantiate(this.brickPrefab);
var l = null;
l = cc.engine.labelPool.size() > 0 ? cc.engine.labelPool.get() : cc.instantiate(this.label);
c.getComponent("brick").init(cc.engine.stageDict[cc.engine.userData.level].gold, l);
var t = e[cc.engine.gameModel.random(0, e.length - 1)];
l.scale = 1;
if (1 == this.bricksNumber) {
t = cc.v2(0, 0);
l.scale = 3;
}
for (var i = 0; cc.engine.gameModel.brickArr[i]; ) if (cc.engine.gameModel.brickArr[i].sub(t).magSqr() > 0) i++; else {
t = e[cc.engine.gameModel.random(0, e.length - 1)];
i = 0;
}
cc.engine.gameModel.brickArr.push(t);
c.x = t.x;
c.y = t.y;
l.x = c.x;
l.y = c.y;
c.parent = this.node;
l.parent = this.label_layout;
}
}
});
cc._RF.pop();
}, {} ],
GameCtl: [ function(e, a) {
"use strict";
cc._RF.push(a, "a337308uxxJva7vh8G06q7Z", "GameCtl");
var n = [ cc.v2(-282.813, -159), cc.v2(-171.383, -100), cc.v2(-50.263, -128) ];
cc.Class({
extends: cc.Component,
properties: {
gameView: e("GameView"),
ball: cc.Prefab,
brickLayout: e("BrickLayout"),
overPanel: e("OverPanel"),
ballLayout: cc.Node,
petLayout: cc.Node,
turnTable: cc.Node,
sign: cc.Node,
money: cc.Node,
bossRed: cc.Node,
task: cc.Node,
boon: cc.Node,
niu: cc.Node,
fenhong: cc.Node,
petPrefab: cc.Prefab,
ballPrefab: cc.Prefab,
offlinePrefab: cc.Prefab,
noGoldPrefab: cc.Prefab,
openRedPop: cc.Prefab,
speedBtn: [ cc.Node ],
attBtn: [ cc.Node ],
clickBtn: [ cc.Node ],
goldBtn: [ cc.Node ],
_speed: 1,
_att: 1,
_gold_rate: 1,
_click: 1,
_buffMap: null,
_offlineTime: 0,
onlineLabel: cc.Label,
_openGameTime: 0,
_tianjiangRed: 0,
tianjianRed: [ cc.Node ],
icon: cc.Sprite,
iconSp: [ cc.SpriteFrame ],
_advejectTime: 0,
avatar: cc.Sprite
},
onLoad: function() {
cc.engine.gameCtl = this;
cc.engine.Toast = cc.find("Canvas/black").getComponent("toast");
cc.engine.redAction = cc.find("Canvas/redaction").getComponent("redaction");
this._buffMap = new Map();
if (cc.engine.gameModel.advcar) {
var e = cc.engine.gameModel.advcar.split(",");
cc.engine.config.chjAdNums = e[0];
cc.engine.config.gdtAdNums = e[1];
}
if (cc.engine.gameModel.hdcar) {
cc.engine.config.hdcar = cc.engine.gameModel.hdcar.split(",");
for (var a = 0; a < cc.engine.config.hdcar.length; ++a) cc.engine.config["hd" + a] = cc.engine.config.hdcar[a];
}
cc.engine.gameModel.offlinetime && (this._offlineTime = Math.round(cc.engine.gameModel.offlinetime) > 7200 ? 7200 : Math.round(cc.engine.gameModel.offlinetime));
null == cc.engine.userData.online && (cc.engine.userData.online = cc.engine.config.online[cc.engine.userData.onlineCount]);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(e) {
e.keyCode === cc.macro.KEY.back && cc.director.end();
});
this.physicsManager = cc.director.getPhysicsManager();
this.startGame();
},
init: function() {
this.physicsManager.enabled = !0;
cc.engine.gameModel.init(cc.engine.stageDict[cc.engine.userData.level].rate + cc.engine.stageDict[cc.engine.userData.level].rate2);
this.brickLayout.init();
this.overPanel.init();
},
createPet: function(e) {
var a = null;
(a = cc.engine.petPool.size() > 0 ? cc.engine.petPool.get() : cc.instantiate(this.petPrefab)).getComponent("Pet").init(e);
a.parent = this.petLayout;
},
createBall: function(e) {
var a = null;
if ("点击" != cc.engine.petDict[e].name) {
(a = cc.engine.ballPool.size() > 0 ? cc.engine.ballPool.get() : cc.instantiate(this.ballPrefab)).parent = this.ballLayout;
a.getComponent("Ball").init(e);
}
},
showTurnTable: function() {
var e = this;
cc.engine.platform.turntable(function(a) {
e.turnTable.getComponent("turnTable").init(a);
e.turnTable.active = !0;
cc.engine.platform.showBannerAd();
});
},
showSign: function(e) {
var a = this;
cc.engine.platform.sign(function() {
a.pauseGame();
a.sign.active = !0;
a.sign.getComponent("sign").init();
e && cc.engine.platform.showBannerAd();
});
},
showMoney: function() {
var e = this;
cc.engine.platform.cash(0, function() {
e.money.getComponent("money").new();
e.money.active = !0;
e.money.getComponent("money").refresh();
if (3 == cc.engine.userData.guideID) {
cc.engine.userData.guideID++;
cc.find("Canvas/guide").getComponent("guide").next();
}
});
},
showBossRed: function(e) {
var a = this;
cc.engine.platform.getRed(cc.engine.config.redType.boss, function() {
a.bossRed.active = !0;
e && cc.engine.platform.showBannerAd();
});
},
showTask: function() {
this.task.getComponent("task").mission();
this.task.active = !0;
this.task.getComponent("task").toggle1.isChecked = !0;
cc.engine.platform.showBannerAd();
},
shwoOnlineRed: function() {
var e = this;
"00:00" == this.onlineLabel.string ? cc.engine.platform.getRed(cc.engine.config.redType.online, function() {
var a = cc.instantiate(e.openRedPop);
a.getComponent("openRedPop").init(cc.engine.config.redType.online);
a.parent = e.node;
}) : cc.engine.Toast.showToast("在线时间不足");
},
showInvite: function() {
this.node.getChildByName("UILayer").getChildByName("share").getComponent("share").init();
},
showBoon: function() {
var e = this;
cc.engine.platform.getBoonDate(function(a) {
e.boon.active = !0;
e.boon.getComponent("boon").init(null, null, 5, 10, a);
});
},
showNiu: function() {
var e = this;
cc.engine.platform.getNiuDate(function(a) {
e.niu.active = !0;
e.niu.getComponent("niu").init(a);
});
},
showFenhong: function() {
var e = this;
cc.engine.platform.getFenhongDate(function(a) {
e.fenhong.active = !0;
e.fenhong.getComponent("fenhong").init(a);
});
},
showIconWeb: function() {
var e = this;
cc.engine.platform.getH5url(function(a) {
e.icon.spriteFrame = e.iconSp[cc.engine.gameModel.random(0, e.iconSp.length - 1)];
cc.engine.platform.showWebView(a);
});
},
upSpeed: function() {
cc.engine.platform.showVideoAd(function(e) {
if (e) {
cc.engine.userData.speedTimestamp = new Date().getTime() + 3e5;
cc.engine.platform.mission("4");
}
});
},
upAtt: function() {
cc.engine.platform.showVideoAd(function(e) {
if (e) {
cc.engine.userData.attTimestamp = new Date().getTime() + 3e5;
cc.engine.platform.mission("4");
}
});
},
upClick: function() {
cc.engine.platform.showVideoAd(function(e) {
if (e) {
cc.engine.userData.clickTimestamp = new Date().getTime() + 3e5;
cc.engine.platform.mission("4");
}
});
},
upGold: function() {
cc.engine.platform.showVideoAd(function(e) {
if (e) {
cc.engine.userData.goldTimestamp = new Date().getTime() + 3e5;
cc.engine.platform.mission("4");
}
});
},
initPet: function(e) {
var a = Object.keys(cc.engine.petDict).length;
a = e;
this.petLayout.getComponent("scrollView").init(2, 2, 10, a);
},
getPet: function() {
this.initPet(13);
this.petLayout.active = !0;
this.petLayout.parent.parent.active = !0;
},
putPet: function() {
this.petLayout.active = !1;
this.petLayout.parent.parent.active = !1;
for (;;) {
cc.engine.petPool.put(this.petLayout.children[0]);
if (0 == this.petLayout.children.length) break;
}
},
startGame: function() {
var e = this;
this.gameView.init(this);
cc.engine.platform.createImg(this.avatar);
this.initPet(13);
var a = 11e3;
try {
cc.engine.userData.petArr.forEach(function(e) {
if (0 == e) throw new Error("end");
a++;
});
} catch (e) {}
var n = a;
this.schedule(function() {
e.createBall(a--);
}, 0, a - 11001, 0);
this.init();
if (this._offlineTime >= 60) {
for (var c = 0; n >= 11002; ) {
c += parseInt(cc.engine.petDict[n].atk * Math.pow(cc.engine.petDict[n].atk_rate, cc.engine.userData.petArr[n - 11001] - 1));
n--;
}
var l = parseInt(c * this._offlineTime * .6);
this.createPop(l, "gold");
cc.engine.audio.playGetNew();
} else 0 == cc.engine.userData.isRed ? this.showBossRed(!0) : 0 == cc.engine.gameModel.sign ? this.showSign(!0) : 1 == cc.engine.gameModel.luckeject ? this.showTurnTable() : 2 == cc.engine.gameModel.luckeject ? this.showBoon() : this.initGuide();
this._appwakenTime = 0;
},
initGuide: function() {
var e = this;
this.scheduleOnce(function() {
if (1 == cc.engine.userData.guideID) if (e.petLayout.children[1] && "等级已满" != e.petLayout.children[1].getComponent("Pet").gold.string) cc.find("Canvas/guide").getComponent("guide").next(e.petLayout.children[1].getComponent("Pet").btn.node); else {
cc.engine.userData.guideID = 2;
if (e.brickLayout.node.children[0]) cc.find("Canvas/guide").getComponent("guide").next(cc.engine.gameCtl.brickLayout.node.children[0]); else {
cc.engine.userData.guideID = 3;
cc.find("Canvas/guide").getComponent("guide").next();
}
} else if (2 == cc.engine.userData.guideID) if (e.brickLayout.node.children[0]) cc.find("Canvas/guide").getComponent("guide").next(cc.engine.gameCtl.brickLayout.node.children[0]); else {
cc.engine.userData.guideID = 3;
cc.find("Canvas/guide").getComponent("guide").next();
} else {
4 == cc.engine.userData.guideID && (cc.engine.userData.guideID = 3);
cc.find("Canvas/guide").getComponent("guide").next();
}
}, .5);
},
createPop: function(e, a) {
var n = cc.instantiate(this.offlinePrefab);
n.getComponent("offline").init(e, a);
n.parent = this.node;
},
showNoGold: function(e) {
var a = cc.instantiate(this.noGoldPrefab);
a.getComponent("noGold").init(e);
a.parent = this.node;
},
pauseGame: function() {
this.physicsManager.enabled = !1;
},
resumeGame: function() {
this.physicsManager.enabled = !0;
},
stopGame: function() {
this.physicsManager.enabled = !1;
this.overPanel.show(0 === cc.engine.gameModel.bricksNumber);
},
onBallContactBrick: function(e, a) {
a.getChildByName("sp").scale = 1;
cc.tween(a.getChildByName("sp")).to(.05, {
scale: .9
}).to(.05, {
scale: 1
}).start();
a.getComponent("brick").refreshNum(e.getComponent("Ball")._ball.key);
},
onBallContactGround: function() {
this.stopGame();
},
onBallContactPaddle: function() {},
onBallContactWall: function() {},
onDestroy: function() {
this.physicsManager.enabled = !1;
},
update: function(e) {
var a = this;
if (1 == cc.engine.gameModel.adveject) {
this._advejectTime += e;
if (this._advejectTime >= 30) {
cc.engine.gameModel.adveject = 0;
cc.engine.platform.showWebView();
}
}
1 == cc.engine.userData.isRed ? cc.find("Canvas/game/top/bossicon").active = !1 : cc.find("Canvas/game/top/bossicon").active = !0;
this._openGameTime += e;
this._appwakenTime += e;
if (!this.deeplink && cc.engine.time && this._appwakenTime >= cc.engine.time) {
this.deeplink = !0;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "deepLinkApp", "(Ljava/lang/String;)V", cc.engine.deeplinkUrl);
}
if (this._openGameTime >= 90 && this._tianjiangRed < 3 && !this.isShowLuck) {
this.isShowLuck = !0;
for (var c = function(e) {
var c = a.tianjianRed[e];
if (!c.getComponent("tianjiang").isShow) {
cc.tween(c).to(3, {
position: n[e]
}).call(function() {
a.isShowLuck = !1;
c.getComponent("tianjiang").isShow = !0;
a._openGameTime = 0;
a._tianjiangRed += 1;
c.getComponent("cc.Animation").play();
}).start();
return "break";
}
}, l = 0; l < 3 && "break" !== c(l); ++l) ;
}
this.onlineLabel.string = cc.engine.gameModel.formatSeconds(1e3 * (cc.engine.userData.online -= e));
"00:00" == this.onlineLabel.string ? this.onlineLabel.node.active = !1 : this.onlineLabel.node.active = !0;
var t = new Date().getTime();
if (!cc.engine.userData.speedTimestamp || t >= cc.engine.userData.speedTimestamp) {
this.speedBtn[0].active = !0;
this.speedBtn[1].active = !1;
if (this._buffMap.get("SPEED")) {
cc.systemEvent.emit("BUFF_EXPIRED", {
btype: "SPEED"
});
this._buffMap.delete("SPEED");
}
} else {
this.speedBtn[0].active = !1;
this.speedBtn[1].active = !0;
this.speedBtn[1].getComponent(cc.Label).string = cc.engine.gameModel.formatSeconds(cc.engine.userData.speedTimestamp - t);
if (!this._buffMap.get("SPEED")) {
this._buffMap.set("SPEED", 1);
cc.systemEvent.emit("BUFF_TAKE_EFFECT", {
btype: "SPEED"
});
}
}
if (!cc.engine.userData.attTimestamp || t >= cc.engine.userData.attTimestamp) {
this.attBtn[0].active = !0;
this.attBtn[1].active = !1;
1 != this._att && (this._att = 1);
} else {
this.attBtn[0].active = !1;
this.attBtn[1].active = !0;
this.attBtn[1].getComponent(cc.Label).string = cc.engine.gameModel.formatSeconds(cc.engine.userData.attTimestamp - t);
1 == this._att && (this._att = 4);
}
if (!cc.engine.userData.clickTimestamp || t >= cc.engine.userData.clickTimestamp) {
this.clickBtn[0].active = !0;
this.clickBtn[1].active = !1;
1 != this._click && (this._click = 1);
} else {
this.clickBtn[0].active = !1;
this.clickBtn[1].active = !0;
this.clickBtn[1].getComponent(cc.Label).string = cc.engine.gameModel.formatSeconds(cc.engine.userData.clickTimestamp - t);
1 == this._click && (this._click = 10);
}
if (!cc.engine.userData.goldTimestamp || t >= cc.engine.userData.goldTimestamp) {
this.goldBtn[0].active = !0;
this.goldBtn[1].active = !1;
1 != this._gold_rate && (this._gold_rate = 1);
} else {
this.goldBtn[0].active = !1;
this.goldBtn[1].active = !0;
this.goldBtn[1].getComponent(cc.Label).string = cc.engine.gameModel.formatSeconds(cc.engine.userData.goldTimestamp - t);
1 == this._gold_rate && (this._gold_rate = 4);
}
}
});
cc._RF.pop();
}, {
BrickLayout: "BrickLayout",
GameView: "GameView",
OverPanel: "OverPanel"
} ],
GameModel: [ function(e, a) {
"use strict";
cc._RF.push(a, "ac11fh/SXFFzZAzJ57bmcvY", "GameModel");
cc.Class({
extends: cc.Component,
properties: {
brickArr: [],
bricksNumber: 0,
progress: 0,
sound: !0,
adVideoId: "",
adBannerId: "",
adInterstitialId: ""
},
init: function(e) {
this.bricksNumber = e;
},
addLevel: function() {
cc.engine.platform.mission("3");
cc.engine.platform.getRed(cc.engine.config.redType.stageUp, function() {
cc.engine.platform.openRed(cc.engine.config.redType.stageUp);
}, 0, 0, cc.engine.stageDict[cc.engine.userData.level].rate + cc.engine.stageDict[cc.engine.userData.level].rate2);
cc.engine.userData.level++;
this.progress = 0;
cc.engine.gameCtl.gameView.updateDate();
},
addGold: function(e, a) {
cc.engine.userData.gold += e;
a || (this.progress += e);
cc.engine.gameCtl.gameView.updateDate();
},
minusBrick: function(e) {
this.bricksNumber > 0 ? this.bricksNumber -= e : this.bricksNumber = 0;
},
isSameDay: function(e, a) {
return new Date(e).setHours(0, 0, 0, 0) === new Date(a).setHours(0, 0, 0, 0);
},
formatSeconds: function(e) {
e <= 0 && (e = 0);
var a = parseInt(e / 1e3), n = 0, c = 0;
if (a > 60) {
n = parseInt(a / 60);
a = parseInt(a % 60);
if (n > 60) {
c = parseInt(n / 60);
n = parseInt(n % 60);
}
}
var l = "" + (a >= 10 ? parseInt(a) : "0" + parseInt(a));
n >= 10 ? l = parseInt(n) + ":" + l : n >= 0 && (l = "0" + parseInt(n) + ":" + l);
c > 0 && (l = parseInt(c) + ":" + l);
return l;
},
random: function(e, a) {
return Math.floor(Math.random() * (a - e + 1) + e);
},
saveUserData: function() {
if (cc.sys.os == cc.sys.OS_ANDROID) cc.engine.http.post("gameCache", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: cc.engine.platform.randomStr(),
gamedata: JSON.stringify(cc.engine.userData),
code: cc.engine.gameModel.code
}, function(e) {
e && "SUCC" == e.return_code ? cc.engine.log("数据保存SUCC！！！") : cc.engine.log("数据保存:::" + JSON.stringify(e));
}); else {
cc.engine.userData.offlineTimestamp = new Date().getTime();
window.localStorage.setItem("userData", JSON.stringify(cc.engine.userData));
}
},
getUserData: function() {
return window.localStorage.getItem("userData") ? JSON.parse(window.localStorage.getItem("userData")) : null;
},
isArray: function(e) {
return "[object Array]" == Object.prototype.toString.call(e);
},
saveAll: function() {
this.saveUserData();
}
});
cc._RF.pop();
}, {} ],
GameView: [ function(e, a) {
"use strict";
cc._RF.push(a, "e4735UW3lFPMoW0rK22obsG", "GameView");
cc.Class({
extends: cc.Component,
properties: {
goldLabel: cc.Label,
levelLabel: cc.Label,
redNum: cc.Label,
diaNum: cc.Label,
progress: cc.ProgressBar,
bgSp: [ cc.SpriteFrame ],
bg: cc.Sprite
},
init: function() {
this.progress.progress = 0;
this.goldLabel.string > 0 || (this.goldLabel.string = cc.engine.userData.gold);
this.levelLabel.string > 1 || (this.levelLabel.string = cc.engine.userData.level);
this.bg.spriteFrame = this.bgSp[parseInt(cc.engine.userData.level / 10) % 2];
},
updateDate: function() {
this.goldLabel.string = cc.engine.config.changeGold(cc.engine.userData.gold, 2);
this.levelLabel.string = cc.engine.userData.level;
this.redNum.string = cc.engine.gameModel.lockmoney ? cc.engine.gameModel.lockmoney : 0;
this.diaNum.string = cc.engine.gameModel.goldcoin ? cc.engine.gameModel.goldcoin : 0;
this.progress.progress = cc.engine.gameModel.progress / (cc.engine.stageDict[cc.engine.userData.level].gold * (cc.engine.stageDict[cc.engine.userData.level].rate + cc.engine.stageDict[cc.engine.userData.level].rate2));
cc.sys.os != cc.sys.OS_ANDROID && cc.engine.gameModel.saveAll();
}
});
cc._RF.pop();
}, {} ],
Http: [ function(e, a) {
"use strict";
cc._RF.push(a, "8b9b8+/FWdJdZPaj2/hirig", "Http");
var n = e("./MD5"), c = function() {};
a.exports = {
baseUrl: "https://kxppp.api.yituogame.com/api/v2/",
token: null,
setToken: function(e) {
this.token = e;
cc.engine.log("token::" + this.token);
},
sortAscciiParam: function(e) {
var a = e, c = new Array(), l = 0;
for (var t in e) {
c[l] = t;
l++;
}
var i = c.sort(), o = {};
for (var t in i) o[i[t]] = e[i[t]];
var b = "";
for (var r in o) b += r + "=" + o[r] + "&";
b = b.substr(0, b.length - 1);
var g = n(b + "&key=I9nm7jIK0nx2K").toUpperCase();
return Object.assign({}, a, {
sign: g
});
},
get: function(e, a, n, l) {
cc.engine.log("start to get");
l = l || c;
a = a || {};
var t = [];
for (var i in a) t.push(i + "=" + a[i]);
var o = new XMLHttpRequest();
o.onreadystatechange = function() {
cc.engine.log("state " + o.readyState + "status " + o.status);
if (4 == o.readyState) if (200 == o.status) {
cc.engine.log("request success " + o.responseText);
var a = JSON.parse(o.responseText);
n(a);
} else {
cc.engine.log(e + " request failed " + o.status);
l();
}
};
e += t.length >= 1 ? "?" + t.join("&") : "";
o.open("GET", this.baseUrl + e, !0);
null != this.token && o.setRequestHeader("authorization", this.token);
o.send();
},
post: function(e, a, n, l) {
l = l || c;
a = a || {};
var t = [], i = this.sortAscciiParam(a);
for (var o in i) t.push(o + "=" + i[o]);
e = this.baseUrl + e + ".php";
cc.engine.log("postURL：" + e);
var b = new XMLHttpRequest();
b.onreadystatechange = function() {
cc.engine.log("postonreadystatechange：：readyState：：" + b.readyState);
cc.engine.log("postonreadystatechange：：status：：" + b.status);
if (4 == b.readyState) {
cc.engine.log("postonreadystatechange：：status：：" + b.status);
if (200 == b.status) {
cc.engine.log("postonreadystatechange：：responseText：：" + b.responseText);
var a = b.responseText ? JSON.parse(b.responseText) : "无返回值";
n(a);
a && a.return_code && "SUCC" != a.return_code && cc.engine.platform.hideBanner();
} else {
cc.engine.log(e + " request failed " + b.status);
l();
}
}
};
b.open("POST", e, !0);
b.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
null != this.token && b.setRequestHeader("authorization", this.token);
cc.engine.log("postonreadystatechange：：param：：" + t);
b.send(t.join("&"));
},
androidGet: function(e, a, n, l) {
cc.engine.log("start to android get");
l = l || c;
a = a || {};
var t = [];
for (var i in a) t.push(i + "=" + a[i]);
var o = new XMLHttpRequest();
o.onreadystatechange = function() {
cc.engine.log("postonreadystatechange：：readyState：：" + o.readyState);
cc.engine.log("postonreadystatechange：：status：：" + o.status);
if (4 == o.readyState) {
cc.engine.log("postonreadystatechange：：status：：" + o.status);
if (200 == o.status) {
cc.engine.log("postonreadystatechange：：responseText：：" + o.responseText);
var a = o.responseText ? JSON.parse(o.responseText) : "无返回值";
n(a);
} else {
cc.engine.log(e + " request failed " + o.status);
l();
}
}
};
e += t.length >= 1 ? "?" + t.join("&") : "";
o.open("GET", e, !0);
null != this.token && o.setRequestHeader("authorization", this.token);
o.send();
}
};
cc._RF.pop();
}, {
"./MD5": "MD5"
} ],
LoadingCtl: [ function(e, a) {
"use strict";
cc._RF.push(a, "48e65JP3ihMkretiVQWY2Qo", "LoadingCtl");
cc.macro.CLEANUP_IMAGE_CACHE = !1;
cc.dynamicAtlasManager.enabled = !0;
var n = e("GameModel"), c = e("Audio");
function l() {
cc.engine = {};
cc.engine.http = e("Http");
cc.engine.platform = e("platform");
cc.engine.config = e("config");
cc.engine.petDict = e("petDict");
cc.engine.stageDict = e("stageDict");
cc.engine.userData = e("userData");
cc.engine.ballPool = new cc.NodePool();
cc.engine.gameModel = new n();
cc.engine.audio = new c();
cc.engine.log = function(e) {
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "logs", "(Ljava/lang/String;)V", e) : console.log(e);
};
}
cc.Class({
extends: cc.Component,
properties: {
ball: cc.Prefab,
brick: cc.Prefab,
pet: cc.Prefab,
label: cc.Prefab,
progress: cc.ProgressBar,
wxBtn: cc.Node,
islogin: !1,
_time: 0,
_res: 0,
_allRes: 0
},
onLoad: function() {
var e = this;
l();
cc.engine.log("ONLOADGAME!!!!!!!!");
var a = this;
window.NativeBridge = {
rewardedAdCallback: function(e) {
cc.engine.video = null;
cc.engine.platform.mission("5");
cc.engine.videoCallback && cc.engine.videoCallback(e);
cc.engine.videoCallback = null;
},
wxLogin: function(e, n, c, l) {
cc.engine.log(n + "javaResp------" + e);
cc.engine.platform.login(e, n, c, l, function() {
a.islogin = !0;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "loginSucc", "(Ljava/lang/String;)V", cc.engine.packagename);
cc.engine.log("登录成功！！！");
window.localStorage.clear();
window.localStorage.setItem("isLogin", "isLogin");
cc.engine.platform.sendUmengEvent("IsLogin", "login", "SUCC");
cc.engine.platform.getNiuDate();
});
},
appDeepLink: function(e, a) {
cc.engine.http.androidGet("http://api.dp.durianclicks.com/validate/imei", {
product: cc.engine.product,
channel_name: cc.engine.channel_name,
imeis: e,
oaids: a
}, function(e) {
0 == e.errno && e.data && e.data.length > 0 && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "deepLinkOk", "()V");
});
},
saveData: function() {
cc.engine.gameModel.saveAll();
}
};
cc.engine.platform.init();
cc.engine.audio.playBGM();
this.progress.progress = 0;
this.wxBtn.active = !1;
for (var n = 10, c = 0; c < n; ++c) {
var t = cc.instantiate(this.ball);
cc.engine.ballPool.put(t);
}
cc.engine.brickPool = new cc.NodePool();
n = 10;
for (var i = 0; i < n; ++i) {
var o = cc.instantiate(this.brick);
cc.engine.brickPool.put(o);
}
cc.engine.petPool = new cc.NodePool();
n = 10;
for (var b = 0; b < n; ++b) {
var r = cc.instantiate(this.pet);
cc.engine.petPool.put(r);
}
cc.engine.labelPool = new cc.NodePool();
n = 10;
for (var g = 0; g < n; ++g) {
var h = cc.instantiate(this.label);
cc.engine.labelPool.put(h);
}
this._allRes = 2;
if (cc.sys.platform == cc.sys.WECHAT_GAME) {
this._allRes = 3;
wx.loadSubpackage({
name: "resources",
success: function(a) {
e._res += 1;
cc.engine.log("resources加载成功", JSON.stringify(a));
cc.resources.loadDir("ball", cc.SpriteFrame, null, function() {
e._res += 1;
});
cc.resources.loadDir("brick", cc.SpriteFrame, null, function() {
e._res += 1;
});
wx.loadSubpackage({
name: "effect",
success: function(e) {
cc.engine.log("effect加载成功", JSON.stringify(e));
},
fail: function(e) {
cc.engine.log("effect加载失败", JSON.stringify(e));
}
});
},
fail: function(e) {
cc.engine.log("resources加载失败", JSON.stringify(e));
}
}).onProgressUpdate(function(a) {
cc.engine.log("下载进度", a.progress);
cc.engine.log("已经下载的数据长度", a.totalBytesWritten);
cc.engine.log("预期需要下载的数据总长度", a.totalBytesExpectedToWrite);
e.progress.progress = a.progress;
});
} else {
cc.resources.loadDir("ball", cc.SpriteFrame, null, function() {
e._res += 1;
});
cc.resources.loadDir("brick", cc.SpriteFrame, null, function() {
e._res += 1;
});
cc.director.preloadScene("game", function(a, n) {
e.progress.progress = a / n;
}, function(a) {
cc.sys.os == cc.sys.OS_ANDROID && window.localStorage.getItem("isLogin") && e.wxLogin();
cc.engine.log(JSON.stringify(a) + "场景预加载完成");
});
}
cc.sys.os == cc.sys.OS_ANDROID ? cc.engine.log("wechatLogin start") : this.islogin = !0;
},
wxLogin: function() {
jsb.reflection.callStaticMethod("org/pinball/games/wxapi/WXAPI", "Login", "()V");
},
start: function() {},
update: function() {
if (this.progress.progress >= 1) {
this.progress.progress = 1;
if (cc.sys.os == cc.sys.OS_ANDROID && !window.localStorage.getItem("isLogin")) {
this.wxBtn.active = !0;
this.progress.node.active = !1;
}
if (this._res == this._allRes && this.islogin) {
this.islogin = !1;
this.wxBtn.active = !1;
cc.director.loadScene("game");
cc.engine.log("加载游戏场景");
}
}
}
});
cc._RF.pop();
}, {
Audio: "Audio",
GameModel: "GameModel",
Http: "Http",
config: "config",
petDict: "petDict",
platform: "platform",
stageDict: "stageDict",
userData: "userData"
} ],
MD5: [ function(e, a) {
"use strict";
cc._RF.push(a, "b3fb5KOYtZL9Khx2U33nmIP", "MD5");
(function() {
function e(e, a) {
var n = (65535 & e) + (65535 & a);
return (e >> 16) + (a >> 16) + (n >> 16) << 16 | 65535 & n;
}
function n(a, n, c, l, t, i) {
return e((o = e(e(n, a), e(l, i))) << (b = t) | o >>> 32 - b, c);
var o, b;
}
function c(e, a, c, l, t, i, o) {
return n(a & c | ~a & l, e, a, t, i, o);
}
function l(e, a, c, l, t, i, o) {
return n(a & l | c & ~l, e, a, t, i, o);
}
function t(e, a, c, l, t, i, o) {
return n(a ^ c ^ l, e, a, t, i, o);
}
function i(e, a, c, l, t, i, o) {
return n(c ^ (a | ~l), e, a, t, i, o);
}
function o(a, n) {
a[n >> 5] |= 128 << n % 32;
a[14 + (n + 64 >>> 9 << 4)] = n;
var o, b, r, g, h, d = 1732584193, s = -271733879, m = -1732584194, y = 271733878;
for (o = 0; o < a.length; o += 16) {
b = d;
r = s;
g = m;
h = y;
d = c(d, s, m, y, a[o], 7, -680876936);
y = c(y, d, s, m, a[o + 1], 12, -389564586);
m = c(m, y, d, s, a[o + 2], 17, 606105819);
s = c(s, m, y, d, a[o + 3], 22, -1044525330);
d = c(d, s, m, y, a[o + 4], 7, -176418897);
y = c(y, d, s, m, a[o + 5], 12, 1200080426);
m = c(m, y, d, s, a[o + 6], 17, -1473231341);
s = c(s, m, y, d, a[o + 7], 22, -45705983);
d = c(d, s, m, y, a[o + 8], 7, 1770035416);
y = c(y, d, s, m, a[o + 9], 12, -1958414417);
m = c(m, y, d, s, a[o + 10], 17, -42063);
s = c(s, m, y, d, a[o + 11], 22, -1990404162);
d = c(d, s, m, y, a[o + 12], 7, 1804603682);
y = c(y, d, s, m, a[o + 13], 12, -40341101);
m = c(m, y, d, s, a[o + 14], 17, -1502002290);
d = l(d, s = c(s, m, y, d, a[o + 15], 22, 1236535329), m, y, a[o + 1], 5, -165796510);
y = l(y, d, s, m, a[o + 6], 9, -1069501632);
m = l(m, y, d, s, a[o + 11], 14, 643717713);
s = l(s, m, y, d, a[o], 20, -373897302);
d = l(d, s, m, y, a[o + 5], 5, -701558691);
y = l(y, d, s, m, a[o + 10], 9, 38016083);
m = l(m, y, d, s, a[o + 15], 14, -660478335);
s = l(s, m, y, d, a[o + 4], 20, -405537848);
d = l(d, s, m, y, a[o + 9], 5, 568446438);
y = l(y, d, s, m, a[o + 14], 9, -1019803690);
m = l(m, y, d, s, a[o + 3], 14, -187363961);
s = l(s, m, y, d, a[o + 8], 20, 1163531501);
d = l(d, s, m, y, a[o + 13], 5, -1444681467);
y = l(y, d, s, m, a[o + 2], 9, -51403784);
m = l(m, y, d, s, a[o + 7], 14, 1735328473);
d = t(d, s = l(s, m, y, d, a[o + 12], 20, -1926607734), m, y, a[o + 5], 4, -378558);
y = t(y, d, s, m, a[o + 8], 11, -2022574463);
m = t(m, y, d, s, a[o + 11], 16, 1839030562);
s = t(s, m, y, d, a[o + 14], 23, -35309556);
d = t(d, s, m, y, a[o + 1], 4, -1530992060);
y = t(y, d, s, m, a[o + 4], 11, 1272893353);
m = t(m, y, d, s, a[o + 7], 16, -155497632);
s = t(s, m, y, d, a[o + 10], 23, -1094730640);
d = t(d, s, m, y, a[o + 13], 4, 681279174);
y = t(y, d, s, m, a[o], 11, -358537222);
m = t(m, y, d, s, a[o + 3], 16, -722521979);
s = t(s, m, y, d, a[o + 6], 23, 76029189);
d = t(d, s, m, y, a[o + 9], 4, -640364487);
y = t(y, d, s, m, a[o + 12], 11, -421815835);
m = t(m, y, d, s, a[o + 15], 16, 530742520);
d = i(d, s = t(s, m, y, d, a[o + 2], 23, -995338651), m, y, a[o], 6, -198630844);
y = i(y, d, s, m, a[o + 7], 10, 1126891415);
m = i(m, y, d, s, a[o + 14], 15, -1416354905);
s = i(s, m, y, d, a[o + 5], 21, -57434055);
d = i(d, s, m, y, a[o + 12], 6, 1700485571);
y = i(y, d, s, m, a[o + 3], 10, -1894986606);
m = i(m, y, d, s, a[o + 10], 15, -1051523);
s = i(s, m, y, d, a[o + 1], 21, -2054922799);
d = i(d, s, m, y, a[o + 8], 6, 1873313359);
y = i(y, d, s, m, a[o + 15], 10, -30611744);
m = i(m, y, d, s, a[o + 6], 15, -1560198380);
s = i(s, m, y, d, a[o + 13], 21, 1309151649);
d = i(d, s, m, y, a[o + 4], 6, -145523070);
y = i(y, d, s, m, a[o + 11], 10, -1120210379);
m = i(m, y, d, s, a[o + 2], 15, 718787259);
s = i(s, m, y, d, a[o + 9], 21, -343485551);
d = e(d, b);
s = e(s, r);
m = e(m, g);
y = e(y, h);
}
return [ d, s, m, y ];
}
function b(e) {
var a, n = "", c = 32 * e.length;
for (a = 0; a < c; a += 8) n += String.fromCharCode(e[a >> 5] >>> a % 32 & 255);
return n;
}
function r(e) {
var a, n = [];
n[(e.length >> 2) - 1] = void 0;
for (a = 0; a < n.length; a += 1) n[a] = 0;
var c = 8 * e.length;
for (a = 0; a < c; a += 8) n[a >> 5] |= (255 & e.charCodeAt(a / 8)) << a % 32;
return n;
}
function g(e) {
return b(o(r(e), 8 * e.length));
}
function h(e, a) {
var n, c, l = r(e), t = [], i = [];
t[15] = i[15] = void 0;
l.length > 16 && (l = o(l, 8 * e.length));
for (n = 0; n < 16; n += 1) {
t[n] = 909522486 ^ l[n];
i[n] = 1549556828 ^ l[n];
}
c = o(t.concat(r(a)), 512 + 8 * a.length);
return b(o(i.concat(c), 640));
}
function d(e) {
var a, n, c = "";
for (n = 0; n < e.length; n += 1) {
a = e.charCodeAt(n);
c += "0123456789abcdef".charAt(a >>> 4 & 15) + "0123456789abcdef".charAt(15 & a);
}
return c;
}
function s(e) {
return unescape(encodeURIComponent(e));
}
function m(e) {
return g(s(e));
}
function y(e, a) {
return h(s(e), s(a));
}
function _(e, a, n) {
return a ? n ? y(a, e) : d(y(a, e)) : n ? m(e) : d(m(e));
}
"function" == typeof define && define.amd ? define(function() {
return _;
}) : "object" == typeof a && a.exports ? a.exports = _ : (void 0).md5 = _;
})();
cc._RF.pop();
}, {} ],
OverPanel: [ function(e, a) {
"use strict";
cc._RF.push(a, "60425zRIQ5LNIZ6KmZ5p/LN", "OverPanel");
cc.Class({
extends: cc.Component,
properties: {},
init: function() {
this.node.active = !1;
},
show: function(e) {
this.node.active = !0;
e && cc.engine.gameModel.addLevel();
setTimeout(function() {
cc.engine.gameCtl.init();
}, 0);
}
});
cc._RF.pop();
}, {} ],
Pet: [ function(e, a) {
"use strict";
cc._RF.push(a, "1c553xsZG1G3qP1bCTmiI95", "Pet");
cc.Class({
extends: cc.Component,
properties: {
_key: 0,
gold: cc.Label,
btn: cc.Button,
att: cc.Label,
level: cc.Label,
nameNode: cc.Label,
levelUp: cc.Prefab,
upSp: cc.SpriteFrame,
up: cc.Sprite
},
start: function() {},
init: function(e) {
var a = this;
this._key = e;
cc.resources.load("ball/" + cc.engine.petDict[e].icon, cc.SpriteFrame, function(e, n) {
n && (a.node.getChildByName("ballSp").getComponent("cc.Sprite").spriteFrame = n);
});
this.nameNode.string = cc.engine.petDict[e].name;
if (0 == cc.engine.userData.petArr[this._key - 11001]) {
cc.resources.load("ball/" + cc.engine.petDict[cc.engine.petDict[e].unlock_key].icon, cc.SpriteFrame, function(e, n) {
n && (a.up.spriteFrame = n);
});
this.gold.string = "Lv." + cc.engine.petDict[this._key].unlock_level;
this.att.string = "";
this.level.string = "Lv.0";
this.btn.interactable = !1;
} else {
this.up.spriteFrame = this.upSp;
var n = parseInt(cc.engine.petDict[this._key].gold * Math.pow(cc.engine.petDict[this._key].rate, cc.engine.userData.petArr[this._key - 11001] - 1));
this.gold.string = cc.engine.config.changeGold(n, 2);
var c = parseInt(cc.engine.petDict[this._key].atk * Math.pow(cc.engine.petDict[this._key].atk_rate, cc.engine.userData.petArr[this._key - 11001] - 1));
this.att.string = "伤害：" + cc.engine.config.changeGold(c, 2);
this.level.string = "Lv." + cc.engine.userData.petArr[this._key - 11001];
this.btn.interactable = !0;
}
},
createLevelUp: function(e) {
var a = this;
this.levelUpAnim && this.levelUpAnim.isValid && this.levelUpAnim.destroy();
this.levelUpAnim = cc.instantiate(this.levelUp);
this.levelUpAnim.getComponent(cc.Animation).on("finished", function() {
a.levelUpAnim.destroy();
}, this);
this.levelUpAnim.parent = e;
this.levelUpAnim.getComponent(cc.Animation).play();
},
btnClick: function() {
if (1 == cc.engine.userData.guideID) {
cc.engine.userData.guideID++;
if (cc.engine.gameCtl.brickLayout.node.children[0]) cc.find("Canvas/guide").getComponent("guide").next(cc.engine.gameCtl.brickLayout.node.children[0]); else {
cc.engine.userData.guideID = 3;
cc.find("Canvas/guide").getComponent("guide").next();
}
}
if ("点击" != cc.engine.petDict[this._key].name && 0 == cc.engine.userData.petArr[this._key - 11001]) {
cc.engine.gameCtl.createBall(this._key);
cc.engine.gameCtl.createPop(this._key, "tip");
cc.engine.audio.playGetNew();
} else {
var e = parseInt(cc.engine.petDict[this._key].gold * Math.pow(cc.engine.petDict[this._key].rate, cc.engine.userData.petArr[this._key - 11001] - 1));
if (!(e <= cc.engine.userData.gold)) {
cc.engine.log("金币不足");
e -= cc.engine.userData.gold;
cc.engine.gameCtl.showNoGold(e);
return;
}
cc.engine.gameModel.addGold(-e, "useGold");
cc.engine.audio.playLevel();
}
this.createLevelUp(this.node);
cc.engine.userData.petArr[this._key - 11001]++;
e = parseInt(cc.engine.petDict[this._key].gold * Math.pow(cc.engine.petDict[this._key].rate, cc.engine.userData.petArr[this._key - 11001] - 1));
this.gold.string = cc.engine.config.changeGold(e, 2);
var a = parseInt(cc.engine.petDict[this._key].atk * Math.pow(cc.engine.petDict[this._key].atk_rate, cc.engine.userData.petArr[this._key - 11001] - 1));
this.att.string = "伤害：" + cc.engine.config.changeGold(a, 2);
this.level.string = "Lv." + cc.engine.userData.petArr[this._key - 11001];
cc.engine.platform.mission("2");
},
update: function() {
if (!this.btn.interactable && cc.engine.petDict[this._key] && (0 == cc.engine.petDict[this._key].unlock_key || cc.engine.petDict[this._key].unlock_level <= cc.engine.userData.petArr[cc.engine.petDict[this._key].unlock_key - 11001])) {
this.btn.interactable = !0;
this.gold.string = "解锁";
this.up.spriteFrame = this.upSp;
}
}
});
cc._RF.pop();
}, {} ],
boon: [ function(e, a) {
"use strict";
cc._RF.push(a, "81eadVY8jxLdbZL97mIOuus", "boon");
var n = [ {
id: 1
}, {
id: 2
}, {
id: 3
}, {
id: 4
}, {
id: 5
}, {
id: 6
}, {
id: 7
}, {
id: 8
} ], c = [ {
index: 0,
next: 1
}, {
index: 1,
next: 2
}, {
index: 2,
next: 3
}, {
index: 3,
next: 4
}, {
index: 4,
next: 5
}, {
index: 5,
next: 6
}, {
index: 6,
next: 7
}, {
index: 7,
next: 0
} ];
cc.Class({
extends: cc.Component,
properties: {
scrollView: cc.ScrollView,
ischeck: cc.Node,
items: [ cc.Node ],
itemPros: [ cc.Node ],
nums: cc.Label,
btnsSp: [ cc.SpriteFrame ],
jieshao: cc.Node,
getNode: cc.Node,
getItem: cc.Prefab,
addressNode: cc.Node,
saveLabel: cc.Node,
addressNodes: [ cc.EditBox ],
content: cc.Node
},
start: function() {},
init: function(e, a, l, t, i) {
this.boonData = i;
a = a || c;
this.RotateDir = JSON.parse(JSON.stringify(a));
e = e || n;
this.DataArr = JSON.parse(JSON.stringify(e));
this.maxSpeed = 4;
this.cycleNumber = l || 2;
this.myReq;
this.defaultSpeed = t || 15;
for (var o = 0; o < a.length; o++) {
var b = a[o], r = b.index, g = b.next;
if ("undefined" != typeof this.DataArr[r].next) {
console.error("RotateDir is error");
return;
}
this.DataArr[r].next = this.DataArr[g];
}
this.refreshData();
},
refreshData: function() {
this.nums.string = this.boonData.freenums;
this.boonData.freenums <= 7 ? this.node.getChildByName("boonbg").getChildByName("btn").getComponent("cc.Sprite").spriteFrame = this.btnsSp[0] : this.node.getChildByName("boonbg").getChildByName("btn").getComponent("cc.Sprite").spriteFrame = this.btnsSp[1];
for (var e = 0; e < this.RotateDir.length; ++e) {
this.itemPros[e].getComponent("cc.ProgressBar").progress = parseInt(this.boonData.prizeList[e].havenums) / this.boonData.prizeList[e].totalnums;
this.itemPros[e].getChildByName("num").getComponent("cc.Label").string = parseInt(this.boonData.prizeList[e].havenums) + "/" + this.boonData.prizeList[e].totalnums;
this.itemPros[e].getComponent("cc.ProgressBar").progress >= 1 ? this.itemPros[e].getChildByName.getBtn && (this.itemPros[e].getChildByName.getBtn.active = !0) : this.itemPros[e].getChildByName.getBtn && (this.itemPros[e].getChildByName.getBtn.active = !1);
}
},
cash: function() {
var e = this;
cc.engine.platform.getBoonDate(function(a) {
e.init(null, null, 5, 10, a);
});
},
run: function(e, a, n) {
for (var c = 0, l = 0, t = 0, i = this.DataArr[0], o = this.DataArr[0]; ;) {
if (t > this.DataArr.length) {
console.error(e + "不存在");
return;
}
if (o.id == e) break;
o = o.next;
t++;
}
var b = this.cycleNumber * this.DataArr.length + t, r = this.defaultSpeed - this.maxSpeed, g = b - (this.defaultSpeed - this.maxSpeed);
this.running = a;
this.runend = n;
var h = this;
this.running(i);
this.myReq = requestAnimationFrame(function e() {
if (c < r) if (l < Math.pow(h.defaultSpeed - c, 2)) l += h.defaultSpeed / 2; else {
l = 0;
c++;
i = i.next;
h.running(i);
}
if (c >= r && c < g) if (l < h.maxSpeed) l++; else {
l = 0;
c++;
i = i.next;
h.running(i);
}
if (c >= g && c < b) if (Math.sqrt(l) <= h.defaultSpeed - (b - c)) l += 2; else {
l = 0;
c++;
i = i.next;
h.running(i);
}
if (c >= b) {
h.runend(i);
cancelAnimationFrame(h.myReq);
} else h.myReq = requestAnimationFrame(e);
});
},
click: function() {
var e = this;
if (!this.isRun) {
var a = function(a) {
e.isRun = !0;
e.run(a.prizeId + 1, function(a) {
e.rewardId = a.id;
e.ischeck.x = e.items[e.rewardId - 1].x;
e.ischeck.y = e.items[e.rewardId - 1].y + 5;
}, function(n) {
e.rewardId = n.id;
e.isRun = !1;
e.init(null, null, 5, 10, a);
cc.engine.Toast.showToast("恭喜获得" + e.boonData.prizeList[a.prizeId].name + "碎片");
});
};
this.boonData.freenums > 0 && this.boonData.freenums <= 7 ? cc.engine.platform.showVideoAd(function(n) {
n ? cc.engine.platform.getBoonDate(a, !0, !0) : e.isRun = !1;
}) : this.boonData.freenums > 7 ? cc.engine.platform.getBoonDate(a, !0) : cc.engine.Toast.showToast("抽奖次数不足，每日凌晨5点重置抽奖次数");
}
},
close: function() {
if (!this.isRun) {
this.node.active = !1;
this.scrollView.scrollToTop(0);
cc.engine.gameCtl.initGuide();
}
},
showJieshao: function() {
this.jieshao.active = !0;
},
closeJieshao: function() {
this.jieshao.active = !1;
},
showAddress: function() {
this.addressNode.active = !0;
this.addressNodes[0].string = cc.engine.userData.address1;
this.addressNodes[1].string = cc.engine.userData.address2;
this.addressNodes[2].string = cc.engine.userData.address3;
},
closeAddress: function() {
this.addressNode.active = !1;
},
saveAddress: function() {
var e = this;
this.saveLabel.active = !0;
this.saveLabel.position = cc.v2(0, 310);
cc.tween(this.saveLabel).to(.1, {
position: cc.v2(0, 410)
}, {
easing: "bounceInOut"
}).delay(1.9).call(function() {
e.saveLabel.active = !1;
e.saveLabel.position = cc.v2(0, 310);
}).start();
cc.engine.userData.address1 = this.addressNodes[0].string;
cc.engine.userData.address2 = this.addressNodes[1].string;
cc.engine.userData.address3 = this.addressNodes[2].string;
},
showGet: function() {
this.getNode.active = !0;
this.content.removeAllChildren();
for (var e = this.boonData.record.split(","), a = 0; a < e.length; ++a) {
var n = cc.instantiate(this.getItem), c = e[a].split("_");
n.getChildByName("time").getComponent(cc.Label).string = c[1];
n.getChildByName("item").getComponent(cc.Label).string = c[0];
n.getChildByName("count").getComponent(cc.Label).string = c[2];
this.content.addChild(n);
}
},
closeGet: function() {
this.getNode.active = !1;
}
});
cc._RF.pop();
}, {} ],
bossRed: [ function(e, a) {
"use strict";
cc._RF.push(a, "69179XViJ5GiY3ioP3qrhTd", "bossRed");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
open: function() {
var e = this;
cc.engine.platform.showVideoAd(function(a) {
if (a) {
cc.engine.platform.openRed(cc.engine.config.redType.boss, null, "1");
e.close();
}
});
},
close: function() {
this.node.active = !1;
if (0 == cc.engine.gameModel.sign) cc.engine.gameCtl.showSign(); else if (1 == cc.engine.gameModel.luckeject) cc.engine.gameCtl.showTurnTable(); else if (2 == cc.engine.gameModel.luckeject) cc.engine.gameCtl.showBoon(); else {
cc.engine.gameCtl.initGuide();
cc.engine.platform.hideBanner();
}
}
});
cc._RF.pop();
}, {} ],
brick: [ function(e, a) {
"use strict";
cc._RF.push(a, "52ca528riNLdoC5KWQMdpSv", "brick");
cc.Class({
extends: cc.Component,
properties: {
_numLabel: cc.Label,
num: 0,
click: cc.Prefab,
bomb: cc.Prefab
},
onLoad: function() {
this.node.on("touchend", this.touchClick, this);
},
start: function() {},
createClick: function(e) {
var a = this;
this.clickAnim && this.clickAnim.destroy();
this.clickAnim = cc.instantiate(this.click);
this.clickAnim.position = this.node.position;
var n = function() {
a.clickAnim.destroy();
};
this.clickAnim.getComponent(dragonBones.ArmatureDisplay).on(dragonBones.EventObject.COMPLETE, n, this);
this.clickAnim.onDestroy = function() {
a.clickAnim.getComponent(dragonBones.ArmatureDisplay).off(dragonBones.EventObject.COMPLETE, n(), a);
};
this.clickAnim.parent = this.node.parent;
this.clickAnim.scale = e;
this.clickAnim.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimation");
},
touchClick: function() {
if (2 == cc.engine.userData.guideID) {
cc.engine.userData.guideID++;
cc.find("Canvas/guide").getComponent("guide").next();
}
var e = 1;
cc.engine.userData.level % 10 == 0 && (e = 3);
this.createClick(e);
this.node.getChildByName("sp").scale = 1;
cc.tween(this.node.getChildByName("sp")).to(.05, {
scale: .9
}).to(.05, {
scale: 1
}).start();
this._numLabel.node.scale = e;
cc.tween(this._numLabel.node).to(.05, {
scale: .9 * e
}).to(.05, {
scale: e
}).start();
var a = parseInt(cc.engine.petDict[11001].atk * Math.pow(cc.engine.petDict[11001].atk_rate, cc.engine.userData.petArr[0] - 1));
a *= cc.engine.gameCtl._click;
if (this.num > 0 && this.node.parent) {
cc.engine.audio.playHit();
this.num > a ? cc.engine.gameModel.addGold(a * cc.engine.gameCtl._gold_rate) : cc.engine.gameModel.addGold(this.num * cc.engine.gameCtl._gold_rate);
this.num -= a > this.num ? this.num : a;
this._numLabel.string = cc.engine.config.changeGold(this.num, 2);
this.num <= 0 && this.remove();
}
},
init: function(e, a) {
var n = this, c = "brick/brick_" + cc.engine.userData.level % 10;
a.scale = 1;
if (cc.engine.userData.level % 10 == 0) {
c = "boss/boss_1";
a.scale = 3;
}
cc.resources.load(c, cc.SpriteFrame, function(e, a) {
a && (n.node.getChildByName("sp").getComponent("cc.Sprite").spriteFrame = a);
n.node.width = n.node.getChildByName("sp").width;
n.node.height = n.node.getChildByName("sp").height;
n.node.getComponent(cc.PhysicsCircleCollider).radius = n.node.getChildByName("sp").width > n.node.getChildByName("sp").height ? n.node.getChildByName("sp").height / 2 : n.node.getChildByName("sp").width / 2;
n.node.getComponent(cc.PhysicsCircleCollider).apply();
});
this._numLabel = a.getComponent("cc.Label");
this.num = parseInt(e);
this._numLabel.string = cc.engine.config.changeGold(this.num, 2);
},
refreshNum: function(e) {
var a = 1;
cc.engine.userData.level % 10 == 0 && (a = 3);
this._numLabel.node.scale = a;
cc.tween(this._numLabel.node).to(.05, {
scale: .9 * a
}).to(.05, {
scale: a
}).start();
var n = parseInt(cc.engine.petDict[e].atk * Math.pow(cc.engine.petDict[e].atk_rate, cc.engine.userData.petArr[e - 11001] - 1));
n *= cc.engine.gameCtl._att;
if (this.num > 0 && this.node.parent) {
cc.engine.audio.playHit();
this.num > n ? cc.engine.gameModel.addGold(n * cc.engine.gameCtl._gold_rate) : cc.engine.gameModel.addGold(this.num * cc.engine.gameCtl._gold_rate);
this.num -= n > this.num ? this.num : n;
this._numLabel.string = cc.engine.config.changeGold(this.num, 2);
this.num <= 0 && this.remove();
}
},
createBomb: function() {
var e = 1;
cc.engine.userData.level % 10 == 0 && (e = 2);
var a = cc.instantiate(this.bomb);
a.position = this.node.position;
a.getComponent(cc.Animation).on("finished", function() {
a.destroy();
cc.engine.gameModel.minusBrick(1);
if (cc.engine.gameModel.bricksNumber <= 0) {
cc.engine.audio.playPass();
cc.engine.gameCtl.stopGame();
}
}, this);
a.parent = this.node.parent;
a.scale = e;
a.getComponent(cc.Animation).play();
},
remove: function() {
cc.engine.redAction.showRedAction(this.node);
cc.engine.gameModel.lockmoney = parseInt(cc.engine.gameModel.lockmoney) + 1;
cc.engine.gameCtl.gameView.updateDate();
this.createBomb();
cc.engine.brickPool.put(this.node);
cc.engine.labelPool.put(this._numLabel.node);
}
});
cc._RF.pop();
}, {} ],
config: [ function(e, a) {
"use strict";
cc._RF.push(a, "ff11d+rqV1PXbg4Et3w4skL", "config");
var n = {
appid: "wxc1237e9442f71a99",
online: [ 60, 180, 300, 420, 540, 660, 780, 900 ],
redType: {
boss: "1",
online: "2",
sign: "3",
stageUp: "4",
luck: "5",
task: "6",
achieve: "7",
levelUp: "8",
turn: "9"
},
turnWeight: [ 1e3, 2500, 5e3, 6500, 7e3, 1e4 ],
rewards: {
0: {
type: "gold",
count: 300
},
1: {
type: "red",
count: 100
},
2: {
type: "gold",
count: 600
},
3: {
type: "red",
count: 200
},
4: {
type: "gold",
count: 900
},
5: {
type: "red",
count: 300
}
},
msg: {},
chjAdNums: null,
gdtAdNums: null,
changeGold: function(e, a) {
return e >= 1e3 && e < 1e6 ? (e /= 1e3).toFixed(a) + "k" : e >= 1e6 && e < 1e9 ? (e /= 1e6).toFixed(a) + "m" : e >= 1e9 && e < 1e12 ? (e /= 1e9).toFixed(a) + "b" : e >= 1e12 && e < Math.pow(10, 15) ? (e /= 1e12).toFixed(a) + "t" : e >= Math.pow(10, 15) && e < Math.pow(10, 18) ? (e /= Math.pow(10, 15)).toFixed(a) + "aa" : e >= Math.pow(10, 18) && e < Math.pow(10, 21) ? (e /= Math.pow(10, 18)).toFixed(a) + "bb" : e >= Math.pow(10, 21) && e < Math.pow(10, 24) ? (e /= Math.pow(10, 21)).toFixed(a) + "cc" : e >= Math.pow(10, 24) && e < Math.pow(10, 27) ? (e /= Math.pow(10, 24)).toFixed(a) + "dd" : e >= Math.pow(10, 27) && e < Math.pow(10, 30) ? (e /= Math.pow(10, 27)).toFixed(a) + "ee" : e >= Math.pow(10, 30) ? (e /= Math.pow(10, 30)).toFixed(a) + "ff" : e < 1e3 ? Math.floor(e) : void 0;
}
};
a.exports = n;
cc._RF.pop();
}, {} ],
danmu: [ function(e, a) {
"use strict";
cc._RF.push(a, "b7bc0HQ2ghIXYnVmaqKD7uW", "danmu");
var n = [ "139", "187", "166", "134", "170", "151", "135", "136", "173", "185" ], c = [ "4.1", "9.1", "29.1", "304.1", "309.1", "329.1", "504.1", "509.1", "529.1" ];
cc.Class({
extends: cc.Component,
properties: {
bulletPrefab: cc.Prefab
},
onLoad: function() {
this.bulletsArray = [];
},
start: function() {},
spawnBullets: function() {
this.node.removeAllChildren();
this.bulletsArray = [];
for (var e = Math.round(4 * Math.random()), a = 0; a < e; ++a) {
var n = cc.instantiate(this.bulletPrefab);
this.bulletsArray.push(n);
this.node.addChild(n);
n.x = this.node.width / 2;
n.getComponent(cc.Label).string = this.randomContent();
n.color = this.randomColor();
n.speed = this.randomSpeed();
n.y = this.randomStartPosY();
}
},
randomColor: function() {
var e = Math.round(255 * Math.random()), a = Math.round(255 * Math.random()), n = Math.round(255 * Math.random());
return new cc.Color(e, a, n);
},
randomContent: function() {
var e = Math.round(Math.random() * (n.length - 1));
return "恭喜玩家" + n[e] + "****" + Math.round(9 * Math.random()) + Math.round(9 * Math.random()) + Math.round(9 * Math.random()) + Math.round(9 * Math.random()) + "成功累计提现" + c[cc.engine.gameModel.random(0, c.length - 1)] + "元";
},
randomSpeed: function() {
return Math.round(100 * Math.random()) + 50;
},
randomStartPosY: function() {
var e = this.node.height;
return Math.round(Math.random() * e * .25) + .15 * e;
},
update: function(e) {
for (var a = [], n = 0; n < this.bulletsArray.length; n++) {
this.bulletsArray[n].x -= e * this.bulletsArray[n].speed;
if (this.bulletsArray[n].x <= -(this.node.width / 2 + this.bulletsArray[n].width)) {
this.bulletsArray[n].removeFromParent();
a.push(n);
}
}
for (var c = 0; c < a.length; ++c) this.bulletsArray.splice(a[c], 1);
0 == this.bulletsArray.length && Math.random() > .99 && this.spawnBullets();
}
});
cc._RF.pop();
}, {} ],
fenhong: [ function(e, a) {
"use strict";
cc._RF.push(a, "f7095txO5pAeKBADtk1kWh6", "fenhong");
cc.Class({
extends: cc.Component,
properties: {
pastmoney: cc.Label,
pastfh: cc.Label,
percent: cc.Label,
level: cc.Label,
pro: cc.ProgressBar,
jieshao: cc.Node,
content: cc.Node
},
start: function() {},
init: function(e) {
this.pastmoney.string = e.fhshow.pastmoney + "元";
this.pastfh.string = e.fhshow.pastfh + "元/人";
this.percent.string = e.fhshow.percent + "%";
this.level.string = "Lv." + e.level;
this.pro.progress = e.fhshow.percent / 100;
if (e.fhshow.nameListStr) for (var a = e.fhshow.nameListStr.split(","), n = e.fhshow.dateStr.split(","), c = 0; c < this.content.children.length; ++c) if (c < a.length) {
this.content.children[c].active = !0;
this.content.children[c].getChildByName("name").getComponent("cc.Label").string = a[c];
this.content.children[c].getChildByName("time").getComponent("cc.Label").string = n[c];
} else this.content.children[c].active = !1;
},
showNiu: function() {
this.close();
cc.engine.gameCtl.showNiu();
},
close: function() {
this.node.active = !1;
},
showJieshao: function() {
this.jieshao.active = !0;
},
closeJieshao: function() {
this.jieshao.active = !1;
}
});
cc._RF.pop();
}, {} ],
getdia: [ function(e, a) {
"use strict";
cc._RF.push(a, "521adXI4V5LxbQYrX93JJ8q", "getdia");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
showVideo: function() {
var e = this;
cc.engine.platform.showVideoAd(function(a) {
a && e.close();
});
},
close: function() {
this.node.active = !1;
cc.engine.gameCtl.showNiu();
}
});
cc._RF.pop();
}, {} ],
guide: [ function(e, a) {
"use strict";
cc._RF.push(a, "6afd1pCq8xAL4x/uTxt4UNQ", "guide");
cc.Class({
extends: cc.Component,
properties: {
qianbao: cc.Node,
tixian: cc.Node,
shouzhi: cc.Node,
label: cc.Label
},
start: function() {},
next: function(e) {
cc.engine.userData.guideID <= 4 && (this.node.active = !0);
var a = null;
switch (cc.engine.userData.guideID) {
case 1:
a = e.parent.convertToWorldSpaceAR(e.position);
this.shouzhi.position = this.node.convertToNodeSpaceAR(a);
this.label.string = "点击购买宠物帮助您消除障碍物";
break;

case 2:
a = e.parent.convertToWorldSpaceAR(e.position);
this.shouzhi.position = this.node.convertToNodeSpaceAR(a);
this.label.string = "点击也可以消除障碍物，升级后伤害更高";
break;

case 3:
a = this.qianbao.parent.convertToWorldSpaceAR(this.qianbao.position);
this.shouzhi.position = this.node.convertToNodeSpaceAR(a);
this.label.string = "您的钱包在这里";
break;

case 4:
a = this.tixian.parent.convertToWorldSpaceAR(this.tixian.position);
this.shouzhi.position = this.node.convertToNodeSpaceAR(a);
this.label.string = "点击即可提现到微信钱包";
break;

default:
this.node.active = !1;
}
}
});
cc._RF.pop();
}, {} ],
item: [ function(e, a) {
"use strict";
cc._RF.push(a, "c5c13cL2HVDIJCLTQbL2Mku", "item");
cc.Class({
extends: cc.Component,
properties: {
id: 0,
nameL: cc.Label,
money: cc.Label,
progress: cc.ProgressBar,
pro: cc.Label,
openRedPop: cc.Prefab,
btnFrame: [ cc.SpriteFrame ],
yilingqu: cc.Node
},
start: function() {},
init: function(e, a, n) {
this._script = n;
this.type = a;
this.id = e.type;
this.nameL.string = e.name;
this.money.string = e.money;
this.pro.string = e.complete + "/" + e.nums;
this.progress.progress = e.complete / e.nums;
},
refreshState: function(e) {
if ("1" == e) {
this.node.getChildByName("go").getComponent("cc.Button").interactable = !1;
this.yilingqu.active = !0;
} else {
this.node.getChildByName("go").getComponent("cc.Button").interactable = !0;
this.yilingqu.active = !1;
}
},
receive: function() {
var e = this;
1 == this.progress.progress ? cc.engine.platform.getRed(cc.engine.config.redType[this.type], function() {
var a = cc.instantiate(e.openRedPop);
a.getComponent("openRedPop").init(cc.engine.config.redType[e.type], !0, e._script);
a.parent = cc.engine.gameCtl.node;
}, "task" == this.type ? this.id : 0, "task" == this.type ? 0 : this.id) : this._script.close();
},
update: function() {
1 == this.progress.progress ? this.node.getChildByName("go").getComponent("cc.Sprite").spriteFrame = this.btnFrame[1] : this.node.getChildByName("go").getComponent("cc.Sprite").spriteFrame = this.btnFrame[0];
}
});
cc._RF.pop();
}, {} ],
money: [ function(e, a) {
"use strict";
cc._RF.push(a, "8964eqJjlJKmJp0sYLZu98Z", "money");
cc.Class({
extends: cc.Component,
properties: {
items: cc.Node,
redNums: cc.Label,
rmb: cc.Label,
tixianGold: cc.Label,
toggle1: cc.Toggle,
toggle2: cc.Toggle,
_type: "",
_list: [],
_goldId: 1,
gold: cc.Label
},
onLoad: function() {
cc.engine.log("money onload");
},
start: function() {},
init: function() {
this.redNums.string = cc.engine.gameModel.lockmoney;
this.rmb.string = "约" + (cc.engine.gameModel.lockmoney / 1e4).toFixed(2) + "元";
this.gold.string = cc.engine.gameModel.goldcoin;
},
refreshItems: function(e) {
var a = this;
this._list = [];
Object.keys(cc.engine.walletList).forEach(function(n) {
e == cc.engine.walletList[n].cashtype && a._list.push(cc.engine.walletList[n]);
});
for (var n = 0; n < this.items.children.length; ++n) if (this._list[n]) {
this.items.children[n].active = !0;
this.items.children[n].getComponent("toggleItem").id = this._list[n].id;
this.items.children[n].getChildByName("redNums").getComponent("cc.Label").string = this._list[n].money + "元";
this.items.children[n].getChildByName("checkmark").getChildByName("di5").getChildByName("New Label").getComponent("cc.Label").string = this._list[n].surplus;
} else this.items.children[n].active = !1;
},
refresh: function() {
this.init();
if ("new" == this._type) {
this.toggle1.isChecked = !0;
this.refreshItems(1);
} else if ("noDoor" == this._type) {
this.toggle2.isChecked = !0;
this.refreshItems(2);
}
for (var e = 0; e < this.items.children.length; ++e) if (this._list[e] && this._list[e].surplus > 0) {
this.items.children[e].getComponent("cc.Toggle").isChecked = !0;
this._goldId = this._list[e].id;
break;
}
},
item: function(e) {
var a = e.target.getComponent("toggleItem").id;
cc.engine.walletList[a - 1] && cc.engine.walletList[a - 1].cashtype == cc.engine.walletList[a].cashtype && cc.engine.walletList[a - 1].surplus > 0 ? cc.engine.walletList[a] && Number(cc.engine.walletList[a].money) <= Number(cc.engine.gameModel.lockmoney / 1e4) ? cc.engine.Toast.showToast("请先提现" + cc.engine.walletList[a - 1].money + "元") : cc.engine.Toast.showToast("余额不足") : cc.engine.walletList[a] && cc.engine.walletList[a].surplus > 0 ? this._goldId = e.target.getComponent("toggleItem").id : cc.engine.Toast.showToast("无提现次数");
this.refresh();
},
new: function() {
if ("new" != this._type) {
this._type = "new";
this.refresh();
}
},
noDoor: function() {
if ("noDoor" != this._type) {
this._type = "noDoor";
this.refresh();
}
},
tixianClick: function() {
var e = this;
if (4 == cc.engine.userData.guideID) {
cc.engine.userData.guideID++;
cc.find("Canvas/guide").getComponent("guide").next();
}
if (cc.engine.isCash) cc.engine.Toast.showToast("服务器连接中请稍后，请勿连续点击"); else {
cc.engine.isCash = !0;
if (Number(cc.engine.walletList[this._goldId].money) > Number((cc.engine.gameModel.lockmoney / 1e4).toFixed(2))) {
cc.engine.Toast.showToast("余额不足");
cc.engine.isCash = !1;
} else if (parseInt(cc.engine.walletList[this._goldId].goldcoin) > parseInt(cc.engine.gameModel.goldcoin)) {
cc.engine.Toast.showToast("还需" + (parseInt(cc.engine.walletList[this._goldId].goldcoin) - parseInt(cc.engine.gameModel.goldcoin)) + "个钻石，每看一个视频可获得100钻石");
cc.engine.isCash = !1;
} else if (parseInt(cc.engine.gameModel.goldcattle) < parseInt(cc.engine.walletList[this._goldId].goldcattle)) {
cc.engine.Toast.showToast("需要金牛等级达到" + parseInt(cc.engine.walletList[this._goldId].goldcattle) + "级");
cc.engine.isCash = !1;
} else cc.engine.platform.cash(this._goldId, function() {
cc.engine.log("提现成功");
cc.engine.Toast.showToast("成功提现" + cc.engine.walletList[e._goldId].money + "元");
e.refresh();
});
}
},
close: function() {
if (4 == cc.engine.userData.guideID) {
cc.engine.userData.guideID++;
cc.find("Canvas/guide").getComponent("guide").next();
}
this._type = "";
this.node.active = !1;
cc.engine.isCash = !1;
},
update: function() {
this.tixianGold.string = cc.engine.walletList[this._goldId].goldcoin;
}
});
cc._RF.pop();
}, {} ],
niu: [ function(e, a) {
"use strict";
cc._RF.push(a, "997a6VQO4VCoqTVBDXbCI4P", "niu");
var n = {
return_code: "SUCC",
return_msg: "OK",
retcode: "200",
retmsg: "OK",
goldcoin: "0",
goldcattle: {
level: "1",
nums: "4",
totalnums: "7",
goldcoin: "100"
}
};
cc.Class({
extends: cc.Component,
properties: {
pro: cc.ProgressBar,
diaNum: cc.Label,
diaNum2: cc.Label,
level: cc.Label,
nodeSp: cc.SpriteFrame
},
start: function() {},
init: function(e) {
e = e || n;
this.level.string = e.goldcattle.level;
this.diaNum.string = cc.engine.gameModel.goldcoin ? cc.engine.gameModel.goldcoin : 0;
this.diaNum2.string = e.goldcattle.goldcoin;
this.pro.progress = e.goldcattle.nums / e.goldcattle.totalnums;
this.pro.node.getChildByName("node").removeAllChildren();
for (var a = 1; a < e.goldcattle.totalnums; ++a) {
var c = new cc.Node(a);
c.parent = this.pro.node.getChildByName("node");
c.addComponent(cc.Sprite).spriteFrame = this.nodeSp;
c.x = this.pro.node.width / e.goldcattle.totalnums * a;
c.width = 2;
c.height = this.pro.node.height;
}
},
click: function() {
var e = this;
if (parseInt(this.diaNum2.string) > parseInt(cc.engine.gameModel.goldcoin)) {
this.close();
this.node.parent.getChildByName("getdia").active = !0;
} else cc.engine.platform.getNiuDate(function(a) {
e.init(a);
}, !0);
},
close: function() {
this.node.active = !1;
},
closeJieShow: function() {
this.node.getChildByName("bg").getChildByName("jieshao").active = !1;
},
showJieShao: function() {
this.node.getChildByName("bg").getChildByName("jieshao").active = !0;
}
});
cc._RF.pop();
}, {} ],
noGold: [ function(e, a) {
"use strict";
cc._RF.push(a, "98fa66DYLBDfZilkio5uXLb", "noGold");
cc.Class({
extends: cc.Component,
properties: {
gold: cc.Label
},
start: function() {},
init: function(e) {
this.goldNum = parseInt(1.5 * e);
this.gold.string = cc.engine.config.changeGold(this.goldNum, 2);
cc.engine.platform.showNativeBanner();
},
addGold: function() {
var e = this;
cc.engine.platform.showVideoAd(function(a) {
if (a) {
cc.engine.audio.playGetNew();
cc.engine.gameModel.addGold(e.goldNum, "noGold");
e.node.destroy();
}
});
cc.engine.platform.hideBanner();
},
close: function() {
this.node.destroy();
cc.engine.platform.hideNativeBanner();
}
});
cc._RF.pop();
}, {} ],
offline: [ function(e, a) {
"use strict";
cc._RF.push(a, "253dc6c/9dOeKpWz8X7kXau", "offline");
cc.Class({
extends: cc.Component,
properties: {
goldLable: cc.Label,
icon: cc.Sprite,
coin: cc.SpriteFrame,
title: cc.Sprite,
titleSp: [ cc.SpriteFrame ]
},
start: function() {},
init: function(e, a) {
var n = this;
this.times = 1;
this.offlineGold = e;
this.type = a;
switch (a) {
case "gold":
this.title.spriteFrame = this.titleSp[0];
this.goldLable.string = "金币+" + cc.engine.config.changeGold(e, 2);
this.icon.spriteFrame = this.coin;
this.node.getChildByName("tip").active = !1;
this.node.getChildByName("btns").active = !0;
break;

case "tip":
this.node.getChildByName("tip").active = !0;
this.node.getChildByName("btns").active = !1;
this.title.spriteFrame = this.titleSp[1];
this.goldLable.string = cc.engine.petDict[e].name;
cc.resources.load("ball/" + cc.engine.petDict[e].icon, cc.SpriteFrame, function(e, a) {
a && (n.icon.spriteFrame = a);
});
}
cc.engine.platform.showBannerAd();
},
lingqu: function() {
cc.engine.gameModel.addGold(parseInt(this.offlineGold) * this.times, "offline");
this.node.destroy();
if ("gold" == this.type && 0 == cc.engine.userData.isRed) cc.engine.gameCtl.showBossRed(); else if (0 == cc.engine.gameModel.sign) cc.engine.gameCtl.showSign(); else if (1 == cc.engine.gameModel.luckeject) cc.engine.gameCtl.showTurnTable(); else if (2 == cc.engine.gameModel.luckeject) cc.engine.gameCtl.showBoon(); else {
cc.engine.gameCtl.initGuide();
cc.engine.platform.hideBanner();
}
},
double: function() {
var e = this;
cc.engine.platform.showVideoAd(function(a) {
if (a) {
e.times = 2;
e.lingqu();
}
});
},
close: function() {
"gold" != this.type && this.node.destroy();
}
});
cc._RF.pop();
}, {} ],
openRedPop: [ function(e, a) {
"use strict";
cc._RF.push(a, "e60dbFhpRhHOpohLsTxQ/pl", "openRedPop");
e("config");
cc.Class({
extends: cc.Component,
properties: {
tipLabels: [ cc.SpriteFrame ],
tipLabel: cc.Sprite,
redNum: cc.Label,
tenRed: cc.Label,
videoLabel: cc.Label,
type: null,
lingqu: cc.Node,
closebtn: cc.Node
},
start: function() {},
init: function(e, a, n, c) {
var l = this;
this.callback = c;
this._script = n;
this.isvideo = a;
this.type = e;
switch (e) {
case cc.engine.config.redType.online:
this.tipLabel.spriteFrame = this.tipLabels[3];
break;

case cc.engine.config.redType.sign:
this.tipLabel.spriteFrame = this.tipLabels[0];
break;

case cc.engine.config.redType.luck:
this.tipLabel.spriteFrame = this.tipLabels[1];
break;

case cc.engine.config.redType.levelUp:
this.tipLabel.spriteFrame = this.tipLabels[2];
break;

default:
this.tipLabel.spriteFrame = this.tipLabels[1];
}
this.redNum.string = cc.engine.money;
this.tenRed.string = "领取后可兑换" + (cc.engine.money * cc.engine.redtimes / 1e3).toFixed(2) + "元";
this.videoLabel.string = "看视频领取" + cc.engine.money * cc.engine.redtimes + "红包券";
if (this.isvideo) this.closebtn.active = !0; else {
this.scheduleOnce(function() {
l.lingqu.active = !0;
}, 3);
this.closebtn.active = !1;
}
cc.engine.platform.showBannerAd();
},
open: function() {
var e = this;
cc.engine.video && !this.isvideo && cc.engine.platform.showVideoAd();
cc.engine.platform.openRed(this.type, function() {
if (e.type == cc.engine.config.redType.online) ++cc.engine.userData.onlineCount < cc.engine.config.online.length ? cc.engine.userData.online = cc.engine.config.online[cc.engine.userData.onlineCount] : cc.engine.userData.online = cc.engine.config.online[cc.engine.config.online.length - 1]; else if (e.type == cc.engine.config.redType.luck) e._script && e._script.refresh(); else if (e.type == cc.engine.config.redType.task) {
e._script._type = "";
e._script.mission();
} else if (e.type == cc.engine.config.redType.achieve) {
e._script._type = "";
e._script.achievement();
}
e.node.destroy();
e.callback && e.callback();
}, this.isvideo);
cc.engine.platform.hideBanner();
},
showVideoOpen: function() {
var e = this;
cc.engine.platform.showVideoAd(function(a) {
if (a) {
e.isvideo = 1;
e.open();
}
});
},
close: function() {
cc.engine.video && cc.engine.platform.showVideoAd();
this.node.destroy();
cc.engine.platform.hideBanner();
}
});
cc._RF.pop();
}, {
config: "config"
} ],
petDict: [ function(e, a) {
"use strict";
cc._RF.push(a, "07242uhJ5hLba/Z29sDW9Rv", "petDict");
a.exports = {
11001: {
key: 11001,
name: "点击",
icon: "ball_0",
speed: 0,
gold: "21",
rate: 1.131,
atk: "10",
atk_rate: 1.089,
stage: 1,
unlock_key: 0,
unlock_level: 0,
limit_level: 200,
des: ""
},
11002: {
key: 11002,
name: "白熊",
icon: "ball_1",
speed: 1,
gold: "25",
rate: 1.093,
atk: "12",
atk_rate: 1.063,
stage: 1,
unlock_key: 11001,
unlock_level: 1,
limit_level: 100,
des: ""
},
11003: {
key: 11003,
name: "狗子",
icon: "ball_2",
speed: 1.02,
gold: "153",
rate: 1.093,
atk: "33",
atk_rate: 1.063,
stage: 5,
unlock_key: 11002,
unlock_level: 20,
limit_level: 100,
des: ""
},
11004: {
key: 11004,
name: "海豹",
icon: "ball_3",
speed: 1.04,
gold: "920",
rate: 1.093,
atk: "98",
atk_rate: 1.063,
stage: 10,
unlock_key: 11002,
unlock_level: 25,
limit_level: 100,
des: ""
},
11005: {
key: 11005,
name: "黑猫",
icon: "ball_4",
speed: 1.06,
gold: "5497",
rate: 1.093,
atk: "291",
atk_rate: 1.063,
stage: 25,
unlock_key: 11002,
unlock_level: 50,
limit_level: 100,
des: ""
},
11006: {
key: 11006,
name: "猴子",
icon: "ball_5",
speed: 1.08,
gold: "33125",
rate: 1.093,
atk: "874",
atk_rate: 1.063,
stage: 50,
unlock_key: 11003,
unlock_level: 50,
limit_level: 100,
des: ""
},
11007: {
key: 11007,
name: "黄鸡",
icon: "ball_6",
speed: 1.1,
gold: "198354",
rate: 1.093,
atk: "2609",
atk_rate: 1.063,
stage: 75,
unlock_key: 11002,
unlock_level: 100,
limit_level: 100,
des: ""
},
11008: {
key: 11008,
name: "黄鸭",
icon: "ball_7",
speed: 1.12,
gold: "1194287",
rate: 1.093,
atk: "7856",
atk_rate: 1.063,
stage: 100,
unlock_key: 11003,
unlock_level: 100,
limit_level: 100,
des: ""
},
11009: {
key: 11009,
name: "恐龙",
icon: "ball_8",
speed: 1.14,
gold: "7139448",
rate: 1.093,
atk: "23394",
atk_rate: 1.063,
stage: 125,
unlock_key: 11004,
unlock_level: 100,
limit_level: 100,
des: ""
},
11010: {
key: 11010,
name: "鲨鱼",
icon: "ball_9",
speed: 1.16,
gold: "42993755",
rate: 1.093,
atk: "70554",
atk_rate: 1.063,
stage: 150,
unlock_key: 11005,
unlock_level: 100,
limit_level: 100,
des: ""
},
11011: {
key: 11011,
name: "小鸟",
icon: "ball_10",
speed: 1.18,
gold: "256758704",
rate: 1.093,
atk: "210601",
atk_rate: 1.063,
stage: 175,
unlock_key: 11006,
unlock_level: 100,
limit_level: 100,
des: ""
},
11012: {
key: 11012,
name: "小羊",
icon: "ball_11",
speed: 1.2,
gold: "1545944155",
rate: 1.093,
atk: "635592",
atk_rate: 1.063,
stage: 200,
unlock_key: 11007,
unlock_level: 100,
limit_level: 100,
des: ""
},
11013: {
key: 11013,
name: "熊猫",
icon: "ball_12",
speed: 1.22,
gold: "9238562269",
rate: 1.093,
atk: "1897876",
atk_rate: 1.063,
stage: 225,
unlock_key: 11008,
unlock_level: 100,
limit_level: 100,
des: ""
},
11014: {
key: 11014,
name: "福二哈",
icon: "ball_12",
speed: 1.62,
gold: "26121388032",
rate: 1.0922,
atk: "3188646",
atk_rate: 1.062,
stage: 250,
unlock_key: 11009,
unlock_level: 100,
limit_level: 100,
des: ""
},
11015: {
key: 11015,
name: "灵猴",
icon: "ball_12",
speed: 1.63,
gold: "156728328192",
rate: 1.0922,
atk: "9565938",
atk_rate: 1.062,
stage: 275,
unlock_key: 11010,
unlock_level: 100,
limit_level: 100,
des: ""
},
11016: {
key: 11016,
name: "小恶魔",
icon: "ball_12",
speed: 1.64,
gold: "940369969152",
rate: 1.0922,
atk: "28697814",
atk_rate: 1.062,
stage: 300,
unlock_key: 11011,
unlock_level: 100,
limit_level: 100,
des: ""
},
11017: {
key: 11017,
name: "小天使",
icon: "ball_12",
speed: 1.65,
gold: "5642219814912",
rate: 1.0922,
atk: "86093442",
atk_rate: 1.062,
stage: 350,
unlock_key: 11012,
unlock_level: 100,
limit_level: 100,
des: ""
},
11018: {
key: 11018,
name: "柴柴",
icon: "ball_12",
speed: 1.66,
gold: "33853318889472",
rate: 1.0922,
atk: "258280326",
atk_rate: 1.062,
stage: 400,
unlock_key: 11013,
unlock_level: 100,
limit_level: 100,
des: ""
},
11019: {
key: 11019,
name: "哞哞",
icon: "ball_12",
speed: 1.67,
gold: "203119913336832",
rate: 1.0922,
atk: "774840978",
atk_rate: 1.062,
stage: 450,
unlock_key: 11014,
unlock_level: 100,
limit_level: 100,
des: ""
},
11020: {
key: 11020,
name: "博美",
icon: "ball_12",
speed: 1.68,
gold: "1218719480020990",
rate: 1.0922,
atk: "2324522934",
atk_rate: 1.062,
stage: 500,
unlock_key: 11015,
unlock_level: 100,
limit_level: 100,
des: ""
},
11021: {
key: 11021,
name: "斑斑",
icon: "ball_12",
speed: 1.69,
gold: "7312316880125940",
rate: 1.0922,
atk: "6973568802",
atk_rate: 1.062,
stage: 550,
unlock_key: 11016,
unlock_level: 100,
limit_level: 100,
des: ""
},
11022: {
key: 11022,
name: "小蜜蜂",
icon: "ball_12",
speed: 1.7,
gold: "4.38739012807556e+",
rate: 1.0922,
atk: "20920706406",
atk_rate: 1.062,
stage: 600,
unlock_key: 11017,
unlock_level: 100,
limit_level: 100,
des: ""
},
11023: {
key: 11023,
name: "咯叽",
icon: "ball_12",
speed: 1.71,
gold: "2.63243407684534e+",
rate: 1.0922,
atk: "62762119218",
atk_rate: 1.062,
stage: 650,
unlock_key: 11018,
unlock_level: 100,
limit_level: 100,
des: ""
},
11024: {
key: 11024,
name: "咕咕",
icon: "ball_12",
speed: 1.72,
gold: "1.5794604461072e+",
rate: 1.0922,
atk: "188286357654",
atk_rate: 1.062,
stage: 700,
unlock_key: 11019,
unlock_level: 100,
limit_level: 100,
des: ""
}
};
cc._RF.pop();
}, {} ],
platform: [ function(e, a) {
"use strict";
cc._RF.push(a, "2ce5b5lL+pLQ5ziHIADBdfG", "platform");
a.exports = {
gdtVideoNum: 0,
gdtInNum: 0,
gdtBanNum: 0,
csjVideoNum: 0,
csjInNum: 0,
csjBanNum: 0,
videoAd: null,
bannerAd: null,
interstitialAd: null,
platform: "",
init: function() {
var e = this;
if (cc.sys.platform == cc.sys.WECHAT_GAME) {
this.videoAd = wx.createRewardedVideoAd({
adUnitId: cc.engine.gameModel.adVideoId
});
this.bannerAd = wx.createBannerAd({
adUnitId: cc.engine.gameModel.adBannerId,
adIntervals: 30,
style: {
left: 0,
top: 0,
width: 200
}
});
var a = wx.getSystemInfoSync();
cc.engine.log("sysinfo: " + JSON.stringify(a));
this.bannerAd && this.bannerAd.onError(function(e) {
cc.engine.log("bannerErrCode：" + e);
});
this.bannerAd && this.bannerAd.onResize(function(n) {
cc.engine.log("banner onResize res:" + n.width + n.height);
if (e.bannerAd && e.bannerAd.style) {
cc.engine.log("banner onResize res:" + n.width + n.height);
e.bannerAd.style.left = (a.screenWidth - n.width) / 2;
e.bannerAd.style.top = a.screenHeight - n.height;
}
});
this.interstitialAd = wx.createInterstitialAd({
adUnitId: cc.engine.gameModel.adInterstitialId
});
this.interstitialAd && this.interstitialAd.onClose(function() {
cc.engine.log("关闭插件广告");
});
this.interstitialAd && this.interstitialAd.onError(function(e) {
cc.engine.log("插件errCode:::", e.errCode);
1004 == e.errCode ? cc.engine.log("广告播放异常") : cc.engine.log("广告资源没有了");
});
wx.onShow(function() {});
wx.onHide(function() {
cc.engine.gameModel.saveAll();
});
wx.showShareMenu({
withShareTicket: !0,
menus: [ "shareAppMessage", "shareTimeline" ]
});
wx.onShareAppMessage(function() {
return {
imageUrl: "https://mmocgame.qpic.cn/wechatgame/gykKWNkpZlJd8G1GfCqPLm8b296noR9DbaPzVPwibbXDvmcA1wrh3ibybeoPQosufq/0",
imageUrlId: "GY1ZMPEeTr+Xo8HhwpYL7Q=="
};
});
wx.onShareTimeline(function() {
return {
imageUrl: "https://mmocgame.qpic.cn/wechatgame/gykKWNkpZlJd8G1GfCqPLm8b296noR9DbaPzVPwibbXDvmcA1wrh3ibybeoPQosufq/0",
query: "a=1&b=2"
};
});
} else cc.sys.os, cc.sys.OS_ANDROID;
},
randomStr: function() {
for (var e = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ], a = "", n = 0; n < 16; n++) a += e[parseInt(42 * Math.random())];
return a;
},
createImg: function(e) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
var a = cc.engine.gameModel.headimg.split("\\").join("");
cc.loader.load({
url: a,
type: "jpg"
}, function(a, n) {
n && (e.spriteFrame = new cc.SpriteFrame(n));
});
}
},
login: function(e, a, n, c, l) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
cc.engine.gameModel.code = e;
cc.engine.http.post("getoOpenid", {
appid: cc.engine.config.appid,
nonce_str: this.randomStr(),
code: e,
from: a,
imei: n,
android_id: c
}, function(e) {
if (e && "SUCC" == e.return_code) {
cc.engine.gameModel.openid = e.userdata.openid;
cc.engine.gameModel.lockmoney = e.userdata.lockmoney;
cc.engine.gameModel.goldcoin = e.userdata.goldcoin;
cc.engine.gameModel.signday = e.userdata.signday;
cc.engine.gameModel.sign = e.userdata.sign;
cc.engine.gameModel.headimg = e.userdata.headimg;
cc.engine.gameModel.offlinetime = e.userdata.offlinetime;
cc.engine.gameModel.advcar = e.advcar;
cc.engine.gameModel.adveject = e.adveject;
cc.engine.gameModel.luckeject = e.luckeject;
cc.engine.gameModel.hdcar = e.hdcar;
cc.engine.intWeight = e.adpopup.intWeight;
cc.engine.natWeight = e.adpopup.natWeight;
cc.engine.product = e.appwaken.product;
cc.engine.channel_name = e.appwaken.channel_name;
cc.engine.packagename = e.appwaken.packagename;
cc.engine.deeplinkUrl = e.appwaken.deeplinkUrl;
cc.engine.time = e.appwaken.time;
cc.engine.userData.init(e.gamedata);
l && l();
cc.engine.log("登录数据加载SUCC！！！");
} else cc.engine.log("login:::" + JSON.stringify(e));
});
}
},
getRed: function(e, a, n, c, l) {
void 0 === n && (n = 0);
void 0 === c && (c = 0);
void 0 === l && (l = 0);
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("init", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
obnum: l,
level: cc.engine.userData.level,
nonce_str: this.randomStr(),
type: e,
mtype: n,
atype: c,
code: cc.engine.gameModel.code
}, function(n) {
if (n && "SUCC" == n.return_code) {
cc.engine.listid = n.listid;
cc.engine.money = n.money;
cc.engine.redtimes = n.redtimes;
cc.engine.video = n.video;
e == cc.engine.config.redType.turn ? a && a(n.id) : a && a();
cc.engine.log("getRed数据加载SUCC！！！");
cc.engine.platform.sendUmengEvent("getRed", "getRed", e);
} else {
n && n.return_msg && cc.engine.Toast.showToast(n.return_msg);
cc.engine.log("getRed:::" + JSON.stringify(n));
}
});
},
openRed: function(e, a, n) {
void 0 === n && (n = 0);
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("lottery", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
type: e,
listid: cc.engine.listid,
code: cc.engine.gameModel.code,
videocp: n
}, function(c) {
if (c && "SUCC" == c.return_code) {
cc.engine.amount = c.amount;
cc.engine.Toast.showToast("红包券增加" + cc.engine.amount);
cc.engine.gameModel.lockmoney = c.totalamount;
cc.engine.gameModel.goldcoin = c.goldcoin;
cc.engine.gameCtl.gameView.updateDate();
cc.engine.redAction.showRedAction();
a && a();
cc.engine.log("openRed数据加载SUCC！！！");
n ? cc.engine.platform.sendUmengEvent("receiveRed", "openRedVideo", e) : cc.engine.platform.sendUmengEvent("receiveRed", "openRed", e);
e == cc.engine.config.redType.boss && (cc.engine.userData.isRed = 1);
} else {
c && c.return_msg && cc.engine.Toast.showToast(c.return_msg);
cc.engine.log("openRed:::" + JSON.stringify(c));
}
});
},
mission: function(e, a) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("mission", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
mtype: e,
code: cc.engine.gameModel.code
}, function(e) {
if (e && "SUCC" == e.return_code) {
cc.engine.log(e.missionList);
cc.engine.mission = e.missionList;
a && a();
cc.engine.log("mission数据加载SUCC！！！");
} else {
e && e.return_msg && cc.engine.Toast.showToast(e.return_msg);
cc.engine.log("mission:::" + JSON.stringify(e));
}
});
},
achievement: function(e, a) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("achievement", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
atype: e,
code: cc.engine.gameModel.code
}, function(e) {
if (e && "SUCC" == e.return_code) {
cc.engine.log(e.achievementList);
cc.engine.achievement = e.achievementList;
a && a();
cc.engine.log("achievement数据加载SUCC！！！");
} else {
e && e.return_msg && cc.engine.Toast.showToast(e.return_msg);
cc.engine.log("achievement:::" + JSON.stringify(e));
}
});
},
turntable: function(e) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("turntable", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
code: cc.engine.gameModel.code
}, function(a) {
if (a && "SUCC" == a.return_code) {
cc.engine.log(a.turntable);
cc.engine.turntable = a.turntable;
e && e(a.nums);
cc.engine.log("turntable数据加载SUCC！！！");
} else {
a && a.return_msg && cc.engine.Toast.showToast(a.return_msg);
cc.engine.log("turntable:::" + JSON.stringify(a));
}
});
},
sign: function(e) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("sign", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
code: cc.engine.gameModel.code
}, function(a) {
if (a && "SUCC" == a.return_code) {
cc.engine.log(a.signList);
cc.engine.signList = a.signList;
cc.engine.gameModel.signday = a.day;
e && e();
cc.engine.log("signList数据加载SUCC！！！");
} else {
a && a.return_msg && cc.engine.Toast.showToast(a.return_msg);
cc.engine.log("signList:::" + JSON.stringify(a));
}
});
},
getBoonDate: function(e, a, n) {
var c = this;
void 0 === a && (a = "");
void 0 === n && (n = "");
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("gamb", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
code: cc.engine.gameModel.code,
click: a,
videocp: n
}, function(a) {
if (a && "SUCC" == a.return_code) {
cc.engine.log(a);
e && e(a);
cc.engine.log("getBoonDate数据加载SUCC！！！");
c.getNiuDate();
} else {
a && a.return_msg && cc.engine.Toast.showToast(a.return_msg);
cc.engine.log("getBoonDate:::" + JSON.stringify(a));
}
});
},
getNiuDate: function(e, a) {
void 0 === a && (a = "");
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("goldcattle", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
code: cc.engine.gameModel.code,
click: a
}, function(a) {
if (a && "SUCC" == a.return_code) {
cc.engine.log(a);
cc.engine.gameModel.goldcoin = a.goldcoin;
cc.engine.gameModel.goldcattle = a.goldcattle.level;
e && e(a);
cc.engine.log("getNiuDate数据加载SUCC！！！");
} else {
a && a.return_msg && cc.engine.Toast.showToast(a.return_msg);
cc.engine.log("getNiuDate:::" + JSON.stringify(a));
}
});
},
getFenhongDate: function(e) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("fhshow", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
code: cc.engine.gameModel.code
}, function(a) {
if (a && "SUCC" == a.return_code) {
cc.engine.log(a);
cc.engine.gameModel.goldcattle = a.level;
e && e(a);
cc.engine.log("getFenhongDate数据加载SUCC！！！");
} else {
a && a.return_msg && cc.engine.Toast.showToast(a.return_msg);
cc.engine.log("getFenhongDate:::" + JSON.stringify(a));
}
});
},
getH5url: function(e) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("h5url", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
code: cc.engine.gameModel.code
}, function(a) {
if (a && "SUCC" == a.return_code) {
e && e(a.link);
cc.engine.log("getH5url数据加载SUCC！！！");
} else {
a && a.return_msg && cc.engine.Toast.showToast(a.return_msg);
cc.engine.log("getH5url:::" + JSON.stringify(a));
}
});
},
cash: function(e, a) {
cc.sys.os == cc.sys.OS_ANDROID && cc.engine.http.post("cash", {
appid: cc.engine.config.appid,
openid: cc.engine.gameModel.openid,
nonce_str: this.randomStr(),
ctype: e,
code: cc.engine.gameModel.code
}, function(n) {
if (n && "SUCC" == n.return_code) {
cc.engine.gameModel.lockmoney = n.total_free;
cc.engine.gameModel.goldcoin = n.goldcoin;
cc.engine.walletList = n.walletList;
a && a();
cc.engine.log("cash数据加载SUCC！！！");
cc.engine.platform.sendUmengEvent("cash", "cashSucc", e);
} else {
n && n.return_msg && cc.engine.Toast.showToast(n.return_msg);
cc.engine.log("getRed:::" + JSON.stringify(n));
}
cc.engine.isCash = !1;
});
},
shareGame: function(e) {
if (cc.sys.platform == cc.sys.WECHAT_GAME) {
wx.shareAppMessage({
imageUrl: "https://mmocgame.qpic.cn/wechatgame/gykKWNkpZlJd8G1GfCqPLm8b296noR9DbaPzVPwibbXDvmcA1wrh3ibybeoPQosufq/0",
imageUrlId: "GY1ZMPEeTr+Xo8HhwpYL7Q=="
});
e && e();
} else e && e();
},
showNativeBanner: function() {
cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onClickShowNativeBanner", "(Ljava/lang/String;)V", "showNativeBanner");
},
hideNativeBanner: function() {
if (cc.sys.os == cc.sys.OS_ANDROID) {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "closeNativeBanner", "(Ljava/lang/String;Ljava/lang/String;)V", "1", "1");
this.showInterstitialAd();
}
},
showWebView: function(e) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
var a = cc.engine.config.hdcar[cc.engine.gameModel.random(0, cc.engine.config.hdcar.length - 1)];
e && (a = e);
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addWebView", "(Ljava/lang/String;)V", a);
}
},
showBannerAd: function() {
if (cc.sys.platform == cc.sys.WECHAT_GAME) this.bannerAd ? this.bannerAd.show().then(function() {
cc.engine.log("banner 广告显示");
}) : cc.engine.log("广告没有创建成功！"); else if (cc.sys.os == cc.sys.OS_ANDROID) {
cc.engine.log("wechatLogin start");
if (0 == cc.engine.config.gdtAdNums || 0 != cc.engine.config.chjAdNums && this.csjBanNum < cc.engine.config.chjAdNums) {
this.csjBanNum++;
this.csjBanNum == cc.engine.config.chjAdNums && (this.gdtBanNum = 0);
this.showcsj = !0;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onClickShowBanner", "(Ljava/lang/String;)V", "showBanner");
} else if (0 == cc.engine.config.chjAdNums || 0 != cc.engine.config.gdtAdNums && this.gdtBanNum < cc.engine.config.gdtAdNums) {
this.gdtBanNum++;
this.gdtBanNum == cc.engine.config.gdtAdNums && (this.csjBanNum = 0);
this.showgdt = !0;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showGDTBanner", "()V");
} else {
this.showcsj = !0;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onClickShowBanner", "(Ljava/lang/String;)V", "showBanner");
}
}
},
hideBanner: function() {
if (this.bannerAd) this.bannerAd.hide(); else if (cc.sys.os == cc.sys.OS_ANDROID) {
cc.engine.log("wechatLogin start");
if (this.showcsj) {
this.showcsj = !1;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "closeBanner", "(Ljava/lang/String;Ljava/lang/String;)V", "1", "1");
}
if (this.showgdt) {
this.showgdt = !1;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "closeGDTBanner", "()V");
}
this.showInterstitialAd();
}
},
showInterstitialAd: function() {
if (cc.sys.platform == cc.sys.WECHAT_GAME) this.interstitialAd && this.interstitialAd.show(); else if (cc.sys.os == cc.sys.OS_ANDROID) {
if (100 * Math.random() > Number(cc.engine.intWeight)) return;
if (0 == cc.engine.config.gdtAdNums || 0 != cc.engine.config.chjAdNums && this.csjInNum < cc.engine.config.chjAdNums) {
this.csjInNum++;
this.csjInNum == cc.engine.config.chjAdNums && (this.gdtInNum = 0);
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInteractionAd", "(Ljava/lang/String;)V", "showInteractionAd");
} else if (0 == cc.engine.config.chjAdNums || 0 != cc.engine.config.gdtAdNums && this.gdtInNum < cc.engine.config.gdtAdNums) {
this.gdtInNum++;
this.gdtInNum == cc.engine.config.gdtAdNums && (this.csjInNum = 0);
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showGDTInterstitialAD", "()V");
} else jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInteractionAd", "(Ljava/lang/String;)V", "showInteractionAd");
}
},
showVideoAd: function(e) {
var a = this;
if (cc.sys.platform == cc.sys.WECHAT_GAME) if (this.videoAd) {
this.videoAd.load().then(function() {
var n = null;
a.videoAd.onClose(n = function(c) {
a.videoAd.offClose(n);
c && c.isEnded || void 0 === c ? e && e() : wx.showModal({
title: "未看完广告无法获得奖励",
showCancel: !1
});
});
a.videoAd.show();
});
var n = null;
this.videoAd.onError(n = function(c) {
a.videoAd.offError(n);
cc.engine.log("视频errCode:::", c.errCode);
if (1004 == c.errCode) {
cc.engine.log("广告播放异常");
wx.showModal({
title: "广告播放异常",
showCancel: !1
});
} else if (cc.engine.gameModel.adVideoId) {
cc.engine.log("广告资源没有了");
wx.showModal({
title: "广告资源没有了",
showCancel: !1
});
} else e && e();
});
} else if (cc.engine.gameModel.adVideoId) {
cc.engine.log("videoAd创建失败！！！");
wx.showModal({
title: "videoAd创建失败！！！",
showCancel: !1
});
} else e && e(); else if (cc.sys.os == cc.sys.OS_ANDROID) {
cc.engine.videoCallback = e;
if (0 == cc.engine.config.gdtAdNums || 0 != cc.engine.config.chjAdNums && this.csjVideoNum < cc.engine.config.chjAdNums) {
this.csjVideoNum++;
this.csjVideoNum == cc.engine.config.chjAdNums && (this.gdtVideoNum = 0);
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(Ljava/lang/String;)V", "showVideoAd");
} else if (0 == cc.engine.config.chjAdNums || 0 != cc.engine.config.gdtAdNums && this.gdtVideoNum < cc.engine.config.gdtAdNums) {
this.gdtVideoNum++;
this.gdtVideoNum == cc.engine.config.gdtAdNums && (this.csjVideoNum = 0);
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showGDTVideo", "()V");
} else jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(Ljava/lang/String;)V", "showVideoAd");
} else e && e();
},
sendUmengEvent: function(e, a, n) {
var c = {};
c[a] = n;
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onEventObject", "(Ljava/lang/String;Ljava/lang/String;)V", e, JSON.stringify(c));
}
};
cc._RF.pop();
}, {} ],
redaction: [ function(e, a) {
"use strict";
cc._RF.push(a, "0b4d8o9vqtKtJx/v1CdhQnr", "redaction");
cc.Class({
extends: cc.Component,
properties: {
redicon: cc.Node,
red: cc.Prefab
},
start: function() {},
showRedAction: function(e) {
for (var a = this, n = [], c = 0; c < 4; ++c) {
var l = cc.instantiate(this.red);
if (e) {
var t = e.parent.convertToWorldSpaceAR(e.position);
l.position = this.node.convertToNodeSpaceAR(t);
} else l.position = cc.v2(0, 0);
l.parent = this.node;
n.push(l);
}
for (var i = this.redicon.parent.convertToWorldSpaceAR(this.redicon.position), o = this.node.convertToNodeSpaceAR(i), b = function(e) {
cc.tween(n[e]).delay(.1 * e).to(.3, {
position: o
}).call(function() {
cc.tween(a.redicon).to(.3, {
scale: 1.25
}).to(.3, {
scale: 1
}).start();
n[e].destroy();
}).start();
}, r = 0; r < n.length; ++r) b(r);
}
});
cc._RF.pop();
}, {} ],
scrollView: [ function(e, a) {
"use strict";
cc._RF.push(a, "02c95nDSipDPrFu/3etAxdQ", "scrollView");
cc.Class({
extends: cc.Component,
properties: {
view: cc.Node,
content: cc.Node,
item: cc.Prefab
},
start: function() {},
init: function(e, a, n, c) {
this.interval = n;
this.content.x = -this.view.width / 2;
this.count = Math.ceil(this.view.width / (this.item.data.width * this.item.data.scaleX));
this.totalCount = c;
this.content.width = (this.item.data.width * this.item.data.scaleX + this.interval) * this.totalCount + e - this.interval + a;
this.count > this.totalCount && (this.count, this.totalCount);
this.items = [];
for (var l = 0; l < this.count + 1; l++) {
var t = null;
(t = cc.engine.petPool.size() > 0 ? cc.engine.petPool.get() : cc.instantiate(this.petPrefab)).getComponent("Pet").init(Object.keys(cc.engine.petDict)[l]);
t.parent = this.content;
t.position = cc.v2(l * (this.item.data.width * this.item.data.scaleX + this.interval) + e + this.item.data.width * this.item.data.scaleX / 2, 0);
this.items.push(t);
}
this.bufferZone = this.view.x + this.view.width / 2;
this.lastContentPosX = this.content.x;
this.updateTimer = 0;
},
getPositionInView: function(e) {
var a = e.parent.convertToWorldSpaceAR(e.position);
return this.view.convertToNodeSpaceAR(a);
},
update: function(e) {
this.updateTimer += e;
if (!(this.updateTimer < .01)) {
this.updateTimer = 0;
for (var a = this.items, n = this.content.x < this.lastContentPosX, c = (this.item.data.width * this.item.data.scaleX + this.interval) * a.length, l = 0, t = 0; t < a.length; ++t) {
var i = this.getPositionInView(a[t]);
if (n) {
l = a[t].x + c;
if (i.x < -this.bufferZone && l < this.content.width) {
a[t].x = l;
var o = Number(a[t].getComponent("Pet")._key);
a[t].getComponent("Pet").init(o + a.length);
}
} else {
l = a[t].x - c;
if (i.x > this.bufferZone && l > 0) {
a[t].x = l;
var b = Number(a[t].getComponent("Pet")._key);
a[t].getComponent("Pet").init(b - a.length);
}
}
}
this.lastContentPosX = this.content.x;
}
}
});
cc._RF.pop();
}, {} ],
share: [ function(e, a) {
"use strict";
cc._RF.push(a, "09bd9qa4sNO7p0W57GmoAGo", "share");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
init: function() {
var e = this;
cc.assetManager.loadRemote("https://cdn.yituogame.com/BALL/sharePeng.png", function(a, n) {
if (a) {
cc.log(a);
cc.engine.Toast.showToast("分享图拉取失败");
} else if (n) {
e.node.getComponent("cc.Sprite").spriteFrame = new cc.SpriteFrame(n);
e.node.active = !0;
}
});
},
close: function() {
this.node.active = !1;
}
});
cc._RF.pop();
}, {} ],
sign: [ function(e, a) {
"use strict";
cc._RF.push(a, "cf6abSFtBROvJfIsnNbBBDe", "sign");
cc.Class({
extends: cc.Component,
properties: {
itemsNode: cc.Node,
redsSpriteFrame: [ cc.SpriteFrame ]
},
onLoad: function() {
cc.engine.log("sign onload");
},
start: function() {},
init: function() {
for (var e = 0; e < this.itemsNode.children.length; ++e) {
var a = "", n = null;
if (1 == cc.engine.signList[e + 1].type) {
a = cc.engine.signList[e + 1].money + "红包券";
n = this.redsSpriteFrame[0];
} else if (2 == cc.engine.signList[e + 1].type) {
a = cc.engine.signList[e + 1].money + "钻石";
n = this.redsSpriteFrame[1];
} else if (3 == cc.engine.signList[e + 1].type) {
a = cc.engine.signList[e + 1].money + "元";
n = this.redsSpriteFrame[2];
}
this.itemsNode.children[e].getChildByName("num").getComponent(cc.Label).string = a;
this.itemsNode.children[e].getChildByName("reds").getComponent(cc.Sprite).spriteFrame = n;
e < cc.engine.gameModel.signday - 1 ? this.itemsNode.children[e].getChildByName("shape1").active = !0 : e == cc.engine.gameModel.signday - 1 && 1 == cc.engine.signList[cc.engine.gameModel.signday].status ? this.itemsNode.children[e].getChildByName("shape1").active = !0 : this.itemsNode.children[e].getChildByName("shape1").active = !1;
}
},
receive: function() {
var e = this;
if (1 != cc.engine.signList[cc.engine.gameModel.signday].status) cc.engine.platform.getRed(cc.engine.config.redType.sign, function() {
if (1 == cc.engine.signList[cc.engine.gameModel.signday].type) {
var a = cc.instantiate(cc.engine.gameCtl.openRedPop);
a.getComponent("openRedPop").init(cc.engine.config.redType.sign, void 0, null, function() {
cc.engine.platform.sign(function() {
e.init();
});
});
a.parent = cc.engine.gameCtl.node;
} else 2 == cc.engine.signList[cc.engine.gameModel.signday].type ? cc.engine.platform.openRed(cc.engine.config.redType.sign, function() {
cc.engine.Toast.showToast("恭喜成功获得" + cc.engine.signList[cc.engine.gameModel.signday].money + "钻石");
cc.engine.platform.sign(function() {
e.init();
});
}) : 3 == cc.engine.signList[cc.engine.gameModel.signday].type && cc.engine.platform.sign(function() {
e.init();
});
}); else {
cc.engine.log("今日已领取");
cc.engine.Toast.showToast("今日已领取");
}
},
close: function() {
this.node.active = !1;
cc.engine.gameCtl.resumeGame();
cc.engine.platform.hideBanner();
1 == cc.engine.gameModel.luckeject ? cc.engine.gameCtl.showTurnTable() : 2 == cc.engine.gameModel.luckeject ? cc.engine.gameCtl.showBoon() : cc.engine.gameCtl.initGuide();
}
});
cc._RF.pop();
}, {} ],
stageDict: [ function(e, a) {
"use strict";
cc._RF.push(a, "a5605an7NlNXrOqjpxK4eiP", "stageDict");
a.exports = {
1: {
key: 1,
name: "关卡1",
icon: "bg002",
gold: "30",
rate: 4,
rate2: 1,
ball_icon: "ball001",
chance: 0,
hint: 10
},
2: {
key: 2,
name: "关卡2",
icon: "bg002",
gold: "43",
rate: 5,
rate2: 1,
ball_icon: "ball002",
chance: 100,
hint: 10
},
3: {
key: 3,
name: "关卡3",
icon: "bg002",
gold: "62",
rate: 6,
rate2: 1,
ball_icon: "ball003",
chance: 20,
hint: 10
},
4: {
key: 4,
name: "关卡4",
icon: "bg002",
gold: "89",
rate: 7,
rate2: 1,
ball_icon: "ball004",
chance: 20,
hint: 10
},
5: {
key: 5,
name: "关卡5",
icon: "bg002",
gold: "128",
rate: 8,
rate2: 1,
ball_icon: "ball005",
chance: 20,
hint: 10
},
6: {
key: 6,
name: "关卡6",
icon: "bg002",
gold: "183",
rate: 8,
rate2: 1,
ball_icon: "ball006",
chance: 20,
hint: 10
},
7: {
key: 7,
name: "关卡7",
icon: "bg002",
gold: "262",
rate: 8,
rate2: 1,
ball_icon: "ball007",
chance: 20,
hint: 10
},
8: {
key: 8,
name: "关卡8",
icon: "bg002",
gold: "375",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 20,
hint: 10
},
9: {
key: 9,
name: "关卡9",
icon: "bg002",
gold: "536",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 20,
hint: 10
},
10: {
key: 10,
name: "关卡10",
icon: "bg002",
gold: "7660",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 10
},
11: {
key: 11,
name: "关卡11",
icon: "bg002",
gold: "1094",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 20,
hint: 15
},
12: {
key: 12,
name: "关卡12",
icon: "bg002",
gold: "1563",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 20,
hint: 15
},
13: {
key: 13,
name: "关卡13",
icon: "bg002",
gold: "2232",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 20,
hint: 15
},
14: {
key: 14,
name: "关卡14",
icon: "bg002",
gold: "3188",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 20,
hint: 15
},
15: {
key: 15,
name: "关卡15",
icon: "bg002",
gold: "4553",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 20,
hint: 15
},
16: {
key: 16,
name: "关卡16",
icon: "bg002",
gold: "6502",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 20,
hint: 15
},
17: {
key: 17,
name: "关卡17",
icon: "bg002",
gold: "9285",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 20,
hint: 15
},
18: {
key: 18,
name: "关卡18",
icon: "bg002",
gold: "13259",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 20,
hint: 15
},
19: {
key: 19,
name: "关卡19",
icon: "bg002",
gold: "18934",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 20,
hint: 15
},
20: {
key: 20,
name: "关卡20",
icon: "bg002",
gold: "270380",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 15
},
21: {
key: 21,
name: "关卡21",
icon: "bg002",
gold: "38611",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 20,
hint: 20
},
22: {
key: 22,
name: "关卡22",
icon: "bg002",
gold: "55137",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 20,
hint: 20
},
23: {
key: 23,
name: "关卡23",
icon: "bg002",
gold: "78736",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 20,
hint: 20
},
24: {
key: 24,
name: "关卡24",
icon: "bg002",
gold: "112436",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 20,
hint: 20
},
25: {
key: 25,
name: "关卡25",
icon: "bg002",
gold: "160559",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 20,
hint: 20
},
26: {
key: 26,
name: "关卡26",
icon: "bg002",
gold: "229279",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 20,
hint: 20
},
27: {
key: 27,
name: "关卡27",
icon: "bg002",
gold: "327411",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 20,
hint: 20
},
28: {
key: 28,
name: "关卡28",
icon: "bg002",
gold: "467543",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 20,
hint: 20
},
29: {
key: 29,
name: "关卡29",
icon: "bg002",
gold: "667652",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 20,
hint: 20
},
30: {
key: 30,
name: "关卡30",
icon: "bg002",
gold: "9534080",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 20
},
31: {
key: 31,
name: "关卡31",
icon: "bg002",
gold: "1361467",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 20,
hint: 25
},
32: {
key: 32,
name: "关卡32",
icon: "bg002",
gold: "1944175",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 20,
hint: 25
},
33: {
key: 33,
name: "关卡33",
icon: "bg002",
gold: "2776282",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 20,
hint: 25
},
34: {
key: 34,
name: "关卡34",
icon: "bg002",
gold: "3964531",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 20,
hint: 25
},
35: {
key: 35,
name: "关卡35",
icon: "bg002",
gold: "5661351",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 20,
hint: 25
},
36: {
key: 36,
name: "关卡36",
icon: "bg002",
gold: "8084410",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 20,
hint: 25
},
37: {
key: 37,
name: "关卡37",
icon: "bg002",
gold: "11544538",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 20,
hint: 25
},
38: {
key: 38,
name: "关卡38",
icon: "bg002",
gold: "16485601",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 20,
hint: 25
},
39: {
key: 39,
name: "关卡39",
icon: "bg002",
gold: "23541439",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 20,
hint: 25
},
40: {
key: 40,
name: "关卡40",
icon: "bg002",
gold: "336171750",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 25
},
41: {
key: 41,
name: "关卡41",
icon: "bg002",
gold: "48005326",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 20,
hint: 30
},
42: {
key: 42,
name: "关卡42",
icon: "bg002",
gold: "68551606",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 20,
hint: 30
},
43: {
key: 43,
name: "关卡43",
icon: "bg002",
gold: "97891694",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 20,
hint: 30
},
44: {
key: 44,
name: "关卡44",
icon: "bg002",
gold: "139789340",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 20,
hint: 30
},
45: {
key: 45,
name: "关卡45",
icon: "bg002",
gold: "199619178",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 20,
hint: 30
},
46: {
key: 46,
name: "关卡46",
icon: "bg002",
gold: "285056187",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 20,
hint: 30
},
47: {
key: 47,
name: "关卡47",
icon: "bg002",
gold: "407060236",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 20,
hint: 30
},
48: {
key: 48,
name: "关卡48",
icon: "bg002",
gold: "581282018",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 20,
hint: 30
},
49: {
key: 49,
name: "关卡49",
icon: "bg002",
gold: "830070722",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 20,
hint: 30
},
50: {
key: 50,
name: "关卡50",
icon: "bg002",
gold: "8383714300",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 30
},
51: {
key: 51,
name: "关卡51",
icon: "bg002",
gold: "846755145",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 20,
hint: 40
},
52: {
key: 52,
name: "关卡52",
icon: "bg002",
gold: "855222697",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 20,
hint: 40
},
53: {
key: 53,
name: "关卡53",
icon: "bg002",
gold: "863774924",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 20,
hint: 40
},
54: {
key: 54,
name: "关卡54",
icon: "bg002",
gold: "872412674",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 20,
hint: 40
},
55: {
key: 55,
name: "关卡55",
icon: "bg002",
gold: "881136801",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 20,
hint: 40
},
56: {
key: 56,
name: "关卡56",
icon: "bg002",
gold: "889948170",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 20,
hint: 40
},
57: {
key: 57,
name: "关卡57",
icon: "bg002",
gold: "898847652",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 20,
hint: 40
},
58: {
key: 58,
name: "关卡58",
icon: "bg002",
gold: "907836129",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 20,
hint: 40
},
59: {
key: 59,
name: "关卡59",
icon: "bg002",
gold: "916914491",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 20,
hint: 40
},
60: {
key: 60,
name: "关卡60",
icon: "bg002",
gold: "9627602160",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 40
},
61: {
key: 61,
name: "关卡61",
icon: "bg002",
gold: "1010898227",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 20,
hint: 50
},
62: {
key: 62,
name: "关卡62",
icon: "bg002",
gold: "1061443139",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 20,
hint: 50
},
63: {
key: 63,
name: "关卡63",
icon: "bg002",
gold: "1114515296",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 20,
hint: 50
},
64: {
key: 64,
name: "关卡64",
icon: "bg002",
gold: "1170241061",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 20,
hint: 50
},
65: {
key: 65,
name: "关卡65",
icon: "bg002",
gold: "1228753115",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 20,
hint: 50
},
66: {
key: 66,
name: "关卡66",
icon: "bg002",
gold: "1290190771",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 20,
hint: 50
},
67: {
key: 67,
name: "关卡67",
icon: "bg002",
gold: "1354700310",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 20,
hint: 50
},
68: {
key: 68,
name: "关卡68",
icon: "bg002",
gold: "1422435326",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 20,
hint: 50
},
69: {
key: 69,
name: "关卡69",
icon: "bg002",
gold: "1493557093",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 20,
hint: 50
},
70: {
key: 70,
name: "关卡70",
icon: "bg002",
gold: "17474617990",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 50
},
71: {
key: 71,
name: "关卡71",
icon: "bg002",
gold: "2044530305",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 20,
hint: 60
},
72: {
key: 72,
name: "关卡72",
icon: "bg002",
gold: "2392100457",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 20,
hint: 60
},
73: {
key: 73,
name: "关卡73",
icon: "bg002",
gold: "2798757535",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 20,
hint: 60
},
74: {
key: 74,
name: "关卡74",
icon: "bg002",
gold: "3274546316",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 20,
hint: 60
},
75: {
key: 75,
name: "关卡75",
icon: "bg002",
gold: "3831219190",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 20,
hint: 60
},
76: {
key: 76,
name: "关卡76",
icon: "bg002",
gold: "4482526453",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 20,
hint: 60
},
77: {
key: 77,
name: "关卡77",
icon: "bg002",
gold: "5244555951",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 20,
hint: 60
},
78: {
key: 78,
name: "关卡78",
icon: "bg002",
gold: "6136130463",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 20,
hint: 60
},
79: {
key: 79,
name: "关卡79",
icon: "bg002",
gold: "7179272642",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 20,
hint: 60
},
80: {
key: 80,
name: "关卡80",
icon: "bg002",
gold: "79689926330",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 60
},
81: {
key: 81,
name: "关卡81",
icon: "bg002",
gold: "8845581823",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 20,
hint: 70
},
82: {
key: 82,
name: "关卡82",
icon: "bg002",
gold: "9818595824",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 20,
hint: 70
},
83: {
key: 83,
name: "关卡83",
icon: "bg002",
gold: "10898641365",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 20,
hint: 70
},
84: {
key: 84,
name: "关卡84",
icon: "bg002",
gold: "12097491916",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 20,
hint: 70
},
85: {
key: 85,
name: "关卡85",
icon: "bg002",
gold: "13428216027",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 20,
hint: 70
},
86: {
key: 86,
name: "关卡86",
icon: "bg002",
gold: "14905319790",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 20,
hint: 70
},
87: {
key: 87,
name: "关卡87",
icon: "bg002",
gold: "16544904967",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 20,
hint: 70
},
88: {
key: 88,
name: "关卡88",
icon: "bg002",
gold: "18364844514",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 20,
hint: 70
},
89: {
key: 89,
name: "关卡89",
icon: "bg002",
gold: "20384977411",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 20,
hint: 70
},
90: {
key: 90,
name: "关卡90",
icon: "bg002",
gold: "230350244750",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 70
},
91: {
key: 91,
name: "关卡91",
icon: "bg002",
gold: "26029577657",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 20,
hint: 80
},
92: {
key: 92,
name: "关卡92",
icon: "bg002",
gold: "29413422753",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 20,
hint: 80
},
93: {
key: 93,
name: "关卡93",
icon: "bg002",
gold: "33237167711",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 20,
hint: 80
},
94: {
key: 94,
name: "关卡94",
icon: "bg002",
gold: "37557999514",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 20,
hint: 80
},
95: {
key: 95,
name: "关卡95",
icon: "bg002",
gold: "42440539451",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 20,
hint: 80
},
96: {
key: 96,
name: "关卡96",
icon: "bg002",
gold: "47957809580",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 20,
hint: 80
},
97: {
key: 97,
name: "关卡97",
icon: "bg002",
gold: "54192324826",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 20,
hint: 80
},
98: {
key: 98,
name: "关卡98",
icon: "bg002",
gold: "61237327054",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 20,
hint: 80
},
99: {
key: 99,
name: "关卡99",
icon: "bg002",
gold: "69198179572",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 20,
hint: 80
},
100: {
key: 100,
name: "关卡100",
icon: "bg002",
gold: "698901613680",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 80
},
101: {
key: 101,
name: "关卡101",
icon: "bg002",
gold: "70589062982",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 20,
hint: 90
},
102: {
key: 102,
name: "关卡102",
icon: "bg002",
gold: "71294953612",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 20,
hint: 90
},
103: {
key: 103,
name: "关卡103",
icon: "bg002",
gold: "72007903149",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 20,
hint: 90
},
104: {
key: 104,
name: "关卡104",
icon: "bg002",
gold: "72727982181",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 20,
hint: 90
},
105: {
key: 105,
name: "关卡105",
icon: "bg002",
gold: "73455262003",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 20,
hint: 90
},
106: {
key: 106,
name: "关卡106",
icon: "bg002",
gold: "74189814624",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 20,
hint: 90
},
107: {
key: 107,
name: "关卡107",
icon: "bg002",
gold: "74931712771",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 20,
hint: 90
},
108: {
key: 108,
name: "关卡108",
icon: "bg002",
gold: "75681029899",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 20,
hint: 90
},
109: {
key: 109,
name: "关卡109",
icon: "bg002",
gold: "76437840198",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 20,
hint: 90
},
110: {
key: 110,
name: "关卡110",
icon: "bg002",
gold: "772022186000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 90
},
111: {
key: 111,
name: "关卡111",
icon: "bg002",
gold: "77974240786",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 20,
hint: 100
},
112: {
key: 112,
name: "关卡112",
icon: "bg002",
gold: "78753983194",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 20,
hint: 100
},
113: {
key: 113,
name: "关卡113",
icon: "bg002",
gold: "79541523026",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 20,
hint: 100
},
114: {
key: 114,
name: "关卡114",
icon: "bg002",
gold: "80336938257",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 20,
hint: 100
},
115: {
key: 115,
name: "关卡115",
icon: "bg002",
gold: "81140307640",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 20,
hint: 100
},
116: {
key: 116,
name: "关卡116",
icon: "bg002",
gold: "81951710717",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 20,
hint: 100
},
117: {
key: 117,
name: "关卡117",
icon: "bg002",
gold: "82771227825",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 20,
hint: 100
},
118: {
key: 118,
name: "关卡118",
icon: "bg002",
gold: "83598940104",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 20,
hint: 100
},
119: {
key: 119,
name: "关卡119",
icon: "bg002",
gold: "84434929506",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 20,
hint: 100
},
120: {
key: 120,
name: "关卡120",
icon: "bg002",
gold: "920340731620",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 100
},
121: {
key: 121,
name: "关卡121",
icon: "bg002",
gold: "100317139747",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 20,
hint: 110
},
122: {
key: 122,
name: "关卡122",
icon: "bg002",
gold: "109345682325",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 20,
hint: 110
},
123: {
key: 123,
name: "关卡123",
icon: "bg002",
gold: "119186793735",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 20,
hint: 110
},
124: {
key: 124,
name: "关卡124",
icon: "bg002",
gold: "129913605172",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 20,
hint: 110
},
125: {
key: 125,
name: "关卡125",
icon: "bg002",
gold: "141605829638",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 20,
hint: 110
},
126: {
key: 126,
name: "关卡126",
icon: "bg002",
gold: "154350354306",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 20,
hint: 110
},
127: {
key: 127,
name: "关卡127",
icon: "bg002",
gold: "168241886194",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 20,
hint: 110
},
128: {
key: 128,
name: "关卡128",
icon: "bg002",
gold: "183383655952",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 20,
hint: 110
},
129: {
key: 129,
name: "关卡129",
icon: "bg002",
gold: "199888184988",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 20,
hint: 110
},
130: {
key: 130,
name: "关卡130",
icon: "bg002",
gold: "2178781216370",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 110
},
131: {
key: 131,
name: "关卡131",
icon: "bg002",
gold: "237487152585",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 20,
hint: 120
},
132: {
key: 132,
name: "关卡132",
icon: "bg002",
gold: "258860996318",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 20,
hint: 120
},
133: {
key: 133,
name: "关卡133",
icon: "bg002",
gold: "282158485987",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 20,
hint: 120
},
134: {
key: 134,
name: "关卡134",
icon: "bg002",
gold: "307552749726",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 20,
hint: 120
},
135: {
key: 135,
name: "关卡135",
icon: "bg002",
gold: "335232497202",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 20,
hint: 120
},
136: {
key: 136,
name: "关卡136",
icon: "bg002",
gold: "365403421951",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 20,
hint: 120
},
137: {
key: 137,
name: "关卡137",
icon: "bg002",
gold: "398289729927",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 20,
hint: 120
},
138: {
key: 138,
name: "关卡138",
icon: "bg002",
gold: "434135805621",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 20,
hint: 120
},
139: {
key: 139,
name: "关卡139",
icon: "bg002",
gold: "473208028127",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 20,
hint: 120
},
140: {
key: 140,
name: "关卡140",
icon: "bg002",
gold: "4968684295340",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 120
},
141: {
key: 141,
name: "关卡141",
icon: "bg002",
gold: "521711851011",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 20,
hint: 130
},
142: {
key: 142,
name: "关卡142",
icon: "bg002",
gold: "547797443562",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 20,
hint: 130
},
143: {
key: 143,
name: "关卡143",
icon: "bg002",
gold: "575187315741",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 20,
hint: 130
},
144: {
key: 144,
name: "关卡144",
icon: "bg002",
gold: "603946681529",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 20,
hint: 130
},
145: {
key: 145,
name: "关卡145",
icon: "bg002",
gold: "634144015606",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 20,
hint: 130
},
146: {
key: 146,
name: "关卡146",
icon: "bg002",
gold: "665851216387",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 20,
hint: 130
},
147: {
key: 147,
name: "关卡147",
icon: "bg002",
gold: "699143777207",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 20,
hint: 130
},
148: {
key: 148,
name: "关卡148",
icon: "bg002",
gold: "734100966068",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 20,
hint: 130
},
149: {
key: 149,
name: "关卡149",
icon: "bg002",
gold: "770806014372",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 20,
hint: 130
},
150: {
key: 150,
name: "关卡150",
icon: "bg002",
gold: "8093463150910",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 130
},
151: {
key: 151,
name: "关卡151",
icon: "bg002",
gold: "849813630846",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 20,
hint: 140
},
152: {
key: 152,
name: "关卡152",
icon: "bg002",
gold: "892304312389",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 20,
hint: 140
},
153: {
key: 153,
name: "关卡153",
icon: "bg002",
gold: "936919528009",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 20,
hint: 140
},
154: {
key: 154,
name: "关卡154",
icon: "bg002",
gold: "983765504410",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 20,
hint: 140
},
155: {
key: 155,
name: "关卡155",
icon: "bg002",
gold: "1032953779631",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 20,
hint: 140
},
156: {
key: 156,
name: "关卡156",
icon: "bg002",
gold: "1084601468613",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 20,
hint: 140
},
157: {
key: 157,
name: "关卡157",
icon: "bg002",
gold: "1138831542044",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 20,
hint: 140
},
158: {
key: 158,
name: "关卡158",
icon: "bg002",
gold: "1195773119147",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 20,
hint: 140
},
159: {
key: 159,
name: "关卡159",
icon: "bg002",
gold: "1255561775105",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 20,
hint: 140
},
160: {
key: 160,
name: "关卡160",
icon: "bg002",
gold: "13308954816120",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 140
},
161: {
key: 161,
name: "关卡161",
icon: "bg002",
gold: "1410749210509",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 20,
hint: 150
},
162: {
key: 162,
name: "关卡162",
icon: "bg002",
gold: "1495394163140",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 20,
hint: 150
},
163: {
key: 163,
name: "关卡163",
icon: "bg002",
gold: "1585117812929",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 20,
hint: 150
},
164: {
key: 164,
name: "关卡164",
icon: "bg002",
gold: "1680224881705",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 20,
hint: 150
},
165: {
key: 165,
name: "关卡165",
icon: "bg002",
gold: "1781038374608",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 20,
hint: 150
},
166: {
key: 166,
name: "关卡166",
icon: "bg002",
gold: "1887900677085",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 20,
hint: 150
},
167: {
key: 167,
name: "关卡167",
icon: "bg002",
gold: "2001174717711",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 20,
hint: 150
},
168: {
key: 168,
name: "关卡168",
icon: "bg002",
gold: "2121245200774",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 20,
hint: 150
},
169: {
key: 169,
name: "关卡169",
icon: "bg002",
gold: "2248519912821",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 20,
hint: 150
},
170: {
key: 170,
name: "关卡170",
icon: "bg002",
gold: "23834311075910",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 150
},
171: {
key: 171,
name: "关卡171",
icon: "bg002",
gold: "2526436974047",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 20,
hint: 160
},
172: {
key: 172,
name: "关卡172",
icon: "bg002",
gold: "2678023192490",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 20,
hint: 160
},
173: {
key: 173,
name: "关卡173",
icon: "bg002",
gold: "2838704584040",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 20,
hint: 160
},
174: {
key: 174,
name: "关卡174",
icon: "bg002",
gold: "3009026859083",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 20,
hint: 160
},
175: {
key: 175,
name: "关卡175",
icon: "bg002",
gold: "3189568470628",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 20,
hint: 160
},
176: {
key: 176,
name: "关卡176",
icon: "bg002",
gold: "3380942578866",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 20,
hint: 160
},
177: {
key: 177,
name: "关卡177",
icon: "bg002",
gold: "3583799133598",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 20,
hint: 160
},
178: {
key: 178,
name: "关卡178",
icon: "bg002",
gold: "3798827081614",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 20,
hint: 160
},
179: {
key: 179,
name: "关卡179",
icon: "bg002",
gold: "4026756706511",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 20,
hint: 160
},
180: {
key: 180,
name: "关卡180",
icon: "bg002",
gold: "42683621089020",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 160
},
181: {
key: 181,
name: "关卡181",
icon: "bg002",
gold: "4524463835437",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 20,
hint: 170
},
182: {
key: 182,
name: "关卡182",
icon: "bg002",
gold: "4795931665564",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 20,
hint: 170
},
183: {
key: 183,
name: "关卡183",
icon: "bg002",
gold: "5083687565498",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 20,
hint: 170
},
184: {
key: 184,
name: "关卡184",
icon: "bg002",
gold: "5388708819428",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 20,
hint: 170
},
185: {
key: 185,
name: "关卡185",
icon: "bg002",
gold: "5712031348594",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 20,
hint: 170
},
186: {
key: 186,
name: "关卡186",
icon: "bg002",
gold: "6054753229510",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 20,
hint: 170
},
187: {
key: 187,
name: "关卡187",
icon: "bg002",
gold: "6418038423281",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 20,
hint: 170
},
188: {
key: 188,
name: "关卡188",
icon: "bg002",
gold: "6803120728678",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 20,
hint: 170
},
189: {
key: 189,
name: "关卡189",
icon: "bg002",
gold: "7211307972399",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 20,
hint: 170
},
190: {
key: 190,
name: "关卡190",
icon: "bg002",
gold: "76439864507430",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 170
},
191: {
key: 191,
name: "关卡191",
icon: "bg002",
gold: "8102625637788",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 20,
hint: 180
},
192: {
key: 192,
name: "关卡192",
icon: "bg002",
gold: "8588783176056",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 20,
hint: 180
},
193: {
key: 193,
name: "关卡193",
icon: "bg002",
gold: "9104110166620",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 20,
hint: 180
},
194: {
key: 194,
name: "关卡194",
icon: "bg002",
gold: "9650356776618",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 20,
hint: 180
},
195: {
key: 195,
name: "关卡195",
icon: "bg002",
gold: "10229378183216",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 20,
hint: 180
},
196: {
key: 196,
name: "关卡196",
icon: "bg002",
gold: "10843140874209",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 20,
hint: 180
},
197: {
key: 197,
name: "关卡197",
icon: "bg002",
gold: "11493729326662",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 20,
hint: 180
},
198: {
key: 198,
name: "关卡198",
icon: "bg002",
gold: "12183353086262",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 20,
hint: 180
},
199: {
key: 199,
name: "关卡199",
icon: "bg002",
gold: "12914354271438",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 20,
hint: 180
},
200: {
key: 200,
name: "关卡200",
icon: "bg002",
gold: "134309284422960",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 180
},
201: {
key: 201,
name: "关卡201",
icon: "bg002",
gold: "13968165579988",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 25,
hint: 0
},
202: {
key: 202,
name: "关卡202",
icon: "bg002",
gold: "14526892203188",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 25,
hint: 0
},
203: {
key: 203,
name: "关卡203",
icon: "bg002",
gold: "15107967891316",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 25,
hint: 0
},
204: {
key: 204,
name: "关卡204",
icon: "bg002",
gold: "15712286606969",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 25,
hint: 0
},
205: {
key: 205,
name: "关卡205",
icon: "bg002",
gold: "16340778071248",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 25,
hint: 0
},
206: {
key: 206,
name: "关卡206",
icon: "bg002",
gold: "16994409194098",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 25,
hint: 0
},
207: {
key: 207,
name: "关卡207",
icon: "bg002",
gold: "17674185561862",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 25,
hint: 0
},
208: {
key: 208,
name: "关卡208",
icon: "bg002",
gold: "18381152984337",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 25,
hint: 0
},
209: {
key: 209,
name: "关卡209",
icon: "bg002",
gold: "19116399103711",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 25,
hint: 0
},
210: {
key: 210,
name: "关卡210",
icon: "bg002",
gold: "198810550678600",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
211: {
key: 211,
name: "关卡211",
icon: "bg002",
gold: "20676297270575",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 25,
hint: 0
},
212: {
key: 212,
name: "关卡212",
icon: "bg002",
gold: "21503349161398",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 25,
hint: 0
},
213: {
key: 213,
name: "关卡213",
icon: "bg002",
gold: "22363483127854",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 25,
hint: 0
},
214: {
key: 214,
name: "关卡214",
icon: "bg002",
gold: "23258022452969",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 25,
hint: 0
},
215: {
key: 215,
name: "关卡215",
icon: "bg002",
gold: "24188343351088",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 25,
hint: 0
},
216: {
key: 216,
name: "关卡216",
icon: "bg002",
gold: "25155877085132",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 25,
hint: 0
},
217: {
key: 217,
name: "关卡217",
icon: "bg002",
gold: "26162112168538",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 25,
hint: 0
},
218: {
key: 218,
name: "关卡218",
icon: "bg002",
gold: "27208596655280",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 25,
hint: 0
},
219: {
key: 219,
name: "关卡219",
icon: "bg002",
gold: "28296940521492",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 25,
hint: 0
},
220: {
key: 220,
name: "关卡220",
icon: "bg002",
gold: "294288181423520",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
221: {
key: 221,
name: "关卡221",
icon: "bg002",
gold: "30605970868047",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 25,
hint: 0
},
222: {
key: 222,
name: "关卡222",
icon: "bg002",
gold: "31830209702769",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 25,
hint: 0
},
223: {
key: 223,
name: "关卡223",
icon: "bg002",
gold: "33103418090880",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 25,
hint: 0
},
224: {
key: 224,
name: "关卡224",
icon: "bg002",
gold: "34427554814516",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 25,
hint: 0
},
225: {
key: 225,
name: "关卡225",
icon: "bg002",
gold: "36148932555242",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 25,
hint: 0
},
226: {
key: 226,
name: "关卡226",
icon: "bg002",
gold: "37956379183005",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 25,
hint: 0
},
227: {
key: 227,
name: "关卡227",
icon: "bg002",
gold: "39854198142156",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 25,
hint: 0
},
228: {
key: 228,
name: "关卡228",
icon: "bg002",
gold: "41846908049264",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 25,
hint: 0
},
229: {
key: 229,
name: "关卡229",
icon: "bg002",
gold: "43939253451728",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 25,
hint: 0
},
230: {
key: 230,
name: "关卡230",
icon: "bg002",
gold: "461362161243150",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
231: {
key: 231,
name: "关卡231",
icon: "bg002",
gold: "48443026930531",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 25,
hint: 0
},
232: {
key: 232,
name: "关卡232",
icon: "bg002",
gold: "50865178277058",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 25,
hint: 0
},
233: {
key: 233,
name: "关卡233",
icon: "bg002",
gold: "53408437190911",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 25,
hint: 0
},
234: {
key: 234,
name: "关卡234",
icon: "bg002",
gold: "56078859050457",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 25,
hint: 0
},
235: {
key: 235,
name: "关卡235",
icon: "bg002",
gold: "58882802002980",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 25,
hint: 0
},
236: {
key: 236,
name: "关卡236",
icon: "bg002",
gold: "61826942103129",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 25,
hint: 0
},
237: {
key: 237,
name: "关卡237",
icon: "bg002",
gold: "64918289208286",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 25,
hint: 0
},
238: {
key: 238,
name: "关卡238",
icon: "bg002",
gold: "68164203668701",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 25,
hint: 0
},
239: {
key: 239,
name: "关卡239",
icon: "bg002",
gold: "71572413852137",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 25,
hint: 0
},
240: {
key: 240,
name: "关卡240",
icon: "bg002",
gold: "751510345447440",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
241: {
key: 241,
name: "关卡241",
icon: "bg002",
gold: "78908586271982",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 25,
hint: 0
},
242: {
key: 242,
name: "关卡242",
icon: "bg002",
gold: "82854015585582",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 25,
hint: 0
},
243: {
key: 243,
name: "关卡243",
icon: "bg002",
gold: "86996716364862",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 25,
hint: 0
},
244: {
key: 244,
name: "关卡244",
icon: "bg002",
gold: "91346552183106",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 25,
hint: 0
},
245: {
key: 245,
name: "关卡245",
icon: "bg002",
gold: "95913879792262",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 25,
hint: 0
},
246: {
key: 246,
name: "关卡246",
icon: "bg002",
gold: "100709573781875",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 25,
hint: 0
},
247: {
key: 247,
name: "关卡247",
icon: "bg002",
gold: "105745052470969",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 25,
hint: 0
},
248: {
key: 248,
name: "关卡248",
icon: "bg002",
gold: "111032305094517",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 25,
hint: 0
},
249: {
key: 249,
name: "关卡249",
icon: "bg002",
gold: "116583920349243",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 25,
hint: 0
},
250: {
key: 250,
name: "关卡250",
icon: "bg002",
gold: "1224131163667050",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
251: {
key: 251,
name: "关卡251",
icon: "bg002",
gold: "128533772185040",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 25,
hint: 0
},
252: {
key: 252,
name: "关卡252",
icon: "bg002",
gold: "134960460794292",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 25,
hint: 0
},
253: {
key: 253,
name: "关卡253",
icon: "bg002",
gold: "141708483834007",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 25,
hint: 0
},
254: {
key: 254,
name: "关卡254",
icon: "bg002",
gold: "148793908025707",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 25,
hint: 0
},
255: {
key: 255,
name: "关卡255",
icon: "bg002",
gold: "156233603426992",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 25,
hint: 0
},
256: {
key: 256,
name: "关卡256",
icon: "bg002",
gold: "164045283598342",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 25,
hint: 0
},
257: {
key: 257,
name: "关卡257",
icon: "bg002",
gold: "172247547778259",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 25,
hint: 0
},
258: {
key: 258,
name: "关卡258",
icon: "bg002",
gold: "180859925167172",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 25,
hint: 0
},
259: {
key: 259,
name: "关卡259",
icon: "bg002",
gold: "189902921425531",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 25,
hint: 0
},
260: {
key: 260,
name: "关卡260",
icon: "bg002",
gold: "1993980674968080",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
261: {
key: 261,
name: "关卡261",
icon: "bg002",
gold: "209367970871648",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 25,
hint: 0
},
262: {
key: 262,
name: "关卡262",
icon: "bg002",
gold: "219836369415230",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 25,
hint: 0
},
263: {
key: 263,
name: "关卡263",
icon: "bg002",
gold: "230828187885992",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 25,
hint: 0
},
264: {
key: 264,
name: "关卡264",
icon: "bg002",
gold: "242369597280292",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 25,
hint: 0
},
265: {
key: 265,
name: "关卡265",
icon: "bg002",
gold: "254488077144307",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 25,
hint: 0
},
266: {
key: 266,
name: "关卡266",
icon: "bg002",
gold: "267212481001522",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 25,
hint: 0
},
267: {
key: 267,
name: "关卡267",
icon: "bg002",
gold: "280573105051598",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 25,
hint: 0
},
268: {
key: 268,
name: "关卡268",
icon: "bg002",
gold: "294601760304178",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 25,
hint: 0
},
269: {
key: 269,
name: "关卡269",
icon: "bg002",
gold: "309331848319387",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 25,
hint: 0
},
270: {
key: 270,
name: "关卡270",
icon: "bg002",
gold: "3247984407353560",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
271: {
key: 271,
name: "关卡271",
icon: "bg002",
gold: "341038362772124",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 25,
hint: 0
},
272: {
key: 272,
name: "关卡272",
icon: "bg002",
gold: "358090280910730",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 25,
hint: 0
},
273: {
key: 273,
name: "关卡273",
icon: "bg002",
gold: "375994794956267",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 25,
hint: 0
},
274: {
key: 274,
name: "关卡274",
icon: "bg002",
gold: "394794534704080",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 25,
hint: 0
},
275: {
key: 275,
name: "关卡275",
icon: "bg002",
gold: "414534261439284",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 25,
hint: 0
},
276: {
key: 276,
name: "关卡276",
icon: "bg002",
gold: "435260974511248",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 25,
hint: 0
},
277: {
key: 277,
name: "关卡277",
icon: "bg002",
gold: "457024023236810",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 25,
hint: 0
},
278: {
key: 278,
name: "关卡278",
icon: "bg002",
gold: "479875224398651",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 25,
hint: 0
},
279: {
key: 279,
name: "关卡279",
icon: "bg002",
gold: "503868985618584",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 25,
hint: 0
},
280: {
key: 280,
name: "关卡280",
icon: "bg002",
gold: "5290624348995130",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
281: {
key: 281,
name: "关卡281",
icon: "bg002",
gold: "555515556644489",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 25,
hint: 0
},
282: {
key: 282,
name: "关卡282",
icon: "bg002",
gold: "583291334476714",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 25,
hint: 0
},
283: {
key: 283,
name: "关卡283",
icon: "bg002",
gold: "612455901200550",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 25,
hint: 0
},
284: {
key: 284,
name: "关卡284",
icon: "bg002",
gold: "643078696260578",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 25,
hint: 0
},
285: {
key: 285,
name: "关卡285",
icon: "bg002",
gold: "675232631073607",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 25,
hint: 0
},
286: {
key: 286,
name: "关卡286",
icon: "bg002",
gold: "708994262627287",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 25,
hint: 0
},
287: {
key: 287,
name: "关卡287",
icon: "bg002",
gold: "744443975758651",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 25,
hint: 0
},
288: {
key: 288,
name: "关卡288",
icon: "bg002",
gold: "781666174546584",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 25,
hint: 0
},
289: {
key: 289,
name: "关卡289",
icon: "bg002",
gold: "820749483273913",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 25,
hint: 0
},
290: {
key: 290,
name: "关卡290",
icon: "bg002",
gold: "8617869574376090",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
291: {
key: 291,
name: "关卡291",
icon: "bg002",
gold: "904876305309489",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 25,
hint: 0
},
292: {
key: 292,
name: "关卡292",
icon: "bg002",
gold: "950120120574963",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 25,
hint: 0
},
293: {
key: 293,
name: "关卡293",
icon: "bg002",
gold: "997626126603711",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 25,
hint: 0
},
294: {
key: 294,
name: "关卡294",
icon: "bg002",
gold: "1047507432933900",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 25,
hint: 0
},
295: {
key: 295,
name: "关卡295",
icon: "bg002",
gold: "1099882804580600",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 25,
hint: 0
},
296: {
key: 296,
name: "关卡296",
icon: "bg002",
gold: "1154876944809630",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 25,
hint: 0
},
297: {
key: 297,
name: "关卡297",
icon: "bg002",
gold: "1212620792050110",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 25,
hint: 0
},
298: {
key: 298,
name: "关卡298",
icon: "bg002",
gold: "1273251831652620",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 25,
hint: 0
},
299: {
key: 299,
name: "关卡299",
icon: "bg002",
gold: "1336914423235250",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 25,
hint: 0
},
300: {
key: 300,
name: "关卡300",
icon: "bg002",
gold: "14037601443970100",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
301: {
key: 301,
name: "关卡301",
icon: "bg002",
gold: "1473948151616860",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 30,
hint: 0
},
302: {
key: 302,
name: "关卡302",
icon: "bg002",
gold: "1547645559197700",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 30,
hint: 0
},
303: {
key: 303,
name: "关卡303",
icon: "bg002",
gold: "1625027837157590",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 30,
hint: 0
},
304: {
key: 304,
name: "关卡304",
icon: "bg002",
gold: "1706279229015470",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 30,
hint: 0
},
305: {
key: 305,
name: "关卡305",
icon: "bg002",
gold: "1791593190466240",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 30,
hint: 0
},
306: {
key: 306,
name: "关卡306",
icon: "bg002",
gold: "1881172849989550",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 30,
hint: 0
},
307: {
key: 307,
name: "关卡307",
icon: "bg002",
gold: "1975231492489030",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 30,
hint: 0
},
308: {
key: 308,
name: "关卡308",
icon: "bg002",
gold: "2073993067113480",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 30,
hint: 0
},
309: {
key: 309,
name: "关卡309",
icon: "bg002",
gold: "2177692720469150",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 30,
hint: 0
},
310: {
key: 310,
name: "关卡310",
icon: "bg002",
gold: "22865773564926100",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
311: {
key: 311,
name: "关卡311",
icon: "bg002",
gold: "2400906224317240",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 30,
hint: 0
},
312: {
key: 312,
name: "关卡312",
icon: "bg002",
gold: "2520951535533100",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 30,
hint: 0
},
313: {
key: 313,
name: "关卡313",
icon: "bg002",
gold: "2646999112309760",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 30,
hint: 0
},
314: {
key: 314,
name: "关卡314",
icon: "bg002",
gold: "2779349067925250",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 30,
hint: 0
},
315: {
key: 315,
name: "关卡315",
icon: "bg002",
gold: "2918316521321510",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 30,
hint: 0
},
316: {
key: 316,
name: "关卡316",
icon: "bg002",
gold: "3064232347387590",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 30,
hint: 0
},
317: {
key: 317,
name: "关卡317",
icon: "bg002",
gold: "3217443964756970",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 30,
hint: 0
},
318: {
key: 318,
name: "关卡318",
icon: "bg002",
gold: "3378316162994820",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 30,
hint: 0
},
319: {
key: 319,
name: "关卡319",
icon: "bg002",
gold: "3547231971144560",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 30,
hint: 0
},
320: {
key: 320,
name: "关卡320",
icon: "bg002",
gold: "37245935697017900",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
321: {
key: 321,
name: "关卡321",
icon: "bg002",
gold: "3910823248186880",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 30,
hint: 0
},
322: {
key: 322,
name: "关卡322",
icon: "bg002",
gold: "4106364410596220",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 30,
hint: 0
},
323: {
key: 323,
name: "关卡323",
icon: "bg002",
gold: "4311682631126030",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 30,
hint: 0
},
324: {
key: 324,
name: "关卡324",
icon: "bg002",
gold: "4527266762682330",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 30,
hint: 0
},
325: {
key: 325,
name: "关卡325",
icon: "bg002",
gold: "4753630100816450",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 30,
hint: 0
},
326: {
key: 326,
name: "关卡326",
icon: "bg002",
gold: "4991311605857270",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 30,
hint: 0
},
327: {
key: 327,
name: "关卡327",
icon: "bg002",
gold: "5240877186150130",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 30,
hint: 0
},
328: {
key: 328,
name: "关卡328",
icon: "bg002",
gold: "5502921045457640",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 30,
hint: 0
},
329: {
key: 329,
name: "关卡329",
icon: "bg002",
gold: "5778067097730520",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 30,
hint: 0
},
330: {
key: 330,
name: "关卡330",
icon: "bg002",
gold: "60669704526170500",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
331: {
key: 331,
name: "关卡331",
icon: "bg002",
gold: "6370318975247900",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 30,
hint: 0
},
332: {
key: 332,
name: "关卡332",
icon: "bg002",
gold: "6688834924010300",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 30,
hint: 0
},
333: {
key: 333,
name: "关卡333",
icon: "bg002",
gold: "7023276670210820",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 30,
hint: 0
},
334: {
key: 334,
name: "关卡334",
icon: "bg002",
gold: "7374440503721360",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 30,
hint: 0
},
335: {
key: 335,
name: "关卡335",
icon: "bg002",
gold: "7743162528907430",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 30,
hint: 0
},
336: {
key: 336,
name: "关卡336",
icon: "bg002",
gold: "8130320655352800",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 30,
hint: 0
},
337: {
key: 337,
name: "关卡337",
icon: "bg002",
gold: "8536836688120440",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 30,
hint: 0
},
338: {
key: 338,
name: "关卡338",
icon: "bg002",
gold: "8963678522526460",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 30,
hint: 0
},
339: {
key: 339,
name: "关卡339",
icon: "bg002",
gold: "9411862448652780",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 30,
hint: 0
},
340: {
key: 340,
name: "关卡340",
icon: "bg002",
gold: "98824555710854200",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
341: {
key: 341,
name: "关卡341",
icon: "bg002",
gold: "10376578349639700",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 30,
hint: 0
},
342: {
key: 342,
name: "关卡342",
icon: "bg002",
gold: "10895407267121700",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 30,
hint: 0
},
343: {
key: 343,
name: "关卡343",
icon: "bg002",
gold: "11440177630477800",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 30,
hint: 0
},
344: {
key: 344,
name: "关卡344",
icon: "bg002",
gold: "12012186512001700",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 30,
hint: 0
},
345: {
key: 345,
name: "关卡345",
icon: "bg002",
gold: "12612795837601800",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 30,
hint: 0
},
346: {
key: 346,
name: "关卡346",
icon: "bg002",
gold: "13243435629481900",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 30,
hint: 0
},
347: {
key: 347,
name: "关卡347",
icon: "bg002",
gold: "13905607410956000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 30,
hint: 0
},
348: {
key: 348,
name: "关卡348",
icon: "bg002",
gold: "14600887781503800",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 30,
hint: 0
},
349: {
key: 349,
name: "关卡349",
icon: "bg002",
gold: "15330932170579000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 30,
hint: 0
},
350: {
key: 350,
name: "关卡350",
icon: "bg002",
gold: "162507881008137000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
351: {
key: 351,
name: "关卡351",
icon: "bg002",
gold: "17225835386862500",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 30,
hint: 0
},
352: {
key: 352,
name: "关卡352",
icon: "bg002",
gold: "18259385510074300",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 30,
hint: 0
},
353: {
key: 353,
name: "关卡353",
icon: "bg002",
gold: "19354948640678800",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 30,
hint: 0
},
354: {
key: 354,
name: "关卡354",
icon: "bg002",
gold: "20516245559119500",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 30,
hint: 0
},
355: {
key: 355,
name: "关卡355",
icon: "bg002",
gold: "21747220292666700",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 30,
hint: 0
},
356: {
key: 356,
name: "关卡356",
icon: "bg002",
gold: "23052053510226700",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 30,
hint: 0
},
357: {
key: 357,
name: "关卡357",
icon: "bg002",
gold: "24435176720840300",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 30,
hint: 0
},
358: {
key: 358,
name: "关卡358",
icon: "bg002",
gold: "25901287324090700",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 30,
hint: 0
},
359: {
key: 359,
name: "关卡359",
icon: "bg002",
gold: "27455364563536100",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 30,
hint: 0
},
360: {
key: 360,
name: "关卡360",
icon: "bg002",
gold: "291026864373483000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
361: {
key: 361,
name: "关卡361",
icon: "bg002",
gold: "30848847623589200",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 30,
hint: 0
},
362: {
key: 362,
name: "关卡362",
icon: "bg002",
gold: "32699778481004600",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 30,
hint: 0
},
363: {
key: 363,
name: "关卡363",
icon: "bg002",
gold: "34661765189864900",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 30,
hint: 0
},
364: {
key: 364,
name: "关卡364",
icon: "bg002",
gold: "36741471101256800",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 30,
hint: 0
},
365: {
key: 365,
name: "关卡365",
icon: "bg002",
gold: "38945959367332200",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 30,
hint: 0
},
366: {
key: 366,
name: "关卡366",
icon: "bg002",
gold: "41282716929372100",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 30,
hint: 0
},
367: {
key: 367,
name: "关卡367",
icon: "bg002",
gold: "43759679945134400",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 30,
hint: 0
},
368: {
key: 368,
name: "关卡368",
icon: "bg002",
gold: "46385260741842500",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 30,
hint: 0
},
369: {
key: 369,
name: "关卡369",
icon: "bg002",
gold: "49168376386353100",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 30,
hint: 0
},
370: {
key: 370,
name: "关卡370",
icon: "bg002",
gold: "521184789695343000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
371: {
key: 371,
name: "关卡371",
icon: "bg002",
gold: "55245587707706400",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 30,
hint: 0
},
372: {
key: 372,
name: "关卡372",
icon: "bg002",
gold: "58560322970168800",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 30,
hint: 0
},
373: {
key: 373,
name: "关卡373",
icon: "bg002",
gold: "62073942348378900",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 30,
hint: 0
},
374: {
key: 374,
name: "关卡374",
icon: "bg002",
gold: "65798378889281600",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 30,
hint: 0
},
375: {
key: 375,
name: "关卡375",
icon: "bg002",
gold: "69088297833745700",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 30,
hint: 0
},
376: {
key: 376,
name: "关卡376",
icon: "bg002",
gold: "72542712725433000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 30,
hint: 0
},
377: {
key: 377,
name: "关卡377",
icon: "bg002",
gold: "76169848361704700",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 30,
hint: 0
},
378: {
key: 378,
name: "关卡378",
icon: "bg002",
gold: "79978340779789900",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 30,
hint: 0
},
379: {
key: 379,
name: "关卡379",
icon: "bg002",
gold: "83977257818779400",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 30,
hint: 0
},
380: {
key: 380,
name: "关卡380",
icon: "bg002",
gold: "881761207097184000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
381: {
key: 381,
name: "关卡381",
icon: "bg002",
gold: "92584926745204300",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 30,
hint: 0
},
382: {
key: 382,
name: "关卡382",
icon: "bg002",
gold: "97214173082464500",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 30,
hint: 0
},
383: {
key: 383,
name: "关卡383",
icon: "bg002",
gold: "102074881736588000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 30,
hint: 0
},
384: {
key: 384,
name: "关卡384",
icon: "bg002",
gold: "107178625823417000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 30,
hint: 0
},
385: {
key: 385,
name: "关卡385",
icon: "bg002",
gold: "112537557114588000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 30,
hint: 0
},
386: {
key: 386,
name: "关卡386",
icon: "bg002",
gold: "118164434970317000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 30,
hint: 0
},
387: {
key: 387,
name: "关卡387",
icon: "bg002",
gold: "124072656718833000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 30,
hint: 0
},
388: {
key: 388,
name: "关卡388",
icon: "bg002",
gold: "130276289554775000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 30,
hint: 0
},
389: {
key: 389,
name: "关卡389",
icon: "bg002",
gold: "136790104032514000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 30,
hint: 0
},
390: {
key: 390,
name: "关卡390",
icon: "bg002",
gold: "1436296092341400000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
391: {
key: 391,
name: "关卡391",
icon: "bg002",
gold: "150811089695847000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 30,
hint: 0
},
392: {
key: 392,
name: "关卡392",
icon: "bg002",
gold: "158351644180639000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 30,
hint: 0
},
393: {
key: 393,
name: "关卡393",
icon: "bg002",
gold: "166269226389671000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 30,
hint: 0
},
394: {
key: 394,
name: "关卡394",
icon: "bg002",
gold: "174582687709155000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 30,
hint: 0
},
395: {
key: 395,
name: "关卡395",
icon: "bg002",
gold: "183311822094613000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 30,
hint: 0
},
396: {
key: 396,
name: "关卡396",
icon: "bg002",
gold: "192477413199344000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 30,
hint: 0
},
397: {
key: 397,
name: "关卡397",
icon: "bg002",
gold: "202101283859311000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 30,
hint: 0
},
398: {
key: 398,
name: "关卡398",
icon: "bg002",
gold: "212206348052277000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 30,
hint: 0
},
399: {
key: 399,
name: "关卡399",
icon: "bg002",
gold: "222816665454891000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 30,
hint: 0
},
400: {
key: 400,
name: "关卡400",
icon: "bg002",
gold: "2339574987276360000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
401: {
key: 401,
name: "关卡401",
icon: "bg002",
gold: "245655373664018000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 35,
hint: 0
},
402: {
key: 402,
name: "关卡402",
icon: "bg002",
gold: "257938142347219000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 35,
hint: 0
},
403: {
key: 403,
name: "关卡403",
icon: "bg002",
gold: "270835049464580000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 35,
hint: 0
},
404: {
key: 404,
name: "关卡404",
icon: "bg002",
gold: "284376801937809000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 35,
hint: 0
},
405: {
key: 405,
name: "关卡405",
icon: "bg002",
gold: "298595642034700000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 35,
hint: 0
},
406: {
key: 406,
name: "关卡406",
icon: "bg002",
gold: "313525424136435000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 35,
hint: 0
},
407: {
key: 407,
name: "关卡407",
icon: "bg002",
gold: "329201695343257000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 35,
hint: 0
},
408: {
key: 408,
name: "关卡408",
icon: "bg002",
gold: "345661780110420000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 35,
hint: 0
},
409: {
key: 409,
name: "关卡409",
icon: "bg002",
gold: "362944869115941000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 35,
hint: 0
},
410: {
key: 410,
name: "关卡410",
icon: "bg002",
gold: "3810921125717380000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
411: {
key: 411,
name: "关卡411",
icon: "bg002",
gold: "400146718200325000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 35,
hint: 0
},
412: {
key: 412,
name: "关卡412",
icon: "bg002",
gold: "420154054110341000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 35,
hint: 0
},
413: {
key: 413,
name: "关卡413",
icon: "bg002",
gold: "441161756815858000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 35,
hint: 0
},
414: {
key: 414,
name: "关卡414",
icon: "bg002",
gold: "463219844656651000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 35,
hint: 0
},
415: {
key: 415,
name: "关卡415",
icon: "bg002",
gold: "486380836889484000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 35,
hint: 0
},
416: {
key: 416,
name: "关卡416",
icon: "bg002",
gold: "510699878733958000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 35,
hint: 0
},
417: {
key: 417,
name: "关卡417",
icon: "bg002",
gold: "536234872670656000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 35,
hint: 0
},
418: {
key: 418,
name: "关卡418",
icon: "bg002",
gold: "563046616304189000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 35,
hint: 0
},
419: {
key: 419,
name: "关卡419",
icon: "bg002",
gold: "591198947119398000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 35,
hint: 0
},
420: {
key: 420,
name: "关卡420",
icon: "bg002",
gold: "6207588944753680000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
421: {
key: 421,
name: "关卡421",
icon: "bg002",
gold: "651796839199136000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 35,
hint: 0
},
422: {
key: 422,
name: "关卡422",
icon: "bg002",
gold: "684386681159093000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 35,
hint: 0
},
423: {
key: 423,
name: "关卡423",
icon: "bg002",
gold: "718606015217048000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 35,
hint: 0
},
424: {
key: 424,
name: "关卡424",
icon: "bg002",
gold: "754536315977901000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 35,
hint: 0
},
425: {
key: 425,
name: "关卡425",
icon: "bg002",
gold: "792263131776796000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 35,
hint: 0
},
426: {
key: 426,
name: "关卡426",
icon: "bg002",
gold: "831876288365636000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 35,
hint: 0
},
427: {
key: 427,
name: "关卡427",
icon: "bg002",
gold: "873470102783918000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 35,
hint: 0
},
428: {
key: 428,
name: "关卡428",
icon: "bg002",
gold: "917143607923114000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 35,
hint: 0
},
429: {
key: 429,
name: "关卡429",
icon: "bg002",
gold: "963000788319270000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 35,
hint: 0
},
430: {
key: 430,
name: "关卡430",
icon: "bg002",
gold: "10111508277352300000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
431: {
key: 431,
name: "关卡431",
icon: "bg002",
gold: "1061708369121990000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 35,
hint: 0
},
432: {
key: 432,
name: "关卡432",
icon: "bg002",
gold: "1114793787578090000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 35,
hint: 0
},
433: {
key: 433,
name: "关卡433",
icon: "bg002",
gold: "1170533476956990000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 35,
hint: 0
},
434: {
key: 434,
name: "关卡434",
icon: "bg002",
gold: "1229060150804840000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 35,
hint: 0
},
435: {
key: 435,
name: "关卡435",
icon: "bg002",
gold: "1290513158345080000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 35,
hint: 0
},
436: {
key: 436,
name: "关卡436",
icon: "bg002",
gold: "1355038816262330000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 35,
hint: 0
},
437: {
key: 437,
name: "关卡437",
icon: "bg002",
gold: "1422790757075450000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 35,
hint: 0
},
438: {
key: 438,
name: "关卡438",
icon: "bg002",
gold: "1493930294929220000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 35,
hint: 0
},
439: {
key: 439,
name: "关卡439",
icon: "bg002",
gold: "1568626809675680000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 35,
hint: 0
},
440: {
key: 440,
name: "关卡440",
icon: "bg002",
gold: "16470581501594600000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
441: {
key: 441,
name: "关卡441",
icon: "bg002",
gold: "1729411057667430000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 35,
hint: 0
},
442: {
key: 442,
name: "关卡442",
icon: "bg002",
gold: "1815881610550800000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 35,
hint: 0
},
443: {
key: 443,
name: "关卡443",
icon: "bg002",
gold: "1906675691078340000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 35,
hint: 0
},
444: {
key: 444,
name: "关卡444",
icon: "bg002",
gold: "2002009475632260000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 35,
hint: 0
},
445: {
key: 445,
name: "关卡445",
icon: "bg002",
gold: "2102109949413870000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 35,
hint: 0
},
446: {
key: 446,
name: "关卡446",
icon: "bg002",
gold: "2207215446884560000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 35,
hint: 0
},
447: {
key: 447,
name: "关卡447",
icon: "bg002",
gold: "2317576219228790000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 35,
hint: 0
},
448: {
key: 448,
name: "关卡448",
icon: "bg002",
gold: "2433455030190230000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 35,
hint: 0
},
449: {
key: 449,
name: "关卡449",
icon: "bg002",
gold: "2555127781699740000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 35,
hint: 0
},
450: {
key: 450,
name: "关卡450",
icon: "bg002",
gold: "26828841707847300000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
451: {
key: 451,
name: "关卡451",
icon: "bg002",
gold: "2817028379323970000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 35,
hint: 0
},
452: {
key: 452,
name: "关卡452",
icon: "bg002",
gold: "2957879798290170000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 35,
hint: 0
},
453: {
key: 453,
name: "关卡453",
icon: "bg002",
gold: "3105773788204680000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 35,
hint: 0
},
454: {
key: 454,
name: "关卡454",
icon: "bg002",
gold: "3261062477614910000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 35,
hint: 0
},
455: {
key: 455,
name: "关卡455",
icon: "bg002",
gold: "3424115601495660000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 35,
hint: 0
},
456: {
key: 456,
name: "关卡456",
icon: "bg002",
gold: "3595321381570440000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 35,
hint: 0
},
457: {
key: 457,
name: "关卡457",
icon: "bg002",
gold: "3775087450648960000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 35,
hint: 0
},
458: {
key: 458,
name: "关卡458",
icon: "bg002",
gold: "3963841823181410000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 35,
hint: 0
},
459: {
key: 459,
name: "关卡459",
icon: "bg002",
gold: "4162033914340480000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 35,
hint: 0
},
460: {
key: 460,
name: "关卡460",
icon: "bg002",
gold: "43701356100575000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
461: {
key: 461,
name: "关卡461",
icon: "bg002",
gold: "4588642390560380000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 35,
hint: 0
},
462: {
key: 462,
name: "关卡462",
icon: "bg002",
gold: "4818074510088400000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 35,
hint: 0
},
463: {
key: 463,
name: "关卡463",
icon: "bg002",
gold: "5058978235592820000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 35,
hint: 0
},
464: {
key: 464,
name: "关卡464",
icon: "bg002",
gold: "5311927147372460000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 35,
hint: 0
},
465: {
key: 465,
name: "关卡465",
icon: "bg002",
gold: "5577523504741080000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 35,
hint: 0
},
466: {
key: 466,
name: "关卡466",
icon: "bg002",
gold: "5856399679978130000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 35,
hint: 0
},
467: {
key: 467,
name: "关卡467",
icon: "bg002",
gold: "6149219663977040000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 35,
hint: 0
},
468: {
key: 468,
name: "关卡468",
icon: "bg002",
gold: "6456680647175890000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 35,
hint: 0
},
469: {
key: 469,
name: "关卡469",
icon: "bg002",
gold: "6779514679534690000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 35,
hint: 0
},
470: {
key: 470,
name: "关卡470",
icon: "bg002",
gold: "71184904135114300000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
471: {
key: 471,
name: "关卡471",
icon: "bg002",
gold: "7474414934187000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 35,
hint: 0
},
472: {
key: 472,
name: "关卡472",
icon: "bg002",
gold: "7848135680896350000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 35,
hint: 0
},
473: {
key: 473,
name: "关卡473",
icon: "bg002",
gold: "8240542464941170000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 35,
hint: 0
},
474: {
key: 474,
name: "关卡474",
icon: "bg002",
gold: "8652569588188230000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 35,
hint: 0
},
475: {
key: 475,
name: "关卡475",
icon: "bg002",
gold: "9171723763479520000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 35,
hint: 0
},
476: {
key: 476,
name: "关卡476",
icon: "bg002",
gold: "9722027189288290000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 35,
hint: 0
},
477: {
key: 477,
name: "关卡477",
icon: "bg002",
gold: "10305348820645600000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 35,
hint: 0
},
478: {
key: 478,
name: "关卡478",
icon: "bg002",
gold: "10923669749884300000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 35,
hint: 0
},
479: {
key: 479,
name: "关卡479",
icon: "bg002",
gold: "11579089934877400000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 35,
hint: 0
},
480: {
key: 480,
name: "关卡480",
icon: "bg002",
gold: "122738353309700000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
481: {
key: 481,
name: "关卡481",
icon: "bg002",
gold: "13010265450828200000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 35,
hint: 0
},
482: {
key: 482,
name: "关卡482",
icon: "bg002",
gold: "13790881377877900000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 35,
hint: 0
},
483: {
key: 483,
name: "关卡483",
icon: "bg002",
gold: "14618334260550600000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 35,
hint: 0
},
484: {
key: 484,
name: "关卡484",
icon: "bg002",
gold: "15495434316183600000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 35,
hint: 0
},
485: {
key: 485,
name: "关卡485",
icon: "bg002",
gold: "16425160375154600000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 35,
hint: 0
},
486: {
key: 486,
name: "关卡486",
icon: "bg002",
gold: "17410669997663900000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 35,
hint: 0
},
487: {
key: 487,
name: "关卡487",
icon: "bg002",
gold: "18455310197523700000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 35,
hint: 0
},
488: {
key: 488,
name: "关卡488",
icon: "bg002",
gold: "19562628809375100000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 35,
hint: 0
},
489: {
key: 489,
name: "关卡489",
icon: "bg002",
gold: "20736386537937600000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 35,
hint: 0
},
490: {
key: 490,
name: "关卡490",
icon: "bg002",
gold: "219805697302139000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
491: {
key: 491,
name: "关卡491",
icon: "bg002",
gold: "23299403914026700000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 35,
hint: 0
},
492: {
key: 492,
name: "关卡492",
icon: "bg002",
gold: "24697368148868300000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 35,
hint: 0
},
493: {
key: 493,
name: "关卡493",
icon: "bg002",
gold: "26179210237800400000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 35,
hint: 0
},
494: {
key: 494,
name: "关卡494",
icon: "bg002",
gold: "27749962852068400000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 35,
hint: 0
},
495: {
key: 495,
name: "关卡495",
icon: "bg002",
gold: "29414960623192500000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 35,
hint: 0
},
496: {
key: 496,
name: "关卡496",
icon: "bg002",
gold: "31179858260584100000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 35,
hint: 0
},
497: {
key: 497,
name: "关卡497",
icon: "bg002",
gold: "33050649756219200000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 35,
hint: 0
},
498: {
key: 498,
name: "关卡498",
icon: "bg002",
gold: "35033688741592400000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 35,
hint: 0
},
499: {
key: 499,
name: "关卡499",
icon: "bg002",
gold: "37135710066087900000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 35,
hint: 0
},
500: {
key: 500,
name: "关卡500",
icon: "bg002",
gold: "389924955693923000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
501: {
key: 501,
name: "关卡501",
icon: "bg002",
gold: "40942120347861900000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 40,
hint: 0
},
502: {
key: 502,
name: "关卡502",
icon: "bg002",
gold: "42989226365255000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 40,
hint: 0
},
503: {
key: 503,
name: "关卡503",
icon: "bg002",
gold: "45138687683517800000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 40,
hint: 0
},
504: {
key: 504,
name: "关卡504",
icon: "bg002",
gold: "47395622067693700000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 40,
hint: 0
},
505: {
key: 505,
name: "关卡505",
icon: "bg002",
gold: "49765403171078400000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 40,
hint: 0
},
506: {
key: 506,
name: "关卡506",
icon: "bg002",
gold: "52253673329632300000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 40,
hint: 0
},
507: {
key: 507,
name: "关卡507",
icon: "bg002",
gold: "54866356996113900000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 40,
hint: 0
},
508: {
key: 508,
name: "关卡508",
icon: "bg002",
gold: "57609674845919600000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 40,
hint: 0
},
509: {
key: 509,
name: "关卡509",
icon: "bg002",
gold: "60490158588215600000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 40,
hint: 0
},
510: {
key: 510,
name: "关卡510",
icon: "bg002",
gold: "635146665176264000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
511: {
key: 511,
name: "关卡511",
icon: "bg002",
gold: "66690399843507700000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 40,
hint: 0
},
512: {
key: 512,
name: "关卡512",
icon: "bg002",
gold: "70024919835683100000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 40,
hint: 0
},
513: {
key: 513,
name: "关卡513",
icon: "bg002",
gold: "73526165827467300000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 40,
hint: 0
},
514: {
key: 514,
name: "关卡514",
icon: "bg002",
gold: "77202474118840700000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 40,
hint: 0
},
515: {
key: 515,
name: "关卡515",
icon: "bg002",
gold: "81062597824782700000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 40,
hint: 0
},
516: {
key: 516,
name: "关卡516",
icon: "bg002",
gold: "85115727716021800000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 40,
hint: 0
},
517: {
key: 517,
name: "关卡517",
icon: "bg002",
gold: "89371514101822900000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 40,
hint: 0
},
518: {
key: 518,
name: "关卡518",
icon: "bg002",
gold: "93840089806914100000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 40,
hint: 0
},
519: {
key: 519,
name: "关卡519",
icon: "bg002",
gold: "98532094297259800000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 40,
hint: 0
},
520: {
key: 520,
name: "关卡520",
icon: "bg002",
gold: "1034586990121230000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
521: {
key: 521,
name: "关卡521",
icon: "bg002",
gold: "108631633962729000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 40,
hint: 0
},
522: {
key: 522,
name: "关卡522",
icon: "bg002",
gold: "114063215660865000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 40,
hint: 0
},
523: {
key: 523,
name: "关卡523",
icon: "bg002",
gold: "119766376443908000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 40,
hint: 0
},
524: {
key: 524,
name: "关卡524",
icon: "bg002",
gold: "125754695266103000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 40,
hint: 0
},
525: {
key: 525,
name: "关卡525",
icon: "bg002",
gold: "132042430029408000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 40,
hint: 0
},
526: {
key: 526,
name: "关卡526",
icon: "bg002",
gold: "138644551530878000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 40,
hint: 0
},
527: {
key: 527,
name: "关卡527",
icon: "bg002",
gold: "145576779107422000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 40,
hint: 0
},
528: {
key: 528,
name: "关卡528",
icon: "bg002",
gold: "152855618062793000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 40,
hint: 0
},
529: {
key: 529,
name: "关卡529",
icon: "bg002",
gold: "160498398965933000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 40,
hint: 0
},
530: {
key: 530,
name: "关卡530",
icon: "bg002",
gold: "1685233189142300000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
531: {
key: 531,
name: "关卡531",
icon: "bg002",
gold: "176949484859942000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 40,
hint: 0
},
532: {
key: 532,
name: "关卡532",
icon: "bg002",
gold: "185796959102939000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 40,
hint: 0
},
533: {
key: 533,
name: "关卡533",
icon: "bg002",
gold: "195086807058086000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 40,
hint: 0
},
534: {
key: 534,
name: "关卡534",
icon: "bg002",
gold: "204841147410990000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 40,
hint: 0
},
535: {
key: 535,
name: "关卡535",
icon: "bg002",
gold: "215083204781540000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 40,
hint: 0
},
536: {
key: 536,
name: "关卡536",
icon: "bg002",
gold: "225837365020617000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 40,
hint: 0
},
537: {
key: 537,
name: "关卡537",
icon: "bg002",
gold: "237129233271648000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 40,
hint: 0
},
538: {
key: 538,
name: "关卡538",
icon: "bg002",
gold: "248985694935230000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 40,
hint: 0
},
539: {
key: 539,
name: "关卡539",
icon: "bg002",
gold: "261434979681992000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 40,
hint: 0
},
540: {
key: 540,
name: "关卡540",
icon: "bg002",
gold: "2745067286660920000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
541: {
key: 541,
name: "关卡541",
icon: "bg002",
gold: "288232065099397000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 40,
hint: 0
},
542: {
key: 542,
name: "关卡542",
icon: "bg002",
gold: "302643668354367000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 40,
hint: 0
},
543: {
key: 543,
name: "关卡543",
icon: "bg002",
gold: "317775851772085000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 40,
hint: 0
},
544: {
key: 544,
name: "关卡544",
icon: "bg002",
gold: "333664644360689000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 40,
hint: 0
},
545: {
key: 545,
name: "关卡545",
icon: "bg002",
gold: "350347876578724000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 40,
hint: 0
},
546: {
key: 546,
name: "关卡546",
icon: "bg002",
gold: "367865270407660000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 40,
hint: 0
},
547: {
key: 547,
name: "关卡547",
icon: "bg002",
gold: "386258533928043000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 40,
hint: 0
},
548: {
key: 548,
name: "关卡548",
icon: "bg002",
gold: "405571460624445000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 40,
hint: 0
},
549: {
key: 549,
name: "关卡549",
icon: "bg002",
gold: "425850033655667000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 40,
hint: 0
},
550: {
key: 550,
name: "关卡550",
icon: "bg002",
gold: "4471425353384500000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
551: {
key: 551,
name: "关卡551",
icon: "bg002",
gold: "469499662105373000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 40,
hint: 0
},
552: {
key: 552,
name: "关卡552",
icon: "bg002",
gold: "492974645210642000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 40,
hint: 0
},
553: {
key: 553,
name: "关卡553",
icon: "bg002",
gold: "517623377471174000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 40,
hint: 0
},
554: {
key: 554,
name: "关卡554",
icon: "bg002",
gold: "543504546344733000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 40,
hint: 0
},
555: {
key: 555,
name: "关卡555",
icon: "bg002",
gold: "570679773661970000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 40,
hint: 0
},
556: {
key: 556,
name: "关卡556",
icon: "bg002",
gold: "599213762345069000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 40,
hint: 0
},
557: {
key: 557,
name: "关卡557",
icon: "bg002",
gold: "629174450462323000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 40,
hint: 0
},
558: {
key: 558,
name: "关卡558",
icon: "bg002",
gold: "660633172985439000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 40,
hint: 0
},
559: {
key: 559,
name: "关卡559",
icon: "bg002",
gold: "693664831634711000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 40,
hint: 0
},
560: {
key: 560,
name: "关卡560",
icon: "bg002",
gold: "7283480732164470000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
561: {
key: 561,
name: "关卡561",
icon: "bg002",
gold: "764765476877269000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 40,
hint: 0
},
562: {
key: 562,
name: "关卡562",
icon: "bg002",
gold: "803003750721133000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 40,
hint: 0
},
563: {
key: 563,
name: "关卡563",
icon: "bg002",
gold: "843153938257190000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 40,
hint: 0
},
564: {
key: 564,
name: "关卡564",
icon: "bg002",
gold: "885311635170050000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 40,
hint: 0
},
565: {
key: 565,
name: "关卡565",
icon: "bg002",
gold: "929577216928553000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 40,
hint: 0
},
566: {
key: 566,
name: "关卡566",
icon: "bg002",
gold: "976056077774981000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 40,
hint: 0
},
567: {
key: 567,
name: "关卡567",
icon: "bg002",
gold: "1024858881663730000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 40,
hint: 0
},
568: {
key: 568,
name: "关卡568",
icon: "bg002",
gold: "1076101825746920000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 40,
hint: 0
},
569: {
key: 569,
name: "关卡569",
icon: "bg002",
gold: "1129906917034270000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 40,
hint: 0
},
570: {
key: 570,
name: "关卡570",
icon: "bg002",
gold: "11864022628859800000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
571: {
key: 571,
name: "关卡571",
icon: "bg002",
gold: "1245722376030280000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 40,
hint: 0
},
572: {
key: 572,
name: "关卡572",
icon: "bg002",
gold: "1308008494831790000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 40,
hint: 0
},
573: {
key: 573,
name: "关卡573",
icon: "bg002",
gold: "1373408919573380000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 40,
hint: 0
},
574: {
key: 574,
name: "关卡574",
icon: "bg002",
gold: "1442079365552050000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 40,
hint: 0
},
575: {
key: 575,
name: "关卡575",
icon: "bg002",
gold: "1514183333829650000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 40,
hint: 0
},
576: {
key: 576,
name: "关卡576",
icon: "bg002",
gold: "1589892500521130000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 40,
hint: 0
},
577: {
key: 577,
name: "关卡577",
icon: "bg002",
gold: "1669387125547190000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 40,
hint: 0
},
578: {
key: 578,
name: "关卡578",
icon: "bg002",
gold: "1752856481824550000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 40,
hint: 0
},
579: {
key: 579,
name: "关卡579",
icon: "bg002",
gold: "1840499305915780000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 40,
hint: 0
},
580: {
key: 580,
name: "关卡580",
icon: "bg002",
gold: "19325242712115700000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
581: {
key: 581,
name: "关卡581",
icon: "bg002",
gold: "2029150484772150000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 40,
hint: 0
},
582: {
key: 582,
name: "关卡582",
icon: "bg002",
gold: "2130608009010760000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 40,
hint: 0
},
583: {
key: 583,
name: "关卡583",
icon: "bg002",
gold: "2237138409461300000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 40,
hint: 0
},
584: {
key: 584,
name: "关卡584",
icon: "bg002",
gold: "2348995329934370000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 40,
hint: 0
},
585: {
key: 585,
name: "关卡585",
icon: "bg002",
gold: "2466445096431090000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 40,
hint: 0
},
586: {
key: 586,
name: "关卡586",
icon: "bg002",
gold: "2589767351252640000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 40,
hint: 0
},
587: {
key: 587,
name: "关卡587",
icon: "bg002",
gold: "2719255718815270000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 40,
hint: 0
},
588: {
key: 588,
name: "关卡588",
icon: "bg002",
gold: "2855218504756030000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 40,
hint: 0
},
589: {
key: 589,
name: "关卡589",
icon: "bg002",
gold: "2997979429993830000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 40,
hint: 0
},
590: {
key: 590,
name: "关卡590",
icon: "bg002",
gold: "31478784014935200000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
591: {
key: 591,
name: "关卡591",
icon: "bg002",
gold: "3305272321568200000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 40,
hint: 0
},
592: {
key: 592,
name: "关卡592",
icon: "bg002",
gold: "3470535937646610000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 40,
hint: 0
},
593: {
key: 593,
name: "关卡593",
icon: "bg002",
gold: "3644062734528940000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 40,
hint: 0
},
594: {
key: 594,
name: "关卡594",
icon: "bg002",
gold: "3826265871255390000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 40,
hint: 0
},
595: {
key: 595,
name: "关卡595",
icon: "bg002",
gold: "4017579164818160000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 40,
hint: 0
},
596: {
key: 596,
name: "关卡596",
icon: "bg002",
gold: "4218458123059070000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 40,
hint: 0
},
597: {
key: 597,
name: "关卡597",
icon: "bg002",
gold: "4429381029212020000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 40,
hint: 0
},
598: {
key: 598,
name: "关卡598",
icon: "bg002",
gold: "4650850080672620000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 40,
hint: 0
},
599: {
key: 599,
name: "关卡599",
icon: "bg002",
gold: "4883392584706250000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 40,
hint: 0
},
600: {
key: 600,
name: "关卡600",
icon: "bg002",
gold: "51275622139415600000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
601: {
key: 601,
name: "关卡601",
icon: "bg002",
gold: "5383940324638640000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 45,
hint: 0
},
602: {
key: 602,
name: "关卡602",
icon: "bg002",
gold: "5653137340870570000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 45,
hint: 0
},
603: {
key: 603,
name: "关卡603",
icon: "bg002",
gold: "5935794207914100000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 45,
hint: 0
},
604: {
key: 604,
name: "关卡604",
icon: "bg002",
gold: "6232583918309810000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 45,
hint: 0
},
605: {
key: 605,
name: "关卡605",
icon: "bg002",
gold: "6544213114225300000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 45,
hint: 0
},
606: {
key: 606,
name: "关卡606",
icon: "bg002",
gold: "6871423769936570000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 45,
hint: 0
},
607: {
key: 607,
name: "关卡607",
icon: "bg002",
gold: "7214994958433400000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 45,
hint: 0
},
608: {
key: 608,
name: "关卡608",
icon: "bg002",
gold: "7575744706355070000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 45,
hint: 0
},
609: {
key: 609,
name: "关卡609",
icon: "bg002",
gold: "7954531941672820000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 45,
hint: 0
},
610: {
key: 610,
name: "关卡610",
icon: "bg002",
gold: "83522585387564600000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
611: {
key: 611,
name: "关卡611",
icon: "bg002",
gold: "8769871465694280000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 45,
hint: 0
},
612: {
key: 612,
name: "关卡612",
icon: "bg002",
gold: "9208365038978990000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 45,
hint: 0
},
613: {
key: 613,
name: "关卡613",
icon: "bg002",
gold: "9668783290927940000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 45,
hint: 0
},
614: {
key: 614,
name: "关卡614",
icon: "bg002",
gold: "10152222455474300000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 45,
hint: 0
},
615: {
key: 615,
name: "关卡615",
icon: "bg002",
gold: "10659833578248000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 45,
hint: 0
},
616: {
key: 616,
name: "关卡616",
icon: "bg002",
gold: "11192825257160400000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 45,
hint: 0
},
617: {
key: 617,
name: "关卡617",
icon: "bg002",
gold: "11752466520018400000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 45,
hint: 0
},
618: {
key: 618,
name: "关卡618",
icon: "bg002",
gold: "12340089846019300000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 45,
hint: 0
},
619: {
key: 619,
name: "关卡619",
icon: "bg002",
gold: "12957094338320300000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 45,
hint: 0
},
620: {
key: 620,
name: "关卡620",
icon: "bg002",
gold: "136049490552363000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
621: {
key: 621,
name: "关卡621",
icon: "bg002",
gold: "14285196507998100000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 45,
hint: 0
},
622: {
key: 622,
name: "关卡622",
icon: "bg002",
gold: "14999456333398000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 45,
hint: 0
},
623: {
key: 623,
name: "关卡623",
icon: "bg002",
gold: "15749429150067900000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 45,
hint: 0
},
624: {
key: 624,
name: "关卡624",
icon: "bg002",
gold: "16536900607571300000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 45,
hint: 0
},
625: {
key: 625,
name: "关卡625",
icon: "bg002",
gold: "17529114644025600000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 45,
hint: 0
},
626: {
key: 626,
name: "关卡626",
icon: "bg002",
gold: "18580861522667100000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 45,
hint: 0
},
627: {
key: 627,
name: "关卡627",
icon: "bg002",
gold: "19695713214027100000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 45,
hint: 0
},
628: {
key: 628,
name: "关卡628",
icon: "bg002",
gold: "20877456006868700000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 45,
hint: 0
},
629: {
key: 629,
name: "关卡629",
icon: "bg002",
gold: "22130103367280800000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 45,
hint: 0
},
630: {
key: 630,
name: "关卡630",
icon: "bg002",
gold: "234579095693177000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
631: {
key: 631,
name: "关卡631",
icon: "bg002",
gold: "24865384143476800000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 45,
hint: 0
},
632: {
key: 632,
name: "关卡632",
icon: "bg002",
gold: "26357307192085400000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 45,
hint: 0
},
633: {
key: 633,
name: "关卡633",
icon: "bg002",
gold: "27938745623610500000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 45,
hint: 0
},
634: {
key: 634,
name: "关卡634",
icon: "bg002",
gold: "29615070361027100000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 45,
hint: 0
},
635: {
key: 635,
name: "关卡635",
icon: "bg002",
gold: "31391974582688700000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 45,
hint: 0
},
636: {
key: 636,
name: "关卡636",
icon: "bg002",
gold: "33275493057650000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 45,
hint: 0
},
637: {
key: 637,
name: "关卡637",
icon: "bg002",
gold: "35272022641109000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 45,
hint: 0
},
638: {
key: 638,
name: "关卡638",
icon: "bg002",
gold: "37388343999575500000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 45,
hint: 0
},
639: {
key: 639,
name: "关卡639",
icon: "bg002",
gold: "39631644639550000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 45,
hint: 0
},
640: {
key: 640,
name: "关卡640",
icon: "bg002",
gold: "420095433179230000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
641: {
key: 641,
name: "关卡641",
icon: "bg002",
gold: "44530115916998400000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 45,
hint: 0
},
642: {
key: 642,
name: "关卡642",
icon: "bg002",
gold: "47201922872018300000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 45,
hint: 0
},
643: {
key: 643,
name: "关卡643",
icon: "bg002",
gold: "50034038244339400000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 45,
hint: 0
},
644: {
key: 644,
name: "关卡644",
icon: "bg002",
gold: "53036080538999800000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 45,
hint: 0
},
645: {
key: 645,
name: "关卡645",
icon: "bg002",
gold: "56218245371339800000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 45,
hint: 0
},
646: {
key: 646,
name: "关卡646",
icon: "bg002",
gold: "59591340093620200000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 45,
hint: 0
},
647: {
key: 647,
name: "关卡647",
icon: "bg002",
gold: "63166820499237400000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 45,
hint: 0
},
648: {
key: 648,
name: "关卡648",
icon: "bg002",
gold: "66956829729191700000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 45,
hint: 0
},
649: {
key: 649,
name: "关卡649",
icon: "bg002",
gold: "70974239512943200000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 45,
hint: 0
},
650: {
key: 650,
name: "关卡650",
icon: "bg002",
gold: "738132090934609000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
651: {
key: 651,
name: "关卡651",
icon: "bg002",
gold: "76765737457199300000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 45,
hint: 0
},
652: {
key: 652,
name: "关卡652",
icon: "bg002",
gold: "79836366955487300000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 45,
hint: 0
},
653: {
key: 653,
name: "关卡653",
icon: "bg002",
gold: "83029821633706800000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 45,
hint: 0
},
654: {
key: 654,
name: "关卡654",
icon: "bg002",
gold: "86351014499055100000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 45,
hint: 0
},
655: {
key: 655,
name: "关卡655",
icon: "bg002",
gold: "89805055079017300000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 45,
hint: 0
},
656: {
key: 656,
name: "关卡656",
icon: "bg002",
gold: "93397257282178000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 45,
hint: 0
},
657: {
key: 657,
name: "关卡657",
icon: "bg002",
gold: "97133147573465100000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 45,
hint: 0
},
658: {
key: 658,
name: "关卡658",
icon: "bg002",
gold: "101018473476404000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 45,
hint: 0
},
659: {
key: 659,
name: "关卡659",
icon: "bg002",
gold: "105059212415460000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 45,
hint: 0
},
660: {
key: 660,
name: "关卡660",
icon: "bg002",
gold: "1092615809120780000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
661: {
key: 661,
name: "关卡661",
icon: "bg002",
gold: "113632044148561000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 45,
hint: 0
},
662: {
key: 662,
name: "关卡662",
icon: "bg002",
gold: "118177325914503000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 45,
hint: 0
},
663: {
key: 663,
name: "关卡663",
icon: "bg002",
gold: "122904418951083000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 45,
hint: 0
},
664: {
key: 664,
name: "关卡664",
icon: "bg002",
gold: "127820595709126000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 45,
hint: 0
},
665: {
key: 665,
name: "关卡665",
icon: "bg002",
gold: "132933419537491000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 45,
hint: 0
},
666: {
key: 666,
name: "关卡666",
icon: "bg002",
gold: "138250756318991000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 45,
hint: 0
},
667: {
key: 667,
name: "关卡667",
icon: "bg002",
gold: "143780786571751000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 45,
hint: 0
},
668: {
key: 668,
name: "关卡668",
icon: "bg002",
gold: "149532018034621000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 45,
hint: 0
},
669: {
key: 669,
name: "关卡669",
icon: "bg002",
gold: "155513298756006000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 45,
hint: 0
},
670: {
key: 670,
name: "关卡670",
icon: "bg002",
gold: "1617338307062460000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
671: {
key: 671,
name: "关卡671",
icon: "bg002",
gold: "168203183934496000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 45,
hint: 0
},
672: {
key: 672,
name: "关卡672",
icon: "bg002",
gold: "174931311291876000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 45,
hint: 0
},
673: {
key: 673,
name: "关卡673",
icon: "bg002",
gold: "181928563743551000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 45,
hint: 0
},
674: {
key: 674,
name: "关卡674",
icon: "bg002",
gold: "189205706293293000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 45,
hint: 0
},
675: {
key: 675,
name: "关卡675",
icon: "bg002",
gold: "200558048670891000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 45,
hint: 0
},
676: {
key: 676,
name: "关卡676",
icon: "bg002",
gold: "212591531591144000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 45,
hint: 0
},
677: {
key: 677,
name: "关卡677",
icon: "bg002",
gold: "225347023486613000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 45,
hint: 0
},
678: {
key: 678,
name: "关卡678",
icon: "bg002",
gold: "238867844895810000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 45,
hint: 0
},
679: {
key: 679,
name: "关卡679",
icon: "bg002",
gold: "253199915589559000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 45,
hint: 0
},
680: {
key: 680,
name: "关卡680",
icon: "bg002",
gold: "2683919105249330000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
681: {
key: 681,
name: "关卡681",
icon: "bg002",
gold: "284495425156429000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 45,
hint: 0
},
682: {
key: 682,
name: "关卡682",
icon: "bg002",
gold: "301565150665815000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 45,
hint: 0
},
683: {
key: 683,
name: "关卡683",
icon: "bg002",
gold: "319659059705764000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 45,
hint: 0
},
684: {
key: 684,
name: "关卡684",
icon: "bg002",
gold: "338838603288110000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 45,
hint: 0
},
685: {
key: 685,
name: "关卡685",
icon: "bg002",
gold: "359168919485397000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 45,
hint: 0
},
686: {
key: 686,
name: "关卡686",
icon: "bg002",
gold: "380719054654521000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 45,
hint: 0
},
687: {
key: 687,
name: "关卡687",
icon: "bg002",
gold: "403562197933792000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 45,
hint: 0
},
688: {
key: 688,
name: "关卡688",
icon: "bg002",
gold: "427775929809820000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 45,
hint: 0
},
689: {
key: 689,
name: "关卡689",
icon: "bg002",
gold: "453442485598409000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 45,
hint: 0
},
690: {
key: 690,
name: "关卡690",
icon: "bg002",
gold: "4806490347343140000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
691: {
key: 691,
name: "关卡691",
icon: "bg002",
gold: "509487976818373000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 45,
hint: 0
},
692: {
key: 692,
name: "关卡692",
icon: "bg002",
gold: "540057255427475000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 45,
hint: 0
},
693: {
key: 693,
name: "关卡693",
icon: "bg002",
gold: "572460690753124000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 45,
hint: 0
},
694: {
key: 694,
name: "关卡694",
icon: "bg002",
gold: "606808332198312000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 45,
hint: 0
},
695: {
key: 695,
name: "关卡695",
icon: "bg002",
gold: "643216832130211000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 45,
hint: 0
},
696: {
key: 696,
name: "关卡696",
icon: "bg002",
gold: "681809842058024000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 45,
hint: 0
},
697: {
key: 697,
name: "关卡697",
icon: "bg002",
gold: "722718432581506000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 45,
hint: 0
},
698: {
key: 698,
name: "关卡698",
icon: "bg002",
gold: "766081538536396000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 45,
hint: 0
},
699: {
key: 699,
name: "关卡699",
icon: "bg002",
gold: "812046430848580000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 45,
hint: 0
},
700: {
key: 700,
name: "关卡700",
icon: "bg002",
gold: "8364078237740370000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
701: {
key: 701,
name: "关卡701",
icon: "bg002",
gold: "861500058487258000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
702: {
key: 702,
name: "关卡702",
icon: "bg002",
gold: "887345060241876000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
703: {
key: 703,
name: "关卡703",
icon: "bg002",
gold: "913965412049132000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
704: {
key: 704,
name: "关卡704",
icon: "bg002",
gold: "941384374410606000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
705: {
key: 705,
name: "关卡705",
icon: "bg002",
gold: "969625905642924000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
706: {
key: 706,
name: "关卡706",
icon: "bg002",
gold: "998714682812212000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
707: {
key: 707,
name: "关卡707",
icon: "bg002",
gold: "1028676123296580000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
708: {
key: 708,
name: "关卡708",
icon: "bg002",
gold: "1059536406995480000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
709: {
key: 709,
name: "关卡709",
icon: "bg002",
gold: "1091322499205340000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
710: {
key: 710,
name: "关卡710",
icon: "bg002",
gold: "11240621741815000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
711: {
key: 711,
name: "关卡711",
icon: "bg002",
gold: "1157784039406950000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
712: {
key: 712,
name: "关卡712",
icon: "bg002",
gold: "1192517560589160000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
713: {
key: 713,
name: "关卡713",
icon: "bg002",
gold: "1228293087406830000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
714: {
key: 714,
name: "关卡714",
icon: "bg002",
gold: "1265141880029040000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
715: {
key: 715,
name: "关卡715",
icon: "bg002",
gold: "1303096136429910000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
716: {
key: 716,
name: "关卡716",
icon: "bg002",
gold: "1342189020522810000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
717: {
key: 717,
name: "关卡717",
icon: "bg002",
gold: "1382454691138490000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
718: {
key: 718,
name: "关卡718",
icon: "bg002",
gold: "1423928331872650000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
719: {
key: 719,
name: "关卡719",
icon: "bg002",
gold: "1466646181828830000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
720: {
key: 720,
name: "关卡720",
icon: "bg002",
gold: "15106455672837000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
721: {
key: 721,
name: "关卡721",
icon: "bg002",
gold: "1555964934302210000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
722: {
key: 722,
name: "关卡722",
icon: "bg002",
gold: "1602643882331280000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
723: {
key: 723,
name: "关卡723",
icon: "bg002",
gold: "1650723198801220000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
724: {
key: 724,
name: "关卡724",
icon: "bg002",
gold: "1700244894765260000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
725: {
key: 725,
name: "关卡725",
icon: "bg002",
gold: "1751252241608220000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
726: {
key: 726,
name: "关卡726",
icon: "bg002",
gold: "1803789808856470000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
727: {
key: 727,
name: "关卡727",
icon: "bg002",
gold: "1857903503122160000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
728: {
key: 728,
name: "关卡728",
icon: "bg002",
gold: "1913640608215820000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
729: {
key: 729,
name: "关卡729",
icon: "bg002",
gold: "1971049826462290000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
730: {
key: 730,
name: "关卡730",
icon: "bg002",
gold: "20203260721238500000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
731: {
key: 731,
name: "关卡731",
icon: "bg002",
gold: "2070834223926950000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
732: {
key: 732,
name: "关卡732",
icon: "bg002",
gold: "2122605079525120000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
733: {
key: 733,
name: "关卡733",
icon: "bg002",
gold: "2175670206513250000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
734: {
key: 734,
name: "关卡734",
icon: "bg002",
gold: "2230061961676080000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
735: {
key: 735,
name: "关卡735",
icon: "bg002",
gold: "2285813510717980000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
736: {
key: 736,
name: "关卡736",
icon: "bg002",
gold: "2342958848485930000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
737: {
key: 737,
name: "关卡737",
icon: "bg002",
gold: "2401532819698080000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
738: {
key: 738,
name: "关卡738",
icon: "bg002",
gold: "2461571140190530000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
739: {
key: 739,
name: "关卡739",
icon: "bg002",
gold: "2523110418695290000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
740: {
key: 740,
name: "关卡740",
icon: "bg002",
gold: "25861881791626700000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
741: {
key: 741,
name: "关卡741",
icon: "bg002",
gold: "2650842883641740000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
742: {
key: 742,
name: "关卡742",
icon: "bg002",
gold: "2717113955732780000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
743: {
key: 743,
name: "关卡743",
icon: "bg002",
gold: "2785041804626100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
744: {
key: 744,
name: "关卡744",
icon: "bg002",
gold: "2854667849741750000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
745: {
key: 745,
name: "关卡745",
icon: "bg002",
gold: "2926034545985290000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
746: {
key: 746,
name: "关卡746",
icon: "bg002",
gold: "2999185409634920000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
747: {
key: 747,
name: "关卡747",
icon: "bg002",
gold: "3074165044875790000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
748: {
key: 748,
name: "关卡748",
icon: "bg002",
gold: "3151019170997680000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
749: {
key: 749,
name: "关卡749",
icon: "bg002",
gold: "3229794650272620000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
750: {
key: 750,
name: "关卡750",
icon: "bg002",
gold: "33105395165294400000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
751: {
key: 751,
name: "关卡751",
icon: "bg002",
gold: "3393303004442680000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
752: {
key: 752,
name: "关卡752",
icon: "bg002",
gold: "3478135579553750000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
753: {
key: 753,
name: "关卡753",
icon: "bg002",
gold: "3565088969042590000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
754: {
key: 754,
name: "关卡754",
icon: "bg002",
gold: "3654216193268650000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
755: {
key: 755,
name: "关卡755",
icon: "bg002",
gold: "3745571598100370000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
756: {
key: 756,
name: "关卡756",
icon: "bg002",
gold: "3839210888052880000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
757: {
key: 757,
name: "关卡757",
icon: "bg002",
gold: "3935191160254200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
758: {
key: 758,
name: "关卡758",
icon: "bg002",
gold: "4033570939260550000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
759: {
key: 759,
name: "关卡759",
icon: "bg002",
gold: "4134410212742060000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
760: {
key: 760,
name: "关卡760",
icon: "bg002",
gold: "42377704680606100000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
761: {
key: 761,
name: "关卡761",
icon: "bg002",
gold: "4343714729762130000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
762: {
key: 762,
name: "关卡762",
icon: "bg002",
gold: "4452307598006180000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
763: {
key: 763,
name: "关卡763",
icon: "bg002",
gold: "4563615287956340000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
764: {
key: 764,
name: "关卡764",
icon: "bg002",
gold: "4677705670155250000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
765: {
key: 765,
name: "关卡765",
icon: "bg002",
gold: "4794648311909130000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
766: {
key: 766,
name: "关卡766",
icon: "bg002",
gold: "4914514519706860000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
767: {
key: 767,
name: "关卡767",
icon: "bg002",
gold: "5037377382699530000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
768: {
key: 768,
name: "关卡768",
icon: "bg002",
gold: "5163311817267020000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
769: {
key: 769,
name: "关卡769",
icon: "bg002",
gold: "5292394612698700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
770: {
key: 770,
name: "关卡770",
icon: "bg002",
gold: "53982425049526700000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
771: {
key: 771,
name: "关卡771",
icon: "bg002",
gold: "5506207355051720000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
772: {
key: 772,
name: "关卡772",
icon: "bg002",
gold: "5616331502152760000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
773: {
key: 773,
name: "关卡773",
icon: "bg002",
gold: "5728658132195820000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
774: {
key: 774,
name: "关卡774",
icon: "bg002",
gold: "5843231294839740000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
775: {
key: 775,
name: "关卡775",
icon: "bg002",
gold: "5960095920736540000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
776: {
key: 776,
name: "关卡776",
icon: "bg002",
gold: "6079297839151270000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
777: {
key: 777,
name: "关卡777",
icon: "bg002",
gold: "6200883795934300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
778: {
key: 778,
name: "关卡778",
icon: "bg002",
gold: "6324901471852990000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
779: {
key: 779,
name: "关卡779",
icon: "bg002",
gold: "6451399501290050000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
780: {
key: 780,
name: "关卡780",
icon: "bg002",
gold: "65804274913158500000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
781: {
key: 781,
name: "关卡781",
icon: "bg002",
gold: "6712036041142170000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
782: {
key: 782,
name: "关卡782",
icon: "bg002",
gold: "6846276761965010000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
783: {
key: 783,
name: "关卡783",
icon: "bg002",
gold: "6983202297204310000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
784: {
key: 784,
name: "关卡784",
icon: "bg002",
gold: "7122866343148400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
785: {
key: 785,
name: "关卡785",
icon: "bg002",
gold: "7265323670011370000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
786: {
key: 786,
name: "关卡786",
icon: "bg002",
gold: "7410630143411600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
787: {
key: 787,
name: "关卡787",
icon: "bg002",
gold: "7558842746279830000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
788: {
key: 788,
name: "关卡788",
icon: "bg002",
gold: "7710019601205430000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
789: {
key: 789,
name: "关卡789",
icon: "bg002",
gold: "7864219993229540000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
790: {
key: 790,
name: "关卡790",
icon: "bg002",
gold: "80215043930941300000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
791: {
key: 791,
name: "关卡791",
icon: "bg002",
gold: "8181934480956010000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
792: {
key: 792,
name: "关卡792",
icon: "bg002",
gold: "8345573170575130000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
793: {
key: 793,
name: "关卡793",
icon: "bg002",
gold: "8512484633986630000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
794: {
key: 794,
name: "关卡794",
icon: "bg002",
gold: "8682734326666360000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
795: {
key: 795,
name: "关卡795",
icon: "bg002",
gold: "8856389013199690000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
796: {
key: 796,
name: "关卡796",
icon: "bg002",
gold: "9033516793463680000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
797: {
key: 797,
name: "关卡797",
icon: "bg002",
gold: "9214187129332960000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
798: {
key: 798,
name: "关卡798",
icon: "bg002",
gold: "9398470871919620000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
799: {
key: 799,
name: "关卡799",
icon: "bg002",
gold: "9586440289358010000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
800: {
key: 800,
name: "关卡800",
icon: "bg002",
gold: "97781690951451700000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
801: {
key: 801,
name: "关卡801",
icon: "bg002",
gold: "9973732477048070000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
802: {
key: 802,
name: "关卡802",
icon: "bg002",
gold: "10173207126589000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
803: {
key: 803,
name: "关卡803",
icon: "bg002",
gold: "10376671269120800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
804: {
key: 804,
name: "关卡804",
icon: "bg002",
gold: "10584204694503200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
805: {
key: 805,
name: "关卡805",
icon: "bg002",
gold: "10795888788393300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
806: {
key: 806,
name: "关卡806",
icon: "bg002",
gold: "11011806564161200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
807: {
key: 807,
name: "关卡807",
icon: "bg002",
gold: "11232042695444400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
808: {
key: 808,
name: "关卡808",
icon: "bg002",
gold: "11456683549353300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
809: {
key: 809,
name: "关卡809",
icon: "bg002",
gold: "11685817220340400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
810: {
key: 810,
name: "关卡810",
icon: "bg002",
gold: "119195335647472000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
811: {
key: 811,
name: "关卡811",
icon: "bg002",
gold: "12157924236042100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
812: {
key: 812,
name: "关卡812",
icon: "bg002",
gold: "12401082720762900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
813: {
key: 813,
name: "关卡813",
icon: "bg002",
gold: "12649104375178200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
814: {
key: 814,
name: "关卡814",
icon: "bg002",
gold: "12902086462681800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
815: {
key: 815,
name: "关卡815",
icon: "bg002",
gold: "13160128191935400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
816: {
key: 816,
name: "关卡816",
icon: "bg002",
gold: "13423330755774100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
817: {
key: 817,
name: "关卡817",
icon: "bg002",
gold: "13691797370889600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
818: {
key: 818,
name: "关卡818",
icon: "bg002",
gold: "13965633318307400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
819: {
key: 819,
name: "关卡819",
icon: "bg002",
gold: "14244945984673600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
820: {
key: 820,
name: "关卡820",
icon: "bg002",
gold: "145298449043671000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
821: {
key: 821,
name: "关卡821",
icon: "bg002",
gold: "14820441802454400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
822: {
key: 822,
name: "关卡822",
icon: "bg002",
gold: "15116850638503500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
823: {
key: 823,
name: "关卡823",
icon: "bg002",
gold: "15419187651273600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
824: {
key: 824,
name: "关卡824",
icon: "bg002",
gold: "15727571404299100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
825: {
key: 825,
name: "关卡825",
icon: "bg002",
gold: "16042122832385100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
826: {
key: 826,
name: "关卡826",
icon: "bg002",
gold: "16362965289032800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
827: {
key: 827,
name: "关卡827",
icon: "bg002",
gold: "16690224594813500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
828: {
key: 828,
name: "关卡828",
icon: "bg002",
gold: "17024029086709800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
829: {
key: 829,
name: "关卡829",
icon: "bg002",
gold: "17364509668444000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
830: {
key: 830,
name: "关卡830",
icon: "bg002",
gold: "177117998618129000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
831: {
key: 831,
name: "关卡831",
icon: "bg002",
gold: "18066035859049200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
832: {
key: 832,
name: "关卡832",
icon: "bg002",
gold: "18427356576230200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
833: {
key: 833,
name: "关卡833",
icon: "bg002",
gold: "18795903707754800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
834: {
key: 834,
name: "关卡834",
icon: "bg002",
gold: "19171821781909900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
835: {
key: 835,
name: "关卡835",
icon: "bg002",
gold: "19555258217548100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
836: {
key: 836,
name: "关卡836",
icon: "bg002",
gold: "19946363381899100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
837: {
key: 837,
name: "关卡837",
icon: "bg002",
gold: "20345290649537100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
838: {
key: 838,
name: "关卡838",
icon: "bg002",
gold: "20752196462527800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
839: {
key: 839,
name: "关卡839",
icon: "bg002",
gold: "21167240391778400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
840: {
key: 840,
name: "关卡840",
icon: "bg002",
gold: "215905851996140000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
841: {
key: 841,
name: "关卡841",
icon: "bg002",
gold: "22022396903606300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
842: {
key: 842,
name: "关卡842",
icon: "bg002",
gold: "22462844841678400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
843: {
key: 843,
name: "关卡843",
icon: "bg002",
gold: "22912101738512000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
844: {
key: 844,
name: "关卡844",
icon: "bg002",
gold: "23370343773282200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
845: {
key: 845,
name: "关卡845",
icon: "bg002",
gold: "23837750648747800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
846: {
key: 846,
name: "关卡846",
icon: "bg002",
gold: "24314505661722800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
847: {
key: 847,
name: "关卡847",
icon: "bg002",
gold: "24800795774957300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
848: {
key: 848,
name: "关卡848",
icon: "bg002",
gold: "25296811690456400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
849: {
key: 849,
name: "关卡849",
icon: "bg002",
gold: "25802747924265500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
850: {
key: 850,
name: "关卡850",
icon: "bg002",
gold: "263188028827508000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
851: {
key: 851,
name: "关卡851",
icon: "bg002",
gold: "26845178940405800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
852: {
key: 852,
name: "关卡852",
icon: "bg002",
gold: "27382082519213900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
853: {
key: 853,
name: "关卡853",
icon: "bg002",
gold: "27929724169598200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
854: {
key: 854,
name: "关卡854",
icon: "bg002",
gold: "28488318652990200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
855: {
key: 855,
name: "关卡855",
icon: "bg002",
gold: "29058085026050000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
856: {
key: 856,
name: "关卡856",
icon: "bg002",
gold: "29639246726571000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
857: {
key: 857,
name: "关卡857",
icon: "bg002",
gold: "30232031661102400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
858: {
key: 858,
name: "关卡858",
icon: "bg002",
gold: "30836672294324500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
859: {
key: 859,
name: "关卡859",
icon: "bg002",
gold: "31453405740211000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
860: {
key: 860,
name: "关卡860",
icon: "bg002",
gold: "320824738550152000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
861: {
key: 861,
name: "关卡861",
icon: "bg002",
gold: "32724123332115500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
862: {
key: 862,
name: "关卡862",
icon: "bg002",
gold: "33378605798757800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
863: {
key: 863,
name: "关卡863",
icon: "bg002",
gold: "34046177914733000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
864: {
key: 864,
name: "关卡864",
icon: "bg002",
gold: "34727101473027700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
865: {
key: 865,
name: "关卡865",
icon: "bg002",
gold: "35421643502488300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
866: {
key: 866,
name: "关卡866",
icon: "bg002",
gold: "36130076372538100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
867: {
key: 867,
name: "关卡867",
icon: "bg002",
gold: "36852677899988900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
868: {
key: 868,
name: "关卡868",
icon: "bg002",
gold: "37589731457988700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
869: {
key: 869,
name: "关卡869",
icon: "bg002",
gold: "38341526087148500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
870: {
key: 870,
name: "关卡870",
icon: "bg002",
gold: "391083566088915000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
871: {
key: 871,
name: "关卡871",
icon: "bg002",
gold: "39890523741069300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
872: {
key: 872,
name: "关卡872",
icon: "bg002",
gold: "40688334215890700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
873: {
key: 873,
name: "关卡873",
icon: "bg002",
gold: "41502100900208500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
874: {
key: 874,
name: "关卡874",
icon: "bg002",
gold: "42332142918212700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
875: {
key: 875,
name: "关卡875",
icon: "bg002",
gold: "43178785776577000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
876: {
key: 876,
name: "关卡876",
icon: "bg002",
gold: "44042361492108500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
877: {
key: 877,
name: "关卡877",
icon: "bg002",
gold: "44923208721950700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
878: {
key: 878,
name: "关卡878",
icon: "bg002",
gold: "45821672896389700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
879: {
key: 879,
name: "关卡879",
icon: "bg002",
gold: "46738106354317500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
880: {
key: 880,
name: "关卡880",
icon: "bg002",
gold: "476728684814039000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
881: {
key: 881,
name: "关卡881",
icon: "bg002",
gold: "48626325851032000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
882: {
key: 882,
name: "关卡882",
icon: "bg002",
gold: "49598852368052600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
883: {
key: 883,
name: "关卡883",
icon: "bg002",
gold: "50590829415413700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
884: {
key: 884,
name: "关卡884",
icon: "bg002",
gold: "51602646003722000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
885: {
key: 885,
name: "关卡885",
icon: "bg002",
gold: "52634698923796400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
886: {
key: 886,
name: "关卡886",
icon: "bg002",
gold: "53687392902272300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
887: {
key: 887,
name: "关卡887",
icon: "bg002",
gold: "54761140760317700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
888: {
key: 888,
name: "关卡888",
icon: "bg002",
gold: "55856363575524100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
889: {
key: 889,
name: "关卡889",
icon: "bg002",
gold: "56973490847034600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
890: {
key: 890,
name: "关卡890",
icon: "bg002",
gold: "581129606639753000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
891: {
key: 891,
name: "关卡891",
icon: "bg002",
gold: "59275219877254800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
892: {
key: 892,
name: "关卡892",
icon: "bg002",
gold: "60460724274799900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
893: {
key: 893,
name: "关卡893",
icon: "bg002",
gold: "61669938760295900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
894: {
key: 894,
name: "关卡894",
icon: "bg002",
gold: "62903337535501800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
895: {
key: 895,
name: "关卡895",
icon: "bg002",
gold: "64161404286211800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
896: {
key: 896,
name: "关卡896",
icon: "bg002",
gold: "65444632371936100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
897: {
key: 897,
name: "关卡897",
icon: "bg002",
gold: "66753525019374800000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
898: {
key: 898,
name: "关卡898",
icon: "bg002",
gold: "68088595519762300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
899: {
key: 899,
name: "关卡899",
icon: "bg002",
gold: "69450367430157600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
900: {
key: 900,
name: "关卡900",
icon: "bg002",
gold: "708393747787608000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
901: {
key: 901,
name: "关卡901",
icon: "bg002",
gold: "72256162274336000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
902: {
key: 902,
name: "关卡902",
icon: "bg002",
gold: "73701285519822700000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
903: {
key: 903,
name: "关卡903",
icon: "bg002",
gold: "75175311230219200000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
904: {
key: 904,
name: "关卡904",
icon: "bg002",
gold: "76678817454823600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
905: {
key: 905,
name: "关卡905",
icon: "bg002",
gold: "78212393803920100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
906: {
key: 906,
name: "关卡906",
icon: "bg002",
gold: "79776641679998500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
907: {
key: 907,
name: "关卡907",
icon: "bg002",
gold: "81372174513598500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
908: {
key: 908,
name: "关卡908",
icon: "bg002",
gold: "82999618003870500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
909: {
key: 909,
name: "关卡909",
icon: "bg002",
gold: "84659610363947900000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
910: {
key: 910,
name: "关卡910",
icon: "bg002",
gold: "863528025712269000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
911: {
key: 911,
name: "关卡911",
icon: "bg002",
gold: "88079858622651400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
912: {
key: 912,
name: "关卡912",
icon: "bg002",
gold: "89841455795104400000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
913: {
key: 913,
name: "关卡913",
icon: "bg002",
gold: "91638284911006500000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
914: {
key: 914,
name: "关卡914",
icon: "bg002",
gold: "93471050609226600000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
915: {
key: 915,
name: "关卡915",
icon: "bg002",
gold: "95340471621411100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
916: {
key: 916,
name: "关卡916",
icon: "bg002",
gold: "97247281053839300000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
917: {
key: 917,
name: "关卡917",
icon: "bg002",
gold: "99192226674916100000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
918: {
key: 918,
name: "关卡918",
icon: "bg002",
gold: "101176071208414000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
919: {
key: 919,
name: "关卡919",
icon: "bg002",
gold: "103199592632582000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
920: {
key: 920,
name: "关卡920",
icon: "bg002",
gold: "1052635844852340000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
921: {
key: 921,
name: "关卡921",
icon: "bg002",
gold: "107368856174939000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
922: {
key: 922,
name: "关卡922",
icon: "bg002",
gold: "109516233298438000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
923: {
key: 923,
name: "关卡923",
icon: "bg002",
gold: "111706557964407000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
924: {
key: 924,
name: "关卡924",
icon: "bg002",
gold: "113940689123695000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
925: {
key: 925,
name: "关卡925",
icon: "bg002",
gold: "116219502906169000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
926: {
key: 926,
name: "关卡926",
icon: "bg002",
gold: "118543892964292000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
927: {
key: 927,
name: "关卡927",
icon: "bg002",
gold: "120914770823578000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
928: {
key: 928,
name: "关卡928",
icon: "bg002",
gold: "123333066240050000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
929: {
key: 929,
name: "关卡929",
icon: "bg002",
gold: "125799727564851000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
930: {
key: 930,
name: "关卡930",
icon: "bg002",
gold: "1283157221161480000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
931: {
key: 931,
name: "关卡931",
icon: "bg002",
gold: "130882036558471000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
932: {
key: 932,
name: "关卡932",
icon: "bg002",
gold: "133499677289640000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
933: {
key: 933,
name: "关卡933",
icon: "bg002",
gold: "136169670835433000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
934: {
key: 934,
name: "关卡934",
icon: "bg002",
gold: "138893064252142000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
935: {
key: 935,
name: "关卡935",
icon: "bg002",
gold: "141670925537185000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
936: {
key: 936,
name: "关卡936",
icon: "bg002",
gold: "144504344047929000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
937: {
key: 937,
name: "关卡937",
icon: "bg002",
gold: "147394430928888000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
938: {
key: 938,
name: "关卡938",
icon: "bg002",
gold: "150342319547466000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
939: {
key: 939,
name: "关卡939",
icon: "bg002",
gold: "153349165938415000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
940: {
key: 940,
name: "关卡940",
icon: "bg002",
gold: "1564161492571830000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
941: {
key: 941,
name: "关卡941",
icon: "bg002",
gold: "159544472242327000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
942: {
key: 942,
name: "关卡942",
icon: "bg002",
gold: "162735361687174000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
943: {
key: 943,
name: "关卡943",
icon: "bg002",
gold: "165990068920917000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
944: {
key: 944,
name: "关卡944",
icon: "bg002",
gold: "169309870299335000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
945: {
key: 945,
name: "关卡945",
icon: "bg002",
gold: "172696067705322000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
946: {
key: 946,
name: "关卡946",
icon: "bg002",
gold: "176149989059428000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
947: {
key: 947,
name: "关卡947",
icon: "bg002",
gold: "179672988840617000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
948: {
key: 948,
name: "关卡948",
icon: "bg002",
gold: "183266448617429000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
949: {
key: 949,
name: "关卡949",
icon: "bg002",
gold: "186931777589778000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
950: {
key: 950,
name: "关卡950",
icon: "bg002",
gold: "1906704131415740000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
951: {
key: 951,
name: "关卡951",
icon: "bg002",
gold: "194483821404405000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
952: {
key: 952,
name: "关卡952",
icon: "bg002",
gold: "198373497832493000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
953: {
key: 953,
name: "关卡953",
icon: "bg002",
gold: "202340967789143000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
954: {
key: 954,
name: "关卡954",
icon: "bg002",
gold: "206387787144926000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
955: {
key: 955,
name: "关卡955",
icon: "bg002",
gold: "210515542887825000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
956: {
key: 956,
name: "关卡956",
icon: "bg002",
gold: "214725853745582000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
957: {
key: 957,
name: "关卡957",
icon: "bg002",
gold: "219020370820494000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
958: {
key: 958,
name: "关卡958",
icon: "bg002",
gold: "223400778236904000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
959: {
key: 959,
name: "关卡959",
icon: "bg002",
gold: "227868793801642000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
960: {
key: 960,
name: "关卡960",
icon: "bg002",
gold: "2324261696776750000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
961: {
key: 961,
name: "关卡961",
icon: "bg002",
gold: "237074693071229000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
962: {
key: 962,
name: "关卡962",
icon: "bg002",
gold: "241816186932654000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
963: {
key: 963,
name: "关卡963",
icon: "bg002",
gold: "246652510671307000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
964: {
key: 964,
name: "关卡964",
icon: "bg002",
gold: "251585560884733000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
965: {
key: 965,
name: "关卡965",
icon: "bg002",
gold: "256617272102428000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
966: {
key: 966,
name: "关卡966",
icon: "bg002",
gold: "261749617544477000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
967: {
key: 967,
name: "关卡967",
icon: "bg002",
gold: "266984609895367000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
968: {
key: 968,
name: "关卡968",
icon: "bg002",
gold: "272324302093274000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
969: {
key: 969,
name: "关卡969",
icon: "bg002",
gold: "277770788135139000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
970: {
key: 970,
name: "关卡970",
icon: "bg002",
gold: "2833262038978420000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
971: {
key: 971,
name: "关卡971",
icon: "bg002",
gold: "288992727975799000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
972: {
key: 972,
name: "关卡972",
icon: "bg002",
gold: "294772582535315000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
973: {
key: 973,
name: "关卡973",
icon: "bg002",
gold: "300668034186021000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
974: {
key: 974,
name: "关卡974",
icon: "bg002",
gold: "306681394869741000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
975: {
key: 975,
name: "关卡975",
icon: "bg002",
gold: "312815022767136000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
976: {
key: 976,
name: "关卡976",
icon: "bg002",
gold: "319071323222479000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
977: {
key: 977,
name: "关卡977",
icon: "bg002",
gold: "325452749686929000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
978: {
key: 978,
name: "关卡978",
icon: "bg002",
gold: "331961804680668000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
979: {
key: 979,
name: "关卡979",
icon: "bg002",
gold: "338601040774281000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
980: {
key: 980,
name: "关卡980",
icon: "bg002",
gold: "3453730615897670000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
981: {
key: 981,
name: "关卡981",
icon: "bg002",
gold: "352280522821562000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
982: {
key: 982,
name: "关卡982",
icon: "bg002",
gold: "359326133277993000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
983: {
key: 983,
name: "关卡983",
icon: "bg002",
gold: "366512655943553000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
984: {
key: 984,
name: "关卡984",
icon: "bg002",
gold: "373842909062424000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
985: {
key: 985,
name: "关卡985",
icon: "bg002",
gold: "381319767243672000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
986: {
key: 986,
name: "关卡986",
icon: "bg002",
gold: "388946162588545000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
987: {
key: 987,
name: "关卡987",
icon: "bg002",
gold: "396725085840316000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
988: {
key: 988,
name: "关卡988",
icon: "bg002",
gold: "404659587557122000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
989: {
key: 989,
name: "关卡989",
icon: "bg002",
gold: "412752779308264000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
990: {
key: 990,
name: "关卡990",
icon: "bg002",
gold: "4210078348944290000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
991: {
key: 991,
name: "关卡991",
icon: "bg002",
gold: "429427991592318000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
992: {
key: 992,
name: "关卡992",
icon: "bg002",
gold: "438016551424164000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
993: {
key: 993,
name: "关卡993",
icon: "bg002",
gold: "446776882452647000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
994: {
key: 994,
name: "关卡994",
icon: "bg002",
gold: "455712420101700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
995: {
key: 995,
name: "关卡995",
icon: "bg002",
gold: "464826668503734000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
996: {
key: 996,
name: "关卡996",
icon: "bg002",
gold: "474123201873809000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
997: {
key: 997,
name: "关卡997",
icon: "bg002",
gold: "483605665911285000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
998: {
key: 998,
name: "关卡998",
icon: "bg002",
gold: "493277779229511000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
999: {
key: 999,
name: "关卡999",
icon: "bg002",
gold: "503143334814101000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1e3: {
key: 1e3,
name: "关卡1000",
icon: "bg002",
gold: "5132062015103830000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1001: {
key: 1001,
name: "关卡1001",
icon: "bg002",
gold: "523470325540591000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1002: {
key: 1002,
name: "关卡1002",
icon: "bg002",
gold: "533939732051403000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1003: {
key: 1003,
name: "关卡1003",
icon: "bg002",
gold: "544618526692431000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1004: {
key: 1004,
name: "关卡1004",
icon: "bg002",
gold: "555510897226280000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1005: {
key: 1005,
name: "关卡1005",
icon: "bg002",
gold: "566621115170806000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1006: {
key: 1006,
name: "关卡1006",
icon: "bg002",
gold: "577953537474222000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1007: {
key: 1007,
name: "关卡1007",
icon: "bg002",
gold: "589512608223706000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1008: {
key: 1008,
name: "关卡1008",
icon: "bg002",
gold: "601302860388180000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1009: {
key: 1009,
name: "关卡1009",
icon: "bg002",
gold: "613328917595944000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1010: {
key: 1010,
name: "关卡1010",
icon: "bg002",
gold: "6255954959478630000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1011: {
key: 1011,
name: "关卡1011",
icon: "bg002",
gold: "638107405866820000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1012: {
key: 1012,
name: "关卡1012",
icon: "bg002",
gold: "650869553984156000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1013: {
key: 1013,
name: "关卡1013",
icon: "bg002",
gold: "663886945063839000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1014: {
key: 1014,
name: "关卡1014",
icon: "bg002",
gold: "677164683965116000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1015: {
key: 1015,
name: "关卡1015",
icon: "bg002",
gold: "690707977644418000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1016: {
key: 1016,
name: "关卡1016",
icon: "bg002",
gold: "704522137197306000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1017: {
key: 1017,
name: "关卡1017",
icon: "bg002",
gold: "718612579941252000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1018: {
key: 1018,
name: "关卡1018",
icon: "bg002",
gold: "732984831540077000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1019: {
key: 1019,
name: "关卡1019",
icon: "bg002",
gold: "747644528170879000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1020: {
key: 1020,
name: "关卡1020",
icon: "bg002",
gold: "7625974187342970000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1021: {
key: 1021,
name: "关卡1021",
icon: "bg002",
gold: "777849367108983000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1022: {
key: 1022,
name: "关卡1022",
icon: "bg002",
gold: "793406354451163000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1023: {
key: 1023,
name: "关卡1023",
icon: "bg002",
gold: "809274481540186000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1024: {
key: 1024,
name: "关卡1024",
icon: "bg002",
gold: "825459971170990000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1025: {
key: 1025,
name: "关卡1025",
icon: "bg002",
gold: "841969170594410000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1026: {
key: 1026,
name: "关卡1026",
icon: "bg002",
gold: "858808554006298000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1027: {
key: 1027,
name: "关卡1027",
icon: "bg002",
gold: "875984725086424000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1028: {
key: 1028,
name: "关卡1028",
icon: "bg002",
gold: "893504419588153000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1029: {
key: 1029,
name: "关卡1029",
icon: "bg002",
gold: "911374507979916000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1030: {
key: 1030,
name: "关卡1030",
icon: "bg002",
gold: "9296019981395140000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1031: {
key: 1031,
name: "关卡1031",
icon: "bg002",
gold: "948194038102304000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1032: {
key: 1032,
name: "关卡1032",
icon: "bg002",
gold: "967157918864350000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1033: {
key: 1033,
name: "关卡1033",
icon: "bg002",
gold: "986501077241637000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1034: {
key: 1034,
name: "关卡1034",
icon: "bg002",
gold: "1006231098786470000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1035: {
key: 1035,
name: "关卡1035",
icon: "bg002",
gold: "1026355720762200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1036: {
key: 1036,
name: "关卡1036",
icon: "bg002",
gold: "1046882835177440000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1037: {
key: 1037,
name: "关卡1037",
icon: "bg002",
gold: "1067820491880990000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1038: {
key: 1038,
name: "关卡1038",
icon: "bg002",
gold: "1089176901718610000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1039: {
key: 1039,
name: "关卡1039",
icon: "bg002",
gold: "1110960439752980000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1040: {
key: 1040,
name: "关卡1040",
icon: "bg002",
gold: "11331796485480400000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1041: {
key: 1041,
name: "关卡1041",
icon: "bg002",
gold: "1155843241519000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1042: {
key: 1042,
name: "关卡1042",
icon: "bg002",
gold: "1178960106349380000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1043: {
key: 1043,
name: "关卡1043",
icon: "bg002",
gold: "1202539308476370000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1044: {
key: 1044,
name: "关卡1044",
icon: "bg002",
gold: "1226590094645900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1045: {
key: 1045,
name: "关卡1045",
icon: "bg002",
gold: "1251121896538820000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1046: {
key: 1046,
name: "关卡1046",
icon: "bg002",
gold: "1276144334469600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1047: {
key: 1047,
name: "关卡1047",
icon: "bg002",
gold: "1301667221158990000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1048: {
key: 1048,
name: "关卡1048",
icon: "bg002",
gold: "1327700565582170000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1049: {
key: 1049,
name: "关卡1049",
icon: "bg002",
gold: "1354254576893810000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1050: {
key: 1050,
name: "关卡1050",
icon: "bg002",
gold: "13813396684316900000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1051: {
key: 1051,
name: "关卡1051",
icon: "bg002",
gold: "1408966461800320000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1052: {
key: 1052,
name: "关卡1052",
icon: "bg002",
gold: "1437145791036330000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1053: {
key: 1053,
name: "关卡1053",
icon: "bg002",
gold: "1465888706857060000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1054: {
key: 1054,
name: "关卡1054",
icon: "bg002",
gold: "1495206480994200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1055: {
key: 1055,
name: "关卡1055",
icon: "bg002",
gold: "1525110610614080000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1056: {
key: 1056,
name: "关卡1056",
icon: "bg002",
gold: "1555612822826360000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1057: {
key: 1057,
name: "关卡1057",
icon: "bg002",
gold: "1586725079282890000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1058: {
key: 1058,
name: "关卡1058",
icon: "bg002",
gold: "1618459580868550000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1059: {
key: 1059,
name: "关卡1059",
icon: "bg002",
gold: "1650828772485920000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1060: {
key: 1060,
name: "关卡1060",
icon: "bg002",
gold: "16838453479356400000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1061: {
key: 1061,
name: "关卡1061",
icon: "bg002",
gold: "1717522254894350000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1062: {
key: 1062,
name: "关卡1062",
icon: "bg002",
gold: "1751872699992240000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1063: {
key: 1063,
name: "关卡1063",
icon: "bg002",
gold: "1786910153992090000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1064: {
key: 1064,
name: "关卡1064",
icon: "bg002",
gold: "1822648357071930000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1065: {
key: 1065,
name: "关卡1065",
icon: "bg002",
gold: "1859101324213370000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1066: {
key: 1066,
name: "关卡1066",
icon: "bg002",
gold: "1896283350697640000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1067: {
key: 1067,
name: "关卡1067",
icon: "bg002",
gold: "1934209017711590000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1068: {
key: 1068,
name: "关卡1068",
icon: "bg002",
gold: "1972893198065820000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1069: {
key: 1069,
name: "关卡1069",
icon: "bg002",
gold: "2012351062027140000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1070: {
key: 1070,
name: "关卡1070",
icon: "bg002",
gold: "20525980832676800000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1071: {
key: 1071,
name: "关卡1071",
icon: "bg002",
gold: "2093650044933030000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1072: {
key: 1072,
name: "关卡1072",
icon: "bg002",
gold: "2135523045831690000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1073: {
key: 1073,
name: "关卡1073",
icon: "bg002",
gold: "2178233506748320000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1074: {
key: 1074,
name: "关卡1074",
icon: "bg002",
gold: "2221798176883290000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1075: {
key: 1075,
name: "关卡1075",
icon: "bg002",
gold: "2266234140420960000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1076: {
key: 1076,
name: "关卡1076",
icon: "bg002",
gold: "2311558823229380000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1077: {
key: 1077,
name: "关卡1077",
icon: "bg002",
gold: "2357789999693970000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1078: {
key: 1078,
name: "关卡1078",
icon: "bg002",
gold: "2404945799687850000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1079: {
key: 1079,
name: "关卡1079",
icon: "bg002",
gold: "2453044715681610000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1080: {
key: 1080,
name: "关卡1080",
icon: "bg002",
gold: "25021056099952400000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1081: {
key: 1081,
name: "关卡1081",
icon: "bg002",
gold: "2552147722195150000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1082: {
key: 1082,
name: "关卡1082",
icon: "bg002",
gold: "2603190676639050000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1083: {
key: 1083,
name: "关卡1083",
icon: "bg002",
gold: "2655254490171830000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1084: {
key: 1084,
name: "关卡1084",
icon: "bg002",
gold: "2708359579975270000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1085: {
key: 1085,
name: "关卡1085",
icon: "bg002",
gold: "2762526771574780000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1086: {
key: 1086,
name: "关卡1086",
icon: "bg002",
gold: "2817777307006280000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1087: {
key: 1087,
name: "关卡1087",
icon: "bg002",
gold: "2874132853146410000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1088: {
key: 1088,
name: "关卡1088",
icon: "bg002",
gold: "2931615510209340000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1089: {
key: 1089,
name: "关卡1089",
icon: "bg002",
gold: "2990247820413530000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1090: {
key: 1090,
name: "关卡1090",
icon: "bg002",
gold: "30500527768218000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1091: {
key: 1091,
name: "关卡1091",
icon: "bg002",
gold: "3111053832358240000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1092: {
key: 1092,
name: "关卡1092",
icon: "bg002",
gold: "3173274909005400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1093: {
key: 1093,
name: "关卡1093",
icon: "bg002",
gold: "3236740407185510000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1094: {
key: 1094,
name: "关卡1094",
icon: "bg002",
gold: "3301475215329220000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1095: {
key: 1095,
name: "关卡1095",
icon: "bg002",
gold: "3367504719635800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1096: {
key: 1096,
name: "关卡1096",
icon: "bg002",
gold: "3434854814028520000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1097: {
key: 1097,
name: "关卡1097",
icon: "bg002",
gold: "3503551910309090000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1098: {
key: 1098,
name: "关卡1098",
icon: "bg002",
gold: "3573622948515270000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1099: {
key: 1099,
name: "关卡1099",
icon: "bg002",
gold: "3645095407485580000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1100: {
key: 1100,
name: "关卡1100",
icon: "bg002",
gold: "37179973156352900000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1101: {
key: 1101,
name: "关卡1101",
icon: "bg002",
gold: "3792357261948000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1102: {
key: 1102,
name: "关卡1102",
icon: "bg002",
gold: "3868204407186960000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1103: {
key: 1103,
name: "关卡1103",
icon: "bg002",
gold: "3945568495330700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1104: {
key: 1104,
name: "关卡1104",
icon: "bg002",
gold: "4024479865237310000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1105: {
key: 1105,
name: "关卡1105",
icon: "bg002",
gold: "4104969462542060000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1106: {
key: 1106,
name: "关卡1106",
icon: "bg002",
gold: "4187068851792900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1107: {
key: 1107,
name: "关卡1107",
icon: "bg002",
gold: "4270810228828760000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1108: {
key: 1108,
name: "关卡1108",
icon: "bg002",
gold: "4356226433405340000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1109: {
key: 1109,
name: "关卡1109",
icon: "bg002",
gold: "4443350962073450000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1110: {
key: 1110,
name: "关卡1110",
icon: "bg002",
gold: "45322179813149200000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1111: {
key: 1111,
name: "关卡1111",
icon: "bg002",
gold: "4622862340941220000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1112: {
key: 1112,
name: "关卡1112",
icon: "bg002",
gold: "4715319587760050000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1113: {
key: 1113,
name: "关卡1113",
icon: "bg002",
gold: "4809625979515250000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1114: {
key: 1114,
name: "关卡1114",
icon: "bg002",
gold: "4905818499105560000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1115: {
key: 1115,
name: "关卡1115",
icon: "bg002",
gold: "5003934869087670000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1116: {
key: 1116,
name: "关卡1116",
icon: "bg002",
gold: "5104013566469420000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1117: {
key: 1117,
name: "关卡1117",
icon: "bg002",
gold: "5206093837798810000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1118: {
key: 1118,
name: "关卡1118",
icon: "bg002",
gold: "5310215714554790000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1119: {
key: 1119,
name: "关卡1119",
icon: "bg002",
gold: "5416420028845890000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1120: {
key: 1120,
name: "关卡1120",
icon: "bg002",
gold: "55247484294228100000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1121: {
key: 1121,
name: "关卡1121",
icon: "bg002",
gold: "5635243398011270000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1122: {
key: 1122,
name: "关卡1122",
icon: "bg002",
gold: "5747948265971500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1123: {
key: 1123,
name: "关卡1123",
icon: "bg002",
gold: "5862907231290930000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1124: {
key: 1124,
name: "关卡1124",
icon: "bg002",
gold: "5980165375916750000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1125: {
key: 1125,
name: "关卡1125",
icon: "bg002",
gold: "6099768683435090000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1126: {
key: 1126,
name: "关卡1126",
icon: "bg002",
gold: "6221764057103790000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1127: {
key: 1127,
name: "关卡1127",
icon: "bg002",
gold: "6346199338245870000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1128: {
key: 1128,
name: "关卡1128",
icon: "bg002",
gold: "6473123325010790000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1129: {
key: 1129,
name: "关卡1129",
icon: "bg002",
gold: "6602585791511010000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1130: {
key: 1130,
name: "关卡1130",
icon: "bg002",
gold: "67346375073412300000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1131: {
key: 1131,
name: "关卡1131",
icon: "bg002",
gold: "6869330257488060000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1132: {
key: 1132,
name: "关卡1132",
icon: "bg002",
gold: "7006716862637820000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1133: {
key: 1133,
name: "关卡1133",
icon: "bg002",
gold: "7146851199890580000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1134: {
key: 1134,
name: "关卡1134",
icon: "bg002",
gold: "7289788223888390000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1135: {
key: 1135,
name: "关卡1135",
icon: "bg002",
gold: "7435583988366160000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1136: {
key: 1136,
name: "关卡1136",
icon: "bg002",
gold: "7584295668133480000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1137: {
key: 1137,
name: "关卡1137",
icon: "bg002",
gold: "7735981581496150000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1138: {
key: 1138,
name: "关卡1138",
icon: "bg002",
gold: "7890701213126070000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1139: {
key: 1139,
name: "关卡1139",
icon: "bg002",
gold: "8048515237388590000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1140: {
key: 1140,
name: "关卡1140",
icon: "bg002",
gold: "82094855421363600000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1141: {
key: 1141,
name: "关卡1141",
icon: "bg002",
gold: "8373675252979090000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1142: {
key: 1142,
name: "关卡1142",
icon: "bg002",
gold: "8541148758038670000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1143: {
key: 1143,
name: "关卡1143",
icon: "bg002",
gold: "8711971733199450000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1144: {
key: 1144,
name: "关卡1144",
icon: "bg002",
gold: "8886211167863440000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1145: {
key: 1145,
name: "关卡1145",
icon: "bg002",
gold: "9063935391220710000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1146: {
key: 1146,
name: "关卡1146",
icon: "bg002",
gold: "9245214099045120000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1147: {
key: 1147,
name: "关卡1147",
icon: "bg002",
gold: "9430118381026020000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1148: {
key: 1148,
name: "关卡1148",
icon: "bg002",
gold: "9618720748646540000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1149: {
key: 1149,
name: "关卡1149",
icon: "bg002",
gold: "9811095163619470000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1150: {
key: 1150,
name: "关卡1150",
icon: "bg002",
gold: "100073170668919000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1151: {
key: 1151,
name: "关卡1151",
icon: "bg002",
gold: "10207463408229700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1152: {
key: 1152,
name: "关卡1152",
icon: "bg002",
gold: "10411612676394300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1153: {
key: 1153,
name: "关卡1153",
icon: "bg002",
gold: "10619844929922200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1154: {
key: 1154,
name: "关卡1154",
icon: "bg002",
gold: "10832241828520600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1155: {
key: 1155,
name: "关卡1155",
icon: "bg002",
gold: "11048886665091000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1156: {
key: 1156,
name: "关卡1156",
icon: "bg002",
gold: "11269864398392800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1157: {
key: 1157,
name: "关卡1157",
icon: "bg002",
gold: "11495261686360700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1158: {
key: 1158,
name: "关卡1158",
icon: "bg002",
gold: "11725166920087900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1159: {
key: 1159,
name: "关卡1159",
icon: "bg002",
gold: "11959670258489700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1160: {
key: 1160,
name: "关卡1160",
icon: "bg002",
gold: "121988636636595000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1161: {
key: 1161,
name: "关卡1161",
icon: "bg002",
gold: "12442840936932700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1162: {
key: 1162,
name: "关卡1162",
icon: "bg002",
gold: "12691697755671400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1163: {
key: 1163,
name: "关卡1163",
icon: "bg002",
gold: "12945531710784800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1164: {
key: 1164,
name: "关卡1164",
icon: "bg002",
gold: "13204442345000500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1165: {
key: 1165,
name: "关卡1165",
icon: "bg002",
gold: "13468531191900500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1166: {
key: 1166,
name: "关卡1166",
icon: "bg002",
gold: "13737901815738500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1167: {
key: 1167,
name: "关卡1167",
icon: "bg002",
gold: "14012659852053300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1168: {
key: 1168,
name: "关卡1168",
icon: "bg002",
gold: "14292913049094400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1169: {
key: 1169,
name: "关卡1169",
icon: "bg002",
gold: "14578771310076300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1170: {
key: 1170,
name: "关卡1170",
icon: "bg002",
gold: "148703467362778000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1171: {
key: 1171,
name: "关卡1171",
icon: "bg002",
gold: "15167753671003400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1172: {
key: 1172,
name: "关卡1172",
icon: "bg002",
gold: "15471108744423500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1173: {
key: 1173,
name: "关卡1173",
icon: "bg002",
gold: "15780530919312000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1174: {
key: 1174,
name: "关卡1174",
icon: "bg002",
gold: "16096141537698200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1175: {
key: 1175,
name: "关卡1175",
icon: "bg002",
gold: "16418064368452200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1176: {
key: 1176,
name: "关卡1176",
icon: "bg002",
gold: "16746425655821200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1177: {
key: 1177,
name: "关卡1177",
icon: "bg002",
gold: "17081354168937600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1178: {
key: 1178,
name: "关卡1178",
icon: "bg002",
gold: "17422981252316400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1179: {
key: 1179,
name: "关卡1179",
icon: "bg002",
gold: "17771440877362700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1180: {
key: 1180,
name: "关卡1180",
icon: "bg002",
gold: "181268696949100000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1181: {
key: 1181,
name: "关卡1181",
icon: "bg002",
gold: "18489407088808200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1182: {
key: 1182,
name: "关卡1182",
icon: "bg002",
gold: "18859195230584400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1183: {
key: 1183,
name: "关卡1183",
icon: "bg002",
gold: "19236379135196100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1184: {
key: 1184,
name: "关卡1184",
icon: "bg002",
gold: "19621106717900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1185: {
key: 1185,
name: "关卡1185",
icon: "bg002",
gold: "20013528852258000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1186: {
key: 1186,
name: "关卡1186",
icon: "bg002",
gold: "20413799429303200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1187: {
key: 1187,
name: "关卡1187",
icon: "bg002",
gold: "20822075417889300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1188: {
key: 1188,
name: "关卡1188",
icon: "bg002",
gold: "21238516926247100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1189: {
key: 1189,
name: "关卡1189",
icon: "bg002",
gold: "21663287264772000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1190: {
key: 1190,
name: "关卡1190",
icon: "bg002",
gold: "220965530100674000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1191: {
key: 1191,
name: "关卡1191",
icon: "bg002",
gold: "22538484070268700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1192: {
key: 1192,
name: "关卡1192",
icon: "bg002",
gold: "22989253751674100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1193: {
key: 1193,
name: "关卡1193",
icon: "bg002",
gold: "23449038826707600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1194: {
key: 1194,
name: "关卡1194",
icon: "bg002",
gold: "23918019603241800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1195: {
key: 1195,
name: "关卡1195",
icon: "bg002",
gold: "24396379995306600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1196: {
key: 1196,
name: "关卡1196",
icon: "bg002",
gold: "24884307595212700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1197: {
key: 1197,
name: "关卡1197",
icon: "bg002",
gold: "25381993747117000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1198: {
key: 1198,
name: "关卡1198",
icon: "bg002",
gold: "25889633622059300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1199: {
key: 1199,
name: "关卡1199",
icon: "bg002",
gold: "26407426294500500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1200: {
key: 1200,
name: "关卡1200",
icon: "bg002",
gold: "269355748203905000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1201: {
key: 1201,
name: "关卡1201",
icon: "bg002",
gold: "27474286316798300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1202: {
key: 1202,
name: "关卡1202",
icon: "bg002",
gold: "28023772043134300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1203: {
key: 1203,
name: "关卡1203",
icon: "bg002",
gold: "28584247483997000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1204: {
key: 1204,
name: "关卡1204",
icon: "bg002",
gold: "29155932433676900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1205: {
key: 1205,
name: "关卡1205",
icon: "bg002",
gold: "29739051082350400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1206: {
key: 1206,
name: "关卡1206",
icon: "bg002",
gold: "30333832103997400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1207: {
key: 1207,
name: "关卡1207",
icon: "bg002",
gold: "30940508746077300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1208: {
key: 1208,
name: "关卡1208",
icon: "bg002",
gold: "31559318920998800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1209: {
key: 1209,
name: "关卡1209",
icon: "bg002",
gold: "32190505299418800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1210: {
key: 1210,
name: "关卡1210",
icon: "bg002",
gold: "328343154054072000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1211: {
key: 1211,
name: "关卡1211",
icon: "bg002",
gold: "33491001713515300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1212: {
key: 1212,
name: "关卡1212",
icon: "bg002",
gold: "34160821747785600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1213: {
key: 1213,
name: "关卡1213",
icon: "bg002",
gold: "34844038182741300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1214: {
key: 1214,
name: "关卡1214",
icon: "bg002",
gold: "35540918946396100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1215: {
key: 1215,
name: "关卡1215",
icon: "bg002",
gold: "36251737325324000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1216: {
key: 1216,
name: "关卡1216",
icon: "bg002",
gold: "36976772071830500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1217: {
key: 1217,
name: "关卡1217",
icon: "bg002",
gold: "37716307513267100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1218: {
key: 1218,
name: "关卡1218",
icon: "bg002",
gold: "38470633663532400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1219: {
key: 1219,
name: "关卡1219",
icon: "bg002",
gold: "39240046336803100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1220: {
key: 1220,
name: "关卡1220",
icon: "bg002",
gold: "400248472635392000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1221: {
key: 1221,
name: "关卡1221",
icon: "bg002",
gold: "40825344208810000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1222: {
key: 1222,
name: "关卡1222",
icon: "bg002",
gold: "41641851092986200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1223: {
key: 1223,
name: "关卡1223",
icon: "bg002",
gold: "42474688114845900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1224: {
key: 1224,
name: "关卡1224",
icon: "bg002",
gold: "43324181877142800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1225: {
key: 1225,
name: "关卡1225",
icon: "bg002",
gold: "44190665514685700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1226: {
key: 1226,
name: "关卡1226",
icon: "bg002",
gold: "45074478824979400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1227: {
key: 1227,
name: "关卡1227",
icon: "bg002",
gold: "45975968401479000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1228: {
key: 1228,
name: "关卡1228",
icon: "bg002",
gold: "46895487769508600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1229: {
key: 1229,
name: "关卡1229",
icon: "bg002",
gold: "47833397524898800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1230: {
key: 1230,
name: "关卡1230",
icon: "bg002",
gold: "487900654753968000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1231: {
key: 1231,
name: "关卡1231",
icon: "bg002",
gold: "49765866784904700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1232: {
key: 1232,
name: "关卡1232",
icon: "bg002",
gold: "50761184120602800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1233: {
key: 1233,
name: "关卡1233",
icon: "bg002",
gold: "51776407803014900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1234: {
key: 1234,
name: "关卡1234",
icon: "bg002",
gold: "52811935959075200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1235: {
key: 1235,
name: "关卡1235",
icon: "bg002",
gold: "53868174678256700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1236: {
key: 1236,
name: "关卡1236",
icon: "bg002",
gold: "54945538171821800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1237: {
key: 1237,
name: "关卡1237",
icon: "bg002",
gold: "56044448935258200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1238: {
key: 1238,
name: "关卡1238",
icon: "bg002",
gold: "57165337913963400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1239: {
key: 1239,
name: "关卡1239",
icon: "bg002",
gold: "58308644672242700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1240: {
key: 1240,
name: "关卡1240",
icon: "bg002",
gold: "594748175656876000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1241: {
key: 1241,
name: "关卡1241",
icon: "bg002",
gold: "60664313917001400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1242: {
key: 1242,
name: "关卡1242",
icon: "bg002",
gold: "61877600195341400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1243: {
key: 1243,
name: "关卡1243",
icon: "bg002",
gold: "63115152199248200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1244: {
key: 1244,
name: "关卡1244",
icon: "bg002",
gold: "64377455243233200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1245: {
key: 1245,
name: "关卡1245",
icon: "bg002",
gold: "65665004348097900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1246: {
key: 1246,
name: "关卡1246",
icon: "bg002",
gold: "66978304435059900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1247: {
key: 1247,
name: "关卡1247",
icon: "bg002",
gold: "68317870523761100000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1248: {
key: 1248,
name: "关卡1248",
icon: "bg002",
gold: "69684227934236300000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1249: {
key: 1249,
name: "关卡1249",
icon: "bg002",
gold: "71077912492921000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1250: {
key: 1250,
name: "关卡1250",
icon: "bg002",
gold: "724994707427794000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1251: {
key: 1251,
name: "关卡1251",
icon: "bg002",
gold: "73949460157635000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1252: {
key: 1252,
name: "关卡1252",
icon: "bg002",
gold: "75428449360787700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1253: {
key: 1253,
name: "关卡1253",
icon: "bg002",
gold: "76937018348003500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1254: {
key: 1254,
name: "关卡1254",
icon: "bg002",
gold: "78475758714963600000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1255: {
key: 1255,
name: "关卡1255",
icon: "bg002",
gold: "80045273889262900000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1256: {
key: 1256,
name: "关卡1256",
icon: "bg002",
gold: "81646179367048200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1257: {
key: 1257,
name: "关卡1257",
icon: "bg002",
gold: "83279102954389200000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1258: {
key: 1258,
name: "关卡1258",
icon: "bg002",
gold: "84944685013477000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1259: {
key: 1259,
name: "关卡1259",
icon: "bg002",
gold: "86643578713746500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1260: {
key: 1260,
name: "关卡1260",
icon: "bg002",
gold: "883764502880214000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1261: {
key: 1261,
name: "关卡1261",
icon: "bg002",
gold: "90143979293781800000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1262: {
key: 1262,
name: "关卡1262",
icon: "bg002",
gold: "91946858879657400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1263: {
key: 1263,
name: "关卡1263",
icon: "bg002",
gold: "93785796057250500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1264: {
key: 1264,
name: "关卡1264",
icon: "bg002",
gold: "95661511978395500000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1265: {
key: 1265,
name: "关卡1265",
icon: "bg002",
gold: "97574742217963400000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1266: {
key: 1266,
name: "关卡1266",
icon: "bg002",
gold: "99526237062322700000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1267: {
key: 1267,
name: "关卡1267",
icon: "bg002",
gold: "101516761803569000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1268: {
key: 1268,
name: "关卡1268",
icon: "bg002",
gold: "103547097039640000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1269: {
key: 1269,
name: "关卡1269",
icon: "bg002",
gold: "105618038980433000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1270: {
key: 1270,
name: "关卡1270",
icon: "bg002",
gold: "1077303997600420000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1271: {
key: 1271,
name: "关卡1271",
icon: "bg002",
gold: "109885007755243000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1272: {
key: 1272,
name: "关卡1272",
icon: "bg002",
gold: "112082707910348000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1273: {
key: 1273,
name: "关卡1273",
icon: "bg002",
gold: "114324362068555000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1274: {
key: 1274,
name: "关卡1274",
icon: "bg002",
gold: "116610849309926000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1275: {
key: 1275,
name: "关卡1275",
icon: "bg002",
gold: "118943066296125000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1276: {
key: 1276,
name: "关卡1276",
icon: "bg002",
gold: "121321927622048000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1277: {
key: 1277,
name: "关卡1277",
icon: "bg002",
gold: "123748366174489000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1278: {
key: 1278,
name: "关卡1278",
icon: "bg002",
gold: "126223333497979000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1279: {
key: 1279,
name: "关卡1279",
icon: "bg002",
gold: "128747800167939000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1280: {
key: 1280,
name: "关卡1280",
icon: "bg002",
gold: "1313227561712980000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1281: {
key: 1281,
name: "关卡1281",
icon: "bg002",
gold: "133949211294724000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1282: {
key: 1282,
name: "关卡1282",
icon: "bg002",
gold: "136628195520618000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1283: {
key: 1283,
name: "关卡1283",
icon: "bg002",
gold: "139360759431030000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1284: {
key: 1284,
name: "关卡1284",
icon: "bg002",
gold: "142147974619651000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1285: {
key: 1285,
name: "关卡1285",
icon: "bg002",
gold: "144990934112044000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1286: {
key: 1286,
name: "关卡1286",
icon: "bg002",
gold: "147890752794285000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1287: {
key: 1287,
name: "关卡1287",
icon: "bg002",
gold: "150848567850171000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1288: {
key: 1288,
name: "关卡1288",
icon: "bg002",
gold: "153865539207174000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1289: {
key: 1289,
name: "关卡1289",
icon: "bg002",
gold: "156942849991317000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1290: {
key: 1290,
name: "关卡1290",
icon: "bg002",
gold: "1600817069911430000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1291: {
key: 1291,
name: "关卡1291",
icon: "bg002",
gold: "163283341130966000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1292: {
key: 1292,
name: "关卡1292",
icon: "bg002",
gold: "166549007953585000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1293: {
key: 1293,
name: "关卡1293",
icon: "bg002",
gold: "169879988112657000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1294: {
key: 1294,
name: "关卡1294",
icon: "bg002",
gold: "173277587874910000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1295: {
key: 1295,
name: "关卡1295",
icon: "bg002",
gold: "176743139632408000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1296: {
key: 1296,
name: "关卡1296",
icon: "bg002",
gold: "180278002425056000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1297: {
key: 1297,
name: "关卡1297",
icon: "bg002",
gold: "183883562473557000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1298: {
key: 1298,
name: "关卡1298",
icon: "bg002",
gold: "187561233723028000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1299: {
key: 1299,
name: "关卡1299",
icon: "bg002",
gold: "191312458397489000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1300: {
key: 1300,
name: "关卡1300",
icon: "bg002",
gold: "1951387075654390000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1301: {
key: 1301,
name: "关卡1301",
icon: "bg002",
gold: "199041481716748000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1302: {
key: 1302,
name: "关卡1302",
icon: "bg002",
gold: "203022311351083000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1303: {
key: 1303,
name: "关卡1303",
icon: "bg002",
gold: "207082757578105000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1304: {
key: 1304,
name: "关卡1304",
icon: "bg002",
gold: "211224412729667000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1305: {
key: 1305,
name: "关卡1305",
icon: "bg002",
gold: "215448900984260000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1306: {
key: 1306,
name: "关卡1306",
icon: "bg002",
gold: "219757879003945000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1307: {
key: 1307,
name: "关卡1307",
icon: "bg002",
gold: "224153036584024000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1308: {
key: 1308,
name: "关卡1308",
icon: "bg002",
gold: "228636097315704000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1309: {
key: 1309,
name: "关卡1309",
icon: "bg002",
gold: "233208819262018000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1310: {
key: 1310,
name: "关卡1310",
icon: "bg002",
gold: "2378729956472580000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1311: {
key: 1311,
name: "关卡1311",
icon: "bg002",
gold: "242630455560203000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1312: {
key: 1312,
name: "关卡1312",
icon: "bg002",
gold: "247483064671407000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1313: {
key: 1313,
name: "关卡1313",
icon: "bg002",
gold: "252432725964835000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1314: {
key: 1314,
name: "关卡1314",
icon: "bg002",
gold: "257481380484132000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1315: {
key: 1315,
name: "关卡1315",
icon: "bg002",
gold: "262631008093815000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1316: {
key: 1316,
name: "关卡1316",
icon: "bg002",
gold: "267883628255691000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1317: {
key: 1317,
name: "关卡1317",
icon: "bg002",
gold: "273241300820805000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1318: {
key: 1318,
name: "关卡1318",
icon: "bg002",
gold: "278706126837221000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1319: {
key: 1319,
name: "关卡1319",
icon: "bg002",
gold: "284280249373965000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1320: {
key: 1320,
name: "关卡1320",
icon: "bg002",
gold: "2899658543614440000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1321: {
key: 1321,
name: "关卡1321",
icon: "bg002",
gold: "295765171448673000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1322: {
key: 1322,
name: "关卡1322",
icon: "bg002",
gold: "301680474877647000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1323: {
key: 1323,
name: "关卡1323",
icon: "bg002",
gold: "307714084375200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1324: {
key: 1324,
name: "关卡1324",
icon: "bg002",
gold: "313868366062704000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1325: {
key: 1325,
name: "关卡1325",
icon: "bg002",
gold: "320145733383958000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1326: {
key: 1326,
name: "关卡1326",
icon: "bg002",
gold: "326548648051637000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1327: {
key: 1327,
name: "关卡1327",
icon: "bg002",
gold: "333079621012670000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1328: {
key: 1328,
name: "关卡1328",
icon: "bg002",
gold: "339741213432923000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1329: {
key: 1329,
name: "关卡1329",
icon: "bg002",
gold: "346536037701582000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1330: {
key: 1330,
name: "关卡1330",
icon: "bg002",
gold: "3534667584556140000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1331: {
key: 1331,
name: "关卡1331",
icon: "bg002",
gold: "360536093624726000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1332: {
key: 1332,
name: "关卡1332",
icon: "bg002",
gold: "367746815497221000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1333: {
key: 1333,
name: "关卡1333",
icon: "bg002",
gold: "375101751807165000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1334: {
key: 1334,
name: "关卡1334",
icon: "bg002",
gold: "382603786843308000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1335: {
key: 1335,
name: "关卡1335",
icon: "bg002",
gold: "390255862580174000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1336: {
key: 1336,
name: "关卡1336",
icon: "bg002",
gold: "398060979831778000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1337: {
key: 1337,
name: "关卡1337",
icon: "bg002",
gold: "406022199428414000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1338: {
key: 1338,
name: "关卡1338",
icon: "bg002",
gold: "414142643416982000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1339: {
key: 1339,
name: "关卡1339",
icon: "bg002",
gold: "422425496285322000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1340: {
key: 1340,
name: "关卡1340",
icon: "bg002",
gold: "4308740062110280000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1341: {
key: 1341,
name: "关卡1341",
icon: "bg002",
gold: "439491486335249000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1342: {
key: 1342,
name: "关卡1342",
icon: "bg002",
gold: "448281316061954000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1343: {
key: 1343,
name: "关卡1343",
icon: "bg002",
gold: "457246942383193000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1344: {
key: 1344,
name: "关卡1344",
icon: "bg002",
gold: "466391881230857000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1345: {
key: 1345,
name: "关卡1345",
icon: "bg002",
gold: "475719718855474000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1346: {
key: 1346,
name: "关卡1346",
icon: "bg002",
gold: "485234113232583000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1347: {
key: 1347,
name: "关卡1347",
icon: "bg002",
gold: "494938795497235000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1348: {
key: 1348,
name: "关卡1348",
icon: "bg002",
gold: "504837571407180000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1349: {
key: 1349,
name: "关卡1349",
icon: "bg002",
gold: "514934322835324000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1350: {
key: 1350,
name: "关卡1350",
icon: "bg002",
gold: "5252330092920310000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1351: {
key: 1351,
name: "关卡1351",
icon: "bg002",
gold: "535737669477872000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1352: {
key: 1352,
name: "关卡1352",
icon: "bg002",
gold: "546452422867430000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1353: {
key: 1353,
name: "关卡1353",
icon: "bg002",
gold: "557381471324779000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1354: {
key: 1354,
name: "关卡1354",
icon: "bg002",
gold: "568529100751275000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1355: {
key: 1355,
name: "关卡1355",
icon: "bg002",
gold: "579899682766301000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1356: {
key: 1356,
name: "关卡1356",
icon: "bg002",
gold: "591497676421627000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1357: {
key: 1357,
name: "关卡1357",
icon: "bg002",
gold: "603327629950060000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1358: {
key: 1358,
name: "关卡1358",
icon: "bg002",
gold: "615394182549061000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1359: {
key: 1359,
name: "关卡1359",
icon: "bg002",
gold: "627702066200042000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1360: {
key: 1360,
name: "关卡1360",
icon: "bg002",
gold: "6402561075240430000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1361: {
key: 1361,
name: "关卡1361",
icon: "bg002",
gold: "653061229674524000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1362: {
key: 1362,
name: "关卡1362",
icon: "bg002",
gold: "666122454268015000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1363: {
key: 1363,
name: "关卡1363",
icon: "bg002",
gold: "679444903353375000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1364: {
key: 1364,
name: "关卡1364",
icon: "bg002",
gold: "693033801420443000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1365: {
key: 1365,
name: "关卡1365",
icon: "bg002",
gold: "706894477448852000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1366: {
key: 1366,
name: "关卡1366",
icon: "bg002",
gold: "721032366997829000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1367: {
key: 1367,
name: "关卡1367",
icon: "bg002",
gold: "735453014337786000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1368: {
key: 1368,
name: "关卡1368",
icon: "bg002",
gold: "750162074624542000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1369: {
key: 1369,
name: "关卡1369",
icon: "bg002",
gold: "765165316117033000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1370: {
key: 1370,
name: "关卡1370",
icon: "bg002",
gold: "7804686224393740000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1371: {
key: 1371,
name: "关卡1371",
icon: "bg002",
gold: "796077994888162000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1372: {
key: 1372,
name: "关卡1372",
icon: "bg002",
gold: "811999554785925000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1373: {
key: 1373,
name: "关卡1373",
icon: "bg002",
gold: "828239545881644000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1374: {
key: 1374,
name: "关卡1374",
icon: "bg002",
gold: "844804336799277000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1375: {
key: 1375,
name: "关卡1375",
icon: "bg002",
gold: "861700423535263000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1376: {
key: 1376,
name: "关卡1376",
icon: "bg002",
gold: "878934432005968000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1377: {
key: 1377,
name: "关卡1377",
icon: "bg002",
gold: "896513120646087000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1378: {
key: 1378,
name: "关卡1378",
icon: "bg002",
gold: "914443383059009000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1379: {
key: 1379,
name: "关卡1379",
icon: "bg002",
gold: "932732250720189000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1380: {
key: 1380,
name: "关卡1380",
icon: "bg002",
gold: "9513868957345930000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1381: {
key: 1381,
name: "关卡1381",
icon: "bg002",
gold: "970414633649285000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1382: {
key: 1382,
name: "关卡1382",
icon: "bg002",
gold: "989822926322271000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1383: {
key: 1383,
name: "关卡1383",
icon: "bg002",
gold: "1009619384848720000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1384: {
key: 1384,
name: "关卡1384",
icon: "bg002",
gold: "1029811772545690000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1385: {
key: 1385,
name: "关卡1385",
icon: "bg002",
gold: "1050408007996600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1386: {
key: 1386,
name: "关卡1386",
icon: "bg002",
gold: "1071416168156530000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1387: {
key: 1387,
name: "关卡1387",
icon: "bg002",
gold: "1092844491519660000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1388: {
key: 1388,
name: "关卡1388",
icon: "bg002",
gold: "1114701381350050000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1389: {
key: 1389,
name: "关卡1389",
icon: "bg002",
gold: "1136995408977050000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1390: {
key: 1390,
name: "关卡1390",
icon: "bg002",
gold: "11597353171565900000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1391: {
key: 1391,
name: "关卡1391",
icon: "bg002",
gold: "1182930023499720000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1392: {
key: 1392,
name: "关卡1392",
icon: "bg002",
gold: "1206588623969710000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1393: {
key: 1393,
name: "关卡1393",
icon: "bg002",
gold: "1230720396449100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1394: {
key: 1394,
name: "关卡1394",
icon: "bg002",
gold: "1255334804378080000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1395: {
key: 1395,
name: "关卡1395",
icon: "bg002",
gold: "1280441500465640000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1396: {
key: 1396,
name: "关卡1396",
icon: "bg002",
gold: "1306050330474950000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1397: {
key: 1397,
name: "关卡1397",
icon: "bg002",
gold: "1332171337084450000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1398: {
key: 1398,
name: "关卡1398",
icon: "bg002",
gold: "1358814763826140000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1399: {
key: 1399,
name: "关卡1399",
icon: "bg002",
gold: "1385991059102660000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1400: {
key: 1400,
name: "关卡1400",
icon: "bg002",
gold: "14137108802847100000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1401: {
key: 1401,
name: "关卡1401",
icon: "bg002",
gold: "1441985097890400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1402: {
key: 1402,
name: "关卡1402",
icon: "bg002",
gold: "1470824799848210000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1403: {
key: 1403,
name: "关卡1403",
icon: "bg002",
gold: "1500241295845170000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1404: {
key: 1404,
name: "关卡1404",
icon: "bg002",
gold: "1530246121762070000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1405: {
key: 1405,
name: "关卡1405",
icon: "bg002",
gold: "1560851044197310000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1406: {
key: 1406,
name: "关卡1406",
icon: "bg002",
gold: "1592068065081260000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1407: {
key: 1407,
name: "关卡1407",
icon: "bg002",
gold: "1623909426382890000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1408: {
key: 1408,
name: "关卡1408",
icon: "bg002",
gold: "1656387614910550000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1409: {
key: 1409,
name: "关卡1409",
icon: "bg002",
gold: "1689515367208760000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1410: {
key: 1410,
name: "关卡1410",
icon: "bg002",
gold: "17233056745529400000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1411: {
key: 1411,
name: "关卡1411",
icon: "bg002",
gold: "1757771788044000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1412: {
key: 1412,
name: "关卡1412",
icon: "bg002",
gold: "1792927223804880000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1413: {
key: 1413,
name: "关卡1413",
icon: "bg002",
gold: "1828785768280980000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1414: {
key: 1414,
name: "关卡1414",
icon: "bg002",
gold: "1865361483646600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1415: {
key: 1415,
name: "关卡1415",
icon: "bg002",
gold: "1902668713319530000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1416: {
key: 1416,
name: "关卡1416",
icon: "bg002",
gold: "1940722087585920000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1417: {
key: 1417,
name: "关卡1417",
icon: "bg002",
gold: "1979536529337640000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1418: {
key: 1418,
name: "关卡1418",
icon: "bg002",
gold: "2019127259924390000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1419: {
key: 1419,
name: "关卡1419",
icon: "bg002",
gold: "2059509805122880000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1420: {
key: 1420,
name: "关卡1420",
icon: "bg002",
gold: "21007000012253400000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1421: {
key: 1421,
name: "关卡1421",
icon: "bg002",
gold: "2142714001249850000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1422: {
key: 1422,
name: "关卡1422",
icon: "bg002",
gold: "2185568281274850000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1423: {
key: 1423,
name: "关卡1423",
icon: "bg002",
gold: "2229279646900350000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1424: {
key: 1424,
name: "关卡1424",
icon: "bg002",
gold: "2273865239838360000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1425: {
key: 1425,
name: "关卡1425",
icon: "bg002",
gold: "2319342544635130000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1426: {
key: 1426,
name: "关卡1426",
icon: "bg002",
gold: "2365729395527830000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1427: {
key: 1427,
name: "关卡1427",
icon: "bg002",
gold: "2413043983438390000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1428: {
key: 1428,
name: "关卡1428",
icon: "bg002",
gold: "2461304863107160000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1429: {
key: 1429,
name: "关卡1429",
icon: "bg002",
gold: "2510530960369300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1430: {
key: 1430,
name: "关卡1430",
icon: "bg002",
gold: "25607415795766900000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1431: {
key: 1431,
name: "关卡1431",
icon: "bg002",
gold: "2611956411168220000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1432: {
key: 1432,
name: "关卡1432",
icon: "bg002",
gold: "2664195539391580000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1433: {
key: 1433,
name: "关卡1433",
icon: "bg002",
gold: "2717479450179410000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1434: {
key: 1434,
name: "关卡1434",
icon: "bg002",
gold: "2771829039183000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1435: {
key: 1435,
name: "关卡1435",
icon: "bg002",
gold: "2827265619966660000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1436: {
key: 1436,
name: "关卡1436",
icon: "bg002",
gold: "2883810932365990000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1437: {
key: 1437,
name: "关卡1437",
icon: "bg002",
gold: "2941487151013310000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1438: {
key: 1438,
name: "关卡1438",
icon: "bg002",
gold: "3000316894033580000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1439: {
key: 1439,
name: "关卡1439",
icon: "bg002",
gold: "3060323231914250000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1440: {
key: 1440,
name: "关卡1440",
icon: "bg002",
gold: "31215296965525400000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1441: {
key: 1441,
name: "关卡1441",
icon: "bg002",
gold: "3183960290483590000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1442: {
key: 1442,
name: "关卡1442",
icon: "bg002",
gold: "3247639496293260000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1443: {
key: 1443,
name: "关卡1443",
icon: "bg002",
gold: "3312592286219130000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1444: {
key: 1444,
name: "关卡1444",
icon: "bg002",
gold: "3378844131943510000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1445: {
key: 1445,
name: "关卡1445",
icon: "bg002",
gold: "3446421014582380000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1446: {
key: 1446,
name: "关卡1446",
icon: "bg002",
gold: "3515349434874030000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1447: {
key: 1447,
name: "关卡1447",
icon: "bg002",
gold: "3585656423571510000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1448: {
key: 1448,
name: "关卡1448",
icon: "bg002",
gold: "3657369552042940000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1449: {
key: 1449,
name: "关卡1449",
icon: "bg002",
gold: "3730516943083800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1450: {
key: 1450,
name: "关卡1450",
icon: "bg002",
gold: "38051272819454800000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1451: {
key: 1451,
name: "关卡1451",
icon: "bg002",
gold: "3881229827584390000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1452: {
key: 1452,
name: "关卡1452",
icon: "bg002",
gold: "3958854424136080000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1453: {
key: 1453,
name: "关卡1453",
icon: "bg002",
gold: "4038031512618800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1454: {
key: 1454,
name: "关卡1454",
icon: "bg002",
gold: "4118792142871180000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1455: {
key: 1455,
name: "关卡1455",
icon: "bg002",
gold: "4201167985728600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1456: {
key: 1456,
name: "关卡1456",
icon: "bg002",
gold: "4285191345443170000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1457: {
key: 1457,
name: "关卡1457",
icon: "bg002",
gold: "4370895172352030000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1458: {
key: 1458,
name: "关卡1458",
icon: "bg002",
gold: "4458313075799070000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1459: {
key: 1459,
name: "关卡1459",
icon: "bg002",
gold: "4547479337315050000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1460: {
key: 1460,
name: "关卡1460",
icon: "bg002",
gold: "46384289240613500000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1461: {
key: 1461,
name: "关卡1461",
icon: "bg002",
gold: "4731197502542580000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1462: {
key: 1462,
name: "关卡1462",
icon: "bg002",
gold: "4825821452593430000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1463: {
key: 1463,
name: "关卡1463",
icon: "bg002",
gold: "4922337881645300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1464: {
key: 1464,
name: "关卡1464",
icon: "bg002",
gold: "5020784639278210000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1465: {
key: 1465,
name: "关卡1465",
icon: "bg002",
gold: "5121200332063770000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1466: {
key: 1466,
name: "关卡1466",
icon: "bg002",
gold: "5223624338705050000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1467: {
key: 1467,
name: "关卡1467",
icon: "bg002",
gold: "5328096825479150000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1468: {
key: 1468,
name: "关卡1468",
icon: "bg002",
gold: "5434658761988730000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1469: {
key: 1469,
name: "关卡1469",
icon: "bg002",
gold: "5543351937228500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1470: {
key: 1470,
name: "关卡1470",
icon: "bg002",
gold: "56542189759730700000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1471: {
key: 1471,
name: "关卡1471",
icon: "bg002",
gold: "5767303355492530000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1472: {
key: 1472,
name: "关卡1472",
icon: "bg002",
gold: "5882649422602380000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1473: {
key: 1473,
name: "关卡1473",
icon: "bg002",
gold: "6000302411054430000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1474: {
key: 1474,
name: "关卡1474",
icon: "bg002",
gold: "6120308459275520000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1475: {
key: 1475,
name: "关卡1475",
icon: "bg002",
gold: "6242714628461030000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1476: {
key: 1476,
name: "关卡1476",
icon: "bg002",
gold: "6367568921030250000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1477: {
key: 1477,
name: "关卡1477",
icon: "bg002",
gold: "6494920299450860000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1478: {
key: 1478,
name: "关卡1478",
icon: "bg002",
gold: "6624818705439880000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1479: {
key: 1479,
name: "关卡1479",
icon: "bg002",
gold: "6757315079548680000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1480: {
key: 1480,
name: "关卡1480",
icon: "bg002",
gold: "68924613811396500000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1481: {
key: 1481,
name: "关卡1481",
icon: "bg002",
gold: "7030310608762440000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1482: {
key: 1482,
name: "关卡1482",
icon: "bg002",
gold: "7170916820937690000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1483: {
key: 1483,
name: "关卡1483",
icon: "bg002",
gold: "7314335157356440000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1484: {
key: 1484,
name: "关卡1484",
icon: "bg002",
gold: "7460621860503570000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1485: {
key: 1485,
name: "关卡1485",
icon: "bg002",
gold: "7609834297713640000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1486: {
key: 1486,
name: "关卡1486",
icon: "bg002",
gold: "7762030983667910000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1487: {
key: 1487,
name: "关卡1487",
icon: "bg002",
gold: "7917271603341270000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1488: {
key: 1488,
name: "关卡1488",
icon: "bg002",
gold: "8075617035408100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1489: {
key: 1489,
name: "关卡1489",
icon: "bg002",
gold: "8237129376116260000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1490: {
key: 1490,
name: "关卡1490",
icon: "bg002",
gold: "84018719636385800000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1491: {
key: 1491,
name: "关卡1491",
icon: "bg002",
gold: "8569909402911350000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1492: {
key: 1492,
name: "关卡1492",
icon: "bg002",
gold: "8741307590969580000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1493: {
key: 1493,
name: "关卡1493",
icon: "bg002",
gold: "8916133742788970000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1494: {
key: 1494,
name: "关卡1494",
icon: "bg002",
gold: "9094456417644750000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1495: {
key: 1495,
name: "关卡1495",
icon: "bg002",
gold: "9276345545997650000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1496: {
key: 1496,
name: "关卡1496",
icon: "bg002",
gold: "9461872456917600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1497: {
key: 1497,
name: "关卡1497",
icon: "bg002",
gold: "9651109906055950000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1498: {
key: 1498,
name: "关卡1498",
icon: "bg002",
gold: "9844132104177070000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1499: {
key: 1499,
name: "关卡1499",
icon: "bg002",
gold: "10041014746260600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1500: {
key: 1500,
name: "关卡1500",
icon: "bg002",
gold: "102418350411858000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1501: {
key: 1501,
name: "关卡1501",
icon: "bg002",
gold: "10446671742009500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1502: {
key: 1502,
name: "关卡1502",
icon: "bg002",
gold: "10655605176849700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1503: {
key: 1503,
name: "关卡1503",
icon: "bg002",
gold: "10868717280386700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1504: {
key: 1504,
name: "关卡1504",
icon: "bg002",
gold: "11086091625994400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1505: {
key: 1505,
name: "关卡1505",
icon: "bg002",
gold: "11307813458514300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1506: {
key: 1506,
name: "关卡1506",
icon: "bg002",
gold: "11533969727684600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1507: {
key: 1507,
name: "关卡1507",
icon: "bg002",
gold: "11764649122238300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1508: {
key: 1508,
name: "关卡1508",
icon: "bg002",
gold: "11999942104683100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1509: {
key: 1509,
name: "关卡1509",
icon: "bg002",
gold: "12239940946776800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1510: {
key: 1510,
name: "关卡1510",
icon: "bg002",
gold: "124847397657123000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1511: {
key: 1511,
name: "关卡1511",
icon: "bg002",
gold: "12734434561026500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1512: {
key: 1512,
name: "关卡1512",
icon: "bg002",
gold: "12989123252247000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1513: {
key: 1513,
name: "关卡1513",
icon: "bg002",
gold: "13248905717291900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1514: {
key: 1514,
name: "关卡1514",
icon: "bg002",
gold: "13513883831637700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1515: {
key: 1515,
name: "关卡1515",
icon: "bg002",
gold: "13784161508270500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1516: {
key: 1516,
name: "关卡1516",
icon: "bg002",
gold: "14059844738435900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1517: {
key: 1517,
name: "关卡1517",
icon: "bg002",
gold: "14341041633204600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1518: {
key: 1518,
name: "关卡1518",
icon: "bg002",
gold: "14627862465868700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1519: {
key: 1519,
name: "关卡1519",
icon: "bg002",
gold: "14920419715186100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1520: {
key: 1520,
name: "关卡1520",
icon: "bg002",
gold: "152188281094898000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1521: {
key: 1521,
name: "关卡1521",
icon: "bg002",
gold: "15523204671679600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1522: {
key: 1522,
name: "关卡1522",
icon: "bg002",
gold: "15833668765113200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1523: {
key: 1523,
name: "关卡1523",
icon: "bg002",
gold: "16150342140415500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1524: {
key: 1524,
name: "关卡1524",
icon: "bg002",
gold: "16473348983223800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1525: {
key: 1525,
name: "关卡1525",
icon: "bg002",
gold: "16802815962888300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1526: {
key: 1526,
name: "关卡1526",
icon: "bg002",
gold: "17138872282146100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1527: {
key: 1527,
name: "关卡1527",
icon: "bg002",
gold: "17481649727789000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1528: {
key: 1528,
name: "关卡1528",
icon: "bg002",
gold: "17831282722344800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1529: {
key: 1529,
name: "关卡1529",
icon: "bg002",
gold: "18187908376791700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1530: {
key: 1530,
name: "关卡1530",
icon: "bg002",
gold: "185516665443275000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1531: {
key: 1531,
name: "关卡1531",
icon: "bg002",
gold: "18922699875214000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1532: {
key: 1532,
name: "关卡1532",
icon: "bg002",
gold: "19301153872718300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1533: {
key: 1533,
name: "关卡1533",
icon: "bg002",
gold: "19687176950172700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1534: {
key: 1534,
name: "关卡1534",
icon: "bg002",
gold: "20080920489176200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1535: {
key: 1535,
name: "关卡1535",
icon: "bg002",
gold: "20482538898959700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1536: {
key: 1536,
name: "关卡1536",
icon: "bg002",
gold: "20892189676938900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1537: {
key: 1537,
name: "关卡1537",
icon: "bg002",
gold: "21310033470477700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1538: {
key: 1538,
name: "关卡1538",
icon: "bg002",
gold: "21736234139887300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1539: {
key: 1539,
name: "关卡1539",
icon: "bg002",
gold: "22170958822685000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1540: {
key: 1540,
name: "关卡1540",
icon: "bg002",
gold: "226143779991387000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1541: {
key: 1541,
name: "关卡1541",
icon: "bg002",
gold: "23066665559121500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1542: {
key: 1542,
name: "关卡1542",
icon: "bg002",
gold: "23527998870303900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1543: {
key: 1543,
name: "关卡1543",
icon: "bg002",
gold: "23998558847710000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1544: {
key: 1544,
name: "关卡1544",
icon: "bg002",
gold: "24478530024664200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1545: {
key: 1545,
name: "关卡1545",
icon: "bg002",
gold: "24968100625157500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1546: {
key: 1546,
name: "关卡1546",
icon: "bg002",
gold: "25467462637660600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1547: {
key: 1547,
name: "关卡1547",
icon: "bg002",
gold: "25976811890413800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1548: {
key: 1548,
name: "关卡1548",
icon: "bg002",
gold: "26496348128222100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1549: {
key: 1549,
name: "关卡1549",
icon: "bg002",
gold: "27026275090786500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1550: {
key: 1550,
name: "关卡1550",
icon: "bg002",
gold: "275668005926022000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1551: {
key: 1551,
name: "关卡1551",
icon: "bg002",
gold: "28118136604454200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1552: {
key: 1552,
name: "关卡1552",
icon: "bg002",
gold: "28680499336543300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1553: {
key: 1553,
name: "关卡1553",
icon: "bg002",
gold: "29254109323274200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1554: {
key: 1554,
name: "关卡1554",
icon: "bg002",
gold: "29839191509739700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1555: {
key: 1555,
name: "关卡1555",
icon: "bg002",
gold: "30435975339934500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1556: {
key: 1556,
name: "关卡1556",
icon: "bg002",
gold: "31044694846733200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1557: {
key: 1557,
name: "关卡1557",
icon: "bg002",
gold: "31665588743667900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1558: {
key: 1558,
name: "关卡1558",
icon: "bg002",
gold: "32298900518541300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1559: {
key: 1559,
name: "关卡1559",
icon: "bg002",
gold: "32944878528912100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1560: {
key: 1560,
name: "关卡1560",
icon: "bg002",
gold: "336037760994903000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1561: {
key: 1561,
name: "关卡1561",
icon: "bg002",
gold: "34275851621480100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1562: {
key: 1562,
name: "关卡1562",
icon: "bg002",
gold: "34961368653909700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1563: {
key: 1563,
name: "关卡1563",
icon: "bg002",
gold: "35660596026987900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1564: {
key: 1564,
name: "关卡1564",
icon: "bg002",
gold: "36373807947527700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1565: {
key: 1565,
name: "关卡1565",
icon: "bg002",
gold: "37101284106478300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1566: {
key: 1566,
name: "关卡1566",
icon: "bg002",
gold: "37843309788607900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1567: {
key: 1567,
name: "关卡1567",
icon: "bg002",
gold: "38600175984380100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1568: {
key: 1568,
name: "关卡1568",
icon: "bg002",
gold: "39372179504067700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1569: {
key: 1569,
name: "关卡1569",
icon: "bg002",
gold: "40159623094149100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1570: {
key: 1570,
name: "关卡1570",
icon: "bg002",
gold: "409628155560321000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1571: {
key: 1571,
name: "关卡1571",
icon: "bg002",
gold: "41782071867152700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1572: {
key: 1572,
name: "关卡1572",
icon: "bg002",
gold: "42617713304495800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1573: {
key: 1573,
name: "关卡1573",
icon: "bg002",
gold: "43470067570585700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1574: {
key: 1574,
name: "关卡1574",
icon: "bg002",
gold: "44339468921997400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1575: {
key: 1575,
name: "关卡1575",
icon: "bg002",
gold: "45226258300437400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1576: {
key: 1576,
name: "关卡1576",
icon: "bg002",
gold: "46130783466446200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1577: {
key: 1577,
name: "关卡1577",
icon: "bg002",
gold: "47053399135775100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1578: {
key: 1578,
name: "关卡1578",
icon: "bg002",
gold: "47994467118490600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1579: {
key: 1579,
name: "关卡1579",
icon: "bg002",
gold: "48954356460860400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1580: {
key: 1580,
name: "关卡1580",
icon: "bg002",
gold: "499334435900776000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1581: {
key: 1581,
name: "关卡1581",
icon: "bg002",
gold: "50932112461879200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1582: {
key: 1582,
name: "关卡1582",
icon: "bg002",
gold: "51950754711116800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1583: {
key: 1583,
name: "关卡1583",
icon: "bg002",
gold: "52989769805339100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1584: {
key: 1584,
name: "关卡1584",
icon: "bg002",
gold: "54049565201445900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1585: {
key: 1585,
name: "关卡1585",
icon: "bg002",
gold: "55130556505474800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1586: {
key: 1586,
name: "关卡1586",
icon: "bg002",
gold: "56233167635584300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1587: {
key: 1587,
name: "关卡1587",
icon: "bg002",
gold: "57357830988296000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1588: {
key: 1588,
name: "关卡1588",
icon: "bg002",
gold: "58504987608061900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1589: {
key: 1589,
name: "关卡1589",
icon: "bg002",
gold: "59675087360223100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1590: {
key: 1590,
name: "关卡1590",
icon: "bg002",
gold: "608685891074276000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1591: {
key: 1591,
name: "关卡1591",
icon: "bg002",
gold: "62085960889576100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1592: {
key: 1592,
name: "关卡1592",
icon: "bg002",
gold: "63327680107367600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1593: {
key: 1593,
name: "关卡1593",
icon: "bg002",
gold: "64594233709515000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1594: {
key: 1594,
name: "关卡1594",
icon: "bg002",
gold: "65886118383705300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1595: {
key: 1595,
name: "关卡1595",
icon: "bg002",
gold: "67203840751379400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1596: {
key: 1596,
name: "关卡1596",
icon: "bg002",
gold: "68547917566407000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1597: {
key: 1597,
name: "关卡1597",
icon: "bg002",
gold: "69918875917735100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1598: {
key: 1598,
name: "关卡1598",
icon: "bg002",
gold: "71317253436089800000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1599: {
key: 1599,
name: "关卡1599",
icon: "bg002",
gold: "72743598504811600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1600: {
key: 1600,
name: "关卡1600",
icon: "bg002",
gold: "741984704749078000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1601: {
key: 1601,
name: "关卡1601",
icon: "bg002",
gold: "75682439884406000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1602: {
key: 1602,
name: "关卡1602",
icon: "bg002",
gold: "77196088682094100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1603: {
key: 1603,
name: "关卡1603",
icon: "bg002",
gold: "78740010455736000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1604: {
key: 1604,
name: "关卡1604",
icon: "bg002",
gold: "80314810664850700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1605: {
key: 1605,
name: "关卡1605",
icon: "bg002",
gold: "81921106878147700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1606: {
key: 1606,
name: "关卡1606",
icon: "bg002",
gold: "83559529015710700000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1607: {
key: 1607,
name: "关卡1607",
icon: "bg002",
gold: "85230719596024900000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1608: {
key: 1608,
name: "关卡1608",
icon: "bg002",
gold: "86935333987945400000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1609: {
key: 1609,
name: "关卡1609",
icon: "bg002",
gold: "88674040667704300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1610: {
key: 1610,
name: "关卡1610",
icon: "bg002",
gold: "904475214810584000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1611: {
key: 1611,
name: "关卡1611",
icon: "bg002",
gold: "92256471910679600000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1612: {
key: 1612,
name: "关卡1612",
icon: "bg002",
gold: "94101601348893200000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1613: {
key: 1613,
name: "关卡1613",
icon: "bg002",
gold: "95983633375871100000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1614: {
key: 1614,
name: "关卡1614",
icon: "bg002",
gold: "97903306043388500000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1615: {
key: 1615,
name: "关卡1615",
icon: "bg002",
gold: "99861372164256300000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1616: {
key: 1616,
name: "关卡1616",
icon: "bg002",
gold: "101858599607541000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1617: {
key: 1617,
name: "关卡1617",
icon: "bg002",
gold: "103895771599692000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1618: {
key: 1618,
name: "关卡1618",
icon: "bg002",
gold: "105973687031686000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1619: {
key: 1619,
name: "关卡1619",
icon: "bg002",
gold: "108093160772320000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1620: {
key: 1620,
name: "关卡1620",
icon: "bg002",
gold: "1102550239877660000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1621: {
key: 1621,
name: "关卡1621",
icon: "bg002",
gold: "112460124467521000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1622: {
key: 1622,
name: "关卡1622",
icon: "bg002",
gold: "114709326956871000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1623: {
key: 1623,
name: "关卡1623",
icon: "bg002",
gold: "117003513496008000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1624: {
key: 1624,
name: "关卡1624",
icon: "bg002",
gold: "119343583765928000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1625: {
key: 1625,
name: "关卡1625",
icon: "bg002",
gold: "121730455441247000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1626: {
key: 1626,
name: "关卡1626",
icon: "bg002",
gold: "124165064550072000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1627: {
key: 1627,
name: "关卡1627",
icon: "bg002",
gold: "126648365841073000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1628: {
key: 1628,
name: "关卡1628",
icon: "bg002",
gold: "129181333157894000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1629: {
key: 1629,
name: "关卡1629",
icon: "bg002",
gold: "131764959821052000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1630: {
key: 1630,
name: "关卡1630",
icon: "bg002",
gold: "1344002590174730000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1631: {
key: 1631,
name: "关卡1631",
icon: "bg002",
gold: "137088264197822000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1632: {
key: 1632,
name: "关卡1632",
icon: "bg002",
gold: "139830029481778000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1633: {
key: 1633,
name: "关卡1633",
icon: "bg002",
gold: "142626630071414000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1634: {
key: 1634,
name: "关卡1634",
icon: "bg002",
gold: "145479162672842000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1635: {
key: 1635,
name: "关卡1635",
icon: "bg002",
gold: "148388745926299000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1636: {
key: 1636,
name: "关卡1636",
icon: "bg002",
gold: "151356520844825000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1637: {
key: 1637,
name: "关卡1637",
icon: "bg002",
gold: "154383651261722000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1638: {
key: 1638,
name: "关卡1638",
icon: "bg002",
gold: "157471324286956000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1639: {
key: 1639,
name: "关卡1639",
icon: "bg002",
gold: "160620750772695000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1640: {
key: 1640,
name: "关卡1640",
icon: "bg002",
gold: "1638331657881490000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1641: {
key: 1641,
name: "关卡1641",
icon: "bg002",
gold: "167109829103912000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1642: {
key: 1642,
name: "关卡1642",
icon: "bg002",
gold: "170452025685990000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1643: {
key: 1643,
name: "关卡1643",
icon: "bg002",
gold: "173861066199710000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1644: {
key: 1644,
name: "关卡1644",
icon: "bg002",
gold: "177338287523704000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1645: {
key: 1645,
name: "关卡1645",
icon: "bg002",
gold: "180885053274178000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1646: {
key: 1646,
name: "关卡1646",
icon: "bg002",
gold: "184502754339662000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1647: {
key: 1647,
name: "关卡1647",
icon: "bg002",
gold: "188192809426455000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1648: {
key: 1648,
name: "关卡1648",
icon: "bg002",
gold: "191956665614984000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1649: {
key: 1649,
name: "关卡1649",
icon: "bg002",
gold: "195795798927284000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1650: {
key: 1650,
name: "关卡1650",
icon: "bg002",
gold: "1997117149058300000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1651: {
key: 1651,
name: "关卡1651",
icon: "bg002",
gold: "203705949203947000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1652: {
key: 1652,
name: "关卡1652",
icon: "bg002",
gold: "207780068188026000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1653: {
key: 1653,
name: "关卡1653",
icon: "bg002",
gold: "211935669551787000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1654: {
key: 1654,
name: "关卡1654",
icon: "bg002",
gold: "216174382942823000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1655: {
key: 1655,
name: "关卡1655",
icon: "bg002",
gold: "220497870601679000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1656: {
key: 1656,
name: "关卡1656",
icon: "bg002",
gold: "224907828013713000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1657: {
key: 1657,
name: "关卡1657",
icon: "bg002",
gold: "229405984573987000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1658: {
key: 1658,
name: "关卡1658",
icon: "bg002",
gold: "233994104265467000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1659: {
key: 1659,
name: "关卡1659",
icon: "bg002",
gold: "238673986350776000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1660: {
key: 1660,
name: "关卡1660",
icon: "bg002",
gold: "2434474660777920000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1661: {
key: 1661,
name: "关卡1661",
icon: "bg002",
gold: "248316415399348000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1662: {
key: 1662,
name: "关卡1662",
icon: "bg002",
gold: "253282743707335000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1663: {
key: 1663,
name: "关卡1663",
icon: "bg002",
gold: "258348398581482000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1664: {
key: 1664,
name: "关卡1664",
icon: "bg002",
gold: "263515366553112000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1665: {
key: 1665,
name: "关卡1665",
icon: "bg002",
gold: "268785673884174000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1666: {
key: 1666,
name: "关卡1666",
icon: "bg002",
gold: "274161387361858000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1667: {
key: 1667,
name: "关卡1667",
icon: "bg002",
gold: "279644615109095000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1668: {
key: 1668,
name: "关卡1668",
icon: "bg002",
gold: "285237507411277000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1669: {
key: 1669,
name: "关卡1669",
icon: "bg002",
gold: "290942257559503000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1670: {
key: 1670,
name: "关卡1670",
icon: "bg002",
gold: "2967611027106930000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1671: {
key: 1671,
name: "关卡1671",
icon: "bg002",
gold: "302696324764907000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1672: {
key: 1672,
name: "关卡1672",
icon: "bg002",
gold: "308750251260205000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1673: {
key: 1673,
name: "关卡1673",
icon: "bg002",
gold: "314925256285409000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1674: {
key: 1674,
name: "关卡1674",
icon: "bg002",
gold: "321223761411117000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1675: {
key: 1675,
name: "关卡1675",
icon: "bg002",
gold: "327648236639339000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1676: {
key: 1676,
name: "关卡1676",
icon: "bg002",
gold: "334201201372126000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1677: {
key: 1677,
name: "关卡1677",
icon: "bg002",
gold: "340885225399569000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1678: {
key: 1678,
name: "关卡1678",
icon: "bg002",
gold: "347702929907560000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1679: {
key: 1679,
name: "关卡1679",
icon: "bg002",
gold: "354656988505711000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1680: {
key: 1680,
name: "关卡1680",
icon: "bg002",
gold: "3617501282758250000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1681: {
key: 1681,
name: "关卡1681",
icon: "bg002",
gold: "368985130841342000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1682: {
key: 1682,
name: "关卡1682",
icon: "bg002",
gold: "376364833458169000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1683: {
key: 1683,
name: "关卡1683",
icon: "bg002",
gold: "383892130127332000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1684: {
key: 1684,
name: "关卡1684",
icon: "bg002",
gold: "391569972729879000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1685: {
key: 1685,
name: "关卡1685",
icon: "bg002",
gold: "399401372184477000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1686: {
key: 1686,
name: "关卡1686",
icon: "bg002",
gold: "407389399628167000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1687: {
key: 1687,
name: "关卡1687",
icon: "bg002",
gold: "415537187620730000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1688: {
key: 1688,
name: "关卡1688",
icon: "bg002",
gold: "423847931373145000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1689: {
key: 1689,
name: "关卡1689",
icon: "bg002",
gold: "432324890000608000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1690: {
key: 1690,
name: "关卡1690",
icon: "bg002",
gold: "4409713878006200000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1691: {
key: 1691,
name: "关卡1691",
icon: "bg002",
gold: "449790815556632000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1692: {
key: 1692,
name: "关卡1692",
icon: "bg002",
gold: "458786631867765000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1693: {
key: 1693,
name: "关卡1693",
icon: "bg002",
gold: "467962364505120000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1694: {
key: 1694,
name: "关卡1694",
icon: "bg002",
gold: "477321611795222000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1695: {
key: 1695,
name: "关卡1695",
icon: "bg002",
gold: "486868044031127000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1696: {
key: 1696,
name: "关卡1696",
icon: "bg002",
gold: "496605404911750000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1697: {
key: 1697,
name: "关卡1697",
icon: "bg002",
gold: "506537513009985000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1698: {
key: 1698,
name: "关卡1698",
icon: "bg002",
gold: "516668263270185000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1699: {
key: 1699,
name: "关卡1699",
icon: "bg002",
gold: "527001628535589000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1700: {
key: 1700,
name: "关卡1700",
icon: "bg002",
gold: "5375416611063010000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1701: {
key: 1701,
name: "关卡1701",
icon: "bg002",
gold: "548292494328427000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1702: {
key: 1702,
name: "关卡1702",
icon: "bg002",
gold: "559258344214995000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1703: {
key: 1703,
name: "关卡1703",
icon: "bg002",
gold: "570443511099295000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1704: {
key: 1704,
name: "关卡1704",
icon: "bg002",
gold: "581852381321281000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1705: {
key: 1705,
name: "关卡1705",
icon: "bg002",
gold: "593489428947707000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1706: {
key: 1706,
name: "关卡1706",
icon: "bg002",
gold: "605359217526661000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1707: {
key: 1707,
name: "关卡1707",
icon: "bg002",
gold: "617466401877194000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1708: {
key: 1708,
name: "关卡1708",
icon: "bg002",
gold: "629815729914738000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1709: {
key: 1709,
name: "关卡1709",
icon: "bg002",
gold: "642412044513033000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1710: {
key: 1710,
name: "关卡1710",
icon: "bg002",
gold: "6552602854032940000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1711: {
key: 1711,
name: "关卡1711",
icon: "bg002",
gold: "668365491111360000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1712: {
key: 1712,
name: "关卡1712",
icon: "bg002",
gold: "681732800933587000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1713: {
key: 1713,
name: "关卡1713",
icon: "bg002",
gold: "695367456952259000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1714: {
key: 1714,
name: "关卡1714",
icon: "bg002",
gold: "709274806091304000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1715: {
key: 1715,
name: "关卡1715",
icon: "bg002",
gold: "723460302213130000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1716: {
key: 1716,
name: "关卡1716",
icon: "bg002",
gold: "737929508257393000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1717: {
key: 1717,
name: "关卡1717",
icon: "bg002",
gold: "752688098422541000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1718: {
key: 1718,
name: "关卡1718",
icon: "bg002",
gold: "767741860390992000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1719: {
key: 1719,
name: "关卡1719",
icon: "bg002",
gold: "783096697598812000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1720: {
key: 1720,
name: "关卡1720",
icon: "bg002",
gold: "7987586315507880000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1721: {
key: 1721,
name: "关卡1721",
icon: "bg002",
gold: "814733804181804000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1722: {
key: 1722,
name: "关卡1722",
icon: "bg002",
gold: "831028480265440000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1723: {
key: 1723,
name: "关卡1723",
icon: "bg002",
gold: "847649049870749000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1724: {
key: 1724,
name: "关卡1724",
icon: "bg002",
gold: "864602030868164000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1725: {
key: 1725,
name: "关卡1725",
icon: "bg002",
gold: "881894071485527000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1726: {
key: 1726,
name: "关卡1726",
icon: "bg002",
gold: "899531952915238000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1727: {
key: 1727,
name: "关卡1727",
icon: "bg002",
gold: "917522591973543000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1728: {
key: 1728,
name: "关卡1728",
icon: "bg002",
gold: "935873043813014000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1729: {
key: 1729,
name: "关卡1729",
icon: "bg002",
gold: "954590504689274000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1730: {
key: 1730,
name: "关卡1730",
icon: "bg002",
gold: "9736823147830600000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1731: {
key: 1731,
name: "关卡1731",
icon: "bg002",
gold: "993155961078721000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1732: {
key: 1732,
name: "关卡1732",
icon: "bg002",
gold: "1013019080300300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1733: {
key: 1733,
name: "关卡1733",
icon: "bg002",
gold: "1033279461906310000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1734: {
key: 1734,
name: "关卡1734",
icon: "bg002",
gold: "1053945051144440000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1735: {
key: 1735,
name: "关卡1735",
icon: "bg002",
gold: "1075023952167330000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1736: {
key: 1736,
name: "关卡1736",
icon: "bg002",
gold: "1096524431210680000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1737: {
key: 1737,
name: "关卡1737",
icon: "bg002",
gold: "1118454919834890000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1738: {
key: 1738,
name: "关卡1738",
icon: "bg002",
gold: "1140824018231590000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1739: {
key: 1739,
name: "关卡1739",
icon: "bg002",
gold: "1163640498596220000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1740: {
key: 1740,
name: "关卡1740",
icon: "bg002",
gold: "11869133085681400000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1741: {
key: 1741,
name: "关卡1741",
icon: "bg002",
gold: "1210651574739500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1742: {
key: 1742,
name: "关卡1742",
icon: "bg002",
gold: "1234864606234290000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1743: {
key: 1743,
name: "关卡1743",
icon: "bg002",
gold: "1259561898358980000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1744: {
key: 1744,
name: "关卡1744",
icon: "bg002",
gold: "1284753136326160000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1745: {
key: 1745,
name: "关卡1745",
icon: "bg002",
gold: "1310448199052680000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1746: {
key: 1746,
name: "关卡1746",
icon: "bg002",
gold: "1336657163033730000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1747: {
key: 1747,
name: "关卡1747",
icon: "bg002",
gold: "1363390306294400000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1748: {
key: 1748,
name: "关卡1748",
icon: "bg002",
gold: "1390658112420290000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1749: {
key: 1749,
name: "关卡1749",
icon: "bg002",
gold: "1418471274668700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1750: {
key: 1750,
name: "关卡1750",
icon: "bg002",
gold: "14468407001620700000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1751: {
key: 1751,
name: "关卡1751",
icon: "bg002",
gold: "1475777514165310000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1752: {
key: 1752,
name: "关卡1752",
icon: "bg002",
gold: "1505293064448620000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1753: {
key: 1753,
name: "关卡1753",
icon: "bg002",
gold: "1535398925737590000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1754: {
key: 1754,
name: "关卡1754",
icon: "bg002",
gold: "1566106904252340000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1755: {
key: 1755,
name: "关卡1755",
icon: "bg002",
gold: "1597429042337390000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1756: {
key: 1756,
name: "关卡1756",
icon: "bg002",
gold: "1629377623184140000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1757: {
key: 1757,
name: "关卡1757",
icon: "bg002",
gold: "1661965175647820000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1758: {
key: 1758,
name: "关卡1758",
icon: "bg002",
gold: "1695204479160780000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1759: {
key: 1759,
name: "关卡1759",
icon: "bg002",
gold: "1729108568744000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1760: {
key: 1760,
name: "关卡1760",
icon: "bg002",
gold: "17636907401188800000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1761: {
key: 1761,
name: "关卡1761",
icon: "bg002",
gold: "1798964554921260000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1762: {
key: 1762,
name: "关卡1762",
icon: "bg002",
gold: "1834943846019690000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1763: {
key: 1763,
name: "关卡1763",
icon: "bg002",
gold: "1871642722940080000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1764: {
key: 1764,
name: "关卡1764",
icon: "bg002",
gold: "1909075577398880000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1765: {
key: 1765,
name: "关卡1765",
icon: "bg002",
gold: "1947257088946860000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1766: {
key: 1766,
name: "关卡1766",
icon: "bg002",
gold: "1986202230725800000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1767: {
key: 1767,
name: "关卡1767",
icon: "bg002",
gold: "2025926275340320000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1768: {
key: 1768,
name: "关卡1768",
icon: "bg002",
gold: "2066444800847130000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1769: {
key: 1769,
name: "关卡1769",
icon: "bg002",
gold: "2107773696864070000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1770: {
key: 1770,
name: "关卡1770",
icon: "bg002",
gold: "21499291708013500000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1771: {
key: 1771,
name: "关卡1771",
icon: "bg002",
gold: "2192927754217380000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1772: {
key: 1772,
name: "关卡1772",
icon: "bg002",
gold: "2236786309301730000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1773: {
key: 1773,
name: "关卡1773",
icon: "bg002",
gold: "2281522035487770000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1774: {
key: 1774,
name: "关卡1774",
icon: "bg002",
gold: "2327152476197530000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1775: {
key: 1775,
name: "关卡1775",
icon: "bg002",
gold: "2373695525721480000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1776: {
key: 1776,
name: "关卡1776",
icon: "bg002",
gold: "2421169436235910000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1777: {
key: 1777,
name: "关卡1777",
icon: "bg002",
gold: "2469592824960630000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1778: {
key: 1778,
name: "关卡1778",
icon: "bg002",
gold: "2518984681459840000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1779: {
key: 1779,
name: "关卡1779",
icon: "bg002",
gold: "2569364375089040000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1780: {
key: 1780,
name: "关卡1780",
icon: "bg002",
gold: "26207516625908200000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1781: {
key: 1781,
name: "关卡1781",
icon: "bg002",
gold: "2673166695842640000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1782: {
key: 1782,
name: "关卡1782",
icon: "bg002",
gold: "2726630029759490000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1783: {
key: 1783,
name: "关卡1783",
icon: "bg002",
gold: "2781162630354680000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1784: {
key: 1784,
name: "关卡1784",
icon: "bg002",
gold: "2836785882961770000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1785: {
key: 1785,
name: "关卡1785",
icon: "bg002",
gold: "2893521600621010000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1786: {
key: 1786,
name: "关卡1786",
icon: "bg002",
gold: "2951392032633430000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1787: {
key: 1787,
name: "关卡1787",
icon: "bg002",
gold: "3010419873286100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1788: {
key: 1788,
name: "关卡1788",
icon: "bg002",
gold: "3070628270751820000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1789: {
key: 1789,
name: "关卡1789",
icon: "bg002",
gold: "3132040836166860000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1790: {
key: 1790,
name: "关卡1790",
icon: "bg002",
gold: "31946816528902000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1791: {
key: 1791,
name: "关卡1791",
icon: "bg002",
gold: "3258575285948000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1792: {
key: 1792,
name: "关卡1792",
icon: "bg002",
gold: "3323746791666960000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1793: {
key: 1793,
name: "关卡1793",
icon: "bg002",
gold: "3390221727500300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1794: {
key: 1794,
name: "关卡1794",
icon: "bg002",
gold: "3458026162050310000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1795: {
key: 1795,
name: "关卡1795",
icon: "bg002",
gold: "3527186685291320000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1796: {
key: 1796,
name: "关卡1796",
icon: "bg002",
gold: "3597730418997150000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1797: {
key: 1797,
name: "关卡1797",
icon: "bg002",
gold: "3669685027377090000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1798: {
key: 1798,
name: "关卡1798",
icon: "bg002",
gold: "3743078727924630000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1799: {
key: 1799,
name: "关卡1799",
icon: "bg002",
gold: "3817940302483120000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1800: {
key: 1800,
name: "关卡1800",
icon: "bg002",
gold: "38942991085327800000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1801: {
key: 1801,
name: "关卡1801",
icon: "bg002",
gold: "3972185090703440000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1802: {
key: 1802,
name: "关卡1802",
icon: "bg002",
gold: "4051628792517510000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1803: {
key: 1803,
name: "关卡1803",
icon: "bg002",
gold: "4132661368367860000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1804: {
key: 1804,
name: "关卡1804",
icon: "bg002",
gold: "4215314595735220000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1805: {
key: 1805,
name: "关卡1805",
icon: "bg002",
gold: "4299620887649930000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1806: {
key: 1806,
name: "关卡1806",
icon: "bg002",
gold: "4385613305402930000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1807: {
key: 1807,
name: "关卡1807",
icon: "bg002",
gold: "4473325571510990000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1808: {
key: 1808,
name: "关卡1808",
icon: "bg002",
gold: "4562792082941210000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1809: {
key: 1809,
name: "关卡1809",
icon: "bg002",
gold: "4654047924600030000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1810: {
key: 1810,
name: "关卡1810",
icon: "bg002",
gold: "47471288830920300000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1811: {
key: 1811,
name: "关卡1811",
icon: "bg002",
gold: "4842071460753870000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1812: {
key: 1812,
name: "关卡1812",
icon: "bg002",
gold: "4938912889968950000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1813: {
key: 1813,
name: "关卡1813",
icon: "bg002",
gold: "5037691147768330000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1814: {
key: 1814,
name: "关卡1814",
icon: "bg002",
gold: "5138444970723700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1815: {
key: 1815,
name: "关卡1815",
icon: "bg002",
gold: "5241213870138170000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1816: {
key: 1816,
name: "关卡1816",
icon: "bg002",
gold: "5346038147540930000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1817: {
key: 1817,
name: "关卡1817",
icon: "bg002",
gold: "5452958910491750000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1818: {
key: 1818,
name: "关卡1818",
icon: "bg002",
gold: "5562018088701590000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1819: {
key: 1819,
name: "关卡1819",
icon: "bg002",
gold: "5673258450475620000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1820: {
key: 1820,
name: "关卡1820",
icon: "bg002",
gold: "57867236194851300000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1821: {
key: 1821,
name: "关卡1821",
icon: "bg002",
gold: "5902458091874830000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1822: {
key: 1822,
name: "关卡1822",
icon: "bg002",
gold: "6020507253712330000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1823: {
key: 1823,
name: "关卡1823",
icon: "bg002",
gold: "6140917398786580000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1824: {
key: 1824,
name: "关卡1824",
icon: "bg002",
gold: "6263735746762310000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1825: {
key: 1825,
name: "关卡1825",
icon: "bg002",
gold: "6389010461697560000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1826: {
key: 1826,
name: "关卡1826",
icon: "bg002",
gold: "6516790670931510000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1827: {
key: 1827,
name: "关卡1827",
icon: "bg002",
gold: "6647126484350140000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1828: {
key: 1828,
name: "关卡1828",
icon: "bg002",
gold: "6780069014037140000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1829: {
key: 1829,
name: "关卡1829",
icon: "bg002",
gold: "6915670394317880000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1830: {
key: 1830,
name: "关卡1830",
icon: "bg002",
gold: "70539838022042400000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1831: {
key: 1831,
name: "关卡1831",
icon: "bg002",
gold: "7195063478248330000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1832: {
key: 1832,
name: "关卡1832",
icon: "bg002",
gold: "7338964747813300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1833: {
key: 1833,
name: "关卡1833",
icon: "bg002",
gold: "7485744042769570000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1834: {
key: 1834,
name: "关卡1834",
icon: "bg002",
gold: "7635458923624960000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1835: {
key: 1835,
name: "关卡1835",
icon: "bg002",
gold: "7788168102097460000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1836: {
key: 1836,
name: "关卡1836",
icon: "bg002",
gold: "7943931464139410000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1837: {
key: 1837,
name: "关卡1837",
icon: "bg002",
gold: "8102810093422200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1838: {
key: 1838,
name: "关卡1838",
icon: "bg002",
gold: "8264866295290650000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1839: {
key: 1839,
name: "关卡1839",
icon: "bg002",
gold: "8430163621196470000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1840: {
key: 1840,
name: "关卡1840",
icon: "bg002",
gold: "85987668936204000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1841: {
key: 1841,
name: "关卡1841",
icon: "bg002",
gold: "8770742231492810000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1842: {
key: 1842,
name: "关卡1842",
icon: "bg002",
gold: "8946157076122670000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1843: {
key: 1843,
name: "关卡1843",
icon: "bg002",
gold: "9125080217645130000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1844: {
key: 1844,
name: "关卡1844",
icon: "bg002",
gold: "9307581821998030000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1845: {
key: 1845,
name: "关卡1845",
icon: "bg002",
gold: "9493733458437990000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1846: {
key: 1846,
name: "关卡1846",
icon: "bg002",
gold: "9683608127606750000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1847: {
key: 1847,
name: "关卡1847",
icon: "bg002",
gold: "9877280290158880000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1848: {
key: 1848,
name: "关卡1848",
icon: "bg002",
gold: "10074825895962100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1849: {
key: 1849,
name: "关卡1849",
icon: "bg002",
gold: "10276322413881300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1850: {
key: 1850,
name: "关卡1850",
icon: "bg002",
gold: "104818488621589000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1851: {
key: 1851,
name: "关卡1851",
icon: "bg002",
gold: "10691485839402100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1852: {
key: 1852,
name: "关卡1852",
icon: "bg002",
gold: "10905315556190100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1853: {
key: 1853,
name: "关卡1853",
icon: "bg002",
gold: "11123421867313900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1854: {
key: 1854,
name: "关卡1854",
icon: "bg002",
gold: "11345890304660200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1855: {
key: 1855,
name: "关卡1855",
icon: "bg002",
gold: "11572808110753400000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1856: {
key: 1856,
name: "关卡1856",
icon: "bg002",
gold: "11804264272968500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1857: {
key: 1857,
name: "关卡1857",
icon: "bg002",
gold: "12040349558427900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1858: {
key: 1858,
name: "关卡1858",
icon: "bg002",
gold: "12281156549596500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1859: {
key: 1859,
name: "关卡1859",
icon: "bg002",
gold: "12526779680588400000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1860: {
key: 1860,
name: "关卡1860",
icon: "bg002",
gold: "127773152742002000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1861: {
key: 1861,
name: "关卡1861",
icon: "bg002",
gold: "13032861579684200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1862: {
key: 1862,
name: "关卡1862",
icon: "bg002",
gold: "13293518811277900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1863: {
key: 1863,
name: "关卡1863",
icon: "bg002",
gold: "13559389187503500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1864: {
key: 1864,
name: "关卡1864",
icon: "bg002",
gold: "13830576971253600000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1865: {
key: 1865,
name: "关卡1865",
icon: "bg002",
gold: "14107188510678700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1866: {
key: 1866,
name: "关卡1866",
icon: "bg002",
gold: "14389332280892300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1867: {
key: 1867,
name: "关卡1867",
icon: "bg002",
gold: "14677118926510100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1868: {
key: 1868,
name: "关卡1868",
icon: "bg002",
gold: "14970661305040300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1869: {
key: 1869,
name: "关卡1869",
icon: "bg002",
gold: "15270074531141100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1870: {
key: 1870,
name: "关卡1870",
icon: "bg002",
gold: "155754760217639000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1871: {
key: 1871,
name: "关卡1871",
icon: "bg002",
gold: "15886985542199200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1872: {
key: 1872,
name: "关卡1872",
icon: "bg002",
gold: "16204725253043200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1873: {
key: 1873,
name: "关卡1873",
icon: "bg002",
gold: "16528819758104100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1874: {
key: 1874,
name: "关卡1874",
icon: "bg002",
gold: "16859396153266200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1875: {
key: 1875,
name: "关卡1875",
icon: "bg002",
gold: "17196584076331500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1876: {
key: 1876,
name: "关卡1876",
icon: "bg002",
gold: "17540515757858100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1877: {
key: 1877,
name: "关卡1877",
icon: "bg002",
gold: "17891326073015300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1878: {
key: 1878,
name: "关卡1878",
icon: "bg002",
gold: "18249152594475600000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1879: {
key: 1879,
name: "关卡1879",
icon: "bg002",
gold: "18614135646365100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1880: {
key: 1880,
name: "关卡1880",
icon: "bg002",
gold: "189864183592924000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1881: {
key: 1881,
name: "关卡1881",
icon: "bg002",
gold: "19366146726478300000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1882: {
key: 1882,
name: "关卡1882",
icon: "bg002",
gold: "19753469661007900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1883: {
key: 1883,
name: "关卡1883",
icon: "bg002",
gold: "20148539054228100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1884: {
key: 1884,
name: "关卡1884",
icon: "bg002",
gold: "20551509835312700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1885: {
key: 1885,
name: "关卡1885",
icon: "bg002",
gold: "20962540032019000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1886: {
key: 1886,
name: "关卡1886",
icon: "bg002",
gold: "21381790832659400000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1887: {
key: 1887,
name: "关卡1887",
icon: "bg002",
gold: "21809426649312600000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1888: {
key: 1888,
name: "关卡1888",
icon: "bg002",
gold: "22245615182298900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1889: {
key: 1889,
name: "关卡1889",
icon: "bg002",
gold: "22690527485944900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1890: {
key: 1890,
name: "关卡1890",
icon: "bg002",
gold: "231443380356638000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1891: {
key: 1891,
name: "关卡1891",
icon: "bg002",
gold: "23607224796377100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1892: {
key: 1892,
name: "关卡1892",
icon: "bg002",
gold: "24079369292304600000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1893: {
key: 1893,
name: "关卡1893",
icon: "bg002",
gold: "24560956678150700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1894: {
key: 1894,
name: "关卡1894",
icon: "bg002",
gold: "25052175811713700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1895: {
key: 1895,
name: "关卡1895",
icon: "bg002",
gold: "25553219327948000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1896: {
key: 1896,
name: "关卡1896",
icon: "bg002",
gold: "26064283714507000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1897: {
key: 1897,
name: "关卡1897",
icon: "bg002",
gold: "26585569388797100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1898: {
key: 1898,
name: "关卡1898",
icon: "bg002",
gold: "27117280776573000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1899: {
key: 1899,
name: "关卡1899",
icon: "bg002",
gold: "27659626392104500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1900: {
key: 1900,
name: "关卡1900",
icon: "bg002",
gold: "282128189199466000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1901: {
key: 1901,
name: "关卡1901",
icon: "bg002",
gold: "33855382703935900000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1902: {
key: 1902,
name: "关卡1902",
icon: "bg002",
gold: "40626459244723100000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1903: {
key: 1903,
name: "关卡1903",
icon: "bg002",
gold: "48751751093667700000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1904: {
key: 1904,
name: "关卡1904",
icon: "bg002",
gold: "58502101312401200000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1905: {
key: 1905,
name: "关卡1905",
icon: "bg002",
gold: "70202521574881500000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1906: {
key: 1906,
name: "关卡1906",
icon: "bg002",
gold: "84243025889857800000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1907: {
key: 1907,
name: "关卡1907",
icon: "bg002",
gold: "101091631067829000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1908: {
key: 1908,
name: "关卡1908",
icon: "bg002",
gold: "121309957281395000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1909: {
key: 1909,
name: "关卡1909",
icon: "bg002",
gold: "145571948737674000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1910: {
key: 1910,
name: "关卡1910",
icon: "bg002",
gold: "1746863384852090000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1911: {
key: 1911,
name: "关卡1911",
icon: "bg002",
gold: "209623606182251000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1912: {
key: 1912,
name: "关卡1912",
icon: "bg002",
gold: "251548327418701000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1913: {
key: 1913,
name: "关卡1913",
icon: "bg002",
gold: "301857992902441000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1914: {
key: 1914,
name: "关卡1914",
icon: "bg002",
gold: "362229591482929000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1915: {
key: 1915,
name: "关卡1915",
icon: "bg002",
gold: "434675509779515000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1916: {
key: 1916,
name: "关卡1916",
icon: "bg002",
gold: "521610611735418000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1917: {
key: 1917,
name: "关卡1917",
icon: "bg002",
gold: "625932734082502000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1918: {
key: 1918,
name: "关卡1918",
icon: "bg002",
gold: "751119280899002000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1919: {
key: 1919,
name: "关卡1919",
icon: "bg002",
gold: "901343137078802000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1920: {
key: 1920,
name: "关卡1920",
icon: "bg002",
gold: "10816117644945600000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1921: {
key: 1921,
name: "关卡1921",
icon: "bg002",
gold: "1297934117393470000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1922: {
key: 1922,
name: "关卡1922",
icon: "bg002",
gold: "1557520940872160000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1923: {
key: 1923,
name: "关卡1923",
icon: "bg002",
gold: "1869025129046590000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1924: {
key: 1924,
name: "关卡1924",
icon: "bg002",
gold: "2242830154855910000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1925: {
key: 1925,
name: "关卡1925",
icon: "bg002",
gold: "2691396185827090000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1926: {
key: 1926,
name: "关卡1926",
icon: "bg002",
gold: "3229675422992510000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1927: {
key: 1927,
name: "关卡1927",
icon: "bg002",
gold: "3875610507591010000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1928: {
key: 1928,
name: "关卡1928",
icon: "bg002",
gold: "4650732609109210000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1929: {
key: 1929,
name: "关卡1929",
icon: "bg002",
gold: "5580879130931050000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1930: {
key: 1930,
name: "关卡1930",
icon: "bg002",
gold: "66970549571172600000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1931: {
key: 1931,
name: "关卡1931",
icon: "bg002",
gold: "8036465948540710000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1932: {
key: 1932,
name: "关卡1932",
icon: "bg002",
gold: "9643759138248850000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1933: {
key: 1933,
name: "关卡1933",
icon: "bg002",
gold: "11572510965898600000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1934: {
key: 1934,
name: "关卡1934",
icon: "bg002",
gold: "13887013159078300000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1935: {
key: 1935,
name: "关卡1935",
icon: "bg002",
gold: "16664415790894000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1936: {
key: 1936,
name: "关卡1936",
icon: "bg002",
gold: "19997298949072800000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1937: {
key: 1937,
name: "关卡1937",
icon: "bg002",
gold: "23996758738887400000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1938: {
key: 1938,
name: "关卡1938",
icon: "bg002",
gold: "28796110486664900000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1939: {
key: 1939,
name: "关卡1939",
icon: "bg002",
gold: "34555332583997900000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1940: {
key: 1940,
name: "关卡1940",
icon: "bg002",
gold: "414663991007975000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1941: {
key: 1941,
name: "关卡1941",
icon: "bg002",
gold: "49759678920957000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1942: {
key: 1942,
name: "关卡1942",
icon: "bg002",
gold: "59711614705148400000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1943: {
key: 1943,
name: "关卡1943",
icon: "bg002",
gold: "71653937646178100000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1944: {
key: 1944,
name: "关卡1944",
icon: "bg002",
gold: "85984725175413700000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1945: {
key: 1945,
name: "关卡1945",
icon: "bg002",
gold: "103181670210496000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1946: {
key: 1946,
name: "关卡1946",
icon: "bg002",
gold: "123818004252595000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1947: {
key: 1947,
name: "关卡1947",
icon: "bg002",
gold: "148581605103114000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1948: {
key: 1948,
name: "关卡1948",
icon: "bg002",
gold: "178297926123737000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1949: {
key: 1949,
name: "关卡1949",
icon: "bg002",
gold: "213957511348484000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
1950: {
key: 1950,
name: "关卡1950",
icon: "bg002",
gold: "2567490136181810000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
},
1951: {
key: 1951,
name: "关卡1951",
icon: "bg002",
gold: "308098816341817000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball001",
chance: 50,
hint: 0
},
1952: {
key: 1952,
name: "关卡1952",
icon: "bg002",
gold: "369718579610180000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball002",
chance: 50,
hint: 0
},
1953: {
key: 1953,
name: "关卡1953",
icon: "bg002",
gold: "443662295532216000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball003",
chance: 50,
hint: 0
},
1954: {
key: 1954,
name: "关卡1954",
icon: "bg002",
gold: "532394754638659000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball004",
chance: 50,
hint: 0
},
1955: {
key: 1955,
name: "关卡1955",
icon: "bg002",
gold: "638873705566391000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball005",
chance: 50,
hint: 0
},
1956: {
key: 1956,
name: "关卡1956",
icon: "bg002",
gold: "766648446679669000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball006",
chance: 50,
hint: 0
},
1957: {
key: 1957,
name: "关卡1957",
icon: "bg002",
gold: "919978136015603000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball007",
chance: 50,
hint: 0
},
1958: {
key: 1958,
name: "关卡1958",
icon: "bg002",
gold: "1103973763218720000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball008",
chance: 50,
hint: 0
},
1959: {
key: 1959,
name: "关卡1959",
icon: "bg002",
gold: "1324768515862460000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball009",
chance: 50,
hint: 0
},
1960: {
key: 1960,
name: "关卡1960",
icon: "bg002",
gold: "15897222190349500000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball010",
chance: 0,
hint: 0
},
1961: {
key: 1961,
name: "关卡1961",
icon: "bg002",
gold: "1907666662841940000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball011",
chance: 50,
hint: 0
},
1962: {
key: 1962,
name: "关卡1962",
icon: "bg002",
gold: "2289199995410330000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball012",
chance: 50,
hint: 0
},
1963: {
key: 1963,
name: "关卡1963",
icon: "bg002",
gold: "2747039994492400000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball013",
chance: 50,
hint: 0
},
1964: {
key: 1964,
name: "关卡1964",
icon: "bg002",
gold: "3296447993390880000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball014",
chance: 50,
hint: 0
},
1965: {
key: 1965,
name: "关卡1965",
icon: "bg002",
gold: "3955737592069060000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball015",
chance: 50,
hint: 0
},
1966: {
key: 1966,
name: "关卡1966",
icon: "bg002",
gold: "4746885110482870000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball016",
chance: 50,
hint: 0
},
1967: {
key: 1967,
name: "关卡1967",
icon: "bg002",
gold: "5696262132579440000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball017",
chance: 50,
hint: 0
},
1968: {
key: 1968,
name: "关卡1968",
icon: "bg002",
gold: "6835514559095330000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball018",
chance: 50,
hint: 0
},
1969: {
key: 1969,
name: "关卡1969",
icon: "bg002",
gold: "8202617470914400000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball019",
chance: 50,
hint: 0
},
1970: {
key: 1970,
name: "关卡1970",
icon: "bg002",
gold: "98431409650972800000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball020",
chance: 0,
hint: 0
},
1971: {
key: 1971,
name: "关卡1971",
icon: "bg002",
gold: "11811769158116700000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball021",
chance: 50,
hint: 0
},
1972: {
key: 1972,
name: "关卡1972",
icon: "bg002",
gold: "14174122989740000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball022",
chance: 50,
hint: 0
},
1973: {
key: 1973,
name: "关卡1973",
icon: "bg002",
gold: "17008947587688000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball023",
chance: 50,
hint: 0
},
1974: {
key: 1974,
name: "关卡1974",
icon: "bg002",
gold: "20410737105225600000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball024",
chance: 50,
hint: 0
},
1975: {
key: 1975,
name: "关卡1975",
icon: "bg002",
gold: "24492884526270700000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball025",
chance: 50,
hint: 0
},
1976: {
key: 1976,
name: "关卡1976",
icon: "bg002",
gold: "29391461431524800000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball026",
chance: 50,
hint: 0
},
1977: {
key: 1977,
name: "关卡1977",
icon: "bg002",
gold: "35269753717829800000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball027",
chance: 50,
hint: 0
},
1978: {
key: 1978,
name: "关卡1978",
icon: "bg002",
gold: "42323704461395800000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball028",
chance: 50,
hint: 0
},
1979: {
key: 1979,
name: "关卡1979",
icon: "bg002",
gold: "50788445353675000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball029",
chance: 50,
hint: 0
},
1980: {
key: 1980,
name: "关卡1980",
icon: "bg002",
gold: "609461344244100000000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball030",
chance: 0,
hint: 0
},
1981: {
key: 1981,
name: "关卡1981",
icon: "bg002",
gold: "73135361309292000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball031",
chance: 50,
hint: 0
},
1982: {
key: 1982,
name: "关卡1982",
icon: "bg002",
gold: "109703041963938000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball032",
chance: 50,
hint: 0
},
1983: {
key: 1983,
name: "关卡1983",
icon: "bg002",
gold: "219406083927876000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball033",
chance: 50,
hint: 0
},
1984: {
key: 1984,
name: "关卡1984",
icon: "bg002",
gold: "658218251783628000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball034",
chance: 50,
hint: 0
},
1985: {
key: 1985,
name: "关卡1985",
icon: "bg002",
gold: "2632873007134510000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball035",
chance: 50,
hint: 0
},
1986: {
key: 1986,
name: "关卡1986",
icon: "bg002",
gold: "13164365035672600000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball036",
chance: 50,
hint: 0
},
1987: {
key: 1987,
name: "关卡1987",
icon: "bg002",
gold: "78986190214035600000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball037",
chance: 50,
hint: 0
},
1988: {
key: 1988,
name: "关卡1988",
icon: "bg002",
gold: "552903331498249000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball038",
chance: 50,
hint: 0
},
1989: {
key: 1989,
name: "关卡1989",
icon: "bg002",
gold: "4423226651985990000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball039",
chance: 50,
hint: 0
},
1990: {
key: 1990,
name: "关卡1990",
icon: "bg002",
gold: "398090398678739000000000000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball040",
chance: 0,
hint: 0
},
1991: {
key: 1991,
name: "关卡1991",
icon: "bg002",
gold: "398090398678739000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball041",
chance: 50,
hint: 0
},
1992: {
key: 1992,
name: "关卡1992",
icon: "bg002",
gold: "7961807973574780000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball042",
chance: 50,
hint: 0
},
1993: {
key: 1993,
name: "关卡1993",
icon: "bg002",
gold: "238854239207243000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball043",
chance: 50,
hint: 0
},
1994: {
key: 1994,
name: "关卡1994",
icon: "bg002",
gold: "9554169568289720000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball044",
chance: 50,
hint: 0
},
1995: {
key: 1995,
name: "关卡1995",
icon: "bg002",
gold: "477708478414486000000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball045",
chance: 50,
hint: 0
},
1996: {
key: 1996,
name: "关卡1996",
icon: "bg002",
gold: "28662508704869200000000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball046",
chance: 50,
hint: 0
},
1997: {
key: 1997,
name: "关卡1997",
icon: "bg002",
gold: "2006375609340840000000000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball047",
chance: 50,
hint: 0
},
1998: {
key: 1998,
name: "关卡1998",
icon: "bg002",
gold: "160510048747267000000000000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball048",
chance: 50,
hint: 0
},
1999: {
key: 1999,
name: "关卡1999",
icon: "bg002",
gold: "14445904387254000000000000000000000000000000000000000000000000",
rate: 9,
rate2: 1,
ball_icon: "ball049",
chance: 50,
hint: 0
},
2e3: {
key: 2e3,
name: "关卡2000",
icon: "bg002",
gold: "14445904387254000000000000000000000000000000000000000000000000000",
rate: 1,
rate2: 0,
ball_icon: "ball050",
chance: 0,
hint: 0
}
};
cc._RF.pop();
}, {} ],
task: [ function(e, a) {
"use strict";
cc._RF.push(a, "54ed2npqGtJCYCS0xktcxOF", "task");
cc.Class({
extends: cc.Component,
properties: {
item: cc.Prefab,
content: cc.Node,
scrollView: cc.ScrollView,
toggle1: cc.Toggle,
_type: ""
},
start: function() {},
init: function(e, a) {
cc.engine.log(JSON.stringify(e));
this.content.removeAllChildren();
for (var n = 1; n <= Object.keys(e).length; ++n) {
var c = cc.instantiate(this.item);
c.getComponent("item").init(e[n], a, this);
this.content.addChild(c);
c.getComponent("item").refreshState(e[n].end);
}
},
mission: function() {
var e = this;
if ("mission" != this._type) {
this._type = "mission";
cc.engine.platform.mission("0", function() {
e.scrollView.scrollToTop(0);
e.init(cc.engine.mission, "task");
});
}
},
achievement: function() {
var e = this;
if ("achievement" != this._type) {
this._type = "achievement";
cc.engine.platform.achievement("0", function() {
e.scrollView.scrollToTop(0);
e.init(cc.engine.achievement, "achieve");
});
}
},
close: function() {
this._type = "";
this.node.active = !1;
cc.engine.platform.hideBanner();
}
});
cc._RF.pop();
}, {} ],
tianjiang: [ function(e, a) {
"use strict";
cc._RF.push(a, "1e525pRJVZNgbolh8X1JHMZ", "tianjiang");
var n = [ cc.v2(-282.813, 990.187), cc.v2(-171.383, 1057.564), cc.v2(-50.263, 1029.256) ];
cc.Class({
extends: cc.Component,
properties: {
type: 0,
openredPop: cc.Prefab,
redSp: [ cc.SpriteFrame ],
isShow: !1
},
onLoad: function() {
this.node.on("touchend", this.click, this);
this.refresh();
},
start: function() {},
click: function() {
var e = this;
if (this.isShow) if (this.node.getComponent("cc.Sprite").spriteFrame == this.redSp[0]) cc.engine.platform.getRed(cc.engine.config.redType.luck, function() {
var a = cc.instantiate(e.openredPop);
a.getComponent("openRedPop").init(cc.engine.config.redType.luck, void 0, e);
a.parent = cc.engine.gameCtl.node;
}); else {
cc.engine.platform.showWebView();
this.refresh();
}
},
refresh: function() {
if (cc.engine.gameCtl._tianjiangRed >= 3) {
cc.engine.gameCtl._openGameTime = 0;
cc.engine.gameCtl.isShowLuck = !1;
}
cc.engine.gameCtl._tianjiangRed -= 1;
cc.engine.gameCtl._tianjiangRed <= 0 && (cc.engine.gameCtl._tianjiangRed = 0);
this.isShow = !1;
this.node.getComponent("cc.Animation").stop();
this.node.position = n[this.type];
this.node.getComponent("cc.Sprite").spriteFrame = this.redSp[cc.engine.gameModel.random(0, this.redSp.length - 1)];
}
});
cc._RF.pop();
}, {} ],
toast: [ function(e, a) {
"use strict";
cc._RF.push(a, "2de49Sn7qFKTaezySbbg53H", "toast");
cc.Class({
extends: cc.Component,
properties: {
toast1: cc.Label,
toast2: cc.Label,
closeBtn: cc.Node
},
start: function() {},
showToast: function(e) {
var a = this;
if (100 * Math.random() < Number(cc.engine.natWeight)) {
this.closeBtn.active = !1;
this.node.getChildByName("shape1").active = !0;
this.toast1.string = e;
cc.engine.platform.showNativeBanner();
this.scheduleOnce(function() {
a.closeBtn.active = !0;
}, 3);
} else {
this.node.getChildByName("shape2").active = !0;
this.node.getChildByName("shape2").position = cc.v2(0, 0);
this.toast2.string = e;
this.toast2._forceUpdateRenderData();
this.node.getChildByName("shape2").width = this.toast2.node.width + 50;
this.node.getChildByName("shape2").height = this.toast2.node.height + 10;
cc.tween(this.node.getChildByName("shape2")).to(.1, {
position: cc.v2(0, 100)
}, {
easing: "bounceInOut"
}).delay(1.9).call(function() {
a.node.getChildByName("shape2").active = !1;
a.node.getChildByName("shape2").position = cc.v2(0, 0);
}).start();
}
},
close: function() {
this.node.getChildByName("shape1").active = !1;
cc.engine.platform.hideNativeBanner();
}
});
cc._RF.pop();
}, {} ],
toggleItem: [ function(e, a) {
"use strict";
cc._RF.push(a, "33dbdNuVPtIy7fYpC6GAEtX", "toggleItem");
cc.Class({
extends: cc.Component,
properties: {
id: 0
},
start: function() {}
});
cc._RF.pop();
}, {} ],
turnTable: [ function(e, a) {
"use strict";
cc._RF.push(a, "676260NMH1PEKw9kwICMlEE", "turnTable");
cc.Class({
extends: cc.Component,
properties: {
spinBtn: {
default: null,
type: cc.Node,
tooltip: "开始旋转按钮"
},
wheelSp: {
type: cc.Sprite,
default: null,
tooltip: "旋转精灵"
},
maxSpeed: {
type: cc.Float,
default: 3,
max: 10,
min: 2,
tooltip: "速度"
},
duration: {
type: cc.Float,
default: 3,
max: 5,
min: 1,
tooltip: "减速前旋转时间"
},
acc: {
type: cc.Float,
default: .1,
max: .2,
min: .01,
tooltip: "加速度"
},
targetID: {
type: cc.Integer,
default: 0,
max: 17,
min: 0,
tooltip: "指定结束时的齿轮"
},
springback: {
default: !1,
tooltip: "旋转结束是否回弹"
},
effectAudio: {
default: null,
url: cc.AudioClip
},
rewards: {
type: cc.Node,
default: null,
tooltip: "奖励"
},
decks: {
type: cc.Node,
default: null,
tooltip: "装饰"
},
count: {
type: cc.Label,
default: null,
tooltip: "次数"
},
time: {
type: cc.Label,
default: null,
tooltip: "倒计时"
},
rewardsItem: [ cc.SpriteFrame ],
rewardsTip: [ cc.SpriteFrame ],
_isDouble: !1,
_doubleCount: 1,
_turnCount: 10
},
onLoad: function() {
var e = this;
cc.log("....onload");
this.wheelState = 0;
this.curSpeed = 0;
this.spinTime = 0;
this.gearNum = 6;
this.defaultAngle = 0;
this.gearAngle = 360 / this.gearNum;
this.wheelSp.node.angle = -this.defaultAngle;
this.finalAngle = 0;
this.effectFlag = 0;
this.refreshAngle();
this.count.string = this._turnCount;
this.spinBtn.on(cc.Node.EventType.TOUCH_END, function() {
cc.log("begin spin");
if (0 === e.wheelState) if (e._turnCount <= 0) {
e._turnCount = 0;
cc.engine.Toast.showToast("暂无抽奖次数");
} else {
var a = function(a) {
e._turnCount--;
e.count.string = e._turnCount;
e.targetID = a - 1;
e.caculateFinalAngle();
e.decAngle = 720;
e.wheelState = 1;
e.curSpeed = 0;
e.spinTime = 0;
cc.engine.turntable[a].name;
};
e._turnCount > 0 && e._turnCount <= 7 ? cc.engine.platform.showVideoAd(function(e) {
e && cc.engine.platform.getRed(cc.engine.config.redType.turn, a);
}) : e._turnCount > 7 && cc.engine.platform.getRed(cc.engine.config.redType.turn, a);
} else cc.engine.Toast.showToast("请等待转盘停止");
});
},
init: function(e) {
var a = this;
cc.engine.log(Object.keys(cc.engine.turntable).length);
Object.keys(cc.engine.turntable).forEach(function(e, n) {
cc.engine.log(cc.engine.turntable[e].name);
var c = 0, l = 0;
switch (cc.engine.turntable[e].name) {
case "红包(小)":
break;

case "红包(中)":
l = 1;
break;

case "红包(大)":
l = 2;
break;

case "少量金币":
c = 1;
l = 3;
break;

case "中量金币":
c = 2;
l = 4;
break;

case "大量金币":
c = 3;
l = 5;
}
a.rewards.children[n].getComponent("cc.Sprite").spriteFrame = a.rewardsItem[c];
a.rewards.children[n].getChildByName("tip").getComponent("cc.Sprite").spriteFrame = l < 3 ? a.rewardsTip[l] : null;
});
this._turnCount = e;
this.count.string = this._turnCount;
},
refreshAngle: function() {
for (var e = 0; e < this.rewards.children.length; ++e) this.rewards.children[e].angle = -this.wheelSp.node.angle;
},
closeBtn: function() {
if (0 === this.wheelState) {
this.node.active = !1;
cc.engine.platform.hideBanner();
cc.engine.gameCtl.initGuide();
}
},
getTargetID: function() {
for (var e = cc.engine.config.turnWeight, a = cc.engine.gameModel.random(1, 1e4), n = 0; n < e.length; ++n) if (a <= e[n]) {
this.targetID = n;
break;
}
},
start: function() {},
caculateFinalAngle: function() {
this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle;
this.springback && (this.finalAngle += this.gearAngle);
},
update: function(e) {
if (0 !== this.wheelState) if (1 == this.wheelState) {
this.spinTime += e;
if (this.curSpeed < this.maxSpeed) {
this.wheelSp.node.angle -= this.curSpeed;
this.refreshAngle();
this.curSpeed += this.acc;
} else {
this.curSpeed = this.maxSpeed;
if (this.spinTime < this.duration) {
this.wheelSp.node.angle -= this.curSpeed;
this.refreshAngle();
return;
}
this.springback && (this.finalAngle += this.gearAngle);
if (this.wheelSp.node.angle - this.curSpeed > -this.finalAngle) {
this.wheelSp.node.angle -= this.curSpeed;
this.refreshAngle();
} else {
this.wheelSp.node.angle = -this.finalAngle;
this.refreshAngle();
this.wheelState = 2;
}
}
} else if (2 == this.wheelState) {
var a = this.wheelSp.node.angle, n = a + this.finalAngle;
this.curSpeed = this.maxSpeed * ((this.decAngle + n) / this.decAngle) + .2;
this.wheelSp.node.angle = a - this.curSpeed;
this.refreshAngle();
if (this.decAngle + n <= 0) {
this.wheelState = 0;
this.wheelSp.node.angle = -this.finalAngle;
this.refreshAngle();
if (this.springback) {
var c = new cc.rotateBy(.5, -this.gearAngle), l = cc.sequence(new cc.delayTime(.3), c, cc.callFunc(this.showRes, this));
cc.tween(this.wheelSp.node).then(l).start();
} else this.showRes();
}
}
},
showRes: function() {
cc.engine.log("奖励" + this.targetID);
var e = 0;
switch (cc.engine.turntable[this.targetID + 1].name) {
case "红包(小)":
case "红包(中)":
case "红包(大)":
break;

case "少量金币":
e = 300;
break;

case "中量金币":
e = 600;
break;

case "大量金币":
e = 900;
}
if (0 != e) {
for (var a = 0, n = 0; n < cc.engine.gameCtl.ballLayout.children.length; ++n) {
var c = cc.engine.gameCtl.ballLayout.children[n].getComponent("Ball")._ball;
a += parseInt(c.atk * Math.pow(c.atk_rate, cc.engine.userData.petArr[c.key - 11001] - 1));
}
var l = parseInt(a * e * .6);
cc.engine.gameModel.addGold(l, "turnTable");
cc.engine.Toast.showToast("金币增加" + cc.engine.config.changeGold(l, 2));
} else cc.engine.platform.openRed(cc.engine.config.redType.turn);
}
});
cc._RF.pop();
}, {} ],
userData: [ function(e, a) {
"use strict";
cc._RF.push(a, "8a09b3cykVLiamxR8bEHDc0", "userData");
a.exports = {
gold: 1e4,
level: 1,
petArr: [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
isRed: 0,
guideID: 1,
address1: "",
address2: "",
address3: "",
offlineTimestamp: null,
speedTimestamp: null,
attTimestamp: null,
clickTimestamp: null,
goldTimestamp: null,
onlineCount: 0,
online: null,
init: function(e) {
var a = this;
e && Object.keys(e).forEach(function(n) {
void 0 !== a[n] && (cc.engine.gameModel.isArray(a[n]) ? Object.keys(e[n]).forEach(function(c) {
a[n][c] = e[n][c];
}) : a[n] = e[n]);
});
}
};
cc._RF.pop();
}, {} ]
}, {}, [ "Audio", "Http", "MD5", "config", "platform", "userData", "GameCtl", "LoadingCtl", "petDict", "stageDict", "GameModel", "Ball", "BrickLayout", "GameView", "OverPanel", "Pet", "boon", "bossRed", "brick", "danmu", "fenhong", "getdia", "guide", "item", "money", "niu", "noGold", "offline", "openRedPop", "redaction", "scrollView", "share", "sign", "task", "tianjiang", "toast", "toggleItem", "turnTable" ]);