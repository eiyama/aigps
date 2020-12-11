import request from '@/utils/request'


export function getGpsEvent(data) {
  return request({
    url: 'api/services/app/GpsEvent/GpsEvent',
    method: 'POST',
    data
  })
}

export function getVolumeEvent(data) {
  return request({
    url: 'api/services/app/GpsEvent/VolumeEvent',
    method: 'POST',
    data
  })
}

export function getWeightEvent(data) {
  return request({
    url: 'api/services/app/GpsEvent/WeightEvent',
    method: 'POST',
    data
  })
}
