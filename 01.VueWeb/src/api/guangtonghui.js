import request from '@/utils/request'
// 群员等级
// 获取群员等级列表
export function getgthcourseagentlevel(info) {
  return request({
    url: '/gth/gthlevel-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 新增群员等级
export function addgthcourseagentlevel(info) {
  return request({
    url: '/gth/gthlevel-create.json',
    method: 'POST',
    data: info
  })
}

// 修改群员等级
export function updategthcourseagentlevel(info) {
  return request({
    url: '/gth/gthlevel-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 修改群员等级状态
export function changegthcourseagentlevel(id, status) {
  return request({
    url: '/gth/gthlevel-banned-' + id + '-' + status + '.json',
    method: 'GET'
  })
}

// 作废模块
export function gthcourseagentlevel(id) {
  return request({
    url: '/gth/gthlevel-cancellation-' + id + '.json',
    method: 'GET'
  })
}

// 合同协议
// 获取合同协议列表
export function gthAgreementInfo(info) {
  return request({
    url: '/gth/gthcontract-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 编辑合同协议
export function gthEditInfo(info) {
  return request({
    url: '/gth/gthcontract-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 录入合同协议
export function gthAddgreement(info) {
  return request({
    url: '/gth/gthcontract-create.json',
    method: 'POST',
    data: info
  })
}

// 合同作废
export function gthAbolish(id) {
  return request({
    url: '/gth/gthcontract-cancellation-' + id + '.json',
    method: 'GET'
  })
}

// 查看
export function gthLook(id) {
  return request({
    url: '/gth/gthcontract-view-' + id + '.json',
    method: 'GET'
  })
}

// 商机模块
// 获取潜在商机列表
export function getBusinessInfo(info) {
  return request({
    url: '/gth/gthagent-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增商机
export function saveBusiness(info) {
  return request({
    url: '/gth/gthagent-create' + '.json',
    method: 'POST',
    data: info
  })
}
// 商机忽略
export function agentingore(id) {
  return request({
    url: '/gth/gthagent-agentingore-' + id + '.json',
    method: 'GET'
  })
}
// 商机领取
export function agentreceive(id) {
  return request({
    url: '/gth/gthagent-receive-' + id + '.json',
    method: 'GET'
  })
}
// 商机作废
export function banAgent(id) {
  return request({
    url: '/gth/gthagent-cancelLation-' + id + '.json',
    method: 'GET'
  })
}
// 经销商跟进
export function saveagentFollow(id, info) {
  return request({
    url: '/gth/gthagent-assign-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 经销商跟进
export function followagent(id) {
  return request({
    url: '/gth/gthagent-assign-' + id + '.json',
    method: 'GET'
  })
}
// 获取指派人员信息
export function addAppointLabel(id) {
  return request({
    url: '/gth/gthagent-appoint-' + id + '.json',
    method: 'GET'
  })
}
// 新增指派
export function saveAppoint(id, info) {
  return request({
    url: '/gth/gthagent-appoint-' + id + '.json',
    method: 'POST',
    data: info
  })
}
//  获取经销商等级
export function addTransformationLabel() {
  return request({
    url: '/gth/gthagent-getAgentLeavelList' + '.json',
    method: 'GET'
  })
}
// 商机转化
export function saveTransformation(id, info) {
  return request({
    url: '/gth/gthagent-transformation-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 客户管理
// 客户列表
export function gthAgentLevel(info) {
  return request({
    url: '/gth/gthagentbusiness-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 新增客户等级
export function gthAddBusinessInfo(info) {
  return request({
    url: '/gth/gthagentbusiness-create' + '.json',
    method: 'POST',
    data: info
  })
}

// 修改地址
export function gthEditAdress(id, info) {
  return request({
    url: '/gth/gthagentbusiness-editadress-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 删除
export function gthDeleteOneById(id) {
  return request({
    url: '/gth/gthagentbusiness-delete-' + id + '.json',
    method: 'GET'
  })
}

// 关闭客户
export function gthCloseAgent(id) {
  return request({
    url: '/gth/gthagentbusiness-closegthagentbusiness-' + id + '.json',
    method: 'GET'
  })
}

// 获取指派人员
export function addgthAppointLabel(id) {
  return request({
    url: '/gth/gthagentbusiness-appoint-' + id + '.json',
    method: 'GET'
  })
}

// 新增客户指派
export function savegthAppoint(id, info) {
  return request({
    url: '/gth/gthagentbusiness-appoint-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 获取全部客户列表
export function gthBussinessList() {
  return request({
    url: '/gth/gthagentbusiness-getagentbusiness.json',
    method: 'GET'
  })
}

// 根据id获取商机的详细情况并写入到页面上
export function gthBussinessById(id) {
  return request({
    url: '/gth/gthagentbusiness-getagentbusinessInfo-' + id + '.json',
    method: 'GET'
  })
}

// 获取客户查看页面
export function gthAgentview(id, type) {
  return request({
    url: '/gth/gthagentbusiness-gthagentbusinessview-' + id + '-' + type + '.json',
    method: 'GET'
  })
}

// 客户商跟进
export function gthFollowagent(id) {
  return request({
    url: '/gth/gthagentbusiness-assign-' + id + '.json',
    method: 'GET'
  })
}

// 客户商跟进
export function gthSaveagentFollow(id, info) {
  return request({
    url: '/gth/gthagentbusiness-assign-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 合同编号下拉框的搜所
export function getContractList() {
  return request({
    url: '/gth/gthagentbusiness-getcontractcodeList.json',
    method: 'GET'
  })
}

