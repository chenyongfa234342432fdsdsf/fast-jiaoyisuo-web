/**
 * 财务记录详情-c2c
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { formatDate } from '@/helper/date'
import { getTextFromStoreEnums } from '@/helper/store'
import { getUserInfo } from '@/helper/cache'
import { useCopyToClipboard } from 'react-use'
import { Message } from '@nbit/arco'
import { useAssetsStore } from '@/store/assets'
import { FinancialRecordTypeEnum } from '@/constants/assets'
import styles from './index.module.css'

function C2CDetails() {
  const { financialRecordDetail, assetsEnums } = useAssetsStore()
  const {
    typeInd,
    createdByTime = '--',
    updatedByTime = '--',
    typeStr = '',
    orderNumber = '--',
    transferOut = '--',
    transferIn = '--',
    fromUid = '--',
    toUid = '--',
    appealUserName = '--',
    appealReason = '--',
    appealUid = '--',
    otcData,
  } = financialRecordDetail
  const { uid = '' } = getUserInfo()
  const [state, copyToClipboard] = useCopyToClipboard()

  /**
   * 复制
   */
  const onCopy = val => {
    if (!val) {
      return
    }

    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`assets.financial-record.copySuccess`)
  }

  /**
   * 划转至C2C账户/划转至交易账户
   */
  const onRenderTransfer = () => {
    return (
      <div className="transfer-info">
        <div className="info-item">
          <span className="label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_iiyvc-6ttx2dk3xdan4fx`}</span>
          <span className="value">{getTextFromStoreEnums(transferOut, assetsEnums.assetAccountTypeList.enums)}</span>
        </div>

        <div className="info-item">
          <span className="label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_wgmbjln0fuchzi0rjoxhm`}</span>
          <span className="value">{getTextFromStoreEnums(transferIn, assetsEnums.assetAccountTypeList.enums)}</span>
        </div>

        <div className="info-item">
          <span className="label">{t`assets.financial-record.creationTime`}</span>
          <span className="value">{formatDate(createdByTime)}</span>
        </div>

        <div className="info-item">
          <span className="label">{t`assets.financial-record.completionTime`}</span>
          <span className="value">{formatDate(updatedByTime)}</span>
        </div>
      </div>
    )
  }

  /**
   * Pay-转入C2C账户/Pay-转出C2C账户/C2C赔付/
   */
  const onRenderSell = () => {
    const isMe = Number(uid) === Number(appealUid)
    const isForm = Number(uid) === Number(fromUid)
    const UidVal = isForm ? toUid : fromUid
    return (
      <div className="sell-info">
        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label">
              {isForm
                ? t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_vwek_kvk_pj8rf6pim1sp`
                : t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_0a2yq8kjg6-38nrxl0fop`}
              UID
            </span>
            <span className="value">{UidVal || '--'}</span>
          </div>

          <Icon name="copy" hasTheme className="text-base" onClick={() => onCopy(UidVal)} />
        </div>

        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_yvyclpqawohpw475sxvgd`}</span>
            <span className="value">{getTextFromStoreEnums(typeStr, assetsEnums.c2cBillLogTypeList.enums)}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_flbmtloamvqed3vejwwfk`}</span>
            <span className="value">{orderNumber}</span>
          </div>

          <Icon name="copy" hasTheme className="text-base" onClick={() => onCopy(orderNumber)} />
        </div>

        {(typeInd === FinancialRecordTypeEnum.c2cCompensate || typeInd === FinancialRecordTypeEnum.spotCompensate) && (
          <>
            <div className="info-item">
              <div className="info-item-left">
                <span className="label sell-label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_20jbzmmaxw-v1g_btnu2z`}</span>
                <span className="value">
                  {appealUserName || appealUid || '--'}
                  {isMe &&
                    t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_jn0ui2lucljaadifwrrgp`}
                </span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-item-left">
                <span className="label sell-label">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_0hra3fu60drpmz2nox5mw`}</span>
                <span className="value">
                  {getTextFromStoreEnums(appealReason, assetsEnums.c2cOrderAppealReason.enums)}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label">{t`assets.financial-record.creationTime`}</span>
            <span className="value">{formatDate(createdByTime)}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label">{t`assets.financial-record.completionTime`}</span>
            <span className="value">{formatDate(updatedByTime)}</span>
          </div>
        </div>
      </div>
    )
  }

  /**
   * 第三方划转
   */
  const onRenderThirdPartyTransfer = () => {
    return (
      <div className="transfer-info">
        <div className="info-item">
          <span className="label">{t`features_assets_financial_record_record_detail_index_2734`}</span>
          <span className="value">{otcData?.symbol}</span>
        </div>

        <div className="info-item">
          <span className="label">{t`assets.financial-record.blockNumber`}</span>
          <span className="value">
            {otcData?.confirmation} / {otcData?.blockTotal}
          </span>
        </div>

        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label-adress inline-block">{t`assets.withdraw.withdrawAddress`}</span>
            <span className="w-3/4 inline-block break-words">{otcData?.address}</span>
          </div>
          <Icon name="copy" hasTheme className="text-base" onClick={() => onCopy(otcData?.address)} />
        </div>

        <div className="info-item">
          <div className="info-item-left">
            <span className="label sell-label-adress inline-block">{t`assets.financial-record.tradeHash`}</span>
            <span className="w-3/4 inline-block break-words">{otcData?.txHash}</span>
          </div>
          <Icon name="copy" hasTheme className="text-base" onClick={() => onCopy(otcData?.txHash)} />
        </div>

        <div className="info-item">
          <span className="label">{t`assets.financial-record.creationTime`}</span>
          <span className="value">{formatDate(createdByTime)}</span>
        </div>

        <div className="info-item">
          <span className="label">{t`assets.financial-record.completionTime`}</span>
          <span className="value">{formatDate(updatedByTime)}</span>
        </div>
      </div>
    )
  }

  const showFinancialComponent = {
    [FinancialRecordTypeEnum.c2cTransfer]: onRenderTransfer(),
    [FinancialRecordTypeEnum.spotTransfer]: onRenderTransfer(),
    [FinancialRecordTypeEnum.thirdPartyExtractBuy]: onRenderThirdPartyTransfer(),
    [FinancialRecordTypeEnum.thirdPartyExtractSell]: onRenderThirdPartyTransfer(),
  }

  return (
    <div className={styles['c2c-details-root']}>
      {showFinancialComponent?.[typeInd] ? showFinancialComponent?.[typeInd] : onRenderSell()}
    </div>
  )
}

export { C2CDetails }
