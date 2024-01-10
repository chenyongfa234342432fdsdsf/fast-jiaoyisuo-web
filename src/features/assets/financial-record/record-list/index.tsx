import {
  AssetsTransferTypeList,
  FinancialRecordListFromPage,
  FinancialRecordLogTypeEnum,
  RecordFuturesTypeList,
  RecordRechargeExtractBond,
  RecordValueNoSymbol,
} from '@/constants/assets'
import { IncreaseTag } from '@nbit/react'
import { t } from '@lingui/macro'
import { useState, useEffect, useRef } from 'react'
import AssetsTable from '@/features/assets/common/assets-table'
import { RecordsListResp } from '@/typings/api/assets/assets'
import { formatDate } from '@/helper/date'
import ListEmpty from '@/components/list-empty'
import { usePageContext } from '@/hooks/use-page-context'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsStore } from '@/store/assets'
import { RecordDetailLayout } from '../record-detail'
import styles from './index.module.css'
import AssetsPagination from '../../common/pagination'

interface ITableColumnsProps {
  /** 是否显示类型 */
  type?: boolean
  /** 是否显示资产列 */
  businessCoin?: boolean
}

interface IRecordListProps {
  /** 日志类型 */
  tabType?: number | string
  /** 列表数据 */
  tableData: RecordsListResp[]
  /** 总条数 */
  totalCount?: number
  /** 分页 */
  page: any
  /** 分页事件 */
  setPage(val): void
  /** 是否显示逐仓名 */
  showGroupName?: boolean
  /** loading 状态 */
  loading?: boolean
  /** 页面来源 - 财务记录 - 合约：区分某逐仓》某逐仓无符号黑色展示，其他类型都需要涨跌色，默认其他 */
  fromPage?: FinancialRecordListFromPage
  /** 列的展示隐藏 */
  columns?: ITableColumnsProps
  /** 是否需要初始化详情，只有财务页面初始化 */
  isInitDetail?: boolean
}

