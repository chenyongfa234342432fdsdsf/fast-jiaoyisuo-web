import { useFutureOpenOrders, useSpotOpenOrders } from '@/hooks/features/order'
import { useEventEmitter } from 'ahooks'
import { createContext, useContext } from 'react'

type EventEmitter<T> = ReturnType<typeof useEventEmitter<T>>

export type IOrderModuleContext<T> = {
  cancelOrderEvent$: EventEmitter<void>
  refreshEvent$: EventEmitter<void>
  /** 当前订单 hook 保存的结果 */
  orderHookResult: T
}
/** 订单内所有组件的通信，但是此 context 也可由外部提供 */
export const SpotOrderModuleContext = createContext<IOrderModuleContext<ReturnType<typeof useSpotOpenOrders>>>(
  {} as any
)
export const FutureOrderModuleContext = createContext<IOrderModuleContext<ReturnType<typeof useFutureOpenOrders>>>(
  {} as any
)

export function useCreateOrderModuleContext<T>(orderHookResult: T): IOrderModuleContext<T> {
  const cancelOrderEvent$ = useEventEmitter<void>()
  const refreshEvent$ = useEventEmitter<void>()

  return {
    cancelOrderEvent$,
    refreshEvent$,
    orderHookResult,
  }
}
export function useSpotOrderModuleContext() {
  return useContext(SpotOrderModuleContext)
}
export function useFutureOrderModuleContext() {
  return useContext(FutureOrderModuleContext)
}
