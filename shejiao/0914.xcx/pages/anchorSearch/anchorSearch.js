// pages/search/search.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    navList:[{id:1,name:'热门搜索'},{id:2,name:'发现'},{id:3,name:'直播'}],
    tabs: [
      {
        id:1,
        page:1,
        topNum:0,
        is_first:false,
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
        page_num:0,
        hasData: true,
        is_end: false,
        isTop: true,
        page:1,
        list: [],
      },
    ],
    activeTab:1,
    size:8,
    line_bg_color:'linear-gradient(-90deg,#dd2c2f 0%,#ff5053 100%)',
    line_bg_color1:'linear-gradient(-90deg,#ff6c3f 0%,#ff9342 100%)',
    line_bg_color2:'linear-gradient(-90deg,#3f7aff 0%,#69aefc 100%)',
    scrollHeight:0,
    imgPath: app.globalData.fileUrl,
    hot_page: 1,
    hot_total: 0,
    hotNum: 0,
    hotSearch: [],
    allList_num: 0,
    searchkey: '',
    showSkeleton:true,
    keylist: [],// 显示的历史
    allKeyList:[]//所有的搜索历史
  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  // 输入内容
  searchInput: function(e) {
    this.setData({
      searchkey: e.detail.value
    })
  },
  // 清除输入内容
  clearSearch: function() {
    console.log('2')
    this.setData({
      searchkey: '',
    })
  },
  // 删除历史记录（单个）
  deletSearch(e){
    const that=this
    for(let i=0;i<that.data.allKeyList.length;i++){
      if(e.currentTarget.dataset.index==i){
        that.data.allKeyList.splice(i,1)
      }
    }
    wx.setStorageSync('searchData', that.data.allKeyList)
    let initList=[]
    if(that.data.keylist.length<that.data.allKeyList.length){
      initList=[that.data.allKeyList[0],that.data.allKeyList[1],that.data.allKeyList[2]] 
    }else{
      initList=that.data.allKeyList
    }
  
    this.setData({
      allKeyList:that.data.allKeyList,
      keylist:initList
    })
    let query1 = wx.createSelectorQuery()
    query1.select('.search_Height').boundingClientRect()
    query1.exec(function (req) {
      console.log(app.globalData.useWindowHeight,req[0])
      that.setData({
        scrollHeight:app.globalData.useWindowHeight-req[0].height-97+'px'
      })
    })
  },
  // 获取 搜索页面信息
  getList: function () {
    const that=this
    let url=''
    if(that.data.activeTab==0){
      url='/app/broadcast/liveHotList'
    }else if(that.data.activeTab==1){
        url='/app/broadcast/liveFindList'
    }else if(that.data.activeTab==2){
      url='/app/broadcast/liveBroadCast'
    }
    let obj={
      page:that.data.tabs[that.data.activeTab].page,
    }
    util.queryRequest(url, obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        console.log(res,"resres")
        if(res.data.rows.length>0){
          // console.log(res.data.rows,"数组",that.data.activeTab)
          that.data.tabs[that.data.activeTab].list=res.data.rows
          // that.data.tabs[that.data.activeTab].page_num=Math.ceil( res.data.total / that.data.size)
          // that.data.tabs[that.data.activeTab].is_end= Math.ceil(res.data.total / that.data.size) == that.data.tabs[that.data.activeTab].page
          // that.data.tabs[that.data.activeTab].hasData=true
          that.setData({
            tabs:that.data.tabs,
            showSkeleton: false,
          })
          console.log(that.data.tabs,"asflsajdgf")
        }else{
          that.data.tabs[that.data.activeTab].is_end=true
          that.data.tabs[that.data.activeTab].hasData=false
          that.setData({
            userInfo:res.data.member,
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
  searchList: function() {
    var self = this;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(this.data.searchkey)){
      this.data.searchkey = ''
    }
    if (this.data.searchkey != '') {
      //将搜索记录更新到缓存
      var searchData = self.data.allKeyList;
      var arr = [{
        id: searchData.length,
        name: self.data.searchkey
      }]
      searchData = arr.concat(searchData)
      wx.setStorageSync('searchData', searchData);
    }
    wx.navigateTo({
      url: '../anchorSearchResult/anchorSearchResult?type=key&virtual_id=&value=' + this.data.searchkey
    })
  },
  //清除缓存历史（全部）
  clearSearchStorage: function() {
    wx.removeStorageSync('searchData')
    this.setData({
      keylist: []
    })
    let query1 = wx.createSelectorQuery()
    query1.select('.search_Height').boundingClientRect()
    query1.exec(function (req) {
      console.log(app.globalData.useWindowHeight,req[0])
      that.setData({
        scrollHeight:app.globalData.useWindowHeight-req[0].height-97+'px'
      })
    })
  },
  //打开历史记录列表
  openLocationsercher: function() {
    let keylist=wx.getStorageSync('searchData') || []
    this.setData({
      keylist:keylist ,
      allList_num:keylist.length,
    })
    console.log(this.data.keylist)
  },
  intiLocationsercher(){
    const that=this
  //  只显示三条数据
    let initList=[]
    let keylist=wx.getStorageSync('searchData') || []
    if(keylist.length>=3){
      initList=[keylist[0],keylist[1],keylist[2]] 
    }else{
      initList=keylist
    }
    this.setData({
      keylist:initList ,
      allKeyList:keylist
    })
    let query1 = wx.createSelectorQuery()
    query1.select('.search_Height').boundingClientRect()
    query1.exec(function (req) {
      console.log(app.globalData.useWindowHeight,req[0])
      that.setData({
        scrollHeight:app.globalData.useWindowHeight-req[0].height-97+'px'
      })
    })
  },
  choseNav:util.throttle(function (e){
    console.log(e)
    this.setData({
      activeTab:e[0].currentTarget.dataset.index
    })
    // if(!this.data.tabs[this.data.activeTab].is_first){
      this.getList()
    // }
   },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that=this
    wx.setNavigationBarTitle({
      title: '搜索'
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#f2f2f2',
    // })
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
    this.intiLocationsercher();
    this.setData({
      searchkey: ''
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})