webpackJsonp([57],{Yo6c:function(t,s){},eRZu:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("Dd8w"),a=e.n(i),o=e("NYxO"),c=e("fqE/"),r=e("Jtwt"),n=e("Au9i"),l=e("gyMJ"),h={components:{commonHeader:c.a,Toast:n.Toast,MessageBox:n.MessageBox,Indicator:n.Indicator,Button:n.Button,returnTop:r.a},data:function(){return{head_color:{background:"#f9f9f9",color:"#000"},isMember:this.$store.state.home.is_member,value:"",h_title:"购物车",miss_point:!1,isShow:!0,full_amount:0,difference:0,navNtn:3,carList:[],recomList:[],isEdit:!1,isChose:!1,scoreAll:!1,totalScore:0,scoreNum:0,priceAll:0,discountAll:0,allchose:!1,total:0,total_amout:0,recom_total:0,carNum:!1,proType:"normal",maxNum:0,choseNum:0,activeInput:!1}},mounted:function(){var t=window.localStorage;!0!==t.getItem("isLogin")&&"true"!==t.getItem("isLogin")||(n.Indicator.open("加载中..."),this.getRecom(),this.getList())},methods:a()({},Object(o.c)({setCarPro:"SET_CARPRO",setCarAmount:"SET_CARAMOUNT",setCarScore:"SET_CARSCORE",setCarShip:"SET_CARSHIP",setCarDifference:"SET_CARDIFFERENCE",setCarnum:"SET_CARNUM"}),{goTop:function(){console.log("回到顶部"),document.getElementById("car").scrollIntoView({block:"start",behavior:"smooth"})},isInput:function(){this.activeInput=!0},sureOrder:function(){if(!1===this.activeInput){for(var t=[],s=0,e=this.carList.length;s<e;s++)this.carList[s].checked&&t.push(this.carList[s].product_id);t.length<=0?Object(n.Toast)({message:"请选择商品进行结算",duration:1e3}):Number(this.totalScore)<Number(this.scoreNum)?Object(n.Toast)({message:"用户积分不足",duration:1e3}):"false"===this.$store.state.home.isbind||!1===this.$store.state.home.isbind?this.$router.replace({path:"/bind?visit=4"}):(window.plus&&window.plus.key.hideSoftKeybord(),window.localStorage.setItem("neworder",!0),this.$router.togo({path:"/sureOrder?addType=0&proType=normal&id="+t.join(",")}))}},goLink:function(t){this.setCarAmount(this.priceAll),this.setCarShip(this.full_amount),this.setCarDifference(this.difference),this.$router.togo({path:t})},goPro:function(t,s){this.setCarAmount(this.priceAll),this.setCarShip(this.full_amount),this.setCarDifference(this.difference),""===s||this.$router.togo({path:"/proDetail?type="+t+"&id="+s})},delCar:function(){for(var t=this,s=[],e=0,i=this.carList.length;e<i;e++)this.carList[e].checked&&s.push(this.carList[e].product_id);if(s.length<=0)Object(n.Toast)({message:"请选择要操作的商品",duration:1e3});else{var a=window.plus;window.plus?a.nativeUI.confirm("是否删除选中商品?",function(e){console.log("Close confirm: "+e.index),0===e.index||"0"===e.index?Object(l.p)(s.join(",")).then(function(s){s.isSuccess&&(Object(n.Toast)({message:"删除成功",iconClass:"iconfont icon-dui1",duration:1e3}),t.setCarPro([]),t.allchose=0,t.priceAll=(0).toFixed(2),t.difference=(0).toFixed(2),t.scoreNum=0,t.choseNum=0,t.isChose=!1,t.getList())}):console.log("用户点击取消")},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"}):Object(n.MessageBox)({title:"提示",message:"是否删除选中商品?",showCancelButton:!0,closeOnClickModal:!1}).then(function(e){"confirm"===e?Object(l.p)(s.join(",")).then(function(s){s.isSuccess&&(Object(n.Toast)({message:"删除成功",iconClass:"iconfont icon-dui1",duration:1e3}),t.setCarPro([]),t.allchose=0,t.priceAll=(0).toFixed(2),t.difference=(0).toFixed(2),t.scoreNum=0,t.choseNum=0,t.isChose=!1,t.getList())}):console.log("用户点击取消")})}},addCar:function(t,s,e){var i=this;if(e>0){var a={pid:t,quantity:1,checked:0,deal_type:s};Object(l.e)(a).then(function(s){if(s.isSuccess){if(i.$store.state.home.carpro.length<=0)i.setCarPro([t]);else{for(var e=i.$store.state.home.carpro,a=0;a<e.length&&e[a]!==t;a++);a>=e.length&&e.push(t),i.setCarPro(e)}Object(n.Toast)({message:"加入购物车成功",iconClass:"iconfont icon-dui1"}),i.p=1,i.scoreNum=0,i.priceAll=0,i.getList()}else Object(n.Toast)({message:s.msg})})}else Object(n.Toast)({message:"当前商品无库存"})},checkAll:function(){this.allchose=!this.allchose,this.isChose=!0;for(var t=[],s=!0,e=0,i=this.carList.length;e<i;e++)if(!1===this.carList[e].checked){s=!1;break}if(console.log(s),s){for(var a=0;a<this.carList.length;a++)this.carList[a].checked=!1;this.setCarPro([]),this.allchose=!1,this.priceAll=(0).toFixed(2),this.difference=(0).toFixed(2),this.scoreNum=0,this.choseNum=0,this.isChose=!1,this.miss_point=!1}else{for(var o=0,c=0,r=0,n=0;n<this.carList.length;n++)this.carList[n].checked=!0,t.push(this.carList[n].product_id),o+=Number(this.carList[n].point)*this.carList[n].quantity*100,c+=1e4*Number(this.carList[n].price_cart)*this.carList[n].quantity,r+=100*(Number(this.carList[n].price_market)-Number(this.carList[n].price_cart))*this.carList[n].quantity/100;this.priceAll=c,this.choseNum=this.carList.length;for(var l=0;l<this.carList.length;l++)if(!1===this.carList[l].checked){this.isChose=!1;break}e>=this.carList.length&&(this.allchose=!0,this.isChose=!0,this.setCarPro(t)),this.isEdit||(this.scoreAll=!0),!0===this.allchose&&(this.priceAll=this.total_amout),this.allchose=!0,this.scoreNum=o/100,this.priceAll=(c/1e4).toFixed(2),this.difference=((1e4*this.full_amount-c)/1e4).toFixed(2),this.discountAll=r.toFixed(2),!1===this.isEdit&&this.scoreNum>this.totalScore?this.miss_point=!0:this.miss_point=!1}},chosePro:function(t){t.checked=!t.checked,this.isChose=!0;var s=[];this.setCarPro([]);for(var e=0,i=0,a=0,o=0,c=this.carList.length;o<c;o++)this.carList[o].checked&&(e+=parseInt(this.carList[o].point)*this.carList[o].quantity*100,i+=1e4*parseFloat(this.carList[o].price_cart)*this.carList[o].quantity,a+=100*(parseInt(this.carList[o].price_market)-parseInt(this.carList[o].price_cart))*this.carList[o].quantity/100,s.push(this.carList[o].product_id));var r=this.carList.every(function(t){return t.checked});this.allchose=!!r,this.priceAll=i,this.isEdit||(this.scoreAll=!0),this.scoreNum=e/100,this.priceAll=(i/1e4).toFixed(2),this.difference=((1e4*this.full_amount-i)/1e4).toFixed(2),this.discountAll=a.toFixed(2),!1===this.isEdit&&this.scoreNum>this.totalScore?this.miss_point=!0:this.miss_point=!1,0==s.length&&(this.isChose=!1),console.log(s),this.setCarPro(s),this.choseNum=s.length},edit:function(){this.isEdit=!this.isEdit,this.scoreAll=!1;for(var t=0,s=this.carList.length;t<s;t++)this.carList[t].checked&&(this.scoreAll=!0)},addNum:function(t,s){var e=parseInt(s);e++;for(var i=0,a=this.carList.length;i<a;i++)this.carList[i].product_id===t&&(e>this.carList[i].store_usefull?(Object(n.Toast)({message:"库存不足",duration:1e3}),this.carList[i].quantity=this.carList[i].store_usefull):this.carList[i].quantity=e);console.log(this.scoreNum),this.upPro(t,e)},lessNum:function(t,s){for(var e=parseInt(s),i=0,a=this.carList.length;i<a;i++)this.carList[i].product_id===t&&(e<=1?e=1:e--,this.carList[i].quantity=e);this.upPro(t,e)},changeValue:function(t,s){for(var e=0,i=this.carList.length;e<i;e++)this.carList[e].product_id===t&&(s<=1?this.carList[e].quantity=1:Number(s)>Number(this.carList[e].store_usefull)?(Object(n.Toast)({message:"库存不足",duration:1e3}),this.carList[e].quantity=this.carList[e].store_usefull):this.carList[e].quantity=s);this.upPro(t,s)},upPro:function(t,s){var e=this,i=this,a={pid:t,quantity:s};Object(l._45)(a).then(function(a){if(a.isSuccess)e.upspec();else{if(Object(n.Toast)({message:a.msg,duration:1e3}),void 0!==a.num)i.maxNum=a.num;else for(var o=0;o<i.carList.length;o++)i.carList[o].product_id===t&&(i.carList[o].quantity=s-1);e.upspec()}})},upspec:function(){for(var t=0,s=0,e=0,i=0,a=this.carList.length;i<a;i++)this.carList[i].checked&&(t+=Number(this.carList[i].point)*this.carList[i].quantity*100,s+=1e4*Number(this.carList[i].price_cart)*this.carList[i].quantity,e+=100*(Number(this.carList[i].price_market)-Number(this.carList[i].price_cart))*this.carList[i].quantity/100);this.scoreNum=t/100,this.priceAll=(s/1e4).toFixed(2),this.difference=((1e4*this.full_amount-s)/1e4).toFixed(2),this.discountAll=e.toFixed(2),!1===this.isEdit&&this.scoreNum>this.totalScore?this.miss_point=!0:this.miss_point=!1,this.activeInput=!1},getList:function(){var t=this,s=this;Object(l.B)().then(function(e){if(n.Indicator.close(),e.isSuccess){if(!1===e.data.rows&&(s.carList=[],s.total=e.data.rows_total,s.carNum=!1,s.total_amout=e.data.rows_total,s.full_amount=e.data.free_freight,s.choseNum=0),e.data.rows.length>0){t.carNum=!0;for(var i=0;i<e.data.rows.length;i++)e.data.rows[i].checked=!1;var a=[];s.$store.state.home.carpro.length>0&&(a=s.$store.state.home.carpro);var o=0,c=0,r=0;if(console.log(a),a.length>0){for(var l=0;l<a.length;l++)for(var h=0;h<e.data.rows.length;h++)a[l]===e.data.rows[h].product_id&&(e.data.rows[h].checked=!0,o+=Number(e.data.rows[h].point)*e.data.rows[h].quantity*100,c+=1e4*Number(e.data.rows[h].price_cart)*e.data.rows[h].quantity,r+=100*(Number(e.data.rows[h].price_market)-Number(e.data.rows[h].price_cart))*e.data.rows[h].quantity/100);!1===t.isEdit&&o/100>e.data.member_point?s.miss_point=!0:s.miss_point=!1,s.isChose=!0}s.full_amount=e.data.free_freight,s.carList=e.data.rows,s.total=e.data.rows_total,s.total_amout=e.data.rows_total,s.scoreNum=o/100,s.priceAll=(c/1e4).toFixed(2),s.difference=((1e4*e.data.free_freight-c)/1e4).toFixed(2),s.discountAll=r.toFixed(2),s.choseNum=a.length,s.totalScore=e.data.member_point,a.length===e.data.rows.length&&(s.allchose=!0,s.isChose=!0)}else s.carNum=!1;s.setCarnum(s.total)}})},getRecom:function(){var t=this;Object(l.C)({type:1}).then(function(s){s.isSuccess&&(t.recomList=s.data,t.recom_total=s.total)})}}),computed:a()({},Object(o.b)(["number"]))},_={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[e("common-header",{attrs:{h_title:t.h_title,showback:!1,bgcolor:t.head_color}}),t._v(" "),e("div",{staticStyle:{height:"0.9rem"},attrs:{id:"car"}}),t._v(" "),e("return-top",{on:{returnTop:t.goTop}}),t._v(" "),t.isShow?e("div",{staticClass:"my_car"},[t.carNum?e("div",{staticClass:"car_header"},[e("span",[t._v("共有"),e("span",{staticClass:"car_num"},[t._v(t._s(t.total))]),t._v("件商品")]),t._v(" "),t.isEdit?t._e():e("span",{staticClass:"car_edit",on:{click:t.edit}},[t._v("编辑")]),t._v(" "),t.isEdit?e("span",{staticClass:"car_edit",on:{click:t.edit}},[t._v("完成")]):t._e()]):t._e(),t._v(" "),t.carNum?e("div",{staticClass:"car_body"},[e("div",{staticClass:"car_list"},t._l(t.carList,function(s,i){return e("div",{key:i,staticClass:"car_pro"},[e("div",{staticClass:"pro_chose"},[e("input",{directives:[{name:"model",rawName:"v-model",value:s.checked,expression:"item.checked"}],attrs:{id:s.product_id,type:"checkbox"},domProps:{checked:s.checked,checked:Array.isArray(s.checked)?t._i(s.checked,null)>-1:s.checked},on:{click:function(e){return t.chosePro(s)},change:function(e){var i=s.checked,a=e.target,o=!!a.checked;if(Array.isArray(i)){var c=t._i(i,null);a.checked?c<0&&t.$set(s,"checked",i.concat([null])):c>-1&&t.$set(s,"checked",i.slice(0,c).concat(i.slice(c+1)))}else t.$set(s,"checked",o)}}}),t._v(" "),e("label",{attrs:{for:s.product_id}})]),t._v(" "),e("div",{staticClass:"pro_img",on:{click:function(e){return t.goPro("normal",s.goods_id)}}},[e("img",{attrs:{src:s.goods.img}})]),t._v(" "),e("div",{staticClass:"pro_info"},[e("div",{staticClass:"pro_title",on:{click:function(e){return t.goPro("normal",s.goods_id)}}},[s.goods.is_third>0?e("span",{staticClass:"pro_price_third"},[t._v(t._s(s.goods.third_name))]):e("span",{staticClass:"pro_price_third"},[t._v("平台自营")]),t._v(" "),1==s.goods.is_gift_zone?e("span",{staticClass:"pro_price_gift"},[t._v(t._s(s.goods.gift_title))]):t._e(),t._v("\n            "+t._s(s.name))]),t._v(" "),""!=s.title?e("span",{staticClass:"pro_spec_info"},[t._v("规格："+t._s(s.title))]):t._e(),t._v(" "),e("div",{staticClass:"pro_spec"},[e("div",{staticClass:"pro_price"},[e("div",[2!=s.deal_type&&3!=s.deal_type?e("div",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(s.price_cart)+" ")]):t._e(),t._v(" "),2==s.deal_type||3==s.deal_type||s.deal_type>=4?e("div",{staticClass:"pro_inter_img"},[e("i",{staticClass:"iconfont icon-jifen1"})]):t._e(),t._v(" "),2==s.deal_type||3==s.deal_type||s.deal_type>=4?e("span",{staticClass:"pro_integral"},[t._v(t._s(s.point))]):t._e()])]),t._v(" "),e("div",{staticClass:"pro_icon"},[e("mt-button",{staticClass:"pro_btn",attrs:{size:"small"},on:{click:function(e){return t.lessNum(s.product_id,s.quantity)}}},[t._v("-")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:s.quantity,expression:"item.quantity"}],attrs:{type:"number"},domProps:{value:s.quantity},on:{blur:function(e){return t.changeValue(s.product_id,s.quantity)},focus:t.isInput,input:function(e){e.target.composing||t.$set(s,"quantity",e.target.value)}}}),t._v(" "),e("mt-button",{staticClass:"pro_btn",attrs:{size:"small"},on:{click:function(e){return t.addNum(s.product_id,s.quantity)}}},[t._v("+")])],1)])])])}),0)]):t._e(),t._v(" "),t.carNum?t._e():e("div",{staticClass:"car_body_null"},[e("span",[t._v("您的购物车是空的，快去选购吧~")]),t._v(" "),e("button",{staticClass:"btn_red",on:{click:function(s){return t.goLink("/index")}}},[t._v("去首页看看")])]),t._v(" "),e("div",{staticClass:"recom_info"},[e("span",{staticClass:"i_title"},[t._v("—————— 大家都在找 ——————")]),t._v(" "),e("div",{staticClass:"recom_list"},t._l(t.recomList,function(s,i){return e("div",{key:i,staticClass:"i_pro"},[e("div",{staticClass:"pro_img",on:{click:function(e){return t.goPro("normal",s.goods_id)}}},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:s.img,expression:"item.img"}],attrs:{src:s.img}})]),t._v(" "),e("div",{staticClass:"pro_title",on:{click:function(e){return t.goPro("normal",s.goods_id)}}},[t._v("\n            "+t._s(s.name))]),t._v(" "),e("div",{staticClass:"pro_price"},[e("div",{staticStyle:{display:"inline-flex"}},[e("div",{staticClass:"pro_flex",attrs:{hidden:2==s.deal_type}},[1==s.deal_type?e("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(s.price_sell)),t.isMember?e("span",{staticStyle:{color:"#ff8d97","font-size":"0.23rem"}},[t._v(" / 赚"+t._s(s.back_rebate))]):t._e()]):t._e(),t._v(" "),s.deal_type>=4?e("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(s.price_sell)),t.isMember?e("span",{staticStyle:{color:"#ff8d97","font-size":"0.23rem"}},[t._v(" / 赚"+t._s(s.back_rebate))]):t._e(),t._v("+")]):t._e()]),t._v(" "),e("div",{staticClass:"pro_flex",attrs:{hidden:1==s.deal_type}},[t._m(0,!0),t._v(" "),2==s.deal_type||3==s.deal_type?e("span",{staticClass:"pro_integral"},[t._v(t._s(s.point))]):t._e(),t._v(" "),1!=s.deal_type&&2!=s.deal_type&&3!=s.deal_type?e("span",{staticClass:"pro_integral"},[t._v(t._s(s.point))]):t._e()])]),t._v(" "),e("div",{staticClass:"pro_flex"},[e("i",{staticClass:"iconfont icon-car",on:{click:function(e){return t.addCar(s.product_id,s.deal_type,s.buy_count)}}})])])])}),0)]),t._v(" "),t.carNum?e("div",{staticClass:"order-car"},[e("span",[t._v("—————— 我是有底线的 ——————")])]):t._e(),t._v(" "),t.isChose&&null!=t.full_amount&&!t.isEdit?e("div",{staticClass:"car_score"},[t.scoreNum>0&&!t.isEdit?e("div",{staticClass:"score"},[e("span",[t._v("需消费积分")]),t._v(" "),e("span",{staticClass:"total_score"},[t._v(t._s(t.scoreNum))]),t._v(" "),e("span",[t._v("点")])]):t._e(),t._v(" "),t.difference>0?e("div",{staticClass:"shipping"},[e("span",[t._v("购满")]),t._v(" "),e("span",{staticClass:"total_score"},[t._v(t._s(t.full_amount))]),t._v(" "),e("span",[t._v("元包邮,还差")]),t._v(" "),e("span",{staticClass:"total_score"},[t._v(t._s(t.difference))]),t._v(" "),e("span",[t._v("元")]),t._v(" "),e("span",{staticClass:"total_score join_total",on:{click:function(s){return t.goLink("/single")}}},[t._v("立即凑单")])]):t._e(),t._v(" "),t.difference<=0?e("div",{staticClass:"shipping"},[e("span",[t._v("已享受满")]),t._v(" "),e("span",{staticClass:"total_score"},[t._v(t._s(t.full_amount))]),t._v(" "),e("span",[t._v("元包邮")])]):t._e()]):t._e(),t._v(" "),t.isChose&&null==t.full_amount&&t.scoreNum>0&&!t.isEdit?e("div",{staticClass:"car_score"},[t.scoreNum>0&&!t.isEdit?e("div",{staticClass:"score"},[e("span",[t._v("需消费积分")]),t._v(" "),e("span",{staticClass:"total_score"},[t._v(t._s(t.scoreNum))]),t._v(" "),e("span",[t._v("点")])]):t._e()]):t._e(),t._v(" "),t.carNum?e("div",{staticClass:"car_edit_more"},[e("div",{staticClass:"allCheck"},[e("div",{staticClass:"checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.allchose,expression:"allchose"}],attrs:{type:"checkbox",id:"all"},domProps:{checked:1==t.allchose,checked:Array.isArray(t.allchose)?t._i(t.allchose,null)>-1:t.allchose},on:{click:t.checkAll,change:function(s){var e=t.allchose,i=s.target,a=!!i.checked;if(Array.isArray(e)){var o=t._i(e,null);i.checked?o<0&&(t.allchose=e.concat([null])):o>-1&&(t.allchose=e.slice(0,o).concat(e.slice(o+1)))}else t.allchose=a}}}),t._v(" "),e("label",{attrs:{for:"all"}})]),t._v(" "),e("span",[t._v("全选")]),t._v(" "),t.isEdit?t._e():e("div",{staticClass:"car_pro_total"},[t._v("合计：￥\n          "),e("span",[t._v(t._s(t.priceAll))])])]),t._v(" "),t.isEdit||0!=t.miss_point?t._e():e("mt-button",{attrs:{size:"small"},on:{click:t.sureOrder}},[t._v("结算("+t._s(t.choseNum)+"件)")]),t._v(" "),t.isEdit||1!=t.miss_point?t._e():e("mt-button",{staticStyle:{background:"#d3d3d3"},attrs:{size:"small"}},[t._v("积分不足")]),t._v(" "),t.isEdit?e("mt-button",{attrs:{size:"small"},on:{click:t.delCar}},[t._v("删除")]):t._e()],1):t._e()]):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"pro_inter_img"},[s("i",{staticClass:"iconfont icon-jifen1"})])}]};var d=e("VU/8")(h,_,!1,function(t){e("Yo6c")},"data-v-2b4a07be",null);s.default=d.exports}});
//# sourceMappingURL=57.b307c61a7960853ebef6.js.map