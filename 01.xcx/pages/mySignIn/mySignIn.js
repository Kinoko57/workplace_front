// pages/mySignIn/mySignIn.js
let util = require('../../utils/util.js')
var app = getApp();
let chooseYear = null;
let chooseMonth = null;
let nthWeek = null;
let signTime = [];
let signDate = 0;
let isSign = false;
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    signDate: 0,
    isSign: false,
    signTime: [],
    score: '',
    sign_info: ''
  },
  goScore: function() {
    wx.navigateTo({
      url: '../proList/proList?type=key&value=' + ''
    })
  },
  sign: function() {
    if (util.isLogin()) {
      var that = this
      util.queryRequest('?m=member&a=signin', {}, 'GET', function(res) {
        if (res.isSuccess) {
          that.tapDayItem(new Date().getDate())
          wx.showToast({
            title: '签到成功，获得' + res.point + '积分',
            icon: 'none',
            duration: 2000
          })
          wx.setStorageSync("score", res.totalpoint);
          that.getDayList()
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }

  },
  getDayList: function() {
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    var that = this;
    util.queryRequest('?m=member&a=getsigndays', {}, 'GET', function(res) {
      if (res.isSuccess) {
        for (var i = 0; i < res.rows.length; i++) {
          that.data.signTime.push(new Date(res.rows[i] * 1000).getDate())
        }
        that.setData({
          signDate: res.days,
          sign_info: res.sign_rule_set,
          score: res.point
        })
        // wx.setStorageSync("score", res.point);
        that.calculateEmptyGrids(curYear, curMonth);
        that.calculateDays(curYear, curMonth, that.data.signTime);
        that.setData({
          curYear,
          curMonth
        });
      }
    })
    wx.setNavigationBarTitle({
      title: '每日签到'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })
    // this.scoreShow()
  },
  scoreShow() {
    console.log(wx.getStorageSync("score"))
    if (wx.getStorageSync("score") > 0) {
      console.log(this.data.score)
      this.setData({
        score: wx.getStorageSync("score")
      })
    } else {
      this.setData({
        score: 0
      })
    }
  },
  onShow() {
    var that = this
    if (util.isLogin()) {
      this.getDayList()
    }
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    // 查找当月的1号是周几
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month, signTime) {
    let days = [];
    nthWeek = this.getFirstDayOfWeek(year, month);
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      if (nthWeek > 6) {
        nthWeek = 0;
      }
      days.push({
        day: i,
        nthWeek: nthWeek,
        choosed: false,
        beforeChoose: false,
        afterChoose: false
      });
      nthWeek++;
    }

    for (var i = 0; i < signTime.length; i++) {
      for (var j = 0; j < days.length; j++) {
        if (days[j].day == signTime[i]) {
          days[j].choosed = true
        }
        if (j >= 1) {
          if (days[j - 1].choosed) {
            days[j].beforeChoose = true
          }
        }
        if (signTime[i] == new Date().getDate()) {
          this.setData({
            isSign: true
          })
        }
      }
    }
    this.setData({
      days
    });
  },

  tapDayItem(e) {
    const idx = e - 1;
    const days = this.data.days;
    days[idx].choosed = true;
    if (days[idx + 1] == undefined) {
      if (days[idx - 1].choosed == true) {
        days[idx].beforeChoose = true;
      } else {
        days[idx].beforeChoose = false;
      }
    } else if (days[idx].day > 1) {
      if (days[idx - 1].choosed == true) {
        days[idx].beforeChoose = true;
      } else {
        days[idx].beforeChoose = false;
      }
      if (days[idx + 1].choosed == true) {
        days[idx].afterChoose = true;
      } else {
        days[idx].afterChoose = false;
      }
    } else {
      if (days[idx + 1].choosed == true) {
        days[idx].afterChoose = true;
      } else {
        days[idx].afterChoose = false;
      }
    }
    this.setData({
      days,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    chooseYear = this.data.pickerYear[val[0]];
    chooseMonth = this.data.pickerMonth[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.curYear = chooseYear;
      o.curMonth = chooseMonth;
      this.calculateEmptyGrids(chooseYear, chooseMonth);
      this.calculateDays(chooseYear, chooseMonth, this.data.signTime);
    }

    this.setData(o);
  }
};

Page(conf);