// pages/flashSale/flashSale.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBg: 'transparent',
    navHeight:app.globalData.navHeight+78,
    group_scroll:[],
    staticUrl: app.globalData.staticUrl,
    line_bg_color:'linear-gradient(90deg,rgba(220,0,0,1),rgba(255,156,156,1))',
    bg_color:'rgba(220,0,0,1)',
    showSkeleton: true, //骨架屏显示隐藏
    choseId: 1,
    timeArrList:[],
    filePath: app.globalData.fileUrl,
    endTimeList: [], // 转换前的倒计时数组
    saleTimeList: [], // 转换后的倒计时数组
    time: null, // 倒计时的time
    timeList: [{
        id: 2,
        text: '历史抢购',
        status: 2
      },
      {
        id: 1,
        text: '抢购进行中',
        status: 1
      },
      {
        id: 3,
        text: '抢购预告',
        status: 3
      }
    ],
    scrollHeight: 0, // 促销滚动高度
    activityList: [],
    isTop:true,
    page: 1,
    size:10,
    hasData: true,
    is_end: false,
    is_load: false,
    topNum:0,
  },
  returnTop:function(){
    this.setData({
      topNum: 0,
    })
  },
  goLink:util.throttle(function (event){
    console.log(event)
    if(this.data.choseId!=2){
      wx.navigateTo({
        url: event[0].currentTarget.dataset.link+'&type=1'
      })
    }
  }),
  choseActivity(event) {
    const that = this;
    clearInterval(that.data.time)
    that.setData({
      hasData: true,
      endTimeList: [], // 转换前的倒计时数组
      saleTimeList: [], // 转换后的倒计时数组
      is_end: false,
      is_load: false,
      timeArrList:[],
      page: 1,
      size: 10,
      activityList: [],
      choseId: event.currentTarget.dataset.id,
    })
    this.getList()
  },
  getList:function(){
    const that=this
    util.queryRequest('/app/limitActivity/index', {
      type: that.data.choseId,
      page: that.data.page,
      size: that.data.size,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200'){
        that.setData({
          showSkeleton: false,
          scrollHeight: app.globalData.useWindowHeight - 123
        })
        if (res.data.rows.length>0){
          if(that.data.choseId!=2){
            // 整理倒计时
              var timearr = []
              for (var i = 0; i < res.data.rows.length; i++) {
                timearr.push(res.data.rows[i].countdown)
              }
              let sectimeList = util.countDownListOne(timearr)
              that.setData({
                saleTimeList: sectimeList,
              })
              clearInterval(that.data.time)
              that.data.time = setInterval(function () {
                for (var k = 0; k < timearr.length; k++) {
                  if (timearr[k] > 0) {
                  timearr[k] = --timearr[k]
                  } else {
                    timearr[k] = 0
                    clearInterval(that.data.time)
                  }
                }
                sectimeList = util.countDownListOne(timearr)
                that.setData({
                  saleTimeList: sectimeList,
                  timeArrList: timearr
                })
              }.bind(that), 1000)
              that.setData({
                time: that.data.time
              })
              // 倒计时部分
          }
          for(let i=0;i<res.data.rows.length;i++){
            let percentage=((res.data.rows[i].total_count-res.data.rows[i].count)/res.data.rows[i].total_count).toFixed(4)
            res.data.rows[i].percentage=percentage
          }
          that.setData({
            activityList: res.data.rows,
            hasData: true,
            group_scroll:res.data.buyListory,
            is_load:true
          })
          if (res.data.rows.length<that.data.size){
            that.setData({
              is_end:true,
              is_load: false
            })
          }
        }else{
          that.setData({
            hasData:false,
            is_load: false,
            group_scroll:res.data.buyListory,
            is_load:false
          })
        }
      }
    })
  },
  loadMore:function(){
    const that=this
    console.log
    if(that.data.is_load){
      let info = {
        type: that.data.choseId,
        page: ++that.data.page,
        size: that.data.size
      }
      util.queryRequest('/app/limitActivity/index', info, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          if (res.data.rows.length > 0) {
               // 整理倒计时
              //  let newTime = Math.round(new Date().getTime()/1000)
              //  var timearr = []
               for (var i = 0; i < res.data.rows.length; i++) {
                 timearr.push(res.data.rows[i].countdown)
               }
               that.data.timeArrList = that.data.timeArrList.concat(timearr)
               that.setData({
                 timeArrList: that.data.timeArrList,
               })
               let sectimeList = util.countDownListOne(that.data.timeArrList)
               that.setData({
                 saleTimeList: sectimeList,
               })
               console.log(that.data.saleTimeList)
               clearInterval(that.data.time)
               that.data.time = setInterval(function () {
                 for (var k = 0; k < that.data.timeArrList.length; k++) {
                   if (that.data.timeArrList[k] > 0) {
                     that.data.timeArrList[k] = --that.data.timeArrList[k]
                   } else {
                     that.data.timeArrList[k] = 0
                   }
                 }
                 sectimeList = util.countDownListOne(that.data.timeArrList)
                 that.setData({
                   saleTimeList: sectimeList,
                 })
               }.bind(that), 1000)
               that.setData({
                 time: that.data.time
               })
               // 倒计时部分

             
            for(let i=0;i<res.data.rows.length;i++){
              let buy_num=res.data.rows[i].total_count-res.data.rows[i].count
              res.data.rows[i].percentage=(buy_num/res.data.rows[i].total_count).toFixed(2)
            }
            that.data.activityList = that.data.activityList.concat(res.data.rows)
            that.setData({
              activityList: that.data.activityList,
              is_end: false,
              is_load: true,
            })
            if (res.data.rows.length < that.data.size) {
              that.setData({
                is_end: true,
                is_load: false,
              })
            }
          } else {
            that.setData({
              is_end: true,
              is_load: false,
            })
          }
        }
      })
    }
  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      if (this.data.isTop){
        this.setData({
          isTop: false
        })
      }
    } else {
      if (!this.data.isTop) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that=this
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
    const that=this
    // // 倒计时部分
    // let newTime = Math.round(new Date().getTime()/1000)
    // var timearr = []
    // for (var i = 0; i < that.data.activityList.length; i++) {
    //   timearr.push(that.data.activityList[i].end_time-newTime)
    // }
    // let sectimeList = util.countDownListOne(timearr)
    // that.setData({
    //   saleTimeList: sectimeList,
    // })
    // console.log(that.data.saleTimeList)
    // clearInterval(that.data.time)
    // that.data.time = setInterval(function () {
    //   for (var k = 0; k < timearr.length; k++) {
    //     if (timearr[k] > 0) {
    //       timearr[k] = --timearr[k]
    //     } else {
    //       timearr[k] = 0
    //     }
    //   }
    //   sectimeList = util.countDownListOne(timearr)
    //   that.setData({
    //     saleTimeList: sectimeList,
    //   })
    // }.bind(that), 1000)
    // that.setData({
    //   time: that.data.time
    // })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.time)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.time)
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