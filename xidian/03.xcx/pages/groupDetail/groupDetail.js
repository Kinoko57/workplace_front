// pages/flashSalesDetail/flashSalesDetail.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team_id: '',
    g_list_height: 0,
    c_id: '',
    groupShow: true,
    timer: false,
    showSkeleton: true,
    showcourseDetail: false,
    modelShow: true,
    groupList: [],
    specNum: 1,
    invite_code:'',
    like_num: 0,// 点赞数
    imgUrls: [],
    specList: [],
    allProList: [],
    showSpec: {},
    chosegui: [],
    activityStatus: 0, // 活动状态 0是未开始，2是进行中，1是已结束
    startTime: null, // 开始时间
    endTime: null, // 结束时间
    saleTime: [], // 显示倒计时的时间
    time: null, // 延时器
    isend: false,
    isShowNum: false,
    is_iphonex: app.globalData.isiPhoneX,
    indicatorDots: true,
    isTop: true,
    topNum: 0,
    autoplay: true,
    id: 0,
    interval: 5000,
    duration: 1000,
    courseDetail: {},
    colum: 0,
    total: 0,
    decNum: 0,
    closeDia: false,
    allNum: 0,
    specNum: 1,
    showGui: true,
    isUp: '',
    time: '',
    height: '',
    maxNum: 0,
    showColor: true,
    limitStatus: '',
    checkBind: '1',
    shareUrl:'',
    shareImg: '',
    shareTitle: '',
    showCamp:true,
    dayList:[],//营期日期天数选择列表
    allDayList:[],
    campId:'',//选中营期
    dayId:'',//选中营期天数
    isLogin: false
  },
  closeGroup: function() {
    this.setData({
      groupShow: !this.data.groupShow
    })
  },
  moreGroup: function() {
    this.setData({
      groupShow: false
    })
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
    // 获取推荐商品
  getDetail() {
      let that = this
      util.queryRequest('app/groupbuy/recommendGroup', {
        id: that.data.id,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          // 整理规格信息
          for(let i=0;i<res.data.length;i++){
            res.data[i].image=res.data[i].image.split(",")[0]
          }
          that.setData({
            recommPros: res.data
          })
        }
      }).catch(function (res) {})
 },
 goLink: util.throttle(function (event) {
    wx.redirectTo({
       url: event[0].currentTarget.dataset.link
    })
  }),
    // 点赞
    collPro: util.throttle(function () {
      let that = this
      if(util.isLogin()){
      if (this.data.courseDetail.isCollect==0) {
        this.data.like_num = this.data.like_num + 1
        this.data.courseDetail.isCollect = 1
        // 点赞课程
        util.queryRequest('app/footOther/likeAdd', {
          c_id:that.data.c_id,
          type:0,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(()=>{
              that.setData({
                like_num:that.data.like_num,
                courseDetail: that.data.courseDetail
              })
            },1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        that.data.like_num = that.data.like_num - 1
        that.data.courseDetail.isCollect = 0
        // 取消点赞
        util.queryRequest('app/footOther/cancelLike', {
          c_id: that.data.c_id,
          type:0,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '取消点赞成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(()=>{
              that.setData({
                like_num:that.data.like_num,
                courseDetail: that.data.courseDetail
              })
            },1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }}else{
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
  goGroupResult: util.throttle(function (e) {
    console.log(e[0].currentTarget.dataset.link)
    console.log(e[0].currentTarget.dataset.gid)
    console.log(e[0].currentTarget.dataset.tid)
    let link = e[0].currentTarget.dataset.link
    let gid = e[0].currentTarget.dataset.gid
    let tid = e[0].currentTarget.dataset.tid
    wx.navigateTo({
      url: link + '&group_id=' + gid + '&team_id=' +tid,
    })
  }),
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
  // 去拼团保留team_id
  addGroup:util.throttle(function(e){
    console.log(e[0].currentTarget.id)
    const that = this
    that.setData({
      team_id: e[0].currentTarget.id,
      modelShow: !that.data.modelShow
    })
  }),
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
    // var that = this
    // var slist = this.data.specList
    // // 选中规格高亮显示
    // for (let i = 0; i < slist.length; i++) {
    //   slist[i].ischose = false
    //   if (e.currentTarget.id == slist[i].id) {
    //     slist[i].ischose = true
    //     this.data.courseDetail.people_num_static=slist[i].people_num
    //     this.data.courseDetail.num_static=slist[i].num
    //     this.data.colum = slist[i].num,
    //     this.data.showSpec = slist[i]
    //   }
    // }
    // this.setData({
    //   specList: slist,
    //   colum: this.data.colum,
    //   courseDetail: this.data.courseDetail,
    //   showSpec: this.data.showSpec
    // })
  },
   // 选择天数对应的营期
   choseDay(e){
    const that=this
    let slist=that.data.specList
    for(let i=0;i<slist.length;i++){
      if(e.currentTarget.dataset.pid  == slist[i].id){
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
    util.queryRequest('app/groupbuy/get', {
      id: that.data.id,
    }, 'GET').then(function (res) {
      wx.hideLoading()
      if (res.code == 200) {
        that.setData({
          showSkeleton: false,
          // isUp: res.data.status
        })
        // var allNum = Number(res.data.total) + Number(res.data.store)
        var staticArr = {}
        var dayList = []
        if (res.data.camp.length>0){
          for (var i = 0; i < res.data.camp.length; i++) {
            res.data.camp[i].ischose = false
            if (res.data.default_camp_id == res.data.camp[i].id) {
              staticArr = res.data.camp[i]
              res.data.camp[i].ischose = true
            }
          }
          // staticArr = res.data.camp[0]
          // res.data.people_num= res.data.camp[0].people_num
          // res.data.num= res.data.camp[0].num
          // let flag = true
          // for (var i = 0; i < res.data.camp.length; i++) {
          //   res.data.camp[i].ischose = false
          //   if(res.data.camp[i].people_num < res.data.camp[i].num){
          //     res.data.camp[i].ischose = true
          //     staticArr = res.data.camp[i]
          //     flag = false
          //     break;
          //   }
          // }
          // if(flag){
          //   res.data.camp[0].ischose = true
          // }
          res.data.people_num = parseInt(res.data.people_num)
          res.data.num= parseInt(res.data.num)
           res.data.price_sell=staticArr.price_sell
          res.data.people_num_static = parseInt(staticArr.people_num)
          res.data.num_static = parseInt(staticArr.num)
        }
        if(res.data.spec.length>0){
          for(let j=0;j<res.data.spec.length;j++){
            if(staticArr.camp_day==res.data.spec[j].camp_day){
              dayList=res.data.spec[j].camp_time
            }
          }
        }
        console.log(res.data)
        if (res.data.teamList.rows.length >= 4) {
          that.setData({
            g_list_height: 600
          })
        } else {
          var height = 154 * res.data.teamList.rows.length
          that.setData({
            g_list_height: height
          })
        }
        console.log(staticArr,"默认营期")
        that.setData({
          dayList:dayList,
          allDayList:res.data.spec,
          groupTotal: res.data.teamList.total,
          groupList: res.data.teamList.rows,
          shareImg: res.data.image[0],
          shareTitle: '【有人@你】'+res.data.name,
          c_id: res.data.c_id,
          showSpec: staticArr,
          colum: res.data.num,
          campId: staticArr.camp_day,//选中营期
          dayId: staticArr.id,//选中营期天数
          specList: res.data.camp,
          imgUrls: res.data.image,
          courseDetail: res.data,
          like_num: res.data.like_num,
        })
        console.log(staticArr.camp_day)
        console.log(dayList)
        console.log(res.data.spec)
        // var arrArr1 = []
        // var chosegui = []
        // var i = 0;
        // for (let item in res.data.spec) {
        //   chosegui.push({ id: item, name: staticArr[i++] })
        //   arrArr1.push({ id: item, name: item, list: res.data.spec[item] })
        // }
        // for (var i = 0; i < res.data.camp.length; i++) {
        //   res.data.camp[i].ischose = false
        //   if(showSpec[0].id== res.data.camp[i].id){
        //     res.data.camp[i].ischose=true
        //   }
        // }
        //   that.setData({
        //     specList: arrArr1,
        //     chosegui: chosegui,
        //     showGui: true,
        //   })
        //   console.log(that.data.chosegui, "选择的规格")
        // }else{
        //   that.setData({
        //     showGui: false,
        //     courseDetail: res.data.default_product[0],

        //   })
        // }
        // if(Number(res.data.store)<=0){
        //   that.setData({
        //     showColor:false,
        //     colum:0,
        //   })
        // }else{
        //   that.setData({
        //     showColor: true,
        //     colum: res.data.store
        //   })
        // }
        // var image = res.data.goods.image
        // that.setData({
        //   endTime: res.data.time,
        //   colum: that.data.colum,
        //   decNum: res.data.total,
        //   allNum: allNum,
        //   total: res.data.total,
        //   checkBind: res.data.user_status,
        //   maxNum: res.data.maxorder,
        //   imgUrls: image,
        //   showcourseDetail: true,
        // })
        // 获取倒计时end_time
        // 当前活动状态
        let activityStatus = 0
        // 获取当前时间
        console.log(parseInt(new Date().getTime() / 1000))
        let nowTime = parseInt(new Date().getTime() / 1000)
        // 获取活动开始时间
        let startTime = res.data.start_time
        console.log(res.data.start_time)
        // 获取活动结束时间
        let endTime = res.data.end_time
        console.log(res.data.end_time)
        let activity_status = 0
        if (startTime > nowTime) {
          console.log("活动未开始")
          nowTime = parseInt(new Date().getTime() / 1000)
          if (startTime - nowTime > 0) {
            // 设置倒计时
            let sectimeList = util.countDown(startTime - nowTime)
            that.setData({
              saleTime: sectimeList
            })
            that.data.time = setInterval(function () {
              if (startTime - nowTime > 0) {
                nowTime = parseInt(new Date().getTime() / 1000)
                sectimeList = util.countDown(startTime - nowTime)
                that.setData({
                  saleTime: sectimeList
                })
              } else {
                clearInterval(that.data.time)
                activityStatus = 2
                that.setData({
                  activityStatus: 2
                })
              }
            }.bind(that), 1000)
          }
          that.setData({
            time: that.data.time
          })
          activityStatus = 0
        } else if (nowTime > endTime) {
          console.log("活动已结束")
          activityStatus = 1
        } else {
          console.log("活动进行中")
          activityStatus = 2
          nowTime = parseInt(new Date().getTime() / 1000)
          if (endTime - nowTime > 0) {
            // 设置倒计时
            let sectimeList = util.countDown(endTime - nowTime)
            that.setData({
              saleTime: sectimeList
            })
            that.data.time = setInterval(function () {
              if (endTime - nowTime > 0) {
                nowTime = parseInt(new Date().getTime() / 1000)
                sectimeList = util.countDown(endTime - nowTime)
                that.setData({
                  saleTime: sectimeList
                })
              } else {
                clearInterval(that.data.time)
                activityStatus = 1
                that.setData({
                  activityStatus: 1
                })
              }
            }.bind(that), 1000)
          }
          that.setData({
            time: that.data.time
          })
        }
        that.setData({
          activityStatus: activityStatus,
          startTime: startTime,
          endTime: endTime
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
  rightBuy: util.throttle( function (e) {
    console.log(1111)
    const that = this
    // if (util.isLogin()) {
    wx.setStorageSync('choseAdd', '')

    console.log('数量：'+that.data.specNum)
    console.log('课程id：'+that.data.c_id)
    console.log('营期id：'+that.data.showSpec.id)
    console.log('团购活动id：'+that.data.id)
    console.log('拼团id：'+that.data.team_id)
    if(util.isLogin()){
      let link = "/pages/sureOrder/sureOrder?num="+that.data.specNum+"&type=group&curriculum_id="+that.data.c_id+'&curriculum_camp_id='+that.data.showSpec.id+'&act_id='+that.data.id+'&team_id=' + that.data.team_id
      wx.navigateTo({
        url: link
      })
    }else{
      wx.navigateTo({
        url: '/pages/userAuz/userAuz'
      })
    }

    // that.setData({
    //   modelShow: !that.data.modelShow
    // })

    // } else {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '您当前未登录，是否立即前往登录?',
    //     success(res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '/pages/userAuz/userAuz'
    //         })
    //         wx.setStorageSync("userInfo", '')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
  }),
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      this.setData({
        isTop: false
      })
    } else {
      this.setData({
        isTop: true
      })
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
        // this.data.courseDetail.price_market = slist[i].price_market
        this.data.courseDetail.num_static = slist[i].num
        this.data.colum = slist[i].num
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
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // let share_url = util.getFullUrl()
    // console.log("获取用户信息",wx.getStorageSync('userInfo'))
    // // 获取要分享出去的邀请码，判断是教官获取用户信息里的，如果是用户，先判断用户信息里的分享邀请码有没有，没有就取分享参数里的邀请码
    // let invite_code = ''
    // if(wx.getStorageSync('userInfo').invite_code!=''&&wx.getStorageSync('userInfo').invite_code!=undefined){
    //   // 教官
    //   invite_code = wx.getStorageSync('userInfo').invite_code
    //   console.log('教官邀请码' + invite_code)
    // }else{
    //   // 用户
    //   if(options.invite_code!=undefined&&options.invite_code!=''){
    //     invite_code = options.invite_code
    //   }else{
    //     if(wx.getStorageSync('userInfo').share_invite_code!=''&&wx.getStorageSync('userInfo').share_invite_code!=null&&wx.getStorageSync('userInfo').share_invite_code!=undefined){
    //       invite_code = wx.getStorageSync('userInfo').share_invite_code
    //     }else{
    //       invite_code = ''
    //     }
    //   }
    // }

    // let invite_code= (wx.getStorageSync('userInfo').invite_code!=''&&wx.getStorageSync('userInfo').invite_code!=undefined)?wx.getStorageSync('userInfo').invite_code:''
    // this.data.shareUrl = share_url + 'invite_code=' + invite_code
    this.setData({
      shareUrl:this.data.shareUrl
    })
    console.log(options, "活动id")
    if (options != undefined) {
      that.setData({
        id: options.id,
      })
    }

    // 获取下单的教官码
    if(options.invite_code!=undefined&&options.invite_code!=''){
      wx.setStorageSync('share_invite', options.invite_code)
      console.log(options.invite_code,"邀请码")
    } else {
      console.log("获取用户信息",wx.getStorageSync('userInfo'))
      if(wx.getStorageSync('userInfo').share_invite_code!=''&&wx.getStorageSync('userInfo').share_invite_code!=undefined){
        wx.setStorageSync('share_invite', wx.getStorageSync('userInfo').share_invite_code)
      }else{
        // wx.setStorageSync('share_invite', '')
      }
    }
    console.log('获取下单的教官码',wx.getStorageSync('share_invite'))

    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined){
      this.setData({
        isLogin:true,
      })
      // 登录的前提下,判断邀请码不为空,并且角色为用户的情况下保存邀请码
      if(options.invite_code!=undefined&&options.invite_code!=''&&wx.getStorageSync('userInfo').invite_code==''){
        let that = this
        util.queryRequest('app/member/memberInvite', {
          share_invite_code:options.invite_code,
        }, 'GET').then(function (res) {
          if (res.code == 200) {
            console.log("onLoad邀请码保存成功",options.invite_code)
            let info = wx.getStorageSync('userInfo')
            info.share_invite_code = res.data.share_invite_code
            wx.setStorageSync('share_invite', res.data.share_invite_code)
            wx.setStorageSync('userInfo', info)
            console.log("最新的用户信息",info)
          }
        })
      }
    }
    wx.setNavigationBarTitle({
      title: '优惠拼团',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f7f7f7',
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
    that.getproductInfo()
    that.getDetail()
  },
  // 未登录点击分享
  toshare(){
      if(!util.isLogin()){
        wx.navigateTo({
          url: '/pages/userAuz/userAuz'
        })
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
    const that = this
    wx.removeStorageSync('sure_add')
     // 删除缓存支付宝
     wx.removeStorageSync('showAlipay')
    // that.getMaxOrderNum()
    // if(util.isLogin()){
    //   that.checkBind()
    // }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      time: null,
      // modelShow: true
      // specNum:'1'
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.time)
    this.setData({
      time: null,
      // specNum: '1'
    })
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
        // 获取最新的分享路径
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
          c_id: that.data.c_id,
          type:0,
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