/**
 * c2c-广告
 */
import create from 'zustand'

import { createTrackedSelector } from 'react-tracked'
import { subscribeWithSelector, devtools } from 'zustand/middleware'
import { getCodeDetailListBatch } from '@/apis/common'
import produce from 'immer'
import {
  AdvertisingDirectionTypeEnum,
  AreaTransactionTypeEnum,
  AdvertisingDictionaryTypeEnum,
  adCodeDictionaryEnum,
} from '@/constants/c2c/advertise'
import {
  AdvertCoincidenceListResp,
  AdvertMerchantInfoResp,
  AdvertDetailResp,
  IAdvertPaymentList,
  IAdvertReceiptList,
  C2CAdvertTableData,
} from '@/typings/api/c2c/advertise/post-advertise'
import { C2CAreaListResp, C2CCoinListResp, C2CMainTypeListResp } from '@/typings/api/c2c/common'
import { IStoreEnum } from '@/typings/store/common'
import ws from '@/plugins/ws'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@nbit/chart-utils'

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  return {
    /** 发布广告单 */
    advertiseForm: {
      /** 交易区 */
      currency: {} as C2CAreaListResp,
      /** 币种 */
      coin: {} as C2CCoinListResp,
      /** 广告方向 */
      advertDirectCd: <AdvertisingDirectionTypeEnum | null>null,
      /** 交易类型 */
      dealTypeCd: <AreaTransactionTypeEnum | null>null,
    },
    updateAdvertiseForm: (values: any) => {
      set((store: IStore) => {
        return produce(store, _store => {
          const newAdvertiseForm = { ..._store.advertiseForm, ...values }
          _store.advertiseForm = newAdvertiseForm
        })
      })
    },
    /** 广告单详情 */
    /** 广告单详情 */
    advertiseDetails: {
      loading: false,
      details: {} as AdvertDetailResp,
    },
    updateAdvertiseDetails: values => {
      set((store: IStore) => {
        return produce(store, _store => {
          const newAdvertiseDetail = { ..._store.advertiseDetails, ...values }
          _store.advertiseDetails = newAdvertiseDetail
        })
      })
    },
    // TODO 待接入真实数据
    /** 发布广告单 - 下拉选项数据 */
    postOptions: {
      // 主链类型列表
      chainAddressList: <C2CMainTypeListResp[]>[],
      // 选中的主链类型列表
      chainAddressListSelected: <C2CMainTypeListResp[]>[],
      // 支付方式列表
      paymentList: <IAdvertPaymentList[]>[],
      // 选中的支付类型
      paymentListSelected: <string[]>[],
      // 交易区下收款账号列表
      receiptList: <IAdvertReceiptList[]>[],
      /** 交易区列表 */
      tradingAreaList: <C2CAreaListResp[]>[],
      /** 币种列表 */
      coinList: <C2CCoinListResp[]>[],
      // 所有币种列表
      allCoinList: <C2CCoinListResp[]>[],
      /** 广告重合度列表 */
      coincidenceData: <AdvertCoincidenceListResp>{},
      // 商家状态（信誉额度）
      merchantInfo: <AdvertMerchantInfoResp>{},
    },
    updatePostOptions: (values: any) => {
      set((store: IStore) => {
        return produce(store, _store => {
          const newPostOptions = { ..._store.postOptions, ...values }
          _store.postOptions = newPostOptions
        })
      })
    },
    loading: false,
    updateLoading: (newLoading: boolean) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.loading = newLoading
        })
      })
    },
    /** 广告数据字典 */
    advertiseEnums: {
      /** 认证等级 */
      certificationLevelEnum: {
        codeKey: AdvertisingDictionaryTypeEnum.certificationLevel,
        enums: [],
      } as IStoreEnum,
      /** 支付类型 */
      paymentTypeEnum: {
        codeKey: AdvertisingDictionaryTypeEnum.paymentType,
        enums: [],
      } as IStoreEnum,
      /** 广告方向 */
      advertDirectEnum: {
        codeKey: AdvertisingDictionaryTypeEnum.advertDirect,
        enums: [],
      } as IStoreEnum,
      /** 广告交易类型 */
      advertDealTypeEnum: {
        codeKey: AdvertisingDictionaryTypeEnum.advertDealType,
        enums: [],
      } as IStoreEnum,
      /** 广告状态 */
      advertisingStatus: {
        codeKey: AdvertisingDictionaryTypeEnum.advertisingStatus,
        enums: [],
      } as IStoreEnum,
      /** 广告交易类型 */
      detailAdvertDealTypeEnum: {
        codeKey: AdvertisingDictionaryTypeEnum.detailAdvertDealType,
        enums: [],
      } as IStoreEnum,
      /** 支付方式颜色 */
      c2cPaymentColorEnum: {
        codeKey: AdvertisingDictionaryTypeEnum.c2cPaymentColor,
        enums: [],
      } as IStoreEnum,
    },
    /** 获取广告数据字典 */
    async fetchAdvertiseEnums() {
      const state: IStore = get()
      const data = await getCodeDetailListBatch(Object.values(state.advertiseEnums).map(item => item.codeKey))
      set(
        produce((draft: IStore) => {
          const items = Object.values(draft.advertiseEnums)
          items.forEach((item, index) => {
            item.enums = data[index].map(enumValue => {
              return {
                label: enumValue.codeKey,
                value:
                  parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
                    ? parseInt(enumValue.codeVal, 10)
                    : enumValue.codeVal,
              }
            })
          })
        })
      )
    },
    adCodeDictionary: {},
    getAdCodeDictionary: async () => {
      const res = await getCodeDetailListBatch(Object.values(adCodeDictionaryEnum))
      const resMapped = Object.values(adCodeDictionaryEnum).reduce((prev, curr, index) => {
        const processed = res[index].reduce((prev, cur) => {
          prev[cur.codeVal] = cur
          return prev
        }, {})
        prev[curr] = processed
        return prev
      }, {})
      set(
        produce((draft: IStore) => {
          draft.adCodeDictionary = resMapped
        })
      )
    },
    currentAdvert: {} as C2CAdvertTableData,
    setCurrentAdvert: (advert: C2CAdvertTableData) => {
      set(
        produce((draft: IStore) => {
          draft.currentAdvert = advert
        })
      )
    },
    isTradeFormOpen: false,
    toggleTradeForm: () => {
      set(
        produce((draft: IStore) => {
          draft.isTradeFormOpen = !draft.isTradeFormOpen
        })
      )
    },
    /** 订阅 - c2c 历史订单 */
    wsC2COrderSubscribe: callbackFn => {
      ws.subscribe({
        subs: { biz: WsBizEnum.c2c, type: WsTypesEnum.c2corder },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.increment,
        callback: callbackFn,
      })
    },
  }
}

const baseC2CAdvertiseStore = create(devtools(subscribeWithSelector(getStore), { name: 'c2c-advertise-store' }))
const useC2CAdvertiseStore = createTrackedSelector(baseC2CAdvertiseStore)

export { useC2CAdvertiseStore, baseC2CAdvertiseStore }
