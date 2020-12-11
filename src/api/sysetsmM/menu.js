import request from '@/utils/request'

export function getMenuAll(data) {
  return request({
    url: 'api/services/app/SmMenu/QueryAll',
    method: 'POST',
    data
  })
}

export function getByMenuID(menuId) {
  return request({
    url: `api/services/app/SmModule/GetByMenuID?menuId=${menuId}`
  })
}

export function addSmMenu(data) {
  return request({
    url: 'api/services/app/SmMenu/Create',
    method: 'POST',
    data
  })
}

export function upSmMenu(data) {
  return request({
    url: 'api/services/app/SmMenu/Update',
    method: 'PUT',
    data
  })
}

export function delSmMenu(id) {
  return request({
    url: `api/services/app/SmMenu/Delete?id=${id}`,
    method: 'DELETE'
  })
}

export function addSmModule(data) {
  return request({
    url: 'api/services/app/SmModule/Create',
    method: 'POST',
    data
  })
}

export function upSmModule(data) {
  return request({
    url: 'api/services/app/SmModule/Update',
    method: 'PUT',
    data
  })
}

export function delSmModule(ids) {
  return request({
    url: `api/services/app/SmModule/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}

export function getOperationAll() {
  return request({
    url: 'api/services/app/SmOperation/QueryAll',
    method: 'POST'
  })
}

export function addSmOperation(data) {
  return request({
    url: 'api/services/app/SmOperation/Create',
    method: 'POST',
    data
  })
}

export function upSmOperation(data) {
  return request({
    url: 'api/services/app/SmOperation/Update',
    method: 'PUT',
    data
  })
}

export function delSmOperation(ids) {
  return request({
    url: `api/services/app/SmOperation/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}

export function getModuleOperationAll() {
  return request({
    url: 'api/services/app/SmModuleOperation/QueryAll',
    method: 'POST'
  })
}

export function addModuleOperationAll(data) {
  return request({
    url: 'api/services/app/SmModuleOperation/CreateMore',
    method: 'POST',
    data
  })
}

export function addSmUser(data) {
  return request({
    url: 'api/services/app/SmUser/Create',
    method: 'POST',
    data
  })
}

export function upSmUser(data) {
  return request({
    url: 'api/services/app/SmUser/Update',
    method: 'PUT',
    data
  })
}

export function delSmUser(ids) {
  return request({
    url: `api/services/app/SmUser/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}
