import Icon from '@/components/icon'
import { Carousel } from '@nbit/arco'
import { ReactNode } from 'react'
import LazyImage from '@/components/lazy-image'
import { YapiGetV1BannerListData } from '@/typings/yapi/BannerListV1GetApi'
import Link from '@/components/link'
import { useBanners } from '@/hooks/features/home'
import styles from './index.module.css'

const numsOfElements = 4

function BannersBar(props) {
  const { data } = props
  const banners = useBanners(data)

  const render = () => {
    const filtered = banners.filter(banner => banner.webImage)
    const numOfSlides = Math.ceil(filtered.length / numsOfElements)
    const rendered: ReactNode[] = []

    const renderBannerList = (data: YapiGetV1BannerListData[]) =>
      data.map(banner =>
        banner.webImage ? (
          <span key={banner.id}>
            <Link href={banner?.webTargetUrl} target>
              <LazyImage src={banner.webImage} alt={banner.name} />
            </Link>
          </span>
        ) : null
      )

    if (filtered.length <= numsOfElements) {
      rendered.push(<div key={`banners`}>{renderBannerList(filtered)}</div>)
    } else {
      for (let i = 0; i < numOfSlides; i += 1) {
        if (i === numOfSlides - 1)
          rendered.push(
            <div key={`banners${i}`}>{renderBannerList(filtered.slice(filtered.length - numsOfElements))}</div>
          )
        else rendered.push(<div key={`banners${i}`}>{renderBannerList(filtered.slice(i, i + numsOfElements))}</div>)
      }
    }

    return rendered
  }
  return (
    <Carousel
      className={styles.scoped}
      animation={'slide'}
      autoPlay={{ interval: 5000 }}
      icons={{
        prev: <Icon name="back" hasTheme />,
        next: <Icon className="rotate-180" name="back" hasTheme />,
      }}
    >
      {render()}
    </Carousel>
  )
}

export default BannersBar
