// pages/report/report.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    line_bg_color:'rgba(100,31,52,1)',
    staticUrl: app.globalData.staticUrl,
    apiUrl: app.globalData.apiUrl,
    showSkeleton:true,
    imgs:[],
    uploadimg:[],
    id:'',
    type:'',
    content:'',
    contentLength:0,
    cause:'',
    scene:'',
  },
  bindTextAreaBlur(e){
    this.setData({
      content:e.detail.value.trim()
    })
  },
    // 查看大图
    findImg(e){
      const that=this
      let imgs=[...this.data.imgs]
      let big_image=[]
      for(let i=0;i<imgs.length;i++){
        big_image.push(imgs[i].image)
      }
      wx.previewImage({
        current:big_image[e.currentTarget.dataset.index], // 当前显示图片的http链接
        urls:big_image// 需要预览的图片http链接列表
      })
    },
  // 添加图片/视屏
  addImg() {
    const that=this
    if(this.data.imgs.length<4){
      var imgNum = 4;
      if (this.data.imgs.length > 0) {
        imgNum = 4 - this.data.imgs.length
      }
      var imgs = this.data.imgs;
      wx.chooseImage({
        count: imgNum,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          console.log(res)
          res.tempFilePaths.forEach((item)=>{
            that.data.imgs.push({image:item})
          })
          that.setData({
            imgs:that.data.imgs,
          })
        }
      })
    }else{
      wx.showToast({
        title: '最多只能上传四张图片',
        icon:'none',
        duration:1000
      })
    }
  },
  submit(){
    const that=this
    if(that.data.content!=''){
      if(that.data.imgs.length>0){
        that.uploadImg({
          url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
          path: that.data.imgs//这里是选取的图片的地址数组，只选取前九张
        })
      }else{
        that.saveMode()
      }
    }else{
      wx.showToast({
          title:'请详细描述举报理由',
          icon: 'none',
          duration: 3000
        })
    }
  },
      // 删除图片
  clearImg(e){
    for(let i=0;i<this.data.imgs.length;i++){
      if(e.currentTarget.dataset.index==i){
          this.data.imgs.splice(i, 1)
      }
    }
    this.setData({
      imgs:this.data.imgs
    })
  },
      // 上传图片到服务器
  uploadImg: function(data) { 
    console.log(data,data.path,"path")
    var that = this,
    i  = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
   console.log(i,  success,  fail,"  fail")
    wx.uploadFile({  
      url: data.url,
      filePath: data.path[i].image,
      name: 'image',
      formData: {
        "token": wx.getStorageSync("token")
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
        success: (resp) => {     
        const dataObj = JSON.parse(resp.data)
        console.log(dataObj,"data")
        that.data.uploadimg.push(dataObj.data.path_name)
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
            // 图片全部上传完毕，提交动态的接口
            that.saveMode()
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;   
          data.success = success;   
          data.fail = fail;   
          that.uploadImg(data);  
        }
      } 
    });
  },
  saveMode(){
    const that=this
    var info = {
      dynamic_id:this.data.id,
      type: that.data.type,
      image: that.data.uploadimg.length>0?that.data.uploadimg.join(","):'',
      describe: that.data.content,
      scene:that.data.scene
    }
    console.log(that.data.uploadimg,"that.data.uploadimg",info)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    util.queryRequest('/app/complain/complainAdd', info, 'POST').then(function (res) {
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
            delta: 2
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
    console.log(options,"options")
    this.setData({
      scene:options.scene,
      type:options.type,
      cause:options.cause,
      id:options.id
    })
    wx.setNavigationBarTitle({
      title:'举报',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333333',
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