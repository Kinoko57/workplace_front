webpackJsonp([44],{E8sS:function(e,o){},UpqO:function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var s=t("Dd8w"),i=t.n(s),d=t("fqE/"),a=t("Au9i"),r=t("gyMJ"),c=t("NYxO"),n={name:"name",components:{commonHeader:d.a,InfiniteScroll:a.InfiniteScroll,Indicator:a.Indicator,Button:a.Button,Lazyload:a.Lazyload,Toast:a.Toast,Picker:a.Picker},data:function(){return{imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",h_title:"确认支付",try_id:"",allowbind:!0,specNum:1,ispayStep:!1,pid:null,isFree:"",proDetail:[],couList:[],addList:[],payType:[],trackList:[],payslots:[{defaultIndex:0,values:["微信支付","支付宝支付"]}],trackslots:[{defaultIndex:0,values:[]}],channels:"",trackName:"选择物流",trackId:"",payId:2,addType:0,addrId:0,order_memo:"",staticAdd:[],static_freight:0,chooseAdd:0,couInfo:"选择优惠券",couId:"",couValue:-1,couCode:"",couRevise:!1,addRevise:!1,orderDetail:{total_price:0,total_score:0,freight:0},hiddenCou:!1,orderType:"",order_pid:"",default_cou:"",hiddenModel:!1,hiddenPay:!1,paytype:"wxPay"}},mounted:function(){a.Indicator.open("加载中...");var e=this.$route.query;this.pid=e.id,this.addType=e.addType,void 0!==e.try_id&&(this.try_id=e.try_id),void 0!==e.proType&&(this.orderType=e.proType),void 0!==e.group_normal&&(0===e.group_normal||"0"===e.group_normal?(this.orderType="normal",this.hiddenCou=!0):this.orderType="normal"),this.getOrder(),"true"===window.localStorage.getItem("neworder")&&window.localStorage.setItem("memo",""),""!==window.localStorage.getItem("memo")&&(this.order_memo=window.localStorage.getItem("memo"));var o=this;window.plus.payment.getChannels(function(e){o.channels=e},function(e){console.log("获取支付通道列表失败："+e.message)})},methods:i()({},Object(c.c)({setChoseAddr:"SET_CHOSEADDR"}),{goTop:function(){console.log("回到顶部"),document.getElementById("sureorder").scrollIntoView({block:"start",behavior:"smooth"})},showModel:function(e){"track"===e&&(this.hiddenModel=!0),"pay"==e&&(this.hiddenPay=!0)},hideModel:function(){this.hiddenModel=!1},hidePayModel:function(){this.hiddenPay=!1},onValuesChange:function(e,o){this.trackName=o[0]},onPayChange:function(e,o){"微信支付"==o[0]?this.paytype="wxPay":this.paytype="aliPay"},chosePayModel:function(){"wxPay"==this.paytype?this.payId=2:this.payId=3,this.hiddenPay=!1},choseModel:function(){for(var e=0;e<this.trackList.length;e++)this.trackList[e].row.name===this.trackName&&(this.trackName=this.trackList[e].row.name,this.trackslots[0].defaultIndex=e,this.trackId=this.trackList[e].row.id,this.static_freight=this.trackList[e].cost);var o=this;-1!==o.couCode.indexOf("c=")&&(o.couCode=o.couCode.substring(2)),"try"===o.orderType?o.addType=4:"point"===o.orderType?o.addType=5:"birthday"===o.orderType?o.addType=5:"scan"===o.orderType&&(o.addType=3);var t="";t=o.staticAdd.length>0?o.staticAdd[0].id:"";var s={shipmethod_id:o.trackId,coupon_code:o.couCode,coupon_id:o.couId,checked:o.pid,cart_type:o.addType,type:o.orderType,address_id:t};Object(r._7)(s).then(function(e){e.isSuccess&&(o.orderDetail.total_price=e.amount,o.static_freight=e.cost_freight,o.hiddenModel=!1)})},golink:function(e){var o={couisrevise:!1,addisRevise:!1,chooseAdd:"",couInfo:"",couList:[],default_cou:"",choseId:"",ship_id:"",addType:"",orderType:"",staticAdd:[],amount:"",couCode:""};this.setChoseAddr(o),-1!==this.couCode.indexOf("c=")&&(o.choseId=this.couCode.substring(2)),o.couisrevise=this.couRevise,o.addisRevise=this.addRevise,o.couCode=this.couCode,o.couList=this.couList,o.chooseAdd=this.chooseAdd,o.couInfo=this.couInfo,o.default_cou=this.default_cou,o.ship_id=this.trackId,o.addType=this.addType,o.staticAdd=this.staticAdd,o.orderType=this.orderType,o.amount=this.orderDetail.total_price,""!==this.order_memo&&window.localStorage.setItem("memo",this.order_memo),this.setChoseAddr(o),this.$router.togo({path:"/useCoupon?pid="+this.order_pid})},choseAdd:function(){"try"===this.orderType?this.addType=4:"point"===this.orderType?this.addType=5:"birthday"===this.orderType?this.addType=5:"scan"===this.orderType&&(this.addType=3);var e={chooseAdd:0,couInfo:"",couId:"",couCode:"",couList:[],default_cou:"",choseId:"",ship_id:"",addType:"",orderType:"",staticAdd:[],amount:"",couisrevise:!1,addisRevise:!1};this.setChoseAddr(e),console.log(this.couCode),-1!==this.couCode.indexOf("c=")&&(e.choseId=this.couCode.substring(2)),e.couisrevise=this.couRevise,e.addisRevise=this.addRevise,e.couCode=this.couCode,e.chooseAdd=this.chooseAdd,e.couInfo=this.couInfo,e.couId=this.couId,e.couList=this.couList,e.default_cou=this.default_cou,e.ship_id=this.trackId,e.addType=this.addType,e.staticAdd=this.staticAdd,e.orderType=this.orderType,e.amount=this.orderDetail.total_price,""!==this.order_memo&&window.localStorage.setItem("memo",this.order_memo),this.setChoseAddr(e),this.$router.togo({path:"/editInfo?code=address&codename=我的地址&isInput=1&type=choose&pid="+this.pid})},payOver:function(e){if(this.staticAdd.length<=0)Object(a.Toast)({message:"请选择收货地址",duration:1e3});else if(this.allowbind){a.Indicator.open("提交中..."),this.allowbind=!1;var o=this,t="";if("exchange"===o.orderType?t="exchange":"try"===o.orderType?(t="try",o.addType=4):"point"===o.orderType?(t="point",o.addType=5):"birthday"===o.orderType?(t="birthday",o.addType=5):"scan"===o.orderType&&(t="scan",o.addType=3),console.log(o.orderType),console.log(t),"group"===o.orderType){var s={order_memo:o.order_memo,cart_type:o.addType,address_id:o.staticAdd[0].id,shipmethod_id:o.trackId};Object(r._43)(s).then(function(e){a.Indicator.close(),o.orderDetail.total_price<=0?(window.localStorage.setItem("memo",""),o.$router.replace({path:"/groupResult?type=pay&orderId="+e.order_id})):e.isSuccess?(2==o.payId&&(console.log("微信支付"),s={id:e.order_id,pay_id:o.payId,pay_payment:"wechatapp"}),3==o.payId&&(console.log("支付宝支付"),s={id:e.order_id,pay_id:o.payId,pay_payment:"alipayapp"}),o.wxPayment(s)):(o.allowbind=!0,Object(a.Toast)({message:e.msg,duration:1e3}))})}else{-1===o.couCode.indexOf("c=")&&(o.couCode="c="+o.couCode);var i={checked:o.pid,order_memo:o.order_memo,is_point:0,print_freeze:0,total_amount:o.orderDetail.total_price,cart_type:o.addType,type:o.orderType,cart_params:o.couCode,address_id:o.staticAdd[0].id,shipmethod_id:o.trackId,coupon_id:o.couId,try_id:o.try_id};Object(r._44)(i).then(function(e){if(e.isSuccess)if(console.log(e),a.Indicator.close(),o.orderDetail.total_price<=0)window.localStorage.setItem("memo",""),o.$router.replace({path:"/paySuccess?addrId="+o.staticAdd[0].id});else{var t={};2==o.payId&&(console.log("微信支付"),t={id:e.order_id,pay_id:o.payId,pay_payment:"wechatapp"}),3==o.payId&&(console.log("支付宝支付"),t={id:e.order_id,pay_id:o.payId,pay_payment:"alipayapp"}),a.Indicator.close(),o.wxPayment(t)}else a.Indicator.close(),o.allowbind=!0,Object(a.Toast)({message:e.msg,duration:1e3})})}}},wxPayment:function(e){var o=this;console.log(e),Object(r._46)(e).then(function(t){if(console.log(t),t.isSuccess){console.log(t.data),console.log("支付通道");var s=window.plus,i={},d=o.channels[0];2==o.payId&&(d=o.channels[0],i={appid:t.data.appId,noncestr:t.data.nonceStr,package:t.data.package,partnerid:t.data.partnerid,prepayid:t.data.prepayid,timestamp:t.data.timeStamp,sign:t.data.paySign}),3==o.payId&&(d=o.channels[1],i=t.data.orderstr),console.log("最终选择付款方式"),console.log(d),console.log(i),s.payment.request(d,i,function(){console.log("验证支付回调是否成功"),"group"===o.orderType?(window.localStorage.setItem("memo",""),o.$router.replace({path:"/groupResult?type=pay&orderId="+e.id}),o.allowbind=!0):(window.localStorage.setItem("memo",""),o.$router.replace({path:"/paySuccess?addrId="+o.staticAdd[0].id}))},function(e){console.log(e.message),o.allowbind=!0,o.$router.replace({path:"/order",name:"Order",params:{id:1,tid:1}})})}else Object(a.Toast)({message:t.msg,duration:1e3})})},getOrder:function(){var e=this;if(e.staticAdd=[],"0"===e.addType){var o={checked:e.pid,cart_params:e.couCode};Object(r.Z)(o).then(function(o){if(a.Indicator.close(),o.isSuccess){e.orderDetail={total_price:o.amount,total_score:o.point_use,freight:o.cost_freight},null!=o.row_address?(e.chooseAdd=0,e.staticAdd.push(o.row_address)):e.chooseAdd=-1,-1===o.coupon_code.indexOf("c=")&&(o.coupon_code="c="+o.coupon_code),o.coupon_discount>0&&(e.couInfo="已减"+o.coupon_discount+"元"),e.couCount=o.coupon_discount,e.proDetail=o.rows_product,e.payType=o.rows_payments,e.couList=o.xianjinquans,e.addList=o.rows_address,e.staticAdd=e.staticAdd,e.couInfo=e.couInfo,e.addrId=o.address_id,e.chooseAdd=e.chooseAdd,e.default_cou=o.coupon_code,e.couCode=o.coupon_code,e.couId=o.coupon_id,e.trackList=o.rows_shipmethod,e.static_freight=o.cost_freight,console.log(e.static_freight),e.isFree=o.free_freight;for(var t=[],s=0;s<e.proDetail.length;s++)for(var i=0;i<e.proDetail[s].rows_product.length;i++)t.push(e.proDetail[s].rows_product[i].product_id);for(var d=[],r=0;r<o.rows_shipmethod.length;r++)d.push(o.rows_shipmethod[r].row.name);if(e.order_pid=t.join(","),e.trackslots[0].values=d,e.trackName=o.rows_shipmethod[0].row.name,e.trackId=o.rows_shipmethod[0].row.id,console.log("false"===window.localStorage.getItem("neworder")),"false"===window.localStorage.getItem("neworder")){var c=e.$store.state.home.choseAddr;if(console.log(c),void 0!==c.couInfo){e.couInfo=c.couInfo,e.couValue=c.couValue,e.couCode=c.couCode,e.couId=c.couId,e.orderDetail.total_price=c.amount;var n="",l="",_=[];e.addRevise=c.addisRevise,console.log("是否更换了地址"+c.addisRevise),void 0!==e.addRevise?(n=c.chooseAdd,l=c.staticAdd):(n=e.chooseAdd,l=e.staticAdd),e.couRevise=c.couisrevise,console.log("是否更换过优惠券"+c.couisrevise),_=e.couRevise?c.couList:e.couList,console.log(_),e.chooseAdd=n,e.staticAdd=l,e.couList=_,e.static_freight=c.static_freight,null===e.couValue&&(e.couInfo="选择优惠券")}console.log(e.orderDetail)}}else Object(a.Toast)({message:o.msg,duration:1e3}),setTimeout(function(){e.$router.back()},1e3)})}else if("3"===e.addType)if(console.log(e.orderType),"exchange"===e.orderType||"try"===e.orderType||"point"===e.orderType||"birthday"===e.orderType||"scan"===e.orderType){var t={checked:e.pid,type:e.orderType};Object(r._0)(t).then(function(o){if(a.Indicator.close(),o.isSuccess){e.orderDetail={total_price:o.amount,total_score:o.point_use,freight:o.cost_freight},null!=o.row_address?(e.chooseAdd=0,e.staticAdd.push(o.row_address)):e.chooseAdd=-1,e.proDetail=o.rows_product,e.payType=o.rows_payments,e.orderDetail=e.orderDetail,e.couList=o.xianjinquans,e.addList=o.rows_address,e.staticAdd=e.staticAdd,e.addrId=o.address_id,e.chooseAdd=e.chooseAdd,e.trackList=o.rows_shipmethod,e.static_freight=o.cost_freight,e.isFree=o.free_freight;for(var t=[],s=0;s<o.rows_shipmethod.length;s++)t.push(o.rows_shipmethod[s].row.name);if(e.trackslots[0].values=t,e.trackName=o.rows_shipmethod[0].row.name,e.trackId=o.rows_shipmethod[0].row.id,console.log(e.$store.state.home.choseAddr),"false"===window.localStorage.getItem("neworder")){var i=e.$store.state.home.choseAddr;if(console.log(i),void 0!==i.couInfo){e.couInfo=i.couInfo,e.couValue=i.couValue,e.couCode=i.couCode,e.couId=i.couId,e.orderDetail.total_price=i.amount;var d="",r="",c=[];e.addRevise=i.addisRevise,console.log("是否更换了地址"+i.addisRevise),void 0!==e.addRevise?(d=i.chooseAdd,r=i.staticAdd):(d=e.chooseAdd,r=e.staticAdd),e.couRevise=i.couisrevise,console.log("是否更换过优惠券"+i.couisrevise),c=e.couRevise?i.couList:e.couList,e.chooseAdd=d,e.staticAdd=r,e.couList=c,e.static_freight=i.static_freight,null===e.couValue&&(e.couInfo="选择优惠券")}console.log(e.orderDetail)}}else Object(a.Toast)({message:o.msg,duration:1e3}),setTimeout(function(){e.$router.back()},1e3)})}else{var s={checked:e.pid,cart_params:e.couCode,type:"normal"};Object(r.Y)(s).then(function(o){if(a.Indicator.close(),o.isSuccess){e.orderDetail={total_price:o.amount,total_score:o.point_use,freight:o.cost_freight},o.coupon_discount>0&&(e.couValue=o.coupon_discount),null!=o.row_address?(e.chooseAdd=0,e.staticAdd.push(o.row_address)):e.chooseAdd=-1,-1!==e.couValue&&(-1===o.coupon_code.indexOf("c=")&&(o.coupon_code="c="+o.coupon_code),e.couInfo="已减"+e.couValue+"元"),e.setDatacouCount=o.coupon_discount,e.proDetail=o.rows_product,e.payType=o.rows_payments,e.orderDetail=e.orderDetail,e.couList=o.xianjinquans,e.addList=o.rows_address,e.staticAdd=e.staticAdd,e.couInfo=e.couInfo,e.addrId=o.address_id,e.chooseAdd=e.chooseAdd,e.default_cou=o.coupon_code,e.couCode=o.coupon_code,e.couId=o.coupon_id,e.trackList=o.rows_shipmethod,e.static_freight=o.cost_freight;for(var t=[],s=0;s<e.proDetail.length;s++)for(var i=0;i<e.proDetail[s].rows_product.length;i++)t.push(e.proDetail[s].rows_product[i].product_id);for(var d=[],r=0;r<o.rows_shipmethod.length;r++)d.push(o.rows_shipmethod[r].row.name);if(e.order_pid=t.join(","),e.trackslots[0].values=d,e.trackName=o.rows_shipmethod[0].row.name,e.trackId=o.rows_shipmethod[0].row.id,console.log(e.$store.state.home.choseAddr),"false"===window.localStorage.getItem("neworder")){var c=e.$store.state.home.choseAddr;if(console.log(c),console.log(c.couInfo),void 0!==c.couInfo){e.couInfo=c.couInfo,e.couValue=c.couValue,e.couCode=c.couCode,e.couId=c.couId,e.orderDetail.total_price=c.amount;var n="",l="",_=[];e.addRevise=c.addisRevise,console.log("是否更换了地址"+c.addisRevise),void 0!==e.addRevise?(n=c.chooseAdd,l=c.staticAdd):(n=e.chooseAdd,l=e.staticAdd),e.couRevise=c.couisrevise,console.log("是否更换过优惠券"+c.couisrevise),_=e.couRevise?c.couList:e.couList,e.chooseAdd=n,e.staticAdd=l,e.couList=_,e.static_freight=c.static_freight,null===e.couValue&&(e.couInfo="选择优惠券")}console.log(e.orderDetail)}}else Object(a.Toast)({message:o.msg,duration:1e3}),setTimeout(function(){e.$router.back()},1e3)})}else if("2"===e.addType){Object(r._1)({}).then(function(o){if(a.Indicator.close(),o.isSuccess){e.orderDetail={total_price:o.amount,total_score:o.point_use,freight:o.cost_freight},null!=o.row_address?(e.chooseAdd=0,e.staticAdd.push(o.row_address)):e.chooseAdd=-1,e.proDetail=o.rows_product,e.payType=o.rows_payments,e.orderDetail=e.orderDetail,e.couList=o.xianjinquans,e.addList=o.rows_address,e.staticAdd=e.staticAdd,e.addrId=o.address_id,e.chooseAdd=e.chooseAdd,e.trackList=o.rows_shipmethod,e.static_freight=o.cost_freight,e.isFree=o.free_freight;for(var t=[],s=0;s<o.rows_shipmethod.length;s++)t.push(o.rows_shipmethod[s].row.name);if(e.trackslots[0].values=t,e.trackName=o.rows_shipmethod[0].row.name,e.trackId=o.rows_shipmethod[0].row.id,console.log(e.$store.state.home.choseAddr),"false"===window.localStorage.getItem("neworder")){var i=e.$store.state.home.choseAddr;if(console.log(i),void 0!==i.couInfo){e.couInfo=i.couInfo,e.couValue=i.couValue,e.couCode=i.couCode,e.couId=i.couId,e.orderDetail.total_price=i.amount;var d="",r="",c=[];e.addRevise=i.addisRevise,console.log("是否更换了地址"+i.addisRevise),void 0!==e.addRevise?(d=i.chooseAdd,r=i.staticAdd):(d=e.chooseAdd,r=e.staticAdd),e.couRevise=i.couisrevise,console.log("是否更换过优惠券"+i.couisrevise),c=e.couRevise?i.couList:e.couList,e.chooseAdd=d,e.staticAdd=r,e.couList=c,e.static_freight=i.static_freight,null===e.couValue&&(e.couInfo="选择优惠券")}console.log(e.orderDetail)}}else Object(a.Toast)({message:o.msg,duration:1e3}),setTimeout(function(){e.$router.back()},1e3)})}}}),computed:i()({},Object(c.b)(["number","carnum","isbind","score","news","newsnum","issign"])),beforeDestroy:function(){"true"===window.localStorage.getItem("neworder")&&window.localStorage.setItem("memo","")}},l={render:function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",[t("common-header",{attrs:{h_title:e.h_title,showback:!0}}),e._v(" "),t("return-top",{on:{returnTop:e.goTop}}),e._v(" "),t("div",{staticStyle:{height:"0.9rem"},attrs:{id:"sureorder"}}),e._v(" "),t("div",{staticClass:"sure_order"},[t("div",{staticClass:"sure_body"},[t("div",{staticClass:"sure_head"},[e._l(e.staticAdd,function(o,s){return t("div",{key:s,staticClass:"sure_addr",on:{click:e.choseAdd}},[t("div",{staticClass:"sure_addr_info"},[t("i",{staticClass:"iconfont icon-address"}),e._v(" "),t("div",{staticStyle:{"margin-left":"0.2rem"}},[t("span",{staticClass:"add_more"},[e._v(e._s(o.ship_name))]),e._v(" "),t("span",{staticStyle:{"margin-left":"0.3rem"}},[e._v(e._s(o.ship_mobile))]),e._v(" "),"1"==o.is_default?t("span",{staticClass:"static"},[e._v("默认")]):e._e(),e._v(" "),t("div",[t("span",{staticStyle:{"margin-right":"0.1rem"}},[e._v(e._s(o.ship_area))]),e._v(e._s(o.ship_addr))])])]),e._v(" "),t("i",{staticClass:"iconfont icon-youjiantou1"})])}),e._v(" "),-1==e.chooseAdd?t("div",{staticClass:"sure_addr",on:{click:e.choseAdd}},[t("i",{staticClass:"iconfont icon-address",attrs:{hidden:-1==e.chooseAdd}}),e._v(" "),t("span",{staticClass:"add_tips"},[e._v("选择收货地址")]),e._v(" "),t("i",{staticClass:"iconfont icon-youjiantou1"})]):e._e(),e._v(" "),t("img",{attrs:{src:e.imgPath+"sale/s_bg.jpg"}})],2),e._v(" "),e._l(e.proDetail,function(o,s){return t("div",{key:s,staticClass:"sure_pro"},[t("div",{staticClass:"sure_pro_title"},[0!=o.third_id?t("span",{staticClass:"third_title"},[e._v(e._s(o.third_name))]):e._e(),e._v(" "),0==o.third_id?t("span",{staticClass:"third_title"},[e._v("平台自营")]):e._e(),e._v(" "),0!=o.third_id?t("span",{staticClass:"order_tag"},[e._v("包邮")]):e._e(),e._v(" "),0==o.third_id&&e.static_freight<=0?t("span",{staticClass:"order_tag"},[e._v("包邮")]):e._e()]),e._v(" "),e._l(o.rows_product,function(o,s){return t("div",{key:s,staticClass:"order_pro"},[t("div",{staticClass:"car_pro"},[t("div",{staticClass:"pro_img"},[t("img",{attrs:{src:o.goods.img}})]),e._v(" "),t("div",{staticClass:"pro_info"},[t("div",{staticClass:"pro_title"},[e._v(e._s(o.name))]),e._v(" "),t("div",{staticClass:"pro_spec"},[""!=o.title?t("div",{staticClass:"pro_weight"},[t("span",[e._v("规格:"+e._s(o.title))])]):e._e(),e._v(" "),t("div",{staticClass:"pro_price"},[t("div",{staticStyle:{display:"flex","align-items":"center"}},[1!=o.deal_type?t("div",{staticClass:"pro_inter_img"},[t("i",{staticClass:"iconfont icon-jifen1"})]):e._e(),e._v(" "),2==o.deal_type||3==o.deal_type?t("span",{staticClass:"pro_integral"},[e._v(e._s(o.point))]):e._e(),e._v(" "),o.deal_type>=4?t("span",{staticClass:"pro_integral"},[e._v(e._s(o.point))]):e._e(),e._v(" "),o.deal_type>=4?t("span",{staticClass:"pro_integral_add"},[e._v("+")]):e._e(),e._v(" "),o.deal_type>=4?t("span",{staticClass:"peo_nowprice"},[e._v("￥"+e._s(o.price_sell))]):e._e(),e._v(" "),1==o.deal_type?t("span",{staticClass:"peo_nowprice"},[e._v("￥"+e._s(o.price_sell))]):e._e()]),e._v(" "),t("div",{staticClass:"pro_icon",staticStyle:{display:"inline-flex","align-items":"center"}},[t("span",[e._v("x"+e._s(o.quantity))])])])])])])])}),e._v(" "),t("div",{staticClass:"pro_block"},[t("span",[e._v("商品总额")]),e._v(" "),t("div",{staticClass:"pro_tips"},[t("span",[e._v("￥"+e._s(o.total_amount))])])]),e._v(" "),0==o.third_id?t("div",{staticClass:"pro_block"},[t("span",[e._v("积分总额")]),e._v(" "),t("div",{staticClass:"pro_tips"},[t("span",[e._v(e._s(o.total_point))])])]):e._e(),e._v(" "),t("div",{staticClass:"pro_block"},[t("span",[e._v("商品运费")]),e._v(" "),t("div",{staticClass:"pro_tips"},[0!=o.third_id?t("span",[e._v("￥"+e._s(o.cost_freight))]):e._e(),e._v(" "),0==o.third_id&&e.static_freight>0?t("span",[e._v("￥"+e._s(e.static_freight))]):e._e(),e._v(" "),0==o.third_id&&e.static_freight<=0?t("span",[e._v("￥0.00")]):e._e()])])],2)}),e._v(" "),t("div",{staticClass:"sure_other"},["normal"==e.orderType&&e.orderDetail.total_score<=0&&0==e.hiddenCou?t("div",{staticClass:"other_blcok"},[e._m(0),e._v(" "),t("div",{on:{click:e.golink}},[t("span",[e._v(e._s(e.couInfo))]),e._v(" "),t("i",{staticClass:"iconfont icon-youjiantou1"})])]):e._e(),e._v(" "),t("div",{staticClass:"other_blcok"},[e._m(1),e._v(" "),t("div",[e.static_freight>0?t("span",[e._v("￥"+e._s(e.static_freight))]):e._e(),e._v(" "),0==e.static_freight||void 0==e.static_freight?t("span",[e._v("免运费")]):e._e()])]),e._v(" "),t("div",{staticClass:"other_blcok"},[e._m(2),e._v(" "),t("div",{staticStyle:{display:"inline-flex","align-items":"center"}},[t("div",{staticClass:"picker",staticStyle:{"font-size":"0.24rem",color:"#555","font-family":"'DIN'"}},["2"==e.payId?t("img",{staticStyle:{width:"1.48rem",height:"0.53rem","vertical-align":"middle"},attrs:{src:e.imgPath+"sale/wx_pay.png"}}):t("img",{staticStyle:{width:"1.48rem",height:"0.5rem","vertical-align":"middle"},attrs:{src:e.imgPath+"sale/ali_pay.png"}})])])]),e._v(" "),null!=e.orderDetail.total_score&&e.orderDetail.total_score>0||"birthday"==e.orderType?t("div",{staticClass:"other_blcok"},[e._m(3),e._v(" "),t("div",[t("span",{staticClass:"sure_score"},[e._v(e._s(e.orderDetail.total_score)+"积分")])])]):e._e(),e._v(" "),t("div",{staticClass:"other_blcok"},[e._m(4),e._v(" "),t("div",[t("span",{staticClass:"sure_price"},[e._v("￥"+e._s(e.orderDetail.total_price))])])])])],2),e._v(" "),t("div",{staticClass:"null_height"}),e._v(" "),t("div",{staticClass:"sure_btn"},[t("mt-button",{attrs:{size:"large"},on:{click:e.payOver}},[e._v("确认支付")])],1)]),e._v(" "),e.hiddenModel?t("div",{staticClass:"model_bg",on:{click:e.hideModel}}):e._e(),e._v(" "),e.hiddenModel?t("div",{staticClass:"model"},[t("div",{staticClass:"model_head"},[t("span",{on:{click:e.hideModel}},[e._v("取消")]),e._v(" "),t("span",{on:{click:e.choseModel}},[e._v("确认")])]),e._v(" "),t("div",{staticClass:"model_picker"},[t("mt-picker",{attrs:{slots:e.trackslots},on:{change:e.onValuesChange}})],1)]):e._e(),e._v(" "),e.hiddenPay?t("div",{staticClass:"model_pay_bg",on:{click:e.hidePayModel}}):e._e(),e._v(" "),e.hiddenPay?t("div",{staticClass:"model_pay"},[t("div",{staticClass:"model_head"},[t("span",{on:{click:e.hidePayModel}},[e._v("取消")]),e._v(" "),t("span",{on:{click:e.chosePayModel}},[e._v("确认")])]),e._v(" "),t("div",{staticClass:"model_picker"},[t("mt-picker",{attrs:{slots:e.payslots},on:{change:e.onPayChange}})],1)]):e._e()],1)},staticRenderFns:[function(){var e=this.$createElement,o=this._self._c||e;return o("div",{staticClass:"type"},[o("span",[this._v("优惠券")])])},function(){var e=this.$createElement,o=this._self._c||e;return o("div",{staticClass:"type"},[o("span",[this._v("运费")])])},function(){var e=this.$createElement,o=this._self._c||e;return o("div",{staticClass:"type"},[o("span",[this._v("支付方式")])])},function(){var e=this.$createElement,o=this._self._c||e;return o("div",{staticClass:"type"},[o("span",[this._v("应付积分")])])},function(){var e=this.$createElement,o=this._self._c||e;return o("div",{staticClass:"type"},[o("span",[this._v("应付总额")])])}]};var _=t("VU/8")(n,l,!1,function(e){t("E8sS")},"data-v-62a82193",null);o.default=_.exports}});
//# sourceMappingURL=44.590ee59fb9d792230316.js.map