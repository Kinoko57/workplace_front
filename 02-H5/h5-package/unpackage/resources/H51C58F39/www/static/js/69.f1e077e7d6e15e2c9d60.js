webpackJsonp([69],{"37E2":function(t,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var s=e("fqE/"),i=e("Au9i"),n=e("yINb"),a=e("gyMJ"),c=e("Jtwt"),l={name:"FindDetail",components:{commonHeader:s.a,Search:i.Search,LyTab:n.a,returnTop:c.a,InfiniteScroll:i.InfiniteScroll,Lazyload:i.Lazyload,Button:i.Button,Toast:i.Toast},data:function(){return{h_title:"文章详情",head_color:{background:"#f9f9f9",color:"#000"},articleId:"",isSign:!0,listShow:!1,articleInfo:{},noScroll:!1,sharewx:""}},mounted:function(){document.getElementById("find").scrollIntoView(!1),i.Indicator.open("加载中..."),console.log(this.$route.query),this.articleId=this.$route.query.id,this.getDetail();var t=this;window.plus.share.getServices(function(o){var e={};for(var s in o){var i=o[s];e[i.id]=i}t.sharewx=e.weixin,console.log(t.sharewx)},function(t){console.log("获取分享服务列表失败："+t.message)})},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("find").scrollIntoView({block:"start",behavior:"smooth"})},getDetail:function(){var t=this;Object(a.y)(this.articleId).then(function(o){i.Indicator.close(),o.isSuccess&&(console.log(o),t.articleInfo=o.data)})},goPro:function(t,o,e){"normal"===t?this.$router.togo({path:"/proDetail?type="+t+"&id="+o}):"group"===t&&this.$router.togo({path:"/proDetail?type="+t+"&id="+o+"&goods_id"+e})},gotryPro:function(t){this.$router.togo({path:"/tryOutdetail?id="+t+"&form_share=0&help_id=null"})},goIndex:function(t){this.$router.replace({path:"/index"})},zipImg:function(t,o){var e=this,s=window.plus;""!==e.articleInfo.img?s.downloader.createDownload(e.articleInfo.img,{},function(i,n){if(200===n){console.log(i),console.log("Download success: "+i.filename);var a="_doc/shareImg"+(new Date).getTime()+".jpg";console.log("压缩后的文件名"+a),s.zip.compressImage({src:i.filename,dst:a,quality:50,format:"jpg",width:"50%",height:"50%"},function(s){console.log(s),console.log("压缩成功"),e.share(t,o,s.target)},function(s){console.log(s),e.share(t,o,!1)})}else console.log("下载失败: "+n),e.share(t,o,!1)}).start():e.share(t,o,!1)},share:function(t,o,e){var s=window.plus;!1===e&&(e="_www/img/mp.png");var i={type:"miniProgram",title:o,thumbs:[e],content:"公主购：一个专注省钱的会员制电商平台~",miniProgram:{id:"gh_a0cfbcaf8fa2",path:"pages/hotArticle/hotArticle?id="+t+"&name="+o,webUrl:"https://share.gongzhugou.com/"+"downApp/downApp.html",type:2},extra:{scene:"WXSceneSession"}};this.sharewx?this.isAuth(i):s.nativeUI.alert("当前环境不支持微信分享操作!")},isAuth:function(t){console.log("判断是否授权"),console.log(t),this.sharewx.authenticated?this.shareAction(t):this.sharewx.authorize(function(){this.shareAction(t)},function(t){console.log("认证授权失败")})},shareAction:function(t){console.log("开始分享"),console.log(t),this.sharewx.send(t,function(){console.log("分享成功！")},function(t){console.log("失败失败啊"+t.message)})},showList:function(){this.listShow=!0,this.noScroll=!0},hideList:function(){this.listShow=!1}}},r={render:function(){var t=this,o=t.$createElement,e=t._self._c||o;return e("div",[e("common-header",{attrs:{h_title:t.h_title,bgcolor:t.head_color}}),t._v(" "),e("div",{staticStyle:{height:"0.9rem"},attrs:{id:"find"}}),t._v(" "),e("div",{staticClass:"hot_article"},[e("div",{staticClass:"hot_info"},[e("div",{staticClass:"hot_title"},[t._v("\n        "+t._s(t.articleInfo.title)+"\n      ")]),t._v(" "),e("div",{staticClass:"hot_other"},[e("div",{staticClass:"other_time"},[t._v(t._s(t.articleInfo.updatetime))]),t._v(" "),e("div",{staticClass:"other_icon"},[e("i",{staticClass:"iconfont icon-16pxyuedu"}),t._v(" "),e("span",[t._v(t._s(t.articleInfo.click_nums)+"人已阅读")])])]),t._v(" "),t._l(t.articleInfo.content,function(o,s){return e("div",{key:s,staticClass:"hot_content"},[1==o.type?e("div",{staticClass:"hot_rich"},[e("div",{staticClass:"pro_html",domProps:{innerHTML:t._s(o.content)}})]):t._e(),t._v(" "),2==o.type?e("div",{staticClass:"hot_pro"},[e("div",{staticClass:"pro",on:{click:function(e){return t.goPro("normal",o.content,"")}}},[e("img",{staticStyle:{width:"7rem"},attrs:{src:o.goods.img}}),t._v(" "),e("div",{staticClass:"pro_price"},[1==o.goods.deal_type?e("span",[t._v("¥"+t._s(o.goods.price_sell))]):t._e(),t._v(" "),o.goods.deal_type>=4?e("span",[t._v("¥"+t._s(o.goods.price_sell)+"+")]):t._e(),t._v(" "),1!=o.goods.deal_type?e("i",{staticClass:"iconfont icon-jifen1"}):t._e(),t._v(" "),2==o.goods.deal_type||3==o.goods.deal_type?e("span",[t._v(t._s(o.goods.point))]):t._e(),t._v(" "),o.goods.deal_type>=4?e("span",[t._v(t._s(o.goods.point))]):t._e(),t._v(" "),e("span",[t._v("|去购买")])])])]):t._e(),t._v(" "),3==o.type?e("div",{staticClass:"hot_pro"},[e("div",{staticClass:"pro",on:{click:function(e){return t.goPro("group",o.activity_id,o.content)}}},[e("img",{staticStyle:{width:"7rem"},attrs:{src:o.goods.img}}),t._v(" "),e("div",{staticClass:"pro_price"},[1==o.goods.deal_type?e("span",[t._v("¥"+t._s(o.goods.price_sell))]):t._e(),t._v(" "),o.goods.deal_type>=4?e("span",[t._v("¥"+t._s(o.goods.price_sell)+"+")]):t._e(),t._v(" "),1!=o.goods.deal_type?e("i",{staticClass:"iconfont icon-jifen1"}):t._e(),t._v(" "),2==o.goods.deal_type||3==o.goods.deal_type?e("span",[t._v(t._s(o.goods.point))]):t._e(),t._v(" "),o.goods.deal_type>=4?e("span",[t._v(t._s(o.goods.point))]):t._e(),t._v(" "),e("span",[t._v("|去购买")])])])]):t._e(),t._v(" "),4==o.type?e("div",{staticClass:"hot_pro"},[e("div",{staticClass:"pro",on:{click:function(e){return t.gotryPro(o.activity_id)}}},[e("img",{staticStyle:{width:"7rem"},attrs:{src:o.goods.img}}),t._v(" "),e("div",{staticClass:"pro_price"},[1==o.goods.deal_type?e("span",[t._v("¥"+t._s(o.goods.price_sell))]):t._e(),t._v(" "),o.goods.deal_type>=4?e("span",[t._v("¥"+t._s(o.goods.price_sell)+"+")]):t._e(),t._v(" "),1!=o.goods.deal_type?e("i",{staticClass:"iconfont icon-jifen1"}):t._e(),t._v(" "),2==o.goods.deal_type||3==o.goods.deal_type?e("span",[t._v(t._s(o.goods.point))]):t._e(),t._v(" "),o.goods.deal_type>=4?e("span",[t._v(t._s(o.goods.point))]):t._e(),t._v(" "),e("span",[t._v("|去购买")])])])]):t._e()])})],2)]),t._v(" "),e("div",{staticClass:"goIndex",attrs:{"data-link":"../index/index"},on:{click:t.goIndex}},[e("i",{staticClass:"iconfont icon-home"})]),t._v(" "),e("div",{staticClass:"goShare",on:{click:function(o){return t.zipImg(t.articleInfo.id,t.articleInfo.title)}}},[e("i",{staticClass:"iconfont icon-fenxiang2"})])],1)},staticRenderFns:[]};var d=e("VU/8")(l,r,!1,function(t){e("Iyga")},"data-v-073333e0",null);o.default=d.exports},Iyga:function(t,o){}});
//# sourceMappingURL=69.f1e077e7d6e15e2c9d60.js.map