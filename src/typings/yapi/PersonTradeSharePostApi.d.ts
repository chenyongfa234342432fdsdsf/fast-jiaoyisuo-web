/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页:带单、跟单分享<分享人是当前登录人>↗](https://yapi.nbttfc365.com/project/44/interface/api/19477) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `POST /person/tradeShare`
 * @更新时间 `2023-11-15 10:12:07`
 */
export interface YapiPostPersonTradeShareApiRequest {
  /**
   * 分享类型：1 带单、2跟单
   */
  tradeType: string
  /**
   * 项目id
   */
  projectId: string
  /**
   * 被分享人uid
   */
  uid: string
  /**
   * 订单号
   */
  orderId: string
}

/**
 * 接口 [主页:带单、跟单分享<分享人是当前登录人>↗](https://yapi.nbttfc365.com/project/44/interface/api/19477) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `POST /person/tradeShare`
 * @更新时间 `2023-11-15 10:12:07`
 */
export interface YapiPostPersonTradeShareApiResponse {
  code: string
  message: string
  /**
   * 头像地址
   */
  headPic: string
  /**
   * 名称
   */
  takerName: string
  /**
   * 标签列表：交易员、C2C商家等
   */
  tagList: YapiPostPersonTradeShareListTagList[]
  /**
   * 币对ID
   */
  tradeId: string
  /**
   * 币对symbol
   */
  tradeSymbol: string
  /**
   * 合约类型 delivery 交割 perpetual 永续erty
   */
  typeInd: string
  /**
   * open_long 开多 , open_short 开空 ,close_long 平多, close_short 平空  字典表: ctt_side_ind
   */
  sideInd: string
  /**
   * 杠杆倍数
   */
  lever: number
  /**
   * 成交价格
   */
  openPrice: number
  /**
   * 最新价格
   */
  newPrice: number
  /**
   * 订单状态 created=创建，success=完成，fail=失败
   */
  orderStatusCd: string
  /**
   * 项目人数
   */
  projectPeople: number
  /**
   * 跟随人数
   */
  idolPeople: number
  /**
   * 分享码
   */
  shareCode: string
  /**
   * 收益率
   */
  yield: number
}
export interface YapiPostPersonTradeShareListTagList {
  /**
   * 标签名称
   */
  name: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页:带单、跟单分享<分享人是当前登录人>↗](https://yapi.nbttfc365.com/project/44/interface/api/19477)
// **/
// export const postPersonTradeShareApiRequest: MarkcoinRequest<
//   YapiPostPersonTradeShareApiRequest,
//   YapiPostPersonTradeShareApiResponse['data']
// > = data => {
//   return request({
//     path: "/person/tradeShare",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */
