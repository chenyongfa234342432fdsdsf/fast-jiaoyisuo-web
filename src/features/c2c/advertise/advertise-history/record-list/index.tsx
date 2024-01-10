import { Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import AssetsTable from '@/features/assets/common/assets-table'
import ListEmpty from '@/components/list-empty'
import { IAdvertList } from '@/typings/api/c2c/advertise/post-advertise'
import { formatCurrency } from '@/helper/decimal'
import { AdvertisingDirectionTypeEnum, getHistoryStatusTypeName, HistoryTabTypeEnum } from '@/constants/c2c/advertise'
import Link from '@/components/link'
import { getTextFromStoreEnums } from '@/helper/store'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { getAdvertAppealStatus, getAdvertDown, getAdvertProgressStatus } from '@/apis/c2c/advertise'
import { useRef, useState } from 'react'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import { ErrorTypeEnum } from '@/constants/assets'
import AssetsPagination from '@/features/assets/common/pagination'
import styles from './index.module.css'
import { PaymentTypeInfo } from '../../common/payment-type-info'
import { RestockModal } from '../../common/restock-modal'
import { DeleteAdvModal } from '../../common/delete-adv-modal'
import { MainChainAddress } from '../../common/main-chain-address'

interface IRecordListProps {
  activeTab?: number | string
  tableData: IAdvertList[]
  totalCount?: number
  page: any
  setPage(val): void
  optCallbackFn?(val?): void
  loading?: boolean
}

/** 渲染列表 */
export function RecordList(props: IRecordListProps) {
  const { activeTab, totalCount, tableData, page, setPage, loading, optCallbackFn } = props
  const { advertiseEnums } = useC2CAdvertiseStore()
  const [visibleExitEntrustOrderPrompt, setVisibleExitEntrustOrderPrompt] = useState(false)
  const [visibleDownPrompt, setVisibleDownPrompt] = useState(false)
  const [visibleUpPrompt, setVisibleUpPrompt] = useState(false)
  const [visibleDeletePrompt, setVisibleDeletePrompt] = useState(false)
  const [visibleDeleteExitOrderPrompt, setVisibleDeleteExitOrderPrompt] = useState(false)
  const [advertId, setAdvertId] = useState<string>()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  /** 下架广告确认 */
  const onRemoveAds = async (params: IAdvertList) => {
    setAdvertId(params?.advertId)
    const res = await getAdvertProgressStatus({ advertId: params?.advertId })
    const { isOk, data } = res || {}
    if (!isOk || !data) {
      return
    }

    if (data?.hasOrder) {
      setVisibleExitEntrustOrderPrompt(true)
      return
    }
    setVisibleDownPrompt(true)
  }

  /**
   * 下架广告提交
   * @param advertId 广告 ID
   * @returns isSuccess
   */
  const onRemoveAdsSubmit = async () => {
    if (!advertId) return
    const res = await getAdvertDown({ advertId })

    const { isOk, data } = res || {}
    if (!isOk || !data?.isSuccess) {
      Message.error({
        content: t`features_c2c_advertise_advertise_history_record_list_index_jwqpzo-xtkwwz6tlpsqd8`,
        id: ErrorTypeEnum.serverError,
      })
      return false
    }

    optCallbackFn && optCallbackFn()
    Message.success(t`features_c2c_advertise_advertise_history_record_list_index_imnk85fl_p8rfqbiuqih7`)
    return true
  }

  /**
   * 删除
   */
  const onDel = async (params: IAdvertList) => {
    setAdvertId(params?.advertId)
    const res = await getAdvertAppealStatus({ advertId: params?.advertId })
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    if (data?.hasOrder) {
      setVisibleDeleteExitOrderPrompt(true)
      return
    }

    setVisibleDeletePrompt(true)
  }

  const cellStyleRight: any = {
    headerCellStyle: {
      textAlign: 'right',
    },
    bodyCellStyle: {
      textAlign: 'right',
    },
  }
  const tableColumns = [
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_qpepcugw5099qbddbuxyj`,
      dataIndex: 'advertId',
      sorter: true,
      render: (col, record) => (
        <Link href={`/c2c/adv/detail/${record.advertId}`} className="tip-text">
          {record.advertId.replace(/(.{3}).*(.{4})/, '$1****$2')}
        </Link>
      ),
    },
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_vrn9u7kwhe-3htxy8oqpw`,
      dataIndex: 'coinName',
      render: (col, record) => (
        <div
          className={
            record.advertDirectCd === AdvertisingDirectionTypeEnum.buy ? 'text-success_color' : 'text-warning_color'
          }
        >
          {record.coinName} / {record.areaName}
        </div>
      ),
    },
    {
      title: t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`,
      dataIndex: 'tradeTypeCd',
      render: (col, record: IAdvertList) => <MainChainAddress advertDetail={record} />,
    },
    {
      title: t`trade.c2c.singleprice`,
      dataIndex: 'price',
      render: (col, record) => (
        <>
          {formatCurrency(record.price)} {record.areaName}
        </>
      ),
    },
    {
      title:
        activeTab === HistoryTabTypeEnum.on
          ? t`features_c2c_advertise_advertise_history_record_list_index_g--nszkwn3382glze9wie`
          : t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101394`,
      dataIndex: 'type',
      render: (col, record) => (
        <div>
          {activeTab === HistoryTabTypeEnum.on ? (
            <div className="flex flex-col">
              <div className="flex">
                <div className="price-limit">
                  {t`features_c2c_advertise_advertise_history_record_list_index_wvbglqcsk6mbkp1guxv9i`}
                </div>
                <div>
                  {formatCurrency(record.quantity)} {record.coinName}
                </div>
              </div>
              <div className="flex">
                <div className="price-limit">{t`features_c2c_advertise_advertise_history_record_list_index_-u1_sqw2sq21br1ynkqun`}</div>
                <div>
                  {formatCurrency(record.minAmount)} - {formatCurrency(record.maxAmount)} {record.coinName}
                </div>
              </div>
            </div>
          ) : (
            `${formatCurrency(record.minAmount)} - ${formatCurrency(record.maxAmount)} ${record.coinName}`
          )}
        </div>
      ),
    },
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_0iojrzrcvaoozgr5umlwi`,
      dataIndex: 'payments',
      render: (col, record) => (
        <PaymentTypeInfo
          paymentClassName={'payment-text'}
          paymentList={record.newPayments}
          advertId={record.advertId}
        />
      ),
    },
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_s-c9ig2p2lbu012tzomzp`,
      dataIndex: 'statusCd',
      render: (col, record) => (
        <div>
          {activeTab === HistoryTabTypeEnum.on
            ? getHistoryStatusTypeName(record.advertNewStatus)
            : getTextFromStoreEnums(record.statusCd, advertiseEnums.advertisingStatus.enums)}
        </div>
      ),
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'Operation',
      ...cellStyleRight,
      render: (col, record) => (
        <div className="list-opt-button">
          {activeTab === HistoryTabTypeEnum.on ? (
            <span
              className="header-operate"
              onClick={e => {
                e.stopPropagation()
                setAdvertId(record?.advertId)
                onRemoveAds(record)
              }}
            >
              {t`features_c2c_advertise_advertise_history_index_nf1ozju-wcfgka56lmq4i`}
            </span>
          ) : (
            <div className="header-operate">
              <span
                className={`${record.grey && 'is-disable'}`}
                onClick={e => {
                  e.stopPropagation()

                  if (record.grey) return
                  setAdvertId(record?.advertId)
                  setVisibleUpPrompt(true)
                }}
              >
                {t`features_c2c_advertise_advertise_history_record_list_index_lyjaqs5ylpjtk-n6-ee-q`}
              </span>
              <span className="operate-line">|</span>
              <span
                onClick={e => {
                  e.stopPropagation()
                  onDel(record)
                }}
              >
                {t`assets.common.delete`}
              </span>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className={styles.scoped} ref={tableContainerRef}>
      <AssetsTable
        border
        rowKey={record => `${record.advertId}`}
        columns={tableColumns}
        data={tableData}
        pagination={false}
        sortable
        noDataElement={<ListEmpty loading={loading} />}
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
      <AssetsPopupTips
        visible={visibleDeleteExitOrderPrompt}
        setVisible={setVisibleDeleteExitOrderPrompt}
        slotContent={<div>{t`features_c2c_advertise_advertise_history_record_list_index_v_j9crbbjmuli0g4-wqqg`}</div>}
        onOk={() => {
          setVisibleDeleteExitOrderPrompt(false)
        }}
        okText={t`features_agent_apply_index_5101501`}
      />
      {/* 删除广告 */}
      {advertId && visibleDeletePrompt && (
        <DeleteAdvModal
          visible={visibleDeletePrompt}
          setVisible={setVisibleDeletePrompt}
          advertId={advertId}
          callbackFn={optCallbackFn}
        />
      )}
      {/* 有进行中订单，无法下架 */}
      <AssetsPopupTips
        visible={visibleExitEntrustOrderPrompt}
        setVisible={setVisibleExitEntrustOrderPrompt}
        slotContent={<div>{t`features_c2c_advertise_advertise_history_index_4q7bumtcjccoxqoknbqpd`}</div>}
        onOk={() => {
          setVisibleExitEntrustOrderPrompt(false)
        }}
        okText={t`features_agent_apply_index_5101501`}
      />
      {/* 确认下架广告 */}
      <AssetsPopupTips
        visible={visibleDownPrompt}
        setVisible={setVisibleDownPrompt}
        popupTitle={t`features_c2c_advertise_advertise_history_index_nf1ozju-wcfgka56lmq4i`}
        slotContent={<div>{t`features_c2c_advertise_advertise_history_index_l0qogqnnoasqtup21ylt3`}</div>}
        onOk={() => {
          onRemoveAdsSubmit()
          setVisibleDownPrompt(false)
        }}
      />
      {/* 重新上架 */}
      {advertId && visibleUpPrompt && (
        <RestockModal
          visible={visibleUpPrompt}
          setVisible={setVisibleUpPrompt}
          advertId={advertId}
          callbackFn={optCallbackFn}
        />
      )}
    </div>
  )
}
