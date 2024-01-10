import { memo, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Radio, TableColumnProps, Input, PaginationProps, Message } from '@nbit/arco'
import Table from '@/components/table'

import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import cn from 'classnames'
import {
  fetchC2CBlackList,
  fetchC2CBlackListCancel,
  fetchC2CFollowAdd,
  fetchC2CFollowList,
  fetchC2CFollowUnFollow,
  fetchC2CSetting,
  fetchGetC2CSetting,
} from '@/apis/c2c/center'
import { kycTypeKV } from '@/constants/c2c/center'
import { formatDate } from '@/helper/date'
import { BlackListType, ChatSettingType, FollowListType } from '@/typings/api/c2c/center'
import C2CEmpty from '../no-data'
import { ConfirmModal } from '../modal'
import { formatTime } from '../utils/time'
import { BaseUpload } from '../upload'

import styles from './user-setting.module.css'

const RadioGroup = Radio.Group
const TextArea = Input.TextArea

const tabs = () => [
  t`features_c2c_center_index_-ml7uvqfjty7lkyldbk4t`,
  t`features_c2c_center_user_setting_index_0sdmhi5iquog-y469-_41`,
]
const chatRadioLists = () => [
  t`features_c2c_center_user_setting_index_envea5xuf8q73gey96sxf`,
  t`features_c2c_center_user_setting_index_r_ghfarpqw9zsdz8ebjij`,
  t`features_c2c_center_user_setting_index_wojhrubfby1zmyqhy8gi6`,
]

enum TabEnum {
  follow = 0, // 关注
  blackList = 1, // 黑名单
}

enum ChatRadioEnum {
  text = 1, // 用文字
  image = 2, // 用图片
  none = 3, // 暂无设置
}

