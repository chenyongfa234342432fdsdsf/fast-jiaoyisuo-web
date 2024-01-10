import { useEffect, RefObject, useRef } from 'react'
// import { usePrevious } from 'ahooks'
import { debounce } from 'lodash'

type TradeDealScroll = {
  dom?: RefObject<HTMLElement>
  request: (item) => void
  bottomDistance?: number
  list: any[]
  listParams: Record<'total' | 'pageSize', number>
  requestHandle: boolean
}

export const useBidTradeScroll = (props: TradeDealScroll) => {
  const { dom, request, bottomDistance = 0, list, listParams, requestHandle } = props

  const colunList = useRef<any[]>()

  const domCurrent = dom?.current || document.documentElement || document.body

  // const previousList = usePrevious(list)

  const detectionBottomChange = debounce(() => {
    if (colunList.current?.length === Number(listParams?.total) || listParams?.total <= listParams?.pageSize) {
      return
    }

    if (domCurrent && requestHandle) {
      const showHeight = domCurrent?.clientHeight
      const scrollTopHeight = domCurrent?.scrollTop
      const allHeight = domCurrent?.scrollHeight
      if (allHeight - bottomDistance <= showHeight + scrollTopHeight) {
        request(colunList.current)
      }
    }
  }, 100)

  useEffect(() => {
    const body = document.querySelector('body')
    colunList.current = list
    body?.addEventListener('scroll', detectionBottomChange)
    return () => {
      body?.removeEventListener('scroll', detectionBottomChange)
    }
  }, [domCurrent, list, listParams, requestHandle])
}
