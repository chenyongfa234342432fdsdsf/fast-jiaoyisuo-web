import Request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1HomeColumnGetListApiRequest,
  YapiGetV1HomeColumnGetListApiResponse,
} from '@/typings/yapi/HomeColumnGetListV1GetApi'
import {
  YapiGetV1HomeWebsiteGetDataApiRequest,
  YapiGetV1HomeWebsiteGetDataApiResponse,
} from '@/typings/yapi/HomeWebsiteGetDataV1GetApi'

export const getFooterApiData: MarkcoinRequest<
  YapiGetV1HomeColumnGetListApiRequest,
  YapiGetV1HomeColumnGetListApiResponse['data']
> = params => {
  return Request({
    path: '/v1/home/column/getList',
    method: 'GET',
    params,
  })
}

export const getBasicWebApiData: MarkcoinRequest<
  YapiGetV1HomeWebsiteGetDataApiRequest,
  YapiGetV1HomeWebsiteGetDataApiResponse['data']
> = params => {
  return Request({
    path: '/v1/home/website/getData',
    method: 'GET',
    params,
  })
}
