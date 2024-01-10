import { YapiGetV1HomeColumnGetListColumnsDatasData } from '@/typings/yapi/HomeColumnGetListV1GetApi'
import FooterMenuList from '../footer-menu-list'
import styles from './index.module.css'

type TFooterMenu = {
  data?: YapiGetV1HomeColumnGetListColumnsDatasData[]
}

function FooterMenu(props: TFooterMenu) {
  const { data } = props
  return (
    <div className={styles.scoped}>
      {data &&
        data.map((footer, index) =>
          footer.isWeb === 1 ? (
            <div key={`${footer.homeColumnName}_${index}`} className="footer-menu-item">
              <div className="footer-title">{footer.homeColumnName}</div>
              <FooterMenuList list={footer.childColumns} />
            </div>
          ) : null
        )}
    </div>
  )
}

export default FooterMenu
