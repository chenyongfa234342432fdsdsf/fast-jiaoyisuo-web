/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [我的API Key↗](https://yapi.coin-online.cc/project/72/interface/api/1967) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2-API管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_431)
 * @标签 `基础模块优化迭代2-API管理`
 * @请求头 `GET /openapi/apikey/mine`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiGetOpenapiApikeyMineApiRequest {}

/**
 * 接口 [我的API Key↗](https://yapi.coin-online.cc/project/72/interface/api/1967) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2-API管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_431)
 * @标签 `基础模块优化迭代2-API管理`
 * @请求头 `GET /openapi/apikey/mine`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiGetOpenapiApikeyMineApiResponse {
  code?: number
  data?: YapiDtoMyApiKeyResp[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 我的API Key
 */
export interface YapiDtoMyApiKeyResp {
  /**
   * Access Key
   */
  accessKey?: string
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * id
   */
  id?: number
  /**
   * 绑定IP地址
   */
  ip?: string
  /**
   * 费率
   */
  rate?: string
  /**
   * 剩余有效期，单位天
   */
  remainPeriod?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 状态描述
   */
  statusStr?: string
  /**
   * 权限
   */
  types?: string
  /**
   * 权限描述
   */
  typesStr?: string
}

/* prettier-ignore-end */
