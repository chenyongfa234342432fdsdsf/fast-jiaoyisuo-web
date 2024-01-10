import { lazy, memo, useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { Avatar, Button, Input, Message, Spin, Upload, Image } from '@nbit/arco'
// import {
//   NIM,
//   browserAdapters,
//   MsgService,
//   MsgLogService,
//   SessionService,
//   TeamService,
//   cloudStorageService,
// } from 'nim-web-sdk-ng/dist/esm'
import { CellMeasurer, CellMeasurerCache, List, AutoSizer } from 'react-virtualized/dist/commonjs'
import { getAllStorage, getUserInfo, setAllStorage } from '@/helper/cache'
import { useCreation, useGetState, useMount, useRequest, useUnmount } from 'ahooks'
import dayjs from 'dayjs'
import classNames from 'classnames'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useLayoutStore } from '@/store/layout'
import Icon from '@/components/icon'
import { baseUserStore } from '@/store/user'
import { cloneDeep, isEmpty, unionBy } from 'lodash'
import { getImToken, getOrderDetail, postRegisterIm } from '@/apis/c2c/im'
import { postUploadImage } from '@/apis/user'
// import { getUserInfo } from '@/helper/cache'
import { IC2cOrderDetail } from '@/typings/api/c2c/order'
import Link from '@/components/link'
import { fetchC2CUserProfile } from '@/apis/c2c/center'
import { C2CUserProfileResp } from '@/typings/api/c2c/center'
import { getC2CCenterPagePath } from '@/helper/route'
import { link } from '@/helper/link'
import { formatCurrency } from '@/helper/decimal'
import { sortC2CChatListData } from '@/helper/c2c/center'
import {
  ImSystemNotificationOrderStatusType,
  ImBuyerStatus,
  ImSellerStatus,
  ImFormattedTime,
  ImSettingsType,
  ImMessageTypeEnum,
  ImMsgTypeEnum,
  ImOrderDetailDealType,
  // ImListType,
  ImImageWidthAndHeightEnum,
  OrderDetailDefaultValue,
  LimitSize,
  MerchantValue,
} from '@/features/c2c/c2c-chat-window/common'
import { envIsTest, isPublicC2cMode, c2cSdkAppId } from '@/helper/env'

import request from '@/plugins/request'
import {
  initC2CIm,
  sendImageMessage,
  sendTextMessage,
  bindEvents,
  queryHistoryMessages,
  destroyIm,
  getCurrentUserId,
} from '../im-sdk'
import { ImListType } from '../im-sdk/types'

import styles from './index.module.css'

type settingsType = {
  token: string
  appKey: string
}

interface imListType {
  body: string
  from: string
  fromNick: string
  scene: string
  status: string
  target: string
  time: number
  to: string
  type: string
  attach?: {
    ext: string
    name: string
    url: string
    w: number
    h: number
  }
}

enum Direction {
  Buy = 'buy',
  Sell = 'sell',
}

enum MessageType {
  Custom = 'custom',
  Text = 'text',
  Image = 'image',
}

enum OrderType {
  CREATED = 'CREATED', // 已创建
  WAS_PAYED = 'WAS_PAYED', // 已付款
  WAS_COLLECTED = 'WAS_COLLECTED', // 已收款
  WAS_TRANSFER_COIN = 'WAS_TRANSFER_COIN', // 已转币
  WAS_RECEIVE_COIN = 'WAS_RECEIVE_COIN', // 已收币 (已完成)
  WAS_CANCEL = 'WAS_CANCEL', // 已取消
  NOT_CANCEL__APPEALING = 'NOT_CANCEL__APPEALING', // 非取消、申诉中
  CANCEL__APPEALING = 'CANCEL__APPEALING', // 取消、申诉中
  NOT_CANCEL__APPEAL_FINISH = 'NOT_CANCEL__APPEAL_FINISH', // 非取消、申诉完成
  CANCEL__APPEAL_FINISH = 'CANCEL__APPEAL_FINISH', // 取消、申诉完成
}

