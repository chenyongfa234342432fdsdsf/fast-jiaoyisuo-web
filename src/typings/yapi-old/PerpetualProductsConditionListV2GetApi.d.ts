/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [计划委托、止盈止损↗](https://yapi.coin-online.cc/project/72/interface/api/2495) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v2/perpetual/products/condition/list`
 * @更新时间 `2022-08-29 16:48:21`
 */
export interface YapiGetV2PerpetualProductsConditionListApiRequest {
  /**
   * 类型  0：止损 1：止盈 2：计划委托   如果要查计划委托就传2，查止盈止损就传0,1 中间用逗号分割
   */
  type: string
  /**
   * 状态  1:已触发 0、2：未触发 3：预条件单 -1：已撤销  如果要查计划委托就传0，查止盈止损就传1,2 中间用逗号分割
   */
  status: string
  /**
   * 订单被撤销原因  1：系统撤销  2：用户撤销  3、4、5：触发后委托失败  中间用逗号分割
   */
  reason: string
  /**
   * 订单方向
   */
  detailSide: string
  indexBase: string
  /**
   * 计价币
   */
  quote: string
  /**
   * 页码
   */
  page: string
  /**
   * 每页大小
   */
  pageSize: string
}

/**
 * 接口 [计划委托、止盈止损↗](https://yapi.coin-online.cc/project/72/interface/api/2495) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v2/perpetual/products/condition/list`
 * @更新时间 `2022-08-29 16:48:21`
 */
export interface YapiGetV2PerpetualProductsConditionListApiResponse {
  code?: number
  data?: YapiDtoundefined
  msg?: string
}
export interface YapiDtoundefined {
  pageNum?: 1
  pageSize?: 1
  totalPage?: 1
  totalCount?: 1
  data?: [
    {
      id: '条件单id'
      contractCode: '是Base和Quote之间的组合 P_BTC_USDT，R_BTC_USDT1109'
      base: '基础货币名'
      quote: '计价货币名'
      indexBase: '指数货币'
      contractDirection: '方向 0:正向,1:反向'
      type: '触发类型：指数价格，标记价格，最新价格'
      direction: '触发方向，greater大于，less小于'
      triggerPrice: '触发价格'
      triggerBy: '计划委托类型: index-指数价格market/mark-标记价格mark/last-最新价格last'
      price: '用户订单委托或者破产价格'
      side: '仓位方向，long多，short空'
      detailSide: '1.开多open_long 2.开空open_short 3.平多close_long 4.平空close_short'
      amount: '委托数量'
      avgPrice: '平均成交价格'
      dealAmount: '已成交数量'
      orderSize: '委托价值'
      dealSize: '已经成交价值'
      status: '状态  1:已触发 0、2：未触发 3：预条件单 -1：已撤销'
      reason: '订单被撤销原因  1：系统撤销  2：用户撤销  3、4、5：触发后委托失败  中间用逗号分割'
      systemType: '10:限价 11:市价 13:强平单 14:爆仓单'
      createdDate: '创建时间'
      source: '来源'
      orderPriceType: '下单类型,如果需要设置下单类型，则price字段只能为空串或不传，下单价格类型，对手价：opponent，最优20档：optimal_20，最优10档：optimal_10，最优5档：optimal_5'
      positionType: '仓位模式'
      stopLimitType: '条件类型'
      refOrderId: '关联订单id'
      lever: '杠杆'
      unitAmount: '单位'
      marginDigit: '保证金位数'
      marketPriceDigit: '价格位数'
      triggerDate: '触发时间'
      modifyDate: '修改时间'
      tiggerOrderDetail: { id: ''; price: '' }
    }
  ]
}

/* prettier-ignore-end */
