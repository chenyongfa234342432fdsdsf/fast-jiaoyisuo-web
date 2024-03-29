// TODO 待接入真实数据修改类型

import { YapiPostV1C2CAdvertListData } from "@/typings/yapi/C2cAdvertListV1PostApi";
import { ISubCoinList, RecordsCoinListResp } from "../../assets/assets";
import { C2CAreaListResp, C2CCoinListResp } from "../common";

export type DetailMarginCoinList = {
    /** 币种 id */
    coinId: string;
    /** 币种名称 */
    coinName: string;
    /** 可提数量 */
    amount?: string;
    // /** 可用 */
    // canDeposit?: string;
    /** app 图标 */
    appLogo: string;
    /** web 图标 */
    webLogo: string;
    /** 币种符号 */
    symbol: string;
}

export type ChainAddressListResp = {
    /** 币种 id */
    coinId: string | number;
    /** 币种名称 */
    coinName: string;
    /** 是否需要 memo 地址 */
    hasMemo?: boolean;
}

export type SelectOptionData = {
    /** 下拉选项文案 */
    label: string;
    /** 下拉框值 */
    value: string;
}

/**
 * 发布广告单 - 付款方式列表
 */
export interface IAdvertisePaymentType {
    id: string;
}

/**
 * 发布广告单 - 收款账号
 */
export interface IAdvertisePaymentInfo {
    id: number;
    account: string;
    name: string;
    type: string;
}
export interface IAdvertisePaymentList {
    id?: number | undefined;
    type: string;
    account?: IAdvertisePaymentInfo
}


/**
 * 发布广告单 - 表单
 */
export interface IPostAdvertiseForm {
    /** 交易区 */
    currency: C2CAreaListResp;
    /** 币种 */
    coin: RecordsCoinListResp & C2CCoinListResp;
    /** 广告方向 */
    advertDirect: string;
    /** 交易类型 */
    dealTypeCd: string;
    /** 主链类型 */
    chainAddress: ISubCoinList[];
    /** 单笔限额 - 最小值 */
    minAmount: string;
    /** 单笔限额 - 最大值 */
    maxAmount: string;
    /** 最新价格 */
    coincidenceValue: string;
    /** 汇率单价 */
    price: string;
    /** 广告有效期 */
    validDays: string;
    /** 成单数 */
    completedOrderCount: number;
    /** 认证等级 */
    certificationLevel: string;
    /** 支付方式 */
    paymentTypes: [];
    /** 收款账号 */
    payments: IAdvertisePaymentList[];
    /** 备注 */
    remark: string;
    /** 广告数量 */
    quantity: string;
}

/**
 * 广告记录 - 筛选表单
 */
