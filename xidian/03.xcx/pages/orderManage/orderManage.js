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
    navList:[
      { id: 'type_-1', name: '全部' },
      { id: 'type_1', name: '待付款' },
      { id: 'type_2', name: '已付款' },
      { id: 'type_3', name: '待开课' },
      { id: 'type_4', name: '已完成' },
      { id: 'type_5', name: '已取消' },
      ],
    payindex:0,
    payType:1,
    modeList: [{ name: '微信支付', id: 1 }, { name: '支付宝支付', id: 6 }],
    choseId: 'type_-1',
    orderList: [],
    total:0,
    scrollHeight:0,
    page:1,
    size:10,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    showSkeleton:true,
  },
  goSales(e){
    console.log(e)
    wx.navigateTo({
      url: '../saleAfter/saleAfter?order_id='+e.currentTarget.dataset.order_id+'&from=orderDetail',
    })
  },
  goDetail:util.throttle(function (e){
      wx.navigateTo({
        url: '../orderDetail/orderDetail?order_id=' + e[0].currentTarget.dataset.info.order_id,
      })
  }),
  choseNavId: util.throttle(function(e) {
    if(this.data.choseId!=e[0].currentTarget.id){
      this.setData({
        choseId: e[0].currentTarget.id,
        page:1,
        size:10,
        payindex:0,
        page_num: 0,
        orderList: [],
        is_end: false,
        topNum: 0,
        hasData: true,
      })
      this.getList()
    }
  },500),
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
    if (that.data.choseId == 'type_1') {
      status = 1
    } else if (that.data.choseId == 'type_2') {
      status = 2
    } else if (that.data.choseId == 'type_3') {
      status =3
    } else if (that.data.choseId == 'type_4') {
      status = 4
    } else if(that.data.choseId == 'type_5'){
      status = 5
    }
    util.queryRequest('app/orderList/index', {
       page:that.data.page,
       size:that.data.size,
       status: status,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
            let currentpage = that.data.page - 1
            that.setData({
              showSkeleton: false,
              ['orderList[' + currentpage + ']']: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true
            })
        }else {
          that.setData({
            showSkeleton: false,
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    let status = ''
    if (that.data.choseId == 'type_1') {
      status = 1
    } else if (that.data.choseId == 'type_2') {
      status = 2
    } else if (that.data.choseId == 'type_3') {
      status =3
    } else if (that.data.choseId == 'type_4') {
      status = 4
    } else if(that.data.choseId == 'type_5'){
      status = 5
    }
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
        status: status,
      }
      util.queryRequest('app/orderList/index', info, 'GET').then(function (res) {
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
  // 支付尾款
  bindPickerpaySurplus(e){
    wx.setStorageSync('source', 'create')
    wx.navigateTo({
      url: '../payOrder/payOrder?order_id='+ e.currentTarget.dataset.order_id+'&type=2',
    })
  },
  // 立即支付
  bindPickerpay(e){
    wx.setStorageSync('source', 'create')
    wx.navigateTo({
      url: '../payOrder/payOrder?order_id='+ e.currentTarget.dataset.order_id+'&type=1',
    })
  },
  // 取消订单
  cancelBtn(e) {
     // 取消订单
     console.log(e)
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
          util.queryRequest('app/orderList/cancelOrder', {
            order_id:e.currentTarget.dataset.order_id,
          }, 'GET').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
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
                  hasData: true,
                })
                that.getList()
              }, 1000)
            }else if(res.code == 49000){
              let msg = '已有支付请求中，请在'+ res.msg + '秒后尝试取消'
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
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
    wx.setNavigationBarTitle({
      title: '订单管理'
    })
    that.setData({
      choseId: options.status,
      scrollHeight: app.globalData.useWindowHeight-55
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
    wx.removeStorageSync('sure_add')
    wx.removeStorageSync('showAlipay')
    this.setData({
      page:1,
      size:10,
      page_num: 0,
      orderList: [],
      is_end: false,
      topNum: 0,
      hasData: true,
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
  // onShareAppMessage: function () {

  // }
})