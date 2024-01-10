import { Depth, Depth_Data } from '@/plugins/ws/protobuf/ts/proto/Depth'
import { formatNumberDecimal } from '@/helper/decimal'
import { baseOrderBookStore } from '@/store/order-book'

export enum MergeDepthDefaultTypeEnum {
  doubleDigits = '0.01',
}

export enum DecimalPrecisionTypeEnum {
  default = 0.95, // 取整的默认精度值
}

export enum OrderBookLimitTypeEnum {
  default = 1,
  double = 2,
}

export enum OrderBookListLimitEnum {
  ten = 10, // 10 条
  twenty = 20, // 20 条
  forty = 40, // 40 条
}

export enum ContainerHeightTypeEnum {
  headerAndTickHeight = 127,
  cellHeight = 20,
}

export enum OrderBookBizEnum {
  spot = 'spot',
  perpetual = 'perpetual',
}

export enum OrderBookTypeEnum {
  depth = 'depth', // 现货深度数据
  deal = 'deal', // 现货实时成交
  market = 'market', // 现货最新价
  perpetualDepth = 'perpetual_depth', // 合约深度数据
  perpetualMarket = 'perpetual_market', // 合约最新价
  perpetualIndex = 'perpetual_index', // 标记价格/指数价格
}

export enum OrderBookButtonTypeEnum {
  buy = 1, // 买盘
  sell, // 卖盘
  primary, // 买卖盘
}

/** 盘口数据传入方式 */
export enum OrderBookDataTypeEnum {
  base = 'base', // 基础
  specialized = 'specialized', // 专业
  lever = 'lever', // 杠杆
}

export enum MergeDepthValueEnum {
  noDecimalPoint = 0,
  singleDigit = 1,
  doubleDigits = 2,
  ten = 10,
  twenty = 20,
  thirty = 30,
  forty = 40,
  fifty = 50,
  oneHundred = 100,
}

export interface OrderBookBuyAndSellContainerProps {
  quantity: number
  targetCoin: string
  denominatedCurrency: string
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  contentWidth: number
  tradeMode: string
}

export interface EntrustType {
  buyEntrustPrice: Array<number>
  sellEntrustPrice: Array<number>
}

export interface OrderBookDepthDataType extends Depth_Data {
  volumeInitialValue: string
  popAveragePrice: string
  popVolume: string
  totalInitialValue: string
  turnover: string
  turnoverInitialValue: string
  popTurnover: string
  grandTotal: string
  bodyWidth?: number
  isEntrust?: boolean
  tagPrice: string
}
/** 现货 subs 配置 */
export const OrderBookSpotDepthSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.spot,
    type: OrderBookTypeEnum.depth,
    granularity: '',
    contractCode: code,
  }
}

export const OrderBookSpotMarketSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.spot,
    type: OrderBookTypeEnum.market,
    granularity: '',
    contractCode: code,
  }
}

/** 合约 subs 配置 */
export const OrderBookContractDepthSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.perpetual,
    type: OrderBookTypeEnum.perpetualDepth,
    granularity: '',
    contractCode: code,
  }
}

export const OrderBookContractMarketSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.perpetual,
    type: OrderBookTypeEnum.perpetualMarket,
    granularity: '',
    contractCode: code,
  }
}

export const OrderBookContractMarkPriceSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.perpetual,
    type: OrderBookTypeEnum.perpetualIndex,
    granularity: '',
    contractCode: code,
  }
}

// 深度盘口
export const DeepHandicapOptions = [15, 30, 50, 70] // 数字为展示的条数
const repeatString = '0'

// 盘口精度映射 最多 10 位
export const HandicapAccuracy = {
  '0.0000000001': 10,
  '0.000000001': 9,
  '0.00000001': 8,
  '0.0000001': 7,
  '0.000001': 6,
  '0.00001': 5,
  '0.0001': 4,
  '0.001': 3,
  '0.01': 2,
  '0.1': 1,
}

