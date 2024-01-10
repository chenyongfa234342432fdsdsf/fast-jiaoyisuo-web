import { useState, useEffect } from 'react'
import { Form, Select, Input, Button } from '@nbit/arco'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import cn from 'classnames'
import Icon from '@/components/icon'
import { AgentJoinRules } from '@/features/agent/utils/validate'
import Link from '@/components/link'
import LazyImage from '@/components/lazy-image'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import {
  fetchAgentInviteQueryMax,
  fetchAgentInviteQuerySys,
  fetchAgtApplicationUpdate,
  fetchJoinInviteAdd,
  fetchManageInvitequery,
} from '@/apis/agent/manage'
import { AgentInviteQueryMaxResp, AgentManageInviteQueryResp, JoinInviteAddReq } from '@/typings/api/agent/manage'
import {
  AuditStatusType,
  AutoFocusEnum,
  emailOrPhoneEnum,
  JoinStatusEnum,
  WebSocializeType,
} from '@/constants/agent/agent'
import { getCodeDetailListBatch } from '@/apis/common'
import { getMemberAreaIp } from '@/apis/user'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { useMount } from 'ahooks'
import CustomModal from '../modal'
import styles from './index.module.css'
import AreacodeSelect from '../areacode-select'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

type webComponentType = {
  selectVal: string
  inputVal: string
}

type WebSocializeProps = {
  value?: webComponentType
  onChange?: (e: webComponentType) => void
  error?: boolean
}

/**
 * 联系方式选中社交媒体的 component
 */
function WebSocializeSelect({ value, onChange, error }: WebSocializeProps) {
  const [focus, setFocus] = useState<boolean>(false) // 输入框是否选中
  const [selectVisible, setSelectVisible] = useState<boolean>(false)
  const [cvalue, setCvalue] = useState<webComponentType>(
    value || {
      selectVal: '',
      inputVal: '',
    }
  )
  const [webSocializes, setWebSocializes] = useState<WebSocializeType[]>([])

  // 社交媒体 数据字典
  const fetchCodeDetailListBatch = async () => {
    const res = await getCodeDetailListBatch(['webSocialize'])

    const data = res[0].map((item: any) => ({
      label: item.codeKey,
      value: item.codeVal,
    }))

    setWebSocializes(data)
  }

  useEffect(() => {
    fetchCodeDetailListBatch()
  }, [])

  const handleKeyChange = (k, v) => {
    const data = { ...cvalue, [k]: v }
    setCvalue(data)
    onChange && cvalue.inputVal && onChange(data)
  }

  return (
    <div className={cn(styles['select-container'], { error: !!error, focus: !error && focus })}>
      <div className="select-box">
        <Select
          className={styles.select}
          placeholder={t`features_agent_join_index_jt_e1w2md3uqcbf4urgyc`}
          style={{ width: 134 }}
          dropdownMenuStyle={{ width: 412 }}
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: 'bl',
          }}
          suffixIcon={
            selectVisible ? (
              <Icon name="arrow_close" hasTheme fontSize={8} />
            ) : (
              <Icon name="arrow_open" hasTheme fontSize={8} />
            )
          }
          onVisibleChange={visible => setSelectVisible(visible)}
          onChange={e => handleKeyChange('selectVal', e)}
        >
          {webSocializes.map((item, i) => (
            <Option key={i} value={item.label}>
              <div className={styles['select-option']}>
                <div className="icon">
                  <LazyImage src={item.value} />
                </div>
                <div className="text">{item.label}</div>
              </div>
            </Option>
          ))}
        </Select>
      </div>
      <Input
        placeholder={t`features_agent_join_index_fxy85auu4rtheyh6n1vz4`}
        autoFocus
        className="select-input"
        value={cvalue.inputVal}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={e => handleKeyChange('inputVal', e)}
        suffix={
          cvalue.inputVal && (
            <div>
              <Icon name="del_input_box" hasTheme fontSize={18} onClick={() => handleKeyChange('inputVal', '')} />
            </div>
          )
        }
      />
    </div>
  )
}

/**
 * 联系方式选中手机号的 component
 */
