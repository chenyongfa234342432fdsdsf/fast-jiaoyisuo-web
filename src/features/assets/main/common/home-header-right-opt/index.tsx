import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import { link } from '@/helper/link'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { useState } from 'react'
import { verifyUserWithdraw } from '@/helper/assets'
import OpenSecurityPopup from '@/features/assets/common/open-security-popup'
import styles from './index.module.css'

interface AssetsHeaderRightProps {
  coinId?: string
}

function HomeHeaderRight(props: AssetsHeaderRightProps) {
  const { coinId } = props
  // 是否显示开启两项验证提示
  const [isShowOpenSecurity, setIsShowOpenSecurity] = useState(false)

  let withdrawRoute = `/assets/main/withdraw`
  if (coinId) withdrawRoute = `${withdrawRoute}?id=${coinId}`

  /** 提币前校验 */
  const onVerifyUserWithdraw = async () => {
    // 校验提币权限，是否开启两项安全验证、是否 24 小时内修改登录密码、是否 48 小时内修改安全项、是否有风控问题
    const { isSuccess, isOpenSafeVerify } = await verifyUserWithdraw()

    // 验证失败 - 是否开启两项验证
    if (!isSuccess && !isOpenSafeVerify) {
      setIsShowOpenSecurity(true)
      return
    }

    link(withdrawRoute)
    return isSuccess
  }
  const isMergeMode = getMergeModeStatus()

  if (isMergeMode) return null
  return (
    <div className={styles.scoped}>
      <Button
        type="primary"
        style={{ width: '120px' }}
        className="header-right-btn"
        onClick={() => {
          let depositUrl = '/assets/main/deposit'
          if (coinId) depositUrl += `?id=${coinId}`

          link(depositUrl)
        }}
      >
        {t`assets.common.deposit`}
      </Button>
      <Button className="header-right-btn" onClick={onVerifyUserWithdraw} style={{ width: '120px' }}>
        <span className="header-right-btn-mumu">{t`assets.common.withdraw`}</span>
      </Button>

      <Button
        className="header-right-btn"
        style={{ width: '120px' }}
        onClick={() => {
          link('/c2c/fast-trade')
        }}
      >
        <span className="header-right-btn-mumu">{t`features_assets_main_common_home_header_right_opt_index_7ldkbhy1tv`}</span>
      </Button>

      <Button
        className="financial-record"
        style={{ width: '120px' }}
        onClick={() => {
          link('/assets/financial-record')
        }}
      >{t`assets.deposit.financialRecord`}</Button>
      {isShowOpenSecurity && <OpenSecurityPopup isShow={isShowOpenSecurity} setIsShow={setIsShowOpenSecurity} />}
    </div>
  )
}

export { HomeHeaderRight }
