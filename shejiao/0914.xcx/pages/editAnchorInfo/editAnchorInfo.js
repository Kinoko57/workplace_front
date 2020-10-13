// pages/editClientInfo/editClientInfo.js
let util = require('../../utils/util.js')
let parse = require('../../utils/address-parse.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: null, // 裁剪图片地址
    visible: false, // 是否显示
    size: { //裁剪尺寸
      width: 375,
      height: 375
    },
    cropSizePercent: 0.9, //裁剪框显示比例
    borderColor: '#fff', //裁剪框边框颜色
    result: '', //裁剪结果地址
    //以上是裁剪组件的引入字段
    staticUrl: app.globalData.staticUrl,
    showSkeleton:true,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    color:'#fff',
    adddressText: '添加',
    arrSex:[{id:1,sex:'女'},{id:2,sex:'男'}],
    index:0,//性别的下标
    addInfo: {
      name: '',
      phone: '',
      image:'',
      sex: '',
      addr:'',
      birthday:'',
    },
    image:'',//上传图片
    areaShow: ['请选择省', '市', '区'],
    areaShowId: [{ id: 1, name: '北京市' }, { id: 2, name: '北京市' }, { id: 3, local_name: '东城区' }],
    is_iphonex: app.globalData.isiPhoneX,
    form: {},
    isChose: 0,
    show: false,
    showSubmit: true,
    apiUrl: app.globalData.apiUrl,
  },
    // 上传图片
  changeImage(e){
    const that=this
    let self = this;
    wx.chooseImage({
      sizeType: ["compressed"], // ios 选择原图容易 crash
      success(res) {
        self.setData({
          visible: true,
          src: res.tempFilePaths[0],
        })
      }
    })
  },
  //选取裁剪图片成功回调
  uploadCallback: function (event) {
    console.log(event);
  },
  //裁剪图片回调
  cropCallback: function (event) {
    console.log(event);
    let that = this
    // 将裁剪后的图片路径传给后台 event.detail.resultSrc
    wx.uploadFile({
      url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
      filePath: event.detail.resultSrc,
      name: 'image',
      formData: {
        "token": wx.getStorageSync("token")
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success(res) {
        const data = JSON.parse(res.data)
        console.log(data)
        that.data.addInfo.image=data.data.image_url+data.data.path_name
        that.setData({
          addInfo:that.data.addInfo,
          visible:false,
          image:data.data.path_name
        })
      }
    })
  },
  //关闭回调
  closeCallback: function (event) {
    console.log(event);
    this.setData({
      visible: false,
    });
  },
  bindDateChange: function(e) {
    console.log(e)
    this.data.addInfo.birthday=e.detail.value
    this.setData({
      addInfo: this.data.addInfo
    })
  },
  bindSexChange: function(e) {
    console.log(e)
    this.data.addInfo.sex=this.data.arrSex[e.detail.value].id
    this.setData({
      index:e.detail.value,
      addInfo: this.data.addInfo
    })
  },
  formSubmit: function (e) {
    const that=this
    let msg=''
    let flag=true
    if(this.data.isChose==0){
      msg='请选择所在区域'
      flag=false
    }
    if(this.data.addInfo.birthday==''){
      msg='请选择生日'
      flag=false
    }
    if(this.data.addInfo.sex===''){
      msg='请选择性别'
      flag=false
    }
    if(this.data.addInfo.name==''){
      msg='请输入姓名'
      flag=false
    }
    if(flag){
      let obj={
        image:this.data.image,
        nickname:this.data.addInfo.name,
        birth:Date.parse(new Date(this.data.addInfo.birthday)) / 1000,
        sex:this.data.addInfo.sex,
        province:that.data.areaShowId[0].id,
        country:that.data.areaShowId[1].id,
        city:that.data.areaShowId[2].id,
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      util.queryRequest('/app/broadcast/setMember', obj, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
          console.log(res.msg)
        }
      })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 3000
      })
    }
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
  // 打开地区选择组件
  chooseAddress: function () {
    var that = this
    that.setData({
      show: true
    })
  },
  //验证输入后的值是否正确
  validate(e) {
    console.log(e)
    if(e.detail.value!=''){
      if(e.currentTarget.dataset.name=='name'){
        this.data.addInfo.name=e.detail.value
      }
      this.setData({
        addInfo:this.data.addInfo
      })
    }
  },
  getInfo(){
    const that=this
    util.queryRequest('/app/broadcast/getMember',{}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        let date=''
        if(res.data.birth!=null&&res.data.birth!=''){
          date=util.formatDate(res.data.birth)
        }
        that.data.addInfo = {
          name: res.data.nickname,
          image:res.data.image,
          sex: res.data.sex,
          addr:res.data.nickname,
          birthday:date,
        }
        if(res.data.city_name!=''&&res.data.city_name!=undefined){
          that.data.areaShow = [res.data.province_name,res.data.country_name,res.data.city_name]
          that.data.areaShowId = [{ id: res.data.province, name: that.data.areaShow[0] }, { id: res.data.country, name: that.data.areaShow[1] }, { id: res.data.city, local_name: that.data.areaShow[2] }]
        }
        that.setData({
          addInfo: that.data.addInfo,
          image:res.data.image,
          showSkeleton:false,
          index:res.data.sex=='0'?'0':'1',
          areaShow: that.data.areaShow,
          areaShowId: that.data.areaShowId,
          isChose: 1,
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