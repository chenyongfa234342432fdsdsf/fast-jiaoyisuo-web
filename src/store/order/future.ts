import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { IFutureConfig, IPerpetualFuture } from '@/typings/api/future/common'
import { IFutureHoldingOrderItem, IFutureOrderItem, IQueryFutureOrderListReq } from '@/typings/api/order'
import { FutureTradeUnitEnum } from '@/constants/future/trade'
import futureWs from '@/plugins/ws/futures'
import { WsTypesEnum, WsBizEnum } from '@/constants/ws'
import { ISubscribeParams } from '@/plugins/ws/types'
import { queryFutureOrderList } from '@/apis/order'
import {
  EntrustTypeEnum,
  FutureNormalOrderStatusEnum,
  FutureNormalOrderStatusParamsCompositionEnum,
  FutureNormalOrderTypeIndEnum,
  FutureOrderDirectionEnum,
  FutureOrderStopLimitEntrustTypeEnum,
  FutureOrderStopLimitTriggerTypeIndEnum,
  FuturePlanOrderStatusEnum,
  FuturePlanOrderStatusParamsCompositionEnum,
  FutureStopLimitOrderStatusEnum,
  FutureStopLimitOrderStatusParamsCompositionEnum,
  getFutureNormalOrderStatusEnumName,
  getFutureNormalOrderTypeIndEnumName,
  getFutureNormalOrderTypeIndEnumNameWithSuffix,
  getFutureOrderDirectionEnumName,
  getFutureOrderGeneralEntrustTypeWithSuffix,
  getFuturePlanOrderGeneralEntrustTypeWithSuffix,
  getFuturePlanOrderStatusEnumName,
  getFutureStopLimitOrderStatusEnumName,
  OrderTabTypeEnum,
} from '@/constants/order'
import { calcHoldingOrder, enumValuesToOptions } from '@/helper/order'
import { fetchStoreEnums, mergeStateFromCache } from '@/helper/store'
import { IStoreEnum } from '@/typings/store/common'
import { t } from '@lingui/macro'
import {
  FutureOrderStopLimitDetailDisplayStatusEnum,
  getFutureOrderStopLimitDetailDisplayStatusEnum,
} from '@/constants/order/future'
import { getFutureOrderSettingsFromCache, setFutureOrderSettingsToCache } from '@/helper/cache'
import { getFutureOrderFundingFeeLogTypeEnumNames } from '@/constants/future/funding-fee'
import { subscribeFutureOrders } from '@/helper/order/future'
import { createOrderSettings } from './spot'

export type IBaseOrderFutureStore = ReturnType<typeof getBaseStore>

let subscribed = false

function getOrderEnumsConfig() {
  return {
    orderStatus: {
      codeKey: 'entrust_status_cd',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(Object.values(FutureNormalOrderStatusEnum), getFutureNormalOrderStatusEnumName),
    } as IStoreEnum,
    planOrderStatus: {
      codeKey: 'web_FuturePlanOrderStatusCd',
      enums: [],
      getDefault: () => enumValuesToOptions(Object.values(FuturePlanOrderStatusEnum), getFuturePlanOrderStatusEnumName),
    } as IStoreEnum,
    stopLimitOrderStatus: {
      codeKey: 'stopLimitOrderStatusCd',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(Object.values(FutureStopLimitOrderStatusEnum), getFutureStopLimitOrderStatusEnumName),
    } as IStoreEnum,
    orderStatusInFilters: {
      codeKey: 'web_FutureOrderStatusInFilters',
      enums: [],
      getDefault: () => [
        {
          label: t`features_orders_order_columns_spot_5101086`,
          value: FutureNormalOrderStatusParamsCompositionEnum.settled,
        },
        {
          label: t`order.constants.status.partlyCanceled`,
          value: FutureNormalOrderStatusParamsCompositionEnum.partlyCanceled,
        },
        {
          label: t`order.constants.status.canceled`,
          value: FutureNormalOrderStatusParamsCompositionEnum.canceled,
        },
      ],
    } as IStoreEnum,
    planOrderStatusInFilters: {
      codeKey: 'web_FutureTriggerOrderStatusInFilters',
      enums: [],
      getDefault: () => [
        {
          label: t`features_orders_order_columns_spot_5101087`,
          value: FuturePlanOrderStatusParamsCompositionEnum.triggered,
        },
        {
          label: t`order.constants.status.canceled`,
          value: FuturePlanOrderStatusParamsCompositionEnum.canceled,
        },
      ],
    } as IStoreEnum,
    stopLimitOrderStatusInFilters: {
      codeKey: 'web_FutureStrategyOrderStatusInFilters',
      enums: [],
      getDefault: () => [
        {
          label: t`features/orders/order-columns/future-4`,
          value: FutureStopLimitOrderStatusParamsCompositionEnum.triggered,
        },
        {
          label: t`order.constants.status.canceled`,
          value: FutureStopLimitOrderStatusParamsCompositionEnum.canceled,
        },
      ],
    } as IStoreEnum,
    orderDirection: {
      codeKey: 'futureSideInd',
      enums: [],
      getDefault: () => enumValuesToOptions(Object.values(FutureOrderDirectionEnum), getFutureOrderDirectionEnumName),
    } as IStoreEnum,
    // 和下面的这个区别是，限价，限价委托
    entrustType: {
      codeKey: 'web_FutureEntrustType',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(Object.values(FutureNormalOrderTypeIndEnum), getFutureNormalOrderTypeIndEnumName),
    } as IStoreEnum,
    entrustTypeWithSuffix: {
      codeKey: 'web_FutureEntrustTypeWithSuffix',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(Object.values(FutureNormalOrderTypeIndEnum), getFutureNormalOrderTypeIndEnumNameWithSuffix),
    } as IStoreEnum,
    planEntrustTypeWithSuffix: {
      codeKey: 'web_FutureTriggerEntrustTypeWithSuffix',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(
          Object.values(FutureOrderStopLimitEntrustTypeEnum),
          getFuturePlanOrderGeneralEntrustTypeWithSuffix
        ),
    } as IStoreEnum,
    stopLimitEntrustTypeWithSuffix: {
      codeKey: 'web_FutureStopLimitEntrustTypeWithSuffix',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(
          Object.values(FutureOrderStopLimitEntrustTypeEnum),
          getFutureOrderGeneralEntrustTypeWithSuffix
        ),
    } as IStoreEnum,
    fundingFeeTypeWithSuffix: {
      codeKey: 'web_FutureFundingFeeTypeWithSuffix',
      enums: [],
      getDefault: getFutureOrderFundingFeeLogTypeEnumNames,
    } as IStoreEnum,
    marginLogTypeWithSuffix: {
      codeKey: 'web_FutureMarginLogTypeWithSuffix',
      enums: [],
    } as IStoreEnum,
    /** 触发价格类型 */
    triggerPriceTypeIndWithSuffix: {
      codeKey: 'web_FutureTriggerPriceTypeIndTypeWithSuffix',
      enums: [],
      getDefault: () => [
        {
          label: t`constants_order_5101075`,
          value: FutureOrderStopLimitTriggerTypeIndEnum.new,
        },
        {
          label: t`future.funding-history.index-price.column.mark-price`,
          value: FutureOrderStopLimitTriggerTypeIndEnum.mark,
        },
      ],
    } as IStoreEnum,
    /** 止盈止损详情展示状态 */
    stopLimitDetailDisplayStatus: {
      codeKey: 'web_FutureStopLimitDetailDisplayStates',
      enums: [],
      getDefault: () =>
        enumValuesToOptions(
          Object.values(FutureOrderStopLimitDetailDisplayStatusEnum),
          getFutureOrderStopLimitDetailDisplayStatusEnum
        ),
    } as IStoreEnum,
  }
}

function createOnWs(set, get) {
  return {
    onFundRatePush(data: any) {
      set(
        produce((draft: IBaseOrderFutureStore) => {
          draft.fundRatesList = data.fundRates
        })
      )
    },
    onAssetsPush(data: any) {
      set(
        produce((draft: IBaseOrderFutureStore) => {
          draft.assetsCoinList = data.data
        })
      )
    },
    onTickerPush(data: any[]) {
      set(
        produce((draft: IBaseOrderFutureStore) => {
          // TODO: 原版这里有一堆延迟处理和当前选择交易对的处理，这里暂时不做
          draft.quotationList = data[0].tickers
        })
      )
    },
    onPositionPush() {
      const state: IBaseOrderFutureStore = get()
      // 因为对订单有完善的数据处理，重新拉取会好一些，用户持仓也不会频繁变动
      state.fetchHoldingOrders()
    },
    createOnEntrustPush(entrustType: EntrustTypeEnum) {
      return () => {
        const state: IBaseOrderFutureStore = get()
        state.fetchSingleModuleOpenOrders({
          entrustType,
        })
      }
    },
  }
}

