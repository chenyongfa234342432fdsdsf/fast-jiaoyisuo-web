import { useEffect, useRef, memo } from 'react'
import { Spin } from '@nbit/arco'
import cn from 'classnames'
import { useSafeState, useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { debounce } from 'lodash'
import { useUserStore } from '@/store/user'
import { formatDate } from '@/helper/date'
import { guid } from '@/helper/kyc'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { getIsLogin } from '@/helper/auth'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { usePageContext } from '@/hooks/use-page-context'
import styles from './index.module.css'
import { DealTableList, SubscribeList, RequestTimeNode, Direction, tableTrHeight, setChangeSubs } from './tradedeal'
import { useTradeDealScroll } from './useTradeDealScroll'

type Props = {
  id: string
}

function TradeDeal(props: Props) {
  const { id } = props

  const { urlParsed } = usePageContext()

  const { pathname } = urlParsed

  const { requestSubs: subs, getStore, myType, request, ws } = setChangeSubs(pathname) || {}

  const marketState = getStore()

  const { userInfo } = useUserStore()

  const { symbolWassName: contractCode, symbolName, baseSymbolName, tradeId } = marketState.currentCoin || {}

  const isLogin = getIsLogin()

  const [dealTableList, setDealTableList] = useSafeState<DealTableList[]>([])

  const [myTableList, setmyTableList] = useSafeState<DealTableList[]>([])

  const [wsMyTableList, setWsMyTableList] = useSafeState<DealTableList[]>([])

  const [showWsLoading, setShowWsLoading] = useSafeState<boolean>()

  const requestTimeNode = useRef<RequestTimeNode>({ offset: 0, pullSize: 20 })

  const endOrNot = useRef<boolean>(false)

  const detectionBottomRef = useRef<HTMLDivElement>(null)

  const fiterTimeOutListRef = useRef<string>()

  const setDigits = price => {
    const priceComputed = price?.split('.')?.[1]
    return priceComputed ? priceComputed.length : 0
  }

  const setChangeShowList = (data, showMonthDay?: boolean) => {
    const showList = data
      .map(item => {
        item.judgeTime = Number(item.time)
        item.showtime = formatDate(Number(item.time), showMonthDay ? 'MM-DD HH:mm:ss' : 'HH:mm:ss', false)
        item.id = `${guid()}${showMonthDay ? 'mydeal' : 'lastdeal'}`
        item.digits = setDigits(item?.price)
        item.show = true
        return item
      })
      .sort((a, b) => b.judgeTime - a.judgeTime)
      .filter(dealItem => dealItem.symbolWassName === fiterTimeOutListRef.current)
    return showList
  }

  const getMarketTradesRequest = async () => {
    if (symbolName && id === 'latestTransaction') {
      setShowWsLoading(true)
      const { isOk, data } = await request.latestTransaction({ limit: 100, symbol: symbolName })
      if (isOk && data?.list) {
        const showList = data.list.map(item => {
          item.qty = item.volume
          item.querityName = item.volume
          return item
        })
        setShowWsLoading(false)
        setDealTableList(setChangeShowList(showList))
      }
      return isOk
    }
  }

  const getPageHistoryRequest = debounce(async () => {
    if (endOrNot.current || !request.myTransaction) return
    setShowWsLoading(true)
    const pageHistoryDetail = { ...requestTimeNode.current }
    const { isOk, data } = await request.myTransaction({ ...pageHistoryDetail })
    setShowWsLoading(false)
    if (isOk && data?.deals) {
      const myDealList = data.deals.map((item, index) => {
        item.qty = item.count
        item.showtime = formatDate(Number(item.createdByTime), 'MM-DD HH:mm:ss', false)
        item.id = `${index + guid()}mydeal`
        item.show = true
        item.digits = setDigits(item?.price)
        return item
      })

      requestTimeNode.current = {
        ...requestTimeNode.current,
        beginDate: data.beginDate,
        endDate: data.endDate,
        offset: data.offset,
      }

      setmyTableList(item => {
        return [...item, ...myDealList]
      })
      endOrNot.current = data.end
    }
  }, 600)

  useTradeDealScroll({
    dom: detectionBottomRef,
    request: getPageHistoryRequest,
    bottomDistance: 10,
    isLogin,
    selectTab: id,
  })

  useUpdateEffect(() => {
    detectionBottomRef.current?.scrollTo({
      top: 0,
    })
  }, [id])

  const setComputedContainerHeight = () => {
    const detectionBottom = detectionBottomRef.current
    if (detectionBottom) {
      return detectionBottom.clientHeight / tableTrHeight
    }
    return 0
  }

  useEffect(() => {
    const tableContainer = setComputedContainerHeight()

    if (isLogin && tradeId && id === 'realTimeTransaction') {
      setmyTableList([])
      setWsMyTableList([])
      const endDate = new Date().getTime()
      const pullSize = Math.floor(tableContainer + 4)
      requestTimeNode.current = {
        ...requestTimeNode.current,
        beginDate: endDate - 604800000,
        endDate,
        tradeId,
        offset: 0,
        pullSize,
      }
      getPageHistoryRequest()
    }
  }, [tradeId])

  const cancelSubscribleRef = useRef<SubscribeList[]>([
    {
      subs: { ...subs, contractCode },
      callback: showList => {
        setDealTableList(item => {
          const showAnimations = item.map(item => {
            item.show = false
            return item
          })

          setShowWsLoading(false)
          const tabShowList = setChangeShowList(showList)
          return [...tabShowList, ...showAnimations].slice(0, 100)
        })
      },
    },
  ])

  useEffect(() => {
    if (symbolName && tradeId) {
      if (cancelSubscribleRef.current) {
        cancelSubscribleRef.current.forEach(({ subs, callback }) => {
          ws.unsubscribe({
            subs,
            callback,
          })
        })
        endOrNot.current = false
      }
      setDealTableList([])
      setShowWsLoading(undefined)
      if (id === 'latestTransaction') {
        cancelSubscribleRef.current[0].subs = { ...subs, contractCode }
      } else {
        cancelSubscribleRef.current = []
      }

      const tradesRequest = async () => {
        if (isLogin && id === 'realTimeTransaction') {
          cancelSubscribleRef.current.push({
            subs: {
              ...subs,
              contractCode,
              type: myType,
              userId: userInfo?.uid,
            },
            callback: showList => {
              setWsMyTableList(item => {
                const showAnimations = item.map(item => {
                  item.show = false
                  return item
                })
                setShowWsLoading(false)
                const tabShowList = setChangeShowList(showList, true)
                return [...tabShowList, ...showAnimations]
              })
            },
          })
        }

        await getMarketTradesRequest()

        cancelSubscribleRef.current.forEach(({ subs, callback }) => {
          ws.subscribe({
            subs,
            callback,
            throttleType: WSThrottleTypeEnum.increment,
            throttleTime: 100,
          })
        })
      }

      tradesRequest()
      fiterTimeOutListRef.current = contractCode
      return () => {
        cancelSubscribleRef.current.forEach(({ subs, callback }) => {
          ws.unsubscribe({
            subs,
            callback,
          })
        })
      }
    }
  }, [contractCode, symbolName, tradeId])

  const setChangeTableList = () => {
    return id === 'latestTransaction' ? dealTableList : myTableList
  }

  const setShowNodate = () => {
    if (id === 'latestTransaction') {
      return dealTableList.length === 0 && showWsLoading === false
    } else {
      return !isLogin || (myTableList.length === 0 && wsMyTableList.length === 0 && showWsLoading === false)
    }
  }

  const setChangeTableTempLate = tableList => {
    return tableList.map((item, index) => {
      return (
        <div
          className={cn('deal-table-tr', {
            'deal-table-tr-green': item.direction !== Direction.Sell && item.show,
            'deal-table-tr-red': item.direction === Direction.Sell && item.show,
            'deal-table-tr-last': id === 'latestTransaction',
          })}
          key={index + item.id}
        >
          <div>{item.showtime}</div>
          <div>
            <IncreaseTag
              hasPrefix={false}
              delZero={false}
              digits={item.digits}
              diffTarget={item.direction === Direction.Sell ? Infinity : 0}
              value={Number(item.price)}
            />
          </div>
          <div className="ksign-wrap">
            <IncreaseTag kSign hasPrefix={false} hasColor={false} value={Number(item.qty)} />
          </div>
        </div>
      )
    })
  }

  return (
    <div className={styles.scoped}>
      <Spin loading={showWsLoading}>
        <div className="trade-deal-table" ref={detectionBottomRef}>
          <div
            className={cn('deal-table-header', {
              'deal-table-header-last': id === 'latestTransaction',
            })}
          >
            <div>{t`order.columns.date`}</div>
            <div>{t`Price`}</div>
            <div>
              {t`Amount`} ({baseSymbolName})
            </div>
          </div>
          <div className="deal-table-body">
            {setShowNodate() && (
              <div className="deal-note-date">
                <LazyImage
                  hasTheme
                  imageName={t`features_help_center_support_search_index_2755`}
                  className="suppor-lazy-image"
                  src={`${oss_svg_image_domain_address}no_data`}
                />
              </div>
            )}
            {id !== 'latestTransaction' && isLogin && setChangeTableTempLate(wsMyTableList)}
            {setChangeTableTempLate(setChangeTableList())}
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default memo(TradeDeal)
