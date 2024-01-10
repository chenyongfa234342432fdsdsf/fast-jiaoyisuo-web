import Link from '@/components/link'
import { determineRedirectionUrl } from '@/helper/layout/footer'
import { useLayoutStore } from '@/store/layout'
import { TlayoutProps } from '@/typings/api/layout'
import { YapiGetV1HomeColumnGetListColumnsDatasData } from '@/typings/yapi/HomeColumnGetListV1GetApi'

type TFooterMenuList = {
  list: YapiGetV1HomeColumnGetListColumnsDatasData['childColumns']
}

function FooterMenuList(props: TFooterMenuList) {
  const { list } = props
  const { layoutProps } = useLayoutStore()

  return <>{list.map(each => (each.isWeb === 1 ? contactUsOrLink(each, layoutProps) : null))}</>
}

function contactUsOrLink(
  data: YapiGetV1HomeColumnGetListColumnsDatasData['childColumns'][0],
  layoutProps?: TlayoutProps
) {
  if (layoutProps && layoutProps[data.homeColumnCd]) {
    const emailKey = data.homeColumnCd
    return (
      <span key={data.homeColumnName} className="menu-list">
        <a href={`mailto:${layoutProps[emailKey]}`} className="hover:text-brand_color whitespace-nowrap">
          {`${data.homeColumnName}: ${layoutProps[emailKey]}`}
        </a>
      </span>
    )
  }
  return (
    <span key={data.homeColumnName} className="menu-list">
      <Link href={determineRedirectionUrl(data)} target={data.isLink === 1} className="hover:text-brand_color">
        {data.homeColumnName}
      </Link>
    </span>
  )
}

export default FooterMenuList
