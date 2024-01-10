/**
 * 充值组件
 */
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { CoinStateEnum, CoinListTypeEnum, FinancialRecordTypeEnum } from '@/constants/assets'
import { CoinSelect, NetWorkSelect } from '@/features/assets/common/assets-select'
import NetworkStopService from '@/features/assets/common/network-stop-service'
import { getDepositAddress } from '@/apis/assets/main'
import { ISubCoinList, AllCoinListResp, IDepositAddressResp } from '@/typings/api/assets/assets'
import { usePageContext } from '@/hooks/use-page-context'
import { CoinList } from '@/features/assets/common/coin-list/index'
import { getAllCoinList, getSubCoinList } from '@/helper/assets'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import Lottie from 'lottie-react'
import jsonData from '@/assets/json/deposit-arrow.json'
import styles from './index.module.css'
import { Instruction } from './instruction'
import { HotCoin } from '../../common/hot-coin'
import { AddressInfo } from './address-info'
import { SpotHistoryRecord } from './record-list'

export function DepositLayout() {
  const pageContext = usePageContext()
  const coinId = pageContext?.urlParsed?.search?.id
  const [visibleCoinList, setVisibleCoinList] = useState(false) // 币种选择列表展示状态
  const [coin, setCoin] = useState<AllCoinListResp>(null as any)
  const [subCoin, setSubCoin] = useState<ISubCoinList | null>()
  const [subCoinList, setSubCoinList] = useState<ISubCoinList[]>(null as any)
  const [coinState, setCoinState] = useState(true) // 充值状态
  const [addressData, setAddressData] = useState<null | IDepositAddressResp>(null as any)

  /** 获取充币地址 */
  const getAddressInfo = async id => {
    const params = { coinId: id }
    const res = await getDepositAddress(params)
    const results = res.data

    if (!res.isOk || !results) {
      setAddressData(null) // 清空之前选中的充币地址信息
      return
    }

    setAddressData(results)
  }

  /** 获取币的基本信息 - 币状态和币地址 */
  const getCoinBaseInfo = async coinInfo => {
    if (!coinInfo) return
    setCoin(coinInfo)

    // 获取对应的子币（主网信息）
    const subCoinListData = await getSubCoinList(coinInfo.id)
    subCoinListData && setSubCoinList(subCoinListData)

    // 没子币信息时，直接获取充币地址
    if (!subCoinListData || subCoinListData.length === 0) {
      // 是否开启充值，1，是。2，否
      setCoinState(coinInfo.isDeposit === CoinStateEnum.open)
      coinInfo.isDeposit === CoinStateEnum.open && getAddressInfo(coinInfo.id)
      return
    }

    if (subCoinListData && coinId) {
      setSubCoin(subCoinListData[0])
      setCoinState(subCoinListData[0].isDeposit === CoinStateEnum.open)
      subCoinListData[0].isDeposit === CoinStateEnum.open && getAddressInfo(subCoinListData[0].id)
    }
  }

  /** 选择主币 */
  const onChangeCoin = coinInfo => {
    setAddressData(null) // 清空之前选中的充币地址信息
    setSubCoin(null)
    getCoinBaseInfo(coinInfo)
    setCoinState(true)

    // 有 type 参数时，点击切换 tab 时修改 url 的 type 参数
    if (!coinId) return
    link(`/assets/main/deposit?id=${coinInfo.id}`, {
      overwriteLastHistoryEntry: true,
    })
  }

  /** 选择子币信息 */
  const onChangeSubCoin = (value: any) => {
    const subCoinData = JSON.parse(value)
    setCoinState(subCoinData.isDeposit === CoinStateEnum.open)
    subCoinData.isDeposit === CoinStateEnum.open && getAddressInfo(subCoinData.id)
    // setSubCoinId(subCoinData.id)
    setSubCoin(subCoinData)
  }

  /** 显示充值地址 */
  const renderAddressByState = () => {
    if (!coin) return
    if (!coinState) {
      return <NetworkStopService coinId={subCoin?.id || coin?.id} type={CoinListTypeEnum.deposit} />
    }

    if (addressData) {
      return <AddressInfo addressData={addressData} coinName={coin?.coinName} />
    }

    return null
  }

  const initData = async () => {
    if (!coinId) return
    // 获取所有币种
    const { coinInfo } = await getAllCoinList({ coinId, type: CoinListTypeEnum.deposit })
    /** 获取币的基本信息 */
    getCoinBaseInfo(coinInfo)
  }

  useEffect(() => {
    initData()
  }, [])

  return (
    <div className={styles.scoped}>
      <div className="deposit-wrap">
        <div className="first item-wrap">
          <div className="sub-title">
            <div className="num">1</div>
            <div className="info">{t`features_assets_main_deposit_index_eu00vklf0y`}</div>
            {coin && subCoin && (
              <div className="lottie-wrap">
                <Lottie animationData={jsonData} loop={false} autoPlay />
              </div>
            )}
          </div>
          <div className="form-wrap">
            <div className="assets-label">{t`assets.deposit.coinOption`}</div>
            <CoinSelect setVisibleCoinList={setVisibleCoinList} coin={coin} />
            {!coin && (
              <>
                <HotCoin type={CoinListTypeEnum.deposit} onChangeCoin={onChangeCoin} />
                <div className="waring-wrap">
                  <Icon name={'select_currency'} hasTheme isRemoteUrl />
                  <p>{t`assets.deposit.selectCoinPlease`}</p>
                </div>
              </>
            )}
            {coin && (
              <>
                <div className="assets-label">{t`assets.deposit.network`}</div>
                <NetWorkSelect selectValue={subCoin} networkList={subCoinList} onChangeFn={onChangeSubCoin} />
              </>
            )}
            {addressData && (
              <>
                <div className="network-confirm">
                  <Icon name="msg" />
                  <div className="remind-info">{t`features_assets_main_deposit_index_q1zotgbeav`}</div>
                </div>
                <Instruction rechargeWarnWord={addressData && addressData.hint} />
              </>
            )}
          </div>
        </div>
        <div className="second item-wrap">
          <div className="sub-title">
            <div className="num">2</div>
            <div className="info">{t`features_assets_main_deposit_index_bby94dwlwe`}</div>
          </div>
          <div className="form-wrap">{renderAddressByState()}</div>
        </div>
      </div>
      {/* 历史记录 */}
      <SpotHistoryRecord coinInfo={coin} type={FinancialRecordTypeEnum.deposit} />
      {/* 币种选择 */}
      {visibleCoinList && (
        <CoinList
          type={CoinListTypeEnum.deposit}
          onChangeCoin={onChangeCoin}
          isShow={visibleCoinList}
          setShow={setVisibleCoinList}
        />
      )}
    </div>
  )
}
