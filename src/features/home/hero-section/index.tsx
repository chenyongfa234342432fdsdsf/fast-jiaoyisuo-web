import { useUserStore } from '@/store/user'
import { t } from '@lingui/macro'
import { Button, Typography } from '@nbit/arco'
import Link from '@/components/link'
import { useLayoutStore } from '@/store/layout'
import { getDefaultTradeUrl } from '@/helper/market'
import DownloadSection from './download-section'
import styles from './index.module.css'

function HeroSection() {
  const { isLogin } = useUserStore()
  const { headerData } = useLayoutStore()
  return (
    <div className={styles.scoped}>
      <div>
        <Typography className="text-[40px] font-medium max-w-xl">{headerData?.slogan}</Typography>
        <Link href={isLogin ? getDefaultTradeUrl() : '/register'}>
          <Button type="primary">{isLogin ? t`features_home_hero_section_index_5101092` : t`user.login_02`}</Button>
        </Link>
      </div>
      <DownloadSection />
    </div>
  )
}

export default HeroSection
