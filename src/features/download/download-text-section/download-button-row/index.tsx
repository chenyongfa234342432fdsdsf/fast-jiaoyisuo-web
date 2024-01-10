import Icon from '@/components/icon'
import { downloadAppType, downloadIconsType } from '@/constants/download'
import { buttonShouldDisabled } from '@/helper/download'
import { QRCodeCanvas } from 'qrcode.react'
import styles from './index.module.css'
import OptionalDownloadButton from './optional-download-button'

function downloadIcon(type, disabled) {
  if (disabled) return <Icon name={`${downloadIconsType[type]}_disabled`} hasTheme />
  return <Icon name={downloadIconsType[type]} hasTheme />
}

function DownloadButtonRow(props) {
  const { data } = props

  let h5Data

  // show Qr code if status is active and url is not '/'
  if (data[downloadAppType.h5] && !buttonShouldDisabled(data[downloadAppType.h5])) h5Data = data[downloadAppType.h5]

  const renderDownloadBtns = btns => {
    if (!btns) return
    return Object.keys(btns).map((key, index) => {
      if (key === downloadAppType.h5) return
      return (
        <OptionalDownloadButton
          disabled={buttonShouldDisabled(btns[key])}
          key={index}
          data={btns[key]}
          Icon={downloadIcon(key, buttonShouldDisabled(btns[key]))}
        />
      )
    })
  }

  return (
    <div className={styles.scoped}>
      <div className="grid grid-cols-1 gap-y-4">{renderDownloadBtns(data)}</div>
      {h5Data && (
        <div className="mb-auto qr-canvas">
          <div className="qr-wrapper">
            <QRCodeCanvas value={h5Data.downloadUrl} />
          </div>
          <span className="text-xs font-normal">{h5Data.description}</span>
        </div>
      )}
    </div>
  )
}

export default DownloadButtonRow
