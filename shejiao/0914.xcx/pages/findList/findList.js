// pages/findList/findList.js
let util = require('../../utils/util.js')
let asideHeight=[{leftHeight:0,rightHeight:1},{leftHeight:0,rightHeight:1},{leftHeight:0,rightHeight:1},{leftHeight:0,rightHeight:1}]
let query;
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id:1,
        page:1,
        topNum:0,
        is_first:false,
        col1: [],
        col2: [],
        page_num:0,
        hasData: true,
        isTop: true,
        is_end: false,
        list: [],
      },
      {
        id:2,
        topNum:0,
        is_first:false,
        col1: [],
        col2: [],
        page_num:0,
        hasData: true,
        is_end: false,
        isTop: true,
        page:1,
        list: [],
      },
      {
        id:3,
        topNum:0,
        is_first:false,
        col1: [],
        col2: [],
        page_num:0,
        hasData: true,
        is_end: false,
        isTop: true,
        page:1,
        list: [],
      },
      {
        id:4,
        is_first:false,
        col1: [],
        col2: [],
        page_num:0,
        hasData: true,
        is_end: false,
        page:1,
        list: [],
      },
    ],
    isTop: true,
    topNum:0,
    triggered: false,
    activeTab:0,
    choseId:'1',
    navList:[{id:1,name:'关注'},{id:2,name:'发现'},{id:3,name:'直播'},{id:4,name:'预告'}],
    showSkeleton:true,
    isLogin: false,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    topHeight:app.globalData.navHeight-app.globalData.navTop,
    navTop: app.globalData.navTop,
    navHeight: app.globalData.navHeight, // 导航栏高度
    scrollHeight:'0px',
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    total:0,
    size:10,
    userInfo_image:app.globalData.staticUrl+'flash/flash_01.png'
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
  // 观看详情
  goDetail:util.throttle(function (e){
    const that=this
    if(util.isLogin()){
      if(that.data.activeTab==3){
        wx.navigateTo({
          url: '../previewDetail/previewDetail?id='+e[0].currentTarget.dataset.id
        })
      }else if(that.data.activeTab==2){
        wx.navigateTo({
          url: '../liveRead/liveRead?accelerateURL='+e.currentTarget.dataset.url+'&roomID='+e.currentTarget.dataset.room_id+'&id='+e.currentTarget.dataset.id+'&anchor_id='+e.currentTarget.dataset.member_id+'&sence_name='+e.currentTarget.dataset.name+"&scene_img="+e.currentTarget.dataset.img+'&pro_key='+e.currentTarget.dataset.pro,
        })
      }else{
        wx.navigateTo({
          url: '../detailPreview/detailPreview?id='+e[0].currentTarget.dataset.id
        })
      }
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },500),
  // 跳转到个人主页
  goCenter(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link+'?member_id='+wx.getStorageSync('userInfo').id,
    })
  },
  // 点赞
  collView: util.throttle(function (e) {
    if(util.isLogin()){
      let that = this
      let url=''
      let obj={}
      if(that.data.activeTab==3){
        obj={
          id: e[0].currentTarget.dataset.id,
        }
        url='/app/broadcast/noticeLikeAdd'
      }else{
        url='/app/dynamic/beFondOf'
        obj={
          dynamic_id: e[0].currentTarget.dataset.id,
        }
      }
      if(e[0].currentTarget.dataset.like==0){
        // 点赞 取消商品
        util.queryRequest(url,obj , 'GET').then(function (res) {
          if (res.code == 200) {
            if(e[0].currentTarget.dataset.position=='left'){
              that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num =  that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num+1
              that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].is_like = 1
            }else{
              that.data.tabs[that.data.activeTab].col2[e[0].currentTarget.dataset.index].like_num =  that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num+1
              that.data.tabs[that.data.activeTab].col2[e[0].currentTarget.dataset.index].is_like =1
            }
            setTimeout(() => {
              that.setData({
                tabs:  that.data.tabs
              })
            }, 100)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }else{
          // 点赞 取消商品
          util.queryRequest(url,obj , 'GET').then(function (res) {
            if (res.code == 200) {
              if(e[0].currentTarget.dataset.position=='left'){
                that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num =  that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num-1
                that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].is_like = 0
              }else{
                that.data.tabs[that.data.activeTab].col2[e[0].currentTarget.dataset.index].like_num =  that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num-1
                that.data.tabs[that.data.activeTab].col2[e[0].currentTarget.dataset.index].is_like =0
              }
              setTimeout(() => {
                that.setData({
                  tabs:  that.data.tabs
                })
              }, 50)
              console.log(that.data.tabs[that.data.activeTab].col1[e[0].currentTarget.dataset.index].like_num,"数量")
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },100),
  goLink(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  // 获取个人主页数据
  getList: function () {
    const that=this
    let url=''
    let obj={}
    console.log(that.data.activeTab,"切换的值")
    if(that.data.activeTab==0){
        url='/app/broadcast/followDynamicList'
    }else if(that.data.activeTab==1){
      url='/app/dynamic/getList'
    }else if(that.data.activeTab==2){
      url='/app/live/liveList'
    }else if(that.data.activeTab==3){
      url='/app/broadcast/noticeList'
    }
    obj={
      page:that.data.tabs[that.data.activeTab].page,
      size:that.data.size,
    }
    util.queryRequest(url, obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if(res.data.rows.length>0){
          console.log(res.data.rows,"数组")
          that.isLeft(res.data.rows)
          that.data.tabs[that.data.activeTab].is_first=true
          that.data.tabs[that.data.activeTab].page_num=Math.ceil( res.data.total / that.data.size)
          that.data.tabs[that.data.activeTab].is_end= Math.ceil(res.data.total / that.data.size) == that.data.tabs[that.data.activeTab].page
          that.data.tabs[that.data.activeTab].hasData=true
          that.setData({
            userInfo:res.data.member,
            showSkeleton:false,
            tabs:that.data.tabs
          })
        }else{
        that.data.tabs[that.data.activeTab].is_end=true
        that.data.tabs[that.data.activeTab].hasData=false
        that.setData({
          userInfo:res.data.member,
          showSkeleton:false,
          tabs:  that.data.tabs,
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
    if (that.data.tabs[that.data.activeTab].is_end == false) {
      console.log('加载更多')
      let url=''
      let obj={}
      if(that.data.activeTab==0){
        url='/app/broadcast/followDynamicList'
      }else if(that.data.activeTab==1){
        url='/app/dynamic/getList'
      }else if(that.data.activeTab==2){
        url='/app/live/liveList'
      }else if(that.data.activeTab==3){
        url='/app/broadcast/noticeList'
      }
      obj={
        page:++that.data.tabs[that.data.activeTab].page,
        size:that.data.size,
      }
      util.queryRequest(url, obj, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          that.isLeft(res.data.rows)
          that.data.tabs[that.data.activeTab].is_end=that.data.tabs[that.data.activeTab].page_num==that.data.tabs[that.data.activeTab].page
          that.setData({
            tabs: that.data.tabs,
          })
        }
      })
    } else {
      console.log("加载完了")
    }
  },
  async isLeft(list) {
    const that=this
    let {col1,col2}=this.data.tabs[that.data.activeTab]
    query = wx.createSelectorQuery();
    for (const item of list) {
      asideHeight[that.data.activeTab].leftHeight <=  asideHeight[that.data.activeTab].rightHeight ?col1.push(item) : col2.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(that.data.tabs);
    }
  },
  getBoxHeight(tabs) { //获取左右两边高度
    const that=this
      return new Promise((resolve, reject) => {
        // let leftArr1 = 'tabs['+that.data.activeTab+'].col1'
        // let rightArr1 = 'tabs['+that.data.activeTab+'].col2'
        this.setData({
          // [leftArr1]:col1,
          // [rightArr1]:col2
          tabs
        },
         () => {
           let left='.anchorPer_block_left_'+that.data.activeTab
           let right='.anchorPer_block_right_'+that.data.activeTab
          query.select(left).boundingClientRect();
          query.select(right).boundingClientRect();
          query.exec((res) => {
            asideHeight[that.data.activeTab].leftHeight = res[0].height; //获取左边列表的高度
            asideHeight[that.data.activeTab].rightHeight = res[1].height; //获取右边列表的高度
            resolve();
          });
        });
      })
  },
  choseNav:util.throttle(function (e){
    this.setData({
      activeTab:e[0].currentTarget.dataset.index,
      isTop: true,
      topNum:0,
    })
    if(!this.data.tabs[e[0].currentTarget.dataset.index].is_first){
      this.getList()
    }
   },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      scrollHeight: app.globalData.useWindowHeight-64+'px'
    })
    that.getList()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 2000)
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        isLogin: true,
        userInfo_image:wx.getStorageSync('userInfo').wx_image
      })
    }
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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
  onPulling(e) {
    console.log('onPulling:', e)
  },
  // 自定义下拉刷新自定义下拉刷新被触发
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 1000)
  },
  // 自定义下拉刷新被复位
  onRestore(e) {
    const that=this
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      asideHeight[that.data.activeTab].leftHeight=0
      asideHeight[that.data.activeTab].rightHeight=1
      that.data.tabs[that.data.activeTab].page=1
      that.data.tabs[that.data.activeTab].page_num=0
      that.data.tabs[that.data.activeTab].hasData=true
      that.data.tabs[that.data.activeTab].is_end=false
      that.data.tabs[that.data.activeTab].is_load=false
      that.data.tabs[that.data.activeTab].col1=[]
      that.data.tabs[that.data.activeTab].col2=[]
      this.setData({
        activeTab: that.data.activeTab,
        showSkeleton:true,
        tabs:this.data.tabs
      })
      this.getList()
    }
  },
// 自定义下拉刷新被终止
  onAbort(e) {
    console.log('onAbort', e)
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