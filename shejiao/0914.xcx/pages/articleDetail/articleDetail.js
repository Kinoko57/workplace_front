// pages/articleDetail/articleDetail.js
let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleTop: 0,
    page_name: '',
    bgColor: 'transparent',
    navHeight: app.globalData.navHeight, // 导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, // 状态栏高度
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true,
    articleId: '',
    articleDetail: {},
    isTop: true,
    navAnimation: '',
    show_nav: false,
    isShow: false,
    shareUrl:'',
    shareImg: '',
    shareTitle: '',

  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  getDetail() {
    let that = this
    util.queryRequest('/app/article/get', {
      id: this.data.articleId
    }, 'GET').then(function(res) {
      if (res.code == 200) {
        console.log(res)
        // 商品详情
        WxParse.wxParse('articleImg', 'html', res.data.details, that, 10);
        that.setData({
          articleDetail:res.data,
          shareImg: res.data.image,
          shareTitle: res.data.title,
          isShow: true
        })
        // 获取文章标题距离顶部的高度
      let query1 = wx.createSelectorQuery()
      query1.select('.hot_title').boundingClientRect()
      query1.exec(function(res) {
        that.setData({
          titleTop: res[0].top
        })
      })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })

  },
  showNav:function(){
    this.setData({
      show_nav: true
    })
    let that = this
    var querys = wx.createSelectorQuery()
    querys.select('.hideNav').boundingClientRect()
    querys.select('.fastNav').boundingClientRect()
    querys.exec(function (res) {
      console.log(res)
      that.navAnimation.height(res[0].height).step()
      that.setData({
        navAnimation: that.navAnimation.export()
      })
    })
  },
  hideNav:function(){
    let that = this
    var querys = wx.createSelectorQuery()
    querys.select('.closeNav').boundingClientRect()
    querys.exec(function (res) {
      console.log(res)
      that.navAnimation.height(res[0].height).step()
      that.setData({
        navAnimation: that.navAnimation.export()
      })
    })
    that.setData({
      show_nav: false
    })
  },
  goIndex: function(e) {
    if(e.currentTarget.dataset.type=='0'){
      wx.reLaunch({
        url: e.currentTarget.dataset.link
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    this.setData({
      articleId: options.id,
      shareUrl: util.getFullUrl()

    })
    this.getDetail()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.navAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
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
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    console.log(e.scrollTop)
    if (e.scrollTop > 140) {
      if (this.data.isTop) {
        this.setData({
          isTop: false
        })
      }
      if(e.scrollTop>this.data.titleTop&&this.data.page_name==''){
        this.setData({
          page_name:this.data.articleDetail.title,
          bgColor:'#fff'
        })
      }
      if(e.scrollTop<this.data.titleTop&&this.data.page_name!=''){
        this.setData({
          page_name: '',
          bgColor:''
        })
      }
    }else{
      if (this.data.isTop == false) {
        this.setData({
          isTop: true,
          page_name: '',
          bgColor:''
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.shareTitle)
    console.log(this.data.shareUrl)
    console.log(this.data.shareImg)
    return {
      title: this.data.shareTitle,
      path: this.data.shareUrl,
      imageUrl: this.data.shareImg
    }
  }
})