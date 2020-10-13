// pages/myFootprint/myFootprint.js
let util = require('../../utils/util.js')
var app = getApp()
import initCalendar, {
  getSelectedDay,
  jumpToToday,
  tapDayItem
} from '../../template/calendar/index';
const conf = {
  data: {
    isShow: false,
    apiUrl: app.globalData.apiUrl,
    footList: [],
    // date_show: false,
    year: new Date().getFullYear(),
    mon: new Date().getMonth() + 1,
    day: new Date().getDate(),
    isEdit: false,
    total: 0,
    delList: [],
    page: 1,
    pagesize: 100,
    allchose: 0,
    is_return:false
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  goPro: function(e) {
    if (e.currentTarget.dataset.type == '9') {
      wx.navigateTo({
        url: '../fruitDetail/fruitDetail?type=fruits&id=' + e.currentTarget.id
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  edit: function() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  checkAll: function() {
    this.data.delList = []
    if (this.data.allchose == 0) {
      for (var j = 0; j < this.data.footList.length; j++) {
        this.data.footList[j].checked = true
        this.data.delList.push(this.data.footList[j].id)
      }
      this.setData({
        allchose: 1
      })
    } else {
      for (var j = 0; j < this.data.footList.length; j++) {
        this.data.footList[j].checked = false
      }
      this.setData({
        allchose: 0
      })
    }
    this.setData({
      footList: this.data.footList,
      delList: this.data.delList
    })
  },
  chosefoot: function(e) {
    for (var j = 0; j < this.data.footList.length; j++) {
      this.data.footList[j].checked = false
    }
    this.data.delList = []
    this.setData({
      delList: e.detail.value
    })
    if (e.detail.value.length !== 0) {
      for (var i = 0; i < e.detail.value.length; i++) {
        for (var j = 0; j < this.data.footList.length; j++) {
          if (e.detail.value[i] == this.data.footList[j].id) {
            this.data.footList[j].checked = true
          }
        }
      }
      this.setData({
        footList: this.data.footList
      })
    }
    for (var k = 0; k < this.data.footList.length; k++) {
      if (this.data.footList[k].checked == false) {
        this.data.allchose = 0
        break;
      }
    }
    if (k >= this.data.footList.length) {
      this.data.allchose = 1
    }
    this.setData({
      allchose: this.data.allchose
    })
  },
  delFoot: function() {
    var that = this
    if (that.data.delList.length <= 0) {
      wx.showToast({
        title: '请选择要操作的数据',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除选中内容',
        success: function(res) {
          if (res.confirm) {
            util.queryRequest('?m=myinfo&a=my_footprint_remove', {
              ids: that.data.delList
            }, 'POST', function(res) {
              if (res.isSuccess) {
                console.log(res)
                that.getFootList(that.data.year, that.data.mon, that.data.day)
                wx.showToast({
                  title: res.msg,
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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  getFootList: function(year, mon, day) {
    wx.hideLoading()
    //向后台发起请求，请求选中当天的数据
    var that = this
    util.queryRequest('?m=myinfo&a=my_footprint', {
      month: year + '-' + (mon < 10 ? '0' + mon : mon),
      date: day == undefined ? '' : (year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day)),
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      // that.setData({
      //   isShow: true
      // })
      // wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          total: res.data.foot_list.total,
          footList: res.data.foot_list.rows
        })
      }
    })
  },
  getDaysList: function() {
    this.setData({
      isShow: true
    })
    wx.hideLoading()
    initCalendar({
      // multi: true, // 是否开启多选,
      // disablePastDay: true, // 是否禁选过去日期
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        console.log('当前点击的日期', currentSelect);
        this.setData({
          year: currentSelect.year,
          mon: currentSelect.month,
          day: currentSelect.day
        })
        this.getFootList(currentSelect.year, currentSelect.month, currentSelect.day)
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      // onTapDay(currentSelect, event) {
      //   console.log(currentSelect);
      //   console.log(event);
      // },
    });
    // var list = wx.getStorageSync('footList')
    // console.log(wx.getStorageSync('footList'))
    // if (wx.getStorageSync('footList') != '') {
    //   this.setData({
    //     total: list.total,
    //     footList: list.rows
    //   })
    // }

  },
  onLoad: function() {
    // this.dialog = this.selectComponent("#reload");
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    // this.getFootList(y,m,d)
    // util.queryRequest('?m=myinfo&a=my_footprint', {
    //   month: y + '-' + (m < 10 ? '0' + m : m),
    //   date: y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
    // }, 'POST', function(res) {
    //   that.setData({
    //     isShow: true
    //   })
    //   wx.hideLoading()
    //   if (res.isSuccess) {
    //     that.setData({
    //       total: res.data.foot_list.total,
    //       footList: res.data.foot_list.rows
    //     })
    //   }
    // })
    wx.setNavigationBarTitle({
      title: '我的足迹'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
  },
  onShow: function() {
    if (this.data.is_return == false){
      this.getDaysList()
    }
  },
  onHide:function(){
    this.data.is_return = true
  },
  onReady: function() {},
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   var page = getCurrentPages()[getCurrentPages().length - 1]
  //   this.onLoad(page.options)
  // },
  /**
   * 跳转至今天
   */
  jump() {
    jumpToToday();
  }
};
Page(conf)