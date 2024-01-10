import { t } from '@lingui/macro'
import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { Typography } from '@nbit/arco'
import { getHomePageProps } from '@/helper/home/home-seo'
import AnnouncementBar from './announcement-bar'
import BannersBar from './banners-bar'
import DisplayCardsGrid from './display-cards-grid'
import HeroSection from './hero-section'
import HotCurrenciesTable from './hot-currencies-table'
import Stepper from './stepper'
import styles from './index.module.css'
import FloatingIconButton from './floating-icon-button'

type THome = {
  data: Awaited<ReturnType<typeof getHomePageProps>>
}

function Home(props: THome) {
  const { banners, announcements } = props.data || {}
  const renderDisplayCardsHeader = (
    <Typography.Title className="text-center text-[32px]">{t`features_home_index_2435`}</Typography.Title>
  )

  return (
    <div className={styles.scoped}>
      <section className={`hero-section`}>
        <LazyImage
          src={`${oss_svg_image_domain_address}bg`}
          hasTheme
          imageType={Type.png}
          whetherPlaceholdImg={false}
        />
        <HeroSection />
      </section>
      <section>
        <AnnouncementBar data={announcements} />
        <BannersBar data={banners} />
      </section>
      <section className="hot-currency-section">
        <HotCurrenciesTable />
      </section>
      <section className="section">
        {renderDisplayCardsHeader}
        <Stepper />
      </section>
      <DisplayCardsGrid />
      <FloatingIconButton />
    </div>
  )
}

export default Home
