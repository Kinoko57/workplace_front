// pages/saleAfter/saleAfter.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleInfo:{},
    showSkeleton:true,
    id:'',
    signList:[
    ]
  },
  copyafter(e){
    var that = this;
    console.log(e,"LLL")
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  
  // 取消售后
  cancelSale(){
    const that=this
    wx.showModal({
      title: '提示',
      content: '确认要取消售后吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
            mask: true
          })
          util.queryRequest('app/after/cancelAfter', {
            id:that.data.id,
          }, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
              wx.showToast({
                title: '售后取消成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getDetail(){
    const that=this
    let obj={}
      obj = {
        id: that.data.id,
      }
    util.queryRequest('app/after/afterDetail',obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if(res.data.after.status==0){
            that.data.signList=[
             {id:'1',data:'提交申请'},
             {id:'2', data: '待审核'},
            ]
          // }else if(res.data.after.audit==1){
          //   that.data.signList=[
          //     {id:'1',data:'提交申请'},
          //     {id:'2', data: '审核完成'},
          //    ]
          // }else{
          //   that.data.signList=[
          //     {id:'1',data:'提交申请'},
          //     {id:'2', data: '驳回'},
          //    ]
          // }
        }else if(res.data.after.status==1){
          that.data.signList=[
            {id:'1',data:'提交申请'},
            {id:'2', data: '审核完成'},
          ]
        }else if(res.data.after.status==2){
          that.data.signList=[
            {id:'1',data:'提交申请'},
            {id:'2', data: '审核完成'},
            {id:'2', data: '执行'},
            {id:'3', data: '完成'},
           ]
        }else if(res.data.after.status==4){
          that.data.signList=[
            {id:'1',data:'提交申请'},
            {id:'2', data: '审核完成'},
            {id:'2', data: '执行中'},
           ]
        }else if(res.data.after.status==3){
          that.data.signList=[
            {id:'1',data:'提交申请'},
            {id:'2', data: '取消售后'},
           ]
        }else if(res.data.after.status==5){
          that.data.signList=[
            {id:'1',data:'提交申请'},
            {id:'2', data: '已驳回'},
           ]
        }
        // let arr=[]
        // for(let i=0;i<res.data.student.length;i++){
        //     arr.push(res.data.student[i].name)
        // }
        // res.data.member.studentName=arr.join(',')
        that.setData({
          signList:that.data.signList,
          saleInfo: res.data,
          showSkeleton: false,
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
    const that=this
    that.setData({
      id: options.id,
    })
    wx.setNavigationBarTitle({
      title: '售后详情'
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