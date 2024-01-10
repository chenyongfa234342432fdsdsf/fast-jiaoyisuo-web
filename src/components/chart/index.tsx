import React from 'react'
import { useCommonStore } from '@/store/common'
import KLine from './chart'
import styles from './index.module.css'

export interface SeriesChartData {
  time: number // 13 位时间戳
  value: number
  [key: string]: any
}

const initialData: Array<SeriesChartData> = [
  { value: 11, time: 1659411240000 },
  { value: 2, time: 1659411300000 },
  { value: -1.1, time: 1659411360000 },
  { value: -1.2, time: 1659411420000 },
  { value: -1.3, time: 1659411480000 },
  { value: 0.4, time: 1659411540000 },
  { value: 0.6, time: 1659411600000 },
  { value: 1.2, time: 1659411660000 },
  { value: -1.5, time: 1659411720000 },
  { value: -1.7, time: 1659411780000 },
]

export interface KLineChartData {
  time: number
  open: number
  high: number
  low: number
  close: number
  [key: string]: any
}

export enum TimeSharingType {
  Min = 'min',
  Hour = 'hour',
  Week = 'week',
  Mon = 'mon',
}

export interface SwitchTimeType {
  unit: string
  value: string | number
}

enum KLineChartType {
  Quote = 'quote',
  ContractFunding = 'contractFunding',
  Futures = 'futures',
}

// k 线数据
const initialData1: Array<KLineChartData> = [
  { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1659411240000 },
  { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1659411300000 },
  { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1659411360000 },
  { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1659411420000 },
  { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1659411480000 },
  { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1659411540000 },
  { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1659411600000 },
  { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1659411660000 },
  { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1659411720000 },
  { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1659411780000 },
]

interface ChartSummaryType {
  type: KLineChartType
}

function ChartSummary(props: ChartSummaryType) {
  const commonState = useCommonStore()

  return (
    <div className={`${styles.scoped}`}>
      <KLine kLineChartData={initialData1} theme={commonState.theme} type={props.type} />
    </div>
  )
}

export default ChartSummary
