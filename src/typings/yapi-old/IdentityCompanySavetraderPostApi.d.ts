/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [企业认证-保存认证账户交易员草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1748) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/company/saveTrader`
 * @更新时间 `2022-08-29 13:58:17`
 */
export type YapiPostIdentityCompanySaveTraderApiRequest = YapiDtoIdentityCompanyMembersDTO[]

/**
 * 企业认证-保存上传文件草稿DTO
 */
export interface YapiDtoIdentityCompanyMembersDTO {
  /**
   * 出生日期
   */
  birthday?: string
  /**
   * 企业类型 Incorporation有限责任公司 Trust信托 Others其他
   */
  corporateType?: string
  /**
   * 国家/地区
   */
  country?: string
  createdTime?: string
  /**
   * 名字
   */
  fname?: string
  /**
   * 证件类型（ 0 身份证 1 护照  2 驾驶证 )
   */
  ftype?: number
  /**
   * 用户id
   */
  fuid?: number
  /**
   * 证件号
   */
  idNumber?: string
  /**
   * 个人肖像照
   */
  imageBest?: string
  /**
   * 身份证国徽面
   */
  imageIdcardBack?: string
  /**
   * 身份证人像面/护照活驾驶证信息页
   */
  imageIdcardFront?: string
  /**
   * 是否删除，0表示未删除 1表示删除
   */
  isDeleted?: boolean
  /**
   * 证件签发国/地区
   */
  issuingCountry?: string
  /**
   * 姓氏
   */
  lastName?: string
  /**
   * 企业认证资料类型 1董事 2最终收益权人 3账户交易员
   */
  materialType?: number
  /**
   * 中间名字
   */
  middleName?: string
  updatedTime?: string
}

/**
 * 接口 [企业认证-保存认证账户交易员草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1748) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/company/saveTrader`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiPostIdentityCompanySaveTraderApiResponse {
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
