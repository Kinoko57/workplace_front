// pages/myBill/myBill.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight:app.globalData.navHeight+102,
    topnavHeight:app.globalData.navHeight,
    toBg:'transparent',
    showSkeleton:true,
    isiPhoneX: app.globalData.isiPhoneX,
    choseDate:'',//时间传值
    showchoseDate:'',//页面展示
    year:'',//传参年
    month:'',//传参月
    billList: [],
    billObj:{},
    scrollHeight:0,
    label_height:'',
    choseId:1,
    navList:[{id:1,name:'收入'},{id:2,name:'支出'}],
    is_end: false,
    label_List:{},
    label_key:'',
    page:1,
    size:10,
    topNum: 0,
    hasData: true,
    isTop: true,
    page_num: 0,
    showIcon:true,
    staticUrl: app.globalData.staticUrl,
  },
  // 选择标签
  goLabel(e){
   console.log(e)
   this.setData({
    choseId: this.data.choseId,
    page:1,
    label_key:'',
    label_List:{},
    topNum: 0,
    is_end: false,
    hasData: true,
    isTop: true,
    page_num: 0,
    billList: [],
    label_key:e.currentTarget.dataset.item
   })
   this.getList()
  },
  choseNavId(e){
    console
    this.setData({
      choseId: e.currentTarget.id,
      page:1,
      label_key:'',
      label_List:{},
      topNum: 0,
      is_end: false,
      hasData: true,
      isTop: true,
      page_num: 0,
      billList: [],
    })
    this.getList()
  },
  getList(){
    const that = this
    console.log()
    util.queryRequest('/app/bill/seeBill', {
       page:that.data.page,
       size:that.data.size,
       type: that.data.choseId,
       profit_type:that.data.label_key,
       year: that.data.year,//传参年
       month: that.data.month,//传参月
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
          that.setData({
            ['billList[' + currentpage + ']']: res.data.rows,
            showSkeleton:false,
            label_List:res.data.profit_type!=undefined?res.data.profit_type:'',
            total: res.data.total,
            billObj:res.data.billData,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else {
          that.setData({
            billObj:res.data.billData,
            label_List:res.data.profit_type!=undefined?res.data.profit_type:'',
            showSkeleton:false,
            hasData: false,
            is_end: true
          })
        }
        that.setData({
          scrollHeight:app.globalData.useWindowHeight-163
        })
      }
    })
  },
  loadMore() {
    let that = this
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size:that.data.size,
        profit_type:that.data.label_key,
        type: that.data.choseId,
        year: that.data.year,//传参年
        month: that.data.month,//传参月
      }
      util.queryRequest('/app/bill/seeBill', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['billList[' + currentpage + ']']: res.data.rows,
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
  showDate(){
    this.setData({
      showIcon:false
    })
  },
  // 选择时间
  bindDateChange(e){
    var year = e.detail.value.split('-')[0]
    var month = e.detail.value.split('-')[1]
    var showDate = year + '-' + month
    var showshowDate = year + '年' + month + '月'
    this.setData({
      choseDate:showDate,
      showchoseDate:showshowDate,
      year:year,//传参年
      month:month,//传参月
      page:1,
      page_num: 0,
      billList: [],
      is_end: false,
      showIcon:true,
      topNum: 0,
      hasData: true,
    })
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    var nowDate = util.formatDate(new Date().getTime() / 1000)
    console.log(nowDate)
    console.log(nowDate.split('-'))
    var year = nowDate.split('-')[0]
    var month = nowDate.split('-')[1]
    // var showDate = year + '-' + month
    var showDate = year + '-' + month
    var showshowDate = year + '年' + month + '月'
    console.log(typeof showDate)
    this.setData({
      endTime:nowDate,
      choseDate:showDate,
      showchoseDate:showshowDate,
      year:year,//传参年
      month:month,//传参月
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    this.getList()
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