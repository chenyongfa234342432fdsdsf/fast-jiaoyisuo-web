import { t } from '@lingui/macro'
import { CoinTradingStatusTypeEnum } from '@/constants/c2c/common'
import { baseUserStore } from '@/store/user'
import cacheUtils from 'store'
import { getServerCacheC2cAreaList } from '../cache/server'
import { getBusinessName } from '../common'

export async function getC2cDefaultSeoMeta(pageTitle?: string) {
  let defaultCurrencyList = ['CNY']
  const areaList = await getServerCacheC2cAreaList()
  defaultCurrencyList = areaList
    .filter(item => {
      return item.statusCd === CoinTradingStatusTypeEnum.enable
    })
    .map(item => item.currencyName)
  const values = {
    currencyList: defaultCurrencyList.join(t`features_c2c_trade_ad_list_2222222225101679`),
    businessName: getBusinessName(),
  }
  const preTitle = pageTitle ? `${pageTitle} | ` : ''

  return {
    title: `${preTitle}${t({
      id: `modules_c2c_trade_index_page_gcw9acagqf`,
      values,
    })}`,
    description: `${preTitle}${t({
      id: `modules_c2c_trade_index_page_y1nsgrwbv3`,
      values,
    })}`,
  }
}

export async function getKycDefaultSeoMeta(pageTitle?: string) {
  const values = {
    businessName: getBusinessName(),
  }
  const preTitle = pageTitle ? `${pageTitle} | ` : ''

  return {
    title: `${preTitle}${t({
      id: `modules_kyc_company_verified_material_index_page_server_qovx8dpfv3`,
      values,
    })}`,
    description: `${preTitle}${t({
      id: `modules_assets_company_verified_material_index_page_server_efre42ngx6`,
      values,
    })}`,
  }
}

export function getCacheThirdBindUser(key) {
  const uid = baseUserStore.getState()?.userInfo?.uid
  return cacheUtils.get(`${key}${uid}`)
}

export function setCacheThirdBindUser(key, value) {
  const uid = baseUserStore.getState()?.userInfo?.uid
  cacheUtils.set(`${key}${uid}`, value)
}