export interface IAdvertiseHistoryForm {
    /** 币种 ids */
  coinIds: [];
  /** 法币 */
  areaIds: [];
  /** 广告方向-出售/购买 */
  advertDirectCds: [];
  /** 交易类型-站外/站内 */
  tradeTypeCds: [];
  /** 1 上架中 2 已下架 */
  advertStatus: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 广告单详情
 */
export interface IAdvertiseDetails {
    /** 广告状态 */
    advertStatus: string;
}

/**
 * 发布广告单 - 广告重合度列表
 */
export interface AdvertCoincidenceListReq {
    /** 单笔限数 - 最小值 */
    minAmount: string;
    /** 单笔限数 - 最大值 */
    maxAmount: string;
    /** 币种 id */
    coinId: string;
    /** 重合度 (目前废弃) */
    // coincidenceValue: Array<string>;
    /** 广告类型 INSIDE、OUTSIDE */
    dealTypeCd: string;
    /** 区域 id */
    areaId: string;
    /** 重合度 */
    coincidenceDegree: string;
    /** 来源 */
    source: Array<string>;
}

export interface IBidList {
    price: number;
    amount: number;
}
export interface AdvertCoincidenceListResp {
    /** 卖 */
    bid: IBidList[];
    /** 买 */
    ask: IBidList[];
}

/**
 * 获取收付方式列表
 */
export interface AdvertPaymentTypeListReq {}

export interface IPaymentAccount {
    /** 用户 ID */
    uid: string;
    /** 法币 ID */
    legalCurrencyId: string;
    /** B 端商家 ID */
    businessId?: any;
    /** 姓名 */
    name: string;
    /** 收付类型 */
    paymentTypeCd: string;
    /** 收付方式 ID */
    id: string;
    /** 账号 */
    account: string;
    /** 开户行 */
    bankOfDeposit: string;
    /** 二维码 */
    qrCodeAddr: string;
}

export interface AdvertPaymentTypeListResp {
    /** 收付类型 */
    type: string;
    /** 账号列表 */
    list: IPaymentAccount[]
}


/**
 * 发布广告单 - 获取交易区下支付方式列表
 */
export interface AdvertPaymentListReq {
    /** 交易区 ID */
    legalCurrencyId: string;
}

export interface AdvertPaymentListResp {
    /** 账号列表 */
    paymentList: IAdvertPaymentList[]
}

export interface IAdvertPaymentList {
    /** 支付类型，BANK，银行卡，WECHAT，微信，ALIPAY，支付宝 */
    paymentType: string;
    /** 1，开启，0，关闭 */
    enabled: number;
}


/**
 * 发布广告单 - 获取交易区下收款账号列表
 */
export interface AdvertReceiptListReq {
    /** 交易区 ID */
    legalCurrencyId: string;
}

export interface AdvertReceiptListResp {
    paymentList: IAdvertReceiptList[];
}

export interface IAdvertReceiptList {
    /** BANK，银行卡，WECHAT，微信，ALIPAY，支付宝 */
    paymentType: string;
    list: IAdvertReceiptAccountList[];
}

export interface IAdvertReceiptAccountList {
    /** 收款方式唯一 ID */
    id: string;
    /** BANK，银行卡，WECHAT，微信，ALIPAY，支付宝 */
    paymentTypeCd: string;
    /** 姓名 */
    name: string;
    /** 账号 */
    account: string;
    /** 开户行 */
    bankOfDeposit: string;
    /** 二维码 (图片资源地址) */
    qrCodeAddr: string;
    /** 是否启用，1，启用，0，未启用 */
    enabled: number;
    /** 交易区 ID，多个以逗号分割 */
    legalCurrencyId: string;
    /** 该交易方式在交易区是否可用数据 */
    availableData?: AvailableDataList[];
    /** 付款详情 */
    paymentDetails?: string;
}

/**
 * 发布广告单
 */
interface AvailableDataList {
    areaId?: string;
    /** true，可用，false，不可用 */
    available?: string;
}

/**
 * 发布广告单
 */
interface IChainAddress {
    id?: string;
    /** 类型 */
    name?: string;
    /** 地址 */
    address?: string;
    /** memo */
    memo?: string;
}
export interface IPayment {
    /** 支付类型 BANK、WECHAT、ALIPAY */
    type: string;
    /** 支付方式对应的数据 id(卖币才需要、买币不需要传) */
    id?: string | number | undefined;
}
export interface AdvertAddReq {
    payments: IPayment[];
    /** 区域 id */
    areaId: string;
    /** 币种 id */
    coinId: string;
    /** 订单方向 BUY 买 SELL 卖 */
    advertDirectCd: string;
    /** 交易类型 INSIDE 站内 OUTSIDE 站外 */
    dealTypeCd: string;
    /** 价格 */
    price: number;
    /** 单笔限数 - 最小值 */
    minAmount: number;
    /** 单笔限数 - 最大值 */
    maxAmount: number;
    /** 有效期 (天) */
    validDays: number;
    /** 成单数大于 */
    completedOrderCount: number;
    /** 认证等级 (ELEMENTARY 初级认证 SENIOR 高级认证 ENTERPRISE 企业认证) */
    certificationLevelCd: string;
    /** 购买数量（买币才需要） */
    quantity?: number;
    /** 主链类型 */
    chainAddress?: IChainAddress[];
    /** 备注 */
    remark?: string;
    /** 是否价格波动 */ 
    isPriceRemind: number;
    /** 价格波动低于目标值 */
    minPriceRemind?: number;
    /** 价格波动高于目标值 */
    maxPriceRemind?: number;
}

export interface AdvertAddResp {
    isSuccess: boolean;
}


/**
 * 发布广告单 - 当前的商家状态
 */
export interface AdvertMerchantInfoReq{}

export interface IMerchantInfo {
    /** 申请冻结数量 */
    freezeCount: number;
    /** 法币市场 */
    legalCurrencyIds: string;
    /** 冻结的币种 ID */
    freezeSymbolId: number;
    id: number;
    /** 邮箱 */
    email: string;
    /** 国家 */
    region: string;
    /** 身份证明图片地址 */
    identityFileAddr: string;
    /** 紧急联系人名 */
    urgentName: string;
    /** 紧急联系人关系 */
    urgentRelation: string;
    /** 信誉额度 */
    reputationVal?: number;
    /** 状态 enable: 正常，disable: 禁用交易，terminating:解除中，terminated：已解除 */
    statusInd: number;
    /** 省份 */
    province: string;
    /** 手机号 */
    phone: string;
    /** 昵称 */
    nickName: string;
    /** 用户 ID */
    uid: number;
    /** 紧急联系人电话 */
    urgentTel: string;
    /** 地址 */
    address: string;
    /** 身份视频 */
    identityVideoAddr: string;
    /** 商户 id */
    businessId: number;
    /** 冻结信誉额度 */
    freezeReputationVal: number;
    /** 冻结的币种 symbol */
    freezeSymbol: string;
    /** 上架中的广告数 */
    onlineAdvertCount: number;
    /** 广告数 */
    advertCount: number;
    /** 订单数 */
    orderCount: number;
    /** 是否可以站外交易 1 是 2 否 */
    canOutTrade: number;
}
export interface AdvertMerchantInfoResp {
    /** applying= 商户申请审核中 enable= 正常商家 none= 当前不是商户 */
    status: string;
    /** 当用户为正常商家时，该字段才会存在 */
    merchantInfo?: IMerchantInfo
}

/**
 * 广告中是否含有申诉中订单
 */
export interface AdvertAppealStatusReq {
    /** 广告 ID */
    advertId: string;
}

export interface AdvertAppealStatusResp {
    /** true，有，false，没有 */
    hasOrder: boolean;
}

/**
 * 广告记录 - 获取商户广告列表
 */
export interface AdvertListReq {
    /** 币种 ids */
    coinIds?: string[];
    /** 广告方向集合 */
    advertDirectCds?: string[];
    /** 交易类型集合 */
    tradeTypeCds?: string[];
    /** 1 上架中 2 已下架 */
    advertStatus?: string;
    /** 页码 */
    pageNum?: number;
    /** 条数 */
    pageSize?: number;
    /** 搜索的数量 */
    amount?: string;
    /** 查询别人广告的 uid，不传就返回当前用户的广告数据 */
    uid?: number;
    /** 交易区 */
    areaIds?: string[];
    /** 广告 id */
    advertId?:string
}

export interface IMainChainAddr {
  id:string;
  address?: any;
  name: string;
  memo?: any;
}

interface IPaymentDetails {
    businessId: string;
    uid: string;
    /** 法币 ID */
    legalCurrencyId: string;
    /** 收付类型 */
    paymentTypeCd: string;
    /** 姓名 */
    name: string;
    /** 账号 */
    account: string;
    /** 开户行 */
    bankOfDeposit: string;
    /** 二维码 (图片资源地址) */
    qrCodeAddr: string;
    /** 是否启用，1，启用，0，未启用 */
    enabled:number
    /** 是否显示灰色 */
    grey: boolean;
    /** 付款详情 */
    paymentDetails?: string
    /** 银行支行 */
    bankBranch?: string
    /** 唯一标识 */
    id: string;
}

export interface IAdvertList {
    /** 最小金额 */
    minAmount: string;
    /** 有效期 */
    validDate: number;
    /** 支付方式 */
    payments: string[];
    /** 备注 */
    remark: string;
    /** 服务人数，广告主才有 */
    customerCnt: number;
    /** 成单数大于 */
    completedOrderCount: number;
    /** 广告方向 (BUY SELL) */
    advertDirectCd: string;
    /** 下架时间 */
    removalTime: number;
    /** 价格 */
    price: string;
    /** 最大金额 */
    maxAmount: string;
    /** 下架详情 */
    removalReason: string;
    /** 数量 */
    quantity: string;
    /** 昵称 */
    nickName?: any;
    /** 订单数 */
    orderCount: number;
    /** 是否是商户 */
    merchant: boolean;
    /** 认证等级 */
    certificationLevelCd: string;
    /** 头像 */
    avatar?: any;
    /** 广告 id */
    advertId: string;
    /** 是否在线 */
    onLine: boolean;
    /** 币种 id */
    coinId: string;
    /** 交易总量 */
    totalOrderAmount: string;
    /** 创建时间 */
    createTime: number;
    /** 主链地址 */
    mainchainAddrs: IMainChainAddr[];
    /** 币种名称 */
    coinName: string;
    /** 交易类型 */
    tradeTypeCd: string;
    /** 支付方式详情 */
    paymentDetails?: IPaymentDetails[];
    /** 广告状态（ON_SHELVES 上架中、EXPIRED 到期下架、TAKE_OFF_SHELVES_MERCHANT 商家下架、TAKE_OFF_SHELVES_SYSTEM 系统下架、DEALING 交易中、WIDTHDRAW 撤回中） */
    statusCd: string;
    /** 区域名字 */
    areaName: string;
    /** 法币符号 */
    currencySymbol: string;
    /** 新的广告状态（跟商户关联）(RESTING 休息中、NORMAL 正常、DEALING 交易中) */
    advertNewStatus: string;
    /** 是否置灰（重新上架） */
    grey: boolean;
    /** 是否可交易 */
    canTrade: boolean;
    /** 新增支付方式（返回是否需要置灰）*/
    newPayments: INewPayments[]
}
export interface INewPayments {
    /** BANK、WECHAT、ALIPAY */
    name: string
    /** 是否需要显示灰色 */
    grey: boolean
}

export interface AdvertListResp {
   list: IAdvertList[];
   total: number;
}

export interface AdvertListResp {
    list: IAdvertList[];
    total: number;
 }
 
