webpackJsonp([14],{"5Qkl":function(t,e){},"6OKp":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("Dd8w"),i=a.n(s),n=a("fqE/"),o=a("NYxO"),r=a("Au9i"),h={1:"星期日",2:"星期一",3:"星期二",4:"星期三",5:"星期四",6:"星期五",7:"星期六"},c={1:"一月",2:"二月",3:"三月",4:"四月",5:"五月",6:"六月",7:"七月",8:"八月",9:"九月",10:"十月",11:"十一月",12:"十二月"},l={name:"DatePicker",components:{Toast:r.Toast},props:{date:{type:String,required:!0},minDate:{type:String,default:"1970-01-01"},maxDate:{type:String,default:"2020-12-31"},signList:{type:Array}},computed:i()({},Object(o.b)([]),{yearList:function(){for(var t=[],e=this.copyMinDate.year;e<=this.copyMaxDate.year;e+=1)t.push(e);return t},title:function(){return{year:"",monthday:""}},rows:function(){var t=this.showDate,e=t.year,a=t.month,s=new Date(e,a,0).getDate();console.log(s);for(var i=[],n=[],o=void 0,r=1;r<=s;r+=1)o=new Date(e,a-1,r).getDay()+1,1===r&&1!==o?(this.addRowEmptyValue(n,o),this.addRowDayValue(n,r,this.signDays.includes(r),o)):(this.addRowDayValue(n,r,this.signDays.includes(r),o),r===s&&7!==o&&this.addRowEmptyValue(n,7-o+1)),o%7!=0&&r!==s||(i.push(n),n=[]);for(var h=0;h<i.length;h++)for(var l=0;l<i[h].length;l++)""!=i[h][l].value&&l>0&&void 0!=i[h][l-1].hasSign&&i[h][l-1].hasSign&&(i[h][l].beforeChoose=!0);return this.showDate.monthStr=c[this.showDate.month],i}}),data:function(){return{imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",selectDate:{year:"",month:"",day:"",week:"",date:"",weekStr:"",monthStr:""},showDate:{year:"",month:"",day:"",week:"",date:"",monthStr:"",weekStr:""},copyMinDate:{year:"",month:"",day:""},copyMaxDate:{year:"",month:"",day:""},signDays:[],toolbar:"",fadeXType:"fadeX_Prev",nextMonthClick:!1,prevMonthClick:!1,showYear:!1}},created:function(){this.signDays=this.signList,this.initDatePicker(),console.log(this.signList)},methods:i()({},Object(o.c)({setSignData:"SET_SIGNDATA"}),{initDatePicker:function(){this.showDate=i()({},this.splitDate(this.date,!0)),this.copyMinDate=i()({},this.splitDate(this.minDate)),this.copyMaxDate=i()({},this.splitDate(this.maxDate)),this.selectDate=i()({},this.showDate)},splitDate:function(t,e){var a={},s=t.split("-");try{if(!s||s.length<3)throw new Error("时间格式不正确");a={year:Number(s[0]),month:Number(s[1]),day:Number(s[2])},e&&(a.week=new Date(a.year,a.month-1,a.day).getDay()+1,a.monthStr=c[a.month],a.weekStr=h[a.week])}catch(t){console.error(t)}return a},addRowEmptyValue:function(t,e){for(var a=1;a<e;a+=1)t.push({value:""})},addRowDayValue:function(t,e,a,s){var i={value:e,hasSign:!1,beforeChoose:!1,afterChoose:!1,week:s};i.hasSign=a,t.push(i)},resetSelectDate:function(t){this.selectDate=i()({},this.showDate),this.selectDate.day=t,this.selectDate.week=new Date(this.showDate.year,this.showDate.month-1,t).getDay()+1,this.selectDate.weekStr=h[this.selectDate.week]},selectDay:function(t){if(!t.disabled&&!t.selected&&""!==t.value)if(this.resetSelectDate(t.value),t.hasfoot){var e=(this.showDate.year+"-"+this.keepDoubleDigit(this.showDate.month)+"-"+this.showDate.day).split("-");e[2]=this.keepDoubleDigit(t.value);var a=e.join("-");this.$emit("getValue",a)}else this.$emit("getValue",!1)},selectYear:function(t){this.showYear=!1,this.showDate.year=t;var e=void 0;if(this.isMinLimitMonth()?e="copyMinDate":this.isMaxLimitMonth()&&(e="copyMaxDate"),e)return this.showDate.month=this[e].month,this.showDate.day=this[e].day,void this.resetSelectDate(this.showDate.day);var a=this.selectDate.day;if(this.selectDate.day>28){var s=new Date(this.showDate.year,this.showDate.month-1,0).getDate();a=s<a?s:a}this.resetSelectDate(a)},isMinLimitMonth:function(){return this.showDate.year<=this.copyMinDate.year&&this.showDate.month<=this.copyMinDate.month},isMaxLimitMonth:function(){return this.showDate.year>=this.copyMaxDate.year&&this.showDate.month>=this.copyMaxDate.month},openYearList:function(){var t=this;if(this.showYear)this.showYear=!1;else{var e=this.yearList.indexOf(this.selectDate.year);this.showYear=!0,setTimeout(function(){t.$refs.yearList.scrollTop=40*(e-3)})}},openCalendarList:function(){this.showYear=!1},keepDoubleDigit:function(t){return t>9?t:"0"+t},confirm:function(){var t=this.selectDate,e=t.year,a=t.month,s=t.day,i=t.week,n=t.weekStr,o=t.monthStr;this.$emit("confirm",{date:e+"-"+this.keepDoubleDigit(a)+"-"+this.keepDoubleDigit(s),year:e,month:a,week:i,monthStr:o,weekStr:n,day:s})}})},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"e-calendar"},[a("div",{directives:[{name:"show",rawName:"v-show",value:!t.showYear,expression:"!showYear"}],staticClass:"e-calendar-container"},[a("div",{staticClass:"e-calendar-monthday"},[a("transition",{attrs:{name:t.fadeXType}},[a("div",{key:t.showDate.monthStr,staticClass:"e-calendar-monthday-wrapper"},t._l(t.rows,function(e,s){return a("div",{key:s,staticClass:"e-calendar-monthday-row"},t._l(e,function(e,s){return a("span",{key:s,staticClass:"e-calendar-monthday-row-day",class:{active:e.hasSign,disabled:e.disabled,pointer:""!==e.value},on:{click:function(a){return t.selectDay(e)}}},[e.beforeChoose&&e.hasSign&&1!=e.week?a("img",{staticClass:"before",attrs:{src:t.imgPath+"member/chose_date.jpg"}}):t._e(),t._v(" "),a("span",{staticClass:"e-calendar-monthday-row-day-value",domProps:{textContent:t._s(e.value)}}),t._v(" "),e.afterChoose&&e.hasSign&&7!=e.week?a("img",{staticClass:"after",attrs:{src:t.imgPath+"member/chose_date.jpg"}}):t._e(),t._v(" "),a("transition",{attrs:{name:"e_calendar_day"}},[e.hasSign?a("span",{staticClass:"e-calendar-monthday-row-day-cover"}):t._e()])],1)}),0)}),0)])],1)])])},staticRenderFns:[]};var u=a("VU/8")(l,d,!1,function(t){a("QrZp")},"data-v-b1ac39ee",null).exports,g=a("gyMJ"),m={name:"MySignIn",components:{commonHeader:n.a,InfiniteScroll:r.InfiniteScroll,Indicator:r.Indicator,Button:r.Button,Lazyload:r.Lazyload,Toast:r.Toast,SignPicker:u},data:function(){return{head_color:{background:"#ec346A",color:"#fff"},h_title:"每日签到",hasEmptyGrid:!1,showPicker:!1,signDate:0,isSign:!1,signTime:[],score:"",sign_info:"",imgPath:"https://share.gongzhugou.com/static/image/xcx_img/",year:(new Date).getFullYear(),mon:(new Date).getMonth()+1,date:(new Date).getFullYear()+"-"+((new Date).getMonth()+1<=0?"0"+(new Date).getMonth()+1:(new Date).getMonth()+1)+"-01"}},mounted:function(){this.getList()},methods:i()({},Object(o.c)({setNews:"SET_NEWS"}),{getList:function(){var t=this;Object(g._25)().then(function(e){if(e.isSuccess){console.log(e);for(var a=0;a<e.rows.length;a++)t.signTime.push(new Date(1e3*e.rows[a]).getDate());t.signDate=e.days,t.score=e.point,t.sign_info=e.sign_rule_set,console.log(t.signTime),console.log((new Date).getDate()),console.log(t.signTime.includes((new Date).getDate())),t.signTime.includes((new Date).getDate())&&(t.isSign=!0)}})},goTop:function(){console.log("回到顶部"),document.getElementById("sign").scrollIntoView({block:"start",behavior:"smooth"})},goScore:function(){this.$router.togo({path:"/proList?type=key&virtual_id=&price=asc&value="})},getValue:function(t){console.log(t)},sign:function(){var t=this;Object(g._46)().then(function(e){e.isSuccess?(Object(r.Toast)({message:"签到成功，获得"+e.point+"积分",duration:2e3}),t.getList()):Object(r.Toast)({message:e.msg,duration:2e3})})}}),computed:i()({},Object(o.b)([]))},D={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("common-header",{attrs:{h_title:t.h_title,showback:!0,bgcolor:t.head_color}}),t._v(" "),a("return-top",{on:{returnTop:t.goTop}}),t._v(" "),a("div",{staticStyle:{height:"0.9rem"},attrs:{id:"sign"}}),t._v(" "),a("div",{staticClass:"sign_in"},[a("div",{staticClass:"sign_body"},[a("div",{staticClass:"sign_banner"},[a("img",{attrs:{src:t.imgPath+"member/sign_bg_02.jpg"}}),t._v(" "),a("div",{staticClass:"banner_left",on:{click:t.sign}},[t.isSign?a("span",{staticStyle:{"font-size":"0.5rem"}},[t._v("已签到")]):a("span",{staticStyle:{"font-size":"0.6rem"}},[t._v("签到")]),t._v(" "),a("span",{staticStyle:{"font-size":"0.3rem","font-family":"'DIN'"}},[t._v("连续"+t._s(t.signDate)+"天")])]),t._v(" "),a("div",{staticClass:"banner_right"},[a("div",{staticStyle:{"font-size":"0.42rem",color:"#fff"}},[t._v("签到领积分")]),t._v(" "),a("div",{staticClass:"banner_score"},[a("i",{staticClass:"iconfont icon-jifen1"}),t._v(" "),a("span",[t._v(t._s(t.score))])]),t._v(" "),a("div",{staticClass:"btn",on:{click:t.goScore}},[a("i",{staticClass:"iconfont icon-weibiaoti2fuzhi14"}),t._v(" "),a("span",[t._v("前往购物商城")])])])]),t._v(" "),a("div",{staticClass:"sign_date"},[a("div",{staticClass:"sign_title"},[t._v(t._s(t.year)+"年"+t._s(t.mon)+"月")]),t._v(" "),a("sign-picker",{ref:"sign",attrs:{date:t.date,"sign-list":t.signTime},on:{getValue:t.getValue}})],1),t._v(" "),a("div",{staticClass:"sign_info"},[t._m(0),t._v(" "),a("div",{staticClass:"info_more"},[a("span",[t._v(t._s(t.sign_info))])])])])])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"info_title"},[e("span",[this._v("签到规则")]),this._v(" "),e("div")])}]};var y=a("VU/8")(m,D,!1,function(t){a("5Qkl")},"data-v-7139df25",null);e.default=y.exports},QrZp:function(t,e){}});
//# sourceMappingURL=14.175e05ce246f6e1d043e.js.map