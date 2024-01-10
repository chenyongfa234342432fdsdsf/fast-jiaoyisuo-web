/**
 * c2c-广告
 */
import { t } from '@lingui/macro'

/**
 * c2c-数据字典类型
 */
export enum AdvertisingDictionaryTypeEnum {
  /** 认证等级 企业认证/初级认证/高级认证 */
  certificationLevel = 'c2c_certification_level_cd',
  /** 支付类型 支付宝/微信支付/银行卡	*/
  paymentType = 'c2c_payment_type_cd',
  /** 广告状态 */
  advertisingStatus = 'c2c_advertising_status_cd',
  /** 广告方向  买币卖币 */
  advertDirect = 'advert_buy_sell', // 购买/出售 'C2c_Advert_Direct',
  /** 广告交易类型 站内/站外 */
  advertDealType = 'c2c_advert_deal_type',
  /** 广告单详情广告交易类型 站内交易/站外交易 */
  detailAdvertDealType = 'c2c_advert_deal_detail_type',
  /** 支付方式颜色  */
  c2cPaymentColor = 'c2c_payment_color',
}

/**
 * 发布广告单 - 广告方向类型
 */
export enum AdvertisingDirectionTypeEnum {
  /** 出售 */
  sell = 'SELL',
  /** 购买 */
  buy = 'BUY',
}

export function getAdvertDirectionLabel(AdvertDirectType: AdvertisingDirectionTypeEnum) {
  if (AdvertDirectType === AdvertisingDirectionTypeEnum.sell) return t`trade.c2c.sell`
  return t`trade.c2c.buy`
}

/**
 * 发布广告单 - 价格波动开关枚举
 */
export enum PriceFluctuationsTypeEnum {
  Yes = 1,
  No = 2,
}

/** 发布广告单 - 广告方向类型列表 */
export function getAdvertisingDirectionTypeList() {
  return [
    {
      label: t`constants_c2c_advertise_cgaml_bgs70x7i-iedqup`,
      value: AdvertisingDirectionTypeEnum.sell,
    },
    {
      label: t`trade.c2c.BuyCoins`,
      value: AdvertisingDirectionTypeEnum.buy,
    },
  ]
}

/**
 * 发布广告单 - 重合度按钮枚举
 */
export enum CoincidentEnumType {
  /**
   * 重合度低
   */
  LowCoexistence = 'low',
  /**
   * 重合度中
   */
  CoincidenceDegree = 'middle',
  /**
   * 重合度高
   */
  HighCoincidence = 'high',
}

/**
 * 发布广告单 - 交易类型
 */
export enum TradeTypeEnum {
  /** 站内交易 */
  station = 'station',
  /** 站外交易 */
  outside = 'Outside',
}

/**
 * 交易区交易类型
 */
export enum AreaTransactionTypeEnum {
  /** 全部 */
  all = 'ALL',
  /** 站内 */
  inside = 'INSIDE',
  /** 站外 */
  outside = 'OUTSIDE',
}

/** 发布广告单 - 交易区交易类型列表 */
export function getAreaTransactionTypeList() {
  return [
    {
      label: t`constants_c2c_advertise_cihh88stqngpq0qdxlpkw`,
      value: AreaTransactionTypeEnum.inside,
    },
    {
      label: t`constants_c2c_advertise_lgzilafiawicqgzklvhak`,
      value: AreaTransactionTypeEnum.outside,
    },
  ]
}

/**
 * 发布广告单 - 有效期类型
 */
export enum ValidDaysTypeEnum {
  /** 1 天 */
  one = 1,
  /** 3 天 */
  three = 2,
  /** 7 天 */
  seven = 7,
  /** 15 天 */
  fifteen = 15,
  /** 30 天 */
  thirty = 30,
}

export function getValidDaysTypeName(type: ValidDaysTypeEnum) {
  return {
    [ValidDaysTypeEnum.one]: t`constants_c2c_advertise_7dkblvqzapxlrepemq7rf`,
    [ValidDaysTypeEnum.three]: t`constants_c2c_advertise_8njktkkebsmxa4iawxkzl`,
    [ValidDaysTypeEnum.seven]: t`constants_c2c_advertise_5kuixw4i4q1yzkcsvj-7u`,
    [ValidDaysTypeEnum.fifteen]: t`constants_c2c_advertise_bab1in2l65n7idsyrbp4u`,
    [ValidDaysTypeEnum.thirty]: t`constants_c2c_advertise_u2gpi-gtbnpqb_mncy5xh`,
  }[type]
}
/** 广告有效期下拉列表 */
export function getValidDaysList() {
  return [
    { label: t`constants_c2c_advertise_7dkblvqzapxlrepemq7rf`, value: ValidDaysTypeEnum.one },
    { label: t`constants_c2c_advertise_8njktkkebsmxa4iawxkzl`, value: ValidDaysTypeEnum.three },
    { label: t`constants_c2c_advertise_5kuixw4i4q1yzkcsvj-7u`, value: ValidDaysTypeEnum.seven },
    { label: t`constants_c2c_advertise_bab1in2l65n7idsyrbp4u`, value: ValidDaysTypeEnum.fifteen },
    { label: t`constants_c2c_advertise_u2gpi-gtbnpqb_mncy5xh`, value: ValidDaysTypeEnum.thirty },
  ]
}

