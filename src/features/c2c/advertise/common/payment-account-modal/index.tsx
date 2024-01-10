/**
 * 广告单 - 收款账号展示组件
 */
import { AdvertisingDirectionTypeEnum, PaymentTypeEnum } from '@/constants/c2c/advertise'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { IPaymentDetails } from '@/typings/api/c2c/advertise/post-advertise'
import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import classNames from 'classnames'
import { getTextFromStoreEnums } from '@/helper/store'
import styles from './index.module.css'

interface PaymentAccountModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
}

function PaymentAccountModal(props: PaymentAccountModalProps) {
  const { visible, setVisible } = props || {}

  const {
    advertiseEnums,
    advertiseDetails: {
      details: { advertDirectCd = '', paymentDetails = [] },
    },
  } = useC2CAdvertiseStore()
  return (
    <AssetsPopUp
      visible={visible}
      style={{ width: 450 }}
      title={t`features_c2c_advertise_advertise_detail_index_725kjgbhhykmmzsxs2gcr`}
      footer={null}
      onOk={() => {
        setVisible(false)
      }}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <div className={styles['payment-type-info-root']}>
        {advertDirectCd === AdvertisingDirectionTypeEnum.sell &&
          paymentDetails.length > 0 &&
          paymentDetails.map((paymentItem: IPaymentDetails, index: number) => {
            const isGray = paymentItem.grey
            // const newAccount =
            //   paymentItem.paymentTypeCd === PaymentTypeEnum.bankCard
            //     ? paymentItem.account.replace(/(.{4}).*(.{4})/, '$1****$2')
            //     : paymentItem.account.replace(/(.{3}).*(.{4})/, '$1****$2')
            return (
              <div className={classNames('info-item', { 'info-item-gray': isGray })} key={`${paymentItem.id}_${index}`}>
                <div className="info-label">
                  {getTextFromStoreEnums(paymentItem.paymentTypeCd, advertiseEnums.paymentTypeEnum.enums)}
                </div>
                <div className="info-value">
                  {paymentItem.bankOfDeposit && <span>{paymentItem.bankOfDeposit}</span>}
                  {paymentItem.account && <span className="ml-1">{paymentItem.account}</span>}
                  {paymentItem.paymentDetails && <span className="ml-1">{paymentItem.paymentDetails}</span>}
                </div>
              </div>
            )
          })}
        <div className="footer">
          <Button
            type="primary"
            onClick={() => {
              setVisible(false)
            }}
          >
            {t`user.field.reuse_48`}
          </Button>
        </div>
      </div>
    </AssetsPopUp>
  )
}

export { PaymentAccountModal }
