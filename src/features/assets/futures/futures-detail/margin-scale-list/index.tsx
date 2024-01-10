/**
 * 资产 - 合约组详情 - 保证金折算率列表弹窗
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Button } from '@nbit/arco'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { postPerpetualAssetsMarginScale } from '@/apis/assets/futures/overview'
import { MarginScaleListResp } from '@/typings/api/assets/futures'
import ListEmpty from '@/components/list-empty'
import { formatRatioNumber } from '@/helper/assets/futures'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import styles from './index.module.css'

interface MarginScaleListProps {
  visible: boolean
  groupId: string
  setVisible: (val: boolean) => void
}

function MarginScaleList(props: MarginScaleListProps) {
  const { visible, groupId, setVisible } = props || {}
  const [list, setList] = useState<MarginScaleListResp[]>([])
  const [loading, setLoading] = useState(false)
  /**
   * 查询保证金折算率列表
   */
  const onLoadList = async () => {
    setLoading(true)
    const res = await postPerpetualAssetsMarginScale({ groupId })

    const { isOk, data, message = '' } = res || {}
    setLoading(false)
    if (!isOk) {
      return
    }

    setList((data?.list as MarginScaleListResp[]) || [])
  }

  /** 去开启两项验证 */
  const onOkClick = () => {
    visible && setVisible(false)
  }

  useEffect(() => {
    onLoadList()
  }, [])

  return (
    <AssetsPopUp visible closeIcon={null} footer={null} wrapClassName={'h-full'}>
      <div className={styles['margin-scale-root']}>
        <div className="header">
          <div className="titles">
            <span className="text-text_color_01">{t`features_assets_futures_futures_detail_total_assets_index_5101553`}</span>
            <Icon className="close-icon" name="close" hasTheme onClick={onOkClick} />
          </div>

          <div className="list-header">
            <span>{t`order.filters.coin.placeholder`}</span>
            <span>{t`features_assets_futures_futures_detail_total_assets_index_5101553`}</span>
          </div>
        </div>

        <div className="list">
          {list.length > 0 ? (
            list.map((item: MarginScaleListResp) => {
              return (
                <div className="list-item" key={item.coinId}>
                  <div className="coin-info">
                    <LazyImage src={item.appLogo} width={24} height={24} />
                    <span className="ml-2">{item.coinName}</span>
                  </div>

                  <span>{formatRatioNumber(item.scale)}%</span>
                </div>
              )
            })
          ) : (
            <ListEmpty loading={loading} />
          )}
        </div>

        <Button className="bottom-btn" type="primary" onClick={onOkClick}>
          {t`features_trade_spot_index_2510`}
        </Button>
      </div>
    </AssetsPopUp>
  )
}

export { MarginScaleList }
