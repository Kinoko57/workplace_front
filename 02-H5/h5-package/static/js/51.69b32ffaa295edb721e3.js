webpackJsonp([51],{LcFr:function(t,a,s){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var e=s("fqE/"),o=s("Au9i"),n=s("HUDw"),i={name:"MyWallet",components:{commonHeader:e.a},data:function(){return{h_title:"我的钱包",r_title:"明细",head_color:{background:"#fff",color:"#000"},myWalInfo:{},imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",showMyal:!1}},mounted:function(){this.getWalletInfo()},methods:{getWalletInfo:function(){o.Indicator.open("加载中...");var t=this;Object(n.E)().then(function(a){a.isSuccess&&(o.Indicator.close(),t.showMyal=!0,t.myWalInfo=a.data.money)})},gowhere:function(){this.$router.togo({path:"/walletDetail"})},goCash:function(){this.$router.togo({path:"/cashWithDrawal"})}}},l={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",[s("common-header",{attrs:{h_title:t.h_title,showback:!0,bgcolor:t.head_color,r_title:t.r_title,showrtext:!0},on:{goright:t.gowhere}}),t._v(" "),t.showMyal?s("div",{staticClass:"my_wal"},[s("div",{staticStyle:{height:"0.9rem"}}),t._v(" "),s("div",{staticClass:"my_wal_t"},[s("span",[t._v("¥"+t._s(t.myWalInfo.total_money))]),t._v(" "),s("span",[t._v("总金额")])]),t._v(" "),s("div",{staticClass:"my_wal_b"},[s("div",{staticClass:"my_wal_b_l",on:{click:t.goCash}},[s("span",{staticClass:"my_wal_b_l_Num"},[t._v("¥"+t._s(t.myWalInfo.income))]),t._v(" "),t._m(0)]),t._v(" "),s("div",{staticClass:"my_wal_b_r"},[s("span",{staticClass:"my_wal_b_l_Num"},[t._v("¥"+t._s(t.myWalInfo.stay_wind))]),t._v(" "),t._m(1)])])]):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"my_wal_b_l_text"},[a("span",[this._v("可提现")]),this._v(" "),a("i",{staticClass:"iconfont icon-iconfontjiantou5"})])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"my_wal_b_l_text"},[a("span",[this._v("待结算")])])}]};var _=s("VU/8")(i,l,!1,function(t){s("YckS")},"data-v-52bd6d3a",null);a.default=_.exports},YckS:function(t,a){}});
//# sourceMappingURL=51.69b32ffaa295edb721e3.js.map