import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { IC2cOrderDetail } from '@/typings/api/c2c/order'
import { t } from '@lingui/macro'
import { FinancialRecordLogTypeEnum } from '@/constants/assets'
import { getAssetsHistoryPageRoutePath } from '@/helper/route/assets'

dayjs.extend(isToday)

export const LimitSize = 5 * (1024 * 1024) // 5MB 图片大小

export enum ImImageWidthAndHeightEnum {
  width = 120, // 图片最大宽度
  height = 225, // 图片最大高度
}

/** 云信 SDK 配置 */
export type ImSettingsType = {
  token: string
  appKey: string
}

export enum ImMessageTypeEnum {
  custom = 'custom', // 自定义消息
  orderDetail = 'orderDetail', // 订单详情
  text = 'text', // 文本消息
  image = 'image', // 图片消息
  notification = 'notification', // 系统消息
}

export enum ImMsgTypeEnum {
  ordinary = 1, // 普通消息
  promptBox, // 提示框消息
  remind, // 提醒消息
}

export enum AttachMsgTypeEnum {
  reminded = 3,
}

export enum AttachSubTypeEnum {
  reminded = 1,
}

export enum ImOrderDetailDealType {
  INSIDE = 'INSIDE', // 站内
  OUTSIDE = 'OUTSIDE', // 站外
}

export interface ImOrderDetailType {
  /** 订单 id */
  id: string
  /** 订单创建时间 */
  createdTime: number
  /** 币对名称 */
  coinName: string
  /** 买家 id */
  buyerUid: string
  /** 卖家 id */
  sellerUid: string
  /** 价格 */
  price: number
  /** 数量 */
  number: number
  /** 总价值 */
  totalPrice: number
  /** 站内站外 */
  dealTypeCd: string
  /** 法币英文名称 */
  currencyEnName: string
  /** 法币符号 */
  currencySymbol: string
  /** 群组 id */
  tid: string
  /** 是否是申诉人 */
  isAppealer: boolean
  /** 是否是胜诉人 */
  isAppealWinner: boolean
}

export interface ImListType {
  /** 文本内容 */
  body: string
  /** 发送人 */
  from: string
  /** 昵称 */
  fromNick: string
  /** 消息类型 p2p: 单点 team: 群消息 */
  scene: string
  /** 消息状态 */
  status: string
  /** 接受人 */
  target: string
  /** 时间 */
  time: number
  /** 接受人 */
  to: string
  /** 消息类型 text 文本 image 图片 */
  type: string
  /** 消息唯一 id */
  idServer: string
  /** 自定义消息内容 */
  attach?: {
    msgType: number
    orderStatus: string
    subType: number
    ext: string
    name: string
    url: string
    w: number
    h: number
  }
  orderDetail: IC2cOrderDetail
}

export interface ImSystemNotificationOrderStatusType {
  /** 订单标题 */
  title: string
  /** 订单内容 */
  text: string
  /** 订单副标题 */
  subText: string
  /** 是否是链接 */
  hasLink: boolean
  /** 是否有副标题 */
  hasSub: boolean
  /** 链接 */
  link: string
  /** 副链接 */
  subLink: string
  /** 是否有回调方法 */
  hasCallBack: boolean
  /** 是否有副标题回调方法 */
  hasSubCallBack: boolean
}

interface ImOrderStatusProps {
  /** 订单 id */
  orderNumber: string
  /** 是否是申诉人 */
  isAppealer: boolean
  /** 是否胜诉 */
  isAppealWinner: boolean
  msgType?: number
  subType?: number
  dealTypeCd?: string
}

const routerList = (orderNumber: string, dealTypeCd?: string) => {
  return {
    toDetails: '/assets/main/withdraw',
    toRecord: getAssetsHistoryPageRoutePath(
      dealTypeCd === 'INSIDE' ? FinancialRecordLogTypeEnum.c2c : FinancialRecordLogTypeEnum.main
    ),
    // toCoin: `/assets/main/withdraw?type=${dealTypeCd}`
  }
}

export const OrderDetailDefaultValue = {
  type: 'orderDetail',
  body: '',
  from: '',
  fromNick: '',
  scene: '',
  status: '',
  target: '',
  time: 0,
  to: '',
  idServer: 'orderDetail',
}

/** 订单状态默认值 */
const orderDetailDefaultOptions = {
  title: '',
  text: '',
  subText: '',
  hasLink: false,
  hasSub: false,
  link: '',
  subLink: '',
  hasCallBack: false,
  hasSubCallBack: false,
}

