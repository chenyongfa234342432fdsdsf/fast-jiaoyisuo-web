import request, { MarkcoinRequest } from '@/plugins/request'
import { C2CUserProfileReq, C2CUserProfileResp } from '@/typings/api/c2c/center'
import {
  YapiPostV1AssetTransferFastPayApiRequest,
  YapiPostV1AssetTransferFastPayApiResponse,
} from '@/typings/yapi/AssetTransferFastPayV1PostApi'
import {
  YapiGetV1HomeGetC2cTypeApiRequest,
  YapiGetV1HomeGetC2cTypeApiResponse,
} from '@/typings/yapi/HomeGetC2cTypeV1GetApi'

/**
 * c2c 中心 - 个人主页 (自己/他人)
 * https://yapi.nbttfc365.com/project/73/interface/api/4940
 */
export const fetchC2CUserProfile: MarkcoinRequest<C2CUserProfileReq, C2CUserProfileResp> = options => {
  return request({
    path: `/v1/c2c/user/profile`,
    method: 'GET',
    params: {
      uid: options.uid, // 用户 id
    },
  })
}

/**
 * c2c 中心 - C2C 账户余额列表
 * https://yapi.nbttfc365.com/project/73/interface/api/4579
 */
export const fetchC2CBalanceList: MarkcoinRequest = () => {
  return request({
    path: `/v1/c2c/balance/list`,
    method: 'GET',
  })
}

/**
 * c2c 中心 - 资金划转
 * https://yapi.nbttfc365.com/project/73/interface/api/4583
 */
export const fetchC2CBalanceTransfer: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/balance/transfer`,
    method: 'POST',
    data: {
      coinId: options.coinId, // 币种 id
      typeCd: options.typeCd, // 1.划转至交易账户 2.划转至 C2C 账户
      amount: options.amount, // 划转金额
    },
  })
}

/**
 * [fastPay 划转↗](https://yapi.nbttfc365.com/project/44/interface/api/18449)
 * */
export const postV1AssetTransferFastPayApiRequest: MarkcoinRequest<
  YapiPostV1AssetTransferFastPayApiRequest,
  YapiPostV1AssetTransferFastPayApiResponse['data']
> = data => {
  return request({
    path: '/v1/asset/transfer/fastPay',
    method: 'POST',
    data,
  })
}

/**
 * [获取商户 c2c 模式↗](https://yapi.nbttfc365.com/project/44/interface/api/18469)
 * */
export const getV1HomeGetC2cTypeApiRequest: MarkcoinRequest<
  YapiGetV1HomeGetC2cTypeApiRequest,
  YapiGetV1HomeGetC2cTypeApiResponse['data']
> = params => {
  return request({
    path: '/v1/home/getC2cType',
    method: 'GET',
    params,
  })
}

/**
 * c2c 中心 - 关注列表
 * https://yapi.nbttfc365.com/project/73/interface/api/4603
 */
export const fetchC2CFollowList: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/follow/list`,
    method: 'GET',
    params: {
      pageNum: options.pageNum, // 页
      pageSize: options.pageSize, // 条数
    },
  })
}

/**
 * c2c 中心 - 添加关注
 * https://yapi.nbttfc365.com/project/73/interface/api/4607
 */
export const fetchC2CFollowAdd: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/follow/add`,
    method: 'POST',
    data: {
      userIds: options.userIds, // 用户 id 传入 number[]
    },
  })
}

/**
 * c2c 中心 - 取消关注
 * https://yapi.nbttfc365.com/project/73/interface/api/4611
 */
export const fetchC2CFollowUnFollow: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/follow/unFollow`,
    method: 'POST',
    data: {
      userIds: options.userIds, // 用户 ID 列表 传入 []
    },
  })
}

/**
 * c2c 中心 - 黑名单列表
 * https://yapi.nbttfc365.com/project/73/interface/api/4913
 */
export const fetchC2CBlackList: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/blackList`,
    method: 'GET',
    params: {
      pageNum: options.pageNum, // 页
      pageSize: options.pageSize, // 条数
    },
  })
}

/**
 * c2c 中心 - 添加黑名单
 * https://yapi.nbttfc365.com/project/73/interface/api/4922
 */
export const fetchC2CBlackListAdd: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/blackList/add`,
    method: 'POST',
    data: {
      userId: options.userId, // 用户 id 传入 number
      reasonCode: options.reasonCode, // 拉黑原因 code。见备注
    },
  })
}

