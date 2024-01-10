import { t } from '@lingui/macro'
import { useState } from 'react'
import { Button, Select, Message } from '@nbit/arco'
import {
  FinancialRecordTypeEnum,
  FinancialRecordTypeMainList,
  FinancialRecordStateList,
  FinancialRecordLogTypeEnum,
} from '@/constants/assets'
import dayjs from 'dayjs'
import { getStoreEnumsToOptions } from '@/helper/assets'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsStore } from '@/store/assets'
import { FuturesHistoryTabEnum } from '@/constants/assets/futures'
import { usePageContext } from '@/hooks/use-page-context'
import styles from '@/features/assets/financial-record/search-form/index.module.css'
import { AssetSelect } from '@/features/assets/common/assets-select'

interface SearchItemProps {
  onSearchFn(val): void
  logType?: string | number
  tabType?: string
  searchParams: any
  coinList: any
}

export function updateActiveSearchParams(tabType, params, searchParams) {
  if (tabType === FuturesHistoryTabEnum.futures) {
    searchParams.futures = params
  } else if (tabType === FuturesHistoryTabEnum.margin) {
    searchParams.margin = params
  }
  return searchParams
}

/** 财务记录搜索 */
export function SearchItem({ onSearchFn, tabType, logType, searchParams, coinList }: SearchItemProps) {
  // let stateList = FinancialRecordStateList  // 本地枚举
  // 获取数据字典的财务记录状态，数据字典不存在时用本地枚举
  const { assetsEnums } = useAssetsStore()
  const pageContext = usePageContext()
  const { groupId, groupName = '' } = pageContext.routeParams
  let stateList = getStoreEnumsToOptions(assetsEnums.financialRecordStateEnum.enums) || FinancialRecordStateList

  let paramsObj = searchParams.futures

  let FinancialRecordTypeList =
    getStoreEnumsToOptions(assetsEnums.financialRecordTypePerpetualList.enums) || FinancialRecordTypeEnum
  if (tabType === FuturesHistoryTabEnum.futures) {
    /** 合约组记录 */
    paramsObj = searchParams.futures
    FinancialRecordTypeList =
      getStoreEnumsToOptions(assetsEnums.financialRecordTypePerpetualList.enums) || FinancialRecordTypeEnum
  } else if (tabType === FuturesHistoryTabEnum.margin) {
    /** 保证金记录 */
    paramsObj = searchParams.margin
    FinancialRecordTypeList =
      getStoreEnumsToOptions(assetsEnums.financialRecordTypeMarginList.enums) || FinancialRecordTypeMainList
  }
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
      logType: FinancialRecordLogTypeEnum.futures,
      pageNum: 1, // 每次搜索，显示第一页数据
      pageSize,
      startDate: new Date(dateTimeArr[0]).getTime(),
      endDate: new Date(dateTimeArr[1]).getTime(),
      groupId,
    }

    if (!coinId) {
      delete params.coinId
    }

    if (!state) {
      delete params.status
    }
    if (!recordType) {
      if (tabType === FuturesHistoryTabEnum.margin) {
        params.type = [FinancialRecordTypeEnum.extractBond, FinancialRecordTypeEnum.rechargeBond] as number[]
      } else {
        delete params.type
      }
    } else {
      params.type = recordType instanceof Array ? recordType : [recordType]
    }

    // 修改当前选中 tab 的接口入参信息
    searchParams = updateActiveSearchParams(logType, params, searchParams)

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
    <div className={styles.scoped}>
      <div className="search-item">
        <div className="mb-filter-block">
          <span className="mr-2.5">{t`features/user/personal-center/menu-navigation/index-1`}</span>
          <AssetSelect
            placeholder={t`features_assets_financial_record_search_form_index_2746`}
            value={selectCoinId}
            onChange={onChangeCoin}
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
                      {getTextFromStoreEnums(option.id, assetsEnums.financialRecordTypeEnum.enums)}
                      {/* {getFinancialRecordTypeEnumName(option.id)} */}
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
                      {/* {getFinancialRecordStateEnumName(+option.id)} */}
                    </Option>
                  )
              )}
          </AssetSelect>
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
