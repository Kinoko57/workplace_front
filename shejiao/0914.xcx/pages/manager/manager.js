// pages/manager/manager.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    line_bg_color:'linear-gradient(86deg,rgba(70,70,70,1) 0%,rgba(47,47,47,1) 100%)',
    line_bg_color1:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    staticUrl: app.globalData.staticUrl,
    showSkeleton:true,
    manager:{}
  },
  //复制成功
  copyCode: function (e) {
    console.log(e)
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  getInfo(){
    const that=this
     util.queryRequest('/app/userInfo/getTeam', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          manager: res.data,
          showSkeleton:false
        })
      }
     })
  },
  saveImg(){
    wx.downloadFile({
      url:'http://upload.jianshu.io/admin_banners/web_images/4435/c1d3ca63353c8bd527f0d781605516cb5b266d02.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540',
      success: function (res) {
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              });
            },
            fail(res) {
              wx.showToast({
                title: '保存失败',
                icon: 'noe',
                duration: 2000
              });
            }
          });
        }
      }
    });
    // wx.downloadFile({
    //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585042754773&di=deda3a2fd45d151790b1f6ec68a5d822&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2F5d6034a85edf8db1aca565710223dd54564e741f.jpg', //仅为示例，并非真实的资源
    //   success(res) {
    //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //     if (res.statusCode === 200) {
    //       console.log(res,"值")
    //       wx.saveFile({
    //         tempFilePath: res.tempFilePath,
    //         success(res) {
    //           const savedFilePath = res.savedFilePath
    //           wx.showToast({
    //             title: '保存成功',
    //             icon: 'success',
    //             duration: 1000
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
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