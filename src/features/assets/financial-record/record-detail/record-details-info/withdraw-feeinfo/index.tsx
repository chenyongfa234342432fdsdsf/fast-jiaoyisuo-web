/**
 * 提币手续费&其他手续费
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { FinancialRecordTypeEnum, RecordDetailsChannelIdEnum } from '@/constants/assets'
import { Message } from '@nbit/arco'
import { useCopyToClipboard } from 'react-use'
import { useAssetsStore } from '@/store/assets'
import { formatCurrency } from '@nbit/utils/lib/decimal'
import { CreateTimeItem } from '../create-time-item'

export function WithdrawFeeInfo() {
  const { financialRecordDetail } = useAssetsStore()
  const {
    typeInd,
    blockTotal,
    confirmation,
    address,
    txHash,
    fee,
    feeCoinName,
    mainnet,
    channelInd = '',
  } = financialRecordDetail
  // 是否需要展示区块确认数，不需要则展示--
  const isNoConfirmation = +channelInd === +RecordDetailsChannelIdEnum.platformBlockchain || !txHash
  const [state, copyToClipboard] = useCopyToClipboard()
  /**
   * 复制
   */
  const copyToClipbordFn = val => {
    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`assets.financial-record.copySuccess`)
  }

  const getAddressText = () => {
    if (typeInd === FinancialRecordTypeEnum.withdraw) {
      return t`assets.withdraw.withdrawAddress`
    }
    if (typeInd === FinancialRecordTypeEnum.deposit) {
      return t`features_assets_financial_record_record_detail_index_5101065`
    }
    return t`assets.financial-record.address`
  }

  const formatFeeVal = val => {
    const valStr = val ? `${formatCurrency(val)}` : '--'
    return valStr
  }
  return (
    <div>
      <div className="detail-item">
        <div className="label">{t`features_assets_financial_record_record_detail_index_2734`}</div>
        <div className="value">{mainnet || '--'}</div>
      </div>
      <div className="detail-item">
        <div className="label">{t`features_assets_financial_record_record_detail_index_2744`}</div>
        <div className="value">{`${formatFeeVal(fee)} ${feeCoinName || '--'}`}</div>
      </div>
      <div className="detail-item">
        <div className="label">{t`assets.financial-record.blockNumber`}</div>
        <div className="value">{isNoConfirmation ? '--' : `${blockTotal} / ${confirmation}`}</div>
      </div>
      <div className="detail-item">
        <div className="label">{getAddressText()}</div>
        <div className="value">{address || '--'}</div>
        {address && <Icon name="copy" hasTheme onClick={() => copyToClipbordFn(address)} className="copy-icon" />}
      </div>
      <div className="detail-item">
        <div className="label">{t`assets.financial-record.tradeHash`}</div>
        <div className="value">{txHash || '--'}</div>
        {txHash && <Icon name="copy" hasTheme onClick={() => copyToClipbordFn(txHash)} className="copy-icon" />}
      </div>
      <CreateTimeItem cssName="detail-item" />
    </div>
  )
}
