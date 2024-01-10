import Icon from '@/components/icon'
import { FormInstance, Notification, Spin } from '@nbit/arco'
import { t } from '@lingui/macro'
import cn from 'classnames'
import { useState, useRef, memo } from 'react'
import UploadFile from '@/components/upload-file'
import { baseCommonStore } from '@/store/common'
import { postUploadImage } from '@/apis/kyc'
import { CertificationLevel } from '@/features/kyc/kyt-const'
import style from './index.module.css'

type UploadValue = {
  filePath: string
  name: string
  sort: number
  kycType: number
  kycAttachType: number
}

type Props = {
  onChange?: (e: UploadValue[] | undefined) => void
  value?: UploadValue[]
  error?: boolean
  forminstance?: FormInstance | null
  id?: string
  sort: number
  kycAttachType: number
}

function CompanyUpload(props: Props) {
  const { value, onChange, error, forminstance, id, kycAttachType, sort } = props

  const { theme } = baseCommonStore.getState()

  const fieldNames = id?.split('_')[0] as string

  const validMessageRef = useRef<string>()

  const [showLoading, setShowLoading] = useState<boolean>(false)

  const setResolveFalse = () => {
    setShowLoading(false)
    const errorMessage = validMessageRef.current

    if (value?.length === 0 || !value) {
      forminstance?.setFields({
        [fieldNames]: {
          value: undefined,
          error: {
            message:
              errorMessage ||
              (!value
                ? t`features_kyc_company_imformation_upload_company_upload_index_5101323`
                : t`features_user_company_imformation_upload_company_upload_index_2669`),
          },
        },
      })
    }
  }

  const setErrorMessage = (errorMessage, resolve) => {
    Notification.error({
      content: errorMessage,
    })
    validMessageRef.current = errorMessage
    resolve(false)
    setResolveFalse()
  }

  const beforeAvatarUpload = files => {
    setShowLoading(true)
    return new Promise(resolve => {
      const fileName = files.type.split('/')
      const uploadName = files.name
      if (uploadName.length - 4 > 30) {
        const errorMessage = t`features_user_company_imformation_upload_company_upload_index_2670`
        setErrorMessage(errorMessage, resolve)
      }

      let arr = ['jpg', 'png', 'jpeg', 'pdf']
      if (arr.indexOf(fileName[1].toLowerCase()) === -1) {
        const errorType = arr.join(',')
        const errorMessage = t({
          id: 'features_user_company_imformation_upload_company_upload_index_2674',
          values: { 0: errorType },
        })
        setErrorMessage(errorMessage, resolve)
      }

      const num = fileName[1].toLowerCase() === 'pdf' ? 20 : 10
      if (files.size > num * 1024 * 1024) {
        const errorMessage = t`features_user_company_imformation_upload_company_upload_index_2672`
        setErrorMessage(errorMessage, resolve)
      }
      resolve(true)
    })
  }

  // const setUploadResult = (_, currentFileResult) => {
  //   const resResult = ['error', 'done']
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

  const deleteFile = indexNumber => {
    if (value) {
      value?.splice(indexNumber, 1)
      onChange && onChange(value?.length <= 0 ? undefined : value)
    }
  }

  function checksum(text) {
    const chars = text
      .match(
        /[(\u4e00-\u9fa5)(\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u007e)]+/g
      )
      ?.join('')

    return chars?.length || 0
  }

  const setSuccessText = text => {
    const ellipsisLength = checksum(text.slice(0, 11))
    const computedEllipsis = ellipsisLength + (11 - ellipsisLength) * 2

    if (text.length - 5 <= computedEllipsis) {
      return text
    } else {
      return `${text.slice(0, computedEllipsis)}...${text.slice(-3)}`
    }
  }

  const handleUploadImage = async option => {
    const { file: fileImage } = option

    const formData = new FormData()
    formData.append('file', fileImage)
    formData.append('fileDir', 'security_item')

    const blob = new Blob([fileImage], { type: fileImage.type }) // 类型一定要写！！！
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = async () => {
      const res = await postUploadImage({ image: reader.result })

      if (res.isOk) {
        setShowLoading(false)
        let valueUpload = [
          {
            filePath: res.data.url,
            name: fileImage.name,
            sort,
            kycType: CertificationLevel.enterpriseCertification,
            kycAttachType,
          },
        ]
        if (value) {
          valueUpload = [...value, ...valueUpload]
        }
        forminstance?.setFields({
          [fieldNames]: {
            value: valueUpload,
          },
        })
      } else {
        setShowLoading(false)
      }
    }
  }

  return (
    <div className={style.scoped}>
      <Spin loading={showLoading}>
        <UploadFile
          customRequest={handleUploadImage}
          showUploadList={false}
          disabled={value && value.length >= 2}
          action=""
          beforeUpload={beforeAvatarUpload}
          // onChange={setUploadResult}
          accept="image/png,image/jpeg,image/jpg,application/pdf"
        >
          <div
            className={cn('company-button', {
              'company-button-error': error,
              'company-button-not': value && value.length >= 2,
            })}
          >
            <Icon className="company-button-icon" name={`upload_files_${theme === 'dark' ? 'black' : 'white'}`} />
            <span>{t`features_user_company_imformation_upload_company_upload_index_2673`}</span>
          </div>
        </UploadFile>
      </Spin>
      {value &&
        value
          .filter(item => item.filePath)
          .map((item, index) => {
            return (
              <div className="company-button-uploadfile" key={item.filePath}>
                <div className="company-button-uploadfile-detail">
                  <Icon className="company-button-success" name="icon_pdf" />
                  <div className="company-button-success-text">{setSuccessText(item?.name)}</div>
                </div>
                <Icon
                  onClick={() => deleteFile(index)}
                  className="company-button-close"
                  name="del_input_box"
                  hasTheme
                />
              </div>
            )
          })}
    </div>
  )
}

export default memo(CompanyUpload)
