import { batchCancelFutureOrder, cancelAllSpotNormalOrder, cancelAllSpotPlanOrder } from '@/apis/order'
import { EntrustTypeEnum } from '@/constants/order'
import { getIsLogin } from '@/helper/auth'
import {
  IBaseOrderItem,
  IFutureOrderItem,
  IOrderCommonReq,
  ISpotBatchCancelOrderReq,
  ISpotPlanOrderItem,
} from '@/typings/api/order'
import { t } from '@lingui/macro'
import { Message, Modal } from '@nbit/arco'
import { useMount } from 'ahooks'
import { useEffect, useState } from 'react'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { confirmToPromise } from '@/helper/order'
import { getPeriodDayTime } from '@/helper/date'
import { useUserStore } from '@/store/user'
import { useOrderFutureStore } from '@/store/order/future'
import { UserFuturesTradeStatus } from '@/constants/user'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import TipContent, { modalWrapperClassName } from '@/components/tip-content'
import Icon from '@/components/icon'
import { useFuturesStore } from '@/store/futures'

/**
 * 获取现货当前委托标题和订阅相关模块
 */
export function useSpotOpenOrders(
  // eslint-disable-next-line default-param-last
  defaultEntrustType = EntrustTypeEnum.normal,
  currentTradeId?: any,
  onlyCurrentSymbol = false
) {
  const [entrustType, setEntrustType] = useState(defaultEntrustType)
  const {
    subscribe,
    fetchOpenOrders,
    resetOpenModule,
    setDefaultEnums,
    fetchPairList,
    openOrderModule,
    fetchOrderEnums,
  } = useBaseOrderSpotStore()
  const { isLogin } = useUserStore()

  useEffect(() => {
    if (isLogin) {
      fetchOpenOrders({
        tradeId: currentTradeId,
      })
    } else {
      resetOpenModule()
    }
    return subscribe()
  }, [isLogin])
  useMount(() => {
    setDefaultEnums()
    fetchOrderEnums()
    fetchPairList()
  })
  function getTabTitle(name: string, count: number) {
    return `${name}${isLogin ? `(${count})` : ''}`
  }
  function sort(a: IBaseOrderItem | ISpotPlanOrderItem, b: IBaseOrderItem | ISpotPlanOrderItem) {
    if (a.tradeId === currentTradeId) {
      return b.tradeId === currentTradeId ? 0 : -1
    }
    return b.tradeId === currentTradeId ? 1 : 0
  }
  const displayNormalOrders = openOrderModule.normal.data
    .filter(order => {
      if (onlyCurrentSymbol) {
        return order.tradeId === currentTradeId
      }
      return true
    })
    .sort(sort)
  const displayPlanOrders = openOrderModule.plan.data
    .filter(order => {
      if (onlyCurrentSymbol) {
        return order.tradeId?.toString() === currentTradeId.toString()
      }
      return true
    })
    .sort(sort)
  const openTotal = openOrderModule.normal.total + openOrderModule.plan.total
  const openTitle = getTabTitle(t`order.tabs.current`, openTotal)
  const isNormalEntrust = entrustType === EntrustTypeEnum.normal
  const showCancelAll = isNormalEntrust ? openOrderModule.normal.total > 0 : openOrderModule.plan.total > 0
  const cancelAll = async (params: ISpotBatchCancelOrderReq) => {
    const typeText = isNormalEntrust ? t`order.constants.placeOrderType.normal` : t`order.constants.placeOrderType.plan`
    const done = await confirmToPromise(Modal.confirm, {
      className: modalWrapperClassName,
      closable: true,
      closeIcon: <Icon name="close" className="text-xl" hasTheme />,
      content: (
        <TipContent>
          {t({
            id: 'hooks_features_order_5101090',
            values: {
              0: typeText,
            },
          })}
        </TipContent>
      ),
    })
    const res = await (isNormalEntrust ? cancelAllSpotNormalOrder(params) : cancelAllSpotPlanOrder(params))
    if (!res.isOk) {
      done(false)
      return false
    }
    done()
    fetchOpenOrders()
    Message.success(t`hooks_features_order_5101091`)
    return true
  }

  return {
    entrustType,
    setEntrustType,
    openTitle,
    openOrderModule,
    isNormalEntrust,
    showCancelAll,
    cancelAll,
    displayPlanOrders,
    displayNormalOrders,
  }
}
export function useOrderCommonParams() {
  const defaultParams: IOrderCommonReq = {
    dateType: 7,
    beginDateNumber: getPeriodDayTime(7).start,
    endDateNumber: getPeriodDayTime(7).end,
    tradeId: '',
  }
  const [commonParams, setCommonParams] = useState<IOrderCommonReq>(defaultParams)
  const onCommonParamsChange = (params: IOrderCommonReq, isReset = false) => {
    if (isReset === true) {
      setCommonParams(defaultParams)
      return
    }
    setCommonParams(old => {
      return {
        ...old,
        ...params,
      }
    })
  }
  return [commonParams, onCommonParamsChange] as const
}
/**
 * 获取合约当前委托标题和订阅相关模块
 */
