// pages/editClientInfo/editClientInfo.js
let util = require('../../utils/util.js')
let parse = require('../../utils/address-parse.js')
// let parse = require('../../utils/area.js')
import {
  validate,
  validateRequired
} from '../../utils/validate'
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
    // 以上是剪裁地址片段
    endDate: '',
    is_disabled: false,
    showswitch: true,
    editname: '新增地址',
    superList:[],//家人列表
    modeList:[
      {id:0,name:'女'},
      {id:1,name:'男'},
    ],
    superModeList:[
      {id:1,name:'男'},
      {id:2,name:' 女'},
    ],
    concatModeList:[
      {id:0,name:'女'},
      {id:1,name:'男'},
    ],
    img_type:'student',// 头像是学员头像还是家人头像
    index:'0',//选择性别索引
    superindex:'0',//家人性别索引
    consctindex:'0',//学员关系索引
    image:'',
    name: '',
    mobile:'',//家长手机号
    patriarch_name:'',//家长姓名
    gender: '',
    birthday:'',
    super_image:'',
    super_name:'',
    super_phone:'',
    super_gender:'',
    super_concat:'',
    is_iphonex: app.globalData.isiPhoneX,
    cou_id: '',
    item_id:'',
    addType: null,
    isChose: 0,
    show: false,
    isFocus: false,
    type: 'new',
    isInput: '',
    name: '',
    phone: '',
    address: '',
    isShowFocus: '',
    id:'',
    showAddInfo:false,//家人弹框
    showSubmit:true,
  },
  // 选择学员头像
  changeImage(e){
    wx.chooseImage({
      sizeType: ["compressed"], // ios 选择原图容易 crash
      success(res) {
        self.setData({
          visible: true,
          src: res.tempFilePaths[0],
          img_type:e.currentTarget.dataset.type
        })
      }
    });
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
        url: that.data.apiUrl + 'platform/file/uploadImage', //仅为示例，非真实的接口地址
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
          console.log(res,"值")
          if(that.data.img_type=='student'){
            that.setData({
              image: data.data.path_name
            })
          }else{
            that.setData({
              super_image: data.data.path_name
            })
          }
          console.log(image)
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
  // 关闭家人弹框
  goBack(){
    this.setData({
      showAddInfo:false
    })
  },
  // 保存家人
  saveSuper(){
    const that=this
    console.log(that.data.super_phone)
    console.log(that.data.super_name)
    let msg=''
    let flag=true
    if(that.data.super_phone==''){
      msg='家人电话不可以为空'
      flag=false
    }
    if(that.data.super_name==''){
      msg='家人姓名不可以为空'
      flag=false
    }
    if(that.data.super_phone!=''&&!/^1\d{10}$/.test(that.data.super_phone)){
      msg='家人电话格式不正确'
      flag=false
    }
    if(that.data.super_name!=''&&that.data.super_name.length>20){
      msg='家人姓名最大长度为20'
      flag=false
    }
    if(flag){
      this.data.superList.push(
        {
          name: this.data.super_name,
          image:this.data.super_image,
          mobile: this.data.super_phone,
          sex: this.data.super_gender==''?0: this.data.super_gender,
          relation: this.data.super_concat,
        }
      )
      this.setData({
        superList:this.data.superList,
        showAddInfo:false
      })
    }else{
      wx.showToast({
        title: msg,
        icon:'none',
        duration:1000
      })
    }
  },
  // 选择学员性别
  bindPickerChangeType(e){
    console.log(e)
    this.setData({
      index:e.detail.value,
      gender:e.currentTarget.id
    })
  },
  // 选择生日
  bindDateChange: function(e) {
    console.log(e)
    // this.data.addInfo.birthday=e.detail.value
    this.setData({
      birthday:e.detail.value
    })
  },
  // 保存
  submit: function(e) {
    const that=this
    let msg=''
    let flag=true
    if(that.data.birthday==''){
      msg='请选择学员生日'
      flag=false
    }
    if(that.data.gender==''){
      msg='请选择学员性别'
      flag=false
    }
    if(that.data.mobile==''){
      msg='家长电话不可以为空'
      flag=false
    }
    if(that.data.mobile!=''&&!/^1\d{10}$/.test(that.data.mobile)){
      msg='家长电话格式不正确'
      flag=false
    }
    if(that.data.patriarch_name==''){
      msg='家长姓名不可以为空'
      flag=false
    }
    if(that.data.patriarch_name!=''&&that.data.patriarch_name.length>20){
      msg='家长姓名最大长度为20'
      flag=false
    }
    if(that.data.name==''){
      msg='学员姓名不可以为空'
      flag=false
    }
    if(that.data.name!=''&&that.data.name.length>20){
      msg='学员姓名最大长度为20'
      flag=false
    }
      if (flag) {
          if (that.data.showSubmit) {
            that.setData({
              showSubmit:false,
            })
            var info_child = {
              name:that.data.name,
              image: that.data.image,
              gender:that.data.gender,
              mobile:that.data.mobile,
              birthday:that.data.birthday,
              patriarch_name:that.data.patriarch_name
            }
            wx.showLoading({
              title: '加载中...',
              mask: true
            })
            util.queryRequest('app/student/create',info_child, 'POST').then(function (res) {
              wx.hideLoading()
              if (res.code == 200) {
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                  that.setData({
                    showSubmit: true,
                  })
                }, 1000)
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
                that.setData({
                  showSubmit: true,
                })
              }
            })
          }
      } else {
        wx.showToast({
          title: msg,
          icon:'none',
          duration:1000
        })
      }
  },
  // 失去焦点姓名
  validate(e) {
    console.log(e)
    if(e.currentTarget.dataset.name=='name'){
      this.setData({
       name:e.detail.value.trim()
      })
    }else if(e.currentTarget.dataset.name=='patriarch_name'){
      this.setData({
        patriarch_name:e.detail.value.trim()
       })
    }else if(e.currentTarget.dataset.name=='mobile'){
      this.setData({
        mobile:e.detail.value.trim()
       })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    console.log(options)
      wx.setNavigationBarTitle({
        title: '新增学员信息',
      })
    self = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      showSubmit: true,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.setStorageSync('address', '')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.setStorageSync('address', '')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})