import { useEffect, useState } from 'react'
import { Breadcrumb, Message, Spin } from '@nbit/arco'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { formatDate } from '@/helper/date'
import { useListStore } from '@/store/help-center'
import { getSupportArticle } from '@/apis/help-center'
import { usePageContext } from '@/hooks/use-page-context'
import NoDataImage from '@/components/no-data-image'
import HelpCenterHeader from '@/features/help-center/header'
import SupportMenu from '@/features/help-center/support/component/support-menu'
import {
  HelpCenterSearchArticle,
  HelpCenterSupportArticle,
  HelpCenterSupportMenu,
  CenterDateType,
} from '@/typings/api/help-center'
import styles from './index.module.css'

const BreadcrumbItem = Breadcrumb.Item

function HelpCenterSupportSearch() {
  const userState = useListStore()
  const pageContext = usePageContext()
  const [loading, setLoading] = useState<boolean>(true)
  const [menuLoading, setMenuLoading] = useState<boolean>(true)
  const [article, setArticle] = useState<HelpCenterSearchArticle>()
  const [openKeys, setOpenKeys] = useState<Array<string>>([])
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
  const [relatedArticles, setRelatedArticles] = useState<Array<HelpCenterSupportArticle>>([])
  const [supportMenu, setSupportMenu] = useState<Array<HelpCenterSupportMenu>>([])

  const getCurrentArticleList = async id => {
    if (id) {
      setLoading(true)
      const res = await getSupportArticle({ contentId: id })
      setLoading(false)
      setMenuLoading(false)
      if (!res.data && !res.isOk) return
      setArticle(res.data?.helpCenterText)
      setSupportMenu(res.data?.catelogList)
      setRelatedArticles(res.data?.articleList?.slice(0, 5))
    }
  }

  const getMenuId = () => {
    const menu = pageContext?.urlParsed
    const subMenuId = menu.search?.subMenuId
    const host = pageContext?.host
    const locale = pageContext?.locale
    const id = pageContext?.routeParams?.id
    let path = pageContext?.path
    return { path, subMenuId, host, locale, id }
  }

  const anyNameFunction = async () => {
    const { id } = getMenuId()
    getCurrentArticleList(id)
  }

  const initialHandleMenu = (data, id) => {
    let arrRes = []
    let forFn = function (arr, id) {
      arr.forEach(v => {
        let item = v
        if (item.id === id) {
          arrRes.unshift(item as never)
          forFn(data, item.parentId)
        } else {
          if (item.catalogVOList) {
            forFn(item.catalogVOList, id)
          }
        }
      })
    }
    forFn(data, id)
    return arrRes
  }

  /** 搜索* */
  const onChangeSearch = v => {
    v && link(`/support/search?type=1&&searchName=${v}#1`)
  }

  const onClickSubMenu = v => {
    v && link(`/support/navigation?subMenuId=${v.id}`, { keepScrollPosition: true })
  }

  const onClickMenuItem = v => {
    v && link(`/support/navigation?subMenuId=${v.id}`, { keepScrollPosition: true })
  }

  const onArticleChange = v => {
    v && link(`/support/article/${v.id}`, { keepScrollPosition: true })
  }

  /** 处理面包屑* */
  const handleBreadcrumb = v => {
    userState.addBreadcrumb(v)
  }

  /** 处理面包屑* */
  const onChangeBread = data => {
    const parentPath = `/support/navigation?subMenuId=${data[0]?.id}`
    const currentPath = `/support/navigation?subMenuId=${data[1]?.id}`
    if (data?.length >= 2) {
      const newMenuData = [
        { ...data[0], path: parentPath },
        { ...data[1], path: currentPath },
      ]
      handleBreadcrumb(newMenuData)
    } else {
      handleBreadcrumb({ ...data[0], path: parentPath })
    }
  }

  /** 分享当前文章* */
  const shareCurrentArticle = () => {
    const { host, locale, path } = getMenuId()
    const currentRouter = `${host}/${locale}${path}`
    const textArea = document.createElement('textarea')
    textArea.value = `${currentRouter}`
    // 隐藏文本框，同时防止屏幕抖动
    textArea.style.position = 'fixed'
    textArea.style.left = '0'
    textArea.style.top = '0'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select() // 选中文本
    const successful = document.execCommand('copy') // 执行 copy 操作
    if (successful) {
      Message.success(t`features_help_center_support_article_index_5101177`)
    } else {
      Message.error(t`features_help_center_support_article_index_5101178`)
    }
    textArea.remove()
  }

  useEffect(() => {
    anyNameFunction()
  }, [pageContext.urlOriginal])

  useEffect(() => {
    if (supportMenu?.length) {
      const { id } = getMenuId()
      const menuData = initialHandleMenu(supportMenu, id) as any
      if (menuData?.length >= 2) {
        setOpenKeys([menuData[0]?.id])
        setSelectedKeys([menuData[1]?.id])
      } else {
        setOpenKeys([menuData[0]?.id])
        setSelectedKeys([''])
      }
      setLoading(false)
      onChangeBread(menuData)
    }
  }, [supportMenu])

  return (
    <div className={styles.scoped}>
      <div className="help-center-support-article">
        <div className="article-menu">
          <Spin dot loading={menuLoading} className="w-full h-full">
            <div className="w-full h-full">
              {supportMenu?.length ? (
                <SupportMenu
                  data={supportMenu}
                  openKeys={openKeys}
                  selectedKeys={selectedKeys}
                  onClickSubMenu={onClickSubMenu}
                  onClickMenuItem={onClickMenuItem}
                />
              ) : menuLoading ? null : (
                <NoDataImage />
              )}
            </div>
          </Spin>
        </div>
        <div className="article-content">
          <div className="article-content-header">
            <HelpCenterHeader onSearch={onChangeSearch} />
          </div>
          <Spin dot loading={loading} className="flex-1">
            <div className="article-content-body">
              <div className="article-main-content">
                <div className="article-content-left">
                  <Breadcrumb separator={<Icon name="breadcrumb_arrow" hasTheme className="breadcrumb-icon" />}>
                    <BreadcrumbItem>
                      <Link href="/support">{t`user.personal_center_06`}</Link>
                    </BreadcrumbItem>
                    {userState.breadcrumbList?.map((v, index) => {
                      return (
                        <BreadcrumbItem
                          key={v.id}
                          className={userState.breadcrumbList.length - 1 === index ? 'breadcrumb-color' : ''}
                        >
                          <Link href={v.path}>{v.name}</Link>
                        </BreadcrumbItem>
                      )
                    })}
                  </Breadcrumb>
                  <div className="article-body-header">{article?.name}</div>
                  <div className="article-body-time">{formatDate(article?.pushTimeStramp, CenterDateType.MinDate)}</div>
                  <div className="article-body-title" dangerouslySetInnerHTML={{ __html: article?.content }} />
                </div>
                <div className="article-content-right">
                  <div className="content-right-header">
                    <Icon name="latest_articles" className="header-icon" />
                    <label>{t`features_announcement_center_article_index_2750`}</label>
                  </div>
                  <div className="content-right-body">
                    {relatedArticles?.map((v, i) => {
                      return (
                        <div key={i} className="new-article-text" onClick={() => onArticleChange(v)}>
                          {v.name}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="article-share-button" onClick={shareCurrentArticle}>
                <Icon name="help_share" hasTheme className="share-button-icon" />
                <span className="share-button-text">{t`features_announcement_center_article_index_2749`}</span>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  )
}

export default HelpCenterSupportSearch
