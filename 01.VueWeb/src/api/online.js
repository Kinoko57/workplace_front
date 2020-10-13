import request from '@/utils/request'
// 课程批量作废
export function typebatchCancel(info) {
  return request({
    url: '/ols/onlinecourse-cancelLations.json',
    method: 'POST',
    data: info
  })
}
// 课程批量启用
export function typebatchStart(info) {
  return request({
    url: '/ols/onlinecourse-bannedsUp.json',
    method: 'POST',
    data: info
  })
}
// 课程批量停用
export function typebatchStop(info) {
  return request({
    url: '/ols/onlinecourse-banneds.json',
    method: 'POST',
    data: info
  })
}
// 成员管理批量作废
export function memberbatchCancel(info) {
  return request({
    url: '/ols/cradlegroupmember-updateStatusAll.json',
    method: 'POST',
    data: info
  })
}
// 摇篮群管理批量作废
export function cradlebatchCancel(info) {
  return request({
    url: '/ols/cradlegroup-cancelLations.json',
    method: 'POST',
    data: info
  })
}
// 排课管理批量作废
export function coursebatchCancel(info) {
  return request({
    url: '/ols/onlinestudy-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 群员等级批量作废
export function levelbatchCancel(info) {
  return request({
    url: '/ols/onlinecourseagentlevel-batchAbolish.json',
    method: 'POST',
    data: info
  })
}
// 群员等级批量启用
export function levelbatchStart(info) {
  return request({
    url: '/ols/onlinecourseagentlevel-batchUp.json',
    method: 'POST',
    data: info
  })
}
// 群员等级批量停用
export function levelbatchStop(info) {
  return request({
    url: '/ols/onlinecourseagentlevel-batchDown.json',
    method: 'POST',
    data: info
  })
}
// 摇篮群管理
export function getCradlegroupInfo(info) {
  return request({
    url: '/ols/cradlegroup-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增摇篮群
export function addCradlegroupInfo(info) {
  return request({
    url: '/ols/cradlegroup-create.json',
    method: 'POST',
    data: info
  })
}
// 修改经销商标签
export function updateCradlegroupInfo(info) {
  return request({
    url: '/ols/cradlegroup-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 修改经销商标签状态
export function changeCradlegroupInfo(id, status) {
  return request({
    url: '/ols/cradlegroup-cancelLation-' + id + '-' + status + '.json',
    method: 'POST'
    // data: info
  })
}
// 获取
export function getcradlegrouplist(info) {
  return request({
    url: '/ols/cradlegrouplist-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 成员管理列表
export function getcradlegroupmember(id, info) {
  return request({
    url: '/ols/cradlegroupmember-browse-' + id + '-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取经销商列表
export function getagentlistinfo() {
  return request({
    url: '/ols/cradlegroupmember-getagentlistinfo' + '.json',
    method: 'GET'
  })
}
// 获取群员等级列表
export function getcradlegroupleavel() {
  return request({
    url: '/ols/cradlegroupmember-getcradlegroupleavel-' + '.json',
    method: 'GET'
  })
}
// 获取线上培训的摇篮群的全部最新批次的群员管理
export function getcradlegroupmemberByNew(info) {
  return request({
    url: '/ols/cradlegroupmember-getMember-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 添加摇篮群经销商信息
export function addcradlegroupmember(id, info) {
  return request({
    url: '/ols/cradlegroupmember-create-' + id + '.json',
    method: 'POST',
    data: info
  })
}

export function editcradlegroupmember(info) {
  return request({
    url: '/ols/cradlegroupmember-edit-' + info.id + '-' + '.json',
    method: 'POST',
    data: info
  })
}
// 作废
export function updateStatus(id, status) {
  return request({
    url: '/ols/cradlegroupmember-updateStatus-' + id + '-' + status + '.json',
    method: 'get'
  })
}
// 获取群员等级列表
export function getonlinecourseagentlevel(info) {
  return request({
    url: '/ols/onlinecourseagentlevel-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增群员等级
export function addonlinecourseagentlevel(info) {
  return request({
    url: '/ols/onlinecourseagentlevel-create.json',
    method: 'POST',
    data: info
  })
}
// 修改群员等级
export function updateonlinecourseagentlevel(info) {
  return request({
    url: '/ols/onlinecourseagentlevel-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 修改群员等级状态
export function changeonlinecourseagentlevel(id, status) {
  return request({
    url: '/ols/onlinecourseagentlevel-banned-' + id + '-' + status + '.json',
    method: 'POST'
  })
}
// 将群员等级作废
export function deleteonlinecourseagentlevel(id, status) {
  return request({
    url: '/ols/onlinecourseagentlevel-cancelLation-' + id + '-' + status + '.json',
    method: 'POST'
  })
}
// 获取课程等级列表
export function getonlinecourse(info) {
  return request({
    url: '/ols/onlinecourse-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增课程等级
export function addonlinecourse(info) {
  return request({
    url: '/ols/onlinecourse-create.json',
    method: 'POST',
    data: info
  })
}
// 修改课程等级
export function editonlinecourse(info) {
  return request({
    url: '/ols/onlinecourse-edit-' + info.id + '-' + '.json',
    method: 'POST',
    data: info
  })
}
// 修改课程等级状态
export function onlinecourseupdateStatus(id, status) {
  return request({
    url: '/ols/onlinecourse-banned-' + id + '-' + status + '.json',
    method: 'get'
  })
}
// 课程状态废除
export function onlinecoursedeleteStatus(id, status) {
  return request({
    url: '/ols/onlinecourse-cancelLation-' + id + '-' + status + '.json',
    method: 'get'
  })
}
// 根据摇篮群id获取讲师列表
export function getonlineTeacher(id) {
  return request({
    url: '/ols/onlinestudy-getteacherlist-' + id + '.json',
    method: 'get'
  })
}
// 获取导师列表
export function getonline() {
  return request({
    url: '/ols/onlinecourse-getonline' + '.json',
    method: 'get'
  })
}
// 获取导师等级二级联动
export function getdoubleonlinelist() {
  return request({
    url: '/ols/onlinestudy-getdoubleleavellist' + '.json',
    method: 'get'
  })
}
// 获取最新批次的摇篮群
export function getlastdata() {
  return request({
    url: '/ols/onlinestudy-getlastdata' + '.json',
    method: 'get'
  })
}
// 获取排课列表
export function getonlinestudy(info) {
  return request({
    url: '/ols/onlinestudy-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 添加学习
export function addonlinestudy(info) {
  return request({
    url: '/ols/onlinestudy-create.json',
    method: 'POST',
    data: info
  })
}
// 修改学习
export function editonlinestudy(info) {
  return request({
    url: '/ols/onlinestudy-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 设置结果
export function setresult(info) {
  return request({
    url: '/ols/onlinestudy-setresult-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 更改结果
export function updateonlinestudystatus(id, status) {
  return request({
    url: '/ols/onlinestudy-updateStatus-' + id + '-' + status + '.json',
    method: 'get'
  })
}

// 添加群员中公司员工对应选择名称的的列表
export function getEmployeesListInfo() {
  return request({
    url: '/ols/cradlegroupmember-getUserInfoList' + '.json',
    method: 'GET'
  })
}
