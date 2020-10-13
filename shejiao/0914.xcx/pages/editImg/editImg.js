// pages/editImg/editImg.js
var app = getApp()
let util = require('../../utils/util.js')
let time = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: null, // 裁剪图片地址
    visible: false, // 是否显示
    size: { //裁剪尺寸
      width: 375,
      height: 375
    },
    cropSizePercent: 0.9, //裁剪框显示比例
    borderColor: '#fff', //裁剪框边框颜色
    result: '', //裁剪结果地址
    //以上是裁剪组件的引入字段
    staticUrl: app.globalData.staticUrl,
    height: getApp().globalData.windowHeight,
    filePath: app.globalData.fileUrl,
    image: '',
    code: '',
    codeName: '',
    apiUrl: app.globalData.apiUrl,
  },
  //选取裁剪图片
  chooseCropImage: function () {
    let self = this;
    wx.chooseImage({
      sizeType: ["compressed"], // ios 选择原图容易 crash
      success(res) {
        self.setData({
          visible: true,
          src: res.tempFilePaths[0],
        })
        
      }
    });
  },
  //选取裁剪图片成功回调
  uploadCallback: function (event) {
    console.log(event);
  },

  //裁剪图片回调
  cropCallback: function (event) {
    console.log(event);
    let that = this
    // 将裁剪后的图片路径传给后台 event.detail.resultSrc
    wx.uploadFile({
      url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
      filePath: event.detail.resultSrc,
      name: 'image',
      formData: {
        "token": wx.getStorageSync("token")
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success(res) {
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000
        })
        const data = JSON.parse(res.data)
        console.log(data,"res.data")
        let url = '/app/userInfo/edit'
        var obj = {}
        var key = that.data.editcode;
        obj[key] = data.data.path_name
        console.log(obj)
        console.log(that.data.image, that.data.apiUrl, data.data.path_name)
        util.queryRequest(url, obj, 'POST').then(function (res) {
          if (res.code === 200 || res.code === '200') {
            console.log("保存成功")
            that.setData({
              visible: false,
              result: event.detail.resultSrc,
            });
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
            wx.navigateBack({
              delta: 1
            })
            console.log(res.msg)
          }
        })
        time = setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)
      }
    })
  },

  //关闭回调
  closeCallback: function (event) {
    console.log(event);
    this.setData({
      visible: false,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.height)
    this.setData({
      image: options.value,
      editcode: options.code,
      codeName: options.codename
    })
    wx.setNavigationBarTitle({
      title:'修改'+this.data.codeName,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e13816',
    })
    console.log(options, this.data.image)
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
    clearTimeout(time)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(time)
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