function getBaseStore(set, get) {
  const baseState = {
    // TODO: 这里是什么类型由交易定义，订单这里先用着，后面改
    currentFuture: {} as IPerpetualFuture,
    currentFutureConfig: {} as IFutureConfig,
    /** 仓位列表，也就是当前持仓订单列表 */
    positionList: [] as IFutureHoldingOrderItem[],
    openOrderModule: {
      normal: {
        data: [] as any as IFutureOrderItem[],
        total: 0,
      },
      plan: {
        data: [] as any as IFutureOrderItem[],
        total: 0,
      },
      stopLimit: {
        data: [] as any as IFutureOrderItem[],
        total: 0,
      },
    },
    /** 行情列表，含有所有币対最新价 */
    quotationList: [] as any[],
    /** 资产币种列表 */
    assetsCoinList: [] as any[],
    /** 标记价格、费率列表 */
    fundRatesList: [] as any[],
    // TODO: 具体值和存储待定
    contractUnit: {
      goldStandard: FutureTradeUnitEnum.a,
      currencyUnit: FutureTradeUnitEnum.a,
    },
    subscribe() {
      if (subscribed) {
        return () => {}
      }
      const { onFundRatePush, onAssetsPush, onTickerPush, onPositionPush, createOnEntrustPush } = createOnWs(set, get)
      const unsubscribeFn = subscribeFutureOrders(createOnEntrustPush)
      subscribed = true
      return () => {
        subscribed = false
        unsubscribeFn()
      }
    },
    async fetchHoldingOrders() {
      const res = await queryFutureOrderList({
        tab: OrderTabTypeEnum.holdings,
      })
      if (!res.isOk || !res.data) {
        return
      }
      const orders: IFutureHoldingOrderItem[] = res.data.list as any[]
      set(
        produce((draft: IBaseOrderFutureStore) => {
          draft.positionList = orders.map(item => {
            return { ...item, ...calcHoldingOrder(item, draft) }
          }) as any
        })
      )
    },
    resetOpenModule() {
      set(
        produce((draft: IBaseOrderFutureStore) => {
          draft.openOrderModule = {
            normal: {
              data: [],
              total: 0,
            },
            plan: {
              data: [],
              total: 0,
            },
            stopLimit: {
              data: [],
              total: 0,
            },
          }
        })
      )
    },
    async fetchSingleModuleOpenOrders(
      { tradeId, entrustType }: { tradeId?: string; entrustType: EntrustTypeEnum } = {
        entrustType: EntrustTypeEnum.normal,
      }
    ) {
      const params: IQueryFutureOrderListReq = {
        pageSize: 1000 as any,
        entrustType,
        tab: OrderTabTypeEnum.current,
      }
      const res = await queryFutureOrderList(params)
      const moduleName = {
        [EntrustTypeEnum.normal]: 'normal',
        [EntrustTypeEnum.plan]: 'plan',
        [EntrustTypeEnum.stopLimit]: 'stopLimit',
      }[entrustType]
      set(
        produce((draft: IBaseOrderFutureStore) => {
          draft.openOrderModule[moduleName] = {
            data: ((res.data && res.data.list) as any) || [],
            total: (res.data && res.data.total!) || 0,
          }
        })
      )
    },
    async fetchOpenOrders({ tradeId }: { tradeId?: string } = {}) {
      const state: IBaseOrderFutureStore = get()
      state.fetchSingleModuleOpenOrders({ tradeId, entrustType: EntrustTypeEnum.normal })
      state.fetchSingleModuleOpenOrders({ tradeId, entrustType: EntrustTypeEnum.plan })
      state.fetchSingleModuleOpenOrders({ tradeId, entrustType: EntrustTypeEnum.stopLimit })
    },
    /** 订单枚举，从后端获取的数据字典 */
    orderEnums: getOrderEnumsConfig(),
    updateOrderEnums(enums: Record<string, IStoreEnum>) {
      set((draft: IBaseOrderFutureStore) => {
        const state: IBaseOrderFutureStore = {
          ...draft,
          orderEnums: enums as any,
        }

        return state
      })
    },
    setDefaultEnums() {
      // 规避初始化时，多语言无法载入的问题
      const state: IBaseOrderFutureStore = get()
      state.updateOrderEnums(
        produce(state.orderEnums, draft => {
          const items = Object.values(draft)
          items.forEach(item => {
            item.enums = item.getDefault?.() || []
          })
        })
      )
    },
    async fetchOrderEnums() {
      const state: IBaseOrderFutureStore = get()
      const data = await fetchStoreEnums(state.orderEnums)
      state.updateOrderEnums(data)
    },
    ...createOrderSettings(set),
  }

  mergeStateFromCache(baseState, getFutureOrderSettingsFromCache())

  return baseState
}
function getStore(set, get) {
  return {
    ...getBaseStore(set, get),
  }
}

const baseOrderFutureStore = create(getStore)

baseOrderFutureStore.subscribe(state => {
  setFutureOrderSettingsToCache(state)
})

const useOrderFutureStore = createTrackedSelector(baseOrderFutureStore)

export { useOrderFutureStore, baseOrderFutureStore }
