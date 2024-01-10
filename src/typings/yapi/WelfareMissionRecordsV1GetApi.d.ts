/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [任务完成记录-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19915) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/mission/records`
 * @更新时间 `2023-12-05 18:22:57`
 */
export interface YapiGetV1WelfareMissionRecordsApiRequest {
  /**
   * finished 已完成 undone 未完成，字典user_mission_status_cd
   */
  status: string
  pageNum: string
  pageSize: string
}

/**
 * 接口 [任务完成记录-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19915) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/mission/records`
 * @更新时间 `2023-12-05 18:22:57`
 */
export interface YapiGetV1WelfareMissionRecordsApiResponse {
  code?: number
  message?: string
  data?: YapiGetV1WelfareMissionRecordsData
}
export interface YapiGetV1WelfareMissionRecordsData {
  /**
   * 总条数
   */
  total: number
  /**
   * 当前页码
   */
  pageNum: number
  /**
   * 每页的数量
   */
  pageSize: number
  list: YapiGetV1WelfareMissionRecordsListData[]
}
export interface YapiGetV1WelfareMissionRecordsListData {
  /**
   * 任务ID
   */
  missionId: string
  /**
   * 任务名称 根据任务类型取字典 welfare_common_condition_scene_options 和welfare_achievments_mission_condition_options
   */
  missionName: string
  couponTemplateDetail: YapiGetV1WelfareMissionRecordsCouponTemplateDetailListData
  /**
   * 条件列表
   */
  conditions: YapiGetV1WelfareMissionRecordsListConditionsListData[]
  /**
   * 奖励个数
   */
  awardValue: string
  /**
   * processing 进行中，finished 已完成,undone 未完成
   */
  userMissionStatus: string
  /**
   * 截止时间，13位毫秒值
   */
  expirationTime: number
  /**
   * 完成时间，13位毫秒值
   */
  completeTime: number
  /**
   * 发放状态，userMissionStatus=finished时，发放状态有效，字典值
   */
  issueStatus: string
  /**
   * 任务类型，achievements 成就任务，challenge 挑战任务
   */
  missionType: string
}
/**
 * 优惠券信息
 */
export interface YapiGetV1WelfareMissionRecordsCouponTemplateDetailListData {
  /**
   * 卡券类别 见字典
   */
  couponType: string
  /**
   * 卡劵类型code ,字典值
   */
  couponCode: string
  /**
   * 卡劵类型使用业务场景，字典值
   */
  businessScene: string
  /**
   * 是否有使用门槛 是 enable 否disable
   */
  useRuleStatus: string
  /**
   * 当有使用门槛时，不为空，大于0
   */
  useThreshold: string
  /**
   * 抵扣方式，direct直接抵扣 rate比例折扣
   */
  useDiscountRule: string
  /**
   * 比例折扣时，必填。60表示60%
   */
  useDiscountRuleRate: string
  /**
   * 币种symbol
   */
  coinSymbol: string
  /**
   * 优惠券面值
   */
  couponValue: string
}
/**
 * 条件列表
 */
export interface YapiGetV1WelfareMissionRecordsListConditionsListData {
  /**
   * 根据任务类型取字典 welfare_common_condition_scene_options 和welfare_achievments_mission_condition_options
   */
  conditionName: string
  /**
   * 比较条件gt表示 ≥ ;lt表示 <;eq表示 =; ge 表示>;le 表示≤
   */
  compareCondition: string
  /**
   * 目标值
   */
  targetValue: string
  /**
   * 当前值
   */
  currentValue: string
  /**
   * 单位 USDT
   */
  targetUnit: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [任务完成记录-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19915)
// **/
// export const getV1WelfareMissionRecordsApiRequest: MarkcoinRequest<
//   YapiGetV1WelfareMissionRecordsApiRequest,
//   YapiGetV1WelfareMissionRecordsApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/welfare/mission/records",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */
