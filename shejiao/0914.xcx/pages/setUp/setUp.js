// pages/about/about.js
let util = require('../../utils/util.js')

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    token:'',
    is_auth:0,
    aboutList: [
      [{
          id: 1,
          name: '个人信息修改',
         link: '../myCenter/myCenter'
        }
      ],
      [{
        id: 2,
        name: '账户安全',
        link: '../accountSecurity/accountSecurity'
      }],
      [{
          id: 3,
          name: '实名信息',
          link: '../realInfo/realInfo'
        },
        {
          id: 4,
          name: '银行卡管理',
          link: '../myBank/myBank'
        },
      ],
      [
        {
          id: 5,
          name: '关于我们',
          link: '../protocol/protocol?type=about'
        },
        {
          id: 6,
          name: '隐私政策',
          link: '../protocol/protocol?type=privacy'
        },
        {
          id: 7,
          name: '服务协议',
          link: '../protocol/protocol?type=service'
        },
      ]
      // [{
      //     id: 5,
      //     name: '关于我们',
      //     link: '../about/about'
      //   },
        // {
        //   id: 6,
        //   name: '清除缓存',
        //   link: ''
        // },
        // {
        //   id: 7,
        //   name: '证照信息',
        //   link: ''
        // },
      ],
    // ],
  },
  goLink(e){
    const that=this
    if( e.currentTarget.dataset.id!=3&&e.currentTarget.dataset.id!=4){
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    }else{
      if(that.data.is_auth==1){
        wx.navigateTo({
          url: e.currentTarget.dataset.link,
        })
      }else{
        wx.navigateTo({
          url: '../realName/realName',
        })
      }
    }
  },
  copy(){
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.token,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title:'设置',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
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
    this.setData({
      is_auth:wx.getStorageSync('userInfo').card_type
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
  onShareAppMessage: function() {

  }
})