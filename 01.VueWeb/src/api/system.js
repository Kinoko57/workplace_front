import request from '@/utils/request'
// 人员管理跟进详情展示
export function folowInfo(obj, info) {
  return request({
    url: '/sys/user-adminDetail-' + obj.userId + '.json',
    method: 'GET'
  })
}
// 人员管理跟进合同保存
export function saveAgrement(id, info) {
  return request({
    url: '/sys/user-detailEdit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 人员管理跟进银行卡保存
export function saveBank(id, info) {
  return request({
    url: '/sys/user-detailEdit-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 获取所有部门列表(事项管理，考勤统计使用)
export function getOrgList() {
  return request({
    url: '/oa/matter-organizebrowse.json',
    method: 'POST'
  })
}
// 组织管理
// 获取部门下拉列表
export function getDepChoseList() {
  return request({
    url: '/sys/organize-getlist.json',
    method: 'POST'
  })
}
// 获取部门列表
export function getDepList() {
  return request({
    url: '/sys/organize-browse.json',
    method: 'POST'
  })
}
// 新增部门
export function addDep(info) {
  return request({
    url: '/sys/organize-save.json',
    method: 'POST',
    data: info
  })
}

// 编辑部门/sys/organize-save-id.json
export function updateDep(info) {
  return request({
    url: '/sys/organize-save-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 作废部门
export function delDep(id) {
  return request({
    url: '/sys/organize-delete-' + id + '.json',
    method: 'POST'
  })
}
// 禁用/启用部门
export function changeDep(id, status) {
  return request({
    url: '/sys/organize-update-' + id + '.json',
    method: 'POST',
    data: {
      status: status
    }
  })
}
// 角色管理
// 获取角色下拉列表
export function getRoleShowList() {
  return request({
    url: '/sys/group-getlist.json',
    method: 'POST'
  })
}

// 获取角色列表
export function getRoleList() {
  return request({
    url: '/sys/group-browse.json',
    method: 'POST'
  })
}
// 新增角色
// 新增部门
export function addRole(info) {
  return request({
    url: '/sys/group-create.json',
    method: 'POST',
    data: info
  })
}
// 选择部门联动角色
export function changeRole(id) {
  return request({
    url: '/sys/group-browse-' + id + '.json',
    method: 'GET'
  })
}
// 选择角色联动直属上级
export function changeHigher(id, account) {
  return request({
    url: '/sys/group-getsuperiorlist-' + id + '-' + account + '.json',
    method: 'GET'
  })
}
// // 获取直属上级列表
// export function getHigherShowList() {
//   return request({
//     url: '/sys/group-getlist.json',
//     method: 'POST'
//   })
// }
// 更新部门
export function updateRole(info) {
  return request({
    url: '/sys/group-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 作废角色
export function delRole(id) {
  return request({
    url: '/sys/group-delete-' + id + '.json',
    method: 'POST'
  })
}
// 获取角色权限列表
export function getRoleSet(id) {
  return request({
    url: '/sys/group-managePriv-' + id + '.json',
    method: 'GET'
  })
}
// 人员管理
// 获取人员列表
export function getPersonInfo(info) {
  return request({
    url: '/sys/user-admin-' + info.deptID + '-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增员工信息
export function addPerson(info) {
  return request({
    url: '/sys/user-create.json',
    method: 'POST',
    data: info
  })
}
// 更新员工信息
export function updatePerson(info) {
  return request({
    url: '/sys/user-resetpassword-' + info.account + '.json',
    method: 'GET'
  })
}
export function editPerson(info) {
  return request({
    url: '/sys/user-edit-' + info.account + '.json',
    method: 'POST',
    data: info
  })
}
// 修改员工状态
export function changePerson(account, type) {
  return request({
    url: '/sys/user-' + type + '-' + account + '.json',
    method: 'POST'
  })
}
// 日志管理
// 获取日志列表
export function getLogInfo(info) {
  return request({
    url: '/sys/log-browse-' + info.mode + '-' + info.search + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 获取三级部门列表
export function getWefareThirdList() {
  return request({
    url: '/sys/organize-getThirdList.json',
    method: 'GET'
  })
}

// 用户离职
export function leaveDate(id, info) {
  return request({
    url: '/sys/user-dimission-' + id + '.json',
    method: 'POST',
    data: info
  })
}
