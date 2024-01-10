import { maxMaImageUploadSize, maxMaVideoUploadSize } from '@/constants/c2c'
import { emailValidate } from '@/features/agent/utils/validate'
import { formatNumberDecimal } from '@/helper/decimal'
import { baseAssetsStore } from '@/store/assets'
import { baseC2CMaStore } from '@/store/c2c/merchant-application'
import { YapiGetV1CoinRateListCoinRateData } from '@/typings/yapi/CoinRateV1GetApi'
import { t } from '@lingui/macro'
import { FormInstance } from '@nbit/arco'
import { UploadItem } from '@nbit/arco/es/Upload'
import Decimal from 'decimal.js'

const emailExp = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/

export const fileToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

/**
 *
 * @param file
 * @param limit
 * @returns
 */
export function isValideUploadFileSize(file: UploadItem, limit = maxMaImageUploadSize) {
  if ((file?.originFile?.size || 0) <= limit) {
    return true
  }

  return false
}

export function isValidateEmailAddress(email: string) {
  if (!email) {
    return { isValid: false, errorMessage: t`user.validate_form_02` }
  }
  if (!emailExp.test(email)) {
    return { isValid: false, errorMessage: t`helper_c2c_merchant_application_utils_rd7mdqizbybvlpkt2a-94` }
  }

  return { isValid: true, errorMessage: '' }
}

export function getFileExtension(file: File) {
  return (file.name?.split('.').pop() || '').trim()
}

export function isValidateUploadImageType(file: File) {
  const supportArr = ['jpg', 'jpeg', 'png']
  if (file.type.toLowerCase().includes('image') && supportArr.includes(getFileExtension(file))) return true
  return false
}
export function isValidateUploadVideoType(file: File) {
  const supportArr = ['mp4', 'wmv', 'ogg', 'mov']
  if (file.type.toLowerCase().includes('video') && supportArr.includes(getFileExtension(file))) return true
  return false
}

export function isValidUploadImage(file: UploadItem | undefined): { isValid: boolean; errorMessage?: string } {
  if (!file || !file.originFile) {
    return { errorMessage: t`features_c2c_center_user_setting_index_fblgbej0gj6rvuw_aputm`, isValid: false }
  }

  if (!isValidateUploadImageType(file.originFile)) {
    return {
      errorMessage: t({
        id: 'helper_c2c_merchant_application_utils_urulavlrvdrfg51urw2fg',
        values: { 0: file.originFile.type },
      }),
      isValid: false,
    }
  }

  if (!isValideUploadFileSize(file)) {
    return {
      errorMessage: `${t`helper_c2c_merchant_application_utils_s-kerb_dwp85uvo-itwab`} ${(
        file.originFile.size /
        (1024 * 1024)
      ).toFixed(2)} MB, ${t`helper_c2c_merchant_application_utils_k11nh7sddxt6uhyviw2ki`} ${
        maxMaImageUploadSize / (1024 * 1024)
      } MB`,

      isValid: false,
    }
  }

  return { isValid: true, errorMessage: '' }
}

export function isValidUploadVideo(file: UploadItem | undefined): { isValid: boolean; errorMessage?: string } {
  if (!file || !file.originFile) {
    return { errorMessage: t`helper_c2c_merchant_application_utils_-k3qrtms2phwcyopq2pry`, isValid: false }
  }

  if (!isValidateUploadVideoType(file.originFile)) {
    return {
      errorMessage: t({
        id: 'helper_c2c_merchant_application_utils_2qh_dbk8vkkubqt_vpq8n',
        values: { 0: file.originFile.type },
      }),
      isValid: false,
    }
  }

  if (!isValideUploadFileSize(file, maxMaVideoUploadSize)) {
    return {
      errorMessage: `${t`helper_c2c_merchant_application_utils_s-kerb_dwp85uvo-itwab`} ${(
        file.originFile.size /
        (1024 * 1024)
      ).toFixed(2)} MB, ${t`helper_c2c_merchant_application_utils_k11nh7sddxt6uhyviw2ki`} ${
        maxMaVideoUploadSize / (1024 * 1024)
      } MB`,
      isValid: false,
    }
  }

  return { isValid: true, errorMessage: '' }
}

