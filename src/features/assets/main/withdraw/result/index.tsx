/**
 * 提币申请页
 */
import { AssetsRouteEnum, WithDrawTypeEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { Timeline } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { useAssetsStore } from '@/store/assets'
import { formatDate } from '@/helper/date'
import styles from './index.module.css'

function WithdrawResult() {
  const assetsStore = useAssetsStore()
  const TimelineItem = Timeline.Item
  const withdrawInfo = assetsStore.withdrawResult
  const {
    withdrawType = WithDrawTypeEnum.blockChain,
    withdrawAmount = '0.00',
    coinName = '--',
    submitTime = '',
    estimatedFinishTime = '',
  } = withdrawInfo || {}
  const resultText =
    withdrawType === WithDrawTypeEnum.blockChain
      ? t`assets.withdraw.withdrawResultInfo1`
      : t`features_assets_main_withdraw_result_index_2747`
  return (
    <div className={styles.scoped}>
      <div className="withdraw-result">
        <div className="icon-info">
          <Icon isRemoteUrl name="success_icon" />
          <div className="mt-8">{t`features_assets_main_withdraw_result_index_2748`}</div>
        </div>
        <div className="withdraw-count">
          <span>{t`assets.withdraw.withdrawCount`}</span>
          <p>
            {withdrawAmount} {coinName}
          </p>
        </div>
        <Timeline>
          <TimelineItem label={resultText} className="timeline-start">
            {submitTime && formatDate(submitTime)}
          </TimelineItem>
          <TimelineItem label={t`assets.withdraw.withdrawCompleteTime`} className="timeline-end">
            {estimatedFinishTime && formatDate(estimatedFinishTime)}
          </TimelineItem>
        </Timeline>
        <Link className="opt-button" href="/assets/c2c">
          {t`assets.common.goToAssets`}
        </Link>
      </div>
    </div>
  )
}

export function WithdrawResultLayout() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.coins}
      header={<AssetsHeader title={t`features_assets_main_withdraw_result_index_2568`} showRight={false} />}
    >
      <WithdrawResult />
    </AssetsLayout>
  )
}
