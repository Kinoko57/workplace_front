// pages/findList/findList.js
let util = require('../../utils/util.js')
let asideHeight=[{leftHeight:0,rightHeight:0},{leftHeight:0,rightHeight:0},{leftHeight:0,rightHeight:0},{leftHeight:0,rightHeight:0}]
let query;
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    activeTab:0,
    choseId:'dynamic',
    navList:[{id:'dynamic',name:'动态'},{id:'liveroom',name:'直播'},{id:'notice',name:'预告'},{id:'anchor',name:'主播'}],
    showSkeleton:true,
    isLogin: false,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    scrollHeight:'0px',
    search_text:'',
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    total:0,
    page:1,
    size:10,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    userInfo_image:app.globalData.staticUrl+'flash/flash_01.png'
  },
  // 观看详情
  goDetail:util.throttle(function (e){
    const that=this
    if(util.isLogin()){
      if(that.data.activeTab==3){
        wx.navigateTo({
          url: '../previewDetail/previewDetail?id='+e[0].currentTarget.dataset.id
        })
      }else{
        wx.navigateTo({
          url: '../detailPreview/detailPreview?id='+e[0].currentTarget.dataset.id
        })
      }
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },500),
  collView: util.throttle(function (e) {
    if(util.isLogin()){
      let that = this
      if(e[0].currentTarget.dataset.like==0){
        // 点赞 取消商品
        util.queryRequest('/app/dynamic/beFondOf', {
          dynamic_id: e[0].currentTarget.dataset.id,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            that.data.tabs[that.data.activeTab].list[e[0].currentTarget.dataset.index].like_num =  that.data.tabs[that.data.activeTab].list[e[0].currentTarget.dataset.index].like_num+1
            that.data.tabs[that.data.activeTab].list[e[0].currentTarget.dataset.index].is_like = 1
            setTimeout(() => {
              that.setData({
                tabs:  that.data.tabs
              })
            }, 100)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }else{
          // 点赞 取消商品
          util.queryRequest('/app/dynamic/beFondOf', {
            dynamic_id: e[0].currentTarget.dataset.id,
          }, 'GET').then(function (res) {
            if (res.code == 200) {
              that.data.tabs[that.data.activeTab].list[e[0].currentTarget.dataset.index].like_num =  that.data.tabs[that.data.activeTab].list[e[0].currentTarget.dataset.index].like_num-1
              that.data.tabs[that.data.activeTab].list[e[0].currentTarget.dataset.index].is_like = 0
              setTimeout(() => {
                that.setData({
                  tabs:  that.data.tabs
                })
              }, 100)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }),
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
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
  getList(){
    const that = this
    util.queryRequest('/app/broadcast/liveSearch', {
       page:that.data.page,
       search:that.data.search_text==undefined?'':that.data.search_text,
       size:that.data.size,
       type: that.data.choseId,
    }, 'GET').then(function (res) {
      wx.hideLoading()
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
            that.setData({
              list: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true,
              showSkeleton:false
            })
        }else {
          that.setData({
            hasData: false,
            showSkeleton: false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    let status = ''
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
        search:that.data.search_text==undefined?'':that.data.search_text,
        type: that.data.choseId,
      }
      util.queryRequest('/app/broadcast/liveSearch', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
         that.data.list=that.data.list.concat(res.data.rows)
          that.setData({
            list:that.data.list,
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
    } else {
      console.log("加载完了")
    }

  },
  clearSearch: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      search_text: '',
      page:1,
      size:this.data.size,
      page_num: 0,
      is_end: false,
      hasData: true,
      list: [],
      topNum: 0,
    })
    this.getList()
  },
  searchInput: function(e) {
    this.setData({
      search_text:  e.detail.value,
    })
  },
  searchList: function() {
    const that=this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      search_text:this.data.search_text,
      page:1,
      size:that.data.size,
      page_num: 0,
      is_end: false,
      hasData: true,
      list: [],
      topNum: 0,
    })
    this.getList()
  },
  choseNav:util.throttle(function (e){
    this.setData({
      choseId: e[0].currentTarget.id,
      page:1,
      size:this.data.size,
      page_num: 0,
      is_end: false,
      hasData: true,
      list: [],
      topNum: 0,
    })
      this.getList()
   },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      search_text:options.value,
      scrollHeight: app.globalData.useWindowHeight-111+'px'
    })
    that.getList()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 2000)
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        isLogin: true,
        userInfo_image:wx.getStorageSync('userInfo').image
      })
    }
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