import { Button } from '@nbit/arco'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { useUserStore } from '@/store/user'
import { usePageContext } from '@/hooks/use-page-context'
import UserFormHeader from '@/features/user/common/user-form-layout/header'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { UserRegisterTypeEnum } from '@/constants/user'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import SignInWith from '@/features/user/login/component/sign-in-with'
import styles from './index.module.css'

function UserRegister() {
  const { setUserTransitionDatas } = useUserStore()
  const { headerData } = useLayoutStore()
  const pageContext = usePageContext()
  const { invitationCode } = pageContext.urlParsed.search
  const hasInvitationCode = invitationCode ? `?invitationCode=${invitationCode}` : ''

  const handleNextStep = async () => {
    await setUserTransitionDatas({
      thirdPartyAccountType: 0,
      thirdPartyAccount: '',
      registerType: UserRegisterTypeEnum.default,
    })
    link(`register/flow${hasInvitationCode}`)
    // link(`/register/residence${hasInvitationCode}`)
  }

  // const handleThirdPartyOnSuccess = async (thirdPartyAccountType: string, thirdPartyAccount) => {
  //   if (!thirdPartyAccount?.account) {
  //     Message.warning(t`features_user_register_index_5101312`)
  //     return
  //   }
  //   await setUserTransitionDatas({
  //     thirdPartyAccountType,
  //     thirdPartyAccount: thirdPartyAccount?.account,
  //     registerType: UserRegisterTypeEnum.thirdParty,
  //   })
  //   link(`/register/residence${hasInvitationCode}`)
  // }

  return (
    <div className={`user-register ${styles.scoped}`}>
      {/* <div className="gradient-background"></div> */}
      <div className="user-register-wrap">
        <div className="icon">
          {/* <Icon name="login_plate" /> */}
          {/* <LazyImage
            className="nb-icon-png"
            whetherPlaceholdImg={false}
            src={`${oss_svg_image_domain_address}image_login_illustration.png`}
          /> */}
        </div>

        <UserFormHeader
          title={t({
            id: 'user.register_01',
            values: { 0: headerData?.businessName },
          })}
        />

        <div className="btn-wrap">
          <Button type="primary" onClick={handleNextStep}>
            {t`user.register_02`}
          </Button>

          <SignInWith />

          <div className="login">
            <div className="register-tips">
              <label>{t`user.field.reuse_06`}</label>
              <Link href="/login" prefetch className="customize-link-style">
                {t`user.field.reuse_07`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserRegister
