// pages/liveActivity/liveActivity.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showType: 1,
    act_id: '',
    page: 1,
    size: 10,
    giftList: [],
    detailInfo: {},
    winList: [],
    page_num: 0,
    hasData: true,
    is_end: true,
    is_load: false,
    isTop: true, // 返回顶部
    showModel: false,
    showAddr: false,
    showSend: false,
    choseInfo: {},
    companyList: [],
    index: '',
    track_number: '',
    showSkeleton: true,
  },
  hidenModel() {
    this.setData({
      showModel: false,
      showAddr: false,
      showSend: false,
    })
  },
  viewModel: util.throttle(function (e) {
    console.log(e[0])
    let type = e[0].currentTarget.id
    let id = e[0].currentTarget.dataset.mid
    for (let i = 0; i < this.data.giftList.length; i++) {
      if (this.data.giftList[i].id == id) {
        this.setData({
          choseInfo: this.data.giftList[i]
        })
        break
      }
    }
    console.log(this.data.choseInfo)
    if (type == 'addr') {
      this.setData({
        showModel: true,
        showAddr: true
      })
    } else {
      this.setData({
        showModel: true,
        showSend: true
      })
    }
  }),
  // 获取快递信息
  getLogInfo() {
    const that = this
    util.queryRequest('/app/after/getLogiNameCode', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          companyList: res.data,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })
  },
  //选择快递
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    })
  },
  saveTrackNumber(e) {
    this.setData({
      track_number: e.detail.value
    })
  },
  viewTrack:util.throttle(function(e){
    console.log(e[0].currentTarget.id)
    console.log(e[0].currentTarget.dataset.oid)
    wx.navigateTo({
      url: '/pages/findLog/findLog?oid='+e[0].currentTarget.dataset.oid + '&img=' + e[0].currentTarget.dataset.url
    })
  }),
  // 物流信息提交
  submitTrack: util.throttle(function (e) {
    const that = this
    if (that.data.index !== '') {
      if (that.data.track_number != '') {
        let obj = {
          oid: that.data.choseInfo.id,
          logi_no: that.data.track_number,
          logi_code: that.data.companyList[that.data.index].id,
        }
        util.queryRequest('/app/liveActivity/lotteryDelivery', obj, 'POST').then(function (res) {
          wx.hideLoading()
          if (res.code === 200 || res.code === '200') {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              that.hidenModel()
              that.getDetail()
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
            console.log(res.msg)
          }
        })
      } else {
        wx.showToast({
          title: '物流单号不能为空',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请选择快递公司',
        icon: 'none',
        duration: 1000
      })
    }

  }),
  getDetail: function () {
    this.setData({
      giftList: [],
      detailInfo: {},
      hasData: true
    })
    if (this.data.showType == 1) {
      // 获取抽奖详情
      let that = this
      let info = {
        lottery_id: this.data.act_id
      }
      util.queryRequest('/app/liveActivity/lotteryDetail', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          that.setData({
            detailInfo: res.data.prize,
            giftList: res.data.lottery_list,
            hasData: true,
            showSkeleton: false,
          })
        }
      })
    } else {
      // 获取红包详情
      let that = this
      let info = {
        red_id: this.data.act_id
      }
      util.queryRequest('/app/redPacket/redPacketDetail', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          that.setData({
            detailInfo: res.data.redPacket,
            giftList: res.data.record,
            hasData: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showType: options.type,
      act_id: options.id
    })
    wx.setNavigationBarTitle({
      title: '直播活动详情',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getDetail()
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
    let that = this
    setTimeout(()=>{
      that.setData({
        showSkeleton: false,
      })
    },2000)
    this.getLogInfo()
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