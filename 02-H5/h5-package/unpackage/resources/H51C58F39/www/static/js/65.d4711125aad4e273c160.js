webpackJsonp([65],{Lkt2:function(t,s){},"s7x/":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("fqE/"),o=e("Au9i"),a=e("gyMJ"),r=e("WVZN"),n={name:"GroupResult",components:{commonHeader:i.a,InfiniteScroll:o.InfiniteScroll,Indicator:o.Indicator,Button:o.Button,Lazyload:o.Lazyload,Toast:o.Toast},data:function(){return{head_color:{background:"#f9f9f9",color:"#000"},h_title:"拼购详情",allowbind:!0,orderId:"",id:"",GroupOrder:{startnum:0},groupPeople:[],endTime:null,saleTime:[],time:null,sharewx:"",imgPath:"https://share.gongzhugou.com/static/image/xcx_img/"}},mounted:function(){o.Indicator.open("加载中..."),console.log(this.$route.query);var t=this.$route.query;"pay"===t.type?(this.orderId=t.orderId,this.id=""):(this.orderId="",this.id=t.orderId),this.getInfo();var s=this,e=window.plus;void 0!=e&&e.share.getServices(function(t){var e={};for(var i in t){var o=t[i];e[o.id]=o}s.sharewx=e.weixin,console.log(s.sharewx)},function(t){console.log("获取分享服务列表失败："+t.message)})},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("coll").scrollIntoView({block:"start",behavior:"smooth"})},getInfo:function(){var t=this,s={order_id:t.orderId,id:t.id};Object(a._30)(s).then(function(s){if(o.Indicator.close(),console.log(s),s.isSuccess){var e=Object(r.a)(s.data.countdown);t.endTime=s.data.countdown,t.saleTime=e,t.GroupOrder=s.data,t.groupPeople=s.customer,t.id=s.data.id,t.time=setInterval(function(){e=Object(r.a)(--t.endTime),t.saleTime=e},1e3)}})},golink:function(t,s,e){var i=this;"true"===window.localStorage.getItem("isLogin")||!0===window.localStorage.getItem("isLogin")?this.$router.togo({path:t+s+"&gid="+e}):window.plus.nativeUI.confirm("您当前未登录，是否立即前往登录",function(t){0!==t.index&&"0"!==t.index||i.$router.togo({path:"/login?back=1"})},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"})},zipImg:function(){var t=this,s=window.plus;""!==t.GroupOrder.img?s.downloader.createDownload(t.GroupOrder.img,{},function(e,i){if(200===i){console.log(e),console.log("Download success: "+e.filename);var o="_doc/shareImg"+(new Date).getTime()+".jpg";console.log("压缩后的文件名"+o),s.zip.compressImage({src:e.filename,dst:o,quality:50,format:"jpg",width:"50%",height:"50%"},function(s){console.log(s),console.log("压缩成功"),t.shareGroup(s.target)},function(s){console.log(s),t.share(!1)})}else console.log("下载失败: "+i),t.share(!1)}).start():t.share(!1)},shareGroup:function(t){var s=window.plus,e=window.localStorage;!1===t&&(t="_www/img/mp.png");var i="/pages/groupResult/groupResult?type=payshare&orderId="+this.id+"&uid="+e.getItem("token").split(";")[0].split("=")[1],o="https://share.gongzhugou.com/"+"downApp/downApp.html",a={type:"miniProgram",title:"[邀请参团]"+this.GroupOrder.name,thumbs:[t],content:"公主购：一个专注省钱的会员制电商平台~",miniProgram:{id:"gh_a0cfbcaf8fa2",path:i,webUrl:o,type:2},extra:{scene:"WXSceneSession"}};this.sharewx?this.isAuth(a):s.nativeUI.alert("当前环境不支持微信分享操作!")},isAuth:function(t){console.log("判断是否授权"),console.log(t),this.sharewx.authenticated?this.shareAction(t):this.sharewx.authorize(function(){this.shareAction(t)},function(t){console.log("认证授权失败")})},shareAction:function(t){console.log("开始分享"),console.log(t),this.sharewx.send(t,function(){console.log("分享成功！")},function(t){console.log("分享失败："+t.message)})},goIndex:function(){this.$router.replace({path:"/index"})}}},l={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[e("common-header",{attrs:{h_title:t.h_title,showback:!0,bgcolor:t.head_color}}),t._v(" "),e("return-top",{on:{returnTop:t.goTop}}),t._v(" "),e("div",{staticStyle:{height:"0.9rem"}}),t._v(" "),e("div",{staticClass:"result_group"},[t.GroupOrder.isleader&&1==t.GroupOrder.status?e("div",{staticClass:"result_title"},[e("i",{staticClass:"iconfont icon-duihaocheckmark17"}),t._v(" "),t._m(0)]):t._e(),t._v(" "),t.GroupOrder.isleader||1!=t.GroupOrder.status?t._e():e("div",{staticClass:"result_title"},[e("i",{staticClass:"iconfont icon-duihaocheckmark17"}),t._v(" "),t._m(1)]),t._v(" "),2==t.GroupOrder.status?e("div",{staticClass:"result_title"},[e("i",{staticClass:"iconfont icon-duihaocheckmark17"}),t._v(" "),t._m(2)]):t._e(),t._v(" "),-1==t.GroupOrder.status?e("div",{staticClass:"result_title fail"},[e("i",{staticClass:"iconfont icon-guanbi2"}),t._v(" "),t._m(3)]):t._e(),t._v(" "),e("div",{staticClass:"group_order"},[e("div",{staticClass:"sale_pro"},[e("div",{staticClass:"pro_img"},[e("img",{attrs:{src:t.GroupOrder.img}})]),t._v(" "),e("div",{staticClass:"pro_info"},[e("div",{staticClass:"pro_title"},[t._v(t._s(t.GroupOrder.name))]),t._v(" "),e("div",{staticClass:"pro_spec"},[e("div",{staticClass:"pro_price"},[e("i",{staticClass:"iconfont icon-tuangou3"}),t._v(" "),e("span",{staticClass:"pro_integral"},[t._v(t._s(t.GroupOrder.startnum)+"人拼")]),t._v(" "),e("span",{staticClass:"peo_nowprice"},[t._v("¥"+t._s(t.GroupOrder.price))])])]),t._v(" "),e("div",{staticClass:"pro_orig"},[t._v("\n            市场价\n            "),e("span",[t._v("¥"+t._s(t.GroupOrder.price_market))])])])]),t._v(" "),e("div",{staticClass:"sale_time"},[e("div",{staticClass:"group_spec",attrs:{hidden:-1==t.GroupOrder.status||t.GroupOrder.startnum<=t.groupPeople.length}},[e("span",{staticClass:"spec_text"},[t._v("还剩")]),t._v(" "),e("span",{staticClass:"spec_text spec_red"},[t._v(t._s(t.GroupOrder.startnum-t.groupPeople.length)+"人")]),t._v(" "),e("span",{staticClass:"spec_text"},[t._v("拼购成功，剩余时间")]),t._v(" "),e("span",{staticClass:"sepc_block"},[t._v(t._s(t.saleTime.day))]),t._v(" "),e("span",{staticClass:"spec_text"},[t._v("天")]),t._v(" "),e("span",{staticClass:"sepc_block"},[t._v(t._s(t.saleTime.hou))]),t._v(" "),e("span",{staticClass:"spec_text"},[t._v(":")]),t._v(" "),e("span",{staticClass:"sepc_block"},[t._v(t._s(t.saleTime.min))]),t._v(" "),e("span",{staticClass:"spec_text"},[t._v(":")]),t._v(" "),e("span",{staticClass:"sepc_block"},[t._v(t._s(t.saleTime.sec))])]),t._v(" "),e("div",{staticClass:"group_person"},[t._l(t.groupPeople,function(s,i){return e("div",{key:i,staticClass:"group_img"},[i<4?e("div",[1==s.leader?e("span",{staticClass:"leader"},[t._v("团长")]):t._e(),t._v(" "),null!=s.image&&""!=s.image?e("img",{attrs:{src:s.image}}):t._e(),t._v(" "),null==s.image||""==s.image?e("img",{attrs:{src:t.imgPath+"com/pc_avatar.png"}}):t._e()]):t._e()])}),t._v(" "),t._l(t.GroupOrder.startnum-t.groupPeople.length,function(t){return e("div",{key:t,staticClass:"group_img"},[e("div",{staticClass:"img_bg"})])}),t._v(" "),t.groupPeople.length>5?e("div",{staticClass:"group_img"},[e("span",[t._v("...")])]):t._e()],2)]),t._v(" "),e("div",{staticClass:"sale_btn",attrs:{hidden:-1==t.GroupOrder.status||t.GroupOrder.startnum<=t.groupPeople.length}},[1!=t.GroupOrder.isleader?e("mt-button",{staticClass:"width",on:{click:function(s){return t.golink("/proDetail?type=group&id=",t.GroupOrder.group_id,t.GroupOrder.id)}}},[t._v("我要参团")]):t._e(),t._v(" "),e("mt-button",{on:{click:t.zipImg}},[t._v("邀请好友参团")]),t._v(" "),e("div",{on:{click:t.goIndex}},[t._v("商城首页")])],1),t._v(" "),-1==t.GroupOrder.status?e("div",{staticClass:"sale_btn"},[e("mt-button",{staticClass:"fail"},[t._v("拼购失败")]),t._v(" "),e("div",{on:{click:t.goIndex}},[t._v("商城首页")])],1):t._e(),t._v(" "),2==t.GroupOrder.status?e("div",{staticClass:"sale_btn"},[e("mt-button",{staticClass:"width"},[t._v("拼购成功")]),t._v(" "),e("div",{on:{click:t.goIndex}},[t._v("商城首页")])],1):t._e()]),t._v(" "),e("div",{staticClass:"group_help"},[e("div",{staticClass:"help_title"},[t._v("拼购规则")]),t._v(" "),e("div",{staticClass:"help_detail"},[e("span",[t._v(t._s(t.GroupOrder.rule))])])])])],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",[s("span",{staticClass:"title_top"},[this._v("恭喜你，开团成功!")]),this._v(" "),s("span",[this._v("快去邀请小伙伴参团吧~")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",[s("span",{staticClass:"title_top"},[this._v("团长邀请你加入该团~")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",[s("span",{staticClass:"title_top"},[this._v("恭喜，拼购成功!")])])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",[s("span",{staticClass:"title_top"},[this._v("该团未能按时凑齐人数，拼购失败!")])])}]};var c=e("VU/8")(n,l,!1,function(t){e("Lkt2")},"data-v-111994f8",null);s.default=c.exports}});
//# sourceMappingURL=65.d4711125aad4e273c160.js.map