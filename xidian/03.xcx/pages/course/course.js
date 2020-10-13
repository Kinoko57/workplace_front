// pages/course/course.js
// pages/social/social.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    triggered: false,
    size:10,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    showSkeleton:true,
    topNum:0,
    courseList:[],
    selectType:[],
    index:0,
    selectId:'',
    navList:[
      { id: '1', name: '全部' },
      { id: '2', name: '军事夏令营' },
      { id: '3', name: '全程托管班' },
      { id: '4', name: '企业短训班' },
      ],
      scrollHeight:app.globalData.useWindowHeightFoot,
      endTime:'',
      choseId:-1,
      courserDate:''//营期
  },
  // 选择营期
  bindDateChange(e){
    console.log(e)
    this.setData({
      courserDate:e.detail.value,
      page:1,
      size:10,
      page_num: 0,
      courseList: [],
      is_end: false,
      topNum: 0,
      hasData: true,
    })
    this.getList()
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
  returnTop: function () {
    this.setData({
      isTop: true
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
  goLink(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  }, 
  bindPickerChange(e){
    console.log(e)
    this.setData({
      index:e.detail.value,
      page:1,
      size:10,
      page_num: 0,
      courseList: [],
      is_end: false,
      topNum: 0,
      hasData: true,
      selectId:e.detail.value==0?'':this.data.selectType[e.detail.value].id
    })
    this.getList()
  },
  getList(){
    const that = this
    util.queryRequest('app/curriculum/index', {
       page:that.data.page,
       size:that.data.size,
       category_id:that.data.choseId==-1?'':that.data.choseId,
       barracks_id:that.data.selectId,
       time:this.data.courserDate
    }, 'GET').then(function (res) {
      wx.stopPullDownRefresh()
      if (res.code === 200 || res.code === '200') {
        res.data.barracks.unshift({id:-1,name:'默认'})
        res.data.category.unshift({id:-1,name:'全部'})
        that.setData({
          navList:res.data.category,
          showSkeleton:false,
          selectType:res.data.barracks,
        })
        console.log(that.data.selectType)
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
          that.setData({
            ['courseList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else {
          that.setData({
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  clearDate:function(){
    this.setData({
      page:1,
      size:10,
      page_num: 0,
      courseList: [],
      is_end: false,
      topNum: 0,
      hasData: true,
      courserDate: ''
    })
    this.getList()
  },
  loadMore() {
    const that=this
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
        category_id:that.data.choseId=-1?'':that.data.choseId,
        barracks_id:that.data.selectId,
        time:this.data.courserDate
      }
      util.queryRequest('app/curriculum/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['courseList[' + currentpage + ']']: res.data.rows,
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
  choseNavId: util.throttle(function(e){
    if(e[0].currentTarget.id!=this.data.choseId){
      this.setData({
        choseId: e[0].currentTarget.id,
        page:1,
        size:10,
        page_num: 0,
        courseList: [],
        is_end: false,
        topNum: 0,
        hasData: true,
      })
      this.getList()
    }
  },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 97
        })
      },
    })
    wx.setNavigationBarTitle({
      title: '课程'
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    // var tim=parseInt(new Date().getTime()/1000)
    // var data = util.formatDate(tim,'month')
    // this.setData({
    //   endTime: data,
    //   courserDate:data
    // })
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
    // let that = this
    // that.setData({
    //   showSkeleton: true
    // })
    // setTimeout(() => { //3S后隐藏骨架屏
    //   that.setData({
    //     showSkeleton: false
    //   })
    // }, 500)
    // this.getList()
  },
  onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 2000)
  },

  onRestore(e) {
    console.log('onRestore:', e)
    console.log("执行刷新操作")
    let that = this
    that.setData({
       showSkeleton: true,
        page:1,
        size:10,
        page_num: 0,
        courseList: [],
        is_end: false,
        topNum: 0,
        hasData: true,
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    this.getList()
  },

  onAbort(e) {
    console.log('onAbort', e)
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