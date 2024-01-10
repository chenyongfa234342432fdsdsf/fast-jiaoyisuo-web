/**
 * 合约组详情 - 资产总览
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { Button, Modal, Tooltip } from '@nbit/arco'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import { formatCurrency } from '@/helper/decimal'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatAssetInfo } from '@/helper/assets/futures'
import { IncreaseTag } from '@nbit/react'
import { PerpetualMarginScaleTypeEnum } from '@/constants/assets/futures'
import { CurrencySymbolLabel } from '@/features/assets/common/set-currency'
import classNames from 'classnames'
import styles from './index.module.css'
import { AssetsChart } from '../assets-chart'
import { MarginScaleModal } from '../margin-scale-modal'

/** 总资产金额展示 */
function TotalAssets({ onAutoAddMargin }: { onAutoAddMargin: () => void }) {
  const [positionVisible, setPositionVisible] = useState(false)
  const [lockPromptVisible, setLockPromptVisible] = useState(false)
  /** 保证金币种折算率 - 弹框 */
  const [visibleMarginConvertRatePrompt, setVisibleMarginConvertRatePrompt] = useState(false)
  const [marginConvertRateType, setMarginConvertRateType] = useState('')
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresDetails,
    futuresCurrencySettings: { offset },
  } = { ...assetsFuturesStore }
  const {
    groupId = '',
    baseCoin = '',
    groupAsset = '0',
    /** 未实现盈亏 */
    unrealizedProfit = '0',
    /** 可用保证金 */
    marginAvailable = '0',
    /** 仓位保证金 */
    positionMargin = '0',
    /** 开仓冻结保证金 */
    openLockAsset = '0',
    marginCoin = [],
    positionAsset = [],
  } = { ...futuresDetails }

  return (
    <div className={styles.scoped}>
      <div className={classNames('asset-total-wrap', { '!w-3/5': Number(groupAsset) === 0 })}>
        <div className="detail-total-wrapper">
          <div className="asset-item !w-full">
            <div className="total-title">
              <span
                className="tips-text"
                onClick={() => {
                  setMarginConvertRateType(PerpetualMarginScaleTypeEnum.total)
                  setVisibleMarginConvertRatePrompt(true)
                }}
              >{t`features_assets_futures_futures_detail_total_assets_index_5101357`}</span>
              <EyesIcon />
            </div>

            <span className="total-num">
              <AssetsEncrypt content={`${formatCurrency(groupAsset, offset)}`} />
              <CurrencySymbolLabel symbol={baseCoin} />
            </span>
          </div>
        </div>

        <div className="asset-item-wrap">
          <div className="asset-item">
            <div className="label">
              <span
                className="tips-text"
                onClick={() => {
                  setMarginConvertRateType(PerpetualMarginScaleTypeEnum.available)
                  setVisibleMarginConvertRatePrompt(true)
                }}
              >{t`features_assets_futures_futures_detail_total_assets_index_5101356`}</span>
            </div>
            <div className="value">
              <AssetsEncrypt content={`${formatAssetInfo(marginAvailable, baseCoin, offset)}`} />
            </div>
          </div>
          <div className="asset-item">
            <div className="label">
              <span
                className="tips-text"
                onClick={() => {
                  setMarginConvertRateType(PerpetualMarginScaleTypeEnum.positionOccupy)
                  setVisibleMarginConvertRatePrompt(true)
                }}
              >{t`features/assets/futures/futuresList/index-3`}</span>
            </div>
            <div className="value">
              <AssetsEncrypt content={`${formatAssetInfo(positionMargin, baseCoin, offset)}`} />
            </div>
          </div>
        </div>
        <div className="asset-item-wrap">
          <div className="asset-item">
            <div className="label">
              <span
                className="tips-text"
                onClick={() => {
                  setMarginConvertRateType(PerpetualMarginScaleTypeEnum.openLockAsset)
                  setVisibleMarginConvertRatePrompt(true)
                }}
              >{t`features_assets_futures_index_total_assets_index_g5e9brvddw9m8lxs1szf8`}</span>
            </div>
            <div className="value">
              <AssetsEncrypt content={`${formatAssetInfo(openLockAsset, baseCoin, offset)}`} />
            </div>
          </div>
          <div className="asset-item">
            <span className="asset-label">{t`features/orders/order-columns/holding-6`}</span>
            <span className="value">
              <AssetsEncrypt
                content={
                  Number(unrealizedProfit) === 0 ? (
                    '--'
                  ) : (
                    <IncreaseTag
                      value={unrealizedProfit}
                      digits={offset}
                      isRound={false}
                      delZero={false}
                      hasPrefix
                      kSign
                      right={` ${baseCoin}`}
                    />
                  )
                }
              />
            </span>
          </div>
        </div>
      </div>
      <div className="asset-pie-wrap">
        {futuresDetails.groupId && <AssetsChart onAutoAddMargin={onAutoAddMargin} />}
      </div>

      <Modal
        className={styles['position-content-wrapper']}
        visible={positionVisible}
        onCancel={() => {
          setPositionVisible(false)
        }}
        footer={null}
      >
        <h3 className="text-xl font-medium">{t`assets.common.position_assets`}</h3>
        <div className="pt-2.5"></div>
      </Modal>
      <Modal
        className={styles['position-content-wrapper']}
        visible={lockPromptVisible}
        onCancel={() => {
          setLockPromptVisible(false)
        }}
        footer={null}
      >
        <h3 className="position-title">{t`features/assets/margin/all/assets-list/index-2`}</h3>
        <div className="position-content">
          <p className="mb-4">{t`features_assets_main_assets_detail_total_assets_index_5101068`}</p>
          <p className="mb-4">
            1. {t`features_assets_main_assets_detail_total_assets_index_5101069`} -
            {t`features_assets_main_assets_detail_total_assets_index_5101070`}
          </p>
          <p>2. {t`features_assets_main_assets_detail_total_assets_index_5101071`}</p>
        </div>
        <Button
          className="position-btn"
          type="primary"
          onClick={() => {
            setLockPromptVisible(false)
          }}
        >
          {t`features_trade_spot_index_2510`}
        </Button>
      </Modal>
      {visibleMarginConvertRatePrompt && (
        <MarginScaleModal
          groupId={groupId}
          visible={visibleMarginConvertRatePrompt}
          setVisible={setVisibleMarginConvertRatePrompt}
          type={marginConvertRateType}
        />
      )}
    </div>
  )
}

export { TotalAssets }
