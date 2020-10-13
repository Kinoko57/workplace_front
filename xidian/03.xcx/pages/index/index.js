 // pages/index/index.js
let util = require('../../utils/util.js')
var app = getApp()
let leftHeight = 0,
  rightHeight = 0; //分别定义左右两边的高度
let query;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    videoHeight: 350,
    isPlay: true,
    is_iphonex: app.globalData.isiPhoneX,
    search_height:0,
    showSkeleton: true,
    grassList: [],
    dynamicList: [],
    group_scroll:[],
    col1: [],
    col2: [],
    hotList: [],
    groupList: [],
    page: 1,
    size: 6,
    page_num: 0,
    hasData: true,
    scrollTime: '',
    animationData: '',
    total: 0,
    hotSearch:[],
    is_end: false,
    isTop: true,
    scrollHeight: 0,
    imgWidth: 340,
    loadingCount: 0,
    spellList: [],
    imgUrls: [], // banner
    imgHeight: '100',
  },
  toSearch:util.throttle(function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../searchList/searchList?type=key&value='+e[0].currentTarget.dataset.name,
    })
  }),
  searchpage:util.throttle(function (event) {
    wx.navigateTo({
      url: '../search/search',
    })
  }),
  loadImag:function(list){
    const that=this
    wx.downloadFile({
      url: list[0].image,
      success(req) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (req.statusCode === 200) {
          wx.getImageInfo({
            src: req.tempFilePath,
            success(res) {
              console.log(res)
                that.setData({
                  imgHeight: (getApp().globalData.useWindowwidth/res.width) * res.height
                })
                console.log(that.data.imgHeight,"图片高度")
              // that.onImageLoad(list, list[i].id, res.width, res.height)
            }
          })
        }
      }
    })
  },
  // getFirstimgHeight: function (e) {
  //   console.log(e)
  //   console.log(e.currentTarget.id)
  //   console.log(this.data.imgUrls,"tupian")
  //   if (e.currentTarget.id == 0) {
  //     this.setData({
  //       imgHeight: (getApp().globalData.useWindowwidth/e.detail.width) * e.detail.height
  //     })
  //     console.log(e.detail.height,this.data.imgHeight)
  //   }
  // },
  visitLink: util.throttle(function (event) {
    let type = event[0].currentTarget.dataset.type
    let activity_id = parseInt(event[0].currentTarget.dataset.activityid)
    // type 0不跳转，1是首页，2是我的，3是动态，4是课程，5是课程详情，6是团购列表，7是团购详情，9是动态详情
    switch (type) {
      case 0:
        console.log("不跳转")
        break;
      case 1:
        wx.switchTab({
          url: '/pages/index/index',
        });
        break;
      case 2:
        wx.switchTab({
          url: '/pages/my/my',
        });
        break;
      case 3:
        wx.switchTab({
          url: '/pages/social/social',
        });
        break;
      case 4:
        wx.switchTab({
          url: '/pages/course/course',
        });
        break;
      case 5: // 课程详情
        wx.navigateTo({
          url: '/pages/proDetail/proDetail?id=' + activity_id,
        });
        break;
      case 6: // 团购列表
        wx.navigateTo({
          url: '/pages/spellGroup/spellGroup',
        });
        break;
      case 7: // 团购详情
        wx.navigateTo({
          url: '/pages/groupDetail/groupDetail?id=' + activity_id,
        });
        break;
      case 9: // 动态详情
        wx.navigateTo({
          url: '/pages/articleDetail/articleDetail?id=' + activity_id,
        });
        break;
      default:
        console.log('啥都不干')
    }
  }),
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goLink: util.throttle(function (event) {
    wx.navigateTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  goNavBar: util.throttle(function (event) {
    wx.setStorageSync('now_activity_id', event[0].currentTarget.id)
    wx.switchTab({
      url: event[0].currentTarget.dataset.link
    })
  }),
  goTabBar: util.throttle(function (event) {
    wx.switchTab({
      url: event[0].currentTarget.dataset.link
    })
  }),
  async isLeft(list) {
    let {
      col1,
      col2
    } = this.data;
    query = wx.createSelectorQuery();
    for (const item of list) {
      leftHeight <= rightHeight ? col1.push(item) : col2.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(col1, col2);
    }
  },
  getBoxHeight(col1, col2) { //获取左右两边高度
    return new Promise((resolve, reject) => {
      this.setData({
        col1,
        col2
      }, () => {
        query.select('.hot_block_left').boundingClientRect();
        query.select('.hot_block_right').boundingClientRect();
        query.exec((res) => {
          console.log(res)
          leftHeight = res[0].height; //获取左边列表的高度
          rightHeight = res[1].height; //获取右边列表的高度
          console.log(leftHeight)
          console.log(rightHeight)
          resolve();
        });
      });
      console.log(this.data.col1,"左侧高度")
    })
  },
  getList() {
    let that = this
    let info = {
      page: this.data.page,
      size: this.data.size,
    }
    console.log(that.data.imgUrls,"lkejfwlkerjwlekrwerjlkwer11111")
    util.queryRequest('app/index/index', info, 'GET').then(function (res) {
      wx.stopPullDownRefresh()
      if (res.code == 200) {
        that.loadImag(res.data.banner)
        that.setData({
          // message_unread:res.data.message_unread.toString(),
          imgUrls: res.data.banner,
          videoUrl: res.data.video,
          grassList: res.data.article,
          dynamicList: res.data.dynamic,
          showSkeleton: false,
          group_scroll:res.data.scroll,
          groupList: res.data.group,
        })
        wx.downloadFile({//需要先下载文件获取临时文件路径 单个文件大小不得超过50M
          url: res.data.video,
          success(res1) {
              console.log(res1.tempFilePath)
              //获取视频相关信息
              wx.getVideoInfo({
                  src: res1.tempFilePath,//视频临时路径
                  success(res) {
                      console.log('获取文件地址成功')
                      console.log(res)
                      that.setData({
                        videoHeight: (getApp().globalData.useWindowwidth/res.width) * res.height
                      })
                  },
                  fail:function(res){
                      console.log('获取文件地址失败')
                      console.log(res)
                  },
                  complete(res){
                      console.log('获取文件地址')
                  }
              })
          }
      })
        console.log(that.data.imgUrls,"lkejfwlkerjwlekrwerjlkwer")
        console.log(res.data.message_unread,"未读数字")
        if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined&&res.data.message_unread>0) {
          wx.setTabBarBadge({
            index: 3,  //tabBar序号，从0开始计数
            text:res.data.message_unread.toString()
          })
        }else{
          wx.removeTabBarBadge({
            index: 3,  //tabBar序号，从0开始计数
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  searchHis: function() {
    var that = this;
    // 获取热门搜索列表
    util.queryRequest('app/index/hotList', {
      page: 1,
    }, 'GET').then(function(res) {
      if (res.code == 200) {
        that.setData({
          hotSearch: res.data.rows,
        })
          let query1 = wx.createSelectorQuery()
          query1.select('.i_search').boundingClientRect()
          query1.exec(function (req) {
            that.setData({
              search_height: req[0].height
            })
          })
      }
    })
  },
  getRecommList() {
    let that = this
    let info = {
      page: this.data.page,
      size: this.data.size,
    }
    util.queryRequest('app/index/goods', info, 'GET').then(function (res) {
      wx.stopPullDownRefresh()
      if (res.code == 200) {
        if (res.data.rows.length > 0) {
          for (let i = 0; i < res.data.rows.length; i++) {
            if (res.data.rows[i].image != '') {
              res.data.rows[i].image = res.data.rows[i].image.split(',')[0]
            }
            res.data.rows[i].left = 1
            if (i % 2 == 0) {
              res.data.rows[i].left = 0
            }
          }
          that.isLeft(res.data.rows)
          console.log(res.data.rows,"请求数据")
          that.setData({
            articleList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        } else {
          that.setData({
            hasData: false,
            is_end: true,
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      info = {
        page: ++this.data.page,
        size: this.data.size,
      }
      util.queryRequest('app/index/goods', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          // let currentpage = that.data.page - 1
          // if(res.data.rows!=undefined&&res.data.rows.length>0){
          //   that.setData({
          //     hotList: that.data.hotList.concat(res.data.rows),
          //     is_end: that.data.page_num == that.data.page
          //   })
          //   console.log(that.data.is_end)
          // }else{
          //   that.setData({
          //     is_end: true
          //   })
          // }
          if (res.data.rows.length > 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              if (res.data.rows[i].image != '') {
                res.data.rows[i].image = res.data.rows[i].image.split(',')[0]
              }
              res.data.rows[i].left = 1
              if (i % 2 == 0) {
                res.data.rows[i].left = 0
              }
            }
            that.setData({
              articleList: that.data.articleList.concat(res.data.rows),
              is_end: that.data.page_num == that.data.page,
              hasData: true
            })
            console.log()
            that.isLeft(res.data.rows)
          } else {
            that.setData({
              hasData: false,
              is_end: true,
            })
          }
        }
      })
    } else {
      console.log("加载完了")
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    leftHeight = 0
    rightHeight = 0
    wx.getSystemInfo({
      success(res) {
        //导航高度 statusBarHeight手机状态栏的高度
        getApp().globalData.useWindowHeightFoot = res.windowHeight;
        console.log("首页重新获取可用宽高")
        console.log(getApp().globalData.useWindowHeightFoot)
      },
      fail(err) {
        console.log(err)
      }
    })
    const that = this
    wx.setNavigationBarTitle({
      title: '西点好习惯军事夏令营'
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    this.getList()
    this.searchHis()
    this.getRecommList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
    this.scrollPro = wx.createAnimation({})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isPlay:true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isPlay:false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isPlay:false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    leftHeight = 0
    rightHeight = 0
    that.setData({
      showSkeleton: true,
      page:1,
      message_unread:0,
      articleList: [],
      groupInfo:[],
      col1: [],
      col2: [],
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    this.getList()
    this.searchHis()
    this.getRecommList()
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
      const that=this
      var timer = that.data.scrollTime
      if (timer) {
        var query3 = wx.createSelectorQuery()
        query3.select('.i_group_scroll').boundingClientRect()
        query3.exec(function (res) {
          var leftWidth = res[0].width
          that.animation.translateX(-leftWidth).step()
          that.setData({
            animationData: that.animation.export(),
          })
        })
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        var query4 = wx.createSelectorQuery()
        query4.select('.i_group_scroll').boundingClientRect()
        query4.exec(function (res) {
          that.animation.translateX(0).step()
          that.setData({
            animationData: that.animation.export(),
          })
        })
      }, 100);
      this.setData({
        scrollTime: timer
      })



    if (e.scrollTop > 140) {
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if (this.data.is_end == false) {
    //   this.loadMore()
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      // 来自页面内转发按钮
      return {
        title:'【有人@你】西点好习惯军事夏令营',
      }
  }
})