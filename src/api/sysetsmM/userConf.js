import request from '@/utils/request'

export function upLogo(data) {
  return request({
    url: 'api/services/app/SmUserConfig/SetCompanyLogo',
    method: 'POST',
    data
  })
}