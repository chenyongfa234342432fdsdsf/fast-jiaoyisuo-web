import { useMount } from 'ahooks'
import { useState } from 'react'
import { getCodeDetailList, getCodeDetailListBatch } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { isPublicC2cMode } from '@/helper/env'

export const useAdvertCodeVal = () => {
  const [advertDealType, setAdvertDealType] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])

  const { locale } = useCommonStore()

  const getCodeDetailListChange = async () => {
    const { isOk, data } = await getCodeDetailList({ codeVal: 'c2c_advert_deal_type', lanType: locale })
    if (isOk && data) {
      setAdvertDealType(data)
    }
  }

  const getAdvertCodeVal = tradeTypeCd => {
    return advertDealType?.find(item => item?.codeVal === tradeTypeCd)?.codeKey
  }

  useMount(() => {
    getCodeDetailListChange()
  })

  return { advertDealType, getAdvertCodeVal }
}

export const usePaymentCodeVal = () => {
  const [paymentDealType, setPaymentDealType] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])
  const [paymentColor, setPaymentColor] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])

  const { locale } = useCommonStore()

  const getCodeDetailListChange = async () => {
    const data = await getCodeDetailListBatch(['c2c_payment_type_cd', 'c2c_payment_color'], isPublicC2cMode)
    if (data) {
      setPaymentDealType(data[0])
      setPaymentColor(data[1])
    }
  }

  const getPaymentCodeVal = tradeTypeCd => {
    return paymentDealType?.find(item => item?.codeVal === tradeTypeCd)?.codeKey
  }
  const getPaymentColorCodeVal = tradeTypeCd => {
    return paymentColor?.find(item => item?.codeVal === tradeTypeCd)?.codeKey
  }

  useMount(() => {
    getCodeDetailListChange()
  })

  return { paymentDealType, getPaymentCodeVal, getPaymentColorCodeVal }
}
