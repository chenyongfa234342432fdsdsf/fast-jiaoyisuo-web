import { getV1C2cBalanceAllApiRequest } from '@/apis/assets/c2c'
import { baseAssetsStore } from '@/store/assets'
import { YapiGetV1C2cBalanceAllApiRequest } from '@/typings/yapi/C2cBalanceAllV1GetApi'

/**
 * 资产总览 - 查询 c2c 资产列表 all
 */
export const onGetC2cAssetsListAll = async (params: YapiGetV1C2cBalanceAllApiRequest) => {
  const { assetsModule } = baseAssetsStore.getState()
  const res = await getV1C2cBalanceAllApiRequest(params)
  // console.log('getV1C2cBalanceAllApiRequest=>', res.data)
  const { isOk, data } = res || {}
  const { list = [] } = data || {}

  if (!isOk || !data) return
  assetsModule.updateAssetsModule({ c2cAssetsListAll: list })
}
