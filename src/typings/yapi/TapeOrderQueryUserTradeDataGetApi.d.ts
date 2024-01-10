/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [带单-带单数据:根据时间查询个人交易数据接口↗](https://yapi.nbttfc365.com/project/44/interface/api/19519) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /tapeOrder/queryUserTradeData`
 * @更新时间 `2023-11-15 10:48:58`
 */
export interface YapiGetTapeOrderQueryUserTradeDataApiRequest {
  /**
   * 不传查当前登录人
   */
  uid?: string
  /**
   * 时间周期7天，14天，30天和全部 直接传对应数字即可，不传为全部
   */
  dayData?: string
}

/**
 * 接口 [带单-带单数据:根据时间查询个人交易数据接口↗](https://yapi.nbttfc365.com/project/44/interface/api/19519) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /tapeOrder/queryUserTradeData`
 * @更新时间 `2023-11-15 10:48:58`
 */
export interface YapiGetTapeOrderQueryUserTradeDataApiResponse {
  code: string
  message: string
  /**
   * 收益率
   */
  yield: number
  /**
   * 收益额
   */
  earnings: number
  /**
   * 胜率
   */
  successRate: number
  /**
   * 盈亏比
   */
  profitAndLossRatio: number
  /**
   * 盈利笔数
   */
  profNumber: number
  /**
   * 亏损笔数
   */
  LossNumber: number
  /**
   * 交易总次数
   */
  tradeCount: number
  /**
   * 跟随者收益
   */
  idolYield: number
  /**
   * 累计追随人数
   */
  idolUserNumber: number
  /**
   * 带单规模
   */
  scale: number
  /**
   * 持仓平均周期
   */
  averageTime: number
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [带单-带单数据:根据时间查询个人交易数据接口↗](https://yapi.nbttfc365.com/project/44/interface/api/19519)
// **/
// export const getTapeOrderQueryUserTradeDataApiRequest: MarkcoinRequest<
//   YapiGetTapeOrderQueryUserTradeDataApiRequest,
//   YapiGetTapeOrderQueryUserTradeDataApiResponse['data']
// > = params => {
//   return request({
//     path: "/tapeOrder/queryUserTradeData",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */
