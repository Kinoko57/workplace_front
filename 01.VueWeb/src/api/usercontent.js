import request from '@/utils/request'
// 站内信管理
// 获取站内信列表
export function getMailInfo(info) {
  return request({
    url: '/sys/message-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取站内列表详细信息
export function findMailInfo(info) {
  return request({
    url: '/sys/message-view-' + info.id + '.json',
    method: 'GET'
  })
}
// 获取个人资料信息
export function userInfo(info) {
  return request({
    url: '/sys/user-profile.json',
    method: 'GET',
    data: info
  })
}
// 修改密码
export function changepass(info) {
  return request({
    url: '/sys/user-changePassword.json',
    method: 'POST',
    data: info
  })
}
