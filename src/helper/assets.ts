import { Message } from '@nbit/arco'
import { getCoinRate, getOverviewAsset } from '@/apis/assets/common'
import {
  getCoinBalance,
  getCoinInfoList,
  getSubCoinInfoList,
  getWithdrawAddressList,
  checkUserWithdraw,
} from '@/apis/assets/main'
import { AllCoinListResp, ICoinBalanceDataList, AssetsListResp, CoinRateResp } from '@/typings/api/assets/assets'
import { baseAssetsStore, defaultCoinAsset } from '@/store/assets'
import { baseMarketStore } from '@/store/market'
import { formatCurrency, formatNumberDecimal, removeDecimalZero } from '@/helper/decimal'
import { getIsLogin } from '@/helper/auth'
// import { ICrossPairAssetsReq } from '@/typings/api/assets/margin'
import { basePersonalCenterStore } from '@/store/user/personal-center'
import { getMyAssetsDataProps, IUserAssetsSpot, IResultAllCoinList } from '@/typings/assets'
import { TradeModeEnum } from '@/constants/trade'
import { CurrencySymbolEnum, CoinListTypeEnum, CurrencyNameEnum, DefaultRateBaseCoin } from '@/constants/assets'
import { decimalUtils } from '@nbit/utils'
import Decimal from 'decimal.js'
import { storeEnumsToOptions } from '@/helper/store'
import { IStoreEnum } from '@/typings/store/common'
import { getUserAssetsFutures } from '@/helper/assets/futures'
import { baseAssetsFuturesStore } from '@/store/assets/futures'
import { t } from '@lingui/macro'
import { baseLayoutStore } from '@/store/layout'
import { extractMetaData } from './layout/metadata'

type getAllCoinListProps = {
  /** type: 1，充值，2、提币， */
  type: number
  /** 币种数量 */
  coinId?: string | number
}
/**
 * 获取所有主币列表
 */
export const getAllCoinList = async (params: getAllCoinListProps) => {
  const { type = CoinListTypeEnum.deposit, coinId } = params
  const resData: IResultAllCoinList = { coinList: null, coinInfo: null }
  const assetsStore = baseAssetsStore.getState()
  /**
   * 根据币 id 查币信息
   * @param coinList
   * @param id  币 id
   * @returns
   */
  const getCoinInfoByCoinId = (coinList: AllCoinListResp[], id: string | number) => {
    const coinInfo = coinList.filter(item => {
      return `${item.id}` === `${id}`
    })[0]
    if (!coinInfo) return null

    return coinInfo
  }

  /** 获取币币列表数据，将数据存到 store */
  const saveCoinListToStore = async () => {
    const res = await getCoinInfoList({ type })
    const results = res.data?.coinList
    if (res.isOk && results) {
      assetsStore.updateAllCoinInfoList(results)
    }

    return results
  }

  // 先从 store 里取，store 里没值再从接口获取数据
  let coinList: AllCoinListResp[] = assetsStore.allCoinInfoList
  const listData = await saveCoinListToStore()
  if (listData) coinList = listData

  if (coinList && coinList.length > 0) {
    resData.coinList = coinList
    if (coinId) resData.coinInfo = getCoinInfoByCoinId(coinList, coinId)
  }

  return resData
}

/**
 * 获取资产总览
 */
export const getAssetsOverview = async () => {
  const res = await getOverviewAsset({})
  const { isOk, data } = res || {}
  if (!isOk || !data) {
    return null
  }
  return data
}
/**
 * 获取资产总览
 */
export const onGetAssetsOverview = async () => {
  const { assetsModule } = baseAssetsStore.getState()
  const res = await getOverviewAsset({})
  const { isOk, data } = res || {}
  if (!isOk || !data) {
    return null
  }
  assetsModule.updateAssetsModule({ assetsData: data })
  return data
}

/**
 * 根据主币获取子币列表
 */
export const getSubCoinList = async (coinId: string) => {
  let params = { coinId }
  const res = await getSubCoinInfoList(params)
  let results = res.data?.subCoinList
  if (res.isOk && results) {
    return results
  }
  return null
}

/**
 * 根据常用提币地址
 */
export const getWithdrawAddress = async () => {
  const res = await getWithdrawAddressList({})
  let results = res.data?.addressList
  if (res.isOk && results) {
    return results
  }
  return null
}

/**
 * 获取相应币种精度
 * @params symbol
 * @return 当前币种精度，默认为 2 位
 */
