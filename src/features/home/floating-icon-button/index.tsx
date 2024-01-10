import Icon from '@/components/icon'
import Link from '@/components/link'
import { useLayoutStore } from '@/store/layout'
import styles from './index.module.css'

function FloatingIconButton() {
  const { customerJumpUrl } = useLayoutStore().layoutProps || {}
  return (
    <Link href={customerJumpUrl || ''} target>
      <Icon className={styles.scoped} name="message" />
    </Link>
  )
}

export default FloatingIconButton
