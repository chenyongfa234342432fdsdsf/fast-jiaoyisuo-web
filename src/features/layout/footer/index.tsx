import { useLayoutStore } from '@/store/layout'
import {
  YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData,
  YapiGetV1HomeColumnGetListColumnsDatasData,
} from '@/typings/yapi/HomeColumnGetListV1GetApi'
import { t } from '@lingui/macro'
import Styles from './index.module.css'
import FooterMenu from './footer-menu'
import FooterIcons from './footer-icons'

function Footer() {
  const { footerData } = useLayoutStore()
  const contactUsData = {
    isWeb: 1,
    homeColumnName: t`features_layout_footer_5101300`,
    childColumns: [
      {
        homeColumnName: t`features_layout_footer_index_5101337`,
        isWeb: 1,
        homeColumnCd: 'emailCustomer',
      },
      {
        isWeb: 1,
        homeColumnName: t`features_layout_footer_index_5101338`,
        homeColumnCd: 'emailProduct',
      },
      {
        isWeb: 1,
        homeColumnName: t`features_layout_footer_index_5101339`,
        homeColumnCd: 'emailBusiness',
      },
      {
        isWeb: 1,
        homeColumnName: t`features_layout_footer_index_5101340`,
        homeColumnCd: 'emailJudiciary',
      },
    ] as YapiGetV1HomeColumnGetListChildColumnsListColumnsDatasData[],
  } as YapiGetV1HomeColumnGetListColumnsDatasData
  const { groupConfigDatas, columnsDatas, businessName, webCopyright } = footerData || {} // useFooter(data)
  const text = `${businessName} © ${webCopyright}`
  const allMenus = [...(columnsDatas || []), contactUsData]
  return (
    <div className={Styles.scoped}>
      <div className="footer-wrap">
        <div className="footer-logo">
          <span>{businessName}</span>
          <FooterIcons data={groupConfigDatas} />
        </div>
        <FooterMenu data={allMenus} />
      </div>
      <div className="footer-bootom">{text}</div>
    </div>
  )
}

export default Footer
