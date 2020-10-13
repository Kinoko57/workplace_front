// components/navbar/index.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:String,
    customName:String,
    unread: {
      type: Number,
      value: 0
    },
    showNav: {
      type: String,
      value: 'true'
    },
    pageUrl: {
      type: String,
      value: '/pages/search/search'
    },
    showSearch: {
      type: String,
      value: 'false'
    },
    showTitle: {
      type: String,
      value: 'true'
    },
    showCustom:String,
    showIcon:{
      type: String,
      value: 'true'
    },
    choseDate:{
      type: String,
      value: 'false'
    },
    showIndex: {
      type: String,
      value: 'false'
    },
    bgColor:{
      type: String,
      value: '#e13b18'
    },
    bgImg: {
      type: String,
      value: ''
    },
    iconColor:{
      type: String,
      value: '#333333'
    },
    textColor: {
      type: String,
      value: '#fff'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
   inputWidth:0,
  },
  lifetimes: {
    attached: function () {
      // var unit = this.data.screenWidth / 375
      console.log(App.globalData)
      this.setData({
        inputWidth: App.globalData.inputWidth,
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop,
        menuHeight: App.globalData.menuHeight,
        statusBarHeight:App.globalData.menuHeightstatusBarHeight
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    _navBack: function () {
      console.log("返回上一页")
      var pages = getCurrentPages()
      console.log(pages)
      if(pages.length>1){
        wx.navigateBack({
          delta: 1
        }) 
      }else{
        if(pages[0].route.indexOf('previewDetail')!=-1){
          wx.setStorageSync('choseId', 2)
          wx.switchTab({
            url: '/pages/noticeList/noticeList'
          })
        }else{
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
     
    },
    //回主页
    _toIndex: function () {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
    //跳转到搜索页
    _searchHis: function () {
      console.log(111)
      wx.navigateTo({
        url: '/pages/search/search'
      })
    },
    _goLink: function (event){
      let link = event.currentTarget.dataset.link
        wx.navigateTo({
          url: link
        })
    },
    _goView(){
      this.triggerEvent('bindView')
    },
    _bindDateChange(e){
      this.triggerEvent('bindDateChange',e.detail)
    },
    _goMessage: function (event){
        wx.navigateTo({
          url: '/pages/messageCenter/messageCenter'
        })
    }
  }
})
