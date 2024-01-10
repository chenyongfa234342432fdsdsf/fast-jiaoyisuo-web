import { useEffect } from 'react'
import { useMemoizedFn } from 'ahooks'
import ws from '@/plugins/ws'
import { WSThrottleTypeEnum } from '@nbit/chart-utils'
import { useMarketStore } from '@/store/market'
import { WsThrottleTimeEnum } from '@/constants/ws'

/** 获取行情异动推送信息 - 方法入参 */
type useGetWsMarketActivityProps = {
  /** ws subs 入参 */
  subs?: any
  /** ws 回调方法 */
  wsCallBack(data: any): void
}

/**
 * 行情异动推送
 * @param subs: ws subs 入参
 * @param wsCallBack ws 回调
 */
export function useGetWsMarketActivity({ wsCallBack }: useGetWsMarketActivityProps) {
  const marketState = useMarketStore()
  // useMemoizedFn 解决循环订阅、解订阅的问题
  wsCallBack = useMemoizedFn(wsCallBack)

  // websocket 行情异动推送
  useEffect(() => {
    const subsMarketActivity = { biz: 'spot', type: 'market_activities' }

    ws.subscribe({
      subs: subsMarketActivity,
      throttleTime: WsThrottleTimeEnum.Market,
      throttleType: WSThrottleTypeEnum.cover,
      callback: wsCallBack,
    })

    return () => {
      ws.unsubscribe({
        subs: subsMarketActivity,
        callback: wsCallBack,
      })
    }
  }, [marketState.currentCoin.id, wsCallBack])
}
