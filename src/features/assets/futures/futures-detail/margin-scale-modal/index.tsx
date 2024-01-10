/**
 * 资产 - 合约组详情 - 保证金折算率列表弹窗
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Button } from '@nbit/arco'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import {
  postPerpetualAvailableMarginDetail,
  postPerpetualLockMarginDetail,
  postPerpetualOccupyMarginDetail,
  postPerpetualTotalMarginDetail,
} from '@/apis/assets/futures/overview'
import { IMarginScaleList } from '@/typings/api/assets/futures'
import ListEmpty from '@/components/list-empty'
import { formatRatioNumber } from '@/helper/assets/futures'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import { PerpetualMarginScaleTypeEnum } from '@/constants/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import styles from './index.module.css'
import MarginTotalInfo from './margin-total-info'

interface MarginScaleListProps {
  type: string
  visible: boolean
  groupId: string
  setVisible: (val: boolean) => void
}

function MarginScaleModal(props: MarginScaleListProps) {
  const { groupId, type, visible, setVisible } = props || {}
  const [loading, setLoading] = useState(false)
  const assetsFuturesStore = useAssetsFuturesStore()
  const { futuresAssetsMarginScale, updateFuturesAssetsMarginScale } = { ...assetsFuturesStore }
  const [title, setTitle] = useState('')

  /** 获取逐仓总价值/可用保证金/仓位占用保证金数据 */
  const getMarginScaleDetail = async () => {
    setLoading(true)
    try {
      let res = { isOk: false } as any
      switch (type) {
        case PerpetualMarginScaleTypeEnum.total:
          res = await postPerpetualTotalMarginDetail({ groupId })
          setTitle(t`features_assets_futures_futures_detail_total_assets_index_5101357`)
          break
        case PerpetualMarginScaleTypeEnum.available:
          res = await postPerpetualAvailableMarginDetail({ groupId })
          setTitle(t`features_assets_futures_common_migrate_modal_index_5101344`)
          break
        case PerpetualMarginScaleTypeEnum.positionOccupy:
          res = await postPerpetualOccupyMarginDetail({ groupId })
          setTitle(t`features/assets/futures/futuresList/index-3`)
          break
        case PerpetualMarginScaleTypeEnum.openLockAsset:
          res = await postPerpetualLockMarginDetail({ groupId })
          setTitle(t`features_assets_futures_index_total_assets_index_g5e9brvddw9m8lxs1szf8`)
          break
        default:
          break
      }

      const { isOk, data } = res || {}
      if (!isOk || !data) return
      updateFuturesAssetsMarginScale(data)
    } finally {
      setLoading(false)
    }
  }

  /** 查询保证金折算率列表 */
  const onLoadList = async () => {
    getMarginScaleDetail()
  }

  /** 去开启两项验证 */
  const onOkClick = () => {
    visible && setVisible(false)
  }

  useEffect(() => {
    onLoadList()
  }, [type])

  return (
    <AssetsPopUp visible closeIcon={null} footer={null} wrapClassName={'h-full'}>
      <div className={styles['margin-scale-root']}>
        <div className="header">
          <div className="titles">
            <span className="text-text_color_01">{title}</span>
            <Icon className="close-icon" name="close" hasTheme onClick={onOkClick} />
          </div>
          <MarginTotalInfo />
          <div className="list-header">
            <span>{t`order.filters.coin.placeholder`}</span>
            <span>{t`features_assets_futures_futures_detail_total_assets_index_5101553`}</span>
          </div>
        </div>

        <div className="list">
          {futuresAssetsMarginScale &&
          futuresAssetsMarginScale.marginScale &&
          futuresAssetsMarginScale.marginScale.length > 0 ? (
            futuresAssetsMarginScale.marginScale.map((item: IMarginScaleList) => {
              return (
                <div className="list-item" key={item.coinId}>
                  <div className="coin-info">
                    <LazyImage src={item.webLogo} width={24} height={24} />
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

export { MarginScaleModal }
