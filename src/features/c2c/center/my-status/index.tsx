import { memo, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Button, Radio, Message } from '@nbit/arco'

import Icon from '@/components/icon'
import cn from 'classnames'
import dayjs from 'dayjs'
import { fetchC2CSetting, fetchGetC2CSetting } from '@/apis/c2c/center'
import { ChatSettingType } from '@/typings/api/c2c/center'
import { C2cWeekEnum, weekKV } from '@/constants/c2c/center'
import { betweenTimes, diffTimeStamp, weekNow } from '@/helper/c2c/center'
import { ConfirmModal } from '../modal'

import styles from './c2c-center.module.css'
import { BaseTimePicker } from '../timepicker'

enum receiveOrderStatusEnum {
  active = 1, // 可接单
  unActive = 2, // 休息
  system = 3, // 系统判断是否在线
  custom = 4, // 自定时时间段
}

const statusMenu = () => [
  {
    code: receiveOrderStatusEnum.active,
    text: t`features_c2c_center_my_status_index_2222222225101391`,
    subText: t`features_c2c_center_my_status_index_2222222225101392`,
  },
  {
    code: receiveOrderStatusEnum.unActive,
    text: t`features_c2c_center_my_status_index_2222222225101393`,
    subText: t`features_c2c_center_my_status_index_2222222225101394`,
  },
  {
    code: receiveOrderStatusEnum.system,
    text: t`features_c2c_center_my_status_index_2222222225101395`,
    subText: t`features_c2c_center_my_status_index_2222222225101396`,
  },
  {
    code: receiveOrderStatusEnum.custom,
    text: t`features_c2c_center_my_status_index_2222222225101397`,
    subText: '',
    date: [
      { label: t`features_c2c_center_my_status_index_2222222225101398`, value: C2cWeekEnum.Monday },
      { label: t`features_c2c_center_my_status_index_2222222225101399`, value: C2cWeekEnum.Tuesday },
      { label: t`features_c2c_center_my_status_index_2222222225101400`, value: C2cWeekEnum.Wednesday },
      { label: t`features_c2c_center_my_status_index_2222222225101401`, value: C2cWeekEnum.Thursday },
      { label: t`features_c2c_center_my_status_index_2222222225101402`, value: C2cWeekEnum.Friday },
      { label: t`features_c2c_center_my_status_index_2222222225101403`, value: C2cWeekEnum.Saturday },
      { label: t`features_c2c_center_my_status_index_2222222225101404`, value: C2cWeekEnum.Sunday },
    ],
  },
]

const RadioGroup = Radio.Group

type StatusType = {
  touchId: number // 选择的 id
  touchDates: string[] // 选择的星期几 多选
  touchTimes: string[] // 选择的时分
}

enum StatusEnum {
  touchId = 'touchId',
  touchDates = 'touchDates',
  touchTimes = 'touchTimes',
}

