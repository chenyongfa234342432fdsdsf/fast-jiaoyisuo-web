import { t } from '@lingui/macro'

const getTabList = () => {
  return [
    { title: t`trade.c2c.freetrade`, value: 'BuyCoins' },
    { title: t`trade.c2c.publishAdvertisement`, value: 'AdvertisingPermission' },
    { title: t`trade.c2c.C2COrder`, value: 'C2Corder' },
  ]
}

type TimelineListType = Record<'title' | 'detail', string>[]

const getTimelineListArr = () => {
  return [
    { title: t`user.common.submit_application`, detail: '冻结保证资产 2000 USDT' },
    { title: t`trade.c2c.publishAdvertisement`, detail: t`features/user/initial-person/index-0` },
    { title: t`features/user/initial-person/index-1`, detail: t`features/user/initial-person/index-2` },
    { title: t`features/user/initial-person/index-5`, detail: t`features/user/initial-person/index-6` },
  ]
}

type Deposit = {
  depositAmount: number
  depositCurrency: string
}

const setMessage = () => {
  return [{ required: true, message: '该项为必填项' }]
}

const getRelationsOptions = () => {
  return [
    { value: '朋友', id: 1 },
    { value: '亲戚', id: 2 },
    { value: '同事', id: 3 },
  ]
}

const setPhoneValidator = (value, callback) => {
  if (!value.phone) {
    callback('请输入电话！')
  }
}

type MemberMemberPhoneAreaType = {
  /** ID */
  id: number
  /** 地区值 */
  enCode: string
  /** 国家名称 */
  fullName: string
  /** 是否可用  */
  enableInd: number
  /** 国家缩写 */
  shortName: string
}

export {
  getTabList,
  getTimelineListArr,
  TimelineListType,
  setMessage,
  Deposit,
  getRelationsOptions,
  setPhoneValidator,
  MemberMemberPhoneAreaType,
}
