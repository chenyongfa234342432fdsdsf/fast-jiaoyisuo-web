import { Input, Popover, TriggerProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useDebounce } from 'ahooks'
import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { NoDataElement } from '@/features/orders/order-table-layout'
import Icon from '../icon'
import styles from './index.module.css'

export type IPopupSearchSelectProps<T> = {
  value: any
  onChange: (value: any, option?: T) => void
  options: T[]
  searchPlaceHolder?: string
  onSearch?: (keyword: string) => Promise<T[]> | T[]
  selector?: (option?: T) => ReactNode
  className?: string
  labelClassName?: string
  popupClassName?: string
  triggerProps?: Partial<TriggerProps>
  noBorder?: boolean
  size?: 'large' | 'default'
  bgTransparent?: boolean
}

/** 带悬浮搜索框的选择器 */
function PopupSearchSelect<
  T extends {
    value: any
    label: ReactNode
    name?: string
    [key: string]: any
  }
>({
  onChange,
  selector,
  searchPlaceHolder = t`future.funding-history.search-future`,
  options,
  value,
  onSearch,
  bgTransparent = false,
  className = 'h-10',
  popupClassName,
  labelClassName,
  noBorder = false,
  triggerProps = {},
  size = 'large',
}: IPopupSearchSelectProps<T>) {
  const [popupVisible, setPopupVisible] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const debouncedSearchKey = useDebounce(searchKey, {
    wait: 300,
  })
  const displayList = onSearch
    ? options
    : options.filter(item => {
        if (!item?.name || !debouncedSearchKey) {
          return true
        }
        const ignoreCaseKey = debouncedSearchKey.toUpperCase()
        return item.name.toUpperCase().includes(ignoreCaseKey)
      })
  useEffect(() => {
    onSearch?.(searchKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchKey])
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setSearchKey('')
    // 自动聚焦会有滚动问题
    if (inputWrapperRef.current) {
      inputWrapperRef.current.querySelector('input')?.focus({
        preventScroll: true,
      })
    }
  }, [popupVisible])
  const selectedOption = options.find(option => option.value === value)
  const selectorRef = useRef<HTMLDivElement>(null)
  const popoverContent = (
    <div
      className={classNames(styles['popup-search-select-wrapper'], 'scrollbar-custom', size, popupClassName)}
      style={{
        minWidth: selectorRef.current?.offsetWidth,
      }}
    >
      <div className="search-box" ref={inputWrapperRef}>
        <Input
          placeholder={searchPlaceHolder}
          value={searchKey}
          allowClear
          className="newbit-input-custom-style"
          prefix={
            <Icon
              hasTheme
              name="search"
              noPointer
              className={classNames('text-icon_color', {
                'text-sm': size === 'large',
                'text-xs': size === 'default',
              })}
            />
          }
          onChange={setSearchKey}
        />
      </div>
      <div className="list-wrapper">
        {displayList.map(option => {
          const isSelected = value === option.value
          return (
            <div
              onClick={() => {
                setPopupVisible(false)
                if (isSelected) {
                  return
                }
                onChange(option.value, option)
              }}
              className={classNames('option-item', {
                'is-selected': isSelected,
              })}
              key={option.value}
            >
              {option.label}
            </div>
          )
        })}
        {displayList.length === 0 && <NoDataElement needLogin={false} />}
      </div>
    </div>
  )

  return (
    <div>
      <Popover
        position="bl"
        trigger={'click'}
        className={styles['popup-outer']}
        triggerProps={{
          showArrow: false,
          ...triggerProps,
        }}
        onVisibleChange={setPopupVisible}
        popupVisible={popupVisible}
        content={popoverContent}
      >
        <div
          ref={selectorRef}
          className={classNames(
            styles['search-select-wrapper'],
            {
              'no-border': noBorder,
              'focused': popupVisible,
              'transparent': bgTransparent,
            },
            className
          )}
          onClick={() => setPopupVisible(true)}
        >
          <div className={classNames('flex flex-1 justify-between items-center', labelClassName)}>
            {selector ? selector(selectedOption) : <span>{selectedOption?.label}</span>}
            <Icon hasTheme name={!popupVisible ? 'arrow_open' : 'arrow_close'} className="ml-2 text-xs scale-75" />
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default PopupSearchSelect
