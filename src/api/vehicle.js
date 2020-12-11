import request from '@/utils/request'

export function home(data) {
  return request({
    url: 'api/services/app/GpsHome/Home',
    method: 'POST',
    data
  })
}

export function getDptVehicleTree() {
  return request({
    url: 'api/services/app/GpsVehicle/GetDptVehicleTree'
  })
}

export function getMonitor() {
  return request({
    url: 'api/services/app/GpsVehicle/GetMonitor'
  })
}

export function lastRecodes(data) {
  return request({
    url: 'api/services/app/GpsLastRecode/LastRecodes',
    method: 'POST',
    data
  })
}

export function getTirePress(data) {
  return request({
    url: `api/services/app/GpsTirePress/Get?VehTerminalNo=${data.vehTerminalNo}`
  })
}

export function getPosition(data) {
  return request({
    url: `api/services/app/GpsPosition/GetPosition?VehTerminalNo=${data.veh}&Begin=${data.begin}&End=${data.end}&Limit=${data.limit}&Report=${data.report}&Zero=${data.zero}&ContainBaseStationPosition=${data.position}&DouglasPeucker=${data.douglasPeucker}`,
    isLock: true,
    isLoading: true
  })
}

export function getPositionByTime(data) {
  return request({
    url: `api/services/app/GpsPosition/GetPositionByTime?VehTerminalNo=${data.veh}&Begin=${data.begin}&End=${data.end}&Zero=${data.zero}&Report=${data.report}`,
    isLock: true,   
  })
}

export function sendInstructionsText(data) {
  return request({
    url: 'api/services/app/GpsSendMessage/SendInstructionsText',
    method: 'POST',
    data
  })
}