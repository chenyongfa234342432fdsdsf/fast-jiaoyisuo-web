import create from 'zustand'

import produce from 'immer'
import ws from '@/plugins/ws'
import { baseUserStore } from '@/store/user'
import { createTrackedSelector } from 'react-tracked'
import { createUpdateProp } from '@/helper/store'
import { getUnReadNum, getNewUnReadData } from '@/apis/inmail'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { InmailConfigType } from '@/constants/inmail'
import { InmailDepthSubs } from '@/store/message-center/common'
import { envIsDev, envIsSGDev } from '@/helper/env'

export type IBaseMessageCenterStore = ReturnType<typeof getBaseStore>

type IStore = ReturnType<typeof getStore>

function getBaseStore(set, get) {
  return {
    changeNum: 0,
    unReadNum: 0,
    unreadMessage: [],
    loginData: {
      action: 0,
      latestDeviceNo: '',
      isForceWindow: false,
      title: '',
      content: '',
    },
    loginModal: false,
    globalMessage: {}, // 全局消息提示
    moduleInmailData: [] as InmailConfigType[], // 站内信模块数据
    async fetchLatestMessageList() {
      const res = await getNewUnReadData({ count: 5 })
      if (!res.isOk || !res.data) {
        return
      }
      const state: IStore = get()
      state.unreadMessage = res.data
    },
    async fetchUnReadCount() {
      set(
        produce(async (draft: IStore) => {
          const res = await getUnReadNum({})
          if (!res.isOk || !res.data) {
            return
          }
          draft.unReadNum = res.data?.unReadNum
        })
      )
    },
    setUnReadNum: value =>
      set(
        produce((draft: IStore) => {
          draft.unReadNum = value
        })
      ),
    setWsDepthConfig: value =>
      set(
        produce((draft: IStore) => {
          draft.unreadMessage = value
        })
      ),
    setModuleInmailData: value =>
      set(
        produce((draft: IStore) => {
          draft.moduleInmailData = value
        })
      ),
    setLoginModal: () => {
      set(
        produce((draft: IStore) => {
          draft.loginModal = false
        })
      )
    },
    setNoticeChange: value =>
      set(
        produce((draft: IStore) => {
          draft.changeNum += 1
        })
      ),
    setGlobalMessage: value =>
      set(
        produce((draft: IStore) => {
          draft.globalMessage = value
        })
      ),
    /** 通知站内信有 ws 推送来数据进行更新* */
    wsInmailDepthCallback: value =>
      set(
        produce((draft: IStore) => {
          /** 全局消息可能为多条* */
          value?.forEach(item => {
            const data = item?.noticeData
            if (data?.inboxMsgData) {
              // 站内信消息
              const boxMsgData = data?.inboxMsgData
              const params = {
                title: boxMsgData?.title,
                content: boxMsgData?.content,
                link: boxMsgData?.webLink,
              }
              /** 如果 isRemind 为 true, 则需要全局提示* */
              boxMsgData?.isRemind && draft.setGlobalMessage(params)
              draft.changeNum += value.length
            } else if (data?.bizActionData) {
              const { deviceId, multipleLoginTime, clearUserCacheData, clearMultipleLoginTime } =
                baseUserStore.getState()
              /** 多点登录弹框提示* */
              const params = data?.bizActionData
              const eventTime = Number(item?.time || 0)
              const latestDeviceNo = params?.latestDeviceNo || ''
              /** 如果没有存时间，那代表第一次登录，不走下面逻辑 */
              if (!multipleLoginTime) return
              const isEventTime = multipleLoginTime < eventTime
              const isDeviceId = deviceId !== latestDeviceNo
              if (deviceId && isDeviceId && multipleLoginTime && isEventTime && params?.isForceWindow) {
                if (envIsSGDev || envIsDev) return
                draft.loginData = params
                draft.loginModal = params?.isForceWindow
                clearUserCacheData()
                clearMultipleLoginTime()
              }
            } else if (data?.msgData) {
              /** 全局消息提示* */
              const msgData = data?.msgData
              const params = {
                title: msgData?.title,
                content: msgData?.content,
                link: msgData?.webLink,
              }
              draft.setGlobalMessage(params)
            }
          })
        })
      ),

    wsInmailDepthSubscribe: () => {
      const state: IStore = get()
      ws.subscribe({
        subs: InmailDepthSubs(),
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.increment,
        callback: state.wsInmailDepthCallback,
      })
    },
    wsInmailDepthUnSubscribe: () => {
      const state: IStore = get()
      ws.unsubscribe({
        subs: InmailDepthSubs(),
        callback: state.wsInmailDepthCallback,
      })
    },
  }
}

function getStore(set, get) {
  return {
    ...createUpdateProp<IBaseMessageCenterStore>(set),
    ...getBaseStore(set, get),
  }
}

const baseMessageCenterStore = create(getStore)

const useBaseMessageCenterStore = createTrackedSelector(baseMessageCenterStore)

export { useBaseMessageCenterStore, baseMessageCenterStore }
