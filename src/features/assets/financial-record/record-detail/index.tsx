/**
 * 财务记录详情弹框组件
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import {
  FinancialRecordListFromPage,
  FinancialRecordTypeEnum,
  RecordExpenseDetailsList,
  RecordTransactionDetailsList,
} from '@/constants/assets'
import { Message } from '@nbit/arco'
import { useCopyToClipboard } from 'react-use'
import Icon from '@/components/icon'
import Tabs from '@/components/tabs'
import { PerpetualMigrateTypeEnum, PerpetualOrderAcceptTypeEnum } from '@/constants/assets/futures'
import { AssetsRecordsDetails } from '@/typings/api/assets/assets'
import { useAssetsStore } from '@/store/assets'
import { getRecordsDetails } from '@/apis/assets/financial-record'
import { useUnmount } from 'ahooks'
import classNames from 'classnames'
import styles from './index.module.css'
import { RecordDetailState } from './record-state/index'
import { RecordDetailsInfo } from './record-details-info'
import { FundingLogs } from './order-funding-list/funding-logs-list'
import { OrderLogs } from './order-funding-list/order-logs-list'
import ContactItem from './contact-us'
import AssetsPopUp from '../../common/assets-popup'

/** 调用组件需要提前请求数据字典接口-fetchAssetEnums */
interface RecordDetailLayoutProps {
  visible: boolean
  setVisible: (val: boolean) => void
  /** 记录 id */
  recordId: string
  /** 页面来源 - 财务记录 - 合约：区分某逐仓》某逐仓无符号黑色展示，其他类型都需要涨跌色 */
  fromPage?: FinancialRecordListFromPage
  /** 列表的变动值 */
  total?: string
}
export function RecordDetailLayout(props: RecordDetailLayoutProps) {
  const { recordId, fromPage = FinancialRecordListFromPage.other, total, visible, setVisible } = props
  const [recordDetailData, setRecordDetailData] = useState<AssetsRecordsDetails>()
  const { updateFinancialRecordDetail, updateFinancialRecordListLoading } = useAssetsStore()

  // 获取财务记录详情
  const getRecordDetailData = async (id: string) => {
    updateFinancialRecordListLoading(true)
    const res = await getRecordsDetails({ id })
    const { isOk, data } = res || {}

    if (!isOk) {
      updateFinancialRecordListLoading(false)
      return
    }

    let details: any = {}

    if (data) {
      details = data.depositWithdraw || data.fee || data.perpetual || data.commission || data.c2cBillLogDetail
    }

    updateFinancialRecordListLoading(false)
    updateFinancialRecordDetail(details)
    setRecordDetailData(details)
  }

  const {
    /** 交易 hash */
    txHash = '',
    /** 财务流水 */
    serialNo = '--',
    /** 创建时间 */
    // createdByTime = '',
    /** 类型，1. 充币，2. 提币，3.pay ,4.冲正 */
    typeInd = FinancialRecordTypeEnum.withdraw,
    /** 充值地址 */
    address = '',
    /** 成交明细 */
    dealDetail,
    /** 资金明细 */
    assetDetail,
    /** 1：接管单，2:非接管单 */
    isAccept,
    migrateType,
  } = recordDetailData || {}

  const [state, copyToClipboard] = useCopyToClipboard()
  const copyToClipbordFn = val => {
    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`assets.financial-record.copySuccess`)
  }

  const TabType = {
    transactionLogs: 0,
    funding: 1,
    // margin: 2,
  }
  const [activeTab, setActiveTab] = useState(TabType.transactionLogs)
  const [tabList, setTabList] = useState<any>()

  const onTabChange = (tab: any) => {
    setActiveTab(tab.id)
  }

  useEffect(() => {
    recordId && getRecordDetailData(recordId)
  }, [recordId])

  useEffect(() => {
    if (!typeInd) return
    // 展示成交明细
    const showTransactionLogs = RecordTransactionDetailsList.indexOf(typeInd) > -1
    // 展示资金明细
    const showFunding =
      (RecordExpenseDetailsList.indexOf(typeInd) > -1 ||
        RecordTransactionDetailsList.indexOf(typeInd) > -1 ||
        (typeInd === FinancialRecordTypeEnum.migrate && migrateType !== PerpetualMigrateTypeEnum.merge)) &&
      isAccept === PerpetualOrderAcceptTypeEnum.no

    const originTabList = [
      {
        title: t`features_orders_details_spot_5101081`,
        id: TabType.transactionLogs,
        visible: showTransactionLogs,
      },
      {
        title: t`features_orders_details_future_5101355`,
        id: TabType.funding,
        visible: showFunding,
      },
    ]
    const tabData = originTabList.filter(tab => tab.visible)
    if (tabData.length > 0) {
      setTabList(tabData)
      setActiveTab(tabData[0].id)
    }
  }, [typeInd])

  useUnmount(() => {
    updateFinancialRecordDetail({})
  })

  if (!recordDetailData) return <div></div>

  return (
    <AssetsPopUp
      title={<div style={{ textAlign: 'left' }}>{t`assets.common.details`}</div>}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false)
      }}
      style={{ width: 520 }}
    >
      <div className={styles.scoped}>
        <div className="detail-wrap">
          <div className="serial-no">
            <div>
              {t`assets.financial-record.orderNo`}
              {serialNo}
            </div>
            {serialNo && <Icon name="copy" hasTheme onClick={() => copyToClipbordFn(serialNo)} className="copy-icon" />}
          </div>
          {/* 财务记录类型和状态信息 */}
          {recordDetailData && <RecordDetailState fromPage={fromPage} total={total} />}
          {/* 财务记录详情 */}
          {recordDetailData && <RecordDetailsInfo />}
          {/* 充值记录展示联系我们 */}
          {typeInd && typeInd === FinancialRecordTypeEnum.deposit && (
            <ContactItem address={`${address}_${txHash}`} type={typeInd} />
          )}

          {/* 成交明细/资金明细 */}
          {tabList && (
            <div>
              <div className={classNames('tab-title', { 'tab-title-no-line': tabList.length === 1 })}>
                <Tabs mode="line" value={activeTab} tabList={tabList} onChange={onTabChange} />
              </div>
              {dealDetail && activeTab === TabType.transactionLogs && <OrderLogs logs={dealDetail} />}
              {assetDetail && activeTab === TabType.funding && <FundingLogs logs={assetDetail} typeInd={typeInd} />}
            </div>
          )}
        </div>
      </div>
    </AssetsPopUp>
  )
}
