import { YapiPostV1HelpCenterHorseLampApiRequest, YapiPostV1HelpCenterHorseLampApiResponse } from '@/typings/yapi/HelpCenterHorseLampV1PostApi'


export type ITradeNotification = {
  id: string
  ifViewAllSpot: number
  ifViewAllSwap: number
  forceViewModal: number
  name: string
  parentId: string
  spotList: number[]
  swapList: number[]
}

export type ITradeNotificationLampList = {
  lampList: ITradeNotification[]
}
export type IQueryTradeNotificationsReq = YapiPostV1HelpCenterHorseLampApiRequest
export type IQueryTradeNotificationsResp = YapiPostV1HelpCenterHorseLampApiResponse