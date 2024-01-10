/**
 * 充值/提币/pay/冲正
 * 冲正只展示创建时间和完成时间
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Message } from '@nbit/arco'
import { useCopyToClipboard } from 'react-use'
import { FinancialRecordTypeEnum, RecordDetailsChannelIdEnum } from '@/constants/assets'
import { useAssetsStore } from '@/store/assets'
import { formatCurrency } from '@/helper/decimal'
import { CreateTimeItem } from '../create-time-item'

export function RechargeInfo() {
  const { financialRecordDetail } = useAssetsStore()
  const {
    typeInd,
    symbol,
    blockTotal,
    confirmation,
    address,
    txHash,
    toUid,
    fromUid,
    amount = 0,
    fee,
    feeCoinName,
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

  const isDepositWithdraw =
    +typeInd === +FinancialRecordTypeEnum.withdraw || +typeInd === +FinancialRecordTypeEnum.deposit

  const formatFeeVal = val => {
    const valStr = val ? `${formatCurrency(val)}` : '--'
    return valStr
  }
  return (
    <>
      {isDepositWithdraw && (
        <div>
          {typeInd === FinancialRecordTypeEnum.deposit &&
            +channelInd === +RecordDetailsChannelIdEnum.platformBlockchain && (
              <div className="detail-item">
                <div className="label">{t`features_assets_financial_record_record_detail_index_5101192`}</div>
                <div className="value">
                  {formatFeeVal(fee)} {feeCoinName || '--'}
                </div>
              </div>
            )}
          <div className="detail-item">
            <div className="label">{t`features_assets_financial_record_record_detail_index_2734`}</div>
            <div className="value">{symbol || '--'}</div>
          </div>
          {+typeInd === +FinancialRecordTypeEnum.withdraw && (
            <div className="detail-item">
              <div className="label">{t`features_assets_financial_record_record_detail_index_2744`}</div>
              <div className="value">
                {formatFeeVal(fee)} {feeCoinName}
              </div>
            </div>
          )}
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
        </div>
      )}

      {typeInd === FinancialRecordTypeEnum.pay && (
        <div className="detail-item">
          <div className="label">
            {amount > 0 ? t`assets.financial-record.fromUID` : t`assets.financial-record.targetUID`}
          </div>
          <div className="value">{amount > 0 ? fromUid || '--' : toUid || '--'}</div>
          <Icon
            name="copy"
            hasTheme
            onClick={() => copyToClipbordFn(amount > 0 ? fromUid : toUid)}
            className="copy-icon"
          />
        </div>
      )}

      <CreateTimeItem cssName="detail-item" />
    </>
  )
}
