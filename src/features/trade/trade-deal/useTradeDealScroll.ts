import { useEffect, RefObject } from 'react'
import { debounce } from 'lodash'

type TradeDealScroll = {
  dom: RefObject<HTMLElement>
  request: () => void
  bottomDistance?: number
  isLogin: boolean
  selectTab: string
}

export const useTradeDealScroll = (props: TradeDealScroll) => {
  const { dom, request, bottomDistance = 0, isLogin, selectTab } = props

  const detectionBottomChange = debounce(() => {
    const domCurrent = dom.current
    if (domCurrent && isLogin && selectTab === 'realTimeTransaction') {
      const showHeight = domCurrent?.clientHeight
      const scrollTopHeight = domCurrent?.scrollTop
      const allHeight = domCurrent?.scrollHeight
      if (allHeight - bottomDistance <= showHeight + scrollTopHeight) {
        request()
      }
    }
  }, 100)

  useEffect(() => {
    dom.current?.addEventListener('scroll', detectionBottomChange)
    return () => {
      dom.current?.removeEventListener('scroll', detectionBottomChange)
    }
  }, [dom.current, selectTab, isLogin])
}
