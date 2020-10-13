import request from '@/utils/request'
// 供应商库批量作废
export function commodityBatchCancel(info) {
  return request({
    url: '/supplier/supplier-banneds.json',
    method: 'POST',
    data: info
  })
}
// 供应商商品列表
export function storehouseBatchCancel(info) {
  return request({
    url: '/supplier/suppliergoods-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 获取供应商列表
export function getSupplier(info) {
  return request({
    url: '/supplier/supplier-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增供应商
export function addSupplier(info) {
  return request({
    url: '/supplier/supplier-create.json',
    method: 'POST',
    data: info
  })
}
// 修改供应商
export function updateSupplier(info) {
  return request({
    url: '/supplier/supplier-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 修改供应商状态
export function changeSupplier(id, status) {
  return request({
    url: '/supplier/supplier-banned-' + id + '-' + status + '.json',
    method: 'POST'
    // data: info
  })
}

// 修改供应商状态
export function cancellationSupplier(id, status) {
  return request({
    url: '/supplier/supplier-cancellation-' + id + '.json',
    method: 'POST'
    // data: info
  })
}

// 获取供应商列表
export function getSupplierGoods(info) {
  return request({
    url: '/supplier/suppliergoods-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增供应商
export function addSupplierGoods(info) {
  return request({
    url: '/supplier/suppliergoods-create.json',
    method: 'POST',
    data: info
  })
}
export function getAddSupplierGoods() {
  return request({
    url: '/supplier/suppliergoods-create.json',
    method: 'GET'
  })
}
// 修改供应商
export function updateSupplierGoods(info) {
  return request({
    url: '/supplier/suppliergoods-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
export function getUpdateSupplierGoods(id) {
  return request({
    url: '/supplier/suppliergoods-edit-' + id + '.json',
    method: 'GET'
  })
}
// 修改供应商状态
export function changeSupplierGoods(id) {
  return request({
    url: '/supplier/suppliergoods-banned-' + id + '.json',
    method: 'POST'
    // data: info
  })
}
// 修改供应商状态
export function cancellationSupplierGoods(id) {
  return request({
    url: '/supplier/suppliergoods-cancellation-' + id + '.json',
    method: 'POST'
    // data: info
  })
}