function UserSetting() {
  const [tabIndex, setTabIndex] = useState<TabEnum>(TabEnum.follow)
  const [chatRadioIndex, setChatRadioIndex] = useState<ChatRadioEnum>()
  const [c2cChatSetting, setC2cChatSetting] = useState<ChatSettingType>()
  const [chatWelcomeMessage, setChatWelcomeMessage] = useState<string>('')
  const [uploadImageUrl, setUploadImageUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [followList, setFollowList] = useState<FollowListType[]>([]) // 关注列表
  const [blackList, setBlackList] = useState<BlackListType[]>([]) // 黑名单列表
  const [curr, setCurr] = useState<FollowListType | BlackListType>() // 临时存储当前选中的对象，用于弹窗这部分的关联数据 (避免 for 循环重复查找数组里面的对象)
  const [followPagination, setFollowPagination] = useState<PaginationProps>({
    total: 1,
    current: 1,
    showTotal: true,
    showJumper: true,
    sizeCanChange: true,
    hideOnSinglePage: false,
  }) // 分页配置
  const [blackPagination, setBlackPagination] = useState<PaginationProps>({
    total: 1,
    current: 1,
    showTotal: true,
    showJumper: true,
    sizeCanChange: true,
    hideOnSinglePage: false,
  }) // 分页配置

  const [unFollowVisible, setUnFollowVisible] = useState<boolean>(false) // 关注弹窗
  const [unBlackVisible, setUnBlackVisible] = useState<boolean>(false) // 关注弹窗
  const [chatSettingVisible, setChatSettingVisible] = useState<boolean>(false) // 关注弹窗

  // 关联列表
  const c2cFollowList = async (pageNum = 1, pageSize = 10) => {
    const res = await fetchC2CFollowList({ pageNum, pageSize })

    if (res.isOk) {
      setFollowPagination({ ...followPagination, total: Number(res.data?.total) ?? 0 })
      setFollowList(res.data?.list.map(item => ({ ...item, isFollowed: true })) || [])
    }
  }

  // 关注
  const c2cFollowAdd = async userIds => {
    const res = await fetchC2CFollowAdd({ userIds })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_7pxmiwkyacurbquflepv2`)
      // 修改 followList 下 userId 的 isFollowed 属性
      const newFollowList = followList.map(item => {
        if (userIds.includes(item.uid)) {
          return { ...item, isFollowed: true }
        }
        return item
      })
      setFollowList(newFollowList)
    }
  }

  // 取消关注
  const c2cFollowUnFollow = async userIds => {
    const res = await fetchC2CFollowUnFollow({ userIds })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_fjsqvunsfhancmfftc6eh`)
      setUnFollowVisible(false)
      // 修改 followList 下 userId 的 isFollowed 属性
      const newFollowList = followList.map(item => {
        if (userIds.includes(item.uid)) {
          return { ...item, isFollowed: false }
        }
        return item
      })
      setFollowList(newFollowList)
      // c2cFollowList()
    }
  }

  // 黑名单列表
  const c2cBlackList = async (pageNum = 1, pageSize = 10) => {
    const res = await fetchC2CBlackList({ pageNum, pageSize })

    if (res.isOk) {
      setBlackPagination({ ...blackPagination, total: Number(res.data?.total) ?? 0 })
      setBlackList(res.data?.list || [])
    }
  }
  // 取消拉黑
  const c2cBlackListCancel = async userIds => {
    const res = await fetchC2CBlackListCancel({ userIds })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_nvuhsikc0aowy1rrtjk5j`)
      setUnBlackVisible(false)
      c2cBlackList()
    }
  }

  // get 设置
  const getC2CSetting = async () => {
    const res = await fetchGetC2CSetting({})

    if (res.isOk) {
      setC2cChatSetting(res.data)
      setChatRadioIndex(res.data?.welcomeInfoType)
      res.data?.welcomeInfoType === ChatRadioEnum.text && setChatWelcomeMessage(res.data?.welcomeInfoMessage)
      res.data?.welcomeInfoType === ChatRadioEnum.image && setUploadImageUrl(res.data?.welcomeInfoMessage)
    }
  }

  // post 设置
  const postC2CSetting = async () => {
    const params: any = {}
    params.welcomeInfoType = chatRadioIndex

    if (chatRadioIndex === ChatRadioEnum.text) {
      if (!chatWelcomeMessage) {
        Message.error(t`features_c2c_center_user_setting_index_vsoizzbdya38qvvlbnkrt`)
        return
      }
      params.welcomeInfoMessage = chatWelcomeMessage
    }

    if (chatRadioIndex === ChatRadioEnum.image) {
      if (!uploadImageUrl) {
        Message.error(t`features_c2c_center_user_setting_index_fblgbej0gj6rvuw_aputm`)
        return
      }
      params.welcomeInfoMessage = uploadImageUrl
    }

    const res = await fetchC2CSetting(params)

    if (res.isOk) {
      getC2CSetting()
      setChatSettingVisible(false)
    }
  }

  useEffect(() => {
    tabIndex === TabEnum.follow && c2cFollowList()
    tabIndex === TabEnum.blackList && c2cBlackList()
  }, [tabIndex])

  useEffect(() => {
    getC2CSetting()
    // c2cFollowList()
    // c2cBlackList()
  }, [])

  // 关注列表 列表
  const follow_columns: TableColumnProps[] = [
    {
      title: t`features_c2c_center_user_setting_index_i41yhipcvqoryru9bwdpa`,
      render: (col, record) => (
        <div className="table-ceil left">
          <div className="table-ceil-text text-left">{record.nickName || record.uid}</div>
          {false && (
            <div className="ml-2">
              <Icon name="rebates_edit" hasTheme fontSize={16} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_namuoujjeogg1vzfgxu8c`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{kycTypeKV(record.kycType) || '--'}</div>
        </div>
      ),
    },
    {
      title: t`features_agent_agency_center_invitation_details_index_5101541`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{formatDate(record.registerTime)}</div>
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_wszgodhgmqwf7nri1ie2s`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{`${
            record.completedOrderRate ? `${record.completedOrderRate} %` : '--'
          }`}</div>
        </div>
      ),
    },
    {
      title: t`order.columns.action`,
      render: (col, record) => (
        <div className="table-ceil">
          <div
            className="table-ceil-text brand"
            onClick={() => {
              setCurr(record)
              record.isFollowed ? c2cFollowUnFollow([record.uid]) : c2cFollowAdd([record.uid])
            }}
          >
            {record.isFollowed
              ? t`features_c2c_center_user_setting_index_fopjinpthqyesafbrpx8n`
              : `${t`features_c2c_center_index_-ml7uvqfjty7lkyldbk4t`}  TA`}
          </div>
        </div>
      ),
    },
  ]

  // 黑名单 列表
  const black_list_columns: TableColumnProps[] = [
    {
      title: t`features_c2c_center_user_setting_index_emahesfkkcqbwsfxvzlrc`,
      render: (col, record) => (
        <div className="table-ceil left">
          <div className="table-ceil-text text-left">{record.nickName || record.uid}</div>
          {false && (
            <div className="table-ceil-icon">
              <Icon name="rebates_edit" hasTheme fontSize={16} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_9xp0ad2u2eopcjcgg05hb`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{record.uid}</div>
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_wszgodhgmqwf7nri1ie2s`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{`${
            record.completedOrderRate ? `${record.completedOrderRate} %` : '--'
          }`}</div>
        </div>
      ),
    },
    {
      title: t`features_c2c_center_index_6quddedy7lu7vek5egofr`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{formatTime(record.avgPayTime) ?? '--' ?? '00′00″'}</div>
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_tr42cltyfmxrp772ifaqs`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{formatTime(record.avgConfirmTimeInside) ?? '--' ?? '00′00″'}</div>
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_tygbkgioevtjrowr98pj5`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{formatTime(record.avgConfirmTimeOutside) ?? '--' ?? '00′00″'}</div>
        </div>
      ),
    },
    {
      title: t`features_c2c_center_user_setting_index_poxenuxlwu70xa45jw1db`,
      render: (col, record) => (
        <div className="table-ceil">
          <div className="table-ceil-text">{formatDate(record.blockTime, 'YYYY-MM-DD')}</div>
        </div>
      ),
    },
    {
      title: t`order.columns.action`,
      render: (col, record) => (
        <div className="table-ceil">
          <div
            className="table-ceil-text brand"
            onClick={() => {
              setCurr(record)
              setUnBlackVisible(true)
            }}
          >
            {t`features_c2c_center_index_cvtja4txwjzkc6ziaxc4d`}
          </div>
        </div>
      ),
    },
  ]

  const onChangeFollowTable = async pagi => {
    const { current, pageSize } = pagi

    // if (current === pagination.current) return // 当前页不刷新数据

    setLoading(true)
    await c2cFollowList(current, pageSize)
    setFollowPagination({ ...followPagination, current })
    setLoading(false)
  }

  const onChangeBlackTable = async pagi => {
    const { current, pageSize } = pagi

    // if (current === pagination.current) return // 当前页不刷新数据

    setLoading(true)
    await c2cBlackList(current, pageSize)
    setBlackPagination({ ...blackPagination, current })
    setLoading(false)
  }

  return (
    <div className={styles.scope}>
      <div className="user-setting-container">
        <div className="user-setting-chat">
          <div className="chat-header">
            <div className="chat-title">{t`features_c2c_center_user_setting_index_lchv3pzskiqldaxs2hs5j`}</div>
            <div className="chat-edit" onClick={() => setChatSettingVisible(true)}>
              {t`assets.common.edit`}
            </div>
          </div>
          {c2cChatSetting?.welcomeInfoType && (
            <div className="mt-2">
              {c2cChatSetting?.welcomeInfoType === ChatRadioEnum.text && (
                <div className="text-box">{c2cChatSetting?.welcomeInfoMessage}</div>
              )}
              {c2cChatSetting?.welcomeInfoType === ChatRadioEnum.image && (
                <div className="img-box">
                  <LazyImage className="img" src={c2cChatSetting?.welcomeInfoMessage} />
                </div>
              )}
              {c2cChatSetting?.welcomeInfoType === ChatRadioEnum.none && (
                <div className="text-box">{t`features_c2c_center_user_setting_index_ytc8qbqhruia3orxbfb08`}</div>
              )}
            </div>
          )}
        </div>

        <div className="user-setting-tabs">
          {tabs().map((tab, index) => (
            <div className="tab-box" key={index} onClick={() => setTabIndex(index)}>
              <div className={cn('tab-item', { active: tabIndex === index })}>{tab}</div>
              {tabIndex === index && <div className="x-line"></div>}
            </div>
          ))}
        </div>

        {tabIndex === TabEnum.follow && (
          <div className="table-container">
            <Table
              className="table"
              rowKey={record => `${record.uid}`}
              loading={loading}
              columns={follow_columns}
              data={followList}
              border={false}
              scroll={{
                y: 226,
              }}
              onChange={onChangeFollowTable}
              pagination={followPagination}
              noDataElement={
                <C2CEmpty
                  imageName="icon_default_no_search"
                  text={t`features_c2c_center_user_setting_index_e4ormfdgxxk62shohzt2p`}
                />
              }
              renderPagination={paginationNode => (
                <div className="table-pagination">
                  <div>{paginationNode}</div>
                  <div className="table-pagination-extra">{t`features_agent_manage_index_5101442`}</div>
                </div>
              )}
            />
          </div>
        )}

        {tabIndex === TabEnum.blackList && (
          <div className="table-container">
            <Table
              className="table"
              rowKey={record => `${record.uid}`}
              loading={loading}
              columns={black_list_columns}
              data={blackList}
              border={false}
              scroll={{
                y: 226,
              }}
              onChange={onChangeBlackTable}
              pagination={blackPagination}
              noDataElement={
                <C2CEmpty
                  imageName="icon_default_no_search"
                  text={t`features_c2c_center_user_setting_index_xdqgrtks6obf5n9w_hgpf`}
                />
              }
              renderPagination={paginationNode => (
                <div className="table-pagination">
                  <div>{paginationNode}</div>
                  <div className="table-pagination-extra">{t`features_agent_manage_index_5101442`}</div>
                </div>
              )}
            />
          </div>
        )}
      </div>

      {/* 取消关注 弹窗 */}
      <ConfirmModal
        style={{ width: 360 }}
        visible={unFollowVisible}
        setVisible={setUnFollowVisible}
        cancelText={t`features_c2c_center_index_87a0ffk6ms-izh7lmfncc`}
        confirmText={t`user.field.reuse_17`}
        onSubmit={() => {
          c2cFollowUnFollow([curr?.uid])
        }}
      >
        <div className={styles.modal}>
          <div className="center">
            <Icon name="tips_icon" fontSize={78} />
          </div>
          <div className="content">
            <div className="text">
              {t`features_c2c_center_index_x2rd6n2dvyqyvanpvl6bc`} TA{' '}
              {t`features_c2c_center_index_nw0demkk5bgrcy4lwudal`}
            </div>
          </div>
        </div>
      </ConfirmModal>

      {/* 取消拉黑 弹窗 */}
      <ConfirmModal
        style={{ width: 360 }}
        visible={unBlackVisible}
        setVisible={setUnBlackVisible}
        confirmText={t`user.field.reuse_17`}
        onSubmit={() => {
          c2cBlackListCancel([curr?.uid])
        }}
      >
        <div className={styles.modal}>
          <div className="black-title center">{t`features_c2c_center_index_cvtja4txwjzkc6ziaxc4d`}</div>
          <div className="content">
            <div className="text">{t`features_c2c_center_index_c8pe7ep7fqzmpnam62de7`}</div>
          </div>
        </div>
      </ConfirmModal>

      {/* 聊天窗口欢迎语设置 弹窗 */}
      <ConfirmModal
        style={{ width: 444 }}
        visible={chatSettingVisible}
        setVisible={setChatSettingVisible}
        // cancelText={t`features_c2c_center_index_87a0ffk6ms-izh7lmfncc`}
        confirmText={t`user.field.reuse_10`}
        onSubmit={() => postC2CSetting()}
      >
        <div className={styles.modal}>
          <div className="title">{t`features_c2c_center_user_setting_index_lchv3pzskiqldaxs2hs5j`}</div>
          <div className="mt-6">
            <RadioGroup defaultValue={chatRadioIndex} onChange={i => setChatRadioIndex(i)}>
              {chatRadioLists().map((item, i) => (
                <Radio value={i + 1} key={i}>
                  {item}
                </Radio>
              ))}
            </RadioGroup>
          </div>
          <div className="content">
            <div className="textarea-box">
              {chatRadioIndex === ChatRadioEnum.text && (
                <TextArea
                  className="textarea"
                  style={{ minHeight: 140 }}
                  showWordLimit
                  maxLength={100}
                  value={chatWelcomeMessage}
                  onChange={e => setChatWelcomeMessage(e)}
                />
              )}

              {chatRadioIndex === ChatRadioEnum.image && (
                <BaseUpload value={uploadImageUrl} onChange={v => setUploadImageUrl(v)} />
              )}
            </div>
          </div>
        </div>
      </ConfirmModal>
    </div>
  )
}

export default memo(UserSetting)
