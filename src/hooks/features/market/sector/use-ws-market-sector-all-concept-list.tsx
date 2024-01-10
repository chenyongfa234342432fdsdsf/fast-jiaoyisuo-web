import { getMarketSectorList } from '@/apis/market/market-sector'
import { ApiStatusEnum } from '@/constants/market/market-list'
import { useWsSpotMarketSectorConceptFullAmount } from '@/hooks/features/market/common/market-ws/use-ws-market-sector-concept-full-amount'
import {
  YapiGetV1ConceptConceptPriceListApiRequest,
  YapiGetV1ConceptConceptPriceListData,
} from '@/typings/yapi/ConceptConceptPriceListV1GetApi'
import { useMount, useSafeState, useUnmount } from 'ahooks'
import { useEffect, useRef, useState } from 'react'

export default function useWsMarketSectorAllConceptList({
  apiParams,
}: {
  apiParams: YapiGetV1ConceptConceptPriceListApiRequest
}) {
  const [apiData, setApiData] = useSafeState<YapiGetV1ConceptConceptPriceListData[] | null>(null)
  const resolvedData = useWsSpotMarketSectorConceptFullAmount({ apiData })
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const isExistRef = useRef<null | boolean>(null)

  useMount(() => {
    isExistRef.current = true
  })
  useUnmount(() => {
    isExistRef.current = false
  })

  useEffect(() => {
    setApiStatus(ApiStatusEnum.fetching)
    getMarketSectorList(apiParams)
      .then(res => {
        if (!isExistRef.current) return
        setApiStatus(ApiStatusEnum.succeed)
        setApiData(res.data || [])
      })
      .catch(() => {
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [])

  return { data: resolvedData, setData: setApiData, apiStatus }
}
