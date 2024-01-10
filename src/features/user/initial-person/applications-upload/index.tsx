import { memo, useState, useRef } from 'react'
import { Notification, Modal } from '@nbit/arco'
import type { UploadItem } from '@nbit/arco/lib/Upload'
import { t } from '@lingui/macro'
import { IconDelete } from '@nbit/arco/icon'
import { oss_svg_image_domain_address } from '@/constants/oss'
import UploadFile from '@/components/upload-file'
import styles from './applicationsupload.module.css'

interface Props {
  type: string
  tips: Record<'tipsDetail' | 'tipType', string>
  typeLimit: string[]
  onChange?: (e: string | undefined) => void
  value?: UploadItem
}

function ApplicationsUpload(props: Props) {
  const { onChange, type, tips, typeLimit, value } = props

  const uploadRef = useRef<HTMLDivElement | null>(null)

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [originFileName, setOriginFileName] = useState<string>('')

  const beforeAvatarUpload = (files: Blob) => {
    return new Promise(resolve => {
      let fileName = files.type.split('/')

      let arr = typeLimit
      if (arr.indexOf(fileName[1].toLowerCase()) === -1) {
        Notification.error({
          content: `仅支持 ${typeLimit.join(',')} 格式`,
        })
        resolve(false)
      }
      if (files.size > 5 * 1024 * 1024) {
        Notification.error({
          content: t`features/user/initial-person/applications-upload/index-0`,
        })
        resolve(false)
      }
      resolve(true)
    })
  }

  const setUploadResult = (_, currentFileResult) => {
    const result = {
      ...currentFileResult,
      remoteUrl: currentFileResult?.response?.data?.filePathUrl,
    }
    setOriginFileName(result.originFile.name)
    onChange && onChange(result)
  }

  const deleteFile = e => {
    e.stopPropagation()
    onChange && onChange(undefined)
  }

  const inspectVideo = () => {
    if (type === 'video') {
      setModalVisible(true)
    }
  }

  return (
    <div className={styles.container} ref={uploadRef}>
      <UploadFile
        fileList={value ? [value] : []}
        showUploadList={false}
        limit={1}
        beforeUpload={beforeAvatarUpload}
        onChange={setUploadResult}
        filedir="otc_merchant"
      >
        <div className="upload-trigger-picture">
          <img src={`${oss_svg_image_domain_address}aplicationupload.png`} alt="" />
          <div className="upload-trigger-handle">{t`features/user/initial-person/applications-upload/index-2`}</div>
        </div>
      </UploadFile>
      <div className="applications-uploads">
        {value && value.url && (
          <div className="upload-trigger-content">
            <div className="upload-trigger-picture" onClick={inspectVideo}>
              {value.originFile && value.originFile.type === 'video/mp4' ? (
                <div className="upload-trigger-video">
                  <video controls src={value.url}>
                    <track kind="captions" />
                  </video>
                  <div className="upload-trigger-pannel"></div>
                </div>
              ) : (
                <img src={value.url} alt="" />
              )}
            </div>
          </div>
        )}
        <div className="upload-trigger-tips">
          <div>{tips.tipsDetail}</div>
          <div className="upload-trigger-type">{tips.tipType}</div>
          {value && value.url && (
            <div className="upload-trigger-delete" onClick={deleteFile}>
              {originFileName} <IconDelete className="arco-icon" />
            </div>
          )}
        </div>
      </div>
      <Modal
        title={t`features/user/initial-person/applications-upload/index-3`}
        visible={modalVisible}
        footer={null}
        getPopupContainer={() => uploadRef.current as Element}
        onCancel={() => setModalVisible(false)}
      >
        <div className="upload-trigger-container-video">
          {value && value.url && (
            <video controls src={value.url}>
              <track kind="captions" />
            </video>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default memo(ApplicationsUpload)
