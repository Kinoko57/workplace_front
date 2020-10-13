import request from '@/utils/request'
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
// 获取省市区信息
export function getAreaList() {
  return request({
    url: '/crontab/province.json',
    method: 'GET'
  })
}
// 导入
// export function fifterImport(info) {
//   return request({
//     url: '/sys/search-buildQuery.json',
//     method: 'POST',
//     data: info
//   })
// }
// 导出
export function fifterExport(link, info) {
  return request({
    url: link,
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

// 批量删除
// delSelect
export function delSelect(info) {
  return request({
    url: '/sys/message-delall.json',
    method: 'POST',
    data: info
  })
}

// 通过关键字获取经销商列表
export function getAgentListByName(name) {
  return request({
    url: '/agent/agent-getAgentList-' + name + '.json',
    method: 'GET'
  })
}

// 获取所有执行部门
export function getExecutiveOrg() {
  return request({
    url: '/sys/organize-getOrganize.json',
    method: 'GET'
  })
}
// 获取所有部门列表
export function getAllOrg() {
  return request({
    url: '/sys/organize-getAllList.json',
    method: 'GET'
  })
}

// 获取关键字获取授权号列表
export function getAuthCodeListByName(type, name) {
  return request({
    url: '/fi/payment-getpayment-' + type + '-' + name + '.json',
    method: 'GET'
  })
}
