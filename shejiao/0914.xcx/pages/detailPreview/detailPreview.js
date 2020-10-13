// pages/viewArticle/viewArticle.js
let util = require('../../utils/util.js')
var app=getApp()
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo_id:wx.getStorageSync('userInfo').id,//用户自己的id
    is_iphonex: app.globalData.isiPhoneX,
    titleTop: 0,
    page_name: '2020年4月24 12：24',
    isLogin:false,
    id:'',
    bgColor: 'transparent',
    statusBarHeight: app.globalData.statusBarHeight, // 状态栏高度
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true,
    articleId: '',
    viewDetail: {},
    scrollHeight:0,
    isTop: true,
    navAnimation: '',
    show_nav: false,
    shareUrl: '',
    shareImg: '',
    shareTitle: '',
    isLogin: false,

  },
  getDetail() {
    let that = this
    util.queryRequest('/app/dynamic/viewDetail', {
      id: that.data.id
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        res.data.create_time=util.formatTime(res.data.create_time)
        that.setData({
          viewDetail: res.data,
          // shareImg: res.data.images[0],
          // shareTitle: '【有人@你】'+res.data.title,
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
  viewImage(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.viewDetail.images // 需要预览的图片http链接列表
    })
  },
  collView: util.throttle(function (e) {
    if(util.isLogin()){
     
      let that = this
      console.log(e[0])
      console.log(e[0].currentTarget.id)
      if(this.data.viewDetail.is_like==0){
        // 点赞 取消商品
        this.data.viewDetail.is_like = !this.data.viewDetail.is_like
        util.queryRequest('/app/dynamic/beFondOf', {
          dynamic_id: e[0].currentTarget.id,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            that.data.viewDetail.like_num = that.data.viewDetail.like_num + 1
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('refresh',1)
            setTimeout(() => {
              that.setData({
                viewDetail: that.data.viewDetail
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }else{
        this.data.viewDetail.is_like = !this.data.viewDetail.is_like
          // 点赞 取消商品
          util.queryRequest('/app/dynamic/beFondOf', {
            dynamic_id: e[0].currentTarget.id,
          }, 'GET').then(function (res) {
            if (res.code == 200) {
              that.data.viewDetail.like_num = that.data.viewDetail.like_num - 1
              wx.showToast({
                title: '取消点赞成功',
                icon: 'success',
                duration: 1000
              })
              wx.setStorageSync('refresh',1)
              setTimeout(() => {
                that.setData({
                  viewDetail: that.data.viewDetail
                })
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
      }
      this.setData({
        viewDetail: this.data.viewDetail
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }),
  followView: util.throttle(function (e) {
    console.log("guanzhu")
    if(util.isLogin()){
      let that = this
        // 关注
        let msg=''
        if(e[0].currentTarget.dataset.type=='follow'){
          msg='关注'
        }else{
          msg='取消关注'
        }
        util.queryRequest('/app/dynamic/collect', {
          anchor_id: that.data.viewDetail.member_id,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            that.data.viewDetail.is_anchor = !that.data.viewDetail.is_anchor
            wx.showToast({
              title: msg+'成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              that.setData({
                viewDetail: that.data.viewDetail
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
        this.setData({
          viewDetail: this.data.viewDetail
        })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }),
  goLink(e) {
    console.log(e)
    if(util.isLogin()){
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }else{
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 隐藏页面按钮转发
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#010101',
    // })
    wx.hideShareMenu()
    this.setData({
      id: options.id,
      shareUrl: util.getFullUrl()
    })
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined){
      this.setData({
        isLogin:true,
      })
    }
    if(this.data.is_iphonex){
      this.setData({
        scrollHeight:app.globalData.useWindowHeight-84
      })
    }else{
      this.setData({
        scrollHeight:app.globalData.useWindowHeight-50
      })
    }
    that.getDetail()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined){
      this.setData({
        isLogin:true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.navAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
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
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    console.log(e.scrollTop)
    if (e.scrollTop > 140) {
      if (this.data.isTop) {
        this.setData({
          isTop: false
        })
      }
    } else {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(this.data.shareTitle)
      console.log(this.data.shareUrl)
      console.log(this.data.shareImg)
      console.log(this.data.articleId)
      // 添加分享记录
      let that = this
      util.queryRequest('app/footOther/shareAdd', {
        c_id: that.data.articleId,
        type: 1,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log("添加动态分享成功")
        }
      })
      // 来自页面内转发按钮
      return {
        title: this.data.shareTitle,
        imageUrl: this.data.shareImg,
        path: this.data.shareUrl
      }
    }
  }
})