import { useEffect, useRef, useState } from 'react'
import { DatePicker } from '@nbit/arco'
import { ResponsivePie } from '@nivo/pie'
import { t } from '@lingui/macro'
import { getRebateInfoHistoryOverview } from '@/apis/agent/agency-center'
import { HandleDisableEndDate } from '@/features/user/utils/common'
import { agentModuleRoutes } from '@/constants/agent'
import { formatNumberDecimal } from '@/helper/decimal'
import { AgencyCenterOverviewResp } from '@/typings/api/agent/agency-center'
import { AgentInviteQueryMaxResp } from '@/typings/api/agent/manage'
import dayjs from 'dayjs'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { useRequest } from 'ahooks'

const DatePickerRangePicker = DatePicker.RangePicker

enum DataOverviewTabType {
  custom = 0, // 自定义时间
  all, // 全部时间
  day, // 今日
  week, // 本周
  month, // 本月
}

enum NoDataEnum {
  zero = 0, // 无数据默认值
}

type rebateChartDataType = {
  id: number
  label: string
  value: number
  color: string
}

type dataOverviewTabType = {
  text: string
  value: number
  starTime: number
  endTime: number
}

type rebateObjType = {
  spot: string | number
  contract: string | number
  borrowCoin: string | number
}

interface stateType {
  rebateChartData: Array<rebateChartDataType> // 饼图数据
  totalIncome: number | string // 总收益
  totalNum: number // 伞下总数
  invitedNum: number // 邀请数
}

const totalIncomeDefault = '0.00000000' // 收益默认值
const precisionDefault = 8 // 精度 8 位
const hiddenSymbols = '******' // 隐藏星号

