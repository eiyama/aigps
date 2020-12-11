import request from '@/utils/request'

export function getDptAll(data) {
  return request({
    url: `api/services/app/GpsMark/GetDptAll?Type=${data.type}`
  })
}

export function deleteMark(data) {
  return request({
    url: `api/services/app/GpsMark/Delete?id=${data.id}`,
    method: 'DELETE'
  })
}

export function gpsFenceGet(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/Get?id=${data.id}`,
  })
}

export function gpsMarkUp(data) {
  return request({
    url: 'api/services/app/GpsMark/Update',
    method: 'PUT',
    data
  })
}

export function gpsFenceSave(data) {
  return request({
    url: 'api/services/app/GpsFenceSetup/Save',
    method: 'POST',
    data
  })
}

export function gpsMarkCreate(data) {
  return request({
    url: 'api/services/app/GpsMark/Create',
    method: 'POST',
    data
  })
}

export function sendMsg(data, url) {
  return request({
    url: `api/services/app/GpsSendMessage/${url}`,
    method: 'POST',
    data
  })
}

export function queryFence(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/QueryFence`,
    method: 'POST',
    data
  })
}

export function addFence(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/AddFence`,
    method: 'POST',
    data
  })
}

export function queryVehicleInfo(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/QueryVehicleInfo`,
    method: 'POST',
    data
  })
}

export function bindFence(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/BindFence`,
    method: 'POST',
    data
  })
}

export function deleteFence(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/DeleteFence`,
    method: 'POST',
    data
  })
}

export function managerFence(data) {
  return request({
    url: `api/services/app/GpsFenceSetup/ManagerFence`,
    method: 'POST',
    data
  })
}







