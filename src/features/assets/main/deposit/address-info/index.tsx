import { t } from '@lingui/macro'
import { QRCodeCanvas } from 'qrcode.react'
import { useCopyToClipboard } from 'react-use'
import { Message, Tooltip } from '@nbit/arco'
import Icon from '@/components/icon'
import { IDepositAddressResp } from '@/typings/api/assets/assets'
import styles from './index.module.css'

interface IAddressInfoProps {
  addressData: IDepositAddressResp
  coinName: string
}
/**
 * 充值地址信息
 * @param addressData ICoinAddressResp 充值地址、Memo 地址等
 * @returns
 */
export function AddressInfo(props: IAddressInfoProps) {
  const { addressData, coinName } = props
  const { address, memo, depositMinLimit, depositConfirmNum, withdrawConfirmNum, contractInfo } = addressData
  const [state, copyToClipboard] = useCopyToClipboard()
  const onCopyToClipboard = val => {
    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`assets.financial-record.copySuccess`)
  }

  const confirmList = [
    {
      label: t`features_assets_main_deposit_address_info_index_lu11ghg3au`,
      value: depositMinLimit && `${depositMinLimit} ${coinName}`,
    },
    {
      label: t`features_assets_main_deposit_address_info_index_i1tgbsgqhi`,
      value:
        depositConfirmNum && `${depositConfirmNum} ${t`features_assets_main_deposit_address_info_index_q5lhj7qzmz`}`,
    },
    {
      label: t`features_assets_main_deposit_address_info_index_owa1vrgpxa`,
      value:
        withdrawConfirmNum && `${withdrawConfirmNum} ${t`features_assets_main_deposit_address_info_index_q5lhj7qzmz`}`,
    },
    {
      label: t`future.funding-history.title`,
      value: contractInfo && `****${contractInfo.slice(-5)}`,
      showHint: true,
    },
  ]

  return (
    <div className={styles['pay-address']}>
      <div className="pay-qr-code">
        <QRCodeCanvas value={address || ''} width="140" height="140" />
        <div className="pay-tips">
          {t`assets.deposit.DepositTips`} {coinName}
          <br />
          {t`features_assets_main_deposit_address_info_index_i9z_79x1_j`}
        </div>
      </div>
      <div className="assets-label mt-6">{t`assets.deposit.DepositAddress`}</div>
      <div className="address-form">
        <div className="info">{address}</div>
        <Icon
          name="copy"
          hasTheme
          onClick={() => {
            onCopyToClipboard(address)
          }}
          className="copy-icon"
        />
      </div>
      {memo && (
        <>
          <div className="assets-label mt-6">{t`assets.deposit.memoAddress`}</div>
          <div className="address-form">
            <div className="info">{memo}</div>
            <Icon
              name="copy"
              hasTheme
              onClick={() => {
                onCopyToClipboard(memo)
              }}
            />
          </div>
          <div className="warning-info">{t`features_assets_main_deposit_address_info_index_nzb_18tbah`}</div>
        </>
      )}
      <div className="confirm-wrap">
        {confirmList.map((item, i: number) => {
          if (!item.value) return null
          return (
            <div key={i} className="confirm-item">
              <div className="label">
                {item.label}
                {item?.showHint && (
                  <Tooltip content={t`features_assets_main_deposit_address_info_index_pkbvrx_uan`}>
                    <div>
                      <Icon name="msg" hasTheme />
                    </div>
                  </Tooltip>
                )}
              </div>
              <div className="value">{item.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
