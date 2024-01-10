import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import UserPopUp from '@/features/user/components/popup'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import { getUserInfo } from '@/helper/cache'
import { UniversalSecurityVerificationType } from '@/typings/api/user'
import Icon from '@/components/icon'
import { link } from '@/helper/link'

enum SafetyItemsEnabledTypeEnum {
  unknown = 0, // 初始状态
  enable, // 已启用两项或两项以上安全验证
  noEnable, // 未启用两项或两项以上安全验证
}

type SafetyItemsEnabledDefaultType = Omit<UniversalSecurityVerificationType, 'isShow'>

interface SafetyItemsEnabledProps extends SafetyItemsEnabledDefaultType {
  /** 显示组件 */
  visible: boolean
}

function SafetyItemsEnabled({ visible = false, ...props }: SafetyItemsEnabledProps) {
  const [isEnable, setIsEnable] = useState<number>(SafetyItemsEnabledTypeEnum.unknown)

  const userInfo = getUserInfo()

  useEffect(() => {
    const list = userInfo
      ? [userInfo.isOpenEmailValidate, userInfo.isOpenGoogleValidate, userInfo.isOpenPhoneValidate]
      : []
    const enableList = list.filter(v => v)
    enableList.length > 1
      ? setIsEnable(SafetyItemsEnabledTypeEnum.enable)
      : setIsEnable(SafetyItemsEnabledTypeEnum.noEnable)
  }, [])

  return (
    <>
      {isEnable === SafetyItemsEnabledTypeEnum.enable && <UniversalSecurityVerification isShow={visible} {...props} />}

      {isEnable === SafetyItemsEnabledTypeEnum.noEnable && (
        <UserPopUp
          className="user-popup user-popup-tips"
          maskClosable={false}
          visible={visible}
          closeIcon={<Icon name="close" hasTheme />}
          okText={t`user.universal_security_verification_08`}
          onOk={() => link('/personal-center/account-security')}
          onCancel={() => props.onSuccess(false)}
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
      )}
    </>
  )
}

export default SafetyItemsEnabled
