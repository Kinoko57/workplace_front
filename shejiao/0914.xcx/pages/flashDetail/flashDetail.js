// pages/proDetail/proDetail.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTop: true,
    showSkeleton: true,
    formType: '',
    teamList:[],
    groupShow: true,
    is_start: '',
    carNum: app.globalData.carNum,
    staticUrl: app.globalData.staticUrl,
    showNav: false,
    choseNav: 'top',
    active_id: '', // 促销活动id
    showModel: false,
    shareShow: false, // 分享弹框
    serverShow: false, // 服务弹框
    deliveryShow: false, // 配送说明
    afterShow: false, // 售后详情
    discountShow: false, // 优惠信息
    specShow: false, // 规格弹框
    specNum: 1, // 购买数量
    isiPhoneX: app.globalData.isiPhoneX,
    navHeight: app.globalData.navHeight, // 导航栏高度
    navTop: app.globalData.navTop,
    statusBarHeight: app.globalData.statusBarHeight, // 状态栏高度
    menuHeight: app.globalData.menuHeight, // 状态栏高度
    filePath: app.globalData.fileUrl,
    commTop: 0, // 评价距离顶部高度
    detailTop: 0, // 详情距离顶部高度
    recommendTop: 0, // 推荐距离顶部高度
    recommendList: [],
    tagInfo: {},
    page: 1,
    size: 6,
    hasData: true,
    is_end: true,
    page_num: 0,
    proInfo: {}, // 商品详情的基本参数
    activityStatus: 0, // 活动状态 0是未开始，1是进行中，2是已结束
    startTime: null, // 开始时间
    endTime: null, // 结束时间
    saleTime: [], // 显示倒计时的时间
    time: null, // 延时器
    comment: {},// 商品详情的单条评价
    shopDetail: {
      shop_img: app.globalData.staticUrl + 'my/avatar.png',
      shop_name: '珍岛旗舰店',
      shop_star: '1.5',
      desc: '5',
      seller: '5',
      logistics: '5',
    },
    proDetail: '',
    serverList: [],
    deliveryList: [{
        name: '江浙沪地区包邮'
      },
      {
        name: '西藏、内蒙古地区采用邮政平邮'
      },
      {
        name: '港澳台不再配送范围内'
      },
    ],
    afterList: [{
        name: '售后说明',
        desc: '仓库打包发货时严格检查每一个商品，并增加二次包装，加固包裹，予以保证商品完好无损，但因海外长途运输，如收货时出现破损、错发、漏发等情况，请及时联系在线客服，申请售后'
      },
      {
        name: '理赔流程',
        desc: '如因包装箱丢失、物流面单撕毁或超出售后时效（包裹签日起3个工作日内）而造成的损失，安适购将无法承担相关售后工作，请见谅！注： 如物流公司电话通知包裹已破损无须派送，请告知物流公司继续派送并同时开具破损证明，然后联系在线客服处理售后问题。因国际包裹如果不派送，将退回至清关城市，并产生二次派送费用。切申请理赔工作比较繁琐，请您理解！'
      }
    ],
    videoShow: false,
    videoUrl: '',
    couponList: [{
        coupon_id: 1,
        coupon_name: '仅可购买珍岛自营部分商品',
        cou_price: '500',
        amount: '800',
        is_get: 1,
        is_snatch: 0
      },
      {
        coupon_id: 2,
        coupon_name: '仅可购买珍岛自营部分商品',
        cou_price: '500',
        amount: '800',
        is_get: 0,
        is_snatch: 0
      },
    ], //优惠券列表
    discountList: [{
        name: '满30包邮'
      },
      {
        name: '购买食品类自营满50元，返10元无门槛券'
      },
      {
        name: '满2件打九折'
      },
      {
        name: '购买1件可换购热销产品'
      },
      {
        name: '购买两件赠送洗面奶一瓶'
      }
    ], //优惠信息列表
    couList: [], // 优惠券列表
    sendByPost: {},
    specList: [], // 规格列表
    productsList: [], // 货品列表
    choseIds: [],
    choseNames: '',
  },
  goGroupResult: util.throttle(function (e) {
    wx.navigateTo({
      url: e[0].currentTarget.dataset.link + '&group_id=' + e[0].currentTarget.dataset.gid + '&team_id=' +e[0].currentTarget.dataset.tid,
    })
  }),
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
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  goBuy(e) {
    wx.navigateTo({
      url: '../payment/payment?type=' + this.data.formType + '&goods_id=' + this.data.proInfo.goods_id + '&product_id=' + this.data.proInfo.product_id + '&num=' + this.data.specNum + '&act_id=' + this.data.active_id,
    })
  },
  showShare() {
    this.setData({
      showModel: true,
      shareShow: true,
    })
  },
  showDiscount() {
    this.setData({
      showModel: true,
      discountShow: true,
    })
  },
  // 获取服务说明并显示
  showServer() {
    let that = this
    util.queryRequest('/app/goods/serviceExplain', {
      serviceId: this.data.proInfo.service
    }, "GET").then(function (res) {
      if (res.code == 200) {
        that.setData({
          showModel: true,
          serverShow: true,
          serverList: res.data
        })
      }
    })
  },
  showAfter() {
    this.setData({
      showModel: true,
      afterShow: true,
    })
  },
  showDelivery() {
    this.setData({
      showModel: true,
      deliveryShow: true,
    })
  },
  showSpec() {
    this.setData({
      showModel: true,
      specShow: true,
    })
  },
  hidenModel() {
    this.setData({
      shareShow: false,
      deliveryShow: false,
      serverShow: false,
      showModel: false,
      afterShow: false,
      discountShow: false,
      specShow: false,
    })
  },
  sureModel() {
    this.setData({
      shareShow: false,
      deliveryShow: false,
      serverShow: false,
      showModel: false,
      afterShow: false
    })
  },
  playVideo() {
    // 显示video标签
    this.setData({
      videoShow: true
    })
  },
  collPro: util.throttle(function () {
    this.data.proInfo.collect = !this.data.proInfo.collect
    let that = this
    if (this.data.proInfo.collect) {
      // 收藏商品
      util.queryRequest('/app/goods/collectAdd', {
        goods_id: this.data.proInfo.goods_id
      }, 'GET').then(function (res) {
        if (res.code == 200) {
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
      // 取消收藏
      util.queryRequest('/app/goods/collectRemove', {
        goods_id: this.data.proInfo.goods_id
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          wx.showToast({
            title: '取消收藏成功',
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
    }
    this.setData({
      proInfo: this.data.proInfo
    })
  }),
  exitPlayer() {
    // 隐藏video标签
    this.setData({
      videoShow: false
    })
  },
  srcollPage(event) {
    let that = this
    let tag = event.currentTarget.dataset.value
    if (tag == 'pro') {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      setTimeout(() => {
        that.setData({
          showNav: false
        })
      }, 300)
    } else if (tag == 'comment') {
      wx.pageScrollTo({
        scrollTop: that.data.commTop,
        duration: 300
      })
    } else if (tag == 'detail') {
      wx.pageScrollTo({
        scrollTop: that.data.detailTop,
        duration: 300
      })
    } else if (tag == 'recommend') {
      wx.pageScrollTo({
        scrollTop: that.data.recommendTop,
        duration: 300
      })
    }
    that.setData({
      choseNav: tag
    })
  },
  // 选择规格
  choseSpec(e) {
    console.log(e)
    if (e.currentTarget.dataset.disable == false) {
      for (let i = 0; i < this.data.specList.length; i++) {
        if (e.currentTarget.dataset.parentid == this.data.specList[i].spec_id) {
          for (let j = 0; j < this.data.specList[i].spec_value_name.length; j++) {
            if (this.data.specList[i].spec_value_name[j].spec_value_id == e.currentTarget.dataset.id) {
              this.data.specList[i].spec_value_name[j].chose = 1
            } else {
              this.data.specList[i].spec_value_name[j].chose = 0
            }
          }
        } else {
          if (this.data.proInfo.spec_type == 1) {
          console.log(chose_spec_id)
          // 判断其余规格是否可选
          for (let j = 0; j < this.data.specList[i].spec_value_name.length; j++) {
            this.data.specList[i].spec_value_name[j].disabled = false
            let flag = true
            for (let k = 0; k < this.data.specList[i].spec_value_name[j].keys_result.length; k++) {
              if (this.data.specList[i].spec_value_name[j].keys_result[k].indexOf(chose_spec_id) != -1) {
                console.log("规格id存在数组")
                flag = false
                break
              }

            }
            // 判断此规格是否出现
            if (flag) {
              this.data.specList[i].spec_value_name[j].disabled = true
            }
          }
        }
        }
      }
      this.setData({
        specList: this.data.specList
      })
      // 获取已选中的spec_value_id的集合
      let specs = []
      let names = []
      for (let i = 0; i < this.data.specList.length; i++) {
        for (let j = 0; j < this.data.specList[i].spec_value_name.length; j++) {
          if (this.data.specList[i].spec_value_name[j].chose == 1) {
            specs.push(this.data.specList[i].spec_value_name[j].spec_value_id)
            names.push(this.data.specList[i].spec_value_name[j].spec_value_name)
          }
        }
      }
      this.setData({
        choseNames: names.join(',')
      })
      if (specs.length == this.data.specList.length) {
        this.getProductInfo(specs.sort())
      } else {
        console.log("spec未选择完毕")
      }
    } else {
      console.log("点击的是disabled的按钮")
    }
  },
  // 根据规格id获取规格详细信息
  getProductInfo(arr) {
    let flag = false
    for (let i = 0; i < this.data.productsList.length; i++) {
      if (JSON.stringify(arr) == JSON.stringify(this.data.productsList[i].key)) {
        //找到了对应的货品original_price
        this.data.proInfo.imgList = this.data.productsList[i].imgList
        this.data.proInfo.product_id = this.data.productsList[i].id
        this.data.proInfo.retail_price = this.data.productsList[i].retail_price
        this.data.proInfo.cost_price = this.data.productsList[i].cost_price
        this.data.proInfo.original_price = this.data.productsList[i].original_price
        this.data.proInfo.market_price = this.data.productsList[i].market_price
        this.data.proInfo.price = this.data.productsList[i].price
        this.data.proInfo.purchase_limits = this.data.productsList[i].purchase_limits
        this.data.proInfo.inventory = this.data.productsList[i].inventory
        this.data.proInfo.weight = this.data.productsList[i].weight
        this.data.proInfo.product_status = this.data.productsList[i].status
        flag = true
      }
      if (flag) {
        break
      }
    }
    this.setData({
      proInfo: this.data.proInfo
    })
  },
  // 增加数量
  addNum: function (event) {
    let id = event.target.id;
    let value = parseInt(this.data.specNum);
    if (value == 99) {
      wx.showToast({
        title: '不能再增加啦~',
        icon: 'none',
        duration: 1000
      })
    } else {
      value++;
      this.setData({
        specNum: value
      })
    }

  },
  // input改变数量
  changeValue: function (e) {
    // 判断限购数量
    // 没有限购数量，判断不能大于99
    if (e.detail.value >= 1) {
      if (e.detail.value > 99) {
        wx.showToast({
          title: '该商品最多可购买99件~',
          icon: 'none',
          duration: 1000
        })
        this.data.specNum = 99
      } else {
        this.data.specNum = parseInt(e.detail.value)
      }
    } else {
      wx.showToast({
        title: '该商品至少购买1件~',
        icon: 'none',
        duration: 1000
      })
      this.data.specNum = 1
    }
    this.setData({
      specNum: this.data.specNum
    })
  },
  // 减少数量
  lessNum: function (event) {
    let id = event.target.id;
    let value = parseInt(this.data.specNum);
    if (value <= 1) {
      wx.showToast({
        title: '不能再减少啦~',
        icon: 'none',
        duration: 1000
      })
    } else {
      value--
      this.setData({
        specNum: value
      })
    }

  },
  // 加入购物车
  addCar: function () {
    let info = {
      goods_id: this.data.proInfo.goods_id,
      product_id: this.data.proInfo.product_id,
      shops_num: this.data.specNum,
    }
    let that = this
    util.queryRequest('/app/cart/add', info, 'POST').then(function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 1000
        })
        that.hidenModel()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 获取商品详情
  getDetail() {
    let that = this
    let url = ''
    if (that.data.formType == 1) {
      // 限购
      url = '/app/limitActivity/get'
    } else if (that.data.formType == 2) {
      // 体验
      url = '/app/expe/get'
    } else if (that.data.formType == 3) {
      // 礼盒
      url = '/app/giftActivity/get'
    }else if(that.data.formType == 5){
      // 拼团
      url = '/app/groupActivity/get'
    }else if(that.data.formType == 4){
      // 秒杀
      url = '/app/seckill/get'
    }
    // url='/app/goods/get'
    util.queryRequest(url,{id: this.data.active_id}, 'GET').then(function (res) {
      if (res.code == 200) {
        // res.data.goods.imgList = JSON.parse(res.data.goods.img)
        res.data.goods.imgList = res.data.goods.img
        res.data.goods.video = res.data.goods.video
        let static_spec = []
        let static_spec_name = []
        // 整理货品列表
        let productList = []
        let arr = {}
        for (let i in res.data.attr_product) {
          let key = []
          let key_name = []
          let keys_list = []
          let static_keys_list = []
          for (let j in res.data.attr_product[i].product_spec) {
            key.push(res.data.attr_product[i].product_spec[j].spec_value_id)
            key_name.push(res.data.attr_product[i].product_spec[j].spec_value_name)
            keys_list.push(res.data.attr_product[i].product_spec[j].spec_id + ':' + res.data.attr_product[i].product_spec[j].spec_value_id)
            static_keys_list.push({
              pid: res.data.attr_product[i].product_spec[j].spec_id,
              key: res.data.attr_product[i].product_spec[j].spec_value_id,
              keys_list: res.data.attr_product[i].product_spec[j].spec_id + ':' + res.data.attr_product[i].product_spec[j].spec_value_id
            })
          }
          res.data.attr_product[i].imgList = res.data.attr_product[i].img
          res.data.attr_product[i].key = key.sort()
          res.data.attr_product[i].key_name = key_name
          res.data.attr_product[i].keys_list = keys_list
          res.data.attr_product[i].static_keys_list = static_keys_list.sort()
          arr[res.data.attr_product[i].id] = key.sort().join('_')
          if (res.data.goods.product_id == res.data.attr_product[i].id) {
            static_spec = res.data.attr_product[i].static_keys_list
            static_spec_name = res.data.attr_product[i].key_name
          }
          productList.push(res.data.attr_product[i])
        }
        // 货品的集合
        let static_spec_list = []
        let specs_list = []
        // 循环给规格数组赋值，笛卡尔积生成所有的情况
        for (let i = 0; i < res.data.attr_data.length; i++) {
          res.data.attr_data[i].level = i
          res.data.attr_data[i].specs_list = []
          let keys = []
          for (let j = 0; j < res.data.attr_data[i].spec_value_name.length; j++) {
            res.data.attr_data[i].spec_value_name[j].chose = 0
            res.data.attr_data[i].spec_value_name[j].disabled = false
            res.data.attr_data[i].spec_value_name[j].keys_sort = res.data.attr_data[i].spec_id + ':' + res.data.attr_data[i].spec_value_name[j].spec_value_id
            keys.push(res.data.attr_data[i].spec_id + ':' + res.data.attr_data[i].spec_value_name[j].spec_value_id)
          }
          res.data.attr_data[i].specs_list = keys
          specs_list.push(keys)
        }
        // if (res.data.goods.spec_type == 1) {
        //   res.data.attr_data = that.addDeduplication(res.data.attr_data, specs_list, 'specs_list', 'spec_result', 1)
        //   for (let i = 0; i < res.data.attr_data.length; i++) {
        //     for (let j = 0; j < res.data.attr_data[i].spec_value_name.length; j++) {
        //       let arr = JSON.parse(JSON.stringify(res.data.attr_data[i].spec_result))
        //       arr.unshift([res.data.attr_data[i].spec_value_name[j].keys_sort])
        //       res.data.attr_data[i].spec_value_name[j].keys_result = util.desCartes(arr)
        //       // 跟货品比对，筛选出每个属性里包含的货品
        //       res.data.attr_data[i].spec_value_name[j].keys_result = that.addDeduplication(res.data.attr_data[i].spec_value_name[j].keys_result, productList, 'keys_list', 'keys_result', 2)
        //     }
        //   }
        // }
        // 控制默认选中
        for (let i = 0; i < res.data.attr_data.length; i++) {
          for (let j = 0; j < res.data.attr_data[i].spec_value_name.length; j++) {
            res.data.attr_data[i].spec_value_name[j].disabled = false
            for (let k = 0; k < static_spec.length; k++) {
              if (static_spec[k].key == res.data.attr_data[i].spec_value_name[j].spec_value_id) {
                static_spec_list.push({
                  spec_id: static_spec[k],
                  key: j,
                  level: res.data.attr_data[i].level
                })
                res.data.attr_data[i].spec_value_name[j].chose = 1
              }
            }
          }
        }
        // if(res.data.goods.spec_type == 1){
        // // 判断是否禁用
        // for (let k = 0; k < static_spec.length; k++) {
        //   for (let i = 0; i < res.data.attr_data.length; i++) {
        //     if (static_spec[k].pid != res.data.attr_data[i].spec_id) {
        //       for (let j = 0; j < res.data.attr_data[i].spec_value_name.length; j++) {
        //         res.data.attr_data[i].spec_value_name[j].disabled = false
        //         // 判断另一个规格的是否禁用
        //         let flag = true
        //         for (let t = 0; t < res.data.attr_data[i].spec_value_name[j].keys_result.length; t++) {
        //           if (res.data.attr_data[i].spec_value_name[j].keys_result[t].indexOf(static_spec[k].keys_list) != -1) {
        //             flag = false
        //             break
        //           }
        //         }
        //         // 判断此规格是否出现
        //         if (flag) {
        //           res.data.attr_data[i].spec_value_name[j].disabled = true
        //           break
        //         }
        //       }
        //     }
        //   }
        // }
        // }
        // 当前活动状态
        let activityStatus = 0
        // 获取当前时间
        console.log(parseInt(new Date().getTime() / 1000))
        let nowTime = parseInt(new Date().getTime() / 1000)
        // 获取活动开始时间
        let startTime = res.data.activity.start_time
        console.log(res.data.activity.start_time)
        // 获取活动结束时间
        let endTime = res.data.activity.end_time
        console.log(res.data.activity.end_time)
        let activity_status = 0
        if (startTime > nowTime) {
          console.log("活动未开始")
          activityStatus = 0
        } else if (nowTime > endTime) {
          console.log("活动已结束")
          activityStatus = 1
        } else {
          console.log("活动进行中")
          activityStatus = 2
          nowTime = parseInt(new Date().getTime() / 1000)
          if (endTime - nowTime > 0) {
            // 设置倒计时
            let sectimeList = util.countDown(endTime - nowTime)
            that.setData({
              saleTime: sectimeList
            })
            that.data.time = setInterval(function () {
              if (endTime - nowTime > 0) {
                nowTime = parseInt(new Date().getTime() / 1000)
                sectimeList = util.countDown(endTime - nowTime)
                that.setData({
                  saleTime: sectimeList
                })
              } else {
                clearInterval(that.data.time)
                activityStatus = 1
                that.setData({
                  activityStatus: 1
                })
              }
            }.bind(that), 1000)
          }
          that.setData({
            time: that.data.time
          })
        }
        res.data.goods.product_status = 1
        that.setData({
          showSkeleton: false,
          proInfo: res.data.goods,
          comment: res.data.comment,
          specList: res.data.attr_data,
          productsList: productList,
          choseNames: static_spec_name.join(','),
          activityStatus: activityStatus,
          startTime: startTime,
          endTime: endTime,
          teamList:res.data.team,
          // recommPros: res.data.recommend != undefined ? res.data.recommend.rows : [],
          tagInfo: res.data.tag
        })
        that.getDetailRecommend()
        that.getCoupon()
        // 获取评价，详情，推荐距离顶部的高度
        let query1 = wx.createSelectorQuery()
        query1.select('.pro_comment').boundingClientRect()
        query1.select('.pro_detail_block').boundingClientRect()
        query1.exec(function (req) {
          that.setData({
            commTop: req[0].top - 40 - app.globalData.navHeight,
            detailTop: req[1].top - 40 - app.globalData.navHeight
          })
        })
        // 商品详情
        WxParse.wxParse('proDetail', 'html', res.data.goods.details, that, 10);
        // 包装售后
        WxParse.wxParse('afterDetail', 'html', res.data.goods.after_sale_details, that, 10);
        // 配送说明
        WxParse.wxParse('deliveryDetail', 'html', res.data.goods.freight_explain, that, 10);
        // 售后说明
        WxParse.wxParse('explainDetail', 'html', res.data.goods.after_explain, that, 10);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    }).catch(function (res) {})
  },
  // 去除重复，去除undefined,type为1返回first，type为2返回 second
  addDeduplication(first, second, key, result, type) {
    if (type == 1) {
      for (let i = 0; i < first.length; i++) {
        first[i][result] = []
        let list = second.map(item => {
          if (first[i][key].sort().toString() != item.sort().toString()) {
            return item
          }
        })
        first[i][result] = list.filter(res => {
          return res != undefined
        })
      }
      return first
    } else {
      let list = []
      for (let k = 0; k < first.length; k++) {
        let value = []
        value = second.map(item => {
          if (first[k].sort().toString() == item[key].sort().toString()) {
            return first[k]
          }
        })
        list.push(value.filter(res => {
          return res != undefined
        })[0])
      }
      first = list.filter(res => {
        return res != undefined
      })
      return first
    }
  },
  // 获取商品详情对接
  getDetailRecommend() {
    // 获取首页推荐数据
    let that = this
    let info = {
      id: this.data.proInfo.goods_id,
      page: this.data.page,
      size: this.data.size
    }
    util.queryRequest('/app/goods/recommend', info, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
          that.setData({
            ['recommendList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          let query3 = wx.createSelectorQuery()
          query3.select('.pro_recommend').boundingClientRect()
          console.log(query3.select('.pro_recommend').boundingClientRect())
          query3.exec(function (req) {
            that.setData({
              recommendTop: req[0].top - 40 - app.globalData.navHeight
            })
          })
        } else {
          that.setData({
            recommendList: [],
            hasData: false
          })
        }
      }
    })
  },
    // 获取商品相关的优惠券
    getCoupon(){
      let that = this
      util.queryRequest('/app/coupon/getGoodsCoupon', {
        goods_id: this.data.proInfo.goods_id,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log("获取商品详情的优惠券")
          console.log(res.data.coupon)
          for(let i = 0;i<res.data.coupon.length;i++){
            res.data.coupon[i].is_get = 0
          }
          that.setData({
            couList: res.data.coupon,
            sendByPost: res.data.sendByPost,
          })
        }
      }).catch(function (res) {})
    },
    // 领取优惠券
    getCou:util.throttle(function(e){
      let that = this
      if(e[0].currentTarget.dataset.get==1){
        console.log("去使用优惠券")
        wx.navigateTo({
          url: '../couProList/couProList?type='+e[0].currentTarget.id,
        })
      }else{
        console.log(e[0].currentTarget.id)
        let info ={
          coupon_id: e[0].currentTarget.id
        }
        let index = e[0].currentTarget.dataset.index
        that.data.couList[index].is_get = 1
        util.queryRequest('/app/coupon/couponReceive',info,'GET').then(function(res){
          if(res.code == 200){
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              couList: that.data.couList
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
  
    }),
  viewImage: util.throttle(function (e) {
    console.log(e[0])
    let that = this
    // 父级idconsole.log(e[0].currentTarget.dataset.pindex)
    let index = e[0].currentTarget.id
    // 当前index console.log(e[0].currentTarget.id)
    wx.previewImage({
      current: that.data.comment.rows[0].image[index], // 当前显示图片的http链接
      urls: that.data.comment.rows[0].image // 需要预览的图片http链接列表
    })
  }),
  goComment: util.throttle(function (event) {
    console.log(event)
    wx.navigateTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  goLink: util.throttle(function (event) {
    console.log(event)
    wx.reLaunch({
      url: event[0].currentTarget.dataset.link
    })
  }),
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      info = {
        id: this.data.proInfo.goods_id,
        page: ++this.data.page,
        size: this.data.size
      }
      console.log(info)
      util.queryRequest('/app/goods/recommend', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows.length > 0) {
            let currentpage = that.data.page - 1
            that.setData({
              ['recommendList[' + currentpage + ']']: res.data.rows,
              is_end: that.data.page_num == that.data.page
            })
          } else {
            that.setData({
              is_end: true
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
    console.log(options)
    this.setData({
      active_id: options.id,
      formType: options.type,
      carNum: app.globalData.carNum
    })
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.removeStorageSync('choseAdd')
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 140) {
      if (this.data.showNav == false) {
        this.setData({
          showNav: true,
          isTop: false
        })
      }
      if (this.data.choseNav != 'pro' && e.scrollTop < this.data.commTop) {
        // 选中商品
        this.setData({
          choseNav: 'pro'
        })
      }
      if (this.data.choseNav != 'comment' && e.scrollTop >= this.data.commTop && e.scrollTop < this.data.detailTop) {
        // 选中评价
        this.setData({
          choseNav: 'comment'
        })
      }
      if (this.data.recommendTop > 0 && this.data.choseNav != 'detail' && e.scrollTop >= this.data.detailTop && e.scrollTop < this.data.recommendTop) {
        // 选中详情
        this.setData({
          choseNav: 'detail'
        })
      }
      if (this.data.recommendTop > 0 && this.data.choseNav != 'recommend' && e.scrollTop >= this.data.recommendTop) {
        // 选中推荐
        this.setData({
          choseNav: 'recommend'
        })
      }
    }
    if (e.scrollTop <= 140) {
      if (this.data.showNav) {
        this.setData({
          showNav: false,
          isTop: true
        })
      }
    }
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
  onShareAppMessage: function () {

  }
})