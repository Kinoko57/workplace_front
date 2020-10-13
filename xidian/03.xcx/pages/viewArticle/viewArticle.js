// pages/viewArticle/viewArticle.js
let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_iphonex: app.globalData.isiPhoneX,
    titleTop: 0,
    page_name: '',
    isLogin:false,
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
    shareUrl: '',
    shareImg: '',
    shareTitle: '',
    isLogin: false,

  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  getDetail() {
    let that = this
    util.queryRequest('app/article/get', {
      id: this.data.articleId
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        // 商品详情
        // WxParse.wxParse('articleImg', 'html', res.data.details, that, 10);
        that.setData({
          articleDetail: res.data,
          shareImg: res.data.images[0],
          shareTitle: '【有人@你】'+res.data.title,
          isShow: true
        })
        wx.setNavigationBarTitle({
          title: util.formatDateTime(res.data.create_time)
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
      urls: this.data.articleDetail.images // 需要预览的图片http链接列表
    })
  },
  collArticle: util.throttle(function (e) {
    if(util.isLogin()){
      this.data.articleDetail.isCollect = !this.data.articleDetail.isCollect
      let that = this
      console.log(e[0])
      console.log(e[0].currentTarget.id)
      if (this.data.articleDetail.isCollect) {
        // 点赞商品
        util.queryRequest('app/footOther/likeAdd', {
          c_id: e[0].currentTarget.id,
          type: 1
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            that.data.articleDetail.like_num = that.data.articleDetail.like_num + 1
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('refresh',1)
            setTimeout(() => {
              that.setData({
                articleDetail: that.data.articleDetail
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
      } else {
        // 取消点赞
        util.queryRequest('app/footOther/cancelLike', {
          c_id: e[0].currentTarget.id,
          type: 1
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '取消点赞成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('refresh',1)
            that.data.articleDetail.like_num = that.data.articleDetail.like_num - 1
            setTimeout(() => {
              that.setData({
                articleDetail: that.data.articleDetail
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
        proInfo: this.data.proInfo
      })
    }else{
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }
  }),
  showNav: function () {
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
  hideNav: function () {
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
    // 未登录点击分享
    toshare(){
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    },
  goIndex: function (e) {
    if (e.currentTarget.dataset.type == '0') {
      wx.reLaunch({
        url: e.currentTarget.dataset.link
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  goLink(event) {
    console.log(event)
    if(util.isLogin()){
      wx.navigateTo({
        url: '../articleDetail/articleDetail?id=' + this.data.articleId
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#010101',
    })
    wx.hideShareMenu()
    this.setData({
      articleId: options.id,
      shareUrl: util.getFullUrl()
    })
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined){
      this.setData({
        isLogin:true,
      })
    }

    this.getDetail()
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