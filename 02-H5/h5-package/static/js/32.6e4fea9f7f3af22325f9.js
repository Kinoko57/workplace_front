webpackJsonp([32],{Mdu2:function(t,i){},fWGJ:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("fqE/"),n=e("Au9i"),a=e("gyMJ"),o={name:"MyGift",components:{commonHeader:s.a,InfiniteScroll:n.InfiniteScroll,Indicator:n.Indicator,Button:n.Button,Lazyload:n.Lazyload,Spinner:n.Spinner,Toast:n.Toast},data:function(){return{h_title:"我的赠品",allowbind:!0,giftType:"2",page:1,limit:30,total:0,giftList:[],proType:"scan",loading:!0,imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",screenHeight:(document.documentElement.clientHeight-50)/50}},mounted:function(){n.Indicator.open("加载中..."),this.getList()},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("gift").scrollIntoView({block:"start",behavior:"smooth"})},getList:function(){var t=this,i={p:t.page,limit:t.limit,type:t.giftType};Object(a.L)(i).then(function(i){n.Indicator.close(),i.isSuccess&&(null==i.data&&(i.data=[],t.loading=!0),t.giftList=i.data,t.total=i.total,t.loading=!1)})},loadMore:function(){this.loading=!0;var t=this,i={p:++t.page,limit:t.limit,type:t.giftType};Object(a.L)(i).then(function(i){n.Indicator.close(),i.isSuccess?(null===i.data&&(i.data=[]),t.loading=!0):(t.giftList=t.giftList.concat(i.data),t.total=i.total,t.loading=!1)})},goIndex:function(){this.$router.replace({path:"/index"})},viewGift:function(t){n.Indicator.open("加载中..."),this.giftType=t,this.loading=!0,this.giftList=[],this.page=1,this.getList()},usegift:function(t,i,e){if("false"===this.$store.state.home.isbind||!1===this.$store.state.home.isbind)this.$router.replace({path:"/bind?visit=4"});else if(this.allowbind){var s=this;if(s.allowbind=!1,1===e||"1"===e){var o={pid:i,num:1,goods_id:"",deal_type:1,type:"scan",lottery_id:i};Object(a.a)(o).then(function(t){t.isSuccess?s.$router.togo({path:"/sureOrder?id="+i+"&addType=3&proType=scan"}):(s.allowbind=!0,Object(n.Toast)({message:t.msg,duration:1e3}))})}else Object(a.K)(t).then(function(t){t.isSuccess?(Object(n.Toast)({message:t.msg,iconClass:"iconfont icon-dui1",duration:1e3}),setTimeout(function(){s.page=1,s.allowbind=!0,s.getList()},1e3)):(s.allowbind=!0,Object(n.Toast)({message:t.msg,duration:1e3}))})}}}},c={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("common-header",{attrs:{h_title:t.h_title,showback:!0}}),t._v(" "),e("div",{staticClass:"my_gift"},[e("return-top",{on:{returnTop:t.goTop}}),t._v(" "),e("div",{staticStyle:{height:"0.9rem"},attrs:{id:"gift"}}),t._v(" "),e("div",{staticClass:"gift_nav"},[e("span",{class:"2"==t.giftType?"text_active":"",on:{click:function(i){return t.viewGift("2")}}},[t._v("待领取")]),t._v(" "),e("span",{class:"1"==t.giftType?"text_active":"",on:{click:function(i){return t.viewGift("1")}}},[t._v("已领取")])]),t._v(" "),e("div",{staticStyle:{height:"0.9rem"}}),t._v(" "),e("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"gift_info",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"30"}},[t._l(t.giftList,function(i,s){return e("div",{key:s,staticClass:"info"},[2==i.lottery_type?e("i",{staticClass:"iconfont icon-jifen"}):t._e(),t._v(" "),3==i.lottery_type?e("i",{staticClass:"iconfont icon-youhuiquan"}):t._e(),t._v(" "),1==i.lottery_type?e("i",{staticClass:"iconfont icon-shangpin"}):t._e(),t._v(" "),e("span",[t._v(t._s(i.name))]),t._v(" "),0==i.status?e("button",{staticClass:"btn_red",attrs:{size:"mini"},on:{click:function(e){return t.usegift(i.id,i.lottery_id,i.lottery_type)}}},[t._v("立即领取")]):t._e(),t._v(" "),1==i.status?e("button",{staticClass:"btn_red",attrs:{size:"mini"}},[t._v("已领取")]):t._e(),t._v(" "),2==i.status?e("button",{staticClass:"btn_red",attrs:{size:"mini"}},[t._v("已下单")]):t._e(),t._v(" "),3==i.status?e("button",{staticClass:"btn_red",attrs:{size:"mini"}},[t._v("已取消")]):t._e(),t._v(" "),4==i.status?e("button",{staticClass:"btn_red",attrs:{size:"mini"}},[t._v("已过期")]):t._e()])}),t._v(" "),t.loading?t._e():e("div",{staticClass:"more_load"},[e("mt-spinner",{attrs:{type:"fading-circle"}})],1),t._v(" "),t.total>0&&t.giftList.length>0?e("div",{staticClass:"list_bottom"},[t._v("—————— 我是有底线的 ——————")]):t._e(),t._v(" "),0==t.giftList.length?e("div",{staticClass:"center"},[e("img",{attrs:{src:t.imgPath+"pro/null_1.png"}})]):t._e()],2)],1),t._v(" "),e("div",{staticClass:"goIndex",on:{click:t.goIndex}},[e("i",{staticClass:"iconfont icon-home"})])],1)},staticRenderFns:[]};var l=e("VU/8")(o,c,!1,function(t){e("Mdu2")},"data-v-9eb91638",null);i.default=l.exports}});
//# sourceMappingURL=32.6e4fea9f7f3af22325f9.js.map