import { useEffect, useState } from 'react'
import { Button, PaginationProps, Empty, Form, Space, Spin, InputNumber } from '@nbit/arco'
import Table from '@/components/table'
import UserPopUp from '@/features/user/components/popup'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { usePageContext } from '@/hooks/use-page-context'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { getInviteDetailsTableColumnSchema } from '@/features/agent/invitation/table-schema'
import { getV1AgentGetUrlApiRequest } from '@/apis/agent/agency-center'
import { DownloadFiles } from '@/features/user/utils/common'
import DebounceSearchBar from '@/components/debounce-search-bar'
import { InviteCheckOnlyUnderMe, InviteTypeModeEnum } from '@/constants/agent/invite'
import { IsEmptyValidate, ThanSizeEqualValidate } from '@/features/user/utils/validate'
import { MinAndMaxTypeEnum } from '@/constants/user'
import { useAgentProductLine, useAgentProductLineWithFee } from '@/hooks/features/agent/invite'
import { useUnmount } from 'ahooks'
import { isHidePagination } from '@/helper/agent/invite'
import NoDataImage from '@/components/no-data-image'
import styles from './index.module.css'

const FormItem = Form.Item

function InvitationCenter() {
  const pageCtx = usePageContext()
  const store = useAgentInviteStore()
  useAgentProductLine()
  const { hasBorrow, hasSpot, hasContract } = useAgentProductLineWithFee()

  store.hooks.useGetContractStatusCode()
  const rootUid = pageCtx.routeParams?.id

  useEffect(() => {
    store.setSelectedInvited({ uid: rootUid })
    store.setFilterSettingCheckMore({ targetUid: rootUid, levelLimit: '' })
  }, [rootUid])

  const { checkMoreMode: selectedMode, setCheckMoreMode: setSelectedMode } = store
  const [searchInput, setSearchInput] = useState('')

  const { apiData: list, setApiData, setPage, page, isLoading } = store.hooks.useAgentInviteTableCheckMore()
  const isShowUpperButton = store.filterSettingCheckMoreSelectedUids.length > 0

  useEffect(() => {
    form.resetFields()

    switch (selectedMode) {
      case InviteTypeModeEnum.all: {
        setSearchInput('')
        store.resetfilterSettingCheckMoreSelectedUids()
        store.setFilterSettingCheckMore({ targetUid: rootUid, levelLimit: '' })
        break
      }
      case InviteTypeModeEnum.levelLimit: {
        setSearchInput('')
        store.resetfilterSettingCheckMoreSelectedUids()
        store.setFilterSettingCheckMore({ targetUid: '', levelLimit: InviteCheckOnlyUnderMe })
        break
      }
      case InviteTypeModeEnum.searhing: {
        store.resetfilterSettingCheckMoreSelectedUids()
        break
      }
      case InviteTypeModeEnum.lookingUp: {
        setSearchInput('')
        break
      }
      default:
        break
    }
  }, [selectedMode])

  const [form] = Form.useForm()
  const spotMinWatch = Form.useWatch('spotMin', form)
  const spotMaxWatch = Form.useWatch('spotMax', form)
  const contractMinWatch = Form.useWatch('contractMin', form)
  const contractMaxWatch = Form.useWatch('contractMax', form)
  const borrowMinWatch = Form.useWatch('borrowMin', form)
  const borrowMaxWatch = Form.useWatch('borrowMax', form)

  const [inviteFilterShow, setInviteFilterShow] = useState<boolean>(false)
  const [exportLoading, setExportLoading] = useState<boolean>(false)

  const onChangeTable = (_page: PaginationProps) => {
    const selectedPageSize = _page.pageSize
    const selectedPage = _page.current

    setPage(prev => {
      return {
        ...prev,
        pageSize: selectedPageSize,
        current: selectedPage,
      }
    })
  }

  useUnmount(() => {
    store.resetFilterSettingCheckMore()
    store.resetfilterSettingCheckMoreSelectedUids()
    store.resetCheckMoreMode()
  })

  const currentSearchUid = store.filterSettingCheckMore.targetUid
    ? store.filterSettingCheckMore.targetUid === store.selectedInvited.uid &&
      selectedMode !== InviteTypeModeEnum.lookingUp
      ? ''
      : store.filterSettingCheckMore.targetUid
    : ''
  // inner helpers
  const getUpperId = () => {
    const ids = store.filterSettingCheckMoreSelectedUids
    const upperId = ids.length === 0 ? store.selectedInvited.uid : ids[ids.length - 1]
    store.setfilterSettingCheckMoreSelectedUidsPop()
    return upperId
  }

  /** 下载 Excel */
  const handleExportExcel = async () => {
    setExportLoading(true)
    const res = await getV1AgentGetUrlApiRequest({
      targetUid: String(rootUid),
    })
    if (res.isOk && res.data) {
      DownloadFiles(res.data)
    }
    setExportLoading(false)
  }

  return (
    <section className={`invitation-center ${styles.scoped}`}>
      <div className="header">
        <div className="invitaion-center-header">
          <div className="title">
            <label>{t`features_agent_invitation_index_5101581`}</label>
          </div>
        </div>
      </div>
      <div className="invitation-center-wrap">
        <div className="container">
          <div className="table-fillter">
            <Button
              className="btn"
              type={selectedMode === InviteTypeModeEnum.all && !isShowUpperButton ? 'secondary' : 'text'}
              onClick={() => {
                setSelectedMode(InviteTypeModeEnum.all)
              }}
            >
              {t`common.all`}
            </Button>
            <Button
              className="btn"
              type={selectedMode === InviteTypeModeEnum.levelLimit && !isShowUpperButton ? 'secondary' : 'text'}
              onClick={() => {
                setSelectedMode(InviteTypeModeEnum.levelLimit)
              }}
            >
              {t`features_agent_invitation_index_5101582`}
            </Button>
            <Icon
              name="asset_record_filter"
              className="filter-btn"
              onClick={() => {
                setInviteFilterShow(true)
              }}
              hasTheme
            />

            <DebounceSearchBar
              type="number"
              className="search"
              placeholder={t`features_agent_invitation_index_kludt-yekbcej8a-zktce`}
              prefix={<Icon name="search" hasTheme />}
              inputValue={currentSearchUid}
              onChange={val => {
                setSearchInput(val)

                if (val) {
                  if (store.filterSettingCheckMore.targetUid === val) return
                  setSelectedMode(InviteTypeModeEnum.searhing)
                  store.setFilterSettingCheckMore({ targetUid: val, levelLimit: '' })
                } else if (searchInput) {
                  // default set to all if searchInput been reset to empty
                  setSelectedMode(InviteTypeModeEnum.all)
                }
              }}
            />
          </div>
        </div>
        <div className="invitation-table hide-scrollbar-on-not-active">
          <Table
            columns={getInviteDetailsTableColumnSchema(store)}
            data={list || []}
            rowKey={record => `${record.uid}`}
            loading={!!isLoading}
            showSorterTooltip={false}
            pagination={page}
            onChange={_page => onChangeTable(_page)}
            renderPagination={paginationNode => {
              if (isHidePagination(page)) return null

              return (
                <div className="table-pagination">
                  <div>{paginationNode}</div>
                  <div className="table-pagination-extra">{t`features_agent_manage_index_5101442`}</div>
                </div>
              )
            }}
            className="invitation-table-body"
            noDataElement={
              isLoading === false && list.length === 0 ? <NoDataImage footerText={t`trade.c2c.noData`} /> : <div></div>
            }
          />

          {isShowUpperButton && (
            <div className="return-button-wrapper">
              <span
                className="return-button"
                onClick={() => {
                  store.setFilterSettingCheckMore({ targetUid: getUpperId(), levelLimit: '' })
                }}
              >{t`features_agent_invitation_index_5101594`}</span>
            </div>
          )}
        </div>
        <div className="invitation-tips">
          <p>
            {t`features_agent_invitation_index_5101583`} 3 {t`features_agent_invitation_index_5101584`}
          </p>
          <p>*{t`features_agent_invitation_index_5101585`}</p>
          <div className="out">
            {exportLoading ? (
              <Spin dot />
            ) : (
              <div className="btn cursor-pointer" onClick={handleExportExcel}>
                <Icon name="rebates_export" />
                <label className="cursor-pointer">{t`features_agent_agency_center_revenue_details_index_5101525`}</label>
              </div>
            )}
          </div>
        </div>
        <UserPopUp
          title={<div style={{ textAlign: 'left' }}>{t`assets.financial-record.search.search`}</div>}
          className="user-popup"
          maskClosable={false}
          visible={inviteFilterShow}
          closeIcon={<Icon name="close" hasTheme />}
          onCancel={() => setInviteFilterShow(false)}
          footer={null}
        >
          <div className={`invite-wrap ${styles['agent-form']}`}>
            <Form form={form} layout="vertical" autoComplete="off" validateTrigger="onBlur" initialValues={{}}>
              {hasSpot && (
                <FormItem label={t`features_agent_invitation_index_5101578`}>
                  <Space split={t`features/assets/saving/history-list/index-0`}>
                    <FormItem
                      field="spotMin"
                      rules={[
                        IsEmptyValidate(spotMaxWatch, t`features_agent_invitation_index_5101603`),
                        ThanSizeEqualValidate(
                          spotMaxWatch,
                          MinAndMaxTypeEnum.max,
                          t`features_agent_invitation_index_5101604`
                        ),
                      ]}
                    >
                      <InputNumber hideControl placeholder={t`quote.common.low`} />
                    </FormItem>

                    <FormItem
                      field="spotMax"
                      rules={[IsEmptyValidate(spotMinWatch, t`features_agent_invitation_index_5101605`)]}
                    >
                      <InputNumber hideControl placeholder={t`quote.common.high`} />
                    </FormItem>
                  </Space>
                </FormItem>
              )}
              {hasContract && (
                <FormItem label={t`features_agent_invitation_index_5101579`}>
                  <Space split={t`features/assets/saving/history-list/index-0`}>
                    <FormItem
                      field="contractMin"
                      rules={[
                        IsEmptyValidate(contractMaxWatch, t`features_agent_invitation_index_5101603`),
                        ThanSizeEqualValidate(
                          contractMaxWatch,
                          MinAndMaxTypeEnum.max,
                          t`features_agent_invitation_index_5101604`
                        ),
                      ]}
                    >
                      <InputNumber hideControl placeholder={t`quote.common.low`} />
                    </FormItem>

                    <FormItem
                      field="contractMax"
                      rules={[IsEmptyValidate(contractMinWatch, t`features_agent_invitation_index_5101605`)]}
                    >
                      <InputNumber hideControl placeholder={t`quote.common.high`} />
                    </FormItem>
                  </Space>
                </FormItem>
              )}

              {hasBorrow && (
                <FormItem label={t`features_agent_invitation_index_5101580`}>
                  <Space split={t`features/assets/saving/history-list/index-0`}>
                    <FormItem
                      field="borrowMin"
                      rules={[
                        IsEmptyValidate(borrowMaxWatch, t`features_agent_invitation_index_5101603`),
                        ThanSizeEqualValidate(
                          borrowMaxWatch,
                          MinAndMaxTypeEnum.max,
                          t`features_agent_invitation_index_5101604`
                        ),
                      ]}
                    >
                      <InputNumber hideControl placeholder={t`quote.common.low`} />
                    </FormItem>

                    <FormItem
                      field="borrowMax"
                      rules={[IsEmptyValidate(borrowMinWatch, t`features_agent_invitation_index_5101605`)]}
                    >
                      <InputNumber hideControl placeholder={t`quote.common.high`} />
                    </FormItem>
                  </Space>
                </FormItem>
              )}

              <div className="btn pt-2">
                <Button
                  className={'reset-btn'}
                  type="secondary"
                  onClick={() => {
                    form.resetFields()
                  }}
                >{t`user.field.reuse_47`}</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    form
                      .validate()
                      .then(() => {
                        store.setFilterSettingCheckMore({
                          ...form.getFieldsValue(),
                        })
                        setInviteFilterShow(false)
                      })
                      .catch(e => {})
                  }}
                >{t`features_agent_agency_center_revenue_details_index_5101533`}</Button>
              </div>
            </Form>
          </div>
        </UserPopUp>
      </div>
    </section>
  )
}
export default InvitationCenter
