import { ReactNode, useState, useRef, useEffect } from 'react'
import { useLayoutStore } from '@/store/layout'
import { useCommonStore } from '@/store/common'
import { Button, Popconfirm, Tooltip, Alert, Slider, Message, Input } from '@nbit/arco'
import { concat, isNumber } from 'lodash'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import cn from 'classnames'
import Icon from '@/components/icon'
import Link from '@/components/link'
import LazyImage from '@/components/lazy-image'
import { useCopyToClipboard } from 'react-use'
import { QRCodeCanvas } from 'qrcode.react'
import {
  fetchAgentInviteAddRebates,
  fetchAgentInviteQueryMax,
  fetchAgentInviteQueryRebates,
  fetchAgentInviteQuerySys,
  fetchManageInvitequery,
  fetchManageInviteUpdate,
} from '@/apis/agent/manage'
import { getCodeDetailListBatch } from '@/apis/common'
import { AgentInviteQueryMaxResp, AgentManageInviteQueryResp } from '@/typings/api/agent/manage'
import { AgentCodeEnum, InviteQueryRespEnum, isShowBannerEnum, JoinStatusEnum } from '@/constants/agent/agent'
import exportAsImage from './utils/exportAsImage'
import CustomModal from './modal'
import { getHost } from './utils/host'
import { generateRatio } from './utils/generateRatio'
import styles from './index.module.css'

type CardItemType = {
  icon: ReactNode
  label: string
  text: string
}

type AddRebatesType = {
  productCd: string
  selfScale: number
  childScale: number
}

enum agtLevelEnum {
  top = 1, // 顶级代理商
  simple = 2, // 普通代理商
}

type LockStatusType = {
  isLock: boolean
  agtLevel: agtLevelEnum // 代理商级别：1 顶级代理商 2 普通代理商 用于判断弹窗 与 后端无关
}

function formatTooltip(val) {
  return <span>{val}%</span>
}

/** 代理商产品线枚举值 */
const ProductEnumKV = key =>
  ({
    spot: t`constants_assets_index_2741`,
    contract: t`constants_assets_index_2742`,
    borrowCoin: t`features_agent_agency_center_revenue_details_index_5101519`,
  }[key])

