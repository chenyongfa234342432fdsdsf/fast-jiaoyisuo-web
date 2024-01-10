import { useState } from 'react'
import classNames from 'classnames'
import TradeSidebarSetting from '@/features/trade/trade-setting/common/sidebar'
import Icon from '@/components/icon'
import Styles from './index.module.css'

function TradeSetting({ className }: { className: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={classNames(Styles.scoped, className)}>
      <TradeSidebarSetting visible={visible} setVisible={setVisible} />

      <div className="trade-setting-wrap" onClick={() => setVisible(!visible)}>
        <Icon name="msg_set_def" hasTheme fontSize={22} hover />
      </div>
    </div>
  )
}

export default TradeSetting
