/**
 * 合约资金划转 - 现货｜逐仓 <-> 逐仓｜现货
 */
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { Button, Message, Spin } from '@nbit/arco'
import { formatCoinAmount, getCoinPrecision } from '@/helper/assets'
import { AssetsTransferTypeEnum, TransferAccountEnum } from '@/constants/assets/futures'
import { getPerpetualGroupMarginList } from '@/apis/assets/futures/overview'
import { DetailMarginCoinList, ITransferAccountListData } from '@/typings/api/assets/futures'
import { getTransferAccount, postFuturesSpotTransfer } from '@/apis/assets/futures/common'
import { getCoinAssetData } from '@/apis/assets/main'
import classNames from 'classnames'
import { getMemberContractAssetsMargin } from '@/apis/future/preferences'
import { useRequest, useUpdateEffect } from 'ahooks'
import { defaultTransferNewGroup } from '@/store/assets/futures'
import Decimal from 'decimal.js'
import styles from './index.module.css'
import AssetsPopUp from '../../assets-popup'
import CoinSelectSearch from '../common/coin-select'
import AccountSwitch from '../common/account-switch'
import AssetsInputNumber from '../../assets-input-number'

type IAssetsFuturesTransferProps = {
  /** 划转类型 */
  type?: AssetsTransferTypeEnum
  /** 合约组 ID */
  groupId: string
  /** 选中币种 id */
  coinId?: string
  /** 法币符号 */
  currencySymbol?: string
  visible: boolean
  setVisible: (val: boolean) => void
  onSubmitFn?: () => void
}

export type ITransferData = {
  /** 划转类型 */
  type: AssetsTransferTypeEnum
  /** 来源账户 */
  fromAccount: ITransferAccountListData
  /** 目标账户 */
  toAccount: ITransferAccountListData
}