export const getCoinPrecision = (symbol: string) => {
  const assetsStore = baseAssetsStore.getState()
  // 异常时默认 2 个精度
  const defaultPrecision = 2
  const { coinRate } = assetsStore.coinRate
  if (!symbol || !coinRate || coinRate.length === 0) {
    return defaultPrecision
  }

  const targetCoin: any = coinRate.find((item: any) => {
    return symbol?.toUpperCase() === (item?.symbol || '').toUpperCase()
  })

  return targetCoin?.coinPrecision || defaultPrecision
}

/**
 * 格式化币种数量 - 处理币种精度，不补零
 * @param symbol 币种符号
 * @param amount 币种数量
 * @param isFormat 是否格式化位千分位展示
 * @returns
 */
export const formatCoinAmount = (symbol, amount, isFormat = true) => {
  amount = `${formatNumberDecimal(amount, getCoinPrecision(symbol))}`
  amount = removeDecimalZero(amount)
  if (isFormat) {
    return formatCurrency(amount, getCoinPrecision(symbol), false)
  }
  return amount
}

type RateFilterReq = {
  /** 币种数量 */
  amount: string | number
  /** 币种符号 - 币对换算用标的币符号，默认折合 USDT */
  symbol?: string
  /** 折算后的法币，默认用户设置的法币，也可转成指定的法币如:CNY|| USD */
  rate?: string
  /** 换算后金额展示单位 */
  unit?: CurrencySymbolEnum
  /** 是否展示换算后金额的单位，默认展示金额单位 */
  showUnit?: boolean
  /** 是否千分位格式化，默认格式化，只有 showUnit 为 false 时生效 */
  isFormat?: boolean
  /** 法币精度 默认为 2 */
  precision?: number
}
/**
 * 根据相应币种进行汇率换算
 * @param amount 数量
 * @param symbol 币种符号 - 币对换算用标的币符号，默认折合 USDT
 * @param rate 折算法币：默认走用户设置的法币汇率，也可指定的法币汇率 - 如:CNY|| USD
 * @param unit 货币单位：CurrencySymbolEnum.symbol 货币符号 (例：$)，CurrencySymbolEnum.code：货币代码（例:USD），默认货币符号
 * @param showUnit 是否显示货币单位，默认显示
 * @param isFormat 是否千分位格式化，默认不格式化，只有 showUnit 为 false 时生效
 * @param precision 法币精度
 * @returns 汇率换算后的金额
 */
export const rateFilter = (params: RateFilterReq) => {
  const {
    amount,
    symbol = '',
    rate = '',
    unit = CurrencySymbolEnum.symbol,
    showUnit = true,
    isFormat = false,
    precision = 2,
  } = params

  if (!amount) {
    return '--'
  }

  let newAssets: string | number | Decimal = amount
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const assetsStore = baseAssetsStore.getState()
  // 获取用户设置的法币信息 - 换算成用户设置的法币资产，cny 或 usd
  const { currencySymbol, currencyEnName } = basePersonalCenterStore.getState().fiatCurrencyData
  // 币种汇率信息
  const { legalCurrencyRate = {}, coinRate = [] } = assetsStore.coinRate

  const targetCoin: any = coinRate.find((item: any) => {
    return symbol?.toUpperCase() === (item?.symbol || '').toUpperCase()
  })

  if (targetCoin) {
    // 先转成 USDT 的数量，再通过 USDT 汇率折合成对应的法币金额
    newAssets = SafeCalcUtil.mul(amount, targetCoin.usdtRate)
  }

  // 汇率接口优化了，之前返回的美元汇率，现在返回法币汇率 - 以前逻辑：得到当前 usd 数量，和产品确认要先折合成 usd，再折合成对应的法币
  // newAssets = SafeCalcUtil.mul(newAssets, usdRate)

  // 用户设置的汇率
  if (!rate) {
    newAssets = SafeCalcUtil.mul(newAssets, legalCurrencyRate[currencyEnName?.toUpperCase()])
  } else {
    newAssets = SafeCalcUtil.mul(newAssets, legalCurrencyRate[rate?.toUpperCase()])
  }

  if (showUnit) {
    // 金额格式化
    newAssets = formatCurrency(newAssets, precision)
    if (unit === CurrencySymbolEnum.code) {
      // 货币简称在后面
      newAssets = `${newAssets} ${currencyEnName}`
    } else {
      // 货币符号在前面
      newAssets = `${currencySymbol}${newAssets}`
    }
  } else {
    if (isFormat) {
      // 金额格式化
      newAssets = formatCurrency(newAssets, precision)
    }
  }

  return `${newAssets}`
}

