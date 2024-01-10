import { memo, useRef, useState } from 'react'
import { Notification, FormInstance, Spin } from '@nbit/arco'
import { postUploadImage } from '@/apis/kyc'
import cn from 'classnames'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import UploadFile from '@/components/upload-file'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import styles from './applicationsupload.module.css'

type Props = {
  onChange?: (e: string | undefined) => void
  tips: string
  value?: Record<'filePath', string>
  imgsrc: string
  setChangeImage?: boolean
  forminstance?: FormInstance | null
  id?: string
  sort?: number
  kycType?: number
  kycAttachType?: number
  fileSize?: number
  minFileSize?: number
}

function ApplicationsUpload(props: Props) {
  const {
    tips,
    fileSize = 5,
    minFileSize = 0.009765625,
    value: file,
    imgsrc,
    setChangeImage,
    forminstance,
    id,
    sort,
    kycType,
    kycAttachType,
  } = props

  const fieldNames = id?.split('_')[0] as string

  const validMessageRef = useRef<string>()

  const [showLoading, setShowLoading] = useState<boolean>(false)

  const setResolveFalse = () => {
    const errorMessage = validMessageRef.current
    forminstance?.setFields({
      [fieldNames]: {
        value: undefined,
        error: {
          message:
            errorMessage ||
            (!file ? t`features_user_person_upload_index_5101104` : t`features_user_person_upload_index_5101105`),
        },
      },
    })
  }

  const setErrorMessage = (errorMessage, resolve) => {
    Notification.error({
      content: errorMessage,
    })
    validMessageRef.current = errorMessage
    setResolveFalse()
    resolve(false)
  }

  const beforeAvatarUpload = (files: Blob) => {
    return new Promise(resolve => {
      let fileName = files.type ? files.type.split('/') : ''

      const arr = ['jpg', 'png', 'jpeg']
      if (!fileName || arr.indexOf(fileName[1].toLowerCase()) === -1) {
        // const errorType = arr.join(',')
        setErrorMessage(t`features_user_person_upload_index_5101106`, resolve)
      }
      if (files.size > fileSize * 1024 * 1024) {
        setErrorMessage(t`features_user_person_upload_index_5101107`, resolve)
        resolve(false)
      }

      if (files.size < minFileSize * 1024 * 1024) {
        setErrorMessage(t`features_kyc_person_upload_index_5101288`, resolve)
        resolve(false)
      }
      resolve(true)
    })
  }

  const handleUploadImage = async option => {
    const { file: fileImage } = option
    setShowLoading(true)
    const formData = new FormData()
    formData.append('file', fileImage)
    formData.append('fileDir', 'security_item')

    const blob = new Blob([fileImage], { type: fileImage.type }) // 类型一定要写！！！
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = async () => {
      const res = await postUploadImage({ image: reader.result })

      if (res.isOk) {
        forminstance?.setFields({
          [fieldNames]: {
            value: { filePath: res.data.url, name: fileImage.name, sort, kycType, kycAttachType },
          },
        })
      }
      setShowLoading(false)
    }
  }

  // const setUploadResult = (_, currentFileResult) => {
  //   const resResult = ['error']
  //   const result = {
  //     ...currentFileResult,
  //     remoteUrl: currentFileResult?.response?.data?.filePathUrl,
  //   }
  //   forminstance?.setFields({
  //     [fieldNames]: {
  //       value: result,
  //     },
  //   })

  //   if (resResult.includes(currentFileResult.status)) {
  //     setResolveFalse()
  //   }
  // }

  return (
    <div className={styles.container}>
      <Spin loading={showLoading}>
        <UploadFile
          customRequest={handleUploadImage}
          showUploadList={false}
          action=""
          beforeUpload={beforeAvatarUpload}
          // onChange={setUploadResult}
          accept="image/*"
          // filedir="verifyImage"
        >
          {file?.filePath ? (
            <div className="applications-uploads">
              <div className="upload-trigger-content">
                <img src={file?.filePath} alt="" />
              </div>
              <div className="upload-complete-icon">
                <Icon className="upload-icon" name="icon_replace" />
              </div>
            </div>
          ) : (
            <div
              className={cn('upload-trigger-picture', {
                'upload-change-picture': setChangeImage,
              })}
            >
              <div className="upload-trigger-around">
                <LazyImage src={`${oss_svg_image_domain_address}${imgsrc}.png`} alt="" />
                <div className="upload-trigger-handle">{tips}</div>
              </div>
            </div>
          )}
        </UploadFile>
      </Spin>
    </div>
  )
}

export default memo(ApplicationsUpload)
