import TradeLyout from '@/features/trade/trade-layout'
import { Popover } from '@nbit/arco'
import { useRef } from 'react'
import Icon from '@/components/icon'

function TradeLayoutTrigger() {
  const containerRef = useRef<HTMLDivElement>(null)
  const getPopupContainer = () => containerRef.current!
  const content = TradeLyout()

  return (
    <Popover getPopupContainer={getPopupContainer} position="br" trigger="hover" content={content}>
      {/* 不多加一个 div 无法触发 */}
      <div ref={containerRef}>
        <Icon name="spot_format_switch" hasTheme />
      </div>
    </Popover>
  )
}

export default TradeLayoutTrigger
