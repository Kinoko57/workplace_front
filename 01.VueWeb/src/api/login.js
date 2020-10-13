import request from '@/utils/request'

export function loginByUsername(info) {
  return request({
    url: '/sys/user-login.json',
    method: 'post',
    data: info
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

