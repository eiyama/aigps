import request from '@/utils/request'

export function getAllFull() {
  return request({
    url: 'api/services/app/SmDeviceType/GetAllFull'
  })
}

export function getAllVehicle(data) {
  return request({
    url: 'api/services/app/GpsVehicle/AllVehicle',
    method: 'POST',
    data
  })
}

export function getAllDriver() {
  return request({
    url: 'api/services/app/GpsDriver/GetAll'
  })
}

export function getSearch(opt) {
  return request({
    url: `api/services/app/GpsVehicle/GetSearch?Key=${opt.val}&Take=${opt.take}`,
    isLoading: true
  })
}

export function addVehicle(data) {
  return request({
    // url: 'api/services/app/GpsVehicle/Create',
    url: 'api/services/app/GpsVehicle/CreateNew',
    method: 'POST',
    data
  })
}

export function upVehicle(data, isRoot) {
  // const url = isRoot ? 'api/services/app/GpsVehicle/Update' : 'api/services/app/GpsVehicle/UpdateSimple';
  const url = isRoot ? 'api/services/app/GpsVehicle/UpdateNew' : 'api/services/app/GpsVehicle/UpdateSimple';
  return request({
    url,
    method: 'PUT',
    data
  })
}

export function delVehicle(ids) {
  return request({
    url: `api/services/app/GpsVehicle/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}

export function exportVehicle(opt) {
  return request({
    url: `api/services/app/GpsVehicle/GetVehicleExcel?vehExpired=${opt.vehExpired}&Search=${opt.search}`
  })
}

export function uploadVehicle(data, opt) {
  return request({
    url: `api/services/app/GpsVehicle/Import?DptID=${opt.dptId}&DeviceTypeID=${opt.deviceTypeId}&Expired=${opt.expired}`,
    method: 'POST',
    data
  })
}

export function getDriverAll(opt) {
  return request({
    url: `api/services/app/GpsDriver/GetAll?SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxResultCount}`
  })
}

export function getDriverAllNew(opt) {
  const query = opt ? opt.isAll ? `?IsAll=${opt.isAll}` : `?SkipCount=${opt.skipCount}&MaxResultCount=${opt.maxResultCount}&DrvName=${opt.driveName}` : ''
  return request({
    url: `api/services/app/GpsDriver/GetAllNew${query}`
  })
}

export function addDriver(data) {
  return request({
    url: 'api/services/app/GpsDriver/AddDriveNew',
    method: 'POST',
    data
  })
}

export function upDriver(data) {
  return request({
    url: 'api/services/app/GpsDriver/UpdateDriveNew',
    method: 'PUT',
    data
  })
}

export function delDriver(ids) {
  return request({
    url: `api/services/app/GpsDriver/DeleteMore?input=${ids}`,
    method: 'DELETE'
  })
}

export function getDriveImage(name) {
  return request({
    url: `api/services/app/GpsDriver/GetDriveImage?DriveName=${name}`
  })
}
