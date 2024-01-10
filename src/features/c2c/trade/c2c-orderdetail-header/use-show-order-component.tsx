import { ReactNode, useRef } from 'react'
import { setC2COrderChangeStatus } from '@/apis/c2c/c2c-trade'
import { link } from '@/helper/link'
import { FinancialRecordLogTypeEnum } from '@/constants/assets'
import {
  getAssetsHistoryPageRoutePath,
  getAssetsMainPageRoutePath,
  getAssetsC2CPageRoutePath,
} from '@/helper/route/assets'
import { t } from '@lingui/macro'
import OrderdetailSuccessChangeButton from './orderdetail-success-changebutton'
import OrderdetailHeaderTime from './orderdetail-header-time'
import OrderdetailSuccessButton from './orderdetail-success-button'
import OrderdetailCancelButton from './orderdetail-cancel-button'
import OrderdetailAppealButton from './orderdetail-appeal-button'
import OrderdetailCancelSubmit from './orderdetail-appeal-submit'
import AppealMaterialButton from './appeal-material-button'
import { C2COrderStatus, ChangeC2COrderStatus, TransactionStation } from '../c2c-trade'

type ModalParams = {
  modalTitle: string
  modalContent: string | JSX.Element
  canCelText: string
  okText: string
  onOkChange: () => void
}

type ShowOrderButtonItem = {
  iconName: string
  statusTitle: string
  timeText: ReactNode
  cancelButton?: ReactNode
  successButton?: ReactNode
  modalParams?: ModalParams
}

type ShowOrderButton = {
  BUYER: Record<string, ShowOrderButtonItem>
  SELLER: Record<string, ShowOrderButtonItem>
}

