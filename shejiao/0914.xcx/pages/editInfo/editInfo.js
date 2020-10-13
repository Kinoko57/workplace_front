// pages/editInfo/editInfo.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    value:'',
    editTit:'',
    show: false,//省市区
    editcode:'',
    isChose:0,
    areaShow: ['请选择省', '市', '区'],
    areaShowId: [{ id: 1, name: '北京市' }, { id: 2, name: '北京市' }, { id: 3, local_name: '东城区' }],
    placeholder:'请输入昵称'
  },
  // 打开地区选择组件
  chooseAddress: function () {
    var that = this
    that.setData({
      show: true
    })
  },
  sureSelectAreaListener: function (e) {
    var that = this;
    that.data.areaShow[0] = e.detail.currentTarget.dataset.province.name
    that.data.areaShow[1] = e.detail.currentTarget.dataset.city.name
    that.data.areaShow[2] = e.detail.currentTarget.dataset.area.local_name
    that.data.areaShowId[0] = e.detail.currentTarget.dataset.province
    that.data.areaShowId[1] = e.detail.currentTarget.dataset.city
    that.data.areaShowId[2] = e.detail.currentTarget.dataset.area
    that.setData({
      show: false,
      areaShow: that.data.areaShow,
      areaShowId: that.data.areaShowId,
      isChose: 1
    })
  },
  editInfo: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  saveInfo:util.throttle(function () {
    var flag = true
    if (this.data.editcode == 'email') {
      var str = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$')
      if (!str.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的邮箱',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    } else if (this.data.editcode == 'username') {
      var str = new RegExp('^[\u4e00-\u9fa5_a-zA-Z0-9_.]{2,35}$')
      if (!str.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的用户名',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    } else if (this.data.editcode == 'wx_number'){
      var wechat_reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
      var phone_reg = /^1[3|4|5|6|7|8|9]\d{9}$/
      if (!wechat_reg.test(this.data.value) && !phone_reg.test(this.data.value)) {
        wx.showToast({
          title: '请填写正确的微信号',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    }else if(this.data.editcode =='address'){
      if (this.data.isChose==0) {
        wx.showToast({
          title: '请选择所在区域',
          icon: 'none',
          duration: 1000
        })
        flag = false
      }
    }
    var that = this
    if (flag) {
      var obj = {}
      var url = '/app/userInfo/edit'
      if(this.data.editcode !='address'){
        var key = that.data.editcode;
        obj[key] = that.data.value;
      }else{
        obj={
          province:that.data.areaShowId[0].id,
          city:that.data.areaShowId[1].id,
          country:that.data.areaShowId[2].id,
        }
      }
      console.log(obj)
      util.queryRequest(url, obj, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }else{
          wx.showToast({
            title: res.msg ,
            icon: 'none',
            duration: 3000
          })
          console.log(res.msg)
        }
      })
    }
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.setData({
      editTit: options.codename,
      editcode: options.code,
      value: options.value,
      placeholder: options.codename
    })
    if(options.code=='address'){
      console.log(options.value!='')
       if(options.value!=''&&options.value!=null){
          let areaId=options.valueId.split(',')
          that.data.areaShow =options.value.split(' ')
          that.data.areaShowId = [{ id: areaId[0], name: that.data.areaShow[0] }, { id:  areaId[1], name: that.data.areaShow[1] }, { id: areaId[2], local_name: that.data.areaShow[2] }]
          this.setData({
            areaShow: that.data.areaShow,
            areaShowId: that.data.areaShowId,
            isChose:1
          })
       }
    }
    wx.setNavigationBarTitle({
      title:'修改'+this.data.editTit,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e13816',
    })
    console.log(options)
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