import { useEffect, useState } from 'react'
import { Notification } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'

import UploadFile from '@/components/upload-file'
import LazyImage from '@/components/lazy-image'
import { postUploadImage } from '@/apis/kyc'
import { UploadProps } from '@nbit/arco/lib/Upload'
import styles from './index.module.css'

type UploadType = {
  value?: string
  onChange?: (e) => void
}

export function BaseUpload({ value, onChange }: UploadProps & UploadType) {
  const [uploadImageUrl, setUploadImageUrl] = useState<string>(value ?? '') // 上传图片 url

  useEffect(() => {
    setUploadImageUrl(value ?? '')
  }, [value])

  const beforeAvatarUpload = (files: Blob) => {
    return new Promise(resolve => {
      let fileName = files.type.split('/')

      const arr = ['jpg', 'png', 'jpeg']
      if (arr.indexOf(fileName[1].toLowerCase()) === -1) {
        Notification.error({
          content: '仅支持 .jpg /.jpeg /.png 格式',
        })
        resolve(false)
      } else if (files.size > 5 * 1024 * 1024) {
        Notification.error({
          content: t`features/user/initial-person/applications-upload/index-0`,
        })
        resolve(false)
      }
      resolve(true)
    })
  }

  const getFileReaderBlob = fileImage => {
    const formData = new FormData()
    formData.append('file', fileImage)
    formData.append('fileDir', 'security_item')

    return new Blob([fileImage], { type: fileImage.type })
  }

  const handleUploadImage = async option => {
    const blob = getFileReaderBlob(option.file)
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = async () => {
      const { isOk, data } = await postUploadImage({ image: reader.result })
      if (isOk) {
        setUploadImageUrl(data.url)
        onChange && onChange(data.url)
      }
    }
  }

  return (
    <div className={styles.scope}>
      {!!uploadImageUrl && (
        <div className="appeal-upload-item">
          <Icon
            name="icon_fail"
            className="appeal-upload-icon"
            fontSize={16}
            onClick={() => {
              setUploadImageUrl('')
              onChange && onChange('')
            }}
          />
          <LazyImage className="img-box" src={uploadImageUrl} />
        </div>
      )}
      {!uploadImageUrl && (
        <UploadFile
          showUploadList={false}
          customRequest={handleUploadImage}
          beforeUpload={beforeAvatarUpload}
          action=""
          accept=".jpg, .jpeg, .png"
          filedir="verifyImage"
        >
          <Icon fontSize={140} name="c2c_upload" hasTheme className="icon" />
        </UploadFile>
      )}
    </div>
  )
}
