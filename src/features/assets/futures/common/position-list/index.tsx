/**
 * 合约 - 持仓列表
 */
import { t } from '@lingui/macro'
import { useMemo, useState } from 'react'
import { Button, TableColumnProps, Tooltip, Popover, Message } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'
import { NoDataElement } from '@/features/orders/order-table-layout'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { IncreaseTag } from '@nbit/react'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import ExitPositionEntrustModal from '@/features/assets/futures/common/exist-position-entrust-modal'
import {
  MoreOperateEnum,
  StopLimitStrategyTypeEnum,
  getFuturePositionListDirectionEnumName,
  EntrustOrderTypeInd,
  EntrustTypeEnum,
  FuturesAutoAddMarginTypeEnum,
  EntrustPlaceUnit,
  FuturesMarketUnitTypeEnum,
  FuturesOrderSideTypeEnum,
  FuturePositionDirectionEnum,
  getFuturesGroupTypeName,
  StopLimitTabEnum,
  FuturesPositionStatusTypeEnum,
} from '@/constants/assets/futures'
import { checkPositionExistEntrustOrder, formatRatioNumber, formatNumberByOffset } from '@/helper/assets/futures'
import { IPositionListData } from '@/typings/api/assets/futures/position'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { UserContractVersionEnum } from '@/constants/user'
import { AssetWsSubscribePageEnum, ErrorTypeEnum } from '@/constants/assets'
import {
  postPerpetualOrdersPlace,
  getPerpetualPositionMaxSizeLimit,
  getPerpetualPositionReverseInfo,
  getPerpetualPositionSymbolSize,
} from '@/apis/assets/futures/position'
import { formatCurrency, formatNumberDecimal, removeDecimalZero } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import Link from '@/components/link'
import { useFuturesStore } from '@/store/futures'
import { useLockFn } from 'ahooks'
import { useGetPositionListFutures } from '@/hooks/features/assets/futures'
import Decimal from 'decimal.js'
import { ThemeEnum } from '@nbit/chart-utils'
import { useCommonStore } from '@/store/common'
import { getFuturesDetailPageRoutePath } from '@/helper/route/assets'
import { TradeMarketAmountTypesEnum } from '@/constants/trade'
import styles from './index.module.css'
import { LockModal } from '../lock-modal'
import { ClosePositionModal } from '../close-position-modal'
import { MigrateModal } from '../migrate-modal'
import { StopLimitModal } from '../stop-limit-modal'
import { PositionMoreMenuList } from './position-more-menu'
import AdjustPositionLeverModal from '../adjust-position-lever-modal'

const SafeCalcUtil = decimalUtils.SafeCalcUtil
interface IFuturesListProps {
  loading?: boolean
  assetsListData?: IPositionListData[] | undefined
  height?: number | string
  /** 组件使用页面：trade、other */
  fromPage?: string
  onSuccess?: (val?: any) => void
}

