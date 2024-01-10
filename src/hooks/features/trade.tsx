import { Modal } from '@nbit/arco'
import { useMount } from 'react-use'
import TradeServiceTerms from '@/features/trade/trade-service-terms'
import TradeFuturesOpen, { ITradeFuturesOpenRef } from '@/features/trade/trade-futures-open'
import { useUserStore } from '@/store/user'
import { useRef } from 'react'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import { useLayoutStore } from '@/store/layout'
import { UserFuturesTradeStatus } from '@/constants/user'
import { useFuturesStore } from '@/store/futures'

interface ICheckFuturesProps {
  isMount?: boolean
  isOk?: any
}
/**
 * @description:校验合约开通
 * @return checkFutures 校验函数
 */
export function useCheckFutures(props?: ICheckFuturesProps) {
  const isMount = props?.isMount
  const userStore = useUserStore()
  const { isLogin, userInfo } = userStore
  const { setOpenQuestionsMsg } = useFuturesStore()
  const { columnsDataByCd } = useLayoutStore()
  const { headerData } = useLayoutStore()
  const tradeFuturesOpenRef = useRef<ITradeFuturesOpenRef>()
  function openCheckFuturesModal() {
    Modal.destroyAll()
    Modal?.confirm?.({
      icon: null,
      maskClosable: false,
      title: (
        <div>
          <div className="text-2xl">{t`features/trade/future/index-2`}</div>
          <div className="subtitle text-text_color_02 mb-2 text-sm mt-1">{t`features/trade/future/index-3`}</div>
        </div>
      ),
      style: { width: '720px' },
      content: <TradeFuturesOpen ref={tradeFuturesOpenRef} />,
      onOk: () => {
        return new Promise((resolve, reject) => {
          tradeFuturesOpenRef.current?.form
            .validate()
            .then(() => {
              const _msg = tradeFuturesOpenRef.current?.msg
              setOpenQuestionsMsg(_msg)
              if (_msg) {
                reject()
                return
              }
              resolve(1)
              const confirm = Modal?.confirm?.({
                icon: null,
                maskClosable: false,
                title: t`user.validate_form_10`,
                style: { width: '420px' },
                content: (
                  <TradeServiceTerms
                    onCancel={() => confirm?.close()}
                    onOk={() => {
                      confirm?.close()
                      props?.isOk && props.isOk()
                    }}
                  >
                    <span>
                      <span
                        className="text-brand_color cursor-pointer"
                        onClick={() => {
                          if (columnsDataByCd?.contract_user_agreement?.webUrl) {
                            link(columnsDataByCd?.contract_user_agreement?.webUrl, { target: true })
                          }
                        }}
                      >
                        {t({
                          id: 'features/trade/future/index-4',
                          values: { 0: headerData?.businessName },
                        })}
                      </span>
                      {t`features/trade/future/index-5`}
                      <span
                        className="text-brand_color cursor-pointer"
                        onClick={() => {
                          if (columnsDataByCd?.risk_warning_statement?.webUrl) {
                            link(columnsDataByCd?.risk_warning_statement?.webUrl, { target: true })
                          }
                        }}
                      >
                        {t`features/trade/future/index-6`}
                      </span>
                    </span>
                  </TradeServiceTerms>
                ),
                footer: null,
              })
            })
            .catch(() => {
              reject(new Error('开通合约交易表单校验失败'))
            })
        })
      },
      onCancel: () => {
        setOpenQuestionsMsg('')
      },
    })
  }
  function checkFutures() {
    if (isLogin && !(userInfo?.isOpenContractStatus === UserFuturesTradeStatus.open)) {
      Modal?.confirm?.({
        icon: null,
        maskClosable: false,
        title: t`features/trade/future/index-0`,
        okText: t`hooks_features_trade_5101433`,
        content: t`features/trade/future/index-1`,
        onOk: () => {
          openCheckFuturesModal()
        },
      })
    }
  }
  useMount(() => {
    isMount && checkFutures()
  })
  return { checkFutures, openCheckFuturesModal }
}
