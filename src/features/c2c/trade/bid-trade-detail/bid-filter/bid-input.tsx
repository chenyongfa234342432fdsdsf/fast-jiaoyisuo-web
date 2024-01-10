import { t } from '@lingui/macro'
import { InputNumber } from '@nbit/arco'

interface Props {
  value?: any
  onChange?: (e: string) => void
  name?: string
  minAmount?: string
  maxAmount?: string
  placeholder?: string
}
function BidInput(props: Props) {
  const { name, minAmount, maxAmount, placeholder } = props

  const onChange = e => {
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <>
      <InputNumber
        value={props.value}
        onChange={onChange}
        min={0}
        defaultValue={undefined}
        suffix={<div className="text-text_color_01">{name}</div>}
        placeholder={placeholder}
        hideControl
        className={'bg-bg_sr_color h-10 text-sm font-normal'}
      />
      {props.value && (
        <div className="filter-limit">
          <span>
            {t`features_c2c_advertise_advertise_history_record_list_index_-u1_sqw2sq21br1ynkqun`} &nbsp; &nbsp;
          </span>
          <span>
            {minAmount}-{maxAmount}
            &nbsp;{name}
          </span>
        </div>
      )}
    </>
  )
}

export default BidInput
