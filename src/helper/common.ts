import { SorterResult } from '@nbit/arco/es/Table/interface'
import { decimalUtils } from '@nbit/utils'
import produce from 'immer'
import { baseLayoutStore } from '@/store/layout'
import { extractMetaData } from './layout/metadata'
import { formatNumberDecimal } from './decimal'
import { gitCommitId } from './env'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 * 两个对象列表的左连接
 * @param arr1 主列表
 * @param key1 主列表对象的 key
 * @param arr2 补充列表
 * @param key2 补充列表对象的 key
 * @param isInnerJoin 当不存在补充列表时，是否从 arr1 中去除，默认不去除
 * @param keepPrevKeys 需要保存的更新之前的 key 对应的值，默认保存 last 的值
 * @returns merged
 * @example
 * leftJoinByKey([{id: 1, symbol: 'btc'}], 'id', [{name: 1, value: 3}, {name: 1, value: 3}], 'name') => [{id: 1, symbol: 'btc', value: 3}]
 */
export const leftJoinByKey = <T>({
  arr1,
  key1,
  arr2,
  key2,
  isInnerJoin = false,
  keepPrevKeys = ['last'],
}: {
  arr1?: any[]
  key1: string
  arr2?: any[]
  key2: string
  isInnerJoin?: boolean
  keepPrevKeys?: string[]
}): T[] => {
  if (!arr1) return []
  const merged = [...arr1]
  if (!arr2 || arr2.length === 0 || arr1.length === 0) return merged
  if (!Object.keys(arr1[0]).find(x => key1) || !Object.keys(arr2[0]).find(x => key2)) return merged

  // 将 arr2 中的值取出作为 key
  const arr2KeyObj = arr2.reduce((acc, cur) => {
    acc[cur[key2]] = cur
    return acc
  }, {})

  const updated = produce(merged, draft => {
    draft.forEach(item => {
      // 如果是 inner join, 只留下相交的 item
      if (isInnerJoin && (!Object.keys(item).find(x => x === key1) || !arr2KeyObj[item[key1]])) {
        item[key1] = null
        return
      }

      // 如果当前对象不存在 key1, 直接返回
      if (!Object.keys(item).find(x => x === key1)) return
      // 取出 key1 在 obj1 中的值，在 map 中寻找
      const obj2 = arr2KeyObj[item[key1]]

      if (!obj2) return

      // 直接覆盖 obj1 中的值，除了 key1 或者 key2 以免值被覆盖
      Object.keys(obj2).forEach(key => {
        if (key === key1 || key === key2) return
        const prev = item[key]
        item[key] = obj2[key]

        // 以 `${key}Prev` 格式保存之前的值
        if (keepPrevKeys?.includes(key)) {
          item[`${key}Prev`] = prev
        }
      })
    })
  })

  const resolved = isInnerJoin ? updated.filter(x => !!x[key1]) : updated

  // console.debug('merged', resolved)
  // console.debug('berfore arr1', arr1)
  // console.debug('before arr2', arr2)
  return resolved
}

export const tableSortHelper = {
  common: (sorter: SorterResult, a, b) => {
    if (!sorter.direction || !sorter.field) return 0

    try {
      const { field, direction } = sorter
      const dataIndex = field?.toString() || ''
      const isDesc = direction === 'descend' ? -1 : 1
      const aValue = String(a[dataIndex]).trim()
      const bValue = String(b[dataIndex]).trim()
      const lastIdx = aValue.length - 1

      if (!isNaN(aValue as any)) {
        // default is number type
        return isDesc * (Number(aValue) - Number(bValue))
      }

      if (aValue[lastIdx] === '%') {
        return isDesc * (parseFloat(aValue) - parseFloat(b[dataIndex]))
      }

      return isDesc * aValue.localeCompare(bValue)
    } catch (error) {
      console.debug('Table sorter common stragey error', error, a, b)
      return 0
    }
  },
  handler: ({
    data,
    setData,
    sorter,
    defaultSorter,
  }: {
    data: any[]
    setData?: any
    sorter: SorterResult
    defaultSorter?: SorterResult | null
  }) => {
    if (!sorter || !sorter.direction || !sorter.field) {
      if (defaultSorter) {
        const sorted = data.slice().sort((a, b) => tableSortHelper.common(defaultSorter, a, b))
        setData && setData(sorted)
        return sorted
      }
      setData && setData(data)
      return data
    }

    const sorted = data.slice().sort((a, b) => tableSortHelper.common(sorter, a, b))
    setData && setData(sorted)
    return sorted
  },
}

