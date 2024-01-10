/**
 * 热门币种
 */
import { useEffect, useState } from 'react'
import { AllCoinListResp } from '@/typings/api/assets/assets'
import { getAllCoinList } from '@/helper/assets'
import { CoinHotStateEnum } from '@/constants/assets'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'

type IHotCoinProps = {
  type: number
  onChangeCoin?(val): void
}

function HotCoin({ type, onChangeCoin }: IHotCoinProps) {
  const [coinListHot, setCoinListHot] = useState<AllCoinListResp[]>([])

  /** 根据选中的主网类型获取充币二维码、充值地址和充值状态等信息 */
  const getCoinListHot = async () => {
    const { coinList } = await getAllCoinList({ type: +type })
    if (!coinList || coinList.length === 0) return

    setCoinListHot(
      coinList.filter(item => {
        return item.isPopular === CoinHotStateEnum.open
      })
    )
  }

  useEffect(() => {
    getCoinListHot()
  }, [])

  return (
    <div className={styles.scoped}>
      {coinListHot && coinListHot.length > 0 && (
        <div className="hot-coin">
          {coinListHot.map((item, index) => (
            <div
              className="hot-coin-item"
              key={index}
              onClick={() => {
                onChangeCoin && onChangeCoin(item)
              }}
            >
              <LazyImage src={item.webLogo ? item.webLogo : ''} />
              <span>{item.coinName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { HotCoin }
