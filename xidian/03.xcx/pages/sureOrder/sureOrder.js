// pages/flashDetail/flashDetail.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childvalue: '', //绑定学员人名
    childList: [], //弹框展示绑定学员列表
    nullchildList: [], //暂存绑定学员列表
    showChildList: [], //页面展示绑定定学员列表
    type: '',
    showDia: false,
    show_inviter:false,//是否显示教官码
    showAddInfo:false,
    child_name:'',
    child_phone:'',
    child_card:'',
    inviter_code:'',
    showSkeleton: true,
    num: '', // 数量
    curriculum_id: '', // 课程id
    curriculum_camp_id: '', // 营期id
    act_id: '', // 团购活动id
    team_id: '', // 参团id
    orderInfo: {},
    invite_code:'',
    showAlipay: false,
    is_iphonex: app.globalData.isiPhoneX,
    showSubmit: true,
    pay_link:'',
    payType: 0, //付款方式
    payList: [{
      name: '全款',
      id: 0
    }, {
      name: '定金',
      id: 1
    }],
    payIndex: 0,
    index: 0,
    modeList: [{
      name: '微信支付',
      id: 1
    }, {
      name: '支付宝支付',
      id: 6
    }],
    modeType: 1,
    studentList: [],
    choseStudentId: [] //学员id
  },
  getCode(e){
    console.log(e)
    this.setData({
      invite_code:e.detail.value
    })
  },
  // 添加学员信息弹框
  addInfo(){
    this.setData({
      showAddInfo:true
    })
  },
 // 取消展示弹框
  cancelChild(){
    this.setData({
      showAddInfo:false
    })
  },
  // 同班学员弹框
  showView() {
    this.setData({
      showDia: true,
      childList: this.data.showChildList
    })
  },
  // 删除学员
  clearChild(e) {
    for (let i = 0; i < this.data.childList.length; i++) {
      if (e.currentTarget.dataset.id == this.data.childList[i].id) {
        this.data.childList.splice(i, 1)
      }
    }
    this.setData({
      childList: this.data.childList
    })
  },
  burlInput(e) {
    console.log(e.detail.value)
    if(e.currentTarget.dataset.name=='name'){
      this.setData({
        child_name:e.detail.value
      })
    }else if(e.currentTarget.dataset.name=='phone'){
      this.setData({
        child_phone:e.detail.value
      })
    }else{
      this.setData({
        child_card:e.detail.value
      })
    }
  },
  addChild() {
    console.log(this.data.child_name)
    let flag=true
    let msg=''
    if(this.data.child_name==''){
       msg='姓名不可以为空'
       flag=false
    }
    if(this.data.child_phone==''&&this.data.child_card==''){
      msg='手机号和身份证号必填写一个'
      flag=false
    }
    if(this.data.child_name!=''&&!/^.{1,20}$/.test(this.data.child_name)){
      msg='姓名最大长度为20'
      flag=false
    }
    if(this.data.child_card!=''&&!/^(\d{18,18}|\d{17,17}X|\d{17,17}x)$/.test(this.data.child_card)){
      msg='身份证号格式不正确'
      flag=false
    }
    if(this.data.child_phone!=''&&!/^1\d{10}$/.test(this.data.child_phone)){
      msg='手机号格式不正确'
      flag=false
    }
    if(flag){
      if(this.data.childList.length<=5){
        this.data.childList.push({
          id: this.data.childList.length,
          name:this.data.child_name,
          phone:this.data.child_phone,
          id_card:this.data.child_card,
        })
        this.setData({
          childList: this.data.childList,
          showAddInfo:false,
          child_name:'',
          child_phone:'',
          child_card:'',
        })
      }else{
          wx.showToast({
            title: '最多只能输入五个学员',
            icon:'none',
            duration:1000
          })
      }
    }else{
      wx.showToast({
        title: msg,
        icon:'none',
        duration:1000
      })
    }
  },
  // 关闭弹框
  closeDia() {
    this.setData({
      showDia: false,
      childvalue: '',
      nullchildList: [],
      childList: [],
    })
    console.log('关闭弹框')
  },
  // 点击完成，关闭弹框
  closeModel(e) {
    this.setData({
      showDia: false,
      child_name:'',
      child_phone:'',
      child_card:'',
      showChildList: this.data.childList,
      childList: [],
    })
    console.log('点击完成')
  },
  deletChild(e) {
    this.data.showChildList.forEach((item,index) => {
      if (item.id == e.currentTarget.dataset.id) {
        this.data.showChildList.splice(index, 1)
      }
    })
    this.setData({
      showChildList: this.data.showChildList,
      childList: this.data.showChildList
    })
  },
  bindPickerChangeType(e) {
    this.setData({
      index: e.detail.value,
      modeType: this.data.modeList[e.detail.value].id
    })
  },
  bindPickerChange(e) {
    console.log(e)
    this.setData({
      payIndex: e.detail.value,
      payType: this.data.payList[e.detail.value].id
    })
  },
  choseAdd: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  goIndex: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  closeAlipay() {
    this.setData({
      showAlipay: false
    })
  },
  // 复制支付宝链接
  copyOrd(e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.pay_link,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  // 提交订单
  goOrder: function (e) {
    const that = this
    if (that.data.studentList.length == 0 || that.data.studentList.length < that.data.num) {
      let msg = ''
      if (that.data.studentList.length == 0) {
        msg = '请选择报名学员资料'
      }
      if (that.data.studentList.length != 0 && that.data.studentList.length < that.data.num) {
        msg = '学员数量不正确'
      }
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      })
    } else {
      if (that.data.showSubmit) {
        // let arr = []
        // this.data.showChildList.forEach((item) => {
        //   arr.push(item.name)
        // })
        wx.showLoading({
          title: '订单提交中...',
        })
        that.setData({
          showSubmit: false
        })
        if (this.data.type == 'normal') {
          console.log(that.data.orderInfo,that.data.invite_code,)
          var obj = {
            num: that.data.num,
            invite_code:that.data.invite_code,
            curriculum_id: that.data.curriculum_id,
            curriculum_camp_id: that.data.curriculum_camp_id,
            student_id: that.data.choseStudentId.join(','),
            related_name: that.data.showChildList.length>0?JSON.stringify(that.data.showChildList):'',
            is_front: that.data.payType
          }
          util.queryRequest('app/order/add', obj, 'POST').then(function (req) {
            wx.hideLoading()
            if (req.code === 200 || req.code === '200') {
              wx.showToast({
                title: '订单提交成功',
                icon: 'success',
                duration: 1000
              })
              wx.requestSubscribeMessage({
                tmplIds: [that.data.orderInfo.template_id],
                success(res) {
                  console.log(res, "成功")
                },
                complete(res) {
                  if (res[that.data.orderInfo.template_id] == "reject") {
                    wx.showModal({
                      title: '订阅通知被拒绝',
                      content: '如果勾选了"总是保持以上选择",打开消息订阅开关后请勾选要通知的消息',
                      success(res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success(res) {
                              res.subscriptionsSetting = {
                                withSubscriptions: true
                              }
                            }
                          })
                          console.log('用户点击确定')
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  } else {
                    console.log(res, "用户点击允许")
                  }
                  // console.log(res['dzKrSTTDeWdQ033WxVacCEar9HINRPKj6fXOvQwWS0c'], "complete")
                },
              })
              setTimeout(() => {
                wx.setStorageSync('source', 'create')
                wx.redirectTo({
                  url: '../payOrder/payOrder?order_id='+ req.data.order_id+'&type=1',
                })
                that.setData({
                  showSubmit: true
                })
              }, 1000)
            } else {
              setTimeout(() => {
                that.setData({
                  showSubmit: true
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              }, 1000)
              console.log(req.msg,'确认接口')
              wx.showToast({
                title: req.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else {
          // 团购
          console.log(that.data.orderInfo)
          console.log("显示邀请码",that.data.invite_code)
          var obj = {
            num: that.data.num,
            invite_code:that.data.invite_code,
            curriculum_id: that.data.curriculum_id,
            curriculum_camp_id: that.data.curriculum_camp_id,
            act_id: that.data.act_id,
            team_id: that.data.team_id,
            student_id: that.data.choseStudentId.join(','),
            related_name: that.data.showChildList.length>0?JSON.stringify(that.data.showChildList):'',
          }
          util.queryRequest('app/orderGroup/add', obj, 'POST').then(function (req) {
            wx.hideLoading()
            if (req.code === 200 || req.code === '200') {
              wx.showToast({
                title: '订单提交成功',
                icon: 'success',
                duration: 1000
              })
              wx.requestSubscribeMessage({
                tmplIds: [that.data.orderInfo.template_id],
                success(res) {
                  console.log(res, "成功")
                },
                complete(res) {
                  if (res[that.data.orderInfo.template_id] == "reject") {
                    wx.showModal({
                      title: '订阅通知被拒绝',
                      content: '如果勾选了"总是保持以上选择",打开消息订阅开关后请勾选要通知的消息',
                      success(res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success(res) {
                              res.subscriptionsSetting = {
                                withSubscriptions: true
                              }
                            }
                          })
                          console.log('用户点击确定')
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  } else {
                    console.log(res, "用户点击允许")
                  }
                  console.log(res['dzKrSTTDeWdQ033WxVacCEar9HINRPKj6fXOvQwWS0c'], "complete")
                },
              })
              setTimeout(() => {
                wx.setStorageSync('source', 'create')
                wx.redirectTo({
                  url: '../payOrder/payOrder?order_id='+ req.data.order_id+'&type=1',
                })
                that.setData({
                  showSubmit: true
                })
              }, 1000)
            } else {
              setTimeout(() => {
                that.setData({
                  showSubmit: true
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              }, 1000)
              wx.showToast({
                title: req.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
        setTimeout(()=>{
          that.setData({
            showSubmit: true
          })
        }, 5000)

      }
    }
  },
  getList: function () {
    const that = this
    if (this.data.type == 'normal') {
      util.queryRequest('app/order/confirmOrder', {
        num: that.data.num,
        curriculum_id: that.data.curriculum_id,
        curriculum_camp_id: that.data.curriculum_camp_id
      }, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          that.setData({
            orderInfo: res.data,
            showSkeleton: false
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          console.log(res.msg,"获取详情页面信息")
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    } else {
      // 团购
      util.queryRequest('app/orderGroup/confirmOrder', {
        num: that.data.num,
        curriculum_id: that.data.curriculum_id,
        curriculum_camp_id: that.data.curriculum_camp_id,
        act_id: that.data.act_id,
        team_id: that.data.team_id,
      }, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          that.setData({
            orderInfo: res.data,
            showSkeleton: false
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const that = this
    if (options.type == 'normal') {
      that.setData({
        num: options.num,
        curriculum_id: options.id,
        type: options.type,
        curriculum_camp_id: options.curriculum_camp_id,
      })
    } else {
      that.setData({
        num: options.num,
        curriculum_id: options.curriculum_id,
        type: options.type,
        curriculum_camp_id: options.curriculum_camp_id,
        act_id: options.act_id,
        team_id: options.team_id,
        payIndex: 1,
        payType: this.data.payList[1].id,
      })
    }
    if((wx.getStorageSync('userInfo').invite_code!=''&&wx.getStorageSync('userInfo').invite_code!=null&&wx.getStorageSync('userInfo').invite_code!=undefined)){
      this.setData({
        invite_code:wx.getStorageSync('userInfo').invite_code,
        show_inviter:true,
      })
    }else if(wx.getStorageSync('share_invite')!=''&&wx.getStorageSync('share_invite')!=null&&wx.getStorageSync('share_invite')!=undefined){
      this.setData({
        invite_code:wx.getStorageSync('share_invite'),
        show_inviter:true,
      })
    }
    console.log(this.data.invite_code,"邀请码",wx.getStorageSync('userInfo'),wx.getStorageSync('share_invite'))
    wx.setNavigationBarTitle({
      title: '确认订单',
    })
    // this.getOderDetail()
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
    const that = this
    console.log(wx.getStorageSync('sure_add') != '')
    if (wx.getStorageSync('sure_add') != '') {
      this.data.studentList = JSON.parse(wx.getStorageSync('sure_add'))
      this.data.choseStudentId = []
      for (let i = 0; i < that.data.studentList.length; i++) {
        that.data.studentList[i].firstName = that.data.studentList[i].name.substring(0, 1)
        that.data.choseStudentId.push(that.data.studentList[i].id)
      }
      this.setData({
        studentList: that.data.studentList,
        choseStudentId: that.data.choseStudentId
      })
      console.log(this.data.studentList)
    }
    this.getList()
      // 删除缓存支付宝
    wx.removeStorageSync('showAlipay')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide清除定时器")
    // wx.setStorageSync('sure_add','')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('sure_add')
    console.log("onUnload清除定时器")
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