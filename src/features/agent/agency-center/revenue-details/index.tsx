import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { DatePicker, TableColumnProps, InputNumber, Form, Button, Space, Spin } from '@nbit/arco'
import Table from '@/components/table'
import UserPopUp from '@/features/user/components/popup'
import { t } from '@lingui/macro'
import Tabs from '@/components/tabs'
import { postQueryIncomeDetails, getIncomeHistoryExcelUrl } from '@/apis/agent/agency-center'
import { getCodeDetailList } from '@/apis/common'
import { IncomeDetailsType, AgencyCenterQueryIncomeDetailsReq } from '@/typings/api/agent/agency-center'
import { useCommonStore } from '@/store/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { DownloadFiles, HandleDisableStartAndEndDate } from '@/features/user/utils/common'
import {
  IsEmptyValidate,
  ThanSizeValidate,
  TwoDecimalPlaces,
  DateThanSizeValidate,
} from '@/features/user/utils/validate'
import { AgentInviteQueryMaxResp } from '@/typings/api/agent/manage'
import { MinAndMaxTypeEnum } from '@/constants/user'
import dayjs from 'dayjs'
import Icon from '@/components/icon'
import styles from '../index.module.css'

const FormItem = Form.Item

interface detailsTabType {
  title: string
  id: string
}

type settlementObejectType = {
  [key: string]: string
}

type stateType = AgencyCenterQueryIncomeDetailsReq & {
  total?: number
}

export enum ProductCdEnum {
  all = '',
  spot = '1', // 现货
  contract = '2', // 合约
  borrow = '3', // 借币利息
}

