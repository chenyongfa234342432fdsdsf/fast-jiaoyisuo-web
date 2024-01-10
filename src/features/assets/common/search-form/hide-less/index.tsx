import { t } from '@lingui/macro'
import { useState } from 'react'
import { Switch, Tooltip } from '@nbit/arco'
import styles from './index.module.css'
/** 币种搜索 & 隐藏零额资产 */
export default function HideLess({
  onHideLessFn,
  onChangeHideLess,
}: {
  onHideLessFn(val): void
  onChangeHideLess?: (val) => void
}) {
  const [hideLess, setHideLess] = useState(false)

  const handleHideLess = value => {
    setHideLess(value)
    onHideLessFn(value)
    onChangeHideLess!(value)
  }
  return (
    <div className={styles.scoped}>
      <Tooltip
        color="var(--toast_bg_color)"
        content={<span className="text-xs">{t`features_assets_common_search_form_hide_less_index_2555`}</span>}
      >
        <Switch checked={hideLess} onChange={handleHideLess} />
        <span className="tip-text">{t`features/assets/main/index-5`}</span>
      </Tooltip>
    </div>
  )
}
