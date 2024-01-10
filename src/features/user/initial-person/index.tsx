import { memo, useState } from 'react'
import { Grid, Affix, Timeline } from '@nbit/arco'
import { IconDoubleRight, IconCloseCircle, IconCheckCircle } from '@nbit/arco/icon'
import { t } from '@lingui/macro'
import cn from 'classnames'
import { getPermissionDetail, getPermissionDeposit, resetStatusPermission } from '@/apis/user'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useMount } from 'ahooks'
import dayjs from 'dayjs'
import { link } from '@/helper/link'
import SubmitApplications from './submit-applications'
import styles from './initialperson.module.css'
import { getTabList, getTimelineListArr, TimelineListType, Deposit } from './intialperson'

const Row = Grid.Row
const TimelineItem = Timeline.Item

type PermissionDetail = {
  amount: string
  auditTime: number
  reason: string
  status: number
  statusDesc: string
  symbol: string
  unfreezeTime: number
}

type TitleDetail = {
  header?: string
  detail?: string
  icon?: JSX.Element | string
  showTimeline?: boolean
}

enum Step {
  First = 1, // 提交申请
  Second = 2, // 发布广告
  Three = 3, // 审核
}

function InitialPerson() {
  const tabList = getTabList()

  const navigate = link

  const [step, setStep] = useState<number>(0)

  const [deposits, setDeposit] = useState<Deposit>()

  const [permissionDetail, setPermissionDetail] = useState<PermissionDetail>()

  const [timelineList, setTimelineList] = useState<TimelineListType>(getTimelineListArr())

  const setPermissionApplyAgain = async () => {
    const { status } = permissionDetail || {}
    if (status === 6) {
      const { isOk } = await resetStatusPermission()
      if (isOk) {
        navigate('/express/buy?tab=AdvertisingPermission&status=reapply')
      }
    } else {
      navigate('/express/buy?tab=AdvertisingPermission&status=publish')
    }
  }

  // 根据状态获取 Timeline 的 step
  const getPermissionStep = status => {
    switch (status) {
      case 5:
      case null:
      case '':
        return Step.First
      case 1:
        return Step.Second
      default:
        return Step.Three
    }
  }

  const setStepAndPermission = (status: number) => {
    if (permissionDetail) {
      setPermissionDetail({ ...permissionDetail, status })
      setStep(getPermissionStep(status))
    }
  }

  const getStepDetail = (status?: number | string) => {
    switch (status) {
      case 5:
      case null:
      case '':
        return <SubmitApplications setStepAndPermission={setStepAndPermission} deposits={deposits} />
      case 6:
      case 1:
        return (
          <div className="publish-advertisement" onClick={setPermissionApplyAgain}>
            {status === 6 ? '重新申请' : '前往发布广告'}
          </div>
        )
      default:
        return ''
    }
  }

  const setFormat = auditTime => {
    return dayjs(auditTime).format('YYYY-MM-DD hh:mm:ss')
  }

  const getTitleDetail = (status?: number | string): TitleDetail => {
    switch (status) {
      // 取消了广告权限
      case 3:
      case 4:
        return {
          header: '取消资格',
          detail: '很遗憾，您被取消了广告权限，详细原因可联系客服。您的保证金可前往 C2C 设置查看。',
          icon: <IconCloseCircle className="initialperson-iconclosecircle" />,
          showTimeline: false,
        }
      // 权限审核中
      case 1:
        return {
          header: '权限审核中',
          detail: `将在 ${setFormat(
            permissionDetail?.auditTime
          )} 之前对您提交的资料进行审核，您目前已获得了发布广告的资格。`,
          icon: '',
          showTimeline: true,
        }
      // 权限审核失败
      case 6:
        return {
          header: '审核失败',
          detail: `很遗憾，因为 ${permissionDetail?.reason}，您本次的审核未通过。您的保证金已解冻，可前往 C2C 账户查看。`,
          icon: <IconCloseCircle className="initialperson-iconclosecircle" />,
          showTimeline: true,
        }
      // 权限审核通过
      case 2:
        return {
          header: '审核通过',
          detail: '恭喜您，您通过了审核目前已是加 V 用户。',
          icon: <IconCheckCircle className="initialperson-success" />,
          showTimeline: true,
        }
      // 权限初始化
      case 5:
      case null:
      case '':
        return {
          showTimeline: true,
        }
      default:
        return {}
    }
  }

  const setTabNavigateFn = (value: string) => {
    navigate(`/express/buy?tab=${value}`)
  }

  // 设置申请失败后的 Timeline 的线条的颜色
  const setLineColor = index => {
    const { status } = permissionDetail || {}
    if (status === 6 && index === step - 1) {
      return 'red'
    }
    return index < step ? '#f1ae3d' : 'transparent'
  }

  // 获取保证金
  const getPermissionDepositRe = async (resultPermission: PermissionDetail) => {
    const { status, symbol } = resultPermission
    const { isOk, data } = await getPermissionDeposit()
    if (isOk) {
      setDeposit(data)
      timelineList[0].detail = `冻结保证资产 ${status === 2 ? symbol : data?.depositAmount} ${data?.depositCurrency}`
      setTimelineList([...timelineList])
    }
  }

  const getPermissionDetailRe = async () => {
    const { isOk, data } = await getPermissionDetail()
    if (isOk && data) {
      getPermissionDepositRe(data)
      // status 的状态 1 待审核  2.审核通过 3.取消资格 4.保证金解冻中 5.普通用户 6.审核失败
      setPermissionDetail({ ...data, status: data.status })
      setStep(getPermissionStep(data.status))
    }
  }

  const setPermissionPath = path => {
    navigate(path)
  }

  useMount(() => {
    getPermissionDetailRe()
  })

  return (
    <div className={styles.container}>
      {step === Step.First && <div className="initialperson-title">{t`features/user/initial-person/index-3`}</div>}
      {step !== Step.First && (
        <>
          <div className="initialperson-title-detail">
            {getTitleDetail(permissionDetail?.status)?.icon} {getTitleDetail(permissionDetail?.status)?.header}
          </div>
          <div className="initialperson-tips">{getTitleDetail(permissionDetail?.status)?.detail}</div>
          {!getTitleDetail(permissionDetail?.status)?.showTimeline && (
            <div className="initialperson-button" onClick={() => setPermissionPath('前往 C2C 设置查看的路径')}>
              前往 C2C 设置查看
            </div>
          )}
        </>
      )}
      {getTitleDetail(permissionDetail?.status)?.showTimeline && (
        <>
          <Affix offsetTop={60}>
            <div className="initialperson-select">
              <div className="initialperson-tab">
                <div className="initialperson-tab-select">
                  {tabList.map(item => {
                    return (
                      <div
                        key={item.value}
                        className="initialperson-tab-item"
                        onClick={() => setTabNavigateFn(item.value)}
                      >
                        {item.title}
                      </div>
                    )
                  })}
                </div>
                <div className="initialperson-tab-link">
                  {t`trade.c2c.tutorial`}
                  <IconDoubleRight />
                </div>
              </div>
            </div>
          </Affix>
          {step === Step.First && (
            <>
              <div className="initialperson-title-detail">{t`features/user/initial-person/index-3`}</div>
              <div className="initialperson-tips">{t`features/user/initial-person/index-4`}</div>
            </>
          )}
          <div className="initialperson-timeline">
            <Timeline direction="horizontal" mode="top">
              {timelineList.map((item, index) => {
                return (
                  <TimelineItem
                    key={index}
                    dot={
                      <div
                        className={cn('dot', {
                          'dot-color': index <= step,
                          'dot-color-disable': index > step,
                          'dot-color-line': index < step,
                          'dot-color-reject': index === step && permissionDetail?.status === 6,
                        })}
                      >
                        {index + 1}
                      </div>
                    }
                    lineColor={setLineColor(index)}
                  >
                    <Row align="center">
                      <div className="timeline-content">
                        <div
                          className={cn('timeline-title', {
                            'timeline-title-show': index <= step,
                            'timeline-title-show-reject': index === step && permissionDetail?.status === 6,
                          })}
                        >
                          {item.title}
                        </div>
                        <div className="timeline-content-detail">{item.detail}</div>
                      </div>
                    </Row>
                  </TimelineItem>
                )
              })}
            </Timeline>
          </div>
          {getStepDetail(permissionDetail?.status)}
        </>
      )}
      {permissionDetail?.status === 2 && (
        <div className="initialperson-select-suceess">
          <div className="initialperson-item">
            <img src={`${oss_svg_image_domain_address}selectfreeze.png`} alt="" />
            <span className="initialperson-freeze">冻结保证金</span>
            <span className="initialperson-freeze-usdt">
              {deposits?.depositAmount} {deposits?.depositCurrency}
            </span>
          </div>
          <div className="initialperson-unfreeze" onClick={() => setPermissionPath('/otc/paymentSettings')}>
            <span>解冻请前往</span>
            <span>C2C 设置 {'>'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(InitialPerson)
