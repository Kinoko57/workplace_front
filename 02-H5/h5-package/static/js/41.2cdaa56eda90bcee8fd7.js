webpackJsonp([41],{"O8G/":function(t,i){},R1MM:function(t,i,o){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=o("fqE/"),e=o("Au9i"),a=o("WVZN"),n=o("gyMJ"),c={name:"MyComment",components:{commonHeader:s.a,InfiniteScroll:e.InfiniteScroll,Indicator:e.Indicator,Button:e.Button,Lazyload:e.Lazyload,Toast:e.Toast},data:function(){return{h_title:"我的评价",showImg:!1,comList:[],commOrder:[],userInfo:{avatar:"",nickname:"",username:"",isShow:0},page:1,limit:10,total:0,order_total:0,imgShow:!1,loading:!0,imgPath:"https://share.gongzhugou.com/static/image/xcx_img/"}},mounted:function(){e.Indicator.open("加载中..."),this.userInfo=this.$store.state.home.userInfo,this.getList()},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("com").scrollIntoView({block:"start",behavior:"smooth"})},goIndex:function(){this.$router.replace({path:"/index"})},goLink:function(t,i){var o=t;""!==i&&(o=t+i),this.$router.togo({path:o})},goOrder:function(t,i,o){this.$router.togo({path:t,name:"Order",params:{id:i,tid:o}})},goComm:function(t,i,o){this.$router.togo({path:t+"?num="+i+"&orderId="+o})},getList:function(){var t=this,i={page:t.page,limit:t.limit};Object(n.S)(i).then(function(i){if(e.Indicator.close(),i.isSuccess){for(var o=0;o<i.data.rows.length;o++)i.data.rows[o].createtime=Object(a.c)(i.data.rows[o].createtime,"{y}-{m}-{d}");t.comList=i.data.rows,t.total=i.data.total,t.loading=!1}}),Object(n._32)().then(function(i){i.isSuccess&&null!==i.row&&(t.commOrder=i.rows,t.order_total=i.total)})},loadMore:function(){var t=this;t.loading=!0;var i={page:++t.page,limit:t.limit};Object(n.S)(i).then(function(i){if(e.Indicator.close(),i.isSuccess)if(null!==i.data.rows&&i.data.rows.length>0){for(var o=0;o<i.data.rows.length;o++)i.data.rows[o].createtime=Object(a.c)(i.data.rows[o].createtime,"{y}-{m}-{d}");t.comList=t.comList.concat(i.data.rows),t.total=i.data.total,t.loading=!1}else t.loading=!0})},previewImg:function(t){this.imgShow=!0,this.img_show_big=t},hiddenImg:function(){this.imgShow=!1}}},r={render:function(){var t=this,i=t.$createElement,o=t._self._c||i;return o("div",[o("common-header",{attrs:{h_title:t.h_title,showback:!0}}),t._v(" "),o("return-top",{on:{returnTop:t.goTop}}),t._v(" "),o("div",{staticStyle:{height:"0.9rem"},attrs:{id:"com"}}),t._v(" "),o("div",{staticClass:"my_comment"},[o("div",{staticClass:"com_body"},[o("div",{staticClass:"com_user"},[o("div",{staticClass:"user_info"},[o("img",{staticStyle:{width:"0.64rem",height:"0.61rem","border-radius":"50%"},attrs:{src:t.userInfo.avatar}}),t._v(" "),o("span",[t._v(t._s(t.userInfo.nickname))])]),t._v(" "),o("div",{staticClass:"con_btn",on:{click:function(i){return t.goOrder("/order",5,6)}}},[t._v("写评论")])]),t._v(" "),t.commOrder.length>0?o("div",{staticClass:"com_write"},[o("div",{staticClass:"write_title"},[t._v("\n          没有来得及评价的宝贝，还有机会去评论！\n        ")]),t._v(" "),o("div",{staticClass:"write_imglist"},[t._l(t.commOrder,function(i,s){return o("img",{key:s,attrs:{src:i.rows[0].first_img},on:{click:function(o){return t.goComm("/addComment",i.rows[0].order_items.length,i.rows[0].order_id)}}})}),t._v(" "),t.order_total>4?o("div",{staticClass:"null_img",on:{click:function(i){return t.goOrder("/order",5,6)}}},[o("span",[t._v("查看更多")])]):t._e()],2)]):t._e(),t._v(" "),t.comList.length>0?o("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"com_list",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"30"}},[o("div",{staticClass:"com_head"},[t._v("全部评论")]),t._v(" "),t._l(t.comList,function(i,s){return o("div",{key:s,staticClass:"com_info"},[o("div",{staticClass:"com_info_head"},[o("div",{staticClass:"com_users"},[o("img",{staticStyle:{width:"0.64rem",height:"0.61rem","border-radius":"50%"},attrs:{src:t.userInfo.avatar}}),t._v(" "),o("span",[t._v(t._s(t.userInfo.nickname))])]),t._v(" "),o("div",{staticClass:"star_level"},[i.score<1?o("i",{staticClass:"iconfont icon-star"}):t._e(),t._v(" "),i.score>=1?o("i",{staticClass:"iconfont icon-xingping light"}):t._e(),t._v(" "),i.score<2?o("i",{staticClass:"iconfont icon-star"}):t._e(),t._v(" "),i.score>=2?o("i",{staticClass:"iconfont icon-xingping light"}):t._e(),t._v(" "),i.score<3?o("i",{staticClass:"iconfont icon-star"}):t._e(),t._v(" "),i.score>=3?o("i",{staticClass:"iconfont icon-xingping light"}):t._e(),t._v(" "),i.score<4?o("i",{staticClass:"iconfont icon-star"}):t._e(),t._v(" "),i.score>=4?o("i",{staticClass:"iconfont icon-xingping light"}):t._e(),t._v(" "),i.score<5?o("i",{staticClass:"iconfont icon-star"}):t._e(),t._v(" "),i.score>=5?o("i",{staticClass:"iconfont icon-xingping light"}):t._e()])]),t._v(" "),o("div",{staticClass:"com_pro_info"},[o("span",[t._v(t._s(i.createtime))]),t._v("规格:\n            "),t._v(" "),o("span",[t._v(t._s(i.title))])]),t._v(" "),o("div",{staticClass:"com_text"},[t._v("\n            "+t._s(i.comment)+"\n          ")]),t._v(" "),o("div",{staticClass:"com_img"},t._l(i.pic,function(i,s){return o("img",{key:s,attrs:{src:i},on:{click:function(o){return t.previewImg(i)}}})}),0),t._v(" "),o("div",{staticClass:"com_pro_more",on:{click:function(o){return t.goLink("/proDetail?type=normal&id=",i.goods_id)}}},[o("div",{staticClass:"pro_img"},[o("img",{attrs:{src:i.goods_image}})]),t._v(" "),o("div",{staticClass:"pro_more_info"},[o("div",{staticClass:"pro_name"},[t._v(t._s(i.name))]),t._v(" "),o("div",{staticClass:"pro_spec"},[t._v("\n                规格:\n                "),o("span",[t._v(t._s(i.title))])]),t._v(" "),o("div",{staticClass:"pro_price"},[o("span",{staticClass:"price"},[t._v(t._s(i.proPrice_n))]),t._v(" "),i.proScore>0?o("i",{staticClass:"iconfont icon-jifen1"}):t._e(),t._v(" "),i.proScore>0?o("span",{staticClass:"score"},[t._v(t._s(i.proScore))]):t._e()]),t._v(" "),o("div",{staticClass:"pro_oldprice"},[t._v(t._s(i.proPrice_o))])])])])}),t._v(" "),o("button",{staticStyle:{border:"none",background:"#f2f2f2"},attrs:{type:"default",size:"default",loading:"",plain:"",hidden:"comList.length==total"}},[t._v("加载中...")])],2):t._e(),t._v(" "),t.comList.length==t.total&&t.total>0?o("div",{staticClass:"order-foot"},[o("span",[t._v("—————— 我是有底线的 ——————")])]):t._e(),t._v(" "),t.comList.length<=0?o("div",{staticClass:"com_list_null"},[o("img",{attrs:{src:t.imgPath+"pro/null_1.png"}})]):t._e()])]),t._v(" "),o("div",{staticClass:"goIndex",attrs:{"data-link":"../index/index"},on:{click:t.goIndex}},[o("i",{staticClass:"iconfont icon-home"})]),t._v(" "),t.imgShow?o("div",{staticClass:"pro_com_img_bg",attrs:{catchtouchmove:"ture"},on:{click:t.hiddenImg}}):t._e(),t._v(" "),t.imgShow?o("div",{staticClass:"pro_com_img",attrs:{catchtouchmove:"ture"},on:{click:t.hiddenImg}},[o("img",{attrs:{src:t.img_show_big,alt:""},on:{click:t.hiddenImg}})]):t._e()],1)},staticRenderFns:[]};var l=o("VU/8")(c,r,!1,function(t){o("O8G/")},"data-v-6627ee28",null);i.default=l.exports}});
//# sourceMappingURL=41.2cdaa56eda90bcee8fd7.js.map