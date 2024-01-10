import classNames from 'classnames'
import { memo, useEffect, useRef, useState } from 'react'
import Icon from '@/components/icon'
import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'
import { useFuturesFavActions, useSpotFavActions } from '@/hooks/features/market/favourite'
import { useSafeState, useUnmount } from 'ahooks'
import { useSpotFavStore, useFuturesFavStore } from '@/store/market/spot-favorite-module'
import { FavStore } from '@/typings/market/market-favourite'
import { useMarketListStore } from '@/store/market/market-list'
import { MarketLisModulesEnum } from '@/constants/market/market-list'
import Styles from './index.module.css'

type PropsType = {
  needWrap: boolean
  // force set collect star spot or futures context
  forceContext?: MarketLisModulesEnum.futuresMarkets | MarketLisModulesEnum.spotMarkets
} & Partial<YapiGetV1FavouriteListData>

function BaseCollectStar({
  data,
  dataStore,
  actions,
}: {
  data: PropsType
  dataStore: () => FavStore
  actions: typeof useSpotFavActions
}) {
  const { needWrap, ...rest } = data

  const store = dataStore()
  const { addFavToList, rmFavFromList } = actions()

  const controlledRef = useRef(true)
  const [isChecked, setisChecked] = useState<boolean>(false)

  // 数据发生变化时，需要自查一遍
  useEffect(() => {
    // 如果组件被销毁则直接返回
    if (!controlledRef.current) return
    setisChecked(!!store.favList?.find(each => data.id === each.id))
  }, [store.favList, data.id])

  useUnmount(() => {
    controlledRef.current = false
  })

  const star = !isChecked ? (
    <Icon
      onClick={async e => {
        e.stopPropagation()
        try {
          await addFavToList([rest] as YapiGetV1FavouriteListData[])
          setisChecked(true)
        } catch (error) {
          // Toast.error({message: error})
        }
      }}
      name="collection_black"
      className={classNames(Styles.scoped, 'star', 'collect')}
    />
  ) : (
    <Icon
      onClick={async e => {
        e.stopPropagation()
        try {
          await rmFavFromList([rest] as YapiGetV1FavouriteListData[])
          controlledRef.current && setisChecked(false)
        } catch (error) {
          // Toast.error({message: error})
        }
      }}
      name="collection_hover"
      className={classNames(Styles.scoped, 'star', 'cancel')}
    />
  )
  return needWrap ? <div className={classNames(Styles.scoped, 'wrap')}>{star}</div> : star
}

function CollectStar(props: PropsType) {
  const active = useMarketListStore().activeModule
  const { forceContext, ...rest } = props

  return <CollectStarSwitch currentModule={forceContext || active} {...rest} />
}

function CollectStarSwitch(props) {
  const { currentModule, ...rest } = props
  switch (currentModule) {
    case MarketLisModulesEnum.futuresMarkets:
    case MarketLisModulesEnum.futuresMarketsTrade:
      return <BaseCollectStar data={rest} dataStore={useFuturesFavStore} actions={useFuturesFavActions} />
    default:
      return <BaseCollectStar data={rest} dataStore={useSpotFavStore} actions={useSpotFavActions} />
  }
}

export default memo(CollectStar)
