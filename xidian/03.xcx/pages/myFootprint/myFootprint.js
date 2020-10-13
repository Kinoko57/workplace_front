// pages/myFootprint/myFootprint.js
let util = require('../../utils/util.js')
var app = getApp()
import initCalendar, {
  getSelectedDay,
  jumpToToday,
  tapDayItem,
  openData
} from '../../components/calendar/index';
const conf = {
  data: {
    actionList:[
      {id:'0', actionIcon:'iconqingkong',actionTips:'删除'},
      {id:'1',actionIcon:'iconcoll',actionTips:'点赞'},
    ],
    navHeight: app.globalData.navHeight,
    staticUrl: app.globalData.staticUrl,
    isShow: false,
    apiUrl: app.globalData.apiUrl,
    is_iphonex: app.globalData.isiPhoneX,
    footList: [],
    date_show: false,
    year: new Date().getFullYear(),
    mon: new Date().getMonth() + 1,
    day: new Date().getDate(),
    activeWeek: 1,
    isEdit: false,
    chose_id: '',
    chose_cid: '',
    chose_index: '',
    total: 0,
    delList: [],
    page: 1,
    size: 20,
    page_num: 0,
    hasData: true,
    is_end: false,
    allchose: 0,
    is_return:false,
    isTop: true, // 返回顶部
    last_time:'', // 标识当前接口数据的最后一天
    last_index: 0
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  dataShow:function(){
    this.setData({
      date_show: !this.data.date_show
    })
    this.openData()
  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  // goPro: function(e) {
  //   if(this.data.isEdit == false){
  //     wx.navigateTo({
  //       url: e.currentTarget.dataset.link
  //     })
  //   }
  // },
  goProDetail: util.throttle(function (e) {
    console.log(e[0])
    const that = this
    if (that.data.isEdit == false) {
      if (e[0].currentTarget.id != '') {
        let type = e[0].currentTarget.dataset.type
        let id = e[0].currentTarget.id
        if (type == 0) {
          wx.navigateTo({
            url: '/pages/proDetail/proDetail?id=' + id
          })
        } else {
          wx.navigateTo({
            url: '/pages/groupDetail/groupDetail?id=' + id
          })
        }
      }
    }
  }),
  edit: function() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  checkAll: function() {
    this.data.delList = []
    let list = this.data.footList
    if (this.data.allchose == 0) {
      for (var i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
          list[i][j].checked = true
          this.data.delList.push(list[i][j].id)
        }
      }
      this.setData({
        allchose: 1
      })
    } else {
      for (var i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
          list[i][j].checked = false
        }
      }
      this.setData({
        allchose: 0
      })
    }
    this.setData({
      footList: list,
      delList: this.data.delList
    })
  },
  chosefoot: function(e) {
    console.log(e)
    console.log(e.detail.value)
    let list = this.data.footList
    for (var i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].length;j++){
        list[i][j].checked = false
      }
    }
    this.data.delList = []
    this.setData({
      delList: e.detail.value
    })
    if (e.detail.value.length !== 0) {
      for (var k = 0; k < e.detail.value.length; k++) {
        for (var i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].length; j++) {
            if (e.detail.value[k] == list[i][j].id ){
              list[i][j].checked = true
            }
          }
        }
      }
      this.setData({
        footList: list
      })
    }
    for (var i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].length; j++) {
        if (list[i][j].checked == false) {
          this.data.allchose = 0
          break;
        }
      }
    }
    if (k >= this.data.total) {
      this.data.allchose = 1
    }
    this.setData({
      allchose: this.data.allchose
    })
  },
  delFoot: function() {
    console.log(this.data.delList)
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
            util.queryRequest('app/footOther/cancelFoot', {
              id: that.data.delList.join(",")
            }, 'GET').then(function(res) {
              if (res.code == 200) {
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
    that.data.page = 1
    util.queryRequest('app/footOther/footIndex', {
      month: parseInt(new Date(year + '/' + (mon < 10 ? '0' + mon : mon) + '/ 01').getTime() / 1000) ,
      time: day == undefined ? '' : parseInt(new Date((year + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (day < 10 ? '0' + day : day))).getTime() / 1000),
      page: that.data.page,
      size: that.data.size
    }, 'GET').then(function(res) {
      if (res.code == 200) {
        that.setData({
          year: year,
          month: mon,
          day: day,
          footList:[],
          total: 0,
          page_num: 0,
          is_end: true,
          hasData: false
        })
        let currentpage = that.data.page - 1
        // 处理足迹数据
        let last_time = ''
        let info = res.data.rows
        for (let i = 0; i < info.length; i++) {
          info[i].last_time = false
          info[i].show_last_time = false
          info[i].show_right = true
          info[i].time = info[i].year + '-' + info[i].month + '-' + info[i].day
        }
        let k = 0
        let flag = false
        for (let i = 0; i < info.length; i++) {
          if (last_time != info[i].time) {
            info[i].last_time = true
            info[i].show_last_time = true
            last_time = info[i].time
            flag = true
            k++
          } else {
            if (flag) {
              k = 1
              flag = false
            }
            if (k < 3) {
              info[i].show_last_time = true
            }
            if ((k + 1) % 3 == 0) {
              info[i].show_right = false
            }
            k++
          }
        }
        last_time = info[info.length - 1].time
        that.setData({
          total: res.data.total,
          ['footList[' + currentpage + ']']: info,
          last_time: last_time,
          page_num: Math.ceil(res.data.total / that.data.size),
          is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
          hasData: true
        })
        console.log(Math.ceil(res.data.total / that.data.size) == that.data.page)
        console.log(Math.ceil(res.data.total / that.data.size))
        console.log(info)
      }
    })
  },
  getDaysList: function() {
    this.setData({
      isShow: true
    })
    wx.hideLoading()
    initCalendar({
      dateShow: this.data.date_show,
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
    wx.setNavigationBarTitle({
      title: '我的足迹'
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
  onReady: function () {
    this.actionSheet = this.selectComponent("#action-sheet");

  },
  showActionSheet: function (event) {
    this.setData({
      chose_id: event.currentTarget.id,
      chose_cid: event.currentTarget.dataset.cid,
      chose_index: event.currentTarget.dataset.index,
    })
    this.actionSheet.show()
  },

  _actionEvent: function (e) {
    console.log(e)
    console.log('confirm');
    let that = this
    if(e.detail.id==1){
      // 点赞
      util.queryRequest('app/footOther/likeAdd', {
        c_id: that.data.chose_cid,
        type: 0
      }, 'GET').then(function(res) {
        if (res.code == 200) {
          wx.showToast({
            title: '点赞成功',
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
        that.actionSheet.hide()
      })
    }else{
    // 删除单个商品chose_id
    util.queryRequest('app/footOther/cancelFoot', {
      id: that.data.chose_id
    }, 'GET').then(function (res) {
      wx.hideLoading()
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(()=>{
          that.setData({
            is_end: false,
          })
          that.getFootList(that.data.year, that.data.mon, that.data.day)
        },1000)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
      that.actionSheet.hide()
    })
    }


  },

  _cancelEvent: function () {
    console.log('cancel');
    this.actionSheet.hide()
  },
    // 页面滚动控制顶部栏显示与否
    onPageScroll: function (e) {
      if (e.scrollTop > 140) {
        if (this.data.isTop == true) {
          this.setData({
            isTop: false
          })
        }
      }
      if (e.scrollTop <= 140) {
        if (this.data.isTop == false) {
          this.setData({
            isTop: true
          })
        }
      }
    },
  loadMore: function (year, mon, day){
    console.log("加载更多")
    var that = this
    util.queryRequest('app/footOther/footIndex', {
      month: parseInt(new Date(year + '/' + (mon < 10 ? '0' + mon : mon) + '/ 01').getTime() / 1000),
      time: day == undefined ? '' : parseInt(new Date((year + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (day < 10 ? '0' + day : day))).getTime() / 1000),
      page: ++that.data.page,
      size: that.data.size
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        let currentpage = that.data.page - 1
        // 处理足迹数据
        let last_time = that.data.last_time
        let info = res.data.rows
        for (let i = 0; i < info.length; i++) {
          info[i].last_time = false
          info[i].show_last_time = false
          info[i].show_right = true
          info[i].time = info[i].year + '-' + info[i].month + '-' + info[i].day
        }
        console.log(that.data.last_index)
        let k = that.data.last_index
        let flag = false
        for (let i = 0; i < info.length; i++) {
          if (last_time != info[i].time) {
            info[i].last_time = true
            info[i].show_last_time = true
            last_time = info[i].time
            flag = true
            if (flag) {
              k = 0
              flag = false
            }
            k = k+1
          } else {
            if (k < 3) {
              info[i].show_last_time = true
            }
            if((k+1)%3==0){
              info[i].show_right = false
            }
            k = k+1
          }
        }
        last_time = info[info.length - 1].time
        let last_index = k
        console.log(info)
        if(that.data.allchose==1){
          // 点击了全选
          for(let i =0;i<info.length;i++){
            info[i].checked = true
            that.data.delList.push(info[i].id)
          }
        }else{
          for(let i =0;i<info.length;i++){
            info[i].checked = false
          }
        }
        that.setData({
          delList: that.data.delList,
          total: res.data.total,
          ['footList[' + currentpage + ']']: info,
          last_time: last_time,
          last_index:last_index,
          page_num: Math.ceil(res.data.total / that.data.size),
          is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
          hasData: true
        })
        console.log("执行的哪个")
      }
    })
  },
  onReachBottom: function () {
    console.log('到底了')
    if (this.data.is_end == false) {
      this.loadMore(this.data.year, this.data.mon, this.data.day)
    }
  },
  /**
   * 跳转至今天
   */
  jump() {
    jumpToToday();
  }
};
Page(conf)