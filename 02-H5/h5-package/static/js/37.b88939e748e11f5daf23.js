webpackJsonp([37],{A51z:function(t,e){},bRoA:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("Dd8w"),a=s.n(i),o=s("fqE/"),n=s("Au9i"),r=s("gyMJ"),c=s("WVZN"),l=s("NYxO"),d={name:"MyScore",components:{commonHeader:o.a,InfiniteScroll:n.InfiniteScroll,Indicator:n.Indicator,Button:n.Button,Lazyload:n.Lazyload,Spinner:n.Spinner,Loadmore:n.Loadmore},data:function(){return{h_title:"我的积分",header_bg:"https://share.gongzhugou.com/static/image/xcx_img/member/m_header_bg.png",avatar:"https://share.gongzhugou.com/static/image/xcx_img/member/avatar.png",userInfo:{avatar:"",level:"",nickname:"",username:"",isShow:0},score:0,page:1,pagesize:10,total:0,scoreList:[],loading:!0,screenHeight:document.documentElement.clientHeight/50}},mounted:function(){n.Indicator.open("加载中..."),null!==this.$store.state.home.userInfo&&""!==this.$store.state.home.userInfo&&void 0!==this.$store.state.home.userInfo&&(this.userInfo=this.$store.state.home.userInfo),this.scoreShow(),this.getList()},methods:a()({},Object(l.c)({setIsbind:"SET_ISBIND",setScore:"SET_SCORE",setIssign:"SET_ISSIGN"}),{goTop:function(){console.log("回到顶部"),document.getElementById("score").scrollIntoView({block:"start",behavior:"smooth"})},goIndex:function(){this.$router.replace({path:"/index"})},goSign:function(){this.$router.togo({path:"/mySignIn"})},getList:function(){var t=this,e=this,s={page:e.page,pagesize:e.pagesize};Object(r._22)(s).then(function(s){if(n.Indicator.close(),s.isSuccess){e.setScore(s.data.point);for(var i=0;i<s.data.rows.length;i++)s.data.rows[i].createtime=Object(c.c)(s.data.rows[i].createtime,"{y}-{m}-{d} {h}:{i}:{s}");e.scoreList=s.data.rows,e.total=s.data.total,t.loading=!1}else e.loading=!0})},loadMore:function(){this.loading=!0;var t=this,e={page:++t.page,pagesize:t.pagesize};Object(r._22)(e).then(function(e){if(e.isSuccess)if(t.setScore(e.data.point),null!==e.data.rows&&e.data.rows.length>0){for(var s=0;s<e.data.rows.length;s++)e.data.rows[s].createtime=Object(c.c)(e.data.rows[s].createtime,"{y}-{m}-{d} {h}:{i}:{s}");t.scoreList=t.scoreList.concat(e.data.rows),t.total=e.data.total,t.loading=!1}else t.loading=!0})},scoreShow:function(){this.$store.state.home.score>0?this.score=this.$store.state.home.score:this.score=0}}),computed:a()({},Object(l.b)([]))},m={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("common-header",{attrs:{h_title:t.h_title,showback:!0}}),t._v(" "),s("div",{staticClass:"my_score"},[s("return-top",{on:{returnTop:t.goTop}}),t._v(" "),s("div",{staticStyle:{height:"0.9rem"},attrs:{id:"score"}}),t._v(" "),s("div",{staticClass:"m_header"},[s("div",{staticClass:"m_info_login"},[s("img",{staticClass:"m_avatar",attrs:{src:t.userInfo.avatar,mode:"scaleToFill"}}),t._v(" "),s("div",{staticClass:"m_info_title"},[s("div",{staticClass:"m_info_name"},[s("span",[t._v(t._s(t.userInfo.nickname))])]),t._v(" "),s("div",{staticClass:"m_info_level"},[s("div",{staticStyle:{display:"inline-flex","align-items":"center","margin-left":"0.16rem"}},[s("i",{staticClass:"iconfont icon-jifen1"}),t._v(" "),s("span",[t._v(t._s(t.score))])])])]),t._v(" "),s("div",{staticClass:"m_score"},[s("i",{staticClass:"iconfont icon-iconqiandaowenzi",attrs:{"data-url":"../mySignIn/mySignIn"},on:{click:t.goSign}})])])]),t._v(" "),s("div",{staticClass:"score_body"},[s("div",{staticClass:"score_title"},[t._v("积分收支明细")]),t._v(" "),s("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"score_list",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"30"}},[t._l(t.scoreList,function(e,i){return s("div",{key:i,staticClass:"score_info"},[s("div",{staticClass:"score_info_more"},[s("span",[t._v(t._s(e.desc))]),t._v(" "),s("span",{staticClass:"score_time"},[t._v(t._s(e.createtime))])]),t._v(" "),s("div",{staticClass:"score_num"},[t._v("\n            "+t._s(e.price)+"\n          ")])])}),t._v(" "),t.loading?t._e():s("div",{staticClass:"more_load"},[s("mt-spinner",{attrs:{type:"fading-circle"}})],1),t._v(" "),t.total>0&&t.scoreList.length==t.total?s("div",{staticClass:"list_bottom"},[t._v("—————— 我是有底线的 ——————")]):t._e()],2)])],1),t._v(" "),s("div",{staticClass:"goIndex",attrs:{"data-link":"../index/index"},on:{click:t.goIndex}},[s("i",{staticClass:"iconfont icon-home"})])],1)},staticRenderFns:[]};var _=s("VU/8")(d,m,!1,function(t){s("A51z")},"data-v-7641f2a8",null);e.default=_.exports}});
//# sourceMappingURL=37.b88939e748e11f5daf23.js.map