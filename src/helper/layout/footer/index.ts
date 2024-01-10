import { baseLayoutStore } from '@/store/layout'
import { TlayoutProps } from '@/typings/api/layout'
import {
  YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData,
  YapiGetV1HomeColumnGetListColumnsDatasData,
} from '@/typings/yapi/HomeColumnGetListV1GetApi'
import _, { cloneDeep, pick } from 'lodash'

const settings = 'common_settings'

function extractFooterData(layoutProps?: TlayoutProps) {
  if (layoutProps) {
    // prevent in-place manipulation
    const footer = cloneDeep(pick(layoutProps, ['groupConfigDatas', 'columnsDatas', 'webCopyright', 'businessName']))
    if (footer?.columnsDatas && Array.isArray(footer.columnsDatas)) {
      footer.columnsDatas = recursiveFilter([...footer.columnsDatas!], col => col.isWeb === 1)?.filter(
        col => col.homeColumnCd !== settings
      )
    } else {
      footer.columnsDatas = []
    }

    return footer
  }
}

function recursiveFilter(columnsDatas: YapiGetV1HomeColumnGetListColumnsDatasData[], filterFn: any) {
  if (!columnsDatas) return []
  const output: YapiGetV1HomeColumnGetListColumnsDatasData[] = []
  columnsDatas.forEach(col => {
    col.childColumns = recursiveFilter(
      col.childColumns as unknown as YapiGetV1HomeColumnGetListColumnsDatasData[],
      filterFn
    ) as unknown as YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData[]
    if (filterFn(col)) output.push(col)
  })
  return output
}

function determineRedirectionUrl(data: YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData) {
  if (data.isLink === 1) return data.webUrl
  const idList = (data.helpCenterId as unknown as string)?.split?.('-')
  const [id, type] = idList || []
  if (type === '2') {
    return `/support/article/${id || data.helpCenterId}`
  }
  return `/support/navigation?subMenuId=${id || data.helpCenterId}`
}

function recursiveColumnMap(columnsDatas: YapiGetV1HomeColumnGetListColumnsDatasData[]) {
  let mapped = {}

  function recursiveSearch(columns: YapiGetV1HomeColumnGetListColumnsDatasData[]) {
    if (!columns || columns.length === 0) return
    columns.forEach(col => {
      recursiveSearch(col.childColumns as unknown as YapiGetV1HomeColumnGetListColumnsDatasData[])
      if (col.homeColumnCd) mapped[col.homeColumnCd] = col
    })
  }

  recursiveSearch(columnsDatas)

  return mapped
}

function getFooterDataByColName(key) {
  const { columnsDatas } = baseLayoutStore.getState().footerData || {}
  let found
  const searchArray = (array, search) => {
    array.forEach(element => {
      if (element.homeColumnName === search) {
        found = element
        return
      }

      if (element.childColumns && element.childColumns.length > 0) searchArray(element.childColumns, search)
    })
  }

  columnsDatas && searchArray(columnsDatas, key)

  return found
}

export { extractFooterData, determineRedirectionUrl, getFooterDataByColName, recursiveColumnMap }