/**
 * 发布广告单 - 最新价格限额重合度类型
 */
export enum CoincidenceValueTypeEnum {
  /** 20% */
  twenty = '0.2',
  /** 30% */
  thirty = '0.3',
  /** 50% */
  fifty = '0.5',
  /** 80% */
  eighty = '0.8',
}

export function getCoincidenceValueTypeName(type: string) {
  return {
    [CoincidenceValueTypeEnum.twenty]: '20%',
    [CoincidenceValueTypeEnum.thirty]: '30%',
    [CoincidenceValueTypeEnum.fifty]: '50%',
    [CoincidenceValueTypeEnum.eighty]: '80%',
  }[type]
}

export function getCoincidenceValueTypeList() {
  return [
    { label: '20%', value: CoincidenceValueTypeEnum.twenty },
    { label: '30%', value: CoincidenceValueTypeEnum.thirty },
    { label: '50%', value: CoincidenceValueTypeEnum.fifty },
    { label: '80%', value: CoincidenceValueTypeEnum.eighty },
  ]
}

/**
 *  发布广告单 - 最新价格类型值
 */

export enum SetsTheEnumerationMethod {
  /** 本站 */
  Local = 'local',
  /** OKX */
  OKX = 'okx',
  /** 币安 */
  Binance = 'binance',
}

export function getTypeList(user) {
  return [
    // 获取当前用户商户名称
    { label: user, value: SetsTheEnumerationMethod.Local },
    {
      label: 'OKX',
      value: SetsTheEnumerationMethod.OKX,
    },
    {
      label: t`constants_c2c_advertise_ynrtrf2mep`,
      value: SetsTheEnumerationMethod.Binance,
    },
  ]
}

/**
 * 发布广告单 - 认证等级类型
 */
export enum CertificationLevelTypeEnum {
  /** 无 */
  none = 'none',
  /** 初级认证 */
  junior = 'junior',
  /** 高级认证 */
  advanced = 'advanced',
  /** 企业认证 */
  enterprise = 'enterprise',
}

export function getCertificationLevelTypeName(type: CertificationLevelTypeEnum) {
  return {
    [CertificationLevelTypeEnum.none]: t`constants_c2c_advertise_5v32msxzc33cr0srokzo9`,
    [CertificationLevelTypeEnum.junior]: t`constants_c2c_advertise_lnkv8ix7uaxhp7a4c-s4k`,
    [CertificationLevelTypeEnum.advanced]: t`features_user_personal_center_menu_navigation_index_5101266`,
    [CertificationLevelTypeEnum.enterprise]: t`features/user/personal-center/profile/index-17`,
  }[type]
}
/** 认证等级下拉列表 */
export function getCertificationLevelList() {
  return [
    { label: t`constants_c2c_advertise_5v32msxzc33cr0srokzo9`, value: CertificationLevelTypeEnum.none },
    { label: t`constants_c2c_advertise_lnkv8ix7uaxhp7a4c-s4k`, value: CertificationLevelTypeEnum.junior },
    {
      label: t`features_user_personal_center_menu_navigation_index_5101266`,
      value: CertificationLevelTypeEnum.advanced,
    },
    { label: t`features/user/personal-center/profile/index-17`, value: CertificationLevelTypeEnum.enterprise },
  ]
}

/**
 * 发布广告单 - 支付方式类型
 */
export enum PaymentTypeEnum {
  /** 银行卡 */
  bankCard = 'BANK',
  /** 支付宝 */
  aliPay = 'ALIPAY',
  /** 微信支付 */
  weChat = 'WECHAT',
  /** paypal */
  paypal = 'PAYPAL',
}

