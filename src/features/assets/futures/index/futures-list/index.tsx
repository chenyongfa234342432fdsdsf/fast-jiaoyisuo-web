import { t } from '@lingui/macro'
import { useState } from 'react'
import { Button, TableColumnProps, Empty, Message } from '@nbit/arco'
import { link } from '@/helper/link'
import AssetsTable from '@/features/assets/common/assets-table'
import ListEmpty from '@/components/list-empty'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import MergeGroupModal from '@/features/assets/futures/common/merge-group-modal'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { formatCurrency } from '@/helper/decimal'
import { FuturesList as FuturesListResp } from '@/typings/api/assets/futures'
import { postGroupExistEntrustOrder } from '@/apis/assets/futures/common'
import ExitGroupEntrustModal from '@/features/assets/futures/common/exist-group-entrust-modal'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useLockFn } from 'ahooks'
import { getFuturesDetailPageRoutePath } from '@/helper/route/assets'
import styles from './index.module.css'

interface IFuturesListProps {
  loading?: boolean
  assetsListData: FuturesListResp[] | undefined
  onSuccess?: (val: any) => void
}
function FuturesList(props: IFuturesListProps) {
  const { loading, assetsListData, onSuccess } = props
  const [selectedGroup, setSelectedGroup] = useState<FuturesListResp>()
  const [visibleMergeGroupModal, setVisibleMergeGroupModal] = useState(false)
  /** 仓位是否存在当前委托订单 */
  const [visibleExitEntrustOrderPrompt, setVisibleExitEntrustOrderPrompt] = useState(false)
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { offset },
  } = {
    ...assetsFuturesStore,
  }

  /**
   * 校验当前合约组是否存在委托订单
   */
  const onCheckGroupEntrustOrder = async groupId => {
    if (!groupId) {
      return false
    }
    const res = await postGroupExistEntrustOrder({ groupId })
    const { isOk, data, message = '' } = res || {}

    if (isOk) {
      if (data?.lock) {
        Message.warning(t`features_assets_futures_common_merge_group_modal_index_5101528`)
        return false
      }

      if (data?.exist) {
        setVisibleExitEntrustOrderPrompt(true)
        return false
      }
      return true
    }
    return false
  }

  /**
   * 一键合并
   */
  const onOpenMergeGroup = useLockFn(async (event, data: FuturesListResp) => {
    event.stopPropagation()
    setSelectedGroup(data)
    if (!(await onCheckGroupEntrustOrder(data.groupId))) {
      return false
    }
    setVisibleMergeGroupModal(true)
  })

  /** 一键合并提交按钮 */
  const onMergeGroupSubmit = isSuccess => {
    setVisibleMergeGroupModal(false)
    if (isSuccess) {
      onSuccess && onSuccess(isSuccess)
    }
  }
  const cellStyle: any = {
    headerCellStyle: {
      textAlign: 'right',
    },
    bodyCellStyle: {
      textAlign: 'right',
    },
  }
  const columns: TableColumnProps[] = [
    {
      title: t`constants/order-4`,
      dataIndex: 'groupName',
      sorter: false,
      // width: 120,
    },
    {
      title: t`features/orders/order-columns/holding-6`,
      dataIndex: 'unrealizedProfit',
      sorter: true,
      ...cellStyle,
      render: (col, record) => (
        <AssetsEncrypt
          content={
            <>
              <IncreaseTag
                value={record.unrealizedProfit}
                delZero={false}
                kSign
                hasPrefix
                digits={offset}
                isRound={false}
              />
              <span className="ml-2">{record.baseCoin}</span>
            </>
          }
        />
      ),
    },
    {
      title: t`features_assets_futures_index_futures_list_index_hqr-fsvktjorznca7igrg`,
      sorter: true,
      ...cellStyle,
      dataIndex: 'groupTotalAsset',
      render: (col, record) => (
        <AssetsEncrypt
          content={
            <>
              {formatCurrency(record.groupTotalAsset, offset)}
              <span className="ml-2">{record.baseCoin}</span>
            </>
          }
        />
      ),
    },
    {
      title: t`assets.common.position_assets_new`,
      sorter: true,
      ...cellStyle,
      dataIndex: 'positionCoinAsset',
      render: (col, record) => (
        <AssetsEncrypt
          content={
            <>
              {formatCurrency(record.positionCoinAsset, offset)}
              <span className="ml-2">{record.baseCoin}</span>
            </>
          }
        />
      ),
    },
    {
      title: t`features_assets_futures_index_futures_list_index_0k9dnxoraus5qnbhh5qr5`,
      sorter: true,
      ...cellStyle,
      dataIndex: 'marginAvailable',
      render: (col, record) => (
        <AssetsEncrypt
          content={
            <>
              {formatCurrency(record.marginAvailable, offset)}
              <span className="ml-2">{record.baseCoin}</span>
            </>
          }
        />
      ),
    },
    {
      title: t`features_assets_futures_index_total_assets_index_wadnkn6hxo3kzwjzjkahr`,
      sorter: true,
      ...cellStyle,
      dataIndex: 'lockCoinAsset',
      render: (col, record) => (
        <AssetsEncrypt
          content={
            <div>
              {isNaN(record.lockCoinAsset) ? (
                '--'
              ) : (
                <div>
                  {formatCurrency(record.lockCoinAsset, offset)} <span className="ml-2">{record.baseCoin}</span>
                </div>
              )}
            </div>
          }
        />
      ),
    },
    {
      title: '',
      sorter: false,
      ...cellStyle,
      render: (col, record) => (
        <div className="opt-item">
          {assetsListData && assetsListData.length > 1 && (
            <Button
              type="secondary"
              onClick={event => {
                onOpenMergeGroup(event, record)
              }}
            >
              {t`features_assets_futures_index_futures_list_index_5101354`}
            </Button>
          )}
          <Icon hasTheme name="next_arrow" className="text-base" />
        </div>
      ),
    },
  ]
  return (
    <div className={styles.scoped}>
      <div className="futures-list-root">
        <AssetsTable
          // loading={loading}
          rowKey={record => `${record.groupId}`}
          columns={columns}
          data={assetsListData}
          border={false}
          pagination={false}
          noDataElement={<ListEmpty loading={loading} />}
          scroll={{
            y: 480,
          }}
          sortable
          onRow={record => {
            return {
              onClick: () => {
                link(getFuturesDetailPageRoutePath(record.groupId))
              },
            }
          }}
        />

        {visibleMergeGroupModal && selectedGroup && (
          <MergeGroupModal
            visible={visibleMergeGroupModal}
            setVisible={setVisibleMergeGroupModal}
            groupId={selectedGroup.groupId}
            onCommit={onMergeGroupSubmit}
          />
        )}

        {/* 合约组是否存在委托订单 */}
        {visibleExitEntrustOrderPrompt && selectedGroup && (
          <ExitGroupEntrustModal
            groupId={selectedGroup.groupId}
            visible={visibleExitEntrustOrderPrompt}
            setVisible={setVisibleExitEntrustOrderPrompt}
          />
        )}
      </div>
    </div>
  )
}

export { FuturesList }
