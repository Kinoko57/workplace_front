webpackJsonp([22],{"9bf9":function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("pFYg"),r=e.n(s),o=e("mvHQ"),a=e.n(o),n=e("fqE/"),c=e("Au9i"),l=e("gyMJ"),h=e("yINb"),f=e("Jtwt"),p={name:"Type",components:{commonHeader:n.a,Search:c.Search,LyTab:h.a,returnTop:f.a,InfiniteScroll:c.InfiniteScroll,Lazyload:c.Lazyload,Toast:c.Toast},data:function(){return{head_color:{background:"#f9f9f9",color:"#000"},h_title:"商品分类",num:0,total:0,searchkey:"",par:"",limit:10,selectedId:0,choseIndex:0,showNav:!1,navList:[],proList:[],loading:!0,hasData:!1,options:{activeColor:"#ff8d97",labelKey:"name"},searchFifter:[{price:"",point:"",type_id:"",deal_type:"",quantity:"desc",price_range:""}],fifterList:[{fifter_id:0,fifter_name:"分类",isopen:!0,fifteroptions:[]},{fifter_id:1,fifter_name:"支付方式",isopen:!1,fifteroptions:[{id:"3",name:"现金+积分",checked:!1},{id:"1",name:"现金",checked:!1},{id:"2",name:"积分",checked:!1}]}],fifter:!1,lowPrice:"",highPrice:"",isShow:!1,autoOpen:!1,imgPath:"https://share.gongzhugou.com/static/image/xcx_img/"}},mounted:function(){console.log(this.$route.query);var t=this.$route.query;void 0!==t.id&&(this.selectedId=parseInt(t.id),this.searchFifter[0].type_id=t.typeid),c.Indicator.open("加载中..."),this.getType(),this.getList()},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("type").scrollIntoView({block:"start",behavior:"smooth"})},getType:function(){var t=this;Object(l._13)().then(function(i){t.navList=i.left,t.fifterList[0].fifteroptions=i.left,t.navList.unshift({id:0,name:"推荐"}),t.showNav=!0})},getList:function(){var t={searchkey:this.searchkey,par:this.par,limit:this.limit,fifter:a()(this.searchFifter)},i=this;Object(l._25)(t).then(function(t){c.Indicator.close(),i.isShow=!0,t.isSuccess&&(t.rows.length>0?(i.proList=t.rows,i.total=t.total,i.par=t.page,i.hasData=!0,i.loading=!1,setTimeout(function(){(parseInt(i.total)===parseInt(i.proList.length)&&parseInt(i.total)>0||0===parseInt(i.total))&&(console.log("只加载一次"),i.loading=!0)},100)):(i.proList=[],i.total=0,i.hasData=!1,i.loading=!0))})},choseNav:function(t){console.log(this.selectedId),c.Indicator.open("加载中..."),document.getElementById("type").scrollIntoView(!1),this.par="",this.searchFifter[0].type_id=t.id,this.getList()},fifterAll:function(){this.brandHeight=document.documentElement.clientHeight-165,this.pro_type=!1,this.fifter=!this.fifter,this.allowScorll=!1,console.log(this.fifterList)},low:function(t){console.log(this.lowPrice),console.log(r()(this.lowPrice)),this.lowPrice=parseFloat(this.lowPrice),this.lowPrice.length>0&&("number"!=typeof this.lowPrice||!1===isNaN(this.lowPrice))&&(Object(c.Toast)({message:"价格只能为数字",duration:1e3}),this.lowPrice="")},high:function(t){console.log(this.highPrice),this.highPrice=parseFloat(this.highPrice),this.highPrice.length>0&&("number"!=typeof this.highPrice||!1===isNaN(this.highPrice))&&(Object(c.Toast)({message:"价格只能为数字",duration:1e3}),this.highPrice="")},hiddenFifter:function(){this.page=1,this.allowScorll=!0,parseInt(this.lowPrice)>parseInt(this.highPrice)?Object(c.Toast)({message:"最低价必须小于最高价",duration:1e3}):(c.Indicator.open("加载中..."),this.proList=[],""===this.lowPrice&&""===this.highPrice?this.searchFifter[0].price_range="":this.searchFifter[0].price_range=this.lowPrice+","+this.highPrice,this.searchFifter[0].price="",this.searchFifter[0].point="",this.searchFifter[0].quantity="",this.selectedId=this.choseIndex,this.loading=!0,this.hasData=!1,setTimeout(function(){this.getList(),this.fifter=!this.fifter,this.allowScorll=!0,this.chose_nav_id=this.searchFifter[0].type_id,this.topNum=0,this.is_load=!0}.bind(this),400))},hiddenFifterBg:function(){this.fifter=!this.fifter,this.allowScorll=!0},stopMove:function(t){t.preventDefault()},chosefifterList:function(t,i,e){for(var s=[],r=this.fifterList,o=0;o<r.length;o++)if(o===i)for(var a=0;a<r[o].fifteroptions.length;a++)r[o].fifteroptions[a].id===t?(this.choseIndex=a,r[o].fifteroptions[a].checked=!r[o].fifteroptions[a].checked):r[o].fifteroptions[a].checked=!1;this.fifterList=r;for(var n=0;n<r.length;n++)if(n===i)for(var c=0;c<r[n].fifteroptions.length;c++)r[n].fifteroptions[c].checked&&s.push(r[n].fifteroptions[c].id);1===i||"1"===i?this.searchFifter[0].deal_type=s.join(","):0!==i&&"0"!==i||(this.searchFifter[0].type_id=s.join(","),this.chose_nav_id=s.join(","))},openfifter:function(t){for(var i=this.fifterList,e=0;e<i.length;e++)i[e].fifter_id===t&&(i[e].isopen=!i[e].isopen);this.fifterList=i},resetFifter:function(){for(var t=0;t<this.fifterList.length;t++)for(var i=0;i<this.fifterList[t].fifteroptions.length;i++)this.fifterList[t].fifteroptions[i].checked=!1;this.searchFifter[0].type_id="",this.searchFifter[0].deal_type="",this.searchFifter[0].price_range="",this.lowPrice="",this.highPrice="",this.chose_nav_id=-1,this.choseIndex=0,this.loading=!0,this.hasData=!1},searchList:function(){console.log(0),c.Indicator.open("加载中..."),document.getElementById("type").scrollIntoView(!1),console.log(this.searchkey),this.par="",this.proList=[],this.getList(),window.plus.key.hideSoftKeybord()},fifterSort:function(t){console.log(t),"point"===t?(this.searchFifter[0].price="",this.searchFifter[0].quantity="","asc"===this.searchFifter[0].point?this.searchFifter[0].point="desc":this.searchFifter[0].point="asc"):"price"===t?(this.searchFifter[0].point="",this.searchFifter[0].quantity="","asc"===this.searchFifter[0].price?this.searchFifter[0].price="desc":this.searchFifter[0].price="asc"):"quantity"===t&&(this.searchFifter[0].point="",this.searchFifter[0].price="","asc"===this.searchFifter[0].quantity?this.searchFifter[0].quantity="desc":this.searchFifter[0].quantity="asc"),this.par="",c.Indicator.open("加载中..."),document.getElementById("type").scrollIntoView(!1),this.getList()},goPro:function(t,i){this.$router.togo({path:"/proDetail?type="+t+"&id="+i})},loadMore:function(){this.loading=!0;var t={searchkey:this.searchkey,par:this.par,limit:this.limit,fifter:a()(this.searchFifter)},i=this;Object(l._25)(t).then(function(t){t.isSuccess&&(null!==t.rows&&t.rows.length>0?(i.proList=i.proList.concat(t.rows),i.total=t.total,i.par=t.page,i.loading=!1,console.log(i.proList),parseInt(i.total)===parseInt(i.proList.length)&&parseInt(i.total)>0&&(i.loading=!0)):i.loading=!0)})}}},d={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("div",{staticClass:"type_bg"},[e("return-top",{on:{returnTop:t.goTop}}),t._v(" "),e("div",{staticClass:"fixed_top"},[e("div",{staticClass:"type_header"},[e("div",{staticClass:"serach"},[e("i",{staticClass:"iconfont icon-search"}),t._v(" "),e("mt-field",{staticClass:"search_input",attrs:{placeholder:"搜索喜欢的商品"},on:{change:t.searchList},model:{value:t.searchkey,callback:function(i){t.searchkey=i},expression:"searchkey"}})],1)]),t._v(" "),e("div",{staticClass:"scroll_nav"},[t.showNav?e("ly-tab",{attrs:{items:t.navList,options:t.options},on:{change:t.choseNav},model:{value:t.selectedId,callback:function(i){t.selectedId=i},expression:"selectedId"}}):t._e()],1),t._v(" "),e("div",{staticClass:"type_fifter"},[e("span",{class:""!=t.searchFifter[0].price?"icon_active ":"",on:{click:function(i){return t.fifterSort("price")}}},[t._v("价格\n          "),e("i",{class:"asc"==t.searchFifter[0].price?"iconfont icon-asc sort_asc":"iconfont icon-desc sort_desc"})]),t._v(" "),e("span",{class:""!=t.searchFifter[0].quantity?"icon_active ":"",on:{click:function(i){return t.fifterSort("quantity")}}},[t._v("销量\n          "),e("i",{class:"asc"==t.searchFifter[0].quantity?"iconfont icon-asc sort_asc":"iconfont icon-desc sort_desc"})]),t._v(" "),e("span",{class:""!=t.searchFifter[0].type_id||""!=t.searchFifter[0].deal_type||""!=t.searchFifter[0].price_range?"fifter_sort icon_active ":"fifter_sort",on:{click:t.fifterAll}},[t._v("筛选\n          "),e("i",{staticClass:"iconfont icon-shaixuan1"})])])]),t._v(" "),e("div",{staticClass:"red_list_head",attrs:{id:"type"}}),t._v(" "),e("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"red_list",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"30","infinite-scroll-immediate-check":"autoOpen"}},t._l(t.proList,function(i,s){return e("div",{key:s,staticClass:"red_pro"},[e("div",{staticClass:"pro_img",on:{click:function(e){return t.goPro("normal",i.goods_id)}}},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:i.img,expression:"item.img"}],attrs:{src:i.img}})]),t._v(" "),e("div",{staticClass:"pro_info"},[e("div",{staticClass:"pro_title",on:{click:function(e){return t.goPro("normal",i.goods_id)}}},[1==i.promotion?e("div",{staticClass:"pro_level"},[e("img",{attrs:{src:t.imgPath+"member/cu.png"}}),t._v(" "),e("span",[t._v("限时购")])]):t._e(),t._v("\n            "+t._s(i.name)+"\n          ")]),t._v(" "),e("div",{staticClass:"pro_spec"},[e("div",{staticClass:"pro_price"},[e("div",{staticStyle:{display:"flex","align-items":"center","line-height":"48/100rem"}},[1==i.deal_type||3==i.deal_type?e("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(i.price_sell)+" ")]):t._e(),t._v(" "),i.deal_type>=4?e("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(i.price_sell)+" ")]):t._e(),t._v(" "),1!=i.deal_type&&2!=i.deal_type&&3!=i.deal_type?e("span",{staticClass:"pro_integral"},[t._v("+")]):t._e(),t._v(" "),1!=i.deal_type&&3!=i.deal_type?e("div",{staticClass:"pro_inter_img"},[e("i",{staticClass:"iconfont icon-jifen1"})]):t._e(),t._v(" "),2==i.deal_type?e("span",{staticClass:"pro_integral"},[t._v(t._s(i.point))]):t._e(),t._v(" "),1!=i.deal_type&&2!=i.deal_type&&3!=i.deal_type?e("span",{staticClass:"pro_integral"},[t._v(t._s(i.point))]):t._e()]),t._v(" "),e("div",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between"}},[e("div",{staticStyle:{display:"inline-flex","align-items":"center"}},[e("span",{staticClass:"pro_orig pro_bg"},[t._v(t._s(i.price_market_from))]),t._v(" "),e("span",{staticClass:"pro_orig line"},[t._v("￥"+t._s(i.price_market))])]),t._v(" "),e("div",{staticClass:"pro_count"},[t._v("销量:"+t._s(i.buy_count))])])])])])])}),0),t._v(" "),t.fifter?e("div",{staticClass:"fifter_more_bg",on:{click:t.hiddenFifterBg,touchmove:t.stopMove}}):t._e(),t._v(" "),t.fifter?e("div",{class:{"animated slideInRight fifter_more":t.fifter,"animated slideOutRight fifter_more":!t.fifter},staticStyle:{height:"100%"}},[e("div",{staticClass:"fifter_price"},[e("span",[t._v("价格区间")]),t._v(" "),e("div",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.lowPrice,expression:"lowPrice"}],attrs:{placeholder:"最低价",type:"number"},domProps:{value:t.lowPrice},on:{blur:t.low,input:function(i){i.target.composing||(t.lowPrice=i.target.value)}}}),t._v(" "),e("i",{staticClass:"iconfont icon-jian"}),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.highPrice,expression:"highPrice"}],attrs:{placeholder:"最高价",type:"number"},domProps:{value:t.highPrice},on:{blur:t.high,input:function(i){i.target.composing||(t.highPrice=i.target.value)}}})])]),t._v(" "),e("div",{staticClass:"fifter_other",staticStyle:{"{height":"brandHeight+'px'}"}},t._l(t.fifterList,function(i,s){return e("div",{key:s,staticClass:"fifter_info"},[e("div",{staticClass:"fifter_head"},[e("span",[t._v(t._s(i.fifter_name))]),t._v(" "),1!=i.fifter_id?e("div",{on:{click:function(e){return t.openfifter(i.fifter_id)}}},[e("span",[t._v("全部")]),t._v(" "),e("i",{class:i.isopen?"iconfont icon-xiajiantou icon_open":"iconfont icon-xiajiantou"})]):t._e()]),t._v(" "),e("div",{class:i.isopen?"fifter_options":"fifter_options_hidden fifter_options"},t._l(i.fifteroptions,function(s,r){return 0!=s.id?e("span",{key:r,class:s.checked?"chose_text":"",on:{click:function(e){return t.chosefifterList(s.id,i.fifter_id,r)}}},[t._v(t._s(s.name))]):t._e()}),0)])}),0),t._v(" "),e("div",{staticClass:"fifter_more_btn"},[e("mt-button",{attrs:{size:"small"},on:{click:t.resetFifter}},[t._v("重置")]),t._v(" "),e("mt-button",{staticClass:"btn_red",attrs:{size:"small"},on:{click:t.hiddenFifter}},[t._v("确定")])],1)]):t._e(),t._v(" "),t.loading?t._e():e("div",{staticClass:"more_load"},[e("mt-spinner",{attrs:{type:"fading-circle"}})],1),t._v(" "),t.total==t.proList.length&&t.total>0?e("div",{staticClass:"list_bottom"},[t._v("—————— 我是有底线的 ——————")]):t._e(),t._v(" "),t.hasData?t._e():e("div",{staticClass:"red_list_null"},[e("img",{attrs:{src:t.imgPath+"pro/null_1.png"}})])],1),t._v(" "),e("div",{staticStyle:{height:"0.98rem"}})])},staticRenderFns:[]};var _=e("VU/8")(p,d,!1,function(t){e("d/7q")},"data-v-befd3b3c",null);i.default=_.exports},"d/7q":function(t,i){}});
//# sourceMappingURL=22.28746e40662b58252fc0.js.map