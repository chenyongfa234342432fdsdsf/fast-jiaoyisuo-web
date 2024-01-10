/**
 * 合约资产首页 - 保证金资产列表
 */
import { Drawer } from '@nbit/arco'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { FuturesGroupDetailResp, IFuturesAssetsList } from '@/typings/api/assets/futures'
import { formatAssetInfo, onGetContractAssetsList } from '@/helper/assets/futures'
import { formatCoinAmount } from '@/helper/assets'
import ListEmpty from '@/components/list-empty'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import styles from '../index.module.css'
import MarginPositionCell from './margin-position-cell'

type IMenuCellsProps = {
  visible: boolean
  setVisible: (val: boolean) => void
  assetsData?: FuturesGroupDetailResp | undefined
}

type IAssetItemCellProps = {
  baseCoin: string
  offset: number
  data: IFuturesAssetsList
}

function AssetItemCell({ data, baseCoin, offset }: IAssetItemCellProps) {
  const [expand, setExpand] = useState(false)
  return (
    <>
      <div
        className="list-item cursor-pointer"
        onClick={(e: any) => {
          e.stopPropagation()
          setExpand(!expand)
        }}
      >
        <div className="coin-name !font-normal">
          <LazyImage className="mr-2" src={data.webLogo} width={24} height={24} />
          {data.symbol}
        </div>
        <div className="list-right">
          <div className="item-value">
            <span className="font-medium">{formatCoinAmount(data.coinName, data.amount)}</span>
            <span className="currency">≈{formatAssetInfo(data.convertedValue, baseCoin, offset)}</span>
          </div>
          {data.groupList.length > 0 && (
            <Icon name={expand ? 'trade_put_away' : 'trade_expand'} hasTheme className="ml-4" />
          )}
        </div>
      </div>
      {expand && data.groupList.length > 0 && (
        <div className={`cell-detail ${expand && 'border-b'}`}>
          <MarginPositionCell groupList={data.groupList} symbol={data.coinName} coinId={data.coinId} />
        </div>
      )}
    </>
  )
}

export function FuturesIndexMarginAssetList(props: IMenuCellsProps) {
  const { visible, setVisible } = props || {}
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { offset },
  } = { ...assetsFuturesStore }
  const { futuresAssetsMarginList } = useAssetsFuturesStore()
  const marginAssetData = futuresAssetsMarginList?.list || []
  const baseCoin = futuresAssetsMarginList?.baseCoin
  const { run: getContractAssetsList, loading } = useRequest(onGetContractAssetsList, { manual: true })

  useEffect(() => {
    /** 合约保证金资产列表 */
    getContractAssetsList()
  }, [])

  return (
    <Drawer
      className={styles.scoped}
      width={400}
      title={t`features_assets_futures_futures_detail_index_6idfpkpwfmdr18zxis0fr`}
      visible={visible}
      footer={null}
      onOk={() => {
        setVisible(false)
      }}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <div className={styles['list-wrap']}>
        {marginAssetData && marginAssetData?.length > 0 ? (
          marginAssetData?.map(item => (
            <div key={item.coinId}>
              <AssetItemCell data={item} baseCoin={baseCoin} offset={offset} />
            </div>
          ))
        ) : (
          <ListEmpty loading={loading} />
        )}
      </div>
    </Drawer>
  )
}
