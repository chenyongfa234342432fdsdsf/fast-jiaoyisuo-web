import { useRef } from 'react'
import { Select } from '@nbit/arco'
import CountryAreaSelect from '@/features/kyc/country-area-select'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
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

function C2cMaCountrySelect(props: Props) {
  const { onChange, value, disabled = false, showTipsNot = true } = props

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const handleSelectArea = (_, item: any) => {
    const { enableInd, remark, codeKey } = item?.extra || {}
    onChange && onChange(codeKey)
  }

  const setCountrySelectList = (CountrySelectLists: MemberMemberPhoneAreaType[]): React.ReactNode => {
    return CountrySelectLists?.map((option, index) => (
      <Option
        key={index}
        value={option.codeKey}
        extra={option}
        // disabled={option.enableInd === AreaEnableEnum.unenable}
      >
        <div className="country-select-label">
          <LazyImage
            whetherPlaceholdImg={false}
            src={`${oss_area_code_image_domain_address}${option.remark}.png`}
            className="mr-2"
          />
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
        {/* <LazyImage whetherPlaceholdImg={false} src={`${oss_area_code_image_domain_address}${option?.extra?.remark}`} /> */}
        <div className="country-render-name"> {option?.extra?.codeKey}</div>
      </div>
    ) : (
      ''
    )
  }

  return (
    <div className={styles.container} ref={countrySelectRef}>
      <CountryAreaSelect
        placeholder={t`features_user_company_basic_imformation_index_2585`}
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
    </div>
  )
}

export default C2cMaCountrySelect
