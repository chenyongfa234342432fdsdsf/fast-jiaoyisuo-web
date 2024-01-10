import { memo, ReactNode, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Button, Input, Tooltip } from '@nbit/arco'

import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import cn from 'classnames'
import { fetchC2CBalanceList } from '@/apis/c2c/center'
import { C2CUserBalanceListResp } from '@/typings/api/c2c/center'
import { rateFilter } from '@/helper/assets'
import { link } from '@/helper/link'
import { getRecordsList } from '@/apis/assets/financial-record'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsStore } from '@/store/assets'
import { formatDate } from '@/helper/date'
import { decimalUtils } from '@nbit/utils'
import { useMount } from 'ahooks'
import C2CEmpty from '../no-data'

import styles from './ad-account.module.css'
import Transfer from '../transfer'

type C2CAssetListType = {
  text: string
  money: string | ReactNode
  date: string
}

const SafeCalcUtil = decimalUtils.SafeCalcUtil
function AdAccount() {
  const { assetsEnums, fetchAssetEnums } = useAssetsStore()

  useMount(fetchAssetEnums)

  const [lists, setLists] = useState<C2CUserBalanceListResp[]>([]) // list 列表
  const [value, setValue] = useState<C2CUserBalanceListResp[]>([])
  const [c2cAssetLists, setC2CAssetLists] = useState<C2CAssetListType[]>([])

  const [visible, setVisible] = useState<boolean>(false)

  /** c2c 余额列表 */
  const c2cBalanceList = async () => {
    const res = await fetchC2CBalanceList({})

    if (res.isOk) {
      setLists(res.data || [])
      setValue(res.data || [])
    }
  }

  /** 获取财务记录列表 */
  const fetchRecordsList = async () => {
    const res = await getRecordsList({ logType: 9, pageNum: 1, pageSize: 6 })

    if (res.isOk) {
      const result = (res.data || { list: [] }).list.map(
        l =>
          ({
            text: l.type,
            money: `${l.total} ${l.businessCoin}`,
            date: formatDate(l.createdByTime),
          } as C2CAssetListType)
      )

      setC2CAssetLists(result)
    }
  }

  /**
   * c2c 划转成功以后回调
   */
  const c2cBalanceTransfer = async () => {
    c2cBalanceList()
    fetchRecordsList()
  }

  useEffect(() => {
    c2cBalanceList()
    fetchRecordsList()
  }, [])

  /**
   * c2c 账户 左侧 Table
   * @param key
   * @param img 图标
   * @param name USDT
   * @param subName Tether
   * @param totalBalance 总金额
   * @param balance 可用数量
   * @param money 转换金额
   * @param freezeBalance 冻结资产数
   * @param merchantFreezeBalance 商户冻结资产数
   * @returns
   */
  const getTableItem = (
    key,
    img,
    name,
    subName,
    totalBalance,
    balance,
    money,
    freezeBalance,
    merchantFreezeBalance
  ) => (
    <div key={key} className="table-item">
      <div className="table-item-left">
        <div className="icon">
          <LazyImage src={img} />
        </div>
        <div className="text-box">
          <div className="text">{name}</div>
          <div className="sub-text">{subName}</div>
        </div>
      </div>
      <Tooltip
        content={
          <div>
            <div>
              {t`features_c2c_center_ad_account_index_7pxobk9-ye4x9h7smh8cu`}
              {balance}
            </div>
            <div>
              {t`features_c2c_center_ad_account_index_abyidbuinxuxamcqcua4s`}
              {Number(SafeCalcUtil.add(freezeBalance, merchantFreezeBalance))}
            </div>
          </div>
        }
      >
        <div className="table-item-center">
          <div className="center-text">{totalBalance}</div>
          <div className="center-sub-text">USD {money}</div>
        </div>
      </Tooltip>
      <div className="table-item-right">
        <span onClick={() => setVisible(true)}>{t`features/assets/main/index-4`}</span>
      </div>
    </div>
  )

  /** 财务记录列表 item */
  const getLogItem = (key, data: C2CAssetListType) => {
    const { text, date, money } = data

    return (
      <div key={key} className="log-item">
        <div className="log-item-left">
          <div className="log-item-text">{text}</div>
          <div className="log-item-sub-text">{date}</div>
        </div>
        <div
          className={cn('log-item-right', {
            red: (money as string).includes('-'),
            green: !(money as string).includes('-'),
          })}
        >
          {money}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.scope}>
      <div className="ad-account-container">
        {lists.length !== 0 && (
          <div className="panel">
            {/* 左侧 c2c 余额列表 */}
            <div className="left">
              <div className="h-box">
                <div className="search-box">
                  <Input
                    className="search"
                    placeholder={t`assets.deposit.searchCoin`}
                    onChange={e => {
                      if (!e) {
                        setValue(lists)
                        return
                      }
                      setValue(
                        lists.filter(({ symbol = '' }) => (symbol ?? '').toUpperCase().includes(e.toUpperCase()))
                      )
                    }}
                    prefix={<Icon name="search" hasTheme className="select-icon" />}
                  />
                </div>
              </div>
              <div className="table">
                <div className="thead">
                  <div>{t`features_c2c_center_ad_account_index_galjwp2npe4y-lfse1z0r`}</div>
                  <div>{t`assets.index.overview.menuName`}</div>
                  <div>{t`order.columns.action`}</div>
                </div>
                <div className="tbody">
                  {value
                    .filter(item => item.balance || item.freezeBalance || item.merchantFreezeBalance)
                    .map((item, index) =>
                      getTableItem(
                        index,
                        item.webLogo,
                        item.coinName,
                        item.coinFullName,
                        Number(
                          SafeCalcUtil.add(item.balance || '0', item.freezeBalance || '0').add(
                            item.merchantFreezeBalance || '0'
                          )
                        ),
                        item.balance,
                        // rateFilter({ symbol: item.symbol, amount: item.balance || 0 }), // 前端转换 现在用 后端转换
                        item.usdBalance,
                        item.freezeBalance,
                        item.merchantFreezeBalance
                      )
                    )}

                  {!value.filter(item => item.balance || item.freezeBalance || item.merchantFreezeBalance).length && (
                    <div className="no-data mt-8">
                      <C2CEmpty
                        imageName="no_search"
                        text={`C2C ${t`features_c2c_center_ad_account_index_rbbiqnvunh043q0gxpdft`}`}
                      />
                      <Button className="btn" type="primary" onClick={() => setVisible(true)}>
                        {t`features_c2c_center_ad_account_index_o4qvgcubpci0fvobmemto`}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* 右侧财务记录的 table */}
            <div className="right">
              <div className="logs">
                <div className="logs-header">
                  <div className="logs-header-left">{t`assets.deposit.financialRecord`}</div>
                  {c2cAssetLists.length > 5 && (
                    <div className="logs-header-right" onClick={() => link('/assets/financial-record?type=9')}>
                      {t`features/trade/trade-order/index-0`}
                      <Icon name="next_arrow_hover" className="icon" />
                    </div>
                  )}
                </div>
                <div className="logs-body">
                  {c2cAssetLists.map(({ text, ...rest }, index) =>
                    getLogItem(index, {
                      ...rest,
                      text: getTextFromStoreEnums(text, assetsEnums.financialRecordTypeEnum.enums),
                    })
                  )}{' '}
                  {!c2cAssetLists.length && (
                    <div className="no-data">
                      <C2CEmpty
                        imageName="icon_default_no_search"
                        text={t`features_c2c_center_coin_select_search_index_sjh06hnifczlz6ix00rtq`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {!lists.length && (
          <div className="no-data">
            <C2CEmpty
              imageName="icon_default_no_search"
              text={`C2C ${t`features_c2c_center_ad_account_index_rbbiqnvunh043q0gxpdft`}`}
            />
            <Button className="btn" type="primary" onClick={() => setVisible(true)}>
              {t`features_c2c_center_ad_account_index_o4qvgcubpci0fvobmemto`}
            </Button>
          </div>
        )}
      </div>

      <Transfer visible={visible} setVisible={setVisible} onSubmit={() => c2cBalanceTransfer()} />
    </div>
  )
}

export default memo(AdAccount)
