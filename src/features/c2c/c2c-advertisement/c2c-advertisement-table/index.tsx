import { postV1C2cAdvertListApiRequest, postV1C2cCoinListApiRequest } from '@/apis/c2c/advertise'
import NoDataImage from '@/components/no-data-image'
import { flipAdvertDirection, mapCodeDictToAdsList } from '@/helper/c2c/advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { YapiPostV1C2CAdvertListData } from '@/typings/yapi/C2cAdvertListV1PostApi'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi'
import Table from '@/components/table'
import { useMount, useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { isEmpty, uniqueId } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { YapiPostV1C2CCoinMainChainListData } from '@/typings/yapi/C2cCoinMainChainListV1PostApi'
import { getMainChainList } from '@/apis/c2c/c2c-trade'
import { usePaymentCodeVal, useAdvertCodeVal } from '@/features/c2c/trade/free-trade/use-advert-code-val'
import FreePlaceorderModal from '../../trade/free-trade/free-placeorder-modal'
import { getHisAdvertisementTableColumns, getMyAdvertisementTableColumns } from './c2c-advertisement-table-col'
import AdvertisementTableFilters from './c2c-advertisement-table-filters'
import styles from './index.module.css'

type FreeTradePlaceModal = Record<'setCoinsTradePlaceVisible', () => void>

function AdvertisementTable({ columns, uid }: { columns: any; uid?: string }) {
  const [data, setdata] = useState<YapiPostV1C2CAdvertListData[]>()
  const [filters, setfilters] = useState<any>({})
  const [pagination, setpagination] = useState({ pageNum: 1, pageSize: 5 })
  const [total, settotal] = useState<number>(0)
  const { adCodeDictionary } = useC2CAdvertiseStore()

  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {
    if (isEmpty(adCodeDictionary)) return
    filters?.tradeTypeCds?.length === 0 && delete filters.tradeTypeCds
    setisLoading(true)
    postV1C2cAdvertListApiRequest({ ...filters, ...pagination, advertStatus: 1, uid })
      .then(res => {
        const mapped = mapCodeDictToAdsList((res?.data as any)?.list, adCodeDictionary)
        settotal((res?.data as any)?.total || 0)
        setdata(mapped)
      })
      .finally(() => setisLoading(false))
  }, [filters, pagination, adCodeDictionary, uid])

  const handlePaginationOnChange = (pageNum, pageSize) => {
    setpagination(prev => {
      return { ...prev, pageNum, pageSize }
    })
  }

  return (
    <div className={styles.scoped}>
      <AdvertisementTableFilters hasUid={uid} onchange={setfilters} />
      <Table
        fitByContent
        autoWidth
        minWidthWithColumn={false}
        border={false}
        loading={isLoading}
        rowKey={item => (item?.advertId || uniqueId) as React.Key}
        columns={columns}
        data={data}
        noDataElement={<NoDataImage size="h-24 w-28" className={classNames({ invisible: isLoading })} />}
        pagination={{
          current: pagination.pageNum,
          total,
          pageSize: pagination.pageSize,
          onChange: handlePaginationOnChange,
        }}
      />
    </div>
  )
}

export function MyAdvertisementTable() {
  return <AdvertisementTable columns={getMyAdvertisementTableColumns()} />
}

export function HisAdvertisementTable({ uid }) {
  const { currentAdvert, isTradeFormOpen } = useC2CAdvertiseStore()
  const [coinList, setcoinList] = useState<YapiPostV1C2CCoinListData[]>()
  const [currentCoin, setcurrentCoin] = useState<YapiPostV1C2CCoinListData>()
  const [mainChainList, setMainChainList] = useState<YapiPostV1C2CCoinMainChainListData[]>([])
  const freeTradePlaceModalRef = useRef<FreeTradePlaceModal>(null)
  const [placeorderProps, setplaceorderProps] = useState<any>()

  const { getAdvertCodeVal } = useAdvertCodeVal()

  const { getPaymentCodeVal, getPaymentColorCodeVal } = usePaymentCodeVal()

  useMount(() => {
    postV1C2cCoinListApiRequest({}).then(res => setcoinList(res.data || []))
  })

  useEffect(() => {
    currentAdvert && coinList && setcurrentCoin(coinList.find(coin => coin?.id?.toString() === currentAdvert.coinId))
    if (currentAdvert) {
      // set newPayments property as payments
      const props = { ...currentAdvert, payments: currentAdvert.newPayments?.map(each => each.name) || [] }
      setplaceorderProps(props)
    }
  }, [currentAdvert])

  useEffect(() => {
    if (currentCoin?.symbol)
      getMainChainList({ name: currentCoin.symbol }).then(res => setMainChainList(res.data || []))
  }, [currentCoin])

  useUpdateEffect(() => {
    freeTradePlaceModalRef.current?.setCoinsTradePlaceVisible()
  }, [isTradeFormOpen])

  return (
    <>
      <AdvertisementTable columns={getHisAdvertisementTableColumns()} uid={uid} />
      {!isEmpty(currentAdvert) && (
        <FreePlaceorderModal
          ref={freeTradePlaceModalRef}
          getAdvertCodeVal={getAdvertCodeVal}
          getPaymentCodeVal={getPaymentCodeVal}
          freePlaceProps={placeorderProps as any}
          tradeType={flipAdvertDirection(currentAdvert?.advertDirectCd)}
          areaPrecisionDetail={currentCoin}
          handleCoinsType={currentCoin}
          mainChainList={mainChainList}
          getPaymentColorCodeVal={getPaymentColorCodeVal}
        />
      )}
    </>
  )
}
