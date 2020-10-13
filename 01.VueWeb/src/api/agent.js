import request from '@/utils/request'
// 福利记录提示
export function welfTips(id, agentId) {
  return request({
    url: '/agent/welfarerecord-getGrantInfo-' + id + '-' + agentId + '.json',
    method: 'GET'
  })
}
// 福利记录作废
export function removeRecord(info) {
  return request({
    url: '/agent/welfarerecord-remove.json',
    method: 'POST',
    data: info
  })
}
// 福利记录确认
export function confirmRecord(info) {
  return request({
    url: '/agent/welfarerecord-confirm.json',
    method: 'POST',
    data: info
  })
}
// 福利记录添加
export function addRecord(info) {
  return request({
    url: '/agent/welfarerecord-create.json',
    method: 'POST',
    data: info
  })
}

// 编辑跟进信息
export function followEdit(id, info) {
  return request({
    url: '/agent/agent-assignEdit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 流入公海接口-列表
export function getSeasInfo() {
  return request({
    url: '/agent/agent-commonalityGet.json',
    method: 'GET'
  })
}
// 保存
export function saveSeas(data) {
  return request({
    url: '/agent/agent-commonalitySet.json',
    method: 'POST',
    data: data
  })
}
// 修改商机管理页面联系人信息修改
export function changeaddConcat(id, type, data) {
  return request({
    url: '/agent/agent-editContact-' + id + '-' + type + '.json',
    method: 'POST',
    data: data
  })
}
export function removerContact(id, type) {
  return request({
    url: '/agent/agent-delContact-' + id + '-' + type + '.json',
    method: 'GET'
  })
}
// 经销商批量加入黑名单
export function transactionblack(info) {
  return request({
    url: '/agent/agent-batchBlack.json',
    method: 'POST',
    data: info
  })
}
// 商机管理批量领取
export function businessReservice(info) {
  return request({
    url: '/agent/agent-batchReceive.json',
    method: 'POST',
    data: info
  })
}
// 客服手机批量作废
export function wecatbatchCancel(info) {
  return request({
    url: '/agent/service-batchCancellation.json',
    method: 'POST',
    data: info
  })
}
// 商机经销商等级批量作废接口
export function agentLevelbatchCancel(info) {
  return request({
    url: '/agent/agentlevel-batchBanned.json',
    method: 'POST',
    data: info
  })
}
// // 商机经销商标签批量作废接口
export function proxybatchCancel(info) {
  return request({
    url: '/agent/agentproxy-batchBanned.json',
    method: 'POST',
    data: info
  })
}
// 商机福利批量作废接口
export function batchCancel(info) {
  return request({
    url: '/agent/welfare-batchCancellation.json',
    method: 'POST',
    data: info
  })
}
// 商机福利批量停用接口
export function stopBanned(info) {
  return request({
    url: '/agent/welfare-batchBanned.json',
    method: 'POST',
    data: info
  })
}
// 商机福利批量启用接口
export function upBanned(info) {
  return request({
    url: '/agent/welfare-batchEnable.json',
    method: 'POST',
    data: info
  })
}

// 商机经销商跟进信息
export function agentFollowInfo(info) {
  return request({
    url: '/agent/agent-agentview-' + info.id + '-' + info.type + '.json',
    method: 'GET'
  })
}
// 添加联系人
export function addConcatsInfo(id, info) {
  return request({
    url: '/agent/agent-addContact-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 添加新跟进
export function addfollow(id, type, info) {
  return request({
    url: '/agent/agent-assign-' + id + '-' + type + '.json',
    method: 'POST',
    data: info
  })
}
// 经销商详情修改信息
export function AgentchangeInfo(id, info) {
  return request({
    url: '/agent/agent-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 客服号管理
// 获取客服号列表
export function getWechatInfo(info) {
  return request({
    url: '/agent/service-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增客服号
export function saveWechat(info) {
  return request({
    url: '/agent/service-create.json',
    method: 'POST',
    data: info
  })
}
// 更新客服号
export function updateWechat(info) {
  return request({
    url: '/agent/service-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 封禁或者启用客服号
export function wechatStates(id) {
  return request({
    url: '/agent/service-banned-' + id + '.json',
    method: 'GET'
  })
}
// 潜在商机
// 获取潜在商机列表
export function getBusinessInfo(info) {
  return request({
    url: '/agent/agent-agentbusinessbrowse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增商机
export function saveBusiness(info) {
  return request({
    url: '/agent/agent-agentbusinesscreate' + '.json',
    method: 'POST',
    data: info
  })
}
// 商机跟进
export function followBusiness(id) {
  return request({
    url: '/agent/agent-agentbusinessassign-' + id + '.json',
    method: 'GET'
  })
}
// 修改商机
export function editAgent(info) {
  return request({
    url: '/agent/agent-businessedit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 修改成交经销商里的跟进的经销商基本信息
// export function editAgent(info) {
//   return request({
//     url: '/agent/agent-businessedit-' + info.id + '.json',
//     method: 'POST',
//     data: info
//   })
// }

// export function saveFollow(id,type){
//   return request({
//        url: 'agent/agent-assign-' + id + '-' + type + '.json',
//        method: 'POST'

//       })
// }
// 保存商机跟进
export function saveFollow(id, info) {
  return request({
    url: '/agent/agent-agentbusinessassign-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 获取经销商等级列表
export function getAgentLevel(info) {
  return request({
    url: '/agent/agentlevel-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 新增经销商等级
export function addAgentLevel(info) {
  return request({
    url: '/agent/agentlevel-create.json',
    method: 'POST',
    data: info
  })
}

// 更新经销商等级
export function updateAgentLevel(info) {
  return request({
    url: '/agent/agentlevel-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 修改经销商状态
export function changeLevel(id, status) {
  return request({
    url: '/agent/agentlevel-banned-' + id + '-' + status + '.json',
    method: 'GET'
  })
}

// 获取经销商标签列表
export function getProxyLabel(info) {
  return request({
    url: '/agent/agentproxy-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增经销商标签
export function addProxyLabel(info) {
  return request({
    url: '/agent/agentproxy-create.json',
    method: 'POST',
    data: info
  })
}
// 修改经销商标签
export function updateProxyLabel(info) {
  return request({
    url: '/agent/agentproxy-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 修改经销商标签状态
export function changeProxyLabel(id, status) {
  return request({
    url: '/agent/agentproxy-banned-' + id + '-' + status + '.json',
    method: 'POST'
    // data: info
  })
}
// 获取指派人员信息
export function addAppointLabel(id) {
  return request({
    url: '/agent/agent-agentbusinessappoint-' + id + '.json',
    method: 'GET'
  })
}
// 新增指派
export function saveAppoint(id, info) {
  return request({
    url: '/agent/agent-agentbusinessappoint-' + id + '.json',
    method: 'POST',
    data: info
  })
}
//  获取经销商等级
export function addTransformationLabel() {
  return request({
    url: '/agent/agent-getAgentLeavelList' + '.json',
    method: 'GET'
  })
}
// 商机转化
export function saveTransformation(id, info) {
  return request({
    url: '/agent/agent-transformation-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取流失经销商列表
export function getLoseagent(info) {
  return request({
    url: '/agent/agent-loseagentbrowse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 流失经销商领取
export function getReceive(id) {
  return request({
    url: '/agent/agent-receive-' + id + '.json',
    method: 'GET'
  })
}
// 流失经销商二次销售
export function LoseAgentResale(id) {
  return request({
    url: '/agent/agent-resale-' + id + '.json',
    method: 'GET'
  })
}
// 获取经销商列表
export function getAgentInfo(info) {
  return request({
    url: '/agent/agent-agentbrowse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取经销商详情页面
export function getAgentview(id) {
  return request({
    url: '/agent/agent-agentview-' + id + '.json',
    method: 'GET'
  })
}
// 根据类型获取经销商详情页面
export function getAgentviewBytype(id, type) {
  return request({
    url: '/agent/agent-agentview-' + id + '-' + type + '.json',
    method: 'GET'
  })
}
// 获取全部商机列表
export function getBussinessList(name) {
  return request({
    url: '/agent/agent-getagentbusiness-' + name + '.json',
    method: 'GET'
  })
}
// 根据id获取商机的详细情况并写入到页面上
export function getBussinessById(id) {
  return request({
    url: '/agent/agent-getagentbusinessInfo-' + id + '.json',
    method: 'GET'
  })
}
// 保存经销商
export function saveBusinessInfo(info) {
  return request({
    url: '/agent/agent-agentcreate' + '.json',
    method: 'POST',
    data: info
  })
}
// 修改地址
export function editAdress(info) {
  return request({
    url: '/agent/agent-editadress-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}
// 添加微信小号
export function AddWxchat(id, info) {
  return request({
    url: '/agent/agent-bindwx-' + id + '-' + info.type + '.json',
    method: 'POST',
    data: info
  })
}
// 获取微信号列表
export function getWxchatList(type, id) {
  return request({
    url: '/agent/agent-getAgentWxchatlist-' + type + '-' + id + '.json',
    method: 'GET'
  })
}
// 获取微信号列表
export function deleteOneById(id) {
  return request({
    url: '/agent/agent-delete-' + id + '.json',
    method: 'GET'
  })
}
// 关闭经销商
export function closeAgent(id, info) {
  return request({
    url: '/agent/agent-closeagent-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 加入黑名单
export function AddblackList(id) {
  return request({
    url: '/agent/agent-addblacklist-' + id + '.json',
    method: 'GET'
  })
}
// 移出黑名单
export function RmoveblackList(id) {
  return request({
    url: '/agent/agent-removeblacklist-' + id + '.json',
    method: 'GET'
  })
}
// 获取二次销售指派人员信息
export function getReSaleAppointLabel(id) {
  return request({
    url: '/agent/agent-resale-' + id + '.json',
    method: 'GET'
  })
}
// 新增指派
export function saveReSaleAppoint(id, info) {
  return request({
    url: '/agent/agent-resale-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取经销商标签列表
export function getagenticon() {
  return request({
    url: '/agent/agent-geticonlist' + '.json',
    method: 'GET'
  })
}
// 添加经销商标签
export function addagenticon(id, info) {
  return request({
    url: '/agent/agent-addicon-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取经销商福利列表
export function getwelfarelist() {
  return request({
    url: '/agent/agent-getwelfarelist' + '.json',
    method: 'GET'
  })
}
// 保存经销商福利
export function grantwelfare(id, info) {
  return request({
    url: '/agent/agent-grantwelfare-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 获取经销商福利列表
export function getwelfarerecordlist(info) {
  return request({
    url: '/agent/welfarerecord-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 修改福利标签
export function changewelfarerecordLabel(id, status) {
  return request({
    url: '/agent/welfarerecord-banned-' + id + '-' + status + '.json',
    method: 'POST'
  })
}
// 添加福利
export function addwelfare(info) {
  return request({
    url: '/agent/welfare-create' + '.json',
    method: 'POST',
    data: info
  })
}
// 修改福利
export function editwelfare(id, info) {
  return request({
    url: '/agent/welfare-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 福利列表
export function welfarelist(info) {
  return request({
    url: '/agent/welfare-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 修改福利启用停用
export function changewelfareLabel(id, status) {
  return request({
    url: '/agent/welfare-banned-' + id + '-' + status + '.json',
    method: 'GET'
  })
}
// 作废福利
export function cancellationwelfareLabel(id) {
  return request({
    url: '/agent/welfare-cancellation-' + id + '.json',
    method: 'GET'
  })
}
// 商机忽略
export function agentIngore(id, info) {
  return request({
    url: '/agent/agent-agentingore-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 商机作废
export function banAgent(id) {
  return request({
    url: '/agent/agent-cancelLation-' + id + '.json',
    method: 'GET'
  })
}
// 由我创建商机作废
export function banAgentbyMy(id) {
  return request({
    url: '/agent/agent-cancellationcreatebyme-' + id + '.json',
    method: 'GET'
  })
}

// 商机领取
export function agentreceive(id) {
  return request({
    url: '/agent/agent-receive-' + id + '.json',
    method: 'GET'
  })
}
// 经销商跟进
export function saveagentFollow(id, info) {
  return request({
    url: '/agent/agent-agentassign-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 在成交经销商页面跟进详情保存经销商信息

export function saveFollowAgent(info) {
  return request({
    url: '/agent/agent-edit-' + info.id + '.json',
    method: 'POST',
    data: info
  })
}

// 经销商跟进
export function followagent(id) {
  return request({
    url: '/agent/agent-agentassign-' + id + '.json',
    method: 'GET'
  })
}

// 获取指派人员
export function addagentAppointLabel(id) {
  return request({
    url: '/agent/agent-agentappoint-' + id + '.json',
    method: 'GET'
  })
}
// 新增经销商指派
export function saveagentAppoint(id, info) {
  return request({
    url: '/agent/agent-agentappoint-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 移除添加微信小号以及添加微连锁号
export function deletelWxCode(id, name, info) {
  return request({
    url: '/agent/agent-deletewxcode-' + id + '-' + name + '.json',
    method: 'POST',
    data: info
  })
}

// 客服号作废
export function deletelWxchatCode(id) {
  return request({
    url: 'agent/service-cancellation-' + id + '.json',
    method: 'GET'
  })
}

// 合同编号下拉框的列表
export function getContractList() {
  return request({
    url: 'agent/agent-getcontractcodeList.json',
    method: 'GET'
  })
}

// 合同编号下拉框的搜索
export function searchContract(id) {
  return request({
    url: 'agent/agent-getcontractcodeInfo-' + id + '.json',
    method: 'GET'
  })
}
