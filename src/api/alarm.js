import request from '@/utils/request'

export function getAlarmConfigByUserId() {
  return request({
    url: 'api/services/app/SmAlarmConfig/GetAlarmConfigByUserId',
    isLoading: true
  })
}

export function updateAlarmConfigByUserId(data) {
  return request({
    url: 'api/services/app/SmAlarmConfig/UpdateAlarmConfigByUserId',
    method: 'PUT',
    data
  })
}

export function getAlarmNew(data, isLoading) {
  return request({
    url: `api/services/app/GpsAlarmRecode/GetAlarmNew?VehTerminalNo=${data.vehTerminalNo}&Begin=${data.begin}&End=${data.end}&AlarmCategory=${data.alarmCategory}&AlarmDisplay=${data.alarmDisplay}&AlarmStatus=${data.state}&Duration=${data.duration}&Page=${data.curPage}&Limit=${data.pageSize}`,
    isLoading
  })
}

export function dealWithNew(data) { 
  return request({ 
    url: 'api/services/app/GpsAlarmRecode/DealWithNew', 
    method: 'POST',
    data
  })
}

export function HandleMultiAlarmNew(data) { 
  return request({ 
    url: 'api/services/app/GpsAlarmRecode/HandleMultiAlarmNew', 
    method: 'POST',
    data
  })
}


export function batchDealWithNew(data) {
  return request({
    url: 'api/services/app/GpsAlarmRecode/BatchDealWithNew',
    method: 'POST',
    data
  })
}

export function dealWithMultiNew(data) {
  return request({
    url: 'api/services/app/GpsAlarmRecode/DealWithMultiNew',
    method: 'POST',
    data
  })
}
