import request, { MarkcoinRequest } from '@/plugins/request'
import { IMessageItem } from '@/typings/api/message-center'
import { YapiDtoInmNoticeConfigVO } from '@/typings/yapi-old/InmailNoticeConfigGetApi'

/**
 * 获取未读消息数量，只返回各类型数量
 */
export const queryUnreadMessageRecords: MarkcoinRequest<any, Record<string, number>> = () => {
  return request({
    path: `inmail/module/unread`,
    method: 'GET',
  })
}
/**
 * 获取消息中心的图标配置等
 */
export const queryMessageCenterConfig: MarkcoinRequest<any, YapiDtoInmNoticeConfigVO> = () => {
  return request({
    path: `inmail/notice/config`,
    method: 'GET',
  })
}
/**
 * 获取最新信息列表，展示在消息中心悬浮窗口
 */
export const queryLatestMessages: MarkcoinRequest<any, IMessageItem[]> = () => {
  return request({
    path: `inmail/message/center`,
    method: 'GET',
  })
}
/**
 * 获取消息列表
 */
export const queryMessageList: MarkcoinRequest<
  {
    pageNum: number
    pageSize: number
  },
  IMessageItem[]
> = params => {
  return request({
    path: `inmail/message/list`,
    method: 'GET',
    params: {
      ...params,
      // 老接口写死即可
      moduleCode: 1,
    },
  })
}
/**
 * 清除所有未读
 */
export const clearAllUnread: MarkcoinRequest<any, IMessageItem[]> = () => {
  return request({
    path: `inmail/message/clear`,
    method: 'POST',
    params: {
      isDeleted: 0,
      isReaded: 1,
      // 目前写死为 1 即可
      moduleCode: 1,
    },
    contentType: 1,
  })
}
