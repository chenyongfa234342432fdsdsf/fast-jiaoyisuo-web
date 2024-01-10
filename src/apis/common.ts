import request, { MarkcoinRequest, MarkcoinResponse } from '@/plugins/request'
import { baseCommonStore } from '@/store/common'
import {
  YapiGetV1OpenapiComCodeGetCodeDetailListApiRequest,
  YapiGetV1OpenapiComCodeGetCodeDetailListData,
} from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'

/**
 * 获取数据字典列表
 * https://yapi.nbttfc365.com/project/44/interface/api/3595
 */
export const getCodeDetailList: MarkcoinRequest<
  Partial<YapiGetV1OpenapiComCodeGetCodeDetailListApiRequest>,
  YapiGetV1OpenapiComCodeGetCodeDetailListData[]
> = params => {
  return request({
    path: '/v1/openapi/com/code/getCodeDetailList',
    method: 'GET',
    params: {
      lanType: baseCommonStore.getState().locale,
      ...params,
    },
  })
}

/**
 * 批量获取数据字典列表
 * https://yapi.nbttfc365.com/project/44/interface/api/3715
 */
export const getCodeDetailListBatch = async (codeVals: string[], isUseFastPayApi?: boolean) => {
  const res: MarkcoinResponse<{
    [x: string]: {
      [y: string]: YapiGetV1OpenapiComCodeGetCodeDetailListData[]
    }
  }> = await request({
    path: '/v1/openapi/com/code/batchGetCodeDetailList',
    method: 'GET',
    params: {
      lanTypes: baseCommonStore.getState().locale,
      codeVals: codeVals.join(','),
    },
    isUseFastPayApi,
  })
  if (!res.isOk || !res.data) {
    return codeVals.map(() => [])
  }

  return codeVals.map(codeVal => {
    const result = res.data?.[codeVal]
    // 只取一种语言
    return Object.values(result || {})[0] || []
  })
}
