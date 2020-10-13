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
    userInfo: {},
    sendValue: '',
    is_iphonex: app.globalData.isiPhoneX,
    titleTop: 0,
    page_name: '',
    isLogin: false,
    bgColor: 'transparent',
    navHeight: app.globalData.navHeight, // 导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, // 状态栏高度
    staticUrl: app.globalData.staticUrl,
    showHeight: app.globalData.useWindowHeight,
    showSkeleton: true,
    articleId: '',
    articleDetail: {},
    commentList: [],
    recommPros: [],
    isTop: true,
    navAnimation: '',
    show_nav: false,
    isShow: false,
    shareUrl: '',
    shareImg: '',
    shareTitle: '',
    isLogin: false,
    commentFocus: false,
    keyBoardHeight: -80,
    page: 1,
    size: 10,
    page_num: 0,
    is_end: false,
    fixedCommentHeight: 0,
  },
  getHeight: function (e) {
    console.log("键盘高度", e.detail.height)
    this.setData({
      keyBoardHeight: e.detail.height
    })
  },
  showComment: function () {
    if (!util.isLogin()) {
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    } else {
      if (this.data.is_iphonex) {
        this.setData({
          commentFocus: !this.data.commentFocus,
          keyBoardHeight: !this.data.commentFocus ? 0 : -148
        })
      } else {
        this.setData({
          commentFocus: !this.data.commentFocus,
          keyBoardHeight: !this.data.commentFocus ? 0 : -80
        })
      }
    }


  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goLink: util.throttle(function (event) {
    console.log(event, "sdlf")
    wx.redirectTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  getDetail() {
    let that = this
    util.queryRequest('app/dynamic/get', {
      id: this.data.articleId
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        // 商品详情
        // WxParse.wxParse('articleImg', 'html', res.data.details, that, 10);
        that.setData({
          articleDetail: res.data,
          shareImg: res.data.images[0],
          shareTitle: '【有人@你】' + res.data.title,
          isShow: true
        })
        //获取社圈高度
        let query = wx.createSelectorQuery();
        query.select('.article_detail').boundingClientRect();
        query.exec((req) => {
          console.log(req[0].height)
          that.data.fixedCommentHeight = req[0].height
        });
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
  getCommentList() {
    let that = this
    util.queryRequest('app/comment/index', {
      page: this.data.page,
      size: this.data.size,
      type: 2,
      id: this.data.articleId,
      last_id: 0
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        // 商品详情
        // WxParse.wxParse('articleImg', 'html', res.data.details, that, 10);
        if (res.data.rows.length > 0) {
          that.setData({
            commentList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
          })
        } else {
          that.setData({
            commentList: [],
            total: 0,
            page_num: 0,
            is_end: true,
          })
        }

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
  getRecommend(){
    let that = this
    util.queryRequest('app/curriculum/recommendCurr', {
      id: this.data.articleId,
      type: 4,
      page: 1,
      size: 3
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        // 整理规格信息
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].image = res.data[i].image.split(",")[0]
        }
        that.setData({
          recommPros: res.data
        })
      }
    }).catch(function (res) {})
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      info = {
        page: ++this.data.page,
        size: this.data.size,
        type: 2,
        id: this.data.articleId,
        last_id: 0
      }
      util.queryRequest('app/comment/index', info, 'GET').then(function (res) {
        if (res.code == 200) {
          that.setData({
            commentList: that.data.commentList.concat(res.data.rows),
            is_end: that.data.page_num == that.data.page
          })
        }
      })
    } else {
      console.log("加载完了")
    }

  },
  viewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.articleDetail.images // 需要预览的图片http链接列表
    })
  },
  collArticle: util.throttle(function (e) {
    if (util.isLogin()) {
      this.data.articleDetail.isCollect = !this.data.articleDetail.isCollect
      let that = this
      console.log(e[0])
      console.log(e[0].currentTarget.id)
      if (this.data.articleDetail.isCollect) {
        // 点赞商品
        util.queryRequest('app/footOther/likeAdd', {
          c_id: e[0].currentTarget.id,
          type: 2
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            that.data.articleDetail.like_num = that.data.articleDetail.like_num + 1
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('refresh', 1)
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
          type: 2
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '取消点赞成功',
              icon: 'success',
              duration: 1000
            })
            wx.setStorageSync('refresh', 1)
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
    } else {
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
  getCommentValue: function (event) {
    let value = event.detail.value
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    if (value.match(reg)) {
      value = value.replace(reg, '');
    }
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(value)){
      value = ''
    }
    this.setData({
      sendValue: value
    })
  },
  saveComment: util.throttle(function (e) {
    let that = this
    if (this.data.sendValue != '') {
      util.queryRequest('app/comment/add', {
        id: this.data.articleDetail.id,
        type: 2,
        content: this.data.sendValue,
        last_id: ''
      }, 'POST').then(function (res) {
        if (res.code == 200) {
          wx.showToast({
            title: '评价成功~',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            let obj = {
              comment_id: that.data.articleDetail.id,
              content: that.data.sendValue,
              create_time: parseInt((new Date().getTime()) / 1000),
              id: that.data.commentList.length + 1,
              last_id: 0,
              nickname: that.data.userInfo.nickname,
              image: that.data.userInfo.image,
              member_id: that.data.userInfo.id,
              status: 0,
              type: 2,
            }
            console.log(obj)
            that.data.articleDetail.comment_num = that.data.articleDetail.comment_num + 1
            that.data.commentList.unshift(obj)
            that.setData({
              sendValue: '',
              articleDetail: that.data.articleDetail,
              commentList: that.data.commentList
            })
            console.log(that.data.fixedCommentHeight)
            wx.pageScrollTo({
              scrollTop: that.data.fixedCommentHeight
            })
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      console.log("评论内容为空")
    }

  }),
  // 未登录点击分享
  toshare() {
    if (!util.isLogin()) {
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 隐藏页面按钮转发
    wx.hideShareMenu()
    this.setData({
      articleId: options.id,
      shareUrl: util.getFullUrl()
    })
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        isLogin: true,
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    if (this.data.is_iphonex) {
      that.setData({
        keyBoardHeight: -148
      })
    }
    wx.setNavigationBarTitle({
      title: '社圈详情'
    })
    this.getDetail()
    this.getCommentList()
    this.getRecommend()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        isLogin: true,
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
    if (this.data.is_iphonex) {
      this.setData({
        commentFocus: false,
        keyBoardHeight: -148
      })
    } else {
      this.setData({
        commentFocus: false,
        keyBoardHeight: -80
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.is_iphonex) {
      this.setData({
        commentFocus: false,
        keyBoardHeight: -148
      })
    } else {
      this.setData({
        commentFocus: false,
        keyBoardHeight: -80
      })
    }
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
    console.log('到底了')
    if (this.data.is_end == false) {
      this.loadMore()
    }
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
        type: 2,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log("添加社圈分享成功")
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