import { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react'
import { useRequest } from 'ahooks'
import { Button, Message } from '@nbit/arco'
import UserPopUp from '@/features/user/components/popup'
import { t } from '@lingui/macro'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { useUserStore } from '@/store/user'
import { UserContractVersionEnum, ContractPreferencesTermsEnum } from '@/constants/user'
import {
  postMemberOpenContract,
  postMemberContractSwitchVersion,
  getMemberPerpetualThreshold,
} from '@/apis/future/preferences'
import { MerchantFiatCurrencyThresholdResp } from '@/typings/api/future/preferences'
import { useLayoutStore } from '@/store/layout'
import { getC2cOrderShortPageRoutePath } from '@/helper/route'
import { getAssetsDepositPageRoutePath } from '@/helper/route/assets'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatCurrency } from '@/helper/decimal'
import { onGetMyTotalAssets } from '@/helper/assets/futures'
import Lottie from 'lottie-react'
import normalDark from '@/assets/json/normal-dark.json'
import normalLight from '@/assets/json/normal-light.json'
import proDark from '@/assets/json/pro-dark.json'
import proLight from '@/assets/json/pro-light.json'
import { ThemeEnum } from '@/constants/base'
import { useCommonStore } from '@/store/common'
import { link } from '@/helper/link'
import Link from '@/components/link'
import Icon from '@/components/icon'
import { getMergeModeStatus } from '@/features/user/utils/common'
import styles from '../index.module.css'

interface VersionPopUpProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean
  /** 是否设置成功 */
  onSuccess?(isTrue: boolean): void
  /** 开通合约模式 */
  isOpenContract?: boolean
}

interface VersionOptionsType {
  key: number
  /** 标题 */
  title: string
  /** 副标题 */
  subTitle: string
  /** 内容标题 */
  contentTitle: string
  /** 内容 */
  content: Array<string>
  /** 版本值 */
  value: number
  /** 视频链接 */
  videoLink: string
  /** 图片 */
  image: string
  /** 动画 Json */
  animation: any
}

