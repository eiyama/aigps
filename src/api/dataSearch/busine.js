import request from '@/utils/request'

export function getReportPosition(data) {
  return request({
    url: 'api/services/app/GpsPosition/GetReportPosition',
    method: 'POST',
    data
  })
}

export function getPowerExcel(opt) {
  return request({
    url: `api/services/app/GpsPosition/GetPowerExcel?VehTerminalNo=${opt.id}&Begin=${opt.begin}&End=${opt.end}`
  })
}

export function getTemperatureExcel(opt) {
  return request({
    url: `api/services/app/GpsPosition/GetTemperatureExcel?VehTerminalNo=${opt.id}&Begin=${opt.begin}&End=${opt.end}&Zero=0`
  })
}

export function getTirePress(opt) {
  return request({
    url: `api/services/app/GpsTirePress/GetAll?VehTerminalNo=${opt.id}&Begin=${opt.begin}&End=${opt.end}&Page=${opt.page}&Limit=${opt.limit}`
  })
}

export function getTirePressExcel(opt) {
  return request({
    url: `api/services/app/GpsTirePress/GetExcel?VehTerminalNo=${opt.id}&Begin=${opt.begin}&End=${opt.end}`
  })
}

export function getDCEnergyMeterData(data) {
  return request({
    url: 'api/services/app/GpsPosition/GetDCEnergyMeterData',
    method: 'POST',
    data
  })
}

export function getGyroscopeData(opt) {
  return request({
    url: `api/services/app/GpsPosition/GetGyroscopeData?VehTerminalNo=${opt.id}&Begin=${opt.begin}&End=${opt.end}&Page=${opt.page}&Limit=${opt.limit}&TotalCount=${opt.totalCount}&PerTableCount=${opt.perTableCount}`
  })
}

export function getMeterStatistics(data) {
  return request({
    url: 'api/services/app/GpsPosition/GetDCEnergyMeterStatisticsData',
    method: 'POST',
    data
  })
}

export function getInsuranceData(opt) {
  return request({
    url: `api/services/app/GpsInsurance/GetInsuranceData?VehNum=${opt.vehNum}&InsuranceType=${opt.type}&Sorting=${opt.sorting}&SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxCount}`
  })
}

export function getMaintenanceData(opt) {
  return request({
    url: `api/services/app/GpsMaintenance/GetMaintenanceData?VehNum=${opt.vehNum}&MaintenanceType=${opt.type}&Sorting=${opt.sorting}&SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxCount}`
  })
}
