// pages/realName/realName.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    apiUrl: app.globalData.apiUrl,
    filePath: app.globalData.fileUrl,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    userInfo: {
      name: '',
      id_card: '',
    },
    frontImage:'',
    backImage:'',
    is_iphonex: app.globalData.isiPhoneX,
  },
  realInput(e) {
    if(e.currentTarget.id=='name'){
      this.data.userInfo.name=e.detail.value.trim()
    }else{
      this.data.userInfo.id_card=e.detail.value.trim()
    }
    this.setData({
      userInfo:this.data.userInfo
    })
  },
  realSubmit: util.throttle(function (e){
    // 实名认证提交
    console.log(" tijiao")
    const that=this
    let msg=''
    let flag=true
    if(that.data.frontImage==''){
      msg='请上传身份证正面照'
      flag=false
    }
    if(that.data.backImage==''){
      msg='请上传身份证反面照'
      flag=false
    }
    if(that.data.userInfo.id_card==''){
      msg='请输入身份证号'
      flag=false
    }
    if(that.data.userInfo.name==''){
      msg='请输入姓名'
      flag=false
    }
    if(that.data.userInfo.id_card!=''&&!/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(that.data.userInfo.id_card)){
      msg='身份证号输入不正确'
      flag=false
    }
    console.log(flag)
    if(flag){
      let obj={
        name:that.data.userInfo.name,
        id_card:that.data.userInfo.id_card,
        id_card_pic_a:that.data.frontImage,
        id_card_pic_b:that.data.backImage
      }
      wx.showLoading({
        title: '提交中...',
      })
      util.queryRequest('/app/personalCenter/certification',obj, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(()=>{
            util.queryRequest('/app/userInfo/get', {}, 'GET').then(function (res) {
              if (res.code === 200 || res.code === '200') {
                wx.setStorageSync("userInfo", res.data)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
                console.log(res.msg)
              }
            })
            wx.navigateBack({
              delta:1
            })
          },1000)
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1000
      })
    }
  },500),
  upImg:util.throttle(function (e){
    const that = this
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) { //0是相册
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (req) {
              //res.tempFilePaths[0] 这个是图片
              wx.uploadFile({
                url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
                filePath: req.tempFilePaths[0],
                name: 'image',
                formData: {
                  "token": wx.getStorageSync("token")
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                success(res) {
                  const data = JSON.parse(res.data)
                  console.log(data,"图片")
                  console.log(e[0].currentTarget.dataset.type,"图片")
                  if(e[0].currentTarget.dataset.type=='front'){
                     that.setData({
                      frontImage:data.data.path_name
                     })
                  }else{
                    that.setData({
                      backImage:data.data.path_name
                     })
                  }
                  console.log(that.data.frontImage)
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1000
                  })
                },
                fail(res) {
                   console.log(res,'上传失败')
                }
              })
            },
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: function (req) {
              wx.uploadFile({
                url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
                filePath: req.tempFilePaths[0],
                name: 'iamge',
                formData: {
                  "token": wx.getStorageSync("token")
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                success(res) {
                  const data = JSON.parse(res.data)
                  if(e[0].currentTarget.dataset.type=='front'){
                     that.setData({
                      frontImage:data.data.path_name
                     })
                  }else{
                    that.setData({
                      backImage:data.data.path_name
                     })
                  }
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1000
                  })
                },
                fail(res) {
                   console.log(res,'上传失败')
                }
              })
            },
          })
        }
      }
    })
  },500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '实名认证',
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