export function getGearNumbers(height: number, mode: number): number {
  const cellContainerHeight = height - ContainerHeightTypeEnum.headerAndTickHeight

  const num =
    mode !== OrderBookButtonTypeEnum.primary
      ? cellContainerHeight / ContainerHeightTypeEnum.cellHeight
      : cellContainerHeight / OrderBookLimitTypeEnum.double / ContainerHeightTypeEnum.cellHeight

  const floorValue = Math.floor(num)
  const decimal = num - floorValue
  // 高度条数后两位小数大于 0.95 Math.round 向上取整，否则 Mach.floor 向下取整
  return decimal < DecimalPrecisionTypeEnum.default ? Math.floor(num) : Math.round(num)
}

export function formatNumberUnit(num: string, mergeDepth: number) {
  if (Number(num) < 1e3) return num
  if (mergeDepth < 0) mergeDepth = 0
  const abbrev = ['', 'K', 'M', 'B', 'T']
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(Number(num))) / 3)
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
  const suffix = abbrev[order]

  return formatNumberDecimal(Number(num) / 10 ** (order * 3), mergeDepth) + suffix
}

/**
 * @description: 获取不同 mergeDepth 的刻度值
 * @param {*} price
 * @param {*} mergeDepth
 */
function formatNumber(price, mergeDepth) {
  price = String(Math.floor(price))
  if (mergeDepth === '1') {
    return price
  }

  /**
   * @description: 通过价格长度减去 Math.ceil(Math.log10(mergeDepth)) - 1 获取刻度值
   * Math.log10以10为底的对数 比如 10 = 1, 100 = 2
   * Math.ceil 四舍五入大于等于给定数字的最小整数 比如 0.95 = 1
   */
  const num = price.length - Math.ceil(Math.log10(mergeDepth)) - 1
  const startNum = price.slice(0, num)
  const endNum = price.slice(num, price.length)
  const resultEndNum = mergeDepth * Math.floor(endNum / mergeDepth) || repeatString.repeat(mergeDepth.length)
  return `${startNum}${resultEndNum}`
}
/**
 * @description: 根据合并精度获取向下约的价格<<刻度值>>
 */
function getTagPriceByMergeDepth(price: string, mergeDepth: string, isSell: boolean) {
  if (mergeDepth in HandicapAccuracy) {
    return formatNumberDecimal(price, HandicapAccuracy[mergeDepth], isSell)
  }
  return formatNumber(price, mergeDepth)
}

export const HandlingEmptyData = (quantity?: number) => {
  return new Array(quantity || OrderBookListLimitEnum.forty).fill({
    price: '--',
    tagPrice: '--',
    volume: '--',
    volumeInitialValue: '--',
    turnover: '--',
    turnoverInitialValue: '--',
    grandTotal: '--',
    popAveragePrice: '--',
    popVolume: '--',
    popTurnover: '--',
    bodyWidth: 0,
  })
}
class OrderBookDepthData {
  /** 价格 */
  public price: string

  /** 精度价格 */
  public tagPrice: string

  /** 数量 */
  public volume: string

  /** 成交额 */
  public turnover: string

  /** 乘积缓存 价格乘以数量 */
  public productCache: number

  /** 成交额初始值 */
  public turnoverInitialValue: string

  /** 累计 */
  public grandTotal: number

  /** 弹窗平均价 */
  public popAveragePrice: string

  /** 弹窗数量 */
  public popVolume: string

  /** 合计原始值 */
  public totalInitialValue: string

  /** 弹窗合计 */
  public popTurnover: string

  /** 弹窗宽度 */
  public bodyWidth: number

  /** 是否有委托订单 */
  public isEntrust: boolean

  /** 合并精度 */
  public priceMergeDepth: number

  public dataList: OrderBookDepthDataType[]

  public accumulate: number

  public popVolumeTemporary: number

  public popTurnoverTemporary: number

