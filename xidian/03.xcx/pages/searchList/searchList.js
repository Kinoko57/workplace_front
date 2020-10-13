// pages/spellGroup/spellGroup.js
let util = require('../../utils/util.js')
var app=getApp()
let leftHeight = 0;
let rightHeight = 0; //分别定义左右两边的高度
let query;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    col1: [],
    col2: [],
    isTop:true,
    page: 1,
    size:10,
    imgWidth: 340,
    hasData: true,
    loadingCount: 0,
    is_end: false,
    is_load: false,
    topNum:0,
    groupList:[],
    showSkeleton:true,
    scrollHeight:0,
    inputSearch:'',
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  searchInput: function(e) {
    this.setData({
      inputSearch: e.detail.value.trim()
    })
  },
  // 取消搜索
  cancelSearch:util.throttle(function (event) {
     leftHeight = 0
     rightHeight = 0
    this.setData({
      inputSearch:'',
      page: 1,
      size:10,
      col1: [],
      col2: [],
      hasData: true,
      is_end: false,
      is_load: false,
      topNum:0,
      groupList:[],
    })
    this.getList()
  },1000),
  // 输入回车
  searchConfirm(e){
   leftHeight = 0
   rightHeight = 0
    this.setData({
      inputSearch:this.data.inputSearch,
      page: 1,
      size:10,
      col1: [],
      col2: [],
      hasData: true,
      is_end: false,
      is_load: false,
      topNum:0,
      groupList:[],
    })
  this.getList()
  },
  getList:function(){
    const that=this
    util.queryRequest('app/index/searchIndex', {
      name: that.data.inputSearch,
      page: that.data.page,
      size: that.data.size,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200'){
        that.setData({
          showSkeleton: false,
        })
        console.log(app.globalData.useWindowHeight,that.data.scrollHeight)
        if (res.data.rows.length>0){
          that.isLeft(res.data.rows)
          that.setData({
            groupList: res.data.rows,
            hasData: true,
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
            is_load:false
          })
        }
      }
    })
  },
  async isLeft(list) {
    let {
      col1,
      col2
    } = this.data;
    query = wx.createSelectorQuery();
    for (const item of list) {
      console.log(leftHeight,rightHeight,"safl;sdl;fkjdsgfsd;gksd")
      leftHeight <= rightHeight ? col1.push(item) : col2.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(col1, col2);
    }
  },
  getBoxHeight(col1, col2) { //获取左右两边高度
    return new Promise((resolve, reject) => {
      this.setData({
        col1,
        col2
      }, () => {
        query.select('.hot_block_left').boundingClientRect();
        query.select('.hot_block_right').boundingClientRect();
        query.exec((res) => {
          console.log(res)
          leftHeight = res[0].height; //获取左边列表的高度
          rightHeight = res[1].height; //获取右边列表的高度
          console.log(leftHeight)
          console.log(rightHeight)
          resolve();
        });
      });
      console.log(this.data.col1,"左侧高度")
    })
  },
  goLink: util.throttle(function (event) {
    console.log(event)
    // 拼团
    if(event[0].currentTarget.dataset.type=='2'){
      wx.navigateTo({
        url:'../groupDetail/groupDetail?id='+event[0].currentTarget.dataset.id
      })
    }else if(event[0].currentTarget.dataset.type=='1'){
      // 课程
      wx.navigateTo({
        url:'../proDetail/proDetail?id='+event[0].currentTarget.dataset.id
      })
    }else if(event[0].currentTarget.dataset.type=='3'){
      // 动态
      wx.navigateTo({
        url:'../viewArticle/viewArticle?id='+event[0].currentTarget.dataset.id
      })
    }

  }),
  loadMore:function(){
    const that=this
    console.log
    if(that.data.is_load){
      let info = {
        name: that.data.inputSearch,
        page: ++that.data.page,
        size: that.data.size
      }
      util.queryRequest('app/index/searchIndex', info, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          if (res.data.rows.length > 0) {
            that.isLeft(res.data.rows)
            that.data.groupList = that.data.groupList.concat(res.data.rows)
            that.setData({
              groupList: that.data.groupList,
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
  onLoad: function (options) {
    const that=this
    wx.setNavigationBarTitle({
      title: '搜索结果'
    })
    this.setData({
      inputSearch:options.value
    })
    that.getList()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight -66
        })
      },
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
    leftHeight = 0
    rightHeight = 0
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