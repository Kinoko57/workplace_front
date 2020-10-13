const formatTime = date => {
  date = new Date(date * 1000);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  date = new Date(date * 1000);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function queryRequest(url, datalist, option, callback) {
  // data包括请求的api接口地址，传递的数据，什么类型的请求
  wx.request({
    url: getApp().globalData.apiUrl + url,
    data: datalist,
    method: option,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": wx.getStorageSync("cookie")
    },
    success: function(res) {
      if (res.statusCode === 200) {
        if (res.data.isSuccess == false && res.data.isLogin == false) {
          console.log('登录失效了')
          // 清空小程序缓存
          wx.setStorageSync("cookie", '')
          wx.hideLoading()
          // 登录
          wx.login({
            success: function(req) {
              if (req.code) {
                //发起网络请求
                wx.request({
                  url: getApp().globalData.apiUrl + '?m=login&a=dologin',
                  data: {
                    code: req.code,
                    source: 'wxxcx'
                  },
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function(res) {
                    console.log(res)
                    if (res.statusCode === 200) {
                      console.log(res)
                      if (res.data.isSuccess == true) {
                        var data = 'member[uid]=' + res.data.uid +
                          ';member[username]=' + res.data.username +
                          ';member[rank]=' + res.data.rank +
                          ';member[token]=' + res.data.token +
                          ';member[source]=' + res.data.source +
                          ';sessionid=' + res.data.sessionid
                        wx.setStorageSync("cookie", data);
                        getApp().globalData.userInfo.nickname = res.data.nickname
                        getApp().globalData.userInfo.username = res.data.username
                        getApp().globalData.userInfo.level = res.data.rankname
                        getApp().globalData.userInfo.avatar = res.data.image
                        getApp().globalData.userInfo.isShow = 1
                        getApp().globalData.userInfo.isbind = res.data.bindPhone
                        wx.setStorageSync("isbind", res.data.bindPhone);
                        wx.setStorageSync("score", res.data.point);
                        wx.setStorageSync("userInfo", getApp().globalData.userInfo);
                        var page = getCurrentPages()[getCurrentPages().length - 1]
                        if (page.route.indexOf('myGift') != -1) {
                          page.onShow()
                        }
                      }
                    }
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        } else {
          callback(res.data)
        }
      }
    },
    fail: function(err) {
      wx.hideLoading()
      if (!getApp().globalData.window_open) {
        getApp().globalData.window_open = true
        wx.showModal({
          title: '提示',
          content: '网络超时，请重试',
          success(res) {
            if (res.confirm) {
              getApp().globalData.window_open = false
              var page = getCurrentPages()[getCurrentPages().length - 1]
              var flag = 0
              var listPage = ['myCar', 'mySignIn', 'myGift', 'myComment', 'memberCenter', 'tryOutdetail', 'afterDetail', 'hotPush', 'myFootprint', 'orderDetail', 'personCenter', 'single'] //页面调用onShow
              listPage.forEach(item => {
                if (page.route.indexOf(item) != -1) {
                  console.log('执行onShow')
                  flag = 1
                }
              })
              if (page.route.indexOf('index') != -1) {
                flag = 2
              } else if (page.route.indexOf('lottery') != -1) {
                console.log(page)
                if (page.data.prizeList.length > 0) {
                  console.log('重启抽奖')
                  flag = 3
                  page.data.btnDisabled = ''
                  page.setData({
                    btnDisabled: page.data.btnDisabled
                  })
                } else {
                  flag = 1
                }
              } else if (page.route.indexOf('editInfo') != -1) {
                flag = 4
              } else if (page.route.indexOf('sureOrder') != -1) {
                if (page.data.ispayStep) {
                  flag = 5
                }
              } else if (page.route.indexOf('proType') != -1) {
                // 初始化分类页
                app.globalData.firstForm = -1
              }
              if (flag == 1) {
                page.onShow()
              } else if (flag == 2) {
                console.log('执行onPullDownRefresh')
                page.onPullDownRefresh()
              } else if (flag == 3) {
                console.log('执行大转盘抽奖')
                page.getLottery()
              } else if (flag == 4) {
                console.log('我的地址')
                page.onLoad(page.options)
                page.onShow()
              } else if (flag == 5) {
                console.log('支付超时跳转到待支付订单')
                wx.showToast({
                  title: '支付超时',
                  icon: 'none',
                  duration: 500
                })
                setTimeout(function() {
                  wx.redirectTo({
                    url: '../myOrder/myOrder?tid=1&id=type1'
                  })
                }, 500)
              } else {
                console.log('执行onLoad')
                page.onLoad(page.options)
              }
            } else if (res.cancel) {
              getApp().globalData.window_open = false
               console.log('用户点击取消')
            }
          }
        })
      }
    },
    complete: function(res) {
      // console.log(res)
    }
  })
}

//判断是否授权
function isLogin() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options
  //拼接url的参数
  if (JSON.stringify(options) != "{}") {
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
  } else {
    urlWithArgs = url
  }
  getApp().globalData.backUrl = urlWithArgs
  if (wx.getStorageSync("cookie") == '' || wx.getStorageSync("cookie") == null) {
    wx.redirectTo({
      url: '/pages/userAuz/userAuz'
    })
    return false
  } else {
    return true
  }
}
const countDown = times => { //倒计时函数
  var that = this
  let obj = null;
  // 如果活动未结束，对时间进行处理
  if (times > 0) {
    let time = times;
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    obj = {
      day: day < 10 ? '0' + day : day,
      hou: hou < 10 ? '0' + hou : hou,
      min: min < 10 ? '0' + min : min,
      sec: sec < 10 ? '0' + sec : sec
    }
    // times--;
  } else { //活动已结束，全部设置为'00'
    obj = {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }
  }

  // 渲染，然后每隔一秒执行一次倒计时函数
  return obj;
  // setTimeout(this.countDown, 1000);
}
const countDownList = timesList => { //倒计时函数
  var that = this
  var obj = []
  for (var i = 0; i < timesList.length; i++) {
    // 如果活动未结束，对时间进行处理
    if (timesList[i] > 0) {
      let time = timesList[i];
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj[i] = {
        day: day < 10 ? '0' + day : day,
        hou: hou < 10 ? '0' + hou : hou,
        min: min < 10 ? '0' + min : min,
        sec: sec < 10 ? '0' + sec : sec
      }
      // times--;
    } else {
      //活动已结束，全部设置为'00'
      obj[i] = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
  }
  // 渲染，然后每隔一秒执行一次倒计时函数
  return obj;
  // setTimeout(this.countDown, 1000);
}
const timeFormat = param => { //小于10的格式化函数
  return param < 10 ? '0' + param : param;
}
// 重新加载页面
function loadPage(that) {
  wx.hideLoading()
  var page = getCurrentPages()[getCurrentPages().length - 1]
  if (page.route.indexOf('myCar') != -1 || page.route.indexOf('mySignIn') != -1 || page.route.indexOf('myGift') != -1 || page.route.indexOf('myComment') != -1 || page.route.indexOf('memberCenter') != -1 || page.route.indexOf('lottery') != -1 || page.route.indexOf('myFootprint') != -1 || page.route.indexOf('activityList') != -1) {
    page.onShow()
  } else {
    page.onLoad(page.options)
  }
  // if (page.route.indexOf('index') == -1 || page.route.indexOf('proType') == -1) {
  //   console.log(page)
  //   that.onLoad(page.options)
  // }
}
// 版本号
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  queryRequest: queryRequest,
  isLogin: isLogin,
  countDown: countDown,
  countDownList: countDownList,
  timeFormat: timeFormat,
  loadPage: loadPage,
  compareVersion: compareVersion
}