  public popAveragePriceTemporary: number

  public grandTotalDecimal: string

  /** 未格式化的数量 */
  public volumeInitialValue: string

  /** 价格映射 */
  public listMap: { [key: string]: any }

  public cacheData: any

  public resultVal: any

  constructor() {
    this.price = ''
    this.tagPrice = ''
    this.volume = ''
    this.productCache = 0
    this.turnover = ''
    this.turnoverInitialValue = ''
    this.grandTotal = 0
    this.popAveragePrice = ''
    this.popVolume = ''
    this.totalInitialValue = ''
    this.popTurnover = ''
    this.bodyWidth = 0
    this.isEntrust = false
    this.dataList = []
    this.priceMergeDepth = 0
    this.accumulate = 0
    this.popVolumeTemporary = 0
    this.popTurnoverTemporary = 0
    this.popAveragePriceTemporary = 0
    this.grandTotalDecimal = ''
    this.volumeInitialValue = ''
    this.listMap = {}
    this.cacheData = {}
    this.resultVal = {}
  }
}

/** 单例对象 */
export const DepthDataObject = (() => {
  let instance: OrderBookDepthData | null = null

  const createInstance = () => {
    return new OrderBookDepthData()
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    },
    destroyInstance: () => {
      instance = null
    },
  }
})()

const DepthData = DepthDataObject.getInstance()

export const HandleDecimalPoint = (list: Depth_Data[], mergeDepth: string, entrust: Array<number>, isSell: boolean) => {
  let { dataList, listMap, tagPrice, isEntrust, price, volume, cacheData, resultVal } = DepthData

  dataList = []
  listMap = {}

  list.forEach((v: Depth_Data) => {
    resultVal = { ...v }
    tagPrice = getTagPriceByMergeDepth(resultVal?.price || '0', mergeDepth, isSell)
    isEntrust = entrust?.includes(Number(resultVal.price)) || false
    price = resultVal.price
    volume = resultVal.volume

    // 根据精度换算出的相同价格处理
    cacheData = listMap[tagPrice]
    if (cacheData) {
      listMap[tagPrice] = {
        price,
        tagPrice,
        volume: Number(cacheData.volume) + Number(volume),
        isEntrust,
      }
    } else {
      listMap[tagPrice] = {
        price,
        volume,
        isEntrust,
        tagPrice,
      }
    }
  })

  Object.keys(listMap).forEach(key => {
    dataList.push({ ...listMap[key] })
  })

  return dataList
}

export const HandleDepthData = (data: Depth, entrust: EntrustType) => {
  let bidsList: OrderBookDepthDataType[] = []
  let asksList: OrderBookDepthDataType[] = []

  const { wsDepthConfig } = baseOrderBookStore.getState()

  if (data.bids?.length > 0) {
    const mirrorList = [...data.bids]

    bidsList = HandleDecimalPoint(mirrorList, wsDepthConfig.mergeDepth, entrust?.buyEntrustPrice, false)
    bidsList.sort((a, b) => Number(b?.tagPrice) - Number(a?.tagPrice))
  }

  if (!data.bids || data.bids?.length < 1) {
    bidsList = HandlingEmptyData()
  }

  if (data.asks?.length > 0) {
    const mirrorList = [...data.asks]

    asksList = HandleDecimalPoint(mirrorList, wsDepthConfig.mergeDepth, entrust?.sellEntrustPrice, true)
    asksList.sort((a, b) => Number(a?.tagPrice) - Number(b?.tagPrice))
  }

  if (!data.asks || data.asks?.length < 1) {
    asksList = HandlingEmptyData()
  }
  return { bidsList, asksList }
}

export const HandleCurrencyPair = (currencyPair: string) => {
  let targetCoin = ''
  let denominatedCurrency = ''

  if (currencyPair && currencyPair.includes('_')) {
    const currencyList = currencyPair.toLocaleUpperCase().split('_')
    targetCoin = currencyList[0]
    denominatedCurrency = currencyList[1]
  }
  return { targetCoin, denominatedCurrency }
}

