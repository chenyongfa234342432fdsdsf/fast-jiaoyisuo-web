/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取主流交易对\/推荐币对，走势图请调接口\/kline\/history↗](https://yapi.coin-online.cc/project/72/interface/api/1532) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /coin/getTradePair`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinGetTradePairApiRequest {
  /**
   * 类型(1-主流交易对，2-推荐交易对)
   */
  type?: string
}

/**
 * 接口 [获取主流交易对\/推荐币对，走势图请调接口\/kline\/history↗](https://yapi.coin-online.cc/project/72/interface/api/1532) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /coin/getTradePair`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinGetTradePairApiResponse {
  code?: number
  data?: YapiDtoSystemTradeTypeInfoVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoSystemTradeTypeInfoVO {
  /**
   * 买一价
   */
  buy?: string
  /**
   * 计价币全称(根据用户配置语言展示)
   */
  buyCoinFullName?: string
  /**
   * buyFee
   */
  buyFee?: string
  /**
   * 币种名称(右边)
   */
  buyShortName?: string
  /**
   * buySymbol
   */
  buySymbol?: string
  /**
   * 24小时涨跌幅
   */
  change?: string
  /**
   * 折合人民币价格
   */
  cny?: string
  /**
   * 有效小数位控制
   */
  digit?: string
  /**
   * 当前登录用户是否收藏该币对
   */
  favorite?: boolean
  /**
   * 最高价
   */
  high?: string
  /**
   * 币种Logo
   */
  imageUrl?: string
  isMarginTrade?: boolean
  /**
   * 1:表示开盘 0:表示未开盘
   */
  isOpen?: string
  /**
   * 是否支持价格订阅
   */
  isPriceAlert?: boolean
  /**
   * 标签
   */
  label?: string
  /**
   * 标签id
   */
  labelId?: number
  /**
   * 最新价
   */
  last?: string
  lever?: string
  /**
   * 最低价
   */
  low?: string
  marginRatio?: string
  /**
   * 净值
   */
  netValue?: string
  /**
   * 开盘价
   */
  open?: string
  /**
   * 卖一价
   */
  sell?: string
  /**
   * 标的币全称(根据用户配置语言展示)
   */
  sellCoinFullName?: string
  /**
   * 标的币全称(英文)
   */
  sellCoinFullNameEn?: string
  /**
   * 标的币全称(中文)
   */
  sellCoinFullNameZh?: string
  /**
   * sellFee
   */
  sellFee?: string
  /**
   * 币种名称(左边)
   */
  sellShortName?: string
  /**
   * sellSymbol
   */
  sellSymbol?: string
  /**
   * 24小时成交额(人民币)
   */
  totalAmount?: string
  /**
   * 交易id
   */
  tradeId?: number
  /**
   * 交易区
   */
  type?: number
  /**
   * 24小时标的币成交量
   */
  volume?: string
  /**
   * 周涨跌幅
   */
  weekChg?: string
}

/* prettier-ignore-end */
