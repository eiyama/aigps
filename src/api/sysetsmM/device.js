import request from '@/utils/request'


export function addProtocolType(data) {
  return request({
    url: 'api/services/app/SmProtocolType/Create',
    method: 'POST',
    data
  })
}

export function upProtocolType(data) {
  return request({
    url: 'api/services/app/SmProtocolType/Update',
    method: 'PUT',
    data
  })
}

export function delProtocolType(ids) {
  return request({
    url: `api/services/app/SmProtocolType/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}

export function getProtocolType() {
  return request({
    url: 'api/services/app/SmProtocolType/GetAllFull'
  })
}

export function addDeviceType(data) {
  return request({
    url: 'api/services/app/SmDeviceType/Create',
    method: 'POST',
    data
  })
}

export function upDeviceType(data) {
  return request({
    url: 'api/services/app/SmDeviceType/Update',
    method: 'PUT',
    data
  })
}

export function delDeviceType(ids) {
  return request({
    url: `api/services/app/SmDeviceType/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}

export function getDeviceType() {
  return request({
    url: 'api/services/app/SmDeviceType/GetAllFull'
  })
}

