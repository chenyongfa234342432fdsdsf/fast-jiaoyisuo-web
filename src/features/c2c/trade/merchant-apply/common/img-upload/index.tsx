import LazyImage, { Type } from '@/components/lazy-image'
import { c2cOssImgUrl } from '@/constants/c2c'
import { c2cOssImgMaNameMap } from '@/constants/c2c/merchant-application'
import { c2cMaHelpers } from '@/helper/c2c/merchant-application'
import { isValidUploadImage } from '@/helper/c2c/merchant-application/utils'
import { t } from '@lingui/macro'
import { FormInstance, Upload } from '@nbit/arco'
import { UploadItem } from '@nbit/arco/es/Upload'
import { useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import styles from './index.module.css'

export function C2cMaImgUpload({
  fieldId,
  formInstance,
  isAutoUpload,
}: {
  fieldId: string
  formInstance: FormInstance
  noDataPlaceholder?: JSX.Element
  isAutoUpload?: boolean
}) {
  const [file, setFile] = useState<UploadItem>()
  const fileRef = useRef<{ fileLocalObjectUrl?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const setForm = c2cMaHelpers.setForm(formInstance, fieldId)

  const handleUpload = () => {
    const { isValid, errorMessage } = isValidUploadImage(file)
    if (isValid) {
      setIsLoading(true)
      c2cMaHelpers
        .uploadBaseImgHelper(file)
        .then(res => {
          fileRef.current = {
            fileLocalObjectUrl: file?.url,
          }
          setForm({ url: res?.url })

          // Message.info(`succeed ${res?.url}`)
        })
        .catch(e => {
          console.error('upload image failed', e)
          setForm({ errorMessage: t`features_c2c_trade_merchant_apply_common_img_upload_index_znom905nnh7htxrdjegsh` })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setForm({ errorMessage })
    }
  }

  useUpdateEffect(() => {
    if (file && isAutoUpload) {
      handleUpload()
    }
  }, [file])

  return (
    <div className={classNames(styles.scope)}>
      <Upload
        accept="image/*"
        fileList={file ? [file] : []}
        autoUpload={false}
        showUploadList={false}
        onChange={(_, currentFile) => {
          const { isValid, errorMessage } = isValidUploadImage(currentFile)
          if (currentFile.originFile && isValid) {
            const newFile = {
              ...currentFile,
              url: URL.createObjectURL(currentFile.originFile),
            }
            setForm({ errorMessage: '', url: newFile })
            setFile(newFile)
          } else {
            fileRef.current = {
              fileLocalObjectUrl: '',
            }
            setForm({ errorMessage, url: '' })
          }
        }}
      >
        {file && file.url ? (
          <div className="frame-content-wrapper">
            <div className="upload-img">
              <img src={file.url} alt="uploaded-img" />
            </div>

            <div className="re-upload-img">
              <LazyImage
                imageType={Type.png}
                src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_replace}`}
                height={32}
                width={32}
              />
            </div>
          </div>
        ) : (
          <span>
            {
              <div className="frame-content-wrapper">
                <div className="bg-img bg-img-ic">
                  <LazyImage
                    imageType={Type.png}
                    hasTheme
                    src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.c2c_hand_held}`}
                    height={130}
                    width={130}
                  />
                </div>
                <div className="message">{t`features_user_person_application_index_5101096`}</div>
              </div>
            }
          </span>
        )}
      </Upload>
    </div>
  )
}
