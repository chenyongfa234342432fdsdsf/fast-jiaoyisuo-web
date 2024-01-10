import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { YapiGetV1HomeWebsiteGetData } from '@/typings/yapi/HomeWebsiteGetDataV1GetApi'
import { TlayoutProps } from '@/typings/api/layout'
import { extractFooterData } from '@/helper/layout/footer'
import { extractHeaderData } from '@/helper/layout/header'
import { devtools } from 'zustand/middleware'

type TLayoutStore = ReturnType<typeof getStore>

function getStore(set) {
  return {
    layoutProps: {} as YapiGetV1HomeWebsiteGetData | TlayoutProps | undefined,
    setLayoutProps: (layoutProps?: YapiGetV1HomeWebsiteGetData | TlayoutProps | undefined) =>
      set(() => {
        if (layoutProps) {
          return { layoutProps }
        }
        return {}
      }),
    footerData: undefined as ReturnType<typeof extractFooterData>,
    setFooterData: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.footerData = data
        })
      ),

    headerData: { businessName: '' } as ReturnType<typeof extractHeaderData>,
    setHeaderData: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.headerData = data
        })
      ),
    columnsDataByCd: {} as Record<string, any>,
    setColumnsDataByCd: data =>
      set(
        produce((draft: TLayoutStore) => {
          draft.columnsDataByCd = data
        })
      ),
  }
}
const baseLayoutStore = create(devtools(getStore, { name: 'layout-store' }))

const useLayoutStore = createTrackedSelector(baseLayoutStore)

export { useLayoutStore, baseLayoutStore }
