webpackJsonp([52],{UTUh:function(e,t){},gNh9:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=o("mvHQ"),s=o.n(a),i=o("fqE/"),n=o("Au9i"),c=(o("WVZN"),o("HUDw")),l=o("mtWM"),r=o.n(l),d={name:"MyQrcode",components:{commonHeader:i.a,InfiniteScroll:n.InfiniteScroll,Indicator:n.Indicator,Button:n.Button,Lazyload:n.Lazyload,Toast:n.Toast},data:function(){return{h_title:"我的二维码",imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",isMember:this.$store.state.home.is_member,isShare:this.$store.state.home.is_share,allowbind:!0,giftType:"2",code_value:"wx_dasdasd",giftList:[],proType:"scan",showCode:!0,hiddenavatar:!0,superInfo:{},bossInfo:{},myInfo:{},img_save_show:!0,save_url:"",hasDate:!1,imgShow:!1,img_show_big:""}},mounted:function(){n.Indicator.open("加载中..."),this.getInfo()},methods:{goTop:function(){console.log("回到顶部"),document.getElementById("code").scrollIntoView({block:"start",behavior:"smooth"})},goIndex:function(){this.$router.replace({path:"/index"})},getInfo:function(){var e=this;Object(c.p)().then(function(t){n.Indicator.close(),t.isSuccess&&(console.log(t),e.myInfo=t.data.member,e.code_value=t.data.member.wx_code,e.superInfo=t.data.inviter,e.bossInfo=t.data.team_leader,e.hiddenavatar=!0,e.hasDate=!0,"2"==e.giftType&&0==t.data.inviter.length?e.hasDate=!1:"3"==e.giftType&&0==t.data.bossInfo.length&&(e.hasDate=!1),void 0!=e.superInfo.wx_image&&""!=e.superInfo.wx_image&&Object(c.m)({url:e.superInfo.wx_image}).then(function(t){t.isSuccess&&(e.superInfo.wx_image=t.data)}),void 0!=e.bossInfo.wx_image&&""!=e.bossInfo.wx_image&&Object(c.m)({url:e.bossInfo.wx_image}).then(function(t){t.isSuccess&&(e.bossInfo.wx_image=t.data)}))})},previewImg:function(e){this.imgShow=!0,this.img_show_big=e},hiddenImg:function(){this.imgShow=!1},saveImg:function(){var e,t,o=document.createElement("canvas"),a=o.getContext("2d"),s=(t=(e=a).backingStorePixelRatio||e.webkitBackingStorePixelRatio||e.mozBackingStorePixelRatio||e.msBackingStorePixelRatio||e.oBackingStorePixelRatio||e.backingStorePixelRatio||1,(window.devicePixelRatio||1)/t);a.scale(s,s);var i=document.getElementsByClassName("img_big")[0];o.width=i.offsetWidth*s,o.height=i.offsetHeight*s,o.style.width=i.offsetWidth*s+"px",o.style.height=i.offsetHeight*s+"px",a.drawImage(i,0,0,i.offsetWidth*s,i.offsetHeight*s);var n=o.toDataURL("image/png");this.toSave(n)},toSave:function(e){var t=this,o=e,a=new plus.nativeObj.Bitmap,i="new_code_"+(new Date).getTime()+".png";a.loadBase64Data(o),a.save("_doc/"+i,{overwrite:!0},function(e){plus.gallery.save(e.target,function(e){n.Indicator.close(),console.log("保存图片成功："+s()(e)),t.fileUrl="_doc/"+i,a.clear(),Object(n.Toast)({message:"图片已保存到相册",iconClass:"iconfont icon-dui1",duration:2e3})},function(t){n.Indicator.close(),console.log("加载Base64图片数据失败："+s()(t)),a.clear(),console.log("保存失败",e)})},function(){a.clear()})},copyBtn:function(e){console.log(e),this.$copyText(e).then(function(e){Object(n.Toast)({message:"复制成功",iconClass:"iconfont icon-dui1",duration:1e3}),console.log(e)},function(e){console.log("复制失败"),console.log(e)})},editavatat:function(){this.hiddenavatar=!this.hiddenavatar},hiddenModel:function(){this.hiddenavatar=!0},viewType:function(e){this.giftType=e,this.hasDate=!0,this.save_url="","1"===e&&""===this.code_value&&(this.showCode=!1),"2"===e&&0===this.superInfo.length&&(this.hasDate=!1),"3"===e&&0===this.bossInfo.length&&(this.hasDate=!1)},editWxcode:function(e){this.showCode=!1,this.code_value=e},saveWxcode:function(){var e=this;console.log(this.code_value);if(/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(this.code_value)||/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.code_value))if(""===this.code_value)Object(n.Toast)({message:"微信号不能为空",duration:1e3}),this.code_value="";else{var t={name:this.code_value};Object(c.J)(t).then(function(t){t.isSuccess?(Object(n.Toast)({message:"保存成功",iconClass:"iconfont icon-dui1",duration:1e3}),setTimeout(function(){e.showCode=!0})):Object(n.Toast)({message:t.msg,duration:1e3})})}else Object(n.Toast)({message:"微信号格式不正确",duration:1e3}),this.code_value=""},saveValue:function(e){new RegExp("^[ ]+$").test(e)&&(e=""),this.code_value=e},choseAlbum:function(){console.log("选择相册");var e=this;document.getElementById("album").onchange=function(t){var o=t.target.files[0];console.log(o),o.size>5242880?Object(n.Toast)({message:"头像大小不能大于5MB！",duration:1e3}):e.uploadImg(o)}},choseCra:function(){var e=this;console.log("选择拍照");var t=window.plus,o=t.camera.getCamera(),a=o.supportedImageResolutions[0],s=o.supportedImageFormats[0];console.log("Resolution: "+a+", Format: "+s),console.log(o),o.captureImage(function(o){console.log(o),t.io.resolveLocalFileSystemURL(o,function(o){var a="_doc/upload/"+o.name;t.zip.compressImage({src:o.toLocalURL(),dst:a,quality:40,overwrite:!0},function(o){console.log(o),t.io.resolveLocalFileSystemURL(o.target,function(o){console.log(o),o.file(function(o){if(console.log(o),o.size>657920)Object(n.Toast)({message:"头像必须小于5MB！",duration:1e3});else{var a=new t.io.FileReader;a.readAsDataURL(o),a.onloadend=function(t){var a=e.dataURLtoBlob(t.target.result.toString());a.name=o.name,console.log(a),e.uploadImg(a)}}})})},function(e){console.log("压缩图片失败，请稍候再试")})},function(e){console.log("读取拍照文件错误："+e.message)})},function(e){console.log("Capture image failed: "+e.message)},{resolution:a,format:s})},dataURLtoBlob:function(e){for(var t=e.split(","),o=t[0].match(/:(.*?);/)[1],a=atob(t[1].replace(/\s/g,"")),s=a.length,i=new Uint8Array(s);s--;)i[s]=a.charCodeAt(s);return new Blob([i],{type:o})},uploadImg:function(e){console.log(e);var t=this,o=new FormData;o.append("file",e,e.name);var a="?m=invite&a=head_portrait";a="https://share.gongzhugou.com/"+a,console.log("请求上传接口啦"),r.a.post(a,o,{headers:{"Content-Type":"multipart/form-data"},withCredentials:!0}).then(function(e){e.data.isSuccess?t.getInfo():(Object(n.Toast)({message:e.data.msg,duration:1e3}),setTimeout(function(){t.hiddenavatar=!0},1e3))}).catch(function(e){console(e)})}}},_={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("common-header",{attrs:{h_title:e.h_title,showback:!0}}),e._v(" "),o("div",{staticClass:"my_code"},[o("return-top",{on:{returnTop:e.goTop}}),e._v(" "),o("div",{staticStyle:{height:"0.9rem"},attrs:{id:"code"}}),e._v(" "),o("div",{staticClass:"code_body"},[o("div",{staticClass:"gift_nav"},[o("span",{class:"2"==e.giftType?"text_active":"",on:{click:function(t){return e.viewType(2)}}},[e._v("我的邀请人")]),e._v(" "),o("span",{class:"3"==e.giftType?"text_active":"",on:{click:function(t){return e.viewType(3)}}},[e._v("我的导师")]),e._v(" "),o("span",{class:"1"==e.giftType?"text_active":"",on:{click:function(t){return e.viewType(1)}}},[e._v("我的二维码")])]),e._v(" "),o("div",{staticStyle:{height:"0.9rem"}}),e._v(" "),"2"==e.giftType&&e.hasDate?o("div",{staticClass:"code_view"},[o("div",{staticClass:"invite_name"},[e._v("昵称："+e._s(e.superInfo.nickname))]),e._v(" "),null!=e.superInfo.wx_image&&""!=e.superInfo.wx_image?o("div",{staticClass:"invite_qrcode",attrs:{id:"superInfo.wx_image"},on:{click:function(t){return e.previewImg(e.superInfo.wx_image)}}},[o("img",{attrs:{src:e.superInfo.wx_image}}),e._v(" "),o("span",[e._v("点击查看大图")])]):e._e(),e._v(" "),null==e.superInfo.wx_image||""==e.superInfo.wx_image?o("div",{staticClass:"invite_qrcode"},[e._m(0)]):e._e(),e._v(" "),null!=e.superInfo.wx_code&&""!=e.superInfo.wx_code?o("div",{staticClass:"invite_wxcode"},[e._v("微信号: "+e._s(e.superInfo.wx_code)+"\n          "),o("label",{staticClass:"lab_copy",on:{click:function(t){return e.copyBtn(e.superInfo.wx_code)}}},[e._v("复制")]),e._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:e.superInfo.wx_code,expression:"superInfo.wx_code"}],staticClass:"hide_input",attrs:{type:"text",readonly:""},domProps:{value:e.superInfo.wx_code},on:{input:function(t){t.target.composing||e.$set(e.superInfo,"wx_code",t.target.value)}}})]):e._e()]):e._e(),e._v(" "),"3"==e.giftType&&e.hasDate?o("div",{staticClass:"code_view"},[o("div",{staticClass:"invite_name"},[e._v("昵称："+e._s(e.bossInfo.nickname))]),e._v(" "),null!=e.bossInfo.wx_image&&""!=e.bossInfo.wx_image?o("div",{staticClass:"invite_qrcode",attrs:{id:"superInfo.wx_image"},on:{click:function(t){return e.previewImg(e.bossInfo.wx_image)}}},[o("img",{attrs:{src:e.bossInfo.wx_image}}),e._v(" "),o("span",[e._v("点击查看大图")])]):e._e(),e._v(" "),null==e.bossInfo.wx_image||""==e.bossInfo.wx_image?o("div",{staticClass:"invite_qrcode"},[e._m(1)]):e._e(),e._v(" "),null!=e.bossInfo.wx_code&&""!=e.bossInfo.wx_code?o("div",{staticClass:"invite_wxcode"},[e._v("微信号: "+e._s(e.bossInfo.wx_code)+"\n          "),o("label",{staticClass:"lab_copy",on:{click:function(t){return e.copyBtn(e.bossInfo.wx_code)}}},[e._v("复制")]),e._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:e.bossInfo.wx_code,expression:"bossInfo.wx_code"}],staticClass:"hide_input",attrs:{type:"text",readonly:""},domProps:{value:e.bossInfo.wx_code},on:{input:function(t){t.target.composing||e.$set(e.bossInfo,"wx_code",t.target.value)}}})]):e._e()]):e._e(),e._v(" "),"1"==e.giftType&&e.hasDate?o("div",{staticClass:"code_view"},[o("div",{staticClass:"invite_name"},[e.showCode?o("div",{staticClass:"input_code"},[e._v("微信号："+e._s(e.code_value)),o("span",{staticClass:"lab_copy",on:{click:function(t){return e.editWxcode(e.code_value)}}},[e._v("修改")])]):e._e(),e._v(" "),e.showCode?e._e():o("div",{staticClass:"input_code"},[e._v("微信号：\n            "),o("input",{directives:[{name:"model",rawName:"v-model",value:e.code_value,expression:"code_value"}],attrs:{placeholder:"请输入微信号",type:"text"},domProps:{value:e.code_value},on:{blur:function(t){return e.saveValue(e.code_value)},input:function(t){t.target.composing||(e.code_value=t.target.value)}}}),e._v(" "),o("span",{staticClass:"lab_copy",on:{click:e.saveWxcode}},[e._v("保存")])])]),e._v(" "),null!=e.myInfo.wx_image&&""!=e.myInfo.wx_image?o("div",{staticClass:"invite_qrcode"},[o("img",{attrs:{src:e.myInfo.wx_image},on:{click:e.editavatat}}),e._v(" "),o("span",{on:{click:e.editavatat}},[e._v("点击更换二维码")])]):e._e(),e._v(" "),null==e.myInfo.wx_image||""==e.myInfo.wx_image?o("div",{staticClass:"invite_qrcode"},[o("div",{staticClass:"null_code",on:{click:e.editavatat}},[o("span",[e._v("请上传我的二维码")])])]):e._e()]):e._e(),e._v(" "),e.hasDate?e._e():o("div",{staticClass:"code_view"},[o("img",{staticClass:"null_img",attrs:{src:e.imgPath+"pro/null_1.png"}})])]),e._v(" "),e.imgShow?o("div",{staticClass:"pro_com_img_bg",attrs:{catchtouchmove:"ture"},on:{click:e.hiddenImg}}):e._e(),e._v(" "),e.imgShow?o("div",{staticClass:"pro_com_img",attrs:{catchtouchmove:"ture"},on:{click:e.hiddenImg}},[o("img",{staticClass:"img_big",attrs:{src:e.img_show_big,alt:""},on:{click:e.hiddenImg}}),e._v(" "),o("mt-button",{staticClass:"save_img",on:{click:e.saveImg}},[o("span",[e._v("保存图片")])])],1):e._e()],1),e._v(" "),e.hiddenavatar?e._e():o("div",{staticClass:"avatar_model_bg",on:{click:e.hiddenModel}}),e._v(" "),e.hiddenavatar?e._e():o("div",{staticClass:"avatar_model"},[e._m(2),e._v(" "),o("div",{staticClass:"avatar_info",on:{click:e.choseAlbum}},[o("input",{attrs:{type:"file",accept:"image/*",id:"album",name:"pic"}}),e._v(" "),o("img",{attrs:{src:e.imgPath+"com/cra.png"}}),e._v(" "),o("span",[e._v("相册")])]),e._v(" "),o("div",{staticClass:"avatar_info",on:{click:e.choseCra}},[o("img",{attrs:{src:e.imgPath+"com/cra1.png"}}),e._v(" "),o("span",[e._v("拍照")])])]),e._v(" "),o("div",{staticClass:"goIndex",on:{click:e.goIndex}},[o("i",{staticClass:"iconfont icon-home"})])],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"null_code"},[t("span",[this._v("您的邀请人暂未上传二维码")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"null_code"},[t("span",[this._v("您的导师暂未上传二维码")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"avatar_title"},[t("span",[this._v("修改二维码")])])}]};var u=o("VU/8")(d,_,!1,function(e){o("UTUh")},"data-v-50778112",null);t.default=u.exports}});
//# sourceMappingURL=52.abac4eada43760f8bc80.js.map