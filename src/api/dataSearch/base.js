import request from '@/utils/request'

export function getReportMileage(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/ReportMileage',
    method: 'POST',
    data
  })
}

export function GetMileage(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/GetMileage',
    method: 'POST',
    data
  })
}

export function exportMileage(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/ExportMileage',
    method: 'POST',
    data
  })
}

 

export function getReportMileagePeriod(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/ReportMileagePeriod',
    method: 'POST',
    data
  })
}

export function getReportStatisticMileage(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/ReportStatisticMileage',
    method: 'POST',
    data
  })
}


export function getStatisticMileage(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/GetStatisticMileage',
    method: 'POST',
    data
  })
}

export function exportStatisticMileage(data) {
  return request({
    url: 'api/services/app/GpsReportMileage/ExportStatisticMileage',
    method: 'POST',
    data
  })
}


export function getReportStop(data) {
  return request({
    url: 'api/services/app/GpsReportStop/ReportStop',
    method: 'POST',
    data
  })
}

export function getStopPoint(data) {
  return request({
    url: 'api/services/app/GpsReportStop/GetStopPoint',
    method: 'POST',
    data
  })
}


export function exportStatisticStopPoint(data) {
  return request({
    url: 'api/services/app/GpsReportStop/ExportStatisticStopPoint',
    method: 'POST',
    data
  })
}




export function getReportPosition(data) {
  return request({
    url: 'api/services/app/GpsPosition/GetReportPosition',
    method: 'POST',
    data
  })
}

export function getPositionWithPage(data) {
  return request({
    url: 'api/services/app/GpsPosition/GetPositionWithPage',
    method: 'POST',
    data
  })
}

export function exportPositionReport(data) {
  return request({
    url: 'api/services/app/GpsPosition/ExportPositionReport',
    method: 'POST',
    data
  })
}


export function getLocusExcel(opt) {
  return request({
    url: `api/services/app/GpsPosition/GetLocusExcel?VehTerminalNo=${opt.vehTerminalNo}&Begin=${opt.begin}&End=${opt.end}&Zero=${opt.zero}`
  })
}

export function getSendMessage(data) {
  return request({
    url: 'api/services/app/GpsSendMessage/ReportSendMessage',
    method: 'POST',
    data
  })
}

export function getOfflineReport(data) {
  return request({
    url: 'api/services/app/GpsLastRecode/OfflineReport',
    method: 'POST',
    data
  })
}

export function getAllVehicle(data) {
  return request({
    url: 'api/services/app/GpsVehicle/AllVehicle',
    method: 'POST',
    data
  })
}

export function getSearch(opt) {
  return request({
    url: `api/services/app/GpsVehicle/GetSearch?Key=${opt.key}&Take=${opt.take}`,
    target: opt.dom,
  })
}

export function getDataTrendByWeek(data) {
  return request({
    url: 'api/services/app/GpsSafetyStatistics/VehicleDrivingDataTrendByWeek',
    method: 'POST',
    total: data.total || 5,
    data
  })
}

export function getRiskDataTrendTwo(data) {
  return request({
    url: 'api/services/app/GpsSafetyStatistics/VehicleDrivingRiskDataTrendTwo',
    method: 'POST',
    total: data.total || 5,
    data
  })
}

export function getDataSpecificTrendTwo(data) {
  return request({
    url: 'api/services/app/GpsSafetyStatistics/VehicleDrivingRiskDataSpecificTrendTwo',
    method: 'POST',
    total: data.total || 5,
    data
  })
}

export function getRiskTimeDataTrend(data) {
  return request({
    url: 'api/services/app/GpsSafetyStatistics/VehicleDrivingRiskTimeDataTrend',
    method: 'POST',
    total: data.total || 5,
    data
  })
}

export function getSafetyRanking(data) {
  return request({
    url: 'api/services/app/GpsSafetyStatistics/VehicleDrivingSafetyRanking',
    method: 'POST',
    total: data.total || 5,
    data
  })
}

export function getActiveSecurityWeekReport(data) {
  return request({
    url: `api/services/app/GpsSafetyStatistics/GetActiveSecurityWeekReport?Date=${data.curDate}&DptId=${data.dptId}`,
    data
  })
}


export function getActiveSecurityMonthReport(data) {
  return request({
    url: `api/services/app/GpsSafetyStatistics/GetActiveSecurityMonthReport?Date=${data.curDate}&DptId=${data.dptId}`,
    data
  })
}

export function getActiveSecurityDayReport(data) {
  return request({
    url: `/api/services/app/GpsSafetyStatistics/GetActiveSecurityDayReport?Date=${data.curDate}&DptId=${data.dptId}`,
    data
  })
}

export function DialogAbnormalTrack(data) {
  return request({
    url: 'api/services/app/GpsPosition/DialogAbnormalTrack',
    method: 'POST',
    data
  })
}