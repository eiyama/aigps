import request from '@/utils/request'

export function getAlarmDetailNew(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetAlarmDetailNew?VehTerminalNo=${data.ids}&Begin=${data.begin}&End=${data.end}&AlarmDisplay=${data.alarmType}&AlarmStatus=${data.handle}&AlarmCategory=${data.alarmCategory}&Duration=${data.duration}&Page=${data.curPage}&Limit=${data.limit}`
  })
}

export function getDevicerAlarmNew(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetDeviceAlarmWithPage`,
    method: 'POST',
    data
  })
}


export function getAlarmDetailNewExport(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetAlarmDetailNewExport?VehTerminalNo=${data.ids}&VehPlateNo=${data.vehPlateNo}&Begin=${data.begin}&End=${data.end}&AlarmCategory=${data.alarmCategory}&AlarmDisplay=${data.alarmType}&AlarmStatus=${data.handle}&Duration=${data.duration}&IsAnalysis=${data.isAnalysis}`,
    responseType: 'blob'
  })
}


export function exportDeviceAlarm(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/ExportDeviceAlarm`,
    method: 'POST',
    data
  })
}


