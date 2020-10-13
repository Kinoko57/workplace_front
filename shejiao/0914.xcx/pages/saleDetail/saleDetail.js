// pages/saleAfter/saleAfter.js
var app=getApp()
let time = null
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    pageName:'换货',
    sumbit_text:'提交',//按钮文字
    proObj:{},//展示页面信息
    filePath: app.globalData.fileUrl,
    host_url:'',
    showMode:false,
    imgList:[],//上传图片
    companyList:[{id:1,name:'中通'}],
    index:0,//物流index
    showSkeleton:true,
    afterInput:'',//售后原因
    inputLength:0,//售后原因长度
    specNum:'1',//商品数量
    choseId:'1',//
    modeText:'快递员将在1-3天内上门取回商品',
    modeList: [{ name: '上门取货', id: 1 }, { name: '自邮', id: 2 }],
    indextype:'0',
    options:{},
    staticUrl: app.globalData.staticUrl,
    apiUrl: app.globalData.apiUrl,
    ship_area:'',//售后地址
    ship_addr:'',//售后详细地址
    ship_mobile:'',//收货人手机号
    ship_name:'',//收货人姓名
    track_number:'',//物流单号
  },
  changeAddress(){
    if(this.data.options.sale_type!='track'){
      wx.navigateTo({
        url: '../myAdress/myAdress?type=sale_chose',
      })
    }
  },
  // 获取快递信息
  getLogInfo(){
    const that=this
    util.queryRequest('/app/after/getLogiNameCode', {}, 'GET').then(function (res) {
       if (res.code === 200 || res.code === '200') {
         that.setData({
          companyList:res.data,
         })
       }else{
         wx.showToast({
           title: res.msg,
           icon: 'none',
           duration: 1000
         })
         console.log(res.msg)
       }
     })
  },
  // 上传图片
  changeImg:function(){
    const that=this
    let imgNum=9
    if (this.data.imgList.length > 0) {
      imgNum = 9 - this.data.imgList.length
    }
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) { //0是相册
          wx.chooseImage({
            count: imgNum,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (req) {
              for(let i=0;i<req.tempFilePaths.length;i++){
                wx.uploadFile({
                  url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
                  filePath: req.tempFilePaths[i],
                  name: 'image',
                  formData: {
                    "token": wx.getStorageSync("token")
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  success(res) {
                    wx.showToast({
                      title: '上传成功',
                      icon: 'success',
                      duration: 1000
                    })
                    const data = JSON.parse(res.data)
                    console.log(data)
                    that.data.imgList.push(data.data.path_name)
                    that.setData({
                      imgList:that.data.imgList
                    })
                  }
                })
              }
            },
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: imgNum,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: function (req) {
              for(let i=0;i<req.tempFilePaths.length;i++){
                wx.uploadFile({
                  url: that.data.apiUrl + '/platform/file/uploadImage', //仅为示例，非真实的接口地址
                  filePath: req.tempFilePaths[i],
                  name: 'image',
                  formData: {
                    "token": wx.getStorageSync("token")
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  success(res) {
                    const data = JSON.parse(res.data)
                    that.data.imgList.push(data.data.path_name)
                    that.setData({
                      imgList:that.data.imgList
                    })
                    console.log(data, data.data.path_name)
                  }
                })
              }
            },
          })
        }
      }
    })
  },
  // 输入原因
  inputAction(e){
    if(e.detail.value.lenght<=200){
      this.data.inputLength=e.detail.value.length
    }else{
      e.detail.value=e.detail.value.substring(0,200)
      this.data.inputLength=200
      this.setData({
        afterInput:e.detail.value
       })
    }
    this.setData({
      inputLength:e.detail.value.length,
     })
  },
  saveTrackNumber(e){
   this.setData({
    track_number:e.detail.value
   })
  },
  // 失去焦点获取输入原因
  lostblur(e){
    console.log(e)
    if(e.detail.value.lenght>200){
      e.detail.value=e.detail.value.substring(0,200)
    }
    this.setData({
      afterInput:e.detail.value
     })
  },
  // 获取售后页面信息
  getProSale(){
    const that=this
    util.queryRequest('/app/after/afterDetails', {
      id:that.data.options.id,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          proObj:res.data,
          host_url:res.data.host_url,
          afterInput:res.data.after.remark,
          imgList:res.data.after.image,
          inputLength:res.data.after.remark.length,
          ship_area:res.data.address.ship_area,//售后地址
          ship_addr:res.data.address.ship_addr,//售后详细地址
          ship_mobile:res.data.address.ship_mobile,//收货人手机号
          ship_name:res.data.address.ship_name,//收货人姓名
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })
  },
  // 删除图片
  clearImg(e){
    for(let i=0;i<this.data.imgList.length;i++){
      if(e.currentTarget.dataset.index==i){
          this.data.imgList.splice(i, 1)
      }
    }
    this.setData({
      imgList:this.data.imgList
    })
  },
  saveinput(e){
    if(e.currentTarget.dataset.name=='ship_name'){
       this.setData({
        ship_name:e.detail.value
       })
    }else if(e.currentTarget.dataset.name=='ship_mobile'){
      this.setData({
        ship_mobile:e.detail.value
       })
    }
  },
  saveBlur(e){
 
  },
  // 查看大图
  findImg(e){
    const that=this
    let imgList=[...this.data.imgList]
    for(let i=0;i<this.data.imgList.length;i++){
      imgList[i]=that.data.host_url+imgList[i]
    }
    wx.previewImage({
      current:imgList[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls:imgList// 需要预览的图片http链接列表
    })
  },
  //选择快递
  bindPickerChange(e){
    this.setData({
      index:e.detail.value,
    })
  },
  bindPickerChangeType(e){
    if(e.currentTarget.id==1){
      this.data.modeText='快递员将在1-3天内上门取回商品'
    }else{
      this.data.modeText='商品寄回地址将会在审核通过后以短信形式告知或在申请记录中查询'
    }
    console.log(e)
    this.setData({
      indextype:e.detail.value,
      modeText:this.data.modeText
    })
  },
  // 获取选中标签id
  changeMode(e){
    if(e.currentTarget.dataset.id==1){
      this.data.modeText=='请保持手机畅通'
    }else{
      this.data.modeText=='请尽快去最近的有几点进行邮寄'
    }
    this.setData({
      choseId: e.currentTarget.dataset.id,
      modeText:this.data.modeText
    })
  },
  goMode(){
    this.setData({
      showMode:true
    })
  },
  //提交售后
  submitorder(){
    const that=this
    console.log('退款提交')
    let flag=true
    let msg=''
    let url=''
    let obj={}
    if(that.data.imgList.length==0){
      msg='请上传凭证'
      flag=false
    }
    if(that.data.inputLength==0){
      msg='请输入申请原因'
      flag=false
    }
    // if(that.data.afterInput.length!=0&&that.data.afterInput.length<15){
    //   msg='申请原因不少于15个字'
    //   flag=false
    // }
      let type=''
      // 2代表退货 3代表换货 1代表退款
      if(that.data.options.type=='return_goods'){
        type=2
      }
      if(that.data.options.type=='exchange_goods'){
        type=3
      }
      console.log(that.data.ship_mobile)
      if(that.data.ship_mobile==''){
        msg='手机号不能为空'
        flag=false
      }
      if(that.data.ship_mobile!=''&&!/^1\d{10}$/.test(that.data.ship_mobile)){
        msg='手机号格式不正确'
        flag=false
      }
      if(that.data.ship_name==''){
        msg='姓名不能为空'
        flag=false
      }
      if(that.data.ship_name!=''&&that.data.ship_name.length>20){
        msg='姓名最大长度为20'
        flag=false
      }
      obj={
        id:that.data.options.id,
        ship_name:that.data.ship_name,
        ship_mobile:that.data.ship_mobile,
        ship_area:that.data.ship_area,
        ship_addr:that.data.ship_addr,
        logi_code:'',
        logi_no:'',
        remark:that.data.afterInput,
        image:that.data.imgList.join(',')
      }
      url='/app/after/editAfter'
      if(flag){
        wx.showLoading({ 
          title: '提交中...',
        })
        util.queryRequest(url, obj, 'POST').then(function (res) {
          wx.hideLoading()
          if (res.code === 200 || res.code === '200') {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function(){
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
  },
  // 物流信息提交
  submitTrack:util.throttle(function (e){
    const that=this
    if(that.data.track_number!=''){
      let obj={
        id:that.data.options.id,
        logiNo:that.data.track_number,
        logiCode:that.data.companyList[that.data.index].id,
      }
      util.queryRequest('/app/after/commitLogistics', obj, 'POST').then(function (res) {
        wx.hideLoading()
        if (res.code === 200 || res.code === '200') {
          wx.showToast({
            title: '提交成功',
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
        title: '物流单号不能为空',
        icon: 'none',
        duration: 1000
      })
    }
  }),
  closeModel(){
    this.setData({
      showMode:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(options,"接收的参数")
    // sale_type:change  代表修改 track代表填写物流
    this.setData({
      pageName:options.page_name,
      options:options
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 200)
    wx.setNavigationBarTitle({
      title:this.data.pageName,
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getProSale()
    if(that.data.options.sale_type=='track'){
      this.getLogInfo()
    }
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
    if(wx.getStorageSync('sale_address')!=undefined&&wx.getStorageSync('sale_address')!=''){
      this.setData({
        ship_name:wx.getStorageSync('sale_address').ship_name,
        ship_mobile:wx.getStorageSync('sale_address').ship_mobile,
        ship_area:wx.getStorageSync('sale_address').ship_area,
        ship_addr:wx.getStorageSync('sale_address').ship_addr,
      })
  }
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