function UserPhoneSelect({ value, onChange, error }: WebSocializeProps) {
  const [focus, setFocus] = useState<boolean>(false) // 输入框是否选中
  const [cvalue, setCvalue] = useState<webComponentType>(
    value || {
      selectVal: '',
      inputVal: '',
    }
  )

  const getAreaIp = async () => {
    const res = await getMemberAreaIp({})
    if (res.isOk) {
      const { enCode, fullName, shortName } = res.data

      setCvalue({ ...cvalue, selectVal: enCode })
    }
  }

  useEffect(() => {
    getAreaIp()
  }, [])

  useEffect(() => {
    setCvalue({ ...cvalue, ...value })
  }, [value])

  const handleKeyChange = (k, v) => {
    const data = { ...cvalue, [k]: v }
    setCvalue(data)
    onChange && cvalue.inputVal && onChange(data)
  }

  return (
    <div className={cn(styles['select-container'], { error: !!error, focus: !error && focus })}>
      <div className="select-box">
        <AreacodeSelect onChange={e => handleKeyChange('selectVal', e)} value={cvalue.selectVal} />
      </div>
      <Input
        placeholder={t`user.field.reuse_11`}
        autoFocus
        className="select-input"
        value={cvalue.inputVal}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={e => handleKeyChange('inputVal', e)}
        suffix={
          cvalue.inputVal && (
            <div>
              <Icon name="del_input_box" hasTheme fontSize={18} onClick={() => handleKeyChange('inputVal', '')} />
            </div>
          )
        }
      />
    </div>
  )
}

