import request from '@/utils/request'


export function getFanceAlarm(data) {
  return request({
    url: 'api/services/app/GpsAlarmRecode/FanceAlarmStatisticRecode',
    method: 'POST',
    data
  })
}

export function getAlarmRecode(data) {
  return request({
    url: 'api/services/app/GpsAlarmRecode/AlarmRecodeNew',
    method: 'POST',
    data
  })
}


