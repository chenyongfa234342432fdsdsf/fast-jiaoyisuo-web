import IconDropdown from '@/components/icon-dropdown'
import LazyImage from '@/components/lazy-image'
import Link from '@/components/link'
import { YapiGetV1HomeColumnGetListGroupConfigDatasData } from '@/typings/yapi/HomeColumnGetListV1GetApi'
import styles from './index.module.css'

type TFooterIcons = {
  data?: YapiGetV1HomeColumnGetListGroupConfigDatasData[]
}

function FooterIcons(props: TFooterIcons) {
  const { data } = props
  return (
    <div className={styles.scoped}>
      {data &&
        data.map((icon, index) => (
          <Link key={`icondropdown_${index}`} href={icon.linkUrl} target>
            <IconDropdown
              icon={
                <LazyImage
                  key={index}
                  height={20}
                  width={20}
                  src={icon.imgIcon}
                  alt={icon.groupName}
                  visibleByDefault
                  whetherPlaceholdImg={false}
                />
              }
              droplist={[{ image: icon.imgQrCode, title: icon.groupDescribe }]}
            />
          </Link>
        ))}
    </div>
  )
}

export default FooterIcons
