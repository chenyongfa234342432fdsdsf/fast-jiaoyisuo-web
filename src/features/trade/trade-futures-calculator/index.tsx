import Icon from '@/components/icon'
import { useState } from 'react'
import TradeFuturesCalculatorModal from './trade-futures-calculator-modal'

function TradeFuturesCalculator() {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <Icon name="contract_calculator" onClick={() => setVisible(true)} hover hasTheme />
      {visible && (
        <TradeFuturesCalculatorModal
          isOpen={visible}
          toggleModal={isOpen => {
            setVisible(isOpen)
          }}
        />
      )}
    </div>
  )
}

export default TradeFuturesCalculator