export function isValidEmailOpt(value: string, isEmailSend?: any) {
  let errorMessage = ''
  let isValid = false

  if (isEmailSend && !isEmailSend?.current) {
    errorMessage = t`features_user_utils_validate_5101213`
    return { isValid, errorMessage }
  }

  if (!value) {
    errorMessage = t`features_user_utils_validate_5101195`
    return { isValid, errorMessage }
  }

  if (value && String(value).split('').length < 6) {
    errorMessage = t`features_user_utils_validate_2697`
    return { isValid, errorMessage }
  }

  return { isValid: true }
}

export const c2cMaFormRules = () => {
  return {
    email: emailValidate(),
    common: {
      required: true,
      validator: (value, cb) => {
        if (!value && value !== 0) {
          return cb(t`helper_c2c_merchant_application_utils_xrj7jqgn95uad5tnbfdvg`)
        }
      },
    },
    commonNumber: {
      required: true,
      validator: (value, cb) => {
        if (!value && value !== 0) {
          return cb(t`helper_c2c_merchant_application_utils_xrj7jqgn95uad5tnbfdvg`)
        }
      },
    },
    frozenAmountInput: formInstance => {
      const form = formInstance as FormInstance
      return {
        required: true,
        validator: (value, cb) => {
          const freezeSymbolId = form.getFieldValue('freezeSymbolId')
          const coin = baseC2CMaStore.getState().cache.allCoins.find(x => x.id === freezeSymbolId)
          const { isValid, errorMessage } = isAboveMinFrozeAmount(value, coin?.symbol || '')
          if (isValid && !errorMessage) {
            return cb()
          }
          cb(errorMessage)
        },
      }
    },
  }
}

export const isAboveMinFrozeAmount = (amount?: number, selectedSymbol?: string) => {
  const coinRates = baseAssetsStore.getState().coinRate.coinRate as YapiGetV1CoinRateListCoinRateData[]

  amount = amount || 0
  const frozenAmount = Number(baseC2CMaStore.getState().cache.commonSettings?.frozenQuantity || 0)
  const frozenSymbol = baseC2CMaStore.getState().cache.commonSettings?.symbol || 'USDT'

  if (selectedSymbol === frozenSymbol) {
    if (amount >= frozenAmount) {
      return { isValid: true }
    }

    return {
      isValid: false,
      errorMessage: t({
        id: 'helper_c2c_merchant_application_utils_1b6uu2e7wn3eq9wfocfdn',
        values: { 0: frozenAmount, 1: frozenSymbol },
      }),
    }
  }

  const selectedCoin = coinRates.find(x => String(x.symbol).toUpperCase() === String(selectedSymbol).toUpperCase())
  const frozenCoin = coinRates.find(x => String(x.symbol).toUpperCase() === String(frozenSymbol).toUpperCase())

  if (!selectedCoin || !frozenCoin) {
    return {
      isValid: false,
      errorMessage: t`helper_c2c_merchant_application_utils_ctp2npy0gk6tdhc4adjch`,
    }
  }

  const ratioBytargetSymbol = Number(selectedCoin.usdtRate) / Number(frozenCoin.usdtRate)
  const currentAmountByTargetSymbol = ratioBytargetSymbol * amount

  if (currentAmountByTargetSymbol >= frozenAmount) {
    return { isValid: true }
  }

  const minAmountBySelectedSymbol = frozenAmount * (1 / ratioBytargetSymbol)
  const minAmountBySelectedSymbolWithPresion = Number(
    formatNumberDecimal(minAmountBySelectedSymbol, selectedCoin.coinPrecision, Decimal.ROUND_CEIL)
  )

  return {
    isValid: false,
    errorMessage: t({
      id: 'helper_c2c_merchant_application_utils_1b6uu2e7wn3eq9wfocfdn',
      values: { 0: minAmountBySelectedSymbolWithPresion, 1: selectedSymbol },
    }),
  }
}
