import { queryFundingPriceHistory, queryIndexIngredientList } from '@/apis/future/funding-history'
import Icon from '@/components/icon'
import {
  FundingHistoryIndexPriceTypeEnum,
  getFundingHistoryIndexPriceTypeEnumName,
} from '@/constants/future/funding-history'
import { IFuture } from '@/typings/api/future/common'
import {
  IIndexPriceHistoryReq,
  IIndexIngredientReq,
  IIndexPrice,
  IIndexIngredient,
} from '@/typings/api/future/funding-history'
import { TableColumnProps } from '@nbit/arco'
import Table from '@/components/table'
import { t } from '@lingui/macro'
import { useCreation, useMount, useRequest } from 'ahooks'
import dayjs from 'dayjs'
import { FC, useEffect } from 'react'
import { useTablePagination } from '@/hooks/use-table-pagination'
import { baseLayoutStore } from '@/store/layout'
import commonStyles from '../common.module.css'

function getPriceListTableColumns(
  type: FundingHistoryIndexPriceTypeEnum,
  symbolName: string
): TableColumnProps<IIndexPrice>[] {
  return [
    {
      title: t`future.funding-history.index-price.column.time`,
      render: (_, item) => {
        return dayjs(item.timeIndex).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: getFundingHistoryIndexPriceTypeEnumName(type),
      align: 'right',
      render: (_, item) => {
        return `${type === FundingHistoryIndexPriceTypeEnum.index ? item.indexPrice : item.markPrice} ${symbolName}`
      },
    },
  ]
}

export const PriceListTable: FC<{
  selectedFuture: IFuture
  type: FundingHistoryIndexPriceTypeEnum
  // eslint-disable-next-line react/function-component-definition
}> = ({ selectedFuture, type }) => {
  const columns = getPriceListTableColumns(type, selectedFuture?.quoteSymbolName)
  const params: IIndexPriceHistoryReq = useCreation(() => {
    return {
      tradePairId: selectedFuture?.id,
      type,
    }
  }, [selectedFuture, type])
  const { tablePaginationProps, data, loading } = useTablePagination({
    search: async searchParams => {
      if (!params.tradePairId) {
        return
      }
      return queryFundingPriceHistory(searchParams) as any
    },
    defaultPageSize: 20,
    params,
  })
  return (
    <div className={commonStyles['table-wrapper']}>
      <Table
        border={false}
        rowKey={i => i.timeIndex}
        columns={columns}
        pagination={tablePaginationProps}
        data={data}
        loading={loading}
      />
    </div>
  )
}
function getIngredientListTableColumns(): TableColumnProps<IIndexIngredient>[] {
  return [
    {
      title: t`future.funding-history.index-price.ingredient.column.exchange`,
      render: (_, item) => {
        return item.webName
      },
    },
    {
      title: t`future.funding-history.index-price.ingredient.column.pair`,
      align: 'right',
      render: (_, item) => {
        return item.symbol
      },
    },
  ]
}
export const IngredientTable: FC<{
  selectedFuture: IFuture
  // eslint-disable-next-line react/no-unused-prop-types
  type: FundingHistoryIndexPriceTypeEnum
  // eslint-disable-next-line react/function-component-definition
}> = ({ selectedFuture }) => {
  const columns = getIngredientListTableColumns()
  const params: IIndexIngredientReq = useCreation(() => {
    return {
      tradePairId: selectedFuture?.id,
    }
  }, [selectedFuture?.id])
  const { run, data, loading } = useRequest(
    async () => {
      if (!params.tradePairId) {
        return []
      }
      const res = await queryIndexIngredientList(params)
      return res.data || []
    },
    {
      manual: true,
    }
  )
  const { tablePaginationProps } = useTablePagination({
    defaultPageSize: 100,
    params,
    propData: data,
  })
  useEffect(run, [params])
  const { headerData } = baseLayoutStore.getState()
  const tips = [
    t`future.funding-history.index-ingredient.tips.1`,
    t({
      id: 'future.funding-history.index-ingredient.tips.2',
      values: {
        0: headerData?.businessName,
      },
    }),
  ]
  return (
    <div className={commonStyles['table-wrapper']}>
      <Table
        border={false}
        rowKey={i => i.symbol}
        pagination={tablePaginationProps}
        columns={columns}
        data={data}
        loading={loading}
      />
      <div className="mt-4">
        {tips.map(tip => {
          return (
            <div key={tip} className="mb-2 last:mb-0 text-xs text-text_color_03">
              <Icon name="prompt-symbol" className="mr-2" />
              <span>{tip}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
