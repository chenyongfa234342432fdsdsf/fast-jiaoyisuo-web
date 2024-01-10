/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [添加或者修改收款方式↗](https://yapi.coin-online.cc/project/72/interface/api/2336) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/bankInfo/addOrUpdate`
 * @更新时间 `2022-09-02 14:04:48`
 */
export interface YapiPostOtcBankInfoAddOrUpdateApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataVIew: YapiDtoundefined
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
   * 收款方式id,如果是新增不用传，修改需要上传
   */
  bankInfoId?: number
  /**
   * 类型
   */
  type: number
  /**
   * 姓名
   */
  name?: string
  /**
   * 开户银行
   */
  bankName?: string
  /**
   * 开户支行
   */
  branchName?: string
  /**
   * 银行卡号
   */
  bankCardNumber: string
  /**
   * 资金密码，rsa加密
   */
  capitalPwd: string
  /**
   * 收款二维码照片url
   */
  qrCodeUrl: string
}

/**
 * 接口 [添加或者修改收款方式↗](https://yapi.coin-online.cc/project/72/interface/api/2336) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/bankInfo/addOrUpdate`
 * @更新时间 `2022-09-02 14:04:48`
 */
export interface YapiPostOtcBankInfoAddOrUpdateApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
