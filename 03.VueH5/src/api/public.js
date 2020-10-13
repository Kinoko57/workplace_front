import request from '@/utils/request'
// 获取登录信息
export function loginInfo(code) {
  return request({
    url: '/sys/user-companyLogin.json?code=' +  code,
    method: 'GET'
  })
}

// 首页获取经纬度
export function getLoacl(info) {
  return request({
    url: '/statistics/statisticsindex-getpositionbybaidumap-'+ info +'.json',
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
// 获取审批列表
export function getApprovalInfo(info) {
  return request({
    url: '/oa/workflow-browse-' + info.listType + '-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
export function getWorkTypeById(id) {
  return request({
    url: '/sys/process-getProcessList-' + id + '.json',
    method: 'GET'
  })
}
// 获取搜索条件列表
export function getFifter(name, modulename) {
  return request({
    url: '/sys/search-buildForm-' + name + '-' + modulename + '.json',
    method: 'POST'
  })
}
// 点击搜索
export function searchFifter(info) {
  return request({
    url: '/sys/search-buildQuery.json',
    method: 'POST',
    data: info
  })
}

// 获取审批单详情
export function getApprovalDetail(id, type) {
  return request({
    url: '/oa/workflow-view-' + id  + '-' + type + '.json',
    method: 'GET'
  })
}
// 获取审批单各类型数据
export function getWorkflowGet(url) {
  return request({
    url: url,
    method: 'GET'
  })
}
export function getWorkEditInfo(url) {
  return request({
    url: url,
    method: 'GET'
  })
}
// 保存各审批新增或者通过和驳回
export function saveApprovalType(info, url) {
  return request({
    url: url,
    method: 'POST',
    data: info
  })
}

// 日报列表
export function getDailyInfo(info) {
  return request({
    url: '/oa/daily-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 日报审阅查看
export function viewDaily(id) {
  return request({
    url: '/oa/daily-view-' + id + '.json',
    method: 'GET'
  })
}
// 日报审阅
export function doApproveDaily(info) {
  return request({
    url: '/oa/daily-review-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 公告
// 获取公告列表
export function getReportInfo(info) {
  return request({
    url: '/oa/notice-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 公告详情
export function viewReport(id) {
  return request({
    url: '/oa/notice-view-' + id + '.json',
    method: 'GET'
  })
}
// 获取首页数量和图表数据
export function getSum(type) {
  return request({
    url: '/statistics/statisticsindex-mobilestatistics-' + type + '.json',
    method: 'GET'
  })
}
// 获取站内信
export function getMessageInfo(info) {
  return request({
    url: '/sys/message-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 站内信详情
export function viewMessage(id) {
  return request({
    url: '/oa/message-view-' + id + '.json',
    method: 'GET'
  })
}
// 获取工作流列表
export function getApprovalList() {
  return request({
    url: '/oa/workflow-origin',
    method: 'GET'
  })
}
//
export function getUserInfo() {
  return request({
    url: '/sys/user-profile-mobile.json',
    method: 'GET'
  })
}

// 日报审阅
export function doUpdateUserInfo(info) {
  return request({
    url: '/sys/user-editSign-' + info.account + '.json',
    method: 'POST',
    data: info
  })
}

// 获取未读信息
export function getUnRead() {
  return request({
    url: '/sys/message-unread.json',
    method: 'GET'
  })
}

// 获取未读信息
export function visitSign(id, info) {
  return request({
    url: '/oa/visit-sign-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 工作流各部门待审批数量
export function getWorkNum(id) {
  return request({
    url: '/oa/workflow-getorigincount-'+ id +'.json',
    method: 'GET'
  })
}
// 计算加班，请假时长
export function calcTime(url, info) {
  return request({
    url: url,
    method: 'POST',
    data: info
  })
}

export function isWorkDay(info) {
  return request({
    url: '/oa/leave-getdaysreststatus',
    method: 'POST',
    data: info
  })
}

// 获取日报未审批数据
export function getDayCount() {
  return request({
    url: '/oa/workflow-getdailycount',
    method: 'GET'
  })
}