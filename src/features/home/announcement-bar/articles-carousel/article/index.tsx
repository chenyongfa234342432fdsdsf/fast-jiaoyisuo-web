import Link from '@/components/link'
import dayjs from 'dayjs'
import styles from './index.module.css'
import { getArticleUrl } from '../helper'

function Article(props) {
  const { details, textClassName } = props
  return (
    <Link className={styles.scoped} href={getArticleUrl(details.id, details.parentId)}>
      <div className="article-body">
        <div className={`truncate ${textClassName}`}>{details.name}</div>
        <span>{dayjs(details.pushTime).format('YYYY-MM-DD')}</span>
      </div>
    </Link>
  )
}

export default Article
