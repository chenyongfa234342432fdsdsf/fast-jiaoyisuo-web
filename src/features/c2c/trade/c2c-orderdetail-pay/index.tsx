import { memo, useState, useRef, useEffect } from 'react'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { t } from '@lingui/macro'
import { useMount, useUpdateEffect } from 'ahooks'
import cn from 'classnames'
import { getCodeDetailList } from '@/apis/common'
import { Message } from '@nbit/arco'
import { formatDate } from '@/helper/date'
import { formatNumberDecimal } from '@/helper/decimal'
import { useCopyToClipboard } from 'react-use'
import { download } from '@/helper/kyc'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import { useCommonStore } from '@/store/common'
import { usePaymentCodeVal } from '@/features/c2c/trade/free-trade/use-advert-code-val'
import OrderOpenVideo from '../c2c-orderdetail-header/order-open-video'
import CancalAppealModal from '../c2c-orderdetail-header/cancal-appeal-modal'
import styles from './c2ctab.module.css'
import { C2COrderStatus, PayMethods, TransactionStation } from '../c2c-trade'

type Props = {
  orders: YapiGetV1C2COrderDetailData
}

type CancalAppealModal = {
  setCancalAppealModalVisible: () => void
  setCancalAppealModalNotVisible: () => void
}

type OrderOpenVideo = {
  setOrderOpenVideoVisible: () => void
}

