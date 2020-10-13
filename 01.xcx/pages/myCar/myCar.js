// pages/myCar/myCar.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miss_point: false,
    isShow: false,
    full_amount: 0.00,
    difference: 0.00,
    navNtn: 3,
    carList: [],
    recomList: [],
    apiUrl: app.globalData.apiUrl,
    isEdit: false,
    isChose: false,
    scoreAll: false,
    totalScore: 0,
    scoreNum: 0,
    priceAll: 0.00,
    discountAll: 0,
    allchose: 0,
    total: 0,
    total_amout: 0,
    recom_total: 0,
    carNum: false,
    proType: 'normal',
    // p: 1,
    // limit: 10,
    maxNum: 0,
    choseNum: 0,
    can_chose_pro: true
  },
  sureOrder: function() {
    var choseList = []
    for (var j = 0, len = this.data.carList.length; j < len; j++) {
      if (this.data.carList[j].checked) {
        choseList.push(this.data.carList[j].product_id)
      }
    }
    if (choseList.length <= 0) {
      wx.showToast({
        title: '请选择商品进行结算',
        icon: 'none',
        duration: 1000
      })
    } else {
      if (Number(this.data.totalScore) < Number(this.data.scoreNum)) {
        wx.showToast({
          title: '用户积分不足',
          icon: 'none',
          duration: 1000
        })
      } else {
        if (!wx.getStorageSync("isbind")) {
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
        } else {
          wx.navigateTo({
            url: '../sureOrder/sureOrder?addType=0&id=' + choseList.join(',') + '&selfPrice=' + (this.data.full_amount - this.data.difference).toFixed(2)
          })
        }

      }

    }

  },
  goLink: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  goPro: function(e) {
    const that = this
    wx.setStorageSync('carAmount', this.data.priceAll)
    wx.setStorageSync('difference', this.data.difference)
    wx.setStorageSync('fullAmount', this.data.full_amount)
    console.log(that.data.can_chose_pro)
    if (that.data.can_chose_pro){
      if (e.currentTarget.id != '') {
        that.data.can_chose_pro = false
        util.queryRequest('?m=item', {
          id: e.currentTarget.id
        }, 'GET', function (res) {
          if (res.isSuccess == false) {
            that.data.can_chose_pro = true
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.navigateTo({
              url: e.currentTarget.dataset.link
            })
          }
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.link
        })
      }
    }

  },
  delCar: function() {
    var that = this
    var choseList = []
    for (var j = 0, len = this.data.carList.length; j < len; j++) {
      if (this.data.carList[j].checked) {
        choseList.push(this.data.carList[j].product_id)
      }
    }
    if (choseList.length <= 0) {
      wx.showToast({
        title: '请选择要操作的商品',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除选中商品',
        success: function(res) {
          if (res.confirm) {
            util.queryRequest('?m=cart&a=remove', {
              pid: choseList.join(',')
            }, 'GET', function(res) {
              if (res.isSuccess) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                wx.setStorageSync("chosePro", [])
                that.setData({
                  allchose: 0,
                  priceAll: (0).toFixed(2),
                  difference: (0).toFixed(2),
                  scoreNum: 0,
                  choseNum: 0,
                  isChose: false
                })
                that.getList()
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

    }
  },
  addCar: function(e) {
    var that = this
    util.queryRequest('?m=cart&a=add', {
      pid: e.currentTarget.id,
      quantity: 1,
      checked: 0,
      deal_type: e.currentTarget.dataset.type
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (wx.getStorageSync("chosePro") == '') {
          wx.setStorageSync("chosePro", [e.currentTarget.id])
        } else {
          var carList = wx.getStorageSync("chosePro")
          for (var i = 0; i < carList.length; i++) {
            if (carList[i] == e.currentTarget.id) {
              break;
            }
          }
          if (i >= carList.length) {
            carList.push(e.currentTarget.id)
          }
          wx.setStorageSync("chosePro", carList)
        }
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
        that.setData({
          p: 1,
          scoreNum: 0,
          priceAll: 0
        })
        that.getList()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  checkAll: function(e) {
    var chosePro = []
    var flag = true
    for (var k = 0, len = this.data.carList.length; k < len; k++) {
      if (this.data.carList[k].checked == false) {
        flag = false
        break;
      }
    }
    if (!flag) {
      let sum = 0;
      let priceSum = 0;
      let discount = 0;
      let selfPrice = 0;
      for (var j = 0, len = this.data.carList.length; j < len; j++) {
        this.data.carList[j].checked = true
        chosePro.push(this.data.carList[j].product_id)
        sum += Number(this.data.carList[j].point) * this.data.carList[j].quantity * 100;
        priceSum += Number(this.data.carList[j].price_cart) * 10000 * this.data.carList[j].quantity;
        if (this.data.carList[j].goods.is_third == 0) {
          selfPrice += Number(this.data.carList[j].price_cart) * 10000 * this.data.carList[j].quantity;
          discount += ((Number(this.data.carList[j].price_market) - Number(this.data.carList[j].price_cart)) * 100 * this.data.carList[j].quantity / 100)
        }
      }
      console.log(selfPrice)
      this.data.priceAll = priceSum
      this.setData({
        carList: this.data.carList,
        choseNum: this.data.carList.length
      })
      for (var k = 0, len = this.data.carList.length; k < len; k++) {
        if (this.data.carList[k].checked == false) {
          this.data.allchose = 0
          this.data.isChose = false
          break;
        }
      }
      if (k >= this.data.carList.length) {
        this.data.allchose = 1
        this.data.isChose = true
        wx.setStorageSync("chosePro", chosePro);
      }
      if (!this.data.isEdit) {
        this.setData({
          scoreAll: true
        })
      }
      this.setData({
        allchose: this.data.allchose,
        isChose: this.data.isChose
      })
      if (this.data.allchose == 1) {
        this.data.priceAll = this.data.total_amout
      }
      this.setData({
        allchose: 1,
        scoreNum: sum / 100,
        priceAll: (priceSum / 10000).toFixed(2),
        difference: ((this.data.full_amount * 10000 - selfPrice) / 10000).toFixed(2),
        discountAll: discount.toFixed(2),
      })
      // if (this.data.isEdit && this.data.scoreNum > this.data.totalScore) {
      //   wx.showToast({
      //     title: '用户积分不足',
      //     icon: 'none',
      //     duration: 1000
      //   })
      // }
      if (this.data.isEdit == false && this.data.scoreNum > this.data.totalScore) {
        this.setData({
          miss_point: true
        })
      } else {
        this.setData({
          miss_point: false
        })
      }
    } else {
      for (var j = 0, len = this.data.carList.length; j < len; j++) {
        this.data.carList[j].checked = false
      }
      wx.setStorageSync("chosePro", '');
      this.setData({
        allchose: 0,
        priceAll: (0).toFixed(2),
        difference: (0).toFixed(2),
        scoreNum: 0,
        choseNum: 0,
        isChose: false,
        miss_point: false
      })
    }
    this.setData({
      carList: this.data.carList
    })
  },
  chosePro: function(e) {
    // 将选中的商品id塞进缓存
    wx.setStorageSync("chosePro", '');
    wx.setStorageSync("chosePro", e.detail.value);
    for (var j = 0, len = this.data.carList.length; j < len; j++) {
      this.data.carList[j].checked = false
    }
    if (e.detail.value.length != 0) {
      this.setData({
        isChose: true
      })
      let sum = 0;
      let priceSum = 0;
      let discount = 0;
      let selfPrice = 0;
      for (var i = 0; i < e.detail.value.length; i++) {
        for (var j = 0, len = this.data.carList.length; j < len; j++) {
          if (e.detail.value[i] == this.data.carList[j].product_id) {
            this.data.carList[j].checked = true
            sum += Number(this.data.carList[j].point) * this.data.carList[j].quantity * 100;
            priceSum += Number(this.data.carList[j].price_cart) * 10000 * this.data.carList[j].quantity;
            if (this.data.carList[j].goods.is_third == 0) {
              selfPrice += Number(this.data.carList[j].price_cart) * 10000 * this.data.carList[j].quantity;
              discount += ((Number(this.data.carList[j].price_market) - Number(this.data.carList[j].price_cart)) * 100 * this.data.carList[j].quantity / 100)
            }
          }
        }
      }
      this.data.priceAll = priceSum
      this.setData({
        carList: this.data.carList,
        choseNum: e.detail.value.length
      })
      for (var k = 0, len = this.data.carList.length; k < len; k++) {
        if (this.data.carList[k].checked == false) {
          this.data.allchose = 0
          break;
        }
      }
      if (k >= this.data.carList.length) {
        this.data.allchose = 1
      }
      if (!this.data.isEdit) {
        this.setData({
          scoreAll: true
        })
      }
      this.setData({
        allchose: this.data.allchose
      })
      if (this.data.allchose == 1) {
        this.data.priceAll = this.data.total_amout
      }
      this.setData({
        scoreNum: sum / 100,
        priceAll: (priceSum / 10000).toFixed(2),
        difference: ((this.data.full_amount * 10000 - selfPrice) / 10000).toFixed(2),
        discountAll: discount.toFixed(2),
      })
      // if (this.data.isEdit == false && this.data.scoreNum > this.data.totalScore) {
      //   wx.showToast({
      //     title: '用户积分不足',
      //     icon: 'none',
      //     duration: 1000
      //   })
      // }
      if (this.data.isEdit == false && this.data.scoreNum > this.data.totalScore) {
        this.setData({
          miss_point: true
        })
      } else {
        this.setData({
          miss_point: false
        })
      }
    } else {
      this.setData({
        scoreAll: false,
        allchose: 0,
        scoreNum: 0,
        priceAll: (0).toFixed(2),
        difference: (0).toFixed(2),
        choseNum: 0,
        carList: this.data.carList,
        isChose: false
      })
    }
  },
  edit: function() {
    this.setData({
      isEdit: !this.data.isEdit,
      scoreAll: false
    })
    for (var j = 0, len = this.data.carList.length; j < len; j++) {
      if (this.data.carList[j].checked) {
        this.data.scoreAll = true
      }
    }
    if (this.data.isEdit == false) {
      this.setData({
        scoreAll: this.data.scoreAll
      })
    }
  },
  addNum: function(event) {
    var num = 0
    let id = event.target.id;
    let value = parseInt(event.target.dataset.value);
    value++;
    for (var i = 0, len = this.data.carList.length; i < len; i++) {
      if (this.data.carList[i].product_id == event.target.id) {
        // this.data.scoreNum = Number(this.data.scoreNum) + Number(this.data.carList[i].point)
        // if (this.data.scoreNum > this.data.totalScore) {
        //   wx.showToast({
        //     title: '用户积分不足',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   this.data.carList[i].quantity = value - 1;
        // } else
        if (value > this.data.carList[i].store_usefull) {
          wx.showToast({
            title: '库存不足',
            icon: 'none',
            duration: 1000
          })
          this.data.carList[i].quantity = this.data.carList[i].store_usefull
        } else {
          this.data.carList[i].quantity = value
        }

        num = this.data.carList[i].quantity
      }
    }
    // 更新数据库配置
    this.upPro(event.target.id, num)
    // 当商品被选中，更改数量时更新总数
    this.upspec()
    this.setData({
      carList: this.data.carList
    })
  },
  lessNum: function(event) {
    let id = event.target.id;
    let value = parseInt(event.target.dataset.value);
    for (var i = 0, len = this.data.carList.length; i < len; i++) {
      if (this.data.carList[i].product_id == event.target.id) {
        if (value <= 1) {
          value = 1;
        } else {
          value--;
        }
        this.data.carList[i].quantity = value
      }
    }
    this.upPro(event.target.id, value)
    this.upspec()
    this.setData({
      carList: this.data.carList
    })
  },
  changeValue: function(e) {
    // this.upPro(e.target.id, e.detail.value)
    var num = ''
    for (var i = 0, len = this.data.carList.length; i < len; i++) {
      if (this.data.carList[i].product_id == e.target.id) {
        // 当前选中的总积分数减去当前商品的积分*数量，得出其他勾选商品的积分，再用总积分减去其他商品的积分，得出剩余可用来购买当前商品的积分，得出当前商品在积分足够的前提下得到的最大数
        // var other_point = this.data.scoreNum - (Number(this.data.carList[i].point) * Number(this.data.carList[i].quantity))
        // var this_point = this.data.totalScore - other_point
        // var this_num = Math.floor(this_point / Number(this.data.carList[i].point))
        if (e.detail.value <= 1) {
          this.data.carList[i].quantity = 1
        } else {
          // if (Number(e.detail.value) > this_num) {
          //   wx.showToast({
          //     title: '积分不足',
          //     icon: 'none',
          //     duration: 1000
          //   })
          //   // 判断最大积分数
          //   setTimeout(function() {
          //     this.data.carList[i].quantity = this_num
          //   }, 1000)
          // } else 
          if (Number(e.detail.value) > Number(this.data.carList[i].store_usefull)) {
            wx.showToast({
              title: '库存不足',
              icon: 'none',
              duration: 1000
            })
            // 判断最大库存数
            this.data.carList[i].quantity = this.data.carList[i].store_usefull
          } else {
            this.data.carList[i].quantity = e.detail.value
          }
        }
        num = this.data.carList[i].quantity
      }
    }
    this.upPro(e.target.id, num)
    this.upspec()
    this.setData({
      carList: this.data.carList
    })
  },
  upPro: function(id, num) {
    var that = this
    util.queryRequest('?m=cart&a=update', {
      pid: id,
      quantity: num
    }, 'GET', function(res) {
      if (res.isSuccess) {
        // if (that.data.scoreNum > res.member_point) {
        //   wx.showToast({
        //     title: '用户积分不足',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   for (var i = 0; i < that.data.carList.length; i++) {
        //     if (that.data.carList[i].product_id == id) {
        //       that.data.carList[i].quantity = num - 1
        //     }
        //   }
        //   that.setData({
        //     carList: that.data.carList
        //   })
        // }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        if (res.num != undefined) {
          that.setData({
            maxNum: res.num
          })
        } else {
          for (var i = 0; i < that.data.carList.length; i++) {
            if (that.data.carList[i].product_id == id) {
              that.data.carList[i].quantity = num - 1
            }
          }
          that.setData({
            carList: that.data.carList
          })
          // that.upPro(id, num - 1)
        }
      }
    })
  },
  upspec: function() {
    let sum = 0;
    let priceSum = 0;
    let discount = 0;
    let selfPrice = 0;
    for (var j = 0, len = this.data.carList.length; j < len; j++) {
      if (this.data.carList[j].checked) {
        sum += Number(this.data.carList[j].point) * this.data.carList[j].quantity * 100;
        priceSum += Number(this.data.carList[j].price_cart) * 10000 * this.data.carList[j].quantity;
        if (this.data.carList[j].goods.is_third == 0) {
          selfPrice += Number(this.data.carList[j].price_cart) * 10000 * this.data.carList[j].quantity;
          discount += ((Number(this.data.carList[j].price_market) - Number(this.data.carList[j].price_cart)) * 100 * this.data.carList[j].quantity / 100)
        }
      }
    }
    this.setData({
      scoreNum: sum / 100,
      priceAll: (priceSum / 10000).toFixed(2),
      difference: ((this.data.full_amount * 10000 - selfPrice) / 10000).toFixed(2),
      discountAll: discount.toFixed(2)
    })
    if (this.data.isEdit == false && this.data.scoreNum > this.data.totalScore) {
      this.setData({
        miss_point: true
      })
    } else {
      this.setData({
        miss_point: false
      })
    }
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=cart&a=cart', {}, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        if (res.data.rows == false) {
          that.setData({
            carList: [],
            total: res.data.rows_total,
            carNum: false,
            total_amout: res.data.rows_total,
            full_amount: res.data.free_freight,
            choseNum: 0
          })
          wx.removeTabBarBadge({
            index: 3
          })
          // wx.pageScrollTo({
          //   scrollTop: 0,
          //   duration: 1
          // })
        }
        if (res.data.rows.length > 0) {
          for (var j = 0; j < res.data.rows.length; j++) {
            res.data.rows[j].checked = false
          }
          var choseList = wx.getStorageSync("chosePro")
          app.globalData.carNum = res.data.rows_total
          if (res.data.rows_total == 0) {
            wx.removeTabBarBadge({
              index: 3
            })
          } else {
            wx.setTabBarBadge({
              index: 3,
              text: res.data.rows_total
            })
          }
          let sum = 0;
          let priceSum = 0;
          let discount = 0;
          let selfPrice = 0;
          if (choseList.length > 0) {
            for (var i = 0; i < choseList.length; i++) {
              for (var j = 0; j < res.data.rows.length; j++) {
                if (choseList[i] == res.data.rows[j].product_id) {
                  res.data.rows[j].checked = true
                  sum += Number(res.data.rows[j].point) * res.data.rows[j].quantity * 100;
                  priceSum += Number(res.data.rows[j].price_cart) * 10000 * res.data.rows[j].quantity;
                  if (res.data.rows[j].goods.is_third == 0) {
                    selfPrice += Number(res.data.rows[j].price_cart) * 10000 * res.data.rows[j].quantity;
                    discount += ((Number(res.data.rows[j].price_market) - Number(res.data.rows[j].price_cart)) * 100 * res.data.rows[j].quantity / 100)
                  }
                }
              }
            }
            if (that.data.isEdit == false && (sum / 100) > res.data.member_point) {
              that.data.miss_point = true
            } else {
              that.data.miss_point = false
            }
            that.setData({
              isChose: true,
              miss_point: that.data.miss_point
            })
          }
          that.setData({
            full_amount: res.data.free_freight,
            carList: res.data.rows,
            total: res.data.rows_total,
            carNum: true,
            total_amout: res.data.rows_total,
            scoreNum: sum / 100,
            priceAll: (priceSum / 10000).toFixed(2),
            difference: ((res.data.free_freight * 10000 - selfPrice) / 10000).toFixed(2),
            discountAll: discount.toFixed(2),
            choseNum: choseList.length,
            totalScore: res.data.member_point
          })
          if (choseList.length == res.data.rows.length) {
            that.setData({
              allchose: 1,
              isChose: true
            })
          }
        } else {
          that.setData({
            carNum: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.showTabBar()
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f7f7f7',
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
    // this.dialog = this.selectComponent("#reload");
    wx.showLoading({
      title: '加载中',
    })
    if (util.isLogin()) {
      this.setData({
        p: 1
      })
      this.setData({
        allchose: 0,
        scoreNum: 0,
        priceAll: (0).toFixed(2),
        difference: (0).toFixed(2),
        choseNum: 0,
        isChose: false
      })
      this.data.can_chose_pro = true
      this.getList()
      var that = this
      //查询购物车推荐商品
      util.queryRequest('?m=list&a=cart_recommend', {
        type: 1
      }, 'GET', function(res) {
        if (res.isSuccess) {
          that.setData({
            recomList: res.data,
            recom_total: res.total
          })
        }
      })

      // 查询是否有新消息
      // util.queryRequest('?m=myinfo&a=check_unread', {}, 'POST', function(res) {
      //   if (res.isSuccess) {
      //     that.setData({
      //       newNews: true
      //     })
      //     app.globalData.news = true
      //     wx.showTabBarRedDot({
      //       index: 4
      //     })
      //   } else {
      //     that.setData({
      //       newNews: false
      //     })
      //     wx.hideTabBarRedDot({
      //       index: 4
      //     })
      //     app.globalData.news = false
      //   }
      // })
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
    // var that = this
    // util.queryRequest('?m=cart&a=cart', {
    //   p: ++that.data.p,
    //   limit: that.data.limit
    // }, 'GET', function(res) {
    //   if (res.isSuccess) {
    //     if (res.data.rows.length > 0) {
    //       for (var j = 0; j < res.data.rows.length; j++) {
    //         res.data.rows[j].checked = false
    //       }
    //       that.data.carList = that.data.carList.concat(res.data.rows)
    //       that.setData({
    //         carList: that.data.carList,
    //         total: res.data.rows_total,
    //         carNum: true,
    //         total_amout: res.data.total
    //       })
    //     } else {
    //       carNum: false
    //     }
    //   }
    // })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})