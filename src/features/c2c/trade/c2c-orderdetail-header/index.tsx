import React, { memo, useRef, cloneElement } from 'react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { setC2COrderChangeStatus } from '@/apis/c2c/c2c-trade'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import OrderdetailHeaderModal from './orderdetail-header-modal'
import { ChangeC2COrderStatus } from '../c2c-trade'
import ConfirmReceiptModal from './confirm-receipt-modal'
import { useShowOrderComponent } from './use-show-order-component'
import AppealSubmitCompnent from './appeal-submit-compnent'
import styles from './index.module.css'

type HeaderTipModal = {
  setHeaderModalVisible: () => void
}

type ConfirmReceipt = {
  setConfirmReceiptVisible: () => void
}

type appealAppealSubmit = {
  setCancalAppealModalVisible: () => void
}

type Props = {
  orders: YapiGetV1C2COrderDetailData
}

function C2COrderDetailHeader(props: Props) {
  const { orders } = props || {}

  const orderHeaderTipModalRef = useRef<HeaderTipModal>()

  const confirmReceiptModalRef = useRef<ConfirmReceipt>()

  const appealAppealSubmitCompnentRef = useRef<appealAppealSubmit>()

  // const setChangeStatus = async () => {
  //   const { isOk } = await setC2COrderChangeStatus({ id: orders?.id, statusCd: ChangeC2COrderStatus.WAS_COLLECTED })
  // }

  function WrappedComponent({ children }) {
    return children
      ? React.Children.map(children, child => {
          if (child?.type === 'div') {
            return children
          } else {
            return cloneElement(children, { orders })
          }
        })
      : ''
  }

  const { showSelectedOrderComponent } = useShowOrderComponent(
    orderHeaderTipModalRef,
    orders,
    confirmReceiptModalRef,
    appealAppealSubmitCompnentRef
  )

  return (
    <div className={styles.container}>
      <div className="order-header-container">
        {orders && <AppealSubmitCompnent orders={orders} ref={appealAppealSubmitCompnentRef} />}
        <ConfirmReceiptModal orders={orders} ref={confirmReceiptModalRef} />
        <OrderdetailHeaderModal modalParams={showSelectedOrderComponent?.modalParams} ref={orderHeaderTipModalRef} />
        <div className="order-header">
          <div className="flex items-center">
            <span className="order-header-icon">
              {showSelectedOrderComponent?.iconName && (
                <img src={`${oss_svg_image_domain_address}${showSelectedOrderComponent?.iconName}.png`} alt="" />
              )}
            </span>
            <div className="order-header-status">
              <div>{showSelectedOrderComponent?.statusTitle}</div>
              {showSelectedOrderComponent?.timeText}
            </div>
          </div>
          <div className="flex items-center">
            {/* <div onClick={setChangeStatus}>change</div> */}
            {showSelectedOrderComponent?.cancelButton && (
              <WrappedComponent>{showSelectedOrderComponent?.cancelButton}</WrappedComponent>
            )}
            {showSelectedOrderComponent?.successButton && (
              <WrappedComponent>{showSelectedOrderComponent?.successButton}</WrappedComponent>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(C2COrderDetailHeader)
