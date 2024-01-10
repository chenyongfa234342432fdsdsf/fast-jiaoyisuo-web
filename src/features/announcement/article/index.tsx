import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { Message, Spin } from '@nbit/arco'
import { formatDate } from '@/helper/date'
import NoDataImage from '@/components/no-data-image'
import { usePageContext } from '@/hooks/use-page-context'
import HelpCenterHeader from '@/features/help-center/header'
import { getNoticeCenterArticle } from '@/apis/notice-center'
import NoticeMenu from '@/features/announcement/notice-menu'
import { NoticeCenterPage, NoticeCenterType, NoticeCenterArticleList, CenterDateType } from '@/typings/api/help-center'
import styles from './index.module.css'

function NoticeCenterArticle() {
  const pageContext = usePageContext()
  const [menuId, setMenuId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [menuLoading, setMenuLoading] = useState<boolean>(true)
  const [noticeList, setNoticeList] = useState<NoticeCenterArticleList>()
  const [noticeCenter, setNoticeCenter] = useState<Array<NoticeCenterPage>>([])
  const [noticeArticle, setNoticeArticle] = useState<Array<NoticeCenterType>>([])

  const getMenuId = () => {
    const menu = pageContext?.urlParsed
    const id = pageContext?.routeParams?.id
    const host = pageContext?.host
    const locale = pageContext?.locale
    const hash = menu?.hash
    let path = `${pageContext?.path}${hash ? `#${hash}` : ''}`
    return { id, host, locale, path }
  }

  const getCurrentArticleList = async id => {
    if (id) {
      setLoading(true)
      const res = await getNoticeCenterArticle({ announceContentId: id })
      setLoading(false)
      setMenuLoading(false)
      if (!res.data && !res.isOk) return
      setNoticeList(res.data?.announcementCenter)
      setNoticeCenter(res.data?.catalogVOList)
      setNoticeArticle(res.data?.announcementList?.slice(0, 5))
    }
  }

  /** 分享当前文章* */
  const shareCurrentArticle = () => {
    const { host, locale, path } = getMenuId()
    // 创建 text area
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

  const onMenuChange = v => {
    link(`/announcement?subMenuId=${v.id}`)
  }

  /** 搜索* */
  const onChangeSearch = v => {
    if (v) {
      link(`/support/search?type=2&searchName=${v}#2`)
    }
  }

  const onChangeArticle = v => {
    link(`/announcement/article/${v.id}`)
  }

  const initialHandleMenu = (data, id) => {
    let arrRes = []
    let forFn = function (arr, initId) {
      arr.forEach(item => {
        if (item.id === initId) {
          arrRes.unshift(item as never)
          forFn(data, item.parentId)
        } else {
          if (item.announcementTextVOList) {
            forFn(item.announcementTextVOList, initId)
          }
        }
      })
    }
    forFn(data, id)
    return arrRes
  }

  useEffect(() => {
    if (noticeCenter?.length) {
      const { id } = getMenuId()
      const noticeMenu = initialHandleMenu(noticeCenter, id) as any
      setMenuId(noticeMenu[0]?.id)
    }
  }, [noticeCenter])

  useEffect(() => {
    const { id } = getMenuId()
    getCurrentArticleList(id)
  }, [pageContext.urlOriginal])

  return (
    <div className={styles['announcement-article']}>
      <div className="notice-center-article">
        <div className="article-menu">
          <Spin dot loading={menuLoading} className="w-full h-full">
            <div className="w-full h-full">
              {noticeCenter?.length ? (
                <NoticeMenu menuChange={onMenuChange} data={noticeCenter} menuId={menuId} />
              ) : menuLoading ? null : (
                <NoDataImage />
              )}
            </div>
          </Spin>
        </div>
        <div className="article-content">
          <div className="article-content-header">
            <HelpCenterHeader
              searchName={t`features/announcement/index-6`}
              onSearch={onChangeSearch}
              placeholder={t`features/announcement/index-8`}
            />
          </div>
          <div className="article-content-body">
            <div className="article-main-content">
              <Spin dot loading={loading} className="flex-1 h-full">
                <div className="article-content-left">
                  <div className="article-body-header">{noticeList?.name}</div>
                  <div className="article-body-time">
                    {formatDate(noticeList?.pushTimeStramp as number, CenterDateType.MinDate)}
                  </div>
                  <div className="article-body-title" dangerouslySetInnerHTML={{ __html: noticeList?.content }} />
                </div>
              </Spin>
              <div className="article-content-right">
                <div className="content-right-header">
                  <Icon name="announcement-new" className="header-icon" />
                  <label>{t`features/announcement/index-10`}</label>
                </div>
                <div className="content-right-body">
                  {noticeArticle?.map(v => {
                    return (
                      <div key={v.id} className="new-article-text" onClick={() => onChangeArticle(v)}>
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
        </div>
      </div>
    </div>
  )
}

export default NoticeCenterArticle
