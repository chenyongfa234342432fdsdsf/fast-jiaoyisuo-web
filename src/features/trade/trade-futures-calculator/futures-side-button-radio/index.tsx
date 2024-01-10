import classNames from 'classnames'
import styles from './index.module.css'

type ITradeSideSelectProps = {
  value: boolean
  onChange: (value: boolean) => void
  leftText?: string
  rightText?: string
}

function FuturesSideButtonRadio({ value, onChange, leftText, rightText }: ITradeSideSelectProps) {
  const selectBuy = () => {
    onChange(false)
  }

  const selectSell = () => {
    onChange(true)
  }
  return (
    <div className={styles['trade-side-select-wrapper']}>
      <div
        className={classNames('buy', {
          selected: value === false,
        })}
        onClick={selectBuy}
      >
        {leftText}
      </div>
      <div
        className={classNames('sell', {
          selected: value === true,
        })}
        onClick={selectSell}
      >
        {rightText}
      </div>
    </div>
  )
}

export default FuturesSideButtonRadio
