import request from '@/utils/request'
// 邀约经销商管理批量作废
export function proxyListbatchCancel(info) {
  return request({
    url: '/ofs/offlinestudymember-batchCancelLation.json',
    method: 'POST',
    data: info
  })
}
// 培训管理批量作废
export function studybatchCancel(info) {
  return request({
    url: '/ofs/offlinestudy-batchCancelLation.json',
    method: 'POST',
    data: info
  })
}
// 讲师管理批量作废
export function tutorbatchCancel(info) {
  return request({
    url: '/ofs/offlineteacher-batchCancelLation.json',
    method: 'POST',
    data: info
  })
}
// 课程管理批量启用
export function tutorbatchStart(info) {
  return request({
    url: '/ofs/offlineteacher-batchEnable.json',
    method: 'POST',
    data: info
  })
}
// 课程管理批量停用
export function tutorbatchStop(info) {
  return request({
    url: '/ofs/offlineteacher-batchBanned.json',
    method: 'POST',
    data: info
  })
}
// 课程管理批量作废
export function coursebatchCancel(info) {
  return request({
    url: '/ofs/offlinecourse-batchCancelLation.json',
    method: 'POST',
    data: info
  })
}
// 课程管理批量启用
export function coursebatchStart(info) {
  return request({
    url: '/ofs/offlinecourse-batchEnable.json',
    method: 'POST',
    data: info
  })
}
// 课程管理批量停用
export function coursebatchStop(info) {
  return request({
    url: '/ofs/offlinecourse-batchBanned.json',
    method: 'POST',
    data: info
  })
}
// 获取课程列表
export function getCourseInfo(info) {
  return request({
    url: '/ofs/offlinecourse-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增课程
export function saveCourse(info) {
  return request({
    url: '/ofs/offlinecourse-create.json',
    method: 'POST',
    data: info
  })
}

// 更新课程
export function updateCourse(info) {
  return request({
    url: '/ofs/offlinecourse-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 修改课程状态
export function changeCourse(id, status) {
  return request({
    url: '/ofs/offlinecourse-banned-' + id + '-' + status + '.json',
    method: 'GET'
  })
}

// 课程的作废
export function courseCancelLation(id, status) {
  return request({
    url: '/ofs/offlinecourse-cancelLation-' + id + '-' + status + '.json',
    method: 'GET'
  })
}

// 培训管理
//  获取培训列表
export function getStudyInfo(info) {
  return request({
    url: '/ofs/offlinestudy-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 保存培训
export function saveStudy(info) {
  return request({
    url: '/ofs/offlinestudy-create.json',
    method: 'POST',
    data: info
  })
}
// 获取培训课程列表
export function getStudyCourse() {
  return request({
    url: '/ofs/offlinestudy-getCourseList.json',
    method: 'GET'
  })
}
// 获取培训导师列表
export function getStudyTeacher() {
  return request({
    url: '/ofs/offlineteacher-getteacherinfolist.json',
    method: 'GET'
  })
}

// 更新培训
export function updateStudy(info) {
  return request({
    url: '/ofs/offlinestudy-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 修改培训状态
export function changeStudy(id, status) {
  return request({
    url: '/ofs/offlinestudy-cancelLation-' + id + '-' + status + '.json',
    method: 'GET'
  })
}
// 邀约经销商
// 获取经销商列表
export function getProxyInfo(id, info) {
  return request({
    url: '/ofs/offlinestudymember-browse-' + id + '-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增培训中的经销商
export function saveProxy(id, info) {
  return request({
    url: '/ofs/offlinestudymember-create-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 补录经销商
export function supplementProxy(id, info) {
  return request({
    url: '/ofs/offlinestudymember-recordingCreate-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取培训课程列表
export function getProxyCourse() {
  return request({
    url: '/ofs/offlinestudy-create.json',
    method: 'GET'
  })
}
// 更新经销商
export function updateProxy(info) {
  return request({
    url: '/ofs/offlinestudymember-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 修改经销商状态
export function changeProxy(id, status) {
  return request({
    url: '/ofs/offlinestudymember-updateStatus-' + id + '-' + status + '.json',
    method: 'GET'
  })
}
// 跟进经销商
// 获取经销商基本信息
export function assignProxy(id) {
  return request({
    url: '/ofs/offlinestudymember-assign-' + id + '.json',
    method: 'GET'
  })
}
// 添加跟进
export function saveAssign(id, info) {
  return request({
    url: '/ofs/offlinestudymember-assign-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 生成签到二维码
export function downloadCode(id) {
  return request({
    url: '/ofs/offlinestudy-downloadCode-' + id + '.json',
    method: 'GET'
  })
}

// 创建培训中选择姓名产生对应的手机号
export function showPhoe(id) {
  return request({
    url: '/ofs/offlinestudymember-getAgentInfo-' + id + '.json',
    method: 'GET'
  })
}

// 获取导师列表
export function getTutorList(info) {
  return request({
    url: '/ofs/offlineteacher-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 新增导师
export function saveTutor(info) {
  return request({
    url: '/ofs/offlineteacher-create.json',
    method: 'POST',
    data: info
  })
}

// 更新导师
export function updateTutor(info) {
  return request({
    url: '/ofs/offlineteacher-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 作废导师
export function banTutor(id) {
  return request({
    url: '/ofs/offlineteacher-cancelLation-' + id + '.json',
    method: 'GET'
  })
}
// 停用导师
export function changeStatusTutor(id) {
  return request({
    url: '/ofs/offlineteacher-banned-' + id + '.json',
    method: 'GET'
  })
}

// 获取导师的培训记录
export function getTraningListById(info) {
  return request({
    url: '/ofs/offlineteacher-getTeacherInformationViewList-' + info.id + '-' + info.page + '-' + info.limit + '.json',
    method: 'GET'
  })
}