function AssetsFuturesTransfer(props: IAssetsFuturesTransferProps) {
  const { groupId, coinId, type = AssetsTransferTypeEnum.to, visible, setVisible, onSubmitFn } = props || {}
  const [currentCoin, setCurrentCoin] = useState<DetailMarginCoinList>()
  const defaultTransferData = {
    /** 划转类型 */
    type,
    /** 来源账户 */
    fromAccount:
      type === AssetsTransferTypeEnum.to
        ? ({ groupId: null, amount: '0' } as ITransferAccountListData)
        : ({ groupId, amount: '0' } as ITransferAccountListData),
    /** 目标账户 */
    toAccount: {} as ITransferAccountListData,
  }
  const [transferData, setTransferData] = useState<ITransferData>(defaultTransferData)
  const isOut = transferData.type === AssetsTransferTypeEnum.from
  const [amount, setAmount] = useState<string>('')
  const [coinList, setCoinList] = useState<DetailMarginCoinList[]>([]) // 币种列表（下拉框）
  const [accountList, setAccountList] = useState<ITransferAccountListData[]>([])
  const [errorStatus, setErrorStatus] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const precision = useMemo(() => {
    return getCoinPrecision(currentCoin?.symbol || '')
  }, [currentCoin?.symbol])

  /**
   * 查询划转账户列表
   */
  const onLoadTransferAccountList = async _coinId => {
    const res = await getTransferAccount({ coinId: _coinId || coinId })
    const { isOk, data } = res || {}
    const list = data?.list || []
    if (!isOk) {
      setAccountList([])
      return
    }
    if (list && list.length > 0) {
      setAccountList(list as ITransferAccountListData[])
      const fromGroupId = transferData.fromAccount?.groupId
      const toGroupId = transferData.toAccount?.groupId
      // 交易账户
      const tradeAccount = list.find(item => !item.groupName) || ({} as ITransferAccountListData)
      // 传入的合约组账户
      const groupAccount =
        list.find(item => String(item.groupId) === String(groupId)) || ({} as ITransferAccountListData)
      // 传入的合约组账户是否存在
      const fromAccount = fromGroupId ? list.find(item => String(item.groupId) === String(fromGroupId)) : ''
      // 划入账号可能是新建逐仓账户
      const toAccount = toGroupId
        ? list.find(item => String(item.groupId) === String(toGroupId)) ||
          (defaultTransferNewGroup as ITransferAccountListData)
        : ''
      const fromAccountData = fromAccount || (!isFirst ? tradeAccount : !isOut ? tradeAccount : groupAccount)
      const toAccountData = toAccount || (!isFirst ? tradeAccount : !isOut ? groupAccount : tradeAccount)
      setTransferData({
        ...transferData,
        fromAccount: fromAccountData,
        toAccount: toAccountData,
      })
      setAmount('')
      setIsFirst(false)
    }
  }

  /** 查询用户保证金币种设置 */
  const getMemberCurrencyList = async () => {
    const res = await getMemberContractAssetsMargin({})
    if (res.isOk) {
      const list = res.data?.coinData || []
      const newMarginList = list.filter(item => item.selected) || []
      return newMarginList
    }
  }

  /**
   * 查询逐仓保证金币种列表
   */
  const onLoadCoinList = async () => {
    const params = { isGt: false, pageNum: 1, pageSize: 0 }
    const res = !transferData.fromAccount?.groupId
      ? await getCoinAssetData(params)
      : await getPerpetualGroupMarginList({ groupId: transferData.fromAccount?.groupId })
    const { isOk, data } = res || {}
    const list = data?.list || []
    if (!isOk || !list || !list.length) {
      setCoinList([])
      return
    }

    let listData = list as DetailMarginCoinList[] | any
    // 现货账户只取保证金币种信息
    if (!transferData.fromAccount?.groupId) {
      const newMarginList = await getMemberCurrencyList()
      listData = listData.filter(item => newMarginList?.some(margin => margin.coinId.toString() === item.coinId)) || []
    }

    const newCoinId = currentCoin?.coinId || coinId
    const newCoin = newCoinId
      ? listData.find((item: DetailMarginCoinList) => String(item.coinId) === String(newCoinId)) || listData[0]
      : listData[0] || {}
    setCurrentCoin(newCoin)
    setCoinList(listData as DetailMarginCoinList[])
  }

  const { run: onLoadCoinListData, loading } = useRequest(onLoadCoinList, { manual: true })

  /**
   * 划转 交易账户 <-> 逐仓账户
   * @param coinId 币种 id
   */
  const onTransfer = async (_coinId: string) => {
    const fromGroupId = transferData.fromAccount?.groupId
    const toGroupId =
      transferData.toAccount?.groupId === TransferAccountEnum.newGroup ? '' : transferData.toAccount?.groupId
    let toType = ''
    // 转入组 id 为空，币种为空时为新建逐仓
    if (!toGroupId && !transferData.toAccount.coinId) {
      toType = TransferAccountEnum.newGroup
    } else if (!toGroupId) {
      toType = TransferAccountEnum.spotAccount
    }

    const params = {
      coinId: _coinId,
      amount,
      fromGroupId,
      fromType: !fromGroupId ? TransferAccountEnum.spotAccount : '',
      toType,
      toGroupId,
    }

    /** 划转 */
    const res = await postFuturesSpotTransfer(params)

    const { isOk, data } = res || {}

    if (!isOk) {
      return false
    }

    if (!data?.isSuccess) {
      Message.error(t`features_assets_common_transfer_spot_futures_transfer_index__9wjc1qiw4ctamcgw8ifo`)
      onSubmitFn && onSubmitFn()
      return false
    }

    Message.success(t`features/assets/common/transfer/index-8`)
    setAmount('')
    setVisible(false)
    onSubmitFn && onSubmitFn()
  }
  const submit = () => {
    if (!currentCoin?.coinId) {
      Message.error(t`assets.deposit.selectCoinPlease`)
      return
    } else if (!amount || Number(amount) <= 0) {
      setErrorStatus(true)
      Message.error(t`features_c2c_center_transfer_index_1p8qgbuymab6g79c07kdk`)
      return
    }
    // 前端不需要做超出最大可用校验
    // else if (new Decimal(amount) > new Decimal(transferData.fromAccount.amount)) {
    //   setErrorStatus(true)
    //   Message.error(t`helper_assets_futures_5101560`)
    //   return
    // }
    setErrorStatus(false)
    onTransfer(currentCoin?.coinId || '')
  }

  /** 切换划转方向 */
  const onChangeDirection = () => {
    setTransferData({
      ...transferData,
      fromAccount: transferData.toAccount,
      toAccount: transferData.fromAccount,
      type: transferData.type === AssetsTransferTypeEnum.from ? AssetsTransferTypeEnum.to : AssetsTransferTypeEnum.from,
    })
    setAmount('')
  }

  /** 划转弹窗 方向箭头切换 */
  const onChangeAccount = (val, option: any) => {
    const isFromAccount = option['data-info']
    const newAccount = isFromAccount
      ? { ...transferData, fromAccount: option.extra }
      : { ...transferData, toAccount: option.extra }

    if (newAccount.fromAccount.groupId === newAccount.toAccount.groupId) return false
    setTransferData(newAccount)
    isFromAccount && setAmount('')
  }

  // 划转弹窗 币种切换
  const onChangeCoin = v => {
    setCurrentCoin(v)
  }

  // 数量输入
  const onChangeAmount = val => {
    setAmount(val)
    if (val === undefined) {
      setErrorStatus(true)
      Message.error(t`features_c2c_center_transfer_index_1p8qgbuymab6g79c07kdk`)
      return
    }
    setErrorStatus(false)
  }

  const amountRef = useRef<HTMLInputElement | any>(null)
  /** 点击提币数量的全部按钮 - 可用提币数 */
  const onAllAmount = () => {
    if (transferData.fromAccount?.amount) {
      const maxAmount = formatCoinAmount(
        transferData.fromAccount?.coinName || '',
        transferData.fromAccount?.amount || '0',
        false
      )
      onChangeAmount(maxAmount)
      // 点击全部有时没反应，暂时用失焦事件解决
      amountRef.current && amountRef.current.blur()
    }
  }

  useEffect(() => {
    onLoadCoinListData()
  }, [transferData.fromAccount.groupId])

  useUpdateEffect(() => {
    if (currentCoin?.coinId) {
      onLoadTransferAccountList(currentCoin?.coinId)
    }
  }, [currentCoin?.coinId])

  return (
    <AssetsPopUp
      style={{ width: 480 }}
      title={t`features/assets/main/index-4`}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false)
      }}
      onOk={() => {
        submit()
      }}
    >
      <div className={styles.transfer}>
        <Spin loading={loading}>
          <AccountSwitch
            groupId={groupId}
            accountList={accountList}
            transferData={transferData}
            onChangeDirection={() => onChangeDirection()}
            onChangeAccount={onChangeAccount}
          />

          <div className="mt-6">
            <div className="fixed-text">{t`features_c2c_center_ad_account_index_galjwp2npe4y-lfse1z0r`}</div>
            <CoinSelectSearch
              list={coinList}
              coinId={(currentCoin?.coinId || coinId) ?? ''}
              onChange={(v: DetailMarginCoinList) => {
                onChangeCoin(v)
              }}
            />
          </div>
          <div className="amount-wrapper">
            <div className="header">
              <div className="left">{t`Amount`}</div>
              <div className="right">
                {t`features_c2c_center_ad_account_index_nnukrasyulud7yq24oyb0`}{' '}
                {formatCoinAmount(transferData.fromAccount?.coinName || '', transferData.fromAccount?.amount || '0')}{' '}
                {currentCoin?.symbol}
              </div>
            </div>
            <AssetsInputNumber
              ref={amountRef}
              hideControl
              value={amount}
              className={classNames({ 'check-error': errorStatus })}
              precision={precision}
              placeholder={t`features_assets_futures_common_adjust_margin_withdraw_5101421`}
              min={0}
              onChange={val => {
                onChangeAmount(val)
              }}
              suffix={
                <div className="input-suffix-box">
                  <div className="suffix-coin-name">{currentCoin?.symbol}</div>
                  <div className="y-line"></div>
                  <div className="text-btn" onClick={() => onAllAmount()}>
                    {t`features_c2c_center_ad_account_index_wmuciqzsotcxt6osi2bvu`}
                  </div>
                </div>
              }
            />
          </div>
          <div className="footer">
            <Button
              type="primary"
              onClick={() => {
                submit()
              }}
            >{t`user.field.reuse_17`}</Button>
          </div>
        </Spin>
      </div>
    </AssetsPopUp>
  )
}

export default memo(AssetsFuturesTransfer)
