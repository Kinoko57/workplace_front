// pages/myCollection/myCollection.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNews: false,
    total_amout: 0,
    isShow: false,
    hiddenlogin: app.globalData.hiddenlogin,
    apiUrl: app.globalData.apiUrl,
    // navNtn: 4,
    page: 1,
    limit: 8,
    total: 0,
    collList: [],
    allchose: 0,
    isEdit: false,
    is_iphonex: app.globalData.phoneType,
    can_chose_pro:true
  },
  goPro: function(e) {
    const that = this
    if (that.data.can_chose_pro){
      that.data.can_chose_pro = false
      if (e.currentTarget.dataset.type == '9') {
        wx.navigateTo({
          url: '../fruitDetail/fruitDetail?type=fruits&id=' + e.currentTarget.id
        })
      } else {
        if (e.currentTarget.id != '') {
          util.queryRequest('?m=item', {
            id: e.currentTarget.id
          }, 'GET', function (res) {
            if (res.isSuccess == false) {
              that.data.can_chose_pro = true
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              // belong商品所属类型 1积分兑换 2限时促销 3VIP 4生日特权 5试用装 6拼团 7活动抽奖 8扫码抽奖 9水果专区 10扫码试用商品
              wx.navigateTo({
                url: e.currentTarget.dataset.link
              })
            }
          })
        }
      }
    }
  },
  edit: function() {
    for (var j = 0; j < this.data.collList.length; j++) {
      this.data.collList[j].checked = false
    }
    this.setData({
      isEdit: !this.data.isEdit,
      collList: this.data.collList
    })
  },
  delColl: function() {
    var that = this
    var delList = [];
    for (var j = 0; j < this.data.collList.length; j++) {
      if (this.data.collList[j].checked == true) {
        delList.push(this.data.collList[j].id)
      }
    }
    if (delList.length == 0) {
      wx.showToast({
        title: '请选择要操作的数据',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除选中内容',
        success: function(res) {
          if (res.confirm) {
            util.queryRequest('?m=member&a=remove_collect', {
              id: delList
            }, 'POST', function(res) {
              if (res.isSuccess == true) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function() {
                  that.setData({
                    page: 1
                  })
                  that.getList()
                }, 1000)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  choseColl: function(e) {
    console.log(e.detail.value)
    for (var j = 0; j < this.data.collList.length; j++) {
      this.data.collList[j].checked = false
    }
    if (e.detail.value.length !== 0) {
      for (var i = 0; i < e.detail.value.length; i++) {
        for (var j = 0; j < this.data.collList.length; j++) {
          if (e.detail.value[i] == this.data.collList[j].id) {
            this.data.collList[j].checked = true
          }
        }
      }
      this.setData({
        collList: this.data.collList
      })
      console.log(this.data.collList)
    }
    for (var k = 0; k < this.data.collList.length; k++) {
      if (this.data.collList[k].checked == false) {
        this.data.allchose = 0
        break;
      }
    }
    if (k >= this.data.collList.length) {
      this.data.allchose = 1
    }
    this.setData({
      allchose: this.data.allchose
    })

  },
  checkAll: function() {
    if (this.data.allchose == 0) {
      for (var j = 0; j < this.data.collList.length; j++) {
        this.data.collList[j].checked = true
      }
      this.setData({
        allchose: 1
      })
    } else {
      for (var j = 0; j < this.data.collList.length; j++) {
        this.data.collList[j].checked = false
      }
      this.setData({
        allchose: 0
      })
    }
    this.setData({
      collList: this.data.collList
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=member&a=get_mycollect', {
      page: that.data.page,
      limit: that.data.limit
    }, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {

        for (var j = 0; j < res.data.rows.length; j++) {
          res.data.rows[j].checked = false
        }
        that.setData({
          collList: res.data.rows,
          total: res.data.total
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
    // wx.hideLoading()
    wx.setNavigationBarTitle({
      title: '我的收藏'
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
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum
    })
    this.data.can_chose_pro = true
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
    // var that = this
    // that.setData({
    //   page: 1
    // })
    // that.getList()
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    util.queryRequest('?m=member&a=get_mycollect', {
      page: ++that.data.page,
      limit: that.data.limit
    }, 'GET', function(res) {
      if (res.isSuccess == true) {
        for (var j = 0; j < res.data.rows.length; j++) {
          res.data.rows[j].checked = false
        }
        that.data.collList = that.data.collList.concat(res.data.rows)
        that.setData({
          collList: that.data.collList
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})