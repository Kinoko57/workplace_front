// pages/addCar/addCar.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    show_bank:false,
    realInfo:{
      id: '',
      bankCard:'',
      bankName: '',
      mobile: '',
    },
    card_name:'',
    bank_id:'',
    index:0,
    showSkeleton:true,
    is_iphonex: app.globalData.isiPhoneX,
  },
  bindPickerChange: function(e) {
    const that=this
    this.data.realInfo.bankName=this.data.bankList[e.detail.value].name
    this.setData({
      index: e.detail.value,
      bank_id:that.data.bankList[e.detail.value].bank_id,
      show_bank:true,
      realInfo: this.data.realInfo
    })
    console.log(this.data.bank_id,e)
  },
  //验证输入后的值是否正确
  inputValue(e) {
    // console.log(e)
    if(e.detail.value!=''){
      if(e.currentTarget.dataset.name=='mobile'){
        this.data.realInfo.mobile=e.detail.value
      }else if(e.currentTarget.dataset.name=='bankCard'){
        this.data.realInfo.bankCard=e.detail.value
      }
      this.setData({
        realInfo:this.data.realInfo
      })
    }
  },
  sureBind(){
    let msg=''
    let flag=true
    if(this.data.realInfo.mobile==''){
      msg='请输入手机号'
      flag=false
    }
    if(this.data.realInfo.bankName==''){
      msg='请选择开户行'
      flag=false
    }
    if(this.data.realInfo.bankCard==''){
      msg='请输入银行卡号'
      flag=false
    }
    if(this.data.card_name==''){
      msg='请输入用户姓名'
      flag=false
    }
    if(this.data.realInfo.mobile!=''&&!/^1\d{10}$/.test(this.data.realInfo.mobile)){
      msg='手机号格式不正确'
      flag=false
    }
    if(this.data.realInfo.bankCard!=''&&!/^[0-9]{16,19}$/.test(this.data.realInfo.bankCard)){
      msg='银行卡号不正确'
      flag=false
    }
    console.log(!/^[\d]{16,19}$/.test(this.data.realInfo.bankCard),this.data.realInfo.bankCard)
    if(flag){
      let obj={
        name:this.data.card_name,
        mobile:this.data.realInfo.mobile,
        bankCard:this.data.realInfo.bankCard,
        bank_id:this.data.bank_id,
        bankName:this.data.realInfo.bankName,
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      util.queryRequest('/app/wallet/bank', obj, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
          console.log(res.msg)
        }
      })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 3000
      })
    }
  },
  getBankList(){
    const  that=this
    util.queryRequest('/app/wallet/bankList', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        wx.hideLoading()
        that.setData({
          bankList:res.data,
          showSkeleton:false
        })
        console.log(that.data.bankList.length)
        console.log(res.data.length)
      }else{
        wx.hideLoading()
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加银行卡',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getBankList()
    this.setData({
      card_name:wx.getStorageSync('userInfo').card_name
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