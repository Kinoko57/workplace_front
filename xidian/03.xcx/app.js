//app.js
let util = require('utils/util.js')
App({
  onLaunch: function (e) {
    const that=this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 初始值，是否显示引导页（0，没有显示过，1已经显示过）
    wx.setStorageSync('guidePage', '0')
    // 判断是否是iphone X
    // iPhone 11 Pro Max，iPhone 11，iPhone 11 Pro，iPhone x, iPhone xs, iPhone xs Max, iPhone xr
    wx.getSystemInfo({
      success(res) {
        console.log(res,res.model,"手机型号")
        if (res.model.indexOf("iPhone X") != -1 || res.model.indexOf("iPhone1") != -1 || res.model.indexOf("iPhone x") != -1 || res.model.indexOf("iPhone 1") != -1) {
          console.log(res.model)
          that.globalData.isiPhoneX = true
        }
        //导航高度 statusBarHeight手机状态栏的高度
        that.globalData.useWindowwidth = res.windowWidth;
        that.globalData.useWindowHeight = res.windowHeight;
        that.globalData.useWindowHeightFoot = res.windowHeight;
      },
      fail(err) {
        console.log(err)
      }
    })
    // //判断引导页信息
    // let toGuide = [1007, 1008,1014]
    // if (!toGuide.includes(e.scene)){
    //   wx.setStorageSync('guidePage', '0')
    // }else{
    //   console.log('分享链接点进来的')
    // }
  }, 
  onShow:function(e){
    const that=this
    console.log(e)
    that.globalData.authorUrl = that.getUrl(e)
    // console.log('缓存页面' + that.globalData.authorUrl)
    //   // 如果访问的链接的参数包含uid说明是带邀请码分享进来的
    // if (e.query.uid != undefined && e.query.uid != '') {
    //   wx.setStorageSync('invite_id', e.query.uid)
    //   wx.setStorageSync('discount_id', e.query.discount_id)
    //   console.log("设置邀请码" + e.query.uid, e.query.discount_id)
    // }
    // 用户是否可以更新
    if(wx.canIUse('getUpdateManager')) {
      console.log('可以使用小程序自动更新')
      this.updateManager()
    } else {
      console.log("用户版本过低")
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  updateManager: function () {
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
  // 拿到当前页面的完整路径
  getUrl: function (e) {
    var url = e.path //当前页面url
    var options = {}
    if (e.query.scene != undefined) {
      let str = unescape(e.query.scene)
      str = str.substring(1, str.length)
      var arr = str.split('&amp;')
      for (let i = 0; i < arr.length; i++) {
        var str1 = arr[i]
        var obj_arr = str1.split('=')
        options[obj_arr[0]] = obj_arr[1]
      }
    } else {
      options = e.query
    }
    console.log(options)
    var urlWithArgs = ''
    //拼接url的参数
    if (JSON.stringify(options) != "{}") {
      urlWithArgs = url + '?'
      for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
      }
    } else {
      urlWithArgs = url
    }
    urlWithArgs = '/' + urlWithArgs
    console.log(urlWithArgs)
    return urlWithArgs
  },
  globalData: {
    // apiUrl: 'https://apixd.88360.com/',//测试版本
    // version: 'v2',//测试版本
    apiUrl: 'https://api.xdjunxiao.com/',//线上版本
    version: 'v1',
    useWindowwidth: 0, // 可用窗口宽度
    useWindowHeightFoot: 0, // 有底部栏可用窗口的高度
    useWindowHeight: 0, // 可用窗口的高度
    article_type: '', // 文章默认分类
    authorUrl: '',
    window_open:false,
    showDia:true,
    isiPhoneX: false,// 是否iphoneX或者iphone 11
    unread_num:false,
    isLogin: false,
    guideImg: []
  }
})