import { useState } from 'react'
import { t } from '@lingui/macro'
import { setC2CParamsTipsCache, getC2CParamsTipsCache } from '@/helper/cache'
import { ReturnFreeTradeTip } from '../c2c-trade'

export const useRiskStatement = (
  freeTradeTipModalRef,
  setFreeTradeTipProps?: (value: React.SetStateAction<ReturnFreeTradeTip | undefined>) => void,
  isLogin?: boolean
) => {
  const [freeTradeTip, setFreeTradeTip] = useState<ReturnFreeTradeTip>()

  const goContinueBuy = () => {
    freeTradeTipModalRef.current?.setCoinsTradeTipNotVisible()
    // setTradeHandlePart(true, placeProps)
  }

  const setRiskStatement = areaRiskWarn => {
    if (areaRiskWarn) {
      const tip = {
        tipTitle: areaRiskWarn?.title,
        tipContent: areaRiskWarn?.content,
        tipButton: (
          <div
            className="w-full h-10 bg-brand_color cursor-pointer font-medium text-button_text_02 flex justify-center items-center rounded"
            onClick={goContinueBuy}
          >
            {t`features_c2c_trade_free_trade_index_nmty2yfzwaudu-verkkt7`}
          </div>
        ),
      }
      setFreeTradeTip(tip)
      setFreeTradeTipProps && setFreeTradeTipProps(tip)
    }
  }
  const isRiskTip = (currencyName, areaRiskWarn) => {
    if (!getC2CParamsTipsCache()?.areaRiskWarn?.[currencyName] && areaRiskWarn && isLogin) {
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      setC2CParamsTipsCache({ areaRiskWarn: { ...getC2CParamsTipsCache()?.areaRiskWarn, [currencyName]: true } })
      return false
    } else {
      return true
    }
  }

  return { isRiskTip, setRiskStatement, freeTradeTip }
}
