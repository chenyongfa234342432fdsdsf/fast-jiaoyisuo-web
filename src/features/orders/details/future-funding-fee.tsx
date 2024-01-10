import { formatDate } from '@/helper/date'
import { replaceEmpty } from '@/helper/filters'
import { IFutureFundingFeeLog, IQueryFutureFundingFeeLogDetail } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { ReactNode, useState } from 'react'
import { queryFutureFundingFeeDetail, querySpotNormalOpenOrderDetail } from '@/apis/order'
import { useMount, useRequest } from 'ahooks'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { FeesInFundingDetail, IOrderStatusProps, OrderDetailLayoutProps } from './base'
import styles from './future-funding-fee.module.css'

function getOrderStatusProps(fundingFee: IQueryFutureFundingFeeLogDetail): IOrderStatusProps {
  return {
    no: fundingFee.serialNo?.toString() || '',
    title: t`features_orders_details_future_funding_fee_5101360`,
  }
}
function FundingFeeState({ fundingFee }: { fundingFee: IFutureFundingFeeLog }) {
  const { futuresCurrencySettings } = useAssetsFuturesStore()

  return (
    <div className={styles['funding-fee-state-wrapper']}>
      <div className="order-info success">
        <Icon name="recharge_icon_success" isRemoteUrl className="state-icon" />
        <div className="left">
          <div>{t`constants/assets/common-8`}</div>
          <div className="font-color">{t`assets.enum.tradeRecordStatus.success`}</div>
        </div>
        <div className="right">
          <div>
            {replaceEmpty(fundingFee.symbol)} {t`assets.enum.tradeCoinType.perpetual`}
          </div>
          <IncreaseTag isRound={false} digits={futuresCurrencySettings?.offset} kSign value={fundingFee.amount} />
        </div>
      </div>
    </div>
  )
}

type IFutureFundingFeeDetailProps = {
  children?: ReactNode
  fundingFee: IFutureFundingFeeLog
  visible: boolean
  onClose: () => void
}

export function FutureFundingFeeDetail({ visible, onClose, fundingFee }: IFutureFundingFeeDetailProps) {
  const [fundingFeeDetail, setFundingFeeDetail] = useState<IQueryFutureFundingFeeLogDetail>({} as any)
  const { run, loading } = useRequest(
    async () => {
      const res = await queryFutureFundingFeeDetail({
        fundingRateId: fundingFee.id as any,
        positionId: fundingFee.positionId as any,
      })
      if (!res.isOk || !res.data) {
        return
      }
      setFundingFeeDetail({
        ...res.data,
      } as any)
    },
    {
      manual: true,
    }
  )
  useMount(run)
  const props1 = [
    {
      label: t`features_orders_order_columns_future_5101348`,
      value: replaceEmpty(fundingFeeDetail.groupName),
    },
    {
      label: t`assets.financial-record.creationTime`,
      value: formatDate(fundingFeeDetail.endTime!),
    },
    {
      label: t`features_orders_details_spot_5101080`,
      value: formatDate(fundingFeeDetail.endTime!),
    },
  ]

  return (
    <OrderDetailLayoutProps
      statusProps={getOrderStatusProps(fundingFeeDetail)}
      visible={visible}
      onClose={onClose}
      props1={props1}
      title={t`assets.common.details`}
      props2={[]}
      loading={loading}
      topNode={<FundingFeeState fundingFee={fundingFee} />}
    >
      <div className="py-3">
        <h3 className="font-medium text-base">{t`features_orders_details_future_funding_fee_5101361`}</h3>
      </div>
      <FeesInFundingDetail fees={fundingFeeDetail.fundingRate} />
    </OrderDetailLayoutProps>
  )
}