/**
 * c2c 中心 - 移出黑名单
 * https://yapi.nbttfc365.com/project/73/interface/api/4931
 */
export const fetchC2CBlackListCancel: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/blackList/cancel`,
    method: 'POST',
    data: {
      userIds: options.userIds, // 用户 ID 列表 传入 []
    },
  })
}

/**
 * c2c 中心 - 获取可交易的区域列表
 * https://yapi.nbttfc365.com/project/73/interface/api/4571
 */
export const fetchC2CAreaList: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/area/list`,
    method: 'GET',
    params: {
      searchKey: options.searchKey, // 筛选关键字
      returnAll: options.returnAll, // 是否返回全部
    },
  })
}

/**
 * c2c 中心 - 获取所有币种信息
 * https://yapi.nbttfc365.com/project/73/interface/api/5192
 */
export const fetchC2CCoinAll: MarkcoinRequest = () => {
  return request({
    path: `/v1/c2c/coin/all`,
    method: 'GET',
  })
}

/**
 * c2c 中心 - 获取所有现货账户币种信息
 * https://yapi.nbttfc365.com/project/44/interface/api/398
 */
export const fetchAssetCoinBalance: MarkcoinRequest = options => {
  return request({
    path: `/v1/asset/coin/balance`,
    method: 'GET',
    params: {
      pageNum: options.pageNum,
      pageSize: options.pageSize,
      isGt: options.isGt,
    },
  })
}

/**
 * c2c 中心 - 商家 设置接口
 * https://yapi.nbttfc365.com/project/73/interface/api/4523
 */
export const fetchC2CSetting: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/setting`,
    method: 'POST',
    data: {
      welcomeInfoType: options.welcomeInfoType,
      welcomeInfoMessage: options.welcomeInfoMessage,
      receiveOrderStatus: options.receiveOrderStatus,
      receiveOrderTimeJson: options.receiveOrderTimeJson,
    },
  })
}

/**
 * c2c 中心 - 商家 获取当前设置
 * https://yapi.nbttfc365.com/project/73/interface/api/4904
 */
export const fetchGetC2CSetting: MarkcoinRequest = () => {
  return request({
    path: `/v1/c2c/setting`,
    method: 'GET',
  })
}

/* -----------       收付款管理       ----------- */

/**
 * c2c 中心 - 付款方式列表
 * https://yapi.nbttfc365.com/project/73/interface/api/5291
 */
export const fetchC2CPaymentList: MarkcoinRequest = () => {
  return request({
    path: `/v1/c2c/payment/list`,
    method: 'GET',
  })
}

/**
 * c2c 中心 - 收款方式列表
 * https://yapi.nbttfc365.com/project/73/interface/api/5300
 */
export const fetchC2CPaymentReciveList: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/reciveList`,
    method: 'GET',
    params: {
      legalCurrencyId: options.legalCurrencyId, // 法币币种 Id
      paymentType: options.paymentType, // BANK，银行卡，WECHAT，微信，ALIPAY，支付宝
    },
  })
}

/**
 * c2c 中心 - 收款方式开关
 * https://yapi.nbttfc365.com/project/73/interface/api/5309
 */
export const fetchC2CPaymentReciveEnabled: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/recive/enabled`,
    method: 'POST',
    data: {
      id: options.id, // 收款方式唯一 ID
      enabled: options.enabled, // 开关，1，开启，0，关闭
    },
  })
}

/**
 * c2c 中心 - 付款方式开关
 * https://yapi.nbttfc365.com/project/73/interface/api/5318
 */
export const fetchC2CPaymentEnabled: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/enabled`,
    method: 'POST',
    data: {
      paymentType: options.paymentType, // 支付方式，BANK，银行卡，WECHAT，微信，ALIPAY，支付宝
      enabled: options.enabled, // 开关，1，开启，0，关闭
    },
  })
}

