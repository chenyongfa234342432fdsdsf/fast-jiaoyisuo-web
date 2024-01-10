
/**
 * 行情异动统计 - 入参
 */
 export interface IMarketActivitiesStatisticsReq {
    /** 行情异动记录 id */
    marketActivitiesId?: string
  }
  
  /**
   * 行情异动统计 - 出参
   */
   export interface IMarketActivitiesStatisticsResp {
    isSuccess?: boolean
  }