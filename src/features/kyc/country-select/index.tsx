import { memo, useState, useRef } from 'react'
import { Select, Modal, Message } from '@nbit/arco'
import CountryAreaSelect from '@/features/kyc/country-area-select'
import { t } from '@lingui/macro'
import { useUpdateEffect } from 'ahooks'
import LazyImage from '@/components/lazy-image'
import { useUserStore } from '@/store/user'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import styles from './countryselect.module.css'

const Option = Select.Option

enum AreaEnableEnum {
  enable = 1, // 可用
  unenable = 2, // 不可用
}

type Props = {
  onChange?: (e: string | undefined) => void
  value?: Record<'cnNmae' | 'imgUrl' | 'label' | 'name' | 'src' | 'value', string>
  selectCountry?: string
  disabled?: boolean
  showTipsNot?: boolean
}

type MemberMemberPhoneAreaType = {
  codeVal: string
  enableInd?: number
  codeKey: string
  remark: string
}

function CountrySelect(props: Props) {
  const { onChange, value, disabled = false, showTipsNot = true } = props

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const willSelectValue = useRef<string>('')

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [showTipCountry, setShowTipCountry] = useState<string>('')

  const setSelectModalOk = () => {
    onChange && onChange(willSelectValue.current)
    setModalVisible(false)
  }
  const { userInfo } = useUserStore()

  const setSelectModalCancel = () => {
    setModalVisible(false)
  }

  useUpdateEffect(() => {}, [modalVisible])

  const handleSelectArea = (_, item: any) => {
    const { enableInd, remark, codeKey } = item?.extra || {}
    if (enableInd === AreaEnableEnum.unenable) {
      Message.error(t`user.search_area_02`)
      return
    }
    willSelectValue.current = remark
    setShowTipCountry(codeKey)

    if (userInfo?.regCountryCd !== remark && showTipsNot && item) {
      setShowTipCountry(() => {
        setModalVisible(true)
        return codeKey
      })
    } else {
      onChange && onChange(willSelectValue.current)
    }
  }

  const setCountrySelectList = (CountrySelectLists: MemberMemberPhoneAreaType[]): React.ReactNode => {
    return CountrySelectLists?.map((option, index) => (
      <Option
        key={option.codeVal + index}
        value={option.remark}
        extra={option}
        disabled={option.enableInd === AreaEnableEnum.unenable}
      >
        <div className="country-select-label">
          <LazyImage whetherPlaceholdImg={false} src={`${oss_area_code_image_domain_address}${option.remark}`} />
          {option.codeKey}
          {option.enableInd === AreaEnableEnum.unenable && (
            <div className="country-select-nothandle">{t`user.search_area_01`}</div>
          )}
        </div>

        <div className="country-select-shortname">
          <div>{option.remark}</div>
        </div>
      </Option>
    ))
  }

  const renderFormat = option => {
    return option ? (
      <div className="country-render-format">
        <LazyImage whetherPlaceholdImg={false} src={`${oss_area_code_image_domain_address}${option?.extra?.remark}`} />
        <div className="country-render-name"> {option?.extra?.codeKey}</div>
      </div>
    ) : (
      ''
    )
  }

  return (
    <div className={styles.container} ref={countrySelectRef}>
      <CountryAreaSelect
        placeholder={t`features_user_country_select_index_2593`}
        dropdownMenuClassName="country-select"
        value={value}
        disabled={disabled}
        allowClear
        defaultActiveFirstOption={false}
        onChange={handleSelectArea}
        setCountrySelectList={setCountrySelectList}
        renderFormat={renderFormat}
        requestType="area"
      />
      <Modal
        title={t`trade.c2c.max.reminder`}
        visible={modalVisible}
        getPopupContainer={() => countrySelectRef.current as Element}
        wrapClassName="country-select-modal"
        onCancel={setSelectModalCancel}
        onOk={setSelectModalOk}
      >
        <div>
          {t`features_user_country_select_index_5101186`}
          {showTipCountry}
          <span>{t`features_user_country_select_index_5101187`}</span>
        </div>
        <div className="country-select-tips">({t`features_user_country_select_index_2595`})</div>
      </Modal>
    </div>
  )
}

export default memo(CountrySelect)
