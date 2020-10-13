// pages/saleAfter/saleAfter.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    procomm: '',
    track_name: '',
    track_number: '',
    uploadimg: [],
    uploadOk: false,
    tempFilePaths: [],
    apiUrl: app.globalData.apiUrl,
    imgs: [],
    ischose: 'refunds',
    pid: '',
    order_Id: '',
    orderInfo: '',
    flag: 0,
    order_type: ''
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      procomm: e.detail.value
    })
  },
  saveTrackName: function(e) {
    this.setData({
      track_name: e.detail.value
    })
  },
  saveTrackNumber: function(e) {
    this.setData({
      track_number: e.detail.value
    })
  },
  choseType: function(e) {
    this.setData({
      ischose: e.currentTarget.id
    })
  },
  addImg: function() {
    var imgNum = 5;
    if (this.data.tempFilePaths.length > 0) {
      imgNum = 5 - this.data.tempFilePaths.length
    }
    var that = this
    var imgs = this.data.imgs;
    wx.chooseImage({
      count: imgNum, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.tempFilePaths = that.data.tempFilePaths.concat(res.tempFilePaths)
        that.setData({
          tempFilePaths: that.data.tempFilePaths
        })
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          if (imgs.length >= 5) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(res.tempFilePaths[i]);
          }
        }
        that.setData({
          imgs: imgs
        });
      }
    })
  },
  delImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs,
      uploadimg: imgs
    });
  },
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  getInfo: function() {
    var that = this
    util.queryRequest('?m=member&a=refund', {
      order_id: that.data.order_Id,
      product_id: that.data.pid
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          orderInfo: res.data,
          ischose: res.data.refund_info.type == undefined ? 'refunds' : res.data.refund_info.type,
          procomm: res.data.refund_info.content == undefined ? '' : res.data.refund_info.content,
          imgs: res.data.refund_info.img == undefined ? [] : res.data.refund_info.img,
          uploadimg: res.data.refund_info.img == undefined ? [] : res.data.refund_info.img,
          flag: res.data.flag,
          track_name: res.data.refund_info.express == undefined ? '' : res.data.refund_info.express,
          track_number: res.data.refund_info.express_no == undefined ? '' : res.data.refund_info.express_no
        })
      }
    })
  },
  saveAfter: function(e) {
    console.log(this.data.order_Id) //订单id
    console.log(e.currentTarget.id) //goods-id
    console.log(e.currentTarget.dataset.pid) //pid
    console.log(this.data.procomm) // 申请
    console.log(this.data.ischose) // 服务类型
    if (this.data.ischose == '') {
      wx.showToast({
        title: '请选择服务类型',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.flag == 2 && this.data.track_name == '' && this.data.ischose != 'refunds') {
      wx.showToast({
        title: '请填写快递公司',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.flag == 2 && this.data.track_number == '' && this.data.ischose != 'refunds') {
      wx.showToast({
        title: '请填写快递单号',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.procomm.length<=10) {
      wx.showToast({
        title: '售后理由必须大于10个字',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      var that = this
      if (that.data.tempFilePaths.length <= 0) {
        util.queryRequest('?m=member&a=do_refund', {
          order_id: this.data.order_Id,
          type: this.data.ischose,
          product_id: e.currentTarget.dataset.pid,
          content: this.data.procomm,
          express: this.data.track_name,
          express_no: this.data.track_number,
          file_path: that.data.imgs.join(',')
        }, 'POST', function(res) {
          if (res.isSuccess) {
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }.bind(that), 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        })
      } else {
        that.uploadimg({
          url: that.data.apiUrl + '?m=order&a=imgsave', //这里是你图片上传的接口
          path: that.data.tempFilePaths.slice(0, 5 - that.data.uploadimg.length), //这里是选取的图片的地址数组
          id: e.currentTarget.id,
          pid: e.currentTarget.dataset.pid
        })
      }
    }
  },
  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": wx.getStorageSync("cookie")
      },
      filePath: data.path[i],
      name: 'pic',
      success: (resp) => {
        if (JSON.parse(resp.data).isSuccess) {
          success++;
          that.data.uploadimg.push(JSON.parse(resp.data).data[0])
        }
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++;
        if (i == data.path.length) { //当图片传完时，停止调用  
          console.log('成功：' + success + " 失败：" + fail);
          that.setData({
            uploadOk: true
          })
          if (that.data.uploadOk) {
            util.queryRequest('?m=member&a=do_refund', {
              order_id: this.data.order_Id,
              type: this.data.ischose,
              product_id: data.pid,
              content: this.data.procomm,
              express: this.data.track_name,
              express_no: this.data.track_number,
              file_path: that.data.uploadimg.join(',')
            }, 'POST', function(res) {
              if (res.isSuccess) {
                wx.hideLoading()
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }.bind(that), 1000)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            })
          }
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: options.pid,
      order_Id: options.orderId,
      order_type: options.order_type
    })
    this.getInfo()
    wx.setNavigationBarTitle({
      title: '申请售后服务'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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