import { t } from '@lingui/macro'
import { useState } from 'react'
import { Button, Modal } from '@nbit/arco'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import { rateFilter, formatCoinAmount } from '@/helper/assets'
import { CoinAssetsDetailResp } from '@/typings/api/assets/assets'
import Icon from '@/components/icon'
import { YapiGetV1C2CBalanceFastPayDetailData } from '@/typings/yapi/C2cBalanceFastPayDetailV1GetApi'
import styles from './index.module.css'

interface ITotalAssetsProps {
  assetsData: YapiGetV1C2CBalanceFastPayDetailData
}

/** 总资产金额展示 */
function TotalAssets(props: ITotalAssetsProps) {
  const [lockPromptVisible, setLockPromptVisible] = useState(false)
  const {
    totalAmount = 0,
    availableAmount = 0,
    lockAmount = 0,
    symbol = '',
  } = {
    ...props.assetsData,
  }

  const totalAssets = rateFilter({ symbol, amount: totalAmount })

  return (
    <div className={styles.scoped}>
      <div className="detail-total-wrapper">
        <div className="total-title">
          <span>{t`features_assets_main_assets_detail_total_assets_index_2556`}</span>
          <EyesIcon />
        </div>

        <span className="total-num">
          <AssetsEncrypt content={formatCoinAmount(symbol, totalAmount)} />
        </span>
        <span>
          <AssetsEncrypt content={`≈ ${totalAssets}`} />
        </span>
      </div>

      <div className="asset-item-wrap">
        <div className="asset-item">
          <span className="label">{t`assets.common.available_count`}</span>
          <span className="value">
            <AssetsEncrypt content={formatCoinAmount(symbol, availableAmount)} />
          </span>
        </div>
        <div className="asset-item">
          <div className="label">
            {t`features/assets/margin/all/assets-list/index-2`}
            <Icon name="msg" className="msg-icon" onClick={() => setLockPromptVisible(true)} />
          </div>
          <span className="flex value">
            <AssetsEncrypt content={formatCoinAmount(symbol, lockAmount)} />
          </span>
        </div>
      </div>
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
          <p>{t`features_assets_main_assets_detail_total_assets_index_5101068`}</p>
          <p>1. {t`features_assets_main_assets_detail_total_assets_index_5101071`}</p>
          <p>2. {t`features_assets_main_assets_detail_total_assets_index_rjrkwa_psn`}</p>
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
    </div>
  )
}

export { TotalAssets }
