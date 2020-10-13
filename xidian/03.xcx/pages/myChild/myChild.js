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
  choseStudent: util.throttle(function (e) {
    var arr=[]
    console.log(this.data.type)
    if(this.data.type!=undefined&&this.data.type!=''){
      if(this.data.type=="change"){
        console.log('a');
        if(wx.getStorageSync('sure_add')!=''){
          
          let flag=true
           arr=JSON.parse(wx.getStorageSync('sure_add'))
           console.log(arr)
           for(let i=0;i<arr.length;i++){
             console.log(arr,e[0].currentTarget.dataset.info.id)
             if(arr[i].id==e[0].currentTarget.dataset.info.id){
               flag=false
               let obj={id:e[0].currentTarget.dataset.info.id,name:e[0].currentTarget.dataset.info.name,gender:e[0].currentTarget.dataset.info.gender}
               arr[i]=obj
               break
             }
           }
           if(flag){
             arr.push({id:e[0].currentTarget.dataset.info.id,name:e[0].currentTarget.dataset.info.name,gender:e[0].currentTarget.dataset.info.gender})
            }
            wx.setStorageSync('sure_add',JSON.stringify(arr))
        }else{
          arr=[{id:e[0].currentTarget.dataset.info.id,name:e[0].currentTarget.dataset.info.name,gender:e[0].currentTarget.dataset.info.gender}]
          wx.setStorageSync('sure_add',JSON.stringify(arr))
        }
        wx.navigateBack({
          delta: 1
        })
      }else{
        arr=[...JSON.parse(wx.getStorageSync('sure_add'))]
        let flag1=true
        let index=0
        for(let i=0;i<arr.length;i++){
          console.log(this.data.replaceId,e[0].currentTarget.dataset.info.id)
          console.log(arr[i])
          console.log(arr[i].id==e[0].currentTarget.dataset.info.id)
          console.log(flag1)
          if(arr[i].id==e[0].currentTarget.dataset.info.id){
            flag1=false
          }
        }
        if(flag1){
          for(let i=0;i<arr.length;i++){
            if(this.data.replaceId==arr[i].id){
              let obj={}
              obj={id:e[0].currentTarget.dataset.info.id,name:e[0].currentTarget.dataset.info.name,gender:e[0].currentTarget.dataset.info.gender}
              arr[i]=obj
              wx.setStorageSync('sure_add',JSON.stringify(arr))
            }
          }
        }
         wx.navigateBack({
          delta: 1
        })
      }
    }
  }),
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
          // for (let i = 0; i < res.data.rows.length; i++) {
          //   res.data.rows[i].firstName = res.data.rows[i].name.substring(0, 1)
          // }
            that.setData({
              ['addrList[' + currentpage + ']']: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true,
              showSkeleton:false,
            })
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
          // if( res.data.rows.length>0){
          //   for (let i = 0; i < res.data.rows.length; i++) {
          //     res.data.rows[i].firstName = res.data.rows[i].name.substring(0, 1)
          //   }
          // }
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
    // if (this.data.total<= 1) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '必须保留一条地址哦~',
    //     showCancel: false,
    //     confirmText: '我知道了',
    //     success(res) {
    //       if (res.confirm) {
    //         console.log("用户点击了确定")
    //       }
    //     }
    //   })
    // } else {
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
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(options,"options")
    if(options!=''){
      this.setData({
        type:options.type,
        replaceId:options.id,
      })
    }
    that.setData({
      height:app.globalData.useWindowHeight
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