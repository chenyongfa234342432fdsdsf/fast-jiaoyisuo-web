import { memo, useState, useRef } from 'react'
import { Select, Input, SelectProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useMount, useRequest } from 'ahooks'
import { getCodeDetailList } from '@/apis/common'
import Icon from '@/components/icon'
import { useCommonStore } from '@/store/common'
import { MemberMemberPhoneAreaType } from '../kyt-const'
import styles from './countryareaselect.module.css'

interface Props extends SelectProps {
  setCountrySelectList: (e: MemberMemberPhoneAreaType[]) => React.ReactNode
  requestType: string
}

function CountrySelect(props: Props) {
  const { onChange, value, setCountrySelectList, renderFormat, onVisibleChange } = props

  const { locale } = useCommonStore()

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const countryList = useRef<MemberMemberPhoneAreaType[]>([])

  const [filterContryNoData, setFilterContryNoData] = useState<boolean>(false)

  const [countrySelectList, setSelectList] = useState<MemberMemberPhoneAreaType[]>([])

  const [countryValue, setCountryValue] = useState<string>('')

  const searchResult = async () => {
    const { isOk, data } = await getCodeDetailList({ codeVal: 'country_cd', lanType: locale })

    if (isOk) {
      const list = data || []
      const selectList = list?.filter(item => item.remark)
      countryList.current = selectList as unknown as any
      setSelectList(selectList as unknown as any)
      if (!selectList.length) {
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
    run()
  })

  const onCountryInputDelete = () => {
    if (countryList.current) {
      setCountryValue('')
      setFilterContryNoData(false)
      setSelectList(countryList.current)
    }
  }

  const setNationalFiltration = inputValue => {
    if (countryList.current) {
      const filterCountryList = countryList.current
        .filter(item => item.codeKey.indexOf(inputValue) !== -1)
        .sort((a, b) => {
          const codeKeyRemark = a.remark?.toLowerCase()
          const countryValueRemark = b.remark?.toLowerCase()
          if (codeKeyRemark === countryValueRemark) return 0
          return codeKeyRemark < countryValueRemark ? -1 : 1
        })
        .map(item => {
          item.filterNum = item.codeKey.indexOf(inputValue)
          return item
        })
        .sort((a, b) => {
          if (a.filterNum && b?.filterNum) {
            return a.filterNum - b.filterNum
          }
          return 0
        })
      setSelectList(filterCountryList)
      !filterCountryList.length ? setFilterContryNoData(true) : setFilterContryNoData(false)
    }
  }

  const onSearch = e => {
    const inputValue = e.trim()
    setCountryValue(inputValue)
    if (!inputValue && countryList.current) {
      setSelectList(countryList.current)
      setFilterContryNoData(false)
    } else {
      setNationalFiltration(inputValue)
    }
  }

  const setInitailValue = juage => {
    if (!juage) {
      onSearch('')
    }

    onVisibleChange && onVisibleChange(juage)
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
          <Input
            className="country-input"
            value={countryValue}
            onChange={onSearch}
            size="small"
            suffix={
              countryValue.length && (
                <Icon
                  className="useful-expressions-delete"
                  name="del_input_box"
                  hasTheme
                  onClick={onCountryInputDelete}
                />
              )
            }
            prefix={<Icon name="search" hasTheme />}
          />
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
