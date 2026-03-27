import request from '@/utils/request'

export function login(code,isInsideApp = true,corpId = '',access_token='',userId='') {
  return request({
    url: !isInsideApp?'/api/DingDing/ThirdPartyAccount/Login': '/api/DingDing/Account/DDLogin',
    method: 'get',
    params: 
    isInsideApp?  {  
      code,
      corpId
    }:{
      code,
      corpId,
      access_token,
      userId
    }
  })
}

