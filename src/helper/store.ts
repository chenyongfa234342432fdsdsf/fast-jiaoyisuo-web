import { MarkcoinRequest, MarkcoinResponse } from '@/plugins/request'
import produce from 'immer'
import { StoreApi } from 'zustand'
import { get as lodashGet } from 'lodash'
import { IStoreEnum } from '@/typings/store/common'
import { getCodeDetailListBatch } from '@/apis/common'
import { replaceEmpty } from './filters'

/**
 * 创建用于更新 store 属性的函数
 */
export function createUpdateProp<P>(set) {
  return {
    updateProp<T extends keyof P>(key: T, data: P[T]) {
      set(
        produce((draft: P) => {
          draft[key] = data
        })
      )
    },
  }
}

/**
 * To generate common api and store structure.
 * Api response is stored directly in created store object through callback.
 * @param set StoreApi setState fn
 */
function generateCommonApiAndStoreFormat<V extends object>(set: StoreApi<V>['setState']) {
  /**
   * Inner function
   * @param storeName key of store object
   * @param apiFn api request function
   * @param apiParams api request params
   * @param apiResCB callback function which return processed api res data
   */
  return function <K, T, Q extends K, P extends keyof V>(
    storeName: P,
    apiFn: MarkcoinRequest<K, T>,
    apiParams: Q,
    apiResCB: (res: MarkcoinResponse<T>) => V[P]
  ) {
    return {
      [storeName]: [] as Array<T>,
      async [apiFn.name](args: Q = apiParams) {
        try {
          const res = await apiFn(args)
          if (res.isOk && res.data)
            set(
              produce(draft => {
                draft[storeName] = apiResCB(res)
              })
            )
        } catch (err) {
          console.log(err)
        }
      },
    }
  }
}

/**
 * @param set root store 的 set 函数
 * @param modulePath 从根目录到目标模块的路径
 * @param key
 * @param value
 */
export const setStateByModulePath = (set, modulePath: string[], key, value) => {
  set(
    produce((draft: any) => {
      const subDraft = lodashGet(draft, modulePath) || draft
      subDraft[key] = value
    })
  )
}

export const getStateByModulePath = (get, modulePath: string[], key): any => {
  return lodashGet(get(), [...modulePath, key])
}

export { generateCommonApiAndStoreFormat }

/** 将缓存与初始 state 进行合并 */
export function mergeStateFromCache<T>(initState: T, cache: any): T {
  if (initState === null || initState === undefined) {
    return cache
  }
  if (cache === null || cache === undefined) {
    return initState
  }
  if (typeof cache !== 'object' || Array.isArray(cache)) {
    return cache
  }

  Object.keys(cache).forEach(key => {
    initState[key] = mergeStateFromCache(initState[key], cache[key])
  })

  return initState
}
/** 映射成选择框使用的选项 */
export function storeEnumsToOptions(enums: IStoreEnum['enums'], labelKey = 'label', valueKey = 'value') {
  return enums.map(item => ({
    [labelKey]: item.label,
    [valueKey]: item.value,
  }))
}
/** 从值获取文案，没有值时返回 -- */
export function getTextFromStoreEnums(value: string | number, enums: IStoreEnum['enums']) {
  return replaceEmpty(enums.find(item => item.value.toString() === value?.toString?.())?.label).toString()
}
export async function fetchStoreEnums<T extends Record<string, IStoreEnum>>(enumsRecord: T) {
  const data = await getCodeDetailListBatch(Object.values(enumsRecord).map(item => item.codeKey))

  return produce(enumsRecord, draft => {
    const items = Object.values(draft)
    items.forEach((item, index) => {
      if (data[index].length === 0) {
        return
      }
      item.enums = data[index].map(enumValue => {
        return {
          label: enumValue.codeKey,
          value:
            parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
              ? parseInt(enumValue.codeVal, 10)
              : enumValue.codeVal,
        }
      })
    })
  })
}
