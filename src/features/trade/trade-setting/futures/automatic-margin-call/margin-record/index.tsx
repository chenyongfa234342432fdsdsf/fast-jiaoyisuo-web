import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { Pagination } from '@nbit/arco'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { getMemberAutoAddMarginRecordLog } from '@/apis/future/preferences'
import { AutoAddMarginRecordLogResp } from '@/typings/api/future/preferences'
import UserPopUp from '@/features/user/components/popup'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import { formatDate } from '@/helper/date'
import { getCodeDetailList } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { useAssetsStore } from '@/store/assets'
import { RecordDetailLayout } from '@/features/assets/financial-record/record-detail'
import Icon from '@/components/icon'
import styles from '../index.module.css'
import stylesCommon from '../../../index.module.css'

interface MarginCurrencyPopUpProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean
}

interface dataDictionaryType {
  [key: string]: string
}

const pageBreakSize = 20 // 20 条

function FuturesRecordPopUp({ visible, setVisible, hasCloseIcon }: MarginCurrencyPopUpProps) {
  const [recordDetailShow, setRecordDetailshow] = useState<boolean>(false)
  const [state, setState] = useState<AutoAddMarginRecordLogResp>({
    pageNum: 1,
    pageSize: 20,
    total: 0,
    list: [],
  })

  const dataDictionary = useRef<dataDictionaryType>()
  const recordDetailId = useRef<string>('')

  const billStatusEnum = {
    completed: t`constants/assets/index-21`,
    processing: t`assets.financial-record.search.underway`,
    success: t`assets.enum.tradeRecordStatus.success`,
    fail: t`assets.financial-record.search.failure`,
    error: t`assets.financial-record.search.error`,
  }

  const operationTypeEnum = {
    handler: t`constants/order-19`,
    auto: t`constants/order-21`,
  }

  const { locale } = useCommonStore()
  const { fetchAssetEnums } = useAssetsStore()

  const getAutoAddMarginRecordLog = async (pageNum: number, pageSize: number) => {
    const res = await getMemberAutoAddMarginRecordLog({ pageNum, pageSize })
    if (res.isOk) {
      setState(res.data as AutoAddMarginRecordLogResp)
    }
  }

  const getCodeList = async () => {
    const res = await getCodeDetailList({ codeVal: 'perpetualBillType', lanType: locale })
    if (res.isOk && res.data) {
      const data: dataDictionaryType = {}
      res.data.forEach(item => (data[item?.codeVal] = item?.codeKey))
      dataDictionary.current = data
    }
  }

  const getRecordLogAndCodeDetailList = async () => {
    await Promise.all([getAutoAddMarginRecordLog(state.pageNum, state.pageSize), getCodeList()])
  }

  const { run: getRecordLog, loading } = useRequest(getAutoAddMarginRecordLog, { manual: true })
  const { run: getLogAndCodeList, loading: listLoading } = useRequest(getRecordLogAndCodeDetailList, { manual: true })

  useEffect(() => {
    if (visible) {
      fetchAssetEnums()
      getLogAndCodeList()
    }
  }, [visible])

  const handlerecordDetailShow = (id: string) => {
    recordDetailId.current = id
    setRecordDetailshow(true)
  }

  return (
    <>
      <UserPopUp
        className="user-popup"
        title={
          <div
            style={{ textAlign: 'left' }}
          >{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101371`}</div>
        }
        visible={visible}
        closable={hasCloseIcon}
        maskClosable={false}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className={`record ${styles['automatic-margin-call-record']}`}>
          <div className={`container ${stylesCommon['contract-setting-pop-up-no-result']}`}>
            {state.list.length > 0 ? (
              <>
                <div className="cell-list">
                  {state.list.map(v => (
                    <div className="cell" key={v.id} onClick={() => handlerecordDetailShow(v.id)}>
                      <div className="content">
                        <div className="header">
                          <div className="text">
                            <label>{v.coinName}</label>
                            <label>
                              {v.groupName} {t`features_orders_order_columns_future_5101348`}
                            </label>
                          </div>
                          <div className="price">
                            <IncreaseTag value={v.amount} />
                          </div>
                        </div>
                        <div className="footer">
                          <div className="describe">
                            <label>
                              {formatDate(v.time, 'YYYY-MM-DD HH:mm:ss', false)} {dataDictionary.current?.[v.logType]}{' '}
                              {`(${operationTypeEnum[v.operationType]})`}
                            </label>
                          </div>
                          <div className="status">
                            <label>{billStatusEnum[v.status]}</label>
                          </div>
                        </div>
                      </div>
                      <Icon name="transaction_arrow" hasTheme />
                    </div>
                  ))}
                </div>

                {state.total > pageBreakSize && (
                  <div className="pagination">
                    <Pagination
                      current={state.pageNum}
                      pageSize={state.pageSize}
                      total={state.total}
                      onChange={getRecordLog}
                    />
                  </div>
                )}

                <div className="tips">
                  <div className="icon">
                    <Icon name="prompt-symbol" />
                  </div>
                  <div className="text">
                    <label>{t`features_trade_trade_setting_futures_automatic_margin_call_margin_record_index_5101505`}</label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="no-result">
                  <Icon name="no_data" hasTheme isRemoteUrl width={108} height={80} />
                  <label>{t`features_orders_order_table_layout_5101267`}</label>
                </div>

                <FullScreenSpin isShow={loading || listLoading} customBackground="bg-card_bg_color_03" />
              </>
            )}
          </div>
        </div>
      </UserPopUp>

      <RecordDetailLayout
        visible={recordDetailShow}
        setVisible={setRecordDetailshow}
        recordId={recordDetailId.current}
      />
    </>
  )
}

export default FuturesRecordPopUp
