import { Message, Spin } from '@nbit/arco'
import AssetsTabs from '@/features/assets/common/assets-tabs'
import { t } from '@lingui/macro'
import { useState, useEffect, useMemo } from 'react'
import { usePageContext } from '@/hooks/use-page-context'
import { useMount, useRequest } from 'ahooks'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { getAreaList } from '@/apis/c2c/common'
import { postAdvertCoinList, postAdvertList } from '@/apis/c2c/advertise'
import { AdvertListReq, IAdvertList, ISearchParams } from '@/typings/api/c2c/advertise/post-advertise'
import { HistoryTabTypeEnum } from '@/constants/c2c/advertise'
import { link } from '@/helper/link'
import { getC2cAdsHistoryPageRoutePath } from '@/helper/route'
import { SearchItem } from './search-form'
import styles from './index.module.css'
import { RecordList } from './record-list'

export function AdvertiseHistory() {
  const pageContext = usePageContext()
  // 上架中、已下架
  const type = Number(pageContext?.urlParsed?.search?.type)
  const advertiseStore = useC2CAdvertiseStore()
  const { updatePostOptions, fetchAdvertiseEnums } = {
    ...advertiseStore,
  }
  useMount(fetchAdvertiseEnums)

  const defaultHistoryForm = {
    /** 币种 ids */
    coinIds: [],
    /** 法币 */
    areaIds: [],
    /** 广告方向-出售/购买 */
    advertDirectCds: [],
    /** 交易类型-站外/站内 */
    tradeTypeCds: [],
    /** 1 上架中 2 已下架 */
    advertStatus: HistoryTabTypeEnum.on,
    /** 广告单号 */
    // advertId: '',
    pageNum: 1,
    pageSize: 20,
  }
  const defaultAdvertiseHistory = {
    /** 上架中 - 筛选表单 */
    onForm: defaultHistoryForm as AdvertListReq,
    /** 已下架 - 筛选表单 */
    offForm: defaultHistoryForm as AdvertListReq,
  }
  const [activeTab, setActiveTab] = useState(HistoryTabTypeEnum.on)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [list, setList] = useState<IAdvertList[]>([])
  const [searchParams, setSearchParams] = useState<ISearchParams>(defaultAdvertiseHistory)

  const onForm = useMemo(() => {
    return searchParams.onForm
  }, [searchParams.onForm])

  const offForm = useMemo(() => {
    return searchParams.offForm
  }, [searchParams.offForm])

  const getPageNumAndSize = data => {
    const { pageNum, pageSize } = data
    return { pageNum, pageSize }
  }

  // 获取当前的 page 对象
  const getActivePage = () => {
    switch (activeTab) {
      case HistoryTabTypeEnum.on:
        return getPageNumAndSize(onForm)
      case HistoryTabTypeEnum.off:
        return getPageNumAndSize(offForm)
      default:
        return getPageNumAndSize(onForm)
    }
  }

  /**
   * 查询所有币种列表
   */
  const onLoadAllCoinList = async () => {
    const res = await postAdvertCoinList({ areaIds: [] })
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    if (data && data.length > 0) {
      updatePostOptions({ coinList: data, allCoinList: data })
    }
  }

  /**
   * 查询广告列表
   */
  const onLoadAdList = async () => {
    try {
      const newForm = activeTab === HistoryTabTypeEnum.on ? { ...onForm } : { ...offForm }
      if (!newForm?.advertId) delete newForm?.advertId

      const res = await postAdvertList({
        ...newForm,
        advertStatus: activeTab,
      })

      const { isOk, data } = res || {}
      if (!isOk) {
        setList([])
        setTotalCount(0)
        return
      }
      if (data && data.list) {
        setList(data?.list)
        setTotalCount(data?.total)
        return
      }
      setList([])
      setTotalCount(0)
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    }
  }

  const { run: onLoadList, loading = true } = useRequest(onLoadAdList, {
    debounceWait: 200,
    manual: true,
  })

  /** 设置搜索入参 */
  const onSetSearchParams = async data => {
    activeTab === HistoryTabTypeEnum.on
      ? setSearchParams({ ...searchParams, onForm: data })
      : setSearchParams({ ...searchParams, offForm: data })
  }

  /** tab 切换事件 */
  const onChangeType = async val => {
    setActiveTab(val)
    // 有 type 参数时，点击切换 tab 时修改 url 的 type 参数
    if (!type) return
    link(getC2cAdsHistoryPageRoutePath(val), {
      overwriteLastHistoryEntry: true,
    })
  }

  /** 翻页事件，修改每页展示条数 */
  const setPageFn = async pageObj => {
    activeTab === HistoryTabTypeEnum.on
      ? setSearchParams({ ...searchParams, onForm: { pageNum: pageObj.pageNum, pageSize: pageObj.pageSize } })
      : setSearchParams({ ...searchParams, offForm: { pageNum: pageObj.pageNum, pageSize: pageObj.pageSize } })
  }

  /**
   * 查询交易区列表
   */
  const onLoadAreaList = async () => {
    const res = await getAreaList({})
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    if (data && data.length > 0) {
      updatePostOptions({ tradingAreaList: data })
    }
  }

  useEffect(() => {
    onLoadAllCoinList()
    onLoadAreaList()
  }, [])

  useEffect(() => {
    onLoadList()
  }, [activeTab, onForm, offForm])

  const tabList = [
    {
      title: t`features_c2c_advertise_advertise_history_index_4iwhagmr6r4eoo1lpurtj`,
      id: HistoryTabTypeEnum.on,
    },
    {
      title: t`features/c2c-trade/advertisement-manager/advertisementmanager-0`,
      id: HistoryTabTypeEnum.off,
    },
  ]

  const currentTab = useMemo(() => {
    return tabList.find(item => +item.id === +activeTab) || tabList[0]
  }, [activeTab])

  return (
    <div className={styles.scoped}>
      <div className="history-wrapper assets-wrapper">
        <AssetsTabs tabList={tabList} value={activeTab} onChange={onChangeType} mode="line" />
        <Spin loading={loading}>
          <div key={`content_${currentTab.id}`} className={+activeTab === +currentTab.id ? 'block' : 'hidden'}>
            <SearchItem
              key={`search_${currentTab.id}`}
              onSearch={data => {
                onSetSearchParams(data)
              }}
              onReset={() => {
                onSetSearchParams(defaultHistoryForm)
              }}
              searchParams={activeTab === HistoryTabTypeEnum.on ? onForm : offForm}
            />
            <RecordList
              key={`list_${currentTab.id}`}
              activeTab={currentTab.id}
              totalCount={totalCount}
              tableData={list}
              page={getActivePage()}
              setPage={setPageFn}
              loading={loading}
              optCallbackFn={() => {
                // const pageData = getActivePage()
                // setPageFn({ ...pageData, pageNum: 1 })
                onLoadList()
              }}
            />
          </div>
        </Spin>
      </div>
    </div>
  )
}
