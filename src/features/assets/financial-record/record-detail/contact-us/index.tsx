/**
 * 财务记录详情 - 联系客服
 */
import { FinancialRecordTypeEnum } from '@/constants/assets'
import { useCopyToClipboard } from 'react-use'
import { t } from '@lingui/macro'
import { Message } from '@nbit/arco'

export default function ContactItem({ address, type }: { address: string; type: any }) {
  const [state, copyToClipboard] = useCopyToClipboard()
  const copyToClipbordFn = val => {
    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`features_assets_financial_record_record_detail_index_2745`)
  }
  // 只有充币才展示联系客服文案
  if (type === FinancialRecordTypeEnum.deposit) {
    // 复制地址及交易哈希，进入客服系统 - 要产品提供客服系统地址，复制的拼接规范：地址_交易哈希
    return (
      <div className="reminder" onClick={() => copyToClipbordFn(address)}>
        {t`assets.financial-record.contact`}
      </div>
    )
  }
  return null
}
