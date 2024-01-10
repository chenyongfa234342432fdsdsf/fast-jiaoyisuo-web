import { WsThrottleTimeEnum } from '@/constants/ws'
import { isFalsyExcludeZero } from '@/helper/common'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { ISubscribeParams } from '@/plugins/ws/types'
import { useRafInterval, useSafeState, useUnmount } from 'ahooks'
import { isEmpty } from 'lodash'
import { useEffect, useRef } from 'react'
import { baseCommonStore } from '@/store/common'

export function useWsSingleSubByBizId({ apiData, sub, ws }) {
  const subscriptionConfig = useRef<ISubscribeParams | null>(null)
  const [wsData, setWsData] = useSafeState<unknown | null>([])

  const { businessId } = baseCommonStore.getState()

  useEffect(() => {
    // 如果已经全量订阅则直接返回
    if (subscriptionConfig.current) return
    if (isFalsyExcludeZero(businessId)) return
    if (isEmpty(apiData)) {
      setWsData(null)
      return
    }

    const subConfig: ISubscribeParams = {
      subs: sub(String(businessId)),
      callback: data => {
        subscriptionConfig.current && setWsData((data || []).flat())
      },
      throttleType: WSThrottleTypeEnum.cover,
    }

    ws.subscribe(subConfig)
    subscriptionConfig.current = subConfig
  }, [apiData])

  useUnmount(() => {
    subscriptionConfig.current && ws.unsubscribe(subscriptionConfig.current)
    subscriptionConfig.current = null
  })

  return wsData
}

export function getSubKeys(sub: { type: string; contractCode: string; biz: string }) {
  const subKey = `${sub.type || ''}-${sub.contractCode || ''}-${sub.biz || ''}`
  // console.log("🚀 ~ file: index.tsx:47 ~ getSubKeys ~ subKey:", subKey)
  return subKey
}

export function useWsMultiSub({ apiData, sub, ws, intervalTime }) {
  const [wsData, setWsData] = useSafeState<any[] | null>(null)

  // isActive 用于防止 api data 改变而导致 反复订阅和解订阅
  const subsMapRef = useRef<Map<string, { isActive: boolean; sub: ISubscribeParams }>>(new Map())
  const subscriptions = subsMapRef.current

  // 存入一段时间后段推送过来的数据
  const queueRef = useRef<any[]>([])
  const queue = queueRef.current

  // 目前后端数据不变也会发送数据，多个币对的情况下，需要前端定时统一更新
  useRafInterval(() => {
    const items: any[] = []
    while (queue.length) {
      const item = queue.pop()
      items.push(item)
    }
    // console.log("🚀 ~ file: index.tsx:70 ~ useRafInterval ~ items:", items)
    setWsData(items)
  }, intervalTime || WsThrottleTimeEnum.Slower)

  useEffect(() => {
    if (isEmpty(apiData)) {
      setWsData(null)
      return
    }

    // 仅记录每次新的 subscription
    const newConfigs: any[] = []
    const wsCallBack = wsData => {
      queue.push((wsData || []).flat()[0] || {})
      // setWsData((wsData || []).flat())
    }

    // 重置 active 状态
    subscriptions.forEach(config => {
      config.isActive = false
    })

    apiData?.forEach((item, index) => {
      const subs = sub(item)
      const key = getSubKeys(subs)

      if (subscriptions.has(key)) {
        const item = subscriptions.get(key)
        if (item) {
          // 更新状态即可返回
          item.isActive = true
        }
        return
      }

      const config: ISubscribeParams = {
        subs,
        callback: wsCallBack,
        throttleType: WSThrottleTypeEnum.cover,
      }

      // 插入新的订阅
      newConfigs.push(config)
      subscriptions.set(key, { isActive: true, sub: config })
    })

    // 开始订阅
    newConfigs.length && newConfigs.forEach(config => ws.subscribe(config))
    // console.log("🚀 ~ file: index.tsx:98 ~ useEffect ~ newConfigs:", newConfigs)

    return () => {
      // 取消没有 active 的订阅
      const tobeUnSubConfigs: any[] = []
      subscriptions.forEach(config => {
        if (!config.isActive) {
          tobeUnSubConfigs.push(config.sub)
        }
      })
      // console.log('🚀 ~ file: index.tsx:92 ~ return ~ tobeUnSubConfigs:', tobeUnSubConfigs)
      tobeUnSubConfigs?.forEach(config => ws.unsubscribe(config))
    }
  }, [apiData])

  useUnmount(() => {
    subscriptions.forEach(config => {
      config.isActive = false
      ws.unsubscribe(config.sub)
    })
  })

  return wsData
}
