import request, { MarkcoinRequest } from '@/plugins/request'

/**
 * 获取帮助中心首页数据
 */
export const getInmailMenu: MarkcoinRequest = () => {
  return request({
    path: `/v1/inbox/modules`,
    method: 'GET',
  })
}

/**
 * 根据模块获取分页数据
 */
export const getModuleInmailData: MarkcoinRequest = params => {
  return request({
    path: `/v1/inbox/messages`,
    method: 'GET',
    params,
  })
}

/**
 * 获取未读消息数量
 */
export const getUnReadNum: MarkcoinRequest = () => {
  return request({
    path: `/v1/inbox/messages/unReadNum`,
    method: 'GET',
  })
}

/**
 * 全部消息已读
 */
export const getReadAll: MarkcoinRequest = () => {
  return request({
    path: `/v1/inbox/messages/readAll`,
    method: 'POST',
  })
}

/**
 * 全部消息清空
 */
export const getDeleteAll: MarkcoinRequest = () => {
  return request({
    path: `/v1/inbox/messages/deleteAll`,
    method: 'POST',
  })
}

/**
 * 单条消息已读
 */
export const getSingleRead: MarkcoinRequest = data => {
  return request({
    path: `/v1/inbox/messages/read`,
    method: 'POST',
    data,
  })
}

/**
 * 获取最新的多条未读数据
 */
export const getNewUnReadData: MarkcoinRequest = params => {
  return request({
    path: `/v1/inbox/messages/latestUnreadMessage`,
    method: 'GET',
    params,
  })
}

/**
 * 获取分页查询行情异动
 */
export const getMarketActivities: MarkcoinRequest = params => {
  return request({
    path: `/v1/inbox/messages/marketActivities`,
    method: 'GET',
    params,
  })
}
