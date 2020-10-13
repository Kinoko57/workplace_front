// pages/changePay/changePay.js
var app=getApp();
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_password:0,
    length: 6,        //输入框个数
    isFocus: true,    //聚焦
    value: "",        //输入的内容
    ispassword: true,
    next_check:'',//first two end 修改手机号
    default_once:'one',//设置密码
    default_once_value:'',//设置密码二次验证
    inputLen: 6,
    hide_value:'',
    new_value:'',//新密码
    next_value:'',//再次确认密码
    page_name:'',
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
  },
  savePass(){
    const that=this
    if(that.data.value==that.data.default_once_value){
      util.queryRequest('/app/personalCenter/setPayPassword', {pay_password:that.data.value}, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.showToast({
            title: '修改成功',
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
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
      })
    }else{
      let msg=''
      if(that.data.default_once_value==''){
        msg='请再次输入支付密码'
      }else{
        msg='两次输入密码不一致'
      }
      wx.showToast({
        title:msg,
        icon: 'none',
        duration: 3000
      })
    }
  },
  // 点击下一步
  goNext(){
    const that=this
    if(that.data.pay_password==0){
      if(that.data.value.length==6){
        that.setData({
          default_once:'two',
          hide_value:''
        })
      }else{
        wx.showToast({
          title: '请输入新密码',
          icon: 'none',
          duration: 3000
        })
      }
    }else{
      if(this.data.next_check=='first'){
        if(that.data.value.length==6){
          wx.showLoading({
            title: '验证中...',
          })
          util.queryRequest('/app/wallet/checkPassword', {password:that.data.value}, 'POST').then(function (res) {
            wx.hideLoading()
            if (res.code === 200 || res.code === '200') {
              wx.showToast({
                title: '验证成功',
                icon:'success',
                duration:1000
              })
              that.setData({
                next_check:'two',
                hide_value:''
              })
            }else{
              wx.showToast({
                title: '密码输入不正确',
                icon: 'none',
                duration: 3000
              })
            }
          })
        }else{
          wx.showToast({
            title: '请输入密码',
            icon: 'none',
            duration: 3000
          })
        }
      }else if(this.data.next_check=='two'){
        if(that.data.new_value.length==6){
          that.setData({
            next_check:'end',
            hide_value:''
          })
        }else{
          wx.showToast({
            title: '请输入新密码',
            icon: 'none',
            duration: 3000
          })
        }
      }else{
        if(that.data.new_value==that.data.next_value){
          util.queryRequest('/app/personalCenter/setPayPassword', {pay_password:that.data.value,newPassword:that.data.new_value}, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.showToast({
                title: '修改成功',
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
                title: res.msg,
                icon: 'none',
                duration: 3000
              })
            }
          })
        }else{
          if(that.data.next_value==''){
            wx.showToast({
              title: '请再次输入密码',
              icon: 'none',
              duration: 3000
            })
          }else{
            wx.showToast({
              title: '密码输入不一致',
              icon: 'none',
              duration: 3000
            })
          }
        }
      }
    }
  },
    //是否输入获取验证码的焦点
    tap() {
      var that = this;
      that.setData({
        isFocus: true,
      })
    },
    //设置input输入值1
    focus(e) {
      console.log(e)
      var that = this;
      var inputValue = e.detail.value;
      // 未设置密码
      if(that.data.pay_password==0){
          if(that.data.default_once=='one'){
            that.setData({
              value: inputValue,
            })
          }else{
            that.setData({
              default_once_value: inputValue,
            })
          }
      }else{
        if(that.data.next_check=='first'){
          that.setData({
            value: inputValue,
          })
        }else if(that.data.next_check=='two'){
          that.setData({
            new_value: inputValue,
          })
        }else{
          that.setData({
            next_value: inputValue,
          })
        }
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,options.pay_password==1)
     this.setData({
      pay_password:options.pay_password
     })
     if(options.pay_password==1){
       this.setData({
        next_check:'first',
        page_name:'修改支付密码'
       })
     }else{
      this.setData({
        next_check:'',
        page_name:'支付密码'
       })
     }
     wx.setNavigationBarTitle({
      title:this.data.page_name,
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
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
  onShareAppMessage: function () {

  }
})