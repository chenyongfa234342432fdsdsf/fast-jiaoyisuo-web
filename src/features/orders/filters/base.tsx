import ButtonRadios from '@/components/button-radios'
import Icon from '@/components/icon'
import { getPeriodDayTime, getDayMs } from '@/helper/date'
import { t } from '@lingui/macro'
import { DatePicker, Select } from '@nbit/arco'
import classNames from 'classnames'
import dayjs from 'dayjs'
import styles from './base.module.css'

const { RangePicker } = DatePicker

export type IFiltersProps<T> = {
  onChange: (params: Partial<T>) => any
  params: T
  filterOptions: IOrderFilterOption[]
}

export type IOrderFilterSelectProps = {
  value: any
  label?: string
  options: {
    label: string
    value: any
  }[]
  placeholder?: string
  paramsKey: any
  setParams: (params: any) => void
}
export type IOrderFilterOption = Omit<IOrderFilterSelectProps, 'setParams' | 'value'>
export function OrderFilterSelect({
  label,
  value,
  options,
  placeholder,
  paramsKey,
  setParams,
}: IOrderFilterSelectProps) {
  const onChange = (newValue: any) => {
    setParams({
      [paramsKey]: newValue,
    })
  }

  return (
    <div className={classNames(styles['base-select-wrapper'], 'mb-filter-block')}>
      {label && <span className="mr-6 font-medium">{label}</span>}
      <Select
        className="w-40 newbit-select-custom-style"
        dropdownMenuClassName={styles['base-select-options-wrapper']}
        style={{ width: 160 }}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        arrowIcon={<Icon name="arrow_open" hasTheme className="text-xs scale-75" />}
      >
        {options.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}
enum DateTypeEnum {
  day = 2,
  week = 7,
  month = 30,
  threeMonth = 90,
}
type IPrams = {
  dateType?: string | number
  beginDateNumber?: number
  endDateNumber?: number
}
export function OrderDateFiltersInTable({
  params,
  onChange,
  inTrade,
}: IFiltersProps<IPrams> & {
  inTrade?: boolean
}) {
  const dateTypeList = [
    {
      label: t`features_orders_filters_spot_5101182`,
      value: DateTypeEnum.day,
    },
    {
      label: t`features_orders_filters_spot_5101183`,
      value: DateTypeEnum.week,
    },
    {
      label: t`features_orders_filters_spot_5101184`,
      value: DateTypeEnum.month,
    },
    {
      label: t`features_orders_filters_spot_5101185`,
      value: DateTypeEnum.threeMonth,
    },
  ]
  const onDateTypeChange = (type: any) => {
    if (type === params.dateType) {
      return
    }
    onChange({
      beginDateNumber: getPeriodDayTime(type).start,
      endDateNumber: getPeriodDayTime(type).end,
      dateType: type,
    })
  }
  const onSelectDate = (v: string[]) => {
    onChange({
      beginDateNumber: v[0] ? dayjs(v[0]).toDate().getTime() : undefined,
      endDateNumber: v[1] ? dayjs(v[1]).toDate().getTime() + getDayMs(1) - 1000 : undefined,
      dateType: '',
    })
  }
  const buttonRadiosClassName = classNames('px-2', {
    'py-1 text-xs': inTrade,
    'h-10 text-sm': !inTrade,
  })

  return (
    <>
      <div className="mb-filter-block mr-6">
        <ButtonRadios
          hasGap
          bothClassName={buttonRadiosClassName}
          inactiveClassName="text-text_color_02"
          activeClassName="bg-bg_sr_color text-text_color_01"
          options={dateTypeList}
          onChange={onDateTypeChange}
          value={params.dateType || ''}
        />
      </div>
      <div className="flex items-center mb-filter-block mr-4">
        <span
          className={classNames('mr-3', {
            'text-xs': inTrade,
            'text-sm font-medium': !inTrade,
          })}
        >{t`order.columns.date`}</span>
        <RangePicker
          showTime={{
            format: 'YYYY-MM-DD',
          }}
          className={classNames(styles['date-select-wrapper'], 'newbit-picker-custom-style', {
            'in-trade': inTrade,
          })}
          onClear={() => onSelectDate([])}
          format="YYYY-MM-DD"
          value={[params.beginDateNumber!, params.endDateNumber!]}
          disabledDate={current => current.isBefore(Date.now() - getDayMs(90)) || current.isAfter(Date.now())}
          onOk={onSelectDate}
          triggerProps={{
            className: classNames(styles['date-select-modal-wrapper'], {
              'in-trade': inTrade,
            }),
          }}
        />
      </div>
    </>
  )
}
