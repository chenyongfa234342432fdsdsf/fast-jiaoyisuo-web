import { MarkcoinResponse } from '@/plugins/request'
import { PaginationProps } from '@nbit/arco'
import { useRequest, useUpdateEffect } from 'ahooks'
import { useEffect, useState } from 'react'

type IUseTablePaginationParams = {
  search?: (params: any) => Promise<
    | void
    | undefined
    | MarkcoinResponse<{
        list?: any[]
        total?: number
      }>
  >
  params?: any
  propData?: any[]
  formatData?: (data: any[]) => any[]
  defaultPageSize?: number
}

export function useTablePagination({
  search,
  params,
  defaultPageSize = 10,
  formatData,
  propData,
}: IUseTablePaginationParams) {
  const [data, setData] = useState([] as any[])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [total, setTotal] = useState(0)
  const onPaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const { run: runSearch, loading } = useRequest(
    async () => {
      if (!search || propData) {
        return
      }
      const res = await search({
        pageNum: page,
        pageSize,
        ...(params || {}),
      })
      if (!res || !res.isOk || !res.data) {
        return
      }
      setData(formatData ? formatData(res.data.list!) : res.data.list!)
      setTotal(res.data.total || 0)
    },
    { manual: true, debounceWait: 300 }
  )
  useEffect(() => {
    runSearch()
  }, [page])

  const refresh = () => {
    if (page === 1) {
      runSearch()
    } else {
      setPage(1)
    }
  }
  useUpdateEffect(() => {
    refresh()
  }, [pageSize, params])

  const tablePaginationProps: PaginationProps = {
    current: page,
    showJumper: true,
    showTotal: true,
    sizeCanChange: true,
    size: 'small',
    bufferSize: 1,
    onChange: onPaginationChange,
    total: propData ? propData.length : total,
    pageSize,
    hideOnSinglePage: pageSize <= defaultPageSize,
  }

  return {
    data: propData || data,
    page,
    pageSize,
    total,
    loading,
    runSearch,
    tablePaginationProps,
    refresh,
  }
}
