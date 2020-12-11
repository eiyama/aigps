import request from '@/utils/request'

export function getQueryFlowControlTaskPage(data) {
  return request({
    url: 'api/services/app/FlowControl/QueryFlowControlTaskPage',
    method: 'POST',
    data
  })
}

// api/services/app/FlowControl/Import
export function uploadFlowControl(data, opt) {
  return request({
    url: `api/services/app/FlowControl/Import?DptID=${opt.dptId}`,
    method: 'POST',
    data
  })
}


export function updateFlowContrlTask(data) {
  return request({
    url: 'api/services/app/FlowControl/UpdateFlowContrlTask',
    method: 'PUT',
    data
  })
}

export function deleteFlowContrlTask(id) {
  return request({
    url: `api/services/app/FlowControl/DeleteFlowContrlTask?FlowControlTaskIds=${id}`,
    method: 'DELETE'
  })
}

export function getExcel() {
  return request({
    url: 'api/services/app/FlowControl/GetExcel'
  })
}

export function getDptAll(type) {
  return request({
    url: `api/services/app/GpsMark/GetDptAll?Type=${type}`
  })
}

export function addFlowContrTask(data) {
  return request({
    url: 'api/services/app/FlowControl/AddFlowContrTask',
    method: 'POST',
    data
  })
}

export function getTaskEvents(opt) {
  return request({
    url: `api/services/app/FlowControl/GetTaskEvents?VehNum=${opt.veh}&EventType=${opt.type}&Sorting=${opt.sorting}&SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxCount}`
  })
}

export function insertAuditConfig(data) {
  return request({
    url: 'api/services/app/FlowControl/InsertAuditConfig',
    method: 'POST',
    data
  })
}

export function getControlTaskDetail(id) {
  return request({
    url: `api/services/app/FlowControl/GetControlTaskDetail?TaskId=${id}`
  })
}

export function checkOperator(data) {
  return request({
    url: 'api/services/app/FlowControl/CheckOperator',
    method: 'POST',
    data
  })
}

export function getLoadData(opt) {
  return request({
    url: `api/services/app/FlowControl/GetLoadData?VehNum=${opt.veh}&DepId=${opt.dptId}&Sorting=${opt.sorting}&SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxCount}`
  })
}
