// pages/orderManage/orderManage.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    filePath: app.globalData.fileUrl,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    line_bg_color2:'linear-gradient(-90deg,rgba(255,108,63,1) 0%,rgba(255,147,66,1) 100%)',
    navList:[
    { id: 'type_-1', name: '全部' },
    { id: 'type_1', name: '待发货' },
    { id: 'type_2', name: '待收货' },
    { id: 'type_6', name: '已完成' }
    ],
    choseId: 'type_-1',
    orderList: [],
    scrollHeight:0,
    total:0,
    page:1,
    size:6,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    showSkeleton:true,
  },
  goDetail:util.throttle(function (e){
    wx.navigateTo({
      url: '../orderFansDetail/orderFansDetail?oid=' + e[0].currentTarget.dataset.oid + '&supplier_id=' + e[0].currentTarget.dataset.suppid + '&status=' + e[0].currentTarget.dataset.status,
    })
  }),
  goFind:util.throttle(function (e){
    wx.navigateTo({
      url: '../findLog/findLog?oid='+e[0].currentTarget.dataset.oid+'&supplier_id=' + e[0].currentTarget.dataset.supplier_id,
    })
  }),
  goLink:util.throttle(function (e){
    wx.navigateTo({
      url: e[0].currentTarget.dataset.link+'?oid='+e[0].currentTarget.dataset.oid
    })
  },500),
  choseNavId(e){
    this.setData({
      choseId: e.currentTarget.id,
      page:1,
      size:this.data.size,
      page_num: 0,
      is_end: false,
      hasData: true,
      orderList: [],
      topNum: 0,
    })
    this.getList()
  },
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
    let status=''
   if (that.data.choseId == 'type_-1') {
      status = ''
    }else if (that.data.choseId =='type_0'){
      status=0
    } else if (that.data.choseId == 'type_1') {
      status = 1
    } else if (that.data.choseId == 'type_2') {
      status = 2
    } else if (that.data.choseId == 'type_3') {
      status =3
    } else if (that.data.choseId == 'type_4') {
      status = 4
    } else if (that.data.choseId == 'type_5'){
      status =5
    } else if (that.data.choseId == 'type_6') {
      status = 6
    }
    util.queryRequest('/app/orders/index', {
       page:that.data.page,
       size:that.data.size,
       status: status,
       is_anchor: 1
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
          that.data.page_num=Math.ceil(res.data.total / that.data.size)
          that.setData({
            ['orderList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            showSkeleton:false,
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else {
          that.setData({
            hasData: false,
            showSkeleton:false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    let status = ''
    if (that.data.choseId == 'type_0') {
      status = 0
    } else if (that.data.choseId == 'type_1') {
      status = 1
    } else if (that.data.choseId == 'type_2') {
      status = 2
    } else if (that.data.choseId == 'type_3') {
      status = 3
    } else if (that.data.choseId == 'type_4') {
      status = 4
    } else if (that.data.choseId == 'type_5') {
      status = 5
    } else if (that.data.choseId == 'type_6') {
      status = 6
    }
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
        status: status,
      }
      util.queryRequest('/app/orders/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['orderList[' + currentpage + ']']: res.data.rows,
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
  // 立即支付
  buyBtn(e){
    const that=this
    wx.navigateTo({
      url: '../payOrder/payOrder?pay_id='+ e.currentTarget.dataset.id+'&pay_price='+ e.currentTarget.dataset.price+'&time='+e.currentTarget.dataset.time,
    })
  },
  // 确认收货
  sureBtn(e){
    console.log(e)
    const that=this
    wx.showModal({
      title: '提示',
      content: '要确认收货吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认中...',
            mask: true
          })
          util.queryRequest('/app/orders/confirmOrder', {
            oid: e.currentTarget.dataset.id,
          }, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
              wx.showToast({
                title: '确认收货成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                that.setData({
                  page:1,
                  size:10,
                  page_num: 0,
                  orderList: [],
                  is_end: false,
                  topNum: 0,
                  hasData: false,
                })
                that.getList()
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
              console.log(res.msg)
            }
          })
        } else if (res.cancel) {
         
          console.log('用户点击取消')
        }
      }
    })
  },
  // 取消订单
  cancelBtn(e) {
    const that=this
    wx.showModal({
      title: '提示',
      content: '确认要取消订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认中...',
            mask: true
          })
          util.queryRequest('/app/pay/cancel', {
            pay_id: e.currentTarget.dataset.id,
          }, 'POST').then(function (res) {
            wx.hideLoading()
            if (res.code === 200 || res.code === '200') {
              wx.showToast({
                title: '订单已取消',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                that.setData({
                  page:1,
                  size:10,
                  page_num: 0,
                  orderList: [],
                  is_end: false,
                  topNum: 0,
                  hasData: false,
                })
                that.getList()
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
              console.log(res.msg)
            }
          })
        } else if (res.cancel) {

          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      scrollHeight: app.globalData.useWindowHeight-55,
      choseId: options.status
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    wx.setNavigationBarTitle({
      title: '订单管理',
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
    wx.removeStorageSync('choseAdd')
    this.setData({
      page:1,
      page_num: 0,
      is_end: false,
      hasData: true,
      orderList: [],
      topNum: 0,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})