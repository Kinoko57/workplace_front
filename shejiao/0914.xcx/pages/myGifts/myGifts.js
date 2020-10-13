// pages/myGifts/myGifts.js
let util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton: true,
    staticUrl: app.globalData.staticUrl,
    chose_id: 1,
    page: 1,
    size: 6,
    giftList: [],
    page_num: 0,
    hasData: true,
    is_end: true,
    is_load: false,
    isTop: true, // 返回顶部
  },
  choseTab: util.throttle(function (e) {
    if (e[0].currentTarget.id == this.data.chose_id) {
      console.log("点击了已选中的tab")
    } else {
      this.setData({
        chose_id: e[0].currentTarget.id,
        page: 1,
        giftList: [],
        page_num: 0,
        hasData: true,
        is_end: false,
        is_load: false,
      })
      // 查询不同id下的列表数据
      this.getList()
    }
  }),
  confirmAddr: util.throttle(function (e) {
    console.log(e[0].currentTarget.id)
    wx.navigateTo({
      url: '/pages/writeAddress/writeAddress?type=confirm&win_id=' + e[0].currentTarget.id
    })
  }),
  viewAddr: util.throttle(function (e) {
    console.log(e[0].currentTarget.id)
    wx.navigateTo({
      url: '/pages/writeAddress/writeAddress?type=view&win_id=' + e[0].currentTarget.id
    })
  }),
  viewTrack: util.throttle(function (e) {
    console.log(e[0].currentTarget.id)
    console.log(e[0].currentTarget.dataset.oid)
    wx.navigateTo({
      url: '/pages/findLog/findLog?oid=' + e[0].currentTarget.dataset.oid + '&img=' + e[0].currentTarget.dataset.url
    })
  }),
  getList: function (e) {
    console.log("执行列表查询接口")
    this.setData({
      giftList: [],
      page_num: 0,
      hasData: true,
      is_end: true,
      is_load: false,
    })
    if (this.data.chose_id == 1) {
      // 获取抽奖列表
      let that = this
      let info = {
        page: this.data.page,
        size: this.data.size
      }
      util.queryRequest('/app/lotteryOrder/prizeList', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows.length > 0) {
            that.setData({
              giftList: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: res.data.rows.length == 0 ? false : true
            })
          } else {
            that.setData({
              giftList: [],
              hasData: false,
              is_end: true
            })
          }
        }
      })
      console.log(that.data.total)
      console.log(that.data.page_num)
      console.log(that.data.is_end)
      console.log(that.data.hasData)
    } else {
      // 获取红包列表
      let that = this
      let info = {
        page: this.data.page,
        size: this.data.size
      }
      util.queryRequest('/app/redPacket/getRecord', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows != undefined) {
            that.setData({
              giftList: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: res.data.rows.length == 0 ? false : true
            })
          } else {
            that.setData({
              giftList: [],
              hasData: false
            })
          }
        }
      })
    }
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 140) {
      if (this.data.isTop == true) {
        console.log("显示返回顶部")
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 140) {
      if (this.data.isTop == false) {
        console.log("隐藏返回顶部")
        this.setData({
          isTop: true
        })
      }
    }
  },
  loadMore: function () {
    let that = this
    let info = {
      page: ++that.data.page,
      size: that.data.size,
    }
    if (this.data.chose_id == 1) {
      util.queryRequest('/app/lotteryOrder/prizeList', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows.length > 0) {
            that.data.giftList = that.data.giftList.concat(res.data.rows)
            that.setData({
              giftList: that.data.giftList,
              is_end: that.data.page_num == that.data.page,
            })
          } else {
            that.setData({
              is_end: true,
            })
          }
        }
      })
    } else {
      util.queryRequest('/app/redPacket/getRecord', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows.length > 0) {
            that.data.giftList = that.data.giftList.concat(res.data.rows)
            that.setData({
              giftList: that.data.giftList,
              is_end: that.data.page_num == that.data.page,
            })
          } else {
            that.setData({
              is_end: true,
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 1500)
    wx.setNavigationBarTitle({
      title: '我的奖品',
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
    this.setData({
      page: 1,
    })
    this.getList()
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
    console.log('到底了')
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