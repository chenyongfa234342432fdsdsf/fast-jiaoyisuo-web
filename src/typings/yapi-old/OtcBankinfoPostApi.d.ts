/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询收款方式↗](https://yapi.coin-online.cc/project/72/interface/api/2333) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/bankInfo`
 * @更新时间 `2022-09-05 11:55:49`
 */
export interface YapiPostOtcBankInfoApiRequest {
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
   * 支付方式id
   */
  bankInfoId: number
}

/**
 * 接口 [查询收款方式↗](https://yapi.coin-online.cc/project/72/interface/api/2333) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/bankInfo`
 * @更新时间 `2022-09-05 11:55:49`
 */
export interface YapiPostOtcBankInfoApiResponse {
  code?: number
  data?: string
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
  /**
   * data参数格式（仅展示）
   */
  dataView: YapiDtoundefined[]
}
/**
 * 收款方式
 */
export interface YapiDtoundefined {
  /**
   * 支付方式id
   */
  bankInfoId: number
  /**
   * 支付方式id
   */
  paymentId: number
  /**
   * 支付方式名
   */
  paymentName: string
  /**
   * 支付方式描述
   */
  paymentChineseDesc: string
  /**
   * 支付方式描述
   */
  paymentEnglistDesc: string
  /**
   * 支付方式Logo
   */
  paymentLogo: string
  /**
   * 姓名
   */
  name: string
  /**
   * 开户银行
   */
  bankName: string
  /**
   * 开户支行
   */
  branchName: string
  /**
   * 银行卡号 或 支付宝账号 或 微信账号
   */
  bankCardNumber: string
  /**
   * 收款二维码照片url
   */
  qrCodeUrl: string
  /**
   * 开启状态，1开启，2关闭
   */
  openStatus: string
  /**
   * 开启状态描述，开启，关闭
   */
  openStatusDesc: string
  logo: string
  /**
   * 实名名称与收款名称是否一致,true-一致,false
   */
  isNameSame: string
}

/* prettier-ignore-end */
