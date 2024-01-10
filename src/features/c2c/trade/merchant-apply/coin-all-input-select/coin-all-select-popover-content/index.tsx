import { useEffect, useRef, useState } from 'react'
import { Input } from '@nbit/arco'
import Icon from '@/components/icon'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import LazyImage from '@/components/lazy-image'
import { YapiGetV1C2CCoinAllListData } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { useClickAway } from 'ahooks'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface Props {
  onChange?: (v: string) => void
  setPopoverClose: () => void
  value?: string
}

export function C2cMaCoinAllSelectPopoverContent(props: Props) {
  const { value, onChange, setPopoverClose } = props
  const store = useC2CMaStore()

  const [options, setOptions] = useState<YapiGetV1C2CCoinAllListData[]>([])
  const originList = store.cache.allCoinsV1
  const resetOptions = () => {
    setOptions(originList)
  }
  useEffect(() => {
    resetOptions()
  }, [originList])

  const [searchInput, setSearchInput] = useState('')

  const setSelectValue = e => {
    onChange && onChange(e)
  }

  const setChangeInput = input => {
    setSearchInput(input)

    if (!input) {
      resetOptions()
      return
    }
    const filtered = originList.filter(x => x?.coinName?.toLowerCase().includes(String(input).trim().toLowerCase()))
    setOptions(filtered)
  }

  const containerRef = useRef(null)
  useClickAway(
    () => {
      setPopoverClose()
    },
    containerRef,
    ['click', 'contextmenu']
  )
  return (
    <div className={styles.scope} ref={containerRef}>
      <div className="search-wrapper">
        <Input
          value={searchInput}
          className="country-input"
          onChange={setChangeInput}
          placeholder={t`help.center.support_02`}
          prefix={<Icon name="search" hasTheme />}
          suffix={
            <Icon
              name="del_input_box"
              hasTheme
              className="close"
              onClick={() => {
                setSearchInput('')
                setOptions(originList)
              }}
            />
          }
        />
      </div>

      {options.map((option, index) => (
        <div
          key={option.id}
          className={`option-row`}
          onClick={() => {
            setSelectValue(option.id)
            setPopoverClose()
          }}
        >
          <div className="px-3 py-1 flex items-center option-content">
            <div className="icon-wrapper">
              <LazyImage whetherPlaceholdImg={false} src={`${option.webLogo}`} height={20} width={20} />
            </div>

            <div className={classNames('coin-wrapper', { selected: value === option.id })}>
              <div>{option.coinName}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
