import { useEffect, useRef, useState } from 'react'
import { Input, Spin } from '@nbit/arco'
import { useRequest } from 'ahooks'
import LazyImage from '@/components/lazy-image'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
// import { getMemberPhoneArea, getMemberPhoneAreaCode } from '@/apis/user'
import { getCodeDetailList } from '@/apis/common'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { useCommonStore } from '@/store/common'
import {
  UserEnabledStateTypeEnum,
  // UserSelectAreaTypeEnum
} from '@/constants/user'
import { MemberMemberAreaType } from '@/typings/user'
import styles from './index.module.css'

const InputSearch = Input.Search

// interface MemberMemberAreaType {
//   /** 地区值 */
//   codeVal: string
//   /** 国家名称 */
//   codeKey: number
//   /** 是否可用  */
//   enableInd?: number
//   /** 国家缩写 */
//   remark: string
// }

interface UserSearchAreaProps {
  /** 类型 */
  type: string
  /** 已选中的值 */
  checkedValue?: string
  /** 输入框提示文字 */
  placeholderText: string
  /** 结果列表点击回调函数 */
  selectArea(v: MemberMemberAreaType): void
}

function UserSearchArea({ type, checkedValue, placeholderText, selectArea }: UserSearchAreaProps) {
  const [searchList, setSearchList] = useState<Array<MemberMemberAreaType>>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const cacheList = useRef<Array<MemberMemberAreaType>>([])

  const { locale } = useCommonStore()

  // const searchResult = async values => {
  //   setLoading(true)
  //   if (type === UserSelectAreaTypeEnum.area) {
  //     const res = await getMemberPhoneArea({ searchParam: values })
  //     if (res.isOk) {
  //       setSearchList(res.data!.detailVOList || [])
  //     }
  //     setLoading(false)
  //   } else {
  //     const res = await getMemberPhoneAreaCode({ searchParam: values })
  //     if (res.isOk) {
  //       setSearchList(res.data!.detailVOList || [])
  //     }
  //     setLoading(false)
  //   }
  // }

  const searchResult = async () => {
    setLoading(true)
    const res = await getCodeDetailList({ codeVal: 'country_cd', lanType: locale })
    if (res.isOk && res.data) {
      cacheList.current = res.data
      setSearchList(res.data)
    }
    setLoading(false)
  }

  const { run } = useRequest(searchResult, {
    debounceWait: 500,
    manual: true,
  })

  useEffect(() => {
    run()
  }, [])

  const handleSearch = (value: string) => {
    if (!value) {
      setSearchValue(value)
      setSearchList(cacheList.current)
      return
    }

    const cacheSearchValue = value.toLocaleLowerCase().trim()
    const list: MemberMemberAreaType[] = []

    setSearchValue(cacheSearchValue)

    cacheList.current.forEach(v => {
      const listValue = `${v.codeKey}${v.codeVal}${v.remark}`.toLocaleLowerCase()
      if (listValue.includes(cacheSearchValue)) list.push(v)
    })

    setSearchList(list)
  }

  const handleSelectArea = (v: MemberMemberAreaType) => {
    // if (v.enableInd === UserEnabledStateTypeEnum.unEnable) {
    //   Message.error(t`user.search_area_02`)
    //   return
    // }

    selectArea(v)
    setSearchValue('')
    handleSearch('')
  }
  return (
    <div className={`user-search-area ${styles.scoped}`}>
      <div className="user-search-area-wrap">
        <div className="search">
          <InputSearch
            value={searchValue}
            placeholder={placeholderText}
            allowClear
            prefix={<Icon name="search" hasTheme />}
            onChange={handleSearch}
          />
        </div>
        <div className="search-list">
          {searchList.length > 0 ? (
            <>
              {searchList.map((v, index) => (
                <div
                  className={`item ${checkedValue === v.codeVal ? 'checked' : ''}`}
                  key={index}
                  onClick={() => handleSelectArea(v)}
                >
                  <div className="item-wrap">
                    <div className="icon">
                      <LazyImage src={`${oss_area_code_image_domain_address}${v.remark}`} />
                    </div>
                    <div className={`name ${v.enableInd === UserEnabledStateTypeEnum.unEnable ? 'un-enable' : ''}`}>
                      <label>{v.codeKey}</label>
                      {v.enableInd === UserEnabledStateTypeEnum.unEnable && (
                        <div className="enable">
                          <label>{t`user.search_area_01`}</label>
                        </div>
                      )}
                    </div>
                    <div className="area-number">
                      <label>+{v.codeVal}</label>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {loading && (
                <div className="search-list-spin">
                  <Spin dot />
                </div>
              )}
              {!loading && (
                <div className="no-result">
                  <Icon name="no_data" hasTheme isRemoteUrl width={108} height={80} />
                  <label>{t`user.search_area_03`}</label>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSearchArea
