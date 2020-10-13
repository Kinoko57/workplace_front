// pages/proList/proList.js

var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    scrollHeight: 0,
    filePath: app.globalData.fileUrl,
    brandList: [],
    choseBrand: [],
    virtual_id: '', // 分类id
    search_condition: {
      name: '', // 关键字筛选
      display_category_id:'',// 分类筛选
      page: 1,
      size: 8,
      start_price: '',
      end_price:'',
      brand_id: '',
      fifter: {
        sales_volume: '',
        retail_price: '',
        perfect: ''
      },
    },
    is_iphonex: app.globalData.isiPhoneX,
    activity_type: 'all',
    fifter_type: false,
    total: 0,
    page_num: 0,
    serach_type: '',
    proList: [],
    hasData: true,
    is_end: false,
    is_load: false,
    isTop: true,
    topNum: 0,
    fifter: false,
    lowPrice: '',
    highPrice: '',
    brandHeight: 0,
    allowScorll: true,
    fifterHeight: 0,
    navHeight: 0,
    lowFocus: false,
    highFocus: false,
  },
  lowFocus:function(){
    this.setData({
      lowFocus: true,
      highFocus: false,
    })
  },
  highFocus:function(){
    this.setData({
      lowFocus: false,
      highFocus: true,
    })
  },
  lowBlur:function(){
    this.setData({
      lowFocus: false
    })
  },
  highBlur:function(){
    this.setData({
      highFocus: false
    })
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  clearSearch: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.data.search_condition.page = 1
    this.data.search_condition.size = 8
    this.data.search_condition.name = ''
    this.data.search_condition.brand_id = ''
    this.setData({
      search_condition: this.data.search_condition,
      serach_type: 'key'
    })
    this.getList()
  },
  searchInput: function(e) {
    this.data.search_condition.name = e.detail.value
    this.setData({
      search_condition: this.data.search_condition,
      virtual_id: ''
    })
  },
  searchList: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.data.search_condition.page = 1
    this.data.search_condition.size = 8
    this.setData({
      search_condition: this.data.search_condition,
      serach_type: 'key',
      proList:[]
    })
    this.getList()
  },
  fifterSearch:util.throttle(function(e){
    let type = e[0].currentTarget.id
    if(this.data.activity_type==type&&type!='price'){
      console.log("点击已经高亮的综合和好评和销量")
    }else{
      wx.showLoading({
        title: '加载中',
      })
      console.log(e[0].currentTarget.id)
      if (type == 'price'){
          // if (type == 'num'){
          //   this.data.search_condition.fifter.retail_price = ''
          //   this.data.search_condition.fifter.perfect = ''
          //   if (this.data.search_condition.fifter.sales_volume==''){
          //     this.data.search_condition.fifter.sales_volume='desc'
          //   } else if (this.data.search_condition.fifter.sales_volume == 'asc'){
          //     this.data.search_condition.fifter.sales_volume = 'desc'
          //   } else if (this.data.search_condition.fifter.sales_volume == 'desc') {
          //     this.data.search_condition.fifter.sales_volume = 'asc'
          //   }
          // }else{
          //   this.data.search_condition.fifter.sales_volume = ''
          //   this.data.search_condition.fifter.perfect = ''
          //   if (this.data.search_condition.fifter.retail_price == '') {
          //     this.data.search_condition.fifter.retail_price = 'asc'
          //   } else if (this.data.search_condition.fifter.retail_price == 'asc') {
          //     this.data.search_condition.fifter.retail_price = 'desc'
          //   } else if (this.data.search_condition.fifter.retail_price == 'desc') {
          //     this.data.search_condition.fifter.retail_price = 'asc'
          //   }
          // }
          this.data.search_condition.fifter.sales_volume = ''
          this.data.search_condition.fifter.perfect = ''
          if (this.data.search_condition.fifter.retail_price == '') {
            this.data.search_condition.fifter.retail_price = 'asc'
          } else if (this.data.search_condition.fifter.retail_price == 'asc') {
            this.data.search_condition.fifter.retail_price = 'desc'
          } else if (this.data.search_condition.fifter.retail_price == 'desc') {
            this.data.search_condition.fifter.retail_price = 'asc'
          }
      }else{
        if(type=='all'){
          this.data.search_condition.fifter.sales_volume = ''
          this.data.search_condition.fifter.perfect = ''
          this.data.search_condition.fifter.retail_price = ''
        }else if(type == 'num'){
          this.data.search_condition.fifter.sales_volume = 'desc'
          this.data.search_condition.fifter.perfect = ''
          this.data.search_condition.fifter.retail_price = ''
        }else{
          this.data.search_condition.fifter.sales_volume = ''
          this.data.search_condition.fifter.retail_price = ''
          this.data.search_condition.fifter.perfect = 'desc'
        }
      }
      this.data.search_condition.page = 1
      this.data.search_condition.size = 8
      this.setData({
        search_condition: this.data.search_condition,
        serach_type: 'fifter',
        activity_type: type
      })
      this.getList()
    }
  }),
  choseBrand:util.throttle(function(e){
    console.log(e[0].currentTarget.id)
    console.log(e[0].currentTarget.id)
    let type = e[0].currentTarget.id
    let arr = []
    for(let i = 0;i<this.data.brandList.length;i++){
      if(this.data.brandList[i].id==e[0].currentTarget.id){
        this.data.brandList[i].ischose = !this.data.brandList[i].ischose
      }

    }
    this.setData({
      brandList: this.data.brandList,
    })
    for(let i = 0;i<this.data.brandList.length;i++){
      if(this.data.brandList[i].ischose){
        arr.push(this.data.brandList[i].id)
      }
    }
    this.data.search_condition.page = 1
    this.data.search_condition.size = 8
    this.data.search_condition.brand_id = arr.join(',')
    console.log(arr)
    this.setData({
      search_condition: this.data.search_condition,
      brandList: this.data.brandList,
      choseBrand: arr,
      serach_type: 'fifter'
    })
    // this.getList()
  },100),
  goProDetail: util.throttle(function (e) {
    console.log(e[0])
    let type = e[0].currentTarget.dataset.type
    let id = e[0].currentTarget.id
    if(type==0){
      wx.navigateTo({
        url: '/pages/proDetail/proDetail?id=' + id
      })
    }else{
      wx.navigateTo({
        url: '/pages/flashDetail/flashDetail?id=' + id + '&type='+ type
      })
    }

  }),
  // 获取商品列表
  getList() {
    let that = this
    let info = {}
    info = {
      page: this.data.search_condition.page,
      size: this.data.search_condition.size,
      name: this.data.search_condition.name,
      brand_id: this.data.search_condition.brand_id,
      start_price:this.data.search_condition.start_price,
      end_price:this.data.search_condition.end_price,
      filter: JSON.stringify(this.data.search_condition.fifter),
      display_category_id: this.data.search_condition.display_category_id
    }
    util.queryRequest('/app/goods/index', info, 'GET').then(function(res) {
      wx.hideLoading()
      if (res.code == 200) {
        if (res.data.rows.length > 0){
          let currentpage = that.data.search_condition.page - 1
          that.setData({
            ['proList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.search_condition.size),
            is_end: Math.ceil(res.data.total / that.data.search_condition.size) == that.data.search_condition.page,
            hasData: true
          })
        }
        else{
          that.setData({
            hasData: false,
            is_end: true
          })
        }

      }
    })
  },
  // 获取品牌列表
  getBrandList(){
    let that = this
    util.queryRequest('/app/index/getBrandData', {}, 'GET').then(function(res) {
      if (res.code == 200) {
        console.log(res.data)
        for(let i =0;i<res.data.length;i++){
          res.data[i].ischose = false
        }
        that.setData({
          brandList: res.data
        })
        console.log(that.data.brandList)
      }
    })
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
        this.data.search_condition.start_price = ''
        this.data.search_condition.end_price = ''
      } else {
        this.data.search_condition.start_price = this.data.lowPrice
        this.data.search_condition.end_price = this.data.highPrice
      }
      this.data.search_condition.page = 1
      this.data.serach_type = 'price_range'
      this.setData({
        fifter_type: true,
        search_condition: this.data.search_condition
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
          topNum: 0,
          is_load: true
        })

      }.bind(this), 400)
    }
  },
  resetFifter: function() {
    this.data.lowPrice = ''
    this.data.highPrice = ''
    this.data.search_condition.start_price = ''
    this.data.search_condition.end_price = ''
    this.data.search_condition.page = 1
    this.data.serach_type = 'price_range'
    this.setData({
      fifter_type: false,
      search_condition: this.data.search_condition,
      lowPrice: this.data.lowPrice,
      highPrice: this.data.highPrice
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
        topNum: 0,
        is_load: true
      })

    }.bind(this), 400)
  },
  hiddenFifterBg: function() {
    this.animation.translateX(0).step()
    this.setData({
      animation: this.animation.export(),
      fifter: false,
      allowScorll: true
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end==false){
      console.log('加载更多')
      console.log(this.data.serach_type)
      if (this.data.serach_type == '') {
        info = {
          page: ++this.data.search_condition.page,
          size: this.data.search_condition.size
        }
      } else if (this.data.serach_type == 'key') {
        info = {
          page: ++this.data.search_condition.page,
          size: this.data.search_condition.size,
          name: this.data.search_condition.name,
        }
      }
      console.log(info)
      util.queryRequest('/app/goods/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.search_condition.page - 1
          that.setData({
            ['proList[' + currentpage + ']']: res.data.rows,
            is_end: that.data.page_num == that.data.search_condition.page
          })
          console.log(that.data.is_end)
        }
      })
    }else{
      console.log("加载完了")
    }

  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      if (this.data.isTop){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    if(options.type=='key'){
      this.data.search_condition.page = 1
      this.data.search_condition.size = 8
      this.data.search_condition.name = options.value
      this.setData({
        search_condition: this.data.search_condition,
        serach_type: 'key'
      })
    } else if (options.type == 'display_id'){
      this.data.search_condition.page = 1
      this.data.search_condition.size = 8
      this.data.search_condition.name = ''
      this.data.search_condition.display_category_id = options.value
      this.setData({
        search_condition: this.data.search_condition,
        serach_type: 'display_id'
      })
    }
    this.getList()
    this.getBrandList()
    setTimeout(() => { 
      that.setData({
        showSkeleton: false
      })
      let query1 = wx.createSelectorQuery()
      query1.select('.list_body_head').boundingClientRect()
      query1.exec(function (res) {
        that.setData({
          scrollHeight: app.globalData.windowHeight - app.globalData.navHeight - res[0].height - 6,
          fifterHeight: app.globalData.windowHeight - app.globalData.navHeight,
          navHeight: app.globalData.navHeight
        })
        console.log('屏幕高度'+app.globalData.windowHeight)
        console.log('顶部导航高度'+app.globalData.navHeight)
        console.log('搜索区域高度'+res[0].height)
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation({
      duration: 400
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})