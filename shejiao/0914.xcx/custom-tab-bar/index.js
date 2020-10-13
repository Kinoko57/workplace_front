var app = getApp()
let util = require('../utils/util.js')

Component({
  data: {
    selected: 0,
    color: "#8a8a8a",
    selectedColor: "#ff0000",
    isChange: false,
    list: [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "https://apids.88360.com/public/img/image/nav/index.png",
        "selectedIconPath": "https://apids.88360.com/public/img/image/nav/index_c.png",
        "text": "首页"
      }, {
        "pagePath": "/pages/type/type",
        "iconPath": "https://apids.88360.com/public/img/image/nav/type.png",
        "selectedIconPath": "https://apids.88360.com/public/img/image/nav/type_c.png",
        "text": "分类"
      },
      {
        "pagePath": "/pages/findList/findList",
        "iconPath": "https://apids.88360.com/public/img/image/nav/vip.png",
        "selectedIconPath": "https://apids.88360.com/public/img/image/nav/vip_c.png",
        "text": "直播"
      },
      {
        "pagePath": "/pages/car/car",
        "iconPath": "https://apids.88360.com/public/img/image/nav/car.png",
        "selectedIconPath": "https://apids.88360.com/public/img/image/nav/car_c.png",
        "text": "购物车"
      }, {
        "pagePath": "/pages/my/my",
        "iconPath": "https://apids.88360.com/public/img/image/nav/my.png",
        "selectedIconPath": "https://apids.88360.com/public/img/image/nav/my_c.png",
        "text": "我的"
      }
    ]
  },
  lifetimes: {
    attached: function created() {
        console.log('组件初始化')
        console.log('底部栏赋值')
        if(wx.getStorageSync("navList")!=''){
          console.log(wx.getStorageSync("navList"))
          if(this.data.isChange==false){
            let newList = wx.getStorageSync("navList")
            console.log("赋值")
            let navList = this.data.list
            for(let i =0;i<navList.length;i++){
              navList[i].iconPath = newList[i].front_icon
              navList[i].selectedIconPath = newList[i].last_icon
              navList[i].text = newList[i].title
            }
            this.setData({
              list: navList
            })
          }else{
            console.log("已赋值")
          }
        }else{
          let showList = [
            {
              "pagePath": "/pages/index/index",
              "iconPath": "https://apids.88360.com/public/img/image/nav/index.png",
              "selectedIconPath": "https://apids.88360.com/public/img/image/nav/index_c.png",
              "text": "首页"
            }, {
              "pagePath": "/pages/type/type",
              "iconPath": "https://apids.88360.com/public/img/image/nav/type.png",
              "selectedIconPath": "https://apids.88360.com/public/img/image/nav/type_c.png",
              "text": "分类"
            },
            {
              "pagePath": "/pages/findList/findList",
              "iconPath": "https://apids.88360.com/public/img/image/nav/vip.png",
              "selectedIconPath": "https://apids.88360.com/public/img/image/nav/vip_c.png",
              "text": "直播"
            },
            {
              "pagePath": "/pages/car/car",
              "iconPath": "https://apids.88360.com/public/img/image/nav/car.png",
              "selectedIconPath": "https://apids.88360.com/public/img/image/nav/car_c.png",
              "text": "购物车"
            }, {
              "pagePath": "/pages/my/my",
              "iconPath": "https://apids.88360.com/public/img/image/nav/my.png",
              "selectedIconPath": "https://apids.88360.com/public/img/image/nav/my_c.png",
              "text": "我的"
            }
          ]
          this.setData({
            list: showList
          })
        }
        // util.queryRequest('/app/index/getNavMain', {}, 'GET').then(function (res) {
        //   if (res.code == 200) {
        //     console.log(res.data)
        //   }
        // })
    }
},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      if(this.data.selected==2&&data.index==2){
        // 发布动态页
        // 判断是否登录
        if(util.isLogin()){
          wx.navigateTo({
            url: '/pages/addSocia/addSocia',
          })
        }else{
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }else{
        wx.switchTab({url})
      }
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})