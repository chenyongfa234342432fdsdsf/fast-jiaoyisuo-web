import { memo, useState, useRef } from 'react'
import { Select, Input, SelectProps } from '@nbit/arco'
import { IconSearch } from '@nbit/arco/icon'
import { useMount, useRequest } from 'ahooks'
import { t } from '@lingui/macro'
import { getMemberPhoneArea, getMemberPhoneAreaCode } from '@/apis/user'
import { MemberMemberPhoneAreaType } from '../initial-person/intialperson'
import styles from './countryareaselect.module.css'

interface Props extends SelectProps {
  setCountrySelectList: (e: MemberMemberPhoneAreaType[]) => React.ReactNode
  requestType: string
}

function CountrySelect(props: Props) {
  const { onChange, value, setCountrySelectList, requestType, renderFormat } = props

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const [filterContryNoData, setFilterContryNoData] = useState<boolean>(false)

  const [countrySelectList, setSelectList] = useState<MemberMemberPhoneAreaType[]>([])

  const searchResult = async values => {
    const requestObj = {
      phone: getMemberPhoneAreaCode,
      area: getMemberPhoneArea,
    }
    const { isOk, data } = await requestObj[requestType]({ searchParam: values })
    if (isOk) {
      const list = data?.detailVOList || []
      setSelectList(list)
      if (!list.length) {
        setFilterContryNoData(true)
      } else {
        setFilterContryNoData(false)
      }
    }
  }

  const { run } = useRequest(searchResult, {
    debounceWait: 500,
    manual: true,
  })

  useMount(() => {
    run('')
  })

  const onSearch = e => {
    const inputValue = e.trim()
    if (!inputValue) {
      run('')
      setFilterContryNoData(false)
    } else {
      run(inputValue)
    }
  }

  const setInitailValue = juage => {
    if (!juage) {
      onSearch('')
    }
  }

  return (
    <div className={styles.container} ref={countrySelectRef}>
      <Select
        {...props}
        value={value}
        onChange={onChange}
        getPopupContainer={() => countrySelectRef.current as Element}
        virtualListProps={{
          isStaticItemHeight: false,
          threshold: null,
        }}
        onVisibleChange={setInitailValue}
        renderFormat={renderFormat}
      >
        <div className="useful-expressions">
          <Input className="country-input" onChange={onSearch} size="small" prefix={<IconSearch />} />
          {/* {!selectQuery && <div className="useful-expressions-item">{countrySelectList[0]?.label}</div>} */}
        </div>
        {/* {!selectQuery && setCountrySelectList(countrySelectList[0])}
        {!selectQuery && (
          <div className="useful-expressions">
            <div className="useful-expressions-item">{countrySelectList[1]?.label}</div>
          </div>
        )} */}
        {setCountrySelectList(countrySelectList)}
        {filterContryNoData && (
          <div className="country-select-nodata">{t`features_kyc_country_area_select_index_5101213`}</div>
        )}
      </Select>
    </div>
  )
}

export default memo(CountrySelect)
