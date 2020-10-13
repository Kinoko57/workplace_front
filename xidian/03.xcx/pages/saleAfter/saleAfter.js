// pages/saleAfter/saleAfter.js
var app=getApp()
let time = null
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleType:[{id:2,name:'修改营期'}],
    from:'',
    saleAfter:{},
    choseId:[],
    choseType:2,
    order_id:'',
    showMode:false,
    index:0,
    showSkeleton:true,
    afterInput:'',
    inputLength:0,
    specNum:'1',
    indextype:'0',
    apiUrl: app.globalData.apiUrl,
  },
  choseType(e){
    console.log(e)
    if(e.detail.value==2){
      for(let i=0;i<this.data.saleAfter.student.length;i++){
        this.data.saleAfter.student[i].checked=true
        this.data.choseId.push(this.data.saleAfter.student[i].id)
      }
    }else{
      for(let i=0;i<this.data.saleAfter.student.length;i++){
        this.data.saleAfter.student[i].checked=false
      }
      this.data.choseId=[]
    }
    this.setData({
      choseType:e.detail.value,
      choseId:this.data.choseId,
      saleAfter:this.data.saleAfter
    })
  },
  getsaleInfo(){
    const that=this
    let obj={
      order_id:that.data.order_id
    }
    util.queryRequest('app/after/afterService', obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        for(let i=0;i<res.data.student.length;i++){
          res.data.student[i].checked=true
          that.data.choseId.push(res.data.student[i].id)
        }
        that.setData({
          saleAfter: res.data,
          choseId:that.data.choseId,
          showSkeleton: false,
        })
      }else{
        that.setData({
          showSkeleton: false
        })
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        console.log(res.msg)
      }
    })
  },
  inputAction(e){
    // 过略空格
    let value=e.detail.value.replace(/^\s+/,"")
    if(value<=200){
      this.data.inputLength=value.length
    }else{
      value=value.substring(0,200)
      this.data.inputLength=200
      this.setData({
        afterInput:value
       })
    }
    this.setData({
      inputLength:value.length,
     })
  },
  lostblur(e){
    let value=e.detail.value.replace(/^\s+/,"")
    if(value.length>200){
      value=value.substring(0,200)
    }
    this.setData({
      inputLength:value.length,
      afterInput:value
     })
  },
  // 选择学员
  chose(e){
    console.log(e)

    this.setData({
      choseId:e.detail.value
    })
  },
  // 提交售后
  subSale:util.throttle(function (e){
    const that=this
    let flag=true
    let msg=''
    if(that.data.choseId.length==0){
      msg='请选择退款人员'
      flag=false
    }
    if(that.data.inputLength==0){
      msg='请输入申请原因'
      flag=false
    }
    if(that.data.inputLength!=0&&that.data.inputLength<5){
      msg='申请原因不少于5个字'
      flag=false
    }
    if(that.data.choseType==''){
      msg='请选择售款类型'
      flag=false
    }
    console.log(that.data.inputLength,"长度")
    if(flag){
      console.log('sff')
      wx.showLoading({
        title: '提交中...',
      })
      console.log(that.data.choseId)
      let obj={
        order_id:that.data.order_id,
        remark:that.data.afterInput,
        type:this.data.choseType,
        student_id:that.data.choseId.join(',')
      }
      util.queryRequest('app/after/createAfter', obj, 'POST').then(function (res) {
        wx.hideLoading()
        if (res.code === 200 || res.code === '200') {
          wx.showToast({
            title: '售后提交成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: '../saleList/saleList?status=1',
            })
          },1000)
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          console.log(res.msg)
        }
      })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1000
      })
    }
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.setData({
      order_id:options.order_id,
      from:options.from
    })
    wx.setNavigationBarTitle({
      title: '售后'
    })
    this.getsaleInfo()
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