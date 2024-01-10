import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import LazyImage from '../../../../../components/lazy-image'
import { oss_area_code_image_domain_address } from '../../../../../constants/oss'
import { getC2CAreaCoinList } from '../../../../../apis/c2c/c2c-trade'
import styles from './index.module.css'

interface Props {
  advertDirect?: string
  coinName?: string
  countryAbbreviation?: string
  currencyName?: string
  currencySymbol?: string
  areaId?: string
  price?: string
  coinsList?: YapiPostV1C2CCoinListData[]
}

function Header(props: Props) {
  const { advertDirect, coinName, currencyName, price, countryAbbreviation, areaId, currencySymbol, coinsList } = props

  const [coinIconUrl, setCoinIconUrl] = useState<string>('')

  // 获取币种的 icon
  useEffect(() => {
    if (coinsList && coinsList?.length > 0) {
      const index = coinsList.findIndex((item: any) => item.coinName === coinName)
      if (index !== -1) {
        setCoinIconUrl((coinsList[index] as any).webLogo)
      }
    }
  }, [areaId, coinName, coinsList])

  return (
    <div className={styles.container}>
      <div className="flex justify-center pt-8 pb-2">
        <div className="bid">
          <div className="bid-item">
            <div className="text-sm text-text_color_02">{t`features_c2c_advertise_post_advertise_index_ca8fhkgmza9zqaenip5bk`}</div>
            {advertDirect === 'BUY' ? (
              <div className="text-sell_down_color text-base font-medium">{t`features_c2c_trade_bid_trade_detail_bid_header_index_oz77cizrvx`}</div>
            ) : (
              <div className="text-buy_up_color text-base font-medium">{t`features_c2c_trade_bid_trade_detail_bid_header_index_yynaa2wblu`}</div>
            )}
            <div></div>
          </div>
          <div className="bid-item">
            <div className="text-text_color_02">{t`order.filters.coin.placeholder`}</div>
            <div className="flex items-center ">
              <LazyImage className="w-4 h-4 mr-1" src={coinIconUrl || ''} />
              <div>{coinName || ''}</div>
            </div>
          </div>
          <div className="bid-item">
            <div className="text-text_color_02">{t`features_c2c_advertise_advertise_history_search_form_index_cna-fpvzalvaxcvr_9oys`}</div>
            <div className="flex items-center ">
              <LazyImage
                className="w-4 h-4 mr-1"
                style={{ objectFit: 'cover', width: '4rem', height: '4rem', borderRadius: '2rem' }}
                src={`${oss_area_code_image_domain_address}${countryAbbreviation}.png`}
              />
              <div>{currencyName || ''}</div>
            </div>
          </div>
          <div className="bid-item">
            <div className="text-text_color_02">{t`trade.c2c.singleprice`}</div>
            <div className={advertDirect === 'BUY' ? 'text-sell_down_color' : 'text-buy_up_color'}>
              {currencySymbol}
              {price || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
