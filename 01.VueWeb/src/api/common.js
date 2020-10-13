import request from '@/utils/request'
// 事项管理
// 获取对应部门的角色列表
// export function getRoleList(id) {
//   return request({
//     url: '/oa/matter-getorigizelist-' + id + '.json',
//     method: 'GET'
//   })
// }
// 获取所有角色列表
export function getRoleList() {
  return request({
    url: '/oa/matter-getRoleList.json',
    method: 'GET'
  })
}

// 创建事项
export function addMatter(info) {
  return request({
    url: '/oa/matter-create' + '.json',
    method: 'POST',
    data: info
  })
}
// 更新事项
export function updateMatter(info) {
  return request({
    url: '/oa/matter-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取事项进度
export function getMatterInfo(info) {
  return request({
    url: '/oa/matter-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取事项详情
export function getMatterView(id) {
  return request({
    url: '/oa/matter-view-' + id + '.json',
    method: 'GET'
  })
}
// 作废事项
export function banMatter(id) {
  return request({
    url: '/oa/matter-cancellation-' + id + '-99.json',
    method: 'GET'
  })
}

// 获取帮助文档信息
export function getHelpWord() {
  return request({
    url: '/oa/document-browse.json',
    method: 'GET'
  })
}

// 编辑帮助文档
export function editHelpWord(id, info) {
  return request({
    url: '/oa/document-create-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 新增帮助文档
export function saveHelpWord(info) {
  return request({
    url: '/oa/document-create.json',
    method: 'POST',
    data: info
  })
}
// 获取事务对接表
export function getTransaction() {
  return request({
    url: '/oa/docking-browse.json',
    method: 'GET'
  })
}

// 编辑事务对接表
export function editTransaction(id, info) {
  return request({
    url: '/oa/docking-create-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 新增事务对接表
export function saveTransaction(info) {
  return request({
    url: '/oa/docking-create.json',
    method: 'POST',
    data: info
  })
}

// 获取投诉类型列表
export function getComplaintList() {
  return request({
    url: '/oa/complainlevel-browse.json',
    method: 'GET'
  })
}

// 保存投诉类型
export function saveComplaint(info) {
  return request({
    url: '/oa/complainlevel-create.json',
    method: 'POST',
    data: info
  })
}
// 更新投诉类型
export function updateComplaint(info) {
  return request({
    url: '/oa/complainlevel-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 查看投诉类型工作流
export function getComplaintDetail(id) {
  return request({
    url: '/oa/complainprocessnode-edit-' + id + '.json',
    method: 'GET'
  })
}

// 保存投诉类型工作流
export function saveComplaintDetail(id, info) {
  return request({
    url: '/oa/complainprocessnode-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取投诉分类
export function getComplaintType() {
  return request({
    url: '/oa/complainlevel-getcompalianleavellist.json',
    method: 'GET'
  })
}

// 获取全部投诉列表
export function getComplaintInfo(info) {
  return request({
    url: '/oa/copworkflow-browse--' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 保存投诉信息
export function saveComplaintInfoDetail(info) {
  return request({
    url: '/oa/complain-create.json',
    method: 'POST',
    data: info
  })
}
// 更新投诉信息
export function updateComplaintInfoDetail(info) {
  return request({
    url: '/oa/complain-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 查看投诉详情
export function viewComplaintInfoDetail(id) {
  return request({
    url: '/oa/copworkflow-view-' + id + '.json',
    method: 'GET'
  })
}
// 保存投诉回访
export function saveComplaintFollow(id, info) {
  return request({
    url: '/oa/complain-callbackadd-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 处理投诉
export function handlingComplaint(id, info) {
  return request({
    url: '/oa/copworkflow-dealmassage-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 获取当前用户的下级
export function getDoComplaintUser() {
  return request({
    url: '/oa/copworkflow-checklower.json',
    method: 'GET'
  })
}
// 分配投诉
export function allocationComplaint(id, info) {
  return request({
    url: '/oa/copworkflow-allotmassage-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 查看投诉详情 跳转页面/oa/copworkflow-new_view
export function viewComplaintPageDetail(id) {
  return request({
    url: '/oa/copworkflow-newview-' + id + '.json',
    method: 'GET'
  })
}
// 作废投诉类型
export function banComplaintType(id) {
  return request({
    url: '/oa/complainlevel-delete-' + id + '.json',
    method: 'GET'
  })
}
// 根据id获取投诉详情oa/complain-edit-ID
export function updateComplaintDetail(id, info) {
  return request({
    url: '/oa/complain-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 作废投诉记录
export function banComplaintInfo(id) {
  return request({
    url: '/oa/copworkflow-invalid-' + id + '.json',
    method: 'GET'
  })
}

// 驳回投诉
export function rejectedComplaintInfo(id, info) {
  return request({
    url: '/oa/copworkflow-rejected-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 审核通过投诉
export function passComplaintInfo(id, info) {
  return request({
    url: '/oa/copworkflow-pass-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 驳回投诉到最初节点
export function rejectedAllComplaint(id) {
  return request({
    url: '/oa/copworkflow-forceReject-' + id + '.json',
    method: 'POST'
  })
}