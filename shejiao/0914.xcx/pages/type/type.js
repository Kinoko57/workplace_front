// pages/type/type.js
var app = getApp()
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    unread: app.globalData.unread,
    showSkeleton: true, //骨架屏显示隐藏
    nowchose: 0,
    filePath: app.globalData.fileUrl,
    typeTopNav: [{
        id: 0,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '热搜推荐'
      },
      {
        id: 1,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '美妆护肤'
      },
      {
        id: 2,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '保健养生'
      },
      {
        id: 3,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '运动户外'
      },
      {
        id: 4,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '女装内衣'
      },
      {
        id: 5,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '箱包手袋'
      },
      {
        id: 6,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '日用百货'
      },
      {
        id: 7,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '个人清洁'
      },
      {
        id: 8,
        nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
        nav_text: '电脑办公'
      }
    ],
    typeNavList: [{
        id: 1,
        parent_id: 0,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: [{
            id: 1,
            parent_id: 1,
            nav_text: '热门推荐',
            children: [{
                id: 1,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '面膜'
              },
              {
                id: 2,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_05.jpg',
                nav_text: '美妆馆'
              },
              {
                id: 3,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_07.jpg',
                nav_text: '进口小众'
              },
              {
                id: 4,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_12.jpg',
                nav_text: '好物种草'
              },
              {
                id: 5,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_14.jpg',
                nav_text: '洁面乳'
              },
              {
                id: 6,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_16.jpg',
                nav_text: '防晒霜'
              },
              {
                id: 7,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_22.jpg',
                nav_text: '显白口红'
              },
              {
                id: 8,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_25.jpg',
                nav_text: '美白'
              },
              {
                id: 9,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_27.jpg',
                nav_text: '保湿乳液'
              }
            ]
          },
          {
            id: 2,
            parent_id: 1,
            nav_text: '热卖品牌',
            children: [{
                id: 1,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_32.jpg',
                nav_text: '面膜'
              },
              {
                id: 2,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_34.jpg',
                nav_text: '美妆馆'
              },
              {
                id: 3,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_37.jpg',
                nav_text: '进口小众'
              },
              {
                id: 4,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_43.jpg',
                nav_text: '好物种草'
              },
              {
                id: 5,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_46.jpg',
                nav_text: '洁面乳'
              },
              {
                id: 6,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_47.jpg',
                nav_text: '防晒霜'
              },
              {
                id: 7,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_52.jpg',
                nav_text: '显白口红'
              },
              {
                id: 8,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_55.jpg',
                nav_text: '美白'
              },
              {
                id: 9,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_57.png',
                nav_text: '保湿乳液'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        parent_id: 1,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: [{
            id: 1,
            parent_id: 2,
            nav_text: '国货之光',
            children: [{
                id: 1,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '面膜'
              },
              {
                id: 2,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '美妆馆'
              },
              {
                id: 3,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '进口小众'
              },
              {
                id: 4,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '好物种草'
              },
              {
                id: 5,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '洁面乳'
              },
              {
                id: 6,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '防晒霜'
              },
              {
                id: 7,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '显白口红'
              },
              {
                id: 8,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '美白'
              },
              {
                id: 9,
                parent_id: 1,
                nav_img: app.globalData.staticUrl + 'type/nav_03.jpg',
                nav_text: '保湿乳液'
              }
            ]
          },
          {
            id: 2,
            parent_id: 2,
            nav_text: '好用的百雀羚啊',
            children: [{
                id: 1,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_32.jpg',
                nav_text: '补水'
              },
              {
                id: 2,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_34.jpg',
                nav_text: '精华'
              },
              {
                id: 3,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_37.jpg',
                nav_text: '敏感肌'
              },
              {
                id: 4,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_43.jpg',
                nav_text: '美白面霜'
              },
              {
                id: 5,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_46.jpg',
                nav_text: '精选礼盒'
              },
              {
                id: 6,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_47.jpg',
                nav_text: '洁面'
              },
              {
                id: 7,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_52.jpg',
                nav_text: '抗痘'
              },
              {
                id: 8,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_55.jpg',
                nav_text: '护肤套装'
              },
              {
                id: 9,
                parent_id: 2,
                nav_img: app.globalData.staticUrl + 'type/nav_57.png',
                nav_text: '精油'
              }
            ]
          }
        ]
      },
      {
        id: 3,
        parent_id: 2,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children:[]
      },
      {
        id: 4,
        parent_id: 3,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: []
      },
      {
        id: 5,
        parent_id: 4,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: []
      },
      {
        id: 6,
        parent_id: 5,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: []
      },
      {
        id: 7,
        parent_id: 6,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: []
      },
      {
        id: 8,
        parent_id: 7,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: []
      },
      {
        id: 9,
        parent_id: 8,
        banner: app.globalData.staticUrl + 'type/banner_01.png',
        children: []
      }
    ],
    selectNavList: [],
    topHeight: 0,
    hot_url: app.globalData.staticUrl+'type/hot.png'
  },
  // 获取分类列表
  getList() {
    let that = this
    util.queryRequest('/app/category/getList', {}, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        that.setData({
          typeTopNav: res.data,
          typeNavList: res.data,
          nowchose: res.data[0].id,
          selectNavList: res.data[0],
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    console.log(app.globalData.useWindowHeight)
    that.setData({
      topHeight: app.globalData.useWindowHeight - app.globalData.tabbarHeight
    })
    this.getList()
    for (let i = 0; i < that.data.typeNavList.length; i++) {
      if (that.data.nowchose == that.data.typeNavList[i].parent_id) {
        that.setData({
          selectNavList: that.data.typeNavList[i]
        })
        break;
      }
    }
    
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 1000)
  },
  goLink: util.throttle(function (event) {
    console.log(event)
    wx.navigateTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  choseNav(e) {
    let that = this
    console.log(e)
    for (let i = 0; i < that.data.typeNavList.length; i++) {
      if (e.currentTarget.id == that.data.typeNavList[i].id) {
        that.setData({
          selectNavList: that.data.typeNavList[i],
          nowchose: e.currentTarget.id
        })
        break;
      }
    }
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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
  onShareAppMessage: function() {

  }
})