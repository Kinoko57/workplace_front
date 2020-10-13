// pages/news/news.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newList: [],
    isEdit: false,
    page: 1,
    pagesize: 20,
    total: 0,
    newDetail: {},
    newShow: false,
    choseId: '',
    choseType: 2,
    allchose: 0,
    delList: []

  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  chose: function(e) {
    for (var j = 0; j < this.data.newList.length; j++) {
      this.data.newList[j].checked = false
    }
    this.data.delList = []
    this.setData({
      delList: e.detail.value
    })
    if (e.detail.value.length !== 0) {
      for (var i = 0; i < e.detail.value.length; i++) {
        for (var j = 0; j < this.data.newList.length; j++) {
          if (e.detail.value[i] == this.data.newList[j].id) {
            this.data.newList[j].checked = true
          }
        }
      }
      this.setData({
        newList: this.data.newList
      })
    }
    for (var k = 0; k < this.data.newList.length; k++) {
      if (this.data.newList[k].checked == false) {
        this.data.allchose = 0
        break;
      }
    }
    if (k >= this.data.newList.length) {
      this.data.allchose = 1
    }
    this.setData({
      allchose: this.data.allchose
    })
  },
  checkAll: function() {
    this.data.delList = []
    if (this.data.allchose == 0) {
      for (var j = 0; j < this.data.newList.length; j++) {
        this.data.newList[j].checked = true
        this.data.delList.push(this.data.newList[j].id)
      }
      this.setData({
        allchose: 1
      })
    } else {
      for (var j = 0; j < this.data.newList.length; j++) {
        this.data.newList[j].checked = false
      }
      this.data.delList = []

      this.setData({
        allchose: 0
      })
    }
    this.setData({
      newList: this.data.newList,
      delList: this.data.delList
    })
    console.log(this.data.newList)
    console.log(this.data.delList)
  },
  delNews: function() {
    var that = this
    if (that.data.delList.length <= 0) {
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
            console.log(that.data.delList)
            util.queryRequest('?m=myinfo&a=messages_remove', {
              ids: that.data.delList
            }, 'POST', function(res) {
              if (res.isSuccess) {
                console.log(res)
                wx.showToast({
                  title: res.msg,
                  icon: 'success',
                  duration: 1000
                })
                that.setData({
                  page: 1,
                  allchose: 0,
                })
                that.getList()
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }

  },
  edit: function() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  choseNews: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      choseType: e.currentTarget.id,
      page: 1,
      allchose: 0
    })
    this.getList()
  },
  viewNews: function(e) {
    console.log(e)
    var that = this
    if (e.currentTarget.dataset.status == 0) {
      util.queryRequest('?m=myinfo&a=reading_message', {
        id: e.currentTarget.id
      }, 'POST', function(res) {
        if (res.isSuccess) {
          for (var i = 0; i < that.data.newList.length; i++) {
            if (that.data.newList[i].id == e.currentTarget.id) {
              that.data.newList[i].status_read = 1
            }
          }
          that.setData({
            newList: that.data.newList
          })
        }
      })
    }
    if (e.currentTarget.id == this.data.choseId) {
      this.setData({
        newShow: !this.data.newShow
      })
    } else {
      this.setData({
        newShow: true,
        choseId: e.currentTarget.id
      })
    }
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=myinfo&a=get_messages', {
      type: that.data.choseType,
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess == true) {
        that.setData({
          newList: res.data.rows,
          total: res.data.total
        })
        for (var i = 0; i < that.data.newList.length; i++) {
          that.data.newList[i].createtime = util.formatTime(that.data.newList[i].createtime)
        }
        that.setData({
          newList: that.data.newList
        })
        console.log(that.data.newList)
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
    wx.setNavigationBarTitle({
      title: '消息中心'
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
    util.queryRequest('?m=myinfo&a=get_messages', {
      type: that.data.choseType,
      page: ++that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      if (res.isSuccess == true) {
        for (var i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
        }
        that.data.newList = that.data.newList.concat(res.data.rows)
        that.setData({
          newList: that.data.newList,
          total: res.data.total
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