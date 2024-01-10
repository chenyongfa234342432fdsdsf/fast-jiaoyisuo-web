import { UploadVideo } from '@/components/upload-video'
import Icon from '@/components/icon'
import { useState, useRef } from 'react'
import { Spin } from '@nbit/arco'
import { AwsS3FolderModuleName, AwsS3FolderModuleUseCaseName } from '@/plugins/aws-s3/constants'
import OrderOpenVideo from '../order-open-video'
import style from './index.module.css'

type OrderOpenVideo = {
  setOrderOpenVideoVisible: () => void
}

export function C2cMaVideoUpload({
  setOnUpload,
  onUpload,
}: {
  setOnUpload: (item: string | undefined) => void
  onUpload: string | null
}) {
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const orderOpenVideoRef = useRef<OrderOpenVideo>()

  const setDeleteImgChange = e => {
    e.stopPropagation()
    setIsShowDeleteIcon(true)
    setOnUpload(undefined)
  }

  const setOpenVideoChange = e => {
    e.stopPropagation()
    orderOpenVideoRef.current?.setOrderOpenVideoVisible()
  }

  return (
    <Spin loading={loadingState}>
      {onUpload && <OrderOpenVideo videoSrc={onUpload} ref={orderOpenVideoRef} />}
      <UploadVideo
        folderName={AwsS3FolderModuleName.c2c}
        usercaseName={AwsS3FolderModuleUseCaseName.merchant_application}
        isAutoUpload
        onSettledCallback={({ url }) => {
          setLoadingState(true)
          if (typeof url === 'string' && url) {
            setIsShowDeleteIcon(false)
            setOnUpload(url as string)
            setLoadingState(false)
          }
        }}
        videoPlaceholder={() => (
          <div>
            {!isShowDeleteIcon && !loadingState ? (
              <div className={style.content}>
                <Icon name="icon_fail" className="upload-icon-delete" onClick={e => setDeleteImgChange(e)} />
                <div className="upload-img">
                  <video src={onUpload as string} />
                </div>
                <div className="re-upload-img" onClick={setOpenVideoChange}>
                  <Icon name="api_arrow_right_white" className="upload-icon" />
                </div>
              </div>
            ) : (
              <div className="appeal-upload">
                <Icon name="leverage_increase" hasTheme className="upload" />
              </div>
            )}
          </div>
        )}
        noDataPlaceholder={
          <div className="appeal-upload">
            <Icon name="leverage_increase" hasTheme className="upload" />
          </div>
        }
      />
    </Spin>
  )
}
