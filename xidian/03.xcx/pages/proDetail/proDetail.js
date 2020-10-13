// pages/flashSalesDetail/flashSalesDetail.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    like_num: 0,
    showSkeleton: true,
    modelShow: true,
    recommPros: [],
    specNum: '1',
    imgUrls: [],
    showCamp:true,
    dayList:[],//营期日期天数选择列表
    allDayList:[],
    campId:'',//选中营期
    dayId:'',//选中营期天数
    specList: [],//营期数据
    showSpec: {},
    isLogin: false,
    is_iphonex: app.globalData.isiPhoneX,
    isTop: true,
    topNum: 0,
    indicatorDots: true,
    autoplay: true,
    id: '',
    interval: 5000,
    duration: 1000,
    courseDetail: {},
    colum: 0,
    specNum: 1,
    showGui: true,
    isUp: '',
    height: '',
    checkBind: '1',
    shareUrl: '',
    shareImg: '',
    shareTitle: '',
  },
  // getFirstimgHeight: function (e) {
  //   console.log(e)
  //   console.log(e.currentTarget.id)
  //   console.log(this.data.imgUrls)
  //   if (e.currentTarget.id == 0) {
  //     this.setData({
  //       imgHeight: (getApp().globalData.useWindowwidth/e.detail.width) * e.detail.height
  //     })
  //     console.log(e.detail.height)
  //   }
  // },
  // 获取推荐商品
  getDetail() {
    let that = this
    util.queryRequest('app/curriculum/recommendCurr', {
      id: that.data.id,
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        // 整理规格信息
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].image = res.data[i].image.split(",")[0]
        }
        that.setData({
          recommPros: res.data
        })
      }
    }).catch(function (res) {})
  },
  goLink: util.throttle(function (event) {
    console.log(event, "sdlf")
    wx.redirectTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  // 点赞
  collPro: util.throttle(function () {
    if (util.isLogin()) {
      let that = this
      let num = parseInt(that.data.like_num)
      console.log(num)
      this.data.courseDetail.isCollect = !this.data.courseDetail.isCollect
      if (this.data.courseDetail.isCollect) {
        // 点赞课程
        util.queryRequest('app/footOther/likeAdd', {
          c_id: that.data.id,
          type: 0,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
            num = num + 1
            that.setData({
              courseDetail: that.data.courseDetail,
              like_num: num
            })
            console.log(num, "jia")
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        // 取消点赞
        util.queryRequest('app/footOther/cancelLike', {
          c_id: that.data.id,
          type: 0,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '取消点赞成功',
              icon: 'success',
              duration: 1000
            })
            num = num - 1
            that.setData({
              courseDetail: that.data.courseDetail,
              like_num: num
            })
            console.log(num, "jian")
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }
  }),
  goIndex: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  showguiModel: function () {
    this.setData({
      modelShow: !this.data.modelShow
    })
  },
  closeGui: function () {
    this.setData({
      modelShow: !this.data.modelShow
    })
  },
  //立即抢购 显示规格弹框
  closeModel: function () {
    const that = this
    // if (util.isLogin()) {
    that.setData({
      modelShow: !that.data.modelShow
    })
    // }else{
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '您当前未登录，是否立即前往登录?',
    //     success(res) {
    //       if (res.confirm) {
    //         if (wx.getStorageSync('invite_id') != undefined && wx.getStorageSync('invite_id') != '') {
    //           wx.setStorageSync('invite_id', '')
    //           wx.setStorageSync('discount_id', '')
    //         }
    //         console.log('用户点击确定')
    //         wx.navigateTo({
    //           url: '/pages/userAuz/userAuz'
    //         })
    //         wx.setStorageSync("userInfo", '')
    //       } else if (res.cancel) {
    //         if (wx.getStorageSync('invite_id') != undefined && wx.getStorageSync('invite_id') != '') {
    //           wx.setStorageSync('invite_id', '')
    //           wx.setStorageSync('discount_id', '')
    //         }
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
  },
  viewImg: function (e) {
    var arr = []
    arr.push(e.currentTarget.dataset.url)
    wx.previewImage({
      //当前显示图片
      current: arr[0],
      urls: arr
    })
  },
  //选择天数
  choseType: function (e) {
    var that = this
    var slist = this.data.allDayList
    // 选中规格高亮显示
    for (let i = 0; i < slist.length; i++) {
      // slist[i].ischose = false 
      if (e.currentTarget.dataset.pid == slist[i].camp_day) {
        that.data.dayList= slist[i].camp_time
        that.data.campId=slist[i].camp_day
        // that.data.dayId=slist[i].days[0].id
      }

    }
   that.setData({
    dayList:that.data.dayList,
    campId:that.data.campId,
   })
    
  },
  // 选择天数对应的营期
  choseDay(e){
    const that=this
    let slist=that.data.specList
    for(let i=0;i<slist.length;i++){
      if(e.currentTarget.dataset.pid == slist[i].id){
        this.data.dayId=slist[i].id
      }
    }
    this.setData({
      dayId:this.data.dayId
    })
    this.sureCamp()
  },
  //增加购买数量
  addNum: function (event) {
    const that = this
    let id = event.target.id
    let value = parseInt(this.data.specNum)
    value++
    this.setData({
      specNum: value
    })
    // if (Number(this.data.specNum) > Number(this.data.colum)){
    //   wx.showModal({
    //     title: '提示',
    //     content: '超出购买数量~',
    //     showCancel: false,
    //     confirmText: '我知道了',
    //     success(res) {
    //       if (res.confirm) {
    //         that.setData({
    //           specNum: that.data.colum
    //         })
    //       }
    //     }
    //   })
    // }
  },
  //输入购买数量
  changeValue: function (e) {
    const that = this
    if (Number(e.detail.value) <= 1) {
      this.data.specNum = 1
      this.setData({
        specNum: 1
      })
    } else {
      this.setData({
        specNum: e.detail.value
      })
      // if (Number(this.data.specNum) > Number(this.data.colum)){
      //   wx.showModal({
      //     title: '提示',
      //     content: '超出购买数量~',
      //     showCancel: false,
      //     confirmText: '我知道了',
      //     success(res) {
      //       if (res.confirm) {
      //         that.setData({
      //           specNum: that.data.colum
      //         })
      //       }
      //     }
      //   })
      // }
    }
  },
  //减少购买数量
  lessNum: function (event) {
    let id = event.target.id
    let value = parseInt(this.data.specNum)
    if (Number(value) <= 1) {
      this.setData({
        specNum: 1
      })
    } else {
      value--
    }
    this.setData({
      specNum: value
    })
  },
  //获取限时抢购页面信息
  getproductInfo: function () {
    const that = this
    util.queryRequest('app/curriculum/get', {
      id: that.data.id,
    }, 'GET').then(function (res) {
      wx.hideLoading()
      if (res.code == 200) {
        that.setData({
          showSkeleton: false,
        })
        var staticArr = {}
        let dayList=[]
        if (res.data.camp.length > 0) {
          for (var i = 0; i < res.data.camp.length; i++) {
            res.data.camp[i].ischose = false
            if (res.data.default_camp_id == res.data.camp[i].id) {
              staticArr = res.data.camp[i]
              res.data.camp[i].ischose = true
            }
          }
          res.data.people_num = parseInt(res.data.people_num)
          res.data.num = parseInt(res.data.num)
          res.data.people_num_static = staticArr.people_num
          res.data.num_static = staticArr.num
        }
        if(res.data.spec.length>0){
          for(let j=0;j<res.data.spec.length;j++){
            if(staticArr.camp_day==res.data.spec[j].camp_day){
              dayList=res.data.spec[j].camp_time
            }
          }
        }
        console.log(res.data)
        console.log(staticArr)
        that.setData({
          dayList:dayList,
          allDayList:res.data.spec,
          like_num: res.data.like_num,
          shareImg: res.data.image[0],
          shareTitle: '【有人@你】' + res.data.name,
          showSpec: staticArr,
          colum: res.data.num,
          showSkeleton: false,
          specList: res.data.camp,
          campId: staticArr.camp_day,//选中营期
          dayId: res.data.default_camp_id,//选中营期天数
          imgUrls: res.data.image,
          courseDetail: res.data
        })
        var proDetail = ''
        proDetail = res.data.intro
        WxParse.wxParse('proDetail', 'html', proDetail, that, 10);
        // wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
              console.log("用户点击了确定")
            }
          }
        })
      }
    })
  },
  //确认购买
  rightBuy: function (e) {
    const that = this
    // if (util.isLogin()) {
    if (util.isLogin()) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link + '?id=' + that.data.id + '&num=' + that.data.specNum + '&curriculum_camp_id=' + this.data.showSpec.id + '&type=normal',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }
  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      if (this.data.isTop) {
        this.setData({
          isTop: false
        })
      }
    } else {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  returnTop: function () {
    this.setData({
      isTop: true
    })
    if (this.data.topNum == 0) {
      this.setData({
        topNum: 1
      })
    } else {
      this.setData({
        topNum: 0
      })
    }
  },
  // 未登录点击分享
  toshare() {
    if (!util.isLogin()) {
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }
  },
  // 营期弹框出现
  choseCamp(){
    for(let j=0;j<this.data.allDayList.length;j++){
      if(this.data.showSpec.camp_day==this.data.allDayList[j].camp_day){
        this.data.dayList=this.data.allDayList[j].camp_time
      }
    }
    this.setData({
      showCamp:false,
      dayList:this.data.dayList,
      campId:this.data.showSpec.camp_day,
      dayId:this.data.showSpec.id
    })
  },
  // 关闭营期弹框
  closeCamp(){
    this.setData({
      showCamp:true
    })
  },
  sureCamp(){
    const that=this
    let slist=that.data.specList
    for(let i=0;i<slist.length;i++){
      if(this.data.dayId == slist[i].id){
        this.data.courseDetail.people_num_static = slist[i].people_num
        this.data.courseDetail.price_sell = slist[i].price_sell
        this.data.courseDetail.price_market = slist[i].price_market
        this.data.courseDetail.num_static = slist[i].num
        this.data.colum = slist[i].num,
        this.data.showSpec = slist[i]
      }
    }
    this.setData({
      colum: this.data.colum,
      courseDetail: this.data.courseDetail,
      showSpec: this.data.showSpec,
      showCamp:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.hideShareMenu()
    console.log(options, "活动id")
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        isLogin: true,
      })
      // 登录的前提下,判断邀请码不为空,并且角色为用户的情况下保存邀请码
      if (options.invite_code != undefined && options.invite_code != '' && wx.getStorageSync('userInfo').invite_code == '') {
        let that = this
        util.queryRequest('app/member/memberInvite', {
          share_invite_code: options.invite_code,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            console.log("onLoad邀请码保存成功",options.invite_code)
            let info = wx.getStorageSync('userInfo')
            info.share_invite_code = res.data.share_invite_code
            wx.setStorageSync('userInfo', info)
            wx.setStorageSync('share_invite', res.data.share_invite_code)
            console.log("最新的用户信息",info)

          }
        })
      }
    }
    if (options.id != undefined) {
      that.setData({
        id: options.id
      })
    }
    // 获取下单的教官码
    if (options.invite_code != undefined && options.invite_code != '') {
      wx.setStorageSync('share_invite', options.invite_code)
      console.log(options.invite_code, "邀请码")
    } else {
      if (wx.getStorageSync('userInfo').share_invite_code != '' && wx.getStorageSync('userInfo').share_invite_code != undefined) {
        wx.setStorageSync('share_invite', wx.getStorageSync('userInfo').share_invite_code)
      } else {
        // wx.setStorageSync('share_invite', '')
      }
    }
    console.log('获取下单的教官码',wx.getStorageSync('share_invite'))
    wx.setNavigationBarTitle({
      title: '课程详情',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f7f7f7',
    })
    // let share_url = util.getFullUrl()
    // // 获取要分享出去的邀请码，判断是教官获取用户信息里的，如果是用户，先判断用户信息里的分享邀请码有没有，没有就取分享参数里的邀请码
    // let invite_code = ''
    // if (wx.getStorageSync('userInfo').invite_code != '' && wx.getStorageSync('userInfo').invite_code != undefined) {
    //   // 教官
    //   invite_code = wx.getStorageSync('userInfo').invite_code
    // } else {
    //   // 用户
    //   if (options.invite_code != undefined && options.invite_code != '') {
    //     invite_code = options.invite_code
    //   } else {
    //     if (wx.getStorageSync('userInfo').share_invite_code != '' &&wx.getStorageSync('userInfo').share_invite_code!=null && wx.getStorageSync('userInfo').share_invite_code != undefined) {
    //       invite_code = wx.getStorageSync('userInfo').share_invite_code
    //     } else {
    //       invite_code = ''
    //     }
    //   }
    // }
    // // let invite_code= (wx.getStorageSync('userInfo').invite_code!=''&&wx.getStorageSync('userInfo').invite_code!=undefined)?wx.getStorageSync('userInfo').invite_code:''
    // this.data.shareUrl = share_url + 'invite_code=' + invite_code
    // this.setData({
    //   shareUrl: this.data.shareUrl
    // })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
    this.getproductInfo()
    this.getDetail()
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
    wx.removeStorageSync('sure_add')
    // 删除缓存支付宝
    wx.removeStorageSync('showAlipay')
    // this.getproductInfo()
    // this.getDetail()
    // wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(this.data.shareTitle)
      console.log(this.data.shareUrl)
      console.log(this.data.shareImg)
      console.log("获取最新的分享路径")
      let share_url = util.getFullUrl()
      console.log("获取用户信息",wx.getStorageSync('userInfo'))
      // 获取要分享出去的邀请码，判断是教官获取用户信息里的，如果是用户，先判断用户信息里的分享邀请码有没有，没有就取分享参数里的邀请码
      let invite_code = ''
      if(wx.getStorageSync('userInfo').invite_code!=''&&wx.getStorageSync('userInfo').invite_code!=undefined){
        // 教官
        invite_code = wx.getStorageSync('userInfo').invite_code
        console.log('教官邀请码' + invite_code)
      }else{
        // 用户
        if(wx.getStorageSync('userInfo').share_invite_code!=''&&wx.getStorageSync('userInfo').share_invite_code!=null&&wx.getStorageSync('userInfo').share_invite_code!=undefined){
          invite_code = wx.getStorageSync('userInfo').share_invite_code
        }else{
          invite_code = ''
        }
      }
      this.data.shareUrl = share_url + 'invite_code=' + invite_code
      this.setData({
        shareUrl:this.data.shareUrl
      })
      console.log(this.data.shareUrl)
      // 添加分享记录
      let that = this
      util.queryRequest('app/footOther/shareAdd', {
        c_id: that.data.id,
        type: 0,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log("添加分享成功")
        }
      })
      // 来自页面内转发按钮
      return {
        title: this.data.shareTitle,
        imageUrl: this.data.shareImg,
        path: this.data.shareUrl
      }
    }
  }
})