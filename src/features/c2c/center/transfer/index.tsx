import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Input, Message } from '@nbit/arco'

import {
  fetchAssetCoinBalance,
  fetchC2CBalanceTransfer,
  fetchC2CCoinAll,
  postV1AssetTransferFastPayApiRequest,
} from '@/apis/c2c/center'
import { CoinListType } from '@/typings/api/c2c/center'
import { isPublicC2cMode } from '@/helper/env'
import { c2cBusinessType } from '@/constants/c2c/common'
import { useCommonStore } from '@/store/common'
import { formatBalance } from '../utils/format-balance'
import { ConfirmModal } from '../modal'
import CoinSelectSearch from '../coin-select-search'
import CoinSwitch from '../coin-switch'

import styles from './transfer.module.css'

type Props = {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  onSubmit?: () => void
}

function Transfer({ visible, setVisible, onSubmit }: Props) {
  const [currCoin, setCurrCoin] = useState<CoinListType>() // {t`features_c2c_center_ad_account_index_gmya1obf_ej04escc3nda`}
  const [c2cCoinList, setC2cCoinList] = useState<CoinListType[]>([])
  const [assetCoinList, setAssetCoinList] = useState<CoinListType[]>([])
  const [reverse, setReverse] = useState(false)
  const [quantity, setQuantity] = useState<string>('')

  const { c2cModeInfo } = useCommonStore()
  const { c2cBid } = c2cModeInfo || {}

  /** 初始化 c2c 账户交易对的列表 */
  const onLoad = async () => {
    const c2cCoin = await fetchC2CCoinAll({})
    const assetCoin = await fetchAssetCoinBalance({ pageSize: 0 })

    if (c2cCoin.isOk && assetCoin.isOk) {
      const c2cCoinResult: CoinListType[] = []
      const assetCoinResult: CoinListType[] = []

      for (let i = 0; i < c2cCoin.data.length; i += 1) {
        const arr = c2cCoin.data[i]
        // filter by symbol to support fastpay api
        const assetCoinTmp = assetCoin.data.list.filter(item => item.symbol === arr.symbol)

        c2cCoinResult.push({
          id: arr.id,
          symbol: arr.symbol,
          img: arr.webLogo,
          balance: arr.balance,
        })

        if (assetCoinTmp.length > 0) {
          const x = assetCoinTmp[0]

          assetCoinResult.push({
            id: x.coinId,
            symbol: x.symbol,
            img: x.webLogo,
            balance: x.availableAmount,
          })
        }
      }

      if (assetCoinResult.length && c2cCoinResult.length) {
        setCurrCoin(reverse ? c2cCoinResult[0] : assetCoinResult[0])
      }
      setC2cCoinList(c2cCoinResult)
      setAssetCoinList(assetCoinResult)
    }
  }

  /**
   * c2c 划转 交易账户 <-> c2c {t`features_c2c_center_coin_switch_index_3rawstucyu0jlw1lxln_i`}
   * @param coinId 币种 id
   * @param typeCd 划转类型
   * @param amount 金额
   */
  const c2cBalanceTransfer = async (coinId, typeCd, amount) => {
    let res: any = null

    if (isPublicC2cMode) {
      // transfer to/from fastpay c2c for public c2c merchant user
      if (c2cBid)
        // @ts-ignore
        res = await postV1AssetTransferFastPayApiRequest({
          coinId,
          amount: Number(amount),
          type: reverse ? c2cBusinessType.privateC2c : c2cBusinessType.publicC2c,
          linkedBusinessId: c2cBid,
        })
    } else res = await fetchC2CBalanceTransfer({ coinId, typeCd, amount })

    if (res?.isOk) {
      Message.success(t`features_c2c_center_transfer_index_tcax-xxwnb9tt1bkbxpvx`)
      onLoad()
      setQuantity('')
      setVisible(false)

      onSubmit && onSubmit()
    }
  }

  const submit = () => {
    if (!quantity) {
      Message.error(t`features_c2c_center_transfer_index_1p8qgbuymab6g79c07kdk`)
      return
    }
    c2cBalanceTransfer(currCoin?.id, reverse ? 1 : 2, quantity)
    setQuantity('')
  }

  useEffect(() => {
    onLoad()
  }, [])

  // 划转弹窗 上下箭头切换
  const coinSwitchOnChange = () => {
    const datas = reverse ? assetCoinList : c2cCoinList
    const it = datas.filter(item => item.symbol === currCoin?.symbol ?? '')
    setCurrCoin(it[0])
    setQuantity('')
  }

  return (
    <ConfirmModal
      style={{ width: 444 }}
      visible={visible}
      setVisible={setVisible}
      isHideCancel
      confirmText={t`user.field.reuse_17`}
      confirmDisabled={!quantity || Number(quantity) === 0}
      onSubmit={() => submit()}
    >
      <div className={styles.modal}>
        <div className="title">{t`features/assets/main/index-4`}</div>
        <div className="coin-name">{t`features_c2c_center_ad_account_index_galjwp2npe4y-lfse1z0r`}</div>
        <div className="mt-2">
          <CoinSelectSearch
            lists={reverse ? c2cCoinList : assetCoinList}
            touchId={currCoin?.id ?? ''}
            onChange={(v: CoinListType) => setCurrCoin(v)}
          />
        </div>
        <div className="mt-6">
          <CoinSwitch reverse={reverse} setReverse={setReverse} onChange={() => coinSwitchOnChange()} />
        </div>
        <div className="cut-num">
          <div className="header">
            <div className="left">{t`Amount`}</div>
            <div className="right">
              {t`features_c2c_center_ad_account_index_nnukrasyulud7yq24oyb0`}{' '}
              {formatBalance(currCoin?.symbol || '', currCoin?.balance || '0')} {currCoin?.symbol}
            </div>
          </div>
          <div className="input-box">
            <Input
              value={quantity}
              onChange={e => setQuantity(e.replace(/[^\d^\\.]+/g, ''))}
              suffix={
                <div className="input-suffix-box">
                  <div className="suffix-coin-name">{currCoin?.symbol}</div>
                  <div className="y-line"></div>
                  <div
                    className="text-btn"
                    onClick={() =>
                      setQuantity(formatBalance(currCoin?.symbol || '', currCoin?.balance || '0').replace(/,/g, ''))
                    }
                  >
                    {t`features_c2c_center_ad_account_index_wmuciqzsotcxt6osi2bvu`}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </ConfirmModal>
  )
}

export default memo(Transfer)
