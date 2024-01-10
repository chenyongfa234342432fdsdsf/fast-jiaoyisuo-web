import { t } from '@lingui/macro'
import { getCommonSettingKycLevel } from '@/apis/c2c/c2c-trade'
import { CertificationLevel } from '@/features/kyc/kyt-const'
import { getCodeDetailList } from '@/apis/common'
import { baseCommonStore } from '@/store/common'
import Icon from '@/components/icon'

enum ShortcoinsPay {
  /**
   * 快捷交易首页
   */
  HomePageCutCoins = 'homePageCutCoins',
  /**
   * 快捷交易买币
   */
  C2CCoinspayBuy = 'c2cCoinspayBuy',
  /**
   * 快捷交易卖币
   */
  C2CCoinspaySell = 'c2cCoinspaySell',
}

enum C2COrderStatus {
  /**
   * 已创建 (初始值)
   */
  CREATED = 'CREATED',
  /**
   * 已付款
   */
  WAS_PAYED = 'WAS_PAYED',
  /**
   * 已收款
   */
  WAS_COLLECTED = 'WAS_COLLECTED',
  /**
   * 已转币
   */
  WAS_TRANSFER_COIN = 'WAS_TRANSFER_COIN',
  /**
   * 已收币 (已完成)
   */
  WAS_RECEIVE_COIN = 'WAS_RECEIVE_COIN',
  /**
   *  已取消
   */
  WAS_CANCEL = 'WAS_CANCEL',
  /**
   *  非取消、申诉中
   */
  NOT_CANCEL__APPEALING = 'NOT_CANCEL__APPEALING',
  /**
   *  取消、申诉中
   */
  CANCEL__APPEALING = 'CANCEL__APPEALING',
  /**
   *  非取消、申诉胜利 (对于申诉方而言)
   */
  NOT_CANCEL__APPEAL_FINISH = 'NOT_CANCEL__APPEAL_FINISH',
  /**
   *  取消、申诉胜利 (对于申诉方而言)
   */
  CANCEL__APPEAL_FINISH = 'CANCEL__APPEAL_FINISH',
  /**
   *  非取消、申诉失败 (对于申诉方而言)
   */
  NOT_CANCEL__APPEAL_FAILURE = 'NOT_CANCEL__APPEAL_FAILURE',
  /**
   *  取消、申诉失败 (对于申诉方而言)
   */
  CANCEL__APPEAL_FAILURE = 'CANCEL__APPEAL_FAILURE',
}

enum ChangeC2COrderStatus {
  /**
   *  已付款
   */
  WAS_PAYED = 'WAS_PAYED',
  /**
   *  已收款
   */
  WAS_COLLECTED = 'WAS_COLLECTED',
  /**
   *  已转币
   */
  WAS_TRANSFER_COIN = 'WAS_TRANSFER_COIN',
  /**
   *  已收币
   */
  WAS_RECEIVE_COIN = 'WAS_RECEIVE_COIN',
}

enum PaymentMethodStatus {
  /**
   *  存在数据
   */
  exist = 'exist',
  /**
   *  存在数据但是未开启（展示去开启按钮，跳转到当前登陆人的收款信息列表去开启）
   */
  unopened = 'unopened',
  /**
   *  不存在数据未绑定（展示去绑定按钮，跳转到收款列表去添加）
   */
  unbound = 'unbound',
  /**
   *  不存在
   */
  none = 'none',
}

type ModalParams = {
  modalTitle?: string
  modalContent?: string
  canCelText?: string
  okText?: string
  onOkChange?: () => void | any
}

type ReturnFreeTradeTip = {
  tipContent: string
  tipTitle: string
  tipButton: JSX.Element
}

enum PayMethods {
  BANK = 'BANK',
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY',
}

type IsPassThrough = {
  status: boolean
  title: string
}

const useCommonTrade = () => {
  const payMethods = {
    BANK: t`features/user/personal-center/settings/payment/add/index-2`,
    WECHAT: t`features/user/personal-center/settings/payment/add/index-0`,
    ALIPAY: t`features/user/personal-center/settings/payment/add/index-1`,
  }
  return { payMethods }
}

const isPassThrough = async (): Promise<IsPassThrough | undefined> => {
  const { isOk, data } = await getCommonSettingKycLevel({})

  const { isOk: isKycOk, data: kycdata } = await getCodeDetailList({
    codeVal: 'kycTypeInd',
    lanType: baseCommonStore.getState().locale,
  })

  const getCertificationLevelText = code => {
    return `KYC ${kycdata?.find(item => item?.codeVal === String(code))?.codeKey}`
  }

  if (isOk && isKycOk) {
    const kycObj = {
      NONE: { code: -Infinity },
      ELEMENTARY: {
        code: CertificationLevel.personalStandardCertification,
        title: getCertificationLevelText(CertificationLevel.personalStandardCertification),
      },
      SENIOR: {
        code: CertificationLevel.personalAdvancedCertification,
        title: getCertificationLevelText(CertificationLevel.personalStandardCertification),
      },
      ENTERPRISE: {
        code: CertificationLevel.enterpriseCertification,
        title: getCertificationLevelText(CertificationLevel.personalStandardCertification),
      },
    }
    const { code, title } = kycObj[data?.level]
    if (code > data?.kycType) {
      return { status: false, title }
    }
    return { status: true, title }
  }
}

enum HelpCenterUrl {
  C2CLegalDisclaimer = 'c2c_legal_disclaimer',
}

enum TransactionStation {
  /**
   * 站内
   */
  INSIDE = 'INSIDE',
  /**
   * 站外
   */
  OUTSIDE = 'OUTSIDE',
}

enum AdvertDirectCds {
  BUY = 'BUY',
  SELL = 'SELL',
  BIDTRADE = 'BIDTRADE',
}

enum IsNotOtc {
  /**
   * 不是
   */
  notOtc = 1,
  /**
   * 是
   */
  isOtc = 2,
}

const getDisplayPayment = (_, radioItem) => {
  if (radioItem?.bankOfDeposit) {
    return radioItem?.account
  } else if (radioItem?.account) {
    return radioItem.qrCodeAddr && <Icon name="rebates_drawing-qr" hasTheme />
  } else {
    return radioItem?.paymentDetails
  }
}

export {
  ShortcoinsPay,
  C2COrderStatus,
  ChangeC2COrderStatus,
  PaymentMethodStatus,
  useCommonTrade,
  isPassThrough,
  ModalParams,
  ReturnFreeTradeTip,
  PayMethods,
  HelpCenterUrl,
  TransactionStation,
  AdvertDirectCds,
  IsNotOtc,
  getDisplayPayment,
}
