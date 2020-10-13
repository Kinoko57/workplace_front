// pages/redeem/redeem.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareModule:false,
    imgPath: app.globalData.fileUrl,
    isMember: app.globalData.is_member,
    isShare: app.globalData.is_share,
    content_height:0,
    show_icon: true,
    isopen: true,
    isShow:false,
    headbg:'',
    content:'',
    bgColor:'#fff',
    title:'',
    activity_id:'',
    newNews: false,
    total_amout: 0,
    topNum: 0,
    redShowList:[],
    redList: [],
    apiUrl: app.globalData.apiUrl,
    height: '',
    allowScorll: true,
    isSign: true,
    total: 0,
    page: 0,
    limit: 6,
    is_end: false,
    top: 0,
    hasData: true,
    is_load: true,
    is_iphonex: app.globalData.phoneType
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  scroll: function(e) {
    if (e.detail.scrollTop >= 980) {
      this.setData({
        isSign: false
      })
    } else {
      this.setData({
        isSign: true
      })
    }
  },
  openText:function(e){
    console.log(e)
    const that = this
    if (this.data.isopen){
      // that.animation.height(70).step()
      that.setData({
        // animation: that.animation.export(),
        isopen:false
      })
    }else{
      console.log(that.data.content_height)
        // that.animation.height(that.data.content_height).step()
        // that.setData({
        //   animation: that.animation.export()
        // })
        setTimeout(function(){
          that.setData({
            isopen: true
          })
        },400)
    }
  },
  returnTop: function() {
    this.setData({
      isSign: true
    })
    if (this.data.topNum == 0) {
      this.setData({
        topNum: 1
      })
    } else {
      this.setData({
        topNum: 0
      })
    }
  },
  getList: function() {
    var that = this
    util.queryRequest('/app/goods/index', info, 'GET').then(function(res) {
      wx.hideLoading()
      if (res.code == 200) {
        if (res.data.rows.length > 0){
          let currentpage = that.data.search_condition.page - 1
          that.setData({
            redShowList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.search_condition.size),
            is_end: Math.ceil(res.data.total / that.data.search_condition.size) == that.data.search_condition.page,
            hasData: true
          })
        }
        else{
          that.setData({
            hasData: false,
            is_end: true
          })
        }

      }else{
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
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      activity_id: options.id,
      redShowList:[],
      shareModule: app.globalData.share_module,
      isMember: wx.getStorageSync("userInfo").level_id >= 1 ? true : false,
      isShare: wx.getStorageSync("is_share") == 0 ? 0 : 1
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#f9f9f9',
    // })
    this.getList()
  },
  // 上拉加载更多
  loadMore: function() {
    var that = this
    if (this.data.is_load) {
      this.data.is_load = false;
      console.log(that.data.page)
      console.log(that.data.redList.length)
      if (that.data.page < that.data.redList.length-1){
        ++that.data.page
        let currentpage = that.data.page
        that.setData({
          ['redShowList[' + currentpage + ']']: that.data.redList[currentpage],
          is_end: false,
          is_load: true
        })
        console.log(that.data.redList[currentpage].length)
        console.log(that.data.limit)
        if (that.data.redList[currentpage].length < that.data.limit || currentpage == that.data.redList.length) {
          that.setData({
            is_load: false,
            hasData: true,
            is_end: true
          })
        }
      }else{
        that.setData({
          is_load: false,
          hasData: true,
          is_end: true
        })
      }
      console.log(this.data.redShowList)

    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.animation = wx.createAnimation({
    //   duration: 400
    // })
  },
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('show'+this.data.content_height)
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      is_iphonex: app.globalData.phoneType,
      isShow:true,
    })
      // ,
      // is_load: true,
      //   isShow: false,
      //     show_icon: true,
      //       isopen: true
    // this.animation = wx.createAnimation({
    //   duration: 400
    // })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})