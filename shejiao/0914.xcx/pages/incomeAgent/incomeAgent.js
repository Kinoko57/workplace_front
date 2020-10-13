// pages/incomeAgent/incomeAgent.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    page:1,
    size:7,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    disable_balance: 0,//未结算
    enable_balance: 0,//可提现
    total_money: 0,//总收益
    navHeight:app.globalData.navHeight,//导航栏高度
    staticUrl: app.globalData.staticUrl,
    zan_height:250-app.globalData.navHeight,
    zan_height_iphonex:250-app.globalData.navHeight+25,
    isiPhoneX: app.globalData.isiPhoneX,
    incomeList:[],
    viewDetail:{},
  },
  viewFind(e){
    const that=this
    if( that.data.incomeList[e.currentTarget.dataset.blockindex][e.currentTarget.dataset.index].isUp==false){
      that.data.incomeList[e.currentTarget.dataset.blockindex][e.currentTarget.dataset.index].isUp=!that.data.incomeList[e.currentTarget.dataset.blockindex][e.currentTarget.dataset.index].isUp
      that.setData({
        incomeList:that.data.incomeList,
      })
    }else{
      that.data.incomeList[e.currentTarget.dataset.blockindex][e.currentTarget.dataset.index].isUp=!that.data.incomeList[e.currentTarget.dataset.blockindex][e.currentTarget.dataset.index].isUp
      that.setData({
        incomeList:that.data.incomeList
      })
    }
    console.log(that.data.incomeList)
  },
  getIncomeInfo(){
    const that = this
    let info = {
      page:this.data.page,
      size: this.data.size,
    }
    util.queryRequest('/app/sellReward/seeReward', info, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.income.length > 0) {
          let currentpage = that.data.page - 1
          for(let i=0;i<res.data.income.length;i++){
            res.data.income[i].isUp=false
          }
          that.setData({
            disable_balance: res.data.disable_balance,//未结算
            enable_balance:  res.data.enable_balance,//可提现
            total_money: res.data.total_money,//总收益
            ['incomeList[' + currentpage + ']']:res.data.income,
            total: res.data.total,
            showSkeleton:false,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else {
          that.setData({
            hasData: false,
            showSkeleton:false,
            is_end: true
          })
        }
        that.setData({
          afterDeatil:res.data,
          showSkeleton:false
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
  loadMore(){
    const that=this
    let info = {
      page: ++this.data.page,
      size: this.data.size,
    }
    util.queryRequest('/app/sellReward/seeReward', info, 'GET').then(function (res) {
      if (res.code == 200) {
        for(let i=0;i<res.data.income.length;i++){
          res.data.income[i].isUp=false
        }
        let currentpage = that.data.page - 1
        that.setData({
          ['incomeList[' + currentpage + ']']:res.data.income,
          is_end: that.data.page_num == that.data.page
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(app.globalData.navHeight,"导航栏高度")
    this.getIncomeInfo()
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
    if (this.data.is_end == false) {
      this.loadMore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})