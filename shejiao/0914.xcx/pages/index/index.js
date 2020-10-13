//index.js
let util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    systimestamp: '',
    isPlay: true,
    bgHeight: '285',
    // topBg: 'linear-gradient(to right, #e34c26, #e13816)',
    topBg: 'transparent',
    hotBg: '#ff000030',
    isChange: false,
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    filePath: app.globalData.fileUrl,
    imgUrls: [], // banner
    bannerType: 1,
    bannerBg: 'transparent',
    swiperIndex: 0,
    searchHeight: 0,
    hotHeight: 0,
    hasData: true,
    is_end: true,
    isTop: true,
    page_num: 0,
    navHeight: app.globalData.navHeight, // 导航栏高度
    floor_version: '',
    floorList: [],
    hotList: [], // 热门搜索
    grassList: [], // 种草专区
    unread: 0, // 未读消息数
    carNum: 0, // 购物车数量
    navList: [{
        id: 1,
        name: '限时抢购',
        imgUrl: app.globalData.staticUrl + 'index/icon_01.png',
        link: '/pages/flashSale/flashSale'
      },
      {
        id: 2,
        name: '超值拼团',
        imgUrl: app.globalData.staticUrl + 'index/icon_02.png',
        link: '/pages/spikeArea/spikeArea'
      },
      {
        id: 3,
        name: '专题活动',
        imgUrl: app.globalData.staticUrl + 'index/icon_03.png',
        link: '/pages/proList/proList'
      },
      {
        id: 4,
        name: '幸运抽奖',
        imgUrl: app.globalData.staticUrl + 'index/icon_04.png',
        link: '/pages/lotteryDraw/lotteryDraw'
      },
      {
        id: 5,
        name: '限量礼盒',
        imgUrl: app.globalData.staticUrl + 'index/icon_05.png',
        link: '/pages/giftBox/giftBox'
      },
      {
        id: 6,
        name: '领积分',
        imgUrl: app.globalData.staticUrl + 'index/icon_06.png',
        link: ''
      },
      {
        id: 7,
        name: '领优惠券',
        imgUrl: app.globalData.staticUrl + 'index/icon_07.png',
        link: '/pages/couponArea/couponArea'
      },
      {
        id: 8,
        name: '体验专区',
        imgUrl: app.globalData.staticUrl + 'index/icon_08.png',
        link: '/pages/experienceArea/experienceArea'
      },
      {
        id: 9,
        name: '积分商城',
        imgUrl: app.globalData.staticUrl + 'index/icon_09.png',
        link: '/pages/integralArea/integralArea'
      },
      {
        id: 10,
        name: '分类',
        imgUrl: app.globalData.staticUrl + 'index/icon_10.png',
        link: '/pages/type/type'
      }
    ],
    imgHeight: 0, // 样式二的轮播图高度
    navWidth: 20,
    adImg01: app.globalData.staticUrl + 'index/ad_01.png',
    tabbarHeight: 0, // 底部栏高度
    typeList: [], // 首页推荐的选项卡
    recommendList: [],
    recommendTop: 0,
    recommendFixed: false,
    category_id: '',
    category_index: 0,
    page: 1,
    size: 8,
    tabs: [],
    activeTab: 0,
    scrollViewHeight: '70vh',
  },
  // 轮播图滚动
  swiperChange: function (e) {
    if(e.detail.source === 'autoplay' || e.detail.source === 'touch'){
      this.setData({
        swiperIndex: e.detail.current
      })
    }
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  getImgHeight(event) {
    console.log("获取banner2的高度")
    console.log(event)
    if (event.target.id == 0) {
      let winWidth = wx.getSystemInfoSync().windowWidth
      this.setData({
        imgHeight: winWidth * event.detail.height / event.detail.width
      })
    }
  },
  visitLink: util.throttle(function (event) {
    console.log(event)
    console.log(event[0].currentTarget.dataset.type)
    let type = event[0].currentTarget.dataset.type
    let activity_id = parseInt(event[0].currentTarget.dataset.activityid)
    let pro_id = parseInt(event[0].currentTarget.dataset.pid)
    let is_skip = event[0].currentTarget.dataset.skip
    if(is_skip==0){
      // 不跳转
      console.log("配置了不跳转")
    }else{
    // type 0首页，1是分类，2是VIP，3是购物车，4是我的，5是商品列表，6是商品详情，7是活动商品详情（暂时不要），
    // 8是领券专区，9是社交直播，10是特定活动，11是专题活动，12是直播预告
    // 特定活动 1是限时抢购，2是体验专区，3是每日秒杀，4是拼团
    // 专题活动，-1是积分专区 integralArea ，-2是新人专享 newShow ，专题活动其余id是活动id specialActivity
    switch (type) {
      case 0:
        wx.reLaunch({
          url: '../index/index',
        });
        break;
      case 1:
        wx.reLaunch({
          url: '../type/type',
        });
        break;
      case 2:
        wx.navigateTo({
          url: '../member/member',
        });
        break;
      case 3:
        wx.reLaunch({
          url: '../car/car',
        });
        break;
      case 4:
        wx.reLaunch({
          url: '../my/my',
        });
        break;
      case 5: // 商品列表
        wx.navigateTo({
          url: '../proList/proList',
        });
        break;
      case 6: // 商品详情
        wx.navigateTo({
          url: '../proDetail/proDetail?id=' + activity_id,
        });
        break;
      case 8: // 领券中心
        wx.navigateTo({
          url: '../couponArea/couponArea',
        });
        break;
      case 9:
        wx.reLaunch({
          url: '../noticeList/noticeList',
        });
        break;
      case 10: // 各类特定活动列表 促销1 pages/flashSale/flashSale，秒杀3 pages/spikeArea/spikeArea，体验2 pages/experienceArea/experienceArea，拼团1 暂无 groupActivities
        if(pro_id==0){
          // 跳转列表
          switch (activity_id) {
            case 1:
              wx.navigateTo({
                url: '/pages/flashSale/flashSale',
              });
              break;
            case 2:
                wx.navigateTo({
                  url: '/pages/experienceArea/experienceArea',
                });
                break;
            case 3:
              wx.navigateTo({
                url: '/pages/spikeArea/spikeArea',
              });
              break;
            case 4:
              wx.navigateTo({
                url: '/pages/groupActivities/groupActivities',
              });
              break;
          }
          break;
        } else{
          // 跳转详情
          wx.navigateTo({
            url: '../activeDetail/activeDetail?id=' + pro_id + "&type=" + activity_id,
          })
        }
        break;
      case 11:
        if(pro_id==0){
          // 跳转列表
          switch (activity_id) {
            case -1:
              wx.navigateTo({
                url: '/pages/integralArea/integralArea',
              });
              break;
            case -2:
                wx.navigateTo({
                  url: '/pages/newShow/newShow',
                });
                break;
            default:
              wx.navigateTo({
                url: '/pages/specialActivity/specialActivity?id=' + activity_id,
              });
              break;
          }
          break;
        }else{
          // 跳转详情
          wx.navigateTo({
            url: '../proDetail/proDetail?act_id=' + activity_id +"&type=activity&act_type=100&goods_id=" + pro_id,
          })
        }
        break;
      case 12: // 直播间预告
        wx.navigateTo({
          url: '../previewDetail/previewDetail?id=' + activity_id,
        });
        break;
      default:
        console.log('啥都不干')
    }
    }

  },1000),
  goLink: util.throttle(function (event) {
    console.log(event)
    wx.navigateTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  goNav: util.throttle(function (e) {
    // wx.requestSubscribeMessage({
    //   tmplIds: ['wm39miIyb377berH-0VvB-GtR44XcFSTdT_z-JW8liU'],
    //   success(res) {
    //     console.log(res)
    //   },
    //   complete(res) {
    //     console.log(res)
    //   },
    // })
    if (e[0].currentTarget.dataset.link != '') {
      wx.navigateTo({
        url: e[0].currentTarget.dataset.link
      })
    }
  }),
  goProDetail: util.throttle(function (e) {
    console.log(e[0])
    let type = e[0].currentTarget.dataset.type
    let id = e[0].currentTarget.id
    if (type == 0) {
      wx.navigateTo({
        url: '/pages/proDetail/proDetail?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/flashDetail/flashDetail?id=' + id + '&type=' + type
      })
    }

  }),
  getIndexs() {
    let that = this
    util.queryRequest('/app/index/getData', {}, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          showSkeleton: false,
          imgUrls: res.data.Banner.list,
          bannerType: res.data.Banner.bg_type,
          bannerBg: res.data.Banner.bg_color,
          hotList: res.data.Hot,
          grassList: res.data.ArticleType,
          unread: res.data.UnreadMsg,
          carNum: res.data.CartNum,
          navList: res.data.NavigationFast.list
        })
        if (res.data.NavigationFast.list.length == 10 || res.data.NavigationFast.list.length == 5) {
          that.setData({
            navWidth: 20
          })
        } else {
          that.setData({
            navWidth: 25
          })
        }
        // 设置全局unread
        app.globalData.unread = res.data.UnreadMsg
        app.globalData.carNum = res.data.CartNum
        let query1 = wx.createSelectorQuery()
        query1.select('.i_top_nav').boundingClientRect()
        query1.select('.i_top_hot').boundingClientRect()
        query1.select('.i_banner').boundingClientRect()
        query1.exec(function (res) {
          that.setData({
            searchHeight: res[0].height,
            hotHeight: res[1].height,
            bgHeight: res[0].height + res[2].height + that.data.navHeight + 10
          })
        })
      }
    })
  },
  getIndexFloor() {
    let that = this
    util.queryRequest('/app/home/getFloor', {}, 'GET').then(function (res) {
      if (res.code == 200) {
        // 楼层样式对应数据
        // 1: 特定活动小
        // 2: 特定活动中
        // 3. 特定活动大
        // 4. 海报展示
        // 5: 标题+海报
        // 6: 标题+列表
        // 7.海报+列表
        // 8: 标题+海报+列表

        // 商品样式:
        // 1;       //双列列表
        // 2;        //单列左图
        // 3;       //单列全图
        // 4;         //三列
        // 5;         //单行固定
        // 6;          //单行滑动
        console.log(res.data)
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].class_style = ".floor_" + res.data.list[i].number
          res.data.list[i].is_show = false
          res.data.list[i].has_data = false
          res.data.list[i].show_data = {
            version: '',
            list: [{
              name: '',
              subtitle: '',
              image: '',
              type: '',
              mode: '',
              list: []
            }],
          }
        }
        // 活动类型type:
        // 1;    //限时抢购活动
        // 2;    //体验专区活动
        // 3;         //礼盒
        // 4;      //每日秒杀
        // 5;      //拼团
        console.log(res.data.version)
        that.setData({
          floor_version: res.data.version,
          floorList: res.data.list
        })
        that.loadFloor()
      }
    })
  },
  loadFloor: util.throttle(function (e) {
    let that = this
    // 请求第一层数据
    // 判断楼层是否可视了
    for (let i = 0; i < that.data.floorList.length; i++) {
      if (that.data.floorList[i].is_show == false) {
        that._observer = wx.createIntersectionObserver(that)
        that._observer
          .relativeToViewport({
            bottom: 50
          })
          .observe(that.data.floorList[i].class_style, (res) => {
            that.data.floorList[i].is_show = res.intersectionRatio > 0
            if (that.data.floorList[i].is_show && that.data.floorList[i].has_data == false) {
              that.data.floorList[i].has_data = true
              // 进入可视区域，请求接口
              util.queryRequest(that.data.floorList[i].url, {}, 'GET').then(function (req) {
                if (req.code == 200) {
                  console.log('获取楼层数据' + that.data.floorList[i].class_style)
                  that.data.floorList[i].show_data = req.data
                  that.setData({
                    floorList: that.data.floorList
                  })
                } else {
                  that.data.floorList[i].has_data = false
                  that.setData({
                    floorList: that.data.floorList
                  })
                }
              }).catch(function (err) {
                console.log(err)
                if (err.errMsg == 'request:fail timeout') {
                  that.data.floorList[i].has_data = false
                  that.setData({
                    floorList: that.data.floorList
                  })
                }
              })
            }
          })
      }
    }

  }, 500),
  showRecommendFixed: util.throttle(function (e) {
    let that = this
    if (e[0] == 'scroll') {
      // 获取推荐距离顶部
      let query2 = wx.createSelectorQuery()
      query2.select('.i_recommend_head').boundingClientRect()
      query2.select('.i_recommend_body').boundingClientRect()
      query2.exec(function (res) {
        console.log("距离顶部的距离")
        console.log(res[0].top)
        console.log(res[1].top)
        console.log(that.data.hotHeight+that.data.navHeight)
        if(that.data.scrollViewHeight=='70vh'){
          that.setData({
            scrollViewHeight: app.globalData.useWindowHeight - res[0].height - that.data.hotHeight - that.data.navHeight + 'px'
          })
        }
        if (res[0].top < (that.data.hotHeight+that.data.navHeight) && that.data.recommendFixed == false) {
          that.setData({
            recommendFixed: true
          })
        }
        if (res[1].top > 160 && that.data.recommendFixed) {
          that.setData({
            recommendFixed: false
          })
        }
      })
    }
  },100),
  changeType: function (e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      category_id: e.currentTarget.dataset.id,
      page: 1,
      size: this.data.size,
      recommendList: [],
      total: 0,
      page_num: 0,
      is_end: false,
      hasData: false,
    })
    let that = this
    let info = {
      category_id: this.data.category_id,
      page: this.data.page,
      size: this.data.size
    }
    util.queryRequest('/app/index/recommend', info, 'GET').then(function (res) {
      if (res.code == 200) {
        let currentpage = that.data.page - 1
        if (res.data.rows != undefined && res.data.rows.length > 0) {
          that.setData({
            ['recommendList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        } else {
          that.setData({
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  getIndexRecommend() {
    // 获取首页推荐数据
    let that = this
    let info = {
      category_id: this.data.category_id,
      page: this.data.page,
      size: this.data.size
    }
    util.queryRequest('/app/index/recommend', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        if (res.data.category != undefined) {
          let currentpage = that.data.page - 1
          for (let i = 0; i < res.data.category.length; i++) {
            res.data.category[i].list = []
          }
          that.setData({
            typeList: res.data.category,
            tabs: res.data.category,
            category_index: 0,
            activeTab: 0,
            category_id: res.data.category[0].id
          })
          if (res.data.rows != undefined && res.data.rows.length > 0) {
            that.data.tabs[that.data.activeTab].list[0] = res.data.rows
            that.data.typeList[that.data.activeTab].list[0] = res.data.rows
            that.setData({
              ['recommendList[' + currentpage + ']']: res.data.rows,
              tabs: that.data.tabs,
              typeList: that.data.tabs,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true
            })
            console.log(that.data.tabs)
          } else {
            that.data.tabs[that.data.activeTab].list[0] = []
            that.data.typeList[that.data.activeTab].list[0] = []
            that.setData({
              recommendList: [],
              tabs: that.data.tabs,
              typeList: that.data.tabs,
              total: 0,
              page_num: 0,
              is_end: true,
              hasData: false
            })
          }
          console.log(that.data.recommendList)
          // 获取推荐距离顶部
          // let query2 = wx.createSelectorQuery()
          // query2.select('.i_recommend_head').boundingClientRect()
          // query2.select('.banner_bg').boundingClientRect()
          // query2.exec(function (res) {
          //   console.log("距离顶部的距离")
          //   console.log("未滚动时顶部搜索区域的高度，导航栏的高度，本身搜索顶部的top包括了导航高度和热搜词的高度")
          //   that.setData({
          //     recommendTop: res[0].top - res[1].height - that.data.navHeight - that.data.hotHeight
          //   })
          //   console.log(res[0].top - res[1].height - that.data.navHeight - that.data.hotHeight)
          // })
        }
      }
    })
  },
  onTabCLick(e) {
    console.log("点击选择")
    console.log(e)
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
  },
  onChange(e) {
    console.log("滑动选择")
    console.log(e)
    const index = e.detail.index
    this.setData({
      activeTab: index,
      category_id: this.data.tabs[index].id,
      page: 1,
      size: this.data.size,
      recommendList: [],
      total: 0,
      page_num: 0,
      is_end: false,
      hasData: false,
    })
    let that = this
    let info = {
      category_id: this.data.category_id,
      page: this.data.page,
      size: this.data.size
    }
    util.queryRequest('/app/index/recommend', info, 'GET').then(function (res) {
      if (res.code == 200) {
        let currentpage = that.data.page - 1
        if (res.data.rows != undefined && res.data.rows.length > 0) {
          that.data.tabs[that.data.activeTab].list[0] = res.data.rows
          that.data.typeList[that.data.activeTab].list[0] = res.data.rows
          that.setData({
            ['recommendList[' + currentpage + ']']: res.data.rows,
            tabs: that.data.tabs,
            typeList: that.data.tabs,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          console.log(that.data.tabs)
        } else {
          that.setData({
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  loadRecommendMore() {
    if (this.data.is_end == false) {
      this.loadMore()
    } else {
      console.log("加载完了")
    }
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      console.log(this.data.serach_type)
      info = {
        category_id: this.data.category_id,
        page: ++this.data.page,
        size: this.data.size
      }
      console.log(info)
      util.queryRequest('/app/index/recommend', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          if (res.data.rows != undefined && res.data.rows.length > 0) {
            that.setData({
              ['recommendList[' + currentpage + ']']: res.data.rows,
              is_end: that.data.page_num == that.data.page
            })
            console.log(that.data.is_end)
            console.log(that.data.tabs)
          } else {
            that.setData({
              is_end: true
            })
          }
        }
      })
    } else {
      console.log("加载完了")
    }

  },
  serverLocalDate: function() {
    var _this = this;
    let newDate = new Date(); // 获取服务器时间
    var systimestamp = new Date(newDate).getTime();
    _this.setData({
      servicetimeInterval: setInterval(function() { // 循环执行
        systimestamp = (systimestamp / 1000 + 1) * 1000;
        _this.setData({
          systimestamp: systimestamp
        })
      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 获取轮播图相关的首页信息
    this.serverLocalDate()
    this.getIndexs()
    this.getIndexFloor()
    
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false,
        tabbarHeight: app.globalData.tabbarHeight
      })
    }, 1000)
    this.getIndexRecommend()
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log(wx.getStorageSync("navList"))
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.setData({
      isPlay: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isPlay: false
    })
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 140) {
      if (this.data.isTop == true) {
        console.log("显示返回顶部")
        this.setData({
          isTop: false,
          isPlay: false
        })
      }
      this.loadFloor()
      this.showRecommendFixed('scroll')
      // if (this.data.recommendFixed == false && e.scrollTop > this.data.recommendTop) {
      //   this.setData({
      //     recommendFixed: true
      //   })
      // }
      // if (this.data.recommendFixed == true && e.scrollTop < (this.data.recommendTop - 100)) {
      //   this.setData({
      //     recommendFixed: false
      //   })
      // }
    }
    if (e.scrollTop <= 140) {
      if (this.data.isTop == false) {
        console.log("隐藏返回顶部")
        this.setData({
          isTop: true,
          isPlay: true,
          recommendFixed: false
        })
      }
      if (e.scrollTop >= 10 && this.data.isChange == false) {
        this.setData({
          isChange: true,
          topBg: 'linear-gradient(to right, #e34c26, #e13816)',
        })
      }
      if (e.scrollTop < 10 && this.data.isChange) {
        this.setData({
          isChange: false,
          topBg: 'transparent',
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isPlay: false
    })
  },
  pullLoad:util.throttle(function(){
    this.getIndexs()
    this.getIndexFloor()
    this.getIndexRecommend()
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1500)
  },1500),
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 获取轮播图相关的首页信息
    this.pullLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.is_end == false) {
      this.loadMore()
    } else {
      console.log("加载完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})