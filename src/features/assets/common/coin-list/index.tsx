import { Modal, Input } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import Icon from '@/components/icon'
import { getAllCoinList, searchCoinList } from '@/helper/assets'
import { CoinStateEnum, CoinHotStateEnum, CoinListTypeEnum, getAssetsDepositType } from '@/constants/assets'
import { AllCoinListResp as ICoinInfoListResp } from '@/typings/api/assets/assets'
import LazyImage from '@/components/lazy-image'
import { useAssetsStore } from '@/store/assets'
import styles from './index.module.css'

type ICoinListProps = {
  type: CoinListTypeEnum
  isShow: boolean
  setShow(val): void
  onChangeCoin(val): void
}
/**
 * 币种选择列表组件
 */
export function CoinList({ type, isShow, setShow, onChangeCoin }: ICoinListProps) {
  const [coinListData, setCoinListData] = useState<ICoinInfoListResp[]>([])
  const [coinListTable, setCoinListTable] = useState<ICoinInfoListResp[]>([])
  const [coinListHot, setCoinListHot] = useState<ICoinInfoListResp[]>([])
  const assetsStore = useAssetsStore()
  const { coinSearchHistory, updateCoinSearchHistory } = { ...assetsStore } || {}
  const historyList = coinSearchHistory[getAssetsDepositType(type)] || [] // 搜索历史

  // 数组排序
  function sortArrayFn(x, y) {
    if (x.coinName?.toUpperCase() < y.coinName?.toUpperCase()) {
      return -1
    }
    if (x.coinName?.toUpperCase() > y.coinName?.toUpperCase()) {
      return 1
    }
    return 0
  }

  /** 本地搜索 */
  const onSearch = searchKey => {
    const searchResults = searchCoinList(coinListData, searchKey, false)
    let sortCoinList = searchResults.slice(0)
    sortCoinList = sortCoinList.sort(sortArrayFn)
    setCoinListTable(sortCoinList)
  }

  const onClickCoin = (coin: ICoinInfoListResp) => {
    if (historyList.length < 8) {
      const isExist = historyList.some(item => item.id === coin.id)
      !isExist && updateCoinSearchHistory(type, [coin, ...historyList])
    } else {
      const isExist = historyList.some(item => item.id === coin.id)
      if (!isExist) {
        let newHistoryList = [...historyList]
        newHistoryList.pop()
        newHistoryList.unshift(coin)
        updateCoinSearchHistory(type, newHistoryList)
      }
    }
    onChangeCoin(coin)
    setShow(false)
  }

  /** 根据选中的主网类型获取充币二维码、充值地址和充值状态等信息 */
  const getCoinListHot = async () => {
    const { coinList } = await getAllCoinList({ type: +type })
    if (!coinList || coinList.length === 0) return
    let sortCoinList = coinList.slice(0)
    sortCoinList = sortCoinList.sort(sortArrayFn)

    setCoinListData(sortCoinList)
    setCoinListTable(sortCoinList)
    setCoinListHot(
      coinList.filter(item => {
        return item.isPopular === CoinHotStateEnum.open
      })
    )
  }

  /** 充提币状态 */
  const getCoinState = (item: { isDeposit: any; isWithdraw: any }) => {
    if (type === CoinListTypeEnum.deposit) {
      return item.isDeposit === CoinStateEnum.open
    }
    if (type === CoinListTypeEnum.withdraw) {
      return item.isWithdraw === CoinStateEnum.open
    }
    return false
  }

  const showCoinInfoNode = item => {
    const state = getCoinState(item)

    if (!state) {
      return (
        <>
          <div className="coin-name text-text_color_04">
            {item.coinName} <span>{item.coinFullName}</span>
          </div>
          <div className="coin-state">{t`assets.deposit.suspended`}</div>
        </>
      )
    }
    return (
      <div className="coin-name">
        {item.coinName} <span>{item.coinFullName}</span>
      </div>
    )
  }

  useEffect(() => {
    getCoinListHot()
  }, [])

  return (
    <Modal
      className={styles.scoped}
      title={<div style={{ textAlign: 'left' }}>{t`assets.deposit.coinOption`}</div>}
      style={{ width: 480 }}
      visible={isShow}
      footer={null}
      onCancel={() => {
        setShow(false)
      }}
    >
      <div className="px-8">
        <Input
          className="search-form"
          style={{ width: 416, height: 46 }}
          prefix={<Icon name="search" hasTheme />}
          placeholder={t`assets.deposit.searchCoin`}
          onChange={value => onSearch(value)}
        />
        {historyList && historyList.length > 0 && (
          <div className="mt-6">
            <div className="label-name search-title">
              <span>{t`features_market_market_list_market_list_spot_trade_layout_coin_selected_history_index_2739`}</span>
              <Icon
                name="rebates_delete"
                hasTheme
                className="text-lg"
                onClick={() => updateCoinSearchHistory(type, [])}
              />
            </div>
            <div className="search-history">
              {historyList.map((item, index) => (
                <div
                  className="search-coin-item"
                  key={index}
                  onClick={() => {
                    onClickCoin(item)
                  }}
                >
                  {item.coinName}
                </div>
              ))}
            </div>
          </div>
        )}
        {coinListHot && coinListHot.length > 0 && (
          <>
            <div className="label-name mt-6">{t`assets.deposit.hotCoin`}</div>
            <div className="hot-coin">
              {coinListHot.map((item, index) => (
                <div
                  className="hot-coin-item"
                  key={index}
                  onClick={() => {
                    onClickCoin(item)
                  }}
                >
                  <LazyImage src={item.webLogo ? item.webLogo : ''} />
                  <span>{item.coinName}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="coin-list-wrap">
        <div className="coin-list">
          {coinListTable &&
            coinListTable.map((item, index) => (
              <div
                key={index}
                className="coin-item"
                onClick={() => {
                  onClickCoin(item)
                }}
              >
                <LazyImage src={item.webLogo ? item.webLogo : ''} width={24} height={24} />
                {/* <div className="coin-name">
                  {item.coinName} <span>{item.coinFullName}</span>
                </div> */}
                {showCoinInfoNode(item)}
              </div>
            ))}
        </div>
      </div>
    </Modal>
  )
}
