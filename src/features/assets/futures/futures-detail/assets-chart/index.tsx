/**
 * 合约组详情 - 资产数据占比图表
 */
import { useState, useEffect } from 'react'
import { Trigger } from '@nbit/arco'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import {
  FuturesChartDataTypeEnum,
  getFuturesChartDataTypeEnumName,
  FuturesChartDataTypeEnumList,
  FuturePositionDirectionEnum,
  getFuturePositionDirectionEnumName,
} from '@/constants/assets/futures'
import { GroupDetailMarginCoin, GroupDetailPositionAsset } from '@/typings/api/assets/futures'
import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimal, formatCurrency } from '@/helper/decimal'
import ListEmpty from '@/components/list-empty'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { UserContractVersionEnum, UserEnableEnum } from '@/constants/user'
import { PieChart } from './pie-chart'
import styles from './index.module.css'
import AutoAddMarginSetting from '../auto-add-margin'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type IDropdownCellsProps = {
  onClickMenu?: (v) => void
  activeTypeId: number
}
function DropdownCells({ onClickMenu, activeTypeId }: IDropdownCellsProps) {
  const onClick = values => {
    onClickMenu && onClickMenu(values)
  }
  return (
    <div className={styles['menu-cells']}>
      {FuturesChartDataTypeEnumList.map(v => (
        <div className="cell" key={v.id} onClick={() => onClick(v.id)}>
          <div className="cell-wrap">
            <span
              className={classNames({
                'is-selected': Number(activeTypeId) === Number(v.id),
              })}
            >
              {getFuturesChartDataTypeEnumName(v.id)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 饼图图例
 * @param data 图表数据
 * @param type 图表数据类型 - 不同类型展示不同
 * @param direction 做多或做空
 * @returns
 */
function LegendRender({ data, type, baseCoin, offset = 2 }) {
  const showTag = type === FuturesChartDataTypeEnum.positionRiskScale
  return (
    <div className="pie-legend">
      {data &&
        data.map((pieItem, index: number) => {
          return (
            <div key={index} className="legend">
              <div className="legend-header">
                <div className="legend-icon" style={{ background: pieItem.color }} />
                <span className="legend-title">
                  {pieItem.label && pieItem.label === 'other' ? t`constants_assets_index_2560` : pieItem.label}
                </span>
                {formatCurrency(pieItem.value, offset)} {baseCoin}
                {showTag && (
                  <div
                    className={classNames('direction-tag', {
                      'bg-sell_down_color_special_02': pieItem.sideInd === FuturePositionDirectionEnum.openSell,
                      'text-sell_down_color': pieItem.sideInd === FuturePositionDirectionEnum.openSell,
                      'bg-buy_up_color_special_02': pieItem.sideInd === FuturePositionDirectionEnum.openBuy,
                      'text-buy_up_color': pieItem.sideInd === FuturePositionDirectionEnum.openBuy,
                    })}
                  >
                    {getFuturePositionDirectionEnumName(pieItem.sideInd)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
    </div>
  )
}

interface ITotalAssetsProps {
  // assetsData: FuturesGroupDetailResp | undefined
  baseCoin: string
  /** 可用保证金 */
  marginAvailable: string // 合约组可用保证金
  /** 仓位保证金 */
  positionMargin: string
  /** 开仓冻结保证金 */
  openLockAsset: string
  /** 保证金币种信息 */
  marginCoin: GroupDetailMarginCoin[]
  /** 持仓风险占比 */
  positionAsset: GroupDetailPositionAsset[]
}
export function AssetsChart({ onAutoAddMargin }: { onAutoAddMargin: () => void }) {
  const assetsFuturesStore = useAssetsFuturesStore()
  const { contractPreference } = useContractPreferencesStore()
  const {
    futuresDetailsChartData,
    futuresCurrencySettings: { offset },
  } = { ...assetsFuturesStore }
  const [pieChartData, setPieChartData] = useState<any>()
  const {
    baseCoin = '',
    groupAsset = '',
    /** 可用保证金 */
    marginAvailable = '',
    /** 仓位保证金 */
    positionMargin = '',
    /** 开仓冻结保证金 */
    openLockAsset = '',
    marginCoin = [],
    positionAsset = [],
  } = {
    ...futuresDetailsChartData,
  }

  /** 触发弹框展示状态 */
  const [popupVisible, setPopupVisible] = useState(false)
  const defaultType = FuturesChartDataTypeEnum.assetScale
  const [activeType, setActiveType] = useState(defaultType)
  const [totalValue, setTotalValue] = useState(0)
  const [totalPercent, setTotalPercent] = useState(0)

  const colorList = [
    'rgba(169, 156, 250, 1)',
    'rgba(97, 149, 246, 1)',
    'rgba(252, 141, 77, 1)',
    'rgba(86, 240, 176, 1)',
    'rgba(255, 126, 119, 1)',
  ]
  /** 图表总计数据 */
  const onTotalStatistics = data => {
    let newTotal = 0
    if (!data) return newTotal
    for (let index = 0; index < data.length; index += 1) {
      newTotal = +SafeCalcUtil.add(newTotal, Number(data[index]?.value))
    }
    return newTotal
  }

  /** 计算资产占比图表数据 */
  const calcPercent = (num: string | number, _total: number, pieData) => {
    if (!Number(num) || !Number(_total)) {
      return 0
    }
    // 兼容占比区间为（0%-1%）则展示为 1% ，占比区间为（99-100%）则展示为 99%
    let percent = Math.round(+SafeCalcUtil.mul(SafeCalcUtil.div(num, _total), 100))
    if (pieData.length > 1) {
      percent = Math.max(1, Math.min(99, +percent))
    }
    return percent
  }

  /** 设置饼图数据源 */
  const onSetPieData = data => {
    if (!data.length) return []
    const totalVal = onTotalStatistics(data)
    let totalPercentVal = 0
    for (let index = 0; index < data.length; index += 1) {
      const percent = calcPercent(data[index].value, totalVal, data)
      data[index].percent = percent
      totalPercentVal = +SafeCalcUtil.add(totalPercentVal, percent)
      if (index === data.length - 1) {
        setTotalValue(totalVal)
        setPieChartData(data)
        setTotalPercent(totalPercentVal)
      }
    }
  }
  /** 资金占比 */
  let assetChartData = [] as any
  const marginAvailableVal = formatNumberDecimal(marginAvailable, offset)
  if (Number(marginAvailableVal) !== 0) {
    assetChartData.push({
      id: t`features_assets_futures_common_migrate_modal_index_5101344`,
      label: t`features_assets_futures_common_migrate_modal_index_5101344`,
      value: marginAvailableVal,
      color: 'rgba(255, 126, 119, 1)',
    })
  }

  const positionMarginVal = formatNumberDecimal(positionMargin, offset)
  if (Number(positionMarginVal) !== 0) {
    assetChartData.push({
      id: t`features/assets/futures/futuresList/index-3`,
      label: t`features/assets/futures/futuresList/index-3`,
      value: positionMarginVal,
      color: 'rgba(86, 240, 176, 1)',
    })
  }

  const openLockAssetVal = formatNumberDecimal(openLockAsset, offset)
  if (Number(openLockAssetVal) !== 0) {
    assetChartData.push({
      id: t`features_assets_futures_index_total_assets_index_g5e9brvddw9m8lxs1szf8`,
      label: t`features_assets_futures_index_total_assets_index_g5e9brvddw9m8lxs1szf8`,
      value: formatNumberDecimal(openLockAsset, offset),
      color: 'rgba(244, 194, 94, 1)',
    })
  }

  /** 保证金占比 */
  const depositChartData =
    marginCoin &&
    marginCoin.map((item: GroupDetailMarginCoin, index: number) => {
      return {
        ...item,
        id: item.coinName,
        label: item.coinName,
        value: formatNumberDecimal(item.coinConvert, offset),
        color: colorList[index],
      }
    })

  /** 持仓资产风险占比 */
  const assetRiskChartData =
    positionAsset &&
    positionAsset.map((item: GroupDetailPositionAsset, index: number) => {
      return {
        ...item,
        id: item.coinName,
        label: item.coinName,
        value: formatNumberDecimal(item.nominalValue, offset),
        color: colorList[index],
      }
    })

  const onClickMenu = values => {
    setActiveType(values)
    setPopupVisible(false)
    switch (values) {
      case FuturesChartDataTypeEnum.assetScale:
        onSetPieData(assetChartData)
        break
      case FuturesChartDataTypeEnum.depositScale:
        onSetPieData(depositChartData)
        break
      case FuturesChartDataTypeEnum.positionRiskScale:
        onSetPieData(assetRiskChartData)
        break
      default:
        break
    }
  }
  useEffect(() => {
    activeType && onClickMenu(activeType)
  }, [marginAvailable, positionMargin, openLockAsset, activeType])

  return (
    <div className={styles.scoped}>
      <div className="chart-title">
        <div className="trigger-wrapper">
          {Number(groupAsset) !== 0 && (
            <Trigger
              popup={() => <DropdownCells activeTypeId={activeType} onClickMenu={v => onClickMenu(v)} />}
              onVisibleChange={setPopupVisible}
              popupVisible={popupVisible}
            >
              {getFuturesChartDataTypeEnumName(activeType)}
              <Icon className="icon" name="arrow_open" hasTheme onClick={() => setPopupVisible(true)} />
            </Trigger>
          )}
        </div>
        {/* 自动追加保证金 */}
        {contractPreference.perpetualVersion === UserContractVersionEnum.professional &&
          contractPreference.isAutoAdd === UserEnableEnum.yes && (
            <div className="items-end">
              <AutoAddMarginSetting onAutoAddMargin={onAutoAddMargin} />
            </div>
          )}
      </div>
      {Number(groupAsset) !== 0 && (
        <div className="chart-wrap">
          {Number(totalValue) > 0 && (
            <>
              <div className="pie-wrap">
                <PieChart data={pieChartData} totalPercent={totalPercent} />
              </div>
              <LegendRender data={pieChartData} baseCoin={baseCoin} type={activeType} offset={offset} />
            </>
          )}
          {Number(totalValue) === 0 && <ListEmpty />}
        </div>
      )}
    </div>
  )
}
