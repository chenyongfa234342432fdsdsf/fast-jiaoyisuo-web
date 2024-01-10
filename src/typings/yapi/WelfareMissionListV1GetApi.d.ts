/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [任务中心列表-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19891) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/mission/list`
 * @更新时间 `2023-12-05 18:23:08`
 */
export interface YapiGetV1WelfareMissionListApiRequest {
  /**
   * challenge 挑战任务 achievements 成就任务，字典值welfare_mission_type_code
   */
  missionType: string
  pageNum: string
  pageSize: string
}

/**
 * 接口 [任务中心列表-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19891) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/mission/list`
 * @更新时间 `2023-12-05 18:23:08`
 */
export interface YapiGetV1WelfareMissionListApiResponse {
  code?: number
  message?: string
  data?: YapiGetV1WelfareMissionData
}
export interface YapiGetV1WelfareMissionData {
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
  list: YapiGetV1WelfareMissionListData[]
}
export interface YapiGetV1WelfareMissionListData {
  /**
   * 任务ID
   */
  missionId: string
  /**
   * 任务名称 根据任务类型取字典 welfare_common_condition_scene_options 和welfare_achievments_mission_condition_options
   */
  missionName: string
  couponTemplateDetail: YapiGetV1WelfareMissionCouponTemplateDetailListData
  /**
   * 条件列表
   */
  conditions: YapiGetV1WelfareMissionListConditionsListData[]
  /**
   * 奖励个数
   */
  awardValue: string
  /**
   * 截止时间，13位毫秒值
   */
  expirationTime: number
  /**
   * true已经参与 false未参与，需要调用完成接口
   */
  join: boolean
  /**
   * 任务类型：achievements 成就 challenge 成就
   */
  missionType: string
}
/**
 * 优惠券信息
 */
export interface YapiGetV1WelfareMissionCouponTemplateDetailListData {
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
export interface YapiGetV1WelfareMissionListConditionsListData {
  /**
   * 条件名称字典值welfare_common_condition_scene_options 和 welfare_achievments_mission_condition_options
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
// * [任务中心列表-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19891)
// **/
// export const getV1WelfareMissionListApiRequest: MarkcoinRequest<
//   YapiGetV1WelfareMissionListApiRequest,
//   YapiGetV1WelfareMissionListApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/welfare/mission/list",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */
