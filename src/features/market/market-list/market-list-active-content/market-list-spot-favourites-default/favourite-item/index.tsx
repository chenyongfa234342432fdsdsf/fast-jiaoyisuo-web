import { Checkbox } from '@nbit/arco'

import { WsFavouriteDefaultDataType } from '@/typings/api/market/market-list'
import { formatTradePair, getQuoteDisplayName } from '@/helper/market'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'

function FavouritesItem(props: WsFavouriteDefaultDataType) {
  return (
    <div className={styles.scoped}>
      <div className="mb-[17px]">
        <span className="flex flex-row gap-x-2 items-center">
          <LazyImage className="coin-logo" src={props.webLogo} />
          {getQuoteDisplayName({
            coin: props,
            spot: { hasColorContrast: false },
            futures: { withSymbolType: true, withSymbolTypeCss: true },
            onClickProps: { redirect: true },
          })}
        </span>
        <Checkbox value={props.id || props.tradePairId} />
      </div>
      <div>
        <span className="text-base">{formatTradePair(props as any).lastByUserPreference()}</span>
        <span className="text-[28px]">{formatTradePair(props as any).chg()}</span>
      </div>
    </div>
  )
}

export default FavouritesItem
