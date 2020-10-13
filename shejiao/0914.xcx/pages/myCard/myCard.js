// pages/myCard/myCard.js
let util = require('../../utils/util.js')
var app = getApp();
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
    // 以上是剪裁地址片段
    staticUrl: app.globalData.staticUrl,
    cardInfo:{
      wx_team_name:'',
      wx_team_image:app.globalData.staticUrl + 'common/avatar.png',
      wx_number:'',
      code_image:'',
    },
    apiUrl: app.globalData.apiUrl,
    filePath: app.globalData.fileUrl,
  },
  edit:util.throttle(function (e) {
    wx.navigateTo({
      url: e[0].currentTarget.dataset.url
    })
  }),
    // 上传图片
  changeImage(e){
    const that=this
    if (that.data.cardInfo.code_image==''){
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
     }else{
        wx.navigateTo({
          url: e.currentTarget.dataset.url
        })
     }
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
        const data = JSON.parse(res.data)
        console.log(res,"值")
        util.queryRequest('/app/userInfo/edit',{code_image: data.data.path_name}, 'POST').then(function (res) {
          if (res.code === 200 || res.code === '200') {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              that.setData({
                visible: false,
              })
              that.getCardInfo()
             }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
            console.log(res.msg)
          }
        })
        
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
  getCardInfo(){
    const that=this
    util.queryRequest('/app/userInfo/myStyle', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          cardInfo: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getCardInfo()
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