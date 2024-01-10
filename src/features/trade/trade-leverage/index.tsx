import Icon from '@/components/icon'
import { useState } from 'react'
import { leverageInputFormatter } from '@/helper/trade'
import { useFuturesStore } from '@/store/futures'
import TradeLeverageModal from './trade-leverage-modal'
import styles from './index.module.css'

function TradeLeverage() {
  const { currentLeverage } = useFuturesStore() || {}

  const [visible, setVisible] = useState(false)
  return (
    <>
      <div className={styles.scoped} onClick={() => setVisible(true)}>
        {leverageInputFormatter(currentLeverage)}
        <Icon name="trade_expand" hasTheme />
      </div>
      {visible && <TradeLeverageModal isOpen={visible} toggleModal={isOpen => setVisible(isOpen)} />}
    </>
  )
}

export default TradeLeverage
