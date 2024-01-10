/**
 * 广告单 - 收款方式展示组件
 */
import { INewPayments } from '@/typings/api/c2c/advertise/post-advertise'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { Popover } from '@nbit/arco'
import { getTextFromStoreEnums } from '@/helper/store'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import styles from './index.module.css'

interface PaymentTypeInfoProps {
  paymentList?: INewPayments[]
  paymentClassName?: string
  /** 默认 0，展示所有支付/收款方式 */
  maxLength?: number
  advertId?: string
}

function PaymentTypeInfo(props: PaymentTypeInfoProps) {
  const { paymentClassName, paymentList = [], maxLength = 0, advertId } = props || {}
  const advertiseStore = useC2CAdvertiseStore()
  const { advertiseEnums } = { ...advertiseStore }
  /** 渲染支付类型 */
  function renderPaymentTypeItem(item, index) {
    if (!item) return null
    const paymentType = item?.name
    const isGray = item?.isGray
    return (
      <div
        className={styles['payment-content']}
        key={advertId ? `${advertId}_${paymentType}` : `${paymentType}_${index}`}
      >
        <div className={classNames('payment-item', { 'payment-item-gray': isGray })}>
          <div
            className="line"
            style={{
              backgroundColor: !isGray
                ? getTextFromStoreEnums(paymentType, advertiseEnums.c2cPaymentColorEnum.enums)
                : '',
            }}
          />
          <span>{getTextFromStoreEnums(paymentType, advertiseEnums.paymentTypeEnum.enums)}</span>
        </div>
      </div>
    )
  }

  function renderPaymentTypeList(data: INewPayments[]) {
    if (!data || data.length === 0) return '--'

    const paymentTypeDom = data.map((item, i: number) => {
      return renderPaymentTypeItem(item, i)
    })

    return paymentTypeDom
  }

  return (
    <div className={classNames(styles['payment-type-info-root'], paymentClassName)}>
      {maxLength && paymentList && paymentList?.length > maxLength ? (
        <div className="flex items-center">
          {renderPaymentTypeList(paymentList.slice(0, maxLength))}
          <Popover
            position="bottom"
            content={
              <div className="flex flex-wrap gap-x-2">
                {paymentList.slice(maxLength).map((item, i: number) => {
                  return renderPaymentTypeItem(item, i)
                })}
              </div>
            }
          >
            <span>
              <Icon className="more-img" name="arrow_open" hasTheme />
            </span>
          </Popover>
        </div>
      ) : (
        <> {renderPaymentTypeList(paymentList)}</>
      )}
    </div>
  )
}

export { PaymentTypeInfo }
