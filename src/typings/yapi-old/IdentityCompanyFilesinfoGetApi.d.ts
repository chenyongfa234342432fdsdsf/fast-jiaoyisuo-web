/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [企业认证-查询上传文件草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1733) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/company/filesInfo`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiGetIdentityCompanyFilesInfoApiRequest {
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
 * 接口 [企业认证-查询上传文件草稿↗](https://yapi.coin-online.cc/project/72/interface/api/1733) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/company/filesInfo`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiGetIdentityCompanyFilesInfoApiResponse {
  code?: number
  data?: YapiDtoIdentityCompanyFilesInfoVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 上传文件草稿VO
 */
export interface YapiDtoIdentityCompanyFilesInfoVO {
  /**
   * 业务类型，1-公司注册证书及商业登记证原件，2-公司章程，3-最近十二个月内发行的董事名册，4-最近十二个月内发行的股东、会员名册，5-企业组织结构，6-政府网站链接公司信息截图，7-授权信，8-公司存续证明，9-补充资料,10-公司信息的政府网站链接
   */
  bizType?: string
  /**
   * 企业类型 Incorporation有限责任公司 Trust信托 Others其他
   */
  corporateType?: string
  createdTime?: string
  /**
   * 文件名称/公司信息的政府网站链接
   */
  fileName?: string
  /**
   * 文件路径
   */
  fileUrl?: string
  /**
   * 用户id
   */
  fuid?: number
  id?: number
  /**
   * 是否删除,默认0,0表示未删除 1表示删除
   */
  isDeleted?: boolean
  updatedTime?: string
}

/* prettier-ignore-end */