const useShowOrderComponent = (
  orderHeaderTipModalRef,
  orders,
  confirmReceiptModalRef,
  appealAppealSubmitCompnentRef
) => {
  // 存储申诉状态
  const selectAppealStatus = useRef<string>(orders?.statusCd)
  selectAppealStatus.current = orders?.statusCd

  // 判断申诉方是否是自己
  const distinguishIsNotWe = orders?.isAppealer

  // 申诉中状态集合
  const appealStatusLing = [C2COrderStatus.CANCEL__APPEALING, C2COrderStatus.NOT_CANCEL__APPEALING]
  // 判断在申诉状态下是否已提交资料，要是提交需要加状态
  if (appealStatusLing.includes(orders?.statusCd)) {
    orders?.isComplaintInformation
      ? (selectAppealStatus.current = `${orders?.statusCd}Subed`)
      : (selectAppealStatus.current = orders?.statusCd)
  }

  const selectAppealStatusChange = () => {
    if (orders?.isAppealWinner) {
      orders?.statusCd === C2COrderStatus.CANCEL__APPEAL_FINISH
        ? (selectAppealStatus.current = C2COrderStatus.CANCEL__APPEAL_FINISH)
        : (selectAppealStatus.current = C2COrderStatus.NOT_CANCEL__APPEAL_FINISH)
    } else {
      orders?.statusCd === C2COrderStatus.CANCEL__APPEAL_FINISH
        ? (selectAppealStatus.current = C2COrderStatus.CANCEL__APPEAL_FAILURE)
        : (selectAppealStatus.current = C2COrderStatus.NOT_CANCEL__APPEAL_FAILURE)
    }
  }

  // 申诉胜利失败状态集合
  const appealStatusResult = [C2COrderStatus.CANCEL__APPEAL_FINISH, C2COrderStatus.NOT_CANCEL__APPEAL_FINISH]
  if (appealStatusResult.includes(orders?.statusCd)) {
    selectAppealStatusChange()
  }

  // 判断是不是自己取消的订单
  const cancelIsNotWe = orders?.isCanceler

  const setTradeNextChange = () => {
    orderHeaderTipModalRef?.current?.setHeaderModalVisible()
  }

  const onConfirmPaymentChange = async () => {
    const { isOk } = await setC2COrderChangeStatus({ id: orders?.id, statusCd: ChangeC2COrderStatus.WAS_PAYED })
    return isOk
  }

  const onConfirmPaymentCoinChange = async () => {
    const { isOk } = await setC2COrderChangeStatus({ id: orders?.id, statusCd: ChangeC2COrderStatus.WAS_RECEIVE_COIN })
    return isOk
  }

  const getIsNotWeChangeIng = () => {
    if (orders?.isSystemStartAppeal) {
      return distinguishIsNotWe
        ? t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_oc5bacj32v3t8xnls95gw`
        : t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_-ckm1kvxzgatu2w3rdrkv`
    } else {
      return distinguishIsNotWe
        ? t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_g_orbpl8vjb4w9jssy7u-`
        : t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_nmtubilya1jjia258-s4_`
    }
  }

  const getIsNotWeChangeEnd = () => {
    return distinguishIsNotWe
      ? t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_xpegstt6ohxyuty72s_vu`
      : t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ffayti7neu2jkvfqu9axr`
  }

  const getIsNotWeChangeCancle = () => {
    return cancelIsNotWe
      ? t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ichvtutjvpogdkql_3zzb`
      : t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_eyx-f2nxo_n6cd2d0ih7l`
  }

  const goToViewAssets = () => {
    link(orders?.dealTypeCd === TransactionStation.INSIDE ? getAssetsC2CPageRoutePath() : getAssetsMainPageRoutePath())
  }

  const setTimeTextNode = timeShowText => {
    return (
      <div className="order-time-remaining">
        <span className="order-time">{timeShowText}</span>
        {orders?.expireTime && <OrderdetailHeaderTime targetDateTime={orders.expireTime - Date.now()} />}
      </div>
    )
  }

  const onConfirmReceiptChange = () => {
    confirmReceiptModalRef?.current?.setConfirmReceiptVisible()
  }
  const onAppealAppealSubmitCompnent = () => {
    appealAppealSubmitCompnentRef?.current?.setCancalAppealModalVisible()
  }

  const onChangePayment = async () => {
    const { isOk } = await setC2COrderChangeStatus({ id: orders?.id, statusCd: ChangeC2COrderStatus.WAS_TRANSFER_COIN })
    return isOk
  }

  // 查看充值记录
  const goViewRechargeRecords = () => {
    link(
      getAssetsHistoryPageRoutePath(
        orders?.dealTypeCd === TransactionStation.INSIDE
          ? FinancialRecordLogTypeEnum.c2c
          : FinancialRecordLogTypeEnum.main
      )
    )
  }

  const getAppealCountDown = () => {
    return orders?.appealCountDown ? (
      <OrderdetailAppealButton
        time={Number(orders?.appealCountDown)}
        setAppealTypeChange={onAppealAppealSubmitCompnent}
      />
    ) : (
      ''
    )
  }

  const appealRelatedStatus = {
    [C2COrderStatus.CANCEL__APPEALING]: {
      iconName: 'tips_icon',
      cancelButton: (
        <AppealMaterialButton className="px-5 text-sm font-medium">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ylirjpaanbvnzgmalsaev`}</AppealMaterialButton>
      ),
      statusTitle: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
      timeText: <div className="text-text_color_02 mt-1">{getIsNotWeChangeIng()}</div>,
    },
    // 非取消订单，我方申诉
    [C2COrderStatus.NOT_CANCEL__APPEALING]: {
      iconName: 'tips_icon',
      cancelButton: (
        <AppealMaterialButton className="px-5 text-sm font-medium">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ylirjpaanbvnzgmalsaev`}</AppealMaterialButton>
      ),
      successButton: (
        <div onClick={goViewRechargeRecords}>
          <OrderdetailSuccessButton className="px-5 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_n41tlemngmt3haadhc9sr`}</OrderdetailSuccessButton>
        </div>
      ),
      statusTitle: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
      timeText: <div className="text-text_color_02 mt-1">{getIsNotWeChangeIng()}</div>,
    },
    // 已取消订单，我方申诉资料已提交
    [`${C2COrderStatus.CANCEL__APPEALING}Subed`]: {
      iconName: 'tips_icon',
      statusTitle: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
      timeText: <div className="text-text_color_02 mt-1">{getIsNotWeChangeIng()}</div>,
    },
    // 非取消订单，我方申诉资料已提交
    [`${C2COrderStatus.NOT_CANCEL__APPEALING}Subed`]: {
      iconName: 'tips_icon',
      statusTitle: t`constants_c2c_advertise_roqdxunhpuh1voc3tbh7t`,
      timeText: <div className="text-text_color_02 mt-1">{getIsNotWeChangeIng()}</div>,
      successButton: (
        <div onClick={goViewRechargeRecords}>
          <OrderdetailSuccessButton className="px-5 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_n41tlemngmt3haadhc9sr`}</OrderdetailSuccessButton>
        </div>
      ),
    },
    // 已取消订单，我方申诉，仲裁胜利
    [C2COrderStatus.CANCEL__APPEAL_FINISH]: {
      iconName: 'success_icon',
      statusTitle: t`constants_c2c_advertise_gkavi6wsnbyjbtgn9ngp9`,
      timeText: <div className="text-text_color_01 mt-1">{getIsNotWeChangeEnd()}</div>,
    },
    // 非取消订单，我方申诉，仲裁失败
    [C2COrderStatus.NOT_CANCEL__APPEAL_FAILURE]: {
      iconName: 'fail_icon',
      statusTitle: t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`,
      timeText: <div className="text-text_color_01 mt-1">{getIsNotWeChangeEnd()}</div>,
      successButton: (
        <div onClick={goViewRechargeRecords}>
          <OrderdetailSuccessButton className="px-5 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_n41tlemngmt3haadhc9sr`}</OrderdetailSuccessButton>
        </div>
      ),
    },
    // 非已取消订单，我方申诉，仲裁胜利
    [C2COrderStatus.NOT_CANCEL__APPEAL_FINISH]: {
      iconName: 'success_icon',
      statusTitle: t`constants_c2c_advertise_gkavi6wsnbyjbtgn9ngp9`,
      timeText: <div className="text-text_color_01 mt-1">{getIsNotWeChangeEnd()}</div>,
      successButton: (
        <div onClick={goViewRechargeRecords}>
          <OrderdetailSuccessButton className="px-5 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_n41tlemngmt3haadhc9sr`}</OrderdetailSuccessButton>
        </div>
      ),
    },
    // 取消订单，我方申诉，仲裁失败
    [C2COrderStatus.CANCEL__APPEAL_FAILURE]: {
      iconName: 'fail_icon',
      statusTitle: t`constants_c2c_advertise_0l8rik_3-xz241vty0vga`,
      timeText: <div className="text-text_color_01 mt-1">{getIsNotWeChangeEnd()}</div>,
      successButton: (
        <div onClick={goViewRechargeRecords}>
          <OrderdetailSuccessButton className="px-5 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_n41tlemngmt3haadhc9sr`}</OrderdetailSuccessButton>
        </div>
      ),
    },
  }

  // 通过不同的状态展示不同的按钮信息，弹窗，与组件
  const getOrderComponent: ShowOrderButton = {
    BUYER: {
      [C2COrderStatus.CREATED]: {
        iconName: 'tips_icon',
        cancelButton: (
          <OrderdetailCancelButton className="px-8 text-sm font-medium">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_9djpiamdc0xarphu9eeto`}</OrderdetailCancelButton>
        ),
        successButton: (
          <div onClick={setTradeNextChange}>
            <OrderdetailSuccessButton className="px-4 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uw0camcjlqochhnwxuysp`}</OrderdetailSuccessButton>
          </div>
        ),
        modalParams: {
          modalTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_m2tmi8mvnskaxpi5thxfd`,
          modalContent: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_cbp7xint9586onr45d2uk`,
          canCelText: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_gut7_lbh5bby5j5f_0buk`,
          okText: t`user.field.reuse_17`,
          onOkChange: onConfirmPaymentChange,
        },
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_soh5ausqqermsoo7cgl_i`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_dtgq0gq8ti3gn6r8v1cmi`
        ),
      },
      [C2COrderStatus.WAS_PAYED]: {
        iconName: 'tips_icon',
        cancelButton: (
          <OrderdetailCancelButton className="px-8 text-sm font-medium">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_9djpiamdc0xarphu9eeto`}</OrderdetailCancelButton>
        ),
        successButton: (
          <OrderdetailSuccessChangeButton className="px-10 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_0ot83xxkcyaba0pfbrsog`}</OrderdetailSuccessChangeButton>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_hmynjz43qmvhl249qpl34`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_99uq8qf1g8i0c_otgjm2w`
        ),
      },
      [C2COrderStatus.WAS_TRANSFER_COIN]: {
        iconName: 'tips_icon',
        cancelButton: getAppealCountDown(),
        successButton: (
          <div onClick={setTradeNextChange}>
            <OrderdetailSuccessButton className="px-3 text-sm">
              {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_h3lkkw7ay_of0cre44jyc`}
              <span>{orders?.coinName}</span>
            </OrderdetailSuccessButton>
          </div>
        ),
        modalParams: {
          modalTitle: t({
            id: 'features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_cns_egjpj-urunwtwtf13',
            values: { 0: orders?.coinName },
          }),
          modalContent: (
            <div>
              {t`features_c2c_trade_c2c_orderdetail_header_use_show_order_component_u_5lsgvbelnbm4hl7ws5l`}
              <span onClick={goViewRechargeRecords} className="text-brand_color cursor-pointer">
                {t`features_c2c_trade_c2c_chat_c2c_chat_window_common_govfdag-ikpxjbnkz_aun`}
              </span>
              {t`features_c2c_trade_c2c_orderdetail_header_use_show_order_component_td6dhnw12mmyf5b4tfntv`}{' '}
              {orders?.coinName}
              {t`features_c2c_trade_c2c_orderdetail_header_use_show_order_component_3ogfzfgpc6szw8mz1thjx`}
            </div>
          ),
          canCelText: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_zpolzrmpsessvo8_luask`,
          okText: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_guyoiuxixfbrgp2fiprzs`,
          onOkChange: onConfirmPaymentCoinChange,
        },
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ep6745sjdqtle6fqm_nwf`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_dtgq0gq8ti3gn6r8v1cmi`
        ),
      },
      [C2COrderStatus.WAS_RECEIVE_COIN]: {
        iconName: 'success_icon',
        cancelButton: (
          <OrderdetailCancelSubmit className="px-11 text-sm font-medium" onClick={onAppealAppealSubmitCompnent}>
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
          </OrderdetailCancelSubmit>
        ),
        successButton: (
          <div onClick={goViewRechargeRecords}>
            <OrderdetailSuccessButton className="px-5 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_n41tlemngmt3haadhc9sr`}</OrderdetailSuccessButton>
          </div>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_iwziah_p2ke_v0l2o5xdt`,
        timeText: (
          <div className="text-text_color_02 mt-1">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_x2jn_bq0kwbudehvx0iwm`}</div>
        ),
      },
      [C2COrderStatus.WAS_COLLECTED]: {
        iconName: 'tips_icon',
        successButton: (
          <OrderdetailSuccessChangeButton className="px-10 cursor-pointer text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_0ot83xxkcyaba0pfbrsog`}</OrderdetailSuccessChangeButton>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_dwv61qz9kuvy4ivu6a2sj`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_99uq8qf1g8i0c_otgjm2w`
        ),
      },
      // 交易已取消
      [C2COrderStatus.WAS_CANCEL]: {
        iconName: 'fail_icon',
        cancelButton: (
          <OrderdetailCancelSubmit
            className="px-11 text-sm cursor-pointer font-medium"
            onClick={onAppealAppealSubmitCompnent}
          >
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
          </OrderdetailCancelSubmit>
        ),
        statusTitle: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_cqtf2n00nvxqetd2yrgmm`,
        timeText: <div className="text-text_color_01 mt-1">{getIsNotWeChangeCancle()}</div>,
      },
      // 已取消订单，我方申诉
      ...appealRelatedStatus,
    },
    SELLER: {
      [C2COrderStatus.CREATED]: {
        iconName: 'tips_icon',
        cancelButton: (
          <div className="bg-bg_button_disabled cursor-pointer px-8 py-2 text-text_color_04 rounded">{t`features_c2c_trade_c2c_chat_c2c_chat_window_common_txuvbc66tutbcrt1j1lrm`}</div>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_wdmq8aa8_zhducqxsarwz`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_99uq8qf1g8i0c_otgjm2w`
        ),
      },
      [C2COrderStatus.WAS_PAYED]: {
        iconName: 'tips_icon',
        cancelButton: getAppealCountDown(),
        successButton: (
          <div onClick={onConfirmReceiptChange}>
            <OrderdetailSuccessButton className="px-8 text-sm">{t`features_c2c_trade_c2c_chat_c2c_chat_window_common_txuvbc66tutbcrt1j1lrm`}</OrderdetailSuccessButton>
          </div>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent__lifqybvvr8gcesbv8ir5`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_dtgq0gq8ti3gn6r8v1cmi`
        ),
      },
      [C2COrderStatus.WAS_TRANSFER_COIN]: {
        iconName: 'tips_icon',
        cancelButton: (
          <OrderdetailCancelSubmit className="px-11 text-sm font-medium" onClick={onAppealAppealSubmitCompnent}>
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
          </OrderdetailCancelSubmit>
        ),
        successButton: (
          <div onClick={goToViewAssets}>
            <OrderdetailSuccessButton className="px-8 text-sm">{t`assets.common.goToAssets`}</OrderdetailSuccessButton>
          </div>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_vax5232slb7vqt3uts7cs`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_99uq8qf1g8i0c_otgjm2w`
        ),
      },
      [C2COrderStatus.WAS_RECEIVE_COIN]: {
        iconName: 'success_icon',
        cancelButton: (
          <OrderdetailCancelSubmit className="px-11 text-sm font-medium" onClick={onAppealAppealSubmitCompnent}>
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
          </OrderdetailCancelSubmit>
        ),
        successButton: (
          <div onClick={goToViewAssets}>
            <OrderdetailSuccessButton className="px-8 text-sm">{t`assets.common.goToAssets`}</OrderdetailSuccessButton>
          </div>
        ),
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent__q573j8r-27l81kxjvva8`,
        timeText: (
          <div className="text-text_color_02 mt-1">
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_zkgzp5eyqg9yq14fb-sj5`} {orders?.number}
            {orders?.coinName}
          </div>
        ),
      },
      [C2COrderStatus.WAS_COLLECTED]: {
        iconName: 'tips_icon',
        cancelButton: (
          <OrderdetailCancelSubmit className="px-11 text-sm font-medium" onClick={onAppealAppealSubmitCompnent}>
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
          </OrderdetailCancelSubmit>
        ),
        successButton: (
          <div onClick={setTradeNextChange}>
            <OrderdetailSuccessButton className="px-4 text-sm">{t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_l3ddnzwaruxjcblkbv1cc`}</OrderdetailSuccessButton>
          </div>
        ),
        modalParams: {
          modalTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_cfz4mnk0_wvwdlfaxskxu`,
          modalContent: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_sltwukc3uuk6qiaaezfu5`,
          canCelText: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_2i35sor9z_u2jvguodixe`,
          okText: t`user.field.reuse_17`,
          onOkChange: onChangePayment,
        },
        statusTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ouhao4bejoyebizf7zx2e`,
        timeText: setTimeTextNode(
          t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_dtgq0gq8ti3gn6r8v1cmi`
        ),
      },
      [C2COrderStatus.WAS_CANCEL]: {
        iconName: 'fail_icon',
        cancelButton: (
          <OrderdetailCancelSubmit className="px-11 text-sm font-medium" onClick={onAppealAppealSubmitCompnent}>
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
          </OrderdetailCancelSubmit>
        ),
        statusTitle: t`features_c2c_trade_c2c_chat_c2c_chat_window_common_cqtf2n00nvxqetd2yrgmm`,
        timeText: <div className="text-text_color_01 mt-1">{getIsNotWeChangeCancle()}</div>,
      },
      ...appealRelatedStatus,
    },
  }

  const showSelectedOrderComponent = getOrderComponent?.[orders?.buyAndSellRole]?.[selectAppealStatus.current]

  return { showSelectedOrderComponent }
}

export { useShowOrderComponent }
