import { useState, useEffect } from 'react'
import { Button, Message } from '@nbit/arco'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { postSettingCoinPush, getCoinPushStatus } from '@/apis/assets/common'
import { CoinListTypeEnum, CoinStateEnum } from '@/constants/assets'
import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

/**
 * 充提暂停状态
 * @param param0 类型 type 1、充值 2、提现
 * @returns
 */
function NetworkStopService({ coinId, type }: { coinId: any; type: CoinListTypeEnum | undefined }) {
  const [remindState, setRemindState] = useState(false)

  /**
   * 设置提醒
   */
  const setRemind = async () => {
    const res = await postSettingCoinPush({
      coinId,
      type: Number(type), // type 1、充值 2、提现
      status: CoinStateEnum.open, // 状态 1、开启 2、关闭
    })

    const { isOk, message = '' } = res || {}

    if (!isOk) {
      // Message.error(message)
      return
    }

    setRemindState(true)
    Message.success(t`assets.deposit.reminderSuccessful`)
  }

  /**
   * 获取币种开启充提推送状态
   */
  const onLoadCoinStatus = async () => {
    if (!coinId) return
    const res = await getCoinPushStatus({
      coinId,
      type: Number(type), // type 1、充值 2、提现
    })

    const { isOk, data: { isOpen = false } = {}, message = '' } = res || {}

    if (!isOk) {
      // Message.error(message)
      return
    }

    setRemindState(isOpen)
  }

  useEffect(() => {
    onLoadCoinStatus()
  }, [coinId])

  return (
    <div className={styles.scoped}>
      <LazyImage
        className="stop-service-icon"
        src={`${oss_svg_image_domain_address}asset_recharge_pause`}
        whetherPlaceholdImg={false}
        imageType={Type.png}
        hasTheme
      />
      {/* <Icon className="stop-service-icon" name="asset_recharge_pause" isRemoteUrl hasTheme /> */}
      <div className="stop-service-tips">
        {type === CoinListTypeEnum.deposit
          ? t`assets.deposit.stopTips`
          : t`features_assets_common_network_stop_service_index_vvam6yw9hl`}
      </div>
      <div className="flex justify-between">
        {type === CoinListTypeEnum.deposit && (
          <Link className="opt-button-gray mr-8" href="/assets/main">{t`assets.deposit.goBackAssets`}</Link>
        )}
        {!remindState ? (
          <Button
            disabled={remindState}
            className="opt-btn"
            type="primary"
            onClick={() => {
              setRemind()
            }}
          >
            {t`assets.deposit.setReminder`}
          </Button>
        ) : (
          <Button disabled={remindState} className="opt-btn">
            {t`assets.deposit.setRemindered`}
          </Button>
        )}
      </div>
    </div>
  )
}

export default NetworkStopService
