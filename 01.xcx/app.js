//app.js
// const ald = require('./utils/ald-stat.js')
let util = require('utils/util.js')
App({
  onLaunch: function(e) {
    var that=this
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        if (res.model.indexOf("iPhone X")!=-1){
          that.globalData.phoneType=true
        }
      }
    })
    console.log(e.scene)
    let toGuide = [1001, 1005,1006,1022,1026,1027,1037,1042,1045,1046,1053,1054,1089,1090,1103,1104]
    var that = this
    if (toGuide.includes(e.scene)){
      console.log('符合条件进引导页')
      wx.request({
        url: that.globalData.apiUrl + '?m=img', //仅为示例，并非真实的接口地址
        data: {},
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success(res) {
          console.log(res.data)
          if (res.data.isSuccess) {
            if (res.data.data.length > 0) {
              console.log("引导页已开启")
              // 开启跳转
              that.globalData.showImg = res.data.data[0]
              wx.reLaunch({
                url: '/pages/guidePage/guidePage?img=' + res.data.data[0]
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        },
        fail(res) {
          console.log('err' + res.data)
        }
      })
    }

  },
  onShow:function(){
    if (wx.canIUse('getUpdateManager')) {
      console.log('可以使用小程序自动更新')
      this.updateManager()
    }else{
      console.log("用户版本过低")
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  updateManager:function(){
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      console.log("新版本下载失败")
      wx.showModal({ // 新的版本下载失败
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },
  globalData: {
    apiUrl: 'https://www.gongzhugou.com/',
    hiddenlogin: true,
    firstForm: -1, // -1为第一次访问，0为从首页分类点进来，1为首页的广告位跳转进来
    firstHot: 0,
    userInfo: {
      avatar: '',
      nickname: '',
      username: '',
      level: '',
      isShow: 0,
      isbind: false
    },
    news: false,
    carNum: 0,
    winId: '',
    backUrl: '',
    menuList: {},
    choseNav: -1,
    window_open:false,
    phoneType:false,
    showImg:''
  },
})