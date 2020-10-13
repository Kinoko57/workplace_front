// common/nyz_area_picker/nyz_area_picker.js
var areaTool = require('../../utils/area.js');
let parse = require('../../utils/address-parse.js')
var index = [0, 0, 0]
// console.log('开始执行组件')
var provinces = []
var citys = []
var areas = []
// var provinces = areaTool.getProvinces();
// var citys = areaTool.getCitys(index[0]);
// var areas = areaTool.getAreas(index[0], index[1]);
// console.log(provinces)
// console.log(citys)
// console.log(areas)
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: { //控制area_select显示隐藏
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        console.log('值变化')
        // 属性值变化时执行
        if (this.data.show) {
          console.log(newVal, "值")
          console.log(oldVal, "值")
          console.log(this.data.showValue,"值")
          var arr = areaTool.getIndex(this.data.showValue)
          console.log(arr)
          if (arr != undefined) {
            this.setData({
              provinces: provinces,
              citys: areaTool.getCitys(arr[0]),
              areas: areaTool.getAreas(arr[0], arr[1]),
              value: arr,
              province: this.data.showValue[0],
              city: this.data.showValue[1],
              area: this.data.showValue[2]
            })
            this.scrollArea(arr)
          }
        }
      }
    },
    maskShow: { //是否显示蒙层
      type: Boolean,
      value: true
    },
    showValue: {
      type: Array,
      value: [0, 0, 0]
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      const that=this
      wx.request({
        url: getApp().globalData.apiUrl + '/app/index/getRegion',
        data: {},
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": wx.getStorageSync("cookie"),
          "realhost":getApp().globalData.realhost,
          "app-type":'xcx'
        },
        success: function (res) {
          if (res.statusCode === 200) {
            console.log(res)
            if (res.data.code == 200) {
              areaTool.setArea(res.data.data)
              getApp().globalData.areaJson = res.data.data
              parse.init(res.data.data)
              provinces = areaTool.getProvinces()
              citys = areaTool.getCitys(index[0])
              areas = areaTool.getAreas(index[0], index[1])
              that.setData({
                provinces: provinces,
                citys: citys,
                areas: areas,
              })
            }
          }
        },
        fail: function (res) {
          reject(res)
        }
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    provinces:[],
    citys: [],
    areas: [],
    // provinces: provinces,
    // citys: areaTool.getCitys(index[0]),
    // areas: areaTool.getAreas(index[0], index[1]),
    value: [0, 0, 0],
    province:{id:1,name:'北京市'},
    city: { id: 2, name: '北京市' },
    area: { id: 3, local_name: '东城区' },
    choseEnd: 1
  },
  /**
   * 组件的方法列表
   */

  methods: {
    startScroll() {
      this.data.choseEnd = 0
    },
    endScroll() {
      console.log('滚动截止')
      console.log(this.data.provinces)
      console.log(this.data.citys)
      console.log(this.data.areas)
      console.log(this.data.province)
      console.log(this.data.city)
      console.log(this.data.area)
      this.data.choseEnd = 1
    },
    handleNYZAreaChange: function (e) {
      var that = this;
      var value = e.detail.value;
      /**
       * 滚动的是省
       * 省改变 市、区都不变
       */
      if (index[0] != value[0]) {
        index = [value[0], 0, 0]
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], 0);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], 0, 0],
          province: provinces[index[0]],
          city: selectCitys[0],
          area: selectAreas[0]
        })
      } else if (index[1] != value[1]) {
        /**
         * 市改变了 省不变 区变
         */
        index = [value[0], value[1], 0]
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], value[1]);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], 0],
          province: provinces[index[0]],
          city: selectCitys[index[1]],
          area: selectAreas[0]
        })
      } else if (index[2] != value[2]) {
        /**
         * 区改变了
         */
        index = [value[0], value[1], value[2]]
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], value[1]);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], index[2]],
          province: provinces[index[0]],
          city: selectCitys[index[1]],
          area: selectAreas[index[2]]
        })
      }
    },
    scrollArea: function (value) {
      console.log(value)
      console.log(index)
      var that = this;
      /**
       * 滚动的是省
       * 省改变 市、区都不变
       */
      if (index[0] != value[0]) {
        index = [value[0], 0, 0]
        console.log(index)
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], 0);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], 0, 0],
          province: provinces[index[0]],
          city: selectCitys[0],
          area: selectAreas[0]
        })
      }
      if (index[1] != value[1]) {
        /**
         * 市改变了 省不变 区变
         */
        index = [value[0], value[1], 0]
        console.log(index)
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], index[1]);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], 0],
          province: provinces[index[0]],
          city: selectCitys[index[1]],
          area: selectAreas[0]
        })
      }
      if (index[2] != value[2]) {
        /**
         * 区改变了
         */
        index = [value[0], value[1], value[2]]
        console.log(index)
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], index[1]);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], index[2]],
          province: provinces[index[0]],
          city: selectCitys[index[1]],
          area: selectAreas[index[2]]
        })
      }
    },
    /**
     * 确定按钮的点击事件
     */
    handleNYZAreaSelect: function(e) {
      console.log(e,"这个值")
      if (this.data.choseEnd == 1) {
        console.log("e:" + JSON.stringify(e));
        var myEventDetail = e; // detail对象，提供给事件监听函数
        var myEventOption = {}; // 触发事件的选项
        this.triggerEvent('sureSelectArea', myEventDetail, myEventOption)
      }
    },
    /**
     * 取消按钮的点击事件
     */
    handleNYZAreaCancle: function(e) {
      var that = this;
      console.log("e:" + JSON.stringify(e))
      that.setData({
        show: false
      })
    }
  }
})