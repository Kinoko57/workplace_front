webpackJsonp([72],{QtUc:function(t,e){},hmC2:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("Dd8w"),a=s.n(i),o=s("fqE/"),n=s("Au9i"),r=s("gyMJ"),c=s("NYxO"),l={name:"Single",components:{commonHeader:o.a,InfiniteScroll:n.InfiniteScroll,Indicator:n.Indicator,Button:n.Button,Lazyload:n.Lazyload,Toast:n.Toast},data:function(){return{imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",h_title:"凑单列表",isMember:this.$store.state.home.is_member,height:"",topNum:0,brandHeight:0,allowScorll:!0,isShow:!1,hiddenFixed:!0,vipDetail:0,navNtn:2,page:1,pagesize:6,vipList:[],vipBg:null,isSign:!0,total:0,top:0,amount:0,difference:0,full_amount:0,is_load:!0}},mounted:function(){n.Indicator.open("加载中..."),console.log(this.$store.state.home),this.amount=this.$store.state.home.carAmount,this.difference=this.$store.state.home.carDifference,this.full_amount=this.$store.state.home.carShip,this.getList()},methods:a()({},Object(c.c)({setCarPro:"SET_CARPRO",setCarAmount:"SET_CARAMOUNT",setCarDifference:"SET_CARDIFFERENCE"}),{goTop:function(){console.log("回到顶部"),document.getElementById("single").scrollIntoView({block:"start",behavior:"smooth"})},goPro:function(t,e){this.$router.togo({path:"/proDetail?type="+t+"&id="+e})},goCar:function(t){this.$router.togo({path:t})},addCar:function(t,e,s,i){var a=this;if(console.log(s),i>0){var o={pid:t,quantity:1,checked:0,deal_type:e};Object(r.e)(o).then(function(e){if(e.isSuccess){if(""===a.$store.state.home.carpro)a.setCarPro([t]);else{for(var i=a.$store.state.home.carpro,o=0;o<i.length&&i[o]!==t;o++);o>=i.length&&i.push(t),a.setCarPro(i)}a.amount=1e3*a.amount+1e3*parseFloat(s),a.difference=1e3*parseFloat(a.difference)-1e3*parseFloat(s),a.amount=(a.amount/1e3).toFixed(2),a.difference=(a.difference/1e3).toFixed(2),a.setCarAmount(a.amount),a.setCarDifference(a.difference),Object(n.Toast)({message:"加入购物车成功",iconClass:"iconfont icon-dui1",icon:"success"}),a.p=1,a.scoreNum=0,a.priceAll=0,a.getList()}else Object(n.Toast)({message:e.msg})})}else Object(n.Toast)({message:"当前商品无库存"})},getList:function(){var t=this;Object(r.F)({type:0}).then(function(e){n.Indicator.close(),t.isShow=!0,e.isSuccess&&(console.log(e),t.vipList=e.data,t.total=e.total)})}}),computed:a()({},Object(c.b)(["number"]))},_={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("common-header",{attrs:{h_title:t.h_title,showback:!0}}),t._v(" "),s("return-top",{on:{returnTop:t.goTop}}),t._v(" "),s("div",{staticStyle:{height:"0.9rem"},attrs:{id:"single"}}),t._v(" "),s("div",{staticClass:"vip"},[s("div",{staticClass:"vip_body_list"},[s("div",{staticClass:"vip_body"},[s("div",{staticClass:"vip_list"},[t._l(t.vipList,function(e,i){return s("div",{key:i,staticClass:"vip_pro"},[s("div",{staticClass:"pro_img",on:{click:function(s){return t.goPro("normal",e.goods_id)}}},[s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.img,expression:"item.img"}],attrs:{src:e.img}})]),t._v(" "),s("div",{staticClass:"pro_info"},[s("div",{staticClass:"pro_title",on:{click:function(s){return t.goPro("normal",e.goods_id)}}},[t._v("\n                "+t._s(e.name)+"\n              ")]),t._v(" "),s("div",{staticClass:"pro_spec"},[s("div",{staticClass:"pro_price"},[s("div",[s("div",{staticClass:"pro_nowprice"},[1==e.deal_type||3==e.deal_type?s("span",[t._v("￥"+t._s(e.price_sell)),t.isMember?s("span",{staticStyle:{color:"#ff4e79","font-size":"0.23rem"}},[t._v(" / 赚"+t._s(e.back_rebate))]):t._e()]):t._e(),t._v(" "),e.deal_type>=4?s("span",[t._v("￥"+t._s(e.price_sell)),t.isMember?s("span",{staticStyle:{color:"#ff4e79","font-size":"0.23rem"}},[t._v(" / 赚"+t._s(e.back_rebate))]):t._e()]):t._e()]),t._v(" "),1!=e.deal_type&&3!=e.deal_type?s("div",{staticClass:"pro_inter_img"},[s("i",{staticClass:"iconfont icon-jifen1"})]):t._e(),t._v(" "),2==e.deal_type?s("span",{staticClass:"pro_integral"},[t._v(t._s(e.point))]):t._e(),t._v(" "),1!=e.deal_type&&2!=e.deal_type&&3!=e.deal_type?s("span",{staticClass:"pro_integral"},[t._v(t._s(e.point))]):t._e()])]),t._v(" "),s("div",{staticClass:"pro_icon"},[s("i",{staticClass:"iconfont icon-car",on:{click:function(s){return t.addCar(e.product_id,e.deal_type,e.price_sell,e.buy_count)}}})])])])])}),t._v(" "),0==t.vipList.length?s("div",{staticClass:"order-foots"},[s("img",{attrs:{src:t.imgPath+"pro/null_1.png",mode:"widthFix"}})]):t._e()],2),t._v(" "),s("button",{staticStyle:{border:"none",background:"#f2f2f2"},attrs:{type:"default",size:"default",loading:"",plain:"",hidden:t.vipList.length==t.total}},[t._v("加载中...")]),t._v(" "),t.vipList.length==t.total&&t.total>0?s("div",{staticClass:"order-foot"},[s("span",[t._v("—————— 我是有底线的 ——————")])]):t._e()]),t._v(" "),s("div",{staticClass:"car_edit_more"},[s("div",{staticClass:"allCheck"},[s("div",{staticClass:"car_pro_total"},[t._v("合计：\n            "),s("span",[t._v("￥"+t._s(t.amount))])]),t._v(" "),t.difference>0?s("span",{staticClass:"car_tips"},[t._v("自营商品还差"+t._s(t.difference)+"元，可享包邮")]):s("span",{staticClass:"car_tips"},[t._v("自营商品已满"+t._s(t.full_amount)+"元享受包邮")])]),t._v(" "),s("mt-button",{attrs:{size:"small"},on:{click:function(e){return t.goCar("/car")}}},[t._v("回购物车")])],1)])])],1)},staticRenderFns:[]};var d=s("VU/8")(l,_,!1,function(t){s("QtUc")},"data-v-0b6a780a",null);e.default=d.exports}});
//# sourceMappingURL=72.7472fb2dba5f15559d1d.js.map