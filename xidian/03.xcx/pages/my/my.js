// pages/my/my.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    // message_unread:'0',
    isTips:true,
    newDate:'',
    showContent:true,
    newContent:'刷新数据',
    timerOut: null,
    timer:5,
    banner_img:{
      image: '',
      skip_type: '',
      skip_id: ''
    },
    is_show:{},
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    userInfo:{
      collect: 0,
      footprint: 0,
      share: 0,
    },
    myInfo:{
      collect_num: 0,
      track_num: 0,
      discount_num: 0,
      unread_num: 0
    },
    isLogin: false,
    orderType: [{
        type: 'type_-1',
        icon: '../../image/member/order_01.png',
        name: '全部',
        num: 0,
        link:'../orderManage/orderManage?status=type_-1'
      },
      {
        type: 'type_1',
        icon: '../../image/member/order_02.png',
        name: '待付款',
        num: 0,
        link:'../orderManage/orderManage?status=type_1'
      },
      {
        type: 'type_2',
        icon: '../../image/member/order_03.png',
        name: '已付款',
        num: 0,
        link:'../orderManage/orderManage?status=type_2'
      },
      {
        type: 'type_3',
        icon: '../../image/member/order_04.png',
        name: '待开课',
        status: 0,
        link:'../orderManage/orderManage?status=type_3'
      },
      {
        type: '0',
        icon: '../../image/member/order_05.png',
        name: '售后',
        num: 0,
        link:'../saleList/saleList?status=0'
      },
    ],
    useList:[
      {id:1, img: '../../image/member/my__07.jpg', name: '基础资料', link: '../myCenter/myCenter',status:'0'},
      {id:2, img: '../../image/member/my__09.jpg', name: '学员管理', link: '../myChild/myChild', status: '0' },
      {id:3, img: '../../image/member/my__11.jpg', name: '我的拼团', link: '../myGroupBy/myGroupBy', status: '0' },
      {id:4, img: '../../image/member/my__13.png', name: '联系客服', link: '', status: '0'},
      // {id:5, img: '../../image/member/my__19.jpg', name: '消息中心', link: '../messageCenter/messageCenter', status: '1' },
      {id:6, img: '../../image/member/my__20.jpg', name: '关于西点', link: '../about/about', status: '0' },
      {id:7, img: '../../image/member/my__21.jpg', name: '版本信息', link: '../copyright/copyright', status: '0'}
    ]
  },
  // toNew:function(){
  //   const that=this
  //   var tim = new Date()
  //   var data = util.formatTime(tim)
  //   var content
  //   this.setData({
  //     newDate: data,
  //     showContent: false,
  //     loading: true,
  //   })
  //   wx.setStorageSync("timeData", data)
  //   this.getMyInfo()
  //   clearInterval(that.data.timerOut)
  //    that.data.timerOut=setInterval(function(){
  //     if (Number(that.data.timer)<0){
  //       that.setData({
  //         timer: 5,
  //         showContent: true,
  //         newContent:'刷新数据'
  //       })
  //       clearInterval(that.data.timerOut)
  //     }else{
  //       content = that.data.timer+'s后重试'
  //       that.setData({
  //         timer: --that.data.timer,
  //         newContent: content
  //       })
  //     }
  //   },1000)  
  // },
  toGo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  getMyInfo: function () {
    var that = this
    // 查看个人信息列表
    util.queryRequest('app/member/getCountData', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.data.orderType[1].num = res.data.unpaid
        that.data.orderType[2].num = res.data.divide
        that.data.orderType[3].num = res.data.start
        that.setData({
          userInfo:res.data,
          // message_unread:res.data.message_unread,
          showSkeleton: false,
          is_show:res.data.perfect,
          orderType: that.data.orderType,
        })
        if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined&&res.data.message_unread>0) {
          wx.setTabBarBadge({
            index: 3,  //tabBar序号，从0开始计数
            text:res.data.message_unread.toString()
          })
        }else{
          wx.removeTabBarBadge({
            index: 3,  //tabBar序号，从0开始计数
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
      that.setData({
        loading:false,
      })
    })

  },
  getbanner: function () {
    var that = this
    util.queryRequest('app/index/getImageList', {
      type:3
    }, "GET").then(function(res) {
      wx.hideLoading()
      if (res.code == 200) {
        if(res.data.length>0){
          that.setData({
            banner_img:res.data[0]
          })
        }
      } else {
        wx.showToast({
          title: req.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  visitLink: util.throttle(function (event) {
    let type = event[0].currentTarget.dataset.type
    let activity_id = parseInt(event[0].currentTarget.dataset.activityid)
    // type 0不跳转，1是首页，2是我的，3是动态，4是课程，5是课程详情，6是团购列表，7是团购详情，9是动态详情
    switch (type) {
      case 0:
        console.log("不跳转")
        break;
      case 1:
        wx.switchTab({
          url: '/pages/index/index',
        });
        break;
      case 2:
        wx.switchTab({
          url: '/pages/my/my',
        });
        break;
      case 3:
        wx.switchTab({
          url: '/pages/social/social',
        });
        break;
      case 4:
        wx.switchTab({
          url: '/pages/course/course',
        });
        break;
      case 5: // 课程详情
        wx.navigateTo({
          url: '/pages/proDetail/proDetail?id=' + activity_id,
        });
        break;
      case 6: // 团购列表
        wx.navigateTo({
          url: '/pages/spellGroup/spellGroup',
        });
        break;
      case 7: // 团购详情
        wx.navigateTo({
          url: '/pages/groupDetail/groupDetail?id=' + activity_id,
        });
        break;
      case 9: // 动态详情
        wx.navigateTo({
          url: '/pages/articleDetail/articleDetail?id=' + activity_id,
        });
        break;
      default:
        console.log('啥都不干')
    }
  }),
  // goOrder(e){
  //     wx.navigateTo({
  //       url: e.currentTarget.dataset.link
  //     })
  // },
  goLink:function(e){
    if (util.isLogin()){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }else{
      wx.navigateTo({
        url: '../userAuz/userAuz',
      })
    }
  },
  goLogin(){
    wx.navigateTo({
      url: '../userAuz/userAuz',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.setNavigationBarTitle({
      title: '个人'
    })
    // this.setData({
    //   newContent: '刷新数据',
    //   timer: 5,
    //   showContent: true,
    //   loading: false
    // })
    const that = this;
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      that.setData({
        userInfo:wx.getStorageSync('userInfo'),
        isLogin:true
      })
      if (wx.getStorageSync("timeData") != undefined && wx.getStorageSync("timeData")!=''){
        this.setData({
          newDate: wx.getStorageSync("timeData"),
        })
      }else{
        var tim=new Date()
        var data = util.formatTime(tim)
        this.setData({
          newDate: data,
        })
        wx.setStorageSync("timeData", data)
      }
      this.getMyInfo()
      this.getbanner()
    }else{
      setTimeout(()=>{
        that.setData({
          isLogin:false,
          showSkeleton: false
        })
      },500)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.timerOut)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timerOut)
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