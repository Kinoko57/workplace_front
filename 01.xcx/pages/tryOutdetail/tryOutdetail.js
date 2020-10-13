// pages/tryOutdetail/tryOutdetail.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    allowbind: true,
    hiddenFix: true,
    form_share: 1,
    help_id: '',
    proInfo: {},
    apiUrl: app.globalData.apiUrl,
    endTime: null,
    saleTime: [],
    time: null,
    choseid: 0,
    detail: '',
    spec: '',
    isSign: true,
    showShare: false,
    modelShow: true,
    maxNum: 0,
    is_up: '', //是否上架
    specNum: 1,
    staticImg: '',
    proType: 'try',
    default_spec: {},
    product_id: '',
    sale_type: '',
    price_type: '',
    goods_id: '',
    specNameList: [],
    specDetailList: [],
    specList: [],
    showSpec: [],
    hasSpec: true,
    trybtn: true,
    mytry:false,// 是否从我的试用点进来的
    is_iphonex: app.globalData.phoneType
  },
  viewImg: function(e) {
    var arr = []
    arr.push(e.currentTarget.dataset.url)
    wx.previewImage({
      //当前显示图片
      current: arr[0],
      urls: arr
    })
  },
  closeModel: function() {
    this.setData({
      closeModel: !this.data.modelShow
    })
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  goLink: function(e) {
    wx.redirectTo({
      url: e.currentTarget.dataset.link
    })
  },
  closeShare: function() {
    this.data.trybtn = true
    this.setData({
      showShare: false
    })
  },
  showModel: function() {
    this.setData({
      showShare: true
    })
  },
  closeSpec: function() {
    this.setData({
      modelShow: !this.data.modelShow
    })
  },
  openSpec: function() {
    var that = this
    util.queryRequest('?m=item', {
      id: that.data.goods_id,
      type: 'normal'
    }, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      // wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          default_spec: res.product_default,
          sale_type: res.goods_info.deal_type,
          is_up: res.goods_info.is_up,
          maxNum: res.product_default.store,
          product_id: res.product_default.product_id
        })
        if (res.goods_info.deal_type >= 4) {
          that.setData({
            price_type: 4
          })
        } else if (res.goods_info.deal_type == 2 || res.goods_info.deal_type == 3) {
          that.setData({
            price_type: 2
          })
        } else {
          that.setData({
            price_type: 1
          })
        }
        if (res.spec_key_name != undefined && res.spec_key_nameval != undefined) {
          that.setData({
            specNameList: res.spec_key_name,
            specDetailList: res.spec_key_nameval,
            hasSpec: true
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
            showSpec: that.data.showSpec
          })
        } else {
          that.setData({
            hasSpec: false
          })
        }
        that.setData({
          modelShow: false
        })
      }
    })
    // 获取普通商品的规格
  },
  choseType: function(e) {
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
      goods_id: that.data.goods_id,
      marketing_type: 0,
      spec: spec.join(';')
    }, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          default_spec: res.data.product,
          product_id: res.data.product.product_id,
          maxNum: res.data.product.store,
          default_spec: res.data.product
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
    this.setData({
      price_type: e.currentTarget.id
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
  noBind: function() {
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
  },
  addCar: function(e) {
    if (!wx.getStorageSync("isbind")) {
      this.noBind()
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
      var that = this
      if (util.isLogin()) {
        if (!flag) {
          wx.showToast({
            title: '未选择规格',
            icon: 'none',
            duration: 1000
          })
        } else {
          if (Number(that.data.specNum) > Number(that.data.maxNum)) {
            wx.showToast({
              title: '库存不足',
              icon: 'none',
              duration: 1000
            })
            if (Number(that.data.maxNum) <= 0) {
              that.setData({
                specNum: 1
              })
            } else {
              that.setData({
                specNum: that.data.maxNum
              })
            }
          } else {
            util.queryRequest('?m=listexchange&a=add', {
              pid: that.data.product_id,
              num: that.data.specNum,
              goods_id: that.data.goods_id,
              deal_type: that.data.price_type
            }, 'GET', function(res) {
              if (res.isSuccess) {
                that.setData({
                  proType: 'normal'
                })
                wx.navigateTo({
                  url: '../sureOrder/sureOrder?addType=3&id=' + that.data.product_id
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          }
        }
      }


    }
  },
  scroll: function(e) {
    if (e.detail.scrollTop > 900) {
      this.setData({
        isSign: false
      })
    } else {
      this.setData({
        isSign: true
      })
    }
  },
  returnTop: function() {
    this.setData({
      isSign: true,
      topNum: 0,
    })
  },
  getTry: function(e) {
    var that = this
    if (util.isLogin()) {
      if (this.data.allowbind) {
        that.data.allowbind = false
        if (!wx.getStorageSync("isbind")) {
          this.noBind()
        } else {
          var that = this
          util.queryRequest('?m=listexchange&a=tryadd', {
            active: e.currentTarget.id
          }, 'GET', function(req) {
            if (req.isSuccess) {
              that.data.allowbind = true
              wx.navigateTo({
                url: e.currentTarget.dataset.link
              })
            } else {
              wx.showToast({
                title: req.msg,
                icon: 'none',
                mask: true,
                duration: 2000
              })
              that.data.allowbind = true
            }
          })
        }

      }
    }
  },
  boost: function() {
    if (util.isLogin()) {
      var that = this
      util.queryRequest('?m=activity&a=try_help', {
        id: that.data.help_id
      }, 'GET', function(res) {
        if (res.isSuccess) {
          wx.showToast({
            title: res.msg,
            icon: 'success'
          })
          that.data.proInfo.help_list = res.data
          that.setData({
            showShare: false,
            proInfo: that.data.proInfo
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  initiate: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    if (this.data.trybtn) {
      this.data.trybtn = false
      if (!wx.getStorageSync("isbind")) {
        this.noBind()
      } else {
        if (this.data.help_id != null && this.data.help_id != '') {
          this.setData({
            showShare: true
          })
        } else {
          var that = this
          util.queryRequest('?m=activity&a=try_help_sponsor', {
            active: e.target.id,
            form_id: e.detail.formId
          }, 'GET', function(req) {
            if (req.isSuccess) {
              that.data.trybtn = true
              that.setData({
                showShare: true,
                help_id: req.data
              })
            } else {
              that.data.trybtn = true
              wx.showToast({
                title: req.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    }

  },
  getDetail: function(e) {
    var that = this
    util.queryRequest('?m=activity&a=try_goods_info', {
      try_id: that.data.tryId,
      help_id: that.data.help_id
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          isShow: true
        })
        console.log(res.data)
        var secTime = util.countDown(res.data.countdown)
        that.setData({
          proInfo: res.data,
          endTime: res.data.countdown,
          saleTime: secTime,
          detail: res.data.intro,
          spec: res.data.desc,
          goods_id: res.data.goodsid
        })
        if (res.data.is_help == 1) {
          that.data.form_share = res.data.form_share
          if (that.data.form_share == 0) {
            that.setData({
              form_share: that.data.form_share,
              help_id: res.data.help_id
            })
          } else {
            that.setData({
              showShare: true
            })
          }
        }
        if (that.data.mytry){
          that.setData({
            showShare: true
          })
        }
        var proDetail = res.data.intro;
        WxParse.wxParse('proDetail', 'html', proDetail, that, 10);
        // desc
        that.data.time = setInterval(function() {
          secTime = util.countDown(--that.data.endTime)
          that.setData({
            saleTime: secTime
          })
        }.bind(that), 1000)
        that.setData({
          time: that.data.time
        })
      }else{
        setTimeout(function () {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            mask: true,
            duration: 1000
          })
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },
  choseTab: function(e) {
    this.setData({
      choseid: e.currentTarget.id
    })
    var proDetail = '';
    if (e.currentTarget.dataset.type == 'p') {
      proDetail = this.data.detail
    } else {
      proDetail = this.data.spec
    }
    WxParse.wxParse('proDetail', 'html', proDetail, this, 10);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    
    if (options.model!==undefined){
      this.setData({
        mytry:true
      })
    }
    this.setData({
      tryId: options.id,
      help_id: options.help_id
    })
    wx.setNavigationBarTitle({
      title: '试用活动详情'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
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
    this.data.trybtn = true
    this.setData({
      proType: 'try',
      modelShow:true
    })
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.data.allowbind = true
    clearInterval(this.data.time);
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      var try_id = res.target.id;
      // if (this.data.help_id != null && this.data.help_id != '') {
      var path = 'pages/tryOutdetail/tryOutdetail?id=' + try_id + '&form_share=1&help_id=' + this.data.help_id;
      return {
        title: '您的好友向你发来一个助力申请...',
        path: path
      }
      // }
      //  else {
      //   var that = this
      //   util.queryRequest('?m=activity&a=try_help_sponsor', {
      //     active: try_id
      //   }, 'GET', function(req) {
      //     if (req.isSuccess) {
      //       console.log(req.data)
      //       var path = 'pages/tryOutdetail/tryOutdetail?id=' + try_id + '&form_share=1&help_id=' + req.data;
      //       console.log(path)
      //       return {
      //         title: '您的好友向你发来一个助力申请...',
      //         path: path
      //       }
      //     }
      //   })
      // }
    }
  }
})