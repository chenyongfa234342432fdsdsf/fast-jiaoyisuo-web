import { ReactNode, useState, useRef, useEffect } from 'react'
import { useLayoutStore } from '@/store/layout'
import { useCommonStore } from '@/store/common'
import {
  Button,
  Table,
  Alert,
  Tooltip,
  Slider,
  Message,
  Checkbox,
  Input,
  TableColumnProps,
  PaginationProps,
  Empty,
} from '@nbit/arco'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import cn from 'classnames'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { useCopyToClipboard } from 'react-use'
import { QRCodeCanvas } from 'qrcode.react'
import {
  fetchAgentInviteQueryMax,
  fetchManageInviteAdd,
  fetchManageInvitePageList,
  fetchManageInvitequery,
  fetchManageInviteRemove,
  fetchManageInviteUpdate,
} from '@/apis/agent/manage'
import { AgentInviteQueryMaxResp, AgentManageInvitePageList } from '@/typings/api/agent/manage'
import { link } from '@/helper/link'
import { isNumber } from 'lodash'
import { formatDate } from '@/helper/date'
import CustomModal from '../modal'
import styles from './index.module.css'
import { generateRatio } from '../utils/generateRatio'
import { getHost } from '../utils/host'

function formatTooltip(val) {
  return <span>{val}%</span>
}

