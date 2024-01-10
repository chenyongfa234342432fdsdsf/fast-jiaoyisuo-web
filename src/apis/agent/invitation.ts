import request, { MarkcoinRequest } from '@/plugins/request'

/* ========== 代理商 邀请用户详情 ========== */
/**
 * 代理商 - 邀请用户详情
 * https://yapi.nbttfc365.com/project/44/interface/api/4003
 */
export const InviteHistory: MarkcoinRequest = options => {
  return request({
    path: `/v1/agent/inviteHistory`,
    method: 'POST',
    data: {
      targetUid: options.targetUid, // 查看指定的 UID
      levelLimit: options.levelLimit, // 展示层级限制，默认不限制 如需要只看我的下级，此处应传 1
      puid: options.puid, // 上级 id
      spotMin: options.spotMin, // 最小现货手续费总值
      spotMax: options.spotMax, // 最大现货手续费总值
      contractMin: options.contractMin, // 最小合约手续费总值
      contractMax: options.contractMax, // 最大合约手续费总值
      borrowCoinMin: options.borrowCoinMin, // 最小借币利息总值
      borrowCoinMax: options.borrowCoinMax, // 最大借币利息总值
    },
  })
}
