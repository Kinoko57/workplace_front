webpackJsonp([34],{"lzb+":function(t,e){},qLkl:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("fqE/"),l=s("Au9i"),o=s("gyMJ"),a={name:"MyColl",components:{commonHeader:i.a,InfiniteScroll:l.InfiniteScroll,Indicator:l.Indicator,Button:l.Button,Lazyload:l.Lazyload,Toast:l.Toast,MessageBox:l.MessageBox},data:function(){return{h_title:"我的收藏",newNews:!1,total_amout:0,isShow:!1,page:1,limit:5,total:0,collList:[],delList:[],allchose:!1,isEdit:!1,loading:!0,imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",screenHeight:(document.documentElement.clientHeight-130)/50}},mounted:function(){l.Indicator.open("加载中..."),this.getList()},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("coll").scrollIntoView({block:"start",behavior:"smooth"})},goPro:function(t,e){var s=this;if(""!==t){var i={id:t,type:"normal"};Object(o._12)(i).then(function(i){i.isSuccess?s.$router.togo({path:e+"&id="+t}):Object(l.Toast)({message:i.msg,duration:2e3})})}},edit:function(){for(var t=0;t<this.collList.length;t++)this.collList[t].checked=!1;this.isEdit=!this.isEdit},delColl:function(){var t=this;if(0===t.delList.length)Object(l.Toast)({message:"请选择要操作的数据",duration:1e3});else{var e=window.plus;window.plus?e.nativeUI.confirm("是否删除选中内容?",function(e){console.log("Close confirm: "+e.index),0===e.index||"0"===e.index?Object(o.s)(t.delList.join(",")).then(function(e){e.isSuccess?(Object(l.Toast)({message:"删除成功",iconClass:"iconfont icon-dui1",duration:1e3}),t.page=1,t.allchose=!1,t.collList=[],t.getList()):Object(l.Toast)({message:e.msg,duration:1e3})}):console.log("用户点击取消")},{title:"提示",buttons:["确定","取消"],verticalAlign:"center"}):Object(l.MessageBox)({title:"提示",message:"是否删除选中内容?",showCancelButton:!0,closeOnClickModal:!1}).then(function(e){"confirm"===e&&Object(o.s)(t.delList.join(",")).then(function(e){e.isSuccess?(Object(l.Toast)({message:"删除成功",iconClass:"iconfont icon-dui1",duration:1e3}),t.page=1,t.allchose=!1,t.collList=[],t.getList()):Object(l.Toast)({message:e.msg,duration:1e3})})})}},chose:function(t){t.checked=!t.checked,this.delList=[];for(var e=0;e<this.collList.length;e++)this.collList[e].checked&&this.delList.push(this.collList[e].id);var s=this.collList.every(function(t){return t.checked});this.allchose=!!s},checkAll:function(){if(this.delList=[],console.log(this.allchose),!1===this.allchose){for(var t=0;t<this.collList.length;t++)this.collList[t].checked=!0,this.delList.push(this.collList[t].id);this.allchose=!0}else{for(var e=0;e<this.collList.length;e++)this.collList[e].checked=!1;this.delList=[],this.allchose=!1}},getList:function(){var t=this,e={page:t.page,limit:t.limit};Object(o.R)(e).then(function(e){if(t.isShow=!0,l.Indicator.close(),e.isSuccess)if(e.data.rows.length>0){for(var s=0;s<e.data.rows.length;s++)e.data.rows[s].checked=!1;t.collList=e.data.rows,t.total=e.data.total,t.loading=!1,setTimeout(function(){(parseInt(t.total)===parseInt(t.collList.length)&&parseInt(t.total)>0||0===parseInt(t.total))&&(t.loading=!0)},100)}else t.collList=[],t.total=0,t.loading=!0,t.isEdit=!1,t.allchose=!1})},loadMore:function(){var t=this;t.loading=!0;var e={page:++t.page,limit:t.limit};Object(o.R)(e).then(function(e){if(t.isShow=!0,l.Indicator.close(),e.isSuccess)if(null!==e.data.rows&&e.data.rows.length>0){for(var s=0;s<e.data.rows.length;s++)e.data.rows[s].checked=!1;t.collList=t.collList.concat(e.data.rows),t.total=e.data.total,t.loading=!1}else t.loading=!0})}}},c={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("common-header",{attrs:{h_title:t.h_title,showback:!0}}),t._v(" "),s("div",{staticStyle:{height:"0.9rem"},attrs:{id:"coll"}}),t._v(" "),s("return-top",{on:{returnTop:t.goTop}}),t._v(" "),t.isShow?s("div",{staticClass:"my_collection"},[s("div",{staticClass:"coll_header"},[s("span",[t._v("共有"),s("span",{staticClass:"coll_num"},[t._v(t._s(t.total))]),t._v("件商品")]),t._v(" "),s("span",{staticClass:"coll_edit",attrs:{hidden:t.isEdit},on:{click:t.edit}},[t._v("编辑")]),t._v(" "),s("span",{staticClass:"coll_edit",attrs:{hidden:!t.isEdit},on:{click:t.edit}},[t._v("完成")])]),t._v(" "),s("div",{staticClass:"coll_body"},[t.isEdit?s("div",{staticClass:"editDel"},[s("div",{staticClass:"allCheck"},[s("div",{staticClass:"checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.allchose,expression:"allchose"}],attrs:{id:"all",type:"checkbox"},domProps:{checked:1==t.allchose,checked:Array.isArray(t.allchose)?t._i(t.allchose,null)>-1:t.allchose},on:{click:t.checkAll,change:function(e){var s=t.allchose,i=e.target,l=!!i.checked;if(Array.isArray(s)){var o=t._i(s,null);i.checked?o<0&&(t.allchose=s.concat([null])):o>-1&&(t.allchose=s.slice(0,o).concat(s.slice(o+1)))}else t.allchose=l}}}),t._v(" "),s("label",{attrs:{for:"all"}})]),t._v(" "),s("span",[t._v("全选")])]),t._v(" "),s("mt-button",{attrs:{size:"small"},on:{click:t.delColl}},[t._v("删除")])],1):t._e(),t._v(" "),t.collList.length>0?s("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"coll_list",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"30"}},[t._l(t.collList,function(e,i){return s("div",{key:i,staticClass:"coll_pro"},[t.isEdit?s("div",{staticClass:"pro_chose"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.checked,expression:"item.checked"}],attrs:{id:e.id,type:"checkbox"},domProps:{checked:Array.isArray(e.checked)?t._i(e.checked,null)>-1:e.checked},on:{click:function(s){return t.chose(e)},change:function(s){var i=e.checked,l=s.target,o=!!l.checked;if(Array.isArray(i)){var a=t._i(i,null);l.checked?a<0&&t.$set(e,"checked",i.concat([null])):a>-1&&t.$set(e,"checked",i.slice(0,a).concat(i.slice(a+1)))}else t.$set(e,"checked",o)}}}),t._v(" "),s("label",{attrs:{for:e.id}})]):t._e(),t._v(" "),s("div",{staticClass:"pro_img",on:{click:function(s){return t.goPro(e.goods_id,"/proDetail?type=normal")}}},[s("img",{attrs:{src:e.img}}),t._v(" "),s("div",{staticClass:"pro_tips",attrs:{hidden:!e.isExpired}},[s("span",[t._v("已过期")])])]),t._v(" "),s("div",{class:0==t.isEdit?"pro_info":"pro_info pro_info_edit"},[s("div",{staticClass:"pro_title",on:{click:function(s){return t.goPro(e.goods_id,"/proDetail?type=normal")}}},[1==e.promotion?s("div",{staticClass:"pro_level"},[s("img",{attrs:{src:t.imgPath+"member/cu.png"}}),t._v(" "),s("span",[t._v("限时购")])]):t._e(),t._v("\n              "+t._s(e.name)+"\n            ")]),t._v(" "),s("div",{staticClass:"pro_spec"},[s("div",{staticClass:"pro_price"},[1==e.deal_type||3==e.deal_type?s("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(e.price_sell)+" ")]):t._e(),t._v(" "),e.deal_type>=4?s("span",{staticClass:"peo_nowprice"},[t._v("￥"+t._s(e.price_sell)+" ")]):t._e(),t._v(" "),1!=e.deal_type&&2!=e.deal_type&&3!=e.deal_type?s("span",{staticClass:"pro_integral"},[t._v("+")]):t._e(),t._v(" "),1!=e.deal_type&&3!=e.deal_type?s("div",{staticClass:"pro_inter_img"},[s("i",{staticClass:"iconfont icon-jifen1"})]):t._e(),t._v(" "),2==e.deal_type?s("span",{staticClass:"pro_integral"},[t._v(t._s(e.point))]):t._e(),t._v(" "),1!=e.deal_type&&2!=e.deal_type&&3!=e.deal_type?s("span",{staticClass:"pro_integral"},[t._v(t._s(e.point))]):t._e()])])])])}),t._v(" "),t.loading&&t.collList.length>0?s("div",{staticClass:"order-foot"},[s("span",[t._v("—————— 我是有底线的 ——————")])]):t._e(),t._v(" "),t.loading?t._e():s("div",{staticClass:"more_load"},[s("mt-spinner",{attrs:{type:"fading-circle"}})],1)],2):t._e(),t._v(" "),t.collList.length<=0?s("div",{staticClass:"coll_list_null"},[s("img",{attrs:{src:t.imgPath+"pro/null_1.png"}})]):t._e(),t._v(" "),s("div",{staticClass:"null_height"})])]):t._e()],1)},staticRenderFns:[]};var n=s("VU/8")(a,c,!1,function(t){s("lzb+")},"data-v-85b7dd14",null);e.default=n.exports}});
//# sourceMappingURL=34.0e257cff4d15bfd20c93.js.map