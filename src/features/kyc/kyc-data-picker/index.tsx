import { DatePicker, Checkbox } from '@nbit/arco'
import { useState, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { t } from '@lingui/macro'
import style from './index.module.css'

type DataDetail = {
  certValidDateStart: Dayjs | string
  certValidDateEnd: Dayjs | string
  certIsPermanent: number
}

type Props = {
  value?: DataDetail
  onChange?: (e: DataDetail) => void
  birthDay?: string
}

function KycDataPicker(props: Props) {
  const { value, onChange, birthDay } = props

  const [endDatePlaceholder, setEndDatePlaceholder] = useState<string>(t`features_kyc_kyc_data_picker_index_5101164`)

  const setCheckboxChange = e => {
    if (onChange && value) {
      onChange({ ...value, certValidDateEnd: '', certIsPermanent: e ? 1 : 2 })
    }
  }

  const setChangeStartDate = e => {
    if (onChange && value) {
      onChange({ ...value, certValidDateStart: e })
    }
  }

  const setChanEndDate = e => {
    if (onChange && value) {
      onChange({ ...value, certValidDateEnd: e })
    }
  }

  useEffect(() => {
    if (value?.certIsPermanent === 1) {
      setEndDatePlaceholder('-')
    } else {
      setEndDatePlaceholder(t`features_kyc_kyc_data_picker_index_5101164`)
    }

    if (dayjs(birthDay).valueOf() > dayjs(value?.certValidDateStart).valueOf() && value && birthDay) {
      onChange && onChange({ ...value, certValidDateStart: '' })
    }

    if (dayjs(birthDay).valueOf() > dayjs(value?.certValidDateEnd).valueOf() && value && birthDay) {
      onChange && onChange({ ...value, certValidDateEnd: '' })
    }
  }, [value, birthDay])

  return (
    <div className={style.scoped}>
      <div className="kyc-data-picker">
        <DatePicker
          disabledDate={current =>
            (birthDay && current.isBefore(dayjs(birthDay))) ||
            current.isAfter(value?.certValidDateEnd) ||
            current.isAfter(dayjs())
          }
          onChange={setChangeStartDate}
          placeholder={t`features_kyc_kyc_data_picker_index_5101164`}
          value={value?.certValidDateStart}
        />
        <span className="kyc-interval">~</span>
        <DatePicker
          disabledDate={current =>
            (birthDay && current.isBefore(dayjs(birthDay))) || current.isBefore(value?.certValidDateStart)
          }
          disabled={value?.certIsPermanent === 1}
          value={value?.certValidDateEnd}
          onChange={setChanEndDate}
          placeholder={endDatePlaceholder}
        />
        <div className="kyc-data-checkbox">
          <Checkbox checked={value?.certIsPermanent === 1} onChange={setCheckboxChange}>
            {t`features_kyc_kyc_data_picker_index_2667`}
          </Checkbox>
        </div>
      </div>
    </div>
  )
}

export default KycDataPicker
