import request from '@/utils/request'


export function getFindCardInfo(data) {
  return request({
    url: 'api/services/app/GpsCard/FindCardInfo',
    method: 'POST',
    data
  })
}

export function getCardListPage(data) {
  return request({
    url: `api/services/app/GpsCard/GetCardListPage?CurrentPage=${data.curPage}&PageSize=${data.limit}&Iccid=${data.iccid}&Imsi=${data.imsi}&Msisdn=${data.msisdn}`,
  })
}


export function getFindCardMonthUseDataInfo(data) {
  return request({
    url: 'api/services/app/GpsCard/FindCardMonthUseDataInfo',
    method: 'POST',
    data
  })
}

export function getCardBeforeSixMonthInfo(data) {
  return request({
    url: 'api/services/app/GpsCard/CardBeforeSixMonthInfo',
    method: 'POST',
    data
  })
}

export function getCardRechargeInfo(data) {
  return request({
    url: 'api/services/app/GpsCard/CardRechargeInfo',
    method: 'POST',
    data
  })
}

export function getSms90DaysCount(data) {
  return request({
    url: 'api/services/app/GpsCard/Sms90DaysCount',
    method: 'POST',
    data
  })
}

export function getSms90DaysContent(data) {
  return request({
    url: 'api/services/app/GpsCard/Sms90DaysContent',
    method: 'POST',
    data
  })
}

export function getFindPools() {
  return request({
    url: 'api/services/app/GpsCard/FindPools',
    method: 'POST',
    data: ''
  })
}

export function getPoolInfo(poolNumber) {
  return request({
    url: `api/services/app/GpsCard/GetPoolInfo?poolNumber=${poolNumber}`
  })
}

export function getSMSContent(data) {
  return request({
    url: `api/services/app/GpsCard/GetSMSContent?YearMonth=${data.yearMonth}&Iccid=${data.iccid}&Imsi=${data.imsi}&Msisdn=${data.msisdn}`
  })
}

export function getCarTraffic() {
  return request({
    url: 'api/services/app/GpsCard/GetCarTraffic'
  })
}
