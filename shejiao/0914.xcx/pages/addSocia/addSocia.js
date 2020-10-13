// pages/addArticle/addArticle.js
var app = getApp()
let util = require('../../utils/util.js')
let msg = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    type: '',
    detail: '',
    staticUrl: app.globalData.staticUrl,
    apiUrl: app.globalData.apiUrl,
    tempFilePaths: [],
    imgs: [],
    imgList: [],
    uploadimg: [],
    uploadOk: false,
    index: ''
  },
  bindTextAreaBlur(e){
    this.setData({
      detail:e.detail.value
    })
  },
  // 添加图片
  addImg() {
    const that=this
    var imgNum = 9;
    if (this.data.tempFilePaths.length > 0) {
      imgNum = 9 - this.data.tempFilePaths.length
    }
    let mediaType=[]
    if(this.data.type==''){
      mediaType=['image','video']
    }else if(this.data.type==1){
      mediaType=['image']
    }else if(this.data.type==2){
      mediaType=['video']
    }
    console.log(mediaType,"mediaType")
    var imgs = this.data.imgs;
    wx.chooseMedia({
      count: imgNum,
      mediaType: mediaType,
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res)
        if(res.type=='image'){
          for(let i=0;i<res.tempFiles.length;i++){
           that.getImageHeight(res.tempFiles[i].tempFilePath)
          }
        }else{
          that.data.tempFilePaths.push({
            image:res.tempFiles[0].tempFilePath,
            width:res.tempFiles[0].width,
            height:res.tempFiles[0].height
          })
          that.setData({
            tempFilePaths: that.data.tempFilePaths,
            imgs:that.data.tempFilePaths,
            type:2
          })
        }
      }
    })
  },
  getImageHeight(tempFilePath){
    const that=this
    wx.getImageInfo({
      src:tempFilePath ,
      success (req) {
        let obj={
          image:tempFilePath,
          width:req.width,
          height:req.height
        }
        that.data.tempFilePaths.push(obj)
        that.setData({
          tempFilePaths: that.data.tempFilePaths,
          imgs:that.data.tempFilePaths,
          type:1
        })
      }
    })
  },
  // 删除图片
  delImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    if(this.data.imgs.length==0){
      this.data.type=''
    }
    this.setData({
      imgs: imgs,
      type:this.data.type
    });
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  // 上传图片到服务器
  uploadImg: function(data,type) { 
    console.log(data,data.path,"path")
    var that = this,
    i  = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
   console.log(i,  success,  fail,"  fail")
    wx.uploadFile({  
      url: data.url,
      filePath: data.path[i].image,
      name: type,
      formData: {
        "token": wx.getStorageSync("token")
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
        success: (resp) => {     
        const dataObj = JSON.parse(resp.data)
        console.log(dataObj,"data")
        that.data.uploadimg.push({image:dataObj.data.path_name,width:data.path[i].width,height:data.path[i].height})
      },
        fail: (res) => {   
        fail++;   
        console.log('fail:' + i + "fail:" + fail);  
      },
        complete: () => {   
        console.log(i);   
        i++;  
        if (i == data.path.length) { //当图片传完时，停止调用  
          console.log('成功：' + success + " 失败：" + fail);  
          that.setData({
            uploadOk: true
          })
          if (that.data.uploadOk) {
            // 图片全部上传完毕，提交动态的接口
            that.submit()
          }
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;   
          data.success = success;   
          data.fail = fail;   
          that.uploadImg(data,type);  
        }
      } 
    });
  },
  // 点击发布
  saveSocia:util.throttle(function(e){
    const that=this
    if(that.data.detail!=''){
      let that = this
      // 循环上传图片
      if(that.data.tempFilePaths.length>0){
        if(that.data.type==1){
          that.uploadImg({
            url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
            path: that.data.tempFilePaths//这里是选取的图片的地址数组，只选取前九张
          },'image')
        }else{
          that.uploadImg({
            url: that.data.apiUrl + '/platform/file/uploadFile', //仅为示例，非真实的接口地址
            path: that.data.tempFilePaths//这里是选取的图片的地址数组，只选取前九张
          },'file')
        }
       
      }else{
        wx.showToast({
          title: '请上传图片或者视频',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    }else{
      wx.showToast({
        title: '请输入动态内容',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  }),
  // 提交接口
  submit(){
    const that=this
    var info = {
      type: that.data.type,
      viewing: that.data.uploadimg.length>0?JSON.stringify(that.data.uploadimg):'',
      content: that.data.detail,
    }
    console.log(that.data.uploadimg,"that.data.uploadimg")
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    util.queryRequest('/app/dynamic/add', info, 'POST').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
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
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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