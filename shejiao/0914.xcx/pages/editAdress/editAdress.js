// pages/editClientInfo/editClientInfo.js
let util = require('../../utils/util.js')
let parse = require('../../utils/address-parse.js')
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
    staticUrl: app.globalData.staticUrl,
    show_label_edit:false,//是否编辑过自定义地址
    is_disabled: false,
    showSkeleton:true,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    color:'#fff',
    adddressText: '添加',
    addInfo: {
      id: '',
      name: '',
      phone: '',
      area: '',
      addr: '',
      labelname: '',
      is_default: false,
    },
    is_iphonex: app.globalData.isiPhoneX,
    labelList: [{ name: '家', id: 1 }, { name: '公司', id: 2 }, { name: '学校', id: 3 }],
    cou_id: '',
    areaShow: ['请选择省', '市', '区'],
    areaShowId: [{ id: 1, name: '北京市' }, { id: 2, name: '北京市' }, { id: 3, local_name: '东城区' }],
    choseId:0,//选中标签的id
    form: {},
    isChose: 0,
    show: false,
    placeholdertext: '粘贴或者输入整段地址：点击"识别"自动拆分姓名、地址和电话。例如：王晓歌13955416586广东省深圳市南山区某某街道001号',
    isFocus: false,
    type: 'add',
    isInput: '',
    name: '',
    phone: '',
    area: '',
    addr: '',
    labelname: '',
    label:'',
    is_default: false,//是否选中自定义标签 默认没有选中false
    address: '',
    isShowFocus: '',
    id: '',
    showSubmit: true,
    choseId:'',//选择中的标签id
    labelvalue:'',
    isLable:true,//是否显示标签 默认为true 显示
   
  },
  // 输入值为标签名
  getInput(e){
    this.setData({
      labelvalue:e.detail.value
    })
  },
  burlInput(e){
      this.setData({
        labelvalue:e.detail.value
      })
  },
  // 获取选中标签id
  changeLabel(e){
    this.setData({
      is_default:true,
      choseId: e.currentTarget.dataset.id
    })
  },
  // 选择地址标签
  clickLabel(e){
    const that=this
    for (let i = 0; i < that.data.labelList.length; i++) {
      if (that.data.labelList[i].id == e.currentTarget.dataset.id) {
        this.setData({
          labelname: that.data.labelList[i].name,
          choseId:e.currentTarget.dataset.id,
          show_label_edit:false,
          labelvalue:'',
          isLable: false,
          is_default:true,
          choseId: e.currentTarget.dataset.id
        })
      }
    }
    e.detail.value = this.data.labelname
    that.validate(e)
  },
  // 编辑自定义标签
  editLabel(){
    this.setData({
      show_label_edit:false
    })
  },
  // 自定义标签确定
  sureLabel(){
    let fag=true
    let msg=''
    if(this.data.labelvalue==''){
      msg='请输入标签名称'
      fag=false
    }
    if(this.data.labelvalue!=''&&this.data.labelvalue.length>5){
      msg='标签名称最多五个字'
      fag=false
    }
    if(fag){
      wx.showToast({
        title: '添加成功',
        icon:'success',
        duration:1000,
      })
      this.setData({
        isLable: false,
        show_label_edit:true,
        choseId:0,
        labelname:this.data.labelvalue
      })
    }else{
      wx.showToast({
        title:msg,
        icon:'none',
        duration:1000,
      })
    }
  },
  choseinput(){
    this.setData({
      is_default: false,
      choseId:''
    })
  },
  formSubmit: function (e) {
    console.log(this.data.form, "form")
    console.log(this.data.addInfo)
    const that = this
    var list = e.detail.value
    list.area = this.data.areaShow
    list.label = this.data.labelname
    console.log(this.data.type)
    if (this.data.type != 'edit') {
      validateRequired(['name'], that)
      validateRequired(['phone'], that)
      validateRequired(['area'], that)
      validateRequired(['addr'], that)
    }
    if ('' === self.data.form.$invalidMsg) {
      if (this.data.type == 'add') {
        if (that.data.showSubmit) {
          that.setData({
            showSubmit: false,
          })
          var info_addr = {
            ship_name: list.name.trim(),
            ship_mobile: list.phone.replace(/ /g, ''),
            ship_province_id: that.data.areaShowId[0].id,
            ship_city_id: that.data.areaShowId[1].id,
            ship_county_id: that.data.areaShowId[2].id,
            ship_addr: list.addr,
            is_default: list.is_default == true ? '1' : '0',
            label: list.label
          }
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          util.queryRequest('/app/address/add', info_addr, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
              wx.showToast({
                title: '地址添加成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
                that.setData({
                  showSubmit: true,
                })
              }, 1000)
            }else{
              wx.hideLoading()
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 3000
              })
              console.log(res.msg)
              that.setData({
                showSubmit: true,
              })
            }
          })
        }
      } else {
        if (that.data.showSubmit) {
          that.setData({
            showSubmit: false,
          })
          var info_addr = {
            id: that.data.id,
            ship_name: list.name.trim(),
            ship_mobile: list.phone.replace(/ /g, ''),
            ship_province_id: that.data.areaShowId[0].id,
            ship_city_id: that.data.areaShowId[1].id,
            ship_county_id: that.data.areaShowId[2].id,
            ship_addr: list.addr,
            is_default: list.is_default == true ? '1' : '0',
            label: list.label
          }
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          util.queryRequest('/app/address/edit', info_addr, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
              wx.showToast({
                title: '地址修改成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
                that.setData({
                  showSubmit: true,
                })
              }, 1000)
            }else{
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 3000
              })
              console.log(res.msg)
              that.setData({
                showSubmit: true,
              })
            }
          })
        }
      }
    } else {
      console.log('valid')
    }
  },
  delAdd: function (e) {
    if (this.data.type=='edit'){
      const that=this
      wx.showModal({
        title: '提示',
        content: '是否删除当前地址',
        success: function (res) {
          if (res.confirm) {
            util.queryRequest('/app/address/remove', { id: that.data.id }, 'GET').then(function (res) {
              if (res.code === 200 || res.code === '200') {
                wx.showToast({
                  title: '删除成功',
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
                  duration: 3000
                })
                console.log(res.msg)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  sureSelectAreaListener: function (e) {
    var that = this;
    that.data.areaShow[0] = e.detail.currentTarget.dataset.province.name
    that.data.areaShow[1] = e.detail.currentTarget.dataset.city.name
    that.data.areaShow[2] = e.detail.currentTarget.dataset.area.local_name
    that.data.areaShowId[0] = e.detail.currentTarget.dataset.province
    that.data.areaShowId[1] = e.detail.currentTarget.dataset.city
    that.data.areaShowId[2] = e.detail.currentTarget.dataset.area
    that.setData({
      show: false,
      areaShow: that.data.areaShow,
      areaShowId: that.data.areaShowId,
      isChose: 1
    })
    e.detail.value = that.data.areaShow
    console.log(e,e.detail.value,"zhi")
    that.validate(e)
  },
  // 打开地区选择组件
  chooseAddress: function () {
    var that = this
    that.setData({
      show: true
    })
  },
  // 失去焦点
  lostblur: function (event) {
    this.setData({
      isInput: event.detail.value
    })
    console.log(this.data.isInput)
    if (this.data.isInput == '') {
      this.setData({
        isFocus: false,
        placeholdertext: '粘贴或者输入整段地址：点击"识别"自动拆分姓名、地址和电话。例如：王晓歌13955416586广东省深圳市南山区某某街道001号'
      })
    }
  },
  // 多行文本框输入
  inputAction: function (e) {
    this.setData({
      isInput: e.detail.value
    })
  },
  clearInput: function () {
    this.setData({
      isInput:''
    })
  },
  autoDiscern() {
    const that=this
    if(that.data.isInput!=''){
      this.data.form = {
        $dirty: true,
        $invalidMsg: "",
        name: '',
        phone: '',
        area: '',
        addr: '',
      }
      this.setData({
        addInfo: {
          id: '',
          name: '',
          phone: '',
          area: '',
          addr: '',
          labelname: '',
          is_default: false,
        },
        form: this.data.form,
      })
      console.log(that.data.form,"dkdkdk")
      let obj = parse.parse(this.data.isInput)
      console.log(obj,"地址识别")
      let arr = []
      let area = ''
      if (Object.keys(obj.province).length != 0 && Object.keys(obj.city).length != 0 && Object.keys(obj.area).length != 0) {
        arr = [obj.province.name, obj.city.name, obj.area.local_name]
        area = arr.join('/')
        that.data.areaShowId[0] = obj.province
        that.data.areaShowId[1] = obj.city
        that.data.areaShowId[2] = obj.area
        this.setData({
          isChose: 1
        })
      }else {
        area = ''
        this.setData({
          isChose: 0
        })
      }
      this.data.addInfo = {
        id: that.data.id,
        name: obj.name,
        phone: obj.mobile.replace(/ /g, ''),
        area: area,
        addr: obj.addr,
        labelname: that.data.labelname,
        is_disabled: that.data.is_disabled
      }
      that.setData({
        areaShow: arr,
        areaShowId: that.data.areaShowId,
        addInfo: that.data.addInfo,
        form: that.data.form,
        name: obj.name,
        phone: obj.mobile,
        area: area,
        addr: obj.addr,
      })
      console.log(that.data.form,"form")
      validateRequired(['name'], that)
      validateRequired(['phone'], that)
      validateRequired(['area'], that)
      validateRequired(['addr'], that)
    }
  },
  validate(e) {
    if (e.currentTarget.dataset.name == 'area') {
      if (e.detail.value.length == 0) {
        e.detail.value = ''
      } else {
        this.setData({
          areaShow: e.detail.value
        })
        e.detail.value = e.detail.value[0] + '/' + e.detail.value[1] + '/' + e.detail.value[2]
      }
    }
    if (e)
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value.replace(/ /g, '')
    })
    console.log(this.data.form)
    validate(e, this)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    if (options.type == 'edit') {
      this.data.form = {
        $dirty: true,
        $invalidMsg: "",
        name: '',
        phone: '',
        area: '',
        addr: '',
      }
      this.setData({
        form: this.data.form,
        adddressText:'编辑'
      })
      util.queryRequest('/app/address/detail', { id: options.id}, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          var info = res.data
          that.data.addInfo = {
            id: info.id,
            name: info.ship_name,
            phone: info.ship_mobile,
            area: info.ship_area,
            addr: info.ship_addr,
            labelname: info.label,
            is_default: info.is_default=='1'?true:false,
          }
          if (info.label!=''){
            that.data.labelList.forEach(function (item, index) {
              if (item.name == info.label){
                that.data.choseId = item.id
                that.data.isLable=false
                that.data.labelname = info.label
                that.data.is_default=true
              }
            })
          }
          if(info.label!=''&&!that.data.is_default){
            that.data.isLable=false
            that.data.labelvalue = info.label
            that.data.isLable=false
            that.data.labelname = info.label
            that.data.show_label_edit=true
            that.data.is_default=false
          }
          that.data.areaShow = that.data.addInfo.area.split('/')
          that.data.areaShowId = [{ id: info.ship_province_id, name: that.data.areaShow[0] }, { id: info.ship_city_id, name: that.data.areaShow[1] }, { id: info.ship_county_id, local_name: that.data.areaShow[2] }]
          that.setData({
            addInfo: that.data.addInfo,
            showSkeleton:false,
            show_label_edit:that.data.show_label_edit,
            areaShow: that.data.areaShow,
            areaShowId: that.data.areaShowId,
            choseId: that.data.choseId,
            labelname: that.data.labelname,
            isLable:that.data.isLable,
            is_default:that.data.is_default,
            labelvalue:that.data.labelvalue,
            isChose: 1,
            id: info.id,
            type: options.type
          })
          console.log(that.data.labelvalue)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
          console.log(res.msg)
        }
      })
    } else if (options.type == 'change') {
      this.data.form = {
        $dirty: true,
        $invalidMsg: "",
        addr: "",
        area: "",
        name: "",
        phone: "",
        labelname: '',
        is_default: false,
      }
      var pages = getCurrentPages();
      var secondPage = pages[pages.length - 2]; //上一个页面
      this.data.addInfo = {
        cou_id: secondPage.data.couId,
        order_id: secondPage.data.order.order_id,
        name: secondPage.data.order.ship_name,
        phone: secondPage.data.order.ship_mobile,
        area: secondPage.data.order.ship_area,
        addr: secondPage.data.order.ship_addr
      }
      this.data.areaShow = this.data.addInfo.area.split('/')
      this.setData({
        addInfo: this.data.addInfo,
        areaShow: this.data.areaShow,
        showSkeleton:false,
        isChose: 1
      })
    }else{
      this.setData({
        showSkeleton:false,
      })
    }
    wx.setNavigationBarTitle({
      title:this.data.adddressText+'收获地址',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e13816',
    })
    self = this
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