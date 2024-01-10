import { Message, Spin } from '@nbit/arco'
import { useState, useImperativeHandle, forwardRef } from 'react'
import Icon from '@/components/icon'
import UploadFile from '@/components/upload-file'
import cn from 'classnames'
import { postUploadImage } from '@/apis/kyc'
import LazyImage from '@/components/lazy-image'
import { setAddComplaintInformation } from '@/apis/c2c/c2c-trade'
import { t } from '@lingui/macro'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import { C2cMaVideoUpload } from '../appeal-upload-video'
import styles from './index.module.css'

type Props = {
  orders: YapiGetV1C2COrderDetailData
}

function AppealMaterialButton(props: Props, ref) {
  const { orders } = props

  const [uploadShowImageList, setUploadShowList] = useState<string[]>([])

  const [uploadShowFile, setUploadShowFile] = useState<string>('')

  const [uploadName, setUploadName] = useState<string>('')

  const [onUpload, setOnUpload] = useState<string | null>(null)

  const [uploadLoading, setUploadLoading] = useState<boolean>(false)

  const [fileLoading, setFileLoading] = useState<boolean>(false)

  const getFileReaderBlob = fileImage => {
    const formData = new FormData()
    formData.append('file', fileImage)
    formData.append('fileDir', 'security_item')

    return new Blob([fileImage], { type: fileImage.type })
  }

  const beforeAvatarUpload = files => {
    return new Promise(resolve => {
      if (files.size > 5 * 1024 * 1024) {
        Message.error(t`features_user_person_upload_index_5101107`)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  }

  const handleUploadImage = async option => {
    const blob = getFileReaderBlob(option.file)
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    setUploadLoading(true)
    reader.onload = async () => {
      const { isOk, data } = await postUploadImage({ image: reader.result })
      if (isOk) {
        setUploadShowList([...uploadShowImageList, data.url])
      }
      setUploadLoading(false)
    }
  }

  const handleUploadFile = async option => {
    setUploadName(option?.file?.name)
    setFileLoading(true)
    const blob = getFileReaderBlob(option.file)
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = async () => {
      const { isOk, data } = await postUploadImage({ image: reader.result })
      if (isOk) {
        setUploadShowFile(data.url)
      }
      setFileLoading(false)
    }
  }

  const setDeleteFile = () => {
    setUploadShowFile('')
  }

  const setSubmitAppealRequest = async () => {
    if (!onUpload && !uploadShowImageList.join(',') && !uploadShowFile) {
      Message.error(t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_apcskvbwkfr9_raeyxha7`)
      return false
    }

    const { isOk } = await setAddComplaintInformation({
      id: orders?.id,
      video: onUpload,
      picture: uploadShowImageList.join(','),
      attachment: uploadShowFile,
    })
    return isOk
  }

  const setOnUploadChange = option => {
    setOnUpload(option)
  }

  useImperativeHandle(ref, () => ({
    setSubmitAppeal() {
      return setSubmitAppealRequest()
    },
  }))

  const setDeleteImgChange = index => {
    uploadShowImageList.splice(index, 1)
    setUploadShowList([...uploadShowImageList])
  }

  return (
    <div className={styles.container}>
      <div className="mt-6 text-text_color_01 font-medium">{t`features/user/initial-person/applications-upload/index-2`}</div>
      <div className="text-text_color_02 text-xs mb-3 mt-1">
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_4xsffg8s4ayxagsrsmcim`} 5
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_n_fdfc55hh1uncwwvow5w`}
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_mcjyyhdymoqbczxqmllnq`} jpg, png,
        jpeg
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_odqlgquqgpnyec42v0rpn`}
      </div>
      <div className="mb-6 flex flex-wrap">
        {uploadShowImageList.map((item, index, arr) => {
          return (
            <div
              key={item}
              className={cn('appeal-upload-item', {
                'mb-3': arr.length > 3,
              })}
            >
              <Icon name="icon_fail" className="upload-icon cursor-pointer" onClick={() => setDeleteImgChange(index)} />
              <LazyImage src={item} />
            </div>
          )
        })}

        {uploadShowImageList.length < 5 && (
          <div className="inline-block appeal-upload-content cursor-pointer">
            <Spin loading={uploadLoading}>
              <UploadFile
                customRequest={handleUploadImage}
                showUploadList={false}
                action=""
                filedir="verifyImage"
                accept="image/jpg, image/png, image/jpeg"
                beforeUpload={beforeAvatarUpload}
              >
                <div className="appeal-upload">
                  <Icon name="leverage_increase" hasTheme className="upload" />
                </div>
              </UploadFile>
            </Spin>
          </div>
        )}
      </div>
      <div className="text-text_color_01 font-medium">{t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_kzb0fbdbfzfh7v4qwo8_v`}</div>
      <div className="text-text_color_02 text-xs mb-3 mt-1">
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_4xsffg8s4ayxagsrsmcim`} 1{' '}
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_n9hyjl_a_wireqku4klkm`} 20M,{' '}
        {t`features_help_center_support_search_index_2752`}
        mp4, mov, ogg, mpg, wmv, avi{' '}
        {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_odqlgquqgpnyec42v0rpn`}
      </div>
      <div>
        <div className="inline-block">
          <C2cMaVideoUpload onUpload={onUpload} setOnUpload={setOnUploadChange} />
        </div>
        <div className="text-text_color_01 mt-6 font-medium">{t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_jbf-04d7a6t27vzb6xdbe`}</div>
        <div className="text-text_color_02 text-xs mb-3 mt-1">
          {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_4xsffg8s4ayxagsrsmcim`} 1{' '}
          {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_vm0nfa8cma2kbmpl7xc3s`} 20M,{' '}
          {t`features_help_center_support_search_index_2752`}
          pdf {t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_odqlgquqgpnyec42v0rpn`}
        </div>
        <div className="appeal-button-content cursor-pointer">
          {!uploadShowFile && (
            <UploadFile
              customRequest={handleUploadFile}
              showUploadList={false}
              action=""
              beforeUpload={beforeAvatarUpload}
              // onChange={setUploadResult}
              accept="application/pdf"
            >
              <div className="mb-8">
                <Spin loading={fileLoading}>
                  <div className="appeal-button cursor-pointer">
                    <Icon className="appeal-button-icon" name="upload_files" hasTheme />
                    <span>{t`features_c2c_trade_c2c_orderdetail_header_appeal_material_conponent_index_nggft-ogvicw6qrlp5uxx`}</span>
                  </div>
                </Spin>
              </div>
            </UploadFile>
          )}
          {uploadShowFile && (
            <div className="appeal-button-relative">
              <div className="appeal-button-uploadfile">
                <div className="appeal-button-uploadfile-detail">
                  <Icon className="appeal-button-success" name="icon_pdf" />
                  <div className="appeal-button-success-text">{uploadName}</div>
                </div>
              </div>
              <Icon name="icon_fail" className="absolute -top-0.5 -right-0.5" onClick={setDeleteFile} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default forwardRef(AppealMaterialButton)