/**
 * 合约法币资产汇率换算
 * 计算逻辑：合约返回 USD，如果用户设置 USD 直接展示，如果用户设置 CNY，需要转换成 CNY
 * 非 USD 的计算公式：USD 数量 / USDT 汇率 * 用户设置的汇率 -- 先将 USD 数量转成 USDT 的数量，再通过 USDT 汇率折合成对应的法币金额
 * @param amount 合约数量 - 单位 USD
 * @param unit 货币单位：CurrencySymbolEnum.symbol 货币符号 (例：$)，CurrencySymbolEnum.code：货币代码（例:USD），默认货币符号
 * @param showUnit 是否显示货币单位，默认显示
 * @param isFormat 是否千分位格式化，默认格式化，只有 showUnit 为 false 时生效
 * @param precision 法币精度
 * @param symbol 法币符号：当前法币符号，默认合约商户设置法币符号
 * @param rate 折算后法币：默认走用户设置的法币汇率，也可指定的法币汇率 - 如:CNY|| USD
 * @returns 汇率换算后的金额
 */
export const rateFilterFutures = (params: RateFilterReq) => {
  const {
    amount = 0,
    unit = CurrencySymbolEnum.symbol,
    showUnit = true,
    isFormat = true,
    precision = 2,
    symbol = '',
    rate = '',
  } = params

  let newAssets: string | number | Decimal = amount
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const assetsStore = baseAssetsStore.getState()
  const assetsFuturesStore = baseAssetsFuturesStore.getState()
  // 获取商户设置的法币信息
  const {
    futuresCurrencySettings: { currencySymbol: currencySymbolFutures, offset },
  } = { ...assetsFuturesStore }
  // 获取用户设置的法币信息
  const { currencySymbol, currencyEnName } = basePersonalCenterStore.getState().fiatCurrencyData
  const currentSymbol = symbol || currencySymbolFutures

  // rate 有值时折算前的法币符号等于折算后的法币符号比较；rate 没值时和用户设置的法币比较，相等直接返回数值
  if (
    (rate && currentSymbol?.toUpperCase() === rate?.toUpperCase()) ||
    (!rate && currentSymbol?.toUpperCase() === currencyEnName?.toUpperCase())
  ) {
    newAssets = amount
  } else {
    const { legalCurrencyRate = {}, coinRate = [] } = assetsStore.coinRate
    /** 要折算的法币汇率 - 默认拿用户设置的法币 */
    const currencyRate = legalCurrencyRate[rate || currencyEnName?.toUpperCase()]
    /** USDT 币种汇率 */
    const usdtRateInfo: any = coinRate.find((item: any) => {
      return (item?.symbol || '').toUpperCase() === DefaultRateBaseCoin.symbol?.toUpperCase()
    })

    // 计算公式：USD 数量 / USDT 汇率 * 用户设置的汇率
    if (usdtRateInfo && currencyRate) {
      newAssets = SafeCalcUtil.div(amount, usdtRateInfo.usdtRate)
      newAssets = SafeCalcUtil.mul(newAssets, currencyRate)
    }
  }
  if (isNaN(Number(newAssets))) {
    newAssets = 0
  }
  if (showUnit && isFormat) {
    // 金额格式化
    newAssets = formatCurrency(newAssets, precision)
    if (unit === CurrencySymbolEnum.code) {
      // 货币简称在后面
      newAssets = `${newAssets} ${currencyEnName}`
    } else {
      // 货币符号在前面
      newAssets = `${currencySymbol}${newAssets}`
    }
  } else {
    if (isFormat) {
      // 不展示单位，但是需要千分位格式化
      newAssets = formatCurrency(newAssets, precision)
    }
  }

  return `${newAssets}`
}

type RateFilterCoinQuantityReq = {
  /** 币种数量 */
  amount: string | number
  /** 币种代码 */
  symbol?: string
  /** 换算后金额展示单位 */
  unit?: string
  /** 是否展示换算后金额的单位，默认展示金额单位 */
  showUnit?: boolean
  /** 汇率换算的规则，默认跟随用户设置 */
  rate?: string
  /** 法币精度 默认为 2 */
  precision?: number
  isFormat?: boolean
  /** 法币 symbol */
  currencySymbol?: string
}

