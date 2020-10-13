var liveroom = require('../../component/mlvb-live-room/mlvbliveroomcore.js');
const GenerateTestUserSig = require("./GenerateTestUserSig.js");
const app = getApp()
let util = require('../../utils/util.js')
let barrage_num = 0
let timer = ''
let showlottery = ''
let showred = ''
Page({
  component: null,
  data: {
    roomList: [], // 房间列表
    isGetLoginInfo: false, // 是否已经获取登录信息
    playing: false, //是否播放
    push_pro_id: '', // 标识推屏的商品key
    like_num: 0,
    mem_num: 0,
    push_key: '',
    history_member_num: 0,
    live_time: 0,
    playUrl: '',
    userName: '',
    userAvatar: '',
    roomID: '',
    share_title: '',
    share_img: '',
    anchorInfo: {
      nickname: '主播昵称',
      avatar: '',
    },
    memberList: [],
    pureAudio: false,
    role: 'audience',
    showLiveRoom: false,
    rooms: [],
    staticMsg: [{
        message: '  欢迎来到直播间！严禁未成年人进行直播或打赏，请大家共同遵守、监督。直播间内严禁出现违规违法、低俗色情、吸烟酗酒等内容，若有违规行为请及时举报。',
      },
      {
        message: '  点击下方更多按钮，分享到微信让更多朋友进入直播间吧！',
      }
    ],
    comment: [],
    linked: false,
    debug: false,
    frontCamera: true,
    inputMsg: [],
    barrageList: [],
    muted: false,
    toview: '',
    beauty: 5,
    shouldExit: false,
    phoneNum: '',
    staticUrl: app.globalData.staticUrl,
    navHeight: app.globalData.navHeight == 0 ? 60 : app.globalData.navHeight,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    firstTop: 230,
    winHeight: 0,
    winResultHeight: 0,
    livePro: [],
    liveProPush: {
      image: '',
      name: '',
      price: '',
      spec: '',
      id: '',
    },
    end_show: false,
    err_show: false,
    showBag: false,
    showMore: false,
    showAnchor: false,
    push_01_show: false,
    scene_id: '',
    push_02_show: false,
    push_03_show: false,
    animation: false,
    sendValue: '',
    commentFocus: false,
    keyBoardHeight: -80,
    showHotBig: false, // 显示红包弹框
    hideHotSmall: false, // 隐藏红包icon
    showHotResult: false, // 显示抢红包的记录
    red_is_get: false,
    my_get_money: 0,
    red_get_list: [],
    red_id: '',
    red_type: 0,
    red_pwd: '',
    allow_receive: 0, // 允许领取 0 继续领取 1是已领完
    showAnchorCode: false, // 显示主播二维码
    showWin: false, // 显示抽奖弹框
    showLottery_small: false, // 显示小的抽奖按钮
    can_lottery: false,
    is_participate: false,
    showWinResult: false, // 抽奖结果页
    is_win: false,
    win_result_pro: {},
    win_list: [],
    countdown: 0,
    saleTime: [],
    time: '',
    lotteryInfo: {},
    showCode: false, // 展示二维码
    code_url: '', // 二维码路径
  },
  showModel: util.throttle(function (e) {
    let type = e[0].currentTarget.dataset.type
    if (type == 'bag') {
      this.setData({
        showBag: true
      })
      this.getDetailRecommend()
    } else if (type == 'more') {
      this.setData({
        showMore: true,
      })
    } else {
      this.setData({
        showAnchor: true,
      })
    }
  }),
  showActModel: util.throttle(function (e) {
    let that = this
    if (e[0].currentTarget.id == 'hot') {
      // 是否还有红包可领取 为1 代表领完了
      if (this.data.allow_receive == 1) {
        that.setData({
          red_is_get: true
        })
        this.getRecord()
      } else {
        if (that.data.red_is_get) {
          this.getRecord()
        } else {
          this.getRedPackageDetail('open')
        }
      }
    } else if (e[0].currentTarget.id == 'code') {
      this.setData({
        showAnchorCode: true
      })
    } else if (e[0].currentTarget.id == 'win') {
      clearInterval(this.data.time)
      // let secTime = util.countDown(this.data.countdown)
      // this.setData({
      //   saleTime: secTime,
      //   showWin: true
      // })
      // clearInterval(that.data.time)
      // if(that.data.countdown > 0){
      //   that.data.time = setInterval(function () {
      //     if (that.data.countdown > 0) {
      //       secTime = util.countDown(--that.data.countdown)
      //       that.setData({
      //         saleTime: secTime,
      //         countdown: that.data.countdown
      //       })
      //     } else {
      //       clearInterval(that.data.time)
      //       that.setData({
      //         countdown: 0,
      //       })
      //       // 显示开奖
      //       // that.openWin()
      //     }
      //   }.bind(that), 1000)
      // }
      this.getLotteryDetail('open')
    }
  }),
  openWin() {
    // 获取抽奖结果
    console.log("获取抽奖结果")
    let that = this
    let info = {
      lottery_id: this.data.lotteryInfo.id,
    }
    util.queryRequest('/app/lottery/winList', info, 'GET').then(function (res) {
      if (res.code == 200) {
        clearInterval(that.data.time)
        // 显示抽奖结果页，隐藏抽奖页
        that.setData({
          showWinResult: true,
          showWin: false,
          is_win: res.data.is_win,
          win_result_pro: res.data.prize,
          win_list: res.data.lottery_list
        })
      }
    })
  },
  hideActModel: util.throttle(function (e) {
    if (e[0].currentTarget.id == 'red') {
      clearTimeout(showred)
      this.setData({
        showHotBig: false,
        hideHotSmall: true
      })
    } else if (e[0].currentTarget.id == 'red_result') {
      clearTimeout(showred)
      this.setData({
        showHotResult: false,
        showHotBig: false,
        hideHotSmall: true
      })
    } else if (e[0].currentTarget.id == 'code') {
      this.setData({
        showAnchorCode: false
      })
    } else if (e[0].currentTarget.id == 'win') {
      clearTimeout(showlottery)
      this.setData({
        showWin: false,
        showLottery_small: true,
      })
    } else if (e[0].currentTarget.id == 'win_result') {
      clearTimeout(showlottery)
      this.setData({
        showWinResult: false,
        showLottery_small: true
      })
    }

  }),
  goIndex: util.throttle(function () {
    console.log("退出直播间")
    let options = {
      userAvatar: wx.getStorageSync('userInfo').wx_image,
      userName: wx.getStorageSync('userInfo').nickname,
    }
    liveroom.exitRoom(options);
    wx.switchTab({
      url: '/pages/noticeList/noticeList',
    })
  }),
  showComment: util.throttle(function () {
    console.log('是否iphoneX', this.data.is_iphonex)
    if (this.data.is_iphonex) {
      this.setData({
        commentFocus: true,
        keyBoardHeight: 0
      })
    } else {
      this.setData({
        commentFocus: true,
        keyBoardHeight: 0
      })
    }
  }),
  hideComment: util.throttle(function () {
    if (this.data.is_iphonex) {
      this.setData({
        commentFocus: false,
        keyBoardHeight: -148
      })
    } else {
      this.setData({
        commentFocus: false,
        keyBoardHeight: -80
      })
    }
  }),
  getCommentValue: function (event) {
    let value = event.detail.value
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    if (value.match(reg)) {
      value = value.replace(reg, '');
    }
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(value)) {
      value = ''
    }
    this.setData({
      sendValue: value
    })
  },
  getHeight: function (e) {
    console.log("键盘高度", e.detail.height)
    this.setData({
      keyBoardHeight: e.detail.height
    })
  },
  getAnchorCode() {
    console.log("获取主播二维码的接口")
    let that = this
    let info = {
      id: this.data.anchor_id,
    }
    util.queryRequest('/app/live/getAnchorFlock', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        if (res.data == null || res.data == 'null') {
          console.log("二维码未配置")
        } else {
          that.setData({
            showCode: res.data.is_start == 0 ? false : true,
            code_url: res.data.domain + res.data.flock_image
          })
        }

      }
    })
  },
  authSave: util.throttle(function (e) {
    console.log(e[0])
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.downloadCode()
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: "none"
              })
            }
          })
        } else {
          that.downloadCode()
        }
      }
    })
  }),
  // 下载二维码
  downloadCode: util.throttle(function () {
    console.log("保存主播二维码")
    console.log(this.data.code_url)
    wx.showLoading({
      title: '保存中',
    })
    wx.downloadFile({
      url: this.data.code_url, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(req) {
              wx.hideLoading()
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              })
            },
            complete: function () {
              wx.hideLoading()
            }
          })
        }
      }
    })
  }),
  // 获取红包详情
  getRedPackageDetail: function (type) {
    let that = this
    // 房间号
    let info = {
      room_id: this.data.scene_id,
    }
    util.queryRequest('/app/redPacket/get', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        if (res.data.red_id != 0) {
          if (type == 'show' || type == 'open') {
            // 显示红包弹框，5秒后隐藏
            that.setData({
              hideHotSmall: false,
              showHotResult: false,
            })
            if (type == 'show') {
              clearTimeout(showred)
              showred = setTimeout(function () {
                that.setData({
                  hideHotSmall: true,
                  showHotResult: false
                })
              }, 5000)
            }
            if (type == 'open') {
              // 展示抢红包
              that.setData({
                showHotBig: true,
              })
              setTimeout(() => {
                that.setData({
                  hideHotSmall: false
                })
              }, 300)
            }
          } else {
            // 显示红包小按钮
            that.setData({
              hideHotSmall: true,
              showHotResult: false
            })
          }
        }
        // 获取红包详情
        that.setData({
          red_id: res.data.red_id,
          allow_receive: res.data.is_rob,
          red_type: res.data.red_type,
          red_is_get: res.data.type == 1 ? true : false // 1代表抢过红包，直接显示红包领取记录
        })
      }
    })
  },
  // 输入红包口令
  inputKeyWord: function (e) {
    this.data.red_pwd = e.detail.value
    this.setData({
      red_pwd: this.data.red_pwd
    })
  },
  getInputFocus: util.throttle(function (e) {
    console.log("清除自动隐藏的定时器")
    clearTimeout(showred)
  }),
  // 抢红包
  getHotPackage: util.throttle(function (e) {
    console.log(e[0])
    clearTimeout(showred)
    let that = this
    console.log(this.data.red_type)
    let type = this.data.red_type
    let red_id = this.data.red_id
    // 判断是否需要输入口令
    // 输入完口令后才可以允许点击抢
    let flag = true
    let msg = ''
    let obj = {}
    if (type == 0) {
      // 非口令红包
      obj = {
        red_id: red_id,
        room_id: this.data.scene_id
      }
    } else {
      if (this.data.red_pwd == '') {
        flag = false
        msg = '请输入红包口令'
      } else {
        obj = {
          red_id: red_id,
          room_id: this.data.scene_id,
          word: this.data.red_pwd
        }
      }
    }
    // 
    if (flag) {
      util.queryRequest('/app/redPacket/robRedPacket', obj, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data) {
            // 抢红包成功
            that.setData({
              red_is_get: true
            })
            that.getRecord()
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          // that.getRecord()
        }
      })
    } else {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }

  }),
  // 获取红包领取记录
  getRecord: function () {
    let that = this
    let obj = {
      red_id: this.data.red_id
    }
    util.queryRequest('/app/redPacket/getRedPacketRecord', obj, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          my_get_money: res.data.my_money,
          red_get_list: res.data.record,
          hideHotSmall: false,
          showHotResult: true,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 获取抽奖详情
  getLotteryDetail: function (type) {
    let that = this
    let info = {
      anchor_member_id: this.data.anchor_id,
      live_scene_id: this.data.scene_id
    }
    util.queryRequest('/app/lottery/lotteryPage', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        if (res.code == 200) {
          if (res.data.is_lottery == 1) {
            if (type == 'show' || type == 'open') {
              // 是否展示大图
              that.setData({
                showWin: true,
              })
              if (type == 'show') {
                clearTimeout(showlottery)
                showlottery = setTimeout(function () {
                  that.setData({
                    showWin: false,
                    showLottery_small: true
                  })
                }, 5000)
              }
            } else {
              // 是否展示抽奖小图标
              that.setData({
                showLottery_small: true
              })
            }
            // 抽奖信息赋值
            that.setData({
              lotteryInfo: res.data.lottery,
              is_participate: res.data.lottery.is_john == 1 ? true : false // 是否已参与 join_type是是否分享
            })
            // 结束时间
            console.log("结束时间")
            console.log(res.data.lottery.end_time)
            let now_time = parseInt(new Date().getTime() / 1000)
            console.log('当前时间')
            console.log(now_time)
            let countdown = res.data.lottery.end_time - now_time
            if (countdown > 0) {
              that.setData({
                countdown: countdown
              })
              let secTime = util.countDown(that.data.countdown)
              that.setData({
                saleTime: secTime
              })
              clearInterval(that.data.time)
              that.data.time = setInterval(function () {
                // if (that.data.countdown <= 3) {
                //   // 显示开奖
                //   that.setData({
                //     showWin: true,
                //   })
                // }
                if (that.data.countdown > 0) {
                  secTime = util.countDown(--that.data.countdown)
                  that.setData({
                    saleTime: secTime,
                    countdown: that.data.countdown
                  })
                } else {
                  clearInterval(that.data.time)
                  that.setData({
                    countdown: 0,
                  })
                }
              }.bind(that), 1000)
            } else {
              console.log("抽奖已结束")
              if (type == 'show' || type == 'open') {
                console.log('展示类型')
                console.log(type)
                that.openWin()
              }
            }
          } else {
            that.setData({
              showWin: false
            })
          }
        } else {
          that.setData({
            showWin: false
          })
        }
      }
    })
  },
  // 参与抽奖
  joinLottery: util.throttle(function (e) {
    // 抽奖活动id
    clearTimeout(showlottery)
    let that = this
    let info = {
      lottery_id: this.data.lotteryInfo.id,
      member_id: wx.getStorageSync('userInfo').id
    }
    util.queryRequest('/app/lottery/drawLottery', info, 'POST').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.data.lotteryInfo.join_num = that.data.lotteryInfo.join_num + 1
        that.setData({
          lotteryInfo: that.data.lotteryInfo,
          showLottery_small: true,
          is_participate: true
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }),
  // 评论
  saveComment: util.throttle(function () {
    console.log("发送消息")
    let self = this;
    if (this.data.sendValue != '') {
      self.component.sendTextMsg(this.data.sendValue)
      setTimeout(() => {
        self.setData({
          sendValue: '',
          commentFocus: false,
        })
      }, 300)
    } else {

    }

  }),
  hideModel: util.throttle(function () {
    this.setData({
      showBag: false,
      showMore: false,
      showAnchor: false,
    })
  }),
  visitLink(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  returnBack: util.throttle(function (e) {
    wx.showModal({
      title: '提示',
      content: '确定离开此直播间吗？',
      success(res) {
        if (res.confirm) {
          let options = {
            userAvatar: wx.getStorageSync('userInfo').wx_image,
            userName: wx.getStorageSync('userInfo').nickname,
          }
          // liveroom.exitRoom(options);
          wx.switchTab({
            url: '/pages/noticeList/noticeList',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }),
  // 点赞
  collLive: util.throttle(function (e) {
    console.log("点赞")
    let that = this
    that.setData({
      animation: true
    })
    that.component.sendLOVEMsg("点赞")
    console.log(that.data.like_num)
    // that.setData({
    //   like_num: that.data.like_num + 1
    // })
    setTimeout(() => {
      that.setData({
        animation: false
      })
    }, 760)

  }),
  showInput: function () {
    console.log("显示文本框")
  },
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    })
    // 隐藏页面按钮转发
    wx.hideShareMenu()
    var self = this;
    // 判断版本号是否最低
    const version = wx.getSystemInfoSync().SDKVersion
    if (util.compareVersion(version, '2.9.1') >= 0) {
      // 判断用户是否登录，未登录的前往登录
      if (util.isLogin()) {
        // 判断用户是否正在直播
        util.queryRequest('/app/live/inspectLive', {}, 'GET').then(res => {
          console.log(res)
          if (res.code == 200) {
            if (res.data.live_status == 1) {
              wx.showModal({
                title: '提示',
                content: '您正在直播中，是否结束直播？',
                confirmText: '结束直播',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    // 调结束直播的接口
                    util.queryRequest('/app/live/otherEndLive', {}, 'POST').then(req => {
                      if (req.code == 200) {
                        self.loadData(options)
                      } else {
                        console.log('回到直播列表')
                        wx.switchTab({
                          url: '/pages/noticeList/noticeList',
                        })
                      }
                    })
                  } else if (res.cancel) {
                    console.log('回到直播列表')
                    wx.switchTab({
                      url: '/pages/noticeList/noticeList',
                    })
                  }
                }
              })
            } else {
              self.loadData(options)
            }
          } else {
            self.loadData(options)
          }
        })


      } else {
        wx.redirectTo({
          url: '/pages/login/login'
        })
      }
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/noticeList/noticeList',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/noticeList/noticeList',
            })
          }
        }
      })
    }
    // * 需要先使用 compareVersion 判断接口是否可用
    // const sdkVersion = wx.getSystemInfoSync().SDKVersion
    // if (compareVersion(sdkVersion, '2.9.2') >= 0) {
    //   wx.reportPerformance(2001, val)
    //   wx.reportPerformance(1002, val)
    // }
  },
  loadData: function (options) {
    wx.showLoading({
      title: '直播信息获取中',
    })
    var self = this;
    console.log("--> onLoad: ", options)
    var role = 'audience';
    self.setData({
      roomID: options.roomID,
      push_pro_id: options.pro_key,
      userName: wx.getStorageSync('userInfo').nickname,
      userAvatar: wx.getStorageSync('userInfo').wx_image,
      scene_id: options.id,
      share_title: options.sence_name,
      share_img: options.scene_img,
      role: role,
      showLiveRoom: true,
      anchor_id: options.anchor_id,
      playUrl: options.accelerateURL,
      push_key: self.data.push_pro_id
    }, function () {
      // self.reviewLogin()
      // 判断用户是否登录成功IM 如果成功  self.start();
      if (wx.getStorageSync('login_im') == true) {
        self.start();
      } else {
        self.reviewLogin()
      }
      // if(wx.getStorageSync('imInfo')!=''&&wx.getStorageSync('imInfo')!=undefined){
      //   let userSig = wx.getStorageSync('userSig')
      //   self.data.firstshow = false;
      //   self.data.isGetLoginInfo = true;
      //   var loginInfo = {
      //     sdkAppID: userSig.sdkAppID,
      //     userID: wx.getStorageSync('userInfo').anchor_user,
      //     userSig: userSig.userSig,
      //     userName: self.data.userName,
      //     userAvatar: self.data.userAvatar,
      //     roomID: self.data.roomID,
      //     push_key: self.data.push_pro_id
      //   }
      //   // 初始化部分值
      //   self.initRoom(loginInfo);
      // }else{
      //   self.reviewLogin()
      // }
      // 否则重新登录
    })
    // 声明弹幕组件
    const barrageComp = this.selectComponent('.barrage')
    this.barrage = barrageComp.getBarrageInstance({
      font: 'bold 12px ',
      duration: 20,
      lineHeight: 2,
      mode: 'separate',
      padding: [10, 0, 10, 0],
      tunnelShow: false
    })
    this.getStaticInfo()
    this.barrage.open()
    this.getDetailRecommend()
    this.getAnchorCode()
    this.getLotteryDetail('')
    this.getRedPackageDetail('')
  },
  // 获取主播信息，观众列表，观众人数
  getStaticInfo() {
    let that = this
    let info = {
      scene_id: this.data.scene_id
    }
    util.queryRequest('/app/liveData/get', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        if (res.data != null) {
          that.setData({
            mem_num: res.data.member_number,
            anchorInfo: res.data.anchor,
            memberList: res.data.audience_list,
          })
          console.log(that.data.mem_num)
          console.log(that.data.anchorInfo)
          console.log(that.data.memberList)
        }

      }
    })
  },
  // 获取商品详情对接
  getDetailRecommend() {
    // 获取首页推荐数据
    let that = this
    let info = {
      member_id: this.data.anchor_id,
    }
    util.queryRequest('/app/liveGoods/getGoodsList', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          livePro: res.data.rows
        })
      }
    })
  },
  hidePush: function () {
    this.setData({
      push_01_show: false
    })
  },
  pushPro: function (data) {
    console.log(data)
    // app/liveGoods/getGoodsById
    let that = this
    let info = {
      livegoods_id: data,
      member_id: this.data.anchor_id,
    }
    util.queryRequest('/app/liveGoods/getGoodsById', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          liveProPush: res.data,
          push_01_show: true
        })
      }
    })
    // let pro_Push = {}
    // for(let i = 0;i<this.data.livePro.length;i++){
    //   if(this.data.livePro[i].id==data){
    //     pro_Push = this.data.livePro[i]
    //     break
    //   }
    // }
    // this.setData({
    //   liveProPush: pro_Push,
    //   push_01_show: true
    // })
  },
  reviewLogin: function () {
    var self = this;
    console.log(wx.getStorageSync('userInfo'))
    console.log(wx.getStorageSync('userInfo').anchor_user)
    var userID = wx.getStorageSync('userInfo').anchor_user;
    var userSig = GenerateTestUserSig.genTestUserSig(userID);
    var loginInfo = {
      sdkAppID: userSig.sdkAppID,
      userID: userID,
      userSig: userSig.userSig,
      userName: self.data.userName,
      userAvatar: self.data.userAvatar,
      roomID: self.data.roomID,
      push_key: self.data.push_pro_id
    }
    console.log(loginInfo)
    //MLVB 登录
    liveroom.login({
      data: loginInfo,
      success: function (ret) {
        //登录成功
        self.data.firstshow = false;
        self.data.isGetLoginInfo = true;
        self.start();
        wx.hideLoading();
      },
      fail: function (ret) {
        //登录失败
        self.data.isGetLoginInfo = false;
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: ret.errMsg,
          showCancel: false,
          complete: function () {
            let options = {
              userAvatar: wx.getStorageSync('userInfo').wx_image,
              userName: wx.getStorageSync('userInfo').nickname,
            }
            liveroom.exitRoom(options);
            wx.switchTab({
              url: '/pages/noticeList/noticeList',
            })
          }
        });
      }
    });
  },

  onReady: function () {

  },
  getRedHeight: function (event) {
    console.log("获取红包背景图的高度")
    let imgHeight = this.data.windowWidth / event.detail.width * event.detail.height
    let top = parseInt((this.data.windowHeight - imgHeight) / 2) + parseInt(imgHeight / 3)
    this.setData({
      firstTop: top
    })
  },
  getRedResultHeight: function (event) {
    console.log("获取红包背景图的高度")
    let imgHeight = this.data.windowWidth / event.detail.width * event.detail.height
    let top = parseInt((this.data.windowHeight - imgHeight) / 2) + parseInt(imgHeight / 3)
    this.setData({
      firstTop: top
    })
  },
  getWinHeight: function (event) {
    console.log("获取抽奖背景图的高度")
    console.log(event.detail)
    let imgHeight = this.data.windowWidth / event.detail.width * event.detail.height
    let top = parseInt((this.data.windowHeight - imgHeight) / 2) + parseInt(imgHeight / 6)
    this.setData({
      winHeight: top
    })
  },
  getWinResultHeight: function (event) {
    console.log("获取抽奖背景图的高度")
    console.log(event.detail)
    let imgHeight = this.data.windowWidth / event.detail.width * event.detail.height
    let top = parseInt((this.data.windowHeight - imgHeight) / 2) + parseInt(imgHeight / 3)
    this.setData({
      winResultHeight: top
    })
  },
  onRoomEvent: function (e) {
    var self = this;
    var args = e.detail;
    console.log('onRoomEvent', args)
    switch (args.tag) {
      case 'roomClosed': {
        console.log(self.data.roomID)
        console.log(args)
        if (args.detail.room_id != self.data.roomID) {
          console.log("已解散的房间id", args.detail.room_id)
          console.log("已解散的房主id", args.detail.user_id)
        } else {
          self.setData({
            end_show: true,
            err_show: false,
            playing: false,
          })
        }
        // wx.showModal({
        //   content: `房间已解散`,
        //   showCancel: false,
        //   complete: () => {
        //     wx.navigateBack({
        //       delta: 1
        //     })
        //   }
        // });
        break;
      }
      case 'error': {
        console.log(`${args.detail}[${args.code}]`)
        if (this.data.end_show == false) {
          console.log('获取了error')
          self.setData({
            err_show: true,
            end_show: false,
            playing: false,
          })
        }
        console.log(`${args.detail}[${args.code}]`)
        // wx.showToast({
        //   title: '网络不给力，请稍后重进~',
        //   icon: 'none',
        //   duration: 1500
        // })
        // if (args.code == 5000) {
        //   this.data.shouldExit = true;
        // } else {
        //   console.error("收到error:", args)
        //   if (args.code != -9004) {
        //     setTimeout(() => {
        //       let options = {
        //         userAvatar: wx.getStorageSync('userInfo').wx_image,
        //         userName: wx.getStorageSync('userInfo').nickname,
        //       }
        //       liveroom.exitRoom(options);
        //       wx.switchTab({
        //         url: '/pages/noticeList/noticeList',
        //       })
        //     }, 1500)
        //   } else {
        //     self.setData({
        //       linked: false,
        //       phoneNum: ''
        //     })
        //   }
        // }
        break;
      }
      case 'linkOn': { // 连麦连上
        self.setData({
          linked: true,
          phoneNum: ''
        })
        break;
      }
      case 'linkOut': { //连麦断开
        self.setData({
          linked: false,
          phoneNum: ''
        })
        break;
      }
      case 'recvTextMsg': {
        console.log('收到消息:', e.detail.detail);
        var msg = e.detail.detail;
        let len = self.data.comment.length
        let arr = []
        let flag = true // false说明是商品推屏，不是消息
        if (msg.cmd == '5') {
          // 弹幕
          flag = false
          // msg.isShow = true
          // msg.top = Math.random()*((90-10)+10) +'%'
          // self.data.barrageList.push(msg)
          // self.setData({
          //   barrageList: self.data.barrageList
          // })
          // self.showBarrage()
          let obj = [{
            color: '#fff', // 默认黑色
            name: msg.userName,
            content: msg.message, // 弹幕内容
            image: {
              head: {
                src: msg.userAvatar,
                width: 18,
                height: 18
              }, // 弹幕头部添加图片
              // tail: {src, width, height}, // 弹幕尾部添加图片
              gap: 4 // 图片与文本间隔
            }
          }]
          self.barrage.open()
          self.barrage.addData(obj)
        } else if (msg.cmd == '7') {
          console.log("主播信息，观众人数，观众列表")
          console.log(msg)
          self.setData({
            mem_num: msg.message.member_number,
            anchorInfo: msg.message.anchor,
            memberList: msg.message.audience_list,
          })
          console.log(self.data.mem_num)
          console.log(self.data.anchorInfo)
          console.log(self.data.memberList)
        } else {
          // self.barrage.close()
          // 判断当前消息是否是推屏消息
          if (msg.message.indexOf(self.data.push_pro_id) != -1) {
            // 包含商品
            let slit_arr = []
            slit_arr = msg.message.split('_')
            if (slit_arr[1] == 'dz') {
              util.debounce(
                self.setData({
                  like_num: parseInt(slit_arr[2] == undefined ? self.data.like_num : slit_arr[2])
                }), 1000)
            } else if (slit_arr[1] == 'end') {
              self.setData({
                history_member_num: slit_arr[2],
                live_time: slit_arr[3],
              })
            } else if (slit_arr[1] == 'delete') {
              console.log("移除推屏")
              self.setData({
                liveProPush: {},
                push_01_show: false
              })
            } else if (slit_arr[1] == 'qrcode') {
              console.log("更新主播二维码")
              // 获取主播二维码接口
              self.getAnchorCode()
            } else if (slit_arr[1] == 'lotteryopen') {
              console.log("显示抽奖结果页")
              // 显示抽奖结果页
              // 判断是否参与过
              if (this.data.is_participate) {
                this.setData({
                  showWin: false, // 隐藏抽奖页
                  showWinResult: false, // 隐藏抽奖结果
                  can_lottery: false,
                  showHotBig: false, // 隐藏红包
                  hideHotSmall: true,
                  showHotResult: false, // 隐藏红包结果
                  showAnchorCode: false, // 隐藏主播二维码
                })
                setTimeout(() => {
                  self.getLotteryDetail('open')
                }, 1000)
              } else {
                if (this.data.showWin) {
                  console.log('未参与抽奖，用户一直停留在抽奖页')
                  setTimeout(() => {
                    self.getLotteryDetail('open')
                  }, 1000)
                } else {
                  console.log("未参与抽奖，不弹框，只能主动点击")
                }
              }
            } else if (slit_arr[1] == 'lottery') {
              console.log("显示抽奖啦~")
              // 获取详情接口
              // 接收到新的抽奖推送，重置是否参与按钮，是否分享按钮，隐藏其他弹框
              this.setData({
                showWin: false, // 隐藏抽奖页
                showWinResult: false, // 隐藏抽奖结果
                showHotBig: false, // 隐藏红包
                hideHotSmall: true,
                showHotResult: false, // 隐藏红包结果
                showAnchorCode: false, // 隐藏主播二维码
                is_participate: false,
                can_lottery: false
              })
              setTimeout(() => {
                self.getLotteryDetail('show')
              }, 1000)
            } else if (slit_arr[1] == 'redpacket') {
              console.log("新增红包啦~")
              // 获取红包详情接口
              this.setData({
                showHotBig: false, // 隐藏红包
                hideHotSmall: true,
                showHotResult: false, // 隐藏红包结果
                showAnchorCode: false, // 隐藏主播二维码
                showWin: false, // 隐藏抽奖页
                showWinResult: false, // 隐藏抽奖结果
                can_lottery: false,
                red_is_get: false,
              })
              self.getRedPackageDetail('show')
            } else {
              self.pushPro(slit_arr[1])
            }
            flag = false
          }
        }
        if (flag) {
          self.barrage.close()
          console.log(self.data.comment)
          if (len >= 30) {
            arr = self.data.comment.splice(-28, 29)
            self.data.staticMsg = []
          } else {
            arr = self.data.comment
          }
          for (let i = 0; i < self.data.comment.length; i++) {
            self.data.comment[i].id = msg.roomID + '_' + i
          }
          if (msg.cmd == '4') {
            console.log(arr)
            self.data.like_num++
          }
          // if (msg.cmd == '2' || msg.cmd == '3') {
          //   self.getMemberList()
          // }
          if (msg.cmd == '2') {
            // 进群 加人数
            console.log(msg)
            // 判断接口返回的数据是否大于列表数量，大于则自动加减
            // if(self.data.mem_num>self.data.memberList.length){
            //   self.data.mem_num++
            // }
          } else if (msg.cmd == '3') {
            // 退群 减人数
            // if(self.data.mem_num>self.data.memberList.length){
            //   self.data.mem_num--
            // }
          }
          switch (msg.userName.length) {
            case 1:
              msg.class = 'type_style_02';
              break;
            case 2:
              msg.class = 'type_style_03';
              break;
            case 3:
            case 4:
            case 5:
              msg.class = 'type_style_04';
              break;
            case 6:
            case 7:
            case 8:
            case 9:
              msg.class = 'type_style_05';
              break;
            case 10:
            case 11:
            case 12:
              msg.class = 'type_style_06';
              break;
            case 13:
            case 14:
            case 15:
              msg.class = 'type_style_07';
              break;
            case 16:
            case 17:
            case 18:
            case 19:
              msg.class = 'type_style_08';
              break;
            default:
              msg.class = 'type_style_09';
              break;
          }
          msg.id = 'scroll-bottom'
          if (msg.cmd == 3 || msg.cmd == 2 || msg.cmd == 7) {
            // 退出直播间或者点赞通知
            console.log(msg)
            console.log("退出直播间或者点赞通知或者基础资料或者进房通知")
          } else {
            if (msg.cmd == 4) {
              console.log("点赞通知不显示")
              // self.setData({
              //   animation: true
              // })
              // setTimeout(() => {
              //   self.setData({
              //     animation: false
              //   })
              // }, 760)
            } else {
              console.log("文本消息")
              arr.push(msg);
              console.log(arr)
            }
            // 一秒钟更新最后一条数据
            util.debounce(
              self.setData({
                comment: arr,
                toview: '',
                staticMsg: self.data.staticMsg,
                like_num: self.data.like_num,
                mem_num: self.data.mem_num
              }, () => {
                self.setData({
                  toview: 'scroll-bottom'
                });
              }), 1000)
          }
        } else {
          console.log('推屏商品或者点赞数')
        }
        break;
      }
      case 'requestJoinAnchor': { //收到连麦请求
        var jioner = args.detail;
        var showBeginTime = Math.round(Date.now());
        wx.showModal({
          content: `${jioner.userName} 请求连麦`,
          cancelText: '拒绝',
          confirmText: '接受',
          success: function (sm) {
            var timeLapse = Math.round(Date.now()) - showBeginTime;
            if (timeLapse < 10000) {
              if (sm.confirm) {
                self.component && self.component.respondJoinAnchor(true, jioner);
              } else if (sm.cancel) {
                self.component && self.component.respondJoinAnchor(false, jioner);
              }
            } else {
              wx.showToast({
                title: '连麦超时',
              })
            }
          }
        })
        break;
      }
      case 'playSuccess': { // 直播成功
        self.setData({
          playing: true
        })
        wx.hideLoading()
        break;
      }
      // case 'userInfo': { // 主播信息
      //   self.setData({
      //     anchorInfo: e.detail.detail.pushers[0],
      //     memberList: e.detail.detail.MemberList,
      //     like_num: e.detail.detail.like_num == undefined ? self.data.like_num : e.detail.detail.like_num,
      //     // mem_num: e.detail.detail.MemberNum - 1
      //   })
      //   break;
      // }
      // case 'memberInfo': { // 有人进入群触发的群员列表
      //   console.log('群员列表:', e.detail.detail);
      //   self.setData({
      //     memberList: e.detail.detail.MemberList,
      //     // mem_num: e.detail.detail.MemberNum - 1
      //   })
      //   break;
      // }
      default: {
        console.log('onRoomEvent default: ', e)
        break;
      }
    }
  },
  showBarrage: function (e) {
    let that = this
    timer = setInterval(() => {
      that.data.barrageList.splice(0, 1)
        ++barrage_num
      if (that.data.barrageList.length == barrage_num) {
        barrage_num = 0
        that.setData({
          barrageList: []
        })
        clearInterval(timer)
      }
    }, 3000)

  },
  getMemberList: function () {
    var options = {
      roomID: this.data.roomID,
    }
    this.component.getMemberList(options)
  },
  clearMsg: util.throttle(function (e) {
    this.setData({
      comment: [],
      staticMsg: [],
      showMore: false,
    })
  }),
  initRoom: function (options) {
    //MLVB 登录
    liveroom.initRoom({
      data: options,
      success: function (ret) {
        //初始化成功
        console.log("初始化room成功")
        wx.setStorageSync("login_im", true)
        console.log("初始化成功")
        self.start();
        wx.hideLoading();
      },
      fail: function (ret) {
        //登录失败
        wx.setStorageSync("login_im", false)
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: ret.errMsg,
          showCancel: false,
          complete: function () {
            let options = {
              userAvatar: wx.getStorageSync('userInfo').wx_image,
              userName: wx.getStorageSync('userInfo').nickname,
            }
            liveroom.exitRoom(options);
            wx.switchTab({
              url: '/pages/noticeList/noticeList',
            })
          }
        });
      }
    });
  },
  start: function () {
    var self = this;
    self.component = self.selectComponent("#id_liveroom")
    self.component.start();
  },
  onLinkClick: function () {
    var self = this;
    self.component && self.component.requestJoinAnchor();
    self.setData({
      phoneNum: 'phone-1'
    })
    self.setInternal();
  },
  setInternal: function () {
    var self = this;
    setTimeout(() => {
      if (!self.data.phoneNum) {
        return;
      }

      var curPhoneNum = '';
      switch (self.data.phoneNum) {
        case 'phone-1':
          curPhoneNum = 'phone-2';
          break;
        case 'phone-2':
          curPhoneNum = 'phone-3';
          break;
        case 'phone-3':
          curPhoneNum = 'phone-1';
          break;
        default:
          break;
      }
      self.setData({
        phoneNum: curPhoneNum
      })
      self.setInternal();
    }, 500);
  },
  goRoom: function (e) {
    var self = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var roomID = self.data.rooms[index].roomID;
    self.setData({
      roomID: roomID
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (this.data.shouldExit) {
    //   wx.showModal({
    //     title: '提示',
    //     content: "收到退房通知",
    //     showCancel: false,
    //     complete: function () {
    //       let options = {
    //         userAvatar: wx.getStorageSync('userInfo').wx_image,
    //         userName: wx.getStorageSync('userInfo').nickname,
    //       }
    //       liveroom.exitRoom(options);
    //       wx.switchTab({
    //         url: '/pages/noticeList/noticeList',
    //       })
    //     }
    //   });
    // }
    var self = this;
    self.component && self.component.resume();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var self = this;
    self.component && self.component.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var self = this;
    console.log("页面卸载")
    liveroom.logout();
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
  onShareAppMessage: function (event) {
    if (event.from === 'button') {
      console.log(event)
      console.log(this.data.share_title)
      console.log(this.data.share_img)
      clearTimeout(showlottery)
      let share_url = util.getFullUrl()
      // 转发获得抽奖机会
      let that = this
      let info = {
        lottery_id: this.data.lotteryInfo.id,
      }
      util.queryRequest('/app/lottery/transmitRecord', info, 'POST').then(function (res) {
        if (res.code == 200) {
          that.setData({
            can_lottery: true
          })
        }
      })
      // that.setData({
      //   can_lottery: true
      // })
      return {
        title: this.data.share_title,
        // path: '/pages/multiroom/roomlist/roomlist',
        path: share_url,
        imageUrl: this.data.share_img
      }
    }

  },
})