import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 需要左方向动画的路由用this.$router.togo('****')
Router.prototype.togo = function (info) {
  let num = parseInt(window.localStorage.getItem('routeNum'))
  ++num
  console.log(num)
  window.localStorage.setItem('routeNum', num)
  window.localStorage.setItem('routeLeft', 'true')
  window.localStorage.setItem('routeRight', 'false')
  this.push(info)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (info) {
  this.isleft = false
  this.isright = true
  this.push(info.path)
}
Router.prototype.toReplace = function (info) {
  window.localStorage.setItem('routeLeft', 'false')
  window.localStorage.setItem('routeRight', 'false')
  this.replace(info)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  let num = parseInt(window.localStorage.getItem('routeNum'))
  --num
  window.localStorage.setItem('routeNum', num)
  window.localStorage.setItem('routeLeft', 'false')
  window.localStorage.setItem('routeRight', 'true')
  this.go(-1)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true
  this.isleft = false
}
// 点击浏览器前进按钮执行
Router.prototype.togoin = function () {
  this.isright = false
  this.isleft = true
}
export default new Router({
  // mode: 'history', // 本地测试，最后要去掉
  routes: [{
    path: '/',
    name: 'NavigationPage',
    component: (resolve) => require(['@/views/navigationPage'], resolve),
    meta: {
      title: '活动页',
      noCache: true
    }
  }, {
    path: '/login',
    name: 'Login',
    component: (resolve) => require(['@/views/login'], resolve),
    meta: {
      title: '登录',
      noCache: true
    }
  }, {
    path: '/guidePage',
    name: 'GuidePage',
    component: (resolve) => require(['@/views/guidePage'], resolve),
    meta: {
      title: '引导页',
      noCache: true
    }
  },
  {
    path: '/index',
    name: 'IndexRoute',
    component: (resolve) => require(['@/views/index'], resolve),
    children: [{
      path: '/index',
      name: 'Index',
      meta: {
        title: '首页',
        noCache: false
      },
      component: (resolve) => require(['@/views/index/index'], resolve)
    },
    {
      path: '/hotPush',
      name: 'Find',
      component: (resolve) => require(['@/views/index/find'], resolve),
      meta: {
        title: '精选',
        noCache: false
      }
    },
    {
      path: '/type',
      name: 'Type',
      component: (resolve) => require(['@/views/index/type'], resolve),
      meta: {
        title: '商品分类',
        noCache: false
      }
    },
    {
      path: '/typeList',
      name: 'TypeList',
      component: (resolve) => require(['@/views/other/typeList'], resolve),
      meta: {
        title: '商品分类',
        noCache: false
      }
    },
    {
      path: '/shoper',
      name: 'Shoper',
      component: (resolve) => require(['@/views/other/shoper'], resolve),
      meta: {
        title: '会员',
        noCache: true
      }
    },
    {
      path: '/car',
      name: 'Car',
      component: (resolve) => require(['@/views/index/car'], resolve),
      meta: {
        title: '购物车',
        noCache: false
      }
    },
    {
      path: '/member',
      name: 'Member',
      component: (resolve) => require(['@/views/index/member'], resolve),
      meta: {
        title: '个人中心',
        noCache: false
      }
    },
    {
      path: '/order',
      name: 'Order',
      component: (resolve) => require(['@/views/index/myOrder'], resolve),
      meta: {
        title: '我的订单',
        noCache: true
      }
    },
    {
      path: '/proList',
      name: 'ProList',
      component: (resolve) => require(['@/views/index/proList'], resolve),
      meta: {
        title: '商品列表',
        noCache: false
      }
    },
    {
      path: '/flashSale',
      name: 'Flash',
      component: (resolve) => require(['@/views/index/flashSale'], resolve),
      meta: {
        title: '限时抢购',
        noCache: true
      }
    },
    {
      path: '/tryOut',
      name: 'Try',
      component: (resolve) => require(['@/views/index/tryOut'], resolve),
      meta: {
        title: '试用体验',
        noCache: true
      }
    },
    {
      path: '/myGroupBy',
      name: 'Group',
      component: (resolve) => require(['@/views/index/group'], resolve),
      meta: {
        title: '拼团中心',
        noCache: true
      }
    },
    {
      path: '/myColl',
      name: 'MyColl',
      component: (resolve) => require(['@/views/index/myColl'], resolve),
      meta: {
        title: '我的收藏',
        noCache: false
      }
    },
    {
      path: '/activityList',
      name: 'ActivityList',
      component: (resolve) => require(['@/views/index/activityList'], resolve),
      meta: {
        title: '活动列表',
        noCache: true
      }
    },
    {
      path: '/paySuccess',
      name: 'PaySuccess',
      component: (resolve) => require(['@/views/index/paySuccess'], resolve),
      meta: {
        title: '支付成功页',
        noCache: true
      }
    }, {
      path: '/asShoper',
      name: 'AsShoper',
      component: (resolve) => require(['@/views/other/asShoper'], resolve),
      meta: {
        title: '成为会员',
        noCache: true
      }
    }
    ]
  },
  {
    path: '/set',
    name: 'Set',
    component: (resolve) => require(['@/views/set'], resolve),
    meta: {
      title: '设置',
      noCache: true
    }
  },
  {
    path: '/network',
    name: 'Network',
    component: (resolve) => require(['@/views/network'], resolve),
    meta: {
      title: '网络',
      noCache: true
    }
  },
  {
    path: '/other',
    name: 'Other',
    component: (resolve) => require(['@/views/other'], resolve),
    meta: {
      title: '页面标题',
      noCache: true
    }
  },
  {
    path: '/protocol',
    name: 'Protocol',
    component: (resolve) => require(['@/views/protocol'], resolve),
    meta: {
      title: '服务协议',
      noCache: true
    }
  },
  {
    path: '/proDetail',
    name: 'ProDetail',
    component: (resolve) => require(['@/views/proDetail'], resolve),
    meta: {
      title: '商品详情',
      noCache: false
    }
  },
  {
    path: '/proDetailRec',
    name: 'proDetailRec',
    component: (resolve) => require(['@/views/proDetailRec'], resolve),
    meta: {
      title: '商品详情',
      noCache: false
    }
  },
  {
    path: '/tryDetail',
    name: 'TryDetail',
    component: (resolve) => require(['@/views/tryDetail'], resolve),
    meta: {
      title: '试用商品详情',
      noCache: true
    }
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: (resolve) => require(['@/views/orderDetail'], resolve),
    meta: {
      title: '订单详情',
      noCache: true
    }
  },
  {
    path: '/lottery',
    name: 'Lottery',
    component: (resolve) => require(['@/views/lottery'], resolve),
    meta: {
      title: '每日抽奖',
      noCache: true
    }
  },
  {
    path: '/findDetail',
    name: 'FindDetail',
    component: (resolve) => require(['@/views/findDetail'], resolve),
    meta: {
      title: '文章详情',
      noCache: true
    }
  },
  {
    path: '/sureOrder',
    name: 'SureOrder',
    component: (resolve) => require(['@/views/sureOrder'], resolve),
    meta: {
      title: '确认支付',
      noCache: true
    }
  },
  {
    path: '/myFootprint',
    name: 'MyFootprint',
    component: (resolve) => require(['@/views/member/myFootprint'], resolve),
    meta: {
      title: '我的足迹',
      noCache: true
    }
  },
  {
    path: '/mySignIn',
    name: 'MySignIn',
    component: (resolve) => require(['@/views/member/mySignIn'], resolve),
    meta: {
      title: '我的签到',
      noCache: true
    }
  },
  {
    path: '/improveInfo',
    name: 'ImproveInfo',
    component: (resolve) => require(['@/views/member/improveInfo'], resolve),
    meta: {
      title: '完善生日',
      noCache: true
    }
  },
  {
    path: '/myCoupon',
    name: 'MyCoupon',
    component: (resolve) => require(['@/views/member/myCoupon'], resolve),
    meta: {
      title: '我的优惠券',
      noCache: true
    }
  },
  {
    path: '/myQrcode',
    name: 'MyQrcode',
    component: (resolve) => require(['@/views/member/myQrcode'], resolve),
    meta: {
      title: '我的二维码',
      noCache: true
    }
  },
  {
    path: '/editInfo',
    name: 'EditInfo',
    component: (resolve) => require(['@/views/member/editInfo'], resolve),
    meta: {
      title: '我的地址',
      noCache: true
    }
  },
  {
    path: '/editAddr',
    name: 'EditAddr',
    component: (resolve) => require(['@/views/member/editAddr'], resolve),
    meta: {
      title: '编辑地址',
      noCache: true
    }
  },
  {
    path: '/personCenter',
    name: 'PersonCenter',
    component: (resolve) => require(['@/views/member/personCenter'], resolve),
    meta: {
      title: '我的资料',
      noCache: true
    }
  },
  {
    path: '/bind',
    name: 'Bind',
    component: (resolve) => require(['@/views/member/bind'], resolve),
    meta: {
      title: '绑定手机',
      noCache: true
    }
  },
  {
    path: '/news',
    name: 'News',
    component: (resolve) => require(['@/views/member/news'], resolve),
    meta: {
      title: '消息中心',
      noCache: true
    }
  },
  {
    path: '/myScore',
    name: 'MyScore',
    component: (resolve) => require(['@/views/member/myScore'], resolve),
    meta: {
      title: '我的积分',
      noCache: true
    }
  },
  {
    path: '/myComment',
    name: 'MyComment',
    component: (resolve) => require(['@/views/member/myComment'], resolve),
    meta: {
      title: '我的评价',
      noCache: true
    }
  },
  {
    path: '/mytryOut',
    name: 'MytryOut',
    component: (resolve) => require(['@/views/member/mytryOut'], resolve),
    meta: {
      title: '我的试用',
      noCache: true
    }
  },
  {
    path: '/groupBy',
    name: 'GroupBy',
    component: (resolve) => require(['@/views/member/groupBy'], resolve),
    meta: {
      title: '我的拼团',
      noCache: true
    }
  },
  {
    path: '/myGift',
    name: 'MyGift',
    component: (resolve) => require(['@/views/member/myGift'], resolve),
    meta: {
      title: '我的赠品',
      noCache: true
    }
  },
  {
    path: '/myGiftList',
    name: 'MyGiftList',
    component: (resolve) => require(['@/views/member/myGiftList'], resolve),
    meta: {
      title: '我的奖品',
      noCache: true
    }
  },
  {
    path: '/myIntersted',
    name: 'MyIntersted',
    component: (resolve) => require(['@/views/member/myIntersted'], resolve),
    meta: {
      title: '我的关注',
      noCache: true
    }
  },
  {
    path: '/vipBirthday',
    name: 'Birtahday',
    component: (resolve) => require(['@/views/member/vipBirthday'], resolve),
    meta: {
      title: '生日专区',
      noCache: true
    }
  },
  {
    path: '/orderTrack',
    name: 'OrderTrack',
    component: (resolve) => require(['@/views/other/orderTrack'], resolve),
    meta: {
      title: '物流详情',
      noCache: true
    }
  },
  {
    path: '/single',
    name: 'Single',
    component: (resolve) => require(['@/views/other/single'], resolve),
    meta: {
      title: '凑单',
      noCache: true
    }
  },
  {
    path: '/useCoupon',
    name: 'UseCoupon',
    component: (resolve) => require(['@/views/other/useCoupon'], resolve),
    meta: {
      title: '使用优惠券',
      noCache: true
    }
  },
  {
    path: '/addComment',
    name: 'AddComment',
    component: (resolve) => require(['@/views/other/addComment'], resolve),
    meta: {
      title: '添加评价',
      noCache: true
    }
  },
  {
    path: '/err',
    name: 'ErrPage',
    component: (resolve) => require(['@/views/other/errPage'], resolve),
    meta: {
      title: '公主购',
      noCache: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: (resolve) => require(['@/views/other/search'], resolve),
    meta: {
      title: '搜索',
      noCache: true
    }
  },
  {
    path: '/saleAfter',
    name: 'SaleAfter',
    component: (resolve) => require(['@/views/other/saleAfter'], resolve),
    meta: {
      title: '申请售后',
      noCache: true
    }
  },
  {
    path: '/scanCode',
    name: 'ScanCode',
    component: (resolve) => require(['@/views/other/scanCode'], resolve),
    meta: {
      title: '扫码结果页',
      noCache: true
    }
  },
  {
    path: '/afterDetail',
    name: 'AfterDetail',
    component: (resolve) => require(['@/views/other/afterDetail'], resolve),
    meta: {
      title: '售后详情',
      noCache: true
    }
  },
    // {
    //   path: '/userAuz',
    //   name: 'UserAuz',
    //   component: (resolve) => require(['@/views/other/userAuz'], resolve),
    //   meta: {
    //     title: '微信授权页',
    //     noCache: true
    //   }
    // },
  {
    path: '/groupResult',
    name: 'GroupResult',
    component: (resolve) => require(['@/views/other/groupResult'], resolve),
    meta: {
      title: '拼购详情',
      noCache: true
    }
  },
  {
    path: '/scan',
    name: 'ScanPage',
    component: (resolve) => require(['@/views/other/scanPage'], resolve),
    meta: {
      title: '扫一扫',
      noCache: true
    }
  },
  {
    path: '/giftPackage',
    name: 'GiftPackage',
    component: (resolve) => require(['@/views/member/giftPackage'], resolve),
    meta: {
      title: '礼包专区',
      noCache: true
    }
  },
  {
    path: '/poster',
    name: 'Poster',
    component: (resolve) => require(['@/views/other/poster'], resolve),
    meta: {
      title: '海报',
      noCache: true
    }
  },
  {
    path: '/myIncome',
    name: 'MyIncome',
    component: (resolve) => require(['@/views/other/myIncome'], resolve),
    meta: {
      title: '我的收益',
      noCache: true
    }
  },
  {
    path: '/walletDetail',
    name: 'WalletDetail',
    component: (resolve) => require(['@/views/other/walletDetail'], resolve),
    meta: {
      title: '钱包明细',
      noCache: true
    }
  },
  {
    path: '/myWallet',
    name: 'MyWallet',
    component: (resolve) => require(['@/views/other/myWal'], resolve),
    meta: {
      title: '我的钱包',
      noCache: true
    }
  },
  {
    path: '/cashWithDrawal',
    name: 'CashWithDrawal',
    component: (resolve) => require(['@/views/member/cashWithDrawal'], resolve),
    meta: {
      title: '余额提现',
      noCache: true
    }
  },
  {
    path: '/newPeople',
    name: 'NewPeople',
    component: (resolve) => require(['@/views/other/newPeople'], resolve),
    meta: {
      title: '新人特惠',
      noCache: true
    }
  },
  {
    path: '/newPeopleDetail',
    name: 'NewPeopleDetail',
    component: (resolve) => require(['@/views/other/newPeopleDetail'], resolve),
    meta: {
      title: '新人详情',
      noCache: true
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: (resolve) => require(['@/views/other/chat'], resolve),
    meta: {
      title: '我的客服',
      noCache: true
    }
  },
  {
    path: '/myCard',
    name: 'MyCard',
    component: (resolve) => require(['@/views/member/myCard'], resolve),
    meta: {
      title: '我的银行卡',
      noCache: true
    }
  },
  {
    path: '/addCard',
    name: 'AddCard',
    component: (resolve) => require(['@/views/member/addCard'], resolve),
    meta: {
      title: '添加银行卡',
      noCache: true
    }
  },
  {
    path: '/noticeDetail',
    name: 'NoticeDetail',
    component: (resolve) => require(['@/views/member/noticeDetail'], resolve),
    meta: {
      title: '订单详情',
      noCache: true
    }
  },
  {
    path: '/phoneLogin',
    name: 'PhoneLogin',
    component: (resolve) => require(['@/views/member/phoneLogin'], resolve),
    meta: {
      title: '手机登录',
      noCache: true
    }
  },
  {
    path: '/saleOrder',
    name: 'SaleOrder',
    component: (resolve) => require(['@/views/member/saleOrder'], resolve),
    meta: {
      title: '销售订单',
      noCache: true
    }
  },
  {
    path: '/todayNew',
    name: 'TodayNew',
    component: (resolve) => require(['@/views/member/todayNew'], resolve),
    meta: {
      title: '今日新增',
      noCache: true
    }
  },
  {
    path: '/customerDetail',
    name: 'CustomerDetail',
    component: (resolve) => require(['@/views/member/customerDetail'], resolve),
    meta: {
      title: '客户详情',
      noCache: true
    }
  },
  {
    path: '/historyEarnings',
    name: 'HistoryEarnings',
    component: (resolve) => require(['@/views/member/historyEarnings'], resolve),
    meta: {
      title: '历史收益',
      noCache: true
    }
  },
  {
    path: '/returnsDetailed',
    name: 'ReturnsDetailed',
    component: (resolve) => require(['@/views/member/returnsDetailed'], resolve),
    meta: {
      title: '收益明细',
      noCache: true
    }
  }
  ]
})
