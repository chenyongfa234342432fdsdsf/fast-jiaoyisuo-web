import {
  getFixedProducts,
  getFlexibleProducts,
  getProductDetail,
  getUserLeftQuota,
  postProductPurchase,
} from '@/apis/finance'
import { generateCommonApiAndStoreFormat } from '@/helper/store'
import { YapiGetFinanceProductFlexibleDetailApiRequest } from '@/typings/yapi-old/FinanceProductFlexibleDetailGetApi'
import { YapiPostFinanceProductFlexiblePurchaseApiRequest } from '@/typings/yapi-old/FinanceProductFlexiblePurchasePostApi'
import { YapiDtoFinFixedProductDTO, YapiDtoFinFlexibleProductDTO } from '@/typings/yapi-old/FinanceProductIndexGetApi'
import { YapiDtoFinUserLeftQuota } from '@/typings/yapi-old/FinanceProductUserleftquotaGetApi'
import { StoreApi } from 'zustand'
import { EarnStoreNames } from '../constant'

type FinanceEarnStore = {
  // api responses
  [EarnStoreNames.FlexibleList]: YapiDtoFinFlexibleProductDTO[]
  [EarnStoreNames.FixedList]: YapiDtoFinFixedProductDTO[]
  [EarnStoreNames.ProductDetail]: YapiDtoFinFlexibleProductDTO
  [EarnStoreNames.CurrentAsset]: YapiDtoFinUserLeftQuota

  // api requests
  getFlexibleProducts: () => void
  getFixedProducts: () => void
  getProductDetail: (id: ProductId) => void
  getUserLeftQuota: (id: ProductId) => void
  getDetailAndQuota: (id: ProductId) => void
  purchaseProduct: (params: ProductPurchaseProp) => void
}

type ProductId = Pick<YapiGetFinanceProductFlexibleDetailApiRequest, 'productId'>
type ProductPurchaseProp = Required<
  Pick<YapiPostFinanceProductFlexiblePurchaseApiRequest, 'productId' | 'purchaseAmount'>
>

function getEarnStore(
  set: StoreApi<FinanceEarnStore>['setState'],
  get: StoreApi<FinanceEarnStore>['getState']
): FinanceEarnStore {
  const earnApiAndStore = generateCommonApiAndStoreFormat(set)
  return {
    ...(earnApiAndStore(
      EarnStoreNames.FlexibleList,
      getFlexibleProducts,
      { pageSize: '5' },
      res => res.data?.data ?? []
    ) as unknown as Pick<FinanceEarnStore, 'getFlexibleProducts' | EarnStoreNames.FlexibleList>),

    ...(earnApiAndStore(
      EarnStoreNames.FixedList,
      getFixedProducts,
      { pageSize: '5' },
      res => res.data?.data ?? []
    ) as unknown as Pick<FinanceEarnStore, 'getFixedProducts' | EarnStoreNames.FixedList>),

    ...(earnApiAndStore(
      EarnStoreNames.ProductDetail,
      getProductDetail,
      {},
      res => res.data!.data! ?? []
    ) as unknown as Pick<FinanceEarnStore, 'getProductDetail' | EarnStoreNames.ProductDetail>),

    ...(earnApiAndStore(
      EarnStoreNames.CurrentAsset,
      getUserLeftQuota,
      {},
      res => res.data!.data! ?? []
    ) as unknown as Pick<FinanceEarnStore, 'getUserLeftQuota' | EarnStoreNames.CurrentAsset>),

    async getDetailAndQuota(id: ProductId) {
      await Promise.all([get().getProductDetail(id), get().getUserLeftQuota(id)])
    },

    async purchaseProduct(params: ProductPurchaseProp) {
      try {
        const res = await postProductPurchase(params)
        if (res.isOk) {
          // purchase successful
        }
      } catch (err) {
        // purchase failed
        console.log(err)
      }
    },
  }
}

export { FinanceEarnStore, getEarnStore }