/**
 * 法币金额换算成币种数量
 * 法币数量 / 当前法币汇率 / 当前币种汇率
 * @param amount 法币数量
 * @param currencySymbol 法币
 * @param symbol 币种
 */
export const rateFilterCoinQuantity = (params: RateFilterCoinQuantityReq) => {
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const { amount, currencySymbol = CurrencyNameEnum.usd, symbol } = params || {}
  const assetsStore = baseAssetsStore.getState()
  const { legalCurrencyRate = {}, coinRate = [] } = assetsStore.coinRate

  if (!amount || !symbol) return 0

  const rate = legalCurrencyRate[currencySymbol]
  const coinRateInfo = coinRate.find((item: CoinRateResp) => item?.symbol === symbol) || ({} as CoinRateResp)

  return +SafeCalcUtil.div(SafeCalcUtil.div(amount, rate), coinRateInfo?.usdtRate) || 0
}

/** 法币汇率折合排序 */
export function sortCurrencyAssetsFn(a: AssetsListResp, b: AssetsListResp) {
  return (b.usdBalance as unknown as number) - (a.usdBalance as unknown as number)
}

/**
 * ws 资产回调数据处理，更新资产列表
 * @param assetList
 * @param data
 * @returns
 */
export const getAssetListWS = (assetList, data) => {
  try {
    const { coinId, balance, locked, total } = data

    // 更新变更的资产信息
    const newAssetList =
      assetList &&
      assetList.map((item: any) => {
        // coinId 是 bigInt 类型，转成字符串比对
        if (`${coinId}` === `${item.coinId}`) {
          item = {
            ...item,
            availableAmount: balance,
            lockAmount: locked,
            totalAmount: total,
            usdBalance: rateFilter({
              symbol: item.symbol,
              amount: total,
              showUnit: false,
              rate: CurrencyNameEnum.usd,
            }), // 资产更新后，计算 usdBalance 值（折合美元金额，过滤小额资产处用）
          }
        }
        return item
      })

    return newAssetList
  } catch (error) {
    return null
  }
}

/** 去除重复的数据，交易页下单成功 ws 回调会有多条数据且有重复的情况 */
export function removeRepeatData(data) {
  if (!Array.isArray(data)) {
    return data
  }
  for (let i = 0; i < data.length; i += 1) {
    for (let j = i + 1; j < data.length; ) {
      if (data[i].coinId === data[j].coinId) {
        data.splice(j, 1)
      } else {
        j += 1
      }
    }
  }
  return data
}

/** 数据字典-修改默认值 */
export const getStoreEnumsToOptions = (enums: IStoreEnum['enums'], labelKey = 'value', valueKey = 'id') => {
  return storeEnumsToOptions(enums, labelKey, valueKey)
}

/**
 * 提币前校验
 */
export const verifyUserWithdraw = async () => {
  const res = await checkUserWithdraw({})
  const {
    isOk = false,
    data: { errMsg = '', isOpenSafeVerify = false, isSuccess = false } = {},
    message = '',
  } = res || {}

  // 接口层面错误
  if (!isOk) {
    Message.error(message)
    return { isSuccess, isOpenSafeVerify }
  }
  if (!isSuccess) {
    // 未开启两项验证，跳转用户中心两项验证页面
    if (!isOpenSafeVerify) {
      const assetsStore = baseAssetsStore.getState()
      assetsStore.updateIsOpenSafeVerify(isOpenSafeVerify)
      return { isSuccess, isOpenSafeVerify }
    }

    // 其他错误信息，直接弹框提示
    Message.error(errMsg)
    return { isSuccess, isOpenSafeVerify }
  }

  return { isSuccess, isOpenSafeVerify }
}

/**
 * 获取汇率信息存到 store 里
 */
export const getCoinRateData = async () => {
  const assetsStore = baseAssetsStore.getState()
  const res = await getCoinRate({})
  const results = res.data
  if (!res.isOk || !results) {
    // TODO 失败时或返回延迟时汇率折合金额展示为 0，问题待处理，解决方案：需要汇率折合的地方根据情况再调用一次汇率接口？
    // 接口异常时重新调用接口，最多调用 3 次
    // const coinRateAPINum = assetsStore.coinRateAPINum
    // if (coinRateAPINum >= 3) return
    // const coinRateAPINumVal = coinRateAPINum + 1
    // assetsStore.updateCoinRateAPINum(coinRateAPINumVal)

    // await getCoinRateData()
    return
  }

  assetsStore.updateCoinRate(results)
}

