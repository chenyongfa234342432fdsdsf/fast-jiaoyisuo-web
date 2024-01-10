import { Button } from '@nbit/arco'
import { t } from '@lingui/macro'
import UserSettingsHeaderInfo from '@/features/user/common/header-info'
import ConsumerToConsumerPaymentMethod from '@/features/user/common/c2c-payment'
import styles from './index.module.css'

function UserPersonalCenterSettingsPayment() {
  return (
    <section className={`personal-center-settings-payment ${styles.scoped}`}>
      <div className="personal-center-settings-payment-wrap">
        <UserSettingsHeaderInfo
          footerContent={
            <>
              <label>
                {t`features/user/personal-center/settings/payment/index-1`}:{' '}
                {`0 ( ${t`features/user/personal-center/settings/payment/index-2`} 0 | ${t`features/user/personal-center/settings/payment/index-3`} 0 )`}
              </label>
              <label>
                {t`features/user/personal-center/settings/payment/index-4`}:{' '}
                {t`features/user/personal-center/settings/payment/index-1`}:{' '}
                {`0 ( ${t`features/user/personal-center/settings/payment/index-2`} 0 | ${t`features/user/personal-center/settings/payment/index-3`} 0 )`}
              </label>
              <label>
                {t`features/user/personal-center/settings/payment/index-5`}: {`0 %`}
              </label>
              <label>
                {t`features/user/personal-center/settings/payment/index-6`}: {`0 min`}
              </label>
            </>
          }
          operateContent={<Button type="primary">{t`trade.c2c.advertisingPermission`}</Button>}
        />

        <div className="list">
          <ConsumerToConsumerPaymentMethod />
        </div>
      </div>
    </section>
  )
}

export default UserPersonalCenterSettingsPayment
