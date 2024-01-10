import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1C2cOrderGetsPageByApiRequest,
  YapiGetV1C2cOrderGetsPageByApiResponse,
} from '@/typings/yapi/C2cOrderGetsPageByV1GetApi'

/**
 * [获取订单列表↗](https://yapi.nbttfc365.com/project/73/interface/api/4967)
 * */
export const getV1C2cOrderGetsPageByApiRequest: MarkcoinRequest<
  YapiGetV1C2cOrderGetsPageByApiRequest,
  YapiGetV1C2cOrderGetsPageByApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/order/getsPageBy',
    method: 'GET',
    params,
  })
}

export const c2cHrApis = {
  getTableList: getV1C2cOrderGetsPageByApiRequest,
}
