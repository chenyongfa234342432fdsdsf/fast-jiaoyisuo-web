import Icon from '@/components/icon'
import IconDropdown from '@/components/icon-dropdown'
import { DropListElement } from '@/components/icon-dropdown/icon-dropdown-menu'
import { downloadAppType, downloadIconsTypeHomePage } from '@/constants/download'
import { buttonShouldDisabled } from '@/helper/download'
import useDownloadInfo from '@/hooks/features/download'
import classNames from 'classnames'
import styles from './index.module.css'

function renderDropList(qr): DropListElement[] {
  if (!qr) return []
  return [
    {
      title: '',
      QRCodeUrl: qr,
    },
  ]
}

function triggerGrid(data) {
  const types = Object.keys(data)
  if (types.includes(downloadAppType.h5)) return types.length > 4
  return types.length > 3
}

function DownloadSectionIconsRow() {
  const { appInfo } = useDownloadInfo() || {}
  const appIcons = appInfo || []
  const renderRow = data =>
    Object.keys(data).map((key, index) => {
      // filter web type
      if (key === downloadAppType.h5) return
      // filter disabled buttons
      if (buttonShouldDisabled(data[key])) return
      return (
        <IconDropdown
          key={index}
          position="top"
          icon={<Icon name={downloadIconsTypeHomePage[key]} hasTheme />}
          droplist={renderDropList(data[key].downloadUrl)}
          title={data[key].appTypeCd}
        />
      )
    })

  return (
    <div className={classNames(styles.scoped, { 'grid-layout': triggerGrid(appIcons) })}>{renderRow(appIcons)}</div>
  )
}

export default DownloadSectionIconsRow
