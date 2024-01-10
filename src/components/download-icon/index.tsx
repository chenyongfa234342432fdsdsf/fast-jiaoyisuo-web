import { useCommonStore } from '@/store/common'
import Icon from '../icon'
import Link from '../link'

function DownloadIcon() {
  const { locale } = useCommonStore()
  return (
    <Link href={`https://c2cpayment.com/${locale}/wallet`} target className="download-icon">
      <span>
        <Icon name={`nav_download`} hasTheme hover />
      </span>
    </Link>
  )
}

export default DownloadIcon
