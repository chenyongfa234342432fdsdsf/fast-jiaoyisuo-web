import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { Spin } from '@nbit/arco'
import NoDataImage from '@/components/no-data-image'
import { usePageContext } from '@/hooks/use-page-context'
import HelpCenterHeader from '@/features/help-center/header'
import NoticeMenu from '@/features/announcement/notice-menu'
import SupportArticle from '@/features/help-center/support/component/support-article'
import { getNoticeCenterPage } from '@/apis/notice-center'
import { NoticeCenterPage, NoticeCenterType, CenterDateType } from '@/typings/api/help-center'
import styles from './index.module.css'

function HelpCenterSupportNavigation() {
  const pageContext = usePageContext()
  const [menuId, setMenuId] = useState<string>('') // 当前菜单
  const [loading, setLoading] = useState<boolean>(true)
  const [menuloading, setMenuLoading] = useState<boolean>(true)
  const [noticeTitle, setNoticeTitle] = useState<string>('') // 标题
  const [noticeCenter, setNoticeCenter] = useState<Array<NoticeCenterPage>>([]) // 左侧菜单
  const [noticeArticle, setNoticeArticle] = useState<Array<NoticeCenterType>>([]) // 右侧数据

  /** 路由参数* */
  const getMenuId = () => {
    const menu = pageContext?.urlParsed
    const subMenuId = menu.search?.subMenuId
    const hash = menu?.hash
    let path = `${pageContext?.path}${hash ? `#${hash}` : ''}`
    return { path, subMenuId }
  }

  const initialHandleMenu = (data, id) => {
    return data?.find(v => v?.id === id)
  }

  /** 初次进来默认选第一个，不跳路由* */
  const handleSelectMenu = data => {
    const id = data?.dialogList[0].id
    const menuList = initialHandleMenu(data?.dialogList, id)
    setMenuId(id)
    setLoading(false)
    setNoticeTitle(menuList.name)
    const navList = menuList?.announcementTextVOList
    navList && setNoticeArticle(navList)
  }

  /** 路由跳转处理* */
  const getNoticeCenterList = async () => {
    setLoading(true)
    const { subMenuId } = await getMenuId()
    setMenuId(subMenuId)
    const res = await getNoticeCenterPage({})
    setMenuLoading(false)
    setNoticeCenter(res.data?.dialogList)
    if (subMenuId) {
      const menuList = initialHandleMenu(res.data?.dialogList, subMenuId)
      const navList = menuList?.announcementTextVOList
      setLoading(false)
      setNoticeTitle(menuList?.name)
      navList && setNoticeArticle(navList)
    } else {
      res?.data && handleSelectMenu(res?.data)
    }
  }

  const onMenuChange = v => {
    setNoticeArticle(v?.announcementTextVOList)
    link(`/announcement?subMenuId=${v?.id}`, { keepScrollPosition: true })
  }

  /** 搜索* */
  const onChangeSearch = v => {
    v && link(`/support/search?type=2&&searchName=${v}#2`)
  }

  const onChangeArticle = v => {
    link(`/announcement/article/${v?.id}`, { keepScrollPosition: true })
  }

  useEffect(() => {
    getNoticeCenterList()
  }, [pageContext.urlOriginal])

  return (
    <div className={styles.scoped}>
      <div className="notice-center-content">
        <div className="navigation-menu">
          <Spin dot loading={menuloading} className="w-full h-full">
            <div className="w-full h-full">
              {noticeCenter?.length ? (
                <NoticeMenu menuChange={onMenuChange} data={noticeCenter} menuId={menuId} />
              ) : menuloading ? null : (
                <NoDataImage />
              )}
            </div>
          </Spin>
        </div>
        <div className="navigation-content">
          <div className="navigation-content-header">
            <HelpCenterHeader
              searchName={t`features/announcement/index-6`}
              onSearch={onChangeSearch}
              placeholder={t`features/announcement/index-8`}
            />
          </div>
          <div className="navigation-content-body">
            <Spin dot loading={loading} className="w-full h-full">
              <div className="content-body-title">
                <label>{noticeTitle || ''}</label>
              </div>
              {noticeArticle?.length ? (
                <SupportArticle
                  data={noticeArticle}
                  headerSize={'text-sm'}
                  isItemsText={false}
                  isItemsMore={false}
                  dateFormat={CenterDateType.MonthData}
                  onCheckArticle={onChangeArticle}
                />
              ) : loading ? null : (
                <NoDataImage />
              )}
            </Spin>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenterSupportNavigation
