import classNames from 'classnames'
import { Modal, Message } from '@nbit/arco'
import { useState, memo, forwardRef, useImperativeHandle } from 'react'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { formatDate } from '@/helper/date'
import { useCopyToClipboard } from 'react-use'
import { C2cHistoryUserRole, getC2cHistoryDirectionTitle } from '@/constants/c2c/history-records'
import { C2cHistoryRecordsResponse } from '@/typings/api/c2c/history-records'
import styles from './index.module.css'
import { useShowOrderComponent } from '../../c2c-orderdetail-header/use-show-order-component'
import { C2COrderStatus, IsNotOtc } from '../../c2c-trade'

function OrderDetailModal(_, ref) {
  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState<boolean>(false)

  const [orderDetail, setOrderDetail] = useState<C2cHistoryRecordsResponse>({})

  const [state, copyToClipboard] = useCopyToClipboard()

  const setOrderDetailModalVisibleChange = () => {
    setOrderDetailModalVisible(false)
  }

  useImperativeHandle(ref, () => ({
    openChartSettingModal(item) {
      setOrderDetailModalVisible(true)
      setOrderDetail(item)
    },
  }))

  /**
   * 复制
   */
  const onCopy = val => {
    if (!val) {
      return
    }

    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`assets.financial-record.copySuccess`)
  }

  const { statusTitle = '' } = useShowOrderComponent({}, orderDetail, {}, {}).showSelectedOrderComponent || {}

  const getStatusText = () => {
    const isShowExp = [
      C2COrderStatus.CREATED,
      C2COrderStatus.WAS_PAYED,
      C2COrderStatus.WAS_TRANSFER_COIN,
      C2COrderStatus.WAS_COLLECTED,
    ].includes((orderDetail?.statusCd || '') as C2COrderStatus)

    return isShowExp && IsNotOtc.isOtc === orderDetail?.isOtc ? (
      <span className="title mr-1">{t`assets.financial-record.search.underway`}</span>
    ) : (
      <span className="title mr-1">{statusTitle}</span>
    )
  }

  return (
    <div>
      <Modal
        visible={orderDetailModalVisible}
        footer={null}
        className={classNames(styles['order-detail-modal'])}
        closeIcon={false}
      >
        <div>
          <div className="detail-modal-header">
            <span className="text-text_color_01 text-xl font-medium">{getStatusText()}</span>
            <span onClick={setOrderDetailModalVisibleChange}>
              <Icon name="close" hasTheme />
            </span>
          </div>
          <div className="text-sm text-text_color_01 mt-1 mb-6">{t`features_c2c_trade_history_records_content_table_order_detail_modal_xdrqf2vlbv`}</div>
          <div className="font-medium text-text_color_01 text-base">{t`features/orders/details/future-9`}</div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`trade.c2c.payment`}</span>
            <span className="text-sm">{t`features_c2c_trade_history_records_content_table_order_detail_modal_atbry5spxl`}</span>
          </div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`features_c2c_trade_c2c_orderdetail_pay_index_xk6sszrtw1tgwc6swkmek`}</span>
            <span
              className={classNames('text-sm', {
                'text-sell_down_color': orderDetail?.buyAndSellRole === C2cHistoryUserRole.seller,
                'text-buy_up_color': orderDetail?.buyAndSellRole !== C2cHistoryUserRole.seller,
              })}
            >
              {getC2cHistoryDirectionTitle(orderDetail?.buyAndSellRole || '')} {orderDetail?.coinName}
            </span>
          </div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_flbmtloamvqed3vejwwfk`}</span>
            <span className="text-sm flex justify-between items-center">
              <span className="mr-2">{orderDetail?.id}</span>
              <Icon name="copy" hasTheme className="text-base" onClick={() => onCopy(orderDetail?.id)} />
            </span>
          </div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`features_c2c_trade_history_records_content_table_column_gkswfpwsjnnnigaff1dwq`}</span>
            <span className="text-sm">{formatDate(orderDetail?.createdTime as string)}</span>
          </div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`trade.c2c.singleprice`}</span>
            <span className="text-sm">
              {orderDetail?.price} {orderDetail?.currencyEnName}
            </span>
          </div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`features_c2c_advertise_advertise_history_record_list_index_wvbglqcsk6mbkp1guxv9i`}</span>
            <span className="text-sm">
              {orderDetail?.number} {orderDetail?.coinName}
            </span>
          </div>
          <div className="detail-modal-item">
            <span className="detail-modal-item-label">{t`features_c2c_trade_c2c_chat_c2c_chat_window_index_064niyem2qfqd6m_zr4sv`}</span>
            <span className="text-sm">
              {orderDetail?.totalPrice} {orderDetail?.currencyEnName}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default memo(forwardRef(OrderDetailModal))
