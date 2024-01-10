import { useEffect, useState } from 'react'
import { link } from '@/helper/link'
import { useUserStore } from '@/store/user'
import { useLayoutStore } from '@/store/layout'
import { YapiGetV1HomeColumnGetListColumnsDatasData } from '@/typings/yapi/HomeColumnGetListV1GetApi'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface UserAboutUsCellProps {
  /** 左图标 */
  iconName: string
  /** 文字 */
  text: string
  /** 路由 */
  router: string
}

interface ChildColumnsType {
  appUrl: string
  homeColumnName: string
  homeColumnCd: string
  webUrl: string
  helpCenterId: number
  isWeb: number
  isLink: number
  isParent: number
  lanTypeCd: string
  parentId: number
  id: number
  iconName: string
  link: string
}

function UserAboutUsCell({ iconName, text, router }: UserAboutUsCellProps) {
  return (
    <div className="cell" onClick={() => link(router)}>
      {/* <div className="icon">{<Icon name={iconName} hasTheme fontSize={14} />}</div> */}
      <div className="text">
        <label>{text}</label>
      </div>
      <div className="subfix">
        <Icon name="next_arrow" hasTheme fontSize={14} />
      </div>
    </div>
  )
}

function UserPersonalCenterAboutUs() {
  const [columnData, setColumnData] = useState<YapiGetV1HomeColumnGetListColumnsDatasData>()
  const [linkList, setLinkList] = useState<Array<ChildColumnsType>>([])
  const store = useUserStore()
  const { layoutProps, footerData } = useLayoutStore()
  const columnsDatas = footerData?.columnsDatas

  /** 后端没有返回 icon */
  const iconList = ['user_about_policy', 'user_about_protocol', 'user_about_rate']

  useEffect(() => {
    if (columnsDatas && columnsDatas.length > 0) {
      const cacheData = columnsDatas.find(v => v.homeColumnCd === 'about_us')
      if (cacheData && cacheData?.childColumns.length > 0) {
        let childColumns: Array<ChildColumnsType> = []
        cacheData?.childColumns.forEach((v, i) => {
          if (v.isWeb === 1) {
            childColumns.push({
              ...v,
              iconName: iconList[i],
              link: `/support/article/${v.helpCenterId}`,
            })
          }
        })
        setLinkList(childColumns)
      }

      store.setUserTransitionDatas({ homeColumnName: cacheData?.homeColumnName || '' })
      setColumnData(cacheData)
    }
  }, [columnsDatas])

  return (
    <div className={`user-about-us ${styles.scoped}`}>
      <div className="user-about-us-wrap">
        <div className="cell-wrap">
          {linkList.map((v, i) => (
            <UserAboutUsCell iconName={v.iconName} text={v.homeColumnName} router={v.link} key={i} />
          ))}
        </div>

        <div className="about-us">
          <div className="title">
            <label>{columnData?.homeColumnName}</label>
          </div>
          <div className="content">
            <p>{layoutProps?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPersonalCenterAboutUs
