// pages/redeem/redeem.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenFix: true,
    newNews: false,
    total_amout: 0,
    topNum: 0,
    brandHeight: 0,
    redList: [],
    apiUrl: app.globalData.apiUrl,
    hiddenlogin: app.globalData.hiddenlogin,
    chose_nav_id: -1,
    fixedHeight: 0,
    price: false,
    score: true,
    searchkey: '',
    height: '',
    allowScorll: true,
    isSign: true,
    pro_type: false,
    fifter: false,
    lowPrice: '',
    highPrice: '',
    total: 0,
    page: 1,
    is_end: false,
    par: '',
    limit: 6,
    top: 0,
    source: 'menu',
    hasData: true,
    is_load: true,
    searchFifter: [{
      price: '',
      point: '',
      type_id: '',
      deal_type: '',
      quantity: 'desc',
      price_range: ''
    }],
    fifterList: [{
      fifter_id: 0,
      fifter_name: '分类',
      isopen: true,
      fifteroptions: []
    }, {
      fifter_id: 1,
      fifter_name: '支付方式',
      isopen: false,
      fifteroptions: [{
          id: '3',
          name: '现金+积分',
          checked: false
        },
        {
          id: '1',
          name: '现金',
          checked: false
        },
        {
          id: '2',
          name: '积分',
          checked: false
        }
      ]
    }],
    is_iphonex: app.globalData.phoneType
  },
  priceSort: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1,
      is_end: false,
      pro_type: false,
      allowScorll: true,
      is_load: true,
      topNum: 0
    })
    if (this.data.searchFifter[0].price == 'asc') {
      this.data.searchFifter[0].price = 'desc'
    } else {
      this.data.searchFifter[0].price = 'asc'
    }
    this.data.searchFifter[0].point = ''
    this.data.searchFifter[0].quantity = ''

    this.setData({
      searchFifter: this.data.searchFifter
    })
    this.getList()
  },
  pointSort: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1,
      is_end: false,
      pro_type: false,
      allowScorll: true,
      is_load: true,
      topNum: 0
    })
    if (this.data.searchFifter[0].point == 'asc') {
      this.data.searchFifter[0].point = 'desc'
    } else {
      this.data.searchFifter[0].point = 'asc'
    }
    this.data.searchFifter[0].price = ''
    this.data.searchFifter[0].quantity = ''
    this.setData({
      searchFifter: this.data.searchFifter
    })
    this.getList()
  },
  quantitySort: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1,
      is_end: false,
      pro_type: false,
      allowScorll: true,
      is_load: true,
      topNum: 0
    })
    if (this.data.searchFifter[0].quantity == 'asc') {
      this.data.searchFifter[0].quantity = 'desc'
    } else {
      this.data.searchFifter[0].quantity = 'asc'
    }
    this.data.searchFifter[0].price = ''
    this.data.searchFifter[0].point = ''
    this.setData({
      searchFifter: this.data.searchFifter
    })
    this.getList()
  },
  choseTopNav: function(e) {
    this.setData({
      chose_nav_id: e.currentTarget.id,
      topNum: 0,
      par: '',
      is_load: true
    })
    for (var i = 0; i < this.data.fifterList.length; i++) {
      for (var j = 0; j < this.data.fifterList[i].fifteroptions.length; j++) {
        this.data.fifterList[i].fifteroptions[j].checked = false
      }
    }
    for (var j = 0; j < this.data.fifterList[0].fifteroptions.length; j++) {
      if (this.data.fifterList[0].fifteroptions[j].id == e.currentTarget.id) {
        this.data.fifterList[0].fifteroptions[j].checked = true
      }
    }
    if (e.currentTarget.id != -1) {
      this.data.searchFifter[0].type_id = e.currentTarget.id
    } else {
      this.data.searchFifter[0].type_id = ''
    }
    // 重置其他搜索条件
    this.data.searchFifter[0].price = ''
    this.data.searchFifter[0].point = ''
    this.data.searchFifter[0].price_range = ''
    this.data.searchFifter[0].deal_type = ''
    this.data.searchFifter[0].quantity = ''
    this.setData({
      searchFifter: this.data.searchFifter,
      fifterList: this.data.fifterList,
      topNum: 0,
      is_end: false,
      page: 1
    })
    //搜索指定分类下的商品信息
    this.getList()
  },
  fifterAll: function() {
    var that = this
    // 获取当前屏幕的高度
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight - 165);
        that.setData({
          brandHeight: res.windowHeight - 165
        })
      },
    })
    this.setData({
      pro_type: false,
      fifter: !this.data.fifter,
      allowScorll: false
    })
    var query = wx.createSelectorQuery()
    query.select('.fifter_more').boundingClientRect()
    query.exec(function(res) {
      that.animation.translateX(-res[0].width).step()
      that.setData({
        animation: that.animation.export()
      })
    })
  },
  low: function(e) {
    console.log(e.detail.value)
    this.setData({
      lowPrice: e.detail.value
    })
  },
  high: function(e) {
    this.setData({
      highPrice: e.detail.value
    })
    console.log(e.detail.value)
  },
  hiddenFifter: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1,
      is_end: false,
      allowScorll: true
    })
    if (Number(this.data.lowPrice) > Number(this.data.highPrice)) {
      wx.showToast({
        title: '最低价必须小于最高价',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      if (this.data.lowPrice == '' && this.data.highPrice == '') {
        this.data.searchFifter[0].price_range = ''
      } else {
        this.data.searchFifter[0].price_range = this.data.lowPrice + ',' + this.data.highPrice
      }
      this.setData({
        searchFifter: this.data.searchFifter
      })
      this.data.searchFifter[0].price = ''
      this.data.searchFifter[0].point = ''
      this.data.searchFifter[0].quantity = ''
      this.animation.translateX(0).step()
      this.setData({
        animation: this.animation.export(),
        searchFifter: this.data.searchFifter
      })
      setTimeout(function() {
        this.getList()
        this.setData({
          fifter: false,
          allowScorll: true,
          chose_nav_id: this.data.searchFifter[0].type_id,
          topNum: 0,
          is_load: true
        })

      }.bind(this), 400)
    }
  },
  hiddenFifterBg: function() {
    this.animation.translateX(0).step()
    this.setData({
      animation: this.animation.export(),
      fifter: false,
      allowScorll: true
    })
  },
  hidden: function() {
    this.setData({
      pro_type: false,
      // !this.data.pro_type,
      allowScorll: true
    })
  },
  chosefifterList: function(e) {
    var arr = []
    //console.log(e.currentTarget.dataset.pid) 父级筛选id 0是品牌，1是类型，2是分类
    //console.log(e.currentTarget.id) 单个筛选子类的id
    let farr = this.data.fifterList;
    for (var i = 0; i < farr.length; i++) {
      if (i == e.currentTarget.dataset.pid) {
        for (var j = 0; j < farr[i].fifteroptions.length; j++) {
          if (farr[i].fifteroptions[j].id == e.currentTarget.id) {
            farr[i].fifteroptions[j].checked = !farr[i].fifteroptions[j].checked
          } else {
            // 单选,重置所有高级搜索条件
            farr[i].fifteroptions[j].checked = false
          }
        }
      }
    }
    this.setData({
      fifterList: farr
    })
    for (var i = 0; i < farr.length; i++) {
      if (i == e.currentTarget.dataset.pid) {
        for (var j = 0; j < farr[i].fifteroptions.length; j++) {
          if (farr[i].fifteroptions[j].checked) {
            arr.push(farr[i].fifteroptions[j].id)
          }
        }
      }
    }
    if (e.currentTarget.dataset.pid == 1) {
      //选择支付类型
      this.data.searchFifter[0].deal_type = arr.join(',')
    } else if (e.currentTarget.dataset.pid == 0) {
      //选择分类
      this.data.searchFifter[0].type_id = arr.join(',')
      this.data.chose_nav_id = arr.join(',')
    }
    this.setData({
      searchFifter: this.data.searchFifter
    })
  },
  resetFifter: function() {
    for (var i = 0; i < this.data.fifterList.length; i++) {
      for (var j = 0; j < this.data.fifterList[i].fifteroptions.length; j++) {
        this.data.fifterList[i].fifteroptions[j].checked = false;
      }
    }
    this.data.searchFifter[0].type_id = ''
    this.data.searchFifter[0].deal_type = ''
    this.data.searchFifter[0].price_range = ''
    this.setData({
      searchFifter: this.data.searchFifter,
      fifterList: this.data.fifterList,
      lowPrice: '',
      highPrice: '',
      chose_nav_id: -1
    })
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  scroll: function(e) {
    if (e.detail.scrollTop >= 980) {
      this.setData({
        isSign: false
      })
    } else {
      this.setData({
        isSign: true
      })
    }
  },
  clearSearch: function() {
    this.setData({
      searchkey: ''
    })
  },
  searchInput: function(e) {
    this.setData({
      searchkey: e.detail.value
    })
  },
  searchList: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1,
      is_end: false,
      limit: 10
    })
    this.getList()
  },
  returnTop: function() {
    this.setData({
      isSign: true
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
  getList: function() {
    var that = this
    util.queryRequest('?m=list&a=search', {
      key: that.data.searchkey,
      par: '',
      limit: that.data.limit,
      fifter: JSON.stringify(that.data.searchFifter)
    }, 'GET', function(res) {
      wx.hideLoading()
      if (res.isSuccess == true) {
        if (res.rows.length > 0) {
          let currentpage = that.data.page - 1
          console.log(that.data.page)
          if (currentpage === 0) {
            that.setData({
              redList: []
            })
          }
          that.setData({
            ['redList[' + currentpage + ']']: res.rows,
            total: res.total,
            par: res.page,
            hasData: true,
            is_end: false,
            is_load: true
          })
          // 如果一页加载数据等于总条数
          if (res.rows.length == res.total) {
            that.setData({
              is_load: false,
              is_end: true
            })
          }
        } else {
          that.setData({
            hasData: false
          })
        }
      }
    })

  },
  searhList: function() {
    this.setData({
      page: 1,
      is_end: false
    })
    this.setData({
      pro_type: !this.data.pro_type,
      allowScorll: true
    })
    this.getList()
  },
  openfifter: function(e) {
    let farr = this.data.fifterList;
    for (var i = 0; i < farr.length; i++) {
      if (farr[i].fifter_id == e.currentTarget.id) {
        farr[i].isopen = !farr[i].isopen
      }
    }
    this.setData({
      fifterList: farr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    wx.showLoading({
      title: '加载中',
    })
    //一级分类
    // console.log(app.globalData.navList)
    // console.log(options)
    if (options.id !== undefined) {
      this.data.chose_nav_id = options.id
      this.data.source = options.type
    }
    if (options.value !== undefined) {
      this.data.searchkey = options.value
      this.data.source = options.type
    }
    if (options.point !== undefined) {
      this.data.searchFifter[0].point = options.point
      this.data.searchFifter[0].quantity = ''
    }
    // if (options.price !== undefined) {
    //   this.data.searchFifter[0].price = options.price
    //   this.data.searchFifter[0].quantity = ''
    // }
    this.setData({
      fifterList: this.data.fifterList,
      chose_nav_id: this.data.chose_nav_id,
      source: this.data.source,
      searchkey: this.data.searchkey,
      searchFifter: this.data.searchFifter
    })
    this.getList()
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    // 获取分类列表
    var that = this
    util.queryRequest('?m=menu', {}, 'GET', function(res) {
      for (var i = 0; i < res.left.length; i++) {
        res.left[i].checked = false
      }
      that.data.fifterList[0].fifteroptions = res.left
      that.setData({
        fifterList: that.data.fifterList
      })
    })
    wx.setNavigationBarTitle({
      title: '商品列表'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
    })
    var query_height = wx.createSelectorQuery()
    query_height.select('.fixed_top').boundingClientRect()
    query_height.exec(function(res) {
      console.log(res[0].height)
      that.setData({
        fixedHeight: res[0].height
      })
    })
  },
  // 上拉加载更多
  loadMore: function() {
    var that = this
    if (this.data.is_load) {
      this.data.is_load = false;
      if (that.data.par != null && that.data.par != '') {
        util.queryRequest('?m=list&a=search', {
          key: that.data.searchkey,
          par: that.data.par,
          limit: that.data.limit,
          fifter: JSON.stringify(that.data.searchFifter)
        }, 'GET', function(res) {
          if (res.isSuccess == true) {
            if (res.rows == null) {
              res.rows = []
            }
            ++that.data.page
            // that.data.redList = that.data.redList.concat(res.rows)
            let currentpage = that.data.page - 1
            that.setData({
              ['redList[' + currentpage + ']']: res.rows,
              // redList: that.data.redList,
              total: res.total,
              par: res.page,
              is_end: false,
              is_load: true
            })
            console.log(that.data.redList)
          } else {
            that.setData({
              is_end: true,
              is_load: false
            })
          }
        })
      } else {
        that.setData({
          is_end: true,
          is_load: false
        })
      }
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation({
      duration: 400
    })
  },
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
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      is_iphonex: app.globalData.phoneType
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  onShareAppMessage: function() {
    console.log(this.data.searchkey)
    if (this.data.searchkey!=''){
      return {
        title: '轻选易购，尽在公主购',
        path: 'pages/index/index'
      }
    }
  }
})