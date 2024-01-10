import { getCodeDetailList } from '@/apis/common'
import { getDownloadApiData } from '@/apis/download'
import { downloadTypeRanking } from '@/constants/download'
import { baseCommonStore } from '@/store/common'
import { YapiGetV1HomeAppinfoGetListData } from '@/typings/yapi/HomeAppinfoGetListV1GetApi'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { isArray, isEmpty } from 'lodash'
import { useEffect, useState } from 'react'

const appTypeCd = 'app_type_cd'

function useDownloadInfo() {
  const { locale, businessId } = baseCommonStore.getState()
  const lanType = locale

  const [appInfo, setappInfo] = useState<any>()
  const [desktopInfo, setdesktopInfo] = useState<any>()

  useEffect(() => {
    if (businessId && lanType) {
      const requests = Promise.all([
        getDownloadApiData({ businessId: String(businessId), lanType }),
        getCodeDetailList({ codeVal: appTypeCd }),
      ])
      requests.then(res => {
        const downloadInfo = sortByDownloadRanking(res[0].data || [])
        const codeKey = res[1].data || []

        downloadInfo && setappInfo(formatDownloadInfo(downloadInfo, codeKey, true))
        downloadInfo && setdesktopInfo(formatDownloadInfo(downloadInfo, codeKey, false))
      })
    }
  }, [businessId, lanType])
  return { appInfo, desktopInfo }
}

function formatDownloadInfo(
  data: YapiGetV1HomeAppinfoGetListData[],
  codeKey: YapiGetV1OpenapiComCodeGetCodeDetailListData[],
  isApp: boolean
) {
  if (!isArray(data) || !isArray(codeKey)) return
  const result = data.reduce((prev, cur) => {
    if (checkIsAppOrActive(codeKey, cur, isApp)) {
      prev[cur.appTypeCd.toLowerCase()] = {
        ...cur,
        appTypeCd: codeKey.find(code => code.codeVal.toLowerCase() === cur.appTypeCd.toLowerCase())?.codeKey,
      }
    }

    return prev
  }, {})
  if (!isEmpty(result)) return result
}

function checkIsAppOrActive(
  codeKey: YapiGetV1OpenapiComCodeGetCodeDetailListData[],
  toCompare: YapiGetV1HomeAppinfoGetListData,
  isApp: boolean
) {
  if (!isArray(codeKey)) return
  // temporary type until backend provide a type
  const app = 'app'
  const pc = 'pc'
  const currentAppType = toCompare.appTypeCd.toLowerCase()
  if (isApp) return codeKey.find(code => code.codeVal.toLowerCase() === currentAppType)?.remark === app
  return codeKey.find(code => code.codeVal.toLowerCase() === currentAppType)?.remark === pc
}

function sortByDownloadRanking(data: YapiGetV1HomeAppinfoGetListData[]) {
  if (isArray(data)) return data.sort((a, b) => downloadTypeRanking[a.appTypeCd] - downloadTypeRanking[b.appTypeCd])
}

export default useDownloadInfo
