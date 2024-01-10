import { C2cMaUserCurrentStatusEnum } from '@/constants/c2c/merchant-application'
import { C2cMaApproved } from '@/features/c2c/trade/merchant-landing/marchant-info-status/ma-info-approved'
import { C2cMaInfoDefaultContent } from '@/features/c2c/trade/merchant-landing/marchant-info-status/ma-info-default'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import classNames from 'classnames'
import styles from './index.module.css'

export function C2cMaInfoDefaultLayout({ children }) {
  return <div className={classNames(styles.scope)}>{children}</div>
}

export function C2cMaStatusCheck() {
  const store = useC2CMaStore()

  switch (store.userApplicationStatus) {
    case C2cMaUserCurrentStatusEnum.terminating:
    case C2cMaUserCurrentStatusEnum.enable:
      return <C2cMaApproved />
    default:
      return <C2cMaInfoDefaultContent />
  }
}
