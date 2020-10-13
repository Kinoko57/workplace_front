// pages/viewImage/viewImage.js
var app = getApp()
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    time: '',
    barrack: '',
    imgUrl: '../../image/my/notice.jpg',
    screenWidth: getApp().globalData.useWindowwidth,
    screenHeight: getApp().globalData.useWindowHeight,
    canvasW: 0,
    canvasH: 0,
    top: 0,
  },
  drawImg: function () {
    console.log("执行一下")
    let that = this
    console.log(that.data.imgUrl)
    wx.getImageInfo({
      src: that.data.imgUrl,
      success(res) {
        console.log(that.data.name)
        console.log(that.data.time)
        console.log(that.data.barrack)
        console.log(res.width)
        console.log(res.height)
        let imgWidth = res.width
        let imgHeight = res.height
        console.log('屏幕宽度' + that.data.screenWidth)
        let canvasW = that.data.screenWidth //定义画布宽高，具体根据海报模板定义
        let canvasH = that.data.screenWidth / imgWidth * imgHeight
        let top = (that.data.screenHeight - canvasH) / 3
        that.setData({
          canvasW: canvasW,
          canvasH: canvasH,
          top: top
        })
        // 距离顶部的高度
        console.log(top)
        let size = that.data.screenWidth / imgWidth
        // let unit = that.data.screenWidth / 375
        // console.log(unit)
        console.log(that.data.screenWidth, "this.data.screenWidth")
        console.log('宽度' + canvasW)
        console.log('高度' + canvasH)
        var ctx = wx.createCanvasContext('share')
        console.log(ctx)
        ctx.clearRect(0, 0, canvasW, canvasH) // 清空画布
        ctx.setFillStyle('#ffffff') //设置填充色
        ctx.fillRect(0, 0, canvasW, canvasH) //填充画布
        // 绘制背景图
        ctx.drawImage(that.data.imgUrl, 0, 0, canvasW, canvasH);
        // 绘制昵称 左84，上234
        ctx.setFontSize(6);
        ctx.setFillStyle("#0c3d15")
        ctx.fillText(that.data.name, 84 * size, 230.5 * size)
        // 加粗
        ctx.fillText(that.data.name, 84.5 * size, 230 * size)
        // 绘制营种 左600，高260
        ctx.setFontSize(6);
        ctx.setFillStyle("#0c3d15")
        ctx.fillText(that.data.barrack, 600 * size, 256.5 * size)
        // 加粗
        ctx.fillText(that.data.barrack, 600.5 * size, 256 * size)
        // 年月日 高335  宽 年 225 月 280 日 315
        let year = util.formatDate(that.data.time).split('-')[0]
        let month = util.formatDate(that.data.time).split('-')[1]
        let day = util.formatDate(that.data.time).split('-')[2]
        console.log(year, month, day)
        ctx.setFontSize(6);
        ctx.setFillStyle("#0c3d15")
        ctx.fillText(year, 225 * size, 335.5 * size)
        // 加粗
        ctx.fillText(year, 225.5 * size, 335 * size)

        ctx.fillText(month, 280 * size, 335.5 * size)
        // 加粗
        ctx.fillText(month, 280.5 * size, 335 * size)

        ctx.fillText(day, 315 * size, 335.5 * size)
        // 加粗
        ctx.fillText(day, 315.5 * size, 335 * size)
        ctx.save()
        ctx.draw()
      }
    })
  },
  authSave: util.throttle(function (e) {
    console.log(e[0])
    let that = this
    wx.getSetting({
      success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                        that.saveImages()
                    },
                    fail() {
                        wx.showToast({
                            title: '保存失败',
                            icon: "none"
                            })
                         }
                    })
                } else {
                that.saveImages()
                }
          }
    })
  }),
  saveImages: function(e){
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon: 'none'
            })
          }, complete: function () {
            wx.hideLoading()
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    console.log(options.time)
    console.log(options.barrack)
    this.setData({
      name: options.name,
      time: options.time,
      barrack: options.barrack
    })
    // this.setData({
    //   name: '而非为',
    //   time: 1592582400,
    //   barrack: '特种兵进阶训练营',
    // })
    wx.setNavigationBarTitle({
      title: '入伍通知书'
    })
    this.drawImg()
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