const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = (date,type) => {
 
  date = new Date(date * 1000);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if(type=='month'){
    return [year, month].map(formatNumber).join('-')
  }else{
    return [year, month, day].map(formatNumber).join('-')
  }
 
}
const formatDateTime = (date) => {
 
  date = new Date(date * 1000);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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
}
// 调用方式
// util.queryRequest('',{},'GET').then(function(res){}).catch(function(res){})
function queryRequest(url, datalist, option) {
  const that = this;
  let token = wx.getStorageSync('token')
  let datalistall = { ...datalist, 'token': token }
  if (new Promise((resolve, reject) => { })) {
    var p = new Promise(function (resolve, reject) {
      // data包括请求的api接口地址，传递的数据，什么类型的请求
      wx.request({
        url: getApp().globalData.apiUrl + url,
        // url: 'https://apids.88360.com'+ url,
        data: datalistall,
        method: option,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": wx.getStorageSync("cookie")
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode === 200) {
            if (res.data.code != 200 && res.data.code == 4001) {
              console.log('登录失效了')
              // 清空小程序缓存
              wx.setStorageSync("token", '')
              wx.setStorageSync('guidePage', '0')
              wx.hideLoading()
              if (getApp().globalData.showDia == true) {
                getApp().globalData.showDia = false
                wx.showModal({
                  title: '提示',
                  content: '小程序登录已失效，请重新登录哦~',
                  cancelText: '回首页',
                  confirmText: '我知道了',
                  success(res) {
                    if (res.confirm) {
                      getApp().globalData.showDia = true
                      wx.navigateTo({
                        url: '../userAuz/userAuz',
                      })
                    } else if (res.cancel) {
                      getApp().globalData.showDia = true
                      wx.reLaunch({
                        url: '../index/index',
                      })
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            } else {
              getApp().globalData.showDia = true
              resolve(res.data)
            }
          }
        },
        fail: function (res) {
          console.log("网络请求失败....："+res.errMsg)
          reject(res)
        }
      })
    })
    return p;
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法正常使用，请升级到最新微信版本后重试。'
    })
  }

}
/*函数节流 立马执行，n秒后再立马执行*/
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 500;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
//判断是否授权
function isLogin() {
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let url = currentPage.route //当前页面url
  let options = currentPage.options
  if (options.scene != undefined) {
    var str = unescape(options.scene)
    str = str.substring(1, str.length)
    var arr = str.split('&amp;')
    for (var i = 0; i < arr.length; i++) {
      var str1 = arr[i]
      var obj_arr = str1.split('=')
      options[obj_arr[0]] = obj_arr[1]
    }
  }
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
  getApp().globalData.authorUrl = '/' + urlWithArgs
  if (wx.getStorageSync("token") == '' || wx.getStorageSync("token") == null) {
    return false
  } else {
    return true
  }
}
/*函数防抖  n秒后延迟执行*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}
// 拿到当前页面的完整路径
function getFullUrl(){
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options
  console.log(currentPage.options,"sldfsdlkf")
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
}
module.exports = {
  formatTime: formatTime,
  formatDate:formatDate,
  formatDateTime: formatDateTime,
  countDown: countDown,
  countDownList: countDownList,
  queryRequest: queryRequest,
  throttle: throttle,
  isLogin:isLogin,
  debounce: debounce,
  getFullUrl: getFullUrl
}
