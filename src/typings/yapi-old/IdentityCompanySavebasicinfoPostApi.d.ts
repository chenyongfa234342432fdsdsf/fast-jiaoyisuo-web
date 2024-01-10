/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [企业认证-保存基础信息草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1736) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/company/saveBasicInfo`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiPostIdentityCompanySaveBasicInfoApiRequest {
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
   * 审核状态 （-1 初始化 0 等待审核 1 通过审核 2 未通过审核）
   */
  fstatus?: number
  /**
   * 用户id
   */
  fuid?: number
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
   * 资金来源
   */
  sourceFunding?: string
  /**
   * 街道地址
   */
  street?: string
}

/**
 * 接口 [企业认证-保存基础信息草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1736) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/company/saveBasicInfo`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiPostIdentityCompanySaveBasicInfoApiResponse {
  code?: number
  data?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
