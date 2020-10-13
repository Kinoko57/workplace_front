// pages/anchorPeopson/anchorPeopson.js
let util = require('../../utils/util.js')
let col1H = 0,col2H = 1;
let query;
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size:10,
    pro_allNum:0,
    col1: [],
    col2: [],
    page_num:0,
    is_first:false,
    topNum:0,
    hasData: true,
    is_end: false,
    isTop: true,
    page:1,
    activeTab:0,
    userInfo:{},//个人信息
    navList:[{id:1,name:'动态'},{id:2,name:'喜欢'},],
    showSkeleton:true,
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    member_id:0,
    userInfo_id:wx.getStorageSync('userInfo').id,//用户自己的id
    total:0,
    isTop: true,
    scrollHeight:'0px'
  },
  goLink:util.throttle(function (e){
   wx.navigateTo({
     url: e[0].currentTarget.dataset.link,
   })
  },500),
  // 获取个人主页数据
  getMyInfo: function () {
    var that = this
    let obj={
      page:that.data.page,
      size:that.data.size,
      type:that.data.navList[that.data.activeTab].id,
      member_id:that.data.member_id
    }
    util.queryRequest('/app/broadcast/homePage', obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
       if(res.data.list.rows.length>0){
        that.isLeft(res.data.list.rows);
         that.setData({
           page_num:Math.ceil( res.data.list.total / that.data.size),
           is_end:Math.ceil(res.data.list.total / that.data.size) == that.data.page,
           is_end:Math.ceil(res.data.list.total / that.data.size) == that.data.page,
           hasData:true,
           userInfo:res.data.member,
           showSkeleton: false,
           tabs:that.data.tabs
        })
       }else{
        that.setData({
          showSkeleton: false,
          is_end:true,
          hasData:false,
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
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1000)
        console.log(res.msg)
      }
    })
  },
  loadMore() {
    let that = this
    if (that.data.is_end == false) {
      console.log('加载更多')
      let obj={
        page:++that.data.page,
        size:that.data.size,
        type:that.data.navList[that.data.activeTab].id,
        member_id:that.data.member_id
      }
      util.queryRequest('/app/broadcast/homePage', obj, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          that.isLeft(res.data.list.rows);
          that.setData({
            is_end:that.data.page_num==that.data.page
          })
        }
      })
    } else {
      console.log("加载完了")
    }
  },
  async isLeft(list) {
    const that=this
    let {col1,col2}=this.data
    query = wx.createSelectorQuery();
    for (const item of list) {
      col1H <=  col2H ? col1.push(item) : col2.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(col1,col2);
    }
  },
  getBoxHeight(col1,col2) { //获取左右两边高度
    const that=this
      return new Promise((resolve, reject) => {
        this.setData({
          col1,
          col2
        },
         () => {
          query.select('.anchorPer_block_left').boundingClientRect();
          query.select('.anchorPer_block_right').boundingClientRect();
          query.exec((res) => {
            col1H = res[0].height; //获取左边列表的高度
            col2H = res[1].height; //获取右边列表的高度
            resolve();
          });
        });
      })
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
          isTop:  true
        })
      }
    }
  },
  goDetail(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  choseNav:util.throttle(function (e){
    console.log(e)
    this.setData({
      activeTab:e[0].currentTarget.dataset.index,
      col1:[],
      col2:[],
      page_num:0,
      topNum:0,
      hasData: true,
      is_end: false,
      isTop: true,
      page:1,
    })
    col1H = 0
    col2H = 1
    this.getMyInfo()
   },500),
  //  关注
  followView: util.throttle(function (e) {
    if(util.isLogin()){
      let that = this
        // 关注
        let msg=''
        if(e[0].currentTarget.dataset.type=='follow'){
          msg='关注'
        }else{
          msg='取消关注'
        }
        util.queryRequest('/app/dynamic/collect', {
          anchor_id: that.data.member_id,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: msg+'成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              that.setData({
                hasData: true,
                is_end: false,
                isTop: true,
                page_num:0,
                page:1,
                activeTab:0,
                col2:[],
                col1:[],
              })
              col1H = 0
              col2H = 1
              that.getMyInfo()
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }),
    // 点赞
    collView: util.throttle(function (e) {
      if(util.isLogin()){
        let that = this
        if(e[0].currentTarget.dataset.like==0){
          // 点赞 取消商品
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
            util.queryRequest('/app/dynamic/beFondOf', {
              dynamic_id: e[0].currentTarget.dataset.id,
            }, 'GET').then(function (res) {
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
                }, 100)
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
    }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      member_id:options.member_id,
      scrollHeight: app.globalData.useWindowHeight-200+'px'
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 2000)
   
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
    col1H = 0
    col2H = 1;
    this.setData({
      col1:[],
      col2:[],
      page_num:0,
      topNum:0,
      hasData: true,
      is_end: false,
      isTop: true,
      page:1,
    })
    this.getMyInfo()
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