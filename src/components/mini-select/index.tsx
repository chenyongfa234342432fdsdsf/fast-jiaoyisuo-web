import { Select, SelectProps } from '@nbit/arco'
import classNames from 'classnames'
import { useState } from 'react'
import styles from './index.module.css'
import Icon from '../icon'

export type IMiniSelectProps = Omit<SelectProps, 'options'> & {
  options: {
    value: any
    label: string
    /** 被选中时展示的标签 */
    selectedLabel?: string
  }[]
  inThead?: boolean
  label?: string
}

/**
 * 迷你 select，主要是重新定义了 triggerElement 和下拉样式
 */
function MiniSelect({ value, inThead, label, className, options, ...other }: IMiniSelectProps) {
  const selectedOption = options!.find(option => option.value === value)
  const [opened, setOpened] = useState(false)

  return (
    <div
      className={classNames(styles['mini-select-wrapper'], {
        'in-thead': inThead,
      })}
    >
      <Select
        options={options}
        value={value}
        onVisibleChange={setOpened}
        dropdownMenuClassName={classNames(styles['mini-select-dropdown-menu'], {
          'in-thead': inThead,
        })}
        {...other}
        size="mini"
        triggerElement={
          <div
            className={classNames(styles['trigger-wrapper'], className, {
              opened,
              'in-thead': inThead,
            })}
          >
            <span className="trigger-label">{label || selectedOption?.selectedLabel || selectedOption?.label}</span>
            <div className="trigger-icon ml-2">
              <Icon name="arrow_open" hasTheme />
            </div>
          </div>
        }
      />
    </div>
  )
}

export default MiniSelect
