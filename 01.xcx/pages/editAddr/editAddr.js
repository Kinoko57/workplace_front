// pages/editAddr/editAddr.js
let util = require('../../utils/util.js')
import {
  validate,
  validateRequired
} from '../../utils/validate'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showswitch: true,
    editname: '新增地址',
    addInfo: {
      id: '',
      name: null,
      mobile: null,
      area: null,
      addr: null,
      is_default: false,
    },
    areaShow: ['请选择省', '市', '区'],
    addType: null,
    form: {},
    isChose:0,
    show: false
  },
  // bindRegionChange: function(e) {
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },
  sureSelectAreaListener: function (e) {
    var that = this;
    that.data.areaShow[0] = e.detail.currentTarget.dataset.province
    that.data.areaShow[1] = e.detail.currentTarget.dataset.city
    that.data.areaShow[2] = e.detail.currentTarget.dataset.area
    that.setData({
      show: false,
      areaShow: that.data.areaShow,
      isChose:1
    })
    e.detail.value = this.data.areaShow
    that.validate(e)

  },
  // 打开地区选择组件
  chooseAddress: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  switch1Change: function(e) {},
  formSubmit: function(e) {
    if (this.data.addType == 'new') {
      validateRequired(['phone'], self)
      validateRequired(['name'], self)
      validateRequired(['area'], self)
      validateRequired(['addr'], self)
    }
    if ('' === self.data.form.$invalidMsg) {
      wx.showLoading({
        title: '加载中'
      })
      var list = e.detail.value
      list.area = this.data.areaShow
      console.log(list)
      if (this.data.addType == 'change') {
        //订单详情修改地址
        var info_addr = {
          order_id: this.data.addInfo.order_id,
          ship_name: list.name,
          ship_mobile: list.phone,
          ship_area: list.area[0] + '/' + list.area[1] + '/' + list.area[2],
          ship_addr: list.addr
        }
        console.log(info_addr)
        // 修改订单地址
        util.queryRequest('?m=order&a=order_consignee', info_addr, 'POST', function(res) {
          if (res.isSuccess == true) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.navigateBack({
              delta: 1
            })
            // wx.showToast({
            //   title: res.msg,
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        })
      } else {
        var addr_list = {
          id: this.data.addInfo.id,
          ship_name: list.name,
          ship_mobile: list.phone,
          ship_area: list.area[0] + '/' + list.area[1] + '/' + list.area[2],
          ship_addr: list.addr,
          is_default: list.is_default == true ? '1' : '0'
        }
        console.log(addr_list)
        // 新增地址和修改地址
        util.queryRequest('?m=member&a=editaddress', addr_list, 'POST', function(res) {
          if (res.isSuccess == true) {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 1000
            })
            console.log(list.is_default)
            if (list.is_default) {
              addr_list.id = res.id
              console.log(res)
              //获取选择地址列表页的数据
              var pages = getCurrentPages();
              var thirdpages = pages[pages.length - 3]; //上上一个页面
              var secondPage = pages[pages.length - 2]; //上一个页面
              var that = this
              if (thirdpages.route.indexOf('sureOrder') == -1) {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else {
                util.queryRequest('?m=cart&a=add_cashcoupon_code', {
                  coupon_code: secondPage.data.choseId,
                  checked: secondPage.data.pid,
                  shipmethod_id: secondPage.data.ship_id,
                  cart_type: secondPage.data.addType,
                  type: secondPage.data.orderType,
                  address_id: res.id,
                }, 'GET', function(req) {
                  if (req.isSuccess) {
                    var cou = ''
                    if (secondPage.data.choseId == '') {
                      cou = '选择优惠券'
                    } else {
                      cou = '已减' + Number(req.coupon_discount) + '元'
                    }
                    var prevPage = getCurrentPages()[getCurrentPages().length - 3] //上上个页面
                    prevPage.data.orderDetail.total_price = req.amount
                    if (req.amount != undefined) {
                      prevPage.data.orderDetail.total_price = req.amount
                    } else {
                      prevPage.data.orderDetail.total_price = that.data.amount
                    }
                    prevPage.setData({
                      couInfo: cou,
                      couValue: req.coupon_discount,
                      couCode: req.cart_params,
                      orderDetail: prevPage.data.orderDetail,
                      chooseAdd: res.id,
                      staticAdd: [addr_list],
                      chooseAdd: 0,
                      static_freight: req.cost_freight
                    })
                    wx.navigateBack({
                      delta: 2
                    })
                  }
                })
              }
            } else {
              setTimeout(function() {
                // wx.redirectTo({
                //   url: '../editInfo/editInfo?code=addr&codename=我的地址&isInput=1'
                // })
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }

          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }

    } else {
      console.log('valid')
    }
  },
  validate(e) {
    if (e.currentTarget.dataset.name == 'area') {
      if (e.detail.value.length == 0) {
        e.detail.value = ''
      } else {
        this.setData({
          areaShow: e.detail.value
        })
        console.log(this.data.areaShow)
        e.detail.value = e.detail.value[0] + '/' + e.detail.value[1] + '/' + e.detail.value[2]
      }
    }
    console.log(e.detail.value)
    if (e)
      console.log(e.currentTarget.dataset.name)
      this.setData({
        [e.currentTarget.dataset.name]: e.detail.value
      })
    validate(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    this.setData({
      addType: options.type
    })
    if (options.type == 'new') {
      wx.setNavigationBarTitle({
        title: this.data.editname
      })
    } else if (options.type == 'edit') {
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      this.data.form = {
        $dirty: true,
        $invalidMsg: "",
        addr: "",
        area: "",
        name: "",
        phone: "",
      }
      this.setData({
        form: this.data.form
      })
      var info = wx.getStorageSync("edit_info")
      this.data.addInfo = {
        id: info.id,
        name: info.ship_name,
        phone: info.ship_mobile,
        area: info.ship_area,
        addr: info.ship_addr,
        is_default: info.is_default == '1' ? true : false,
      }
      console.log(this.data.addInfo.area)
      this.data.areaShow = this.data.addInfo.area.split('/')
      console.log(this.data.areaShow )
      this.setData({
        addInfo: this.data.addInfo,
        areaShow: this.data.areaShow,
        isChose: 1
      })
    } else if (options.type == 'change') {
      wx.setNavigationBarTitle({
        title: options.editname
      })
      this.data.form = {
        $dirty: true,
        $invalidMsg: "",
        addr: "",
        area: "",
        name: "",
        phone: "",
      }
      var pages = getCurrentPages();
      var secondPage = pages[pages.length - 2]; //上一个页面
      console.log(secondPage)
      this.data.addInfo = {
        order_id: secondPage.data.order.order_id,
        name: secondPage.data.order.ship_name,
        phone: secondPage.data.order.ship_mobile,
        area: secondPage.data.order.ship_area,
        addr: secondPage.data.order.ship_addr
      }
      console.log(this.data.addInfo)
      this.data.areaShow = this.data.addInfo.area.split('/')
      this.setData({
        addInfo: this.data.addInfo,
        areaShow: this.data.areaShow,
        showswitch: false,
        isChose: 1
      })
      console.log(this.data.areaShow)
    }
    self = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },

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