/** 代理商提交申请表单 */
function UserPersonalCenterAgentFormJoin() {
  const commonState = useCommonStore()

  const { getBaseInfo, baseInfoResult } = usePersonalCenterStore()

  useMount(getBaseInfo)

  const [form] = Form.useForm()

  const [rules, setRules] = useState(AgentJoinRules())

  const bg_suffix = commonState.theme === ThemeEnum.dark ? '_black' : '_white'

  const selectLists = [
    { label: t`user.safety_items_02`, value: 1 },
    { label: t`user.safety_items_04`, value: 2 },
    { label: t`features_agent_join_index_qbtixmzwljrmxafjlhavy`, value: 3 },
  ]
  const [autoFocusIdx, setAutoFocusIdx] = useState<number>(0)
  const [formValue, setFormValue] = useState<JoinInviteAddReq>()
  const [queryMax, setQueryMax] = useState<AgentInviteQueryMaxResp>() // 系统最大可设置返佣比例
  const [selectVisible, setSelectVisible] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [inviteQuery, setInviteQuery] = useState<AgentManageInviteQueryResp>() // 查询邀请码
  const [emailOrPhone, setEmailOrPhone] = useState<emailOrPhoneEnum>(emailOrPhoneEnum.phone) // 切换表单 1: 手机号 2: email
  const [auditStatus, setAuditStatus] = useState<AuditStatusType>({
    status: JoinStatusEnum.default,
    approvalRemark: '',
  }) // 代理商申请状态
  const [isShow, setShow] = useState<boolean>(false) // 显示 / 隐藏 确认提交弹窗

  const agtApplicationUpdate = async id => {
    const res = await fetchAgtApplicationUpdate({
      id,
    })
  }

  const getManageInvitequery = async () => {
    const res = await fetchManageInvitequery({})
    if (res.isOk && res.data) {
      setAuditStatus({
        ...auditStatus,
        status: res.data.agtApplicationResp && res.data.agtApplicationResp.approvalStatrusInd,
        approvalRemark: (res.data.agtApplicationResp && res.data.agtApplicationResp.approvalRemark) || '',
      })
      res.data.agtApplicationResp &&
        res.data.agtApplicationResp.approvalStatrusInd === JoinStatusEnum.noPass &&
        agtApplicationUpdate(res.data.agtApplicationResp && res.data.agtApplicationResp.id) // 审核未通过只允许查看一次 原型设计如此
      setInviteQuery(res.data)
      setLoading(false)
    }
  }

  const joinInviteAdd = async () => {
    const res = await fetchJoinInviteAdd(formValue as JoinInviteAddReq)

    if (res.isOk) {
      setShow(false)
      ;(document.scrollingElement as Element).scrollTop = 0
      getManageInvitequery()
    }
  }

  const agentInviteQueryMax = async () => {
    const res = await fetchAgentInviteQuerySys({})
    if (res.isOk) {
      setQueryMax(res.data)
      setRules({
        ...rules,
        spot: {
          required: true,
          validator: (value: string | undefined, cb) => {
            if (!value && Number(value) !== 0) {
              return cb(t`features_agent_join_index_-i5l1jqpyuhdgtgy9j-ef`)
            }
            if (value && !(+value >= 0 && +value <= Number(res.data?.spot))) {
              return cb(
                t({
                  id: 'features_agent_join_index_5101502',
                  values: { 0: res.data?.spot },
                })
              )
            }
            return cb()
          },
        },
        contract: {
          required: true,
          validator: (value: string | undefined, cb) => {
            if (!value && Number(value) !== 0) {
              return cb(t`features_agent_join_index_ujlleodcza1gibxnx80sm`)
            }
            if (value && !(+value >= 0 && +value <= Number(res.data?.contract))) {
              return cb(
                t({
                  id: 'features_agent_join_index_5101502',
                  values: { 0: res.data?.contract },
                })
              )
            }
            return cb()
          },
        },
        borrowCoin: {
          required: true,
          validator: (value: string | undefined, cb) => {
            if (!value && Number(value) !== 0) {
              return cb(t`features_agent_join_index_cpa5tjbeb-nddzlpxxm7x`)
            }
            if (value && !(+value >= 0 && +value <= Number(res.data?.borrowCoin))) {
              return cb(
                t({
                  id: 'features_agent_join_index_5101502',
                  values: { 0: res.data?.borrowCoin },
                })
              )
            }
            return cb()
          },
        },
      })
    }
  }

  useEffect(() => {
    getManageInvitequery()
    agentInviteQueryMax()
  }, [])

  useEffect(() => {
    if (baseInfoResult.mobileNumber || baseInfoResult.email) {
      console.log(baseInfoResult.mobileNumber, baseInfoResult.email, 'baseInfoResult')
      form.setFieldValue('email', baseInfoResult.email || '')
      form.setFieldValue('phone', {
        selectVal: '',
        inputVal: baseInfoResult.mobileNumber || '',
      })
    }
  }, [baseInfoResult])

  const handleClearFormValue = (key: string) => {
    form.setFieldValue(key, '')
    form
      .validate([key])
      .then(() => setDisabled(false))
      .catch(() => setDisabled(true))
  }

  const onChangeEmailOrPhone = v => {
    setEmailOrPhone(v)
    // handleClearFormValue('email')
    // handleClearFormValue('phone')
    // handleClearFormValue('socialMedia')
  }

  const handleValidateChange = () => {
    const x = form.getFieldsValue()

    let isValidate = true

    Object.keys(x).map(key => {
      if (key !== 'comment' && typeof x[key] === 'undefined') {
        isValidate = false
      }

      return 0
    })

    isValidate &&
      form
        .validate()
        .then(() => setDisabled(false))
        .catch(() => setDisabled(true))
  }

  const email = Form.useWatch('email', form)
  const spot = Form.useWatch('spot', form)
  const contract = Form.useWatch('contract', form)
  const borrowCoin = Form.useWatch('borrowCoin', form)
  const invitationNum = Form.useWatch('invitationNum', form)

  const getSelectFormItem = () => {
    if (emailOrPhone === emailOrPhoneEnum.email) {
      return (
        <FormItem field="email" requiredSymbol={false} rules={[rules.email]}>
          <Input
            placeholder={t`user.validate_form_02`}
            autoFocus
            suffix={
              email && (
                <Icon name="del_input_box" hasTheme fontSize={18} onClick={() => handleClearFormValue('email')} />
              )
            }
          />
        </FormItem>
      )
    }

    if (emailOrPhone === emailOrPhoneEnum.phone) {
      return (
        <FormItem field="phone" requiredSymbol={false} rules={[rules.phone]}>
          <UserPhoneSelect />
        </FormItem>
      )
    }

    return (
      <FormItem field="socialMedia" requiredSymbol={false} rules={[rules.socialMedia]}>
        <WebSocializeSelect />
      </FormItem>
    )
  }

  const onSubmit = async values => {
    setShow(true)
    const params: any = {}
    params.contactInformation = values.email

    // 联系方式为手机号时
    if (emailOrPhone === emailOrPhoneEnum.phone) {
      params.mobileCountryCd = values.phone.selectVal
      params.contactInformation = values.phone.inputVal
    }

    // 联系方式为社交媒体时
    if (emailOrPhone === emailOrPhoneEnum.socialMedia) {
      params.socialMedia = values.socialMedia.selectVal
      params.contactInformation = values.socialMedia.inputVal
    }

    setFormValue({
      contact: emailOrPhone.toString(),
      invitationNum: values.invitationNum,
      rebates: {
        spot: values.spot || 0,
        contract: values.contract || 0,
        borrowCoin: values.borrowCoin || 0,
      },
      comment: values.comment,
      ...params,
    })
    // setJoinStatusEnum(JoinStatusEnum.pass)
  }

  /** 待审核 */
  if (auditStatus.status === JoinStatusEnum.noReview) {
    // register_success_white
    return (
      <section className={`personal-center-agent-join ${styles.scoped}`}>
        <div className="no-pass">
          <LazyImage
            // 设置大小防止闪动
            height={105}
            width={132}
            className="error-logo"
            src={`${oss_svg_image_domain_address}register_success${bg_suffix}.png`}
            // LOGO 直接显示图片，这里不需要 lazy load
            visibleByDefault
            whetherPlaceholdImg={false}
          />
          <div className="no-pass-title">{t`modules_kyc_verified_result_verified_5101153`}</div>
          <div className="no-pass-subtitle">{t`modules_kyc_verified_result_verified_5101154`}</div>
          <div className="no-pass-submit">
            <Link href={'/agent'}>
              <Button className="button" type="primary">
                {t`features_trade_spot_index_2510`}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  /** 申请未通过 */
  if (auditStatus.status === JoinStatusEnum.noPass) {
    // fail_icon
    return (
      <section className={`personal-center-agent-join ${styles.scoped}`}>
        <div className="no-pass">
          <LazyImage
            // 设置大小防止闪动
            height={78}
            width={78}
            className="error-logo"
            src={`${oss_svg_image_domain_address}${'agent/fail_icon.png'}`}
            // LOGO 直接显示图片，这里不需要 lazy load
            visibleByDefault
            whetherPlaceholdImg={false}
          />
          <div className="no-pass-title">{t`modules_kyc_verified_result_index_page_5101150`}</div>
          <div className="no-pass-subtitle">{t`features_agent_join_index_5101449`}</div>
          <div className="no-pass-submit">
            <Link href={'/agent'}>
              <Button
                className="button"
                type="primary"
                // onClick={() => setAuditStatus({ ...auditStatus, status: JoinStatusEnum.default })}
              >
                {t`features_agent_join_index_5101450`}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return <div></div>
  }

  return (
    <section className={`personal-center-agent-join ${styles.scoped}`}>
      <div
        className="header"
        style={{
          background: `url("${oss_svg_image_domain_address}${'agent/agent_center_bj.png?x-oss-process=image/auto-orient,1/quality,q_50'}") center center/cover no-repeat`,
        }}
      >
        <div className="header-box">
          <div className="header-box-text">{t`features_agent_join_index_5101451`}</div>
          <div className="header-box-sub-text">{t`features_agent_join_index_5101452`}</div>
        </div>
      </div>
      <div className="section">
        <div className="agent-join-form">
          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            // validateTrigger="onBlur"
            onChange={handleValidateChange}
          >
            <div className="agent-join-form-item">
              <div className="agent-join-form-item-label">{t`features_agent_join_index_5101453`}</div>
              <div className="agent-join-form-item-value">
                <div className="agent-join-form-item-select-box">
                  <Select
                    className="agent-join-form-item-select"
                    suffixIcon={
                      selectVisible ? (
                        <Icon name="arrow_close" hasTheme fontSize={8} />
                      ) : (
                        <Icon name="arrow_open" hasTheme fontSize={8} />
                      )
                    }
                    onVisibleChange={visible => setSelectVisible(visible)}
                    defaultValue={emailOrPhone}
                    onChange={onChangeEmailOrPhone}
                  >
                    {selectLists.map((item, i) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="agent-join-form-item-input">{getSelectFormItem()}</div>
              </div>
            </div>
            <div className="agent-join-form-item">
              <div className="agent-join-form-item-label">{t`features_agent_join_index_5101454`}</div>
              <div className="agent-join-form-item-value">
                <div className="agent-join-form-item-input">
                  <FormItem
                    field="spot"
                    disabled={!queryMax?.spot}
                    requiredSymbol={false}
                    rules={[rules.spot]}
                    normalize={value => {
                      if (value) {
                        return Number(value.replace(/[^\d^\\.]+/g, ''))
                      }

                      return value
                    }}
                  >
                    <Input
                      placeholder={t`features_agent_join_index_5101455`}
                      autoFocus={autoFocusIdx === AutoFocusEnum.spot}
                      onClick={() => setAutoFocusIdx(AutoFocusEnum.spot)}
                      suffix={
                        spot && (
                          <Icon
                            name="del_input_box"
                            hasTheme
                            fontSize={18}
                            onClick={() => handleClearFormValue('spot')}
                          />
                        )
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            <div className="agent-join-form-item">
              <div className="agent-join-form-item-label">{t`features_agent_join_index_5101456`}</div>
              <div className="agent-join-form-item-value">
                <div className="agent-join-form-item-input">
                  <FormItem
                    field="contract"
                    disabled={!queryMax?.contract}
                    requiredSymbol={false}
                    rules={[rules.contract]}
                    normalize={value => {
                      if (value) {
                        return Number(value.replace(/[^\d^\\.]+/g, ''))
                      }

                      return value
                    }}
                  >
                    <Input
                      placeholder={t`features_agent_join_index_5101457`}
                      autoFocus={autoFocusIdx === AutoFocusEnum.contract}
                      onClick={() => setAutoFocusIdx(AutoFocusEnum.contract)}
                      suffix={
                        contract && (
                          <Icon
                            name="del_input_box"
                            hasTheme
                            fontSize={18}
                            onClick={() => handleClearFormValue('contract')}
                          />
                        )
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            <div className="agent-join-form-item">
              <div className="agent-join-form-item-label">{t`features_agent_join_index_5101458`}</div>
              <div className="agent-join-form-item-value">
                <div className="agent-join-form-item-input">
                  <FormItem
                    field="borrowCoin"
                    disabled={!queryMax?.borrowCoin}
                    requiredSymbol={false}
                    rules={[rules.borrowCoin]}
                    normalize={value => {
                      if (value) {
                        return Number(value.replace(/[^\d^\\.]+/g, ''))
                      }

                      return value
                    }}
                  >
                    <Input
                      placeholder={t`features_agent_join_index_5101459`}
                      autoFocus={autoFocusIdx === AutoFocusEnum.borrowCoin}
                      onClick={() => setAutoFocusIdx(AutoFocusEnum.borrowCoin)}
                      suffix={
                        borrowCoin && (
                          <Icon
                            name="del_input_box"
                            hasTheme
                            fontSize={18}
                            onClick={() => handleClearFormValue('borrowCoin')}
                          />
                        )
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            <div className="agent-join-form-item">
              <div className="agent-join-form-item-label">{t`features_agent_join_index_5101460`}</div>
              <div className="agent-join-form-item-value">
                <div className="agent-join-form-item-input">
                  <FormItem
                    field="invitationNum"
                    requiredSymbol={false}
                    rules={[rules.userNumber]}
                    normalize={value => {
                      if (value) {
                        return Number(value.replace(/[^\d^]+/g, ''))
                      }

                      return value
                    }}
                  >
                    <Input
                      placeholder={t`features_agent_join_index_5101461`}
                      autoFocus={autoFocusIdx === AutoFocusEnum.userNumber}
                      onClick={() => setAutoFocusIdx(AutoFocusEnum.userNumber)}
                      suffix={
                        invitationNum && (
                          <Icon
                            name="del_input_box"
                            hasTheme
                            fontSize={18}
                            onClick={() => handleClearFormValue('invitationNum')}
                          />
                        )
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            <div className="agent-join-form-item">
              <div className="agent-join-form-item-label">{t`features_agent_join_index_5101462`}</div>
              <div className="agent-join-form-item-value">
                <div className="agent-join-form-item-input">
                  <FormItem field="comment" requiredSymbol={false}>
                    <TextArea
                      className="agent-join-form-item-textarea"
                      style={{ minHeight: 90 }}
                      showWordLimit
                      maxLength={500}
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            <div className="agent-join-form-item">
              <FormItem disabled={disabled}>
                <Button className="agent-join-form-item-button" type="primary" htmlType="submit">
                  {t`user.application_form_11`}
                </Button>
              </FormItem>
            </div>
          </Form>
        </div>
      </div>
      <CustomModal style={{ width: 360 }} className={styles['agent-join-modal']} visible={isShow}>
        <div className="agent-join-submit-box">
          <div className="agent-join-submit-header">
            <div className="agent-join-submit-header-title">{t`features_agent_join_index_5101463`}</div>
            <div className="agent-join-submit-header-icon">
              <Icon name="close" hasTheme fontSize={16} onClick={() => setShow(false)} />
            </div>
          </div>

          <div className="agent-join-submit-content">{t`features_agent_join_index_5101464`}</div>

          <div className="agent-join-submit-footer">
            <Button className="button" type="secondary" onClick={() => setShow(false)}>
              {t`trade.c2c.cancel`}
            </Button>
            <Button className="button" type="primary" onClick={() => joinInviteAdd()}>
              {t`user.field.reuse_17`}
            </Button>
          </div>
        </div>
      </CustomModal>
    </section>
  )
}

export default UserPersonalCenterAgentFormJoin
