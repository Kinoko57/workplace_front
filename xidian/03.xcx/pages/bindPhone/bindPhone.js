// pages/bindPhone/bindPhone.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgPath: app.globalData.fileUrl,
    form:{},
    mobile: '',
    nickname: '',
    inviter: '',
    code: '',
    text: '获取验证码',
    currentTime: 61,
    isDisabled: false,
    color: '#eeddbc',
    canclick: false,
    isLogin: false,
    isShowMember:false,
    isShowTime: false,
    type:'register',
    okButton:true,
  },
  goRegister:function(){
    const that=this
    if (that.data.mobile != '' && that.data.code != '' && (/^1\d{10}$/.test(that.data.mobile))){
      if (that.data.okButton){
        wx.showLoading({
          title: '...',
          mask: true
        })
        that.setData({
          okButton:false
        })
        var userfirstInfo={}
        userfirstInfo = wx.getStorageSync('userfirstInfo')
        console.log(wx.getStorageSync('userfirstInfo'))
        wx.login({
          success: function (res) {
            wx.request({
              url: app.globalData.apiUrl+'app/auth/register', //仅为示例，并非真实的接口地址
              data: {
                wx_code: res.code,
                tel: that.data.mobile,
                verification: that.data.code,
                nickname: userfirstInfo.nickName,
                image: userfirstInfo.avatarUrl,
                sex: userfirstInfo.gender
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res) {
                if (res.data.code == 200) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '验证成功',
                    icon: 'success',
                    duration: 1000
                  })
                  wx.setStorageSync("token", res.data.data.token)
                  wx.removeStorage('userfirstInfo')
                  setTimeout(()=>{
                    util.queryRequest('app/member/get', {}, 'GET').then(function (res) {
                      if (res.code === 200 || res.code === '200') {
                        wx.setStorageSync('userInfo', res.data)
                      }
                    })
                    console.log(app.globalData.authorUrl,'缓存的路径')
                    if(app.globalData.authorUrl.indexOf('bindPhone')!=-1){
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }else{
                      wx.reLaunch({
                        url: app.globalData.authorUrl
                      })
                    }
                    that.setData({
                      okButton: true
                    })
                  },1000)
                } else {
                  that.setData({
                    okButton: true
                  })
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            })
          }
        })
      }
    } else{
      let msg=''
      if(that.data.code==''){
        msg='请输入验证码'
      }
      console.log(!/^1\d{10}$/.test(that.data.mobile) ,!/^\d{6,}$/.test(that.data.mobile))
      if(that.data.mobile==''||(!/^1\d{10}$/.test(that.data.mobile))){
         msg='请输入正确的手机号'
      }
      wx.showToast({
        title: msg,
        icon:'none',
        duration:1000
      })
    }
  },
  changePhone:function(){
    const that=this
    console.log(that.data.mobile,"手机号")
    if (that.data.mobile != '' && that.data.code != '' && (/^1\d{10}$/.test(that.data.mobile))){
      if (that.data.okButton){
        that.setData({
          okButton: false
        })
        util.queryRequest('app/member/editTel', {
          tel: that.data.mobile,
          verification: that.data.code
        }, 'POST').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '手机号修改成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              that.setData({
                okButton: true
              })
            }, 1000)
          }else{
            that.setData({
              okButton: true
            })
            wx.showModal({
              title: '提示',
              content: res.msg,
              showCancel: false,
              confirmText: '我知道了',
              success(res) {
                if (res.confirm) {
                  console.log("用户点击了确定")
                }
              }
            })
          }
        })
      }
    }else{
      let msg=''
      if(that.data.code==''){
        msg='请输入验证码'
      }
      console.log(!/^1\d{10}$/.test(that.data.mobile) ,!/^\d{6,}$/.test(that.data.mobile))
      if(that.data.mobile==''||(!/^1\d{10}$/.test(that.data.mobile))){
         msg='请输入正确的手机号'
      }
      wx.showToast({
        title: msg,
        icon:'none',
        duration:1000
      })
    }
  },
  sendCode: function () {
    var that = this
    that.setData({
      isDisabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    })
    var phone = that.data.mobile;
    var currentTime = that.data.currentTime
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (phone == '') {
      warn = "号码不能为空";
    } else {
      if (phone.trim().length == 11 && /^1\d{10}$/.test(phone)){
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        //当手机号正确的时候提示用户短信验证码已经发送,并后台请求短信
        wx.request({

          url: app.globalData.apiUrl + 'app/auth/sendVerifycode', //仅为示例，并非真实的接口地址
          data: {
            mobile: that.data.mobile,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideLoading()
            //设置一分钟的倒计时
            var interval = setInterval(function () {
              currentTime--; //每执行一次让倒计时秒数减一
              that.setData({
                color: '#ccc',
                text: currentTime + 's', //按钮文字变成倒计时对应秒数
              })
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  text: '重新发送',
                  currentTime: 61,
                  isDisabled: false,
                  color: '#eeddbc',
                  isShowTime: false
                })
              }
            }, 1000);
            if (res.data.code == 200) {
              that.setData({
                isShowTime: true
              })
              wx.showToast({
                title: '验证码发送成功',
                icon: 'none',
                duration: 1000
              })
            } else {
              clearInterval(interval)
              that.setData({
                isDisabled: false,
                color: '#eeddbc'
              })
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                confirmText: '我知道了',
                success(res) {
                  if (res.confirm) {
                    console.log("用户点击了确定")
                  }
                }
              })
            }
          }
        })
      }else{
        warn = "不支持发送验证码";
      }
    }
    //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
    if (warn != null) {
      wx.showModal({
        title: '提示',
        content: warn
      })
      that.setData({
        isDisabled: false,
        color: '#ff4e79'
      })
      return;
    }
  },
  sureNickname: function (e) {
    const that = this
    if (that.data.mobile != '' && that.data.code != '') {
      this.setData({
        isLogin: true,
      })
    }else{
      this.setData({
        isLogin: false,
      })
    }
  },
  clearInfo: function (e) {
    this.setData({
      isLogin: false,
    })
   if (e.currentTarget.dataset.id == "mobile") {
        this.setData({
          mobile: '',
        })
    }
  },
  getMobile: function (e) {
    const that=this
    if (e.currentTarget.dataset.name == "mobile"){
      this.setData({
        mobile: e.detail.value.replace(/[^0-9\+\-\*\.]/g,''),
      })
    }else{
      this.setData({
        code: e.detail.value.replace(/ /g, '')
      })
    }
    var phone = e.detail.value
    this.sureNickname()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type=='change'){
      this.setData({
        type:options.type,
      })
      wx.setNavigationBarTitle({
        title: '绑定手机',
      })
    }else{
      this.setData({
        showNicname: true
      })
      wx.setNavigationBarTitle({
        title: '验证手机',
      })
    }
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