function UserPersonalCenterAgentManage() {
  const exportRef = useRef<HTMLDivElement | null>(null)

  const { headerData } = useLayoutStore()

  const { locale } = useCommonStore()

  const { imgWebLogo } = headerData || { imgWebLogo: '' }

  const [pagination, setPagination] = useState<PaginationProps>({
    total: 0,
    current: 1,
    showTotal: true,
    showJumper: true,
    sizeCanChange: true,
    hideOnSinglePage: false,
  }) // 分页配置
  const [total, setTotal] = useState<number>(0) // 剩余可创建邀请码数
  const [formModal, setFormModal] = useState({
    inviteName: '', // 邀请码名称
    spotPercent: 0, // 现货自身比例
    futuresPercent: 0, // 合约自身比例
    borrowMoneyPercent: 0, // 借币自身比例
    isDefault: false, // 是否默认
  }) // 新增 | 修改 邀请码 数据
  const [queryMax, setQueryMax] = useState<AgentInviteQueryMaxResp>() // 系统最大可设置返佣比例
  const [list, setList] = useState<AgentManageInvitePageList[]>([]) // 管理邀请码列表
  const [curr, setCurr] = useState<AgentManageInvitePageList>() // 临时存储当前选中的对象，用于弹窗这部分的关联数据 (避免 for 循环重复查找数组里面的对象)
  const [touchId, setTouchId] = useState<string>('') // '' 表示添加新邀请码，'233' 表示设置金字塔佣金比例
  const [isShow, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isShowSetRatio, setIsShowSetRatio] = useState<boolean>(false) // 设置金字塔佣金比例 Modal 弹窗
  const [isDeleteShowModal, setDeleteShowModal] = useState<boolean>(false)
  const [isShowFriendModal, setShowFriendModal] = useState<boolean>(false)
  const [isShowPoster, setIsShowPoster] = useState<boolean>(false)
  const [isShowQrcode, setIsShowQrcode] = useState<boolean>(false)
  const [columns, setColumns] = useState<TableColumnProps[]>([])

  const [state, copyToClipboard] = useCopyToClipboard()

  const agentInviteQueryMax = async () => {
    const res = await fetchAgentInviteQueryMax({})
    if (res.isOk) {
      setQueryMax(res.data)

      setColumns(
        [
          {
            title: t`store_market_market_list_spotmarketstrade_columnschema_2432`,
            dataIndex: 'name',
            fixed: 'left',
            width: 182,
            render: (col, record) => (
              <div className="table-ceil">
                <Tooltip content={record.invitationCodeName}>
                  <div className="table-ceil-name">{record.invitationCodeName}</div>
                </Tooltip>
                <div className="table-ceil-icon">
                  <Icon
                    name="rebates_edit"
                    hasTheme
                    fontSize={16}
                    onClick={() => {
                      setCurr(record)
                      setShow(true)
                    }}
                  />
                </div>
              </div>
            ),
          },
          res.data?.spot
            ? {
                title: t`features_agent_manage_index_5101432`,
                dataIndex: 'salary',
                render: (col, record) =>
                  isNumber(record.spotSelfRate) && isNumber(record.spotChildRate) ? (
                    <div className="table-ceil">
                      <div className="table-ceil-text">
                        {t({
                          id: 'features_agent_manage_index_5101433',
                          values: { 0: `${record.spotSelfRate}%`, 1: `${record.spotChildRate}%` },
                        })}
                      </div>
                      <div className="table-ceil-icon">
                        <Icon name="rebates_edit" hasTheme fontSize={16} onClick={() => updateForm(record)} />
                      </div>
                    </div>
                  ) : (
                    <div className="table-ceil">--</div>
                  ),
              }
            : null!,
          res.data?.contract
            ? {
                title: t`features_agent_manage_index_5101434`,
                dataIndex: 'address',
                render: (col, record) =>
                  isNumber(record.contractSelfRate) && isNumber(record.contractChildRate) ? (
                    <div className="table-ceil">
                      <div className="table-ceil-text">
                        {t({
                          id: 'features_agent_manage_index_5101433',
                          values: { 0: `${record.contractSelfRate}%`, 1: `${record.contractChildRate}%` },
                        })}
                      </div>
                      <div className="table-ceil-icon">
                        <Icon name="rebates_edit" hasTheme fontSize={16} onClick={() => updateForm(record)} />
                      </div>
                    </div>
                  ) : (
                    <div className="table-ceil">--</div>
                  ),
              }
            : null!,
          res.data?.borrowCoin
            ? {
                title: t`features_agent_manage_index_5101435`,
                dataIndex: 'email',
                render: (col, record) =>
                  isNumber(record.borrowCoinSelfRate) && isNumber(record.borrowCoinChildRate) ? (
                    <div className="table-ceil">
                      <div className="table-ceil-text">
                        {t({
                          id: 'features_agent_manage_index_5101433',
                          values: { 0: `${record.borrowCoinSelfRate}%`, 1: `${record.borrowCoinChildRate}%` },
                        })}
                      </div>
                      <div className="table-ceil-icon">
                        <Icon name="rebates_edit" hasTheme fontSize={16} onClick={() => updateForm(record)} />
                      </div>
                    </div>
                  ) : (
                    <div className="table-ceil">--</div>
                  ),
              }
            : null!,
          {
            title: t`features_agent_index_5101364`,
            width: 142,
            dataIndex: 'sharecode',
            render: (col, record) => (
              <div className="table-ceil">
                <div className="table-ceil-text">{record.invitationCode || '--'}</div>
                <div className="table-ceil-icon">
                  <Icon name="copy" hasTheme fontSize={16} onClick={() => handleCopy(record.invitationCode)} />
                </div>
              </div>
            ),
          },
          {
            title: t`features_agent_manage_index_5101436`,
            width: 120,
            dataIndex: 'friendnumber',
            render: (col, record) => (
              <div className="table-ceil">
                <div className="table-ceil-text">{record.invitationNum || 0}</div>
                <div className="table-ceil-icon">
                  <Icon
                    name="rebates_details"
                    hasTheme
                    fontSize={16}
                    onClick={() => {
                      setTouchId(record.id)
                      setCurr(record)
                      setShowFriendModal(true)
                    }}
                  />
                </div>
              </div>
            ),
          },
          {
            title: t`assets.coin.trade-records.table.date`,
            dataIndex: 'createtime',
            render: (col, record) => <div className="table-ceil-text">{formatDate(record.createdByTime) || '--'}</div>,
          },
          {
            title: t`order.columns.action`,
            fixed: 'right',
            width: 260,
            render: (col, record) => (
              <div className="table-ceil">
                <div className="table-ceil-box">
                  {record.isDefault === 1 ? (
                    <div className="table-ceil-isdefault">{t`features_agent_manage_index_5101437`}</div>
                  ) : (
                    <div className="table-ceil-text" onClick={() => setDefault(record)}>
                      {t`features_agent_manage_index_5101438`}
                    </div>
                  )}
                </div>
                <div className="table-ceil-box">
                  <div
                    className="table-ceil-text"
                    onClick={() =>
                      handleCopy(`${getHost()}/${locale}/register?invitationCode=${record.invitationCode}`)
                    }
                  >
                    {t`features_agent_manage_index_5101439`}
                  </div>
                </div>
                <div className="table-ceil-delete-icon">
                  {record.isDefault !== 1 && (
                    <Icon
                      name="rebates_delete"
                      hasTheme
                      fontSize={18}
                      onClick={() => {
                        setTouchId(record.id)
                        setCurr(record)
                        setDeleteShowModal(true)
                      }}
                    />
                  )}
                </div>
              </div>
            ),
          },
        ].filter(Boolean) as Array<TableColumnProps>
      )
    }
  }

  const getManageInvitequery = async () => {
    const res = await fetchManageInvitequery({})
    if (res.isOk && res.data) {
      // 没有申请为代理商时，强制跳邀请返佣页面
      !res.data.agtInvitationCode && link('/agent')

      // 没有设置金字塔比例时，强制跳邀请返佣页面
      res.data.agtInvitationCode &&
        res.data.agtInvitationCode.scaleList &&
        res.data.agtInvitationCode.scaleList[0] &&
        !isNumber(res.data.agtInvitationCode.scaleList[0].childScale) &&
        link('/agent')
    }
  }

  const inviteManagePageList = async (page = '1', pageSize = '10') => {
    const res = await fetchManageInvitePageList({
      page,
      pageSize,
    })
    if (res.isOk) {
      setPagination({ ...pagination, total: res.data?.total ?? 0 })
      setTotal((res.data?.list && res.data?.list[0] && res.data?.list[0].createdCode) ?? 0) // 兼容后端数据结构为 null 的情况
      setList(res.data?.list ?? [])
    }
  }
  const getManageInviteAdd = async ({
    invitationCodeName,
    spotSelfRate,
    spotChildRate,
    contractSelfRate,
    contractChildRate,
    borrowCoinSelfRate,
    borrowCoinChildRate,
    isDefault,
  }) => {
    const res = await fetchManageInviteAdd({
      invitationCodeName,
      spotSelfRate,
      spotChildRate,
      contractSelfRate,
      contractChildRate,
      borrowCoinSelfRate,
      borrowCoinChildRate,
      isDefault,
    })
    if (res.isOk) {
      inviteManagePageList()
      Message.success(t`features_user_company_certification_director_index_2642`)
    }
  }
  const getManageInviteRemove = async id => {
    const res = await fetchManageInviteRemove({
      id,
    })
    if (res.isOk) {
      setDeleteShowModal(false)
      inviteManagePageList()
      Message.success(t`features_agent_manage_index_g9zineeqvgipwgkpg4o3z`)
    }
  }
  const getManageInviteUpdate = async ({
    invitationCodeName,
    spotSelfRate,
    spotChildRate,
    contractSelfRate,
    contractChildRate,
    borrowCoinSelfRate,
    borrowCoinChildRate,
    isDefault,
    id,
    invitationCode,
  }) => {
    const res = await fetchManageInviteUpdate({
      invitationCodeName,
      spotSelfRate,
      spotChildRate,
      contractSelfRate,
      contractChildRate,
      borrowCoinSelfRate,
      borrowCoinChildRate,
      isDefault,
      id,
      invitationCode,
    })
    if (res.isOk) {
      inviteManagePageList()
      Message.success(t`features_user_company_certification_director_index_2642`)
    }
  }

  useEffect(() => {
    getManageInvitequery()
    agentInviteQueryMax()
    inviteManagePageList()

    return () => {}
  }, [])

  const setDefault = record => {
    let obj: any = {} // 后端需要过滤 null

    // 现货
    if (queryMax?.spot) {
      obj = {
        ...obj,
        spotSelfRate: record.spotSelfRate,
        spotChildRate: record.spotChildRate,
      }
    }

    // 合约
    if (queryMax?.contract) {
      obj = {
        ...obj,
        contractSelfRate: record.contractSelfRate,
        contractChildRate: record.contractChildRate,
      }
    }

    // 借币
    if (queryMax?.borrowCoin) {
      obj = {
        ...obj,
        borrowCoinSelfRate: record.borrowCoinSelfRate,
        borrowCoinChildRate: record.borrowCoinChildRate,
      }
    }

    // setCurr({ ...record, isDefault: 1 })
    getManageInviteUpdate({
      ...obj,
      invitationCodeName: record.invitationCodeName,
      isDefault: 1,
      id: record.id,
      invitationCode: record.invitationCode,
    })
  }

  const updateInvitationCodeName = () => {
    let obj: any = {} // 后端需要过滤 null

    // 现货
    if (queryMax?.spot) {
      obj = {
        ...obj,
        spotSelfRate: curr?.spotSelfRate,
        spotChildRate: curr?.spotChildRate,
      }
    }

    // 合约
    if (queryMax?.contract) {
      obj = {
        ...obj,
        contractSelfRate: curr?.contractSelfRate,
        contractChildRate: curr?.contractChildRate,
      }
    }

    // 借币
    if (queryMax?.borrowCoin) {
      obj = {
        ...obj,
        borrowCoinSelfRate: curr?.borrowCoinSelfRate,
        borrowCoinChildRate: curr?.borrowCoinChildRate,
      }
    }

    getManageInviteUpdate({
      ...obj,
      invitationCodeName: curr?.invitationCodeName,
      isDefault: curr?.isDefault,
      id: curr?.id,
      invitationCode: curr?.invitationCode,
    })
    setShow(false)
  }

  const AddOrUpdate = () => {
    let obj: any = {} // 后端需要过滤 null

    // 现货
    if (queryMax?.spot) {
      obj = {
        ...obj,
        spotSelfRate: formModal.spotPercent,
        spotChildRate: Number(queryMax?.spot) - formModal.spotPercent,
      }
    }

    // 合约
    if (queryMax?.contract) {
      obj = {
        ...obj,
        contractSelfRate: formModal.futuresPercent,
        contractChildRate: Number(queryMax?.contract) - formModal.futuresPercent,
      }
    }

    // 借币
    if (queryMax?.borrowCoin) {
      obj = {
        ...obj,
        borrowCoinSelfRate: formModal.borrowMoneyPercent,
        borrowCoinChildRate: Number(queryMax?.borrowCoin) - formModal.borrowMoneyPercent,
      }
    }

    // 修改
    if (touchId) {
      getManageInviteUpdate({
        ...obj,
        invitationCodeName: curr?.invitationCodeName,
        isDefault: curr?.isDefault,
        id: curr?.id,
        invitationCode: curr?.invitationCode,
      })
      setIsShowSetRatio(false)
      return
    }

    // 新增
    getManageInviteAdd({
      ...obj,
      invitationCodeName: formModal.inviteName,
      isDefault: formModal.isDefault ? '1' : '2',
    })
    setIsShowSetRatio(false)
  }

  const updateForm = record => {
    setTouchId(record.id)
    setFormModal({
      ...formModal,
      spotPercent: +record.spotSelfRate,
      futuresPercent: +record.contractSelfRate,
      borrowMoneyPercent: +record.borrowCoinSelfRate,
    })
    setCurr(record)
    setIsShowSetRatio(true)
  }

  const handleCopy = (key: string) => {
    copyToClipboard(key)
    state.error ? Message.error(t`user.secret_key_02`) : Message.success(t`user.secret_key_01`)
  }

  function InvitationCodeNameChange(name) {
    setCurr({ ...curr!, invitationCodeName: name })
  }

  function onSliderChange(key, _percent) {
    setFormModal({ ...formModal, [key]: _percent })
  }

  const onChangeTable = async pagi => {
    const { current, pageSize } = pagi

    // if (current === pagination.current) return // 当前页不刷新数据

    setLoading(true)
    await inviteManagePageList(current, pageSize)
    setPagination({ ...pagination, current })
    setLoading(false)
  }

  return (
    <section className={`personal-center-agent ${styles.scoped}`}>
      <div className="header">
        <div className="header-box">
          <div className="l">{t`features_agent_index_5101365`}</div>
          <div className="r">
            <Button
              className="button"
              type="primary"
              onClick={() => {
                setTouchId('')
                setFormModal({
                  inviteName: '',
                  spotPercent: 0,
                  futuresPercent: 0,
                  borrowMoneyPercent: 0,
                  isDefault: false,
                })
                setIsShowSetRatio(true)
              }}
            >
              {t`features_agent_manage_index_5101440`}
            </Button>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-text">
          {t`features_agent_manage_index_5101441`}: {total}
        </div>
        <div className="table-container">
          {list && list.length > 0 ? (
            <Table
              className="table"
              rowKey={record => `${record.id}`}
              loading={loading}
              columns={columns}
              data={list}
              border={false}
              scroll={{
                x: 1600,
                y: 226,
              }}
              onChange={onChangeTable}
              pagination={pagination}
              renderPagination={paginationNode => (
                <div className="table-pagination">
                  <div>{paginationNode}</div>
                  <div className="table-pagination-extra">{t`features_agent_manage_index_5101442`}</div>
                </div>
              )}
            />
          ) : (
            <Empty
              className={'empty'}
              icon={<Icon name={'agent/agent_no_data'} fontSize={80} hasTheme isRemoteUrl />}
              description={t`trade.c2c.noData`}
            />
          )}
        </div>
      </div>
      {/* 修改邀请码名称 */}
      <CustomModal style={{ width: 444 }} className={styles['agent-manage-modal']} visible={isShow}>
        <div className="update-invitation-code">
          <div className="invitation-code-header">
            <div className="invitation-code-header-title">{t`features_agent_index_5101408`}</div>
            <div>
              <Icon name="close" hasTheme fontSize={18} onClick={() => setShow(false)} />
            </div>
          </div>

          <div className="invitation-code-content">
            <Input
              className="invitation-code"
              maxLength={20}
              showWordLimit
              value={curr?.invitationCodeName}
              onChange={InvitationCodeNameChange}
              placeholder={t`features_agent_manage_index_5101430`}
            />
          </div>

          <div className="invitation-code-footer">
            <Button className="button" type="secondary" onClick={() => setShow(false)}>
              {t`trade.c2c.cancel`}
            </Button>
            <Button
              className="button"
              type="primary"
              disabled={!curr?.invitationCodeName}
              onClick={() => updateInvitationCodeName()}
            >
              {t`components_chart_header_data_2622`}
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* 好友列表 */}
      <CustomModal style={{ width: 444 }} className={styles['agent-manage-modal']} visible={isShowFriendModal}>
        <div className="friend-modal">
          <div className="friend-modal-header">
            <div className="friend-modal-header-title">{t`features_agent_manage_index_5101443`}</div>
            <div>
              <Icon name="close" hasTheme fontSize={18} onClick={() => setShowFriendModal(false)} />
            </div>
          </div>

          <div className="friend-modal-content">
            <div className="friend-list-item-header">
              <div>{t`features_agent_manage_index_5101444`}</div>
              <div>{t`order.columns.date`}</div>
            </div>
            {curr?.analysisList && curr?.analysisList.length > 0 ? (
              curr?.analysisList.map((v, i) => (
                <div key={i} className="friend-list-item-content">
                  <div>{v.uid}</div>
                  <div>{formatDate(v.date)}</div>
                </div>
              ))
            ) : (
              <Empty
                className={'empty'}
                icon={<Icon name={'agent/agent_no_data'} isRemoteUrl />}
                description={t`trade.c2c.noData`}
              />
            )}
          </div>
        </div>
      </CustomModal>
      <CustomModal style={{ width: 360 }} className={styles['agent-manage-modal']} visible={isDeleteShowModal}>
        <div className="agent-manage-submit-box">
          <div className="agent-manage-submit-header">
            <div className="agent-manage-submit-header-title">{t`features_agent_manage_index_5101445`}</div>
            <div className="agent-manage-submit-header-icon">
              <Icon name="close" hasTheme fontSize={22} onClick={() => setDeleteShowModal(false)} />
            </div>
          </div>

          <div className="agent-manage-submit-content">
            “{curr?.invitationCodeName}”({curr?.invitationCode}){t`features_agent_manage_index_5101446`}
          </div>

          <div className="agent-manage-submit-footer">
            <Button className="button" type="secondary" onClick={() => setDeleteShowModal(false)}>
              {t`trade.c2c.cancel`}
            </Button>
            <Button className="button" type="primary" onClick={() => getManageInviteRemove(curr?.id)}>
              {t`user.field.reuse_17`}
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* 设置金字塔佣金比例 */}
      <CustomModal style={{ width: 444 }} className={styles['agent-manage-modal']} visible={isShowSetRatio}>
        <div className="set-ratio">
          <div className="set-ratio-header">
            <div className="set-ratio-header-title">
              {!touchId ? t`features_agent_manage_index_5101440` : t`features_agent_index_5101411`}
            </div>
            <div>
              <Icon name="close" hasTheme fontSize={18} onClick={() => setIsShowSetRatio(false)} />
            </div>
          </div>

          <div className="set-ratio-content">
            {touchId && (
              <Alert
                icon={<Icon name="msg" className="msg" fontSize={12} />}
                className="set-radio-alert"
                content={<div className="set-radio-alert-label">{t`features_agent_index_5101412`}</div>}
                type="info"
              />
            )}
            {!touchId && (
              <div className="set-radio-form-item">
                <div className="set-radio-header">{t`store_market_market_list_spotmarketstrade_columnschema_2432`}</div>
                <div className="set-radio-input-box">
                  <Input
                    className="set-radio-input"
                    maxLength={20}
                    value={formModal.inviteName}
                    onChange={val => setFormModal({ ...formModal, inviteName: val })}
                    showWordLimit
                    placeholder={t`features_agent_manage_index_5101430`}
                  />
                </div>
              </div>
            )}
            {queryMax?.spot && (
              <div className="set-radio-form-item">
                <div className="set-radio-slider">
                  <div className="set-radio-slider-header">
                    {t`features_agent_index_5101413`}
                    <span className="set-radio-slider-header-highlight">{queryMax?.spot}%</span>
                  </div>
                  <div className="set-radio-slider-content">
                    <Slider
                      className="slider-wrap"
                      // onlyMarkValue
                      marks={generateRatio(queryMax?.spot)}
                      max={Number(queryMax?.spot)}
                      value={formModal.spotPercent}
                      onChange={val => onSliderChange('spotPercent', val)}
                      formatTooltip={formatTooltip}
                    />
                  </div>
                  <div className="set-radio-slider-footer">
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101414`}{' '}
                      <span className="set-radio-slider-footer-highlight">{formModal.spotPercent}%</span>
                    </div>
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101357`}{' '}
                      <span className="set-radio-slider-footer-highlight">
                        {Number(queryMax?.spot) - formModal.spotPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {queryMax?.contract && (
              <div className="set-radio-form-item">
                <div className="set-radio-slider">
                  <div className="set-radio-slider-header">
                    {t`features_agent_index_5101415`}
                    <span className="set-radio-slider-header-highlight">{queryMax?.contract}%</span>
                  </div>
                  <div className="set-radio-slider-content">
                    <Slider
                      className="slider-wrap"
                      // onlyMarkValue
                      marks={generateRatio(queryMax?.contract)}
                      max={Number(queryMax?.contract)}
                      value={formModal.futuresPercent}
                      onChange={val => onSliderChange('futuresPercent', val)}
                      formatTooltip={formatTooltip}
                    />
                  </div>
                  <div className="set-radio-slider-footer">
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101414`}{' '}
                      <span className="set-radio-slider-footer-highlight">{formModal.futuresPercent}%</span>
                    </div>
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101357`}{' '}
                      <span className="set-radio-slider-footer-highlight">
                        {Number(queryMax?.contract) - formModal.futuresPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {queryMax?.borrowCoin && (
              <div className={cn('set-radio-form-item', { 'mb-4': touchId })}>
                <div className="set-radio-slider">
                  <div className="set-radio-slider-header">
                    {t`features_agent_index_5101416`}
                    <span className="set-radio-slider-header-highlight">{queryMax?.borrowCoin}%</span>
                  </div>
                  <div className="set-radio-slider-content">
                    <Slider
                      className="slider-wrap"
                      // onlyMarkValue
                      marks={generateRatio(queryMax?.borrowCoin)}
                      max={Number(queryMax?.borrowCoin)}
                      value={formModal.borrowMoneyPercent}
                      onChange={val => onSliderChange('borrowMoneyPercent', val)}
                      formatTooltip={formatTooltip}
                    />
                  </div>
                  <div className="set-radio-slider-footer">
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101414`}{' '}
                      <span className="set-radio-slider-footer-highlight">{formModal.borrowMoneyPercent}%</span>
                    </div>
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101357`}{' '}
                      <span className="set-radio-slider-footer-highlight">
                        {Number(queryMax?.borrowCoin) - formModal.borrowMoneyPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!touchId && (
              <div className="set-radio-form-item checkbox">
                <div className="set-radio-checkbox">
                  <Checkbox
                    checked={formModal.isDefault}
                    onChange={val => setFormModal({ ...formModal, isDefault: val })}
                  >
                    {({ checked }) => {
                      return (
                        <>
                          {checked ? (
                            <Icon name="login_verify_selected" />
                          ) : (
                            <Icon name="login_verify_unselected" hasTheme />
                          )}

                          <span className="checkbox-label">{t`features_agent_manage_index_5101438`}</span>
                        </>
                      )
                    }}
                  </Checkbox>
                </div>
              </div>
            )}
          </div>

          <div className="set-ratio-footer">
            <Button className="button" type="secondary" onClick={() => setIsShowSetRatio(false)}>
              {t`trade.c2c.cancel`}
            </Button>
            <Button
              className="button"
              type="primary"
              disabled={!touchId && !formModal.inviteName}
              onClick={() => AddOrUpdate()}
            >
              {t`components_chart_header_data_2622`}
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* 分享海报 */}
      <CustomModal style={{ width: 480 }} className={styles['agent-manage-modal']} visible={isShowPoster}>
        <div className="poster">
          <div className="poster-header">
            <div className="poster-close-icon">
              <Icon name="close" hasTheme fontSize={18} onClick={() => setIsShowPoster(false)} />
            </div>
          </div>

          <div className="poster-content">
            <div
              style={{
                background: `url("${oss_svg_image_domain_address}${'agent/poster_bj.png?x-oss-process=image/auto-orient,1/quality,q_50'}") center center no-repeat`,
                backgroundSize: 'cover',
              }}
              className="poster-image"
              ref={exportRef}
            >
              <div className="poster-header-title">
                <LazyImage
                  // 设置大小防止闪动
                  height={26}
                  width={26}
                  className="poster-header-logo"
                  src={imgWebLogo}
                  // LOGO 直接显示图片，这里不需要lazy load
                  visibleByDefault
                  whetherPlaceholdImg={false}
                />
                {'MONKEY Global'}
              </div>

              <div className="poster-text">{t`features_agent_index_5101417`}</div>
              <div className="poster-share">{t`features_agent_index_5101418`}</div>
              <div className="poster-qrcode">
                <QRCodeCanvas style={{ width: '80px', height: '80px' }} value={'asdasdasd'} />
              </div>
            </div>
          </div>

          {/* 下载海报功能暂时禁用 */}
          {/* <div className="poster-footer">
            <Button className="button" type="primary" onClick={() => exportAsImage(exportRef.current, 'test')}>
              {'下载海报'}
            </Button>
          </div> */}
        </div>
      </CustomModal>
      {/* 二维码分享 */}
      <CustomModal style={{ width: 320 }} className={styles['agent-manage-modal']} visible={isShowQrcode}>
        <div
          className="qrcode-share"
          style={{
            background: `url("${oss_svg_image_domain_address}${'agent/qr_code_bj.png?x-oss-process=image/auto-orient,1/quality,q_50'}") center center no-repeat`,
            backgroundSize: 'cover',
          }}
        >
          <div className="qrcode-share-close-icon">
            <Icon name="rebates_close" fontSize={32} onClick={() => setIsShowQrcode(false)} />
          </div>

          <div className="qrcode-share-header">
            <div className="qrcode-share-header-title">
              <LazyImage
                // 设置大小防止闪动
                height={26}
                width={26}
                className="qrcode-share-header-logo"
                src={imgWebLogo}
                // LOGO 直接显示图片，这里不需要lazy load
                visibleByDefault
                whetherPlaceholdImg={false}
              />
              {'MONKEY Global'}
            </div>

            <div className="qrcode-share-text">{t`features_agent_index_5101417`}</div>
          </div>

          <div className="qrcode-share-content">
            <div className="qrcode-share-qrcode">
              <QRCodeCanvas style={{ width: '248px', height: '248px' }} value={'sddsddsddsddsddsddsddsddsddsddsdd'} />
            </div>

            <div className="qrcode-share-invitation-code">
              {t`features_agent_index_5101364`}
              <span className="qrcode-share-invitation-code-highlight">{'SADKL235A'}</span>
            </div>
          </div>
        </div>
      </CustomModal>
    </section>
  )
}

export default UserPersonalCenterAgentManage
