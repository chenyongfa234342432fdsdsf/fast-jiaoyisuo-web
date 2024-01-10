import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { link as navigate } from '@/helper/link'
import style from './index.module.css'

type Props = {
  type: number
}

function KycHeader(props: Props) {
  const { type } = props

  const setIconText = iconType => {
    const variries = {
      4: {
        icon: 'enterprise_certification',
        text: t`features/user/personal-center/profile/index-17`,
        showRight: true,
      },
      2: {
        icon: 'kyc_standard_authentication',
        text: t`features_user_person_application_index_2651`,
        showRight: false,
      },
      3: {
        icon: 'kyc_advanced_authentication',
        text: t`features_kyc_kyc_header_index_5101171`,
        showRight: false,
      },
    }

    return variries[iconType]
  }

  const setSwitchpPerson = () => {
    navigate('/kyc-authentication-homepage')
  }

  return (
    <div className={style.scoped}>
      <div className="kyc-header">
        <div className="kyc-header-header">
          <div className="kyc-header-container">
            <div className="kyc-header-title">
              <span>{setIconText(type)?.text}</span>
              <Icon name={setIconText(type)?.icon} className="company-avatar" />
            </div>
            {setIconText(type)?.showRight && (
              <div className="kyc-header-person" onClick={setSwitchpPerson}>
                <Icon name="verified" className="kyc-verified" />
                <span>{t`features_kyc_kyc_header_index_2658`}</span>
                <Icon name="next_arrow" hasTheme />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KycHeader
