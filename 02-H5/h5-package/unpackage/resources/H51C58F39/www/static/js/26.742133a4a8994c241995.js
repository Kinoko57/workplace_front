webpackJsonp([26],{"/P51":function(t,a,o){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=o("fqE/"),s=o("Jtwt"),e=o("Td3j"),i=o("Au9i"),c={components:{commonHeader:n.a,InfiniteScroll:i.InfiniteScroll,Indicator:i.Indicator,Button:i.Button,Lazyload:i.Lazyload,Toast:i.Toast,returnTop:s.a},data:function(){return{head_color:{background:"#f9f9f9",color:"#000"},h_title:"我的银行卡",height:"",showBankCard:!1,showBank:!1,isTop:!0,imPath:"https://share.gongzhugou.com/static/image/xcx_img/",cardList:[],src:"https://share.gongzhugou.com/static/image/xcx_img/shop/share_1.png",animationData:{},brandHeight:0}},mounted:function(){this.getBankList(),console.log(this.showbank)},methods:{goIndex:function(){this.$router.togo({path:"/index"})},goTop:function(){console.log("回到顶部"),document.getElementById("my_card").scrollIntoView({block:"start",behavior:"smooth"})},addMyCard:function(t){this.$router.togo({path:"/addCard"})},getBankList:function(){var t=this;i.Indicator.open("加载中..."),Object(e.b)().then(function(a){i.Indicator.close(),console.log(a,"fsdf"),null!=a.data.bank&&0!==a.data.bank.length?(t.cardList=a.data.bank,t.showBank=!0,t.showBankCard=!0):(t.showBank=!1,t.showBankCard=!0)})},choseBank:function(t){console.log(t);window.localStorage.setItem("chose_bank",t),this.$router.back()}}},r={render:function(){var t=this,a=t.$createElement,o=t._self._c||a;return t.showBankCard?o("div",[o("common-header",{attrs:{h_title:t.h_title,showback:!0,bgcolor:t.head_color}}),t._v(" "),o("div",{staticClass:"my_card"},[o("div",{staticStyle:{height:"0.9rem"},attrs:{id:"my_card"}}),t._v(" "),o("return-top",{on:{returnTop:t.goTop}}),t._v(" "),o("div",{staticClass:"overHidden"},[t._l(t.cardList,function(a,n){return o("div",{key:n,staticClass:"my_img"},[o("img",{attrs:{src:a.cardbg},on:{click:function(o){return t.choseBank(a.id)}}}),t._v(" "),o("div",{staticClass:"bankCode"},[o("span",{staticClass:"bankLast"},[t._v(t._s(a.card))])])])}),t._v(" "),o("div",{staticClass:"addmycard"},[o("div",{on:{click:t.addMyCard}},[o("span",[t._v("+")]),t._v(" "),o("span",[t._v("添加银行卡")])])]),t._v(" "),o("div",{staticStyle:{height:"78/100rem"}})],2)],1),t._v(" "),o("div",{staticClass:"goIndex",on:{click:t.goIndex}},[o("i",{staticClass:"iconfont icon-home"})])],1):t._e()},staticRenderFns:[]};var d=o("VU/8")(c,r,!1,function(t){o("o3IX")},"data-v-a8a1d1ba",null);a.default=d.exports},o3IX:function(t,a){}});
//# sourceMappingURL=26.742133a4a8994c241995.js.map