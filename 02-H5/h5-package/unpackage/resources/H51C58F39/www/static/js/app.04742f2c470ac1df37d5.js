webpackJsonp([72],{"37SA":function(t,e){},"8zP7":function(t,e){},HPve:function(t,e){},JKva:function(t,e){},Jtwt:function(t,e,n){"use strict";var i={data:function(){return{show:this.isTop}},mounted:function(){this.tabScroll()},methods:{tabScroll:function(){window.addEventListener("scroll",this.handleScroll)},handleScroll:function(){var t=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,e=window.outerHeight;this.show=t>e},goTop:function(){this.$emit("returnTop")}},destroyed:function(){window.removeEventListener("scroll",this.handleScroll)}},o={render:function(){var t=this.$createElement,e=this._self._c||t;return this.show?e("div",{staticClass:"returnTop",on:{click:this.goTop}},[e("i",{staticClass:"iconfont icon-huidaodingbu"})]):this._e()},staticRenderFns:[]};var a=n("VU/8")(i,o,!1,function(t){n("8zP7")},"data-v-603c0ef7",null);e.a=a.exports},LulZ:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("7+uW"),o=n("wvfG"),a=n.n(o),r={name:"App",data:function(){return{transitionName:"",v_console_num:0}},created:function(){setTimeout(function(){console.log("隐藏console"),console.log(document.querySelector(".v_console_show")),document.querySelector(".v_console_show").style.display="none",console.log(document.querySelector("#__vconsole")),null!=document.querySelector("#__vconsole")&&(document.querySelector("#__vconsole").style.display="none",document.querySelector("#__vconsole .vc-switch").style.display="none")},1e3)},methods:{v_console_click:function(){this.v_console_num++,console.log(this.v_console_num),this.v_console_num>=4&&document.querySelector("#__vconsole")&&(document.querySelector("#__vconsole").style.display="block",document.querySelector("#__vconsole .vc-switch").style.display="block",this.v_console_num=0,alert("07-22.1.0"))}},watch:{$route:function(t){"true"===window.localStorage.getItem("routeLeft")?this.transitionName="slideleft":this.transitionName="slideright"}}},l={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("div",{staticClass:"v_console_show",on:{click:this.v_console_click}}),this._v(" "),e("transition",{attrs:{name:this.transitionName}},[e("router-view",{staticClass:"Router"})],1)],1)},staticRenderFns:[]};var c,s=n("VU/8")(r,l,!1,function(t){n("YCZu")},null,null).exports,u=n("NYxO"),h=n("bOdI"),m=n.n(h),p={state:{number:1,carnum:0,carpro:[],carAmount:0,carShip:0,carDifference:0,carScore:0,isbind:!1,score:0,news:!1,newsnum:0,issign:!1,userInfo:{},searchData:[],choseAddr:{},footNum:0,footList:[],signData:{},scanId:"",invite_id:0,is_member:!1,is_share:0,is_first:0,routeLeft:!1,routeRight:!1},mutations:(c={},m()(c,"SET_NUM",function(t,e){t.number=e}),m()(c,"SET_CARNUM",function(t,e){t.carnum=e}),m()(c,"SET_CARPRO",function(t,e){t.carpro=e}),m()(c,"SET_CARAMOUNT",function(t,e){t.carAmount=e}),m()(c,"SET_CARSHIP",function(t,e){t.carShip=e}),m()(c,"SET_CARDIFFERENCE",function(t,e){t.carDifference=e}),m()(c,"SET_CARSCORE",function(t,e){t.carScore=e}),m()(c,"SET_ISBIND",function(t,e){t.isbind=e}),m()(c,"SET_SCORE",function(t,e){t.score=e}),m()(c,"SET_INVITER",function(t,e){t.invite_id=e}),m()(c,"SET_MEMBER",function(t,e){t.is_member=e}),m()(c,"SET_SHARE",function(t,e){t.is_share=e}),m()(c,"SET_NEWS",function(t,e){t.news=e}),m()(c,"SET_NEWSNUM",function(t,e){t.newsnum=e}),m()(c,"SET_ISSIGN",function(t,e){t.issign=e}),m()(c,"SET_USERINFO",function(t,e){t.userInfo=e}),m()(c,"SET_SEARCHDATA",function(t,e){t.searchData=e}),m()(c,"SET_CHOSEADDR",function(t,e){t.choseAddr=e}),m()(c,"SET_FOOTNUM",function(t,e){t.footNum=e}),m()(c,"SET_FOOTLIST",function(t,e){t.footList=e}),m()(c,"SET_SIGNDATA",function(t,e){t.signData=e}),m()(c,"SET_SCANID",function(t,e){t.scanId=e}),m()(c,"SET_ROUTELEFT",function(t,e){t.routeLeft=e}),m()(c,"SET_ROUTERIGHT",function(t,e){t.routeRight=e}),m()(c,"SET_FIRST",function(t,e){t.is_first=e}),c),actions:{},getters:{number:function(t){return t.number},carnum:function(t){return t.carnum},carpro:function(t){return t.carpro},carAmount:function(t){return t.carAmount},carScore:function(t){return t.carScore},isbind:function(t){return t.isbind},score:function(t){return t.score},invite_id:function(t){return t.invite_id},is_member:function(t){return t.is_member},is_share:function(t){return t.is_share},is_first:function(t){return t.is_first},news:function(t){return t.news},newsnum:function(t){return t.newsnum},issign:function(t){return t.issign},userInfo:function(t){return t.userInfo},searchData:function(t){return t.searchData},choseAddr:function(t){return t.choseAddr},footNum:function(t){return t.footNum},footList:function(t){return t.footList},signData:function(t){return t.signData},scanId:function(t){return t.scanId},routeLeft:function(t){return t.routeLeft},routeRight:function(t){return t.routeRight}}};n("sax8");i.default.use(u.a);var d=new u.a.Store({modules:{home:p},plugins:[]}),f=n("/ocq");i.default.use(f.a),f.a.prototype.togo=function(t){var e=parseInt(window.localStorage.getItem("routeNum"));++e,console.log(e),window.localStorage.setItem("routeNum",e),window.localStorage.setItem("routeLeft","true"),window.localStorage.setItem("routeRight","false"),this.push(t)},f.a.prototype.goRight=function(t){this.isleft=!1,this.isright=!0,this.push(t.path)},f.a.prototype.goBack=function(){var t=parseInt(window.localStorage.getItem("routeNum"));--t,window.localStorage.setItem("routeNum",t),window.localStorage.setItem("routeLeft","false"),window.localStorage.setItem("routeRight","true"),this.go(-1)},f.a.prototype.togoback=function(){this.isright=!0,this.isleft=!1},f.a.prototype.togoin=function(){this.isright=!1,this.isleft=!0};var v=new f.a({routes:[{path:"/",name:"NavigationPage",component:function(t){return Promise.all([n.e(0),n.e(5)]).then(function(){var e=[n("/HeR")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"活动页",noCache:!0}},{path:"/login",name:"Login",component:function(t){return Promise.all([n.e(0),n.e(6)]).then(function(){var e=[n("Quw4")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"登录",noCache:!0}},{path:"/guidePage",name:"GuidePage",component:function(t){return n.e(14).then(function(){var e=[n("nKmQ")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"引导页",noCache:!0}},{path:"/index",name:"index",component:function(t){return Promise.all([n.e(0),n.e(32)]).then(function(){var e=[n("8hXn")];t.apply(null,e)}.bind(this)).catch(n.oe)},children:[{path:"/index",name:"Index",meta:{title:"首页",noCache:!1},component:function(t){return Promise.all([n.e(0),n.e(7)]).then(function(){var e=[n("JXTs")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/hotPush",name:"Find",component:function(t){return Promise.all([n.e(0),n.e(28)]).then(function(){var e=[n("PiBu")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"精选",noCache:!1}},{path:"/type",name:"Type",component:function(t){return Promise.all([n.e(0),n.e(22)]).then(function(){var e=[n("9bf9")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"商品分类",noCache:!0}},{path:"/typeList",name:"TypeList",component:function(t){return Promise.all([n.e(0),n.e(54)]).then(function(){var e=[n("d/z7")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"商品分类",noCache:!0}},{path:"/shoper",name:"Shoper",component:function(t){return Promise.all([n.e(0),n.e(63)]).then(function(){var e=[n("lx+i")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"会员",noCache:!0}},{path:"/car",name:"Car",component:function(t){return Promise.all([n.e(0),n.e(57)]).then(function(){var e=[n("eRZu")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"购物车",noCache:!0}},{path:"/member",name:"Member",component:function(t){return Promise.all([n.e(0),n.e(43)]).then(function(){var e=[n("vxBM")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"个人中心",noCache:!0}},{path:"/order",name:"Order",component:function(t){return Promise.all([n.e(0),n.e(53)]).then(function(){var e=[n("MEMh")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的订单",noCache:!0}},{path:"/proList",name:"ProList",component:function(t){return Promise.all([n.e(0),n.e(70)]).then(function(){var e=[n("VEH2")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"商品列表",noCache:!0}},{path:"/flashSale",name:"Flash",component:function(t){return Promise.all([n.e(0),n.e(45)]).then(function(){var e=[n("alwp")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"限时抢购",noCache:!0}},{path:"/tryOut",name:"Try",component:function(t){return Promise.all([n.e(0),n.e(20)]).then(function(){var e=[n("gd6W")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"试用体验",noCache:!0}},{path:"/myGroupBy",name:"Group",component:function(t){return Promise.all([n.e(0),n.e(39)]).then(function(){var e=[n("PuQi")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"拼团中心",noCache:!0}},{path:"/myColl",name:"MyColl",component:function(t){return Promise.all([n.e(0),n.e(31)]).then(function(){var e=[n("qLkl")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的收藏",noCache:!0}},{path:"/activityList",name:"ActivityList",component:function(t){return Promise.all([n.e(0),n.e(38)]).then(function(){var e=[n("v9qd")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"活动列表",noCache:!0}},{path:"/paySuccess",name:"PaySuccess",component:function(t){return Promise.all([n.e(0),n.e(40)]).then(function(){var e=[n("qpWM")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"支付成功页",noCache:!0}},{path:"/asShoper",name:"AsShoper",component:function(t){return Promise.all([n.e(0),n.e(66)]).then(function(){var e=[n("L1t6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"成为会员",noCache:!0}}]},{path:"/set",name:"Set",component:function(t){return Promise.all([n.e(0),n.e(12)]).then(function(){var e=[n("76VT")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"设置",noCache:!0}},{path:"/other",name:"Other",component:function(t){return Promise.all([n.e(0),n.e(56)]).then(function(){var e=[n("mLn6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"页面标题",noCache:!0}},{path:"/protocol",name:"Protocol",component:function(t){return Promise.all([n.e(0),n.e(35)]).then(function(){var e=[n("eqgx")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"服务协议",noCache:!0}},{path:"/proDetail",name:"ProDetail",component:function(t){return Promise.all([n.e(0),n.e(61)]).then(function(){var e=[n("BO9h")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"商品详情",noCache:!1}},{path:"/proDetailRec",name:"proDetailRec",component:function(t){return Promise.all([n.e(0),n.e(51)]).then(function(){var e=[n("UdxL")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"商品详情",noCache:!1}},{path:"/tryDetail",name:"TryDetail",component:function(t){return Promise.all([n.e(0),n.e(37)]).then(function(){var e=[n("mGHd")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"试用商品详情",noCache:!0}},{path:"/orderDetail",name:"OrderDetail",component:function(t){return Promise.all([n.e(0),n.e(25)]).then(function(){var e=[n("JTPM")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"订单详情",noCache:!0}},{path:"/lottery",name:"Lottery",component:function(t){return Promise.all([n.e(0),n.e(13)]).then(function(){var e=[n("3Joc")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"每日抽奖",noCache:!0}},{path:"/findDetail",name:"FindDetail",component:function(t){return Promise.all([n.e(0),n.e(69)]).then(function(){var e=[n("37E2")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"文章详情",noCache:!0}},{path:"/sureOrder",name:"SureOrder",component:function(t){return Promise.all([n.e(0),n.e(44)]).then(function(){var e=[n("UpqO")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"确认支付",noCache:!0}},{path:"/myFootprint",name:"MyFootprint",component:function(t){return Promise.all([n.e(0),n.e(8)]).then(function(){var e=[n("7/ak")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的足迹",noCache:!0}},{path:"/mySignIn",name:"MySignIn",component:function(t){return Promise.all([n.e(0),n.e(11)]).then(function(){var e=[n("6OKp")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的签到",noCache:!0}},{path:"/improveInfo",name:"ImproveInfo",component:function(t){return Promise.all([n.e(0),n.e(15)]).then(function(){var e=[n("i8Ps")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"完善生日",noCache:!0}},{path:"/myCoupon",name:"MyCoupon",component:function(t){return Promise.all([n.e(0),n.e(17)]).then(function(){var e=[n("18iw")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的优惠券",noCache:!0}},{path:"/myQrcode",name:"MyQrcode",component:function(t){return Promise.all([n.e(0),n.e(48)]).then(function(){var e=[n("gNh9")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的二维码",noCache:!0}},{path:"/editInfo",name:"EditInfo",component:function(t){return Promise.all([n.e(0),n.e(52)]).then(function(){var e=[n("255A")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的地址",noCache:!0}},{path:"/editAddr",name:"EditAddr",component:function(t){return Promise.all([n.e(0),n.e(10)]).then(function(){var e=[n("Y+Y8")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"编辑地址",noCache:!0}},{path:"/personCenter",name:"PersonCenter",component:function(t){return Promise.all([n.e(0),n.e(41)]).then(function(){var e=[n("7yq3")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的资料",noCache:!0}},{path:"/bind",name:"Bind",component:function(t){return Promise.all([n.e(0),n.e(4)]).then(function(){var e=[n("ucpJ")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"绑定手机",noCache:!0}},{path:"/news",name:"News",component:function(t){return Promise.all([n.e(0),n.e(27)]).then(function(){var e=[n("byYY")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"消息中心",noCache:!0}},{path:"/myScore",name:"MyScore",component:function(t){return Promise.all([n.e(0),n.e(64)]).then(function(){var e=[n("bRoA")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的积分",noCache:!0}},{path:"/myComment",name:"MyComment",component:function(t){return Promise.all([n.e(0),n.e(47)]).then(function(){var e=[n("R1MM")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的评价",noCache:!0}},{path:"/mytryOut",name:"MytryOut",component:function(t){return Promise.all([n.e(0),n.e(50)]).then(function(){var e=[n("YiPc")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的试用",noCache:!0}},{path:"/groupBy",name:"GroupBy",component:function(t){return Promise.all([n.e(0),n.e(67)]).then(function(){var e=[n("KyDH")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的拼团",noCache:!0}},{path:"/myGift",name:"MyGift",component:function(t){return Promise.all([n.e(0),n.e(30)]).then(function(){var e=[n("fWGJ")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的赠品",noCache:!0}},{path:"/myGiftList",name:"MyGiftList",component:function(t){return Promise.all([n.e(0),n.e(36)]).then(function(){var e=[n("wnuf")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的奖品",noCache:!0}},{path:"/myIntersted",name:"MyIntersted",component:function(t){return Promise.all([n.e(0),n.e(23)]).then(function(){var e=[n("XgZV")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的关注",noCache:!0}},{path:"/vipBirthday",name:"Birtahday",component:function(t){return Promise.all([n.e(0),n.e(33)]).then(function(){var e=[n("Wj/y")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"生日专区",noCache:!0}},{path:"/orderTrack",name:"OrderTrack",component:function(t){return Promise.all([n.e(0),n.e(58)]).then(function(){var e=[n("3kBR")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"物流详情",noCache:!0}},{path:"/single",name:"Single",component:function(t){return Promise.all([n.e(0),n.e(19)]).then(function(){var e=[n("hmC2")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"凑单",noCache:!0}},{path:"/useCoupon",name:"UseCoupon",component:function(t){return Promise.all([n.e(0),n.e(55)]).then(function(){var e=[n("SQzM")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"使用优惠券",noCache:!0}},{path:"/addComment",name:"AddComment",component:function(t){return Promise.all([n.e(0),n.e(60)]).then(function(){var e=[n("0MIV")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"添加评价",noCache:!0}},{path:"/err",name:"ErrPage",component:function(t){return Promise.all([n.e(0),n.e(9)]).then(function(){var e=[n("KjS3")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"错误页面",noCache:!0}},{path:"/search",name:"Search",component:function(t){return Promise.all([n.e(0),n.e(18)]).then(function(){var e=[n("Gg5O")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"搜索",noCache:!0}},{path:"/saleAfter",name:"SaleAfter",component:function(t){return Promise.all([n.e(0),n.e(3)]).then(function(){var e=[n("eTw4")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"申请售后",noCache:!0}},{path:"/scanCode",name:"ScanCode",component:function(t){return Promise.all([n.e(0),n.e(68)]).then(function(){var e=[n("YWWF")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"扫码结果页",noCache:!0}},{path:"/afterDetail",name:"AfterDetail",component:function(t){return Promise.all([n.e(0),n.e(42)]).then(function(){var e=[n("5lt6")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"售后详情",noCache:!0}},{path:"/groupResult",name:"GroupResult",component:function(t){return Promise.all([n.e(0),n.e(65)]).then(function(){var e=[n("s7x/")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"拼购详情",noCache:!0}},{path:"/scan",name:"ScanPage",component:function(t){return Promise.all([n.e(0),n.e(59)]).then(function(){var e=[n("q8RQ")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"扫一扫",noCache:!0}},{path:"/giftPackage",name:"GiftPackage",component:function(t){return Promise.all([n.e(0),n.e(24)]).then(function(){var e=[n("NZqS")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"礼包专区",noCache:!0}},{path:"/poster",name:"Poster",component:function(t){return Promise.all([n.e(0),n.e(1)]).then(function(){var e=[n("gVNx")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"海报",noCache:!0}},{path:"/fansList",name:"FansList",component:function(t){return Promise.all([n.e(0),n.e(62)]).then(function(){var e=[n("tUwn")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"粉丝列表",noCache:!0}},{path:"/cashWithDrawal",name:"CashWithDrawal",component:function(t){return Promise.all([n.e(0),n.e(34)]).then(function(){var e=[n("WEUK")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"余额提现",noCache:!0}},{path:"/newPeople",name:"NewPeople",component:function(t){return Promise.all([n.e(0),n.e(46)]).then(function(){var e=[n("RS03")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"新人特惠",noCache:!0}},{path:"/newPeopleDetail",name:"NewPeopleDetail",component:function(t){return Promise.all([n.e(0),n.e(21)]).then(function(){var e=[n("WimF")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"新人详情",noCache:!0}},{path:"/myWallet",name:"MyWallet",component:function(t){return Promise.all([n.e(0),n.e(49)]).then(function(){var e=[n("LirB")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的钱包",noCache:!0}},{path:"/myCard",name:"MyCard",component:function(t){return Promise.all([n.e(0),n.e(26)]).then(function(){var e=[n("/P51")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"我的银行卡",noCache:!0}},{path:"/addCard",name:"AddCard",component:function(t){return Promise.all([n.e(0),n.e(16)]).then(function(){var e=[n("T4UA")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"添加银行卡",noCache:!0}},{path:"/noticeDetail",name:"NoticeDetail",component:function(t){return Promise.all([n.e(0),n.e(29)]).then(function(){var e=[n("4ozx")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"订单详情",noCache:!0}},{path:"/phoneLogin",name:"PhoneLogin",component:function(t){return Promise.all([n.e(0),n.e(2)]).then(function(){var e=[n("xFVe")];t.apply(null,e)}.bind(this)).catch(n.oe)},meta:{title:"手机登录",noCache:!0}}]}),y=n("Au9i"),g=n.n(y),b=(n("d8/S"),n("h2zT"),n("LulZ"),n("mQA3"),n("v5o6")),w=n.n(b),S=(n("zzYx"),n("Lw6n")),C=n.n(S),T=n("yINb"),P=n("Jtwt");i.default.prototype.HOST="/api",a.a.config.autoSetContainer=!0,i.default.use(a.a);new C.a;i.default.component(y.Cell.name,y.Cell),i.default.component(y.Checklist.name,y.Checklist),i.default.component(y.Navbar.name,y.Navbar),i.default.component(y.TabItem.name,y.TabItem),i.default.component("LyTab",T.a),i.default.component("returnTop",P.a),console.log("https://share.gongzhugou.com/");var _=window.localStorage;_.setItem("leaveIndex",!1),_.setItem("routeNum",1),console.log(_.getItem("showGuide")),void 0==_.getItem("showGuide")&&_.setItem("showGuide",0),_.setItem("showConcart",0),v.afterEach(function(t,e,n){window.scrollTo(0,0)});var E=0;window.addEventListener("popstate",function(t){++E<2&&v.beforeEach(function(t,e,n){console.log(t);var i=t.path.split("/"),o=e.path.split("/");2===i.length&&0===i[1].length&&i.splice(1,1),2===o.length&&0===o[1].length&&o.splice(1,1),i.length<o.length?v.togoback():v.togoin(),n()})},!1);var I=["/","/login","/other","/set","/index","/hotPush","/findDetail","/typeList","/car","/proList","/flashSale","/tryOut","/myGroupBy","/lottery","/mySignIn","/proDetail","/tryDetail","/scanCode","/groupResult","/vipBirthday","/giftPackage","/newPeople","/newPeopleDetail","/mycard","/cashWithDrawal","/addCard","/activityList","/phoneLogin","/bind","/protocol"],B=["/fansList","/myWallet","/poster"],L=["/shoper"],X=["/asShoper"],A=["/","/login","/index","/hotPush","/member","/proList","/findDetail","/flashSale","/tryOut","/myGroupBy","/type","/other","/set","/lottery","/scanCode","/groupResult","/search","/activityList","/phoneLogin","/bind","/protocol","/proDetail","/typeList"];function x(){console.log(plus.navigator.getStatusBarBackground()),console.log(parseInt(_.getItem("routeNum"))),console.log(v),plus.key.addEventListener("backbutton",function(){console.log(v);var t=parseInt(_.getItem("routeNum"));t>1?(--t,_.setItem("routeNum",t),_.setItem("routeLeft","false"),_.setItem("routeRight","true"),v.go(-1)):"iOS"==plus.os.name?plus.nativeUI.confirm("确认退出？",function(t){t.index>0&&plus.runtime.quit()},"HelloH5",["取消","确定"]):confirm("确认退出？")&&plus.runtime.quit()},!1),plus.navigator.setStatusBarBackground("#F3F3F3"),setTimeout(function(){plus.navigator.closeSplashscreen()},200)}v.beforeEach(function(t,e,n){console.log("判断是否登录"+_.getItem("isLogin")=="true"),setTimeout(function(){if(-1!==I.indexOf(t.path))console.log("白色主题"),window.plus&&(window.plus.navigator.setStatusBarBackground("#f9f9f9"),window.plus.navigator.setStatusBarStyle("dark"));else if(-1!==B.indexOf(t.path)){if(console.log("黄色主题"),window.plus)window.plus.navigator.setStatusBarBackground("#f3c0a2"),window.plus.navigator.setStatusBarStyle("light")}else if(-1!==L.indexOf(t.path)){if(console.log("蓝色主题"),window.plus)window.plus.navigator.setStatusBarBackground("#A6AAC9"),window.plus.navigator.setStatusBarStyle("light")}else if(-1!==X.indexOf(t.path)){if(console.log("黑色主题"),window.plus)window.plus.navigator.setStatusBarBackground("#000000"),window.plus.navigator.setStatusBarStyle("light")}else{if(console.log("红色主题"),window.plus)window.plus.navigator.setStatusBarBackground("#ff8d97"),window.plus.navigator.setStatusBarStyle("light")}-1!=A.indexOf(t.path)||"false"!==_.getItem("isLogin")&&!1!==_.getItem("isLogin")||window.plus.nativeUI.confirm("您当前未登录，是否立即前往登录",function(t){0===t.index||"0"===t.index?v.push({path:"/login?back=1"}):v.go(-1)},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"})},100),n()}),window.plus?(console.log("校验通过是app"),x()):document.addEventListener("plusready",x,!1),i.default.use(g.a),i.default.use(u.a),i.default.config.productionTip=!1,w.a.attach(document.body),new i.default({el:"#app",router:v,store:d,components:{App:s},template:"<App/>"})},YCZu:function(t,e){},"d8/S":function(t,e){},h2zT:function(t,e){},mQA3:function(t,e){},yINb:function(t,e,n){"use strict";var i={name:"LyTabbar",props:{lineWidth:{type:Number,default:3},activeColor:{type:String,default:"red"},fixBottom:{type:Boolean,default:!1},value:{type:Number,default:0},additionalX:{type:Number,default:50},reBoundExponent:{type:Number,default:10,validator:function(t){return t>0}},sensitivity:{type:Number,default:1e3,validator:function(t){return t>0}},reBoundingDuration:{type:Number,default:360}},data:function(){return{activeBarX:0,activeBarWidth:0,speed:0,touching:!1,reBounding:!1,translateX:0,startX:0,lastX:0,currentX:0,startMoveTime:0,endMoveTime:0,frameTime:16.7,frameStartTime:0,frameEndTime:0,inertiaFrame:0,zeroSpeed:.001,acceleration:0}},computed:{style:function(){return this.fixBottom?{}:{transitionTimingFunction:this.transitionTimingFunction,transitionDuration:this.transitionDuration+"ms",transform:"translate3d("+this.translateX+"px, 0px, 0px)"}},activeBarStyle:function(){return{transition:"all 300ms",width:this.activeBarWidth+"px",height:this.lineWidth+"px",transform:"translate3d("+this.activeBarX+"px, 0, 0)",backgroundColor:this.activeColor}},transitionDuration:function(){return this.touching||!this.reBounding&&!this.touching?0:this.reBounding&&!this.touching?this.reBoundingDuration:void 0},transitionTimingFunction:function(){return this.reBounding?"cubic-bezier(0.25, 0.46, 0.45, 0.94)":"cubic-bezier(0.1, 0.57, 0.1, 1)"},viewAreaWidth:function(){return this.$refs.viewArea.offsetWidth},listWidth:function(){return this.$refs.list.offsetWidth-this.viewAreaWidth},isMoveLeft:function(){return this.currentX<=this.startX},isMoveRight:function(){return this.currentX>=this.startX}},watch:{value:function(){this.checkPosition(),this.calcBarPosX()}},mounted:function(){this.bindEvent(),this.checkPosition(),this.calcBarPosX(),function(){for(var t=0,e=["webkit","moz"],n=0;n<e.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[e[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[n]+"CancelAnimationFrame"]||window[e[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e,n){var i=(new Date).getTime(),o=Math.max(0,16.7-(i-t)),a=i-t,r=window.setTimeout(function(){e(a)},o);return t=i+o,r}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}()},destoryed:function(){this.removeEvent()},methods:{handleTouchStart:function(t){t.stopPropagation(),cancelAnimationFrame(this.inertiaFrame),this.lastX=t.touches[0].clientX},handleTouchMove:function(t){this.listWidth<=0||(t.preventDefault(),t.stopPropagation(),this.touching=!0,this.startMoveTime=this.endMoveTime,this.startX=this.lastX,this.currentX=t.touches[0].clientX,this.moveFollowTouch(),this.endMoveTime=t.timeStamp)},handleTouchEnd:function(t){if(this.touching=!1,this.checkReboundX())cancelAnimationFrame(this.inertiaFrame);else{var e=t.timeStamp-this.endMoveTime,n=this.endMoveTime-this.startMoveTime;if(n=n>0?n:8,e>100)return;this.speed=(this.lastX-this.startX)/n,this.acceleration=this.speed/this.sensitivity,this.frameStartTime=(new Date).getTime(),this.inertiaFrame=requestAnimationFrame(this.moveByInertia)}},checkReboundX:function(){return this.reBounding=!1,this.translateX>0?(this.reBounding=!0,this.translateX=0):this.translateX<-this.listWidth&&(this.reBounding=!0,this.translateX=-this.listWidth),0===this.translateX||this.translateX===-this.listWidth},bindEvent:function(){this.$el.addEventListener("touchstart",this.handleTouchStart,!1),this.$el.addEventListener("touchmove",this.handleTouchMove,!1),this.$el.addEventListener("touchend",this.handleTouchEnd,!1)},removeEvent:function(){this.$el.removeEventListener("touchstart",this.handleTouchStart),this.$el.removeEventListener("touchmove",this.handleTouchMove),this.$el.removeEventListener("touchend",this.handleTouchEnd)},moveFollowTouch:function(){this.isMoveLeft?this.translateX<=0&&this.translateX+this.listWidth>0||this.translateX>0?this.translateX+=this.currentX-this.lastX:this.translateX+this.listWidth<=0&&(this.translateX+=this.additionalX*(this.currentX-this.lastX)/(this.viewAreaWidth+Math.abs(this.translateX+this.listWidth))):this.translateX>=0?this.translateX+=this.additionalX*(this.currentX-this.lastX)/(this.viewAreaWidth+this.translateX):(this.translateX<=0&&this.translateX+this.listWidth>=0||this.translateX+this.listWidth<=0)&&(this.translateX+=this.currentX-this.lastX),this.lastX=this.currentX},moveByInertia:function(){this.frameEndTime=(new Date).getTime(),this.frameTime=this.frameEndTime-this.frameStartTime,this.isMoveLeft?this.translateX<=-this.listWidth?(this.acceleration*=(this.reBoundExponent+Math.abs(this.translateX+this.listWidth))/this.reBoundExponent,this.speed=Math.min(this.speed-this.acceleration,0)):this.speed=Math.min(this.speed-this.acceleration*this.frameTime,0):this.isMoveRight&&(this.translateX>=0?(this.acceleration*=(this.reBoundExponent+this.translateX)/this.reBoundExponent,this.speed=Math.max(this.speed-this.acceleration,0)):this.speed=Math.max(this.speed-this.acceleration*this.frameTime,0)),this.translateX+=this.speed*this.frameTime/2,Math.abs(this.speed)<=this.zeroSpeed?this.checkReboundX():(this.frameStartTime=this.frameEndTime,this.inertiaFrame=requestAnimationFrame(this.moveByInertia))},calcBarPosX:function(){if(!this.fixBottom&&this.$children.length&&!(this.$children.length<=this.value)){var t=this.$children[this.value].$el,e=t.offsetWidth,n=t.offsetLeft;this.activeBarWidth=Math.max(.6*e,14),this.activeBarX=n+(e-this.activeBarWidth)/2}},checkPosition:function(){if(!this.fixBottom&&this.$children.length&&!(this.$children.length<=this.value)){var t=this.$children[this.value].$el,e=t.offsetLeft,n=(this.viewAreaWidth-t.offsetWidth)/2,i=0,o=Math.abs(this.translateX);if(e<=o+n)i=n-(e+this.translateX);else i=-(e-o-n);var a=i+this.translateX;a>0&&(a=0),a<-this.listWidth&&(a=-this.listWidth),this.reBounding=!0,this.translateX=a}}}},o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{ref:"viewArea",staticClass:"ly-tabbar",class:{"ly-tabbar-fix-bottom":this.fixBottom}},[e("div",{ref:"list",staticClass:"ly-tab-list",style:this.style},[this._t("default"),this._v(" "),this.fixBottom?this._e():e("div",{ref:"activeBar",staticClass:"ly-tab-active-bar",style:this.activeBarStyle})],2)])},staticRenderFns:[]};var a={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("a",{staticClass:"ly-tab-item",style:t.$parent.value===t.id?t.activeStyle:{},on:{click:t.onItemClicked}},[t.$parent.fixBottom?n("div",{staticClass:"ly-tab-item-icon"},[t._t("icon")],2):t._e(),t._v(" "),n("div",{staticClass:"ly-tab-item-label"},[t._t("default")],2)])},staticRenderFns:[]};var r={name:"LyTab",components:{LyTabbar:n("VU/8")(i,o,!1,function(t){n("HPve")},null,null).exports,LyTabItem:n("VU/8")({name:"LyTabItem",computed:{activeStyle:function(){return{color:this.$parent.activeColor}}},data:function(){return{id:(this.$parent.$children.length||1)-1}},methods:{onItemClicked:function(){this.$parent.$emit("input",this.id)}}},a,!1,function(t){n("JKva")},null,null).exports},props:{value:{type:Number,default:0},items:{type:Array,default:function(){return[]}},options:{type:Object,default:function(){return{}}}},data:function(){return{selectedId:this.value}},computed:{labelKey:function(){return this.options.labelKey||"label"}},watch:{value:function(t){this.selectedId=t},selectedId:function(t){this.$emit("input",t),this.$emit("change",this.items[t],t)}}},l={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ly-tab"},[n("ly-tabbar",t._b({model:{value:t.selectedId,callback:function(e){t.selectedId=e},expression:"selectedId"}},"ly-tabbar",t.options,!1),t._l(t.items,function(e,i){return n("ly-tab-item",{key:i},[t.options.fixBottom&&e.icon?n("span",{attrs:{slot:"icon"},slot:"icon"},[n("i",{class:e.icon})]):t._e(),t._v(" "),n("span",[t._v(t._s(e[t.labelKey]))])])}),1)],1)},staticRenderFns:[]};var c=n("VU/8")(r,l,!1,function(t){n("37SA")},null,null);e.a=c.exports},zzYx:function(t,e){!function(t,e){var n,i=document,o=window,a=i.documentElement,r=document.createElement("style");function l(){var n=a.getBoundingClientRect().width;n>(e=e||540)&&(n=e);var i=100*n/t;r.innerHTML="html{font-size:"+i+"px;}"}if(a.firstElementChild)a.firstElementChild.appendChild(r);else{var c=i.createElement("div");c.appendChild(r),i.write(c.innerHTML),c=null}l(),o.addEventListener("resize",function(){clearTimeout(n),n=setTimeout(l,300)},!1),o.addEventListener("pageshow",function(t){t.persisted&&(clearTimeout(n),n=setTimeout(l,300))},!1),"complete"===i.readyState?i.body.style.fontSize="16px":i.addEventListener("DOMContentLoaded",function(t){i.body.style.fontSize="16px"},!1)}(750,2e3)}},["NHnr"]);
//# sourceMappingURL=app.04742f2c470ac1df37d5.js.map