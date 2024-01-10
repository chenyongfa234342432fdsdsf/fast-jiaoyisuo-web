import useDownloadInfo from '@/hooks/features/download'
import { useLayoutStore } from '@/store/layout'
import DownloadAlert from './download-alert'
import DownloadImageSection from './download-image-section'
import DownloadLayout from './download-layout'
import DownloadTextSection from './download-text-section'
import DownloadButtonRow from './download-text-section/download-button-row'
import { DownloadDescription } from './download-text-section/download-description'

function Download() {
  const { appInfo, desktopInfo } = useDownloadInfo()
  const { appDownloadTitle, appDownloadDescription, pcDownloadTitle, pcDownloadDescription } =
    useLayoutStore().layoutProps || {}
  return (
    <div className="overflow-x-hidden bg-bg_color">
      <DownloadAlert />
      {appInfo && (
        <DownloadLayout
          textSection={
            <DownloadTextSection
              description={<DownloadDescription title={appDownloadTitle} description={appDownloadDescription} />}
              buttons={<DownloadButtonRow data={appInfo} />}
            />
          }
          imageSection={<DownloadImageSection />}
        />
      )}
      {desktopInfo && (
        <DownloadLayout
          isReverse
          textSection={
            <DownloadTextSection
              description={<DownloadDescription title={pcDownloadTitle} description={pcDownloadDescription} />}
              buttons={<DownloadButtonRow data={desktopInfo} />}
            />
          }
          imageSection={<DownloadImageSection isDesktop />}
        />
      )}
    </div>
  )
}

export default Download
