import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'

function OpenSecurityPopup({ isShow, setIsShow }: { isShow?: boolean; setIsShow(val): void }) {
  /** 去开启两项验证 */
  const onOpenSecurity = () => {
    isShow && setIsShow(false)
    link('/personal-center/account-security')
  }
  /** 关闭弹框 */
  const handleClose = () => {
    isShow && setIsShow(false)
  }
  return (
    <UserPopUp
      className="user-popup user-popup-tips"
      visible={isShow}
      closeIcon={<Icon name="close" hasTheme />}
      okText={t`user.universal_security_verification_08`}
      cancelText={t`user.field.reuse_09`}
      onOk={onOpenSecurity}
      onCancel={handleClose}
    >
      <UserPopupTipsContent
        slotContent={
          <>
            <p>{t`user.universal_security_verification_07`}</p>
            <p>{t`user.universal_security_verification_09`}</p>
            <p>{t`user.universal_security_verification_10`}</p>
            <p>{t`user.universal_security_verification_11`}</p>
          </>
        }
      />
    </UserPopUp>
  )
}

export default OpenSecurityPopup
