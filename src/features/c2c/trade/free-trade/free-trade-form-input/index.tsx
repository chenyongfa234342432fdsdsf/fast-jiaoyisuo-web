import { memo } from 'react'
import { t } from '@lingui/macro'
import { Input } from '@nbit/arco'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import { AdvertDirectCds } from '../use-free-trade'
import style from './index.module.css'

type Props = {
  tradeType: string
  value?: string
  onChange?: (item) => void
  placeholder?: string
  handleCoinsType?: YapiPostV1C2CCoinListData
  maxLength?: number
  showBalance: boolean
}

function FreeTradeFormInput(props: Props) {
  const { value, onChange, tradeType, placeholder, handleCoinsType, maxLength, showBalance } = props

  const setBalanceChange = () => {
    onChange && onChange(handleCoinsType?.balance)
  }

  return (
    <div className={style.scope}>
      <Input value={value} className="pr-12" maxLength={maxLength} placeholder={placeholder} onChange={onChange} />
      {tradeType !== AdvertDirectCds.BUY && (
        <div className="flex justify-between mt-0.5">
          <span className="text-text_color_02 text-xs">
            {showBalance && (
              <>
                {t`features_c2c_trade_free_trade_free_trade_form_input_index_mn62lle41xszdjgvdptds`}
                {handleCoinsType?.balance} {handleCoinsType?.coinName}
              </>
            )}
          </span>
          <span className="text-brand_color text-xs cursor-pointer" onClick={setBalanceChange}>
            {t`common.all`}
          </span>
        </div>
      )}
    </div>
  )
}

export default memo(FreeTradeFormInput)
