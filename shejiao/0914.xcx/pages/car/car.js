// pages/car/car.js

let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carBg: app.globalData.staticUrl + 'my/car_top_bg.png',
    navHeight: app.globalData.navHeight, // 导航栏高度
    headBg: 'transparent',
    headColor: '#fff',
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    tabbarHeight: app.globalData.tabbarHeight,
    allchose: 0, // 是否全选
    showModel: false,
    discountShow: false, // 优惠信息
    car_ids: '',// 购物车所有的商品id的集合
    couList: [],
    sendByPost: {},
    discountList: [{
      name: '满30包邮'
      }
    ], //优惠信息列表
    filePath: app.globalData.fileUrl,
    // 记录当前偏移量
    currentX: 0,
    isLogin: getApp().globalData.isLogin,
    // 用户是否在触摸
    isTouchMove: false,
    proList: [],
    check_ids: [], // 选中的货号id
    check_car_ids: [], // 选中的购物车记录id
    product_nums: 0,
    carAmount: 0,
    isScroll: false,
    editCar: false,
    hasData: false,
    is_end: false,
    recommendList: [],
    failureList: [],
    isTop: true,
  },
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
  showDiscount() {
    this.setData({
      showModel: true,
      discountShow: true,
    })
  },
  hidenModel() {
    this.setData({
      showModel: false,
      discountShow: false,
    })
  },
    // 获取商品相关的优惠券
    getCoupon(){
      let that = this
      util.queryRequest('/app/coupon/getGoodsCouponShop', {
        goods_id: this.data.car_ids,
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
    goLink: util.throttle(function (event) {
      console.log(event)
      wx.navigateTo({
        url: event[0].currentTarget.dataset.link
      })
    }),
    // 领取优惠券
    getCou:util.throttle(function(e){
      let that = this
      if(e[0].currentTarget.dataset.get==1){
        // wx.showToast({
        //   title: '您已经领过啦~',
        //   icon: 'none',
        //   duration: 1000
        // })
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
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  edit() {
    console.log('设置编辑')
    this.setData({
      editCar: !this.data.editCar
    })
  },
  goBuy(e) {
    let cart_id = this.data.check_car_ids.join(",")
    wx.navigateTo({
      url: '../payment/payment?type=-1&cart_id=' + cart_id
    })
  },
  handleMovableChange(e) {
    let flag = false
    if (
      e.detail.source === 'touch' ||
      e.detail.source === 'touch-out-of-bounds'
    ) {
      flag = true;
    } else {
      flag = false;
    }
    this.setData({
      isTouchMove: flag,
      currentX: e.detail.x
    })
  },
  handleTouchend(idx, e) {
    if (this.data.isTouchMove) {
      if (this.data.currentX < -46) {
        this.data.proList[idx].x = -92;
        this.setData({
          proList: this.data.proList
        });
      } else {
        this.data.proList[idx].x = 0;
        this.data.setData({
          proList: this.data.proList
        });
      }
    }
  },
  handleTouchestart(e) {},
  // 单个删除购物车货品
  handleDelete(event) {
    console.log(event)
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success(res) {
        if (res.confirm) {
          let car_id = event.currentTarget.dataset.carid
          let shop_id = event.currentTarget.dataset.shopid
          let index = event.currentTarget.dataset.index
          wx.showLoading({
            title: '处理中',
          })
          let prolist = that.data.proList
          for (let i = 0; i < prolist.length; i++) {
            if (shop_id == prolist[i].id) {
              // 找到对应的供应商
              prolist[i].pros.splice(index, 1)
              if(prolist[i].pros.length==0){
                prolist.splice(i, 1)
              }
            }
          }
          util.queryRequest('/app/cart/remove', {
            id: car_id
          }, 'POST').then(function (res) {
            wx.hideLoading()
            if (res.code == 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(() => {
                that.setData({
                  proList: prolist
                })
                // 存储选中id
                that.saveCheckIds(prolist)
                // 计算选中总金额
                that.calcCarAmount(prolist)
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 多选删除
  removeCars(){
    const that=this
    util.queryRequest('/app/cart/remove', {
      id: this.data.check_car_ids
    }, 'POST').then(function (res) {
      wx.hideLoading()
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          that.getCarList()
        }, 1000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 查找修改的哪一件货品
  findPro(shop_id, pro_id) {
    let prolist = this.data.proList
    let findpro = {}
    for (let i = 0; i < prolist.length; i++) {
      if (shop_id == prolist[i].id) {
        // 找到对应的供应商
        for (let j = 0; j < prolist[i].pros.length; j++) {
          if (prolist[i].pros[j].product_id == pro_id) {
            // 找到对应的数据
            findpro = prolist[i].pros[j]
          }
        }
      }
    }
    return findpro
  },
  // 增加数量
  addNum:util.throttle(function (event){
    console.log(event)
    let that = this
    // 查找对应修改的数据
    let findpro = {}
    let prolist = this.data.proList
    let shop_id = event[0].currentTarget.dataset.shopid
    let product_id = event[0].currentTarget.dataset.proid
    findpro = this.findPro(shop_id, product_id)
    console.log(findpro)
    // let id = event[0].target.id;
    // let value = parseInt(findpro.shops_num);
      findpro.shops_num++;
      if(findpro.shops_num>99){
        findpro.shops_num=99
        wx.showToast({
          title:'该商品最多只能购买99件',
          icon: 'none',
          duration: 1000
        })
        setTimeout(() => {
          that.setData({
            proList: prolist
          })
          that.calcCarAmount(prolist)
        }, 1000)
      }else{
        for (let i = 0; i < prolist.length; i++) {
          if (shop_id == prolist[i].id) {
            // 找到对应的供应商
            for (let j = 0; j < prolist[i].pros.length; j++) {
              if (prolist[i].pros[j].product_id == product_id) {
                // 找到对应的数据
                prolist[i].pros[j] = findpro
              }
            }
          }
        }
        let info = {
          goods_id: findpro.goods_id,
          product_id: findpro.product_id,
          shops_num: 1,
        }
        wx.showLoading({
          title: '处理中',
        })
        util.queryRequest('/app/cart/add', info, 'POST').then(function (res) {
          wx.hideLoading()
          if (res.code == 200) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            })
            findpro.shops_num=res.data.shops_num
            setTimeout(() => {
              that.setData({
                proList: prolist
              })
              that.calcCarAmount(prolist)
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
  }),
  // input改变数量
  changeValue: function (event) {
    console.log(event)
    let that = this
    // 查找对应修改的数据
    let findpro = {}
    let prolist = this.data.proList
    let shop_id = event.currentTarget.dataset.shopid
    let product_id = event.currentTarget.dataset.proid
    findpro = this.findPro(shop_id, product_id)
    console.log(findpro)
    let id = event.target.id;
    let value = parseInt(event.detail.value);
      // value++;
      if(event.detail.value!==''){
        if(value>99){
          findpro.shops_num=99
          wx.showToast({
            title:'该商品最多只能购买99件',
            icon: 'none',
            duration: 1000
          })
          setTimeout(() => {
            that.setData({
              proList: prolist
            })
            that.calcCarAmount(prolist)
          }, 1000)
        }else{
           if(value==0){
            findpro.shops_num=1
           }else{
            findpro.shops_num = value
           }
            for (let i = 0; i < prolist.length; i++) {
              if (shop_id == prolist[i].id) {
                // 找到对应的供应商
                for (let j = 0; j < prolist[i].pros.length; j++) {
                  if (prolist[i].pros[j].product_id == product_id) {
                    // 找到对应的数据
                    prolist[i].pros[j] = findpro
                  }
                }
              }
            }
            let info = {
              goods_id: findpro.goods_id,
              product_id: findpro.product_id,
              shops_num: findpro.shops_num,
            }
            if(value!=0){
              wx.showLoading({
                title: '处理中',
              })
            }
            util.queryRequest('/app/cart/edit', info, 'POST').then(function (res) {
              wx.hideLoading()
              if (res.code == 200) {
                if(value!=0){
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1000
                  })
                }
                setTimeout(() => {
                  that.setData({
                    proList: prolist
                  })
                  that.calcCarAmount(prolist)
                }, 1000)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
                findpro.shops_num=1
                setTimeout(() => {
                  that.setData({
                    proList: prolist
                  })
                  that.calcCarAmount(prolist)
                }, 1000)
              }
            })
  
        }
      }else{
        findpro.shops_num=1
        setTimeout(() => {
          that.setData({
            proList: prolist
          })
          that.calcCarAmount(prolist)
        }, 1000)
      }
  },
  // 减少数量
  lessNum:util.throttle(function (event){
    console.log(event)
    let that = this
    // 查找对应修改的数据
    let findpro = {}
    let prolist = this.data.proList
    let shop_id = event[0].currentTarget.dataset.shopid
    let product_id = event[0].currentTarget.dataset.proid
    findpro = this.findPro(shop_id, product_id)
    console.log(findpro)
    let id = event[0].target.id;
    let value = parseInt(findpro.shops_num);
    if (value <= 1) {
      wx.showToast({
        title: '不能再减少啦~',
        icon: 'none',
        duration: 1000
      })
    } else {
      findpro.shops_num--;
      for (let i = 0; i < prolist.length; i++) {
        if (shop_id == prolist[i].id) {
          // 找到对应的供应商
          for (let j = 0; j < prolist[i].pros.length; j++) {
            if (prolist[i].pros[j].product_id == product_id) {
              // 找到对应的数据
              prolist[i].pros[j] = findpro
            }
          }
        }
      }
      let info = {
        goods_id: findpro.goods_id,
        product_id: findpro.product_id,
        shops_num: 1,
      }
      wx.showLoading({
        title: '处理中',
      })
      util.queryRequest('/app/cart/reduce', info, 'POST').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            that.setData({
              proList: prolist
            })
            that.calcCarAmount(prolist)
          }, 1000)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  }),
  // 选择同一供应商的商品
  choseShop(event) {
    console.log(event)
    console.log("选择同一供应商的商品")
    console.log(this.data.proList)
    let prolist = this.data.proList
    // 选中的店铺id
    console.log(event.detail.value)
    let choseShopId = event.currentTarget.id
    for (let j = 0; j < prolist.length; j++) {
      if (prolist[j].id == choseShopId) {
        // 先将选中值取反
        prolist[j].shopCheck = !prolist[j].shopCheck
        for (let k = 0; k < prolist[j].pros.length; k++) {
          prolist[j].pros[k].checked = prolist[j].shopCheck
        }
      }
    }
    // 存储选中id
    this.saveCheckIds(prolist)
    // 计算选中总金额
    this.calcCarAmount(prolist)
    this.setData({
      proList: prolist
    })
    console.log("111")
  },
  // 选择多个商品
  chosePro(event) {
    let prolist = this.data.proList
    console.log("选择多个商品")
    console.log(event)
    console.log(event.detail.value) // 所有选中的货品id
    let ids = event.detail.value
    // 重置购物车选择
    for (let i = 0; i < prolist.length; i++) {
      prolist[i].shopCheck = false
      for (let j = 0; j < prolist[i].pros.length; j++) {
        prolist[i].pros[j].checked = false
      }
    }
    if (ids.length > 0) {
      for (let k = 0; k < ids.length; k++) {
        for (let i = 0; i < prolist.length; i++) {
          let shop_all = 0
          for (let j = 0; j < prolist[i].pros.length; j++) {
            if (ids[k] == prolist[i].pros[j].product_id) {
              prolist[i].pros[j].checked = true
            }
            if (prolist[i].pros[j].checked) {
              shop_all++
            }
          }
          if (shop_all == prolist[i].pro_length) {
            prolist[i].shopCheck = true
          }
        }
      }
    } else {
      for (let i = 0; i < prolist.length; i++) {
        prolist[i].shopCheck = false
        for (let j = 0; j < prolist[i].pros.length; j++) {
          prolist[i].pros[j].checked = false
        }
      }
    }
    console.log(prolist)
    // 存储选中id
    this.saveCheckIds(prolist)
    // 计算选中总金额
    this.calcCarAmount(prolist)
    this.setData({
      proList: prolist
    })
  },
  // 全选商品
  choseAll(event) {
    let prolist = this.data.proList
    console.log("全选商品")
    console.log(event)
    console.log(event.detail.value)
    if (event.detail.value.length > 0) {
      // 全选被选中
      for (let i = 0; i < prolist.length; i++) {
        prolist[i].shopCheck = true
        for (let j = 0; j < prolist[i].pros.length; j++) {
          prolist[i].pros[j].checked = true
        }
      }
    } else {
      // 全选取消
      for (let i = 0; i < prolist.length; i++) {
        prolist[i].shopCheck = false
        for (let j = 0; j < prolist[i].pros.length; j++) {
          prolist[i].pros[j].checked = false
        }
      }
    }
    // 存储选中id
    this.saveCheckIds(prolist)
    // 计算选中总金额
    this.calcCarAmount(prolist)
    this.setData({
      proList: prolist
    })
  },
  // 获取选中商品的货号
  saveCheckIds(list) {
    console.log(list)
    let choseIds = []
    let check_car_ids = []
    this.data.product_nums=0
    console.log(list,"删除")
    for (let i = 0; i < list.length; i++) {
      this.data.product_nums += list[i].pros.length
      for (let j = 0; j < list[i].pros.length; j++) {
        if (list[i].pros[j].checked) {
          choseIds.push(list[i].pros[j].product_id)
          check_car_ids.push(list[i].pros[j].id)
        }
      }
    }
    let allchose = false
    if (choseIds.length == this.data.product_nums&&choseIds.length!=0) {
      allchose = true
    }
    // 判断选中的长度是否等于全部商品，是，全选按钮高亮
    console.log(choseIds)
    this.setData({
      check_ids: choseIds,
      allchose: allchose,
      check_car_ids: check_car_ids
    })
  },
  // 计算选中商品的总价
  calcCarAmount(list) {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].pros.length; j++) {
        if (list[i].pros[j].checked) {
          sum += (list[i].pros[j].buy_price * list[i].pros[j].shops_num) // 累加总金额
        }
      }
    }
    this.setData({
      carAmount: sum
    })
  },
  // 获取购物车列表
  getCarList() {
    let that = this
    util.queryRequest('/app/cart/index', {}, "GET").then(function (res) {
      console.log(res)
      if (res.code == 200) {
        if (res.data.supplier.length > 0) {
          // 重新组合列表数据
          let prolist = []
          // that.data.car_ids = 
          for (let i in res.data.supplier) {
            prolist.push({
              id: res.data.supplier[i].id,
              shopinfo: {id:res.data.supplier[i].id,name:res.data.supplier[i].name,is_self:res.data.supplier[i].is_self},
              shopCheck: false,
              pros: res.data.supplier[i].goods,
              car_ids:res.data.supplier[i].goods.map(item=>{
                return item.goods_id
              }).join(','),
              pro_length: res.data.supplier[i].goods.length
            })
          }
          
          console.log(prolist)
          that.data.product_nums = 0
          for (let i = 0; i < prolist.length; i++) {
            that.data.product_nums += prolist[i].pros.length
            that.data.car_ids += prolist[i].car_ids
          }
          // 从缓存里取已选中数量，修改check的值

          console.log(prolist)
          that.setData({
            car_ids: that.data.car_ids,
            proList: prolist,
            failureList:res.data.invalid,
            product_nums: that.data.product_nums,
            showSkeleton: false,
            hasData: true,
            is_end: true
          })
          that.getCoupon()
        } else {
          that.setData({
            proList: [],
            product_nums: 0,
            showSkeleton: false,
            hasData: false,
            is_end: true
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
  },
  // 获取购物车推荐列表
  getCarRecommend() {
    let that = this
    util.queryRequest('/app/cart/recommend', {}, "GET").then(function (res) {
      console.log(res)
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          recommendList: res.data.rows.rows
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      // 如果用户登录就获取购物车信息
      this.getCarList()
    } else {
      this.setData({
        headBg: '#fff',
        headColor: '#000',
      })
      setTimeout(() => {
        this.setData({
          showSkeleton: false,
        })
      }, 100)
    }
    this.getCarRecommend()
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
    console.log(this.data.proList)
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    if(wx.getStorageInfoSync('choseAdd')!=undefined&&wx.getStorageInfoSync('choseAdd')!=''){
      wx.removeStorageSync('choseAdd')
    }
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if(e.scrollTop == 0&&this.data.isScroll){
      this.setData({
        isScroll: false,
        headBg: 'transparent',
        headColor: '#fff',
      })
    }
    if(e.scrollTop > 0&&!this.data.isScroll){
      this.setData({
        isScroll: true,
        headBg: '#fff',
        headColor: '#000',
      })
    }
    if (e.scrollTop > 140) {
      if (this.data.isTop == true) {
        console.log("显示返回顶部")
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 140) {
      if (this.data.isTop == false) {
        console.log("隐藏返回顶部")
        this.setData({
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
  pullLoad: util.throttle(function () {
    this.setData({
      page: 1,
      proList: [],
      failureList: [],
      loading: true
    })
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      // 如果用户登录就获取购物车信息
      this.setData({
        headBg: 'transparent',
        headColor: '#fff',
      })
      this.getCarList()
    } else {
      this.setData({
        headBg: '#fff',
        headColor: '#000',
      })
      setTimeout(() => {
        this.setData({
          showSkeleton: false,
          loading: false
        })
      }, 100)
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  }, 1500),
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pullLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})