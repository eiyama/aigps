import request from '@/utils/request'

export function getDrivingStatictics(data) {
  return request({
    url: 'api/services/app/GpsStatictics/DrivingStatictics',
    method: 'POST',
    data
  })
}