/**
 * c2c 中心 - 收款方式修改前置判断
 * https://yapi.nbttfc365.com/project/73/interface/api/5336
 */
export const fetchC2CPaymentReciveEditJudge: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/recive/edit/judge`,
    method: 'POST',
    data: {
      id: options.id, // 收款账号唯一 ID
      type: options.type, // 修改类型，modify，修改，unbind，解绑
    },
  })
}

/**
 * c2c 中心 - 增加收款方式
 * https://yapi.nbttfc365.com/project/73/interface/api/4627
 */
export const fetchC2CPaymentAdd: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/add`,
    method: 'POST',
    data: {
      legalCurrencyId: options.legalCurrencyId, // 法币 IDs(多个逗号隔开)
      paymentTypeCd: options.paymentTypeCd, // 支付类型 (数据字典：payment_type_cd)
      name: options.name, // 姓名
      account: options.account, // 账号
      bankOfDeposit: options.bankOfDeposit, // 开户行
      qrCodeAddr: options.qrCodeAddr, // 二维码 (图片资源地址)
      type: options.type, // 收付类型 (IN 收款 OUT 付款)
    },
  })
}

/**
 * c2c 中心 - （动态）增加收款方式
 * https://yapi.nbttfc365.com/project/73/interface/api/4627
 */
export const fetchC2CNewPaymentAdd: MarkcoinRequest = options => {
  return request({
    path: `/v2/c2c/payment/add`,
    method: 'POST',
    data: {
      legalCurrencyId: options.legalCurrencyId, // 法币 IDs(多个逗号隔开)
      paymentTypeCd: options.paymentTypeCd, // 支付类型 (数据字典：payment_type_cd)
      // name: options.name, // 姓名
      // account: options.account, // 账号
      // bankOfDeposit: options.bankOfDeposit, // 开户行
      // qrCodeAddr: options.qrCodeAddr, // 二维码 (图片资源地址)
      type: options.type, // 收付类型 (IN 收款 OUT 付款)
      ...options,
    },
  })
}

/**
 * c2c 中心 - 修改收款方式
 * https://yapi.nbttfc365.com/project/73/interface/api/4639
 */
export const fetchC2CPaymentModify: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/modify`,
    method: 'POST',
    data: {
      id: options.id, // 支付方式 ID
      legalCurrencyId: options.legalCurrencyId,
      paymentTypeCd: options.paymentTypeCd, // 支付类型 (数据字典：payment_type_cd)
      name: options.name, // 姓名
      account: options.account, // 账号
      bankOfDeposit: options.bankOfDeposit, // 开户行
      qrCodeAddr: options.qrCodeAddr, // 二维码 (图片资源地址)
    },
  })
}

/**
 * c2c 中心 - （动态）修改收款方式
 * https://yapi.nbttfc365.com/project/73/interface/api/4639
 */
export const fetchC2NewCPaymentModify: MarkcoinRequest = options => {
  return request({
    path: `/v2/c2c/payment/modify`,
    method: 'POST',
    data: {
      ...options,
      id: options.id, // 支付方式 ID
      legalCurrencyId: options.legalCurrencyId,
      paymentTypeCd: options.paymentTypeCd, // 支付类型 (数据字典：payment_type_cd)
      // name: options.name, // 姓名
      // account: options.account, // 账号
      // bankOfDeposit: options.bankOfDeposit, // 开户行
      // qrCodeAddr: options.qrCodeAddr, // 二维码 (图片资源地址)
    },
  })
}

/**
 * c2c 中心 - 获取收付方式详情
 * https://yapi.nbttfc365.com/project/73/interface/api/4635
 */
export const fetchC2CPaymentGet: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/get`,
    method: 'GET',
    params: {
      id: options.id, // 1631599059940847618 支付方式 ID
    },
  })
}

/**
 * c2c 中心 - 删除收款方式
 * https://yapi.nbttfc365.com/project/73/interface/api/4643
 */
export const fetchC2CPaymentRemove: MarkcoinRequest = options => {
  return request({
    path: `/v1/c2c/payment/remove`,
    method: 'POST',
    data: {
      id: options.id, // 1631599059940847618 支付方式 ID
    },
  })
}

/* -----------       收付款管理 END       ----------- */
