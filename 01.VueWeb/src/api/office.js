import request from '@/utils/request'
// 知识库批量作废
export function knowledgeBasebatchCancel(info) {
  return request({
    url: '/oa/knowledge-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 事项通知批量作废
export function matterProgressbatchCancel(info) {
  return request({
    url: '/oa/matter-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 公告管理批量作废
export function reportbatchCancel(info) {
  return request({
    url: '/oa/notice-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 日报管理
// 添加日报
export function saveDaily(info) {
  return request({
    url: '/oa/daily-create.json',
    method: 'POST',
    data: info
  })
}

// 编辑日报
export function updateDaily(info) {
  return request({
    url: '/oa/daily-edit-' + info.id + '.json',
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

// 日报查看
export function viewDaily(id) {
  return request({
    url: '/oa/daily-view-' + id + '.json',
    method: 'GET'
  })
}

// 日报审阅查看
export function approveDaily(id) {
  return request({
    url: '/oa/daily-review-' + id + '.json',
    method: 'GET'
  })
}

// 日报审阅查看
export function doApproveDaily(info) {
  return request({
    url: '/oa/daily-review-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 考勤管理
// 考勤列表
export function getAttendanceInfo(info) {
  return request({
    url: '/oa/attendance-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取已审批的加班申请
export function getoverTimeInfo(info) {
  return request({
    url: '/oa/overtime-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增核实加班单
export function verifyOverTime(info) {
  return request({
    url: '/oa/workflow-overtimeedit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取考勤时间列表
export function getAttendanceTimeInfo() {
  return request({
    url: '/oa/attendance-attTimeList.json',
    method: 'GET'
  })
}
// 新增考勤时间
export function saveAttendanceTime(info) {
  return request({
    url: '/oa/attendance-insertAttTime.json',
    method: 'POST',
    data: info
  })
}
// 获取考勤三级部门
export function getAttendanceOrg() {
  return request({
    url: '/oa/attendance-getOrganizationList.json',
    method: 'GET'
  })
}
// 删除考勤时间
export function delAttendanceTime(id) {
  return request({
    url: '/oa/attendance-delAttTime-' + id,
    method: 'GET'
  })
}
// 考勤异常处理
export function handlingAttendance(info) {
  return request({
    url: '/oa/attendance-attEdit',
    method: 'POST',
    data: info
  })
}
// 公告管理
// 获取公告列表
export function getReportInfo(info) {
  return request({
    url: '/oa/notice-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 公告作废
export function banReport(id) {
  return request({
    url: '/oa/notice-cancellation-' + id + '.json',
    method: 'GET'
  })
}
// 新增公告
export function saveReport(info) {
  return request({
    url: '/oa/notice-create.json',
    method: 'POST',
    data: info
  })
}
// 公告详情
export function viewReport(id) {
  return request({
    url: '/oa/notice-view-' + id + '.json',
    method: 'GET'
  })
}
// 更新公告
export function updateReport(info) {
  return request({
    url: '/oa/notice-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 审批
// 获取审批新增页面列表
export function getApprovalList() {
  return request({
    url: '/oa/workflow-origin',
    method: 'GET'
  })
}
// 获取审批列表
export function getApprovalInfo(info) {
  return request({
    url: '/oa/workflow-browse--' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取审批单
export function getApprovalDetail(id, type) {
  return request({
    url: '/oa/workflow-view-' + id + '-' + type + '.json',
    method: 'GET'
  })
}
export function getWorkflowGet(url) {
  return request({
    url: url,
    method: 'GET'
  })
}
// 获取某种审批的审批类型列表
export function getWorkTypeById(id) {
  return request({
    url: '/sys/process-getProcessList-' + id + '.json',
    method: 'GET'
  })
}
// 用车申请
// 获取用车类型
export function getCartype() {
  return request({
    url: '/oa/car-create.json',
    method: 'GET'
  })
}
// 新增用车申请
// export function saveCar(info) {
//   return request({
//     url: '/oa/car-create.json',
//     method: 'POST',
//     data: info
//   })
// }
// 用章申请
// 获取用章类型
export function getChaptertype() {
  return request({
    url: '/oa/seal-create.json',
    method: 'GET'
  })
}

// 新增用章申请
// export function saveChapter(info) {
//   return request({
//     url: '/oa/seal-create.json',
//     method: 'POST',
//     data: info
//   })
// }
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
// 保存各审批新增
export function saveApprovalType(info, url) {
  return request({
    url: url,
    method: 'POST',
    data: info
  })
}

export function getWorkEditInfo(url) {
  return request({
    url: url,
    method: 'GET'
  })
}
// 审批作废
export function banApproval(id) {
  return request({
    url: '/oa/workflow-invalid-' + id + '.json',
    method: 'GET'
  })
}
// 根据供应商id获取产品列表
export function getProBySup(id) {
  return request({
    url: '/oa/procurement-goods-' + id + '.json',
    method: 'GET'
  })
}
// 工作流列表
export function getWorkInfo() {
  return request({
    url: '/sys/process-browse.json',
    method: 'GET'
  })
}
// 获取指定人列表
export function getSystemUserList() {
  return request({
    url: '/sys/user-adminList.json',
    method: 'GET'
  })
}
// 获取工作流编辑页面
export function getWorkDetail(type, id) {
  return request({
    url: '/sys/process-edit-' + type + '-' + id + '.json',
    method: 'GET'
  })
}
// 作废工作流审批类型
export function banWorkType(id) {
  return request({
    url: '/sys/processtype-delete-' + id + '.json',
    method: 'GET'
  })
}
// 更新保存工作流
export function saveWorkDetail(id, info) {
  return request({
    url: '/sys/process-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取审批类型列表
export function getWorkTypeList(info) {
  return request({
    url: '/sys/processtype-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 审批类型新增
export function saveWorkType(info) {
  return request({
    url: '/sys/processtype-create.json',
    method: 'POST',
    data: info
  })
}
// 审批类型更新
export function updateWorkType(info, id) {
  return request({
    url: '/sys/processtype-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 投诉模块
// 获取投诉列表
// export function getComplaintInfo(info) {
//   return request({
//     url: '/oa/complain-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
//     method: 'GET'
//   })
// }
// // 查看投诉详情
// export function getComplaintDetail(id) {
//   return request({
//     url: '/oa/complain-info-' + id + '.json',
//     method: 'GET'
//   })
// }
// // 新增投诉
// export function saveComplaint(info) {
//   return request({
//     url: '/oa/complain-create.json',
//     method: 'POST',
//     data: info
//   })
// }
// // 分配投诉
// export function allocationComplaint(type, id, info) {
//   return request({
//     url: '/oa/complain-' + type + '-' + id + '.json',
//     method: 'POST',
//     data: info
//   })
// }

// // 投诉驳回
// export function rejectComplaint(data) {
//   return request({
//     url: '/oa/complain-editReject-' + data.id + '.json',
//     method: 'POST',
//     data: { 'id': data.id, 'content': data.content }
//   })
// }

// // 投诉作废
// export function banComplaint(id) {
//   return request({
//     url: '/oa/complain-delete-' + id + '.json',
//     method: 'POST',
//     data: { 'id': id }
//   })
// }

// // 编辑投诉
// export function updateComplaint(info) {
//   return request({
//     url: '/oa/complain-edit-' + info.id + '.json',
//     method: 'POST',
//     data: info
//   })
// }
// 知识库列表
export function knowledgeListInfo(info) {
  return request({
    url: '/oa/knowledge-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 创建知识库
export function creadeKnowledge(info) {
  return request({
    url: '/oa/knowledge-create.json',
    method: 'POST',
    data: info
  })
}
// 编辑知识库
export function Editknowledge(info) {
  return request({
    url: '/oa/knowledge-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 查看知识库
export function viewknowledge(id) {
  return request({
    url: '/oa/knowledge-view-' + id + '.json',
    method: 'GET'
  })
}

// 批量删除
export function delSelect(info) {
  return request({
    url: '/oa/knowledge-delall.json',
    method: 'POST',
    data: info
  })
}

// 已分配指派中的下拉框的数据

export function appointSelect(id) {
  return request({
    url: '/oa/complain-getAccounts-' + id + '.json',
    method: 'GET'
  })
}

// 已分配指派中保存的数据
export function appointName(id, info) {
  return request({
    url: '/oa/complain-editAppoint-' + id + '.json',
    method: 'POST',
    data: info
  })
}
