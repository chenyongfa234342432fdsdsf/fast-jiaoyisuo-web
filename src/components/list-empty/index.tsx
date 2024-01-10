/**
 * 列表空数据
 */
import { t } from '@lingui/macro'
import { Empty } from '@nbit/arco'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface ListEmptyProps {
  imageName?: string
  text?: string
  loading?: boolean
}

function ListEmpty(props: ListEmptyProps) {
  const { imageName, text, loading = false } = props
  if (loading) return null
  return (
    <Empty
      className={styles.scoped}
      icon={<Icon name={imageName || 'no_data'} hasTheme isRemoteUrl />}
      description={text || t`help.center.support_05`}
    />
  )
}
export default ListEmpty