function FuturesVersionPopUp({ visible, setVisible, hasCloseIcon, onSuccess, isOpenContract }: VersionPopUpProps) {
  const [version, setVersion] = useState<number>(UserContractVersionEnum.professional)
  const [tipsShow, setTipsShow] = useState<boolean>(false)
  const [totalAssets, setTotalAssets] = useState<string>('')
  const [state, setState] = useState<MerchantFiatCurrencyThresholdResp>({
    symbol: '',
    threshold: '0',
  })
  // const [selectVideoVersion, setSelectVidelVersion] = useState<number>(UserContractVersionEnum.professional)
  // const [videoShow, setVideoShow] = useState<boolean>(false)

  // const videoUrl = useRef<string>('')
  const standardRef = useRef<any>(null)
  const prodRef = useRef<any>(null)

  const useStore = useUserStore()
  const { theme } = useCommonStore()
  const isMergeMode = getMergeModeStatus()
  const contractPreferenceStore = useContractPreferencesStore()
  const { openContractTransitionDatas, clearOpenContractTransitionDatas } = useStore
  const { perpetualVersion, hasOpenSpecializeVersion } = contractPreferenceStore.contractPreference

  const dataByCd = useLayoutStore().columnsDataByCd

  const assetsFuturesStore = useAssetsFuturesStore()
  /** 商户设置的计价币的法币精度和法币符号，USD 或 CNY 等 */
  const {
    futuresCurrencySettings: { currencySymbol, offset },
  } = { ...assetsFuturesStore }

  const versionOptions: Array<VersionOptionsType> = [
    {
      key: 1,
      title: t`features_trade_trade_setting_futures_version_index_5101408`,
      subTitle: t`features_trade_trade_setting_futures_version_index_5101409`,
      contentTitle: t`features_trade_trade_setting_futures_version_index_5101410`,
      content: [
        t`features_trade_trade_setting_futures_version_index_5101411`,
        t`features_trade_trade_setting_futures_version_index_5101412`,
      ],
      value: UserContractVersionEnum.base,
      videoLink: dataByCd?.[ContractPreferencesTermsEnum.contractTeachNormal]?.webUrl,
      image: 'contract_standard_edition',
      animation: theme === ThemeEnum.light ? normalLight : normalDark,
    },
    {
      key: 2,
      title: t`features_trade_trade_setting_futures_version_index_5101402`,
      subTitle: t`features_trade_trade_setting_futures_version_index_5101403`,
      contentTitle: t`features_trade_trade_setting_futures_version_index_5101404`,
      content: [
        t`features_trade_trade_setting_futures_version_index_5101405`,
        t`features_trade_trade_setting_futures_version_index_5101406`,
        t`features_trade_trade_setting_futures_version_index_5101407`,
      ],
      value: UserContractVersionEnum.professional,
      videoLink: dataByCd?.[ContractPreferencesTermsEnum.contractTeachPro]?.webUrl,
      image: 'contract_pro',
      animation: theme === ThemeEnum.light ? proLight : proDark,
    },
  ]

  const handleOnCancel = () => {
    clearOpenContractTransitionDatas()
    setVisible(false)
  }

  /** 切换合约版本 */
  const postContractSwitchVersion = async () => {
    const res = await postMemberContractSwitchVersion({ version })
    if (res.isOk) {
      contractPreferenceStore.getContractPreference()
      Message.success(
        version === UserContractVersionEnum.base
          ? t`features/user/personal-center/settings/converted-currency/index-0`
          : hasOpenSpecializeVersion === UserContractVersionEnum.professional
          ? t`features/user/personal-center/settings/converted-currency/index-0`
          : t`features_trade_trade_setting_futures_version_popup_index_-xaknqo-oyni-cpz3erp_`
      )

      handleOnCancel()
    }
  }

  /** 开通合约 */
  const postOpenContract = async () => {
    const res = await postMemberOpenContract({ ...openContractTransitionDatas, perpetualVersion: version })
    if (res.isOk) {
      contractPreferenceStore.setContractPreference({ perpetualVersion: version })
      onSuccess && onSuccess(true)
      Message.success(
        version === UserContractVersionEnum.base
          ? t`features/user/personal-center/settings/converted-currency/index-0`
          : t`features_trade_trade_setting_futures_version_popup_index_-xaknqo-oyni-cpz3erp_`
      )
      handleOnCancel()
    }
  }

  const getAmountAndThreshold = async () => {
    const [amountRes, thresholdRes] = await Promise.all([onGetMyTotalAssets(), getMemberPerpetualThreshold({})])
    if (amountRes && thresholdRes.isOk && thresholdRes.data) {
      const isTrue = Number(amountRes) >= Number(thresholdRes.data.threshold)

      if (!isTrue) {
        setTotalAssets(amountRes)
        setState(thresholdRes.data)
        setTipsShow(true)
        return false
      }
    }

    return true
  }

  const { run: switchVersion, loading: switchLoading } = useRequest(postContractSwitchVersion, { manual: true })
  const { run: openContract, loading: openLoading } = useRequest(postOpenContract, { manual: true })

  useEffect(() => {
    visible && isOpenContract
      ? setVersion(UserContractVersionEnum.professional)
      : setVersion(perpetualVersion || UserContractVersionEnum.professional)
  }, [visible])

  const handleSelectVersion = (v: VersionOptionsType) => {
    if (v.value === UserContractVersionEnum.base) {
      prodRef.current?.goToAndStop(60, true)
      standardRef.current?.goToAndPlay(0, true)
    } else {
      prodRef.current?.goToAndPlay(0, true)
      standardRef.current?.goToAndStop(60, true)
    }

    setVersion(v.value)
  }

  // const handleVideoShow = (value: number) => {
  //   value === UserContractVersionEnum.professional ? (videoUrl.current = '') : (videoUrl.current = '')
  //   setSelectVidelVersion(value)
  //   setVideoShow(true)
  // }

  const handleSubmit = async () => {
    /** 判断是否符合升级版本的要求 */
    if (
      version === UserContractVersionEnum.professional &&
      hasOpenSpecializeVersion !== UserContractVersionEnum.professional
    ) {
      const isTrue = await getAmountAndThreshold()
      if (!isTrue) return
    }

    isOpenContract ? openContract() : switchVersion()
  }

  return (
    <>
      <UserPopUp
        className="user-popup"
        style={{ width: 680 }}
        title={<div style={{ textAlign: 'left' }}>{t`features_trade_trade_setting_futures_version_index_5101414`}</div>}
        visible={visible}
        maskClosable={false}
        autoFocus={false}
        closable={hasCloseIcon}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={handleOnCancel}
        footer={null}
      >
        <div className={`futures-version ${styles.scoped}`}>
          <div className="container">
            {versionOptions.map(v => (
              <div className={`options ${version === v.value ? 'checked' : ''}`} key={v.key}>
                <div className="options-wrap" onClick={() => handleSelectVersion(v)}>
                  <div className="options-content">
                    <div className="title">
                      <label>{v.title}</label>
                      <label>{v.subTitle}</label>
                    </div>

                    <div className="image">
                      <Lottie
                        lottieRef={v.value === UserContractVersionEnum.base ? standardRef : prodRef}
                        animationData={v.animation}
                        loop={false}
                        autoPlay
                      />
                    </div>
                    <div className="content">
                      <div className="content-title">
                        <label>{v.contentTitle}</label>
                      </div>

                      {v.content.map((text, row) => (
                        <div className="text" key={`${v.key}${row}`}>
                          <label>{text}</label>
                        </div>
                      ))}
                    </div>
                    {version === v.value && (
                      <div className="checked-icon">
                        <Icon name="contract_select" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="link">
                  {/* <span
                    onClick={() => handleVideoShow(v.value)}
                  >{t`features_trade_trade_setting_futures_version_index_5101415`}</span> */}

                  {!isMergeMode && (
                    <>
                      <Link
                        href={v.videoLink}
                        target
                      >{t`features_trade_trade_setting_futures_version_index_5101415`}</Link>
                      <Icon name="transaction_arrow_hover" />
                    </>
                  )}
                </div>

                <div className="btn">
                  <Button
                    type="primary"
                    loading={openLoading || switchLoading}
                    disabled={version !== v.value}
                    onClick={handleSubmit}
                  >
                    {/* {isOpenContract || v.value === UserContractVersionEnum.base
                      ? t`user.field.reuse_08`
                      : (perpetualVersion && perpetualVersion === UserContractVersionEnum.professional) ||
                        hasOpenSpecializeVersion === UserContractVersionEnum.professional
                      ? t`user.field.reuse_08`
                      : t`features_trade_trade_setting_futures_version_popup_index_sapa3kuvddzln3yxzpntq`} */}
                    {v.value === UserContractVersionEnum.base
                      ? t`user.field.reuse_08`
                      : hasOpenSpecializeVersion === UserContractVersionEnum.professional
                      ? t`user.field.reuse_08`
                      : t`features_trade_trade_setting_futures_version_popup_index_sapa3kuvddzln3yxzpntq`}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="tips">
            <Icon name="prompt-symbol" />
            <label>
              {t`features_trade_trade_setting_futures_version_index_5101416`}
              <span>{t`features_trade_trade_setting_futures_version_index_5101417`}</span>
              {t`features_trade_trade_setting_futures_version_index_5101418`}
            </label>
          </div> */}
        </div>
      </UserPopUp>

      {/* <UserPopUp
        className="user-popup"
        title={
          <div style={{ textAlign: 'left' }}>{`${
            selectVideoVersion === UserContractVersionEnum.professional
              ? t`features_trade_trade_setting_futures_version_index_5101402`
              : t`features_trade_trade_setting_futures_version_index_5101408`
          }${t`features_trade_trade_setting_futures_version_popup_index_5101530`}`}</div>
        }
        style={{ width: 1200 }}
        visible={videoShow}
        maskClosable={false}
        autoFocus={false}
        closable={hasCloseIcon}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVideoShow(false)}
        footer={null}
      >
        <div className={`video-tutorial ${styles['video-show']}`}>
          <div className="container">
            <video controls autoPlay className="w-full">
              <source src="/" type="video/mp4"></source>
            </video>
          </div>
        </div>
      </UserPopUp> */}

      <UserPopUp
        className={`user-popup ${styles['version-tips-popup-show']}`}
        title={
          <div
            style={{ textAlign: 'left' }}
          >{t`features_trade_trade_setting_futures_version_popup_index_jdyuz2mjbz4lpop4qflam`}</div>
        }
        visible={tipsShow}
        maskClosable={false}
        autoFocus={false}
        closable={hasCloseIcon}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setTipsShow(false)}
        footer={
          <Button type="primary" onClick={() => setTipsShow(false)}>
            {t`features_trade_trade_setting_futures_version_popup_index_edys0ud8falqlpxqc3-bh`}
          </Button>
        }
      >
        <div className="version-tips-popup">
          <div className="container">
            <div className="icon">
              <Icon name="contract_upgrade_failed" hasTheme />
            </div>
            <div className="title">
              <label>{t`features_trade_trade_setting_futures_version_popup_index_lb51cybhh1khrm3invn2h`}</label>
            </div>
            <div className="text">
              <label>{t`features_trade_trade_setting_futures_version_popup_index_dd2yjugcgj9_zy6fqsihp`}</label>
              <label>
                {t`features_trade_trade_setting_futures_version_popup_index_uwg4vo_4_4dxgqhxsjz1l`}{' '}
                <span>{`${formatCurrency(state.threshold, offset)} ${state.symbol}`}</span>
              </label>
            </div>
            <div className="assets">
              <div className="assets-text">
                <label>{t`features_trade_trade_setting_futures_version_popup_index_9qmafgkc1itlaxcrx1dww`}</label>
              </div>
              <div className="assets-value">
                <label>{`${formatCurrency(totalAssets, offset)} ${currencySymbol}`}</label>
              </div>
            </div>
            <div className={!isMergeMode ? `recharge` : 'placeholder'}>
              {!isMergeMode && (
                <>
                  <Button
                    type="default"
                    icon={<Icon name="nav_order_c2c" />}
                    onClick={() => link(getC2cOrderShortPageRoutePath(), { target: true })}
                  >
                    {t`features_trade_trade_setting_futures_version_popup_index_ejwb2qrfnpk3upn7quokj`}
                  </Button>

                  <Button
                    type="default"
                    icon={<Icon name="contract_recharge" />}
                    onClick={() => link(getAssetsDepositPageRoutePath(), { target: true })}
                  >
                    {t`assets.deposit.title`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </UserPopUp>
    </>
  )
}

export default FuturesVersionPopUp
