import { getAdvertDelete, getAdvertDown } from '@/apis/c2c/advertise'
import { ErrorTypeEnum } from '@/constants/assets'
import { AdvertisingDirectionTypeEnum, adCodeDictionaryEnum, getAdsNewStatus } from '@/constants/c2c/advertise'
import { C2CAdvertTableData } from '@/typings/api/c2c/advertise/post-advertise'
import { t } from '@lingui/macro'
import { Message } from '@nbit/arco'

export function mapCodeDictToAdsList(list: C2CAdvertTableData[] | undefined, adCodeDictionary) {
  if (!list) return []

  return list.map(each => {
    each.advertDirect = adCodeDictionary[adCodeDictionaryEnum.Advert_Direct]?.[each.advertDirectCd]?.codeKey
    each.advertDirectFlip =
      adCodeDictionary[adCodeDictionaryEnum.Advert_Direct]?.[flipAdvertDirection(each.advertDirectCd)]?.codeKey

    each.tradeType = adCodeDictionary[adCodeDictionaryEnum.Deal_Type]?.[each.tradeTypeCd]?.codeKey

    each.paymentNames = each.payments?.map(
      payment => adCodeDictionary[adCodeDictionaryEnum.Payment_Type]?.[payment]?.codeKey
    )

    each.advertNewStatus = getAdsNewStatus()[each.advertNewStatus]

    return each
  })
}

/**
 * 下架广告
 * @param advertId 广告 ID
 * @returns isSuccess
 */
export const onBlindAdvertise = async (advertId: string) => {
  if (!advertId) return
  const res = await getAdvertDown({ advertId })

  const { isOk, data } = res || {}
  if (!isOk || !data?.isSuccess) {
    Message.error(t`features_c2c_advertise_advertise_history_record_list_index_jwqpzo-xtkwwz6tlpsqd8`)
    return false
  }

  Message.success(t`features_c2c_advertise_advertise_history_record_list_index_imnk85fl_p8rfqbiuqih7`)
  return true
}

/**
 * 删除广告
 * @param advertId 广告 ID
 * @returns isSuccess
 */
export const onDelAdvertise = async (advertId: string) => {
  const res = await getAdvertDelete({ advertId })

  const { isOk, data } = res || {}
  if (!isOk || !data?.isSuccess) {
    Message.error({
      content: t`helper_c2c_advertise_igxfrfd`,
      id: ErrorTypeEnum.authError,
    })
    return false
  }
  Message.success(t`features_c2c_advertise_advertise_history_record_list_index_b4ukisitxcslwpvpybfmm`)
  return true
}

export function flipAdvertDirection(status: string) {
  if (status === AdvertisingDirectionTypeEnum.buy) return AdvertisingDirectionTypeEnum.sell
  else return AdvertisingDirectionTypeEnum.buy
}

/**
 * 获取小数点位数
 * @param data 数值
 * @returns 小数点位数
 */
export const formatDecimalCount = data => {
  if (isNaN(data) || !data) return 2
  const numStr = data.toString()
  const arr = numStr.split('.')
  const decimalCount = arr && arr[1] && arr[1].length
  return decimalCount || 0
}
