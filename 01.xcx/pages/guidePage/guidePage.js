// pages/guidePage/guidePage.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    showImg: '',
    time: null
  },
  goIndex: function() {
    clearInterval(this.data.time);
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.img!=undefined){
      this.setData({
        isShow: true,
        showImg: options.img,
      })
    }else{
      // 不符合条件且如果引导页没有
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.showImg != '') {
      const that = this
      // 顶层圆环
      var ctx = wx.createCanvasContext('firstCanvas');
      const version = wx.getSystemInfoSync().SDKVersion
      if (util.compareVersion(version, '1.9.90') >= 0) {
        ctx.strokeStyle = '#e0e0e0'; // 设置圆环的颜色 
        ctx.beginPath(); //开始一个新的路径  
        ctx.lineWidth = 2; // 设置圆环的宽度  
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        // wx.showModal({
        //   title: '提示',
        //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        // })
        ctx.setStrokeStyle('#e0e0e0'); // 设置圆环的颜色 
        ctx.beginPath(); //开始一个新的路径  
        ctx.setLineWidth(2); // 设置圆环的宽度
      }
      ctx.arc(20, 20, 10, 1.5 * Math.PI, -0.5 * Math.PI, true);   //设置一个原点(100,100)，半径为90的圆的路径到当前路径 
      ctx.stroke(); //对当前路径进行描边  
      ctx.closePath(); //开始一个新的路径   
      ctx.draw();

      // 倒计时圆环
      var step = 1, //计数动画次数
        num = 0, //计数倒计时秒数（n - num）
        start = 1.5 * Math.PI, // 开始的弧度
        end = -0.5 * Math.PI; // 结束的弧度
      this.data.time = null // 计时器容器

      var animation_interval = 1000, // 每1秒运行一次计时器
        n = 3; // 当前倒计时为3秒
      // 动画函数
      function animation() {
        console.log(step)
        console.log(n)
        if (step <= n) {
          end = end + 2 * Math.PI / n;
          ringMove(start, end);
          step++;
        } else {
          clearInterval(that.data.time);
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      };
      // 画布绘画函数
      function ringMove(s, e) {
        var context = wx.createCanvasContext('secondCanvas')
        if (util.compareVersion(version, '1.9.90') >= 0) {
          // 绘制圆环
          context.strokeStyle = '#000'
          context.beginPath()
          context.lineWidth = 2
          context.arc(20, 20, 10, s, e, true)
          context.stroke()
          context.closePath()

          // 绘制倒计时文本
          context.beginPath()
          context.lineWidth = 2
          context.font = '12px sans-serif'
          context.fillStyle = '#000'
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          // wx.showModal({
          //   title: '提示',
          //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          // })
          // 绘制圆环
          context.setStrokeStyle('#000');
          context.beginPath()
          context.setLineWidth(2);
          context.arc(20, 20, 10, s, e, true)
          context.stroke()
          context.closePath()
          // 绘制倒计时文本
          context.beginPath()
          context.setLineWidth(2);
          context.setFontSize(12)
          context.setFfillStyle('#000')
        }
        context.setTextAlign('center')
        context.setTextBaseline('middle')
        context.fillText(n - num + '', 20, 20, 10)
        context.fill()
        context.closePath()
        context.draw()

        // 每完成一次全程绘制就+1
        num++;
      }
      // 倒计时前先绘制整圆的圆环
      ringMove(start, end);
      // 创建倒计时
      if(this.data.time==null){
        this.data.time = setInterval(animation, animation_interval);
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('引导页被访问')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log(this.data.time)
    clearInterval(this.data.time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.time);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})