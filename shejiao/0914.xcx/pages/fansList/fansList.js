// pages/fansList/fansList.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    page:1,
    size:10,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    showSkeleton:true,
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    fansName:'',
    follow_num:'',
    fans_num:'',
    member_id:'',
    size:10,
    list:[],
    activeTab:0,
    type:'1',
    scrollHeight:'0'
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
    const that=this
    let url=''
    if(that.data.activeTab==0){
      url='/app/broadcast/followList'
    }else if(that.data.activeTab==1){
      url='/app/broadcast/fansList'
    }
    if(that.data.activeTab==0){
      that.setData({
        scrollHeight: app.globalData.useWindowHeight-87
      })
    }else{
      that.setData({
        scrollHeight: app.globalData.useWindowHeight-45
      })
    }
    let obj={
      page:that.data.page,
      size:that.data.size,
      member_id:that.data.member_id
    }
    util.queryRequest(url, obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
       if(res.data.rows.length>0){
         let currentpage=that.data.page-1
         that.setData({
          ['list[' + currentpage + ']']: res.data.rows,
          total: res.data.total,
          page_num: Math.ceil(res.data.total / that.data.size),
          is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
          hasData: true,
          showSkeleton:false
        })
       }else{
        that.setData({
            hasData: false,
            showSkeleton:false,
            is_end: true
        })
       }
      //  1代表关注 2代表粉丝
       if(that.data.activeTab==0){
        that.setData({
          follow_num:res.data.total,
          fans_num:res.data.num,
        })
      }else if(that.data.activeTab==1){
        that.setData({
          follow_num:res.data.num,
          fans_num:res.data.total,
        })
      }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })
  },
  loadMore() {
    let that = this
    let url=''
    if(that.data.activeTab==0){
      url='/app/broadcast/followList'
    }else if(that.data.activeTab==1){
      url='/app/broadcast/fansList'
    }
    if (that.data.is_end == false) {
      console.log('加载更多')
      let obj={
        page:++that.data.page,
        size:that.data.size,
        member_id:that.data.member_id
      }
      util.queryRequest(url, obj, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
            let currentpage = that.data.page - 1
            that.setData({
              ['list[' + currentpage + ']']: res.data.rows,
              is_end: that.data.page_num == that.data.page
            })
        }
      })
    } else {
      console.log("加载完了")
    }
  },
  choseNav:util.throttle(function (e){
    console.log(e)
    this.setData({
      activeTab:e[0].currentTarget.dataset.index,
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
    //  关注
  followView: util.throttle(function (e) {
    if(util.isLogin()){
      console.log(e)
      let that = this
        // 关注
        let msg=''
        if(e[0].currentTarget.dataset.type=='follow'){
          msg='关注'
        }else{
          msg='取消关注'
        }
        util.queryRequest('/app/dynamic/collect', {
          anchor_id: e[0].currentTarget.dataset.anchor_id,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            let index=e[0].currentTarget.dataset.index
            if(e[0].currentTarget.dataset.type=='follow'){
              if(e[0].currentTarget.dataset.type=='follow'){
                that.data.list[that.data.page-1][index].is_follow = 2
              }else{
                that.data.list[that.data.page-1][index].is_follow = 0
              }
            }else{
              if(e[0].currentTarget.dataset.type=='follow'){
                that.data.list[that.data.page-1][index].is_follow = 1
              }else{
                that.data.list[that.data.page-1][index].is_follow = 0
              }
            }
            wx.showToast({
              title: msg+'成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              that.setData({
                list: that.data.list
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
        this.setData({
          viewDetail: this.data.viewDetail
        })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(options)
    this.setData({
      activeTab:options.activeTab,
      member_id:options.member_id,
      fansName:options.name
    })
    this.getList()
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