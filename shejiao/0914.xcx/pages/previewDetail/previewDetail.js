// pages/previewDetail/previewDetail.js
let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo_id:wx.getStorageSync('userInfo').id,//用户自己的id
    showRemind:true,
    saleTime: [],
    endtime:0,
    time:'',
    staticUrl: app.globalData.staticUrl,
    remidText:'开播提醒',
    showSkeleton: true,
    line_bg_color:'linear-gradient(-90deg,#dd2c2f 0%,#ff5053 100%)',
    scrollHeight: app.globalData.useWindowHeight
  },
  remindBtn(){
    const that=this
    if(util.isLogin()){
      wx.requestSubscribeMessage({
        tmplIds: ['MyXtIbzHcmJnIYtTbnmoxs1gRg5GldYFtOwSva7C-KA'],
        success(res) {
          console.log(res,"成功")
        },
        complete(res) {
          if(res['MyXtIbzHcmJnIYtTbnmoxs1gRg5GldYFtOwSva7C-KA']=="reject"){
            wx.showModal({
              title: '订阅通知被拒绝',
              content: '如果勾选了"总是保持以上选择",打开消息订阅开关后请勾选要通知的消息',
              success (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success (res) {
                      res.subscriptionsSetting={
                        withSubscriptions:true
                      }
                    }
                  })
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.showToast({
              title: '开播已提醒',
              icon:'success',
              duration:1000
            })
            util.queryRequest('/app/broadcast/liveStartNotice', {
              id: that.data.id
            }, 'GET').then(function (res) {
              if (res.code == 200) {
                
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
                console.log(res.msg)
              }
            })
            setTimeout(()=>{
              that.data.viewDetail.is_notice=1
              that.setData({
                showRemind:false,
                viewDetail:that.data.viewDetail
              })
            })
            console.log(res,"用户点击允许")
          }
          console.log(res['MyXtIbzHcmJnIYtTbnmoxs1gRg5GldYFtOwSva7C-KA'],"complete")
        },
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  goView(e){
    wx.navigateTo({
      url: '../liveRead/liveRead?accelerateURL='+e.currentTarget.dataset.live_data.room_play_url+'&roomID='+e.currentTarget.dataset.live_data.stream_name+'&id='+e.currentTarget.dataset.id+'&anchor_id='+e.currentTarget.dataset.live_data.member_id+'&sence_name='+e.currentTarget.dataset.live_data.scene_name+"&scene_img="+e.currentTarget.dataset.live_data.scene_img[0].image+'&pro_key='+e.currentTarget.dataset.live_data.push_goods_key,
    })
  },
  getDetail() {
    let that = this
    util.queryRequest('/app/live/noticeGetOne', {
      id: that.data.id
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        var secTime = util.countDown(res.data.time_down)
        that.setData({
          saleTime: secTime,
          endtime: res.data.time_down
        })
        clearInterval(that.data.time)
        if(that.data.endtime > 0){
          that.data.time = setInterval(function () {
            if (that.data.endtime > 0) {
              secTime = util.countDown(--that.data.endtime)
              that.setData({
                saleTime: secTime,
                endtime: that.data.endtime
              })
            } else {
              clearInterval(that.data.time)
              that.setData({
                endtime: 0,
              })
              that.getDetail()
            }
          }.bind(that), 1000)
        }
        that.setData({
          viewDetail: res.data,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })

  },
  goLink(){
    if (util.isLogin()){
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    })
    const that=this
    that.setData({
      id: options.id,
    })
    console.log(options)
    that.getDetail()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
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
    clearInterval(this.data.time)
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