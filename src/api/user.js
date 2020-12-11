import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/services/app/LoginInOrOut/Login',
    method: 'POST',
    data
  })
}

export function tokenLogin(data) {
  return request({
    url: 'api/services/app/LoginInOrOut/TokenLogin',
    method: 'POST',
    data
  })
}

export function logo() {
  return request({
    url: 'api/services/app/SmUserConfig/QuerySmUserConfig',
    method: 'POST'
  })
}

export function updatePassword(data) {
  return request({
    url: 'api/services/app/SmUser/UpdatePassword',
    method: 'PUT',
    data
  })
}