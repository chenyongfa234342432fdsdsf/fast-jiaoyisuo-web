import { ReactNode, useState, useEffect } from 'react'
import { ThemeEnum } from '@/constants/base'
import { useLayoutStore } from '@/store/layout'
import { useCommonStore } from '@/store/common'
import { Button } from '@nbit/arco'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { fetchAgentInviteQuerySys, fetchAgentRebatesHistoryTop } from '@/apis/agent/manage'
import { getListItemTop20, ListItemTop20Type } from '../list-items'
import CustomModal from '../modal'
import styles from './index.module.css'

type CardItemType = {
  icon: ReactNode
  text: string
  badge: string
}

type ListItemType = {
  icon: ReactNode
  title: string
  content: string
}

function UserPersonalCenterAgentApply() {
  const { headerData } = useLayoutStore()
  const commonState = useCommonStore()

  const bg_suffix = commonState.theme === ThemeEnum.dark ? '_black' : ''

  const [maxValue, setMaxValue] = useState<number>(0)
  const [top20, setTop20] = useState<ListItemTop20Type[]>([]) // Top20 列表
  const [isShowTop20, setShowTop20] = useState<boolean>(false)
  const [isShowTopRule, setShowTopRule] = useState<boolean>(false)

  const agentRebatesHistoryTop = async () => {
    const res = await fetchAgentRebatesHistoryTop({})

    if (res.isOk) {
      setTop20(res.data.profitList)
    }
  }

  const agentInviteQuerySys = async () => {
    const res = await fetchAgentInviteQuerySys({})
    if (res.isOk) {
      const data = res.data
      let mv = 0
      Object.keys(data ?? {}).map(key => (mv = Math.max(mv, (data ?? {})[key])))

      setMaxValue(mv)
    }
  }

  useEffect(() => {
    agentRebatesHistoryTop()
    agentInviteQuerySys()
  }, [])

  const getCardItem = ({ icon, text, badge }: CardItemType) => {
    return (
      <div className="share-card-item">
        <div className="share-card-item-header">
          {icon}
          <div className="share-card-item-badge">{badge}</div>
        </div>
        <div className="share-card-item-content">{text}</div>
      </div>
    )
  }

  const getListItem = ({ icon, title, content }: ListItemType) => {
    return (
      <div className="list-item">
        <div className="list-item-l-box">{icon}</div>
        <div className="list-item-r-box">
          <div className="list-item-title">{title}</div>
          <div className="list-item-content">{content}</div>
        </div>
      </div>
    )
  }

  return (
    <section className={`personal-center-agent-apply ${styles.scoped}`}>
      <div
        className="header"
        style={{
          background: `url("${oss_svg_image_domain_address}agent/agent_upper_bj${bg_suffix}.png?x-oss-process=image/auto-orient,1/quality,q_50") center center/cover no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <div className="header-box">
          <div className="header-box-primary">{t`features_agent_apply_index_5101465`}</div>
          <div className="header-box-second">{t`features_agent_apply_index_5101466`}</div>
          <Link href={'/agent/join'}>
            <Button className="header-box-button">{t`features_agent_apply_index_5101467`}</Button>
          </Link>
        </div>
      </div>
      <div className="section">
        <div className="share-card">
          <div className="share-card-content">
            <div className="line1">
              <LazyImage
                // 设置大小防止闪动
                height={22}
                width={248}
                className=""
                src={`${oss_svg_image_domain_address}${'agent/agent_line.png'}`}
                // LOGO 直接显示图片，这里不需要lazy load
                visibleByDefault
                whetherPlaceholdImg={false}
              />
            </div>
            <div className="line2">
              <LazyImage
                // 设置大小防止闪动
                height={22}
                width={248}
                className=""
                src={`${oss_svg_image_domain_address}${'agent/agent_line.png'}`}
                // LOGO 直接显示图片，这里不需要lazy load
                visibleByDefault
                whetherPlaceholdImg={false}
              />
            </div>
            {getCardItem({
              icon: (
                <LazyImage
                  // 设置大小防止闪动
                  height={80}
                  width={80}
                  className=""
                  src={`${oss_svg_image_domain_address}${'agent/agent_first.png'}`}
                  // LOGO 直接显示图片，这里不需要lazy load
                  visibleByDefault
                  whetherPlaceholdImg={false}
                />
              ),
              text: t`features_agent_apply_index_5101468`,
              badge: t`features_agent_apply_index_5101469`,
            })}
            {getCardItem({
              icon: (
                <LazyImage
                  // 设置大小防止闪动
                  height={80}
                  width={80}
                  className=""
                  src={`${oss_svg_image_domain_address}${'agent/agent_second.png'}`}
                  // LOGO 直接显示图片，这里不需要lazy load
                  visibleByDefault
                  whetherPlaceholdImg={false}
                />
              ),
              text: t({ id: 'features_agent_apply_index_5101470', values: { 0: headerData?.businessName } }),
              badge: t`features_agent_apply_index_5101471`,
            })}
            {getCardItem({
              icon: (
                <LazyImage
                  // 设置大小防止闪动
                  height={80}
                  width={80}
                  className=""
                  src={`${oss_svg_image_domain_address}${'agent/agent_commission.png'}`}
                  // LOGO 直接显示图片，这里不需要lazy load
                  visibleByDefault
                  whetherPlaceholdImg={false}
                />
              ),
              text: t`features_agent_apply_index_5101472`,
              badge: t`features_agent_apply_index_5101473`,
            })}
          </div>
        </div>
        <div className="agent-apply-content">
          <div className="agent-apply-content-l-box">
            <div className="agent-apply-content-title">{t`features_agent_apply_index_5101474`}</div>
            <div className="agent-apply-content-subtitle">{t`features_agent_apply_index_5101475`}</div>
            <div className="listitem-box">
              {getListItem({
                icon: (
                  <LazyImage
                    // 设置大小防止闪动
                    height={50}
                    width={50}
                    className=""
                    src={`${oss_svg_image_domain_address}${'agent/agent_pyramid.png'}`}
                    // LOGO 直接显示图片，这里不需要lazy load
                    visibleByDefault
                    whetherPlaceholdImg={false}
                  />
                ),
                title: t`features_agent_apply_index_5101476`,
                content: t`features_agent_apply_index_5101477`,
              })}
              {getListItem({
                icon: (
                  <LazyImage
                    // 设置大小防止闪动
                    height={50}
                    width={50}
                    className=""
                    src={`${oss_svg_image_domain_address}${'agent/agent_remuneration.png'}`}
                    // LOGO 直接显示图片，这里不需要lazy load
                    visibleByDefault
                    whetherPlaceholdImg={false}
                  />
                ),
                title: t`features_agent_apply_index_5101478`,
                content: t`features_agent_apply_index_5101479`,
              })}
              {getListItem({
                icon: (
                  <LazyImage
                    // 设置大小防止闪动
                    height={50}
                    width={50}
                    className=""
                    src={`${oss_svg_image_domain_address}${'agent/agent_third.png'}`}
                    // LOGO 直接显示图片，这里不需要lazy load
                    visibleByDefault
                    whetherPlaceholdImg={false}
                  />
                ),
                title: t`features_agent_apply_index_5101480`,
                content: t`features_agent_apply_index_5101481`,
              })}
            </div>
          </div>
          <div className="agent-apply-content-r-box">
            <LazyImage
              // 设置大小防止闪动
              height={248}
              width={277}
              className=""
              src={`${oss_svg_image_domain_address}${'agent/agent_welfare.png'}`}
              // LOGO 直接显示图片，这里不需要lazy load
              visibleByDefault
              whetherPlaceholdImg={false}
            />
          </div>
        </div>
        <div className="agent-apply-classification">
          <div className="agent-apply-classification-l-box">
            <div className="agent-apply-classification-title">{t`features_agent_apply_index_5101482`}</div>
            <div className="agent-apply-classification-subtitle">
              {t`features_agent_apply_index_5101483`} {maxValue}%{t`features_agent_apply_index_5101484`}
            </div>

            <div className="agent-apply-classification-footer">
              <div className="agent-apply-classification-footer-container">
                <div className="agent-apply-classification-footer-box l-box">{'70%'}</div>
                <div className="agent-apply-classification-footer-text">{t`features_agent_apply_index_5101485`}</div>
              </div>
              <div className="plus">
                <Icon name="leverage_increase" hasTheme fontSize={22} />
              </div>
              <div className="agent-apply-classification-footer-container">
                <div className="agent-apply-classification-footer-box r-box">{'10%'}</div>
                <div className="agent-apply-classification-footer-text">{t`features_agent_apply_index_5101486`}</div>
              </div>
            </div>
          </div>
          <div className="agent-apply-classification-r-box">
            <div className="agent-apply-classification-img">
              <LazyImage
                // 设置大小防止闪动
                height={334}
                width={538}
                className=""
                src={`${oss_svg_image_domain_address}${'agent/agent_profit_2.png'}`}
                // LOGO 直接显示图片，这里不需要lazy load
                visibleByDefault
                whetherPlaceholdImg={false}
              />
              <div className="agent-apply-classification-img-box lt-box">
                <p>{t`features_agent_index_5101414`} 40%</p> <p>{t`features_agent_apply_index_5101487`} 40%</p>
              </div>
              <div className="agent-apply-classification-img-box lr-box">
                <p>{t`features_agent_index_5101414`} 30%</p> <p>{t`features_agent_apply_index_5101488`} 50%</p>
              </div>
              <div className="agent-apply-classification-img-box lb-box">
                <p>{t`features_agent_apply_index_5101488`} 30%</p> <p>{t`features_agent_apply_index_5101489`} 20%</p>
              </div>
              <div className="agent-apply-classification-img-box rb-box">
                <p>{t`features_agent_apply_index_5101488`} 40%</p> <p>{t`features_agent_apply_index_5101490`} 10%</p>
              </div>
              <div className="agent-apply-classification-img-text lt-text">{t`features_agent_apply_index_5101487`}</div>
              <div className="agent-apply-classification-img-text lr-text">{t`features_agent_apply_index_5101488`}</div>
              <div className="agent-apply-classification-img-text lb-text">{t`features_agent_apply_index_5101489`}</div>
              <div className="agent-apply-classification-img-text rb-text">{t`features_agent_apply_index_5101490`}</div>
            </div>
          </div>
        </div>
        <div className="agent-apply-top20">
          <div className="agent-apply-top20-l">
            <div className="agent-apply-top20-title">{t`features_agent_apply_index_5101491`}</div>
            <div className="subtitle-box">
              <div className="agent-apply-top20-subtitle">{t`features_agent_apply_index_5101492`}</div>
              <div className="agent-apply-top20-more" onClick={() => setShowTop20(true)}>
                {t`features_agent_apply_index_5101493`}
              </div>
            </div>

            <div className="agent-apply-top20-listitems">{getListItemTop20(top20.slice(0, 5))}</div>
          </div>
          <div className="agent-apply-top20-r">
            <LazyImage
              // 设置大小防止闪动
              height={242}
              width={265}
              className=""
              src={`${oss_svg_image_domain_address}agent/ranking.png`}
              // LOGO 直接显示图片，这里不需要lazy load
              visibleByDefault
              whetherPlaceholdImg={false}
            />
          </div>
        </div>
        <div
          className="agent-apply-footer"
          style={{
            background: `url("${oss_svg_image_domain_address}${'agent/agent_lower_bj.png?x-oss-process=image/auto-orient,1/quality,q_50'}") center center no-repeat`,
            backgroundSize: 'cover',
          }}
        >
          <div className="agent-apply-footer-title">{t`features_agent_apply_index_5101465`}</div>
          <div className="agent-apply-footer-subtitle">
            <p>{t`features_agent_apply_index_5101494`}</p>
            <p>{t`features_agent_apply_index_5101495`}</p>
          </div>
          <Link href={'/agent/join'}>
            <Button className="agent-apply-footer-button">{t`features_agent_apply_index_5101496`}</Button>
          </Link>
        </div>
      </div>
      {/* Top 20 弹窗 */}
      <CustomModal style={{ width: 444 }} className={styles['agent-apply-modal']} visible={isShowTop20}>
        <div className="ranking">
          <div className="ranking-close-icon">
            {/* <Icon name="rebates_close" fontSize={32} onClick={() => setShowTop20(false)} /> */}
            <Icon name="close" hasTheme fontSize={22} onClick={() => setShowTop20(false)} />
          </div>

          <div
            className="ranking-header"
            style={{
              background: `url("${oss_svg_image_domain_address}${'agent/ranking_bj.png?x-oss-process=image/auto-orient,1/quality,q_50'}") center center/cover no-repeat`,
            }}
          >
            <div className="ranking-header-title">{t`features_agent_apply_index_5101491`}</div>
            <div className="ranking-header-text">{t`features_agent_apply_index_5101497`}</div>
            <div className="ranking-header-rule" onClick={() => setShowTopRule(true)}>
              {t`features_agent_apply_index_5101498`}
              <Icon name="transaction_arrow_hover" fontSize={14} />
            </div>
          </div>

          <div className="ranking-content">
            <div className="ranking-content-listitems">{getListItemTop20(top20)}</div>
          </div>
        </div>
      </CustomModal>
      {/* Top 20 弹窗规则 */}
      <CustomModal style={{ width: 360 }} className={styles['agent-apply-modal']} visible={isShowTopRule}>
        <div className="ranking-rule">
          <p className="ranking-rule-text">
            {t`features_agent_apply_index_5101499`}
            <span className="ranking-rule-text-highlight">{t`features_agent_apply_index_5101500`}</span>
          </p>
          <Button className="ranking-rule-button" type="primary" onClick={() => setShowTopRule(false)}>
            {t`features_agent_apply_index_5101501`}
          </Button>
        </div>
      </CustomModal>
    </section>
  )
}

export default UserPersonalCenterAgentApply