/** 合约持仓列表 */
export function PositionListFutures(props: IFuturesListProps) {
  const { height, onSuccess, fromPage = AssetWsSubscribePageEnum.trade } = props
  /** 合约偏好设置 */
  const { contractPreference } = useContractPreferencesStore()
  /** 专业版判断，合约版本：1，专业版，2，普通版 */
  const isProfessionalVersion = contractPreference?.perpetualVersion !== UserContractVersionEnum.base
  /** 开仓保证金来源设置，tradePanel 下单面板数据 */
  const { currentGroupOrderAssetsTypes, tradePanel } = useFuturesStore()
  /** 下单页输入框下拉计价单位 - 金额还是数量 eg usd / btc */
  const tradePairType = useMemo(() => {
    return tradePanel.tradeUnit
  }, [tradePanel.tradeUnit])

  const assetsFuturesStore = useAssetsFuturesStore()
  /** 商户设置的计价币的法币精度和法币符号，USD 或 CNY 等 */
  const {
    futuresCurrencySettings: { currencySymbol, offset },
    positionListLoading,
    updatePositionListLoading,
  } = { ...assetsFuturesStore }
  /** 仓位保证金率 - 弹框 */
  const [visibleMarginRatioPrompt, setVisibleMarginRatioPrompt] = useState(false)
  /** 未实现盈亏 - 弹框 */
  const [visibleNoProfitPrompt, setVisibleNoProfitPrompt] = useState(false)
  /** 开仓均价 - 弹框 */
  const [visibleOpenAveragePrompt, setVisibleOpenAveragePrompt] = useState(false)
  /** 调整杠杆 - 弹框 */
  const [visibleAdjustLeverModal, setVisibleAdjustLeverModal] = useState(false)
  /** 更多功能操作 - 弹框 */
  const [visibleMoreOperateModal, setVisibleMoreOperateModal] = useState(false)
  /** 更多功能选中/激活项 */
  const [activeMoreOperate, setActiveMoreOperate] = useState<MoreOperateEnum | undefined>()
  /** 仓位是否存在当前委托订单 */
  const [visibleExitEntrustOrderPrompt, setVisibleExitEntrustOrderPrompt] = useState(false)
  /** 调整杠杆 - 仓位是否存在当前委托订单 */
  const [errorMsgExitEntrustOrder, setErrorMsgExitEntrustOrder] = useState('')
  /** 一键反向 - 弹框确认 */
  const [visibleReverseConfirmPrompt, setVisibleReverseConfirmPrompt] = useState(false)
  /** 一键反向 - 开仓保证金余额不足 */
  const [visibleReverseMarginPrompt, setVisibleReverseMarginPrompt] = useState(false)
  /** 一键反向 - 超过最大持仓数量 */
  const [visibleReverseMaxAmountPrompt, setVisibleReverseMaxAmountPrompt] = useState(false)
  /** 一键反向 - loading */
  // const [reverseLoading, setReverseLoading] = useState(false)
  /** 一键反向 - 最大持仓限制 */
  const [maxPositionSizeData, setPositionSizeData] = useState<any>()
  /** 选中的仓位信息 */
  const [selectedPosition, setSelectedPosition] = useState<IPositionListData>()

  /** 止盈止损 tab 类型 */
  const [activeTabStopPL, setActiveTabStopPL] = useState(StopLimitTabEnum.stopLimit)
  const commonState = useCommonStore()
  const theme = commonState.theme
  /** 关闭更多功能事件 */
  const onSetVisibleActiveMoreOperate = val => {
    setVisibleMoreOperateModal(val)
    setActiveMoreOperate(undefined)
    setSelectedPosition(undefined)
    // onSuccess && onSuccess(val)
  }

  /**
   * 一键反向 - 获取订单方向类型
   */
  const onGetSideInd = sideInd => {
    return (
      {
        [FuturePositionDirectionEnum.openSell]: FuturesOrderSideTypeEnum.openLong,
        [FuturePositionDirectionEnum.openBuy]: FuturesOrderSideTypeEnum.openShort,
      }[sideInd] || ''
    )
  }

  /**
   * 一键反向
   */
  const onReverse = useLockFn(async (record: IPositionListData) => {
    try {
      updatePositionListLoading(true)
      const { groupId = '', positionId = '', tradeId, lever, size, sideInd } = record || {}
      /** 开仓保证金来源，wallet 使用资产账户的资金开仓 group 使用当前合约组的额外保证金开仓 */
      const marginType = currentGroupOrderAssetsTypes
      setSelectedPosition(record)
      /** 获取币对详情，可迁移仓位数量 */
      const [reverseInfo, maxSizeLimit, positionSizeData] = await Promise.all([
        /** 获取反向开仓信息 */
        getPerpetualPositionReverseInfo({ groupId, positionId, marginType }),
        /** 获取币对最大可开仓数量 */
        getPerpetualPositionMaxSizeLimit({ tradeId, lever }),
        /** 获取币对持仓数量 */
        getPerpetualPositionSymbolSize({ tradeId, sideInd, lever }),
      ])

      // 接口异常时停止流程
      if (!reverseInfo.isOk || !maxSizeLimit.isOk || !positionSizeData.isOk) {
        updatePositionListLoading(false)
        Message.error({
          content: t`features_assets_futures_common_position_list_index_lvbcplbiwpirlz_zo1evb`,
          id: ErrorTypeEnum.uncategorizedError,
        })
        return
      }

      // 根据合约价格精度计算数量
      const newSize = removeDecimalZero(formatNumberDecimal(size, Number(record?.amountOffset)))

      /**
       * 检测保证金是否充足 - 反向开仓相同标的币、同杠杆倍数，保证金是否足够
       * 保证金足够的判断条件：标的币数量*（1+taker 手续费）*对手价 > 可用开仓保证金*杠杆倍数
       */
      /** 需要的保证金：标的币数量*（1+taker 手续费）*对手价 */
      const needMargin = Number(
        SafeCalcUtil.mul(
          SafeCalcUtil.mul(size, SafeCalcUtil.add(1, reverseInfo.data?.takerFeeRate)),
          reverseInfo.data?.opponentPrice
        )
      )
      /** 可用保证金：可用开仓保证金*杠杆倍数 */
      const availableMargin = Number(SafeCalcUtil.mul(reverseInfo.data?.availableOpenMargin, lever))

      if (needMargin > availableMargin) {
        setVisibleReverseMarginPrompt(true)
        onSetVisibleActiveMoreOperate(false)
        updatePositionListLoading(false)
        return
      }

      /**
       * 检测是否最大持仓数量判断，不可以反向：目标方向的持仓数量>最大持仓数量限制
       * 可反向条件：用户目标方向的持仓数量 <= 最大持仓数量限制
       */
      if (Number(positionSizeData.data?.size) > Number(maxSizeLimit.data?.maxSize)) {
        setVisibleReverseMaxAmountPrompt(true)
        onSetVisibleActiveMoreOperate(false)
        updatePositionListLoading(false)
        return
      }
      // 获取币对持仓数量
      setPositionSizeData(positionSizeData.data)

      const params = {
        groupId,
        tradeId: Number(tradeId),
        lever,
        size: String(newSize),
        additionalMargin: 0,
        // additionalMarginType: getFuturesAdditionalMarginType(contractPreference.marginSource),
        typeInd: EntrustOrderTypeInd.marketOrder,
        entrustTypeInd: EntrustTypeEnum.market,
        sideInd: onGetSideInd(sideInd),
        marketUnit: FuturesMarketUnitTypeEnum.quantity,
        placeUnit: EntrustPlaceUnit.base,
        marginType,
        autoAddMargin: FuturesAutoAddMarginTypeEnum.no,
        initMargin: +formatNumberDecimal(
          Number(SafeCalcUtil.div(SafeCalcUtil.mul(reverseInfo.data?.opponentPrice, newSize), lever)),
          Number(offset)
        ),
      }

      const res = await postPerpetualOrdersPlace(params)

      const { isOk, data, message = '' } = res || {}
      if (!isOk || !data) {
        // Message.info(message || t`features_assets_futures_common_position_list_index_5101539`)
        updatePositionListLoading(false)
        return
      }

      if (!data) {
        Message.error(message || t`features_assets_futures_common_position_list_index_5101539`)
        updatePositionListLoading(false)
        return
      }

      Message.success(t`features_assets_futures_common_position_list_index_5101540`)
      updatePositionListLoading(false)
      onSetVisibleActiveMoreOperate(false)
      onSuccess && onSuccess()
    } catch (error) {
      Message.error(t`features_assets_futures_common_position_list_index_5101539`)
      updatePositionListLoading(false)
    }
  })

  /** 撤销全部委托回调 */
  const onCancelEntrustCallBackFn = () => {
    setVisibleExitEntrustOrderPrompt(false)
    setErrorMsgExitEntrustOrder('')
    onSetVisibleActiveMoreOperate(false)
    onSuccess && onSuccess()
  }

  /** 点击调整杠杆 Icon */
  const onClickLeverIcon = useLockFn(async record => {
    const { groupId = '', positionId = '' } = (record as IPositionListData) || {}
    setSelectedPosition(record)
    //  锁仓中和存在委托订单时不能调整杠杆
    const isExist = await checkPositionExistEntrustOrder(groupId, positionId)
    // 仓位存在委托订单
    if (isExist) {
      setVisibleExitEntrustOrderPrompt(isExist)
      setErrorMsgExitEntrustOrder(t`features_assets_futures_common_position_list_index_wslnpf9bqfkvzy-jw9a0y`)
      updatePositionListLoading(false)
      return false
    }
    setVisibleAdjustLeverModal(true)
  })

  /** 更多功能菜单点击事件 */
  const onClickMenu = useLockFn(async (val, record) => {
    updatePositionListLoading(true)
    const { groupId = '', positionId = '', tradeId } = (record as IPositionListData) || {}
    setSelectedPosition(record)

    /** 是否锁仓状态 */
    if (val !== MoreOperateEnum.lock && record.statusCd === FuturesPositionStatusTypeEnum.locked) {
      Message.warning(t`features_assets_futures_common_position_list_index_5101572`)
      updatePositionListLoading(false)
      return false
    }

    /** 锁仓、迁移前 - 检测仓位是否存在委托订单 */
    if (val === MoreOperateEnum.migrate) {
      const isExist = await checkPositionExistEntrustOrder(groupId, positionId)
      // 仓位存在委托订单
      if (isExist) {
        setVisibleExitEntrustOrderPrompt(isExist)
        updatePositionListLoading(false)
        return false
      }
    }

    if (val === MoreOperateEnum.reverse) {
      setVisibleReverseConfirmPrompt(true)
    }
    updatePositionListLoading(false)
    // 重置止盈止损 tab
    setActiveTabStopPL(StopLimitTabEnum.stopLimit)
    setActiveMoreOperate(val)
    setVisibleMoreOperateModal(true)
  })

  /** 仓位止盈止损详情 */
  const getPositionProfitLossEntrustInfo = data => {
    let result = { stopLosTriggerPrice: '--', stopProfitTriggerPrice: '--' }
    if (!data || data.length === 0) return '--'
    if (data && data.length > 0) {
      const stopLessData = data.filter(item => {
        return item.strategyTypeInd === StopLimitStrategyTypeEnum.stopLoss
      })[0]

      const stopProfitData = data.filter(item => {
        return item.strategyTypeInd === StopLimitStrategyTypeEnum.stopProfit
      })[0]

      result.stopLosTriggerPrice = stopLessData?.triggerPrice
        ? formatNumberByOffset(stopLessData?.triggerPrice, Number(data.priceOffset))
        : '--'
      result.stopProfitTriggerPrice = stopProfitData?.triggerPrice
        ? formatNumberByOffset(stopProfitData?.triggerPrice, Number(data.priceOffset))
        : '--'
      return `${result.stopProfitTriggerPrice} / ${result.stopLosTriggerPrice}`
    }
  }

  /** 根据下单页计价单位处理持仓数量 */
  const getPositionSize = (record: IPositionListData) => {
    const { size, latestPrice, amountOffset, baseSymbolName, quoteSymbolName } = record || {}
    // 计价单位为金额时持仓数量转化为法币展示，计价币数量=标的币数量*最新价
    if (tradePairType === TradeMarketAmountTypesEnum.funds) {
      const fundVal = SafeCalcUtil.mul(latestPrice, size)
      return `${formatNumberByOffset(fundVal, Number(offset))} ${quoteSymbolName}`
    }
    return `${formatNumberByOffset(size, Number(amountOffset), false)} ${baseSymbolName}`
  }

  /** 隐藏其他币对持仓 */
  const displayPositionListFutures = useGetPositionListFutures()
  const cellStyle: any = {
    headerCellStyle: {
      textAlign: 'right',
    },
    bodyCellStyle: {
      textAlign: 'right',
    },
  }
  const cellWidth = displayPositionListFutures.length > 0 ? { width: 160 } : {}
  const cellWidth120 = displayPositionListFutures.length > 0 ? { width: 120 } : {}

  let columns: TableColumnProps[] = [
    {
      title: t`future.funding-history.future-select.future`,
      width: 150,
      render: (col, record) => (
        <Link href={`/futures/${record.symbol}?selectgroup=${record.groupId}`}>
          {record.symbol} {getFuturesGroupTypeName(record.typeInd)}
        </Link>
      ),
    },
    {
      title: t`features_assets_futures_futures_detail_position_list_index_5101359`,
      ...cellWidth120,
      ...cellStyle,
      render: (col, record) => (
        <div>
          <span
            className={classNames({
              'text-buy_up_color': record.sideInd === FuturePositionDirectionEnum.openBuy,
              'text-sell_down_color': record.sideInd === FuturePositionDirectionEnum.openSell,
            })}
          >
            {getFuturePositionListDirectionEnumName(record.sideInd)}
          </span>
          <span className="px-1">/</span>
          <span>
            {record.lever}X{/* 调整持仓杠杆 */}
            {record.statusCd !== FuturesPositionStatusTypeEnum.locked && (
              <Icon
                className="ml-1 inline-block"
                name="rebates_edit"
                hasTheme
                fontSize={12}
                onClick={() => {
                  onClickLeverIcon(record)
                }}
              />
            )}
          </span>
        </div>
      ),
    },
    {
      // 未实现盈亏
      title: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101360',
        values: { 0: currencySymbol },
      }),
      dataIndex: 'unrealizedProfit',
      width: 200,
      ...cellStyle,
      render: (col, record) => (
        <div>
          <IncreaseTag value={record.unrealizedProfit} digits={offset} isRound={false} hasPrefix kSign />
          <Icon
            name="msg"
            className="icon"
            onClick={() => {
              setSelectedPosition(record)
              setVisibleNoProfitPrompt(true)
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Tooltip
          content={
            <div className="tips-wrap">
              <div>
                {t`features/orders/order-columns/future-2`} = {t`features/orders/order-columns/holding-6`} +{' '}
                {t`features_assets_futures_futures_details_position_details_list_5101358`}
              </div>
              <div>
                {t`features/orders/order-columns/holding-5`} ={' '}
                {t`features_assets_futures_common_position_list_index_5101460`} * 100%
              </div>
            </div>
          }
        >
          {/* 收益 ｜ 收益率 */}
          <span className="tips-text">
            {t`features/orders/order-columns/future-2`} {`(${currencySymbol || ''})`} |{' '}
            {t`features/orders/order-columns/holding-5`}
          </span>
        </Tooltip>
      ),
      // width: 240,
      ...cellStyle,
      render: (col, record) => (
        <div>
          <IncreaseTag value={record.profit} delZero={false} digits={offset} isRound={false} hasPrefix kSign />
          <span
            className={classNames(
              'mx-1',
              { 'text-buy_up_color': record.profit > 0 },
              { 'text-sell_down_color': record.profit < 0 }
            )}
          >
            |
          </span>
          <IncreaseTag value={record.profitRatio} digits={offset} isRound={false} needPercentCalc hasPostfix />
        </div>
      ),
    },
    {
      // 持仓数量
      title: (
        <Tooltip
          content={
            <div className="tips-wrap">
              {/* 当前持仓数量单位根据当前... */}
              {t({
                id: 'features_assets_futures_common_lock_modal_index_5101440',
                values: { 0: currencySymbol },
              })}
            </div>
          }
        >
          <span className="tips-text">{t`features_assets_futures_futures_detail_position_list_index_5101362`}</span>
        </Tooltip>
      ),
      ...cellWidth,
      ...cellStyle,
      render: (col, record) => <div>{getPositionSize(record)}</div>,
    },
    {
      // 合约组保证金
      title: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101363',
        values: { 0: currencySymbol },
      }),
      ...cellWidth,
      ...cellStyle,
      render: (col, record) => <span>{formatNumberByOffset(record.groupMargin, Number(offset))}</span>,
    },
    {
      title: t`features_assets_futures_futures_detail_position_list_index_5101365`,
      ...cellWidth,
      ...cellStyle,
      render: (col, record) => (
        <div>
          {`${formatRatioNumber(record.marginRatio)}%`}
          <Icon
            name="msg"
            className="icon"
            onClick={() => {
              setSelectedPosition(record)
              setVisibleMarginRatioPrompt(true)
            }}
          />
        </div>
      ),
    },
    {
      // 开仓均价
      title: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101366',
        values: { 0: currencySymbol },
      }),
      ...cellWidth,
      ...cellStyle,
      render: (col, record) => (
        <div>
          {formatNumberByOffset(record.openPrice, Number(record.priceOffset))}
          {!!record.lockRecord && (
            <Icon
              name="msg"
              className="icon"
              onClick={() => {
                setSelectedPosition(record)
                setVisibleOpenAveragePrompt(true)
              }}
            />
          )}
        </div>
      ),
    },
    {
      // 标记价格
      title: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101367',
        values: { 0: currencySymbol },
      }),
      ...cellWidth,
      ...cellStyle,
      render: (col, record) => <div>{formatNumberByOffset(record.markPrice, Number(record.priceOffset))}</div>,
    },
    {
      // 预估强平价
      title: (
        <Tooltip
          content={<div className="tips-wrap">{t`features_assets_futures_common_position_list_index_5101462`}</div>}
        >
          <span className="tips-text">
            {t`features_assets_futures_futures_details_position_details_list_5101352`} ({currencySymbol})
          </span>
        </Tooltip>
      ),
      ...cellWidth,
      ...cellStyle,
      render: (col, record) => (
        <div>
          {Number(record.liquidatePrice) > 0
            ? formatNumberByOffset(
                +formatNumberDecimal(
                  record.liquidatePrice,
                  +record.priceOffset,
                  record.sideInd === FuturePositionDirectionEnum.openSell ? Decimal.ROUND_HALF_UP : Decimal.ROUND_DOWN
                ),
                +record.priceOffset
              )
            : '--'}
        </div>
      ),
    },
    {
      // 已实现盈亏
      title: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101368',
        values: { 0: currencySymbol },
      }),
      // ...cellWidth,
      ...cellStyle,
      render: (col, record) => <div>{formatNumberByOffset(record.realizedProfit, Number(offset))}</div>,
    },
    {
      title: t`features_assets_futures_futures_detail_position_list_index_5101369`,
      width: 185,
      ...cellStyle,
      render: (col, record) => (
        <div>
          {getPositionProfitLossEntrustInfo(record.profitLossEntrust)}
          <Icon
            name="contract_edit"
            hasTheme
            className="icon"
            onClick={() => {
              onClickMenu(MoreOperateEnum.stopLimit, record)
              setActiveTabStopPL(StopLimitTabEnum.positionStopLimit)
            }}
          />
        </div>
      ),
    },
    {
      title: t`order.columns.action`,
      sorter: false,
      fixed: 'right',
      width: 60,
      headerCellStyle: {
        padding: [0, 12],
        textAlign: 'center',
      },
      bodyCellStyle: {
        padding: [0, 12],
        textAlign: 'center',
      },
      render: (col, record) => (
        <Popover
          key={record.id}
          className="flex"
          position="bottom"
          trigger="hover"
          triggerProps={{
            className: styles['more-popup-wrapper'],
          }}
          content={
            <PositionMoreMenuList
              lockStatus={record.statusCd}
              isProfessionalVersion={isProfessionalVersion}
              onClickMenu={val => {
                onClickMenu(val, record)
              }}
            />
          }
        >
          <div className="h-full">
            <Icon hasTheme name="msg_more_def" className="arrow-icon" />
          </div>
        </Popover>
      ),
    },
  ]

  const groupNameColumn = {
    title: t`features_assets_futures_futures_details_index_5101367`,
    dataIndex: 'groupName',
    ...cellStyle,
    width: 90,
    render: (col, record) => <Link href={getFuturesDetailPageRoutePath(record.groupId)}>{record.groupName}</Link>,
  }

  if (fromPage === AssetWsSubscribePageEnum.trade) {
    columns.splice(1, 0, groupNameColumn)
  }

  function getTableScrollVal() {
    if (displayPositionListFutures.length > 0) {
      if (fromPage !== AssetWsSubscribePageEnum.trade) {
        return {
          x: 2160,
          y: height,
        }
      }

      return {
        x: 2250,
        y: height,
      }
    } else {
      return {
        y: height,
      }
    }
  }

  return (
    <div
      className={classNames(
        styles['futures-position-table'],
        theme === ThemeEnum.dark ? 'assets-table-dark' : 'assets-table-light',
        {
          'arco-table-body-full': true,
          'auto-width': true,
          'no-data': displayPositionListFutures?.length === 0,
        }
      )}
      style={{ height }}
    >
      <AssetsTable
        // loading={loading || reverseLoading}
        className="list"
        autoWidth
        fitByContent
        minWidthWithColumn={false}
        rowKey={record => `${record.positionId}`}
        columns={columns}
        data={displayPositionListFutures}
        border={false}
        pagination={false}
        noDataElement={<NoDataElement isFuture loading={positionListLoading} />}
        scroll={getTableScrollVal()}
      />

      {/* 仓位保证金率详情 - 当前仓位保证金率、最低维持保证金率 */}
      {visibleMarginRatioPrompt && (
        <AssetsPopupTips
          visible={visibleMarginRatioPrompt}
          setVisible={setVisibleMarginRatioPrompt}
          popupTitle={t`features_assets_futures_futures_detail_position_list_index_5101365`}
          footer={null}
          slotContent={
            <div>
              <div>
                <div>
                  {t`features_assets_futures_futures_details_position_details_list_5101353`}
                  {formatRatioNumber(selectedPosition?.marginRatio)}%
                </div>
                <div>
                  {t`features_assets_futures_futures_details_position_details_list_5101354`}
                  {formatRatioNumber(selectedPosition?.maintMarginRatio)}%
                </div>
              </div>
              <div className="footer">
                <Button
                  type="primary"
                  onClick={() => {
                    setVisibleMarginRatioPrompt(false)
                  }}
                >
                  {t`features_trade_spot_index_2510`}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {/* 未实现盈亏详情 - 仓位盈亏、锁仓利息 */}
      {visibleNoProfitPrompt && (
        <AssetsPopupTips
          visible={visibleNoProfitPrompt}
          setVisible={setVisibleNoProfitPrompt}
          popupTitle={t`features/orders/order-columns/holding-6`}
          footer={null}
          slotContent={
            <div>
              <div>
                <div>
                  {t`features_assets_futures_common_position_list_index_5101463`}
                  <IncreaseTag
                    value={selectedPosition?.unrealizedProfit}
                    digits={Number(offset)}
                    isRound={false}
                    kSign
                  />{' '}
                  {currencySymbol}
                </div>
                <div>
                  {t`features_assets_futures_common_position_list_index_5101464`}
                  <IncreaseTag
                    value={
                      Number(formatNumberDecimal(selectedPosition?.lockFees, offset)) > 0
                        ? -Number(selectedPosition?.lockFees)
                        : 0
                    }
                    digits={Number(offset)}
                    isRound
                    kSign
                  />{' '}
                  {currencySymbol}
                </div>
              </div>
              <div className="footer">
                <Button
                  type="primary"
                  onClick={() => {
                    setVisibleNoProfitPrompt(false)
                  }}
                >
                  {t`features_trade_spot_index_2510`}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {/* 开仓均价详情 - 锁仓时价格、锁仓利息 */}
      {visibleOpenAveragePrompt && (
        <AssetsPopupTips
          visible={visibleOpenAveragePrompt}
          setVisible={setVisibleOpenAveragePrompt}
          popupTitle={t`features_assets_futures_futures_details_position_details_list_5101351`}
          footer={null}
          slotContent={
            <div>
              <div>
                <div>{t`features_assets_futures_common_position_list_index_5101465`}</div>
                <div>
                  {t`features_assets_futures_futures_details_position_details_list_5101356`}{' '}
                  <span className="text-brand_color">
                    {formatCurrency(
                      selectedPosition?.lockRecord?.lockPrice,
                      Number(selectedPosition?.priceOffset || 2)
                    )}{' '}
                    {selectedPosition?.quoteSymbolName}
                  </span>
                </div>
                <div>
                  {t`features_assets_futures_common_position_list_index_5101464`}{' '}
                  <span className="text-brand_color">
                    {formatCurrency(selectedPosition?.lockRecord?.fees, offset, true)} {currencySymbol}
                  </span>
                </div>
              </div>
              <div className="footer">
                <Button
                  type="primary"
                  onClick={() => {
                    setVisibleOpenAveragePrompt(false)
                  }}
                >
                  {t`features_trade_spot_index_2510`}
                </Button>
              </div>
            </div>
          }
        />
      )}

      {/* 存在委托订单 */}
      {visibleExitEntrustOrderPrompt && selectedPosition && (
        <ExitPositionEntrustModal
          groupId={selectedPosition?.groupId}
          positionId={selectedPosition?.positionId}
          visible={visibleExitEntrustOrderPrompt}
          slotContent={errorMsgExitEntrustOrder}
          setVisible={() => {
            onCancelEntrustCallBackFn()
          }}
        />
      )}

      {/* 调整杠杆 */}
      {visibleAdjustLeverModal && selectedPosition && (
        <AdjustPositionLeverModal
          positionData={selectedPosition}
          visible={visibleAdjustLeverModal}
          setVisible={val => {
            setVisibleAdjustLeverModal(val)
            onSetVisibleActiveMoreOperate(val)
          }}
          onSuccess={() => {
            onSuccess && onSuccess()
          }}
        />
      )}

      {/* 锁仓 */}
      {activeMoreOperate === MoreOperateEnum.lock && selectedPosition && (
        <LockModal
          positionData={selectedPosition}
          visible={visibleMoreOperateModal}
          setVisible={onSetVisibleActiveMoreOperate}
          onSuccess={() => {
            onSuccess && onSuccess()
          }}
        />
      )}

      {/* 平仓 */}
      {activeMoreOperate === MoreOperateEnum.close && selectedPosition && (
        <ClosePositionModal
          positionData={selectedPosition}
          visible={visibleMoreOperateModal}
          setVisible={onSetVisibleActiveMoreOperate}
          onSuccess={() => {
            onSuccess && onSuccess()
          }}
        />
      )}

      {/* 迁移 */}
      {activeMoreOperate === MoreOperateEnum.migrate && selectedPosition && (
        <MigrateModal
          positionData={selectedPosition}
          visible={visibleMoreOperateModal}
          setVisible={onSetVisibleActiveMoreOperate}
          onSuccess={() => {
            onSuccess && onSuccess()
          }}
        />
      )}

      {/* 止盈止损 */}
      {activeMoreOperate === MoreOperateEnum.stopLimit && selectedPosition && (
        <StopLimitModal
          positionData={selectedPosition}
          type={activeTabStopPL}
          visible={activeMoreOperate === MoreOperateEnum.stopLimit}
          setVisible={onSetVisibleActiveMoreOperate}
          onSuccess={() => {
            onSuccess && onSuccess()
          }}
        />
      )}

      {/* 一键反向 - 弹框确认 */}
      {visibleReverseConfirmPrompt && (
        <AssetsPopupTips
          popupTitle={t`features_assets_futures_futures_details_position_details_list_5101360`}
          visible={visibleReverseConfirmPrompt}
          setVisible={setVisibleReverseConfirmPrompt}
          slotContent={
            <div>
              {t`features_assets_futures_common_position_list_index_89epzxl_zb86z2imwevna`}
              <span className="text-brand_color">{t`features_assets_futures_common_position_list_index_pjmgt0sw7618w0fmuhqm1`}</span>
            </div>
          }
          onOk={() => {
            if (selectedPosition) {
              onReverse(selectedPosition)
            }
            setVisibleReverseConfirmPrompt(false)
          }}
          okText={t`features_user_login_index_5101198`}
        />
      )}
      {/* 一键反向 - 开仓保证金不足提示 */}
      {visibleReverseMarginPrompt && (
        <AssetsPopupTips
          visible={visibleReverseMarginPrompt}
          setVisible={setVisibleReverseMarginPrompt}
          slotContent={
            <>
              <div>{t`features_assets_futures_common_position_list_index_5101468`}</div>
              <div className="text-brand_color">{t`features_assets_futures_common_position_list_index_5101541`}</div>
            </>
          }
          onOk={() => {
            setVisibleReverseMarginPrompt(false)
          }}
          okText={t`features_trade_spot_index_2510`}
        />
      )}
      {/* 一键反向 - 超过最大持仓数量提示 */}
      {visibleReverseMaxAmountPrompt && (
        <AssetsPopupTips
          visible={visibleReverseMaxAmountPrompt}
          setVisible={setVisibleReverseMaxAmountPrompt}
          slotContent={
            <div>
              {/* 超过最大持仓数量 */}
              {t({
                id: 'features_assets_futures_common_position_list_index_5101542',
                values: { 0: maxPositionSizeData?.size, 1: selectedPosition?.baseSymbolName },
              })}
            </div>
          }
          onOk={() => {
            setVisibleReverseMaxAmountPrompt(false)
          }}
          okText={t`features_trade_spot_index_2510`}
        />
      )}
    </div>
  )
}
