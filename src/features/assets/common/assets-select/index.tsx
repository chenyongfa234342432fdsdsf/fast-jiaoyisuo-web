import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { Select, Input, SelectProps } from '@nbit/arco'
import LazyImage from '@/components/lazy-image'
import { CoinStateEnum } from '@/constants/assets'
import { AllCoinListResp, ISubCoinList } from '@/typings/api/assets/assets'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import Styles from './index.module.css'

interface AssetSelectProps extends SelectProps {
  children?: React.ReactNode
}

interface SelectOptionProps {
  /** id key 值 */
  idKey: string
  /** 展示 name key 值 */
  nameKey: string
  /** 展示 图片 key 值 */
  imgKey: string
  /** 图片是否需要拼接 oss 地址 */
  adrOSS?: string
  /** 是否需要拼接后缀 */
  imgSuffix?: string
  /** 搜索值 */
  searchKey: string
}
interface AssetSelectRenderProps extends SelectProps {
  children?: React.ReactNode
  selectOption?: SelectOptionProps
  listData: any[]
  onSearchInput: (val: string) => void
}
/** 重置 select 下拉图标 */
export function AssetSelect(props: AssetSelectProps) {
  const { className = 'select-coin', placeholder = t`common.all` } = props

  return (
    <Select
      {...props}
      className={className}
      arrowIcon={<Icon name="arrow_open" hasTheme className={Styles['assets-select-icon']} width={8} height={8} />}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
    />
  )
}

/**
 * 带搜索的下拉组件
 * @param props
 * @returns
 */
export function AssetSelectRender(props: AssetSelectRenderProps) {
  const { selectOption, listData, onSearchInput } = props
  const {
    idKey = 'id',
    nameKey = 'name',
    imgKey = 'img',
    adrOSS = '',
    imgSuffix = '',
    searchKey = '',
  } = selectOption || {}
  const Option = Select.Option
  return (
    <AssetSelect
      {...props}
      onVisibleChange={(visible: boolean) => {
        if (!visible) {
          onSearchInput('')
        }
      }}
      renderFormat={(option: OptionInfo | null) => {
        return option && option.value ? (
          <div className={Styles['select-info-render']}>
            <LazyImage src={`${adrOSS}${option.extra[imgKey]}${imgSuffix}`} />
            <span>{option.extra[nameKey]}</span>
          </div>
        ) : (
          t`common.all`
        )
      }}
    >
      <div className={Styles['select-search-wrap']}>
        <Input
          className="search-input"
          value={searchKey}
          onChange={val => {
            onSearchInput(val)
          }}
          size="small"
          allowClear
          prefix={<Icon name="search" className="input-search-icon" hasTheme />}
        />
      </div>
      <Option key="all" value="">
        {t`common.all`}
      </Option>
      {listData.map(item => (
        <Option value={item[idKey]} key={item[idKey]} extra={item}>
          <div className={Styles['select-value-wrap']}>
            <LazyImage src={`${adrOSS}${item[imgKey]}${imgSuffix}`} />
            {item[nameKey]}
          </div>
        </Option>
      ))}
      {!listData ||
        (!listData.length && (
          <div className={Styles['select-nodata-wrap']}>{t`features_kyc_country_area_select_index_5101213`}</div>
        ))}
    </AssetSelect>
  )
}

export function CoinInfoRender({ coin }: { coin: AllCoinListResp }) {
  return (
    <div className={Styles['coin-select']}>
      <div className="coin-name">
        <LazyImage src={coin && coin.webLogo} width={24} height={24} />
        <span>{coin.coinName}</span>
      </div>
      <div>
        <span className="coin-descr">{coin.coinFullName}</span>
        <Icon name="arrow_open" hasTheme />
      </div>
    </div>
  )
}

export function CoinSelect({
  setVisibleCoinList,
  coin,
}: {
  setVisibleCoinList(val): void
  coin: AllCoinListResp | undefined
}) {
  return (
    <div onClick={() => setVisibleCoinList(true)} className={Styles['coin-input']}>
      {!coin ? (
        <Input
          className="assets-input"
          suffix={<Icon name="arrow_open" hasTheme className="w-2 h-2" />}
          placeholder={t`assets.deposit.selectCoinPlease`}
          readOnly
        />
      ) : (
        <CoinInfoRender coin={coin} />
      )}
    </div>
  )
}

export function NetWorkSelect({
  selectValue,
  networkList,
  onChangeFn,
}: {
  selectValue?: ISubCoinList | null | string
  networkList: ISubCoinList[]
  onChangeFn(val): void
}) {
  const Option = Select.Option
  return (
    <Select
      placeholder={t`assets.deposit.selectNetwork`}
      arrowIcon={<Icon name="arrow_open" hasTheme className="w-2 h-2" />}
      onChange={onChangeFn}
      value={selectValue ? JSON.stringify(selectValue) : undefined}
    >
      {networkList &&
        networkList.length > 0 &&
        networkList.map(option => (
          <Option key={option.id} value={JSON.stringify(option)}>
            {option.isDeposit === CoinStateEnum.close ? (
              <div className="text-text_color_04">
                {option.mainType}
                <span className="ml-3 px-2 py-1 text-xs rounded bg-line_color_01 text-text_color_03">{t`assets.deposit.suspended`}</span>
              </div>
            ) : (
              option.mainType
            )}
          </Option>
        ))}
    </Select>
  )
}
