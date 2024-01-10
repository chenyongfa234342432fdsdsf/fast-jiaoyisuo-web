/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询币对信息和标签信息↗](https://yapi.coin-online.cc/project/72/interface/api/2045) 的 **请求类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /symbol_label/info`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetSymbolLabelInfoApiRequest {
  /**
   * 交易区(1-GAVC区 2-BTC区 3-ETH区 4-USDT区 5-创新区 6-ETF交易区)
   */
  tradeArea?: string
}

/**
 * 接口 [查询币对信息和标签信息↗](https://yapi.coin-online.cc/project/72/interface/api/2045) 的 **返回类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /symbol_label/info`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetSymbolLabelInfoApiResponse {
  code?: number
  data?: YapiDtoSymbolAndLabelVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoSymbolAndLabelVO {
  /**
   * 币种信息列表
   */
  symbolList?: YapiDtoSymbolVO[]
  /**
   * 标签信息列表
   */
  tradeLabelList?: YapiDtoTradeLabelVO[]
}
export interface YapiDtoSymbolVO {
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
   * 有效小数位控制
   */
  digit?: string
  /**
   * 当前登录用户是否收藏该币对
   */
  favorite?: boolean
  /**
   * 币种Logo
   */
  imageUrl?: string
  /**
   * 是否支持杠杆
   */
  isMarginTrade?: boolean
  /**
   * 是否是新币对（开盘72小时以内）
   */
  isNew?: boolean
  /**
   * 1:表示开盘 0:表示未开盘
   */
  isOpen?: string
  /**
   * 是否支持价格订阅
   */
  isPriceAlert?: boolean
  /**
   * 是否显示
   */
  isShow?: boolean
  /**
   * 标签
   */
  label?: string
  /**
   * 标签id
   */
  labelId?: number
  /**
   * 最大杠杆倍数
   */
  marginRatio?: string
  /**
   * 开盘时间，格式为MM-dd HH:mm
   */
  openTime?: string
  /**
   * 标的币全称(根据用户配置语言展示)
   */
  sellCoinFullName?: string
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
   * 交易区(1-GAVC区 2-BTC区 3-ETH区 4-USDT区 5-创新区 6-ETF交易区)
   */
  tradeArea?: number
  /**
   * 交易id
   */
  tradeId?: number
}
export interface YapiDtoTradeLabelVO {
  /**
   * 币种Logo
   */
  id?: number
  /**
   * 中文标签
   */
  labelCn?: string
  /**
   * 英文标签
   */
  labelEn?: string
  /**
   * 次序
   */
  sort?: number
}

/* prettier-ignore-end */
