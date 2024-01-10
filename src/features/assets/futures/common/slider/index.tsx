import { Slider } from '@nbit/arco'
import styles from './index.module.css'

function formatTooltip(val) {
  return <span>{val}%</span>
}
export default function SliderBar({ ...props }) {
  return (
    <div className={styles['slider-wrap']}>
      <Slider defaultValue={0} formatTooltip={formatTooltip} {...props} />
    </div>
  )
}
