// pages/addArticle/addArticle.js
var app = getApp()
let util = require('../../utils/util.js')
let msg = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    title: '',
    type: '',
    detail: '',
    tempFilePaths: [],
    imgs: [],
    allComm: 0,
    imgList: [],
    uploadimg: [],
    uploadOk: false,
    index: ''
  },
  addImg: function() {
    console.log(this.data.tempFilePaths.length)
    var imgNum = 9;
    if (this.data.tempFilePaths.length > 0) {
      imgNum = 9 - this.data.tempFilePaths.length
    }
    var that = this
    var imgs = this.data.imgs;
    wx.chooseImage({
      count: imgNum, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.tempFilePaths = that.data.tempFilePaths.concat(res.tempFilePaths)
        that.setData({
          tempFilePaths: that.data.tempFilePaths
        })
        for (var i = 0, len = res.tempFilePaths.length; i < len; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(res.tempFilePaths[i]);
          }
        }
        that.setData({
          imgs: imgs
        });
      }
    })
  },
  delImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
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
  uploadImg: function(data) { 
    console.log(data.path)
    var that = this,
        i = data.i ? data.i : 0,
        success = data.success ? data.success : 0,
        fail = data.fail ? data.fail : 0; 
    wx.uploadFile({  
      url: data.url,
      filePath: data.path[i],
      name: 'image',
      formData: {
        "token": wx.getStorageSync("token")
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
        success: (resp) => {      
        if (JSON.parse(resp.data).isSuccess) {
          success++;
          that.data.uploadimg.push(JSON.parse(resp.data).data[0])
        }
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
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
            setTimeout(function() {
              that.returnBack()
            }.bind(that), 1000)
          }
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;   
          data.success = success;   
          data.fail = fail;   
          that.uploadimg(data);  
        }
      } 
    });
  },
  returnBack:function(e){
    wx.showModal({
      title: '提示',
      content: '是否取消本次发布？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  bindValue:function(e){
    if(e.currentTarget.id=='title'){
      this.setData({
        title: e.detail.value
      })
    }else{
      this.setData({
        detail: e.detail.value
      })
    }
  },
  checkField(type,value){
    let flag = true
    if(type=='title'){
      if(value==''){
        msg = "标题不能为空"
        flag = false
      }else{
        if(value.length <3 || value.length>50){
          msg = "标题长度在3到50个字符"
          flag = false
        }
      }
    }
    if(type=='type'){
      if(value==''){
        msg = "请选择分类"
        flag = false
      }
    }
    if(type=='detail'){
      if(value==''){
        msg = "详情不能为空"
        flag = false
      }else{
        if(value.length <10 || value.length>1000){
          msg = "详情长度在3到1000个字符"
          flag = false
        }
      }
    }
    return flag
  },
  saveArticle:util.throttle(function(e){
    console.log("判断标题，判断分类，判断正文，判断图片")
    console.log('title',this.data.title)
    console.log('type',this.data.type)
    console.log('detail',this.data.detail)
    console.log('imgs',this.data.imgs)
    if(this.checkField('title',this.data.title)&&this.checkField('type',this.data.type)&&this.checkField('detail',this.data.detail)&&this.checkField('imgs',this.data.imgs)){
      let that = this
      // 循环上传图片
      that.uploadImg({
        url: that.data.apiUrl + 'platform/file/uploadImage', //这里是你图片上传的接口
        path: that.data.tempFilePaths.slice(0, 9)//这里是选取的图片的地址数组，只选取前九张
      })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }

  }),
  bindPickerChange:function(e){
    console.log(e.detail.value)
    console.log(this.data.typeList[e.detail.value].id)
    this.setData({
      index: e.detail.value,
      type: this.data.typeList[e.detail.value].id
    })
  },
  getArticleType() {
    let that = this
    util.queryRequest('app/article/getCate', {}, 'GET').then(function (res) {
      if (res.code == 200) {
        let arr = []
        for(let i =0;i<res.data.length;i++){
          arr.push({id:res.data[i].id,name:res.data[i].name})
        }
        that.setData({
          typeList: arr
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
    wx.setNavigationBarTitle({
      title: '发布动态'
    })
    // 获取动态分类
    this.getArticleType()
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