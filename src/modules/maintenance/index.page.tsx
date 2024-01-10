import { getMaintenanceConfigFromS3 } from '@/apis/maintenance'
import LazyImage from '@/components/lazy-image'
import Link from '@/components/link'
import { formatDate } from '@/helper/date'
import { usePageContext } from '@/hooks/use-page-context'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

function Page() {
  const { footerData, layoutProps } = useLayoutStore() || {}
  const { groupConfigDatas } = footerData || {}
  const { customerJumpUrl = '' } = layoutProps || {}
  const [config, setconfig] = useState<any>()
  const { host } = usePageContext()

  useEffect(() => {
    getMaintenanceConfigFromS3({}).then(res => {
      setconfig(res.data)
    })
  }, [])

  return (
    <div className={styles.scoped}>
      <div className="grid-container">
        <LazyImage src={config?.icon || ''} />
        <div className="flex flex-col gap-y-4">
          <div className="leading-5">
            <div className="text-base font-medium">{t`modules_maintenance_index_page_k7nquq0-xblb6pzeou384`} </div>
            <div>{config?.title}</div>
          </div>
          <div className="text-xs leading-5">
            <div>{t`modules_maintenance_index_page_y96bzs3he6rdmcuqwngoy`} </div>
            <div className="text-brand_color leading-5" dangerouslySetInnerHTML={{ __html: config?.content }} />
          </div>
          <div className="text-xs leading-5">
            <div>{t`modules_maintenance_index_page_l5hwdgltsnh44a29il0ns`}</div>
            {config?.start_time && config?.end_time && (
              <div className="text-brand_color">{`${formatDate(config?.start_time, 'YYYY-MM-DD HH:mm')} - ${formatDate(
                config?.end_time,
                'YYYY-MM-DD HH:mm'
              )}`}</div>
            )}
          </div>
          {!isEmpty(groupConfigDatas) && (
            <div className="text-xs leading-5">
              <div>{t`modules_maintenance_index_page_oslmz9qthtc-0gxokd7cj`}</div>
              {groupConfigDatas?.map((configData, index) => (
                <div key={index}>
                  <span>{configData.groupName}: </span>
                  <Link href={configData.linkUrl}>
                    <span className="text-brand_color">{configData.linkUrl}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
          {customerJumpUrl && (
            <div className="text-xs leading-5">
              <div>
                {t`modules_maintenance_index_page_6jn7jqohls93m66dmydv-`} 24{' '}
                {t`modules_maintenance_index_page_xfjlimz4dwiigcgk9na1s`}
              </div>
              <Link href={customerJumpUrl}>
                <span className="text-brand_color">
                  {host}
                  {customerJumpUrl}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { Page }