/**
 * 处理币币资产信息，加解密、隐藏零额资产、搜索等
 * @param dataList
 * @param searchKey
 * @param hideLessState
 * @returns
 */
export const searchCoinList = (dataList: any | undefined, searchKey: string, hideLessState: boolean) => {
  if (!searchKey && !hideLessState) {
    return dataList
  }

  dataList =
    !!dataList &&
    dataList.filter((item: { coinName: string; totalAmount: number }) => {
      const ignoreCaseKey = searchKey.toUpperCase()
      return item.coinName.toUpperCase().includes(ignoreCaseKey) && (!hideLessState || item.totalAmount > 0)
    })

  return dataList
}

/** 获取现货资产 - 交易页面用 */
const getUserAssetsSpot = async (options: IUserAssetsSpot) => {
  const currentCoin = baseMarketStore.getState().currentCoin
  const { buyCoinId, sellCoinId } = currentCoin // options
  //  后端要求 coinId 入参类型为数组，get 请求数组会有问题，和后端约定转成字符串类型
  const params = { coinId: `${[buyCoinId, sellCoinId]}` }
  const res = await getCoinBalance(params)
  const { isOk, data } = res || {}

  // 接口异常，或未返回数据时
  if (!isOk || !data || !data.list || data.list.length < 2) {
    return {
      buyCoin: {
        ...defaultCoinAsset,
        coinId: buyCoinId,
      },
      sellCoin: {
        ...defaultCoinAsset,
        coinId: sellCoinId,
      },
    }
  }

  const dataList: ICoinBalanceDataList[] = data.list
  const buyCoinRes = dataList.filter(item => {
    return `${item.coinId}` === `${buyCoinId}`
  })[0]
  const sellCoinRes = dataList.filter(item => {
    return `${item.coinId}` === `${sellCoinId}`
  })[0]
  const userAssets = {
    buyCoin: {
      ...buyCoinRes,
      totalAmount: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.totalAmount, false),
      availableAmount: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.availableAmount, false),
      lockAmount: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.lockAmount, false),
      positionAmount: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.positionAmount, false),
      totalAmountText: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.totalAmount, true),
      availableAmountText: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.availableAmount, true),
      lockAmountText: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.lockAmount, true),
      positionAmountText: formatCoinAmount(buyCoinRes.symbol, buyCoinRes.positionAmount, false),
    },
    sellCoin: {
      ...sellCoinRes,
      totalAmount: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.totalAmount, false),
      availableAmount: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.availableAmount, false),
      lockAmount: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.lockAmount, false),
      positionAmount: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.positionAmount, false),
      totalAmountText: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.totalAmount, true),
      availableAmountText: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.availableAmount, true),
      lockAmountText: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.lockAmount, true),
      positionAmountText: formatCoinAmount(sellCoinRes.symbol, sellCoinRes.positionAmount, false),
    },
  }
  const assetsStore = baseAssetsStore.getState()
  assetsStore.updateUserAssetsSpot(userAssets)
  return userAssets
}

// /** 获取全仓杠杆资产 */
// const getMarginCrossPairAssetsRequset = async (params: ICrossPairAssetsReq) => {
//   const res = await getMarginCrossPairAssets(params)
//   let results = res.data
//   if (res.isOk && results) {
//     return results
//   }
//   return null
// }

// /** 获取逐仓杠杆资产 */
// const getMarginIsolatedPairAssetsRequset = async (params: ICrossPairAssetsReq) => {
//   const res = await getMarginIsolatedPairAssets(params)
//   let results = res.data
//   if (res.isOk && results) {
//     return results
//   }
//   return null
// }

/** TODO 功能未实现，暂时注释 - 查询杠杆钱包 */
// const getUserAssetsMargin = async (options: getMarginAssetsProps) => {
//   const { activeName, tradeId, leverBuyMode, leverSellMode } = { ...options }
//   let params = { tradeId }
//   let resData
//   let buyObj
//   let sellObj
//   // 杠杆资产默认值
//   let userAssets = {
//     leverInfo: {
//       marginLevel: '',
//       marginLevelRisk: '',
//       ladder: '', // 逐仓档位
//     },
//     buyCoin: {
//       isDebt: '0', // 是否负债 0-否，1-是
//       debt: '', // 单币种负债
//       free: '', // 真实可用
//       maxBorrow: '', // 最大可借
//       total: '--', // 可用余额
//       maxReturnable: '',
//     },
//     sellCoin: {
//       isDebt: '0',
//       debt: '',
//       free: '', // 真实可用
//       maxBorrow: '',
//       total: '--', // 可用余额
//       maxReturnable: '',
//     },
//   }

