// pages/addComment/addComment.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    morePro: false,
    proNum: 1,
    wNum: 0,
    pNum: 5,
    fNum: 0,
    orderInfo: [],
    orderId: '',
    apiUrl: app.globalData.apiUrl,
    proInfo: {},
    procomm: '',
    tempFilePaths: [],
    imgs: [],
    allComm: 0,
    imgList: [],
    uploadimg: [],
    uploadOk: false
  },
  choseStar: function(e) {
    if (e.currentTarget.dataset.type == 'w') {
      this.setData({
        wNum: Number(e.currentTarget.id) + 1
      })
    }
    if (e.currentTarget.dataset.type == 'p') {
      this.setData({
        pNum: Number(e.currentTarget.id) + 1
      })
    }
    if (e.currentTarget.dataset.type == 'f') {
      this.setData({
        fNum: Number(e.currentTarget.id) + 1
      })
    }
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      procomm: e.detail.value
    })
  },
  getOrder: function() {
    var that = this
    util.queryRequest('?m=member&a=getOrders', {
      id: 0,
      order_id: that.data.orderId
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.rows != null) {
          if (that.data.proNum > 1) {
            that.setData({
              allComm: res.rows[0].iscomment,
              orderInfo: res.rows[0].order_items
            })
          } else {
            that.setData({
              allComm: res.rows[0].iscomment,
              proInfo: res.rows[0].order_items[0]
            })
          }
        }
      }
    })
  },
  addComm: function(e) {
    for (var i = 0, len = this.data.orderInfo.length; i < len; i++) {
      if (e.currentTarget.id == this.data.orderInfo[i].product_id) {
        this.setData({
          proInfo: this.data.orderInfo[i]
        })
      }
    }
    this.setData({
      morePro: false
    })

  },
  addImg: function() {
    console.log(this.data.tempFilePaths.length)
    var imgNum = 9;
    if (this.data.tempFilePaths.length > 0) {
      imgNum = 9 - this.data.tempFilePaths.length
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
        for (var i = 0, len = res.tempFilePaths.length; i < len; i++) {
          if (imgs.length >= 9) {
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
      imgs: imgs
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
  saveCom: function(e) {
    console.log(this.data.orderId) //订单id
    console.log(e.currentTarget.id) //goods-id
    console.log(e.currentTarget.dataset.pid) //pid
    console.log(this.data.procomm) //评价
    console.log(this.data.pNum) //商品
    console.log(this.data.wNum) //物流
    console.log(this.data.fNum) //服务
    if (this.data.pNum == 0 || this.data.wNum == 0 || this.data.fNum == 0) {
      wx.showToast({
        title: '请对商品进行评分',
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
        util.queryRequest('?m=order&a=goods_comment_save', {
          order_id: this.data.orderId,
          goods_id: e.currentTarget.id,
          product_id: e.currentTarget.dataset.pid,
          score: this.data.pNum,
          server_score: this.data.wNum,
          express_score: this.data.fNum,
          goods_comment: this.data.procomm
        }, 'POST', function(res) {
          if (res.isSuccess) {
            wx.hideLoading()
            // 提交成功的提示
            wx.showToast({
              title: '感谢您的评价，评价已提交',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            setTimeout(function() {
              if (that.data.allComm == '0') {
                if (that.data.proNum > 1) {
                  that.setData({
                    morePro: !that.data.morePro,
                    tempFilePaths: [],
                    imgs: [],
                    wNum: 0,
                    pNum: 5,
                    fNum: 0,
                    uploadimg:[]
                  })
                  that.getOrder()
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
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
          path: that.data.tempFilePaths.slice(0, 9), //这里是选取的图片的地址数组，只选取前九张
          id: e.currentTarget.id,
          pid: e.currentTarget.dataset.pid
        })
      }
    }
  },
  uploadimg: function(data) { 
    console.log(data.path)
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
        console.log(i);   
        i++;  
        if (i == data.path.length) { //当图片传完时，停止调用  
          console.log('成功：' + success + " 失败：" + fail);  
          that.setData({
            uploadOk: true
          })
          if (that.data.uploadOk) {
            util.queryRequest('?m=order&a=goods_comment_save', {
              order_id: this.data.orderId,
              goods_id: data.id,
              product_id: data.pid,
              score: this.data.pNum,
              server_score: this.data.wNum,
              express_score: this.data.fNum,
              goods_comment: this.data.procomm,
              file_path: that.data.uploadimg.join(',')
            }, 'POST', function(res) {
              if (res.isSuccess) {
                wx.hideLoading()
                wx.showToast({
                  title: '评价成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
                setTimeout(function() {
                  if (that.data.allComm == '0') {
                    if (that.data.proNum > 1) {
                      that.setData({
                        morePro: !that.data.morePro,
                        tempFilePaths: [],
                        imgs: [],
                        pNum: 5,
                        wNum: 0,
                        fNum: 0,
                        uploadimg:[]
                      })
                      that.getOrder()
                    } else {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  } else {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
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
    console.log(options)
    this.setData({
      proNum: options.num,
      orderId: options.orderId
    })
    this.getOrder()
    if (options.num > 1) {
      wx.setNavigationBarTitle({
        title: '评价晒单'
      })
      this.setData({
        morePro: true
      })
    } else {
      wx.setNavigationBarTitle({
        title: '提交评价'
      })
      this.setData({
        morePro: false
      })
    }

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