/** 处理盘口当前档位统计数值 */
export const handleOrderBookPopUpValue = (data: OrderBookDepthDataType[]) => {
  if (!data || data[0]?.price === '--') return data

  const { wsDepthConfig } = baseOrderBookStore.getState()

  const list = [...data]
  let dataList: OrderBookDepthDataType[] = []

  let {
    popVolumeTemporary,
    popTurnoverTemporary,
    popAveragePriceTemporary,
    popAveragePrice,
    popVolume,
    popTurnover,
    priceMergeDepth,
    price,
    volume,
    turnover,
    turnoverInitialValue,
    volumeInitialValue,
    totalInitialValue,
    grandTotal,
    grandTotalDecimal,
    accumulate,
    tagPrice,
    productCache,
  } = DepthData

  popVolumeTemporary = 0
  popTurnoverTemporary = 0
  popAveragePriceTemporary = 0
  accumulate = 0

  // 价格精度
  priceMergeDepth =
    wsDepthConfig.mergeDepth && HandicapAccuracy[wsDepthConfig.mergeDepth]
      ? HandicapAccuracy[wsDepthConfig.mergeDepth]
      : wsDepthConfig.mergeDepth && Number(wsDepthConfig.mergeDepth) >= MergeDepthValueEnum.noDecimalPoint
      ? MergeDepthValueEnum.noDecimalPoint
      : MergeDepthValueEnum.doubleDigits

  list.forEach((v, index) => {
    tagPrice = formatNumberDecimal(v.tagPrice, priceMergeDepth)
    price = formatNumberDecimal(v.price, priceMergeDepth)
    volume = formatNumberDecimal(v.volume, wsDepthConfig.amountOffset)
    productCache = Number(tagPrice) * Number(volume)
    volumeInitialValue = formatNumberDecimal(v.volume, wsDepthConfig.amountOffset)
    totalInitialValue = formatNumberDecimal(Number(v.volume) + popVolumeTemporary, wsDepthConfig.amountOffset)
    turnoverInitialValue = formatNumberDecimal(productCache, wsDepthConfig.fiatOffest)
    turnover = formatNumberDecimal(productCache, wsDepthConfig.priceOffset)
    grandTotal = accumulate + Number(v.volume)
    grandTotalDecimal = formatNumberDecimal(grandTotal, wsDepthConfig.amountOffset)

    popAveragePrice = formatNumberDecimal(Number(v.tagPrice) + popAveragePriceTemporary, wsDepthConfig.priceOffset)
    popVolume = formatNumberDecimal(Number(v.volume) + popVolumeTemporary, wsDepthConfig.amountOffset)
    popTurnover = formatNumberDecimal(productCache + popTurnoverTemporary, wsDepthConfig.priceOffset)

    popVolumeTemporary = Number(popVolume)
    popTurnoverTemporary = Number(popTurnover)
    popAveragePriceTemporary = Number(popAveragePrice)
    accumulate = grandTotal

    popAveragePrice = formatNumberDecimal(Number(popAveragePrice) / (index + 1), wsDepthConfig.priceOffset)
    popVolume = formatNumberUnit(popVolume, wsDepthConfig.amountOffset - 1)
    popTurnover = formatNumberUnit(popTurnover, wsDepthConfig.priceOffset - 1)
    turnoverInitialValue = formatNumberUnit(turnoverInitialValue, wsDepthConfig.fiatOffest - 1)
    turnover = formatNumberUnit(turnover, wsDepthConfig.priceOffset - 1)

    dataList.push({
      ...v,
      price,
      tagPrice,
      volume,
      grandTotal: grandTotalDecimal,
      popAveragePrice,
      popVolume,
      popTurnover,
      turnover,
      turnoverInitialValue,
      volumeInitialValue,
      totalInitialValue,
    })
  })

  return dataList
}
