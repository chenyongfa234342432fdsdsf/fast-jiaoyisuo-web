import { t } from '@lingui/macro'
import { useState, useRef } from 'react'
import { Button, Select, Message, DatePicker } from '@nbit/arco'
import { FinancialRecordTypeEnum, FinancialRecordStateList } from '@/constants/assets'
import dayjs from 'dayjs'
import { getStoreEnumsToOptions } from '@/helper/assets'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsStore } from '@/store/assets'
import styles from '@/features/assets/financial-record/search-form/index.module.css'
import { AssetSelect } from '@/features/assets/common/assets-select'

interface SearchItemProps {
  onSearchFn(val): void
  logType?: string | number
  tabType?: string
  searchParams: any
  coinList: any
}

/** 财务记录搜索 */
export function SearchItem({ onSearchFn, searchParams, coinList }: SearchItemProps) {
  const { RangePicker } = DatePicker

  // 获取数据字典的财务记录状态，数据字典不存在时用本地枚举
  const { assetsEnums } = useAssetsStore()

  const refSelect = useRef<HTMLDivElement>(null)
  let stateList = getStoreEnumsToOptions(assetsEnums.financialRecordStateEnum.enums) || FinancialRecordStateList

  let paramsObj = searchParams

  const FinancialRecordTypeList = getStoreEnumsToOptions(assetsEnums.walletFinancialRecordTypeEnum.enums)
  const { coinId, status, type, startDate, endDate, pageNum, pageSize } = paramsObj
  const Option = Select.Option
  // 默认查最近三个月数据
  // const defaultDate = [dayjs().subtract(3, 'month').format('YYYY-MM-DD'), dayjs()]
  // 默认查最近一周数据
  const defaultDate = [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  const [dateTimeArr, setDateTimeArr] = useState<any>([dayjs(startDate), dayjs(endDate)])

  const [selectCoinId, setSelectCoinId] = useState(coinId || '')
  const [recordType, setRecordType] = useState<any>(type || '')
  const [state, setState] = useState(status || '')

  // 后面要调接口拿搜索结果，模拟假数据
  const onSearch = () => {
    const params = {
      type: recordType as any,
      coinId: selectCoinId,
      status: [state] as any,
      pageNum: 1, // 每次搜索，显示第一页数据
      pageSize,
      startDate: new Date(dateTimeArr[0]).getTime(),
      endDate: new Date(dateTimeArr[1]).getTime(),
    }

    if (!coinId) {
      delete params.coinId
    }

    if (!state) {
      delete params.status
    }
    if (!recordType) {
      params.type = assetsEnums.walletFinancialRecordTypeEnum.enums.map(item => item.value as number)
    } else {
      params.type = recordType instanceof Array ? recordType : [recordType]
    }

    // 修改当前选中 tab 的接口入参信息
    searchParams = params

    onSearchFn(searchParams)
  }

  const onChangeCoin = val => {
    setSelectCoinId(val)
  }

  const onChangeType = val => {
    setRecordType(val)
  }

  const onChangeState = val => {
    setState(val)
  }

  /** 重置 */
  const onReset = () => {
    setSelectCoinId('')
    setRecordType(undefined)
    setState(undefined)
    setDateTimeArr(defaultDate)

    Message.success(t`assets.financial-record.search.resetRemind`)
  }

  return (
    <div className={styles.scoped} ref={refSelect}>
      <div className="search-item">
        <div className="mb-filter-block">
          <span className="mr-2.5">{t`features/user/personal-center/menu-navigation/index-1`}</span>
          <AssetSelect
            placeholder={t`features_assets_financial_record_search_form_index_2746`}
            value={selectCoinId}
            onChange={onChangeCoin}
            getPopupContainer={() => refSelect.current as Element}
            showSearch
            filterOption={(inputValue, option) =>
              option.props.coinName?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
              option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
            }
          >
            <Option key="all" value="">
              {t`common.all`}
            </Option>
            {coinList &&
              coinList.map(
                option =>
                  option && (
                    <Option key={`coin_${option.id}`} value={option.id}>
                      {option.coinName}
                    </Option>
                  )
              )}
          </AssetSelect>
        </div>
        <div className="mb-filter-block">
          <span className="label-name">{t`order.columns.type`}</span>
          <AssetSelect
            value={recordType instanceof Array && recordType.length > 0 ? '' : recordType}
            onChange={onChangeType}
          >
            <Option key="all" value="">
              {t`common.all`}
            </Option>
            {FinancialRecordTypeList &&
              FinancialRecordTypeList.map(
                option =>
                  option && (
                    <Option key={`type_${option.id}`} value={option.id}>
                      {option.value}
                    </Option>
                  )
              )}
          </AssetSelect>
        </div>
        <div className="mb-filter-block">
          <span className="label-name">{t`order.columns.status`}</span>
          <AssetSelect value={state} onChange={onChangeState}>
            <Option key="all" value="">
              {t`common.all`}
            </Option>
            {stateList &&
              stateList.map(
                option =>
                  option && (
                    <Option key={`state_${option.id}`} value={option.id}>
                      {getTextFromStoreEnums(option.id, assetsEnums.financialRecordStateEnum.enums)}
                    </Option>
                  )
              )}
          </AssetSelect>
        </div>
        <div className="mb-filter-block">
          <span className="label-name">{t`assets.financial-record.search.time`}</span>
          <RangePicker
            style={{ width: 240, height: 40 }}
            showTime
            defaultValue={defaultDate}
            value={dateTimeArr}
            format="YYYY-MM-DD"
            onOk={(valueString, value) => {
              setDateTimeArr(value)
            }}
            onSelect={(valueString, value) => {
              setDateTimeArr(value)
            }}
            disabledDate={current =>
              current.isAfter(dayjs()) || current.isBefore(dayjs().subtract(90, 'day').format('YYYY-MM-DD'))
            }
            clearRangeOnReselect
            allowClear={false}
          />
        </div>
        <div className="mb-filter-block">
          <Button
            className={'mr-4'}
            type="primary"
            onClick={() => onSearch()}
          >{t`assets.financial-record.search.search`}</Button>
          <Button onClick={() => onReset()}>{t`assets.financial-record.search.reset`}</Button>
        </div>
      </div>
    </div>
  )
}