/** 通用订单状态 */
export const ImSystemCommonStatus = ({ orderNumber, isAppealer, isAppealWinner }: ImOrderStatusProps) => {
  return {
    WAS_RECEIVE_COIN: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_cyam5_x_11olrd73qx1pm`,
      text: `${t`features/assets/c2c/total-assets/index-0`} ${orderNumber} ${t`features_c2c_trade_c2c_chat_c2c_chat_window_common_zlfetvablohm5yy27_ck-`}`,
    },
    WAS_CANCEL: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_cqtf2n00nvxqetd2yrgmm`,
      text: `${t`features/assets/c2c/total-assets/index-0`} ${orderNumber} ${t`features_c2c_trade_c2c_chat_c2c_chat_window_common_a6qhphy3g6zqcgsfzklnz`}`,
    },
    CANCEL__APPEALING: {
      ...orderDetailDefaultOptions,
      title: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
      text: isAppealer
        ? t`features_c2c_trade_c2c_chat_c2c_chat_window_common_vhke96vu9isk_bxydu1y-`
        : t`features_c2c_trade_c2c_chat_c2c_chat_window_common_efoc0veufxnxid7saljqq`,
    },
    NOT_CANCEL__APPEALING: {
      ...orderDetailDefaultOptions,
      title: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
      text: isAppealer
        ? t`features_c2c_trade_c2c_chat_c2c_chat_window_common_vhke96vu9isk_bxydu1y-`
        : t`features_c2c_trade_c2c_chat_c2c_chat_window_common_efoc0veufxnxid7saljqq`,
    },
    NOT_CANCEL__APPEAL_FINISH: {
      ...orderDetailDefaultOptions,
      title: isAppealWinner
        ? t`constants_c2c_advertise_gkavi6wsnbyjbtgn9ngp9`
        : t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`,
      text: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_ereznfp-7puckgj9ya9fz`,
    },
    CANCEL__APPEAL_FINISH: {
      ...orderDetailDefaultOptions,
      // title: t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`,
      title: isAppealWinner
        ? t`constants_c2c_advertise_gkavi6wsnbyjbtgn9ngp9`
        : t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`,
      text: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_ereznfp-7puckgj9ya9fz`,
    },
  }
}

/** 买家订单状态 */
export const ImBuyerStatus = ({
  orderNumber,
  isAppealer,
  isAppealWinner,
  msgType,
  subType,
  dealTypeCd,
}: ImOrderStatusProps) => {
  const router = routerList(orderNumber, dealTypeCd)
  return {
    CREATED: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_jtiorqstlwnbotgcot6j9`,
      // text: t`constants_c2c_advertise_iexmw4kjztny6sjn1vxaz`,
      hasLink: false,
      // link: router.toDetails,
    },
    WAS_PAYED: {
      ...orderDetailDefaultOptions,
      title:
        msgType === AttachMsgTypeEnum.reminded && subType === AttachSubTypeEnum.reminded
          ? t`features_c2c_trade_c2c_chat_c2c_chat_window_common_vpxy5ohcgciyjc2y_zvcg`
          : t`features_c2c_trade_c2c_chat_c2c_chat_window_common_9ciqfkrqgvhbbiyyukx1v`,
      hasLink: false,
    },
    WAS_COLLECTED: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_wdhrov2g76dyjzlasmfbw`,
      // text: t`features_announcement_bulletin_board_index_5101190`,
      hasLink: false,
    },
    WAS_TRANSFER_COIN: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_rydyxo71n55lj4swl-6uy`,
      text: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_govfdag-ikpxjbnkz_aun`,
      // subText: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_xdvvhpirts9mqm4glwwiq`,
      hasLink: true,
      link: router.toRecord,
    },
    ...ImSystemCommonStatus({ orderNumber, isAppealer, isAppealWinner }),
  }
}

/** 卖家订单状态 */
export const ImSellerStatus = ({ orderNumber, isAppealer, isAppealWinner, dealTypeCd }: ImOrderStatusProps) => {
  const router = routerList(orderNumber, dealTypeCd)
  return {
    CREATED: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_dl2y4f90myayzfthfa2jx`,
      // text: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_b_ifgbg9uuefr-j_gxb06`,
    },
    WAS_PAYED: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_hizwnknfakhvtn1kvvfjx`,
      // text: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_txuvbc66tutbcrt1j1lrm`,
      hasLink: false,
      // hasCallBack: true,
    },
    WAS_COLLECTED: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_qtypzy-1thghfqm4hzuzw`,
      text: t`constants_c2c_advertise_kr_zrnasdsyu1s5e-5_yp`,
      hasLink: true,
      link: router.toDetails,
    },
    WAS_TRANSFER_COIN: {
      ...orderDetailDefaultOptions,
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_jrnsennjjvjx0_inaa_yn`,
      // text: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_pkhjuzvpve73iek14lz92`,
    },
    ...ImSystemCommonStatus({ orderNumber, isAppealer, isAppealWinner }),
  }
}

/** 处理聊天时间 判断是否是今年&今天 进行格式化 */
export function ImFormattedTime(time: number) {
  if (!time) return
  const today = dayjs(time).isToday()
  const notThisYear = time < dayjs().startOf('year').valueOf()
  return dayjs(time).format(today ? 'HH:mm' : notThisYear ? 'YYYY-MM-DD HH:mm' : 'MM-DD HH:mm')
}

export const MerchantValue = {
  Approval: 1,
  NotApproval: 2,
}
