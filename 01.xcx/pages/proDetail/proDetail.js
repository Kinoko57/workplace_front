// pages/proDetail/proDetail.js
const app = getApp();
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowbind: true,
    success_num: 0,
    title_tips: '',
    g_list_height: 350,
    groupTotal: 0,
    comHeight: 0,
    moreHeight: 0,
    proHeight: 0,
    topNum: 0,
    hiddenFix: false,
    isShow: false,
    imgUrls: [],
    height: '',
    min_height: 0,
    sale_type: '',
    price_type: '',
    default_price_type: '',
    default_chose_paytype: false,
    chose_paytype: false,
    apiUrl: app.globalData.apiUrl,
    userInfo: app.globalData.userInfo,
    params:{},
    choseName: 'pro',
    rate: '',
    chosecap: true,
    modelShow: true,
    groupShow: true,
    specNum: 1,
    isColl: false,
    isSign: true,
    page: 1,
    is_up: '', //是否上架
    limit: 10,
    buyType: 0,
    product_id: null,
    // usepoint: 0,
    default_spec: {},
    maxNum: 0,
    totalNum: 0,
    summary: '', //商品简介
    recomList: [],// 推荐商品
    proInfo: [],
    goods_info: [],
    comList: [],
    comDetail: [],
    specNameList: [],
    specDetailList: [],
    specList: [],
    showSpec: [],
    // isnormal: true,
    toView: '',
    proType: 'normal',
    intrDetail: '',
    specDetail: '',
    afterDetail: '',
    choseid: 'p',
    allCom: false,
    activity: {},
    endTime: null,
    saleTime: [],
    time: null,
    endTimeList: [],
    saleTimeList: [],
    addgroup: '',
    groupId: '',
    goods_id: '',
    hasSpec: true,
    groupList: [],
    isFlash: 0,
    firstImg: '',
    price_market_from: '',
    price_market: 0,
    staticImg: '',
    activity_price_type: '',
    normal_price_type: '',
    group_start: 0,
    is_iphonex: app.globalData.phoneType,
    spec_up: true,
    comTotal: 0,
    openLoad: false,
    imgPreview: true
  },
  viewImg: function(e) {
    var arr = []
    arr.push(e.currentTarget.dataset.url)
    this.setData({
      imgPreview:false
    })
    wx.previewImage({
      //当前显示图片
      current: arr[0],
      urls: arr
    })
  },
  golink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  goPro: function (e) {
    if (e.currentTarget.id != '') {
      util.queryRequest('?m=item', {
        id: e.currentTarget.id
      }, 'GET', function (res) {
        if (res.isSuccess == false) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.navigateTo({
            url: e.currentTarget.dataset.link
          })
        }
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  scroll: function(e) {
    if (e.detail.scrollTop > 900) {
      this.setData({
        isSign: false
      })
      if (this.data.allCom) {
        if (e.detail.scrollTop > 900 * (this.data.page)) {
          if (this.data.openLoad) {
            var that = this
            util.queryRequest('?m=item&a=get_comment', {
              goods_id: that.data.proInfo.goods_id,
              page: ++that.data.page,
              limit: that.data.limit
            }, 'GET', function(res) {
              if (res.isSuccess) {
                if (res.rows.length > 0) {
                  that.data.comDetail = that.data.comDetail.concat(res.rows)
                  that.setData({
                    comDetail: that.data.comDetail,
                    choseName: 'com'
                  })
                } else {
                  that.setData({
                    openLoad: false
                  })
                }
              }
            })
          }
        }
      }else{
        //判断
        let query = wx.createSelectorQuery();
        query.select('#recommend').boundingClientRect(rect => {
          if (rect.top < 122){
            this.setData({
              choseName: 'recommend'
            })
          }else{
            this.setData({
              choseName: 'more'
            })
          }
        }).exec();
      }
    } else {
      if (this.data.allCom == false) {
        if (e.detail.scrollTop < 500) {
          this.setData({
            choseName: 'pro'
          })
        } else if (e.detail.scrollTop > 500) {
          if (this.data.comList.length <= 0) {
            if (e.detail.scrollTop > 684) {
              this.setData({
                choseName: 'more'
              })
            } else {
              this.setData({
                choseName: 'com'
              })
            }
          } else {
            this.setData({
              choseName: 'com'
            })
          }
        }
      } else {
        this.setData({
          toView: 'more'
        })
      }
      this.setData({
        isSign: true
      })
    }

  },
  previewImg: function(e) {
    var imgs = [];
    for (var i = 0; i < this.data.comList.length; i++) {
      if (this.data.comList[i].id == e.currentTarget.dataset.comid) {
        imgs = this.data.comList[i].pic
      }
    }
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })

  },
  previewImg1: function(e) {
    var imgs = [];
    for (var i = 0; i < this.data.comDetail.length; i++) {
      if (this.data.comDetail[i].id == e.currentTarget.dataset.comid) {
        imgs = this.data.comDetail[i].pic
      }
    }
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  closeModel: function() {
    this.setData({
      modelShow: !this.data.modelShow
    })
  },
  showModel: function() {
    if (this.data.proType == 'group') {
      if (this.data.endTime != null && this.data.endTime <= 0) {
        // 团购已结束
        this.setData({
          buyType: -2,
          modelShow: false,
          sale_type: this.data.normal_price_type
        })
        if (this.data.default_chose_paytype == false) {
          if (this.data.sale_type >= 4) {
            this.setData({
              default_price_type: 4
            })
          } else if (this.data.sale_type == 2) {
            this.setData({
              default_price_type: 2
            })
          } else {
            this.setData({
              default_price_type: 1
            })
          }
        }
      } else {
        // 团购价
        this.setData({
          buyType: -1,
          modelShow: false,
          sale_type: this.data.activity_price_type
        })
        if (this.data.chose_paytype == false) {
          if (this.data.sale_type >= 4) {
            this.setData({
              price_type: 4
            })
          } else if (this.data.sale_type == 2) {
            this.setData({
              price_type: 2
            })
          } else {
            this.setData({
              price_type: 1
            })
          }
        }
      }
    } else if (this.data.isFlash == 1) {
      this.setData({
        modelShow: false,
        buyType: -1
      })
    } else {
      this.setData({
        modelShow: false,
        buyType: 0
      })
    }
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
  chose: function(e) {
    this.setData({
      choseName: e.target.dataset.value,
      allCom: false,
      toView: e.target.dataset.value,
    })
  },
  choseTab: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      allCom: false
    })
    var proDetail = '';
    if (e.currentTarget.dataset.type == 'p') {
      proDetail = this.data.intrDetail
    } else if (e.currentTarget.dataset.type == 's') {
      proDetail = this.data.specDetail
    } else {
      proDetail = this.data.afterDetail
    }
    WxParse.wxParse('proDetail', 'html', proDetail, this, 10);
    wx.hideLoading()
    if (proDetail !== '') {
      this.data.min_height = this.data.height - 50
      this.setData({
        min_height: this.data.min_height
      })
    } else {
      this.setData({
        min_height: this.data.height - 50
      })
    }
    this.setData({
      toView: 'more',
      choseName: 'more',
      choseid: e.currentTarget.id
    })
  },
  viewAllCom: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      allCom: true,
      choseName: 'com'
    })
    this.getComList()
  },
  getComList: function() {
    var that = this
    util.queryRequest('?m=item&a=get_comment', {
      goods_id: that.data.proInfo.goods_id,
      page: that.data.page,
      limit: that.data.limit
    }, 'GET', function(res) {
      wx.hideLoading()
      if (res.isSuccess == true) {
        if (res.isSuccess) {
          that.setData({
            comDetail: res.rows,
            comTotal: res.total,
            openLoad: true
          })
        }
      }
    })
  },
  choseType: function(e) {
    console.log(e.currentTarget.id)
    var spec = []
    var specshow = []
    var slist = this.data.specList
    for (var i = 0; i < slist.length; i++) {
      if (slist[i].id == e.currentTarget.dataset.pid) {
        for (var j = 0; j < slist[i].list.length; j++) {
          slist[i].list[j].ischose = false
        }
        for (var j = 0; j < slist[i].list.length; j++) {
          if (slist[i].list[j].tid == e.currentTarget.id) {
            slist[i].list[j].ischose = true
          }
        }
      }
    }
    for (var i = 0; i < slist.length; i++) {
      for (var j = 0; j < slist[i].list.length; j++) {
        if (slist[i].list[j].ischose) {
          spec.push(slist[i].list[j].tid)
          specshow.push(slist[i].list[j].name)
        }
      }
    }
    this.setData({
      specList: slist,
      showSpec: specshow
    })
    var that = this
    util.queryRequest('?m=item&a=get_product', {
      goods_id: that.data.proInfo.goods_id,
      marketing_type: 0,
      spec: spec.join(';')
    }, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          proInfo: res.data.product,
          product_id: res.data.product.product_id,
          maxNum: res.data.product.store,
          default_spec: res.data.product,
          spec_up: res.data.is_up
        })
        if (res.data.product.price_market_from != undefined) {
          that.setData({
            price_market_from: res.data.product.price_market_from,
            price_market: res.data.product.price_market
          })
        }
        if (res.data.product.img != '' && res.data.product.img != null) {
          that.setData({
            staticImg: res.data.product.img
          })
        } else {
          that.setData({
            staticImg: that.data.firstImg
          })
        }
      }
    })
  },
  chosePriceType: function(e) {
    if (e.currentTarget.dataset.type == 0) {
      this.setData({
        price_type: e.currentTarget.id,
        chose_paytype: true
      })
    } else {
      this.setData({
        default_price_type: e.currentTarget.id,
        default_chose_paytype: true
      })
    }

  },
  choseCap: function() {
    this.setData({
      chosecap: !this.data.chosecap
    })
  },
  addNum: function(event) {
    let id = event.target.id;
    let value = parseInt(this.data.specNum);
    value++;
    this.setData({
      specNum: value
    })
  },
  changeValue: function(e) {
    if (e.detail.value <= 1) {
      this.data.specNum = 1
    } else {
      this.data.specNum = e.detail.value
    }
    this.setData({
      specNum: this.data.specNum
    })
  },
  lessNum: function(event) {
    let id = event.target.id;
    let value = parseInt(this.data.specNum);
    if (value <= 1) {
      this.setData({
        specNum: 1
      })
    } else {
      value--;
    }
    this.setData({
      specNum: value
    })
  },
  addColl: function(e) {
    var that = this
    if (util.isLogin()) {
      if (this.data.isColl == '') {
        //加入收藏
        util.queryRequest('?m=item&a=collect', {
          goods_id: e.currentTarget.id
        }, 'POST', function(res) {
          if (res.isSuccess == true) {
            that.setData({
              isColl: res.data.collect_id
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        //取消收藏
        util.queryRequest('?m=member&a=remove_collect', {
          id: e.currentTarget.id
        }, 'POST', function(res) {
          if (res.isSuccess == true) {
            that.setData({
              isColl: ''
            })
            wx.showToast({
              title: '取消收藏',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    }
  },
  openCar: function(e) {
    if (this.data.activity.is_qualification) {
      if (e.currentTarget.id == '1') {
        this.setData({
          buyType: 1,
          modelShow: false
        })
      }
    } else {
      wx.showToast({
        title: '您不符合兑换/购买资格！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  buyNow: function(e) {
    if (this.data.proType == 'group' || this.data.activity.is_qualification) {
      if (e.currentTarget.id == '0') {
        this.setData({
          buyType: -1,
          modelShow: false,
          sale_type: this.data.activity_price_type
        })
      } else if (e.currentTarget.id == '10') {
        this.setData({
          buyType: -2,
          modelShow: false,
          sale_type: this.data.normal_price_type
        })
        // 原价购商品默认选中
        if (this.data.default_chose_paytype == false) {
          if (this.data.sale_type >= 4) {
            this.setData({
              default_price_type: 4
            })
          } else if (this.data.sale_type == 2) {
            this.setData({
              default_price_type: 2
            })
          } else {
            this.setData({
              default_price_type: 1
            })
          }
        }
      }
      if (this.data.price_type == '' && e.currentTarget.id != '10') { // 普通商品先选中支付方式再选择规格
        if (this.data.sale_type >= 4) {
          this.setData({
            price_type: 4
          })
        } else if (this.data.sale_type == 2) {
          this.setData({
            price_type: 2
          })
        } else {
          this.setData({
            price_type: 1
          })
        }
      }
    } else {
      wx.showToast({
        title: '您不符合兑换/购买资格！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  addCar: function(e) {
    var that = this
    if (that.data.allowbind == true) {
      wx.showLoading({
        mask: true
      })
      that.data.allowbind = false
      if (!wx.getStorageSync("isbind")) {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route //当前页面url
        var options = currentPage.options
        //拼接url的参数
        if (JSON.stringify(options) != "{}") {
          var urlWithArgs = url + '?'
          for (var key in options) {
            var value = options[key]
            urlWithArgs += key + '=' + value + '&'
          }
        } else {
          urlWithArgs = url
        }
        getApp().globalData.backUrl = urlWithArgs
        wx.reLaunch({
          url: '../bind/bind?visit=4'
        })
      } else {
        if (this.data.proType != 'group' && !this.data.activity.is_qualification) {
          wx.showToast({
            title: '您不符合兑换/购买资格！',
            icon: 'none',
            duration: 1000
          })
          that.data.allowbind = true
        } else {
          var flag = true
          var typelist = []
          var slist = this.data.specList
          for (var i = 0; i < slist.length; i++) {
            typelist.push(false)
            for (var j = 0; j < slist[i].list.length; j++) {
              if (slist[i].list[j].ischose) {
                typelist[i] = true
              }
            }
          }
          for (var k = 0; k < typelist.length; k++) {
            if (typelist[k] == false) {
              flag = false
            }
          }
          if (this.data.buyType == 1 || e.currentTarget.id == '0') {
            if (util.isLogin()) {
              if (!flag) {
                wx.showToast({
                  title: '未选择规格',
                  icon: 'none',
                  duration: 1000
                })
                that.data.allowbind = true
              } else {
                if (Number(that.data.specNum) > Number(that.data.maxNum)) {
                  wx.showToast({
                    title: '库存不足',
                    icon: 'none',
                    duration: 1000
                  })
                  if (Number(that.data.maxNum) <= 0) {
                    that.setData({
                      specNum: 1,
                      allowbind: true
                    })
                  } else {
                    that.setData({
                      specNum: that.data.maxNum,
                      allowbind: true
                    })
                  }
                } else {
                  util.queryRequest('?m=cart&a=add', {
                    pid: that.data.product_id,
                    quantity: that.data.specNum,
                    checked: 0,
                    deal_type: that.data.default_price_type
                  }, 'GET', function(res) {
                    if (res.isSuccess) {
                      wx.showToast({
                        title: '加入购物车成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.data.allowbind = true
                    } else {
                      wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 1000
                      })
                      that.data.allowbind = true
                    }
                  })
                }
              }
            }
          } else if (this.data.buyType == -1 || e.currentTarget.id == '1') {
            if (util.isLogin()) {
              if (!flag) {
                wx.showToast({
                  title: '未选择规格',
                  icon: 'none',
                  duration: 1000
                })
                that.data.allowbind = true
              } else {
                if (Number(that.data.specNum) > Number(that.data.maxNum)) {
                  wx.showToast({
                    title: '库存不足',
                    icon: 'none',
                    duration: 1000
                  })
                  if (Number(that.data.maxNum) <= 0) {
                    that.setData({
                      specNum: 1,
                      allowbind: true
                    })
                  } else {
                    that.setData({
                      specNum: that.data.maxNum,
                      allowbind: true
                    })
                  }
                } else {
                  if (that.data.proType == 'group' && this.data.buyType == -1) {
                    util.queryRequest('?m=grouppurchase&a=add', {
                      id: that.data.addgroup,
                      group_id: that.data.groupId,
                      product_id: that.data.product_id,
                      num: that.data.specNum,
                      deal_type: that.data.price_type
                    }, 'GET', function(res) {
                      if (res.isSuccess) {
                        that.data.allowbind = true
                        wx.navigateTo({
                          url: '../sureOrder/sureOrder?addType=2&id=' + that.data.product_id
                        })
                      } else {
                        wx.showToast({
                          title: res.msg,
                          icon: 'none',
                          duration: 1000
                        })
                        setTimeout(function() {
                          that.setData({
                            modelShow: true,
                            allowbind: true
                          })
                        }.bind(that), 1000)
                      }
                    })
                  } else if (that.data.proType == 'point' || that.data.proType == 'birthday') {
                    that.setData({
                      isFlash: -2
                    })
                    //积分兑换
                    util.queryRequest('?m=listexchange&a=pointadd', {
                      active: that.data.activity.id,
                      checked: that.data.product_id,
                      quantity: that.data.specNum,
                      deal_type: that.data.default_price_type
                    }, 'GET', function(res) {

                      if (res.isSuccess) {
                        that.data.allowbind = true
                        wx.navigateTo({
                          url: '../sureOrder/sureOrder?addType=3&id=' + that.data.product_id
                        })
                      } else {
                        wx.showToast({
                          title: res.msg,
                          icon: 'none',
                          duration: 1000
                        })
                        setTimeout(function() {
                          that.data.allowbind = true
                        }, 1000)
                      }
                    })
                  } else {
                    var group_normal = 1
                    console.log(that.data.isFlash)
                    if (that.data.isFlash == '1') {
                      // 促销商品
                      group_normal = 0
                    }
                    if (group_normal == 0) {
                      util.queryRequest('?m=listexchange&a=add', {
                        pid: that.data.product_id,
                        num: that.data.specNum,
                        goods_id: that.data.goods_id,
                        deal_type: that.data.default_price_type
                      }, 'GET', function(res) {
                        if (res.isSuccess) {
                          that.data.allowbind = true
                          wx.navigateTo({
                            url: '../sureOrder/sureOrder?addType=3&id=' + that.data.product_id + '&group_normal=' + group_normal
                          })
                        } else {
                          wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 1000
                          })
                          setTimeout(function() {
                            that.data.allowbind = true
                          }, 1000)
                        }
                      })
                    } else {
                      // 普通商品立即购买，同时加入购物车，并结算，若未支付则留在购物车中
                      util.queryRequest('?m=cart&a=add', {
                        pid: that.data.product_id,
                        quantity: that.data.specNum,
                        checked: 0,
                        deal_type: that.data.default_price_type
                      }, 'GET', function(res) {
                        if (res.isSuccess) {
                          that.data.allowbind = true
                          wx.navigateTo({
                            url: '../sureOrder/sureOrder?addType=0&id=' + that.data.product_id + '&group_normal=' + group_normal
                          })
                          // wx.showToast({
                          //   title: '加入购物车成功',
                          //   icon: 'success',
                          //   duration: 1000
                          // })
                        } else {
                          wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 1000
                          })
                          setTimeout(function() {
                            that.data.allowbind = true
                          }, 1000)
                        }
                      })
                      // util.queryRequest('?m=listexchange&a=add', {
                      //   pid: that.data.product_id,
                      //   num: that.data.specNum,
                      //   goods_id: that.data.goods_id,
                      //   deal_type: that.data.default_price_type
                      // }, 'GET', function(res) {
                      //   if (res.isSuccess) {
                      //     wx.navigateTo({
                      //       url: '../sureOrder/sureOrder?addType=3&id=' + that.data.product_id + '&group_normal=' + group_normal
                      //     })
                      //   } else {
                      //     wx.showToast({
                      //       title: res.msg,
                      //       icon: 'none',
                      //       duration: 1000
                      //     })
                      //   }
                      // })
                    }

                  }
                }
              }
            }
          }
        }
      }
    }
  },
  addPro: function (e) {
    var that = this
    util.queryRequest('?m=cart&a=add', {
      pid: e.currentTarget.id,
      quantity: 1,
      checked: 0,
      deal_type: e.currentTarget.dataset.type
    }, 'GET', function (res) {
      if (res.isSuccess) {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  onPageScroll: function(e) { // 获取滚动条当前位置
    // console.log(e)
    if (e.scrollTop > 900) {
      if (this.data.isSign) {
        this.setData({
          isSign: false
        })
      }
    } else {
      if (!this.data.isSign) {
        this.setData({
          isSign: true
        })
      }
    }
  },
  returnTop: function() {
    this.setData({
      isSign: true
    })
    this.setData({
      topNum: 0,
      toView: 'top'
    })
  },
  getHeight: function() {
    var that = this
    var query1 = wx.createSelectorQuery()
    query1.select('.pro_com').boundingClientRect()
    query1.exec(function(res) {
      that.setData({
        comHeight: res[0].top
      })
    })
    var query2 = wx.createSelectorQuery()
    query2.select('.pro_show').boundingClientRect()
    query2.exec(function(res) {
      that.setData({
        moreHeight: res[0].top
      })
    })
    this.setData({
      proHeight: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    if (util.isLogin()) {
      this.setData({
        goods_id: options.id,
        allowbind: true
      })
      if (options.type != 'normal') {
        if (options.type == 'group' && options.gid != undefined) {
          this.setData({
            // isnormal: false,
            proType: options.type,
            addgroup: options.gid,
            groupId: options.id,
            goods_id: options.id
          })
        } else {
          this.setData({
            // isnormal: false,
            proType: options.type,
            addgroup: ''
          })
        }
      }
      var that = this
      util.queryRequest('?m=item', {
        id: that.data.goods_id,
        type: options.type
      }, 'GET', function(res) {
        if (res.isSuccess) {
          that.setData({
            proInfo: res.goods_info,
            sale_type: res.goods_info.deal_type,
            goods_info: res.goods_info,
            summary: res.goods_info.summary,
            staticImg: res.product_default.img,
            isColl: res.is_collect,
            imgUrls: res.pic,
            activity: res.marketing,
            default_spec: res.product_default,
            maxNum: res.product_default.store,
            totalNum: res.goods_info.store,
            product_id: res.product_default.product_id,
            isFlash: res.goods_info.promotion,
            is_up: res.goods_info.is_up,
            intrDetail: res.goods_info.intro,
            specDetail: res.goods_info.specification,
            afterDetail: res.goods_info.packaging,
            firstImg: res.goods_info.img,
            activity_price_type: res.marketing.deal_type,
            normal_price_type: res.goods_info.deal_type,
            title_tips: res.site_exemption
          })
          if (res.goods_info.deal_type >= 4) {
            that.setData({
              price_type: 4,
              default_price_type: 4
            })
          } else if (res.goods_info.deal_type == 2) {
            that.setData({
              price_type: 2,
              default_price_type: 2
            })
          } else {
            that.setData({
              price_type: 1,
              default_price_type: 1
            })
          }
          if (res.product_default.price_market_from != undefined) {
            that.setData({
              price_market_from: res.product_default.price_market_from,
              price_market: res.product_default.price_market,
            })
          }
          if (options.type == 'group') {
            if (res.allow_group.length > 0) {
              var timearr = []
              for (var i = 0; i < res.allow_group.length; i++) {
                timearr.push(res.allow_group[i].countdown)
              }
              that.setData({
                endTimeList: timearr
              })
              console.log('last' + timearr)
              var sectimeList = util.countDownList(timearr)
              that.setData({
                saleTimeList: sectimeList
              })
              that.data.time = setInterval(function() {
                for (var k = 0; k < timearr.length; k++) {
                  if (timearr[k] > 0) {
                    timearr[k] = --timearr[k]
                  } else {
                    timearr[k] = 0
                  }
                }
                that.setData({
                  endTimeList: timearr,
                })
                sectimeList = util.countDownList(timearr)
                that.setData({
                  saleTimeList: sectimeList
                })
              }.bind(that), 1000)
              that.setData({
                time: that.data.time
              })
            }
            that.setData({
              endTime: res.marketing.countdown,
              groupTotal: res.allow_total,
              groupList: res.allow_group,
              isFlash: -1,
              sale_type: res.marketing.deal_type,
              group_start: res.marketing.status,
              success_num: res.join_num
            })
            if (res.allow_total >= 4) {
              that.setData({
                g_list_height: 640
              })
            } else {
              var height = 154 * res.allow_total
              that.setData({
                g_list_height: height
              })
            }
            if (res.marketing.deal_type >= 4) {
              that.setData({
                price_type: 4
              })
            } else if (res.marketing.deal_type == 2) {
              that.setData({
                price_type: 2
              })
            } else {
              that.setData({
                price_type: 1
              })
            }
            that.setData({
              isShow: true
            })
            wx.hideLoading()
          } else {
            that.setData({
              isShow: true
            })
            wx.hideLoading()
          }
          if (res.marketing == undefined) {
            that.setData({
              groupId: ''
            })
          } else {
            if (res.marketing.id != undefined) {
              that.setData({
                groupId: res.marketing.id
              })
            } else {
              that.setData({
                groupId: ''
              })
            }
          }
          if (that.data.isFlash == 1) {
            var secTime = util.countDown(res.marketing.countdown)
            that.setData({
              endTime: res.marketing.countdown,
              saleTime: secTime
            })
            that.data.time = setInterval(function() {
              secTime = util.countDown(--that.data.endTime)
              that.setData({
                saleTime: secTime
              })
            }.bind(that), 1000)
            that.setData({
              time: that.data.time
            })
          }
          if (res.spec_key_name != undefined && res.spec_key_nameval != undefined) {
            that.setData({
              specNameList: res.spec_key_name,
              specDetailList: res.spec_key_nameval,
            })
            var arr = []
            var list = []
            for (var item in that.data.specNameList) {
              arr.push({
                id: item,
                name: that.data.specNameList[item],
                list: []
              });
            }
            for (var item in that.data.specDetailList) {
              var d_list = []
              for (var key in that.data.specDetailList[item]) {
                d_list.push({
                  tid: item + ':' + key,
                  pid: item,
                  name: that.data.specDetailList[item][key],
                  ischose: false
                });
              }
              list.push({
                id: item,
                list: d_list
              })
            }
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < list.length; j++) {
                if (arr[i].id == list[j].id) {
                  arr[i].list = list[j].list
                }
              }
            }
            var spec = res.product_default.spec.split(';')
            for (var k = 0; k < spec.length; k++) {
              for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].list.length; j++) {
                  if (arr[i].list[j].tid == spec[k]) {
                    arr[i].list[j].ischose = true
                    that.data.showSpec.push(arr[i].list[j].name)
                  }
                }
              }
            }
            that.data.proInfo.price_sell = res.product_default.price_sell
            if (res.product_default.bn != '' && res.product_default.bn != null) {
              that.data.proInfo.bn = res.product_default.bn
            }
            that.setData({
              specList: arr,
              showSpec: that.data.showSpec,
              proInfo: that.data.proInfo
            })
          } else {
            that.setData({
              flag: false,
              product_id: res.product_info.product_id,
              hasSpec: false
            })
          }
          var proDetail = that.data.intrDetail;
          WxParse.wxParse('proDetail', 'html', proDetail, that, 10);
          console.log('dasdas' + that.data.price_type)
        } else {
          that.setData({
            isShow: true
          })
          wx.hideLoading()
        }
      })
      var id = ''
      if (that.data.proType == 'group') {
        id = options.goods_id
      } else {
        id = options.id
      }
      util.queryRequest('?m=item&a=get_comment', {
        goods_id: id,
        page: 1,
        limit: 2
      }, 'GET', function(res) {
        if (res.isSuccess == true) {
          if (res.isSuccess) {
            // for (var i = 0; i < res.rows.length; i++) {
            //   if (res.rows[i].image.indexOf('http') == '-1') {
            //     res.rows[i].image = that.data.apiUrl + res.rows[i].image
            //   }
            // }
            that.setData({
              comList: res.rows,
              rate: res.rate
            })
          }
        }
      })
      //查询购物车推荐商品
      util.queryRequest('?m=item&a=item_related', { id: that.data.goods_id }, 'GET', function (res) {
        if (res.isSuccess) {
          if (res.data.rows==null){
            res.data.rows = []
          }
          that.setData({
            recomList: res.data.rows,
            recom_total: res.data.total
          })
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight - 94
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideLoading()
    if (this.data.imgPreview === false){
      this.setData({
        imgPreview:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (this.data.imgPreview){
      clearInterval(this.data.time)
      this.setData({
        // isShow:false,
        modelShow: true,
        time: null,
        allowbind: true,

      })
    }
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})