import { useAnnouncements } from '@/hooks/features/home'
import ArticlesCarousel from './articles-carousel'
import styles from './index.module.css'

function AnnouncementBar(props) {
  const { data } = props
  const notices = useAnnouncements(data)
  return (
    <div className={styles.scoped}>
      <ArticlesCarousel notices={notices} />
    </div>
  )
}

export default AnnouncementBar
