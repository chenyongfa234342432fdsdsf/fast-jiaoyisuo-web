/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询coin信息↗](https://yapi.coin-online.cc/project/72/interface/api/1535) 的 **请求类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /coinInfo/list`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinInfoListApiRequest {
  /**
   * 币种名简称，如BTC，大小写均可
   */
  coinShortName?: string
  /**
   * 是否过滤ETF，true表示过滤ETF
   */
  filterEtf?: string
}

/**
 * 接口 [查询coin信息↗](https://yapi.coin-online.cc/project/72/interface/api/1535) 的 **返回类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /coinInfo/list`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinInfoListApiResponse {
  code?: number
  data?: YapiDtoCoinInfoVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCoinInfoVO {
  /**
   * 计算精度
   */
  calcPrecision?: number
  /**
   * 链名称
   */
  chainName?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 充值热门排序
   */
  depositSortScore?: number
  /**
   * 充值热门 1=是  0=否
   */
  isDepositHot?: boolean
  /**
   * 是否使用地址标签
   */
  isUseMemo?: boolean
  /**
   * 提现热门 1=是  0=否
   */
  isWithdrawHot?: boolean
  /**
   * 币种中文名称
   */
  nameEn?: string
  /**
   * 币种英文名称
   */
  nameZh?: string
  /**
   * 是否可以充币
   */
  recharge?: boolean
  /**
   * 币种简称
   */
  shortName?: string
  /**
   * 子链
   */
  subCoinList?: unknown[]
  /**
   * 交易精度
   */
  tradePrecision?: number
  /**
   * 是否可以划转
   */
  transfer?: boolean
  /**
   * webLogo
   */
  webLogo?: string
  /**
   * 是否可以提现
   */
  withdraw?: boolean
  /**
   * 提现精度
   */
  withdrawPrecision?: number
  /**
   * 提现热门排序
   */
  withdrawSortScore?: number
}

/* prettier-ignore-end */