/** 渲染列表 */
export function RecordList(props: IRecordListProps) {
  const {
    tabType = FinancialRecordLogTypeEnum.main,
    totalCount,
    tableData,
    page,
    setPage,
    columns = { type: true, businessCoin: true },
    showGroupName = tabType === FinancialRecordLogTypeEnum.futures,
    loading,
    isInitDetail = false,
    fromPage = tabType === FinancialRecordLogTypeEnum.futures
      ? FinancialRecordListFromPage.futuresRecordList
      : FinancialRecordListFromPage.other,
  } = props
  const [visibleDetail, setVisibleDetail] = useState(false)
  const pageContext = usePageContext()
  const logTypeId = Number(pageContext?.urlParsed?.search?.type)
  const defaultRecordId = pageContext?.urlParsed?.search?.id
  const [recordId, setRecordId] = useState<string>(defaultRecordId)
  const [recordDetail, setRecordDetail] = useState<RecordsListResp>()
  const { assetsEnums, financialRecordListLoading } = useAssetsStore()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  /** 查看记录详情 */
  const openDetailModal = async (id: string, recordDetail?: RecordsListResp) => {
    if (!id) return
    setRecordId(id)
    setVisibleDetail(true)
    recordDetail && setRecordDetail(recordDetail)
  }

  const initFn = (id: string) => {
    // 公告通知查看记录详情，必须传 type 和 记录 id
    if (!id) return
    if (tabType === FinancialRecordLogTypeEnum.overview || logTypeId === tabType) {
      openDetailModal(id)
    }
  }

  useEffect(() => {
    // 公告通知查看记录详情
    isInitDetail && initFn(recordId)
  }, [defaultRecordId])

  const cellStyle: any = {
    headerCellStyle: {
      textAlign: 'right',
    },
    bodyCellStyle: {
      textAlign: 'right',
    },
  }
  const tableColumns = [
    {
      title: t`assets.financial-record.creationTime`,
      dataIndex: 'createdByTime',
      render: (col, record) => formatDate(record.createdByTime),
    },
    {
      title: t`assets.index.overview.menuName`,
      dataIndex: 'businessCoin',
      headerCellStyle: { textAlign: 'right', display: columns?.businessCoin === false ? 'none' : '' },
      bodyCellStyle: { textAlign: 'right', display: columns?.businessCoin === false ? 'none' : '' },
      render: (col, record) => (
        <div>
          {record.businessCoin}{' '}
          {record.groupType && RecordFuturesTypeList.includes(record.type)
            ? getTextFromStoreEnums(record.groupType, assetsEnums.financialRecordTypeSwapList.enums)
            : ''}
        </div>
      ),
    },
    {
      title: t`features_assets_futures_futures_details_index_5101367`,
      dataIndex: 'groupName',
      headerCellStyle: { textAlign: 'right', display: showGroupName ? '' : 'none' },
      bodyCellStyle: { textAlign: 'right', display: showGroupName ? '' : 'none' },
      render: (col, record) => (
        <div>
          {AssetsTransferTypeList.includes(record.type) ? (
            <div className="info-transfer">
              <span>{record.from || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`}</span>
              <span className="transfer-separate">{t`features/assets/saving/history-list/index-0`}</span>
              <span>{record.to || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`}</span>
            </div>
          ) : (
            record.groupName
          )}
        </div>
      ),
    },
    {
      title: t`assets.financial-record.search.changeVal`,
      dataIndex: 'total',
      ...cellStyle,
      render: (col, record) => (
        <div>
          <IncreaseTag
            value={record.total}
            hasColor={
              !(fromPage === FinancialRecordListFromPage.futuresRecordList && record.from && record.to) &&
              !RecordValueNoSymbol.includes(record.type)
            }
            hasPrefix={
              !(fromPage === FinancialRecordListFromPage.futuresRecordList && record.from && record.to) &&
              !RecordValueNoSymbol.includes(record.type)
            }
          />
        </div>
      ),
    },
    {
      title:
        Number(tabType) === Number(FinancialRecordLogTypeEnum.rebate)
          ? t`features_assets_financial_record_search_form_index_njivosohlh`
          : t`assets.financial-record.search.type`,
      dataIndex: 'type',
      headerCellStyle: { textAlign: 'right', display: columns?.type === false ? 'none' : '' },
      bodyCellStyle: { textAlign: 'right', display: columns?.type === false ? 'none' : '' },
      render: (col, record) =>
        `${getTextFromStoreEnums(record.type, assetsEnums.walletFinancialRecordTypeEnum.enums)} ${
          RecordRechargeExtractBond.includes(record.type)
            ? `(${getTextFromStoreEnums(record.operationType, assetsEnums.financialRecordTypeOperationList.enums)})`
            : ''
        }`,
    },
    {
      title: t`features_agent_agency_center_revenue_details_index_5101515`,
      dataIndex: 'rebateTypeCd',
      headerCellStyle: {
        textAlign: 'right',
        display: Number(tabType) === Number(FinancialRecordLogTypeEnum.rebate) ? '' : 'none',
      },
      bodyCellStyle: {
        textAlign: 'right',
        display: Number(tabType) === Number(FinancialRecordLogTypeEnum.rebate) ? '' : 'none',
      },
      render: (col, record) => getTextFromStoreEnums(record?.rebateTypeCd, assetsEnums.financialRecordRebateType.enums),
    },
    {
      title: t`assets.financial-record.search.state`,
      dataIndex: 'status',
      ...cellStyle,
      render: (col, record) => getTextFromStoreEnums(record.status, assetsEnums.financialRecordStateEnum.enums), // getFinancialRecordStateEnumName(record.status),
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'Operation',
      ...cellStyle,
      render: (col, record) => (
        <div className="list-opt-button" onClick={() => openDetailModal(record.id, record)}>
          {t`assets.financial-record.detail`}
        </div>
      ),
    },
  ]
  return (
    <div className={styles.scoped} ref={tableContainerRef}>
      <AssetsTable
        border={{
          bodyCell: false,
          cell: false,
          wrapper: false,
        }}
        rowKey={record => `${record.id}`}
        columns={tableColumns}
        data={tableData}
        pagination={false}
        noDataElement={<ListEmpty loading={loading || financialRecordListLoading} />}
        // onRow={record => openDetailModal(record.id)}
      />
      {tableData && tableData.length > 0 && (
        <AssetsPagination
          targetRef={tableContainerRef}
          size={'default'}
          current={page.pageNum}
          pageSize={page.pageSize}
          total={totalCount}
          onChange={(pageNumber: number, pageSize: number) => {
            setPage({ ...page, pageNum: pageNumber, pageSize })
          }}
        />
      )}
      {visibleDetail && (
        <RecordDetailLayout
          recordId={recordId}
          visible={visibleDetail}
          setVisible={setVisibleDetail}
          fromPage={fromPage}
          total={recordDetail?.total || ''}
        />
      )}
    </div>
  )
}
