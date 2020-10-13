//app.js
App({
  onLaunch: function () {
    console.log("onLaunch")
    // 获取导航栏高度
    let that = this
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res)
        if (res.model.indexOf("iPhone X") != -1 || res.model.indexOf("iPhone12") != -1) {
          that.globalData.isiPhoneX = true;
          that.globalData.tabbarHeight = 49 + 32
          console.log("是iphoneX")
        }
        if (res.screenHeight > 750) that.globalData.isAllScreen = true;
        console.log(menuButtonObject)
        //导航高度 statusBarHeight手机状态栏的高度
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.menuHeight = menuButtonObject.height;
        that.globalData.navHeight = navHeight;
        that.globalData.navTop = navTop;
        that.globalData.windowHeight = res.screenHeight;
        that.globalData.inputWidth = res.windowWidth - menuButtonObject.width - 110;
        that.globalData.useWindowHeight = res.screenHeight - navHeight;
        console.log(menuButtonObject.top, 'navTop导航栏距离顶部高度')
        console.log(res.statusBarHeight, 'statusBarHeight状态栏的高度')
        console.log(menuButtonObject.height, 'menuHeight菜单按钮的高度')
      },
      fail(err) {
        console.log(err)
      }
    })
    // 获取主导航
    this.getNavList()
    // 获取全局配置
    // this.getSetting()

  },
  onShow:function(e){
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined){
      this.globalData.isLogin = true
    }
    this.globalData.authorUrl = this.getUrl(e)
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
  getNavList:function(){
    let that = this
    wx.request({
      url: that.globalData.apiUrl + '/app/index/getNavMain', //仅为示例，并非真实的接口地址
      data: {},
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success(res) {
        console.log(res.data)
        if(res.data.code == 200){
          wx.setStorageSync('navList', res.data.data.list)
        }else{
          wx.setStorageSync('navList', '')
        }
      },
      fail(res) {
        console.log('err' + res.data)
        wx.setStorageSync('navList', '')
      }
    })
  },
  getSetting:function(){
    let that = this
    wx.request({
      url: that.globalData.apiUrl + '/app/auth/protocol', //仅为示例，并非真实的接口地址
      data: {},
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success(res) {
        console.log(res.data)
        // if(res.data.code == 200){
        //   wx.setStorageSync('navList', res.data.data.list)
        // }else{
        //   wx.setStorageSync('navList', '')
        // }
      },
      fail(res) {
        console.log('err' + res.data)
        // wx.setStorageSync('navList', '')
      }
    })
  },
  // 新版本更新提示
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
  globalData: {
    apiUrl: 'https://apids.88360.com',
    // apiUrl: 'https://apizx.88360.com',
    fileUrl: 'https://fileds.88360.com/',// 后台文件域名
    staticUrl: 'https://apids.88360.com/public/img/image/', // 静态图片域名路径
    showDia: true,// 是否弹登陆失效的框
    isiPhoneX: false,// 是否iphoneX或者iphone 11
    userInfo: null,
    authorUrl: '',//缓存路径
    isLogin:false,//判断是否登录
    carNum: 0,
    areaJson: '',
    unread:0, // 未读消息数
    menuHeight: 0,// 菜单按钮的高度
    navHeight: 60, // 手机状态栏+小程序导航栏的高度
    navTop: 0,// 导航栏距离顶部高度
    windowHeight: 0,// 可视窗口高度包括自定义顶部栏
    inputWidth: 0, // 首页输入框的宽度
    statusBarHeight: 0, // 右侧状态栏的高度
    useWindowHeight: 0, // 可用窗口的高度
    tabbarHeight: 48,// 底部菜单栏高度
    isAllScreen:false,// 是否全面屏手机
  }
})