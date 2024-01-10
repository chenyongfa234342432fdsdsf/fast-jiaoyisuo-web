import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Select, Pagination, Empty, Button, DatePicker, Spin, Form } from '@nbit/arco'
import { getCurrencyList, getRecordList, getRecordDetail } from '@/apis/assets/saving'
import { ICoinInfoListResp } from '@/typings/api/assets/main'
import { getAllCoinList } from '@/helper/assets'
import { useAssetsStore } from '@/store/assets'
import {
  productTypeEnum,
  historyTypeEnum,
  historyTypeList,
  historyStatusEnum,
  historyStatusList,
  getHistoryTypeName,
  getHistoryStatusName,
} from '@/constants/assets/saving'
import { formatDate } from '@/helper/date'

import styles from './index.module.css'

function HistoryList() {
  const assetsStore = useAssetsStore()
  const [loading, setLoading] = useState(false)
  const [coinListData, setCoinListData] = useState<any[]>([]) // 持有币种
  const [tableData, setTableData] = useState<any[]>([]) // 列表数据
  const [page, setPage] = useState<any>({
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
  })
  const [form] = Form.useForm()
  const defaultForm = {
    time: ['', formatDate(new Date().getTime(), 'YYYY-MM-DD')],
    operateType: historyTypeEnum.ALL,
    status: historyStatusEnum.ALL,
    productType: productTypeEnum.ALL,
    coinId: 0,
  }

  /**
   * 获取币种列表
   */
  const onLoadCoinIdList = async () => {
    const res = await getCurrencyList({})
    const { isOk = true, data = [] } = res || {}
    if (isOk) {
      const { coinList } = await getAllCoinList({ type: 1 })
      // const allList: ICoinInfoListResp[] = assetsStore.allCoinInfoList
      let newList: ICoinInfoListResp[] = []
      if (data.length > 0 && coinList && coinList.length > 0) {
        for (let i = 0; i < data.length; i += 1) {
          for (let j = 0; j < coinList.length; j += 1) {
            if (coinList[j].id === data[i]) {
              // newList.push(coinList[j])
              break
            }
          }
        }
      }

      setCoinListData(newList)
    }
  }

  /**
   * 查询理财记录列表数据
   */
  const onLoadList = async () => {
    const formData = form.getFields()
    setLoading(true)
    const params: any = {
      operateType: formData.operateType === historyTypeEnum.ALL ? '' : formData.operateType,
      status: formData.status === historyStatusEnum.ALL ? '' : formData.status,
      productType: formData.productType === productTypeEnum.ALL ? '' : formData.productType,
      coinId: formData.coinId === 0 ? '' : formData.coinId,
      startDate: formData.time.length > 0 && formData.time[0] ? formData.time[0] : '',
      endDate: formData.time.length > 0 && formData.time[1] ? formData.time[1] : '',
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }

    const res: any = await getRecordList({ ...params })
    const { isOk = true, data = [], totalCount = 0 } = res || {}
    if (isOk) {
      setPage({ ...page, totalCount })
      setTableData(data)
    }

    setLoading(false)
  }

  /**
   * 查看理财记录详情
   * @param params
   */
  const onDetails = async (params: any) => {
    const res = await getRecordDetail({ recordId: params.recordId })

    const { isOk = true, data = {} } = res || {}
    if (isOk) {
      //
      // TODO 显示理财记录详情
    }
  }

  const onSubmit = params => {
    form.setFieldsValue({ ...params })
    onLoadList()
  }

  useEffect(() => {
    onLoadList()
  }, [])

  useUpdateEffect(() => {
    onLoadList()
  }, [page.pageNum, page.pageSize])

  useUpdateEffect(() => {
    onLoadCoinIdList()
  }, [assetsStore.allCoinInfoList])

  return (
    <div className={styles.scoped}>
      <Spin loading={loading}>
        <div className="root">
          <Form
            className="form"
            form={form}
            initialValues={defaultForm}
            autoComplete="off"
            layout="inline"
            onSubmit={onSubmit}
          >
            <Form.Item label={t`future.funding-history.funding-rate.column.time`} field="time">
              <DatePicker.RangePicker
                separator={t`features/assets/saving/history-list/index-0`}
                format={'YYYY-MM-DD'}
                mode={'date'}
                clearRangeOnReselect
              />
            </Form.Item>

            <Form.Item label={t`assets.financial-record.search.type`} field="operateType">
              <Select className={`select-item`} bordered={false}>
                {historyTypeList.map(typeItem => {
                  return (
                    <Select.Option value={typeItem.value} key={typeItem.value}>
                      {typeItem.label}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item label={t`assets.financial-record.search.state`} field="status">
              <Select className={`select-item`} bordered={false}>
                {historyStatusList.map(typeItem => {
                  return (
                    <Select.Option value={typeItem.value} key={typeItem.value}>
                      {typeItem.label}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item label={t`features/assets/saving/history-list/index-1`} field="productType">
              <Select className={`select-item`} bordered={false}>
                <Select.Option value={productTypeEnum.ALL}>{t`assets.financial-record.search.all`}</Select.Option>
                <Select.Option
                  value={productTypeEnum.CURRENT}
                >{t`features/assets/saving/history-list/index-2`}</Select.Option>
                <Select.Option
                  value={productTypeEnum.REGULAR}
                >{t`features/assets/saving/history-list/index-3`}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label={t`assets.financial-record.search.coin`} field="coinId">
              <Select className={`select-item`} bordered={false}>
                <Select.Option value={0}>{t`assets.financial-record.search.all`}</Select.Option>
                {coinListData.map((coinItem: any) => {
                  return (
                    <Select.Option value={coinItem.coinId} key={coinItem.coinId}>
                      {coinItem.shortName}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Button
              type="outline"
              className={'search-btn'}
              htmlType="submit"
            >{t`assets.financial-record.search.search`}</Button>
            <Button
              type="outline"
              className={['search-btn', ' reset-btn']}
              onClick={() => {
                form.resetFields()
                onLoadList()
              }}
            >{t`assets.financial-record.search.reset`}</Button>
          </Form>

          {tableData.length > 0 ? (
            <div className="list">
              {tableData.map((item: any) => {
                return (
                  <div key={item.recordId} className="list-item" onClick={() => onDetails(item)}>
                    <div className="item-status">{getHistoryStatusName(item.status)}</div>
                    <div className="item-top">
                      {t`assets.financial-record.creationTime`}: {item.createdTime}
                    </div>

                    <div className="item-content">
                      <div className="content-left">
                        <div className="content-item">
                          <span className="content-item-key">{t`assets.financial-record.search.type`}</span>
                          <span>{getHistoryTypeName(item.operateType)}</span>
                        </div>

                        <div className="content-item">
                          <span className="content-item-key">{t`assets.financial-record.search.coin`}</span>
                          <span>{item.shortName}</span>
                        </div>
                      </div>

                      <div className="content-right">
                        <div className="content-left">
                          <div className="content-item">
                            <span className="content-item-key">{t`features/assets/saving/history-list/index-1`}</span>
                            <span>
                              {item.productType === productTypeEnum.CURRENT
                                ? t`features/assets/saving/savingList/index-1`
                                : t`features/assets/saving/savingList/index-2`}
                            </span>
                          </div>

                          <div className="content-item">
                            <span className="content-item-key">{t`trade.c2c.num`}</span>
                            <span>{item.amount}</span>
                          </div>
                        </div>
                        <Icon name="next_arrow" hasTheme className="next-icon" />
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
      </Spin>
    </div>
  )
}

export { HistoryList }
