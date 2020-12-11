import request from '@/utils/request'

export function home(data) {
  return request({
    url: 'api/services/app/GpsHome/Home',
    method: 'POST',
    data
  })
}

export function homeNew(data) {
  return request({
    url: 'api/services/app/GpsHomeNew/Home',
    method: 'POST',
    data
  })
}

export function getOnLineRate() {
  return request({
    url: 'api/services/app/GpsHome/GetOnLineRate'
  })
}
