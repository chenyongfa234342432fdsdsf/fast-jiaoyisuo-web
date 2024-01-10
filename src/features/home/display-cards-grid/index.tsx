import { useFeaturesCard } from '@/hooks/features/home'
import DisplayCard from '../display-card'
import styles from './index.module.css'

function DisplayCardsGrid() {
  const features = useFeaturesCard()
  const renderDisplayCards = features.map((data, index) => <DisplayCard key={index} {...data} />)
  return <div className={styles.scoped}>{renderDisplayCards}</div>
}

export default DisplayCardsGrid
