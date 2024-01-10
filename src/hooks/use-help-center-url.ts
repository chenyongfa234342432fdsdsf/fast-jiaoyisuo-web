import { useLayoutStore } from '@/store/layout'

export function useHelpCenterUrl(key: any) {
  const dataByCd = useLayoutStore().columnsDataByCd
  const url = dataByCd[key]?.webUrl || ''

  return `${url?.startsWith('/') ? '' : '/'}${url}`
}
