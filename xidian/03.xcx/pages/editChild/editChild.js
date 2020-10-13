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
    editname: '新增地址',
    host:'',//图片域名
    superList:[],//监护人列表
    modeList:[
      {id:0,name:'女'},
      {id:1,name:'男'},
    ],
    superModeList:[
      {id:1,name:'男'},
      {id:2,name:' 女'},
    ],
    concatModeList:[
      {id:1,name:'父亲'},
      {id:2,name:'母亲'},
      {id:3,name:'爷爷'},
      {id:4,name:'奶奶'},
      {id:5,name:'老师'},
      {id:6,name:'同学'},
      {id:7,name:'同事'},
      {id:8,name:'朋友'},
      {id:0,name:'其他'},
    ],
    apiUrl: app.globalData.apiUrl,
    img_type:'student',// 头像是学员头像还是监护人头像
    index:'0',//选择性别索引
    superindex:'0',//监护人性别索引
    consctindex:'0',//学员关系索引
    //学员信息
    image:'',
    name: '',
    mobile:'',
    hieght:'',
    weight:'',
    contact_way:'',
    number:'',
    gender: '',
    birthday:'',
     //监护人信息
    super_image:'',
    super_name:'',
    super_phone:'',
    super_gender:'',
    super_concat:'',
    super_type:'add',
    super_index:0,
    showSkeleton: true, //骨架屏显示隐藏
    is_iphonex: app.globalData.isiPhoneX,
    type: 'new',
    id:'',
    showAddInfo:false,//监护人弹框
    showSubmit:true,
  },
  // 选择学员头像
  changeImage(e){
    wx.chooseImage({
      count:1,
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
  editSuper(e){
    const that=this
    console.log(e,)
    for(let i=0;i<this.data.superList.length;i++){
      if(e.currentTarget.dataset.index==i){
        for(let j=0;j<this.data.concatModeList.length;j++){
          if(this.data.concatModeList[j].id==this.data.superList[i].relation){
            that.data.consctindex=j
          }
        }
        this.setData({
          super_image:this.data.superList[i].image,
          super_name:this.data.superList[i].name,
          super_phone:this.data.superList[i].mobile,
          super_gender:this.data.superList[i].sex,
          superindex:this.data.superList[i].sex==1?'0':'1',
          consctindex:this.data.consctindex,
          super_concat:this.data.superList[i].relation,
          showAddInfo:true,
          super_type:'edit',
          super_index:e.currentTarget.dataset.index,
        })
        console.log(i)
      }
    }
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
          console.log(res,"值")
          const data = JSON.parse(res.data)
          let image=data.data.path_name
          if(that.data.img_type=='student'){
            that.setData({
              image: image,
              host:data.data.image_url,
              visible:false
            })
          }else{
            that.setData({
              super_image: image,
              host:data.data.image_url,
              visible:false
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
  // 关闭监护人弹框
  goBack(){
    this.setData({
      showAddInfo:false
    })
  },
  // 保存监护人
  saveSuper(){
    const that=this
    console.log(that.data.super_phone)
    console.log(that.data.super_name)
    let msg=''
    let flag=true
    if(that.data.super_phone==''){
      msg='监护人电话不可以为空'
      flag=false
    }
    if(that.data.super_name==''){
      msg='监护人姓名不可以为空'
      flag=false
    }
    if(that.data.super_phone!=''&&!/^1\d{10}$/.test(that.data.super_phone)){
      msg='监护人电话格式不正确'
      flag=false
    }
    if(that.data.super_name!=''&&that.data.super_name.length>20){
      msg='监护人姓名最大长度为20'
      flag=false
    }
    if(flag){
      if(this.data.super_type=='add'){
        console.log(this.data.super_image,"图片add")
        this.data.superList.push(
          {
            name: this.data.super_name,
            image:this.data.super_image,
            mobile: this.data.super_phone,
            sex: this.data.super_gender==''?0: this.data.super_gender,
            relation: this.data.super_concat,
          }
        )
     
      }else{
       for(let i=0;i<this.data.superList.length;i++){
        if(this.data.super_index==i){
          console.log(this.data.super_image,"图片edit")
           let super_item={
            name: this.data.super_name,
            image:this.data.super_image,
            mobile: this.data.super_phone,
            sex: this.data.super_gender==''?0: this.data.super_gender,
            relation: this.data.super_concat,
           }
           this.data.superList[i]=super_item
        }
       }
      }
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
  addSuper(){
    this.setData({
      showAddInfo:true,
      super_type:'add',
      super_image:'',
      super_name:'',
      super_phone:'',
      super_gender:'',
      super_concat:'',
    })
  },
  // 选择学员性别
  bindPickerChangeType(e){
    console.log(e)
    console.log(this.data.modeList[e.detail.value])
    this.setData({
      index:e.detail.value,
      gender:this.data.modeList[e.detail.value].id
    })
  },
  // 监护人性别
  bindPickerSuper(e){
    console.log(e)
    this.setData({
      superindex:e.detail.value,
      super_gender:this.data.superModeList[e.detail.value].id
    })
  },
  // 监护人关系
  bindPickerConcat(e){
    this.setData({
      consctindex:e.detail.value,
      super_concat:this.data.concatModeList[e.detail.value].id
    })
  },
  // 选择生日
  bindDateChange: function(e) {
    console.log(e)
    this.setData({
      birthday:e.detail.value
    })
  },
  // 保存学员信息
  submit: function(e) {
    const that=this
    let msg=''
    let flag=true
    if(that.data.superList.length==0){
      msg='请填写监护人'
      flag=false
    }
    if(that.data.number!=''&& !/^(\d{18,18}|\d{17,17}X|\d{17,17}x)$/.test(that.data.number)){
      msg='身份证号输入不正确'
      flag=false
    }
    if(that.data.birthday==''){
      msg='请选择学员生日'
      flag=false
    }
    if(that.data.gender===''){
      msg='请选择学员性别'
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
        if (this.data.type == 'new') {
          if (that.data.showSubmit) {
            that.setData({
              showSubmit:false,
            })
            console.log(that.data.image,"tupian")
            var info_child = {
              name:that.data.name,
              image: that.data.image,
              gender:that.data.gender,
              height:that.data.height,
              contact_way:that.data.contact_way,
              weight:that.data.weight,
              number:that.data.number,
              birthday:that.data.birthday,
              guardians:JSON.stringify(that.data.superList)
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
        } else{
          if (that.data.showSubmit){
            that.setData({
              showSubmit: false,
            })
            var info_child = {
              id: that.data.id,
              name:that.data.name,
              image: that.data.image,
              contact_way:that.data.contact_way,
              height:that.data.height,
              weight:that.data.weight,
              number:that.data.number,
              gender:that.data.gender,
              // gender:that.data.gender=='男'?1:(that.data.gender=='女'?0:that.data.gender),
              birthday:that.data.birthday,
              guardians:JSON.stringify(that.data.superList)
            }
            wx.showLoading({
              title: '加载中...',
              mask: true
            })
            util.queryRequest('app/student/update',info_child, 'POST').then(function (res) {
              if (res.code == 200) {
                wx.hideLoading()
                wx.showToast({
                  title: '修改成功',
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
        }
      } else {
        wx.showToast({
          title: msg,
          icon:'none',
          duration:1000
        })
      }
  },
  // 失去焦点获取信息
  validate(e) {
    console.log(e)
    if(e.currentTarget.dataset.name=='name'){
      this.setData({
       name:e.detail.value.trim()
      })
    }else if(e.currentTarget.dataset.name=='number'){
      this.setData({
        number:e.detail.value.trim()
       })
    }else if(e.currentTarget.dataset.name=='height'){
      let height=''
      if(e.detail.value.trim()!=''){
        height=parseFloat(e.detail.value.trim()).toFixed(1)
      }
      this.setData({
        height:height
       })
    }else if(e.currentTarget.dataset.name=='weight'){
      let weight=''
      if(e.detail.value.trim()!=''){
        weight=parseFloat(e.detail.value.trim()).toFixed(1)
      }
      this.setData({
        weight:weight
       })
    }else if(e.currentTarget.dataset.name=='contact_way'){
      this.setData({
        contact_way:e.detail.value.trim()
       })
    }else if(e.currentTarget.dataset.name=='super_name'){
      this.setData({
        super_name:e.detail.value.trim()
       })
    }else if(e.currentTarget.dataset.name=='super_phone'){
      this.setData({
        super_phone:e.detail.value.trim()
       })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    console.log(options)
    that.setData({
      endDate: util.formatDate(parseInt(new Date().getTime()/1000))
    })
    console.log(that.data.endDate)
    if (options.type == 'edit'||options.type == 'complement') {
      wx.setNavigationBarTitle({
        title: '编辑学员信息',
      })
      util.queryRequest('app/student/get', {
       id:options.id
     }, 'GET').then(function (res) {
       if (res.code === 200 || res.code === '200') {
          for(let i=0;i<that.data.modeList.length;i++){
            if(res.data.gender==that.data.modeList[i].id){
              that.data.index=i
              that.data.gender=that.data.modeList[i].id
              console.log(that.data.index,"salkfj")
            }
          }
          that.setData({
            name:res.data.name,
            image:res.data.image,
            gender:that.data.gender,
            contact_way:res.data.contact_way,
            birthday:res.data.birthday,
            height:res.data.height!='0.0'?res.data.height:'',
            weight:res.data.weight!='0.0'?res.data.weight:'',
            number:res.data.number,
            host:res.data.host,
            superList:res.data.guardians,
            id: options.id,
            index:that.data.index,
            type: options.type,
            showSkeleton:false
          })
       }
     })
    }else {
      wx.setNavigationBarTitle({
        title: '新增学员信息',
      })
      this.setData({
        showSkeleton:false
      })
    }
    console.log(this.data.form)
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
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
   
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