function C2CMyStatus() {
  const [visible, setVisible] = useState<boolean>(false)
  const [status, setStatus] = useState<StatusType>({
    touchId: receiveOrderStatusEnum.active,
    touchDates: [],
    touchTimes: ['09:00', '18:00'],
  })
  const [c2cChatSetting, setC2cChatSetting] = useState<ChatSettingType>()

  // get 设置
  const getC2CSetting = async () => {
    const res = await fetchGetC2CSetting({})

    if (res.isOk) {
      const touchId = (res.data || {}).receiveOrderStatus || receiveOrderStatusEnum.active
      setC2cChatSetting({
        ...res.data,
        receiveOrderStatus: touchId,
      })
      const receiveOrderTimeJson = JSON.parse(res.data.receiveOrderTimeJson || '{}')

      setStatus({
        ...status,
        touchId,
        touchDates: (receiveOrderTimeJson.dayInWeek || '').split(','),
        touchTimes: [receiveOrderTimeJson.startTime || '09:00', receiveOrderTimeJson.endTime || '18:00'],
      })
    }
  }

  // post 设置
  const postC2CSetting = async (receiveOrderStatus, receiveOrderTimeJson) => {
    if (receiveOrderStatus === receiveOrderStatusEnum.custom && !status.touchDates.length) {
      Message.error(t`features_kyc_kyc_data_picker_index_5101164`)
      return
    }

    const res = await fetchC2CSetting(
      receiveOrderStatus === receiveOrderStatusEnum.custom
        ? { receiveOrderStatus, receiveOrderTimeJson }
        : { receiveOrderStatus }
    )

    if (res.isOk) {
      getC2CSetting()
      setVisible(false)
    }
  }

  useEffect(() => {
    getC2CSetting()
  }, [])

  const statusOnChange = (k, v) => setStatus({ ...status, [k]: v })

  const timeChange = (index, value) => {
    const touchTimes = [...status.touchTimes] // 将 state 里面的数据解构出来
    touchTimes[index] = value // 覆盖对应的值
    const isUpdate = dayjs(touchTimes[0], 'HH:mm').isAfter(dayjs(touchTimes[1], 'HH:mm')) // 比较前后时间的大小
    if (isUpdate) [touchTimes[0], touchTimes[1]] = [touchTimes[1], touchTimes[0]]
    statusOnChange(StatusEnum.touchTimes, touchTimes)
  }

  const dateChange = (id: string) => {
    const dates = new Set<string>(status.touchDates)

    if (dates.has(id)) {
      dates.delete(id)
    } else {
      dates.add(id)
    }
    dates.delete('') // 默认会带一个空的字符串在里面
    dates.delete(C2cWeekEnum.SundayCopy) // 删除 为星期天 7 的数据 正常日期 value 0:周日

    setStatus({ ...status, touchDates: [...dates] })
  }

  const currStatus = () => {
    const week = weekNow()
    const receiveOrderTimeJson = JSON.parse(c2cChatSetting?.receiveOrderTimeJson ?? '{}')

    if ((receiveOrderTimeJson.dayInWeek || '').split(',').some(date => Number(date) === week)) {
      if (betweenTimes(receiveOrderTimeJson.startTime, receiveOrderTimeJson.endTime)) {
        return <span className="green">{t`features_c2c_center_my_status_index_2222222225101391`}</span>
      }
    }

    return <span className="grey">{t`features_c2c_center_my_status_index_2222222225101393`}</span>
  }

  const displayTime = () => {
    const connectTime = c2cChatSetting?.connectTime || ''

    return diffTimeStamp(connectTime, 'hour') > 24
      ? t`features_c2c_center_my_status_index_ukgwn6hiy6_nn3nuehekp`
      : `${diffTimeStamp(connectTime, 'hour')} h`
  }

  const formatTouchDate = () =>
    status.touchDates.length === 7
      ? t`features_c2c_center_my_status_index_vgoq6fpvw5oxpppghktka`
      : status.touchDates
          .sort((a, b) => (+a < +b ? -1 : 1))
          .map(date => weekKV(date))
          .join(' ')

  return (
    <div className={styles.scope}>
      <div className="c2c-my-status-container">
        <div className="left">
          {t`features_c2c_center_my_status_index_2222222225101414`}
          {c2cChatSetting?.receiveOrderStatus === receiveOrderStatusEnum.active && (
            <span className="green">{t`features_c2c_center_my_status_index_2222222225101391`}</span>
          )}
          {c2cChatSetting?.receiveOrderStatus === receiveOrderStatusEnum.unActive && (
            <span className="grey">{t`features_c2c_center_my_status_index_2222222225101393`}</span>
          )}
          {c2cChatSetting?.receiveOrderStatus === receiveOrderStatusEnum.system && (
            <span className={cn(c2cChatSetting?.online ? 'green' : 'grey')}>
              {c2cChatSetting?.online
                ? t`features_c2c_center_my_status_index_2222222225101391`
                : t`features_c2c_center_my_status_index_2222222225101393`}
            </span>
          )}
          {c2cChatSetting?.receiveOrderStatus === receiveOrderStatusEnum.custom && currStatus()}
        </div>
        <div className="right">
          {c2cChatSetting?.receiveOrderStatus === receiveOrderStatusEnum.system && (
            <div className="text-box">
              {t({
                id: `features_c2c_center_my_status_index_2222222225101415`,
                values: {
                  0: displayTime(),
                },
              })}
            </div>
          )}
          {c2cChatSetting?.receiveOrderStatus === receiveOrderStatusEnum.custom && (
            <div className="text-box">
              {t({
                id: `features_c2c_center_my_status_index_2222222225101416`,
                values: {
                  0: formatTouchDate(),
                  1: status.touchTimes.join('~'),
                },
              })}
            </div>
          )}
          <div className="btn" onClick={() => setVisible(true)}>
            {t`features_c2c_center_my_status_index_2222222225101417`} <Icon name="next_arrow_hover" className="icon" />
          </div>
        </div>
      </div>

      <ConfirmModal
        style={{ width: 444 }}
        visible={visible}
        setVisible={setVisible}
        cancelText={t`trade.c2c.cancel`}
        confirmText={t`user.field.reuse_17`}
        onSubmit={() =>
          postC2CSetting(
            status.touchId,
            JSON.stringify({
              dayInWeek: status.touchDates.join(','),
              startTime: status.touchTimes[0],
              endTime: status.touchTimes[1],
            })
          )
        }
      >
        <div className={styles.modal}>
          <div className="title">{t`features_c2c_center_my_status_index_2222222225101417`}</div>
          <div className="radio-group">
            <RadioGroup defaultValue={status.touchId} onChange={v => statusOnChange('touchId', v)}>
              {statusMenu().map(item => (
                <div className="radio-group-item" key={item.code}>
                  <Radio value={item.code}>{item.text}</Radio>
                  {item.subText && status.touchId === item.code && <div className="tips">{item.subText}</div>}
                  {item.date && status.touchId === item.code && (
                    <div>
                      <div className="text">{t`features_agent_agency_center_revenue_details_index_5101516`}</div>
                      <div className="date">
                        {item.date.map((it, i) => (
                          <Button
                            onClick={() => dateChange(it.value)}
                            className={cn('date-item', {
                              touch: status.touchDates.some(dateIndex => it.value === dateIndex),
                            })}
                            type="primary"
                            key={i}
                          >
                            {it.label}
                          </Button>
                        ))}
                      </div>
                      <div className="time">{t`features_c2c_center_my_status_index_45wr8rfz57xvnlyybphpw`}</div>
                      {visible && (
                        <div className="time-control">
                          <BaseTimePicker
                            value={status.touchTimes[0]}
                            defaultValue={dayjs(status.touchTimes[0], 'HH:mm')}
                            onChange={v => timeChange(0, v)}
                          />
                          <div className="time-control-text">{t`features/assets/saving/history-list/index-0`}</div>
                          <BaseTimePicker
                            value={status.touchTimes[1]}
                            defaultValue={dayjs(status.touchTimes[1], 'HH:mm')}
                            onChange={v => timeChange(1, v)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </ConfirmModal>
    </div>
  )
}

export default memo(C2CMyStatus)
