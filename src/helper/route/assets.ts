import { FinancialRecordLogTypeEnum, WithDrawTypeEnum } from '@/constants/assets'

/**
 * 资产 - 充币
 * @param id 币种 coinId
 */
export function getAssetsDepositPageRoutePath(id?: string) {
  let url = `/assets/main/deposit`
  if (id) url += `?id=${id}`
  return url
}

/**
 * 资产 - 提币
 * @param type 提币类型 WithDrawTypeEnum.platform 站内 WithDrawTypeEnum.blockchain 站外
 * @param id 币种 coinId
 */
export function getAssetsWithdrawPageRoutePath(type?: WithDrawTypeEnum, id?: string) {
  let url = `/assets/main/withdraw`
  if (type) url += `?type=${type}`
  if (id) {
    !type ? (url += `?id=${id}`) : (url += `&id=${id}`)
  }

  return url
}

/**
 * 资产 - 币种资产首页
 */
export function getAssetsMainPageRoutePath() {
  const url = `/assets/main`
  return url
}

/**
 * 资产 - c2c 资产首页
 */
export function getAssetsC2CPageRoutePath() {
  const url = `/assets/c2c`
  return url
}

/**
 * 资产 - 财务记录
 * @param type FinancialRecordLogTypeEnum
 * @param id 财务记录 id
 * @param subtype 子类型
 */
export function getAssetsHistoryPageRoutePath(
  type?: FinancialRecordLogTypeEnum,
  id?: string,
  subtype?: string,
  coinId?: string,
  coinName?: string
) {
  let url = `/assets/financial-record`
  if (type) url += `?type=${type}`
  if (id) {
    !type ? (url += `?id=${id}`) : (url += `&id=${id}`)
  }
  if (subtype) {
    !type && !id ? (url += `?subtype=${subtype}`) : (url += `&subtype=${subtype}`)
  }
  if (coinId) {
    !type && !id && !subtype ? (url += `?coinId=${coinId}`) : (url += `&coinId=${coinId}`)

    if (coinName) {
      url += `&coinName=${coinName}`
    }
  }
  return url
}

/**
 * 资产 - 合约组详情
 * @param groupId 合约组 id
 */
export function getFuturesDetailPageRoutePath(groupId?: string) {
  const url = `/assets/futures/detail/${groupId}`
  return url
}
