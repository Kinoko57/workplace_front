// pages/editInfo/editInfo.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editname: '修改信息',
    editcode: '',
    editInput: 0,
    addrList: [],
    value: '',
    chooseAdd: false,
    choseId: '',
    cou_id:'',
    default_code: '',
    default_cou: '',
    ship_id: '',
    addType: '',
    staticAdd: [],
    orderType: '',
    pid: '',
    amount: 0,
    is_iphonex: app.globalData.phoneType
  },
  editAdd: function(e) {
    wx.setStorageSync("edit_info", e.currentTarget.dataset.info);
    wx.navigateTo({
      url: '../editAddr/editAddr?type=edit'
    })
  },
  newAdd: function() {
    wx.navigateTo({
      url: '../editAddr/editAddr?type=new'
    })
  },
  delAdd: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除当前地址',
      success: function(res) {
        if (res.confirm) {
          util.queryRequest('?m=member&a=removeaddress', {
            id: e.currentTarget.id
          }, 'GET', function(res) {
            if (res.isSuccess == true) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function() {
                util.queryRequest('?m=member&a=myaddress', {}, 'GET', function(res) {
                  if (res.isSuccess) {
                    that.setData({
                      addrList: res.rows
                    })
                  }
                })
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  editInfo: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  saveInfo: function() {
    var flag = true
    if (this.data.editcode == 'email') {
      var str = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$')
      if (!str.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的邮箱',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    } else if (this.data.editcode == 'nickname') {
      var str = new RegExp('^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,8}$')
      if (!str.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的用户名',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    }
    var that = this
    if (flag) {
      var obj = {}
      var key = that.data.editcode;
      obj[key] = that.data.value;
      var arr = []
      arr.push(obj)
      util.queryRequest('?m=myinfo&a=usersave', {
        data: JSON.stringify(arr)
      }, 'POST', function(res) {
        if (res.isSuccess) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          if (that.data.editcode == 'nickname') {
            app.globalData.userInfo.username = app.globalData.userInfo.username
            app.globalData.userInfo.avatar = app.globalData.userInfo.avatar
            app.globalData.userInfo.level = app.globalData.userInfo.level
            app.globalData.userInfo.isShow = 1
            app.globalData.userInfo.nickname = that.data.value
            wx.setStorageSync("userInfo", app.globalData.userInfo);
          }
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }

  },
  checkAddr: function(e) {
    for (var i = 0, len = this.data.addrList.length; i < len; i++) {
      this.data.addrList[i].is_default = '0'
    }
    var list = {};
    for (var i = 0, len = this.data.addrList.length; i < len; i++) {
      if (this.data.addrList[i].id == e.detail.value) {
        this.data.addrList[i].is_default = '1'
        list = this.data.addrList[i]
      }
    }
    this.setData({
      addrList: this.data.addrList
    })
    var that = this
    util.queryRequest('?m=member&a=editaddress', {
      id: e.detail.value,
      ship_name: list.ship_name,
      ship_mobile: list.ship_mobile,
      ship_area: list.ship_area,
      ship_addr: list.ship_addr,
      is_default: '1'
    }, 'POST', function(res) {
      if (res.isSuccess) {
        if (that.data.chooseAdd) {
          util.queryRequest('?m=cart&a=add_cashcoupon_code', {
            coupon_id:that.data.cou_id,
            coupon_code: that.data.choseId,
            checked: that.data.pid,
            shipmethod_id: that.data.ship_id,
            cart_type: that.data.addType,
            type: that.data.orderType,
            address_id: e.detail.value,
          }, 'GET', function(res) {
            if (res.isSuccess) {
              var pages = getCurrentPages()
              var prevPage = pages[pages.length - 2] //上一个页面
              prevPage.data.orderDetail.total_price = res.amount
              var cou = ''
              if (that.data.choseId == '') {
                cou = '选择优惠券'
              } else {
                cou = '已减' + Number(res.coupon_discount) + '元'
              }
              if (res.amount != undefined) {
                prevPage.data.orderDetail.total_price = res.amount
              } else {
                prevPage.data.orderDetail.total_price = that.data.amount
              }
              prevPage.setData({
                couInfo: cou,
                couValue: res.coupon_discount,
                couCode: res.cart_params,
                couId: res.coupon_id,
                orderDetail: prevPage.data.orderDetail,
                staticAdd: [list],
                static_freight: res.cost_freight
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
          // wx.navigateBack({
          //   delta: 1
          // })
        }
      }
    })

  },
  choseAdd: function(e) {
    if (this.data.chooseAdd) {
      var list = {};
      for (var i = 0, len = this.data.addrList.length; i < len; i++) {
        if (this.data.addrList[i].id == e.currentTarget.id) {
          list = this.data.addrList[i]
        }
      }
      var that = this
      util.queryRequest('?m=cart&a=add_cashcoupon_code', {
        coupon_id: that.data.cou_id,
        coupon_code: that.data.choseId,
        checked: that.data.pid,
        shipmethod_id: that.data.ship_id,
        cart_type: that.data.addType,
        type: that.data.orderType,
        address_id: e.currentTarget.id,
      }, 'GET', function(res) {
        if (res.isSuccess) {
          var cou = ''
          if (that.data.choseId == '') {
            cou = '选择优惠券'
          } else {
            cou = '已减' + Number(res.coupon_discount) + '元'
          }
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 2] //上一个页面
          prevPage.data.orderDetail.total_price = res.amount
          if (res.amount != undefined) {
            prevPage.data.orderDetail.total_price = res.amount
          } else {
            prevPage.data.orderDetail.total_price = that.data.amount
          }
          prevPage.setData({
            couInfo: cou,
            couId: res.coupon_id,
            couValue: res.coupon_discount,
            couCode: res.cart_params,
            orderDetail: prevPage.data.orderDetail,
            chooseAdd: e.currentTarget.id,
            staticAdd: [list],
            chooseAdd: 0,
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
    // this.dialog = this.selectComponent("#reload");
    var that = this
    if (options.type == 'choose') {
      that.setData({
        chooseAdd: true
      })
    }
    if (options.code == 'address') {
      if (options.type != undefined) {
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1]; //当前页
        var prevPage = pages[pages.length - 2]; //上一个页面
        if (prevPage.data.couCode.indexOf('c=') != -1) {
          prevPage.data.couCode = prevPage.data.couCode.substring(2)
        }
        console.log(prevPage.data.couCode)
        // if (prevPage.data.trackId != undefined) {
        that.data.ship_id = prevPage.data.trackId
        // }
        this.setData({
          choseId: prevPage.data.couCode,
          cou_id: prevPage.data.couId,
          ship_id: that.data.ship_id,
          addType: prevPage.data.addType,
          orderType: prevPage.data.orderType,
          staticAdd: prevPage.data.staticAdd,
          pid: options.pid,
          amount: prevPage.data.orderDetail.total_price
        })
        console.log(prevPage.data.couCode)
        console.log(prevPage.data.couId)
        console.log(that.data.ship_id)
        console.log(prevPage.data.addType)
        console.log(prevPage.data.orderType)
        console.log(prevPage.data.staticAdd)
        console.log(options.pid)
        console.log(prevPage.data.orderDetail.total_price)
      }
    } else if (options.code == 'nickname' || options.code == 'email') {
      if (options.value == 'null' || options.value == '') {
        this.setData({
          value: ''
        })
      } else {
        this.setData({
          value: options.value
        })
      }
    }
    this.setData({
      editcode: options.code,
      editInput: options.isInput
    })
    wx.setNavigationBarTitle({
      title: options.codename
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
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
    var that = this
    if (that.data.editcode == 'address') {
      util.queryRequest('?m=member&a=myaddress', {}, 'GET', function(res) {
        if (res.isSuccess == true) {
          that.setData({
            addrList: res.rows
          })
        }
      })
    }
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})