import { useCreation } from 'ahooks'
import { useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import Link from '@/components/link'
import LazyImage from '@/components/lazy-image'
import { usePageContext } from '@/hooks/use-page-context'
import { Pagination, Breadcrumb, Spin } from '@nbit/arco'
import { getSupportSearchArticle, getAllSearchArticle } from '@/apis/help-center'
import { getNoticeCenterSearch } from '@/apis/notice-center'
import HelpCenterHeader from '@/features/help-center/header'
import { oss_svg_image_domain_address } from '@/constants/oss'
import SupportArticle from '@/features/help-center/support/component/support-article'
import { SupportSearchType, CenterDateType } from '@/typings/api/help-center'
import styles from './index.module.css'

const BreadcrumbItem = Breadcrumb.Item

function HelpCenterSearch() {
  const pageContext = usePageContext()
  const [searchData, setSearchData] = useState<Array<SupportSearchType>>([])
  const [searchName, setSearchName] = useState<string>('')
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const [type, setType] = useState<string>('1')
  const [loading, setLoading] = useState<boolean>(false)
  const [currentButtonId, setCurrentButtonId] = useState<string>('1')
  /** 按钮数据* */
  const buttonList = [
    { id: '1', title: t`features_help_center_support_search_index_2751` },
    { id: '2', title: t`features/announcement/index-6` },
    { id: '3', title: t`common.all` },
  ]

  const urlPath = {
    '1': getSupportSearchArticle,
    '2': getNoticeCenterSearch,
    '3': getAllSearchArticle,
  }

  const getMenuId = () => {
    const menu = pageContext?.urlParsed
    const types = menu.search?.type
    const name = menu.search?.searchName
    const searchType = menu?.hash
    return { name, types, searchType }
  }

  const getArticeList = async () => {
    setLoading(true)
    const { searchType } = await getMenuId()
    const params = {
      page,
      pageSize: size,
      key: searchName,
    }
    const res = await urlPath[searchType](params)
    if (res.data) {
      setTotal(res.data?.total)
      setSearchData(res.data?.rows)
    }
    setLoading(false)
  }

  /** 搜索* */
  const onChangeSearch = v => {
    if (v) {
      setPage(1)
      link(`/support/search?searchName=${v}#3`)
    }
  }

  useCreation(() => {
    const { name, types, searchType } = getMenuId()
    setType(types)
    setSearchName(name)
    setCurrentButtonId(searchType)
  }, [pageContext?.urlOriginal])

  useCreation(() => {
    searchName && getArticeList()
  }, [searchName, page, size, currentButtonId])

  /** 用户教程* */
  const userMore = v => {
    if (v.centerType === '1') {
      link(
        `/support/navigation?menuName=${v.higherLeverName}&subId=${v.articleId}&subMenuId=${v.topDialogId}#${v.parentId}`
      )
    } else {
      link(`/announcement?subName=${v?.higherLeverName}&subMenuId=${v?.parentId}`)
    }
  }

  /** *点击查看更多 */
  const onCheckArticle = v => {
    if (v.centerType === '1') {
      link(`/support/article/${v.articleId}?subId=${v.articleId}&subMenuId=${v.topDialogId}#${v.parentId}`)
    } else {
      link(`/announcement/article/${v?.articleId}?subMenuId=${v.parentId}`)
    }
  }

  /** 点击分页* */
  const onChangePage = num => {
    setPage(num)
  }

  /** 切换当前需展示多少条 * */
  const onPageSizeChange = num => {
    setSize(num)
  }

  /** 按钮改变* */
  const onChangeButton = v => {
    link(`/support/search?type=${type}&searchName=${searchName}#${v.id}`)
  }

  return (
    <section className={styles['help-center-support-search-wrap']}>
      <div className="support-search-header">
        <HelpCenterHeader
          onSearch={onChangeSearch}
          value={searchName}
          searchName={type === '1' ? t`user.personal_center_06` : t`features/announcement/index-6`}
        />
      </div>
      <div className="support-search-body">
        <div className="support-search-content">
          <Breadcrumb separator={<Icon name="next_arrow" hasTheme />}>
            <BreadcrumbItem>
              <Link href={`${type === '1' ? '/support' : '/announcement'}`}>
                {type === '1' ? t`user.personal_center_06` : t`features/announcement/index-6`}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{t`features_help_center_support_search_index_2753`}</BreadcrumbItem>
          </Breadcrumb>
          <div className="support-search-button">
            {buttonList.map(item => {
              return (
                <span
                  key={item.id}
                  onClick={() => onChangeButton(item)}
                  className={`search-header-button support-search-text ${
                    currentButtonId === item.id ? 'select-color' : ''
                  }`}
                >
                  {item.title}
                </span>
              )
            })}
          </div>
          <Spin dot loading={loading}>
            <div className="w-full h-full">
              {searchData.length ? (
                <>
                  <SupportArticle
                    data={searchData}
                    colNumber={1}
                    headerTime
                    isItemsTime={false}
                    moreRender={v => {
                      return (
                        <div onClick={() => userMore(v)} className={`search-article-button support-search-text`}>
                          <span>{v?.higherLeverName}</span>
                          <Icon name="next_arrow" hasTheme />
                        </div>
                      )
                    }}
                    headerSize={'search-title'}
                    contentMaxHeight
                    dateFormat={CenterDateType.MinDate}
                    onCheckArticle={onCheckArticle}
                  />
                  <div className="search-content-pagination">
                    <Pagination
                      showTotal
                      showJumper
                      total={total}
                      sizeCanChange
                      current={page}
                      pageSize={size}
                      onChange={onChangePage}
                      onPageSizeChange={onPageSizeChange}
                    />
                  </div>
                </>
              ) : (
                !loading && (
                  <div className="mt-24">
                    <LazyImage
                      hasTheme
                      whetherPlaceholdImg={false}
                      imageName={t`features_help_center_support_search_index_2755`}
                      src={`${oss_svg_image_domain_address}no_search`}
                    />
                    <div
                      className="support-back-button"
                      onClick={() => link(`${type === '1' ? '/support' : '/announcement'}`)}
                    >
                      {type === '1' ? t`help.center.support_06` : t`features_help_center_support_search_index_5101222`}
                    </div>
                  </div>
                )
              )}
            </div>
          </Spin>
        </div>
      </div>
    </section>
  )
}

export default HelpCenterSearch
