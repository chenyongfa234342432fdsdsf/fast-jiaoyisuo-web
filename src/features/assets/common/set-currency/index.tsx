import { useState, useEffect } from 'react'
import { Trigger } from '@nbit/arco'
import Icon from '@/components/icon'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { useAssetsStore } from '@/store/assets'
import classNames from 'classnames'
import styles from './index.module.css'

interface MenuCellListType {
  onClick?: () => void
}
type IMenuCellsProps = {
  onClickMenu?: (v: MenuCellListType) => void
}
function MenuCells({ onClickMenu }: IMenuCellsProps) {
  const { fiatCurrencyData, getFiatCurrencyData, updateFiatCurrencyData } = usePersonalCenterStore()

  useEffect(() => {
    getFiatCurrencyData()
  }, [])

  const onClick = values => {
    updateFiatCurrencyData('currencySymbol', values.currencySymbol)
    onClickMenu && onClickMenu(values)
  }

  return (
    <div className={styles.scoped}>
      {fiatCurrencyData?.currencyList.map(v => (
        <div className="cell" key={v.id} onClick={() => onClick(v)}>
          <div className="cell-wrap">{v.currencyEnName}</div>
        </div>
      ))}
      {fiatCurrencyData?.currencyList.length > 3 && (
        <Link className="cell-wrap" href="/personal-center/settings">
          <div className="label-text">{t`More`}</div>
          <Icon className="icon" name="assets_more" hasTheme />
        </Link>
      )}
    </div>
  )
}

export function SetCurrency() {
  const { currencyEnName } = usePersonalCenterStore().fiatCurrencyData
  const assetsStore = useAssetsStore()
  const {
    assetSetting: { encryptState },
  } = assetsStore
  const [popupVisible, setPopupVisible] = useState(false)

  return (
    <div
      className={classNames(styles['trigger-wrapper'], {
        hidden: encryptState,
      })}
    >
      <Trigger
        popup={() => <MenuCells onClickMenu={() => setPopupVisible(false)} />}
        onVisibleChange={setPopupVisible}
        popupVisible={popupVisible}
      >
        {currencyEnName}
        <Icon className="icon" name="arrow_open" hasTheme onClick={() => setPopupVisible(true)} />
      </Trigger>
    </div>
  )
}

/** 资产法币符号，监听资产显示隐藏状态 */
export function CurrencySymbolLabel({ symbol }: { symbol: string }) {
  const { currencyEnName } = usePersonalCenterStore().fiatCurrencyData
  const assetsStore = useAssetsStore()
  const {
    assetSetting: { encryptState },
  } = assetsStore

  return (
    <div
      className={classNames(styles['trigger-wrapper'], {
        hidden: encryptState,
      })}
    >
      {symbol || currencyEnName}
    </div>
  )
}
