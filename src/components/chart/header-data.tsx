import { Popover } from '@nbit/arco'
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import dayjs from 'dayjs'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import { IconFindReplace, IconSettings } from '@nbit/arco/icon'
import classNames from 'classnames'
import cacheUtils from 'store'

import {
  MainIndicatorType,
  SubIndicatorType,
  SwitchTimeType,
  KLineChartType,
  timeLocaleLanguageMap,
  TradingviewIndicatorType,
  tradingviewTimeMap,
} from '@nbit/chart-utils'

import { t } from '@lingui/macro'

import Icon from '@/components/icon'
import Tabs from '@/components/tabs'
import { useMarketStore } from '@/store/market'
// import { timeLocaleLanguageMap } from './utils'
import { AutoAddMarginCheckBox } from '@/features/trade/trade-order/base'
import { fullscreen } from '@/helper/common'
import IndicatorModal from './indicator-modal'
import styles from './chart.module.css'

interface PropsType {
  currentChart: string
  setCurrentChart: (value: string) => void
  locale: string
  mainIndicator: MainIndicatorType
  setMainIndicator: (value: MainIndicatorType) => void
  setOpenChartProperties: (value: string) => void
  subIndicator: SubIndicatorType
  setSubIndicator: (value: SubIndicatorType) => void
  type: KLineChartType
  curTime: SwitchTimeType
  setCurTime: (value: SwitchTimeType) => void
  fullscreenRef: React.RefObject<HTMLDivElement>
  updateFirstLoadRef: () => void
  currentPriceType: string
  setCurrentPriceType: (v) => void
  tradingviewRef: {
    chartProperties: () => void
    insertIndicator: () => void
  } | null
}

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

enum ChartVersion {
  Tradingview = 'tradingview',
  Normal = 'normal',
  Dept = 'dept',
}

