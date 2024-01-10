import { C2cMaSimpleSelect } from '@/features/c2c/trade/merchant-apply/common/simple-select'
import { t } from '@lingui/macro'
import { Select } from '@nbit/arco'
import styles from './index.module.css'

type Props = {
  value?: string
  onChange?: (e: string) => void
}

const Option = Select.Option

function C2cMaRelativeSelect(props: Props) {
  const { value, onChange } = props

  const selectList = [
    {
      id: '1',
      title: t`features_c2c_trade_merchant_apply_relatives_select_index_8bn5rk6kpqguzgktyoptt`,
    },

    {
      id: '2',
      title: t`features_c2c_trade_merchant_apply_relatives_select_index_brkhi_hphcfsxhotvthw-`,
    },
    {
      id: '3',
      title: t`features_c2c_trade_merchant_apply_relatives_select_index_sxlrzzo10esj_heuuvhsx`,
    },
    {
      id: '4',
      title: t`constants_assets_index_2560`,
    },
  ]

  const setChangeInput = e => {
    onChange && onChange(e)
  }

  const setSelectList = (list): React.ReactNode => {
    return list?.map(option => (
      <Option key={option.id} value={option.title} extra={option}>
        {/* <img className="select-img" src={option.imgUrl} alt="" /> */}
        <span className="select-text">{option.title}</span>
      </Option>
    ))
  }

  return (
    <div className={styles.scope}>
      <C2cMaSimpleSelect value={value} onChange={setChangeInput}>
        {setSelectList(selectList)}
      </C2cMaSimpleSelect>
    </div>
  )
}

export default C2cMaRelativeSelect