//   // 全仓
//   if (activeName === 'cross') {
//     resData = await getMarginCrossPairAssetsRequset(params)
//     if (!resData) return null
//     buyObj = resData.list[1]
//     sellObj = resData.list[0]
//   } else {
//     // 逐仓资产
//     resData = await getMarginIsolatedPairAssetsRequset(params)
//     if (!resData) return null
//     buyObj = resData.quote
//     sellObj = resData.base
//   }

//   const usdt_buy_debt = decimalUtils.SafeCalcUtil.add(Number(buyObj.borrowed), Number(buyObj.interest)).toString()
//   const btc_sell_debt = decimalUtils.SafeCalcUtil.add(Number(sellObj.borrowed), Number(sellObj.interest)).toString()

//   userAssets.buyCoin = {
//     total:
//       leverBuyMode === TradeMarginTypesEnum.borrow
//         ? decimalUtils.SafeCalcUtil.add(Number(buyObj.free), Number(buyObj.maxBorrowable))
//         : buyObj.free,
//     isDebt: +usdt_buy_debt > 0 ? '1' : '0',
//     debt: usdt_buy_debt.toString(),
//     maxBorrow: buyObj.maxBorrowable,
//     free: buyObj.free,
//     maxReturnable: buyObj.maxReturnable,
//   }

//   userAssets.sellCoin = {
//     total:
//       leverSellMode === TradeMarginTypesEnum.borrow
//         ? decimalUtils.SafeCalcUtil.add(Number(sellObj.free), Number(sellObj.maxBorrowable))
//         : sellObj.free,
//     isDebt: +btc_sell_debt > 0 ? '1' : '0',
//     debt: btc_sell_debt.toString(),
//     maxBorrow: sellObj.maxBorrowable,
//     free: sellObj.free,
//     maxReturnable: sellObj.maxReturnable,
//   }

//   userAssets.leverInfo = {
//     marginLevel: resData.marginLevel,
//     marginLevelRisk: resData.marginLevelRisk,
//     ladder: resData.ladder,
//   }

//   return userAssets
// }

/**
 * 获取我的资产数据 - 现货、杠杆、合约的资产信息 - 主要用于交易页面
 * @param options
 * @returns
 */
export const getMyAssetsData = async (options: getMyAssetsDataProps) => {
  const isLogin = getIsLogin()
  if (!isLogin) return
  const { accountType, paramsCoin, paramsMargin, paramsFutures, onSuccess } = options

  /** 查询并保存资产数据到 store */
  let userAssets
  if (accountType === TradeModeEnum.spot && paramsCoin) {
    // 现货资产
    userAssets = await getUserAssetsSpot(paramsCoin)
  } else if (accountType === TradeModeEnum.futures) {
    // 合约资产
    userAssets = await getUserAssetsFutures()

    // TODO 功能未实现，暂时注释 - 杠杠和合约
    // } else if (accountType === TradeModeEnum.margin && paramsMargin) {
    //   // 杠杠资产
    //   userAssets = await getUserAssetsMargin(paramsMargin)
    //   userAssets && assetsStore.updateUserAssetsMargin(userAssets)
  }

  // 是否需要回调
  onSuccess && onSuccess(userAssets)
  return userAssets
}

export function getBusinessName() {
  const { layoutProps } = baseLayoutStore.getState()
  const metaData = extractMetaData(layoutProps)
  return metaData.businessName
}

/**
 * 从指定 key 中生成默认的标题和描述，默认带有 businessName 填充，如果有其它需要填充的内容就需要自己单独写了
 * @param keys
 * @returns
 */
export function generateAssetsDefaultSeoMeta(
  // TODO commTitle 备用，后面扩张
  keys: {
    title: string
    description?: string
    commTitle?: string
  },
  values?: any
) {
  const businessName = getBusinessName()
  if (!values) {
    values = { businessName }
  } else {
    values.businessName = businessName
  }
  return {
    title: keys.title,
    description: t({
      id: keys?.description || `modules_assets_company_verified_material_index_page_server_efre42ngx6`,
      values,
    }),
  }
}
