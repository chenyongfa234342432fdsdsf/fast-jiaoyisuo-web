import { Checkbox } from '@nbit/arco'
import Icon from '../../../../../components/icon'

interface Props {
  selected?: boolean
  onChange?: (e: string) => void
  title?: string
}

function BidCheckBox(props: Props) {
  const { selected, title } = props

  const onChange = e => {
    if (props.onChange) {
      props.onChange(e)
    }
  }
  return (
    <div className="flex items-center ">
      <Checkbox checked={selected} onChange={onChange}>
        {({ checked }) => {
          return checked ? <Icon name="login_verify_selected" /> : <Icon name="login_verify_unselected" hasTheme />
        }}
      </Checkbox>
      <div
        style={{
          fontSize: '14px',
          lineHeight: '24px',
          fontWeight: '400',
          color: '#7F7F81',
          marginLeft: '4px',
        }}
      >
        {title}
      </div>
    </div>
  )
}

export default BidCheckBox