function AgencyCenteDataOverview({ rebateCanbeSetData }: { rebateCanbeSetData: AgentInviteQueryMaxResp }) {
  const [selectTime, setSelectTime] = useState<number>(DataOverviewTabType.all)
  const [state, setState] = useState<stateType>({
    rebateChartData: [],
    totalIncome: totalIncomeDefault,
    totalNum: 0,
    invitedNum: 0,
  })

  const dataCache = useRef<AgencyCenterOverviewResp>()
  const showIncome = useRef<boolean>(true)

  const dataOverviewTab = [
    {
      text: t`features_agent_agency_center_data_overview_index_5101502`,
      value: DataOverviewTabType.all,
      starTime: 0,
      endTime: 0,
    },
    {
      text: t`features_agent_agency_center_data_overview_index_5101503`,
      value: DataOverviewTabType.day,
      starTime: dayjs().startOf('date').valueOf(),
      endTime: dayjs().endOf('date').valueOf(),
    },
    {
      text: t`features_agent_agency_center_data_overview_index_5101504`,
      value: DataOverviewTabType.week,
      starTime: dayjs().startOf('week').add(1, 'day').valueOf(),
      endTime: dayjs().endOf('week').add(1, 'day').valueOf(),
    },
    {
      text: t`features/assets/saving/totalAssets/index-8`,
      value: DataOverviewTabType.month,
      starTime: dayjs().startOf('month').valueOf(),
      endTime: dayjs().endOf('month').valueOf(),
    },
  ]

  /** 处理饼图默认数据 */
  const handleDefaultData = (frenchCurrency: string, rebateObj: rebateObjType, noData: boolean) => {
    const spot = rebateCanbeSetData?.spot
      ? {
          id: 1,

          label: `${t`features_agent_index_5101361`}${frenchCurrency} ${
            showIncome.current ? rebateObj.spot : hiddenSymbols
          }`,

          value: noData ? 100 : rebateObj.spot,

          color: '#FF7E77',
        }
      : null

    const contract = rebateCanbeSetData?.contract
      ? {
          id: 2,

          label: `${t`features_agent_index_5101362`}${frenchCurrency} ${
            showIncome.current ? rebateObj.contract : hiddenSymbols
          }`,

          value: noData ? 100 : rebateObj.contract,

          color: '#29DC92',
        }
      : null

    const borrowCoin = rebateCanbeSetData?.borrowCoin
      ? {
          id: 3,

          label: `${t`features_agent_index_5101363`}${frenchCurrency} ${
            showIncome.current ? rebateObj.borrowCoin : hiddenSymbols
          }`,

          value: noData ? 100 : rebateObj.borrowCoin,

          color: '#6195F6',
        }
      : null

    return [spot, contract, borrowCoin].filter(Boolean) as Array<rebateChartDataType>
  }

  const handleChartData = (data: AgencyCenterOverviewResp) => {
    const frenchCurrency = data?.legalCur ? `(${data?.legalCur})` : ''
    const spot = data?.spot ? data?.spot : 0
    const contract = data?.contract ? data?.contract : 0
    const borrowCoin = data?.borrowCoin ? data?.borrowCoin : 0
    const noData = !spot && !contract && !borrowCoin

    const rebateObj = { spot, contract, borrowCoin }

    /** 饼图数据 */
    const chartData = handleDefaultData(frenchCurrency, rebateObj, noData)

    setState({
      rebateChartData: chartData as Array<rebateChartDataType>,
      totalIncome: data?.totalIncome
        ? (formatNumberDecimal(data?.totalIncome, precisionDefault) as string)
        : totalIncomeDefault,
      totalNum: data?.totalNum || 0,
      invitedNum: data?.invitedNum || 0,
    })
  }

  const handleShowIncome = () => {
    showIncome.current = !showIncome.current
    handleChartData(dataCache.current as AgencyCenterOverviewResp)
  }

  /** 获取总览数据 */
  const getInfoHistoryOverview = async (startDate?: number, endDate?: number) => {
    const res = await getRebateInfoHistoryOverview({ startDate, endDate })
    if (res.isOk && res.data) {
      handleChartData(res.data)
      dataCache.current = res.data
      return
    }

    setState({
      rebateChartData: handleDefaultData('', { spot: 0, contract: 0, borrowCoin: 0 }, true),
      totalIncome: totalIncomeDefault,
      totalNum: 0,
      invitedNum: 0,
    })
  }

  const { run: getHistoryOverview } = useRequest(getInfoHistoryOverview, { manual: true })

  useEffect(() => {
    rebateCanbeSetData && getHistoryOverview()
  }, [rebateCanbeSetData])

  /** 设置时间组件禁用时间 */
  const setDisableDate = (currentDate: dayjs.Dayjs) => {
    const endTime = dayjs().endOf('date').valueOf()
    return HandleDisableEndDate(currentDate, endTime)
  }

  /** 处理自定义时间 */
  const handleCustomTimeOnChange = (_: string[], date: dayjs.Dayjs[]) => {
    const starTime = date[0].startOf('date').valueOf()
    const endTime = date[1].endOf('date').valueOf()
    setSelectTime(DataOverviewTabType.custom)
    getInfoHistoryOverview(starTime, endTime)
  }

  /** tab 时间切换处理 */
  const handleSelectTime = (v: dataOverviewTabType) => {
    setSelectTime(v.value)

    v.value === DataOverviewTabType.all
      ? getInfoHistoryOverview()
      : getInfoHistoryOverview(v.starTime as number, v.endTime as number)
  }

  return (
    <>
      <div className="title" id="data-overview">
        <Icon name="rebates_overview" />
        <label>{t`features_agent_agency_center_data_overview_index_5101505`}</label>
      </div>

      <div className="container">
        <div className="tab">
          {dataOverviewTab.map((v, index) => (
            <span className={selectTime === v.value ? 'checked' : ''} key={index} onClick={() => handleSelectTime(v)}>
              {v.text}
            </span>
          ))}

          <span
            className={`${selectTime === DataOverviewTabType.custom ? 'checked' : ''}`}
          >{t`features_agent_agency_center_data_overview_index_5101506`}</span>

          <DatePickerRangePicker
            style={{ width: 260 }}
            separator={t`features/assets/saving/history-list/index-0`}
            // prefix={<Icon name="asset_overview_icon_time" hasTheme />}
            onChange={handleCustomTimeOnChange}
            disabledDate={setDisableDate}
          />
        </div>

        <div className="income">
          <div className="income-wrap">
            <div className="header">
              <div className="item left-icon">
                <div className="text">
                  <label>{t`features_agent_agency_center_data_overview_index_5101507`} USD</label>
                  <Icon name={showIncome.current ? `eyes_open` : 'eyes_close'} hasTheme onClick={handleShowIncome} />
                </div>
                <div className="num" onClick={() => link(agentModuleRoutes.gains)}>
                  {showIncome.current ? (
                    <>
                      <label>{`${state.totalIncome ? `≈ ${state.totalIncome}` : NoDataEnum.zero}`}</label>
                      <Icon name="next_arrow" hasTheme />
                    </>
                  ) : (
                    <label>{hiddenSymbols}</label>
                  )}
                </div>
              </div>

              <div className="item right-icon">
                <div className="text">
                  <Icon name="rebates_invitation_quantity" hasTheme />
                  <label>{t`features_agent_agency_center_data_overview_index_5101508`}</label>
                </div>
                <div className="num" onClick={() => link(agentModuleRoutes.invite)}>
                  {showIncome.current ? (
                    <>
                      <label>{`${state.invitedNum ? `${state.invitedNum}` : NoDataEnum.zero}`}</label>
                      <Icon name="next_arrow" hasTheme />
                    </>
                  ) : (
                    <label>{hiddenSymbols}</label>
                  )}
                </div>
              </div>

              <div className="item right-icon">
                <div className="text">
                  <Icon name="rebates_umbrella_quantity" hasTheme />
                  <label>{t`features_agent_agency_center_data_overview_index_5101509`}</label>
                </div>
                <div className="num" onClick={() => link(agentModuleRoutes.invite)}>
                  {showIncome.current ? (
                    <>
                      <label>{`${state.totalNum ? `${state.totalNum}` : NoDataEnum.zero}`}</label>
                      <Icon name="next_arrow" hasTheme />
                    </>
                  ) : (
                    <label>{hiddenSymbols}</label>
                  )}
                </div>
              </div>
            </div>
            <div className="footer">
              <ResponsivePie
                data={state.rebateChartData}
                margin={{ top: 0, right: 380, bottom: 0, left: 0 }}
                innerRadius={0.5}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                colors={(node: any) => `${node.data.color}`}
                isInteractive={false}
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 116,
                    translateY: 0,
                    itemsSpacing: 24,
                    itemWidth: 100,
                    itemHeight: 10,
                    itemTextColor: 'var(--text_color_01)',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 8,
                    symbolShape: 'circle',
                  },
                ]}
              />
            </div>
          </div>
          <div className="tips">
            <label>{t`features_agent_agency_center_data_overview_index_5101510`}</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default AgencyCenteDataOverview
