// pages/useCoupon/useCoupon.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couList: [],
    couUseList: [],
    couNoList: [],
    staticAdd: [],
    couValue: 0,
    choseId: 0,
    cou_id:0,
    choseType: 0,
    isChecked: false,
    pid: '',
    default_code: '',
    default_cou: '',
    ship_id: '',
    addType: '',
    orderType: '',
    is_iphonex: app.globalData.phoneType,
  },
  choseType: function(e) {
    if (e.currentTarget.id == 0) {
      this.data.couList = this.data.couUseList
    } else {
      this.data.couList = this.data.couNoList
    }
    this.setData({
      choseType: e.currentTarget.id,
      couList: this.data.couList
    })
  },
  choseCou: function(e) {
    for (var i = 0; i < this.data.couList.length; i++) {
      this.data.couList[i].ischose = false
      this.data.couList[i].checked = false
    }
    this.setData({
      couList: this.data.couList
    })
    if (e.detail.value.length > 0) {
      var cou_id = e.detail.value.pop()
      for (var i = 0; i < this.data.couList.length; i++) {
        if (this.data.couList[i].id == cou_id) {
          this.data.couList[i].ischose = true
          this.data.couList[i].checked = true
          this.data.couValue = this.data.couList[i].cashworth
          this.data.isChecked = true
          this.data.choseId = this.data.couList[i].code
        }
      }
      this.setData({
        cou_id: cou_id,
        choseId: this.data.choseId,
        default_code: this.data.choseId,
        couValue: this.data.couValue,
        isChecked: this.data.isChecked,
        couList: this.data.couList,
        couUseList: this.data.couList,
      })
    } else {
      for (var i = 0; i < this.data.couList.length; i++) {
        this.data.couList[i].ischose = false
        this.data.couList[i].checked = false
      }
      this.setData({
        default_code: '',
        couList: this.data.couList,
        choseId: '',
        cou_id:'',
        couValue: 0,
        isChecked: false,
        couUseList: this.data.couList,
      })
    }

  },
  useCou: function() {
    var that = this
    var addId = ''
    console.log(that.data.staticAdd)
    if (that.data.staticAdd.length > 0) {
      addId = that.data.staticAdd[0].id
    }
    if (that.data.choseId == '') {
      if (that.data.default_cou.indexOf('c=') != -1) {
        that.data.default_cou = that.data.default_cou.substring(2)
      }
      util.queryRequest('?m=cart&a=remove_cashcoupon_code', {
        coupon_id: that.data.cou_id,
        coupon_code: that.data.default_cou,
        checked: that.data.pid,
        cart_type: that.data.addType,
        shipmethod_id: that.data.ship_id,
        type: that.data.orderType,
        address_id: addId,
      }, 'GET', function(res) {
        if (res.isSuccess) {
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 2] //上一个页面
          prevPage.data.orderDetail.total_price = res.amount
          prevPage.setData({
            couInfo: '选择优惠券',
            couValue: res.coupon_discount,
            couCode: res.cart_params,
            couId: res.coupon_id,
            orderDetail: prevPage.data.orderDetail,
            couList: that.data.couList.concat(that.data.couNoList),
            static_freight: res.cost_freight
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      util.queryRequest('?m=cart&a=add_cashcoupon_code', {
        coupon_id: that.data.cou_id,
        coupon_code: that.data.choseId,
        checked: that.data.pid,
        shipmethod_id: that.data.ship_id,
        cart_type: that.data.addType,
        type: that.data.orderType,
        address_id: addId,
      }, 'GET', function(res) {
        if (res.isSuccess) {
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 2] //上一个页面
          prevPage.data.orderDetail.total_price = res.amount
          prevPage.setData({
            couInfo: '已减' + Number(res.coupon_discount) + '元',
            couValue: res.coupon_discount,
            couCode: res.cart_params,
            couId: res.coupon_id,
            orderDetail: prevPage.data.orderDetail,
            couList: that.data.couList.concat(that.data.couNoList),
            static_freight: res.cost_freight
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var info = prevPage.data.couList //取上页data里的数据也可以修改
    this.setData({
      default_cou: prevPage.data.default_cou,
      ship_id: prevPage.data.trackId,
      addType: prevPage.data.addType,
      orderType: prevPage.data.orderType,
      staticAdd: prevPage.data.staticAdd
    })
    for (var i = 0; i < info.length; i++) {
      if (info[i].totime.indexOf('-') == -1) {
        info[i].totime = util.formatDate(info[i].totime)
      }
      info[i].ischose = info[i].checked
      if (info[i].checked) {
        this.data.default_code = info[i].code
        this.data.couValue = info[i].cashworth
        this.data.isChecked = true
        this.data.choseId = info[i].code
        this.data.cou_id = info[i].id
      }
    }
    var canUseList = []
    var notUseList = []
    for (var i = 0; i < info.length; i++) {
      if (info[i].can_use) {
        canUseList.push(info[i])
      } else {
        notUseList.push(info[i])
      }
    }
    this.setData({
      couList: canUseList,
      couUseList: canUseList,
      couNoList: notUseList,
      couValue: this.data.couValue,
      pid: options.pid,
      default_code: this.data.default_code,
      isChecked: this.data.isChecked,
      choseId: this.data.choseId,
      cou_id: this.data.cou_id
    })
    wx.setNavigationBarTitle({
      title: '使用优惠券'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})