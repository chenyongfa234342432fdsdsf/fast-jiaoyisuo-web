import { c2cHrApis } from '@/apis/c2c/history-records'
import { c2cHrConstants } from '@/constants/c2c/history-records'
import { ApiStatusEnum } from '@/constants/market/market-list'
import { useC2CHrStore } from '@/store/c2c/history-records'
import {
  YapiGetV1C2cOrderGetsPageByApiRequest,
  YapiGetV1C2COrderGetsPageByListData,
} from '@/typings/yapi/C2cOrderGetsPageByV1GetApi'
import { PaginationProps } from '@nbit/arco'
import { useUpdateEffect } from 'ahooks'
import { omitBy, isEmpty } from 'lodash'
import { useState, useEffect } from 'react'

export function useC2cHistoryRecords() {
  const store = useC2CHrStore()
  const defualtPageConfig = c2cHrConstants.getDefaultPage()
  const [page, setPage] = useState<PaginationProps>(defualtPageConfig)
  const [dataList, setDataList] = useState<YapiGetV1C2COrderGetsPageByListData[]>([])
  const [apiStatus, setApiStatus] = useState<ApiStatusEnum>(ApiStatusEnum.default)

  useUpdateEffect(() => {
    setPage(defualtPageConfig)
    setDataList([])
  }, [store.requestData])

  useUpdateEffect(() => {
    setDataList([])
  }, [page.pageSize])

  useEffect(() => {
    let requestData: any = omitBy(
      {
        ...store.requestData,
      },
      x => !x
    )

    // if (isEmpty(requestData)) return

    requestData = {
      ...requestData,
      pageNum: page.current,
      pageSize: page.pageSize,
    } as YapiGetV1C2cOrderGetsPageByApiRequest

    setApiStatus(ApiStatusEnum.fetching)
    c2cHrApis
      .getTableList(requestData)
      .then(res => {
        setApiStatus(ApiStatusEnum.succeed)
        const data = res?.data || {}
        const total = Number(data.total || (data.list || [])?.length)

        setPage(prev => {
          return {
            ...prev,
            total,
          }
        })

        setDataList(prevList => {
          const resolvedList: YapiGetV1C2COrderGetsPageByListData[] = data.list || []
          return resolvedList
        })
      })
      .catch(() => {
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [store.requestData, page.current, page.pageSize])

  return { apiData: dataList, setApiData: setDataList, page, setPage, apiStatus }
}
