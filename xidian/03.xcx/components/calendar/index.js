let util = require('../../utils/util.js')
var app = getApp()
let nthWeek = null;
let dataShow = false
let beforeNum = 0
let afterNum = 0
let changeNum = 0
let activeWeek = 1
let lastWeek = 1
/**
 * 上滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isUpSlide(e) {
  const {
    startX,
    startY
  } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaY < -60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 下滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isDownSlide(e) {
  const {
    startX,
    startY
  } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaY > 60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
let chooseYear = null;
let chooseMonth = null;
const conf = {
  /**
   * 计算指定月份共多少天
   * @param {number} year 年份
   * @param {number} month  月份
   */
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  /**
   * 计算指定月份第一天星期几
   * @param {number} year 年份
   * @param {number} month  月份
   */
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  /**
   * 计算当前月份前后两月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateEmptyGrids(year, month) {
    conf.calculatePrevMonthGrids.call(this, year, month);
    conf.calculateNextMonthGrids.call(this, year, month);
  },
  /**
   * 计算上月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculatePrevMonthGrids(year, month) {
    const prevMonthDays = conf.getThisMonthDays(year, month - 1);
    const firstDayOfWeek = conf.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    console.log("计算上个月占的格子")
    console.log(prevMonthDays)
    console.log(firstDayOfWeek)
    if (firstDayOfWeek > 0) {
      const len = prevMonthDays - firstDayOfWeek;
      for (let i = prevMonthDays; i > len; i--) {
        empytGrids.push({
          day: i,
          choosed: false,
          footlist: false,
          week: lastWeek
        });
      }
      this.setData({
        'calendar.empytGrids': empytGrids.reverse(),
      });
    } else {
      this.setData({
        'calendar.empytGrids': null,
      });
    }
    console.log(empytGrids)
  },
  /**
   * 计算下月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateNextMonthGrids(year, month) {
    const thisMonthDays = conf.getThisMonthDays(year, month);
    const lastDayWeek = new Date(`${year}-${month}-${thisMonthDays}`).getDay();
    let lastEmptyGrids = [];
    if (+lastDayWeek !== 6) {
      const len = 7 - (lastDayWeek + 1);
      for (let i = 1; i <= len; i++) {
        lastEmptyGrids.push({
          day: i,
          choosed: false,
          footlist: false,
          week: 1
        });
      }
      this.setData({
        'calendar.lastEmptyGrids': lastEmptyGrids,
      });
    } else {
      this.setData({
        'calendar.lastEmptyGrids': null,
      });
    }
  },
  /**
   * 设置日历面板数据
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateDays(year, month, curDate) {
    let days = [];
    nthWeek = conf.getFirstDayOfWeek(year, month);
    const {
      todayTimestamp
    } = this.data.calendar;
    const thisMonthDays = conf.getThisMonthDays(year, month);
    const selectedDay = this.data.calendar.selectedDay || [{
      day: curDate,
      choosed: true,
      footlist: false,
      week: 0,
      year,
      month,
    }];
    for (let i = 1; i <= thisMonthDays; i++) {
      if (nthWeek > 6) {
        nthWeek = 0;
      }
      days.push({
        day: i,
        choosed: false,
        footlist: false,
        week: Math.ceil((i + 6 - nthWeek - 1) / 7),
        nthWeek: nthWeek,
        year,
        month,
      });
      nthWeek++;
    }
    days.map(item => {
      selectedDay.forEach(d => {
        if (item.day === d.day && item.year === d.year && item.month === d.month) {
          item.choosed = true;
          activeWeek = item.week
        }
      });
      // const timestamp = new Date(`${item.year}-${item.month}-${item.day}`).getTime();
      // if (this.config.disablePastDay && (timestamp - todayTimestamp < 0)) {
      //   item.disable = true;
      // }
    });
    lastWeek = days[days.length - 1].week
    console.log(days)
    var day = curDate
    let footDays = []
    this.setData({
      'calendar.activeWeek': activeWeek,
    })
    let that = this;
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 1] //上一个页面
    console.log(prevPage.data)
    console.log(prevPage.data.day)
    console.log(prevPage.data.mon)
    console.log(prevPage.data.year)
    console.log(activeWeek)
    let now_chose_day = parseInt(new Date((prevPage.data.year + '/' + (prevPage.data.mon < 10 ? '0' + prevPage.data.mon : prevPage.data.mon) + '/' + (prevPage.data.day < 10 ? '0' + prevPage.data.day : prevPage.data.day))).getTime() / 1000)
    util.queryRequest('app/footOther/footIndex', {
      month: parseInt(new Date(year + '/' + (month < 10 ? '0' + month : month) + '/ 01').getTime() / 1000),
      time: day == undefined ? now_chose_day : parseInt(new Date((year + '/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day))).getTime() / 1000),
      page: 1,
      size: 20
    }, 'GET').then(function (res) {
      console.log(res.data.time)
      wx.hideLoading()
      if (res.code == 200) {
        if (res.data.time != null) {
          for (var i = 0; i < res.data.time.length; i++) {
            footDays.push(res.data.time[i])
          }
          console.log(footDays)
          footDays.forEach(day => {
            for (var j = 0; j < days.length; j++) {
              if (day == days[j].day) {
                days[j].footlist = true
              }
            }
          })

        }
        console.log('接口请求的足迹数据')
        console.log(res.data)
        if (res.data.rows.length > 0) {
          // 处理足迹数据
          let last_time = ''
          let info = res.data.rows
          for (let i = 0; i < info.length; i++) {
            info[i].checked = false
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
              if (flag) {
                k = 0
                flag = false
              }
              k = k + 1
            } else {
              if (k < 3) {
                info[i].show_last_time = true
              }
              if ((k + 1) % 3 == 0) {
                info[i].show_right = false
              }
              k = k + 1
            }
          }
          last_time = info[info.length - 1].time
          let last_index = k
          console.log(info)
          prevPage.data.total = res.data.total
          prevPage.setData({
            total: prevPage.data.total,
            ['footList[' + 0 + ']']: info,
            last_time: last_time,
            last_index: last_index,
            page_num: Math.ceil(prevPage.data.total / 20),
            is_end: Math.ceil(prevPage.data.total / 20) == 1,
            hasData: true
          })
          console.log(prevPage.data)
        } else {
          prevPage.setData({
            total: 0,
            ['footList[' + 0 + ']']: [],
            last_time: '',
            last_index: 0,
            page_num: 0,
            is_end: true,
            hasData: false
          })
        }
        console.log('处理后的足迹')
        const tmp = {
          'calendar.days': days,
        };
        if (curDate) {
          tmp['calendar.selectedDay'] = selectedDay;
        }
        that.setData(tmp);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    }).catch(function(req){
      console.log(req)
    })

  },
  /**
   * 选择上一月
   */
  choosePrevMonth() {
    if (this.data.calendar.changeNum == 0) {
      const changeNum = ++this.data.calendar.changeNum
      const curYear = this.data.calendar.curYear;
      const curMonth = this.data.calendar.curMonth;
      console.log(this.data)
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }
      conf.calculateDays.call(this, newYear, newMonth);
      conf.calculateEmptyGrids.call(this, newYear, newMonth);
      this.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth,
        'calendar.changeNum': changeNum,
      });
      console.log(changeNum)
    }
  },
  /**
   * 选择下一月
   */
  chooseNextMonth() {
    if (this.data.calendar.changeNum == 1) {
      const changeNum = --this.data.calendar.changeNum
      const curYear = this.data.calendar.curYear;
      const curMonth = this.data.calendar.curMonth;
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }
      conf.calculateDays.call(this, newYear, newMonth);
      conf.calculateEmptyGrids.call(this, newYear, newMonth);
      this.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth,
        'calendar.changeNum': changeNum,
      });
      console.log(changeNum)
    }

  },
  // 选择某年某月
  chooseYearAndMonth() {
    const curYear = this.data.calendar.curYear;
    const curMonth = this.data.calendar.curMonth;
    let pickerYear = [];
    let pickerMonth = [];
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    const idxYear = pickerYear.indexOf(curYear);
    const idxMonth = pickerMonth.indexOf(curMonth);
    this.setData({
      'calendar.pickerValue': [idxYear, idxMonth],
      'calendar.pickerYear': pickerYear,
      'calendar.pickerMonth': pickerMonth,
      'calendar.showPicker': true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    chooseYear = this.data.calendar.pickerYear[val[0]];
    chooseMonth = this.data.calendar.pickerMonth[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      'calendar.showPicker': false,
    };
    if (type === 'confirm') {
      o.curYear = chooseYear;
      o.curMonth = chooseMonth;
      conf.calculateEmptyGrids.call(this, chooseYear, chooseMonth);
      conf.calculateDays.call(this, chooseYear, chooseMonth, 1);
      this.setData({
        'calendar.curYear': chooseYear,
        'calendar.curMonth': chooseMonth
      });
    }
    this.setData(o);
  },
  openData() {
    this.setData({
      'calendar.dataShow': this.data.date_show,
    });
  },
  /**
   * 选择具体日期
   * @param {!object} e  事件对象
   */
  tapDayItem(e) {
    const {
      idx,
      disable,
      hasfoot
    } = e.currentTarget.dataset;
    if (disable) return;
    if (!hasfoot) {
      wx.showToast({
        title: '这一天没有足迹',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    const config = this.config;
    const {
      multi,
      openDay,
      afterTapDay,
      onTapDay
    } = config;
    const days = this.data.calendar.days.slice();
    let selected;
    let selectedDays = this.data.calendar.selectedDay || [];
    if (multi) {
      days[idx].choosed = !days[idx].choosed;
      if (!days[idx].choosed) {
        days[idx].cancel = true; // 是否是取消的选择日期
        selected = days[idx];
        selectedDays = selectedDays.filter(item => item.day !== days[idx].day);
      } else {
        selected = days[idx];
        selectedDays.push(selected);
      }
      if (onTapDay && typeof onTapDay === 'function') {
        config.onTapDay(selected, e);
        return;
      };
      this.setData({
        'calendar.days': days,
        'calendar.selectedDay': selectedDays,
      });
    } else {
      days.forEach(day => {
        day.choosed = false;
      });
      days[idx].choosed = true;
      selected = days[idx];
      if (onTapDay && typeof onTapDay === 'function') {
        config.onTapDay(selected, e);
        return;
      };
      this.setData({
        'calendar.days': days,
        'calendar.selectedDay': [selected],
      });
    }
    if (afterTapDay && typeof afterTapDay === 'function') {
      if (!multi) {
        config.afterTapDay(selected);
      } else {
        config.afterTapDay(selected, selectedDays);
      }
    };
  },
  /**
   * 跳转至今天
   */
  jumpToToday() {
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const curDate = date.getDate();
    const timestamp = new Date(`${curYear}/${curMonth}/${curDate}`).getTime();
    this.setData({
      'calendar.curYear': curYear,
      'calendar.curMonth': curMonth,
      'calendar.selectedDay': [{
        day: curDate,
        choosed: true,
        footlist: false,
        year: curYear,
        month: curMonth,
      }],
      'calendar.todayTimestamp': timestamp,
    });
    conf.calculateEmptyGrids.call(this, curYear, curMonth);
    conf.calculateDays.call(this, curYear, curMonth, curDate);
  },
  calendarTouchstart(e) {
    const t = e.touches[0];
    const startX = t.clientX;
    const startY = t.clientY;
    this.slideLock = true; // 滑动事件加锁
    this.setData({
      'gesture.startX': startX,
      'gesture.startY': startY
    });
  },
  // calendarTouchmove(e) {
  //   if (isLeftSlide.call(this, e)) {
  //     conf.chooseNextMonth.call(this);
  //   }
  //   if (isRightSlide.call(this, e)) {
  //     conf.choosePrevMonth.call(this);
  //   }
  // },
};

/**
 * 获取当前页面实例
 */
function _getCurrentPage() {
  const pages = getCurrentPages();
  const last = pages.length - 1;
  return pages[last];
}
/**
 * 绑定函数到当前页面实例上
 * @param {array} functionArray 函数数组
 */
function bindFunctionToPage(functionArray) {
  if (!functionArray || !functionArray.length) return;
  functionArray.forEach(item => {
    this[item] = conf[item].bind(this);
  });
}

/**
 * 获取已选择的日期
 */
export const getSelectedDay = () => {
  const self = _getCurrentPage();
  return self.data.calendar.selectedDay;
};

/**
 * 跳转至今天
 */
export const jumpToToday = () => {
  const self = _getCurrentPage();
  conf.jumpToToday.call(self);
};

export default (config = {}) => {
  const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
  const footList = [];
  const self = _getCurrentPage();
  self.config = config;
  self.setData({
    'calendar.weeksCh': weeksCh,
    'calendar.footList': footList,
    'calendar.dataShow': self.data.date_show,
    'calendar.changeNum': 0,
    'calendar.activeWeek': activeWeek,
  });
  conf.jumpToToday.call(self);
  const functionArray = ['tapDayItem', 'choosePrevMonth', 'chooseYearAndMonth', 'chooseNextMonth', 'calendarTouchstart', 'chooseYearAndMonth', 'pickerChange', 'tapPickerBtn', 'openData'];
  bindFunctionToPage.call(self, functionArray);
};