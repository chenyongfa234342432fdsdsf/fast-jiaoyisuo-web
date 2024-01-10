import create from 'zustand'
import produce from 'immer'
import { createTrackedSelector } from 'react-tracked'
import { getSupport, setSupport } from '@/helper/cache/support'

type IStore = ReturnType<typeof getStore>

function getStore(set) {
  return {
    breadcrumbList: getSupport() || [],
    // 添加项
    addBreadcrumb: payload => {
      set(
        produce((store: IStore) => {
          if (payload.isCurrent) {
            store.breadcrumbList = []
          }
          if (payload.parentId) {
            let data = store?.breadcrumbList
            if (data?.length) {
              data[data[0]?.parentId ? 0 : 1] = payload
            } else {
              data.push(payload)
            }
          } else {
            const isArray = Array.isArray(payload)
            store.breadcrumbList = isArray ? payload : [payload]
          }
          setSupport(store.breadcrumbList)
        })
      )
    },
  }
}

const baseListStore = create(getStore)
const useListStore = createTrackedSelector(baseListStore)

export { useListStore, baseListStore }
