webpackJsonp([77],{"76VT":function(t,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var n=i("fqE/"),e=i("Nl6a"),a=i.n(e),s=i("Au9i"),c={name:"Set",components:{commonHeader:n.a,InfiniteScroll:s.InfiniteScroll,Indicator:s.Indicator,Button:s.Button,Lazyload:s.Lazyload,Toast:s.Toast},data:function(){return{head_color:{background:"#f9f9f9",color:"#000"},h_title:"关于",version:"1.1.0",loginImg:a.a,aweixin:""}},mounted:function(){console.log(window.localStorage.getItem("version_code")),null!=window.localStorage.getItem("version_code")&&(this.version=window.localStorage.getItem("version_code"))},methods:{goOther:function(t){this.$router.togo({path:"/other?type="+t})}}},r={render:function(){var t=this,o=t.$createElement,i=t._self._c||o;return i("div",[i("common-header",{attrs:{h_title:t.h_title,showback:!0,bgcolor:t.head_color}}),t._v(" "),i("div",{staticStyle:{height:"0.9rem"}}),t._v(" "),i("div",{staticClass:"login_bg"},[i("div",{staticClass:"login"},[i("div",{staticClass:"login_head_img"},[i("img",{attrs:{src:t.loginImg,alt:"",srcset:""}})]),t._v(" "),i("div",{staticClass:"login_head_title"},[t._v("版本号："+t._s(t.version))]),t._v(" "),i("div",{staticClass:"login_text"},[i("div",{on:{click:function(o){return t.goOther("statement")}}},[i("span",[t._v("特别声明")]),t._v(" "),i("i",{staticClass:"iconfont icon-youjiantou1"})]),t._v(" "),i("div",{on:{click:function(o){return t.goOther("privacy")}}},[i("span",[t._v("隐私政策")]),t._v(" "),i("i",{staticClass:"iconfont icon-youjiantou1"})])]),t._v(" "),t._m(0)])])],1)},staticRenderFns:[function(){var t=this.$createElement,o=this._self._c||t;return o("div",{staticClass:"login_version"},[o("span",[this._v("Copyright©2019 公主购")]),this._v(" "),o("span",[this._v("浙江神首信息技术有限公司 版权所有")])])}]};var l=i("VU/8")(c,r,!1,function(t){i("wVJ9")},"data-v-02ac6395",null);o.default=l.exports},wVJ9:function(t,o){}});
//# sourceMappingURL=77.0d9673b9782d49c9ed3d.js.map