import MiniSelect from '@/components/mini-select'
import { Button, DatePicker } from '@nbit/arco'
import { useState } from 'react'
import { TradeOrderTable } from './order-table'

const { RangePicker } = DatePicker

export function TradeFilledOrder() {
  const timeOptions = [
    {
      label: '一天',
      value: 'day',
    },
    {
      label: '一周',
      value: 'week',
    },
    {
      label: '一个月',
      value: 'month',
    },
    {
      label: '三个月',
      value: 'three_month',
    },
  ]

  const [time, setTime] = useState('day')
  const [timeRange, setTimeRange] = useState([] as string[])

  return (
    <div>
      <div className="flex py-2 items-center">
        <MiniSelect
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: 'bl',
          }}
          value={time}
          options={timeOptions}
          onChange={setTime}
        />
        <RangePicker size="mini" className="ml-2 text-xs" value={timeRange} mode="date" onChange={setTimeRange} />

        <div className="ml-2">
          <Button size="mini" type="text">
            查询
          </Button>
          <Button className="ml-2" size="mini">
            重置
          </Button>
        </div>
      </div>
      <TradeOrderTable />
    </div>
  )
}
