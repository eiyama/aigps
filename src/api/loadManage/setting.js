import request from '@/utils/request'

export function insertFlowControlConfig(data) {
  return request({
    url: 'api/services/app/FlowControl/InsertFlowControlConfig',
    method: 'POST',
    data
  })
}

export function getControlConfig() {
  return request({
    url: 'api/services/app/FlowControl/GetControlConfig'
  })
}

export function insertAutoCalibrationConfig(data) {
  return request({
    url: 'api/services/app/FlowControl/InsertAutoCalibrationConfig',
    method: 'POST',
    data
  })
}

export function getCalibrationConfig() {
  return request({
    url: 'api/services/app/FlowControl/GetCalibrationConfig'
  })
}
