import request from '@/utils/request'

export function getDepartmentAll(data) {
  return request({
    url: 'api/services/app/SmDepartment/QueryAll',
    method: 'POST',
    target: data.dom,
    isLock: true,
    data
  })
}

export function smMove(data) {
  return request({
    url: 'api/services/app/SmDepartment/Move',
    method: 'POST',
    data
  })
}

export function addSmDpt(data) {
  return request({
    url: 'api/services/app/SmDepartment/Create',
    method: 'POST',
    data
  })
}

export function upSmDpt(data) {
  return request({
    url: 'api/services/app/SmDepartment/Update',
    method: 'PUT',
    data
  })
}

export function delSmDpt(id) {
  return request({
    url: `api/services/app/SmDepartment/Delete?id=${id}`,
    method: 'DELETE'
  })
}

export function getAssigned(id) {
  return request({
    url: `api/services/app/GpsVehicle/GetAssigned?DptId=${id}`
  })
}

export function getUnassigned(opt) {
  return request({
    url: `api/services/app/GpsVehicle/GetUnassigned?DptId=${opt.id}&Key=${opt.key}&Skip=${opt.skip}&Take=${opt.take}`
  })
}

export function addGpsAllotVehicle(data) {
  return request({
    url: 'api/services/app/GpsAllotVehicle/CreateMore',
    method: 'POST',
    data
  })
}

export function delGpsAllotVehicle(ids) {
  return request({
    url: `api/services/app/GpsAllotVehicle/DeleteMore?VehicleId=${ids}`,
    method: 'DELETE'
  })
}

export function getSmUser(opt) {
  return request({
    url: `api/services/app/SmUser/GetAllUser?UserName=${opt.userName}&UserCode=${opt.userCode}&DptName=${opt.dptName}&SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxResultCount}`
  })
}