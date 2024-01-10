import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { Steps } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useUserStore } from '@/store/user'
import { getDefaultTradeUrl } from '@/helper/market'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

function Stepper() {
  const navigate = link
  const { isLogin } = useUserStore()
  const [active, setactive] = useState<number>()

  // render active index at client to overwrite server side default active index
  useEffect(() => {
    isLogin && setactive(2)
  }, [])

  return isLogin ? (
    <Steps labelPlacement="vertical" className={styles.scoped} current={active}>
      <Steps.Step
        status={'wait'}
        title={
          <span>
            <div>{t`features_home_stepper_index_2551`}</div>
          </span>
        }
      />
      <Steps.Step
        title={
          <span className={'cursor-pointer'} onClick={() => navigate(getDefaultTradeUrl())}>
            <div>{t`features_home_stepper_index_2552`}</div>
            <Icon name="home_arrow" />
          </span>
        }
      />
    </Steps>
  ) : (
    <Steps labelPlacement="vertical" className={styles.scoped}>
      <Steps.Step
        title={
          <span className={'cursor-pointer'} onClick={() => navigate('/register')}>
            <div>{t`features_home_stepper_index_2551`}</div>
            <Icon name="home_arrow" />
          </span>
        }
      />
      <Steps.Step
        title={
          <span>
            <div>{t`features_home_stepper_index_2552`}</div>
          </span>
        }
      />
    </Steps>
  )
}

export default Stepper
