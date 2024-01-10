import Link from '@/components/link'
import { downloadAppStatus } from '@/constants/download'
import { YapiGetV1HomeAppinfoGetListData } from '@/typings/yapi/HomeAppinfoGetListV1GetApi'
import { Button } from '@nbit/arco'
import { ReactNode } from 'react'
import styles from './index.module.css'

type TOptionalDownloadButton = {
  data: YapiGetV1HomeAppinfoGetListData
  Icon: ReactNode
  disabled?: boolean
}

function OptionalDownloadButton({ data, Icon, disabled }: TOptionalDownloadButton) {
  if (!data) return null
  return disabled ? (
    <span className={styles.scoped}>
      <Button icon={Icon} disabled className="download-button download-button-disabled">
        <div className="flex flex-col text-left text-xs truncate grow">
          <span className="button-text">{data.description}</span>
          <span className="button-text">{data.appTypeCd}</span>
        </div>
      </Button>
    </span>
  ) : (
    <Link href={data.downloadUrl} target className={styles.scoped}>
      <Button icon={Icon} className="download-button">
        <div className="flex flex-col text-left text-xs truncate grow">
          <span className="button-text">{data.description}</span>
          <span className="button-text">{data.appTypeCd}</span>
        </div>
      </Button>
    </Link>
  )
}

export default OptionalDownloadButton
