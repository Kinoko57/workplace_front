// pages/groupResult/groupResult.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    showCamp:true,
    dayList:[],//营期日期天数选择列表
    allDayList:[],
    campId:'',//选中营期
    dayId:'',//选中营期天数
    shareUrl: '',
    modelShow: true,
    staticInfo: {},
    specList: [],
    ruleInfo: [],
    specNum: 1,
    group_id: '',
    team_id: '',
    isShare: app.globalData.is_share,
    imgPath: app.globalData.fileUrl,
    allowbind: true,
    orderId: '',
    next_people: 0,
    next_discount: 0,
    now_discount: 0,
    last_status: 0,
    id: '',
    apiUrl: app.globalData.apiUrl,
    GroupOrder: {},
    groupPeople: [],
    startTime: null, // 开始时间
    endTime: null, // 结束时间
    saleTime: [], // 显示倒计时的时间
    time: null, // 延时器
    activityStatus: 0, // 活动状态 0是未开始，2是进行中，1是已结束
  },
  goProDetail: util.throttle(function (e) {
    let id = this.data.group_id
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail?id=' + id
    })
  }),
  //立即抢购 显示规格弹框
  closeModel: function () {
    const that = this
    that.setData({
      modelShow: !that.data.modelShow
    })
  },
  closeGui: function () {
    this.setData({
      modelShow: !this.data.modelShow
    })
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
  // //选择规格
  // choseType: function (e) {
  //   var that = this
  //   var slist = this.data.specList
  //   // 选中规格高亮显示
  //   for (let i = 0; i < slist.length; i++) {
  //     slist[i].ischose = false
  //     if (e.currentTarget.id == slist[i].id) {
  //       slist[i].ischose = true
  //       that.data.GroupOrder.people_num = slist[i].people_num
  //       that.data.GroupOrder.max_num = slist[i].num
  //       that.data.staticInfo = slist[i]
  //     }
  //   }
  //   this.setData({
  //     specList: slist,
  //     GroupOrder: that.data.GroupOrder,
  //     staticInfo: that.data.staticInfo
  //   })
  // },
    //选择营期
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
  // 选择营期对应的规格
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
  getInfo: function () {
    var that = this
    util.queryRequest('app/groupbuy/groupDetail', {
      group_id: that.data.group_id,
      team_id: that.data.team_id
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
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
          isShow: true,
          activityStatus: activityStatus,
          startTime: startTime,
          endTime: endTime
        })
        // default_camp 应该没了
        var staticArr = {}
        var dayList=[]
        if (res.data.camp.length > 0) {
          let flag = true
          for (var i = 0; i < res.data.camp.length; i++) {
            res.data.camp[i].ischose = false
            if (res.data.camp[i].people_num < res.data.camp[i].num) {
              res.data.camp[i].ischose = true
              staticArr = res.data.camp[i]
              res.data.price_sell=res.data.camp[i].price_sell
              res.data.people_num = res.data.camp[i].people_num
              res.data.max_num = res.data.camp[i].num
              flag = false
              break
            }
          }
          if (flag) {
            res.data.camp[0].ischose = true
            staticArr = res.data.camp[0]
            res.data.price_sell=res.data.camp[0].price_sell
            res.data.people_num = res.data.camp[0].people_num
            res.data.max_num = res.data.camp[0].num
          }
        }
        if(res.data.spec.length>0){
          for(let j=0;j<res.data.spec.length;j++){
            if(staticArr.camp_time==res.data.spec[j].camp_time){
              dayList=res.data.spec[j].days
            }
          }
        }
        let max_people = 0
        let now_discount = 0
        let next_discount = 0
        let tips = res.data.discount
        console.log(tips, "discount")
        let members = res.data.num
        that.data.last_status = 0
        if (res.data.status == 1) {
          max_people = tips[0].p_number_start
          now_discount = tips[0].discount
        } else if (res.data.status == 2) {
          let i = 0
          for (i; i < tips.length; i++) {
            if (members <= tips[i].p_number_end) {
              // 判断当前下单人数在哪个团购梯度
              now_discount = tips[i].discount
              break
            }
          }
          if (members >= tips[tips.length - 1].p_number_end) {
            // 当前下单人数大于团购最后一个梯度的最大人数，说明梯度已满，最大成团人数未满
            max_people = res.data.max_people
            that.data.last_status = 1
            now_discount = tips[tips.length - 1].discount
            next_discount = tips[tips.length - 1].discount
          } else {
            console.log(i)
            if (i == tips.length - 1) {
              // 说明当前下单人数小于最后一个成团梯度的最大值
              max_people = tips[i].p_number_end
            } else {
              // 获取下一阶段的最小成团人数和优惠值
              max_people = tips[i + 1].p_number_start
              next_discount = tips[i + 1].discount
            }
            that.data.last_status = 0
            if (i == tips.length - 1) {
              that.data.last_status = 1
            }
          }

        }
        console.log(max_people)
        console.log(activityStatus)
        that.setData({
          staticInfo: staticArr,
          camp_day:res.data.camp_day,
          dayList:dayList,
          allDayList:res.data.spec,
          now_discount: now_discount,
          next_discount: next_discount,
          campId: staticArr.camp_day,//选中营期
          dayId: staticArr.id,//选中营期天数
          next_people: max_people - res.data.num,
          last_status: that.data.last_status,
          GroupOrder: res.data,
          ruleInfo: tips,
          specList: res.data.camp,
          groupPeople: res.data.teamList,
          id: res.data.id
        })
        // if()
        console.log(res.data.discount)
      }
    })
  },
  //确认购买
  rightBuy: util.throttle(function (e) {
    console.log(1111)
    const that = this
    // if (util.isLogin()) {
    wx.setStorageSync('choseAdd', '')
    console.log(that.data.staticInfo)
    console.log('数量：' + that.data.specNum)
    console.log('课程id：' + that.data.staticInfo.curriculum_id)
    console.log('营期id：' + that.data.staticInfo.id)
    console.log('团购活动id：' + that.data.group_id)
    console.log('拼团id：' + that.data.team_id)
    if (util.isLogin()) {
      let link = "/pages/sureOrder/sureOrder?num=" + that.data.specNum + "&type=group&curriculum_id=" + that.data.staticInfo.curriculum_id + '&curriculum_camp_id=' + that.data.staticInfo.id + '&act_id=' + that.data.group_id + '&team_id=' + that.data.team_id
      wx.navigateTo({
        url: link
      })
    } else {
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
  golink: function (e) {
    if (util.isLogin()) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  goindex: function (e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.link
    })
  },
  // 营期弹框出现
  choseCamp(){
    for(let j=0;j<this.data.allDayList.length;j++){
      if(this.data.staticInfo.camp_day==this.data.allDayList[j].camp_day){
        this.data.dayList=this.data.allDayList[j].camp_time
      }
    }
    this.setData({
      showCamp:false,
      dayList:this.data.dayList,
      campId:this.data.staticInfo.camp_day,
      dayId:this.data.staticInfo.id
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
        that.data.GroupOrder.price_sell = slist[i].price_sell
        that.data.GroupOrder.people_num = slist[i].people_num
        that.data.GroupOrder.max_num = slist[i].num
        that.data.staticInfo = slist[i]
      }
    }
    this.setData({
      GroupOrder: that.data.GroupOrder,
      staticInfo: that.data.staticInfo,
      showCamp:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   isShare: wx.getStorageSync("is_share") == 0 ? 0 : 1,
    // })
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
    //     if (wx.getStorageSync('userInfo').share_invite_code != '' && wx.getStorageSync('userInfo').share_invite_code!=null && wx.getStorageSync('userInfo').share_invite_code != undefined) {
    //       invite_code = wx.getStorageSync('userInfo').share_invite_code
    //     } else {
    //       invite_code = ''
    //     }
    //   }
    // }
    // this.data.shareUrl = share_url + 'invite_code=' + invite_code
    this.setData({
      shareUrl: this.data.shareUrl
    })
    if (options.type == 'pay') {
      this.setData({
        orderId: options.orderId,
        id: ''
      })
    } else {
      this.setData({
        group_id: options.group_id,
        team_id: options.team_id
      })
    }
    // 获取下单的教官码
    if(options.invite_code!=undefined&&options.invite_code!=''){
      wx.setStorageSync('share_invite', options.invite_code)
      console.log(options.invite_code,"邀请码")
    } else {
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
            let info = wx.getStorageSync('userInfo')
            info.share_invite_code = res.data.share_invite_code
            wx.setStorageSync('userInfo', info)
            wx.setStorageSync('share_invite', res.data.share_invite_code)
            console.log("最新的用户信息",info)
          }
        })
      }
    }
    this.getInfo()
    wx.setNavigationBarTitle({
      title: '拼购详情'
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#f2f2f2',
    // })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(this.data.shareUrl)
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
        c_id: that.data.staticInfo.curriculum_id,
        type: 0,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log("添加分享成功")
        }
      })
      // 来自页面内转发按钮
      return {
        title: '【有人@你】您的好友向你发来一个团购拼单邀请~',
        imageUrl: this.data.GroupOrder.image,
        path: this.data.shareUrl
      }
    }
  }
})