export const arraySplitToChunks = (arr: any[], chunkSize: number) => {
  if (chunkSize <= 0) return [arr]

  const res: any[] = []

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, chunkSize * (i + 1))
    res.push(chunk)
  }

  return res
}

export const isFalsyExcludeZero = val => {
  if (val === 0) return false
  return !val
}

export const isAbsoluteUrl = (urlString?: string) => {
  const isAbsolute = /^([a-z]+:\/\/|\/\/)/i
  return isAbsolute.test(urlString!)
}

export function logGitCommitId() {
  // eslint-disable-next-line no-console
  console.log(`version: ${gitCommitId}`)
}
/** 获取小数或已经是百分比的字符串百分比展示 */
export function getPercentDisplay(rate?: number | string | null, digits?: number) {
  if (rate === undefined || rate === null || rate === '') {
    return '--'
  }
  if (rate.toString().includes('%')) {
    return rate
  }
  const rateNumber = SafeCalcUtil.mul(rate, 100)
  if (Number.isNaN(rateNumber)) {
    return '--'
  }
  return `${Number.isInteger(digits) ? Number(formatNumberDecimal(rateNumber, digits!, true)) : rateNumber}%`
}

/** 全屏
 * isFullScreen 是否显示
 * fullscreenRef 全屏 div ref
 * setIsFullScreen 设置是否显示
 */
export const fullscreen = (isFullScreen, fullscreenRef, setIsFullScreen) => {
  type documentFullScreen = {
    msExitFullscreen?: () => void
    exitFullscreen?: () => void
    mozCancelFullScreen?: () => void
    webkitExitFullscreen?: () => void
  }

  type htmlDIvFullScreen = {
    webkitRequestFullScreen?: () => void
    mozRequestFullScreen?: () => void
    msRequestFullscreen?: () => void
    requestFullscreen?: () => void
  }
  const tv: htmlDIvFullScreen | null = fullscreenRef.current
  const _document: documentFullScreen = document
  if (!isFullScreen) {
    if (tv?.requestFullscreen) {
      tv.requestFullscreen()
    } else if (tv?.webkitRequestFullScreen) {
      tv?.webkitRequestFullScreen()
    } else if (tv?.mozRequestFullScreen) {
      tv.mozRequestFullScreen()
    } else if (tv?.msRequestFullscreen) {
      // IE11
      tv.msRequestFullscreen()
    }
  } else {
    const isFull = document.fullscreenElement
    if (isFull) {
      if (_document.exitFullscreen) {
        _document.exitFullscreen()
      } else if (_document.msExitFullscreen) {
        // IE11
        _document.msExitFullscreen()
      } else if (_document.mozCancelFullScreen) {
        _document.mozCancelFullScreen()
      } else if (_document.webkitExitFullscreen) {
        _document.webkitExitFullscreen()
      }
    }
  }
  setIsFullScreen(!isFullScreen)
}

export function getBusinessName() {
  const { layoutProps } = baseLayoutStore.getState()
  const metaData = extractMetaData(layoutProps)
  return metaData.businessName
}

/**
 * 获取 uuid, 用于生成唯一 id
 */
export const getUUId = () => {
  const hex = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  const uuidGen = (prefix = 'jkgj-') => `${prefix}${hex()}${hex()}-${hex()}-${hex()}-${hex()}-${hex()}${hex()}${hex()}`
  return uuidGen()
}