function UserPersonalCenterAgent() {
  const exportRef = useRef<HTMLDivElement | null>(null)

  const { headerData } = useLayoutStore()
  const { locale } = useCommonStore()

  const { imgWebLogo } = headerData || { imgWebLogo: '' }

  const [invitName, setInvitName] = useState<string>('') // 邀请码名称
  const [maxValue, setMaxValue] = useState<number>(0)
  const [isShow, setShow] = useState<boolean>(false)
  const [lockStatus, setLockStatus] = useState<LockStatusType>({ isLock: true, agtLevel: agtLevelEnum.top }) // 没有设置比例之前不能进行分享链接操作，
  const [queryMax, setQueryMax] = useState<AgentInviteQueryMaxResp>() // 代理商最大可设置返佣比例
  const [querySim, setQuerySim] = useState<AgentInviteQueryMaxResp>() // 普通邀请码海报比例
  const [queryRebates, setQueryRebates] = useState<AgentInviteQueryMaxResp>() // 海报比例
  const [querySys, setQuerySys] = useState<AgentInviteQueryMaxResp>() // 系统最大可设置返佣比例
  const [inviteQuery, setInviteQuery] = useState<AgentManageInviteQueryResp>() // 查询邀请码
  const [isShowTips, setIsShowTips] = useState<boolean>(false)
  const [isShowSetRatio, setIsShowSetRatio] = useState<boolean>(false)
  const [isShowPoster, setIsShowPoster] = useState<boolean>(false)
  const [isShowQrcode, setIsShowQrcode] = useState<boolean>(false)
  const [showApplySuccessModal, setShowApplySuccessModal] = useState<boolean>(false)

  const [code, setCode] = useState<number>(AgentCodeEnum.agent)
  const [spotPercent, setSpotPercent] = useState(0)
  const [futuresPercent, setFuturesPercent] = useState(0)
  const [borrowMoneyPercent, setBorrowMoneyPercent] = useState(0)

  const [state, copyToClipboard] = useCopyToClipboard()

  const handleCopy = (key: string) => {
    copyToClipboard(key)
    state.error ? Message.error(t`user.secret_key_02`) : Message.success(t`user.secret_key_01`)
  }

  const invitNameOnchange = v => setInvitName(v)

  const agentInviteQueryMax = async () => {
    const res = await fetchAgentInviteQueryMax({})
    if (res.isOk) {
      setQueryMax(res.data)
    }
  }

  const agentInviteQueryRebates = async () => {
    const res = await fetchAgentInviteQueryRebates({})
    if (res.isOk) {
      setQueryRebates(res.data)
    }
  }

  const agentInviteQuerySys = async () => {
    const res = await fetchAgentInviteQuerySys({})
    if (res.isOk) {
      const data = res.data
      let mv = 0
      Object.keys(data ?? {}).map(key => (mv = Math.max(mv, (data ?? {})[key])))

      setMaxValue(mv)
      setQuerySys(res.data)
    }
  }

  const getManageInvitequery = async () => {
    setLockStatus({ ...lockStatus, isLock: false })
    const res = await fetchManageInvitequery({})
    if (res.isOk && res.data) {
      res.data.agtInvitationCode && agentInviteQueryMax()
      setInviteQuery(res.data)
      setInvitName((res.data.agtInvitationCode && res.data.agtInvitationCode.invitationCodeName) || '')

      const querySimTmp: any = {}
      for (const item of (res.data.invitationCode || {}).scaleList || []) {
        if (item.productCd === '1') {
          querySimTmp.spot = item?.selfScale
        } else if (item.productCd === '2') {
          querySimTmp.contract = item?.selfScale
        } else if (item.productCd === '3') {
          querySimTmp.borrowCoin = item?.selfScale
        }
      }
      setQuerySim(querySimTmp as AgentInviteQueryMaxResp)

      if (
        res.data.agtInvitationCode &&
        res.data.agtInvitationCode.scaleList &&
        res.data.agtInvitationCode.scaleList[0] &&
        !isNumber(res.data.agtInvitationCode.scaleList[0].childScale)
      ) {
        if (isNumber(res.data.agtApplicationResp.approvalStatrusInd)) {
          setShowApplySuccessModal(true)
          setLockStatus({ ...lockStatus, isLock: true, agtLevel: agtLevelEnum.simple })
          return
        }
        setIsShowTips(true)
        setLockStatus({ ...lockStatus, isLock: true, agtLevel: agtLevelEnum.simple })
      }
      !res.data.agtInvitationCode && setCode(AgentCodeEnum.ordinary)
    }
  }

  const getManageInviteUpdate = async () => {
    const res = await fetchManageInviteUpdate({
      invitationCodeName: invitName,
      invitationCode: inviteQuery?.agtInvitationCode.invitationCode,
      id: inviteQuery?.agtInvitationCode.id as string,
    })
    if (res.isOk) {
      getManageInvitequery()
    }
  }

  const agentInviteAddRebates = async () => {
    const scales: AddRebatesType[] = []

    queryMax?.spot &&
      scales.push({
        productCd: '1',
        selfScale: spotPercent,
        childScale: Number(queryMax?.spot) - spotPercent,
      })
    queryMax?.contract &&
      scales.push({
        productCd: '2',
        selfScale: futuresPercent,
        childScale: Number(queryMax?.contract) - futuresPercent,
      })
    queryMax?.borrowCoin &&
      scales.push({
        productCd: '3',
        selfScale: borrowMoneyPercent,
        childScale: Number(queryMax?.borrowCoin) - borrowMoneyPercent,
      })

    const res = await fetchAgentInviteAddRebates({
      scales,
    })

    if (res.isOk) {
      getManageInvitequery()
      setIsShowTips(false)
      setShowApplySuccessModal(false)
      setIsShowSetRatio(false)
    }
  }

  useEffect(() => {
    getManageInvitequery()
    agentInviteQueryRebates()
    agentInviteQuerySys()
  }, [])

  /**
   * 显示隐藏 申请代理商 banner
   * @returns boolean true: 显示 false: 隐藏
   */
  const isShowBanner = () => {
    if (inviteQuery?.isShowBanner === isShowBannerEnum.show) {
      return true
    }

    // // 审核未通过 的情况  approvalStatrusInd 有可能为 null.   0: 待审核，如果不强制匹配类型，会出 bug
    // if (
    //   inviteQuery?.agtApplicationResp &&
    //   isNumber(inviteQuery?.agtApplicationResp.approvalStatrusInd) &&
    //   inviteQuery?.agtApplicationResp.approvalStatrusInd !== JoinStatusEnum.pass
    // ) {
    //   return true
    // }

    return false
  }

  /**
   * 处理没有设置比例时的弹窗显示状态
   */
  const lockStatusFn = (fn: () => void) => {
    // 需要判断 code 状态 代理商 弹窗不同
    // 代理商
    if (code === AgentCodeEnum.agent) {
      if (lockStatus.isLock) {
        lockStatus.agtLevel === agtLevelEnum.top ? setShowApplySuccessModal(true) : setIsShowTips(true)
        return
      }
    }
    fn()
  }

  function onSpotSliderChange(_percent) {
    setSpotPercent(_percent)
  }

  function onFuturesChange(_percent) {
    setFuturesPercent(_percent)
  }

  function onBorrowMoneyChange(_percent) {
    setBorrowMoneyPercent(_percent)
  }

  const getCardItem = ({ icon, label, text }: CardItemType) => {
    return (
      <div className="share-card-item">
        <div className="share-card-item-header">{icon}</div>
        <div className="share-card-item-content">{label}</div>
        <div className="share-card-item-footer">
          <p>{text}</p>
        </div>
      </div>
    )
  }

  // 渲染不是代理商的文本
  const renderNoAgtText = () => {
    return <span>{t`features_agent_index_wcynkydb8k4sjuvtsuvnx`}</span>
  }

  const renderProductSpan = (objects = {}) => {
    const items = Object.keys(objects).filter(key => objects[key])

    return items.map((key, i) => (
      <span key={i}>
        {' '}
        {ProductEnumKV(key)} {objects[key]}%{items.length - 1 !== i && <span>、</span>}{' '}
      </span>
    ))
  }

  // 判断显示文本还是显示链接
  const renderTextOrLink = () => {
    if (code === AgentCodeEnum.agent) {
      if (lockStatus.isLock) {
        return false
      }
    }

    return true
  }

  return (
    <section className={`personal-center-agent ${styles.scoped}`}>
      <div
        className="header"
        style={{
          background: `url("${oss_svg_image_domain_address}agent/rebates_bj.png?x-oss-process=image/auto-orient,1/quality,q_50") center center/cover no-repeat`,
        }}
      >
        <div className="left-box">
          <div className="text1">{t`features_agent_index_5101353`}</div>
          <div className="text2">
            {t`features_user_login_index_5101344`} {headerData?.businessName} {t`features_agent_index_5101354`}{' '}
            {maxValue}% {t`features_agent_index_5101355`}
          </div>
        </div>
        <div className="r-box">
          <div className="right-box">
            <div className="nav-t">
              <div className="btn-box">
                {/* 兼容后端数据为 null 的情况 */}
                {inviteQuery?.agtInvitationCode &&
                  inviteQuery?.agtInvitationCode.invitationCodeName &&
                  (inviteQuery?.agtInvitationCode.scaleList ? (
                    <Tooltip
                      content={
                        <div className={styles['pop-card-text']}>
                          {inviteQuery?.agtInvitationCode.scaleList.map((item, i) => {
                            if (item.productCd === '1') {
                              return (
                                <p key={i}>
                                  {t`features_agent_index_5101356`} {item.selfScale}% /{' '}
                                  {t`features_agent_index_5101357`} {item.childScale ?? 0}%
                                </p>
                              )
                            }
                            if (item.productCd === '2') {
                              return (
                                <p key={i}>
                                  {t`features_agent_index_5101358`} {item.selfScale}% /{' '}
                                  {t`features_agent_index_5101357`} {item.childScale ?? 0}%
                                </p>
                              )
                            }
                            if (item.productCd === '3') {
                              return (
                                <p key={i}>
                                  {t`features_agent_index_5101359`} {item.selfScale}% /{' '}
                                  {t`features_agent_index_5101357`} {item.childScale ?? 0}%
                                </p>
                              )
                            }

                            return <p key={i}></p>
                          })}
                        </div>
                      }
                    >
                      <div
                        className={cn('toogle-btn', {
                          active: code === AgentCodeEnum.agent,
                        })}
                        onClick={() => setCode(AgentCodeEnum.agent)}
                      >
                        {t`features_agent_index_5101360`}
                      </div>
                    </Tooltip>
                  ) : (
                    <div
                      className={cn('toogle-btn', {
                        active: code === AgentCodeEnum.agent,
                      })}
                      onClick={() => setCode(AgentCodeEnum.agent)}
                    >
                      {t`features_agent_index_5101360`}
                    </div>
                  ))}
                {/* 兼容后端数据为 null 的情况 */}
                {inviteQuery?.invitationCode &&
                  inviteQuery?.invitationCode.invitationCode &&
                  (inviteQuery?.invitationCode.scaleList ? (
                    <Tooltip
                      content={
                        <div className={styles['pop-card-text']}>
                          {inviteQuery?.invitationCode.scaleList.map((item, i) => {
                            if (item.productCd === '1') {
                              return (
                                <p key={i}>
                                  {t`features_agent_index_5101361`} {item.selfScale}%
                                </p>
                              )
                            }
                            if (item.productCd === '2') {
                              return (
                                <p key={i}>
                                  {t`features_agent_index_5101362`} {item.selfScale}%
                                </p>
                              )
                            }
                            if (item.productCd === '3') {
                              return (
                                <p key={i}>
                                  {t`features_agent_index_5101363`} {item.selfScale}%
                                </p>
                              )
                            }

                            return <p key={i}></p>
                          })}
                        </div>
                      }
                    >
                      <div
                        className={cn('toogle-btn', {
                          active: code === AgentCodeEnum.ordinary,
                        })}
                        onClick={() => setCode(AgentCodeEnum.ordinary)}
                      >
                        {!(inviteQuery?.agtInvitationCode && inviteQuery?.agtInvitationCode.invitationCodeName) && (
                          <span>{t`constants_trade_7`}</span>
                        )}
                        {t`features_agent_index_5101364`}
                      </div>
                    </Tooltip>
                  ) : (
                    <div
                      className={cn('toogle-btn', {
                        active: code === AgentCodeEnum.ordinary,
                      })}
                      onClick={() => setCode(AgentCodeEnum.ordinary)}
                    >
                      {!(inviteQuery?.agtInvitationCode && inviteQuery?.agtInvitationCode.invitationCodeName) && (
                        <span>{t`constants_trade_7`}</span>
                      )}
                      {t`features_agent_index_5101364`}
                    </div>
                  ))}
              </div>
              <div className="r-tips">
                {code === AgentCodeEnum.agent &&
                  inviteQuery?.agtInvitationCode &&
                  inviteQuery?.agtInvitationCode.invitationCodeName &&
                  (lockStatus.isLock ? (
                    <div onClick={() => lockStatusFn(() => {})}>
                      <span>{t`features_agent_index_5101365`}</span>
                      <Icon className="next-icon" name="help_center_more" fontSize={16} />
                    </div>
                  ) : (
                    <Link href={'/agent/manage'}>
                      <span>{t`features_agent_index_5101365`}</span>
                      <Icon className="next-icon" name="help_center_more" fontSize={16} />
                    </Link>
                  ))}
              </div>
            </div>
            {code === AgentCodeEnum.agent && (
              <div className="mt-8 form-item">
                <Input
                  readOnly
                  prefix={<div className="left-box-formitem">{t`features_agent_index_5101366`}</div>}
                  suffix={
                    <div className="right-box-formitem">
                      {/* {t`features_agent_index_5101367`} */}
                      <span className="right-box-text">
                        {inviteQuery &&
                          inviteQuery[InviteQueryRespEnum[code]] &&
                          inviteQuery[InviteQueryRespEnum[code]].invitationCodeName}
                      </span>
                      <span className="ml-2">
                        <Icon
                          name="rebates_edit"
                          hasTheme
                          fontSize={16}
                          onClick={() =>
                            lockStatusFn(() => {
                              setShow(true)
                            })
                          }
                        />
                      </span>
                    </div>
                  }
                />
              </div>
            )}
            <div className="mt-6 form-item">
              <Input
                readOnly
                prefix={<div className="left-box-formitem">{t`features_agent_index_5101364`}</div>}
                suffix={
                  <div className="right-box-formitem">
                    {renderTextOrLink() ? (
                      <span className="right-box-text">
                        {inviteQuery &&
                          inviteQuery[InviteQueryRespEnum[code]] &&
                          inviteQuery[InviteQueryRespEnum[code]].invitationCode}
                      </span>
                    ) : (
                      <span className="right-box-links brand" onClick={() => setIsShowSetRatio(true)}>
                        {t`features_agent_index_rnzyfwotf5ufdb_ytalcz`}
                      </span>
                    )}
                    <span className="ml-2">
                      <Icon
                        name="copy"
                        hasTheme
                        fontSize={16}
                        onClick={() =>
                          lockStatusFn(() => {
                            handleCopy(
                              inviteQuery &&
                                inviteQuery[InviteQueryRespEnum[code]] &&
                                inviteQuery[InviteQueryRespEnum[code]].invitationCode
                            )
                          })
                        }
                      />
                    </span>
                  </div>
                }
              />
            </div>
            <div className="mt-6 form-item">
              <Input
                readOnly
                prefix={<div className="left-box-formitem">{t`features_agent_index_5101368`}</div>}
                suffix={
                  <div className="right-box-formitem">
                    {renderTextOrLink() ? (
                      <span className="right-box-links">
                        {`${getHost()}/${locale}/register?invitationCode=${
                          inviteQuery &&
                          inviteQuery[InviteQueryRespEnum[code]] &&
                          inviteQuery[InviteQueryRespEnum[code]].invitationCode
                        }`}
                      </span>
                    ) : (
                      <span className="right-box-links brand" onClick={() => setIsShowSetRatio(true)}>
                        {t`features_agent_index_rnzyfwotf5ufdb_ytalcz`}
                      </span>
                    )}
                    <span className="ml-2">
                      <Icon
                        name="copy"
                        hasTheme
                        fontSize={16}
                        onClick={() =>
                          lockStatusFn(() => {
                            handleCopy(
                              `${getHost()}/${locale}/register?invitationCode=${
                                inviteQuery &&
                                inviteQuery[InviteQueryRespEnum[code]] &&
                                inviteQuery[InviteQueryRespEnum[code]].invitationCode
                              }`
                            )
                          })
                        }
                      />
                    </span>
                  </div>
                }
              />
            </div>
            {/* 分享海报 & 分享二维码 */}
            {/* <div className="mt-8">
              <div className="flex">
                <Popconfirm
                  className={styles.agent}
                  trigger="hover"
                  title={
                    <div className={styles['pop-card-text']}>
                      <p>{'现货返佣 我'} 30% / {'好友'} 10%</p>
                      <p>{'合约返佣 我'} 30% / {'好友'} 10%</p>
                      <p>{'借币返佣 我'} 30% / {'好友'} 10%</p>
                    </div>
                  }
                  icon={null}
                  cancelButtonProps={{ style: { display: 'none' } }}
                  okButtonProps={{ style: { display: 'none' } }}
                >
                  <Button onClick={() => setIsShowPoster(true)} className="button" type="primary">
                    {'邀请好友'}
                  </Button>
                </Popconfirm>
                <Button
                  onClick={() => setIsShowQrcode(true)}
                  className="qrcode"
                  type="secondary"
                  icon={<Icon name="rebates_drawing-qr" hasTheme fontSize={22} onClick={() => {}} />}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* 不知道后端什么情况下是 null 值，所以全部做兼容，防止意外 */}
      {isShowBanner() && (
        <Link
          href={
            inviteQuery?.agtApplicationResp && isNumber(inviteQuery?.agtApplicationResp.approvalStatrusInd)
              ? '/agent/join'
              : '/agent/apply'
          }
        >
          <div className="agent-banner">
            <LazyImage
              hasTheme
              width={1200}
              height={120}
              className="agent-banner-img"
              src={`${oss_svg_image_domain_address}${'agent/apply_bj.png'}`}
            />
            <div className="agent-banner-box">
              <div className="agent-banner-text">{t`features_agent_index_5101369`}</div>
              <div className="agent-banner-text2">{t`features_agent_index_5101370`}</div>
              <div>
                <Icon className="next-icon" name="help_center_more" fontSize={24} />
              </div>
            </div>
            {inviteQuery?.agtApplicationResp &&
              isNumber(inviteQuery?.agtApplicationResp.approvalStatrusInd) &&
              inviteQuery?.agtApplicationResp.approvalStatrusInd !== JoinStatusEnum.pass && (
                <div
                  className={cn('agent-banner-tips', {
                    'no-pass':
                      inviteQuery?.agtApplicationResp &&
                      inviteQuery?.agtApplicationResp.approvalStatrusInd === JoinStatusEnum.noPass,
                  })}
                >
                  {inviteQuery?.agtApplicationResp &&
                  inviteQuery?.agtApplicationResp.approvalStatrusInd === JoinStatusEnum.noReview
                    ? t`features_agent_index_5101371`
                    : t`features_agent_index_5101372`}
                </div>
              )}
          </div>
        </Link>
      )}
      <div className="section">
        <div className="share-card">
          <div className="share-card-header">
            <p className="share-card-header-text">{t`features_agent_index_5101373`}</p>
            <p className="share-card-header-text">{t`features_agent_index_5101374`}</p>
            <LazyImage
              hasTheme
              className="share-card-header-decorate-circular"
              src={`${oss_svg_image_domain_address}${'agent/decorate_circular.png'}`}
            />
            <div className="share-card-header-text-bg"></div>
          </div>

          <div className="share-card-content">
            <div className="line1"></div>
            <div className="line2"></div>
            {getCardItem({
              icon: <Icon name="rebates_invitation" hasTheme fontSize={110} />,
              label: t`features_agent_index_5101375`,
              text: t`features_agent_index_5101376`,
            })}
            {getCardItem({
              icon: <Icon name="rebates_register" hasTheme fontSize={110} />,
              label: t`features_agent_index_5101377`,
              text: t`features_agent_index_5101378`,
            })}
            {getCardItem({
              icon: <Icon name="rebates_reward" hasTheme fontSize={110} />,
              label: t`features_agent_index_5101379`,
              text: t`features_agent_index_5101380`,
            })}
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-text">
          <p className="footer-h1">{t`features_agent_index_5101381`}</p>
          <p className="mt-6">{t`features_agent_index_5101382`}</p>
          <p className="mt-2">
            {t`features_agent_index_5101383`}
            <span className="black">
              {!inviteQuery?.agtInvitationCode ? renderNoAgtText() : renderProductSpan(queryRebates)}。
            </span>
          </p>
          <p className="mt-2">
            {t({ id: 'features_agent_index_5101385', values: { 0: ` ${headerData?.businessName} ` } })}
          </p>
          <p className="mt-6">{t`features_agent_index_5101386`}</p>
          <p className="mt-2">{t`features_agent_index_5101387`}</p>
          <p className="mt-6">{t`features_agent_index_5101388`}</p>
          <p className="mt-2">{t`features_agent_index_5101389`}</p>
          <p className="mt-6">{t`features_agent_index_5101390`}</p>
          <p className="mt-4">{t`features_agent_index_5101391`}</p>
          <p className="mt-2">{t`features_agent_index_5101392`}</p>
          <p className="mt-4">{t`features_agent_index_5101393`}</p>
          <p className="mt-2">
            {t`features_agent_index_5101394`}
            <span className="black">
              {!inviteQuery?.agtInvitationCode ? renderNoAgtText() : renderProductSpan(queryRebates)}。
            </span>
            {'('}
            {t`features_agent_index_5101395`}
            {')'}
          </p>
          <p className="mt-6">{t`features_agent_index_5101396`}</p>
          <p className="mt-2">{t`features_agent_index_5101397`}</p>
          <p className="mt-6">
            {t({ id: 'features_agent_index_5101398', values: { 0: ` ${headerData?.businessName} ` } })}
          </p>
          <p className="mt-6">{t`features_agent_index_5101399`}</p>
          <p className="mt-6">
            <span className="black">
              {t({ id: 'features_agent_index_5101400', values: { 0: ` ${headerData?.businessName} ` } })}
            </span>
          </p>
          <p className="mt-2">
            <span className="black">
              {t({ id: 'features_agent_index_5101401', values: { 0: ` ${headerData?.businessName} ` } })}
            </span>
          </p>
        </div>
        <div className="mt-8 footer-text">
          <p className="footer-h1">{t`features_agent_index_5101402`}</p>
          <p className="mt-4">
            {t`features_agent_index_5101403`}
            <span className="black">{renderProductSpan(querySim)}。</span>
          </p>
          <p className="mt-4">{t`features_agent_index_5101405`}</p>
          <p className="mt-4">
            {t`features_agent_index_5101406`}
            {isShowBanner() && (
              <Link
                href={
                  inviteQuery?.agtApplicationResp && isNumber(inviteQuery?.agtApplicationResp.approvalStatrusInd)
                    ? '/agent/join'
                    : '/agent/apply'
                }
              >
                <span className="brand">{t`features_agent_index_5101407`}</span>
              </Link>
            )}
          </p>
        </div>
      </div>
      {/* 修改邀请码名称 */}
      <CustomModal style={{ width: 444 }} className={styles['agent-modal']} visible={isShow}>
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
              value={invitName}
              onChange={invitNameOnchange}
              showWordLimit
              placeholder={t`features_agent_index_5101352`}
            />
          </div>

          <div className="invitation-code-footer">
            <Button className="button" type="secondary" onClick={() => setShow(false)}>
              {t`trade.c2c.cancel`}
            </Button>
            <Button
              className="button"
              type="primary"
              disabled={!invitName}
              onClick={() => {
                getManageInviteUpdate()
                setShow(false)
              }}
            >
              {t`components_chart_header_data_2622`}
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* 设置金字塔佣金比例提示 */}
      <CustomModal style={{ width: 360 }} className={styles['agent-modal']} visible={isShowTips}>
        <div className="tips">
          <div className="tips-header">
            <div className="tips-header-title">{t`features_agent_index_5101409`}</div>
            <div>
              <Icon name="close" hasTheme fontSize={18} onClick={() => setIsShowTips(false)} />
            </div>
          </div>

          <div className="tips-content">
            <p className="tips-content-text">{t`features_agent_index_5101410`}</p>
          </div>

          <div className="tips-footer">
            <Button
              className="button"
              type="primary"
              onClick={() => {
                setIsShowTips(false)
                setIsShowSetRatio(true)
              }}
            >
              {t`features_agent_index_5101411`}
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* 设置金字塔佣金比例 */}
      <CustomModal style={{ width: 444 }} className={styles['agent-modal']} visible={isShowSetRatio}>
        <div className="set-ratio">
          <div className="set-ratio-header">
            <div className="set-ratio-header-title">{t`features_agent_index_5101411`}</div>
            <div>
              <Icon name="close" hasTheme fontSize={18} onClick={() => setIsShowSetRatio(false)} />
            </div>
          </div>

          <div className="set-ratio-content">
            <Alert
              className="set-radio-alert"
              content={<div className="set-radio-alert-label">{t`features_agent_index_5101412`}</div>}
              type="info"
            />

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
                      value={spotPercent}
                      onChange={onSpotSliderChange}
                      formatTooltip={formatTooltip}
                    />
                  </div>
                  <div className="set-radio-slider-footer">
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101414`}{' '}
                      <span className="set-radio-slider-footer-highlight">{spotPercent}%</span>
                    </div>
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101357`}{' '}
                      <span className="set-radio-slider-footer-highlight">{Number(queryMax?.spot) - spotPercent}%</span>
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
                      value={futuresPercent}
                      onChange={onFuturesChange}
                      formatTooltip={formatTooltip}
                    />
                  </div>
                  <div className="set-radio-slider-footer">
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101414`}{' '}
                      <span className="set-radio-slider-footer-highlight">{futuresPercent}%</span>
                    </div>
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101357`}{' '}
                      <span className="set-radio-slider-footer-highlight">
                        {Number(queryMax?.contract) - futuresPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {queryMax?.borrowCoin && (
              <div className="mb-4 set-radio-form-item">
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
                      value={borrowMoneyPercent}
                      onChange={onBorrowMoneyChange}
                      formatTooltip={formatTooltip}
                    />
                  </div>
                  <div className="set-radio-slider-footer">
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101414`}{' '}
                      <span className="set-radio-slider-footer-highlight">{borrowMoneyPercent}%</span>
                    </div>
                    <div className="set-radio-slider-footer-text">
                      {t`features_agent_index_5101357`}{' '}
                      <span className="set-radio-slider-footer-highlight">
                        {Number(queryMax?.borrowCoin) - borrowMoneyPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="set-ratio-footer">
            <Button
              className="button"
              type="secondary"
              onClick={() => {
                setSpotPercent(0)
                setFuturesPercent(0)
                setBorrowMoneyPercent(0)
                setIsShowSetRatio(false)
              }}
            >
              {t`trade.c2c.cancel`}
            </Button>
            <Button className="button" type="primary" onClick={() => agentInviteAddRebates()}>
              {t`components_chart_header_data_2622`}
            </Button>
          </div>
        </div>
      </CustomModal>
      {/* 分享海报 */}
      <CustomModal style={{ width: 480 }} className={styles['agent-modal']} visible={isShowPoster}>
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
      <CustomModal style={{ width: 320 }} className={styles['agent-modal']} visible={isShowQrcode}>
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
      {/* 申请代理商成功弹窗 */}
      <CustomModal style={{ width: 360 }} className={styles['agent-modal']} visible={showApplySuccessModal}>
        <div className="apply-success">
          <div className="apply-success-close-icon">
            <Icon name="rebates_close" fontSize={32} onClick={() => setShowApplySuccessModal(false)} />
          </div>

          <div className="apply-success-header">
            <LazyImage
              // 设置大小防止闪动
              height={210}
              width={360}
              className="apply-success-header-logo"
              src={`${oss_svg_image_domain_address}${'agent/popup_bj.png'}`}
              // LOGO 直接显示图片，这里不需要lazy load
              visibleByDefault
              whetherPlaceholdImg={false}
            />

            <div className="apply-success-text">{t`features_agent_index_5101419`}</div>
          </div>

          <div className="apply-success-content">
            <div className="apply-success-box">
              <p>
                {t`features_agent_index_5101420`}
                <span className="brand">{t`features_agent_index_5101421`}</span>
              </p>
              <p className="mt-2">
                {t`features_agent_index_5101422`}
                <span className="brand">
                  {queryMax?.spot && (
                    <span>
                      {t`features_agent_index_5101423`} {queryMax?.spot}%
                    </span>
                  )}
                  {queryMax?.contract && (
                    <span>
                      {t`features_agent_index_5101424`} {queryMax?.contract}%
                    </span>
                  )}
                  {queryMax?.borrowCoin && (
                    <span>
                      {t`features_agent_index_5101425`} {queryMax?.borrowCoin}%
                    </span>
                  )}
                </span>
                {t`features_agent_index_5101426`}
              </p>
              <p className="mt-3">{t`features_agent_index_5101427`}</p>
              <p className="mt-3">{t`features_agent_index_5101428`}</p>

              <div className="mt-6">
                <Button className="button" type="primary" onClick={() => setIsShowSetRatio(true)}>
                  {t`features_agent_index_5101429`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    </section>
  )
}

export default UserPersonalCenterAgent
