// pages/flashSale/flashSale.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    line_bg_color:'linear-gradient(90deg,rgba(220,0,0,1),rgba(255,156,156,1))',
    showSkeleton: true, //骨架屏显示隐藏
    choseId:'0',
    status:1,
    total:0,
    page:1,
    size:10,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    timeList: [],
    endTimeList: [], // 转换前的倒计时数组
    saleTimeList: [], // 转换后的倒计时数组
    time: null, // 倒计时的time
    scrollHeight: 0, // 促销滚动高度
    activityList: []
  },
  goLink(event){
    const that=this
    // if(this.data.choseId!=2){
      wx.navigateTo({
        url: event.currentTarget.dataset.link+'&time_id='+that.data.choseId+'&type=4'
      })
    // }else{
    //   wx.showToast({
    //     title: '请再次再来吧~',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // }
  },
  getTimeList(){
    const that=this
    util.queryRequest('/app/seckill/getTimeList', {
   }, 'GET').then(function (res) {
     if (res.code === 200 || res.code === '200') {
       that.setData({
        timeList:res.data,
        choseId:res.data[0].id
       })
       if(res.data.length>0){
        res.data.map((item)=>{
          if(item.status==1){
            that.setData({
              choseId:item.id
            })
          }
        })
       }

       that.getList()
     }
   })
  },
  choseActivity(event) {
    const that = this;
    that.setData({
      choseId: event.currentTarget.dataset.id,
      page:1,
      page_num:0,
      hasData: true,
      is_end: false,
      isTop: true,
      topNum:0,
      activityList: [],
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
    util.queryRequest('/app/seckill/index', {
       page:that.data.page,
       size:that.data.size,
       seckill_time_id: that.data.choseId,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
            that.setData({
              showSkeleton:false,
              ['activityList[' + currentpage + ']']: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true
            })
        }else {
          that.setData({
            showSkeleton:false,
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size:that.data.size,
        act_id: that.data.choseId,
      }
      util.queryRequest('/app/seckill/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['activityList[' + currentpage + ']']: res.data.rows,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    // 
    // // 整理倒计时
    // let prolist = that.data.activityList
    // var timearr = []
    // for (var i = 0; i < prolist.length; i++) {
    //   timearr.push(prolist[i].countdown)
    // }
    // that.setData({
    //   endTimeList: timearr
    // })
    // var sectimeList = util.countDownListOne(timearr)
    // that.setData({
    //   saleTimeList: sectimeList
    // })
    // that.data.time = setInterval(function() {
    //   for (var k = 0; k < timearr.length; k++) {
    //     if (timearr[k] > 0) {
    //       timearr[k] = --timearr[k]
    //     } else {
    //       timearr[k] = 0
    //     }
    //   }
    //   that.setData({
    //     endTimeList: timearr,
    //   })
    //   sectimeList = util.countDownListOne(timearr)
    //   that.setData({
    //     saleTimeList: sectimeList
    //   })
    // }.bind(that), 1000)

    // that.setData({
    //   time: that.data.time
    // })
    // for(let i =0 ;i<that.data.activityList.length;i++){

    // }
    that.setData({
      scrollHeight: app.globalData.useWindowHeight - 72
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false,
      })
    }, 500)
    this.getTimeList()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("触底了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})