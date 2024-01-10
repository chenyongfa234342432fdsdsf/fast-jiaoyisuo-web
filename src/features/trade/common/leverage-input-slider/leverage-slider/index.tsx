import { Slider } from '@nbit/arco'
import styles from './index.module.css'

function marksFormatter(range) {
  return range.reduce((aggre, curr) => {
    aggre[curr] = `${curr}X`
    return aggre
  }, {})
}

function LeverageSlider({ leverage, onchange, range }) {
  return (
    <Slider
      className={styles.scoped}
      value={leverage}
      max={range[range.length - 1]}
      min={range[0]}
      marks={marksFormatter(range)}
      onChange={val => onchange(val)}
    />
  )
}

export default LeverageSlider
