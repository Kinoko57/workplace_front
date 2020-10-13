// pages/Cash/Cash.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    is_iphonex: app.globalData.isiPhoneX,
    cash_moey: '',
    showCkeck: false,//提现弹框是否出现
    length: 6,        //输入框个数
    isFocus: true,    //聚焦
    value: "",        //输入的内容
    ispassword: true,
    inputLen: 6,
    timeCode: "",
    cashObj:{},
    show_dia_info:'',//弹框信息
    tatList:[],
    bank_Card:'',
    showModel:false,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    staticUrl: app.globalData.staticUrl,
  },
  // 查看个税说明
  findDetail(){
    this.setData({
      showModel:true
    })
  },
  // 关闭个税说明弹框
  closeModel(){
    this.setData({
      showModel:false
    })
  },
  goLink(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  //是否输入获取验证码的焦点
  tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 获取页面信息
  getCashInfo(){
    const that=this
    util.queryRequest('/app/wallet/withDrawDetail', {bankCard:that.data.bank_Card}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          showSkeleton:false,
          bank_Card:res.data.long_bankCard,
          cashObj:res.data
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 获取个税说明接口
  gettax(){
    const that=this
    util.queryRequest('/app/wallet/peopleTax', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          tatList:res.data,
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //设置提现密码input输入值,进行提现校验
  focus(e) {
    var that = this;
    that.setData({
      value:  e.detail.value,
    })
    if(e.detail.value.length==6){
      this.checkPassWord()
    }
  },
  // 输入提现金额
  inputValue(e){
    this.setData({
      cash_moey: e.detail.value,
    })
  },
  // 失去提现金额
  blurValue(e){
    let max_num=(this.data.cashObj.max_withdraw/100).toFixed(2)
    // if(e.detail.value>max_num){
    //   wx.showToast({
    //     title: '超出最大提现金额',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   this.setData({
    //     cash_moey:e.detail.value,
    //   })
    // }else{
      this.setData({
        cash_moey: e.detail.value,
      })
    // }
  },
  // 全部提现
  allCash(){
    this.setData({
      cash_moey:(this.data.cashObj.balance/100).toFixed(2),
    })
  },
  //关闭验证码弹框
  closeCheck: function () {
    this.setData({
      showCkeck: false,
      value: ''
    })
  },
  // 点击确认提现出现支付弹框
  sureCash() {
   const that=this
    let max_num=(this.data.cashObj.max_withdraw/100).toFixed(2)
    let flag=true
    let msg=''
    if(that.data.cash_moey==''){
      flag=false
      msg='请输入提现金额'
    }
    if(that.data.bank_Card==''){
      flag=false
      msg='请选择银行卡'
    }
    if(that.data.cash_moey!=''&&Number(that.data.cash_moey)>Number(max_num)){
      flag=false
      msg='超出最大提现金额'
    }
    if(flag){
      util.queryRequest('/app/wallet/handleMoney', {money:that.data.cash_moey}, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          that.setData({
            showCkeck: true,
            show_dia_info:res.data,
            value: ''
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else{
      wx.showToast({
        title:msg,
        icon: 'none',
        duration: 3000
      })
    }
   
  },
  // 验证提现密码
  checkPassWord(){
    const that=this
    util.queryRequest('/app/wallet/checkPassword', {password:that.data.value}, 'POST').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        let obj={
          mobile:that.data.cashObj.mobile,
          bankCard:that.data.cashObj.long_bankCard,
          bankName:that.data.cashObj.bankName,
          money:that.data.cash_moey,
          password:that.data.value
        }
        util.queryRequest('/app/wallet/withDraw', obj, 'POST').then(function (res) {
          if (res.code === 200 || res.code === '200') {
            wx.showToast({
              title:'提现成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              that.setData({
                showCkeck: false,
                value: ''
              })
              wx.navigateBack({
                delta: 1
              })
              wx.removeStorageSync('bank_Card')
            }, 1000)
          }else{
            that.setData({
              value: '',
              isFocus:true
            })
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        that.setData({
          value: '',
          isFocus:true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:'提现',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.gettax()
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
    if(wx.getStorageSync('bank_Card')!=undefined&&wx.getStorageSync('bank_Card')!=''){
      this.setData({
        bank_Card:wx.getStorageSync('bank_Card')
      })
    }
    this.getCashInfo()
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
    wx.removeStorageSync('bank_Card')
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