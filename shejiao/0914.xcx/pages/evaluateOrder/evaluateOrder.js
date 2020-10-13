// pages/evaluateOrder/evaluateOrder.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    filePath: app.globalData.fileUrl,
    proObj:{},
    apiUrl: app.globalData.apiUrl,
    staticUrl: app.globalData.staticUrl,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    choseStart:-1,
    tempFilePaths:[],
    is_iphonex: app.globalData.isiPhoneX,
    imgs:[],
    uploadimg:[],
    packingList:[false,false,false,false,false],//快递包装
    speedList:[false,false,false,false,false],//送货速度
    serverList:[false,false,false,false,false],//服务员
    start_true:5,//商品评价文字
    is_true:false,
    content:'',
    proList:[],
    purchase_time:'',
    proCommentList:[],
    commentMark:[]//平分
  },
  // 商品评价点击
  clickStart:util.throttle(function (e){
    console.log(e)
    let num=0
    let goods_mark=this.data.commentMark[e[0].currentTarget.dataset.blockindex].goods_mark
    goods_mark.forEach((item,index)=>{
        if(index<=e[0].currentTarget.dataset.index){
          this.data.commentMark[e[0].currentTarget.dataset.blockindex].goods_mark[index]=true
          this.data.commentMark[e[0].currentTarget.dataset.blockindex].start_true=index+1
        }else{
          this.data.commentMark[e[0].currentTarget.dataset.blockindex].goods_mark[index]=false
        }
    })
     this.setData({
      commentMark:this.data.commentMark,
      start_true:num
     })
  },50),
  clickTrack:util.throttle(function (e){
    if(e[0].currentTarget.dataset.type=='packing'){
      this.data.packingList.forEach((item,index)=>{
        if(index<=e[0].currentTarget.dataset.index){
          this.data.packingList[index]=true
        }else{
          this.data.packingList[index]=false
        }
    })
      this.setData({
        packingList:this.data.packingList,
      })
    }else if(e[0].currentTarget.dataset.type=='speed'){
      this.data.speedList.forEach((item,index)=>{
        if(index<=e[0].currentTarget.dataset.index){
          this.data.speedList[index]=true
        }else{
          this.data.speedList[index]=false
        }
      })
      this.setData({
        speedList:this.data.speedList,
      })
    }else{
      this.data.serverList.forEach((item,index)=>{
        if(index<=e[0].currentTarget.dataset.index){
          this.data.serverList[index]=true
        }else{
          this.data.serverList[index]=false
        }
      })
      this.setData({
        serverList:this.data.serverList,
      })
    }
  },50),
  // 删除图片
  delImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs,
    });
  },
  // 添加图片/视屏
  addImg(e) {
    const that=this
    var imgNum = 9;
    if (this.data.imgs.length > 0) {
      imgNum = 9 - this.data.imgs.length
    }
    var imgs =  this.data.commentMark[e.currentTarget.dataset.blockindex].imgs;
    wx.chooseImage({
      count: imgNum,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log(res)
        res.tempFilePaths.forEach((item,index)=>{
          wx.uploadFile({
            url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
            filePath: item,
            name: 'image',
            formData: {
              "token": wx.getStorageSync("token")
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success(res) {
              const data = JSON.parse(res.data)
              that.data.commentMark[e.currentTarget.dataset.blockindex].imgs.push(data.data.path_name)
              that.setData({
                commentMark:that.data.commentMark
              })
              console.log(data, data.data.path_name)
            }
          })
        })
      }
    })
  },
  gosubmit(){
    const that=this
    that.saveMode()
  },
  bindTextAreaBlur(e){
    this.data.commentMark[e.currentTarget.dataset.blockindex].content=e.detail.value
    this.setData({
      commentMark:this.data.commentMark
    })
  },
  choseHidden(e){
    this.data.commentMark[e.currentTarget.dataset.blockindex].is_true=!this.data.commentMark[e.currentTarget.dataset.blockindex].is_true
    this.setData({
      commentMark:this.data.commentMark
    })
  },
  getList(){
    const that=this
    let info={
      order_id:that.data.proObj.oid,
      supplier_id:that.data.proObj.supplier_id,
    }
    util.queryRequest('/app/comment/getGoods', info, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        for(let i=0;i<res.data.length;i++){
          that.data.proCommentList.push({
            goods_id:res.data[i].goods_id,
            product_id:res.data[i].product_id,
            num:res.data[i].num,
            content:'',
            image:'',
            goods_mark:5,
          })
          that.data.commentMark.push({goods_mark:[true,true,true,true,true],start_true:5,imgs:[],content:'',is_true:false,})
        }
        that.setData({
          showSkeleton:true,
          purchase_time:res.data[0].create_time,
          commentMark:that.data.commentMark,
          proList:res.data
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }.bind(that), 1000)
      }
    })
  },
  saveMode(){
    const that=this
    let flag=true
    let flag1=false
    let msg=''
    // let goods_mark=0//商品评价分数
    let express_mark=0//快递包装分数
    let delivery_speed_mark=0//送货速度分数
    let delivery_service_mark=0//配送员服务分数
    //快递包装
    this.data.packingList.forEach((item)=>{
      if(item){
        express_mark+=1
      }
    })
    //送货速度
    this.data.speedList.forEach((item)=>{
      if(item){
        delivery_speed_mark+=1
      }
    })
    //服务员
    this.data.serverList.forEach((item)=>{
      if(item){
        delivery_service_mark+=1
      }
    })
    if(delivery_speed_mark==0){
      msg='请对配送员服务进行评价'
      flag=false
    }
    if(delivery_speed_mark==0){
      msg='请对送货速度进行评价'
      flag=false
    }
    if(express_mark==0){
      msg='请对快速包装进行评价'
      flag=false
    }
    if(flag){
      this.data.commentMark.forEach((blockitem,blockindex)=>{
        that.data.proCommentList[blockindex].goods_mark=blockitem.start_true
        that.data.proCommentList[blockindex].content=blockitem.content
        that.data.proCommentList[blockindex].is_anonymous=blockitem.is_true==false?'0':'1'
        console.log(blockitem.imgs,"blockitem.imgs")
        if(blockitem.imgs.length>0){
          that.data.proCommentList[blockindex].image=blockitem.imgs.join(",")
        }
      })
      console.log(that.data.proCommentList,"asfsadf")
      var info = {
        order_id:that.data.proObj.oid,
        supplier_id:that.data.proObj.supplier_id,
        member_id:wx.getStorageSync('userInfo').id,
        comment:JSON.stringify(that.data.proCommentList),
        purchase_time:that.data.purchase_time,
        express_mark:express_mark,//快递包装分数
        delivery_speed_mark:delivery_speed_mark,//送货速度分数
        delivery_service_mark:delivery_service_mark,//配送员服务分数
        // is_anonymous:that.data.is_true==false?'0':'1',//是否匿名
      }
      console.log(info,"info")
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      util.queryRequest('/app/comment/add', info, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }.bind(that), 1000)
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }.bind(that), 1000)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      proObj:options
    })
    this.getList()
    setTimeout(()=>{
      this.setData({
        showSkeleton:false
      })
    },500)
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