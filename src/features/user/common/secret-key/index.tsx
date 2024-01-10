import { QRCodeCanvas } from 'qrcode.react'
import { useCopyToClipboard } from 'react-use'
import { t } from '@lingui/macro'
import { Message } from '@nbit/arco'
import styles from './index.module.css'

interface UserSecretKeyProps {
  /** 二维码 */
  qrcode: string
  /** 秘钥 */
  secretKey: string
}

function UserPopUpGoogleKeyContent({ qrcode, secretKey }: UserSecretKeyProps) {
  const [state, copyToClipboard] = useCopyToClipboard()

  const handleCopy = (key: string) => {
    copyToClipboard(key)
    state.error ? Message.error(t`user.secret_key_02`) : Message.success(t`user.secret_key_01`)
  }

  return (
    <div className={`user-popup-google-key ${styles.scoped}`}>
      <div className="text">
        <label>{t`user.secret_key_03`}</label>
      </div>

      <div className="qrcode">
        <div className="code-image">
          <QRCodeCanvas value={qrcode} />
        </div>
        <div className="code-text">
          <div className="key">
            <label>{secretKey}</label>
          </div>
          <div className="copy-btn">
            <button type="button" onClick={() => handleCopy(secretKey)}>
              {t`features_user_common_secret_key_index_2609`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPopUpGoogleKeyContent
