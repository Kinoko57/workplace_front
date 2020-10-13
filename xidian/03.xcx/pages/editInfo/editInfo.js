// pages/editInfo/editInfo.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    value:'',
    editTit:'',
    editcode:'',
    placeholder:'请输入昵称'
  },
  editInfo: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  saveInfo:util.throttle(function () {
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
      var str = new RegExp('^[\u4e00-\u9fa5_a-zA-Z0-9_.]{2,35}$')
      if (!str.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的用户名',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    } else if (this.data.editcode == 'wx_number'){
      var wechat_reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
      var phone_reg = /^1[3|4|5|6|7|8|9]\d{9}$/
      if (!wechat_reg.test(this.data.value) && !phone_reg.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的微信号',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    }
    var that = this
    if (flag) {
      var obj = {}
      var url = 'app/member/edit'
      var key = that.data.editcode;
      obj[key] = that.data.value;
      console.log(obj)
      util.queryRequest(url, obj, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }else{
          wx.showToast({
            title: res.msg ,
            icon: 'none',
            duration: 3000
          })
          console.log(res.msg)
        }
      })
    }
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      editTit: options.codename,
      editcode: options.code,
      value: options.value,
      placeholder: options.codename

    })
    wx.setNavigationBarTitle({
      title: '修改'+this.data.editTit,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})