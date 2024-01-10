import { memo, ReactNode, useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { Button, Form, Select, Alert, Switch, Checkbox, Message, Tooltip, Icon as ArcoIcon } from '@nbit/arco'

import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import cn from 'classnames'
import {
  fetchC2CAreaList,
  fetchC2CPaymentEnabled,
  fetchC2CPaymentList,
  fetchC2CPaymentReciveEnabled,
  fetchC2CPaymentReciveList,
  fetchC2CPaymentGet,
  fetchC2CPaymentAdd,
  fetchC2CNewPaymentAdd,
  fetchC2CPaymentModify,
  fetchC2NewCPaymentModify,
  fetchC2CPaymentReciveEditJudge,
  fetchC2CPaymentRemove,
} from '@/apis/c2c/center'
import { oss_area_code_image_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import { Input } from '@/components/input'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { adCodeDictionaryEnum } from '@/constants/c2c/advertise'
import { isNull } from 'lodash'
import { ConfirmModal } from '../modal'
import C2CEmpty from '../no-data'
import { BaseUpload } from '../upload'
import { C2CCenterRules } from '../utils/validate'
import styles from './coll-pay-manage.module.css'

const FormItem = Form.Item
const Option = Select.Option
/** 列表和后台配置项映射 */
const keyMap = {
  NAME: 'name',
  BANK_NAME: 'bankOfDeposit',
  BANK_ACCOUNT: 'account',
  PAYMENT_DETAIL: 'paymentDetails',
  BANK_BRANCH: 'bankBranch',
  QR_CODE: 'qrCodeAddr',
  // : 'bankOfDeposit'
}
const tabs = () => [
  t`features_c2c_advertise_advertise_detail_index_l7wec9dmflyuibhenbm78`,
  t`features_c2c_center_coll_pay_manage_index_zupiaxongsrn2bl5wsyaq`,
]
/** 字典值 */
type CodeType = {
  codeKey: string
  codeVal: string
}
enum TabEnum {
  collectionAccount = 0, // 收款账号
  paymentMethod = 1, // 付款方式
}
enum PayFormItemEnum {
  NAME = 'NAME',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  PAYMENT_DETAIL = 'PAYMENT_DETAIL',
  BANK_NAME = 'BANK_NAME',
  QR_CODE = 'QR_CODE',
}

const RequiredArray = ['NAME', 'BANK_ACCOUNT', 'PAYMENT_DETAIL', 'BANK_NAME']

enum paymentTypeCdEnum {
  bank = 'BANK', // 银行卡
  wechat = 'WECHAT', // 微信支付
  alipay = 'ALIPAY', // 支付宝
}

enum StatusCdEnum {
  enable = 'ENABLE', // 启用
  disable = 'DISABLE', // 关闭
}

type SelectListType = {
  payments: paymentTypeCdEnum[]
  paymentSupportItems: []
  icon: string
  value: string
  label: string
}

type ModalListType = {
  value: ReactNode
  label: string
}

type paymentType = {
  label: string
  color: string
  value: string
}

type TableListType = {
  label: string
  color: string
  type: string
  list: InfoList[]
}

type CoinType = {
  id: string
  name: string
}

type InfoList = {
  id: string
  name: string
  coins: CoinType[]
  bankName?: string
  isEnabled: boolean
  qrCode?: string
  account: string
  paymentTypeCd: string
}

type PaymentListType = {
  enabled: boolean
  paymentType: paymentTypeCdEnum
}

enum beforeVEnum {
  modify = 'modify', // 修改
  unbind = 'unbind', // 解绑
}

type beforeVType = beforeVEnum.modify | beforeVEnum.unbind | ''

function CollPayManage() {
  const [form] = Form.useForm()

  const rules = C2CCenterRules()
  // 获取支付方式字典值
  const { adCodeDictionary } = useC2CAdvertiseStore()
  const getPayTypeColorMap = () => {
    /** 通过字典值组装支付方式和颜色的映射对象 */
    const paymentType = adCodeDictionary[adCodeDictionaryEnum.Payment_Type] || []
    const paymentColor = adCodeDictionary[adCodeDictionaryEnum.Payment_Color] || []
    return Object?.keys(paymentType)?.reduce((prev, curr) => {
      const colorTypeArray = [paymentType[curr]?.codeKey, paymentColor[curr]?.codeKey]
      prev[curr] = colorTypeArray
      return prev
    }, {})
  }

  const PaymentTypeCdKV = (key: paymentTypeCdEnum) => {
    return getPayTypeColorMap()[key] || []
  }

  const paymentTypeLists = (): paymentType[] => {
    const payTypeColorMap = getPayTypeColorMap()
    return Object?.keys(payTypeColorMap)?.reduce((pre, cur, index) => {
      const [label, color] = payTypeColorMap[cur]
      pre.push({
        label,
        color,
        value: cur,
      })
      return pre
    }, [] as paymentType[])
  }
  const [touchId, setTouchId] = useState('') // 当前选中 id '' 表示新增
  const [touchTypeCd, setTouchTypeCd] = useState<paymentTypeCdEnum>(paymentTypeCdEnum.alipay) // 当前选中 支付类型
  const [beforeV, setBeforeV] = useState<beforeVType>('') // 前置条件缓存值
  const [loading, setLoading] = useState<boolean>(false) // 加载 loading...
  const [disabled, setDisabled] = useState<boolean>(true) // 表单禁用
  const [visible, setVisible] = useState<boolean>(false) // 新增 | 编辑 弹窗  当前选中 id '' 表示新增
  const [viewVisible, setViewVisible] = useState<boolean>(false) // 查看弹窗
  const [beforeVisible, setBeforeVisible] = useState<boolean>(false) // 前置 修改 & 解绑弹窗
  const [unBindVisible, setUnBindVisible] = useState<boolean>(false) // 解绑弹窗
  const [paymentTypeFilterLists, setPaymentTypeFilterLists] = useState<paymentType[]>(paymentTypeLists() || [])
  const legalCurrencyId = Form.useWatch('legalCurrencyId', form)

  const [search, setSearch] = useState({
    account: '',
    tradingArea: '',
  })
  const [tabIndex, setTabIndex] = useState<TabEnum>(TabEnum.collectionAccount)

  const [tableData, setTableData] = useState<TableListType[]>([])
  const [filterTableData, setFilterTableData] = useState<TableListType[]>([])
  const [paymentTableData, setPaymentTableData] = useState<PaymentListType[]>([])
  const [modalList, setModalList] = useState<ModalListType[]>([])
  const [selectList, setSelectList] = useState<SelectListType[]>([]) // 交易区 lists
  const [selectFilterList, setSelectFilterList] = useState<SelectListType[]>([]) // 交易区 lists filter
  const [modalSelectFilterList, setModalSelectFilterList] = useState<SelectListType[]>([])
  /** 动态表单项 */
  const [dynamicPayFormArray, setDynamicPayFormArray] = useState<CodeType[]>([])
  // 付款方式列表
  const c2cPaymentList = async () => {
    const res = await fetchC2CPaymentList({})

    if (res.isOk) {
      // debugger
      setPaymentTableData(res.data.paymentList)
    }
  }

  // 付款方式开关
  const c2cPaymentEnabled = async (paymentType, enabled) => {
    const res = await fetchC2CPaymentEnabled({ paymentType, enabled })

    if (res.isOk) {
      c2cPaymentList()
    }
  }

  // 收款方式列表
  const c2cPaymentReciveListOnLoad = async (legalCurrencyId = '') => {
    const { isOk: isAreaOk, data: areaList } = await fetchC2CAreaList({ returnAll: true })
    const { isOk: isPaymentOk, data: paymentList } = await fetchC2CPaymentReciveList(
      legalCurrencyId ? { legalCurrencyId } : {}
    )

    if (isAreaOk && isPaymentOk) {
      // Map legal currency IDs to their respective currencies
      const currencyMap = new Map(
        areaList
          .filter(item => item.statusCd === StatusCdEnum.enable)
          .map(item => [item.legalCurrencyId, item.currencyName])
      )

      // Group payment items by type
      const paymentTypeGroups = paymentList.recivePaymentList.reduce((groups, item) => {
        groups[item.paymentTypeCd] = groups[item.paymentTypeCd] || []
        groups[item.paymentTypeCd].push({
          ...item,
          id: item.id,
          name: item.name,
          coins: item.legalCurrencyId.split(',').map(id => ({ id, name: currencyMap.get(id) })),
          account: item.account || '',
          qrCode: item.qrCodeAddr || '',
          isEnabled: !!item.enabled,
          paymentTypeCd: item.paymentTypeCd,
          bankName: item.bankOfDeposit ?? '',
        })
        return groups
      }, {})

      // Convert payment type groups to table list types
      const tableData = Object.entries(paymentTypeGroups)
        .map(([type, list]) => {
          return {
            type,
            label: PaymentTypeCdKV(type as paymentTypeCdEnum)[0],
            color: PaymentTypeCdKV(type as paymentTypeCdEnum)[1],
            list,
          }
        })
        .filter(({ list }) => (list as InfoList[]).length > 0)

      // Update component state
      const selectList = areaList
        .filter(item => item.statusCd === StatusCdEnum.enable)
        .map(item => ({
          label: item.currencyName,
          value: item.legalCurrencyId,
          icon: item.countryAbbreviation,
          payments: item.payments,
          paymentSupportItems: item.paymentSupportItems,
        }))
      setSelectList(selectList)
      setSelectFilterList(selectList)
      setModalSelectFilterList(selectList)
      setTableData(tableData as TableListType[])
      setFilterTableData(tableData as TableListType[])
    }
  }

  // 收款方式开关
  const c2cPaymentReciveEnabled = async (id, enabled) => {
    const res = await fetchC2CPaymentReciveEnabled({ id, enabled })

    if (res.isOk) {
      c2cPaymentReciveListOnLoad()
    }
  }

  useEffect(() => {
    tabIndex === TabEnum.collectionAccount && c2cPaymentReciveListOnLoad()
    tabIndex === TabEnum.paymentMethod && c2cPaymentList()
  }, [tabIndex])

  const onKeySearchChange = (k, v) => {
    setSearch({ ...search, [k]: v })
  }

  const getTagText = (text, color = 'brand') => (
    <div className={styles['tag-text']}>
      <div className={`y-line`} style={{ backgroundColor: color }}></div>
      <div className="text">{text}</div>
    </div>
  )

  const maxLengthText = (text = '', maxLength = 10) => {
    return (
      <Tooltip content={<span>{text}</span>}>
        <span>
          {text.slice(0, maxLength)}
          {text.length > maxLength ? '...' : ''}
        </span>
      </Tooltip>
    )
  }

  const getListItem = (key, label, value) => {
    return (
      <div key={key} className="modal-list-item">
        <div className="list-item-label">{label}</div>
        <div className="list-item-value">{value}</div>
      </div>
    )
  }

  const searchTableData = (keyword: string) => {
    const result: TableListType[] = []
    tableData.map(category => {
      const filterData = category?.list?.filter(
        item => item?.name?.includes(keyword) || item?.account?.includes(keyword)
      )

      if (filterData.length > 0) {
        result.push({ ...category, list: filterData })
      }
      return null
    })

    setFilterTableData(result)
  }

  const renderTips = (data, map) => {
    const items = data.split(',').map(coinId => (map.get(coinId) || { label: '' }).label)

    return items.map((item, i) => (
      <div key={i} className={i + 1 !== items.length ? 'mr-2' : 'mr-0'}>
        {item}
      </div>
    ))
  }

  // 获取收付方式详情
  const c2cPaymentGet = async id => {
    const res = await fetchC2CPaymentGet({ id })

    if (res.isOk) {
      const payment = res.data.payment
      const map = new Map<string, any>()

      for (const item of selectList) {
        map.set(item.value, item)
      }

      const result: ModalListType[] = [
        {
          label: t`order.filters.tradeArea.tradeArea`,
          value: <div className="flex">{renderTips(payment.legalCurrencyId, map)}</div>,
        },
        {
          label: t`features/user/personal-center/settings/index-2`,
          value: getTagText(PaymentTypeCdKV(payment.paymentTypeCd)[0], PaymentTypeCdKV(payment.paymentTypeCd)[1]),
        },
      ]
      const dynamicPayFormList = paySelectChange(payment?.paymentTypeCd, payment?.legalCurrencyId)
      dynamicPayFormList?.forEach(i => {
        const codeKey = i.codeKey
        let item = {
          label: [PayFormItemEnum.BANK_ACCOUNT]?.includes(i?.codeVal)
            ? `${PaymentTypeCdKV(payment?.paymentTypeCd)[0]}${codeKey}`
            : codeKey,
          value: payment[keyMap[i.codeVal]],
        }
        if (i?.codeVal === PayFormItemEnum?.QR_CODE) {
          item = {
            label: t`features/user/personal-center/settings/payment/index-0`,
            value: (
              <div className="list-item-img">
                <LazyImage className="img" src={payment?.qrCodeAddr} />
              </div>
            ),
          }
        }
        result.push(item)
      })
      setModalList(result)
      setViewVisible(true)
    }
  }

  const handleValidateChange = () => {
    const x = form.getFieldsValue()

    if ((x.legalCurrencyId || []).length === 0) {
      form.setFieldValue('paymentTypeCd', '')
    }

    let isValidate = true

    Object.keys(x).map(key => {
      if (typeof x[key] === 'undefined') {
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

  const fetchBeforeVisible = async (id, type) => {
    if (!id || !type) return

    const res = await fetchC2CPaymentReciveEditJudge({ id, type })

    return res.isOk && res.data.isPass
  }

  const c2cPaymentUnBind = async l => {
    if (!(await fetchBeforeVisible(l.id, beforeVEnum.unbind))) {
      setBeforeV(beforeVEnum.unbind)
      setBeforeVisible(true)
      return
    }

    setTouchId(l.id)
    setTouchTypeCd(l.paymentTypeCd)
    setUnBindVisible(true)
  }

  const c2cPaymentUnbindFn = async () => {
    const res = await fetchC2CPaymentRemove({
      id: touchId,
    })

    if (res.isOk) {
      setUnBindVisible(false)
      c2cPaymentReciveListOnLoad()
    }
  }
  // 重置收款方式列表 legalCurrencyId - 当前选中交易区 id 列表
  const resetPaymentList = legalCurrencyId => {
    const result: paymentTypeCdEnum[][] = []
    let payFormItem = []
    const set = new Set<string>(legalCurrencyId || [])

    for (const id of set) {
      const x = selectList?.filter(list => list?.value === id)

      if (x?.length > 0) {
        result.push(x?.[0]?.payments)
      }
    }
    if (result.length > 0) {
      const intersection = result.reduce((curr, next) => curr.filter(c => next.includes(c)))

      const paymentTypeFilterList = paymentTypeLists().filter(list => {
        return intersection.includes(list.value as paymentTypeCdEnum)
      })

      setPaymentTypeFilterLists(paymentTypeFilterList)
    } else {
      setPaymentTypeFilterLists(paymentTypeLists() || [])
    }
  }

  /** 新增 */
  const c2cPaymentAdd = async () => {
    setTouchId('')
    form.clearFields()
    setDynamicPayFormArray([])
    selectList.length > 0 && form.setFieldValue('legalCurrencyId', [selectList[0].value])
    selectList.length > 0 && resetPaymentList(selectList[0].value)
    setVisible(true)
  }

  /** 编辑 */
  const c2cPaymentEdit = async l => {
    if (!(await fetchBeforeVisible(l.id, beforeVEnum.modify))) {
      setBeforeV(beforeVEnum.modify)
      setBeforeVisible(true)
      return
    }
    // 进行动态设置表单
    const { id, account, bankName, coins, name, paymentTypeCd, qrCode, legalCurrencyId } = l
    const result = paySelectChange(paymentTypeCd, legalCurrencyId)

    const formValues: any = { id, legalCurrencyId: (coins as CoinType[])?.map(coin => coin.id), paymentTypeCd } // 根据 type 动态设置不同的 k,v
    result?.forEach(i => {
      formValues[i?.codeVal] = l[keyMap[i?.codeVal]] || ''
    })
    setTouchId(l.id)
    form.setFieldsValue(formValues)
    setVisible(true)
  }

  const onSubmit = async values => {
    const {
      legalCurrencyId,
      paymentTypeCd,
      name,
      bankOfDeposit,
      bankAccount,
      alipayAccount,
      wechatAccount,
      qrCodeAddr,
    } = values
    if (loading) return
    setLoading(true)
    let res
    if (!touchId) {
      // 新增
      res = await fetchC2CNewPaymentAdd({
        ...values,
        legalCurrencyId: legalCurrencyId.join(','),
        paymentTypeCd,
        // name,
        type: 'IN', // 收付类型 (IN 收款 OUT 付款)
      })
    }

    if (touchId) {
      // 编辑
      res = await fetchC2NewCPaymentModify({
        ...values,
        id: touchId,
        legalCurrencyId: legalCurrencyId.join(','),
        paymentTypeCd,
        // name,
        // ...params,
      })
    }

    if (res.isOk) {
      Message.success(
        touchId
          ? t`features_c2c_center_coll_pay_manage_index_8qssjco4be2t2y2zjmju6`
          : t`features_c2c_center_coll_pay_manage_index_bpbgaqekwf9eriwq3zik7`
      )
      setVisible(false)
      c2cPaymentReciveListOnLoad()
    }
    setLoading(false)
  }

  const renderFormatFn = (val, isShowIcon = false) => {
    // When labelInValue is true, the value is an object
    const itemlist = selectList.find(item => item.value === val)

    if (itemlist) {
      return (
        <div className={styles['select-scope']}>
          {isShowIcon && (
            <div className="mr-2">
              <LazyImage className="img" src={`${oss_area_code_image_domain_address}${itemlist.icon}.png`} />
            </div>
          )}
          <div>{itemlist.label}</div>
        </div>
      )
    }

    return <div>{t`features_c2c_center_coll_pay_manage_index_tk8a8vmjwcwnlsbxvcbpj`}</div>
  }

  /** 可选交易区过滤 option */
  const filterChange = e => {
    if (!e) {
      setSelectFilterList(selectList)
      return
    }
    setSelectFilterList(selectList.filter(({ label = '' }) => (label ?? '').toUpperCase().includes(e.toUpperCase())))
  }

  /** 可选交易区过滤 option */
  const formFilterChange = e => {
    if (!e) {
      setModalSelectFilterList(selectList)
      return
    }
    setModalSelectFilterList(
      selectList.filter(({ label = '' }) => (label ?? '').toUpperCase().includes(e.toUpperCase()))
    )
  }

  /** 可选交易区选择全部 */
  const selectAll = () => {
    onKeySearchChange('tradingArea', '')
    c2cPaymentReciveListOnLoad(selectList.map(item => item.value).join(','))
  }

  /**
   *
   *支付方式选择
   */
  const paySelectChange = (payType: string, legalCurrencyId?: string) => {
    const formValue = form.getFieldsValue()
    setDynamicPayFormArray([])
    if (legalCurrencyId) {
      formValue.legalCurrencyId = legalCurrencyId.split(',')
    }

    /** 动态匹配设置对应的表单项 */
    let result = {}
    let payFormItem = []
    const set = new Set<string>(formValue?.legalCurrencyId || [])

    for (const id of set) {
      const x = selectList?.filter(list => list?.value === id)

      if (x?.length > 0) {
        result = {
          ...result,
          ...x?.[0]?.paymentSupportItems,
        }
      }
    }
    /** 获取所有的配置项表单项 */
    const paymentFormItems = adCodeDictionary[adCodeDictionaryEnum.PaymentSupportItems]
    const paymentSupportItems = adCodeDictionary[adCodeDictionaryEnum.PaymentSupportItems]
    /** 筛选出对应支付方式的表单项 */
    const filterResult = result[payType]?.reduce((pre, cur) => {
      pre.push(paymentFormItems[cur])
      return pre
    }, [])

    setDynamicPayFormArray(filterResult)
    // 先把表单手动设置为 null
    filterResult.forEach(i => {
      form.setFieldValue(i.codeVal, null)
    })
    form.validate()
    return filterResult
  }

  const handleOption = item => {
    onKeySearchChange('tradingArea', item.value)
    c2cPaymentReciveListOnLoad(item.value)
  }

  const handleLagalCurrencyFn = async (values, item) => {
    const set = new Set<string>(values.legalCurrencyId || [])

    if (set.has(item.value)) {
      set.delete(item.value)
    } else {
      set.add(item.value)
    }

    // resetPaymentList([...set])

    form.setFieldValue('legalCurrencyId', [...set])
    handleValidateChange()
  }
  /** 必填* */
  const getRequiredShowMark = () => <span style={{ color: 'red' }}>*</span>

  useEffect(() => {
    const lcId = legalCurrencyId || []
    if (lcId.length) {
      resetPaymentList(lcId)
      !touchId && form.setFieldValue('paymentTypeCd', '')
    }
  }, [legalCurrencyId])

  const stringLimitFn = (value: string | undefined, maxLength = 30) => {
    if (value) {
      return value.slice(0, maxLength)
    }

    return value
  }
  const getPayTip = () => {
    if (adCodeDictionaryEnum?.Payment_Remark && form?.getFieldValue('paymentTypeCd')) {
      const payTip = adCodeDictionary[adCodeDictionaryEnum?.Payment_Remark][form?.getFieldValue('paymentTypeCd')]
      return payTip ? (
        <div className="pay-tip">
          <div className="icon-tip">
            <Icon name="msg_black" />
          </div>

          <div className="content-tip">{payTip?.codeKey}</div>
        </div>
      ) : null
    }
    return ''
  }
  return (
    <div className={styles.scope}>
      <div className="coll-pay-manage-container">
        <div className="pay-manage-header">
          <div className="left">
            <div className="c2c-tabs">
              {tabs().map((tab, index) => (
                <div className="tab-box" key={index} onClick={() => setTabIndex(index)}>
                  <div className={cn('tab-item', { active: tabIndex === index })}>{tab}</div>
                  {tabIndex === index && <div className="x-line"></div>}
                </div>
              ))}
            </div>
          </div>

          {tabIndex === TabEnum.collectionAccount && (
            <div className="right">
              <Input
                className="search"
                // value={search.account}
                onChange={e => searchTableData(e)}
                filterEmoji
                placeholder={t`features_c2c_center_coll_pay_manage_index_xeply1hhm0ozy-snh2uhc`}
                prefix={<Icon name="search" hasTheme className="icon" />}
              />
              <Select
                className="select"
                value={search.tradingArea}
                dropdownMenuStyle={{ maxHeight: 270 }}
                placeholder={t`features_c2c_center_coll_pay_manage_index_tk8a8vmjwcwnlsbxvcbpj`}
                dropdownRender={menu => (
                  <div className={styles['select-content']}>
                    <div className="select-search-box">
                      <Input
                        className="select-search"
                        placeholder={t`help.center.support_02`}
                        filterEmoji
                        onChange={e => filterChange(e)}
                        prefix={<Icon name="search" hasTheme className="select-icon" />}
                      />
                    </div>
                    <div className="select-option-scroll">{menu}</div>
                  </div>
                )}
                unmountOnExit={false}
                renderFormat={(_, val) => renderFormatFn(val)}
              >
                <Option key="all" value="" className="select-all-btn" onClick={() => selectAll()}>
                  {t`common.all`}
                </Option>
                {selectFilterList.map((item, index) => (
                  <Option
                    key={item.value}
                    value={item.value}
                    onClick={() => handleOption(item)}
                    className="select-option"
                  >
                    <div className="left">
                      <div className="mr-2">
                        <LazyImage className="img" src={`${oss_area_code_image_domain_address}${item.icon}.png`} />
                      </div>
                      {item.label}
                    </div>
                  </Option>
                ))}
                {selectFilterList.length === 0 && (
                  <div className="text-center">
                    {t`features_c2c_center_coll_pay_manage_index_wzfb_ezw_tfm4odeika4g`}
                  </div>
                )}
              </Select>
              <Button className="btn" type="primary" onClick={() => c2cPaymentAdd()}>
                {t`features_c2c_advertise_post_advertise_index_ysrjqenh7kh2ucsite6p7`}
              </Button>
            </div>
          )}
        </div>

        <Alert
          className="pay-manage-alert"
          content={
            <div className="pay-manage-alert-label">
              {tabIndex === TabEnum.collectionAccount &&
                t`features_c2c_center_coll_pay_manage_index_ymhjahhjx2ozyzse9eit6`}
              {tabIndex === TabEnum.paymentMethod && t`features_c2c_center_coll_pay_manage_index_m6xnqsdoia5kuggama72y`}
            </div>
          }
          type="info"
        />

        {tabIndex === TabEnum.collectionAccount && filterTableData.length === 0 && (
          <div className="no-data">
            <C2CEmpty
              imageName="icon_default_no_search"
              text={t`features_c2c_center_coll_pay_manage_index_393ob061duduyvvocvp4z`}
            />
          </div>
        )}

        {tabIndex === TabEnum.paymentMethod && paymentTableData.length === 0 && (
          <div className="no-data">
            <C2CEmpty
              imageName="icon_default_no_search"
              text={t`features_c2c_center_coll_pay_manage_index_jjsfzci58hmpanq6vcib-`}
            />
          </div>
        )}

        {tabIndex === TabEnum.collectionAccount &&
          filterTableData.length !== 0 &&
          filterTableData.map((item, index) => (
            <div key={index} className="pay-manage-table">
              <div className="table-left">
                {getTagText(PaymentTypeCdKV(item.type as any)[0], PaymentTypeCdKV(item.type as any)[1])}
              </div>
              <div className="table-right">
                {/* 收款账号 */}
                {item.list.map((l, i) => (
                  <div key={l.id} className="pay-manage-table-list">
                    <div className="list-left">
                      <div className="list-text list-name">{maxLengthText(l.name)}</div>
                    </div>

                    <div className="list-center">
                      {l.coins.map((coin, i) => (
                        <div key={i} className="list-coin">
                          {coin.name}
                        </div>
                      ))}
                      {/* 银行卡 展示 */}
                      {l.bankName && l.account && (
                        <div className="list-text list-bank">
                          {maxLengthText(l.bankName, 12)}
                          {t`features_c2c_center_coll_pay_manage_index_loafhg8k4aubv8fnnpyqu`}
                          {maxLengthText(l.account, 20)}
                          {t`features_c2c_center_coll_pay_manage_index_kwjbatlrha5htpcfybg7j`}
                        </div>
                      )}
                      {/* 微信 & 支付宝 展示 */}
                      {l.account && !l.bankName && (
                        <div className="list-text list-bank">{maxLengthText(l.account, 20)}</div>
                      )}
                      {l.qrCode && (
                        <div className="mr-2">
                          <Icon name="rebates_drawing-qr" hasTheme fontSize={14} className="icon" />
                        </div>
                      )}
                      <div className="list-text view" onClick={() => c2cPaymentGet(l.id)}>
                        {t`features/orders/order-table-cell-1`}
                      </div>
                    </div>

                    <div className="list-right">
                      <div className="list-text edit" onClick={() => c2cPaymentEdit(l)}>
                        {t`assets.common.edit`}
                      </div>
                      <div className="list-text unbind" onClick={() => c2cPaymentUnBind(l)}>
                        {t`features_c2c_center_coll_pay_manage_index_nxqsybxakysjned5gilgm`}
                      </div>
                      <div className="list-switch">
                        <Switch
                          checked={l.isEnabled}
                          onChange={(val: boolean) => c2cPaymentReciveEnabled(l.id, val ? 1 : 0)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {tabIndex === TabEnum.paymentMethod &&
          paymentTableData.length !== 0 &&
          paymentTableData.map((item, index) => (
            <div key={index} className="pay-manage-table">
              <div className="table-left">
                {getTagText(PaymentTypeCdKV(item.paymentType)[0], PaymentTypeCdKV(item.paymentType)[1])}
              </div>
              <div className="table-right">
                <Switch
                  checked={item.enabled}
                  onChange={(val: boolean) => c2cPaymentEnabled(item.paymentType, val ? 1 : 0)}
                />
              </div>
            </div>
          ))}
      </div>

      {/* 新增 & 修改 弹窗 */}
      <ConfirmModal
        style={{ width: 444 }}
        visible={visible}
        setVisible={setVisible}
        confirmText={
          touchId
            ? t`components_chart_header_data_2622`
            : t`features_c2c_center_coll_pay_manage_index_vhapn4yvww3xpk9hdy55h`
        }
        // confirmDisabled={disabled}
        onSubmit={() => {
          const formValue = form.getFieldsValue()
          // 在该位置将原来手动设置为 null 的数据修改回来
          dynamicPayFormArray.forEach(i => {
            if (isNull(formValue[i?.codeVal])) {
              form.setFieldValue(i?.codeVal, '')
            }
          })
          form.submit()
        }}
      >
        <div className={styles.modal}>
          <div className="title">
            {touchId
              ? t`features_c2c_center_coll_pay_manage_index_sl8y1onjh-_tgbfna5zts`
              : t`features_c2c_advertise_post_advertise_index_ysrjqenh7kh2ucsite6p7`}
          </div>
          <Form
            form={form}
            layout="vertical"
            className="mb-6"
            onSubmit={onSubmit}
            autoComplete="off"
            // validateTrigger="onBlur"
            onChange={handleValidateChange}
          >
            <div className="modal-form-item">
              <div className="form-item-label">
                {getRequiredShowMark()}
                {t`order.filters.tradeArea.tradeArea`}
              </div>
              <FormItem field="legalCurrencyId" requiredSymbol={false} rules={[rules.legalCurrencyId]}>
                {values => {
                  return (
                    <Select
                      mode="multiple"
                      className="select-view"
                      dropdownMenuStyle={{ maxHeight: 270 }}
                      placeholder={t`features_c2c_trade_merchant_application_index_22222225101370`}
                      maxTagCount={4}
                      unmountOnExit={false}
                      renderFormat={(_, val) => renderFormatFn(val)}
                    >
                      <div className={styles['select-content']}>
                        <div className="select-search-box">
                          <Input
                            className="select-search"
                            placeholder={t`help.center.support_02`}
                            filterEmoji
                            onChange={e => formFilterChange(e)}
                            prefix={<Icon name="search" hasTheme className="select-icon" />}
                          />
                        </div>
                        <div className="mt-1.5"></div>
                        <div className="select-option-scroll">
                          {modalSelectFilterList.map(item => (
                            <Option
                              key={item.value}
                              value={item.value}
                              className="select-option"
                              onClick={() => handleLagalCurrencyFn(values, item)}
                            >
                              <div className="left">
                                <div className="mr-2">
                                  <LazyImage
                                    className="img"
                                    src={`${oss_area_code_image_domain_address}${item.icon}.png`}
                                  />
                                </div>
                                {item.label}
                              </div>
                              <div className="right">
                                <Checkbox checked={(values.legalCurrencyId || []).some(val => val === item.value)} />
                              </div>
                            </Option>
                          ))}
                          {modalSelectFilterList.length === 0 && (
                            <C2CEmpty
                              imageName="icon_default_no_search"
                              text={t`features_c2c_center_coll_pay_manage_index_ei-9edfr8lsfn7glt8mxq`}
                            />
                          )}
                        </div>
                      </div>
                    </Select>
                  )
                }}
              </FormItem>
              <div className="modal-form-item">
                <div className="form-item-label">
                  {getRequiredShowMark()}
                  {t`features/user/personal-center/settings/index-2`}
                </div>
                <FormItem field="paymentTypeCd" requiredSymbol={false} rules={[rules.paymentTypeCd]}>
                  <Select
                    placeholder={t`features_c2c_center_coll_pay_manage_index_3lsbwrqxhtc_fbkcfmwn0`}
                    onChange={e => paySelectChange(e)}
                  >
                    {paymentTypeFilterLists.map((item, i) => (
                      <Option key={i} value={item.value}>
                        <div className="flex h-10">{getTagText(item.label, item.color)}</div>
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                {getPayTip()}
                {/* </div> */}
              </div>
              <FormItem noStyle shouldUpdate>
                {({ paymentTypeCd = '', legalCurrencyId = [] }) => (
                  <>
                    {dynamicPayFormArray?.length
                      ? dynamicPayFormArray?.map(i => {
                          const codeVal = i?.codeVal
                          const codeKey = i?.codeKey
                          const paymentTypeCdLabel =
                            paymentTypeCd && adCodeDictionary[adCodeDictionaryEnum.Payment_Type][paymentTypeCd]?.codeKey
                          return codeVal !== PayFormItemEnum.QR_CODE ? (
                            <div className="modal-form-item">
                              <div className="form-item-label">
                                {RequiredArray.includes(codeVal) && getRequiredShowMark()}
                                {i?.codeVal === PayFormItemEnum.BANK_ACCOUNT
                                  ? `${paymentTypeCdLabel}${codeKey}`
                                  : codeKey}
                              </div>
                              <FormItem
                                field={codeVal}
                                requiredSymbol={false}
                                rules={[
                                  {
                                    required: true,
                                    /** isNull 是为了区分手动清空为空触发校验的情况 */
                                    validator: (value: string | undefined, cb) => {
                                      if (!value && RequiredArray.includes(codeVal) && !isNull(value)) {
                                        return cb(
                                          t({
                                            id: 'features_trade_trade_futures_calculator_futures_calculator_amount_index_k9ejpv80qztlpaolfvodu',
                                            values: { 0: codeKey },
                                          })
                                        )
                                      }

                                      return cb()
                                    },
                                  },
                                ]}
                                normalize={value => {
                                  // 银行账户做区分
                                  if (codeVal === PayFormItemEnum.BANK_ACCOUNT) {
                                    if (value) {
                                      return value.toString().slice(0, 30)
                                      // .toString()
                                      // .slice(0, 30)
                                    }

                                    return value
                                  }
                                  // 支付详情字段长度做区分
                                  return stringLimitFn(value, codeVal === PayFormItemEnum.PAYMENT_DETAIL ? 400 : 30)
                                }}
                              >
                                <Input
                                  className="ipt"
                                  filterEmoji
                                  placeholder={t({
                                    id: 'features_trade_trade_futures_calculator_futures_calculator_amount_index_k9ejpv80qztlpaolfvodu',
                                    values: { 0: i?.codeKey },
                                  })}
                                />
                              </FormItem>
                            </div>
                          ) : (
                            <div className="modal-form-item">
                              <div className="form-item-label">{t`features/user/personal-center/settings/payment/index-0`}</div>
                              <FormItem field={i?.codeVal} requiredSymbol={false}>
                                <BaseUpload />
                              </FormItem>
                            </div>
                          )
                        })
                      : null}

                    {(legalCurrencyId || []).length >= 2 && (
                      <div className="footer-text">
                        <div className="icon">
                          <LazyImage src={`${oss_svg_image_domain_address}c2c/icon-tips.svg`} width={4} height={4} />
                        </div>
                        <div className="text">{t`features_c2c_center_coll_pay_manage_index_saw0goartquemqjzajfqv`}</div>
                      </div>
                    )}
                  </>
                )}
              </FormItem>
            </div>
          </Form>
        </div>
      </ConfirmModal>

      {/* 查看 弹窗 */}
      <ConfirmModal
        style={{ width: 444 }}
        visible={viewVisible}
        setVisible={setViewVisible}
        isHiddenFooter
        onSubmit={() => {}}
      >
        <div className={styles.modal}>
          <div className="title">{t`features_c2c_center_coll_pay_manage_index_anpfloe_l5fbdd5wums2x`}</div>
          {modalList.map((list, index) => getListItem(index, list.label, list.value))}
        </div>
      </ConfirmModal>

      {/* 修改 & 解绑 前置弹窗 */}
      <ConfirmModal
        style={{ width: 312 }}
        visible={beforeVisible}
        setVisible={setBeforeVisible}
        isHideCancel
        isHiddenClose
        confirmText={t`features_agent_apply_index_5101501`}
        onSubmit={() => setBeforeVisible(false)}
      >
        <div className={styles.modal}>
          <div className="title-center">
            {beforeV === beforeVEnum.modify
              ? t`user.account_security_06`
              : t`features_c2c_center_coll_pay_manage_index_nxqsybxakysjned5gilgm`}
          </div>
          <div className="content">{t`features_c2c_center_coll_pay_manage_index_kjevglhdq8v4dtgqzheaw`}</div>
        </div>
      </ConfirmModal>
      {/* 解绑 弹窗 */}
      <ConfirmModal
        style={{ width: 360 }}
        visible={unBindVisible}
        setVisible={setUnBindVisible}
        confirmText={t`features_c2c_center_coll_pay_manage_index_jeg5oa9twcho-5kiwgfci`}
        onSubmit={() => c2cPaymentUnbindFn()}
      >
        <div className={styles.modal}>
          <div className="title-center">{t`features_c2c_center_coll_pay_manage_index_e300vyp24k4tuo90o9jtb`}</div>
          <div className="content">
            {t({
              id: 'features_c2c_center_coll_pay_manage_index_10b_x5coowcgg_dx9hcxu',
              values: { 0: PaymentTypeCdKV(touchTypeCd)[0] },
            })}
          </div>
        </div>
      </ConfirmModal>
    </div>
  )
}

export default memo(CollPayManage)
