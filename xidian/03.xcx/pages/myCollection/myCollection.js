// pages/myCollection/myCollection.js
let col1H = 0,
  col2H = 1;
let query;

let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allow_change: false,
    staticUrl: app.globalData.staticUrl,
    list_type: 1,
    navHeight: app.globalData.navHeight,
    showSkeleton: true,
    imgPath: app.globalData.fileUrl,
    hiddenlogin: app.globalData.hiddenlogin,
    apiUrl: app.globalData.apiUrl,
    page: 1,
    limit: 10,
    type: 0,
    total: 0,
    page_num: 0,
    hasData: true,
    is_end: false,
    is_load: false,
    topNum: 0,
    collList: [],
    col1: [],
    col2: [],
    allchose: 0,
    chose_id: '',
    chose_index: '',
    isEdit: false,
    // 记录当前偏移量
    currentX: 0,
    // 用户是否在触摸
    isTouchMove: false,
    isTop: true, // 返回顶部
    is_iphonex: app.globalData.isiPhoneX,
    can_chose_pro: true
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  choseType: util.throttle(function (e) {
    if (this.data.allow_change) {
      console.log(e[0].currentTarget.id)
      if (e[0].currentTarget.id == this.data.type) {
        console.log("点击了原来的按钮")
      } else {
        col1H = 0
        col2H = 0
        if (e[0].currentTarget.id == 0) {
          this.setData({
            type: 0,
            list_type: 1,
            page: 1,
            collList: [],
            col1: [],
            col2: [],
            allchose: 0,
          })
        } else if (e[0].currentTarget.id == 1) {
          this.setData({
            type: 1,
            list_type: 1,
            page: 1,
            collList: [],
            col1: [],
            col2: [],
            allchose: 0,
          })
        } else {
          this.setData({
            type: 2,
            list_type: 1,
            page: 1,
            collList: [],
            col1: [],
            col2: [],
            allchose: 0,
          })
        }
        this.data.allow_change = false
        this.getList()
      }
    } else {
      console.log("还没加载完")
    }
  }, 500),
  changeListType: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        list_type: 2
      })
    } else {
      this.setData({
        list_type: 1
      })
    }
  },
  goProDetail: util.throttle(function (e) {
    console.log(e[0])
    const that = this
    if (that.data.isEdit == false) {
      if (that.data.can_chose_pro) {
        that.data.can_chose_pro = false
        if (e[0].currentTarget.id != '') {
          that.data.can_chose_pro = true
          let type = e[0].currentTarget.dataset.type
          let id = e[0].currentTarget.id
          if (type == 0) {
            wx.navigateTo({
              url: '/pages/proDetail/proDetail?id=' + id
            })
          } else {
            wx.navigateTo({
              url: '/pages/groupDetail/groupDetail?id=' + id
            })
          }
        }
      }
    }
  }),
  goArticleDetail: util.throttle(function (e) {
    console.log(e[0])
    const that = this
    if (that.data.isEdit == false) {
      if (that.data.can_chose_pro) {
        that.data.can_chose_pro = false
        if (e[0].currentTarget.id != '') {
          that.data.can_chose_pro = true
          let type = e[0].currentTarget.dataset.type
          let id = e[0].currentTarget.id
          if (that.data.type == 2) {
            wx.navigateTo({
              url: '../viewDynamic/viewDynamic?id=' + id
            })
          } else {
            wx.navigateTo({
              url: '../viewArticle/viewArticle?id=' + id
            })
          }

        }
      }
    }
  }),
  // goPro: function (e) {
  //   const that = this
  //   if (that.data.isEdit == false) {
  //     if (that.data.can_chose_pro) {
  //       that.data.can_chose_pro = false
  //       if (e.currentTarget.id != '') {
  //         that.data.can_chose_pro = true
  //         wx.navigateTo({
  //           url: e.currentTarget.dataset.link
  //         })
  //         // util.queryRequest('?m=item', {
  //         //   id: e.currentTarget.id
  //         // }, 'GET', function (res) {
  //         //   if (res.code == 200) {
  //         //     wx.showToast({
  //         //       title: res.msg,
  //         //       icon: 'none',
  //         //       duration: 2000
  //         //     })
  //         //   } else {
  //         //     // belong商品所属类型 1积分兑换 2限时促销 3VIP 4生日特权 5试用装 6拼团 7活动抽奖 8扫码抽奖 9水果专区 10扫码试用商品
  //         //   }
  //         // })
  //       }
  //     }
  //   }

  // },
  edit: function () {
    for (var j = 0; j < this.data.collList.length; j++) {
      this.data.collList[j].checked = false
    }
    this.setData({
      isEdit: !this.data.isEdit,
      collList: this.data.collList
    })
  },
  delColl: function () {
    var that = this
    var delList = [];
    for (var j = 0; j < this.data.collList.length; j++) {
      if (this.data.collList[j].checked == true) {
        delList.push(this.data.collList[j].c_id)
      }
    }
    if (delList.length == 0) {
      wx.showToast({
        title: '请选择要操作的数据',
        icon: 'none',
        duration: 1000
      })
    } else {
      let msg = "确定要删除该课程的点赞记录吗？"
      if (that.data.type == 1) {
        msg = "确定要删除该动态的点赞记录吗？"
      }
      wx.showModal({
        title: '提示',
        content: msg,
        success: function (res) {
          if (res.confirm) {
            util.queryRequest('app/footOther/cancelLike', {
              c_id: delList.join(','),
              type: that.data.type
            }, 'GET').then(function (res) {
              if (res.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                if (that.data.type == 1) {
                  wx.setStorageSync('refresh', 1)
                }
                setTimeout(function () {
                  that.setData({
                    page: 1
                  })
                  that.getList()
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
  handleMovableChange(e) {
    let flag = false
    if (
      e.detail.source === 'touch' ||
      e.detail.source === 'touch-out-of-bounds'
    ) {
      flag = true;
    } else {
      flag = false;
    }
    this.setData({
      isTouchMove: flag,
      currentX: e.detail.x
    })
  },
  handleTouchend(idx, e) {
    if (this.data.isTouchMove) {
      if (this.data.currentX < -46) {
        this.data.collList[idx].x = -92;
        this.data.setData({
          collList: this.data.collList
        });
      } else {
        this.data.collList[idx].x = 0;
        this.data.setData({
          collList: this.data.collList
        });
      }
    }
  },
  // 单个删除收藏
  handleDelete(event) {
    console.log(event)
    let that = this
    let msg = "确定要删除该课程的点赞记录吗？"
    if (that.data.type == 1) {
      msg = "确定要删除该动态的点赞记录吗？"
    }
    wx.showModal({
      title: '提示',
      content: msg,
      success(res) {
        if (res.confirm) {
          let id = event.currentTarget.id
          let index = event.currentTarget.dataset.index
          wx.showLoading({
            title: '处理中',
          })
          let collList = that.data.collList
          collList.splice(index, 1)
          util.queryRequest('app/footOther/cancelLike', {
            c_id: id,
            type: that.data.type
          }, 'GET').then(function (res) {
            wx.hideLoading()
            if (res.code == 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              if (that.data.type == 1) {
                wx.setStorageSync('refresh', 1)
              }
              setTimeout(function () {
                that.setData({
                  page: 1
                })
                that.getList()
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  choseColl: function (e) {
    console.log(e.detail.value)
    for (var j = 0; j < this.data.collList.length; j++) {
      this.data.collList[j].checked = false
    }
    if (e.detail.value.length !== 0) {
      for (var i = 0; i < e.detail.value.length; i++) {
        for (var j = 0; j < this.data.collList.length; j++) {
          if (e.detail.value[i] == this.data.collList[j].c_id) {
            this.data.collList[j].checked = true
          }
        }
      }
      this.setData({
        collList: this.data.collList
      })
      console.log(this.data.collList)
    }
    for (var k = 0; k < this.data.collList.length; k++) {
      if (this.data.collList[k].checked == false) {
        this.data.allchose = 0
        break;
      }
    }
    if (k >= this.data.collList.length) {
      this.data.allchose = 1
    }
    this.setData({
      allchose: this.data.allchose
    })

  },
  checkAll: function () {
    if (this.data.allchose == 0) {
      for (var j = 0; j < this.data.collList.length; j++) {
        this.data.collList[j].checked = true
      }
      this.setData({
        allchose: 1
      })
    } else {
      for (var j = 0; j < this.data.collList.length; j++) {
        this.data.collList[j].checked = false
      }
      this.setData({
        allchose: 0
      })
    }
    this.setData({
      collList: this.data.collList
    })
  },
  getList: function () {
    var that = this
    util.queryRequest('app/footOther/likeIndex', {
      page: that.data.page,
      size: that.data.limit,
      type: that.data.type
    }, 'GET').then(function (res) {
      wx.hideLoading()
      if (res.code == 200) {
        that.setData({
          collList: [],
          col1: [],
          col2: [],
        })
        if (res.data.rows.length > 0) {
          for (var j = 0; j < res.data.rows.length; j++) {
            res.data.rows[j].checked = false
            res.data.rows[j].x = 0
            res.data.rows[j].ima
          }
          that.isLeft(res.data.rows)
          that.setData({
            collList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.limit),
            is_end: Math.ceil(res.data.total / that.data.limit) == that.data.page,
            hasData: true
          })
        } else {
          that.setData({
            collList: [],
            total: 0,
            hasData: false,
            is_end: true,
            isEdit: false,
            allchose: false,
            allow_change: true
          })
        }
      }
    })
  },
  async isLeft(list) {
    let {
      col1,
      col2
    } = this.data;
    query = wx.createSelectorQuery();
    let i =0;
    for (const item of list) {
      col1H <= col2H ? col1.push(item) : col2.push(item); //判断两边高度，来觉得添加到那边
      await this.getBoxHeight(col1, col2);
      ++i
    }
    if (i == list.length) {
      console.log("执行完了吗")
      this.data.allow_change = true
    }
  },
  getBoxHeight(col1, col2) { //获取左右两边高度
    return new Promise((resolve, reject) => {
      this.setData({
        col1,
        col2
      }, () => {
        query.select('.article_block_left').boundingClientRect();
        query.select('.article_block_right').boundingClientRect();
        query.exec((res) => {
          console.log(res)
          if (res[0] != null) {
            col1H = res[0].height; //获取左边列表的高度
          }
          if (res[1] != null) {
            col2H = res[1].height; //获取右边列表的高度
          }
          resolve();
        });
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 1000)
    wx.setNavigationBarTitle({
      title: '我的点赞'
    })
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.actionSheet = this.selectComponent("#action-sheet");

  },
  showActionSheet: function (event) {
    this.setData({
      chose_id: event.currentTarget.id,
      chose_index: event.currentTarget.dataset.index,
    })
    this.actionSheet.show()
  },

  _actionEvent: function () {
    console.log('confirm');
    let that = this
    // 删除单个商品chose_id
    let collList = that.data.collList
    collList.splice(that.data.chose_index, 1)
    util.queryRequest('app/footOther/cancelLike', {
      c_id: that.data.chose_id,
      type: that.data.type
    }, 'GET').then(function (res) {
      wx.hideLoading()
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          that.setData({
            page: 1
          })
          that.getList()
          that.actionSheet.hide()
        }, 1000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  _cancelEvent: function () {
    console.log('cancel');
    this.actionSheet.hide()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.can_chose_pro = true
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
    // var that = this
    // that.setData({
    //   page: 1
    // })
    // that.getList()
    // wx.stopPullDownRefresh()
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 140) {
      if (this.data.isTop == true) {
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 140) {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  loadMore: function () {
    var that = this
    util.queryRequest('app/footOther/likeIndex', {
      page: ++that.data.page,
      size: that.data.limit,
      type: that.data.type
    }, 'GET').then(function (res) {
      if (res.code == 200) {

        if (that.data.allchose == 1) {
          for (var j = 0; j < res.data.rows.length; j++) {
            res.data.rows[j].checked = true
            res.data.rows[j].x = 0
          }
        } else {
          for (var j = 0; j < res.data.rows.length; j++) {
            res.data.rows[j].checked = false
            res.data.rows[j].x = 0
          }
        }
        that.data.collList = that.data.collList.concat(res.data.rows)
        that.isLeft(res.data.rows)
        that.setData({
          collList: that.data.collList,
          is_end: that.data.page_num == that.data.page
        })
      }
    })
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
  // onShareAppMessage: function() {

  // }
})