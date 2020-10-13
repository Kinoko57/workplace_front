// pages/clientList/clientList.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClientDress:false,
    showSkeleton: true,
    addrList: [],
    student_num:0,
    choseId:[],
    height:'',
    type:'',
    page_num: 0,
    is_end: false,
    hasData: true,
    loading: false,
    timerOut: null,
    page:1,
    size:9,
    total:'',
    is_iphonex: app.globalData.isiPhoneX,
  },
  newAdd:function(e){
    console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
  },
  getList(){
    const that = this
    util.queryRequest('app/student/index', {
       page:that.data.page,
       size:that.data.size,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
            that.setData({
              ['addrList[' + currentpage + ']']: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true,
              showSkeleton:false,
            })
            console.log(that.data.is_end)
        }else {
          that.setData({
            addrList:[],
            showSkeleton:false,
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
      }
      util.queryRequest('app/student/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['addrList[' + currentpage + ']']: res.data.rows,
            is_end: that.data.page_num == that.data.page
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
    } else {
      console.log("加载完了")
    }

  },
  delAdd:function(e){
    console.log(this.data.addrList)
      var that = this
      wx.showModal({
        title: '提示',
        content: '删除后不可恢复，是否确认“删除”？',
        success: function (res) {
          if (res.confirm) {
            util.queryRequest('app/student/remove', {
              id: e.currentTarget.id
           }, 'POST').then(function (res) {
              if (res.code ==200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                that.getList()
              }else{
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
  },
  chose(e){
    this.setData({
      choseId:e.detail.value
    })
  },
  sureChild: util.throttle(function(e) {
    const that=this
    let chose_studet_info=[]
      if(that.data.choseId.length==that.data.student_num){
        for(let i=0;i<that.data.addrList.length;i++){
          for(let j=0;j<that.data.addrList[i].length;j++){
            console.log(that.data.addrList[i][j])
            if(that.data.choseId.indexOf(that.data.addrList[i][j].id.toString())!= -1){
              chose_studet_info.push({id:that.data.addrList[i][j].id,name:that.data.addrList[i][j].name,gender:that.data.addrList[i][j].gender,image:that.data.addrList[i][j].image})
            }
          }
        }
        console.log(that.data.choseId,chose_studet_info)
        wx.setStorageSync('sure_add', JSON.stringify(chose_studet_info))
        wx.navigateBack({
          delta:1
        })
      }else{
        let msg='请选择'+that.data.student_num+'个学员'
        wx.showToast({
          title: msg,
          icon:'none',
          duration:1000
        })
      }
  },1000),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(options,"options")
    // if(options!=''){
    //   this.setData({
    //     type:options.type,
    //     replaceId:options.id,
    //   })
    // }
    that.setData({
      height:app.globalData.useWindowHeight,
      student_num:options.num
    })
    wx.setNavigationBarTitle({
      title: '我的学员',
    })
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
    this.setData({
      addrList: [],
      page_num: 0,
      is_end: false,
      hasData: true,
      page:1,
    })
    this.getList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timerOut)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timerOut)
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