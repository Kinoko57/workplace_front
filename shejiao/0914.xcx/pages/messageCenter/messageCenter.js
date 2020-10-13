// pages/messageCenter/messageCenter.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    order_image:app.globalData.staticUrl + 'nav/msg_order.png',
    sys_image:app.globalData.staticUrl +'nav/msg_sys.png',
    showSkeleton: true,
    messageShow: false,
    showModel: false,
    messageDetail: {},
    page: 1,
    size: 16,
    total: 0,
    order_unread: 0,
    page_num: 0,
    hasData: true,
    is_end: false,
    is_load: false,
    is_iphonex: app.globalData.isiPhoneX,
    isTop: true, // 返回顶部
    messageList:[],
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
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
        content: '确定要清除未读消息吗？',
        success(res) {
          if (res.confirm) {
            // 将未读消息变成已读
            util.queryRequest('/app/message/read', { message_id: -1 }, "GET").then(function (res) {
              if (res.code == 200) {
                console.log('消息已读成功')
                that.setData({
                  messageList: [],
                  total: 0,
                  is_end: true,
                  hasData: false
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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  showDetail(e) {
    // 判断当前消息是否跳转  4是订单，3是系统
    console.log(e)
    let type = e.currentTarget.dataset.type
    let detail = {}
    // 将未读消息变成已读
    util.queryRequest('/app/message/read', { message_id: e.currentTarget.id}, "GET").then(function (res) {
      if (res.code == 200) {
        console.log('消息已读成功')
      }
    })
    for (let i = 0; i < this.data.messageList.length;i++){
      if (e.currentTarget.id==this.data.messageList[i].id){
        detail = this.data.messageList[i]
      }
    }
    if(type==4){
      console.log(detail)
      // 跳转
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?oid='+detail.order_id+'&supplier_id='+detail.supplier_id+'&status='+detail.status,
      })
    }else{
      this.setData({
        messageDetail:detail,
        messageShow: true,
        showModel: true
      })
    }

  },
  goLink(event){
    wx.navigateTo({
      url: event.currentTarget.dataset.link
    })
  },
  hidenModel() {
    let index = 0
    for (let i = 0; i < this.data.messageList.length; i++) {
      if (this.data.messageDetail.id == this.data.messageList[i].id) {
        index = i
      }
    }
    this.data.messageList.splice(index, 1)
    this.data.total--
    this.setData({
      messageList: this.data.messageList,
      messageShow: false,
      showModel: false,
      total: this.data.total
    })
    let that = this
    if(this.data.messageList.length<this.data.size){
      if (this.data.is_end == false) {
        let that = this
        let info = {
          status: 0,
          page: ++that.data.page,
          size: that.data.size,
        }
        util.queryRequest('/app/message/index', info, 'GET').then(function (res) {
          if (res.code == 200) {
            console.log(res)
            if (res.data.rows.length > 0) {
              that.data.messageList = that.data.messageList.concat(res.data.rows)
              that.setData({
                messageList: that.data.messageList,
                is_end: that.data.page_num == that.data.page,
              })
            } else {
              that.setData({
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
      }
    }
  },
  getList:function(){
    let that = this
    let info ={
      sender_type: '',
      status: 0,
      page: that.data.page,
      size: that.data.size,
    }
    util.queryRequest('/app/message/index', info, 'GET').then(function(res){
      wx.stopPullDownRefresh()
      if(res.code == 200){
        console.log(res)
        if (res.data.rows.length>0){
          that.setData({
            showSkeleton: false,
            messageList: res.data.rows,
            total: res.data.total,
            order_unread: res.data.unread,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          console.log(that.data.page_num)
          console.log(that.data.is_end)
        }else{
          that.setData({
            showSkeleton: false,
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
    this.getList()

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
    // 下拉刷新
    let that = this
    that.setData({
      showSkeleton: true,
      messageShow: false,
      showModel: false,
      messageDetail: {},
      page: 1,
      size: 16,
      total: 0,
      order_unread: 0,
      page_num: 0,
    })
    setTimeout(() => { //0.5S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    this.getList()
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
        status: 0,
        page: ++that.data.page,
        size: that.data.size,
      }
      util.queryRequest('/app/message/index', info, 'GET').then(function (res) {
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
  onShareAppMessage: function() {

  }
})