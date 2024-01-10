import { useState } from 'react'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import { Spin } from '@nbit/arco'
import ThirdPartyPayment from '@/features/c2c/third-party-payment'
import { useGetIsLoginStatus } from '@/hooks/use-get-login-window-visible'
import styles from './index.module.css'

export function Page() {
  const [showLoading, setShowLoading] = useState<boolean>(false)

  useGetIsLoginStatus()

  const setShowLoadingOpenChange = () => {
    setShowLoading(true)
  }

  const setShowLoadingCloseChange = () => {
    setShowLoading(false)
  }
  return (
    <div className={styles.scoped}>
      <Spin className="w-full" loading={showLoading}>
        <C2CTab activeTab="ThirdPartyPayment">
          <ThirdPartyPayment
            setShowLoadingOpenChange={setShowLoadingOpenChange}
            setShowLoadingCloseChange={setShowLoadingCloseChange}
            showLoading={showLoading}
          />
        </C2CTab>
      </Spin>
    </div>
  )
}
