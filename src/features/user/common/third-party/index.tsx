import { Button, Divider } from '@nbit/arco'
import { t } from '@lingui/macro'
// TODO: 需要外部化处理 firebase
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { getThirdPartyConfig } from '@/apis/user'
import { UserVerifyTypeEnum, SignInWithEnum } from '@/constants/user'
import Icon from '@/components/icon'
import { useMount } from 'ahooks'
import styles from './index.module.css'

let googleProvider
let appleProvider
let auth
function ThirdParty(props) {
  const { onSuccess, dividerText, appleBtnText, googleBtnText } = props
  const getConfigInfo = async () => {
    const res = await getThirdPartyConfig({})
    if (res.isOk) {
      initializeApp(res.data!)
      googleProvider = new GoogleAuthProvider()
      appleProvider = new OAuthProvider('apple.com')

      auth = getAuth()
    }
  }

  const handleGoogleLogin = async () => {
    /** google 登录弹窗 */
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user as any
        const type = user.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone
        const params = {
          loginType: SignInWithEnum.google,
          accessToken: user.accessToken,
          account: user.email || user.phoneNumber,
        }
        onSuccess && onSuccess(type, params)
      })
      .catch(error => {
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.error(credential)
      })
  }

  const handleAppleLogin = async () => {
    appleProvider.addScope('email')
    appleProvider.addScope('name')
    /** apple 登录弹窗 */
    signInWithPopup(auth, appleProvider)
      .then(result => {
        const user = result.user as any
        const type = user.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone
        const params = {
          loginType: SignInWithEnum.apple,
          accessToken: user.accessToken,
          account: user.email || user.phoneNumber,
        }
        onSuccess && onSuccess(type, params)
      })
      .catch(error => {
        const credential = OAuthProvider.credentialFromError(error)
        console.error(credential)
      })
  }
  useMount(() => {
    getConfigInfo()
  })
  return (
    <div className={styles.scoped}>
      <Divider>{dividerText || t`user.third_party_01`}</Divider>

      <div className="third-party">
        <Button type="default" icon={<Icon name="login_icon_apple_black" />} onClick={handleAppleLogin}>
          {appleBtnText || t`user.third_party_02`}
        </Button>

        <Button type="default" icon={<Icon name="login_icon_google" />} onClick={handleGoogleLogin}>
          {googleBtnText || t`user.third_party_03`}
        </Button>
      </div>
    </div>
  )
}

export default ThirdParty