function AgencyCenterRevenueDetails({ rebateCanbeSetData }: { rebateCanbeSetData: AgentInviteQueryMaxResp }) {
  const [revenueDetailsTableMethod, setRevenueDetailsTableMethod] = useState<string>(ProductCdEnum.all)
  const [revenueDetailsPopUpMethod, setRevenueDetailsPopUpMethod] = useState<string>(ProductCdEnum.all)
  const [incomeData, setIncomeData] = useState<Array<IncomeDetailsType>>([])
  const [incomeFilterShow, setIncomeFilterShow] = useState<boolean>(false)
  const [frenchCurrency, setFrenchCurrency] = useState<string>('')
  const [detailTabList, setDetailTabList] = useState<Array<detailsTabType>>([])
  const [settlementTypeList, setSettlementTypeList] = useState<settlementObejectType>({})

  const startTime = dayjs().subtract(3, 'month').valueOf()
  const endTime = dayjs().endOf('date').valueOf()

  const defaultStateData = {
    startTime, // 前 3 个月
    endTime, // 默认今天
    page: 1,
    pageSize: 10,
  }

  const state = useRef<stateType>(defaultStateData)

  const [form] = Form.useForm()
  const minAmountWatch = Form.useWatch('minAmount', form)
  const maxAmountWatch = Form.useWatch('maxAmount', form)
  const startTimeWatch = Form.useWatch('startTime', form)
  const endTimeWatch = Form.useWatch('endTime', form)
  const { locale } = useCommonStore()

  const incomeColumns: TableColumnProps[] = [
    {
      title: t`features_agent_agency_center_revenue_details_index_5101518`,
      dataIndex: 'productCd',
      render: (_, record) => {
        return <label>{record.productCd ? settlementTypeList[record.productCd] : '-'}</label>
      },
    },
    {
      title: t`features_agent_agency_center_revenue_details_index_5101520`,
      dataIndex: 'createdByTime',
      align: 'right',
      sorter: (a, b) => dayjs(a.createdByTime).valueOf() - dayjs(b.createdByTime).valueOf(),
      render: (_, record) => {
        return <label>{dayjs(record.createdByTime).format('YYYY-MM-DD HH:mm:ss')}</label>
      },
    },
    {
      title: t`features_agent_agency_center_revenue_details_index_5101521`,
      dataIndex: 'settlementCur',
      align: 'right',
    },
    {
      title: t`features_agent_agency_center_revenue_details_index_5101522`,
      dataIndex: 'settlementCurIncome',
      align: 'right',
      sorter: (a, b) => Number(a.settlementCurIncome) - Number(b.settlementCurIncome),
    },
    {
      title: `${t`features_agent_agency_center_revenue_details_index_5101523`}${
        frenchCurrency ? `(${frenchCurrency})` : ''
      }`,
      width: 300,
      dataIndex: 'legalCurIncome',
      align: 'right',
      sorter: (a, b) => Number(a.legalCurIncome) - Number(b.legalCurIncome),
    },
  ]

  /** 重置弹窗 */
  const handlePopUpReset = () => {
    setRevenueDetailsPopUpMethod(ProductCdEnum.all)
    form.resetFields()
  }

  /** 获取字典数据 */
  const getCodeList = async () => {
    const res = await getCodeDetailList({ lanType: locale, codeVal: 'agent_product_cd' })
    if (res.isOk) {
      const list: Array<detailsTabType> = [{ title: t`common.all`, id: ProductCdEnum.all }]
      const type: settlementObejectType = {}
      const cachelist = (res.data as Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>) || []

      let rebateList: Array<string> = []
      rebateCanbeSetData?.scaleList?.forEach(v => {
        v.productCd && rebateList.push(v.productCd)
      })

      cachelist.forEach(v => {
        if (rebateList.includes(v.codeVal)) {
          list.push({ title: v.codeKey, id: v.codeVal })
          type[v.codeVal] = v.codeKey
        }
      })

      setDetailTabList(list)
      setSettlementTypeList(type)
    }
  }

  /** 获取收益数据 */
  const queryIncomeDetails = async (isPopUpSubmit?: boolean) => {
    const res = await postQueryIncomeDetails(state.current)
    if (res.isOk) {
      const list = (res.data?.incomeDetails?.list as Array<IncomeDetailsType>) || []
      state.current = { ...state.current, total: res.data?.incomeDetails?.total }
      list.forEach((v, index) => (v.key = `${v.productCd}${index}`))
      setFrenchCurrency(res.data?.legalCur as string)
      setIncomeData(list)
      setIncomeFilterShow(false)

      isPopUpSubmit && setRevenueDetailsTableMethod(state.current.productCd || ProductCdEnum.all)
    }
  }

  /** 下载 Excel */
  const getIncomeExcelUrl = async () => {
    const res = await getIncomeHistoryExcelUrl({})
    if (res.isOk && res.data) {
      DownloadFiles(res.data)
    }
  }

  const { run: getIncomeDetails, loading } = useRequest(queryIncomeDetails, { manual: true })
  const { run: dowloadExcel, loading: exportLoading } = useRequest(getIncomeExcelUrl, { manual: true })

  const getAllData = async () => {
    await Promise.all([getIncomeDetails(), getCodeList()])
  }

  useEffect(() => {
    rebateCanbeSetData && getAllData()
  }, [rebateCanbeSetData])

  /** 处理 tab 切换 */
  const handleTabChange = (value: detailsTabType) => {
    state.current = {
      ...state.current,
      productCd: value.id,
    }

    setRevenueDetailsTableMethod(value.id)
    setRevenueDetailsPopUpMethod(value.id)
    getIncomeDetails()
  }

  /** 处理分页 */
  const handlePaginationOnChange = (page: number, pageSize: number) => {
    state.current = { ...state.current, page, pageSize }
    getIncomeDetails()
  }

  /** 设置时间组件禁用时间 */
  const setDisableDate = (currentDate: dayjs.Dayjs) => HandleDisableStartAndEndDate(currentDate, startTime, endTime)

  /** popup 表单提交 */
  const handleSubmit = (values: AgencyCenterQueryIncomeDetailsReq) => {
    const submitStartTime = values.startTime ? dayjs(values.startTime).startOf('date').valueOf() : startTime
    const submitEndTime = values.endTime ? dayjs(values.endTime).endOf('date').valueOf() : endTime

    const options = {
      startTime: submitStartTime,
      endTime: submitEndTime,
      minAmount: values.minAmount,
      maxAmount: values.maxAmount,
      productCd: revenueDetailsPopUpMethod,
      page: 1,
      pageSize: 10,
    }

    state.current = { ...options }
    getIncomeDetails(true)
  }
  return (
    <>
      <div className="title" id="revenue-details">
        <Icon name="rebates_profit" />
        <label>{t`features_agent_agency_center_index_5101511`}</label>
      </div>

      <div className="container">
        <div className="container-tabs">
          <div className="tabs-wrap">
            <Tabs
              mode="button"
              classNames="user-customize-tabs-button"
              value={revenueDetailsTableMethod}
              tabList={detailTabList}
              onChange={handleTabChange}
            />
          </div>
          <div className="icon" onClick={() => setIncomeFilterShow(true)}>
            <Icon name="asset_record_filter" hasTheme hover onClick={() => setIncomeFilterShow(true)} />
          </div>
        </div>

        <Table
          columns={incomeColumns}
          data={incomeData}
          rowKey="key"
          border={false}
          style={{ height: 260 }}
          scroll={{
            y: 223,
          }}
          placeholder="-"
          pagination={
            state.current.total && state.current.total >= 10
              ? {
                  current: state.current.page,
                  total: state.current.total,
                  pageSize: state.current.pageSize,
                  onChange: handlePaginationOnChange,
                }
              : false
          }
        />

        <div className="export">
          <div className="tips">
            <label>{t`features_agent_agency_center_revenue_details_index_5101524`}</label>
          </div>
          <div className="export-btn">
            {exportLoading ? (
              <Spin dot />
            ) : (
              <div className="btn" onClick={dowloadExcel}>
                <Icon name="rebates_export" />
                <label>{t`features_agent_agency_center_revenue_details_index_5101525`}</label>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`assets.financial-record.search.search`}</div>}
        className={`user-popup ${styles['agent-form-popup']}`}
        maskClosable={false}
        autoFocus={false}
        visible={incomeFilterShow}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setIncomeFilterShow(false)}
        footer={null}
      >
        <div className={`income-wrap ${styles['agent-form']}`}>
          <Form form={form} layout="vertical" onSubmit={handleSubmit} autoComplete="off" validateTrigger="onSubmit">
            <FormItem label={t`features_agent_agency_center_revenue_details_index_5101515`}>
              <Tabs
                mode="button"
                classNames="user-customize-tabs-button"
                value={revenueDetailsPopUpMethod}
                tabList={detailTabList}
                onChange={v => setRevenueDetailsPopUpMethod(v.id)}
              />
            </FormItem>

            <FormItem label={t`features_agent_agency_center_revenue_details_index_5101516`}>
              <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                <FormItem
                  field="startTime"
                  rules={[
                    IsEmptyValidate(endTimeWatch, t`features_agent_agency_center_revenue_details_index_5101526`),
                    DateThanSizeValidate(
                      endTimeWatch,
                      MinAndMaxTypeEnum.max,
                      t`features_agent_agency_center_invitation_details_index_5101598`
                    ),
                  ]}
                >
                  <DatePicker
                    placeholder={t`features_agent_agency_center_revenue_details_index_5101527`}
                    disabledDate={setDisableDate}
                  />
                </FormItem>

                <FormItem
                  field="endTime"
                  rules={[
                    IsEmptyValidate(startTimeWatch, t`features_agent_agency_center_revenue_details_index_5101528`),
                  ]}
                >
                  <DatePicker
                    placeholder={t`features_agent_agency_center_revenue_details_index_5101527`}
                    disabledDate={setDisableDate}
                  />
                </FormItem>
              </Space>
            </FormItem>

            <FormItem label={t`features_agent_agency_center_revenue_details_index_5101517`}>
              <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                <FormItem
                  field="minAmount"
                  rules={[
                    IsEmptyValidate(maxAmountWatch, t`features_agent_agency_center_revenue_details_index_5101529`),
                    ThanSizeValidate(
                      maxAmountWatch,
                      MinAndMaxTypeEnum.max,
                      t`features_agent_agency_center_revenue_details_index_5101530`
                    ),
                    TwoDecimalPlaces(),
                  ]}
                >
                  <InputNumber placeholder={t`quote.common.low`} hideControl />
                </FormItem>

                <FormItem
                  field="maxAmount"
                  rules={[
                    IsEmptyValidate(minAmountWatch, t`features_agent_agency_center_revenue_details_index_5101531`),
                    TwoDecimalPlaces(),
                  ]}
                >
                  <InputNumber placeholder={t`quote.common.high`} hideControl />
                </FormItem>
              </Space>
            </FormItem>

            <div className="btn">
              <Button type="default" onClick={handlePopUpReset}>{t`user.field.reuse_47`}</Button>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
              >{t`features_agent_agency_center_revenue_details_index_5101533`}</Button>
            </div>
          </Form>
        </div>
      </UserPopUp>
    </>
  )
}

export default AgencyCenterRevenueDetails
