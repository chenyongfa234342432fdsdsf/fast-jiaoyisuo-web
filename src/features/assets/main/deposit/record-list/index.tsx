/**
 * 充提 - 财务记录
 */
/**
 * 合约组历史记录 - 保证金记录&合约组记录
 */
import {
  FinancialRecordLogTypeEnum,
  FinancialRecordTypeEnum,
  FinancialRecordListFromPage,
  SpotHistoryTabEnum,
} from '@/constants/assets'
import { Message, Spin } from '@nbit/arco'
import AssetsTabs from '@/features/assets/common/assets-tabs'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { RecordsListResp, AssetsRecordsListReq, AllCoinListResp } from '@/typings/api/assets/assets'
import { getRecordsList } from '@/apis/assets/financial-record'
import { useAssetsStore } from '@/store/assets'
import { useMount } from 'ahooks'
import { RecordList } from '@/features/assets/financial-record/record-list'
import Link from '@/components/link'
import { getAssetsHistoryPageRoutePath } from '@/helper/route/assets'
import styles from './index.module.css'

export function SpotHistoryRecord({ coinInfo, type }: { coinInfo?: AllCoinListResp; type: FinancialRecordTypeEnum }) {
  // 资产数据字典
  const { fetchAssetEnums } = useAssetsStore()
  useMount(fetchAssetEnums)
  const { updateFinancialRecordListLoading, financialRecordListLoading } = useAssetsStore()
  let allRecordTitle =
    type === FinancialRecordTypeEnum.deposit
      ? t`features_assets_main_deposit_record_list_index_rz1cckn7qc`
      : t`features_assets_main_deposit_record_list_index_p67f3d9abq`
  const [tabType, setTabType] = useState(SpotHistoryTabEnum.all)
  const [tabList, setTabList] = useState([
    {
      title: allRecordTitle,
      id: SpotHistoryTabEnum.all,
    },
  ])
  // 仅展示前 20 条记录
  const page = {
    pageNum: 1,
    pageSize: 20,
  }

  const searchType =
    type === FinancialRecordTypeEnum.deposit
      ? [FinancialRecordTypeEnum.deposit, FinancialRecordTypeEnum.pay]
      : [FinancialRecordTypeEnum.withdraw, FinancialRecordTypeEnum.pay]
  /** 默认搜索条件 */
  let paramsActiveObj: AssetsRecordsListReq = {
    /** 充提类型，1. 充币，2. 提币 ,3 pay , 4. 冲正 */
    type: searchType,
    /** 状态 */
    status: undefined,
    /** 财务类型：总览时不传，1，现货，2、充提、3、借还款、4、合约、5、手续费、6、衍生品、7、其他 */
    logType: FinancialRecordLogTypeEnum.main,
    pageNum: page.pageNum,
    pageSize: page.pageSize,
    /** 0 或者 1，返回的数据金额是否大于 0，充值页面过滤用 1，返回金额小于 0 传 0，不需要过滤不传该参数 */
    isGt: type === FinancialRecordTypeEnum.deposit ? 1 : 0,
  }

  const [tableData, setTableData] = useState<RecordsListResp[]>([])

  // 获取列表信息
  const getRecordListData = async (_type?: string) => {
    updateFinancialRecordListLoading(true)
    try {
      if (_type === SpotHistoryTabEnum.currentCoin && coinInfo?.id) {
        paramsActiveObj.coinId = coinInfo?.id
      }
      const res = await getRecordsList(paramsActiveObj)
      const { isOk, data: { list = [] } = {} } = res || {}
      if (!isOk) {
        updateFinancialRecordListLoading(false)
        return
      }

      setTableData(list)
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    } finally {
      updateFinancialRecordListLoading(false)
    }
  }

  /** tab 切换事件 */
  const onChangeLogsType = async _type => {
    setTabType(_type)
    getRecordListData(_type)
  }

  useEffect(() => {
    getRecordListData(tabType)
  }, [coinInfo?.id])

  useEffect(() => {
    if (coinInfo?.id) {
      setTabList([
        {
          title: allRecordTitle,
          id: SpotHistoryTabEnum.all,
        },
        {
          title: t({
            id:
              type === FinancialRecordTypeEnum.deposit
                ? 'features_assets_main_deposit_record_list_index_5mslkhdzfc'
                : `features_assets_main_deposit_record_list_index_rkcszkxim_`,
            values: { 0: coinInfo.coinName },
          }),
          id: SpotHistoryTabEnum.currentCoin,
        },
      ])
    }
  }, [coinInfo?.id])

  return (
    <div className={styles.scoped}>
      <div className="tabs-wrap">
        <AssetsTabs tabList={tabList} value={tabType} onChange={onChangeLogsType} />
        <Link
          href={getAssetsHistoryPageRoutePath(
            FinancialRecordLogTypeEnum.main,
            undefined,
            undefined,
            tabType === SpotHistoryTabEnum.currentCoin ? coinInfo?.id : '',
            coinInfo?.coinName
          )}
          className="link"
        >
          {t`features_assets_main_deposit_record_list_index_q4kmnikwbx`}
        </Link>
      </div>
      <Spin loading={financialRecordListLoading}>
        <div className="mt-6">
          <RecordList
            tabType={FinancialRecordLogTypeEnum.main}
            totalCount={20}
            tableData={tableData}
            page={page}
            setPage={() => {}}
            loading={financialRecordListLoading}
            fromPage={FinancialRecordListFromPage.other}
            columns={{
              type: true,
              businessCoin: tabType !== SpotHistoryTabEnum.currentCoin,
            }}
          />
        </div>
      </Spin>
    </div>
  )
}