function C2COrderDetailPay(props: Props) {
  const { orders } = props

  const { getPaymentCodeVal } = usePaymentCodeVal()

  const { locale } = useCommonStore()

  const {
    buyAndSellRole,
    paymentUserName,
    paymentAccount,
    paymentQrCodeAddr,
    createdTime,
    price,
    currencyEnName,
    coinName,
    totalPrice,
    paymentName,
    number,
    mainchainAddrName,
    mainchainAddrAddr,
    mainchainAddrMemo,
    dealTypeCd,
    appealPicture,
    appealVideo,
    appealReason,
    appealSpecificReason,
    cancelType,
    appealWinnerUserName,
    paymentBankOfDeposit,
    statusCd,
    remark,
    id,
    isSystemStartAppeal,
    cancelReason,
    tradePrecision,
    // @ts-ignore
    appealAttachment,
    paymentDetails,
  } = orders || {}

  const [showOrderDetail, setShowOrderDetail] = useState<boolean>(true)

  const [appealReasonCode, setAppealReasonCode] = useState<any>()

  const [cancalReasonList, setCancalReasonList] = useState<any>([])

  const cancalAppealModalRef = useRef<CancalAppealModal>()

  const orderOpenVideoRef = useRef<OrderOpenVideo>()

  const setDownloadImage = () => {
    cancalAppealModalRef.current?.setCancalAppealModalVisible()
  }

  const onOrderCollapse = () => {
    setShowOrderDetail(!showOrderDetail)
  }

  const getBuyAndSellRole = () => {
    return buyAndSellRole === 'BUYER'
  }

  const setShowAppealReason = () => {
    return (
      appealReason ||
      appealSpecificReason ||
      (cancelType && statusCd === C2COrderStatus.WAS_CANCEL) ||
      appealWinnerUserName
    )
  }

  const [state, copyToClipboard] = useCopyToClipboard()

  const copyToClipbordFn = val => {
    copyToClipboard(val)
    state.error
      ? Message.error(t`assets.financial-record.copyFailure`)
      : Message.success(t`assets.financial-record.copySuccess`)
  }

  const setDownlaodFile = async () => {
    await download(appealAttachment, new Date().getTime())
  }

  const setSaveImage = async () => {
    const res = await download(paymentQrCodeAddr, new Date().getTime())
    res && cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
  }

  const getappealReason = type => {
    return appealReasonCode?.find(item => {
      return item?.codeVal === type
    })
  }

  const getCodeDetailListChange = async () => {
    if (appealReason || appealSpecificReason) {
      const { isOk, data } = await getCodeDetailList({ codeVal: 'c2c_order_appeal_reason', lanType: locale })
      if (isOk) {
        setAppealReasonCode(data)
      }
    }
  }

  const setShowOrderDetailChange = () => {
    setShowOrderDetail(!(appealVideo || (appealPicture && appealPicture?.length > 0)))
  }

  const getCancelTypeReason = type => {
    return cancalReasonList?.find(item => item?.codeVal === type)?.codeKey
  }

  const getAllCancleReason = async () => {
    const beforeRes = await getCodeDetailList({ codeVal: 'before_payment', lanType: locale })
    const afterRes = await getCodeDetailList({ codeVal: 'after_payment', lanType: locale })
    getCodeDetailListChange()

    const res = [beforeRes, afterRes]
    if (res?.every(item => item?.isOk)) {
      const reasonList = res?.map(item => item?.data)?.flat()
      setCancalReasonList(reasonList)
    }
  }

  const setOpenVideoChange = () => {
    orderOpenVideoRef.current?.setOrderOpenVideoVisible()
  }

  const getShowMaterial = () => {
    return appealVideo || (appealPicture && appealPicture?.length > 0) || appealAttachment
  }

  useUpdateEffect(() => {
    getCodeDetailListChange()
  }, [appealReason, appealSpecificReason])

  useEffect(() => {
    setShowOrderDetailChange()
  }, [appealVideo, appealPicture])

  useMount(() => {
    getAllCancleReason()
  })

  return (
    <div className={styles.scope}>
      {appealVideo && <OrderOpenVideo videoSrc={appealVideo} ref={orderOpenVideoRef} />}
      <CancalAppealModal
        modalParams={{
          modalTitle: t({
            id: 'features_c2c_trade_c2c_orderdetail_pay_index_arciuucvb_0y0-6s9xodp',
            values: { 0: getPaymentCodeVal(paymentName) },
          }),
        }}
        ref={cancalAppealModalRef}
      >
        <div className={styles['download-img-modal']}>{paymentQrCodeAddr && <LazyImage src={paymentQrCodeAddr} />}</div>
        <div
          onClick={setSaveImage}
          className="h-10 cursor-pointer bg-brand_color w-full text-button_text_02 flex justify-center items-center font-medium rounded"
        >
          {t`features_c2c_trade_c2c_orderdetail_pay_index_4m2x5rsmcylvuhulsxhcp`}
        </div>
      </CancalAppealModal>
      {setShowAppealReason() && (
        <div className="appeal-reason break-all	 w-full py-3 px-4 bg-card_bg_color_01 text-xs rounded">
          {appealReason && (
            <div className="text-text_color_01 mb-2">
              <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_toul7x_7uajxqhylmdscl`}</span>
              {getappealReason(appealReason)?.codeKey}
            </div>
          )}
          {appealSpecificReason && !isSystemStartAppeal && (
            <div className="text-text_color_01 mb-2">
              <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_gzk_gacobv4cozfizx7eh`}</span>
              {getappealReason(appealSpecificReason)?.codeKey}
            </div>
          )}
          {cancelType && statusCd === C2COrderStatus.WAS_CANCEL && (
            <div className="text-text_color_01 mb-2">
              <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_lr-tprxogy5imvdeuxgz3`}</span>{' '}
              {cancelReason || getCancelTypeReason(cancelType)}
            </div>
          )}
          {appealWinnerUserName && (
            <div className="text-text_color_01">
              <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_kuk2bgp9omsiewayea5dq`}</span>{' '}
              {appealWinnerUserName}
            </div>
          )}
        </div>
      )}
      <div className="text-text_color_01 text-base font-medium  mb-4">
        {getBuyAndSellRole()
          ? t`features_c2c_trade_c2c_orderdetail_pay_index_yyshbeyvo83ppheu4p_kx`
          : t`features_c2c_trade_c2c_orderdetail_pay_index_q42arkcxwnnmihui9fddm`}
      </div>
      <div className="w-full">
        <div className="orderdetail-pay">
          <span className="text-text_color_02">
            {getBuyAndSellRole() ? t`trade.c2c.payment` : t`features/user/personal-center/settings/index-2`}
          </span>
          <div className="text-text_color_01">{getPaymentCodeVal(paymentName)}</div>
        </div>
        <div className="orderdetail-pay mt-4">
          <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_xlpdhslamh47dcrnccio1`}</span>
          <div className="text-text_color_01">{paymentUserName}</div>
        </div>
        {paymentName === PayMethods.BANK && (
          <div className="orderdetail-pay mt-4">
            <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_re9yjlvh_xseq8ncjugct`}</span>
            <div className="text-text_color_01">{paymentBankOfDeposit}</div>
          </div>
        )}
        <div className="orderdetail-pay mt-4">
          <span className="text-text_color_02">
            {paymentDetails
              ? getPaymentCodeVal(paymentName)
              : t({
                  id: 'features_c2c_trade_c2c_orderdetail_pay_index_fcv1nggupwak3t285jf6z',
                  values: { 0: getPaymentCodeVal(paymentName) },
                })}
          </span>
          <div className="text-text_color_01 flex items-center">
            <span className="pr-1">{paymentAccount || paymentDetails}</span>
            {!paymentDetails && (
              <Icon name="copy" hasTheme onClick={() => copyToClipbordFn(paymentAccount || paymentDetails)} />
            )}
          </div>
        </div>
        {paymentQrCodeAddr && (
          <div className="orderdetail-pay mt-4">
            <span className="text-text_color_02">{t`features/user/personal-center/settings/payment/index-0`}</span>
            <div className="text-text_color_01 qr-hover" onClick={setDownloadImage}>
              <Icon name="rebates_drawing-qr_hover" />
            </div>
          </div>
        )}
        <div
          className="flex justify-between items-center text-text_color_01 text-base font-medium mt-6 mb-4"
          onClick={onOrderCollapse}
        >
          <span>{t`features/orders/details/future-9`}</span>
          {getShowMaterial() && (
            <Icon name={!showOrderDetail ? 'trade_expand' : 'trade_put_away'} hasTheme className="text-sm" />
          )}
        </div>
        {showOrderDetail && (
          <>
            <div className="orderdetail-pay mt-4">
              <span className="text-text_color_02">{t`features_c2c_trade_c2c_orderdetail_pay_index_xk6sszrtw1tgwc6swkmek`}</span>
              <div className="text-text_color_01 flex">
                <span
                  className={cn('pr-1', {
                    'text-buy_up_color': getBuyAndSellRole(),
                    'text-sell_down_color': !getBuyAndSellRole(),
                  })}
                >
                  {getBuyAndSellRole() ? t`trade.c2c.buy` : t`trade.c2c.sell`} {coinName}
                </span>
              </div>
            </div>
            <div className="orderdetail-pay mt-4">
              <span className="text-text_color_02">{t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_flbmtloamvqed3vejwwfk`}</span>
              <div className="text-text_color_01 flex items-center">
                <span className="pr-1">{id}</span>
                <Icon name="copy" hasTheme onClick={() => copyToClipbordFn(id)} />
              </div>
            </div>
            <div className="orderdetail-pay mt-4 pb-4 border-b border-b-line_color_02">
              <span className="text-text_color_02">{t`features_c2c_trade_history_records_content_table_column_gkswfpwsjnnnigaff1dwq`}</span>
              <div className="text-text_color_01">{formatDate(createdTime)}</div>
            </div>
            <div className="orderdetail-pay mt-4">
              <span className="text-text_color_02">{t`trade.c2c.singleprice`}</span>
              <div className="text-text_color_01">
                {price} {currencyEnName}
              </div>
            </div>
            <div className="orderdetail-pay mt-4">
              <span className="text-text_color_02">{t`Amount`}</span>
              <div className="text-text_color_01">
                {formatNumberDecimal(number, tradePrecision)} {coinName}
              </div>
            </div>
            <div className="orderdetail-pay mt-4 pb-4 border-b border-b-line_color_02">
              <span className="text-text_color_02">{t`features_c2c_trade_c2c_chat_c2c_chat_window_index_064niyem2qfqd6m_zr4sv`}</span>
              <div className="text-text_color_01">
                {totalPrice} {currencyEnName}
              </div>
            </div>
            {dealTypeCd === TransactionStation.OUTSIDE && (
              <>
                <div className="orderdetail-pay mt-4">
                  <span className="text-text_color_02">{t`features_c2c_advertise_post_advertise_index_bznoe3qqmyg0ylegimmxb`}</span>
                  <div className="text-text_color_01">{mainchainAddrName}</div>
                </div>
                <div className="orderdetail-pay mt-4">
                  <span className="text-text_color_02">{t`features_assets_financial_record_record_detail_index_5101065`}</span>
                  <div className="text-text_color_01 flex">
                    <span className="pr-1">{mainchainAddrAddr}</span>
                    <Icon name="spot_format_switch" hasTheme onClick={() => copyToClipbordFn(mainchainAddrAddr)} />
                  </div>
                </div>
                {mainchainAddrMemo && (
                  <div className="orderdetail-pay mt-4">
                    <span className="text-text_color_02">
                      {t`features_assets_financial_record_record_detail_index_5101065`} Memo
                    </span>
                    <div className="text-text_color_01 flex items-center">
                      <span className="pr-1">{mainchainAddrMemo}</span>
                      <Icon name="spot_format_switch" hasTheme onClick={() => copyToClipbordFn(mainchainAddrMemo)} />
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="orderdetail-pay mt-4">
              <span className="text-text_color_02">{t`features/c2c-trade/creates-advertisements/index-16`}</span>
              <div className="text-text_color_01 max-w-sm break-all">{remark}</div>
            </div>
          </>
        )}

        <div>
          {getShowMaterial() && (
            <div className="flex justify-between items-center text-text_color_01 text-base font-medium mt-6 mb-4">
              <span>{t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_7p3k9v8ju2b9bbazve7za`}</span>
            </div>
          )}
          {appealPicture && appealPicture?.length > 0 && (
            <>
              <div className="texttext_color_02 mb-2">{t`features_c2c_trade_c2c_orderdetail_pay_index_wdppjunzsufcllqackmrf`}</div>
              <div className="flex">
                {appealPicture?.map(item => {
                  return (
                    <div className="appeal-upload-item" key={item}>
                      <LazyImage src={item} />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {appealVideo && (
          <>
            <div className="texttext_color_02 mb-2">{t`features_c2c_trade_c2c_orderdetail_pay_index_nzymt2vcru5c8rqwyrezi`}</div>
            <div className="flex">
              <div className="appeal-upload-item">
                <div className="re-upload-img" onClick={setOpenVideoChange}>
                  <Icon name="api_arrow_right" hasTheme className="upload-icon" />
                </div>
                <video className="appeal-upload-item" src={appealVideo} />
              </div>
            </div>
          </>
        )}

        {appealAttachment && (
          <>
            <div className="texttext_color_02 mb-2">{t`features_c2c_trade_c2c_orderdetail_pay_index_evsooz29kb8f1-co9xcrn`}</div>
            <div className="flex items-center">
              <div className="appeal-upload-result">
                <span>
                  <Icon name="icon_pdf" />
                </span>
                <span className="text-text_color_02 ml-2 text-sm">{t`features_c2c_trade_c2c_orderdetail_pay_index_etwb_-tlp8v6txd46row1`}</span>
              </div>
              <div className="ml-4 text-brand_color downlaod text-sm cursor-pointer" onClick={setDownlaodFile}>
                <Icon name="c2c_download_document" />
                <span>{t`Download`}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default memo(C2COrderDetailPay)
