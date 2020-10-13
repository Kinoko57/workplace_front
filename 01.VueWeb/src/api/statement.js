import request from '@/utils/request'
// 员工人数统计
export function getStatisticsuserInfo() {
  return request({
    url: '/statistics/statisticsuser-user.json',
    method: 'GET'
  })
}
// 员工变化人数统计
export function getchangeStatisticsuserInfo(type) {
  return request({
    url: '/statistics/statisticsuser-monthUser-' + type + '.json',
    method: 'GET'
  })
}
// 获取首页图表和销售简报数据
export function getIndexChartsInfo(type, info) {
  return request({
    url: '/agent/agentcount-count-' + type + '-' + info + '.json',
    method: 'GET'
  })
}
// 首页最近跟进记录.json
export function getBusinessFollow() {
  return request({
    url: '/agent/agentcount-lateList.json',
    method: 'GET'
  })
}
// 新商机统计 info.type分为我的商机mystatistics，部门商机departmentstatisticstop，个人商机staffstatisticstop
export function getBusinessStatementInfo(info) {
  return request({
    url: '/statistics/statisticstop-' + info.type + '-' + info.mode + '-' + info.startDate + '-' + info.endDate + '-' + info.xtype + '-' + info.getType + '.json',
    method: 'GET'
  })
}

// 商机导出
export function exportBusinessStatementInfo(info) {
  return request({
    url: '/statistics/statisticstop-myStatisticsexport' + '-' + info.mode + '-' + info.startDate + '-' + info.endDate + '-' + info.xtype + '.json',
    method: 'POST'
  })
}
// 部门商机departmentstatisticstop，个人商机staffstatisticstop导出
export function exportBusinessStatement(info) {
  return request({
    url: '/statistics/statisticstop-' + info.type + '-' + info.mode + '-' + info.startDate + '-' + info.endDate + '-' + info.getType + '.json',
    method: 'GET'
  })
}
// 新经销商统计
export function getTransactionStatementInfo(info) {
  return request({
    url: '/statistics/statisticstop-getAgencyInfo-' + info.mode + '-' + info.startDate + '-' + info.endDate + '-' + info.xtype + '.json',
    method: 'GET'
  })
}
// 经销商导出
export function exportTransactionStatementInfo(info) {
  return request({
    url: '/statistics/statisticstop-getAgencyExport' + '-' + info.mode + '-' + info.startDate + '-' + info.endDate + '-' + info.xtype + '.json',
    method: 'POST'
  })
}
// 投诉统计
// 获取投诉总数
export function getComplainTotalInfo() {
  return request({
    url: '/statistics/statisticscomplain-complaintotal',
    method: 'GET'
  })
}
// 获取折线图和表格数据
export function getComplainChartInfo(info) {
  return request({
    url: '/statistics/statisticscomplain-complaintatistics-' + info.mode + '-' + info.xtype + '-' + info.startDate + '-' + info.endDate + '.json',
    method: 'GET'
  })
}
// 获取投诉饼图数据
export function getComplainPieInfo() {
  return request({
    url: '/statistics/statisticscomplain-complainleave',
    method: 'GET'
  })
}
// 投诉导出
export function exportComplainStatementInfo(info) {
  return request({
    url: '/statistics/statisticscomplain-export.json',
    method: 'POST',
    data: {
      mode: info.mode,
      start_time: info.startDate,
      end_time: info.endDate,
      size_type: info.xtype
    }
  })
}

// 考勤日报
export function getAttendanceDaily(info) {
  return request({
    url: '/statistics/statisticscheckingin-dailyReport-' + info.type + '-' + info.date + '-' + info.organizeId + '-' + info.page + '-' + info.size + '.json',
    method: 'GET'
  })
}
// 考勤导出
export function exportAttendanceDaily(info) {
  return request({
    url: '/statistics/statisticscheckingin-export-' + info.type + '-' + info.date + '-' + info.organizeId + '.json',
    method: 'GET'
  })
}
// 考勤统计
export function getAttendanceChartInfo(info) {
  return request({
    url: '/statistics/statisticscheckingin-' + info.type + '-' + info.mode + '-' + info.startDate + '-' + info.endDate + '-' + info.xtype + '.json',
    method: 'GET'
  })
}

// 培训统计
export function getOnlineInfo(info) {
  return request({
    url: '/statistics/statisticstrain-' + info.type + '-' + info.startDate + '-' + info.endDate + '-' + info.page + '-' + info.size + '.json',
    method: 'GET'
  })
}

// 培训统计
export function exportOnlineInfo(info) {
  return request({
    url: '/statistics/statisticstrain-export.json',
    method: 'POST',
    data: {
      type: info.type,
      startDate: info.startDate,
      endDate: info.endDate
    }
  })
}
// 课程导出

export function courseImportant(info) {
  return request({
    url: '/statistics/statisticstrain-import',
    method: 'POST',
    data: {
      startDate: info.startDate,
      endDate: info.endDate
    }
  })
}
// 生日统计
export function getBirtahdayInfo() {
  return request({
    url: '/statistics/birthday-getBirthdayInfo.json',
    method: 'GET'
  })
}
// 生日统计导出
export function exportBirtahdayStatementInfo() {
  return request({
    url: '/statistics/birthday-birthdayExport.json',
    method: 'POST'
  })
}
// 生日明细

export function getBirtahdayStatementInfo(info) {
  return request({
    url: '/statistics/birthday-getBirthdayData-' + info.mode + '-' + info.month + '-' + info.page + '-' + info.size + '-' + info.type + '.json',
    method: 'GET'
  })
}
// 生日明细导出
export function exportBirtahdayInfo(info) {
  return request({
    url: '/statistics/birthday-getBirthdayData-' + info.mode + '-' + info.month + '-' + info.page + '-' + info.size + '-' + info.type + '.json',
    method: 'POST'
  })
}

// 商机统计
export function getBusinessInfo(info) {
  return request({
    url: '/statistics/statistics-agentbusinessstatistics-' + info.mode + '-' + info.startDate + '-' + info.endDate + '.json',
    method: 'GET'
  })
}
// 经销商统计
export function getTransactionInfo(info) {
  return request({
    url: '/statistics/statistics-agentinfostatistics-' + info.mode + '-' + info.startDate + '-' + info.endDate + '.json',
    method: 'GET'
  })
}
// 销售统计
export function getSalesInfo(info) {
  return request({
    url: '/statistics/statistics-toplist-' + info.mode + '-' + info.startDate + '-' + info.endDate + '.json',
    method: 'GET'
  })
}

export function getTitleInfo() {
  return request({
    url: '/statistics/statistics-getagentbusinesscount.json',
    method: 'GET'
  })
}
// 首页接口
export function getindexinfo() {
  return request({
    url: '/statistics/statisticsindex-statistics.json',
    method: 'GET'
  })
}
