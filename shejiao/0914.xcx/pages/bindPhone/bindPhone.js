// pages/bindPhone/bindPhone.js
let util = require('../../utils/util.js')
var interval
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    mobile: '',//手机号
    code: '',//验证码
    mobile_bind: '',//绑定手机号
    code_bind: '',//绑定的验证码
    bind_text_value:'下一步',
    bind_text:false,//是否完成旧手机的验证,验证完 变为 true
    isChange:false,
    phoneText:'绑定手机号',
    type:'regist',
    text: '获取验证码',
    currentTime: 61,
    isDisabled: false,
    isShowTime: false,
    visit:'0',
    okButton:true,
  },
  goRegister(){
    const that=this
    console.log(that.data.mobile, that.data.code)
    if (that.data.mobile != '' && that.data.code != '' && (/^1\d{10}$/.test(that.data.mobile) || (/^\d{4,}$/.test(that.data.mobile)))){
      if (that.data.okButton){
        wx.showLoading({
          title: '验证中...',
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
            console.log(res.code)
            wx.request({
              url: app.globalData.apiUrl +'/app/user/register', //仅为示例，并非真实的接口地址
              data: {
                wx_code: res.code,
                tel: that.data.mobile,
                verification: that.data.code,
                username: userfirstInfo.nickName,
                image: userfirstInfo.avatarUrl,
                sex: userfirstInfo.gender,
                open_type:1
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res) {
                that.setData({
                  okButton: true
                })
                  wx.hideLoading()
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '验证成功',
                    icon: 'success',
                    duration: 1000
                  })
                  wx.setStorageSync("token", res.data.data.access_token)
                  wx.setStorageSync("is_token", 1)
                  wx.setStorageSync("userfirstInfo", '')
                  wx.setStorageSync('im_account', res.data.data.anchor_user)
                  util.queryRequest('/app/userInfo/get', {}, 'GET').then(function (res) {
                    if (res.code === 200 || res.code === '200') {
                      wx.setStorageSync("userInfo", res.data)
                      // util.loginIMRoom()
                      if(app.globalData.authorUrl.indexOf('bindPhone')!=-1){
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }else{
                        wx.reLaunch({
                          url: app.globalData.authorUrl
                        })
                      }
                    } else {
                      wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 3000
                      })
                      console.log(res.msg)
                    }
                  })
                  that.setData({
                    okButton: true
                  })
                }else{
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
    }
  },
  sendCode: function () {
    var that = this
    that.setData({
      isDisabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
    })
    if(that.data.type=='bind'){
      var phone = that.data.mobile_bind;
    }else{
      var phone = that.data.mobile;
    }
    var currentTime = that.data.currentTime
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (phone == '') {
      warn = "手机号不能为空";
    } else {
      if (phone.trim().length == 11 && /^1\d{10}$/.test(phone)){
        wx.showLoading({
          title: '发送中',
          mask: true
        })
        //当手机号正确的时候提示用户短信验证码已经发送,并后台请求短信
        wx.request({
          url: app.globalData.apiUrl + '/app/verify/index', //仅为示例，并非真实的接口地址
          data: {
            mobile: phone,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideLoading()
            //设置一分钟的倒计时
            console.log(res.data)
            if (res.data.code == 200) {
              that.setData({
                isShowTime: true
              })
              wx.showToast({
                title: '验证码发送成功',
                icon: 'none',
                duration: 1000
              })
              interval = setInterval(function () {
                currentTime--; //每执行一次让倒计时秒数减一
                that.setData({
                  text: currentTime + 's', //按钮文字变成倒计时对应秒数
                })
                if (currentTime <= 0) {
                  clearInterval(interval)
                  that.setData({
                    text: '重新发送',
                    currentTime: 61,
                    isDisabled: false,
                    isShowTime: false
                  })
                }
              }, 1000);
            }else{
              wx.showToast({
                title:res.data.msg,
                icon: 'none',
                duration: 1000
              })
              that.setData({
                text: '重新发送',
                currentTime: 61,
                isDisabled: false,
                isShowTime: false
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
      wx.showToast({
        title:warn,
        icon: 'none',
        duration: 1000
      })
      that.setData({
        isDisabled: false,
      })
      return;
    }
  },
  // 绑定手机号、发送验证码
  sendCodeMsg(){
    const that=this
    wx.showLoading({
      title: '发送中',
      mask: true
    })
    that.setData({
      isDisabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
    })
    var currentTime = that.data.currentTime
    util.queryRequest('/app/userInfo/verifyMobile', {
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        wx.hideLoading()
        that.setData({
          isShowTime: true
        })
        wx.showToast({
          title: '验证码发送成功',
          icon: 'none',
          duration: 1000
        })
        //设置一分钟的倒计时
        interval = setInterval(function () {
          currentTime--; //每执行一次让倒计时秒数减一
          that.setData({
            text: currentTime + 's', //按钮文字变成倒计时对应秒数
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              text: '重新发送',
              currentTime: 61,
              isDisabled: false,
              isShowTime: false
            })
          }
        }, 1000);
      } else {
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          text: '重新发送',
          currentTime: 61,
          isDisabled: false,
          isShowTime: false
        })
      }
    })
  },
  // 绑定手机号
  goBind:util.throttle(function (e){
    const that=this
     if(that.data.bind_text==false){
       if(that.data.code==''){
        wx.showToast({
          title:'验证码不能为空',
          icon: 'none',
          duration: 1000
        })
       }else{
         wx.showLoading({
           title: '验证中...',
         })
         //当手机号正确的时候提示用户短信验证码已经发送,并后台请求短信
         util.queryRequest('/app/userInfo/verifyCheck', {
           code:that.data.code
         }, 'POST').then(function (res) {
           if (res.code == 200) {
             wx.hideLoading()
             wx.showToast({
               title:'验证成功',
               icon: 'success',
               duration: 1000
             })
             clearInterval(interval)
             that.setData({
               bind_text:true,
               text: '获取验证码',
               currentTime: 61,
               isDisabled: false,
               isShowTime: false,
               bind_text_value:'完成'
             })
           } else {
             wx.showToast({
               title:res.msg,
               icon: 'none',
               duration: 1000
             })
           }
         })
       }
     }else{
      let flag=true
      let msg=''
      if(that.data.code_bind==''){
        msg='验证码不能为空'
        flag=false
      }
      if(that.data.mobile_bind==''){
        msg='手机号不能为空'
        flag=false
      }
      if(that.data.mobile_bind!=''&&!/^1\d{10}$/.test(that.data.mobile_bind)){
        msg='手机号输入不正确'
        flag=false
      }
      if(flag){
        util.queryRequest('/app/userInfo/newMobileCheck', {
          mobile: that.data.mobile_bind,
          last_code: that.data.code,
          new_code:that.data.code_bind,
        }, 'POST').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '绑定成功',
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
          } else {
            that.setData({
              okButton: true
            })
            wx.showToast({
              title:res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }else{
        wx.showToast({
          title:msg,
          icon: 'none',
          duration: 1000
        })
      }
     }
  },500),
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
  },
  // 绑定新的手机号
  getNewMobile(e){
    if (e.currentTarget.dataset.name == "mobile"){
      this.setData({
        mobile_bind: e.detail.value.replace(/[^0-9\+\-\*\.]/g,''),
      })
    }else{
      this.setData({
        code_bind: e.detail.value.replace(/ /g, '')
      })
    }
  },
  changePhone: function () {
    const that = this
    if (that.data.mobile != '' && that.data.code != '' && (/^1\d{10}$/.test(that.data.mobile) || (/^\d{6,}$/.test(that.data.mobile)))) {
      if (that.data.okButton) {
        that.setData({
          okButton: false
        })
        util.queryRequest('/app/userInfo/editTel', {
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
          } else {
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const that=this
    if(options!=undefined){
      this.setData({
        type:options.type
      })
      if(options.type=='change'){
        this.setData({
          phoneText:'修改手机号'
        })
      }
      if(options.type=='bind'){
        this.setData({
          mobile:options.phone
        })
      }
      console.log(this.data.mobile)
    }
    wx.setNavigationBarTitle({
      title:that.data.phoneText,
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
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
  onShareAppMessage: function () {

  }
})