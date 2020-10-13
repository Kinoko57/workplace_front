// pages/articleList/articleList.js
let col1H = 0,
  col2H = 1;
let query;

let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    triggered: false,
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    activityType: '',
    activityId: '',
    activityBanner: '',
    scrollHeight: app.globalData.useWindowHeight,
    filePath: app.globalData.fileUrl,
    typeList: [],
    articleList: [],
    message_unread: 0,
    article_total: 0,
    page: 1,
    size: 6,
    page_num: 0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum: 0,
    scrollH: 0,
    imgWidth: 320,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  goLink(event) {
    console.log(event)
    wx.navigateTo({
      url: event.currentTarget.dataset.link
    })
  },
  getArticleType() {
    let that = this
    util.queryRequest('app/dynamic/getCate', {}, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(that.data.activityId, "类型切换")
        if (that.data.activityId == '') {
          console.log("获取列表")
          let banner = res.data[0].banner
          let activityId = res.data[0].id
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = 'type_' + res.data[i].id
          }
          that.setData({
            activityId: activityId,
            typeList: res.data,
            activityType: 'type_' + activityId,
            activityBanner: banner,
            showSkeleton: false,
            articleList: [],
            col1: [],
            col2: [],
          })
          wx.setStorageSync('activity_id', activityId)
          wx.setStorageSync('now_activity_id', activityId)
          that.getList()
        } else {
          let banner = ''
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = 'type_' + res.data[i].id
            if (that.data.activityId == res.data[i].id) {
              banner = res.data[i].banner
            }
          }
          that.setData({
            typeList: res.data,
            showSkeleton: false,
            activityType: 'type_' + that.data.activityId,
            activityBanner: banner
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
  choseTypeId: util.throttle(function (e) {
    console.log(e[0])
    if (e[0].currentTarget.dataset.type != this.data.activityId) {
      col1H = 0
      col2H = 0
      this.setData({
        showSkeleton: true,
        activityId: e[0].currentTarget.dataset.type,
        activityType: e[0].currentTarget.id,
        activityBanner: e[0].currentTarget.dataset.banner,
        is_end: false,
        page: 1,
        articleList: [],
        col1: [],
        col2: [],
        loadingCount: 0
      })
      wx.setStorageSync('activity_id', e[0].currentTarget.dataset.type)
      wx.setStorageSync('now_activity_id', e[0].currentTarget.dataset.type)
      this.getList()
    } else {
      console.log("点击了重复的tab")
    }
  }, 500),
  getList() {
    let that = this
    let info = {
      cate_id: this.data.activityId,
      page: this.data.page,
      size: this.data.size,
    }
    util.queryRequest('app/dynamic/index', info, 'GET').then(function (res) {
      wx.stopPullDownRefresh()
      if (res.code == 200) {
        if (res.data.rows.length > 0) {
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].left = 1
            if (i % 2 == 0) {
              res.data.rows[i].left = 0
            }
          }
          that.isLeft(res.data.rows);
          that.setData({
            showSkeleton: false,
            articleList: res.data.rows,
            article_total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        } else {
          that.setData({
            showSkeleton: false,
            hasData: false,
            is_end: true
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
    }, function (req) {
      wx.setStorageSync('activity_id', '0')
      console.log(req, "网络")
    })
  },
  async isLeft(list) {
    let {
      col1,
      col2
    } = this.data;
    query = wx.createSelectorQuery();
    console.log(col1H)
    console.log(col2H)
    for (const item of list) {
      col1H <= col2H ? col1.push(item) : col2.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(col1, col2);
    }
  },
  getBoxHeight(col1, col2) { //获取左右两边高度
    console.log()
    return new Promise((resolve, reject) => {
      this.setData({
        col1,
        col2
      }, () => {
        query.select('.article_block_left').boundingClientRect();
        query.select('.article_block_right').boundingClientRect();
        query.exec((res) => {
          if(res[0]!=null){
            col1H = res[0].height; //获取左边列表的高度
          }
          if(res[1]!=null){
            col2H = res[1].height; //获取右边列表的高度
          }
          resolve();
        });
      });
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      info = {
        cate_id: this.data.activityId,
        page: ++this.data.page,
        size: this.data.size,
      }
      util.queryRequest('app/dynamic/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].left = 1
            if (i % 2 == 0) {
              res.data.rows[i].left = 0
            }
          }
          that.setData({
            articleList: that.data.articleList.concat(res.data.rows),
            is_end: that.data.page_num == that.data.page
          })
          that.isLeft(res.data.rows);
        }
      })
    } else {
      console.log("加载完了")
    }

  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '社圈'
    })
    col1H = 0
    col2H = 0
    if(option.id!=''){
      this.setData({
        activityId: option.id
      })
    // 获取分类列表
    this.getArticleType()
    // 根据id获取动态列表
    this.getList()

    }

    let that = this
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
      let query1 = wx.createSelectorQuery()
      query1.select('.article_top').boundingClientRect()
      query1.exec(function (res) {
        that.setData({
          scrollHeight: app.globalData.useWindowHeight - res[0].height
        })
      })
    }, 500)
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
    let that = this
    // that.setData({
    //   showSkeleton: true
    // })
    // setTimeout(() => { //3S后隐藏骨架屏
    //   that.setData({
    //     showSkeleton: false
    //   })
    // }, 500)

  },
  onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 2000)
  },

  onRestore(e) {
    console.log('onRestore:', e)
    console.log("执行刷新操作")
    col1H = 0
    col2H = 0
    this.setData({
      col1: [],
      col2: [],
      articleList: [],
      page_num: 0,
      page: 1,
      hasData: true,
      is_end: false,
    })
    // 获取分类列表
    this.getArticleType()
    // 根据id获取动态列表
    this.getList()
  },

  onAbort(e) {
    console.log('onAbort', e)
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