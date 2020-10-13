// pages/messageCenter/messageCenter.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true,
    messageShow: false,
    showModel: false,
    message_unread:'0',
    messageDetail: {},
    page: 1,
    size: 16,
    total: 0,
    page_num: 0,
    hasData: true,
    is_end: false,
    is_load: false,
    messageList:[],
    is_iphonex: app.globalData.isiPhoneX,
    isTop: true, // 返回顶部
    isShow_page:true,
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 清除所有未读消息
  readAll:function(){
    if (this.data.messageList.length<=0){
      wx.showToast({
        title: '当前没有未读消息~',
        icon: 'none',
        duration: 1000
      })
    }
    else{
      let that = this
      wx.showModal({
        title: '提示',
        content: '确定要一键已读所有未读消息吗？',
        success(res) {
          if (res.confirm) {
            // 将未读消息变成已读
            util.queryRequest('app/msg/readAll', {}, "GET").then(function (res) {
              if (res.code == 200) {
                console.log('消息已读成功')
                that.setData({
                  messageList: [],
                  total: 0,
                  message_unread:0,
                  page:1,
                  is_end: true,
                  hasData: false
                })
                that.getList()
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
                console.log(res.msg)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  // 阅读未读消息
  showDetail(e) {
    console.log(e)
    let detail = {}
    // 将未读消息变成已读
    util.queryRequest('app/msg/read', { message_id: e.currentTarget.id}, "GET").then(function (res) {
      if (res.code == 200) {
        console.log('消息已读成功')
      }
    })
    let index = 0
    for (let i = 0; i < this.data.messageList.length;i++){
      if (e.currentTarget.id==this.data.messageList[i].id){
        detail = this.data.messageList[i]
      }
    }
    this.setData({
      messageDetail:detail,
      messageShow: true,
      showModel: true
    })
  },
  goLink(event){
    wx.navigateTo({
      url: event.currentTarget.dataset.link
    })
  },
  hidenModel() {
    // let index = 0
    for (let i = 0; i < this.data.messageList.length; i++) {
      if (this.data.messageDetail.id == this.data.messageList[i].id) {
        this.data.messageList[i].status_read=1
      }
    }
    this.data.message_unread--
    if(this.data.message_unread<=0){
      this.data.message_unread=0
    }
    this.setData({
      messageList: this.data.messageList,
      messageShow: false,
      showModel: false,
      message_unread: this.data.message_unread
    })
  },
  getList:function(){
    let that = this
    let info ={
      // message_type:1,
      // is_unread:1,
      size: that.data.size,
      page: that.data.page,
    }
    util.queryRequest('app/msg/mcenter', info, 'GET').then(function(res){
      wx.stopPullDownRefresh()
      if(res.code == 200){
        console.log(res)
        if (res.data.rows.length>0){
          that.setData({
            showSkeleton: false,
            message_unread:res.data.message_unread,
            messageList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined&&res.data.message_unread>0) {
            let message_unread=res.data.message_unread>=99?'99':res.data.message_unread
            wx.setTabBarBadge({
              index: 3,  //tabBar序号，从0开始计数
              text:message_unread.toString()
            })
          }else{
            wx.removeTabBarBadge({
              index: 3,  //tabBar序号，从0开始计数
            })
          }
        }else{
          that.setData({
            showSkeleton: false,
            message_unread:res.data.message_unread,
            messageList:[],
            total:0,
            is_end: true,
            hasData: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.setNavigationBarTitle({
      title: '消息中心'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.getList()
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync("token") == '' || wx.getStorageSync("token") == undefined) {
      this.setData({
        isShow_page:false,
        showSkeleton:false
      })
    }
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
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        page: 1,
        total: 0,
        showSkeleton:true,
        page_num: 0,
        hasData: true,
        is_end: false,
        is_load: false,
        message_unread:0,
        messageList:[],
      })
      this.getList()
    }
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 140) {
      if (this.data.isTop == true) {
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 140) {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('到底了')
    if(this.data.is_end == false){
      let that = this
      let info = {
        page: ++that.data.page,
        size:that.data.size,
        // message_type:1,
        // is_unread:1,
      }
      util.queryRequest('app/msg/mcenter', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res)
          if (res.data.rows.length > 0) {
            that.data.messageList = that.data.messageList.concat(res.data.rows)
            that.setData({
              messageList: that.data.messageList,
              is_end: that.data.page_num == that.data.page,
            })
            console.log(that.data.page_num)
            console.log(that.data.is_end)
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})