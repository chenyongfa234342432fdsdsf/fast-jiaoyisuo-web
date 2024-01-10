import { Message, Spin } from '@nbit/arco'
import dayjs from 'dayjs'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { usePageContext } from '@/hooks/use-page-context'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { RecordsListResp, AssetsRecordsListReq, RecordsCoinListResp } from '@/typings/api/assets/assets'
import { getRecordsList, getRecordsCoinList } from '@/apis/assets/financial-record'
import { formatDate } from '@/helper/date'
import { useAssetsStore } from '@/store/assets'
import { useMount } from 'ahooks'
import { SearchItem } from './search-form'
import { RecordList } from './record-list'

export function FinancialRecord() {
  const pageContext = usePageContext()
  const { assetsEnums } = useAssetsStore()
  const { coinId, coinName } = pageContext?.urlParsed?.search || {}
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
    /** 钱包类型 */
    type: undefined,
    /** 开始时间 */
    startDate: new Date(dateTimeArr[0]).getTime(),
    /** 结束时间 */
    endDate: new Date(dateTimeArr[1]).getTime(),
    /** 状态 */
    status: undefined,
    pageNum: page.pageNum,
    pageSize: page.pageSize,
  }

  const [searchParams, setSearchParams] = useState(defaultData)
  const [tableData, setTableData] = useState<RecordsListResp[]>([])
  const [totalCount, setTotalCount] = useState<number>(0) // 总条数
  const [coinList, setCoinList] = useState<RecordsCoinListResp[]>([])

  // 资产数据字典
  const assetsStore = useAssetsStore()
  const { fetchAssetEnums, financialRecordListLoading, updateFinancialRecordListLoading } = { ...assetsStore }
  useMount(fetchAssetEnums)

  let paramsActiveObj
  // 获取列表信息
  const getRecordListData = async () => {
    updateFinancialRecordListLoading(true)

    try {
      paramsActiveObj = searchParams
      const { pageNum, pageSize } = paramsActiveObj
      paramsActiveObj.pageNum = pageNum
      paramsActiveObj.pageSize = pageSize
      paramsActiveObj.startDate = new Date(`${formatDate(paramsActiveObj.startDate, 'YYYY-MM-DD')} 00:00:00`).getTime()
      paramsActiveObj.endDate = new Date(`${formatDate(paramsActiveObj.endDate, 'YYYY-MM-DD')} 23:59:59`).getTime()
      searchParams?.type && (searchParams?.type as []).length > 0
        ? (paramsActiveObj.type = searchParams?.type)
        : (paramsActiveObj.type = assetsEnums.walletFinancialRecordTypeEnum.enums.map(item => item.value as number))

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
  const getFinanceCoinTypeListRequest = async () => {
    let params = {}
    params = {
      type: assetsEnums.walletFinancialRecordTypeEnum.enums.map(item => item.value as number).toString(),
    }

    const res = await getRecordsCoinList(params)
    let results = res.data?.coinList
    if (res.isOk && results) {
      setCoinList(results)
    } else {
      setCoinList([])
    }
  }

  const loadRecordListAndCoinList = async () => {
    getRecordListData()
    // getFinanceCoinTypeListRequest()
  }

  /** 搜索按钮事件 */
  const setRecordData = async data => {
    setSearchParams(data)
  }

  /** 翻页事件 */
  const setPageFn = async pageObj => {
    setPage(pageObj)
    let paramsObj = searchParams
    if (paramsObj) {
      paramsObj.pageNum = pageObj.pageNum
      paramsObj.pageSize = pageObj.pageSize
    }

    setSearchParams(paramsObj)
    loadRecordListAndCoinList()
  }

  useEffect(() => {
    if (assetsEnums.walletFinancialRecordTypeEnum.enums.length === 0) return
    getFinanceCoinTypeListRequest()
  }, [assetsEnums.walletFinancialRecordTypeEnum.enums])

  useEffect(() => {
    if (assetsEnums.walletFinancialRecordTypeEnum.enums.length === 0) return
    loadRecordListAndCoinList()
  }, [assetsEnums.walletFinancialRecordTypeEnum.enums, searchParams])

  return (
    <Spin loading={financialRecordListLoading}>
      <div>
        <SearchItem onSearchFn={setRecordData} logType={0} searchParams={searchParams} coinList={coinList} />
        <RecordList totalCount={totalCount} tableData={tableData} page={page} setPage={setPageFn} isInitDetail />
      </div>
    </Spin>
  )
}

export function FinancialRecordLayout() {
  return (
    <AssetsLayout header={<AssetsHeader title={t`assets.financial-record.title`} showRight={false} />}>
      <FinancialRecord />
    </AssetsLayout>
  )
}
