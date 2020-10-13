// pages/couponArea/couponArea.js
let app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    hasData:true,
    navList:[],
    choseId: 'type_-1',
    category_id: -1,
    isTop: true,
    topNum:0,
    filePath: app.globalData.fileUrl,
    staticUrl: app.globalData.staticUrl,
    scrollHeight:0,
    page:1,
    size:3,
    is_end:false,
    hasData:false,
    page_num:0,
    showList: [],
    imgUrls: [{image:'my/coupon_1.jpg'},{image:'my/coupon_1.jpg'}]
  },
  choseNavId(e){
    this.setData({
      page: 1,
      showList: [],
      choseId: e.currentTarget.id,
      category_id: e.currentTarget.dataset.key
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
  getDefault:function(){
    let that = this
    util.queryRequest('/app/coupon/getTopCategoryList', {}, 'GET').then(function(res) {
      if (res.code == 200) {
        console.log(res.data)
        let arr = []
        for(let i in res.data){
          arr.push({id: 'type_'+i, name: res.data[i].name, key: res.data[i].id})
        }
        arr.unshift({id: 'type_-1', name: '抢手券', key: -1})
        that.setData({
          navList:arr
        })
        that.getList()
      }
    })
  },
  getCou:util.throttle(function(e){
    let that = this
    console.log(e[0].currentTarget.id)
    let info ={
      coupon_id: e[0].currentTarget.id
    }
    let pindex = e[0].currentTarget.dataset.pindex
    let index = e[0].currentTarget.dataset.index
    that.data.showList[pindex][index].is_get = 1
    util.queryRequest('/app/coupon/couponReceive',info,'GET').then(function(res){
      if(res.code == 200){
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          ['showList['+pindex+']']: that.data.showList[pindex]
        })
      }
    })
  }),
  getList:function(){
    let that = this
    let info ={
      page:this.data.page,
      size:this.data.size,
      category_id:this.data.category_id
    }
    util.queryRequest('/app/coupon/index', info, 'GET').then(function(res) {
      if (res.code == 200) {
        console.log(res.data)
        if(res.data.rows.length>0){
          let currentpage = that.data.page - 1
          that.setData({
            ['showList['+currentpage+']']: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else{
          that.setData({
            showList: [],
            hasData: false
          })
        }
        
      }
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end==false){
      console.log('加载更多')
      console.log(this.data.serach_type)
      info = {
        page:++this.data.page,
        size:this.data.size,
        category_id:this.data.category_id
      }
      console.log(info)
      util.queryRequest('/app/coupon/index', info, 'GET').then(function (res) {
        console.log(res)
        if (res.code == 200) {
          if(res.data.rows.length>0){
            let currentpage = that.data.page - 1
            that.setData({
              ['showList[' + currentpage + ']']: res.data.rows,
              is_end: that.data.page_num == that.data.page
            })
          }
        }else{
          that.setData({
            is_end: true
          })
        }
      })
    }else{
      console.log("加载完了")
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.getDefault()
    that.setData({
      scrollHeight: app.globalData.useWindowHeight-289
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
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