export function getPaymentTypeName(type: string) {
  return {
    [PaymentTypeEnum.bankCard]: t`features/user/personal-center/settings/payment/add/index-2`,
    [PaymentTypeEnum.aliPay]: t`features/user/personal-center/settings/payment/add/index-1`,
    [PaymentTypeEnum.weChat]: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101396`,
    [PaymentTypeEnum.paypal]: 'paypal',
  }[type]
}

export function getPaymentTypeColor(type: string) {
  return {
    [PaymentTypeEnum.bankCard]: '#F1AE3D',
    [PaymentTypeEnum.aliPay]: '#6195F6',
    [PaymentTypeEnum.weChat]: '#50B16C',
    [PaymentTypeEnum.paypal]: '#4AA4DE',
  }[type]
}

/**
 * 发布广告单 - 广告重合度列表类型
 */
export enum CoincidenceListTypeEnum {
  /** 买 */
  bid = 'bid',
  /** 卖 */
  ask = 'ask',
}

/**
 * 广告单记录-tab 类型
 */
export enum HistoryTabTypeEnum {
  /** 上架中 */
  on = '1',
  /** 已下架 */
  off = '2',
}

/**
 * 广告单记录 - 广告状态
 */
export enum HistoryStatusTypeEnum {
  /** 正常 */
  normal = 'NORMAL',
  /** 交易中 */
  trade = 'DEALING',
  /** 休息中 */
  resting = 'RESTING',
}

export function getHistoryStatusTypeName(type: string) {
  return {
    [HistoryStatusTypeEnum.normal]: t`constants_c2c_advertise_3mkivxt58ll06uz4ywurr`,
    [HistoryStatusTypeEnum.trade]: t`constants_c2c_advertise_4qhdaoe93tiuexges6y_y`,
    [HistoryStatusTypeEnum.resting]: t`constants_c2c_advertise_dzenwijlu_z4stdbrldop`,
  }[type]
}

/**
 * 广告 - 广告状态
 */
export enum AdvertStatusTypeEnum {
  /** 上架中 */
  shelves = 'ON_SHELVES',
  /** 到期下架 */
  expired = 'EXPIRED',
  /** 商家下架 */
  merchantOffShelves = 'TAKE_OFF_SHELVES_MERCHANT',
  /** 系统下架 */
  systemOffShelves = 'TAKE_OFF_SHELVES_SYSTEM',
  /** 交易中 */
  dealing = 'DEALING',
  /** 撤回中 */
  withdrawing = 'WIDTHDRAW',
}

export enum advertDirectCdsEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}
export enum tradeTypeCdsEnum {
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
}
export enum advertTypeCdsEnum {
  CAN_TRADE = 'CAN_TRADE',
  HAS_TRADE = 'HAS_TRADE',
}

export const advertDirectCds = [advertDirectCdsEnum.BUY, advertDirectCdsEnum.SELL]
export const tradeTypeCds = [tradeTypeCdsEnum.INSIDE, tradeTypeCdsEnum.OUTSIDE]
export const advertTypeCds = [advertTypeCdsEnum.CAN_TRADE, advertTypeCdsEnum.HAS_TRADE]

export enum adCodeDictionaryEnum {
  Advert_Direct = 'advert_buy_sell',
  Deal_Type = 'c2c_advert_deal_type',
  Payment_Type = 'c2c_payment_type_cd',
  Ad_Status = 'c2c_advertising_status_cd',
  Payment_Color = 'c2c_payment_color',
  Payment_Remark = 'c2c_payment_remark',
  PaymentSupportItems = 'c2c_payment_support_items',
}

/**
 * 广告订单状态
 * 数据字典：c2c_order_status_cd
 *  CANCEL__APPEAL_FINISH 取消、申诉完成
 */
export enum AdvertiseOrderStatusEnum {
  /** 已创建 (初始值) = 待转账 */
  created = 'CREATED',
  /** 已付款 = 待确认收款 */
  wasPayed = 'WAS_PAYED',
  /** 已收款 = 待转币 */
  wasCollected = 'WAS_COLLECTED',
  /** 已转币 = 待确认收币 */
  wasTransferCoin = 'WAS_TRANSFER_COIN',
  /** 已收币 (已完成) = 已完成 */
  wasReceiveCoin = 'WAS_RECEIVE_COIN',
  /** 已取消 = 已取消 */
  wasCancel = 'WAS_CANCEL',
  /** 非取消、申诉中 = 申诉中 */
  notCancelAppealing = 'NOT_CANCEL__APPEALING',
  /** 取消、申诉中 = 申诉中 */
  cancelAppealing = 'CANCEL__APPEALING',
  /** 非取消、申诉完成 = 仲裁胜利 */
  notCancelAppealFinish = 'NOT_CANCEL__APPEAL_FINISH',
  /** 取消、申诉完成 = 仲裁胜利 */
  cancelAppealFinish = 'CANCEL__APPEAL_FINISH',
}

/**
 * 根据广告订单状态返回广告单详情历史订单展示文案
 * @param type 订单状态
 * @param buyAndSellRole 买卖角色
 * @param isAppealWinner 是否已胜诉
 */
export function getAdvertiseOrderStatusName(type: string, buyAndSellRole: string, isAppealWinner: boolean) {
  return {
    [AdvertiseOrderStatusEnum.created]: `${
      buyAndSellRole === AdvertisingDirectionTypeEnum.buy
        ? t`constants_c2c_advertise_iexmw4kjztny6sjn1vxaz`
        : t`constants_c2c_advertise_mgafjvxghsbnerrmznxwa`
    }`,
    [AdvertiseOrderStatusEnum.wasPayed]: `${
      buyAndSellRole === AdvertisingDirectionTypeEnum.buy
        ? t`constants_c2c_advertise_rb1rjemfm9-wechmnzvke`
        : t`constants_c2c_advertise_fvlkjehcc3kwztbzvf6iu`
    }`,
    [AdvertiseOrderStatusEnum.wasCollected]: `${
      buyAndSellRole === AdvertisingDirectionTypeEnum.buy
        ? t`constants_c2c_advertise_uomu6brub1obmunifvzvt`
        : t`constants_c2c_advertise_kr_zrnasdsyu1s5e-5_yp`
    }`,
    [AdvertiseOrderStatusEnum.wasTransferCoin]: `${
      buyAndSellRole === AdvertisingDirectionTypeEnum.buy
        ? t`constants_c2c_advertise_txfao14-og1hcn4zwri39`
        : t`constants_c2c_advertise_fkx-2cdwsj1qp0f0sauwx`
    }`,
    [AdvertiseOrderStatusEnum.wasReceiveCoin]: t`constants/assets/index-21`,
    [AdvertiseOrderStatusEnum.wasCancel]: t`constants_c2c_advertise_pg3zzcd3uwjh4-5rco73n`,
    [AdvertiseOrderStatusEnum.notCancelAppealing]: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
    [AdvertiseOrderStatusEnum.cancelAppealing]: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
    [AdvertiseOrderStatusEnum.notCancelAppealFinish]: `${
      isAppealWinner
        ? t`constants_c2c_advertise_gkavi6wsnbyjbtgn9ngp9`
        : t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`
    }`,
    [AdvertiseOrderStatusEnum.cancelAppealFinish]: `${
      isAppealWinner
        ? t`constants_c2c_advertise_gkavi6wsnbyjbtgn9ngp9`
        : t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`
    }`,
  }[type]
}

enum AdsNewStatusEnum {
  RESTING = 'RESTING',
  NORMAL = 'NORMAL',
  DEALING = 'DEALING',
}

export const getAdsNewStatus = () => {
  return {
    [AdsNewStatusEnum.RESTING]: t`constants_c2c_advertise_dzenwijlu_z4stdbrldop`,
    [AdsNewStatusEnum.NORMAL]: t`constants_c2c_advertise_3mkivxt58ll06uz4ywurr`,
    [AdsNewStatusEnum.DEALING]: t`constants_c2c_advertise_4qhdaoe93tiuexges6y_y`,
  }
}

/**
 * 交易区是否允许站外交易
 */
export enum CurrencyCanOutTradeEnum {
  /** 可以 */
  yes = 'YES',
  /** 不可以 */
  no = 'NO',
}

/**
 * 商家是否允许站外交易
 */
export enum MerchantCanOutTradeEnum {
  /** 可以 */
  yes = 1,
  /** 不可以 */
  no,
}

/**
 * 是否启用收款账号/支付方式
 */
export enum PaymentEnabledTypeEnum {
  /** 未启用 */
  no = 0,
  /** 启用 */
  yes,
}

/**
 * 发布广告要求
 */
export enum PostAdvertRequireEnum {
  /** 认证商家 */
  merchant = 'MERCHANT',
  /** 没要求 */
  none = 'NONE',
}

/**
 * 广告 - 欢迎语类型
 */
export enum WelcomeInfoTypeEnum {
  /** 文字 */
  text = 1,
  /** 图片 */
  image,
}

/**
 * 商户状态
 */
export enum C2CMerchantStatusTypeEnum {
  /** 商户申请审核中 */
  applying = 'applying',
  /** 正常商家 */
  enable = 'enable',
  /** 当前不是商户 */
  none = 'none',
  /** 解除中 */
  terminating = 'terminating',
}
