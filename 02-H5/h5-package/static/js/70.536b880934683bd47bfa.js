webpackJsonp([70],{GVN7:function(t,e){},vxBM:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("Dd8w"),a=i.n(s),n=i("NYxO"),o=i("Au9i"),r=i("gyMJ"),c=i("HUDw"),m={name:"Member",components:{commonHeader:i("fqE/").a,Button:o.Button,Toast:o.Toast},data:function(){return{zhiManager:"",shoper:!1,rebate:"",shoperList:[{src:"https://share.gongzhugou.com/static/image/xcx_img/shop/shop1.png",title:"自购省钱",whoshop:"自己购买",rebate:"购物省5%～35%"},{src:"https://share.gongzhugou.com/static/image/xcx_img/shop/shop2.png",title:"分享赚钱",whoshop:"粉丝购买",rebate:"推广赚5%～35%"}],show_contact:!1,adverSrc:{},imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",isMember:this.$store.state.home.is_member,isShare:this.$store.state.home.is_share,h_title:"个人中心",navNtn:5,header_bg:"https://share.gongzhugou.com/static/image/xcx_img/member/headerBg.png",avatarUrl:"https://share.gongzhugou.com/static/image/xcx_img/member/avatar.png",newNews:!1,news_num:0,refuse:!1,vipTitle:"",loginModel:!1,orderNav:[{id:1,typeId:1,imgUrl:"https://share.gongzhugou.com/static/image/xcx_img/member/pay.png",link:"/myOrder",name:"待付款",num:0},{id:2,typeId:5,imgUrl:"https://share.gongzhugou.com/static/image/xcx_img/member/ship.png",link:"/myOrder",name:"待发货",num:0},{id:3,typeId:2,imgUrl:"https://share.gongzhugou.com/static/image/xcx_img/member/receipt.png",link:"/myOrder",name:"待收货",num:0},{id:5,typeId:6,imgUrl:"https://share.gongzhugou.com/static/image/xcx_img/member/eval.png",link:"/myOrder",name:"待评价",num:0},{id:4,typeId:7,imgUrl:"https://share.gongzhugou.com/static/image/xcx_img/member/after_sale.png",link:"/myOrder",name:"退换/售后",num:0}],vipShow:!1,memRule:"",userInfo:{avatar:"",nickname:"",level_id:"",username:"",isShow:0},orderList:[{imgurl:"",orderStates:"",id:""}],aweixin:"",birthday_img:"",is_birthday:!1}},created:function(){},mounted:function(){},methods:a()({},Object(n.c)({setNum:"SET_NUM",setCarnum:"SET_CARNUM",setIsbind:"SET_ISBIND",setScore:"SET_SCORE",setNews:"SET_NEWS",setNewsnum:"SET_NEWSNUM",setIssign:"SET_ISSIGN",setUserInfo:"SET_USERINFO",setInviter:"SET_INVITER",setMember:"SET_MEMBER",setShowShare:"SET_SHARE"}),{openConcart:function(){var t=this;if("true"===window.localStorage.getItem("isLogin")||!0===window.localStorage.getItem("isLogin")){console.log("展开聊天框"),console.log(this.userInfo),window.localStorage.setItem("leaveApp",!0);t.$router.togo({path:"/chat",name:"Chat",params:{url:"https://www.sobot.com/chat/h5/index.html",sysNum:"563069f6a21c4723b6a05d5ab9a6146d",back:1,titleFlag:1,uname:this.userInfo.nickname,face:this.userInfo.avatar,partnerId:this.userInfo.uid}})}else window.plus.nativeUI.confirm("您当前未登录，是否立即前往登录",function(e){0!==e.index&&"0"!==e.index||t.$router.togo({path:"/login?back=1"})},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"})},getInfo:function(){var t=this;Object(r._9)().then(function(e){if(e.isSuccess){var i={};i.avatar=e.data.image,i.uid=e.data.uid,i.level=e.data.rankName,i.isShow=1,i.nickname=e.data.nickname,i.isbind=e.data.bindPhone,i.level_id=e.data.level_id,i.level_name=e.data.levelName,i.inviter=e.data.inviter,i.is_first=e.data.is_first,t.setUserInfo(i),t.setScore(e.data.point),t.setInviter(e.data.inviter),""!==e.data.mobile&&null!==e.data.mobile?t.setIsbind(!0):t.setIsbind(!1),0!==e.data.level_id&&"0"!==e.data.level_id?t.setMember(!0):t.setMember(!1),t.userInfo=t.$store.state.home.userInfo,t.getShoper()}});for(var e=0;e<t.orderNav.length;e++)t.orderNav[e].num=0;Object(r._7)().then(function(e){if(e.isSuccess)if(e.isSuccess)for(var i=0;i<e.data.length;i++)for(var s=0;s<t.orderNav.length;s++)e.data[i].type===t.orderNav[s].typeId&&(t.orderNav[s].num=e.data[i].num);else for(var a=0;a<t.orderNav.length;a++)t.orderNav[a].num=0}),Object(r.D)({p:1,limit:10}).then(function(e){e.isSuccess&&t.setCarnum(e.data.rows_total)}),Object(r.Z)().then(function(e){e.isSuccess&&(1===e.data.is_sign||"1"===e.data.is_sign?t.setIssign(!0):t.setIssign(!1),1===e.data.is_birthday||"1"===e.data.is_birthday?(t.is_birthday=!0,t.birthday_img=e.data.birthday_img):(t.is_birthday=!1,t.birthday_img=""),e.data.num>0?(t.setNews(!0),t.setNewsnum(e.data.num)):(t.setNews(!1),t.setNewsnum(0)))}),Object(r._24)().then(function(e){e.isSuccess?0==e.data.status?(t.isShare=0,t.setShowShare(0)):(t.isShare=1,t.setShowShare(1)):console.log("判断用户是否是直邀失败")})},getShoper:function(){var t=this;Object(c.K)().then(function(e){console.log(e,"111"),e.isSuccess&&(1===e.data.hint_pop||"1"===e.data.hint_pop?t.shoper=!0:t.shoper=!1)})},closeShoper:function(){var t=this;Object(c.c)().then(function(e){e.isSuccess&&(t.shoper=!1,t.getuser("/index"))})},toUse:function(){var t=this;Object(c.c)().then(function(e){console.log(e,"shopers close"),e.isSuccess&&(t.shoper=!1,t.getuser("/proList?type=key&price=asc&virtual_id=&value="))})},getuser:function(t){var e=this,i=this;Object(r._9)().then(function(s){if(s.isSuccess){var a={};a.nickname=s.data.nickname,a.username=s.data.username,a.level=s.data.rankName,a.avatar=s.data.image,a.isShow=1,a.isbind=s.data.bindPhone,a.level_id=s.data.level_id,a.level_name=s.data.levelName,a.inviter=s.data.inviter,a.is_first=s.data.is_first,i.setUserInfo(a),e.setScore(s.data.point),i.userInfo=i.$store.state.home.userInfo,0!==s.data.level_id||"0"!==s.data.level_id?e.$store.state.home.is_member=!0:e.$store.state.home.is_member=!1,window.localStorage.getItem("token")&&(i.userInfo=i.$store.state.home.userInfo),e.$router.replace({path:t})}})},getAdv:function(){var t=this;Object(c.f)(4).then(function(e){e.isSuccess&&(t.adverSrc=e.data.ad)})},showLogin:function(){this.$router.togo({path:"/login?back=1"})},goBirth:function(){this.$router.togo({path:"/vipBirthday"})},goUrl:function(t,e,i){console.log(e);var s=e.split("/");if(1==i)this.$router.togo({path:"/proDetail?type=normal&id="+t});else if(0==i)0!=t&&this.$router.replace({path:"/poster"});else{var a=e;-1!=a.indexOf("hotPush")||-1!=a.indexOf("index")||-1!=a.indexOf("myCar")||-1!=a.indexOf("proType")||-1!=a.indexOf("memberCenter")||-1!=a.indexOf("shoper")?this.$router.replace({path:"/"+s[s.length-1]}):-1!=a.indexOf("lottery")?this.$router.replace({path:"/"+s[s.length-1]}):this.$router.togo({path:"/"+s[s.length-1]})}},linkGo:function(t,e,i){var s=this;"true"===window.localStorage.getItem("isLogin")||!0===window.localStorage.getItem("isLogin")?s.$router.togo({path:t,name:"Order",params:{id:e,tid:i}}):window.plus.nativeUI.confirm("您当前未登录，是否立即前往登录",function(t){0!==t.index&&"0"!==t.index||s.$router.togo({path:"/login?back=1"})},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"})},goPage:function(t){var e=this;"true"===window.localStorage.getItem("isLogin")||!0===window.localStorage.getItem("isLogin")?e.$router.togo({path:t}):window.plus.nativeUI.confirm("您当前未登录，是否立即前往登录",function(t){0!==t.index&&"0"!==t.index||e.$router.togo({path:"/login?back=1"})},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"})},goSign:function(t){var e=this;"true"===window.localStorage.getItem("isLogin")||!0===window.localStorage.getItem("isLogin")?"false"===this.$store.state.home.isbind||!1===this.$store.state.home.isbind?e.$router.replace({path:"/bind?visit=5"}):e.$router.togo({path:"/mySignIn"}):window.plus.nativeUI.confirm("您当前未登录，是否立即前往登录",function(t){0!==t.index&&"0"!==t.index||e.$router.togo({path:"/login?back=1"})},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"})},showLevel:function(){var t=this;t.vipShow=!0,Object(r.Q)().then(function(e){e.isSuccess&&(t.vipTitle=e.member_rule)})},hiddenVip:function(){this.vipShow=!1}}),computed:a()({},Object(n.b)([])),destroyed:function(){(console.log("离开页面"),null!=document.getElementById("ZCPanel"))&&document.getElementById("ZCPanel").remove()},activated:function(){console.log(this.$store.state);var t=window.localStorage;console.log(t.getItem("isLogin")),!0!==t.getItem("isLogin")&&"true"!==t.getItem("isLogin")||(this.isShare=this.$store.state.home.is_share,this.getInfo(),this.getAdv());var e=this,i=window.plus;i&&(i.navigator.setStatusBarBackground("#ff4e79"),i.navigator.setStatusBarStyle("light"),i.oauth.getServices(function(t){var i=t;console.log(i),"weixin"===t[0].id&&(e.aweixin=t[0])},function(t){console.log("获取分享服务列表失败："+t.message+" - "+t.code)}))}},l={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("common-header",{attrs:{h_title:t.h_title,showback:!1,showmore:!0}}),t._v(" "),i("div",{staticClass:"member_head"}),t._v(" "),i("div",{staticClass:"member"},[i("div",{staticClass:"m_header"},[i("div",{class:0==t.userInfo.isShow?"m_info":"div_hidden",on:{click:t.showLogin}},[i("span",{staticClass:"login_btn"},[i("img",{staticClass:"m_avatar",attrs:{src:t.avatarUrl}})]),t._v(" "),i("span",{staticClass:"login_btn"},[t._v("\n          登录\n        ")])]),t._v(" "),i("div",{class:1==t.userInfo.isShow?"m_info_login":"div_hidden"},[i("img",{staticClass:"m_avatar",attrs:{src:t.userInfo.avatar,mode:"scaleToFill"},on:{click:function(e){return t.goPage("/personCenter")}}}),t._v(" "),i("div",{staticClass:"m_info_title"},[i("div",{staticClass:"m_info_name"},[i("span",[t._v(t._s(t.userInfo.nickname))])]),t._v(" "),i("div",{staticClass:"m_info_level"},[i("div",{staticStyle:{display:"inline-flex","align-items":"center","margin-left":"0.16rem"}},[i("i",{staticClass:"iconfont icon-jifen1"}),t._v(" "),i("span",[t._v(t._s(t.$store.state.home.score))])])])]),t._v(" "),i("div",{staticClass:"m_score"},[i("i",{staticClass:"iconfont icon-iconqiandaowenzi",attrs:{"data-url":"../mySignIn/mySignIn"},on:{click:t.goSign}})])])]),t._v(" "),"0"==t.userInfo.level_id&&1==t.isShare?i("div",{staticClass:"m_vip"},[i("div",{staticClass:"m_vip_con",on:{click:function(e){return t.goPage("/asShoper")}}},[t._m(0),t._v(" "),t._m(1)])]):t._e(),t._v(" "),i("div",{staticClass:"m_body"},[i("div",{staticClass:"m_order"},[i("div",{staticClass:"m_order_top"},[i("span",[t._v("我的订单")]),t._v(" "),i("div",{staticClass:"m_order_right",on:{click:function(e){return t.linkGo("/order",0,0)}}},[i("span",[t._v("查看全部订单")]),t._v(" "),i("i",{staticClass:"iconfont icon-youjiantou1"})])]),t._v(" "),i("div",{staticClass:"m_order_more"},t._l(t.orderNav,function(e,s){return i("div",{key:s,staticClass:"has_msg",on:{click:function(i){return t.linkGo(e.link,e.id,e.typeId)}}},[i("img",{staticClass:"more_icon",attrs:{src:e.imgUrl}}),t._v(" "),i("div",{class:1==t.userInfo.isShow&&e.num>0&&7!==e.typeId?" msg_bg ":"msg_bg_hidden "},[i("span",[t._v(t._s(e.num))])]),t._v(" "),i("span",[t._v(t._s(e.name))])])}),0)]),t._v(" "),""!=t.adverSrc.img&&void 0!=t.adverSrc.img?i("div",{staticClass:"toChose",on:{click:function(e){return t.goUrl(t.adverSrc.href_id,t.adverSrc.href,t.adverSrc.href_type)}}},[i("img",{attrs:{src:t.adverSrc.img}})]):t._e(),t._v(" "),t.is_birthday?i("div",{staticClass:"m_birthday"},[i("img",{attrs:{src:t.birthday_img,alt:""},on:{click:t.goBirth}})]):t._e(),t._v(" "),i("div",{staticClass:"m_more_feature"},[i("div",{staticClass:"m_more_f_top"},[i("div",{on:{click:function(e){return t.goPage("/myColl")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/shoucang.png"}}),t._v(" "),i("span",[t._v("我的收藏")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/myFootprint")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/zuji.png"}}),t._v(" "),i("span",[t._v("我的足迹")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/myCoupon")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/quan.png"}}),t._v(" "),i("span",[t._v("我的优惠券")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/editInfo?code=address&codename=我的地址&isInput=1")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/dizhi.png"}}),t._v(" "),i("span",[t._v("收货地址")])])]),t._v(" "),i("div",{staticClass:"m_more_f_top"},[i("div",{staticClass:"newsNav",on:{click:function(e){return t.goPage("/news")}}},[i("div",{class:t.$store.state.home.news?" msg_bg ":"msg_bg_hidden "},[i("span",[t._v(t._s(t.$store.state.home.newsnum))])]),t._v(" "),i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/xiaoxi.png"}}),t._v(" "),i("span",[t._v("消息中心")])]),t._v(" "),i("div",{staticClass:"zhiCustomBtn",on:{click:t.openConcart}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/set.png"}}),t._v(" "),i("span",[t._v("客服中心")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/myScore")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/jifen.png"}}),t._v(" "),i("span",[t._v("我的积分")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/myComment")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/pingjia.png"}}),t._v(" "),i("span",[t._v("我的评价")])])]),t._v(" "),i("div",{staticClass:"m_more_f_bottom"},[i("div",{on:{click:function(e){return t.goPage("/mytryOut")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/shiyong.png"}}),t._v(" "),i("span",[t._v("我的试用")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/groupBy")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/tuan.png"}}),t._v(" "),i("span",[t._v("我的拼团")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/myGift")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/zeng.png"}}),t._v(" "),i("span",[t._v("我的赠品")])]),t._v(" "),i("div",{on:{click:function(e){return t.goPage("/myGiftList")}}},[i("img",{staticClass:"more_icons",attrs:{src:t.imgPath+"member/gift.png"}}),t._v(" "),i("span",[t._v("我的奖品")])])])])])]),t._v(" "),t.vipShow?i("div",{staticClass:"vipDetail_bg"}):t._e(),t._v(" "),t.vipShow?i("div",{staticClass:"vipDetail"},[i("div",{staticClass:"vip_head"},[t._v("会员等级规则说明")]),t._v(" "),i("div",{staticClass:"richspan",staticStyle:{height:"4rem"}},[i("span",[t._v(t._s(t.vipTitle))])]),t._v(" "),i("div",{staticClass:"vip_btn",on:{click:t.hiddenVip}},[i("mt-button",{attrs:{size:"small"}},[t._v("我知道了")])],1)]):t._e(),t._v(" "),t.shoper?i("div",{staticClass:"a_shoper_bg"}):t._e(),t._v(" "),t.shoper?i("div",{staticClass:"a_shoper"},[i("div",{staticClass:"a_shoper_dia"},[i("i",{staticClass:"iconfont icon-close",on:{click:t.closeShoper}}),t._v(" "),t._m(2),t._v(" "),i("div",{staticClass:"a_shoper_share"},[i("img",{staticClass:"share_bg",attrs:{src:t.imgPath+"shop/level_bg.png",alt:"",srcset:""}})]),t._v(" "),i("div",{staticClass:"a_shoper_btn",on:{click:t.toUse}},[i("button",[t._v("去下单")])])])]):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"m_vip_con_l"},[e("i",{staticClass:"iconfont icon-vip"}),e("span",[this._v("VIP会员")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"m_vip_con_r"},[e("span",[this._v("立即成为会员")]),e("i",{staticClass:"iconfont icon-youjiantou1"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"a_shoper_tit"},[e("span",{staticClass:"a_shoper_tit_t"},[this._v("恭喜你 成功升级为"),e("span",{staticClass:"shoper_light"},[this._v("会员")]),this._v("!")])])}]};var g=i("VU/8")(m,l,!1,function(t){i("GVN7")},"data-v-16e54c27",null);e.default=g.exports}});
//# sourceMappingURL=70.536b880934683bd47bfa.js.map