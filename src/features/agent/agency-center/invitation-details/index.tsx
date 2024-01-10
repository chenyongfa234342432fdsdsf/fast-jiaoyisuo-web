import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { DatePicker, TableColumnProps, InputNumber, Form, Button, Space, Spin } from '@nbit/arco'
import Table from '@/components/table'
import UserPopUp from '@/features/user/components/popup'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Tabs from '@/components/tabs'
import { postQueryInviteDetails, getInviteHistoryExcelUrl } from '@/apis/agent/agency-center'
import { DownloadFiles, HandleDisableEndDate } from '@/features/user/utils/common'
import { InviteDetailsMembersType, AgencyCenterQueryInviteDetailsReq } from '@/typings/api/agent/agency-center'
import { IsEmptyValidate, ThanSizeValidate, DateThanSizeValidate } from '@/features/user/utils/validate'
import { MinAndMaxTypeEnum } from '@/constants/user'
import { agentModuleRoutes } from '@/constants/agent'
import { ProductCdEnum } from '@/features/agent/agency-center/revenue-details'
import dayjs from 'dayjs'
import Icon from '@/components/icon'
import styles from '../index.module.css'

const FormItem = Form.Item

interface detailsTabType {
  title: string
  id: string
}

type stateType = AgencyCenterQueryInviteDetailsReq & {
  total?: number
}

enum InviteEnum {
  all = '', // 默认全部
  agen = '1', // 代理商邀请
  ordinary = '2', // 普通邀请
}

enum RealNameEnum {
  default = 3, // 默认全部
  no = 1, // 未认证
  yes = 2, // 已认证
}

function AgencyCenterInvitationDetails({
  rebateCanbeSetData,
  isAgt,
}: {
  rebateCanbeSetData: Array<string>
  isAgt: string
}) {
  const [invitationDetailsTableMethod, setInvitationDetailsTableMethod] = useState<string>(InviteEnum.all)
  const [InvitationDetailsTypePopUpMethod, setInvitationDetailsTypePopUpMethod] = useState<string>(InviteEnum.all)
  const [InvitationDetailsRealNameTypePopUpMethod, setInvitationDetailsRealNamePopUpMethod] = useState<number>(
    RealNameEnum.default
  )
  const [inviteData, setInviteData] = useState<Array<InviteDetailsMembersType>>([])
  const [inviteFilterShow, setInviteFilterShow] = useState<boolean>(false)
  const [searchUidValue, setSearchUidValue] = useState<number | undefined>(undefined)

  const registerEndTime = dayjs().endOf('date').valueOf()

  const defaultStateData = {
    page: 1,
    pageSize: 10,
  }

  const state = useRef<stateType>(defaultStateData)
  const cacheList = useRef<Array<InviteDetailsMembersType>>([])
  const searchUidEvent = useRef<any>(null)

  const [form] = Form.useForm()
  const minChildNumWatch = Form.useWatch('minChildNum', form)
  const maxChildNumWatch = Form.useWatch('maxChildNum', form)
  const minSpotWatch = Form.useWatch('minSpot', form)
  const maxSpotWatch = Form.useWatch('maxSpot', form)
  const minContractWatch = Form.useWatch('minContract', form)
  const maxContractWatch = Form.useWatch('maxContract', form)
  const minBorrowWatch = Form.useWatch('minBorrow', form)
  const maxBorrowWatch = Form.useWatch('maxBorrow', form)
  const registerStartTimeWatch = Form.useWatch('registerStartTime', form)
  const registerEndTimeWatchWatch = Form.useWatch('registerEndTime', form)

  /** 处理表格比例分成 */
  const handleInvitationDetailsTabbleProportion = (recordSelf: number, recordChild: number) => {
    if (recordSelf === null && recordChild === null) {
      return <label>-</label>
    }

    return (
      <>
        {recordSelf !== null && (
          <label>{`${t`features_agent_agency_center_invitation_details_index_5101545`}${recordSelf}% `}</label>
        )}
        {recordSelf !== null && recordChild !== null && '/ '}
        {recordChild !== null && <label>{`${t`features_agent_index_5101357`}${recordChild}%`}</label>}
      </>
    )
  }

  const hasSpot = rebateCanbeSetData?.includes(ProductCdEnum.spot)
  const hasContract = rebateCanbeSetData?.includes(ProductCdEnum.contract)
  const hasBorrow = rebateCanbeSetData?.includes(ProductCdEnum.borrow)

  const spotTable = hasSpot
    ? {
        title: t`features_agent_manage_index_5101432`,
        align: 'right',
        render: (_, record) => {
          return handleInvitationDetailsTabbleProportion(record.spotSelf, record.spotChild)
        },
      }
    : null

  const contractTable = hasContract
    ? {
        title: t`features_agent_manage_index_5101434`,
        align: 'right',
        render: (_, record) => {
          return handleInvitationDetailsTabbleProportion(record.contractSelf, record.contractChild)
        },
      }
    : null

  const borrowTable = hasBorrow
    ? {
        title: t`features_agent_manage_index_5101435`,
        align: 'right',
        render: (_, record) => {
          return handleInvitationDetailsTabbleProportion(record.borrowSelf, record.borrowChild)
        },
      }
    : null

  const inviteColumnsTable = [
    {
      title: t`user.account_security.modify_username_04`,
      fixed: 'left',
      width: 240,
      ellipsis: true,
      dataIndex: 'nickName',
    },
    {
      title: 'UID',
      width: 110,
      dataIndex: 'uid',
      align: 'right',
    },
    {
      title: t`features_agent_agency_center_invitation_details_index_5101536`,
      dataIndex: 'kycStatus',
      align: 'right',
      render: (_, record) => {
        return (
          <>
            {record.kycStatus === RealNameEnum.yes && <label>{t`user.personal_center_02`}</label>}
            {record.kycStatus === RealNameEnum.no && <label>{t`user.personal_center_03`}</label>}
            {!record.kycStatus && <label>-</label>}
          </>
        )
      },
    },
    {
      title: t`features_agent_agency_center_invitation_details_index_5101541`,
      width: 240,
      dataIndex: 'createdTime',
      align: 'right',
      sorter: (a, b) => dayjs(a.createdTime).valueOf() - dayjs(b.createdTime).valueOf(),
      render: (_, record) => {
        return <label>{dayjs(record.createdTime).format('YYYY-MM-DD HH:mm:ss')}</label>
      },
    },
    {
      title: t`features_agent_agency_center_data_overview_index_5101509`,
      dataIndex: 'inviteCount',
      align: 'right',
      sorter: (a, b) => Number(a.inviteCount) - Number(b.inviteCount),
    },
    {
      title: t`features_agent_agency_center_invitation_details_index_5101542`,
      dataIndex: 'isAgt',
      align: 'right',
      render: (_, record) => {
        return (
          <>
            {record.isAgt === InviteEnum.agen && (
              <label>{t`features_agent_agency_center_invitation_details_index_5101543`}</label>
            )}
            {record.isAgt === InviteEnum.ordinary && (
              <label>{t`features_agent_agency_center_invitation_details_index_5101544`}</label>
            )}
            {!record.isAgt && <label>-</label>}
          </>
        )
      },
    },
    spotTable,
    contractTable,
    borrowTable,
    {
      title: t`order.columns.action`,
      fixed: 'right',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          size="mini"
          style={{ padding: 0 }}
          onClick={() => link(`${agentModuleRoutes.inviteCheckMore}/${record.uid}`)}
        >{t`features/message-center/messages-3`}</Button>
      ),
    },
  ]

  const inviteColumns = inviteColumnsTable.filter(Boolean) as Array<TableColumnProps>

  const inviteTabList =
    isAgt && isAgt === InviteEnum.agen
      ? [
          { title: t`common.all`, id: InviteEnum.all },
          { title: t`features_agent_agency_center_invitation_details_index_5101546`, id: InviteEnum.agen },
          { title: t`features_agent_agency_center_invitation_details_index_5101547`, id: InviteEnum.ordinary },
        ]
      : [
          { title: t`common.all`, id: InviteEnum.all },
          { title: t`features_agent_agency_center_invitation_details_index_5101547`, id: InviteEnum.ordinary },
        ]

  const realNameTabList = [
    { title: t`common.all`, id: RealNameEnum.default },
    { title: t`features_agent_agency_center_invitation_details_index_5101548`, id: RealNameEnum.yes },
    { title: t`features_agent_agency_center_invitation_details_index_5101549`, id: RealNameEnum.no },
  ]

  /** 重置弹窗 */
  const handlePopUpReset = () => {
    setInvitationDetailsTypePopUpMethod(InviteEnum.all)
    setInvitationDetailsRealNamePopUpMethod(RealNameEnum.default)
    form.resetFields()
    state.current = {
      ...defaultStateData,
      isAgt: InviteEnum.all,
      kycStatus: RealNameEnum.default,
    }
  }

  /** 获取邀请数据 */
  const queryInviteDetails = async (isPopUpSubmit?: boolean) => {
    const res = await postQueryInviteDetails(state.current)
    if (res.isOk) {
      const list = (res.data?.members?.list as Array<InviteDetailsMembersType>) || []
      state.current = { ...state.current, total: res.data?.members?.total }
      setInviteData(list)
      cacheList.current = list
      setInviteFilterShow(false)

      isPopUpSubmit && setInvitationDetailsTableMethod(state.current.isAgt || InviteEnum.all)
    }
  }

  /** 下载 Excel */
  const getInviteExcelUrl = async () => {
    const res = await getInviteHistoryExcelUrl({})
    if (res.isOk && res.data) {
      DownloadFiles(res.data)
    }
  }

  const { run: getInviteDetails, loading } = useRequest(queryInviteDetails, { manual: true })
  const { run: dowloadExcel, loading: exportLoading } = useRequest(getInviteExcelUrl, { manual: true })
  const { run: searchUid } = useRequest(queryInviteDetails, { debounceWait: 300, manual: true })

  useEffect(() => {
    getInviteDetails()
  }, [])

  /** 设置时间组件禁用时间 */
  const setDisableDate = (currentDate: dayjs.Dayjs) => HandleDisableEndDate(currentDate, registerEndTime)

  /** 处理 tab 切换 */
  const handleTabChange = (value: detailsTabType) => {
    state.current = {
      ...state.current,
      isAgt: value.id === InviteEnum.all ? '' : value.id,
    }

    setInvitationDetailsTableMethod(value.id)
    setInvitationDetailsTypePopUpMethod(value.id)
    getInviteDetails()
  }

  /** 处理分页 */
  const handlePaginationOnChange = (page: number, pageSize: number) => {
    state.current = { ...state.current, page, pageSize }
    getInviteDetails()
  }

  /** uid 搜索处理 */
  const handleSearchUid = (value: number | undefined, isClear?: boolean) => {
    setSearchUidValue(value)
    isClear && searchUidEvent.current?.blur() && searchUidEvent.current?.focus()

    const options = {
      ...defaultStateData,
      uid: value,
    }

    state.current = { ...options }

    searchUid()
  }

  const handleInvitationDetailsPopUpTabChange = (values: string) => {
    if (values === InviteEnum.ordinary) form.resetFields()
    setInvitationDetailsTypePopUpMethod(values)
  }

  const handleSubmit = (values: AgencyCenterQueryInviteDetailsReq) => {
    const submitStartTime = values.registerStartTime
      ? dayjs(values.registerStartTime).startOf('date').valueOf()
      : undefined
    const submitEndTime = values.registerEndTime ? dayjs(values.registerEndTime).endOf('date').valueOf() : undefined

    const options = {
      ...values,
      isAgt: InvitationDetailsTypePopUpMethod,
      kycStatus: InvitationDetailsRealNameTypePopUpMethod,
      registerStartTime: submitStartTime,
      registerEndTime: submitEndTime,
      page: 1,
      pageSize: 10,
    }

    state.current = { ...options }

    setSearchUidValue(undefined)
    getInviteDetails(true)
  }
  return (
    <>
      <div className="title" id="invitation-details">
        <Icon name="rebates_agent_invitation" />
        <label>{t`features_agent_agency_center_index_5101512`}</label>
      </div>

      <div className="container">
        <div className="container-tabs">
          <div className="tabs-wrap">
            <Tabs
              mode="button"
              classNames="user-customize-tabs-button"
              value={invitationDetailsTableMethod}
              tabList={inviteTabList}
              onChange={handleTabChange}
            />
          </div>
          <div className="icon">
            <InputNumber
              value={searchUidValue}
              placeholder={t`features_agent_agency_center_invitation_details_index_5101534`}
              prefix={<Icon name="search" hasTheme />}
              hideControl
              formatter={v => String(v).replace('.', '')}
              onFocus={e => (searchUidEvent.current = e.target)}
              suffix={
                searchUidValue ? (
                  <Icon name="del_input_box" hasTheme onClick={() => handleSearchUid(undefined, true)} />
                ) : (
                  <span className="w-5 block"></span>
                )
              }
              onChange={handleSearchUid}
            />

            <div>
              <Icon name="asset_record_filter" hasTheme onClick={() => setInviteFilterShow(true)} hover />
            </div>
          </div>
        </div>

        <Table
          columns={inviteColumns}
          data={inviteData}
          rowKey="uid"
          border={false}
          style={{ height: 260 }}
          scroll={{
            x: 1800,
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
            <label>{t`features_agent_agency_center_invitation_details_index_5101564`}</label>
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
        visible={inviteFilterShow}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setInviteFilterShow(false)}
        footer={null}
      >
        <div className={`invite-wrap ${styles['agent-form']}`}>
          <Form form={form} layout="vertical" onSubmit={handleSubmit} autoComplete="off" validateTrigger="onSubmit">
            <FormItem label={t`features_agent_agency_center_invitation_details_index_5101535`}>
              <Tabs
                mode="button"
                classNames="user-customize-tabs-button"
                value={InvitationDetailsTypePopUpMethod}
                tabList={inviteTabList}
                onChange={v => handleInvitationDetailsPopUpTabChange(v.id)}
              />
            </FormItem>

            <FormItem label={t`features_agent_agency_center_invitation_details_index_5101536`}>
              <Tabs
                mode="button"
                classNames="user-customize-tabs-button"
                value={InvitationDetailsRealNameTypePopUpMethod as number}
                tabList={realNameTabList}
                onChange={v => setInvitationDetailsRealNamePopUpMethod(v.id)}
              />
            </FormItem>

            <FormItem label={t`features_agent_agency_center_data_overview_index_5101509`}>
              <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                <FormItem
                  field="minChildNum"
                  rules={[
                    IsEmptyValidate(maxChildNumWatch, t`features_agent_agency_center_invitation_details_index_5101550`),
                    ThanSizeValidate(
                      maxChildNumWatch,
                      MinAndMaxTypeEnum.max,
                      t`features_agent_agency_center_invitation_details_index_5101551`
                    ),
                  ]}
                >
                  <InputNumber
                    placeholder={t`features_agent_agency_center_invitation_details_index_5101552`}
                    hideControl
                  />
                </FormItem>

                <FormItem
                  field="maxChildNum"
                  rules={[
                    IsEmptyValidate(minChildNumWatch, t`features_agent_agency_center_invitation_details_index_5101553`),
                  ]}
                >
                  <InputNumber
                    placeholder={t`features_agent_agency_center_invitation_details_index_5101555`}
                    hideControl
                  />
                </FormItem>
              </Space>
            </FormItem>

            {InvitationDetailsTypePopUpMethod !== InviteEnum.ordinary && (
              <>
                {hasSpot && (
                  <FormItem label={t`features_agent_agency_center_invitation_details_index_5101537`}>
                    <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                      <FormItem
                        field="minSpot"
                        rules={[
                          IsEmptyValidate(
                            maxSpotWatch,
                            t`features_agent_agency_center_invitation_details_index_5101556`
                          ),
                          ThanSizeValidate(
                            maxSpotWatch,
                            MinAndMaxTypeEnum.max,
                            t`features_agent_agency_center_invitation_details_index_5101557`
                          ),
                        ]}
                      >
                        <InputNumber
                          placeholder={t`features_agent_agency_center_invitation_details_index_5101558`}
                          suffix="%"
                          hideControl
                        />
                      </FormItem>

                      <FormItem
                        field="maxSpot"
                        rules={[
                          IsEmptyValidate(
                            minSpotWatch,
                            t`features_agent_agency_center_invitation_details_index_5101559`
                          ),
                        ]}
                      >
                        <InputNumber
                          placeholder={t`features_agent_agency_center_invitation_details_index_5101561`}
                          suffix="%"
                          hideControl
                        />
                      </FormItem>
                    </Space>
                  </FormItem>
                )}

                {hasContract && (
                  <FormItem label={t`features_agent_agency_center_invitation_details_index_5101538`}>
                    <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                      <FormItem
                        field="minContract"
                        rules={[
                          IsEmptyValidate(
                            maxContractWatch,
                            t`features_agent_agency_center_invitation_details_index_5101556`
                          ),
                          ThanSizeValidate(
                            maxContractWatch,
                            MinAndMaxTypeEnum.max,
                            t`features_agent_agency_center_invitation_details_index_5101557`
                          ),
                        ]}
                      >
                        <InputNumber
                          placeholder={t`features_agent_agency_center_invitation_details_index_5101558`}
                          suffix="%"
                          hideControl
                        />
                      </FormItem>

                      <FormItem
                        field="maxContract"
                        rules={[
                          IsEmptyValidate(
                            minContractWatch,
                            t`features_agent_agency_center_invitation_details_index_5101559`
                          ),
                        ]}
                      >
                        <InputNumber
                          placeholder={t`features_agent_agency_center_invitation_details_index_5101561`}
                          suffix="%"
                          hideControl
                        />
                      </FormItem>
                    </Space>
                  </FormItem>
                )}

                {hasBorrow && (
                  <FormItem label={t`features_agent_agency_center_invitation_details_index_5101539`}>
                    <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                      <FormItem
                        field="minBorrow"
                        rules={[
                          IsEmptyValidate(
                            maxBorrowWatch,
                            t`features_agent_agency_center_invitation_details_index_5101556`
                          ),
                          ThanSizeValidate(
                            maxBorrowWatch,
                            MinAndMaxTypeEnum.max,
                            t`features_agent_agency_center_invitation_details_index_5101557`
                          ),
                        ]}
                      >
                        <InputNumber
                          placeholder={t`features_agent_agency_center_invitation_details_index_5101558`}
                          suffix="%"
                          hideControl
                        />
                      </FormItem>

                      <FormItem
                        field="maxBorrow"
                        rules={[
                          IsEmptyValidate(
                            minBorrowWatch,
                            t`features_agent_agency_center_invitation_details_index_5101559`
                          ),
                        ]}
                      >
                        <InputNumber
                          placeholder={t`features_agent_agency_center_invitation_details_index_5101561`}
                          suffix="%"
                          hideControl
                        />
                      </FormItem>
                    </Space>
                  </FormItem>
                )}
              </>
            )}

            <FormItem label={t`features_agent_agency_center_invitation_details_index_5101540`}>
              <Space split={t`features/assets/saving/history-list/index-0`} align="start">
                <FormItem
                  field="registerStartTime"
                  rules={[
                    IsEmptyValidate(
                      registerEndTimeWatchWatch,
                      t`features_agent_agency_center_invitation_details_index_5101562`
                    ),
                    DateThanSizeValidate(
                      registerEndTimeWatchWatch,
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
                  field="registerEndTime"
                  rules={[
                    IsEmptyValidate(
                      registerStartTimeWatch,
                      t`features_agent_agency_center_invitation_details_index_5101563`
                    ),
                  ]}
                >
                  <DatePicker
                    placeholder={t`features_agent_agency_center_revenue_details_index_5101527`}
                    disabledDate={setDisableDate}
                  />
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

export default AgencyCenterInvitationDetails
