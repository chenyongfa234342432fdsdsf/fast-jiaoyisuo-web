/**
 * 合约组历史记录 - 保证金记录&合约组记录
 */
import {
  FinancialRecordLogTypeEnum,
  AssetsRouteEnum,
  FinancialRecordTypeEnum,
  FinancialRecordListFromPage,
} from '@/constants/assets'
import { Message, Spin } from '@nbit/arco'
import AssetsTabs from '@/features/assets/common/assets-tabs'
import dayjs from 'dayjs'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { usePageContext } from '@/hooks/use-page-context'
import { AssetsLayout, ChildrenClassNameEnum } from '@/features/assets/assets-layout'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { RecordsListResp, AssetsRecordsListReq, RecordsCoinListResp } from '@/typings/api/assets/assets'
import { getRecordsList, getRecordsCoinList } from '@/apis/assets/financial-record'
import { link } from '@/helper/link'
import { formatDate } from '@/helper/date'
import { useAssetsStore } from '@/store/assets'
import { useMount } from 'ahooks'
import { FuturesHistoryTabEnum } from '@/constants/assets/futures'
import { SearchItem } from './search-form'
import styles from './index.module.css'
import { RecordList } from '../../financial-record/record-list'

export function FuturesHistory() {
  const pageContext = usePageContext()
  const coinId = pageContext?.urlParsed?.search?.coinId || ''
  const type = pageContext?.urlParsed?.search?.type || FuturesHistoryTabEnum.futures

  const { groupId, groupName = '' } = pageContext.routeParams
  // 资产数据字典
  const { fetchAssetEnums } = useAssetsStore()
  useMount(fetchAssetEnums)
  const { updateFinancialRecordListLoading, financialRecordListLoading } = useAssetsStore()

  const [tabType, setTabType] = useState(type)
  const [coinList, setCoinList] = useState<RecordsCoinListResp[]>([])

  // 默认查最近一周数据
  const defaultDate = [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  const [dateTimeArr, setDateTimeArr] = useState<any>([dayjs(defaultDate[0]), dayjs(defaultDate[1])])

  const [page, setPage] = useState({
    pageNum: 1,
    pageSize: 20,
  })

  /** 默认搜索条件 */
  const defaultData: AssetsRecordsListReq = {
    /** 资产 */
    coinId,
    /** 充提类型，1. 充币，2. 提币 ,3 pay , 4. 冲正 */
    type: undefined,
    /** 开始时间 */
    startDate: new Date(dateTimeArr[0]).getTime(),
    /** 结束时间 */
    endDate: new Date(dateTimeArr[1]).getTime(),
    /** 状态 */
    status: undefined,
    /** 财务类型：总览时不传，1，现货，2、充提、3、借还款、4、合约、5、手续费、6、衍生品、7、其他 */
    logType: FinancialRecordLogTypeEnum.futures,
    pageNum: page.pageNum,
    pageSize: page.pageSize,
    groupId,
  }

  /** 资产财务记录 */
  const assetsRecord = {
    /** 合约组记录 */
    futures: { ...defaultData },
    /** 保证金记录 */
    margin: {
      ...defaultData,
      type: [
        FinancialRecordTypeEnum.extractBond,
        FinancialRecordTypeEnum.rechargeBond,
        FinancialRecordTypeEnum.futuresTransfer,
      ] as number[],
    },
  }
  const [searchParams, setSearchParams] = useState(assetsRecord)
  const [tableData, setTableData] = useState<RecordsListResp[]>([])
  const [totalCount, setTotalCount] = useState<number>(0) // 总条数

  // 得到当前选中的接口入参
  const getActiveParams = val => {
    const { futures, margin } = searchParams
    if (val === FuturesHistoryTabEnum.futures) {
      return futures
    }
    if (val === FuturesHistoryTabEnum.margin) {
      return margin
    }
    return futures
  }

  const getPageNumAndSize = data => {
    const { pageNum, pageSize } = data
    return { pageNum, pageSize }
  }

  // 获取当前的 page 对象
  const getActivePage = val => {
    const { futures, margin } = searchParams
    if (+val === +FinancialRecordLogTypeEnum.futures) {
      return getPageNumAndSize(futures)
    }
    if (+val === +FuturesHistoryTabEnum.margin) {
      return getPageNumAndSize(margin)
    }

    return getPageNumAndSize(futures)
  }

  let paramsActiveObj
  // 获取列表信息
  const getRecordListData = async (val?: string) => {
    updateFinancialRecordListLoading(true)
    try {
      paramsActiveObj = getActiveParams(val)
      const { pageNum, pageSize } = paramsActiveObj
      paramsActiveObj.pageNum = pageNum
      paramsActiveObj.pageSize = pageSize
      paramsActiveObj.startDate = new Date(`${formatDate(paramsActiveObj.startDate, 'YYYY-MM-DD')} 00:00:00`).getTime()
      paramsActiveObj.endDate = new Date(`${formatDate(paramsActiveObj.endDate, 'YYYY-MM-DD')} 23:59:59`).getTime()
      if (val === FuturesHistoryTabEnum.margin) {
        paramsActiveObj.type = [
          FinancialRecordTypeEnum.extractBond,
          FinancialRecordTypeEnum.rechargeBond,
          FinancialRecordTypeEnum.futuresTransfer,
        ]
      }
      const res = await getRecordsList(paramsActiveObj)
      const { isOk, data: { list = [], total = 0 } = {} } = res || {}
      if (!isOk) {
        updateFinancialRecordListLoading(false)
        return
      }

      setTotalCount(total)
      setTableData(list)
      total > pageSize && setPage({ pageNum, pageSize })
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    } finally {
      updateFinancialRecordListLoading(false)
    }
  }

  /** 获取所有币币交易对 */
  const getFinanceCoinTypeListRequest = async (val?: string) => {
    let params = {}
    if (val === FuturesHistoryTabEnum.margin) {
      params = {
        type: [
          FinancialRecordTypeEnum.extractBond,
          FinancialRecordTypeEnum.rechargeBond,
          FinancialRecordTypeEnum.futuresTransfer,
        ].toString(),
      }
    } else {
      params = { logType: FinancialRecordLogTypeEnum.futures }
    }

    const res = await getRecordsCoinList(params)
    let results = res.data?.coinList
    if (res.isOk && results) {
      setCoinList(results)
    } else {
      setCoinList([])
    }
  }

  const loadRecordListAndCoinList = async (val?: string) => {
    getRecordListData(val)
    getFinanceCoinTypeListRequest(val)
  }

  /** 搜索按钮事件 */
  const setRecordData = async data => {
    setSearchParams(data)
    loadRecordListAndCoinList(tabType)
  }

  /** tab 切换事件 */
  const onChangeLogsType = async val => {
    setTabType(val)
    // 切换 tab 更新时间默认值
    setDateTimeArr(defaultDate)
    loadRecordListAndCoinList(val)

    // 有 type 参数时，点击切换 tab 时修改 url 的 type 参数
    link(`/assets/futures/history/${groupName}/${groupId}?type=${val}`, {
      overwriteLastHistoryEntry: true,
    })
  }

  /** 翻页事件 */
  const setPageFn = async pageObj => {
    setPage(pageObj)
    let paramsObj = getActiveParams(tabType)
    paramsObj.pageNum = pageObj.pageNum
    paramsObj.pageSize = pageObj.pageSize
    loadRecordListAndCoinList(tabType)
  }

  useEffect(() => {
    loadRecordListAndCoinList(tabType)
  }, [])

  const tabList = [
    {
      title: t`modules_assets_futures_futures_history_index_page_server_5101420`,
      id: FuturesHistoryTabEnum.futures,
    },
    {
      title: t`features_assets_futures_futures_history_index_r3nlsh3skpqadrhgj83mu`,
      id: FuturesHistoryTabEnum.margin,
    },
  ]

  return (
    <div className={styles.scoped}>
      <AssetsTabs tabList={tabList} value={tabType} onChange={onChangeLogsType} />
      <Spin loading={financialRecordListLoading}>
        {tabList &&
          tabList.map(item => (
            <div key={`content_${item.id}`} className={tabType === item.id ? 'block' : 'hidden'}>
              <SearchItem
                key={`search_${item.id}`}
                onSearchFn={setRecordData}
                logType={item.id}
                tabType={item.id}
                searchParams={searchParams}
                coinList={coinList}
              />
              <RecordList
                key={`recordList_${item.id}`}
                tabType={item.id}
                totalCount={totalCount}
                tableData={tableData}
                page={getActivePage(item.id)}
                setPage={setPageFn}
                loading={financialRecordListLoading}
                fromPage={FinancialRecordListFromPage.other}
              />
            </div>
          ))}
      </Spin>
    </div>
  )
}

export function FuturesHistoryLayout() {
  const pageContext = usePageContext()
  const { groupName } = pageContext.routeParams
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.futures}
      header={
        <AssetsHeader
          title={
            <>
              {groupName || '--'}
              {t`features_assets_futures_futures_history_index_5101545`}
            </>
          }
          showRight={false}
        />
      }
    >
      <FuturesHistory />
    </AssetsLayout>
  )
}
