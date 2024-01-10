/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [企业认证-示例文件展示↗](https://yapi.coin-online.cc/project/72/interface/api/1751) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/company/templateFile`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiGetIdentityCompanyTemplateFileApiRequest {}

/**
 * 接口 [企业认证-示例文件展示↗](https://yapi.coin-online.cc/project/72/interface/api/1751) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/company/templateFile`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiGetIdentityCompanyTemplateFileApiResponse {
  code?: number
  data?: YapiDtoIdentityCompanyVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 企业认证-查询基础信息
 */
export interface YapiDtoIdentityCompanyVO {
  /**
   * 申请原因
   */
  applyReason?: string
  /**
   * 联系电话区号，比如86
   */
  areaCode?: string
  /**
   * 城市
   */
  city?: string
  /**
   * 企业名称
   */
  companyName?: string
  /**
   * 企业注册号
   */
  companyRegisterNumber?: string
  /**
   * 联系电话
   */
  contactNumber?: string
  /**
   * 企业类型 Incorporation有限责任公司 Trust信托 Others其他
   */
  corporateType?: string
  /**
   * 国家/地区
   */
  country?: string
  /**
   * 创建人
   */
  createdBy?: string
  /**
   * 创建时间
   */
  createdTime?: string
  /**
   * 审核时间
   */
  fauthtime?: string
  /**
   * 模板类型 ORIGINAL_CERTIFICATE企业组织结构 AUTHORISATION_LETTER授权信
   */
  fileBiz?: string
  /**
   * 文件名称
   */
  fileName?: string
  /**
   * 文件路径
   */
  fileUrl?: string
  /**
   * 审核状态 （-1 初始化 0 等待审核 1 通过审核 2 未通过审核）
   */
  fstatus?: number
  /**
   * 用户id
   */
  fuid?: number
  id?: number
  /**
   * 最近申请时间
   */
  lastAppyTime?: string
  /**
   * 审核人
   */
  modifyUserId?: number
  /**
   * 业务性质
   */
  natureBusiness?: string
  /**
   * 运营城市
   */
  operatingCity?: string
  /**
   * 运营国家/地区
   */
  operatingCountry?: string
  /**
   * 运营街道地址
   */
  operatingStreet?: string
  /**
   * 审核备注
   */
  remark?: string
  /**
   * 资金来源
   */
  sourceFunding?: string
  /**
   * 街道地址
   */
  street?: string
  /**
   * 更新人
   */
  updatedBy?: string
  /**
   * 更新时间
   */
  updatedTime?: string
}

/* prettier-ignore-end */
