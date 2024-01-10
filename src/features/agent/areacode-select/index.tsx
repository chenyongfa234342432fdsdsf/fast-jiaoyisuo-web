import { memo, useRef, useState } from 'react'
import { Select, Message } from '@nbit/arco'
import CountryAreaSelect from '@/features/kyc/country-area-select'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { MemberMemberPhoneAreaType } from '@/features/kyc/kyt-const'
import Icon from '@/components/icon'
import styles from './countryselect.module.css'

const Option = Select.Option
type Props = {
  onChange?: (e: number | undefined) => void
  value?: string
}

enum AreaEnableEnum {
  enable = 1, // 可用
  unenable = 2, // 不可用
}

function CountrySelect(props: Props) {
  const [selectVisible, setSelectVisible] = useState<boolean>(false)
  const { onChange, value } = props

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const handleSelectArea = (_, item: any) => {
    const { enableInd, codeVal } = item?.extra || {}
    if (enableInd === AreaEnableEnum.unenable) {
      Message.error(t`user.search_area_02`)
      return
    }

    onChange && onChange(codeVal)
  }

  const setCountrySelectList = (CountrySelectLists: MemberMemberPhoneAreaType[]): React.ReactNode => {
    return CountrySelectLists?.map((option, index) => (
      <Option
        key={option.codeVal + index}
        value={option.codeVal}
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
          <div>{option.codeVal}</div>
        </div>
      </Option>
    ))
  }

  const renderFormat = option => {
    return option ? (
      <div className="country-render-format">
        <LazyImage whetherPlaceholdImg={false} src={`${oss_area_code_image_domain_address}${option?.extra?.remark}`} />
        <div className="country-render-encode"> {`+ ${option?.extra?.codeVal}`}</div>
      </div>
    ) : (
      ''
    )
  }

  return (
    <div className={styles.container} ref={countrySelectRef}>
      <CountryAreaSelect
        className={styles.select}
        style={{ width: 134 }}
        dropdownMenuStyle={{ width: 410 }}
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
        placeholder={t`features_user_country_select_index_2593`}
        dropdownMenuClassName="area-code-select"
        value={value}
        defaultActiveFirstOption={false}
        onChange={handleSelectArea}
        setCountrySelectList={setCountrySelectList}
        renderFormat={renderFormat}
        requestType="phone"
      />
    </div>
  )
}

export default memo(CountrySelect)
