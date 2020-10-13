import request from '@/utils/request'
// 财务管理模块
// 保证金变更
export function catchChange(id, info) {
  return request({
    url: '/fi/contract-alter-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 财务合同协议批量作废
export function agreementBatchCancel(info) {
  return request({
    url: '/fi/contract-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 付款管理批量作废
export function paymentBatchCancel(info) {
  return request({
    url: '/fi/payment-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 获取合同协议列表
export function getAgreementInfo(info) {
  return request({
    url: '/fi/contract-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取合同协议信息
export function getAgreementIdinfo(id) {
  return request({
    url: '/fi/contract-view-' + id + '.json',
    method: 'GET'
  })
}
// 编辑合同协议信息
export function editInfo(info) {
  return request({
    url: '/fi/contract-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// //新增合同协议
export function addgreement(info) {
  return request({
    url: '/fi/contract-create.json',
    method: 'POST',
    data: info
  })
}
// 删除合同协议状
export function changeagree(id, status) {
  return request({
    url: '/fi/contract-cancellation-' + id + '-' + status + '.json',
    method: 'GET'
  })
}
// 获取首咖营业额信息列表
export function getSalesInfo(info) {
  return request({
    url: '/fi/turnover-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 编辑首咖营业额信息
export function editSales(info) {
  return request({
    url: '/fi/turnover-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 删除首咖营业额信息
export function changeSales(id, status) {
  return request({
    url: '/fi/turnover-cancel-' + id + '-' + status + '.json',
    method: 'GET'
  })
}
// 获取付款管理列表信息
export function getPaymentInfo(info) {
  return request({
    url: '/fi/payment-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 查看付款管理列表信息
export function findpaymentInfo(id) {
  return request({
    url: '/fi/payment-view-' + id + '.json',
    method: 'GET'
  })
}
// 编辑付款信息
export function editPaymentInfo(info) {
  return request({
    url: '/fi/payment-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
export function editgetPaymentInfo(info) {
  return request({
    url: '/fi/payment-edit-' + info.id + '.json',
    method: 'GET'
  })
}
// 创建款项信息
export function addPayment(info) {
  return request({
    url: '/fi/payment-create.json',
    method: 'POST',
    data: info
  })
}
// 改变付款
export function changepayment(id, status) {
  return request({
    url: '/fi/payment-cancellation-' + id + '-' + status + '.json',
    method: 'GET'
  })
}
// 关联付款信息
export function linkPayment(id, info) {
  return request({
    url: '/fi/payment-relevance-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 新增的地方单据的下拉框的额显示
export function radioSelect(info) {
  return request({
    url: '/fi/payment-getpayment-' + info + '.json',
    method: 'GET'
  })
}

// 取消关联的按钮添加
export function removeSelect(id) {
  return request({
    url: '/fi/payment-delrelevance-' + id + '.json',
    method: 'GET'
  })
}