function HeaderData(props: PropsType, ref) {
  const marketState = useMarketStore()

  const initialShareTimeList = marketState.initialShareTimeList

  const [initialShareTimeListCopy, setInitialShareTimeListCopy] = useState<Array<SwitchTimeType>>(
    JSON.parse(JSON.stringify(initialShareTimeList))
  )
  const restShareTimeList = marketState.restShareTimeList

  const updateInitialShareTimeList = marketState.updateInitialShareTimeList
  const updateRestShareTimeList = marketState.updateRestShareTimeList

  const [restShareTimeListCopy, setRestShareTimeListCopy] = useState<Array<SwitchTimeType>>(
    JSON.parse(JSON.stringify(restShareTimeList))
  )

  const initialShareTimeListStorage = cacheUtils.get('initialShareTimeList') || []
  const restShareTimeListStorage = cacheUtils.get('restShareTimeList') || []

  useEffect(() => {
    if (initialShareTimeListStorage?.length) {
      updateInitialShareTimeList(initialShareTimeListStorage)
    }

    if (restShareTimeListStorage?.length) {
      updateRestShareTimeList(restShareTimeListStorage)
    }
  }, [JSON.stringify(initialShareTimeListStorage), JSON.stringify(restShareTimeListStorage)])

  useEffect(() => {
    setInitialShareTimeListCopy(JSON.parse(JSON.stringify(initialShareTimeList)))
    setRestShareTimeListCopy(JSON.parse(JSON.stringify(restShareTimeList)))
  }, [initialShareTimeList, restShareTimeList])

  const {
    currentChart,
    setCurrentChart,
    locale,
    mainIndicator,
    setMainIndicator,
    setOpenChartProperties,
    subIndicator,
    setSubIndicator,
    type,
    curTime,
    setCurTime,
    updateFirstLoadRef,
    tradingviewRef,
  } = props
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    openChartSettingModal() {
      setVisible(true)
    },
  }))

  const chartTabList = [
    { title: t`components_chart_header_data_2620`, id: ChartVersion.Normal },
    { title: 'Trading View', id: ChartVersion.Tradingview },
    { title: t`components_chart_header_data_2621`, id: ChartVersion.Dept },
  ]

  const [tempCurTime, setTempCurTime] = useState<SwitchTimeType>({
    unit: '',
    value: 0,
  })

  /** tradingview 配置 */
  const updateTecIndicator = () => {
    tradingviewRef?.chartProperties?.()
  }

  const insertIndicator = () => {
    tradingviewRef?.insertIndicator?.()
  }

  /** 切换 tab */
  const onTabChange = item => {
    if (item.id === ChartVersion.Tradingview) {
      updateFirstLoadRef()
    }
    setCurrentChart(item.id)
  }

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [popVisible, setPopVisible] = useState<boolean>(false)
  const [popPriceVisible, setPopPriceVisible] = useState<boolean>(false)
  const timePopRef = useRef<HTMLDivElement | null>(null)
  const pricePopRef = useRef<HTMLDivElement | null>(null)

  /** 点击编辑时间周期 */
  const editOrSave = e => {
    if (isEdit) {
      /** 保存 */
      cacheUtils.set('initialShareTimeList', initialShareTimeListCopy)
      cacheUtils.set('restShareTimeList', restShareTimeListCopy)
      updateInitialShareTimeList(initialShareTimeListCopy)
      updateRestShareTimeList(restShareTimeListCopy)
      setPopVisible(false)
    }
    setIsEdit(!isEdit)
    e.stopPropagation()
  }

  const updatePopupVisible = e => {
    e.stopPropagation()
    setPopVisible(true)
  }

  const updatePricePopupVisible = e => {
    e.stopPropagation()
    setPopPriceVisible(true)
  }

  /** 移除时间 */
  const removeSelectTime = (e, item) => {
    e.stopPropagation()

    if (isEdit) {
      const list = initialShareTimeListCopy.filter(_item => {
        return `${item.unit}${item.value}` !== `${_item.unit}${_item.value}`
      })

      setInitialShareTimeListCopy(list)

      setRestShareTimeListCopy(restShareTimeListCopy.concat([item]))
      return
    }

    setCurTime(item)
    setTempCurTime({
      unit: '',
      value: 0,
    })
    setPopVisible(false)
  }

  /** 新增时间 */
  const addSelectTime = (e, item) => {
    e.stopPropagation()

    if (isEdit) {
      const list = restShareTimeListCopy.filter(_item => {
        return `${item.unit}${item.value}` !== `${_item.unit}${_item.value}`
      })

      setRestShareTimeListCopy(list)

      setInitialShareTimeListCopy(initialShareTimeListCopy.concat([item]))
      return
    }

    setCurTime(item)
    setTempCurTime(item)
    setPopVisible(false)
  }

  /** 打开指标设置 */
  const openChartSetting = () => {
    setVisible(true)
  }

  /** 点击页面 */
  const handleDocumentClick = e => {
    if (!timePopRef.current && !pricePopRef.current) {
      return
    }
    /** 点击弹窗之内的，不关闭；点击弹窗之外的，关闭 */
    if (!timePopRef.current?.contains(e.target as Node) && timePopRef.current !== e.target) {
      setPopVisible(false)
    }

    /** 点击弹窗之内的，不关闭；点击弹窗之外的，关闭 */
    if (!pricePopRef.current?.contains(e.target as Node) && pricePopRef.current !== e.target) {
      setPopPriceVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  const sortInitialShareTimeListCopy: Array<SwitchTimeType & { isInit: boolean }> = Object.assign(
    [],
    initialShareTimeListCopy.map(item => {
      return {
        ...item,
        isInit: true,
      }
    })
  )

  const sortRestShareTimeListCopy: Array<SwitchTimeType & { isInit: boolean }> = Object.assign(
    [],
    restShareTimeListCopy.map(item => {
      return {
        ...item,
        isInit: false,
      }
    })
  )

  const totalShareTimeListCopy = sortInitialShareTimeListCopy.concat(sortRestShareTimeListCopy)

  totalShareTimeListCopy?.sort((a, b) => {
    return Number(tradingviewTimeMap[`${a.value}${a.unit}`]) - Number(tradingviewTimeMap[`${b.value}${b.unit}`])
  })

  sortInitialShareTimeListCopy?.sort((a, b) => {
    return Number(tradingviewTimeMap[`${a.value}${a.unit}`]) - Number(tradingviewTimeMap[`${b.value}${b.unit}`])
  })

  sortRestShareTimeListCopy?.sort((a, b) => {
    return Number(tradingviewTimeMap[`${a.value}${a.unit}`]) - Number(tradingviewTimeMap[`${b.value}${b.unit}`])
  })

  const _initialShareTimeList = JSON.parse(JSON.stringify(initialShareTimeList))

  _initialShareTimeList?.sort((a, b) => {
    return Number(tradingviewTimeMap[`${a.value}${a.unit}`]) - Number(tradingviewTimeMap[`${b.value}${b.unit}`])
  })

  const contractList = [
    {
      value: 'perpetual_kline',
      title: t`constants_order_5101075`,
    },
    {
      value: 'perpetual_market_kline',
      title: t`future.funding-history.index-price.column.mark-price`,
    },
    {
      value: 'perpetual_index_kline',
      title: t`future.funding-history.index-price.column.index-price`,
    },
  ]

  return (
    <div className="k-set-wrap">
      <div className="left-wrap">
        <div className="tile">
          <div
            className="tile-scroll"
            style={{
              maxWidth: currentChart === ChartVersion.Normal ? 'calc(100% - 100px)' : 'calc(100% - 128px)',
              marginLeft: 0,
              overflowX: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {currentChart !== ChartVersion.Dept &&
              _initialShareTimeList.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurTime(item)
                      setTempCurTime({
                        unit: '',
                        value: 0,
                      })
                    }}
                    style={{ marginLeft: !index ? 0 : '12px' }}
                    className={classNames({
                      'tile-time': curTime.value === item.value && curTime.unit === item.unit,
                      'tile-unuse-time': curTime.value !== item.value || curTime.unit !== item.unit,
                    })}
                  >
                    {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}
                  </div>
                )
              })}
          </div>
          {currentChart !== ChartVersion.Dept && (
            <div onClick={updatePopupVisible}>
              <Popover
                trigger="click"
                defaultPopupVisible={false}
                popupVisible={popVisible}
                title=""
                position="bl"
                className={styles.time}
                getPopupContainer={() => document.getElementById('fullscreen') as HTMLElement}
                content={
                  <div className="time-wrap" ref={timePopRef}>
                    <div className="edit" onClick={editOrSave}>
                      {!isEdit ? t`assets.common.edit` : t`components_chart_header_data_2622`}
                    </div>
                    <div className="have-select not-select">
                      {totalShareTimeListCopy.map(item => {
                        if (item.isInit) {
                          return (
                            <div
                              onClick={e => removeSelectTime(e, item)}
                              className="time bg-brand_color_special_02"
                              key={`${item.unit}${item.value}`}
                            >
                              {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}

                              {isEdit ? <Icon className="sub-icon" name={'spot_time_delete_white'} /> : null}
                            </div>
                          )
                        }
                        return (
                          <div onClick={e => addSelectTime(e, item)} className="time" key={`${item.unit}${item.value}`}>
                            {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}

                            {isEdit ? <Icon className="add-icon" name={'spot_time_add'} /> : null}
                          </div>
                        )
                      })}
                    </div>
                    {/* <div className="add-title">{t`components_chart_header_data_2623`}</div> */}
                    {/* <div className="not-select">
                      {sortRestShareTimeListCopy.map(item => {
                        return (
                          <div onClick={e => addSelectTime(e, item)} className="time" key={`${item.unit}${item.value}`}>
                            {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}

                            {isEdit ? <Icon className="add-icon" name={'spot_time_add'} /> : null}
                          </div>
                        )
                      })}
                    </div> */}
                  </div>
                }
              >
                {tempCurTime.value ? (
                  <span className="select-temp">
                    {timeLocaleLanguageMap[locale][`${tempCurTime.value}${tempCurTime.unit}`]}
                  </span>
                ) : (
                  <span className="more">{t`More`}</span>
                )}
                <Icon className="more-icon" name={'arrow_open'} hasTheme />
              </Popover>
            </div>
          )}
          {currentChart !== ChartVersion.Dept && props.type === KLineChartType.Futures && (
            <div onClick={updatePricePopupVisible}>
              <Popover
                trigger="click"
                defaultPopupVisible={false}
                popupVisible={popPriceVisible}
                title=""
                position="bl"
                className={styles.price}
                getPopupContainer={() => document.getElementById('fullscreen') as HTMLElement}
                content={
                  <div className="time-wrap" ref={pricePopRef}>
                    {contractList.map(item => {
                      return (
                        <div
                          className={classNames('row', {
                            'text-brand_color': props.currentPriceType === item.value,
                            'text-text_color_01': props.currentPriceType !== item.value,
                          })}
                          key={item.value}
                          onClick={e => {
                            e.stopPropagation()
                            setPopPriceVisible(false)
                            props.setCurrentPriceType(item.value)
                          }}
                        >
                          {item.title}
                        </div>
                      )
                    })}
                  </div>
                }
              >
                <span className="select-temp">
                  {
                    contractList.find(item => {
                      return item.value === props.currentPriceType
                    })?.title
                  }
                </span>
                <Icon className="more-icon" name={'arrow_open'} hasTheme />
              </Popover>
            </div>
          )}
          {currentChart === ChartVersion.Normal && (
            <Icon className="k-set-icon" onClick={openChartSetting} name="indicator_settings_white" />
          )}
          {currentChart === ChartVersion.Tradingview && (
            <IconSettings className="tradingview-set-icon k-set-icon" onClick={updateTecIndicator} />
          )}
          {currentChart === ChartVersion.Tradingview && (
            <IconFindReplace className="tradingview-set-icon k-set-icon" onClick={insertIndicator} />
          )}
        </div>
      </div>
      {(type === KLineChartType.Quote || type === KLineChartType.Futures) && (
        <div className="right-wrap">
          <Tabs classNames="chart-tab" mode="text" onChange={onTabChange} tabList={chartTabList} value={currentChart} />
          {isFullScreen ? (
            <Icon
              onClick={() => {
                fullscreen(isFullScreen, props.fullscreenRef, setIsFullScreen)
              }}
              hasTheme
              name="icon_cancel_full"
              className="full-icon"
            />
          ) : (
            <Icon
              onClick={() => {
                fullscreen(isFullScreen, props.fullscreenRef, setIsFullScreen)
              }}
              hasTheme
              name="icon_full"
              className="full-icon"
            />
          )}
        </div>
      )}
      <IndicatorModal
        visible={visible}
        setVisible={setVisible}
        mainIndicator={mainIndicator}
        setMainIndicator={setMainIndicator}
        subIndicator={subIndicator}
        setSubIndicator={setSubIndicator}
      />
    </div>
  )
}

export default forwardRef(HeaderData)