// const cache = new CellMeasurerCache({
//   defaultHeight: 50,
//   fixedWidth: true,
//   // keyMapper: index => index,
//   // fixedHeight: true,
// })

function C2CChatWindow({ orderDetails }: { orderDetails: IC2cOrderDetail }) {
  const nimSDK = useRef<any>()
  const settings = useRef<settingsType>({
    token: '',
    appKey: '',
  })

  const cache = useMemo(() => {
    return new CellMeasurerCache({
      defaultHeight: 109,
      fixedWidth: true,
    })
  }, [])

  const [textAreaValue, setTextAreaValue] = useState<string>('')
  let userInfo = baseUserStore.getState().userInfo
  let { uid, nickName } = baseUserStore.getState().userInfo

  if (!isEmpty(baseUserStore.getState().c2cModeUserInfo)) {
    userInfo = baseUserStore.getState().c2cModeUserInfo
    uid = baseUserStore.getState().c2cModeUserInfo?.uid || uid
  }

  const [chatList, setImListOrigin, getChatList] = useGetState<Array<ImListType>>([])

  const setChatList = (list: Array<ImListType>) => {
    setImListOrigin(unionBy(list, item => item.idServer))
  }
  const chatWindowRef = useRef<any>(null)
  const controlRef = useRef<boolean>(true)
  const newDataRef = useRef<number>(101)
  const sendOrReceiveMessageRef = useRef<number>(0)
  const [userProfile, setUserProfile] = useState<C2CUserProfileResp>()
  const TextArea = Input.TextArea

  const c2cUserProfile = async () => {
    const res = await fetchC2CUserProfile(
      uid === orderDetails?.buyerUid ? { uid: orderDetails?.sellerUid } : { uid: orderDetails?.buyerUid }
    )

    if (res.isOk) {
      setUserProfile(res.data)
    }
  }

  useEffect(() => {
    c2cUserProfile()
  }, [])

  const onPressEnter = e => {
    e.preventDefault()
    if (!textAreaValue) {
      return
    }
    setTextAreaValue('')
    sendTextMessage(orderDetails?.id, textAreaValue).then(res => {
      const list = [...(getChatList() || []), { ...res, fromNick: res?.fromNick || nickName }]
      sendOrReceiveMessageRef.current = list.length
      setChatList(list)
    })
    // nimSDK.current?.msg
    //   .sendTextMsg({
    //     scene: 'team',
    //     to: tid?.toString() || '8974943492', // 群组 id
    //     body: textAreaValue,
    //   })
    //   .then(res => {
    //     const list = [...(getChatList() || []), { ...res, fromNick: res?.fromNick || nickName }]
    //     sendOrReceiveMessageRef.current = list.length
    //     setChatList(list)
    //   })
    //   .catch(err => {
    //     console.log('send error', err)
    //   })
  }

  const onTextAreaChange = v => {
    setTextAreaValue(v)
  }

  function rowRenderer({ index, key, parent, style }) {
    // const source // This comes from your list data
    const data = chatList[index]
    let direction = ''
    if (data?.type === ImMessageTypeEnum.text || data?.type === ImMessageTypeEnum.image) {
      direction = data?.from === getCurrentUserId() ? Direction.Buy : Direction.Sell
    }

    const type = data?.type
    const attach = data?.attach

    let orderStatus: ImSystemNotificationOrderStatusType

    const isBuyer = userInfo?.uid === orderDetails?.buyerUid
    /** 处理自定义消息 */
    if (data?.type === ImMessageTypeEnum.custom) {
      /** 判断买卖方 */
      const statusOptions = {
        orderNumber: orderDetails?.id,
        isAppealer: orderDetails?.isAppealer,
        isAppealWinner: orderDetails?.isAppealWinner,
        dealTypeCd: orderDetails?.dealTypeCd,
        msgType: data?.attach?.msgType,
      }
      /** 根据订单状态拉去对应的文案与链接 */
      const buyOrderStatus = ImBuyerStatus(statusOptions)
      const sellOrderStatus = ImSellerStatus(statusOptions)

      orderStatus = isBuyer
        ? buyOrderStatus[data?.attach?.orderStatus as string]
        : sellOrderStatus[data?.attach?.orderStatus as string]
    }

    const leftName =
      uid !== orderDetails?.buyerUid
        ? orderDetails?.buyerMerNickName || orderDetails?.buyerUserName || data?.fromNick || data?.from
        : orderDetails?.sellerMerNickName || orderDetails?.sellerUserName || data?.fromNick || data?.from
    const rightName =
      uid === orderDetails?.buyerUid
        ? orderDetails?.buyerMerNickName || orderDetails?.buyerUserName || data?.fromNick || data?.from
        : orderDetails?.sellerMerNickName || orderDetails?.sellerUserName || data?.fromNick || data?.from

    const originImageWidth = data?.attach?.w || ImImageWidthAndHeightEnum.width
    const originImageHeight = data?.attach?.h || ImImageWidthAndHeightEnum.height
    const imageWidth =
      Number(originImageWidth) <= ImImageWidthAndHeightEnum.width ? originImageWidth : ImImageWidthAndHeightEnum.width
    const imageHeight = (originImageHeight / originImageWidth) * imageWidth

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ registerChild }) => (
          // 'style' attribute required to position cell (within parent List)
          <div ref={registerChild} style={style}>
            {/* left */}
            {direction === Direction.Sell && (
              <div className="chat-text-wrap">
                <div className="name-wrap">
                  <div className="avatar">
                    {leftName ? (
                      <div className="image">
                        <span>{leftName?.charAt(0)}</span>
                      </div>
                    ) : (
                      <Icon name="web_logo" />
                    )}
                  </div>
                  <span className="text-content-02 ml-2">{leftName}</span>
                </div>
                {type === MessageType.Image ? (
                  <div className="img-message-wrap">
                    <Image
                      width={imageWidth}
                      height={imageHeight}
                      className="img-message mt-2 ml-34"
                      src={data.attach?.url as string}
                      alt="lamp"
                    />
                  </div>
                ) : (
                  <span
                    className="chat-text text-content-01-b mt-2"
                    style={{
                      marginLeft: '34px',
                    }}
                  >
                    {data.body}
                  </span>
                )}

                <span
                  style={{
                    marginLeft: '34px',
                  }}
                  className="text-content-03 mt-1"
                >
                  {ImFormattedTime(data.time)}
                </span>
              </div>
            )}
            {/* right */}
            {direction === Direction.Buy && (
              <div className="chat-text-wrap buy-wrap">
                <div className="name-wrap">
                  <span className="text-content-02 mr-2">{rightName}</span>
                  <div className="avatar">
                    {rightName ? (
                      <div className="image">
                        <span>{rightName?.charAt(0)}</span>
                      </div>
                    ) : (
                      <Icon name="web_logo" />
                    )}
                  </div>
                </div>
                {type === MessageType.Image ? (
                  <div className="img-message-wrap">
                    <Image
                      className="img-message mt-2 mr-34"
                      width={imageWidth}
                      height={imageHeight}
                      src={data.attach?.url as string}
                      alt="lamp"
                    />
                  </div>
                ) : (
                  <div
                    className="chat-text text-content-01-b mt-2"
                    style={{
                      marginRight: '34px',
                    }}
                  >
                    {data.body}
                  </div>
                )}
                <span
                  style={{
                    marginRight: '34px',
                  }}
                  className="text-content-03 mt-1"
                >
                  {ImFormattedTime(data.time)}
                </span>
              </div>
            )}

            {data?.type === ImMessageTypeEnum.custom && orderStatus && (
              <div className="mt-4">
                {data?.attach?.msgType === ImMsgTypeEnum.remind && !isBuyer ? (
                  <div className="text-content-02 text-center">{t`features_c2c_trade_c2c_chat_c2c_chat_window_index_2lmlehsw_87hhx2ffgcqq`}</div>
                ) : (
                  <div className="text-content-02 text-center">
                    {`${orderStatus?.title}${orderStatus?.text && !orderStatus?.link ? '，' : ''}`}
                    {orderStatus?.hasLink ? (
                      <span className="text-brand_color ml-1">
                        {orderStatus?.hasLink && <Link href={orderStatus?.link}>{orderStatus?.text}</Link>}
                      </span>
                    ) : orderStatus?.text ? (
                      <span>{orderStatus?.text}</span>
                    ) : null}
                  </div>
                )}
                <div className="text-content-03 mt-1 text-center leading-6">{ImFormattedTime(data?.time)}</div>
              </div>
            )}

            {data?.type === ImMessageTypeEnum.orderDetail && (
              <div className="chat-text-wrap buy-order-wrap" style={{ padding: '0 16px', height: '157px' }}>
                <div className="order-time text-content-03">{ImFormattedTime(orderDetails?.createdTime)}</div>
                <div className="order-info">
                  <div className="order-type">
                    <span className="order-text-content-01">
                      <span
                        className={classNames({
                          'text-buy_up_color': orderDetails?.buyerUid === userInfo.uid,
                          'text-sell_down_color': orderDetails?.buyerUid !== userInfo.uid,
                        })}
                      >
                        {orderDetails?.buyerUid === userInfo.uid ? t`trade.c2c.buy` : t`trade.c2c.sell`}
                      </span>
                      <span className="ml-1 text-base" style={{ lineHeight: '22px' }}>
                        {orderDetails?.coinName}
                      </span>
                    </span>
                    <span>
                      {orderDetails?.dealTypeCd !== ImOrderDetailDealType.INSIDE ? (
                        <span className="out-side mr-2">{orderDetails?.mainchainAddrName}</span>
                      ) : null}
                      <span
                        className={classNames('tag', {
                          'bg-buy_up_color_special_02': orderDetails?.dealTypeCd === ImOrderDetailDealType.INSIDE,
                          'text-buy_up_color': orderDetails?.dealTypeCd === ImOrderDetailDealType.INSIDE,
                          'bg-brand_color_special_02': orderDetails?.dealTypeCd !== ImOrderDetailDealType.INSIDE,
                          'text-brand_color': orderDetails?.dealTypeCd !== ImOrderDetailDealType.INSIDE,
                        })}
                      >
                        {orderDetails?.dealTypeCd === ImOrderDetailDealType.INSIDE
                          ? t`features_c2c_center_index_b-xzvpxaowued-9lzhztl`
                          : t`features_c2c_center_index_0n_wqepvujaj0_5sf7y--`}
                      </span>
                    </span>
                  </div>
                  <div className="divide"></div>
                  <div className="order-price">
                    <div className="op-row">
                      <span className="order-text-content-02">{t`trade.c2c.singleprice`}</span>
                      <span className="order-text-content-01-bold">
                        {orderDetails?.currencySymbol} {formatCurrency(orderDetails?.price, 2)}
                      </span>
                    </div>
                    <div className="op-row">
                      <span className="order-text-content-02">{t`Amount`}</span>
                      <span className="order-text-content-01-bold">
                        {formatCurrency(orderDetails?.number, 2)} {orderDetails?.coinName}
                      </span>
                    </div>
                    <div className="op-row">
                      <span className="order-text-content-02">{t`features_c2c_trade_c2c_chat_c2c_chat_window_index_064niyem2qfqd6m_zr4sv`}</span>
                      <span className="order-text-content-01-bold">
                        {orderDetails?.currencySymbol} {formatCurrency(orderDetails?.totalPrice, 2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CellMeasurer>
    )
  }

  // 初始化 IM
  const initIM = async () => {
    // const { NIM, browserAdapters, MsgService, MsgLogService, SessionService, TeamService, cloudStorageService } =
    //   await import('nim-web-sdk-ng/dist/esm')

    // NIM.setAdapters(browserAdapters)
    // NIM.registerService(MsgService, 'msg') // 消息服务
    // NIM.registerService(cloudStorageService, 'cloudStorage') // 云服务，上传图片 必须先注册此服务
    // NIM.registerService(MsgLogService, 'msgLog') // 历史消息
    // NIM.registerService(SessionService, 'session') // 本地 session 记录
    // NIM.registerService(TeamService, 'team') // 群组服务

    // nimSDK.current = NIM.getInstance({
    //   appkey: settings.current.appKey,
    //   account: uid,
    //   token: settings.current.token,
    //   debugLevel: envIsTest ? 'debug' : 'off',
    // })

    const initResult = await initC2CIm({
      request,
      getUserInfo: () => {
        const { userInfo: imUserInfo } = baseUserStore.getState()

        return {
          uid: imUserInfo.uid,
          nickname: imUserInfo.nickname,
        }
      },
      appId: c2cSdkAppId,
    })

    /** 监听收到消息 */
    // nimSDK.current.on('msg', res => {
    //   if (res.target === orderDetails?.tid) {
    //     let list = [...(getChatList() || []), res]
    //     if (!getChatList()?.length) {
    //       list = [{ ...OrderDetailDefaultValue, orderDetail: orderDetails }, ...(getChatList() || []), res]
    //     }
    //     // list = [...(getChatList() || []), res]
    //     sendOrReceiveMessageRef.current = list?.length || 0
    //     setChatList(list)
    //   }
    // })

    /** 断开重连 */
    // nimSDK.current.on('disconnect', async () => {
    //   await nimSDK.current.connect()
    // })

    // await nimSDK.current.connect()

    if (!initResult) return
    bindEvents({
      tid: orderDetails?.id,
      onMessages(messages) {
        let list = [...(getChatList() || []), ...messages]
        if (!getChatList()?.length) {
          list = [{ ...OrderDetailDefaultValue, orderDetail: orderDetails }, ...(getChatList() || []), ...messages]
        }
        // list = [...(getChatList() || []), res]
        sendOrReceiveMessageRef.current = list?.length || 0
        setChatList(list)
      },
    })
    await initResult.login()

    const preMessage = {
      originMessage: undefined,
    }
    const result = await queryHistoryMessages(orderDetails?.id, preMessage?.originMessage)
    const msgs: Array<ImListType> = result || []

    // const msgs = await nimSDK.current.msgLog.getHistoryMsgs({
    //   scene: 'team',
    //   to: tid?.toString() || '8974943492',
    //   limit: 100,
    //   asc: true,
    // })

    const _orderDetail = { ...OrderDetailDefaultValue, orderDetail: orderDetails }
    const list = [
      _orderDetail,
      ...(getChatList()?.length ? getChatList().slice(1) : []),
      ...(msgs?.filter?.(item => {
        return item.type !== ImMessageTypeEnum.notification
      }) || []),
    ]
    const filterList = sortC2CChatListData(list)
    sendOrReceiveMessageRef.current = filterList?.length || 0
    cache.clearAll()
    setChatList(filterList)
    cache.clearAll()
  }

  const onScrollChatList = async item => {
    if (!controlRef.current) {
      return
    }
    if (chatList?.length < 101 || newDataRef.current < 100) {
      return
    }
    if (item.scrollTop < 30 && item.scrollTop > 0) {
      // 调接口
      controlRef.current = false
      // const msgs = await nimSDK.current.msgLog.getHistoryMsgs({
      //   scene: 'team',
      //   to: tid?.toString() || '8974943492',
      //   limit: 100,
      //   asc: true,
      //   lastMsgId: chatList[1].idServer,
      //   beginTime: 0,
      //   endTime: chatList[1].time,
      // })
      const preMessage = chatList[1]
      const result = await queryHistoryMessages(orderDetails?.id, preMessage?.originMessage)
      const msgs: Array<ImListType> = result || []
      if (msgs?.length === 0) {
        return
      }

      newDataRef.current = msgs?.length || 0
      const _orderDetail = { ...OrderDetailDefaultValue, orderDetail: orderDetails }
      const filterList =
        msgs?.filter?.(item => {
          return item.type !== ImMessageTypeEnum.notification
        }) || []

      sendOrReceiveMessageRef.current = (filterList?.length || 0) + 1
      cache.clearAll()
      setChatList([_orderDetail, ...filterList, ...(getChatList().slice(1) || [])])
      cache.clearAll()
      controlRef.current = true
    }
  }

  useEffect(() => {
    if (chatWindowRef.current && chatList?.length) {
      chatWindowRef.current?.scrollToRow(sendOrReceiveMessageRef.current || chatList.length)
    }
  }, [chatList])

  const getTokenAndOrderDetailInfo = async () => {
    const res = await getImToken({})
    if (!res.isOk && !res.data) return

    settings.current = res.data

    initIM()
  }

  const { run } = useRequest(getTokenAndOrderDetailInfo, { manual: true })

  useMount(() => {
    run()
  })

  // useUnmount(() => {
  //   nimSDK.current?.destroy()
  // })
  useUnmount(destroyIm)

  const limitSize = useMemo(() => {
    const imageSize = 5 * (1024 * 1024) // 5MB
    return imageSize
  }, [])

  const handleUploadImage = list => {
    const _localStorage = getAllStorage()
    const file = list.file as File

    if (file.size > limitSize) {
      Message.warning(t`features/user/safety-items/application-form/index-0`)
      return
    }

    sendImageMessage(orderDetails?.id, file).then(res => {
      setAllStorage(_localStorage)
      const _list = [...((getChatList() as Array<imListType>) || []), res]
      sendOrReceiveMessageRef.current = _list?.length || 0
      setChatList(_list as any)
    })

    // nimSDK.current?.msg
    //   .sendImageMsg({
    //     scene: 'team',
    //     to: tid?.toString() || '8974943492',
    //     file,
    //   })
    //   .then(res => {
    //     setAllStorage(_localStorage)
    //     const _list = [...((getChatList() as Array<imListType>) || []), res]
    //     sendOrReceiveMessageRef.current = _list?.length || 0
    //     setChatList(_list)
    //   })
  }

  const KYCType = {
    0: t`user.personal_center_03`,
    1: t`user.personal_center_03`,
    2: t`features_user_person_application_index_2651`,
    3: t`features_kyc_kyc_header_index_5101171`,
    4: t`features/user/personal-center/profile/index-17`,
  }

  const MerchantType = {
    1: t`features_c2c_trade_c2c_chat_c2c_chat_window_index_pf47elepeacp8aawedvxi`,
    2: t`features_c2c_trade_c2c_chat_c2c_chat_window_index__e8suz5boketwopmx-hzm`,
  }

  const IsCertified = 1

  return (
    <div className={styles.scoped}>
      {orderDetails?.statusCd === OrderType.WAS_RECEIVE_COIN ? null : (
        <div className="notice mb-6">
          <div className="flex items-center" style={{ height: '18px' }}>
            <Icon name="msg" fontSize={12} />
          </div>
          <div>
            {userInfo?.uid === orderDetails?.buyerUid ? (
              <>
                <div className="warning-title">
                  {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_viqj_fdmocio1wm7diij2`}{' '}
                  {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_xu8_gk4xr3bm-sjext9y8`}
                </div>
                <div className="warning-title">
                  {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_nfcrdnob8hindjvdhbiak`}
                </div>
              </>
            ) : (
              <>
                <div className="warning-title">
                  {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_7lv9p7abihrn6cjgxeqnv`}
                </div>
                <div className="warning-title">{t`features_c2c_trade_c2c_chat_c2c_chat_window_index_ka4dwe-x1bgsn-nq2romq`}</div>
              </>
            )}
          </div>
        </div>
      )}

      {chatList?.length ? (
        <div className="chat-window-wrap">
          <div className="business-information">
            <div>
              <div className="peo-info-row">
                <div className="avatar">
                  {userProfile?.nickName ? (
                    <div className="image">
                      <span>{userProfile?.nickName?.charAt(0)}</span>
                    </div>
                  ) : (
                    <Icon name="web_logo" />
                  )}
                </div>
                {/* <LazyImage className="peo-avatar" src={userProfile?.avatarPath} /> */}
                <span className="ml-2 order-text-content-01">{userProfile?.nickName}</span>
                {userProfile?.isMerchant === MerchantValue.Approval ? (
                  <Icon name="kyc_advanced_authentication" className="ml-1 mt-0" fontSize={16} />
                ) : null}
              </div>
              <div className="flex flex-col mt-3 gap-1">
                <div className="merchant-qualification">
                  {userProfile?.isMerchant === IsCertified ? (
                    <div className="order-text-content-02 mr-1 store-cer over-hid">
                      {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_8obuzfwrr0ptjuf2ucjwx`}
                      <span className="order-text-content-01-nor">
                        {MerchantType[userProfile?.isMerchant as number]}
                      </span>
                    </div>
                  ) : null}

                  <div className="order-text-content-02 order-cer over-hid">
                    {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_7txaopj2yrrgux0jbysin`}
                    <span className="order-text-content-01-nor">{KYCType[userProfile?.kycType as number]}</span>
                  </div>
                </div>
                <div className="merchant-kyc">
                  <div className="order-text-content-02 store-cer over-hid">
                    {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_hnswgf1tsenjcrsj-2ef8`}
                    <span className="order-text-content-01-nor">{`${userProfile?.completedOrderRate}%`}</span>
                  </div>
                  <div className="ml-1 order-text-content-02 order-cer over-hid">
                    {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_kp9km7bjumpjsstowzwsf`}
                    <span className="order-text-content-01-nor">
                      {userProfile?.orderCount} {t`features_c2c_advertise_post_advertise_index_mugnc4k5iqgycfmojz1dv`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              onClick={() => {
                link(
                  getC2CCenterPagePath(
                    uid === orderDetails?.buyerUid ? orderDetails?.sellerUid : orderDetails?.buyerUid
                  )
                )
              }}
              className="go-to-button button-text-content-02 over-hid"
            >
              {t`features_c2c_trade_c2c_chat_c2c_chat_window_index_iywc7qzotb_kqwasbu-xw`}
            </Button>
          </div>

          {/* <AutoSizer>
          {({ height, width }) => ( */}

          <List
            className=""
            ref={chatWindowRef}
            width={480}
            height={376}
            rowCount={chatList.length || 20} // 列表数
            rowHeight={cache.rowHeight} // 每列高度 （可传函数 定制不确定高度）
            rowRenderer={rowRenderer} // 行渲染器
            onScroll={onScrollChatList} // 滚动事件
            scrollToIndex={sendOrReceiveMessageRef.current || chatList?.length}
            /** 缓存 */
            deferredMeasurementCache={cache}
          />

          {/* )}
        </AutoSizer> */}

          <div className="upload-wrap">
            <Upload className="upload-img" showUploadList={false} customRequest={handleUploadImage}>
              <Icon className="c2c-upload-image" name="c2c_image" hasTheme />
            </Upload>

            <TextArea
              className="text-area"
              value={textAreaValue}
              onChange={onTextAreaChange}
              onPressEnter={onPressEnter}
              placeholder=""
              style={{ minHeight: 64, width: 480 }}
            />
          </div>
        </div>
      ) : (
        <div className="spin-wrap">
          <Spin />
        </div>
      )}
    </div>
  )
}

export default C2CChatWindow
