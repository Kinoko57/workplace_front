webpackJsonp([47],{"5lt6":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=i("fqE/"),s=i("Au9i"),n=i("gyMJ"),r={name:"AfterDetail",components:{commonHeader:o.a,InfiniteScroll:s.InfiniteScroll,Indicator:s.Indicator,Button:s.Button,Lazyload:s.Lazyload,Toast:s.Toast,MessageBox:s.MessageBox},data:function(){return{h_title:"售后详情",procomm:"",track_name:"",track_number:"",uploadimg:[],uploadOk:!1,imgShow:!1,img_show_big:"",tempFilePaths:[],imgs:[],ischose:"",pid:"",order_Id:"",orderInfo:{refund_info:{}},flag:0,order_type:"",imgPath:"https://share.gongzhugou.com/static/image/xcx_img/"}},mounted:function(){s.Indicator.open("加载中..."),console.log(this.$route.query);var t=this.$route.query;this.pid=t.pid,this.order_Id=t.orderId,this.order_type=t.order_type,this.getInfo()},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("coll").scrollIntoView({block:"start",behavior:"smooth"})},getInfo:function(){var t=this,e={order_id:t.order_Id,product_id:t.pid};Object(n.z)(e).then(function(e){s.Indicator.close(),e.isSuccess&&(t.orderInfo=e.data,t.ischose=void 0===e.data.refund_info.type?"refunds":e.data.refund_info.type,t.imgs=void 0===e.data.refund_info.img?[]:e.data.refund_info.img,t.flag=e.data.flag,t.track_name=void 0===e.data.refund_info.express?"":e.data.refund_info.express,t.track_number=void 0===e.data.refund_info.express_no?"":e.data.refund_info.express_no)})},afterSale:function(t,e){this.$router.togo({path:"/saleAfter?pid="+t+"&orderId="+e+"&order_type="+this.order_type})},previewImg:function(t){this.imgShow=!0,this.img_show_big=t},hiddenImg:function(){this.imgShow=!1},afterCancel:function(t,e){var i=this,o=window.plus;window.plus?o.nativeUI.confirm("是否确定取消当前售后申请？",function(o){if(console.log("Close confirm: "+o.index),0===o.index||"0"===o.index){var r={order_id:e,product_id:t};Object(n.i)(r).then(function(t){t.isSuccess?(Object(s.Toast)({message:"成功取消",iconClass:"iconfont icon-dui1",duration:1e3}),setTimeout(function(){i.$router.back()},1e3)):Object(s.Toast)({message:t.msg,duration:1e3})})}else console.log("用户点击取消")},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"}):Object(s.MessageBox)({title:"提示",message:"是否确定取消当前售后申请？",showCancelButton:!0,closeOnClickModal:!1}).then(function(o){if("confirm"===o){var r={order_id:e,product_id:t};Object(n.i)(r).then(function(t){t.isSuccess?(Object(s.Toast)({message:"成功取消",iconClass:"iconfont icon-dui1",duration:1e3}),setTimeout(function(){i.$router.back()},1e3)):Object(s.Toast)({message:t.msg,duration:1e3})})}else console.log("用户点击取消")})}}},a={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("common-header",{attrs:{h_title:t.h_title,showback:!0}}),t._v(" "),i("return-top",{on:{returnTop:t.goTop}}),t._v(" "),i("div",{staticStyle:{height:"0.9rem"}}),t._v(" "),i("div",{staticClass:"sale_after"},[t._m(0),t._v(" "),i("div",{staticClass:"after_pro"},[i("div",{staticClass:"title"},[t._v("订单编号："+t._s(t.orderInfo.order_id))]),t._v(" "),i("div",{staticClass:"car_pro"},[i("div",{staticClass:"pro_img"},[null!=t.orderInfo.img&&""!=t.orderInfo.img?i("img",{attrs:{src:t.orderInfo.img}}):i("img",{attrs:{src:t.imgPath+"pro/static.png"}})]),t._v(" "),i("div",{staticClass:"pro_info"},[i("div",{staticClass:"pro_title"},[i("span",[t._v(t._s(t.orderInfo.name))])]),t._v(" "),i("div",{staticClass:"pro_spec"},[i("div",{staticClass:"pro_price"},[""!=t.orderInfo.title&&null!=t.orderInfo.title?i("div",{staticClass:"spec_info"},[t._v("规格:"+t._s(t.orderInfo.title))]):t._e(),t._v(" "),i("div",{staticStyle:{display:"flex","align-items":"center"}},[t.orderInfo.price>0?i("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(t.orderInfo.price))]):t._e(),t._v(" "),t.orderInfo.price>0&&t.orderInfo.point>0?i("span",{staticClass:"peo_nowprice"},[t._v("+")]):t._e(),t._v(" "),t.orderInfo.point>0?i("div",{staticClass:"pro_inter_img"},[i("i",{staticClass:"iconfont icon-jifen1"})]):t._e(),t._v(" "),t.orderInfo.point>0?i("span",{staticClass:"pro_integral"},[t._v(t._s(t.orderInfo.point))]):t._e()])])])])])]),t._v(" "),i("div",{staticClass:"after_progress"},[i("div",{staticClass:"title"},[t._v("售后进度")]),t._v(" "),i("div",{staticClass:"progress_info"},[t.orderInfo.flag>=-1?i("div",{staticClass:"step"},[i("i",{staticClass:"iconfont icon-duigoudaibiankuang"}),t._v(" "),i("span",[t._v("提交申请")])]):t._e(),t._v(" "),t.orderInfo.flag>=-1?i("div",{staticClass:"step_line"},[i("i",{staticClass:"iconfont icon-progress"})]):t._e(),t._v(" "),-1==t.orderInfo.flag?i("div",{staticClass:"step"},[i("i",{staticClass:"iconfont icon-bohui",staticStyle:{color:"red"}}),t._v(" "),i("span",{staticStyle:{color:"red"}},[t._v("已驳回")])]):t._e(),t._v(" "),t.orderInfo.flag>=1?i("div",{staticClass:"step"},[i("i",{class:t.orderInfo.flag>=2?"iconfont icon-duigoudaibiankuang":"iconfont icon-wait"}),t._v(" "),i("span",[t._v("等待审核")])]):t._e(),t._v(" "),t.orderInfo.flag>=2?i("div",{staticClass:"step_line"},[i("i",{staticClass:"iconfont icon-progress"})]):t._e(),t._v(" "),t.orderInfo.flag>=2?i("div",{staticClass:"step"},[i("i",{class:t.orderInfo.flag>=3?"iconfont icon-duigoudaibiankuang":"iconfont icon-wait"}),t._v(" "),"refunds"==t.orderInfo.refund_info.type?i("span",[t._v("退款")]):i("span",[t._v("确认收货")])]):t._e(),t._v(" "),t.orderInfo.flag>=3?i("div",{staticClass:"step_line"},[i("i",{staticClass:"iconfont icon-progress"})]):t._e(),t._v(" "),t.orderInfo.flag>=3?i("div",{staticClass:"step"},[i("i",{class:3==t.orderInfo.flag?"iconfont icon-duigoudaibiankuang":"iconfont icon-wait"}),t._v(" "),i("span",[t._v("完成")])]):t._e()])]),t._v(" "),i("div",{staticClass:"prob_descr"},[i("div",{staticClass:"title"},[t._v("\n        问题描述\n      ")]),t._v(" "),0!=t.orderInfo.flag?i("div",{staticClass:"after_com"},[i("span",[t._v(t._s(t.orderInfo.refund_info.content))]),t._v(" "),i("div",{staticClass:"com_imgList"},t._l(t.orderInfo.refund_info.img,function(e,o){return i("div",{key:o,staticClass:"imgBlock"},[i("img",{attrs:{src:e},on:{click:function(i){return t.previewImg(e)}}})])}),0)]):t._e()]),t._v(" "),-1==t.orderInfo.flag?i("div",{staticClass:"prob_descr"},[i("div",{staticClass:"title"},[t._v("驳回理由")]),t._v(" "),i("div",{staticClass:"after_com"},[i("span",[t._v(t._s(t.orderInfo.refund_info.reject_reason))])])]):t._e(),t._v(" "),i("div",{staticClass:"after_info"},[i("div",{staticClass:"title"},[t._v("售后信息")]),t._v(" "),i("div",{staticClass:"after_info_list"},[i("div",[i("span",[t._v("服务类型：")]),t._v(" "),"refunds"==t.orderInfo.refund_info.type?i("span",{staticClass:"text_active"},[t._v("退款")]):t._e(),t._v(" "),"reship"==t.orderInfo.refund_info.type?i("span",{staticClass:"text_active"},[t._v("退货退款")]):t._e(),t._v(" "),"barter"==t.orderInfo.refund_info.type?i("span",{staticClass:"text_active"},[t._v("换货")]):t._e()]),t._v(" "),i("div",[i("span",[t._v("申请时间：")]),t._v(" "),i("span",{staticClass:"text_active"},[t._v(t._s(t.orderInfo.refund_info.create_time))])]),t._v(" "),"refunds"!=t.orderInfo.refund_info.type&&t.orderInfo.flag>=2?i("div",[i("span",[t._v("卖家留言：")]),t._v(" "),i("span",{staticClass:"text_active"},[t._v(t._s(t.orderInfo.refund_info.reject_reason))])]):t._e(),t._v(" "),"refunds"!=t.orderInfo.refund_info.type&&""!=t.orderInfo.refund_info.express?i("div",[i("span",[t._v("快递公司：")]),t._v(" "),i("span",[t._v(t._s(t.track_name))])]):t._e(),t._v(" "),"refunds"!=t.orderInfo.refund_info.type&&""!=t.orderInfo.refund_info.express_no?i("div",[i("span",[t._v("快递单号：")]),t._v(" "),i("span",[t._v(t._s(t.track_number))])]):t._e()])]),t._v(" "),t.flag>=0&&t.flag<3?i("div",{staticClass:"comBtn"},["refunds"!=t.orderInfo.refund_info.type&&2==t.orderInfo.flag&&""==t.orderInfo.refund_info.express?i("span",{on:{click:function(e){return t.afterSale(t.pid,t.order_Id)}}},[t._v("填写物流")]):i("span",{on:{click:function(e){return t.afterSale(t.pid,t.order_Id)}}},[t._v("修改申请")]),t._v(" "),i("span",{on:{click:function(e){return t.afterCancel(t.pid,t.order_Id)}}},[t._v("取消申请")])]):t._e(),t._v(" "),-1==t.flag&&0==t.orderInfo.is_apply?i("div",{staticClass:"comBtn"},[i("span",{on:{click:function(e){return t.afterSale(t.pid,t.order_Id)}}},[t._v("重新申请")])]):t._e()]),t._v(" "),t.imgShow?i("div",{staticClass:"pro_com_img_bg",attrs:{catchtouchmove:"ture"},on:{click:t.hiddenImg}}):t._e(),t._v(" "),t.imgShow?i("div",{staticClass:"pro_com_img",attrs:{catchtouchmove:"ture"},on:{click:t.hiddenImg}},[i("img",{attrs:{src:t.img_show_big,alt:""},on:{click:t.hiddenImg}})]):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"after_head"},[e("span",[this._v("本次售后服务由")]),this._v(" "),e("span",{staticClass:"name"},[this._v("公主购")]),this._v("为您提供\n    ")])}]};var d=i("VU/8")(r,a,!1,function(t){i("pd7+")},"data-v-578d110d",null);e.default=d.exports},"pd7+":function(t,e){}});
//# sourceMappingURL=47.3bc09a43cc399123ed91.js.map