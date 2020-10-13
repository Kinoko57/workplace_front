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
    leftLength: 0,
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
    par: '',
    limit: 6,
    top: 0,
    source: 'menu',
    hasData: true,
    is_load: true,
    is_end:false,//是否加载完成
    active_type_id: 'type0',
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
        }, {
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
    }]
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
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.choseNav = e.currentTarget.dataset.tid
    this.setData({
      chose_nav_id: e.currentTarget.dataset.tid,
      active_type_id: e.currentTarget.id,
      is_load: true
    })
    for (var i = 0; i < this.data.fifterList.length; i++) {
      for (var j = 0; j < this.data.fifterList[i].fifteroptions.length; j++) {
        this.data.fifterList[i].fifteroptions[j].checked = false
      }
    }
    for (var j = 0; j < this.data.fifterList[0].fifteroptions.length; j++) {
      if (this.data.fifterList[0].fifteroptions[j].id == e.currentTarget.dataset.tid) {
        this.data.fifterList[0].fifteroptions[j].checked = true
      }
    }
    if (e.currentTarget.dataset.tid != -1) {
      this.data.searchFifter[0].type_id = e.currentTarget.dataset.tid
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
    this.setData({
      is_end: false,
      page: 1,
      allowScorll: true
    })
    if (Number(this.data.lowPrice) > Number(this.data.highPrice)) {
      wx.showToast({
        title: '最低价必须小于最高价',
        icon: 'none',
        duration: 1000,
        mask:true
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      if (this.data.lowPrice == '' && this.data.highPrice == '') {
        this.data.searchFifter[0].price_range = ''
      } else {
        this.data.searchFifter[0].price_range = this.data.lowPrice + ',' + this.data.highPrice
      }
      this.data.searchFifter[0].price = ''
      this.data.searchFifter[0].point = ''
      this.data.searchFifter[0].quantity = ''
      this.setData({
        searchFifter: this.data.searchFifter
      })
      this.animation.translateX(0).step()
      this.setData({
        animation: this.animation.export()
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
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    util.queryRequest('?m=myinfo&a=formid_save', {
      form_id: e.detail.formId
    }, 'POST', function(res) {
      if (res.isSuccess) {
        console.log('成功传递form_id')
      }
    })
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
      is_end: false,
      page: 1,
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
          let currentpage = that.data.page-1
          console.log(that.data.page)
          if (currentpage === 0){
            that.setData({
              redList: []
            })
          }
          that.setData({
            ['redList['+currentpage+']']: res.rows,
            total: res.total,
            par: res.page,
            hasData: true,
            is_end: false,
            is_load: true
          })
          // 如果一页加载数据等于总条数
          if (res.rows.length == res.total){
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
      is_end: false,
      page: 1
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
  getTypeList: function() {
    // 获取分类列表
    var that = this
    util.queryRequest('?m=menu', {}, 'GET', function(res) {
      for (var i = 0; i < res.left.length; i++) {
        res.left[i].checked = false
        res.left[i].type_id = 'type' + res.left[i].id
        if (app.globalData.choseNav == res.left[i].id) {
          res.left[i].checked = true
        }
      }
      that.data.fifterList[0].fifteroptions = res.left
      that.setData({
        fifterList: that.data.fifterList,
        leftLength: 0
      })
      if (app.globalData.choseNav == -1) {
        that.setData({
          active_type_id: 'type0'
        })
      }
      for (var i = 0; i < res.left.length; i++) {
        if (res.left[i].id == app.globalData.choseNav) {
          that.setData({
            active_type_id: res.left[i].type_id
          })
        }
      }
      console.log(that.data.fifterList[0].fifteroptions)
      console.log(that.data.active_type_id)
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
    if (options.id !== undefined) {
      this.setData({
        chose_nav_id: options.id
      })
    }
    this.setData({
      fifterList: this.data.fifterList
    })
    if (app.globalData.firstForm == -1) {
      this.getList()
      this.getTypeList()
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.setNavigationBarTitle({
      title: '商品分类'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
    })
    var that = this
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
            console.log(res.rows)
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
              is_end:false,
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
      }else{
        // 数据全部加载完成
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
      chose_nav_id: app.globalData.choseNav,
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      searchFifter: this.data.searchFifter
    })
    if (app.globalData.firstForm == 1) {
      if (app.globalData.choseNav == -1) {
        this.data.searchFifter[0].type_id = ''
      } else {
        this.data.searchFifter[0].type_id = app.globalData.choseNav
      }
      this.data.searchFifter[0].price = ''
      this.data.searchFifter[0].point = ''
      this.data.searchFifter[0].quantity = 'desc'
      console.log('从首页分类点进来')
      this.setData({
        topNum: 0,
        searchkey: '',
        searchFifter: this.data.searchFifter
      })
      this.getList()
      this.getTypeList()
      app.globalData.firstForm = 0
    }
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
    if (this.data.searchkey != '') {
      return {
        title: '轻选易购，尽在公主购',
        path: 'pages/index/index'
      }
    }
  }
})