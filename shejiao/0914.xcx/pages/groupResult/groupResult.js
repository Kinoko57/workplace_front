// pages/groupResult/groupResult.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 6,
    hasData: false,
    is_end: false,
    page_num: 0,
    total: 0,
    navHeight: app.globalData.navHeight,
    imgPath: app.globalData.fileUrl,
    staticUrl: app.globalData.staticUrl,
    isShow: false,
    showCamp: true,
    dayList: [], //营期日期天数选择列表
    allDayList: [],
    campId: '', //选中营期
    dayId: '', //选中营期天数
    shareUrl: '',
    modelShow: true,
    staticInfo: {},
    specList: [],
    ruleInfo: [],
    specNum: 1,
    group_id: '',
    team_id: '',
    isShare: app.globalData.is_share,
    imgPath: app.globalData.fileUrl,
    allowbind: true,
    orderId: '',
    id: '',
    showModel: false,
    specShow: false, // 规格弹框
    apiUrl: app.globalData.apiUrl,
    proInfo: {},
    specList: [],
    productsList: [],
    choseNames: '',
    groupPeople: [],
    GroupTeam: {},
    GroupOrder: {},
    startTime: null, // 开始时间
    endTime: null, // 结束时间
    saleTime: [], // 显示倒计时的时间
    countTime: 0,
    time: null, // 延时器
    activityStatus: 0, // 活动状态 0是未开始，2是进行中，1是已结束
    recommendList: []
  },
  getList:function(){
    let that = this
    let info = {
      page: this.data.page,
      size: this.data.size
    }
    util.queryRequest('/app/pay/recommend', info, "GET").then(function (res) {
      console.log(res)
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          recommendList: res.data.rows.rows,
          total: res.data.total,
          page_num: Math.ceil(res.data.total / that.data.size),
          is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
          hasData: true,
        })
      } else {
      }
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      info = {
        page: ++this.data.page,
        size: this.data.size
      }
      console.log(info)
      util.queryRequest('/app/pay/recommend', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows.length > 0) {
            that.data.recommendList = that.data.recommendList.concat(res.data.rows.rows,)
            that.setData({
              recommendList: that.data.recommendList,
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
  goIndex: util.throttle(function (event) {
    console.log(event)
    wx.switchTab({
      url: event[0].currentTarget.dataset.link
    })
  }),
  goProDetail: util.throttle(function (e) {
    console.log(e[0])
    let type = e[0].currentTarget.dataset.type
    let id = e[0].currentTarget.id
    if (type == 0) {
      wx.navigateTo({
        url: '/pages/proDetail/proDetail?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/flashDetail/flashDetail?id=' + id + '&type=' + type
      })
    }
  }),
  showSpec() {
    this.setData({
      showModel: true,
      specShow: true,
    })
  },
  hidenModel() {
    this.setData({
      showModel: false,
      specShow: false,
    })
  },
  // 选择规格
  choseSpec(e) {
    console.log(e)
    if (e.currentTarget.dataset.disable == false) {
      for (let i = 0; i < this.data.specList.length; i++) {
        if (e.currentTarget.dataset.parentid == this.data.specList[i].spec_id) {
          for (let j = 0; j < this.data.specList[i].spec_value.length; j++) {
            if (this.data.specList[i].spec_value[j].spec_value_id == e.currentTarget.dataset.id) {
              this.data.specList[i].spec_value[j].chose = 1
            } else {
              this.data.specList[i].spec_value[j].chose = 0
            }
          }
        } else {
          if (this.data.proInfo.spec_type == 1) {
          console.log(chose_spec_id)
          // 判断其余规格是否可选
          for (let j = 0; j < this.data.specList[i].spec_value.length; j++) {
            this.data.specList[i].spec_value[j].disabled = false
            let flag = true
            for (let k = 0; k < this.data.specList[i].spec_value[j].keys_result.length; k++) {
              if (this.data.specList[i].spec_value[j].keys_result[k].indexOf(chose_spec_id) != -1) {
                console.log("规格id存在数组")
                flag = false
                break
              }

            }
            // 判断此规格是否出现
            if (flag) {
              this.data.specList[i].spec_value[j].disabled = true
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
        for (let j = 0; j < this.data.specList[i].spec_value.length; j++) {
          if (this.data.specList[i].spec_value[j].chose == 1) {
            specs.push(this.data.specList[i].spec_value[j].spec_value_id)
            names.push(this.data.specList[i].spec_value[j].spec_value)
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
    console.log(this.data.proInfo)
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
  // getSpecValueID(key, data, type) {
  //   let attr_arrs = data
  //   let chose_key = key
  //   let show_type = type
  //   for (let i = 0; i < attr_arrs.length; i++) {
  //     for (let j = 0; j < attr_arrs[i].spec_value.length; j++) {
  //       if (attr_arrs[i].spec_value[j].id == chose_key) {
  //         if (show_type == "name") {
  //           return attr_arrs[i].spec_value[j].name
  //         } else if (show_type == "id") {
  //           return attr_arrs[i].spec_value[j].id
  //         } else if (show_type == "pid") {
  //           return attr_arrs[i].id
  //         }
  //       }
  //     }
  //   }
  // },
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
  getInfo: function () {
    var that = this
    util.queryRequest('/app/groupActivity/team', {
      group_id: that.data.group_id,
      team_id: that.data.team_id
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        // 结束时间戳
        clearInterval(that.data.time)
        let countTime = res.data.time
        if (countTime > 0) {
          // 倒计时未结束
          // 设置倒计时
          let sectimeList = util.countDown(countTime)
          that.setData({
            saleTime: sectimeList
          })
          that.data.time = setInterval(function () {
            countTime--
            if (countTime > 0) {
              sectimeList = util.countDown(countTime)
              that.setData({
                saleTime: sectimeList,
                countTime: countTime
              })
            } else {
              clearInterval(that.data.time)
              that.setData({
                countTime: 0
              })
            }
          }.bind(that), 1000)
          that.setData({
            time: that.data.time
          })
        } else {
          // 倒计时结束
          clearInterval(that.data.time)
          that.setData({
            countTime: 0
          })
        }
        // 拼团商品的倒计时
        // 整理商品详情
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
            key_name.push(res.data.attr_product[i].product_spec[j].spec_value)
            keys_list.push(res.data.attr_product[i].product_spec[j].spec_id + ':' + res.data.attr_product[i].product_spec[j].spec_value_id)
            static_keys_list.push({
              pid: res.data.attr_product[i].product_spec[j].spec_id,
              key: res.data.attr_product[i].product_spec[j].spec_value_id,
              keys_list: res.data.attr_product[i].product_spec[j].spec_id + ':' + res.data.attr_product[i].product_spec[j].spec_value_id
            })
          }
          res.data.attr_product[i].imgList = res.data.attr_product[i].img[0]
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
          for (let j = 0; j < res.data.attr_data[i].spec_value.length; j++) {
            res.data.attr_data[i].spec_value[j].chose = 0
            res.data.attr_data[i].spec_value[j].disabled = false
            res.data.attr_data[i].spec_value[j].keys_sort = res.data.attr_data[i].spec_id + ':' + res.data.attr_data[i].spec_value[j].spec_value_id
            keys.push(res.data.attr_data[i].spec_id + ':' + res.data.attr_data[i].spec_value[j].spec_value_id)
          }
          res.data.attr_data[i].specs_list = keys
          specs_list.push(keys)
        }
        // if (res.data.goods.spec_type == 1) {
        //   res.data.attr_data = that.addDeduplication(res.data.attr_data, specs_list, 'specs_list', 'spec_result', 1)
        //   console.log(res.data.attr_data,"打印数据吗")
        //   for (let i = 0; i < res.data.attr_data.length; i++) {
        //     for (let j = 0; j < res.data.attr_data[i].spec_value.length; j++) {
        //       let arr = JSON.parse(JSON.stringify(res.data.attr_data[i].spec_result))
        //       arr.unshift([res.data.attr_data[i].spec_value[j].keys_sort])
        //       res.data.attr_data[i].spec_value[j].keys_result = util.desCartes(arr)
        //       // 跟货品比对，筛选出每个属性里包含的货品
        //       res.data.attr_data[i].spec_value[j].keys_result = that.addDeduplication(res.data.attr_data[i].spec_value[j].keys_result, productList, 'keys_list', 'keys_result', 2)
        //     }
        //   }
        // }
        // 控制默认选中
        for (let i = 0; i < res.data.attr_data.length; i++) {
          for (let j = 0; j < res.data.attr_data[i].spec_value.length; j++) {
            res.data.attr_data[i].spec_value[j].disabled = false
            for (let k = 0; k < static_spec.length; k++) {
              if (static_spec[k].key == res.data.attr_data[i].spec_value[j].spec_value_id) {
                static_spec_list.push({
                  spec_id: static_spec[k],
                  key: j,
                  level: res.data.attr_data[i].level
                })
                res.data.attr_data[i].spec_value[j].chose = 1
              }
            }
          }
        }
        // if(res.data.goods.spec_type == 1){
        //   // 判断是否禁用
        //   for (let k = 0; k < static_spec.length; k++) {
        //     for (let i = 0; i < res.data.attr_data.length; i++) {
        //       if (static_spec[k].pid != res.data.attr_data[i].spec_id) {
        //         for (let j = 0; j < res.data.attr_data[i].spec_value.length; j++) {
        //           res.data.attr_data[i].spec_value[j].disabled = false
        //           // 判断另一个规格的是否禁用
        //           let flag = true
        //           for (let t = 0; t < res.data.attr_data[i].spec_value[j].keys_result.length; t++) {
        //             if (res.data.attr_data[i].spec_value[j].keys_result[t].indexOf(static_spec[k].keys_list) != -1) {
        //               flag = false
        //               break
        //             }
        //           }
        //           // 判断此规格是否出现
        //           if (flag) {
        //             res.data.attr_data[i].spec_value[j].disabled = true
        //             break
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
        console.log(res.data.attr_data,"最终获取的规格")
        res.data.goods.product_status = 1
        res.data.goods.imgList = res.data.goods.image
        res.data.goods.video = res.data.goods.video
        // 获取活动的相关信息
        that.setData({
          proInfo: res.data.goods,
          specList: res.data.attr_data,
          productsList: productList,
          choseNames:  static_spec_name.join(','),
          GroupOrder: res.data.group,
          groupPeople: res.data.member,
          GroupTeam: res.data.team,
          id: res.data.id
        })
        // 获取默认选中
        that.getProductInfo(specs.sort())
        console.log(res.data.discount)
      }
    })
  },
  //确认购买
  goBuy(e) {
    wx.navigateTo({
      url: '../payment/payment?type=5&goods_id=' + this.data.proInfo.id + '&product_id=' + this.data.proInfo.product_id + '&num=' + this.data.specNum + '&act_id=' + this.data.GroupOrder.id+'&team_id='+this.data.team_id,
    })
  },
  golink: function (e) {
    if (util.isLogin()) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  goindex: function (e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.link
    })
  },
  // 营期弹框出现
  choseCamp() {
    for (let j = 0; j < this.data.allDayList.length; j++) {
      if (this.data.staticInfo.camp_day == this.data.allDayList[j].camp_day) {
        this.data.dayList = this.data.allDayList[j].camp_time
      }
    }
    this.setData({
      showCamp: false,
      dayList: this.data.dayList,
      campId: this.data.staticInfo.camp_day,
      dayId: this.data.staticInfo.id
    })
  },
  // 关闭营期弹框
  closeCamp() {
    this.setData({
      showCamp: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shareUrl: this.data.shareUrl
    })
    if (options.type == 'pay') {
      this.setData({
        orderId: options.orderId,
        id: ''
      })
    } else {
      this.setData({
        group_id: options.group_id,
        team_id: options.team_id
      })
    }
    this.getList()
    this.getInfo()
    this.setData({
      scrollHeight:app.globalData.useWindowHeight - this.data.zan_height-56,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
     this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(this.data.shareUrl)
      console.log("获取最新的分享路径")
      let share_url = util.getFullUrl()
      console.log("获取用户信息", wx.getStorageSync('userInfo'))
      // 获取要分享出去的邀请码，判断是教官获取用户信息里的，如果是用户，先判断用户信息里的分享邀请码有没有，没有就取分享参数里的邀请码
      let invite_code = ''
      if (wx.getStorageSync('userInfo').invite_code != '' && wx.getStorageSync('userInfo').invite_code != undefined) {
        // 教官
        invite_code = wx.getStorageSync('userInfo').invite_code
        console.log('教官邀请码' + invite_code)
      } else {
        // 用户
        if (wx.getStorageSync('userInfo').share_invite_code != '' && wx.getStorageSync('userInfo').share_invite_code != null && wx.getStorageSync('userInfo').share_invite_code != undefined) {
          invite_code = wx.getStorageSync('userInfo').share_invite_code
        } else {
          invite_code = ''
        }
      }
      this.data.shareUrl = share_url + 'invite_code=' + invite_code
      this.setData({
        shareUrl: this.data.shareUrl
      })
      console.log(this.data.shareUrl)
      // 添加分享记录
      let that = this
      util.queryRequest('app/footOther/shareAdd', {
        c_id: that.data.staticInfo.curriculum_id,
        type: 0,
      }, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log("添加分享成功")
        }
      })
      // 来自页面内转发按钮
      return {
        title: '【有人@你】您的好友向你发来一个团购拼单邀请~',
        imageUrl: this.data.GroupOrder.image,
        path: this.data.shareUrl
      }
    }
  }
})