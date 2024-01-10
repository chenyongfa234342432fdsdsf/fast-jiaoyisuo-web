import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import HelpCenterHeader from '@/features/help-center/header'
import { Spin } from '@nbit/arco'
import { getSupportHomePage } from '@/apis/help-center'
import {
  HelpCenterArticleListHomePage,
  HelpCenterQuestionListHomePage,
  CenterDateType,
} from '@/typings/api/help-center'
import NoDataImage from '@/components/no-data-image'
import SupportArticle from './component/support-article'
import SupportCard from './component/support-card'
import styles from './index.module.css'

function HelpCenter() {
  const [loading, setLoading] = useState<boolean>(false)
  const [articleList, setArticleList] = useState<Array<HelpCenterArticleListHomePage>>([])
  const [questionList, setQuestionList] = useState<Array<HelpCenterQuestionListHomePage>>([])

  const onloadCurrencies = async () => {
    setLoading(true)
    const res = await getSupportHomePage({})
    if (res.isOk && res.data) {
      setArticleList(res.data?.articleList)
      setQuestionList(res.data?.questionList?.slice(0, 19))
    }
    setLoading(false)
  }

  /** 搜索文章* */
  const onChangeSearch = v => {
    link(`/support/search?type=1&&searchName=${v}#1`)
  }

  /** 点击一级标题* */
  const onChangeCard = v => {
    link(`/support/navigation?subMenuId=${v.id}`)
  }

  const onMore = () => {
    link(`/support/navigation`)
  }

  /** *点击查看更多 */
  const onChangeMore = v => {
    link(`/support/navigation?subMenuId=${v.parentId}`)
  }

  /** 查看当前文章详情* */
  const checkCurrentArticle = v => {
    link(`/support/article/${v.id}?subMenuId=${v.parentId}`)
  }

  useEffect(() => {
    onloadCurrencies()
  }, [])

  return (
    <section className={`help-center-support ${styles.scoped}`}>
      <div className="help-center-support-wrap">
        <div className="help-center-support-header">
          <HelpCenterHeader onSearch={onChangeSearch} />
        </div>

        <div className="content">
          <div className="content-wrap">
            <Spin dot loading={loading}>
              <div className="content-problem">
                <div className="content-title">
                  <div className="content-title-header">
                    <Icon name="tips_icon" className="problem-icon" />
                    <span className="problem-text">{t`features_help_center_support_search_index_2751`}</span>
                  </div>
                  <div className="content-title-footer">
                    <label className="footer-text-first">{t`features_help_center_support_index_2756`}</label>
                    <div className="footer-text-second">
                      <span>{t`features_help_center_support_index_2757`}</span>
                      <span className="text-time-color">{t`features_help_center_support_index_2758`}</span>
                      <span>{t`features_help_center_support_index_2759`}</span>
                    </div>
                  </div>
                </div>
                <div className="content-func">
                  {questionList?.length ? (
                    <SupportCard onChange={onChangeCard} data={questionList} onMore={onMore} />
                  ) : loading ? null : (
                    <NoDataImage />
                  )}
                </div>
              </div>
            </Spin>
            <Spin dot loading={loading}>
              <div className="content-new-article">
                <div className="new-article-header">
                  <Icon name="latest_articles" className="article-icon" />
                  <span className="problem-text">{t`help.center.support_04`}</span>
                </div>
                {articleList?.length ? (
                  <SupportArticle
                    className="w-full h-full"
                    data={articleList}
                    onMore={onChangeMore}
                    contentClassName
                    dateFormat={CenterDateType.MinDate}
                    onCheckArticle={checkCurrentArticle}
                  />
                ) : loading ? null : (
                  <NoDataImage />
                )}
              </div>
            </Spin>
          </div>
          {/* <Divider /> */}
        </div>
      </div>
    </section>
  )
}

export default HelpCenter