export function useFutureOpenOrders(
  // eslint-disable-next-line default-param-last
  defaultEntrustType = EntrustTypeEnum.normal,
  currentTradeId?: any,
  onlyCurrentSymbol = false
) {
  const [entrustType, setEntrustType] = useState(defaultEntrustType)
  // 为了订阅变化以便使用函数的相关数据也能更新
  const tradeUnit = useFuturesStore().tradePanel.tradeUnit
  const { subscribe, fetchOpenOrders, setDefaultEnums, resetOpenModule, openOrderModule, fetchOrderEnums } =
    useOrderFutureStore()
  const { isLogin, userInfo } = useUserStore()
  const isOpenFutures = userInfo.isOpenContractStatus === UserFuturesTradeStatus.open

  useEffect(() => {
    if (isLogin && isOpenFutures) {
      fetchOpenOrders({
        tradeId: currentTradeId,
      })
    } else {
      resetOpenModule()
    }
    return subscribe()
  }, [isLogin])
  useMount(() => {
    setDefaultEnums()
    fetchOrderEnums()
  })
  function getTabTitle(name: string, count: number) {
    return `${name}${isLogin ? `(${count})` : ''}`
  }
  function sort(a: IFutureOrderItem, b: IFutureOrderItem) {
    if (a.tradeId === currentTradeId) {
      return b.tradeId === currentTradeId ? 0 : -1
    }
    return b.tradeId === currentTradeId ? 1 : 0
  }
  function getDisPlayOrders(orders: IFutureOrderItem[]) {
    return orders
      .filter(order => {
        if (onlyCurrentSymbol) {
          return order.tradeId?.toString() === currentTradeId.toString()
        }
        return true
      })
      .sort(sort)
  }
  const displayNormalOrders = getDisPlayOrders(openOrderModule.normal.data)
  const displayPlanOrders = getDisPlayOrders(openOrderModule.plan.data)
  const disPlayStopLimitOrders = getDisPlayOrders(openOrderModule.stopLimit.data)

  const openTotal = openOrderModule.normal.total + openOrderModule.plan.total + openOrderModule.stopLimit.total
  const openTitle = getTabTitle(t`order.tabs.current`, openTotal)
  const isNormalEntrust = entrustType === EntrustTypeEnum.normal
  const isPlanEntrust = entrustType === EntrustTypeEnum.plan
  const showCancelAll =
    (isNormalEntrust
      ? openOrderModule.normal.total
      : isPlanEntrust
      ? openOrderModule.plan.total
      : openOrderModule.stopLimit.total) > 0
  const cancelAll = async (params: ISpotBatchCancelOrderReq) => {
    const typeText = {
      [EntrustTypeEnum.normal]: t`order.constants.placeOrderType.normal`,
      [EntrustTypeEnum.plan]: t`order.constants.placeOrderType.plan`,
      [EntrustTypeEnum.stopLimit]: t`order.tabs.profitLoss`,
    }[entrustType]
    const done = await confirmToPromise(Modal.confirm, {
      className: modalWrapperClassName,
      closable: true,
      closeIcon: <Icon name="close" className="text-xl" hasTheme />,
      content: (
        <TipContent>
          {t({
            id: 'hooks_features_order_5101090',
            values: {
              0: typeText,
            },
          })}
        </TipContent>
      ),
    })
    const res = await batchCancelFutureOrder({
      params,
      entrustType,
    })
    if (!res.isOk) {
      done(false)
      return false
    }
    done()
    fetchOpenOrders()
    Message.success(t`hooks_features_order_5101091`)
    return true
  }

  return {
    entrustType,
    setEntrustType,
    openTitle,
    openOrderModule,
    isNormalEntrust,
    showCancelAll,
    cancelAll,
    tradeUnit,
    displayPlanOrders,
    displayNormalOrders,
    disPlayStopLimitOrders,
  }
}
