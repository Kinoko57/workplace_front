import request from '@/utils/index'

// 我的银行卡
export function getCardList() {
  return request({
    url: '?m=invite&a=bankcard',
    method: 'POST'
  })
}

// 礼包模块
export function getGiftList() {
  return request({
    url: '?m=invite&a=giftlist',
    method: 'GET'
  })
}

// 余额提现模块
// 点击提现按钮
export function getCashWith(info) {
  const data = {
    card_id: info.card_id,
    amount: info.amount
  }
  return request({
    url: '?m=invite&a=dodeposit',
    method: 'POST',
    data
  })
}

// 获取提现金额信息
export function getCashInner() {
  return request({
    url: '?m=invite&a=deposit',
    method: 'GET'
  })
}

// 判断银行卡id相同

export function isCardSame() {
  return request({
    url: '?m=invite&a=bankcard',
    method: 'POST'
  })
}

// 提现说明
export function getCashinstructions() {
  return request({
    url: '?m=invite&a=shoprult_hint',
    method: 'GET'
  })
}

// 输入验证码提交银行卡
export function getVerificationCode(info) {
  const data = {
    card_id: info.card_id,
    amount: info.amount,
    verify: info.verify
  }
  return request({
    url: '?m=invite&a=affirmdeposit',
    method: 'POST',
    data
  })
}

// 获取银行列表名称
export function getBankList() {
  return request({
    url: '?m=invite&a=banklist',
    method: 'POST'
  })
}

// 判断银行卡是否绑定过
export function ishaveCard() {
  return request({
    url: '?m=invite&a=havebankcard',
    method: 'POST'
  })
}

// 提交表单
export function submitInfo(info) {
  const data = {
    name: info.name,
    card: info.card,
    bank: info.bank,
    mobile: info.mobile,
    id_number: info.id_number
  }
  return request({
    url: '?m=invite&a=addbankcard',
    method: 'POST',
    data
  })
}

// 提交验证码
export function submitCode(info) {
  const data = {
    name: info.name,
    card: info.card,
    bank: info.bank,
    mobile: info.mobile,
    id_number: info.id_number,
    verify: info.verify
  }
  return request({
    url: '?m=invite&a=savebankcard',
    method: 'POST',
    data
  })
}

// 公告模块

export function getNoticeInfo(id) {
  return request({
    url: '?m=notice&a=item&id=' + id,
    method: 'GET'
  })
}

// App登录页的获取验证码
export function getCodeNum(info) {
  const data = {
    phone: info.phone
  }
  return request({
    url: '?m=index&a=send_veriftcode',
    method: 'POST',
    data
  })
}

// App手机登录

export function isGoLogin(info) {
  // const data = {
  //   mobile: info.mobile,
  //   tel_verify: info.codeNum
  // }
  return request({
    url: '?m=login&a=mobile_login',
    method: 'POST',
    data: info
  })
}
