import Icon from '@/components/icon'
import RedirectButton from '@/components/redirect-button'
import { Carousel, Divider } from '@nbit/arco'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { useState } from 'react'
import { ITradeNotification } from '@/typings/api/trade'
import classNames from 'classnames'
import styles from './index.module.css'
import { formatArticlesList, getArticleListUrl, getArticleUrl } from './helper'
import Article from './article'

const renderFull = notices => {
  const formattedNotices = formatArticlesList(notices)
  return formattedNotices.map((article, index) => (
    <span key={index} className={'grid grid-flow-col auto-cols-fr'}>
      {article.map(each => (
        <div key={each.id} className="flex flex-row grow items-center text-text_color_02">
          <Article details={each} textClassName={article.length === 3 ? 'max-w-[200px]' : 'max-w-[400px]'} />
          <Divider type="vertical" />
        </div>
      ))}
    </span>
  ))
}

function ArticlesCarousel({ notices }: { notices: ITradeNotification[] }) {
  const [currentId, setcurrentId] = useState<ITradeNotification>()
  const formattedNotices = formatArticlesList(notices)

  if (!currentId && notices[0]) setcurrentId(notices[0])

  return (
    <div className={classNames(styles.scoped, { invisible: notices.length < 1 })}>
      <Link href={getArticleUrl(currentId?.id, currentId?.parentId)}>
        <span>
          <Icon name="home_notice" hasTheme />
        </span>
      </Link>
      <Carousel
        direction={'vertical'}
        showArrow="never"
        indicatorPosition="right"
        autoPlay={{ interval: 3000 }}
        onChange={index => setcurrentId(formattedNotices[index][0])}
      >
        {renderFull(notices)}
      </Carousel>
      <RedirectButton>
        <Link href={getArticleListUrl(currentId?.name, currentId?.id)}>{t`More`}</Link>
      </RedirectButton>
    </div>
  )
}

export default ArticlesCarousel