 /**
  * 下架广告
  */
 export interface AdvertDownReq {
     /** 广告 id */
     advertId: string;
 }
 
 export interface AdvertDownResp {
     isSuccess: boolean;
 }
 
 /**
  * 重新上架广告
  */
 export interface AdvertReopenReq {
     /** 广告 id */
     advertId: string;
     /** 广告有效期 */
     validDays: number;
 }
 
 export interface AdvertReopenResp {
     isSuccess: boolean;
 }
 
 /**
  * 广告详情
  */
 export interface AdvertDetailReq {
     /** 广告 id */
     advertId: string;
 }
 
export interface AdvertDetailResp {
     /** 法币符号 */
     currencySymbol: string;
     /** 欢迎语 */
     welcomeInfoMessage: string;
     /** 币种 id */
     coinId: string;
     /** 交易类型 (INSIDE OUTSIDE) */
     tradeTypeCd: string;
     /** 广告方向 (BUY SELL) */
     advertDirectCd: string;
     /** 是否是商户 */
     merchant: boolean;
     /** 支付方式详情（参考首页广告列表） */
     paymentDetails?: IPaymentDetails[];
     /** 头像 */
     avatar?: string;
     /** 欢迎语类型 1 文字 2 图片 */
     welcomeInfoType: number;
     /** 认证等级 */
     certificationLevelCd: string;
     /** 下架原因 */
     removalReason: string;
     /** 最小金额 */
     minAmount: string;
     /** 价格 */
     price: string;
     /** 下架时间 */
     removalTime: number;
     /** 是否在线 */
     onLine: boolean;
     /** 广告 id */
     advertId: string;
     /** 支付方式 */
     payments: string[];
     /** 服务人数，广告主才有 */
     customerCnt: number;
     /** 订单数 */
     orderCount: number;
     /** 昵称 */
     nickName?: string;
     /** 主链信息 */
     mainchainAddrs: IMainChainAddr[];
     /** 创建时间 */
     createTime: number;
     /** 备注 */
     remark: string;
     /** 币种名称 */
     coinName: string;
     /** 交易总量 */
     totalOrderAmount: string;
     /** 数量 */
     quantity: string;
     /** 最大金额 */
     maxAmount: string;
     /** 有效期 */
     validDate: number;
     /** 成单数大于 */
     completedOrderCount: number;
     /** 交易区名称 */
     areaName: string;
     /** 法币国家缩写 */
     countryAbbreviation: string
     /** app 币种 logo */
     coinAppLogo: string
     /** web 币种 logo */
     coinWebLogo: string
     /** 广告状态（ON_SHELVES 上架中、EXPIRED 到期下架、TAKE_OFF_SHELVES_MERCHANT 商家下架、TAKE_OFF_SHELVES_SYSTEM 系统下架、DEALING 交易中、WIDTHDRAW 撤回中） */
     statusCd: string;
     /** 新的广告状态（跟商户关联）(RESTING 休息中、NORMAL 正常、DEALING 交易中) */
     advertNewStatus: string;
     /** 是否置灰（重新上架） */
     grey: boolean;
     /** 是否可交易 */
     canTrade: boolean;
    /** 购买剩余数量 */
    buyRemaining: string;
    /** 广告是否是上架状态 */
    isOnShelves:boolean
    /** 新增支付方式（返回是否需要置灰）*/
    newPayments: INewPayments[]
}
export interface INewPayments {
    /** BANK、WECHAT、ALIPAY */
    name: string
    /** 是否需要显示灰色 */
    grey: boolean
}


/**
 * 广告单详情 - 历史订单
 */
export interface AdvertOrderHistoryReq {
    /** 广告 ID */
    advertId: string;
    /** 页码 */
    pageNum: number;
    /** 每页条数 */
    pageSize: number;
}

export interface AdvertOrderHistoryResp {
    /** 总数 */
    total: number;
    pages: number;
    pageSize: number;
    pageNum: number;
    list: IAdvertOrderHistoryList[];
}

export interface IAdvertOrderHistoryList {
    /** 总价 */
    totalPrice: number;
    /** B 端商户 ID */
    businessId: string;
    /** 状态（CREATED 已创建 (初始值) WAS_PAYED 已付款 WAS_COLLECTED 已收款 WAS_TRANSFER_COIN 已转币 WAS_RECEIVE_COIN 已收币 (已完成) WAS_CANCEL 已取消 NOT_CANCEL__APPEALING 非取消、申诉中 CANCEL__APPEALING 取消、申诉中 NOT_CANCEL__APPEAL_FINISH 非取消、申诉完成 CANCEL__APPEAL_FINISH 取消、申诉完成） */
    statusCd: string;
    /** 广告 ID */
    advertId: string;
    /** 商家用户 ID */
    merchantUid: string;
    /** 用户 ID */
    uid: string;
    /** 数量 */
    number: number;
    /** 交易完成后，链上提币冻结结束时间 */
    freezeEndTime?: any;
    /** 主链 */
    mainchainAddrId?: any;
    /** 支付方式 ID */
    paymentId?: any;
    /** 订单 ID */
    id: string;
    /** 交易区名称 */
    currencyEnName: string;
    /** 币种符号 */
    symbol: string;
    /** 币种全称 */
    coinFullName: string;
    /** 币种名称 */
    coinName: string;
    /** 下单时间 */
    createdTime: string;
    /** 类型 (NUMBER TOTAL_PRICE) */
    typeCd: string;
    /** 广告主用户姓名 */
    advertUserName: string;
    /** 是否解冻过，1 解冻过，2 未解冻过 */
    unfreeze?: number;
    /** 支付（收款）结束时间 */
    expireTime?: any;
    /** 买卖角色 */
    buyAndSellRole: string;
    /** 是否已胜诉 */
    isAppealWinner: boolean;
    /** 买方 - 用户姓名*/
    buyerUserName: string
    /** 单价 */
    price: number
    /** 买方 - 商家昵称 */
    buyerMerNickName?: string
    /** 卖方 - 商家昵称 */
    sellerMerNickName?: string
    /** 买方 - 成单率 */
    buyerCompletedOrderRate?: string
    /** 卖方 - 成单率 */
    sellerCompletedOrderRate?: string
    /** 卖方 - 用户姓名 */
    sellerUserName: string
    /** 买方 - 是否商家 */
    buyerIsMerchant?: boolean
    /** 卖方 - 是否商家 */
    sellerIsMerchant?: boolean
    /** 方向 (BUY 买 SELL 卖) */
    directCd: string
    /** 交易类型 (INSIDE 站内 OUTSIDE 站外)*/
    dealTypeCd: string
    /** 买家用户 ID */
    buyerUid: string
    /** 卖家用户 ID */
    sellerUid: string
    /** 链路名称 */
    mainChainName: string
}

export type C2CAdvertTableData = YapiPostV1C2CAdvertListData & {
    advertDirect?: YapiPostV1C2CAdvertListData["advertDirectCd"]
    /** when user access other users adverts, the advertDirect should be flipped  */
    advertDirectFlip?: YapiPostV1C2CAdvertListData["advertDirectCd"]
    tradeType?: YapiPostV1C2CAdvertListData['tradeTypeCd']
    paymentNames?: YapiPostV1C2CAdvertListData['payments']
}


/**
 * 广告单记录
 */
export interface AdvertCoinListReq {
    /** 区域 id */
    areaIds?: string[];
    /** 搜索关键词 */
    searchKey?: string;
    /** 查询的 uid(不填就获取自己的) */
    uid?: string;
    /** 是否是上架中的 */
    isActivityOnSheves?: boolean;
}

export interface AdvertCoinListResp {
    symbol:	string;
    appLogo?: string;
    precision?: number;
    maxTransQuantity?:string;
    statusCd?: string;	
    defaultShow?: boolean;
    trade_precision?: number;
    balance?: string;
    minTransQuantity?: string;
    webLogo?: string;	
    coinFullName?: string;
    id: string;	
    coinName?: string;	
}

/**
 * 付款方式
 */
interface PaymentDomListProps {
    id: number
    type: string
    list: IAdvertReceiptAccountList[]
}

/** 广告列表搜索参数 */
export interface ISearchParams {
    /** 上架中 - 筛选表单 */
    onForm: AdvertListReq
    /** 已下架 - 筛选表单 */
    offForm: AdvertListReq
}
