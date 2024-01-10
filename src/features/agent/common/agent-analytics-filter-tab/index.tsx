import { HandleDisableEndDate } from '@/features/user/utils/common'
import { formatDatePickerData, formatToDatePicker } from '@/helper/agent'
import { t } from '@lingui/macro'
import { DatePicker, Modal } from '@nbit/arco'
import dayjs from 'dayjs'
import { useState } from 'react'
import AgentPopover from '../agent-popover'
import styles from './index.module.css'

function AgentAnalyticsFilterTab({ tabList, contextStore, value, setValue }) {
  const { chartFilterSetting, setChartFilterSetting } = contextStore()
  const [visible, setvisible] = useState(false)
  const customTime = tabList[tabList.length - 1].value
  const setDisableDate = (currentDate: dayjs.Dayjs) => {
    const endTime = dayjs().endOf('date').valueOf()
    return HandleDisableEndDate(currentDate, endTime)
  }

  const validateDateRange = v => {
    const start = dayjs(v[0])
    const end = dayjs(v[1])

    const limit = end.subtract(1, 'year')

    return start.valueOf() >= limit.valueOf()
  }

  return (
    <div className={styles.scoped}>
      {tabList.map((v, index) => {
        if (index === tabList.length - 1)
          return (
            <AgentPopover
              key={index}
              content={t`features_agent_gains_index_5101567`}
              className={value === v.value ? 'checked' : ''}
              onClick={() => {
                setValue(v.value)
              }}
            >
              {v.text}
            </AgentPopover>
          )
        return (
          <span
            className={value === v.value ? 'checked' : ''}
            key={index}
            onClick={() => {
              setValue(v.value)
            }}
          >
            {v.text}
          </span>
        )
      })}

      <DatePicker.RangePicker
        value={formatToDatePicker(chartFilterSetting)}
        onChange={v => {
          if (validateDateRange(v)) {
            setChartFilterSetting(formatDatePickerData(v))
            setValue(customTime)
          } else setvisible(true)
        }}
        style={{ width: 280 }}
        separator={t`features/assets/saving/history-list/index-0`}
        disabledDate={setDisableDate}
      />
      <Modal className={styles['analytic-modal']} title={'时间筛选器'} visible={visible} onOk={() => setvisible(false)}>
        <span>{t`features_agent_gains_index_5101567`}</span>
      </Modal>
    </div>
  )
}

export default AgentAnalyticsFilterTab
