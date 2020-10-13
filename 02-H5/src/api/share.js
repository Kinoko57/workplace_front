import request from '@/utils/index'
// 例子
export function getBanner() {
  return request({
    url: '?m=activity&a=banner',
    method: 'GET'
  })
}
// 获取是否弹出升级会员弹框信息
export function closehit() {
  return request({
    url: '?m=invite&a=closehit',
    method: 'GET'
  })
}
// 获取升级会员信息
export function memberInfo() {
  return request({
    url: '?m=invite&a=index',
    method: 'GET'
  })
}
// 获取升级会员列表信息
export function memberGiftList() {
  return request({
    url: '?m=invite&a=superbuy',
    method: 'GET'
  })
}
// 判断会员弹框是否出现过一次
export function shoplevel() {
  return request({
    url: '?m=invite&a=shoplevel',
    method: 'GET'
  })
}
// 获取粉丝列表信息
export function fansList(data) {
  return request({
    url: '?m=invite&a=myfans',
    method: 'GET',
    params: data
  })
}
// 获取新人广告位?m=invite&a=ad
export function getAdvByShare(type) {
  return request({
    url: '?m=invite&a=ad&type=' + type,
    method: 'GET'
  })
}
// 获取新人特惠邀请人信息、(修改新人列表信息接口需要修改)
export function getUserInvite(data) {
  return request({
    url: '?m=invite&a=getuserinvite',
    method: 'GET',
    params: data
  })
}
// 直接获取邀请人信息
export function getInviteInfo() {
  return request({
    url: '?m=member&a=getInvite',
    method: 'GET'
  })
}
// 修改邀请人信息
export function editInvite(info) {
  return request({
    url: '?m=operate&a=inviter_edit',
    method: 'POST',
    data: info
  })
}
// 获取新人特惠列表信息
export function getNewList() {
  return request({
    url: '?m=invite&a=exclusive',
    method: 'GET'
  })
}
// 提现规则说明信息提示
export function getCashInfo() {
  return request({
    url: '?m=invite&a=shoprult_hint',
    method: 'GET'
  })
}
// 获取钱包列表信息
export function getWalletList(data) {
  return request({
    url: '?m=invite&a=income',
    method: 'GET',
    params: data
  })
}
// 新人详情商品信息
export function newDetaailMenu(data) {
  return request({
    url: '?m=item',
    method: 'GET',
    params: data
  })
}
// 新人详情评论信息
export function newDetaailcomment(data) {
  return request({
    url: '?m=item&a=get_comment',
    method: 'GET',
    params: data
  })
}
// 查询购物车推荐商品
export function findDetaailcar(data) {
  return request({
    url: '?m=item&a=item_related',
    method: 'GET',
    params: data
  })
}
// 查询购物车推荐商品
export function getDetaailProduct(data) {
  return request({
    url: '?m=item&a=get_product',
    method: 'GET',
    params: data
  })
}
// 新人详情添下单添加
export function getDetaailAdd(info) {
  return request({
    url: '?m=listexchange&a=newpeopleadd',
    method: 'GET',
    params: info
  })
}

// 获取我的二维码信息
export function getMyCode() {
  return request({
    url: '?m=invite&a=getwxinfo',
    method: 'POST'
  })
}
export function saveMyCode(info) {
  return request({
    url: '?m=invite&a=wxname',
    method: 'POST',
    data: info
  })
}

// 获取海报页面图片路径base64
export function getPostImg() {
  return request({
    url: '?m=invite&a=poster',
    method: 'GET'
  })
}
// 获取小程序码
export function getQRcode(info) {
  return request({
    url: '?m=invite&a=makexcxqrcode',
    method: 'GET',
    params: info,
    responseType: 'arraybuffer'
  })
}
// 获取会员页面金额信息
export function getShoperMoney() {
  return request({
    url: '?m=invite&a=myinfo',
    method: 'GET'
  })
}
// 获取会员页面的粉丝数量
export function getShoperFans() {
  return request({
    url: '?m=invite&a=myfans',
    method: 'GET'
  })
}
// 获取会员超值购列表
export function getShoperList() {
  return request({
    url: '?m=invite&a=superbuylist',
    method: 'GET'
  })
}
// 获取广告位
export function getShoperAd(info) {
  return request({
    url: '?m=invite&a=ad',
    method: 'GET',
    params: info
  })
}
// 获取公告列表
export function getShoperNoticeList() {
  return request({
    url: '?m=notice&a=index',
    method: 'GET'
  })
}
// 商品分类页面左侧分类名称信息
export function getTypeListmenu() {
  return request({
    url: '?m=menu&a=virtual_menu',
    method: 'GET'
  })
}
// 获取新人弹框信息
export function getNewDialog() {
  return request({
    url: '?m=invite&a=exclusive',
    method: 'GET'
  })
}
// 获取新人特惠广告位 是否显示
export function getNewPeople() {
  return request({
    url: '?m=activity&a=newpeople',
    method: 'GET'
  })
}
// 获取体现页面服务费用
export function getCashService(info) {
  return request({
    url: '?m=invite&a=promptdeposit',
    method: 'GET',
    params: info
  })
}
// 获取海报页二维码
export function getPosterQR(info) {
  return request({
    url: '?m=invite&a=get_qrcode',
    method: 'GET',
    params: info,
    responseType: 'arraybuffer'
  })
}
// 将图片资源转换为base64
export function getImageBase64(info) {
  return request({
    url: '?m=invite&a=getimgbase64',
    method: 'GET',
    params: info
  })
}
// 将图片资源转换为base64
export function getAvatarBy64(info) {
  return request({
    url: '?m=invite&a=getimgbase64',
    method: 'GET',
    params: info
  })
}

// 推送，绑定cid和uid
export function bindCid(info) {
  return request({
    url: '?m=api&a=bindAliasWithCid',
    method: 'POST',
    data: info
  })
}
// 新增粉列表
export function addFansListInfo(info) {
  return request({
    url: '?m=invite&a=myfansList',
    method: 'GET',
    params: info
  })
}

// 我的钱包信息接口
export function getWalInfo() {
  return request({
    url: '?m=invite&a=myWallet',
    method: 'GET'
  })
}
// 我的收益页面信息
export function getMyIncomInfo() {
  return request({
    url: '?m=invite&a=myBenefits',
    method: 'GET'
  })
}

// 钱包明细页面信息
export function getWaldetaiInfo(info) {
  return request({
    url: '?m=invite&a=walletDetails',
    method: 'GET',
    params: info
  })
}
// 获取用户详情页面信息
export function getCustonInfo(info) {
  return request({
    url: '?m=invite&a=myfansInfo',
    method: 'GET',
    params: info
  })
}
// 获取佣金信息
export function getOrderInfo(info) {
  return request({
    url: '?m=invite&a=devoteOrder',
    method: 'GET',
    params: info
  })
}
// 获取收益明细信息
export function getIncomeDetailsInfo(info) {
  return request({
    url: '?m=invite&a=incomeDetails',
    method: 'GET',
    params: info
  })
}
// 获取历史收益页面内容
export function getHistoryInfo() {
  return request({
    url: '?m=invite&a=money_history',
    method: 'GET'
  })
}
