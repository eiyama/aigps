import request from '@/utils/request'

export function getAlarmReportNew(opt) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetAlarmReportNew?VehTerminalNos=${opt.ids}&BeginDateTime=${opt.begin}&EndDateTime=${opt.end}&ProtocolType=${opt.ageerType}&AlaTypeDisplays=${opt.alarmType}&AlarmLevel=${opt.alarmLevel}`
  })
}

export function queryAlarmStatistics(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/QueryAlarmStatistics`,
    method: 'POST',
    data
  })
}

export function exportAlarmStatisticsExcel(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/ExportAlarmStatisticsExcel`,
    method: 'POST',
    data
  })
}

export function queryAlarmsTrend(data) {
  return request({
    url: `api/services/app/GpsAlarmRecode/QueryAlarmsTrend`,
    method: 'POST',
    data
  })
}

export function getAlarmReportTrendNew(opt) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetAlarmReportTrendNew?VehTerminalNos=${opt.ids}&BeginDateTime=${opt.begin}&EndDateTime=${opt.end}&ProtocolType=${opt.ageerType}&AlaTypeDisplays=${opt.alarmType}&AlarmLevel=${opt.alarmLevel}`
  })
}

export function getAlarmReportExcel(opt) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetAlarmReportExcel?VehTerminalNos=${opt.ids}&BeginDateTime=${opt.begin}&EndDateTime=${opt.end}&ProtocolType=${opt.ageerType}&AlaTypeDisplays=${opt.alarmType}&AlarmLevel=${opt.alarmLevel}`
  })
}

export function getAlarmRecodeDetailNew(data) {
  return request({
    url: 'api/services/app/GpsAlarmRecode/ActiveSafetyAlarmRecodeDetailNew',
    method: 'POST',
    data
  })
}

export function alarmRecodeDetailNewExport(data) {
  return request({
    url: 'api/services/app/GpsAlarmRecode/ActiveSafetyAlarmRecodeDetailNewExport',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

