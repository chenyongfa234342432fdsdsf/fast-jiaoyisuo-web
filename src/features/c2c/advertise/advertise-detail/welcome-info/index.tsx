/**
 * 广告单详情-欢迎语/广告备注
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { WelcomeInfoTypeEnum } from '@/constants/c2c/advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import LazyImage from '@/components/lazy-image'
import { Modal } from '@nbit/arco'
import styles from './index.module.css'

function WelcomeInfo() {
  const {
    advertiseDetails: {
      details: { welcomeInfoType, welcomeInfoMessage = '' },
    },
  } = useC2CAdvertiseStore()
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <>
      {welcomeInfoMessage && (
        <div className="flex items-start">
          {welcomeInfoType === WelcomeInfoTypeEnum.text ? (
            <span>{welcomeInfoMessage}</span>
          ) : (
            <LazyImage
              src={welcomeInfoMessage}
              width={76}
              height={76}
              className="rounded"
              onClick={() => setPreviewVisible(true)}
            />
          )}
        </div>
      )}

      <Modal
        visible={previewVisible}
        className={styles['preview-img-root']}
        onCancel={() => setPreviewVisible(false)}
        onOk={() => setPreviewVisible(false)}
      >
        <LazyImage src={welcomeInfoMessage} onClick={() => setPreviewVisible(false)} />
      </Modal>
    </>
  )
}

export { WelcomeInfo }
