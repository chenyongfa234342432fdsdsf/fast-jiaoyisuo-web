import LazyImage, { Type } from '@/components/lazy-image'
import { UploadVideo } from '@/components/upload-video'
import { c2cOssImgUrl } from '@/constants/c2c'
import { c2cOssImgMaNameMap } from '@/constants/c2c/merchant-application'
import { c2cMaHelpers } from '@/helper/c2c/merchant-application'
import { t } from '@lingui/macro'
import { FormInstance } from '@nbit/arco'

export function C2cMaVideoUpload({ formInstance, fieldId }: { formInstance: FormInstance; fieldId: string }) {
  const setForm = c2cMaHelpers.setForm(formInstance, fieldId)
  return (
    <UploadVideo
      onSettledCallback={({ url, errorMessage }) => {
        setForm({ url, errorMessage })
      }}
      videoPlaceholder={file => (
        <div className="frame-content-wrapper">
          <div className="upload-img">
            <video src={file.url} />
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
      )}
      noDataPlaceholder={
        <div className="frame-content-wrapper">
          <div className="bg-img bg-img-video">
            <LazyImage
              imageType={Type.png}
              hasTheme
              src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.c2c_upload_video}`}
              height={130}
              width={220}
            />
          </div>
          <div className="message">{t`features_c2c_trade_merchant_application_index_222222225101390`}</div>
        </div>
      }
    />
  )
}
