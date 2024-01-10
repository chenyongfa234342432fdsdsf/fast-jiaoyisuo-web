import { memo, ReactNode, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Avatar, Button, Message, Radio } from '@nbit/arco'

import LazyImage, { Type } from '@/components/lazy-image'
import { oss_area_code_image_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import Icon from '@/components/icon'
import cn from 'classnames'
import {
  fetchC2CBlackListAdd,
  fetchC2CBlackListCancel,
  fetchC2CFollowAdd,
  fetchC2CFollowUnFollow,
  fetchC2CUserProfile,
} from '@/apis/c2c/center'
import { C2CUserProfileResp } from '@/typings/api/c2c/center'
import { formatDate } from '@/helper/date'
import { getUserInfo } from '@/helper/cache'
import { usePageContext } from '@/hooks/use-page-context'
import { kycTypeKV } from '@/constants/c2c/center'
import { postAdvertCoinList } from '@/apis/c2c/advertise'
import { baseUserStore } from '@/store/user'
import C2CMyStatus from './my-status'
import AdAccount from './ad-account'
import CollPayManage from './coll-pay-manage'
import UserSetting from './user_setting'

import styles from './c2c-center.module.css'
import { ConfirmModal } from './modal'
import { formatTime } from './utils/time'
import { HisAdvertisementTable, MyAdvertisementTable } from '../c2c-advertisement/c2c-advertisement-table'

const RadioGroup = Radio.Group

/** Tabs 枚举 */
enum TabEnum {
  my_ad_order = 0, // 我的广告单
  ad_account = 1, // C2C 账户
  coll_pay_manage = 2, // 收付款管理
  user_setting = 3, // 个人设置
}

/** 拉黑原因 */
enum ReasonEnum {
  REASON_1 = 'REASON_1',
  REASON_2 = 'REASON_2',
  REASON_3 = 'REASON_3',
  REASON_4 = 'REASON_4',
  REASON_5 = 'REASON_5',
  OTHER = 'OTHER',
}

/** 商家枚举 */
enum MerchantEnum {
  isMerchant = 1, // 商家
  simple = 2, // 普通用户
}

type ListItemsType = {
  content: string | ReactNode
  tips: string | ReactNode
}

// 格式化 成交率
const formatCompletedOrderRate = (rate = 0) => {
  if (rate === 0) return '0%'

  return `${rate}%`
  // return `${rate * 100}%`
}

function C2CCenter() {
  // type 展示不同组件
  const {
    urlParsed: {
      search: { uid: otherUid = '', type = '0' },
    },
  } = usePageContext()

  const [touchTabIndex, setTouchTabIndex] = useState<TabEnum>(Number(type) || TabEnum.my_ad_order) // 兼容入口
  const [touchReason, setTouchReason] = useState<ReasonEnum | ''>('') // 拉黑原因
  const [isSelf, setIsSelf] = useState<boolean>(true) // 是否是自己
  // 是否发布过广告单
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [isLock, setIsLock] = useState<boolean>(false) // 请求锁
  const [userProfile, setUserProfile] = useState<C2CUserProfileResp>()
  const [listitems, setListitems] = useState<ListItemsType[]>([])
  const [followVisible, setFollowVisible] = useState<boolean>(false) // 取消拉黑并关注弹窗
  const [unFollowVisible, setUnFollowVisible] = useState<boolean>(false) // 关注弹窗
  const [blackVisible, setBlackVisible] = useState<boolean>(false) // 拉黑弹窗
  const [unBlackVisible, setUnBlackVisible] = useState<boolean>(false) // 取消拉黑弹窗
  const [reasonVisible, setReasonVisible] = useState<boolean>(false) // 拉黑原因弹窗

  const c2cUserProfile = async (uid = '') => {
    const res = await fetchC2CUserProfile(uid ? { uid } : {})

    if (res.isOk) {
      setUserProfile(res.data)
      setListitems([
        {
          content: res.data?.orderCount ?? '--' ?? '100',
          tips: t`features_c2c_center_index_3v73ku7b1baew-8x6bfpn`,
        },
        {
          content:
            (res.data?.completedOrderRate ? formatCompletedOrderRate(res.data?.completedOrderRate) : '--') ?? '98.3 %',
          tips: t`features_c2c_center_index_scyv6idpujfayx8p84ltd`,
        },
        {
          content: res.data?.customerCnt ?? '--' ?? '33',
          tips: t`features_c2c_center_index_xqfstg8cpvfpbtbbsomfs`,
        },
        {
          content: res.data?.totalOrderAmount ?? '--' ?? '10000.34',
          tips: t`features_c2c_center_index_hznlhb2_vjqb0pgrmt3ku`,
        },
        {
          content: formatTime(res.data?.avgPayTime) ?? '--' ?? '03′29″',
          tips: t`features_c2c_center_index_6quddedy7lu7vek5egofr`,
        },
        {
          content: formatTime(res.data?.avgConfirmTimeInside) ?? '--' ?? '07′54″',
          tips: (
            <div className="tips-box">
              <div className="left">{t`features_c2c_center_index_bl6asjiupwooelafs3sos`}</div>
              <div className="right green">{t`features_c2c_center_index_b-xzvpxaowued-9lzhztl`}</div>
            </div>
          ),
        },
        {
          content: formatTime(res.data?.avgConfirmTimeOutside) ?? '--' ?? '01′29″',
          tips: (
            <div className="tips-box">
              <div className="left">{t`features_c2c_center_index_bl6asjiupwooelafs3sos`}</div>
              <div className="right brand">{t`features_c2c_center_index_0n_wqepvujaj0_5sf7y--`}</div>
            </div>
          ),
        },
      ])
    }
  }

  // 判断是否发布过广告
  const c2cAdvertCoinList = async () => {
    const res = await postAdvertCoinList({ isActivityOnSheves: true })

    if (res.isOk) {
      setIsPublish((res.data || []).length > 0)
    }
  }

  // 关注
  const c2cFollowAdd = async userIds => {
    if (isLock) return

    setIsLock(true)
    const res = await fetchC2CFollowAdd({ userIds })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_7pxmiwkyacurbquflepv2`)
      c2cUserProfile(otherUid)
      setFollowVisible(false)
    }
    setIsLock(false)
  }

  // 取消关注
  const c2cFollowUnFollow = async userIds => {
    if (isLock) return

    setIsLock(true)
    const res = await fetchC2CFollowUnFollow({ userIds })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_fjsqvunsfhancmfftc6eh`)
      setUnFollowVisible(false)
      c2cUserProfile(otherUid)
    }
    setIsLock(false)
  }

  // 拉黑
  const c2cBlackListAdd = async (userId, reasonCode) => {
    if (isLock) return

    setIsLock(true)
    const res = await fetchC2CBlackListAdd({ userId, reasonCode })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_hh9jagamauu3dvyxfobsk`)
      setBlackVisible(false)
      setReasonVisible(false)
      setTouchReason('')
      c2cUserProfile(otherUid)
    }
    setIsLock(false)
  }

  // 取消拉黑
  const c2cBlackListCancel = async userIds => {
    if (isLock) return

    setIsLock(true)
    const res = await fetchC2CBlackListCancel({ userIds })

    if (res.isOk) {
      Message.success(t`features_c2c_center_index_nvuhsikc0aowy1rrtjk5j`)
      setUnBlackVisible(false)
      c2cUserProfile(otherUid)
    }
    setIsLock(false)
  }

  /**
   * 初始化函数
   */
  const onLoad = () => {
    let { uid } = getUserInfo()

    // replace to fastpay userInfo in public c2cMode
    uid = baseUserStore.getState().c2cModeUserInfo?.uid || uid

    if (!!otherUid && otherUid !== uid) {
      setIsSelf(false)
    } else {
      // 当前页路由跳转时 参数变化需要刷新
      setIsSelf(true)
    }

    c2cUserProfile(otherUid)
  }

  /**
   * url 参数变化时，初始化函数
   */
  useEffect(() => {
    onLoad()
    c2cAdvertCoinList()
    setTouchTabIndex(Number(type))
  }, [otherUid, type])

  useEffect(() => {
    onLoad()
  }, [])

  const tabs = [
    t`features_c2c_center_index_0g2kxtcftikghfnczwglu`,
    t`features/assets/common/transfer/index-5`,
    t`features_c2c_center_index_1h9vx-jb8nvuw1fjjaszq`,
    t`features_c2c_center_index_2byddooiaomhsxeevpvvj`,
  ]

  const reasonList = [
    { label: t`features_c2c_center_index_rv4covyi1y-y2igvltzq-`, value: ReasonEnum.REASON_1 },
    { label: t`features_c2c_center_index_gtmln1blnipaewjn-pqtg`, value: ReasonEnum.REASON_2 },
    { label: t`features_c2c_center_index_vl-2bzyyvu89f7rxakjun`, value: ReasonEnum.REASON_3 },
    { label: t`features_c2c_center_index_xb0ukcpa6rl6nn2eov_sh`, value: ReasonEnum.REASON_4 },
    { label: t`features_c2c_center_index_xxfasjpdwkakjqbpfsgnr`, value: ReasonEnum.REASON_5 },
    { label: t`assets.enum.tradeRecordType.other`, value: ReasonEnum.OTHER },
  ]

  const getItem = (key: number, content: string | ReactNode, tips: string | ReactNode) => (
    <div key={key} className="item">
      <div className="content">{content}</div>
      <div className="tips">{tips}</div>
    </div>
  )

  const getReasonListItem = items => (
    <RadioGroup className="w-full" value={touchReason} onChange={v => setTouchReason(v)}>
      {items.map((item, i) => (
        <div key={i} className="reason-list-item">
          <div className="list-item-text">{item.label}</div>
          <div>
            <Radio value={item.value}>
              {({ checked }) => {
                return <Icon name={checked ? 'agreement_select' : 'agreement_unselect'} fontSize={12} />
              }}
            </Radio>
          </div>
        </div>
      ))}
    </RadioGroup>
  )

  /** 拉黑 & 取消拉黑操作 */
  const handleBlackFn = () => {
    userProfile?.blocked || false
      ? setUnBlackVisible(true)
      : userProfile?.followed || false
      ? setBlackVisible(true)
      : setReasonVisible(true)
  }

  /** 关注 & 取消关注操作 */
  const handleFollowFn = () => {
    userProfile?.followed || false
      ? c2cFollowUnFollow([otherUid])
      : !userProfile?.blocked || false
      ? c2cFollowAdd([otherUid])
      : setFollowVisible(true)
  }

  return (
    <div className={styles.scope}>
      <div className="c2c-center-container">
        <div className="c2c-center-header">
          <div className="header-box">
            <div className="left">
              <div className="avatar">
                <Avatar size={50}>
                  {!userProfile?.avatarPath ? (
                    <Icon name="user_head" hasTheme fontSize={32} />
                  ) : (
                    <LazyImage src={`${oss_svg_image_domain_address}`} width={50} height={50} />
                  )}
                </Avatar>
              </div>
              <div className="text-content">
                <div className={cn('name', { grey: !userProfile?.nickName })}>
                  {userProfile?.nickName ?? t`features_c2c_center_index_x2srojubldairubsdtzys`}
                  {userProfile?.isMerchant === MerchantEnum.isMerchant && (
                    <div className="ml-2">
                      <LazyImage
                        className="img"
                        imageType={Type.svg}
                        src={`${oss_svg_image_domain_address}user_verified`}
                      />
                    </div>
                  )}
                </div>
                <div className="kyc">
                  {userProfile?.isMerchant === MerchantEnum.isMerchant && (
                    <span className="mr-8">{t`features_c2c_center_index_q5h8ciugddnel7fibiwkk`}</span>
                  )}
                  KYC {t`features_c2c_center_index_cpfgwpemrsd5bosnwf2nm`}
                  {kycTypeKV(userProfile?.kycType ?? 0)}
                </div>
                <div className="info">
                  {userProfile?.regCountryCd && (
                    <div className="country">
                      <LazyImage
                        className="img"
                        src={`${oss_area_code_image_domain_address}${userProfile?.regCountryCd}.png`}
                      />
                      {userProfile?.regCountryName}
                    </div>
                  )}
                  <div className="time">
                    {t`features_agent_agency_center_invitation_details_index_5101541`}{' '}
                    {formatDate(userProfile?.registerTime, 'YYYY-MM-DD') || ''}
                  </div>
                </div>
              </div>
            </div>
            {!isSelf && (
              <div className="right">
                <Button
                  className={cn('black', { disabled: userProfile?.blocked ?? false })}
                  type="secondary"
                  onClick={() => handleBlackFn()}
                >
                  {userProfile?.blocked
                    ? t`features_c2c_center_index_jy4_pb2ohwzptbmqvrvjm`
                    : t`features_c2c_center_index_wbbkfankpqxsgi6hsjila`}
                </Button>
                <Button
                  className={cn('follow', { disabled: userProfile?.followed ?? false })}
                  type="primary"
                  onClick={() => handleFollowFn()}
                >
                  {userProfile?.followed
                    ? t`features_c2c_center_index_bfrkb83be1ikylsrdxtmf`
                    : `${t`features_c2c_center_index_-ml7uvqfjty7lkyldbk4t`}  TA`}
                </Button>
              </div>
            )}
          </div>
        </div>

        {isPublish && isSelf && (
          <div className="mt-8">
            <C2CMyStatus />
          </div>
        )}

        {/* 成交单数等数据总览 */}
        <div className="window-items">
          {listitems.map((item, index) => {
            // 查看他人时，隐藏交易总额
            if (!isSelf && index === 3) {
              return
            }

            // 服务人数为 null 时 隐藏
            if (index === 2 && item.content === '--') {
              return
            }

            return getItem(index, item.content, item.tips)
          })}
        </div>

        {/* 横线 */}
        <div className="xline"></div>

        {/* Tab 我的广告单 & C2C 账户 & 收付款管理 & 个人设置 */}
        {isSelf && (
          <div className="tabs">
            {tabs.map((tab, i) => (
              <div
                key={i}
                className={cn('tab-item', { active: touchTabIndex === i })}
                onClick={() => setTouchTabIndex(i)}
              >
                {tab}
              </div>
            ))}
          </div>
        )}

        {!isSelf && <div className="other-text">TA {t`features_c2c_center_index_b0zala8pjy5g7vprot0jl`}</div>}
        {!isSelf && !userProfile?.blocked && <HisAdvertisementTable uid={otherUid} />}

        {!isSelf && userProfile?.blocked && (
          <div className="block-box">
            <LazyImage
              className="img"
              // whetherManyBusiness
              imageType={Type.png}
              hasTheme
              src={`${oss_svg_image_domain_address}icon_default_blocked`}
              width={104}
              height={92}
            />
            <div className="block-text">{t`features_c2c_center_index_r8znhqtpzpyusxmssxijv`}</div>
          </div>
        )}
        {/* 我的广告单 */}
        {isSelf && touchTabIndex === TabEnum.my_ad_order && <MyAdvertisementTable />}
        {/* C2C 账户 */}
        {isSelf && touchTabIndex === TabEnum.ad_account && <AdAccount />}
        {/* 收付款管理 */}
        {isSelf && touchTabIndex === TabEnum.coll_pay_manage && <CollPayManage />}
        {/* 个人设置 */}
        {isSelf && touchTabIndex === TabEnum.user_setting && <UserSetting />}
      </div>

      {/* 取消拉黑并且关注 弹窗 */}
      <ConfirmModal
        style={{ width: 360 }}
        visible={followVisible}
        setVisible={setFollowVisible}
        cancelText={t`features_c2c_center_index_87a0ffk6ms-izh7lmfncc`}
        confirmText={t`user.field.reuse_17`}
        onSubmit={() => {
          c2cBlackListCancel([otherUid]) // 取消拉黑
          c2cFollowAdd([otherUid]) // 关注
        }}
      >
        <div className={styles.modal}>
          <div className="center">
            <Icon name="tips_icon" fontSize={78} />
          </div>
          <div className="content">
            <div className="text">
              {t`features_c2c_center_index_j2x2osuis59tgyctgkcvz`} TA{' '}
              {t`features_c2c_center_index_h6a8xkeg66lukoh79dtvc`} TA?
            </div>
          </div>
        </div>
      </ConfirmModal>

      {/* 取消关注 弹窗 */}
      <ConfirmModal
        style={{ width: 360 }}
        visible={unFollowVisible}
        setVisible={setUnFollowVisible}
        cancelText={t`features_c2c_center_index_87a0ffk6ms-izh7lmfncc`}
        confirmText={t`user.field.reuse_17`}
        onSubmit={() => {
          c2cFollowUnFollow([otherUid])
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
          c2cBlackListCancel([otherUid])
        }}
      >
        <div className={styles.modal}>
          <div className="center">
            <Icon name="tips_icon" fontSize={78} />
          </div>
          {/* <div className="black-title center">{t`features_c2c_center_index_cvtja4txwjzkc6ziaxc4d`}</div> */}
          <div className="content">
            <div className="text">{t`features_c2c_center_index_c8pe7ep7fqzmpnam62de7`}</div>
          </div>
        </div>
      </ConfirmModal>

      {/* 取消关注并且拉黑 弹窗 */}
      <ConfirmModal
        style={{ width: 360 }}
        visible={blackVisible}
        setVisible={setBlackVisible}
        cancelText={t`features_c2c_center_index_87a0ffk6ms-izh7lmfncc`}
        confirmText={t`user.field.reuse_17`}
        onSubmit={() => {
          setReasonVisible(true)
          setBlackVisible(false)
        }}
      >
        <div className={styles.modal}>
          <div className="center">
            <Icon name="tips_icon" fontSize={78} />
          </div>
          <div className="content">
            <div className="text">
              {t`features_c2c_center_index_j2x2osuis59tgyctgkcvz`} TA{' '}
              {t`features_c2c_center_index_cpcvfblplxg9vvroaxgdn`} TA?
            </div>
          </div>
        </div>
      </ConfirmModal>

      {/* 选择拉黑原因 弹窗 */}
      <ConfirmModal
        style={{ width: 444 }}
        visible={reasonVisible}
        setVisible={setReasonVisible}
        // cancelText={t`features_c2c_center_index_87a0ffk6ms-izh7lmfncc`}
        confirmText={t`user.field.reuse_17`}
        confirmDisabled={touchReason === ''}
        onSubmit={() => {
          if (!userProfile?.followed || false) {
            c2cBlackListAdd(otherUid, touchReason)
          } else {
            c2cBlackListAdd(otherUid, touchReason) // 加入黑名单
            c2cFollowUnFollow([otherUid]) // 取消关注
          }
        }}
      >
        <div className={styles.modal}>
          <div className="title">{t`features_c2c_center_index_05uxxmxism85aoae_5sb3`}</div>
          <div className="content">{getReasonListItem(reasonList)}</div>
        </div>
      </ConfirmModal>
    </div>
  )
}

export default memo(C2CCenter)
