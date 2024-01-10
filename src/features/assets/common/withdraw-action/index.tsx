import { Button } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { useState } from 'react'
import OpenSecurityPopup from '@/features/assets/common/open-security-popup'
import { verifyUserWithdraw } from '@/helper/assets'

interface WithdrawActionProps {
  coinId?: string
}
function WithdrawAction(props: WithdrawActionProps) {
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

  return (
    <>
      <Button className="mr-6" onClick={onVerifyUserWithdraw}>
        {t`assets.common.withdraw`}
      </Button>
      {isShowOpenSecurity && <OpenSecurityPopup isShow={isShowOpenSecurity} setIsShow={setIsShowOpenSecurity} />}
    </>
  )
}

export default WithdrawAction
