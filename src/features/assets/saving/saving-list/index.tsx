import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Select, Pagination, Empty } from '@nbit/arco'
import { getCurrencyList, getSavingList } from '@/apis/assets/saving'
import { ICoinInfoListResp } from '@/typings/api/assets/main'
import { getAllCoinList } from '@/helper/assets'
import { useAssetsStore } from '@/store/assets'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { productTypeEnum } from '@/constants/assets/saving'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import styles from './index.module.css'

function SavingList() {
  const assetsStore = useAssetsStore()
  const useStore = useUserStore()
  const info = useStore.personalCenterSettings
  const defaultPage: any = {
    pageNum: 1,
    pageSize: 14,
    totalCount: 0,
  }
  const [page, setPage] = useState(defaultPage) // 分页数据
  const [productType, setProductType] = useState('0') // 所有持仓
  const [coinId, setCoinId] = useState<any>(0) // 所有币种
  const [coinIdList, setCoinIdList] = useState<number[]>([]) // 持有币种 id 列表
  const [coinListData, setCoinListData] = useState<any[]>([]) // 持有币种
  const [list, setList] = useState<any[]>([]) // 列表数据

  /**
   * 获取所有币种信息
   */
  const onLoadAllCoin = async () => {
    const { coinList } = await getAllCoinList({ type: 1 })
    let newList: ICoinInfoListResp[] = []
    if (coinIdList.length > 0 && coinList && coinList.length > 0) {
      for (let i = 0; i < coinIdList.length; i += 1) {
        for (let j = 0; j < coinList.length; j += 1) {
          if (+coinList[j].id === +coinIdList[i]) {
            // newList.push(coinList[j])
            break
          }
        }
      }
    }

    setCoinListData(newList)
  }

  /**
   * 获取币种列表
   */
  const onLoadCoinIdList = async () => {
    const res = await getCurrencyList({})
    const { isOk = true, data = [] } = res || {}
    if (isOk) {
      setCoinIdList(data)
    }
  }

  /**
   * 查询理财列表数据
   */
  const getList = async () => {
    const res: any = await getSavingList({
      productType,
      coinId,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    })

    const { isOk = true, data = [], totalCount = 2 } = res || {}
    if (isOk) {
      const allList: any[] = assetsStore.allCoinInfoList
      let newList: any[] = []
      if (data.length > 0 && allList && allList.length > 0) {
        for (let i = 0; i < data.length; i += 1) {
          for (let j = 0; j < allList.length; j += 1) {
            if (allList[j].coinId === data[i].coinId) {
              const obj = { ...allList[j], ...data[i] }
              newList.push(obj)
              break
            }
          }
        }
      }
      setList(newList)
      setPage({ ...page, totalCount })
    }
  }

  /**
   * 跳转页面
   * @param params
   */
  const onGo = (params: any) => {
    //
  }

  useEffect(() => {
    onLoadCoinIdList()
    getList()
  }, [])

  useUpdateEffect(() => {
    getList()
    onLoadAllCoin()
  }, [productType, coinId, page.pageNum, page.pageSize, assetsStore.allCoinInfoList])

  return (
    <div className={styles.scoped}>
      <div className="root">
        <div className="header">
          <Select
            className={`select-item`}
            value={productType === '0' ? t`features/assets/saving/savingList/index-0` : productType}
            bordered={false}
            onChange={value => {
              setProductType(value)
            }}
          >
            <Select.Option value={productTypeEnum.ALL}>{t`assets.financial-record.search.all`}</Select.Option>
            <Select.Option
              value={productTypeEnum.CURRENT}
            >{t`features/assets/saving/savingList/index-1`}</Select.Option>
            <Select.Option
              value={productTypeEnum.REGULAR}
            >{t`features/assets/saving/savingList/index-2`}</Select.Option>
          </Select>

          <Select
            className={`select-item`}
            value={coinId === 0 ? t`features/assets/saving/savingList/index-3` : coinId}
            bordered={false}
            onChange={value => {
              setCoinId(value)
            }}
          >
            <Select.Option value={0}>{t`assets.financial-record.search.all`}</Select.Option>
            {coinListData.map((coinItem: any) => {
              return (
                <Select.Option value={coinItem.coinId} key={coinItem.coinId}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img src={coinItem.webLogo} alt="" style={{ width: '22px', height: '22px', marginRight: '10px' }} />
                    <span>{coinItem.shortName}</span>
                  </div>
                </Select.Option>
              )
            })}
          </Select>
        </div>

        {list.length > 0 ? (
          <div className="list">
            {list.map((item: any) => {
              return (
                <div key={item.coinId} className="list-item" onClick={() => onGo(item)}>
                  <div className="item-top">
                    <div className="top-left">
                      <img className="left-icon" alt="" src={item.webLogo} />
                      <span>{item.shortName}</span>
                      <div className="left-line" />
                      <div className="left-account">
                        <span>
                          {item.productType === productTypeEnum.CURRENT
                            ? t`features/assets/saving/savingList/index-1`
                            : t`features/assets/saving/savingList/index-2`}
                        </span>
                      </div>
                    </div>

                    <Icon name={'next_arrow'} hasTheme className="next-icon" />
                  </div>

                  <div className="item-bottom">
                    <div className="profit-item">
                      <span>{t`trade.c2c.num`}</span>
                      <span className="profit-num">
                        <AssetsEncrypt content={item.holdAmount} />
                      </span>
                    </div>

                    {item.productType === productTypeEnum.CURRENT ? (
                      <div className="profit-item">
                        <span>{t`features/assets/saving/savingList/index-4`}</span>
                        <span className="profit-num">
                          <AssetsEncrypt content={`${item.profitRate}%`} />
                        </span>
                      </div>
                    ) : (
                      <div className="profit-item">
                        <span>{t`features/assets/saving/savingList/index-5`}</span>
                        <span className="profit-num">
                          <AssetsEncrypt content={item.orderNum} />
                        </span>
                      </div>
                    )}

                    <div className="profit-item">
                      <span>
                        {item.productType === productTypeEnum.CURRENT
                          ? t`features/assets/saving/savingList/index-6`
                          : t`features/assets/saving/savingList/index-7`}
                      </span>
                      <span
                        className={
                          info.colors === UserUpsAndDownsColorEnum.greenUpRedDown ? 'profit-total' : 'profit-total-red'
                        }
                      >
                        <AssetsEncrypt content={item.estimateProfit} />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty description={t`trade.c2c.noData`} className={'empty'} />
        )}

        <div>
          <Pagination
            size={'default'}
            current={page.pageNum}
            total={page.totalCount}
            showTotal
            showJumper
            sizeCanChange
            onChange={(pageNumber: number, pageSize: number) => {
              setPage({ ...page, pageNum: pageNumber, pageSize })
            }}
            hideOnSinglePage
          />
        </div>
      </div>
    </div>
  )
}

export { SavingList }
