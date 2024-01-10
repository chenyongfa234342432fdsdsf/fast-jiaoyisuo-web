/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [createWithdrawAddress↗](https://yapi.coin-online.cc/project/72/interface/api/1502) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `POST /capital/create_withdraw_address`
 * @更新时间 `2022-09-02 13:46:19`
 */
export interface YapiPostCapitalCreateWithdrawAddressApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataView: YapiDtoundefined
  /**
   * 随机向量
   */
  randomIv?: string
  /**
   * 随机密钥
   */
  randomKey?: string
  /**
   * 签名串
   */
  signature?: string
  targetObj?: {}
  /**
   * 时间戳
   */
  timestamp?: number
}
/**
 * bizData的请求参数格式（仅展示）
 */
export interface YapiDtoundefined {
  /**
   * 币种id
   */
  coinId: string
  /**
   * 提币地址
   */
  withdrawAddr: string
  /**
   * 地址标签
   */
  memo: string
  /**
   * 地址备注
   */
  remark: string
}

/**
 * 接口 [createWithdrawAddress↗](https://yapi.coin-online.cc/project/72/interface/api/1502) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `POST /capital/create_withdraw_address`
 * @更新时间 `2022-09-02 13:46:19`
 */
export interface YapiPostCapitalCreateWithdrawAddressApiResponse {
  code?: number
  data?: {}
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
