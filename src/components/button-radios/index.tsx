import classNames from 'classnames'
import styles from './index.module.css'

/** 预设的一些类名 */
export const TradeButtonRadiosPresetClassNames = {
  active: {
    brand: 'text-brand_color bg-brand_color_special_02 border border-solid border-brand_color',
  },
  inActive: {
    sr: 'bg-bg_sr_color text-text_color_02  border border-solid border-bg_sr_color',
    sr1: 'bg-bg_sr_color  border border-solid border-bg_sr_color',
  },
}

export type IButtonRadiosProps<T> = {
  value: T
  options: {
    value: T
    label: string
  }[]
  onChange: (value: T) => void
  activeClassName?: string
  inactiveClassName?: string
  /** 是否有间隙 */
  hasGap?: boolean
  bothClassName?: string
  cancelable?: boolean
}

/** 按钮式单选 */
function ButtonRadios<
  T extends {
    toString(): string
  }
>({
  value,
  hasGap = false,
  options,
  bothClassName = '',
  inactiveClassName,
  onChange,
  activeClassName,
  cancelable,
}: IButtonRadiosProps<T>) {
  return (
    <div
      className={classNames(styles['trade-button-radios'], {
        'has-gap': hasGap,
      })}
    >
      {options.map(option => {
        return (
          <div
            key={option.value?.toString()}
            onClick={() => {
              if (value === option.value) {
                if (cancelable) {
                  onChange('' as any)
                }
                return
              }
              onChange(option.value)
            }}
            className={classNames(
              'radio-item',
              bothClassName,
              value === option.value ? activeClassName : inactiveClassName
            )}
          >
            {option.label}
          </div>
        )
      })}
    </div>
  )
}

export default ButtonRadios
