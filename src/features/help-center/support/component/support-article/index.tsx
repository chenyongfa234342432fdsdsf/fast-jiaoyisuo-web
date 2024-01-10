import { ReactNode } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { formatDate, DateFormatTemplate } from '@/helper/date'
import { HelpCenterArticleListHomePage } from '@/typings/api/help-center'
import styles from './index.module.css'

type SupportArticleType = {
  data?: Array<HelpCenterArticleListHomePage>
  colNumber?: number
  className?: string
  headerSize?: string
  headerTime?: boolean
  isItemsText?: boolean
  isItemsTime?: boolean
  isItemsMore?: boolean
  contentMaxHeight?: boolean
  contentClassName?: boolean
  dateFormat?: string
  moreRender?: (v: HelpCenterArticleListHomePage) => ReactNode
  /** 查看更多* */
  onMore?: (v: HelpCenterArticleListHomePage) => void
  /** 查看当前文章详情* */
  onCheckArticle?: (v: HelpCenterArticleListHomePage) => void
}

function SupportArticle(props: SupportArticleType) {
  const {
    data,
    onMore,
    className,
    onCheckArticle,
    moreRender,
    colNumber = 2,
    contentClassName = false,
    headerSize = 'text-xl',
    isItemsText = true,
    isItemsTime = true,
    isItemsMore = true,
    headerTime = false,
    contentMaxHeight = false,
    dateFormat = DateFormatTemplate.default,
  } = props

  /** 查看更多* */
  const onCheckMore = (e, v) => {
    e.stopPropagation()
    onMore && onMore(v)
  }

  /** 查看当前文章详情* */
  const currentArticle = v => {
    onCheckArticle && onCheckArticle(v)
  }

  return (
    <div className={classNames(styles.scoped, className)}>
      <div className={`${'support-card-grid'} ${`col-number-${colNumber}`}`}>
        {data?.map((v, i) => {
          return (
            <div key={i} className="support-card-items">
              <div className={`card-items-header ${headerSize}`} onClick={() => currentArticle(v)}>
                <div className="card-items-title" dangerouslySetInnerHTML={{ __html: v?.name }} />
                {headerTime ? (
                  <div className="card-items-time">{formatDate(v.pushTimeStramp as number, dateFormat)}</div>
                ) : null}
              </div>
              {isItemsText ? (
                <div className={`${contentMaxHeight ? 'card-items-max-height-content' : 'card-items-content'}`}>
                  <div
                    className={`card-items-text ${contentClassName ? 'card-items-new-text' : ''}`}
                    onClick={() => currentArticle(v)}
                    dangerouslySetInnerHTML={{ __html: v?.content }}
                  />
                </div>
              ) : null}
              {isItemsTime ? (
                <div className="card-items-times">{formatDate(v?.pushTimeStramp as number, dateFormat)}</div>
              ) : null}
              {isItemsMore ? (
                moreRender ? (
                  moreRender(v)
                ) : (
                  <div className="card-items-more" onClick={e => onCheckMore(e, v)}>
                    <span className="items-more-text">{t`features/message-center/messages-3`}</span>
                    <Icon name="next_arrow_hover" className="mt-px" />
                  </div>
                )
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default SupportArticle
