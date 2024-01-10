/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [企业认证-查询认证最终收益权人草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1727) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/company/beneficiaryInfo`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiGetIdentityCompanyBeneficiaryInfoApiRequest {
  /**
   * 企业类型 Incorporation有限责任公司 Trust信托 Others其他
   */
  corporateType?: string
  /**
   * 用户id
   */
  userId?: string
  /**
   * 企业认证资料类型 1董事 2最终收益权人 3账户交易员
   */
  materialType?: string
}

/**
 * 接口 [企业认证-查询认证最终收益权人草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1727) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/company/beneficiaryInfo`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiGetIdentityCompanyBeneficiaryInfoApiResponse {
  code?: number
  data?: YapiDtoIdentityCompanyMembersInfoVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 企业认证-查询公司成员（认证董事、认证最终收益权人、认证账户交易员）草稿VO
 */
export interface YapiDtoIdentityCompanyMembersInfoVO {
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
   * 邮箱
   */
  email?: string
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
  id?: number
  /**
   * 证件号
   */
  idNumber?: string
  /**
   * 个人肖像照
   */
  imageBest?: string
  /**
   * 最后一次上传的身份证国徽面
   */
  imageIdcardBack?: string
  /**
   * 最后一次上传的身份证人像面
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
  /**
   * 持股比例
   */
  ownershipPercentage?: string
  updatedTime?: string
}

/* prettier-ignore-end */
