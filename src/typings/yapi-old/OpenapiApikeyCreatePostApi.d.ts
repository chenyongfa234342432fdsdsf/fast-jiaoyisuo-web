/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [创建新的API Key↗](https://yapi.coin-online.cc/project/72/interface/api/1961) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2-API管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_431)
 * @标签 `基础模块优化迭代2-API管理`
 * @请求头 `POST /openapi/apikey/create`
 * @更新时间 `2022-09-05 11:34:03`
 */
export interface YapiPostOpenapiApikeyCreateApiRequest {
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
   * 备注
   */
  remark: string
  /**
   * ip(最多绑定10个ip,以半角逗号分隔)
   */
  ip: string
  /**
   * API权限(1-只读,2-允许交易,3-允许提现,可以多个权限,用逗号分隔)，比如拥有三个权限传1,2,3
   */
  types: string
  /**
   * 手机验证码
   */
  mobileValidCode?: string
  /**
   * 邮箱验证码
   */
  mailValidCode: string
  /**
   * 谷歌验证码
   */
  googleValidCode?: string
}

/**
 * 接口 [创建新的API Key↗](https://yapi.coin-online.cc/project/72/interface/api/1961) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2-API管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_431)
 * @标签 `基础模块优化迭代2-API管理`
 * @请求头 `POST /openapi/apikey/create`
 * @更新时间 `2022-09-05 11:34:03`
 */
export interface YapiPostOpenapiApikeyCreateApiResponse {
  code?: number
  data?: string
  dataView: YapiDtoundefined
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * data参数格式（仅展示）
 */
export interface YapiDtoundefined {
  accessKey: string
  secretKey: string
  /**
   * 权限设置
   */
  typesStr: string
  /**
   * 绑定IP地址
   */
  ip: string
  /**
   * 费率
   */
  rate: string
}

/* prettier-ignore-end */
