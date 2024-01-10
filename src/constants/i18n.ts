export enum I18nsEnum {
  'zh-CN' = 'zh-CN',
  'zh-HK' = 'zh-HK',
  'en-US' = 'en-US',
  'ta-IN' = 'ta-IN',
  'hi-IN' = 'hi-IN',
  'pt-BR' = 'pt-BR',
  'vi-VN' = 'vi-VN',
  'ko-KR' = 'ko-KR',
  'id-ID' = 'id-ID',
  'th-TH' = 'th-TH',
  'ja-JP' = 'ja-JP',
}

// 机翻的多个目标语言
export const targetLanguages = {
  'ta-IN': 'ta',
  'hi-IN': 'hi',
  'pt-BR': 'pt',
  'vi-VN': 'vi',
  'ko-KR': 'ko',
  'id-ID': 'id',
  'th-TH': 'th',
  'ja-JP': 'ja',
}
export enum I18nsEnumAll {
  'zh-CN' = 'zh-CN',
  'zh-HK' = 'zh-HK',
  'en-US' = 'en-US',
  'zh-cn' = 'zh-CN',
  'zh-hk' = 'zh-HK',
  'en-us' = 'en-US',
  'ta-in' = 'ta-IN',
  'hi-in' = 'hi-IN',
  'pt-br' = 'pt-BR',
  'vi-vn' = 'vi-VN',
  'ko-kr' = 'ko-KR',
  'id-id' = 'id-ID',
  'th-th' = 'th-TH',
  'ja-jp' = 'ja-JP',
}
export const I18nKeys = Object.values(I18nsEnum)

export const I18nsMap = {
  [I18nsEnum['en-US']]: 'English',
  [I18nsEnum['zh-CN']]: '简体中文',
  [I18nsEnum['zh-HK']]: '繁體中文',
  [I18nsEnum['ta-IN']]: 'ದಕ್ಷಿಣ ಭಾರತ',
  [I18nsEnum['hi-IN']]: 'उत्तर भारत',
  [I18nsEnum['pt-BR']]: 'português brasileiro',
  [I18nsEnum['vi-VN']]: 'Tiếng Việt',
  [I18nsEnum['ko-KR']]: '한국어',
  [I18nsEnum['id-ID']]: 'Bahasa Indonesia',
  [I18nsEnum['th-TH']]: 'ภาษาไทย',
  [I18nsEnum['ja-JP']]: '日本語',
}

export const languageRoutes = I18nKeys.map(v => `/${v}`)

export function getI18nEmptyObject() {
  let res = {}
  I18nKeys.forEach(k => {
    res[k] = {}
  })
  return res
}

export const LanguageMapToChartMap = {
  'zh-CN': 'zh',
  'en-US': 'en',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'th-TH': 'th_TH',
  'zh-TW': 'zh_TW',
  'fr-FR': 'fr',
  'de-DE': 'de_DE',
  'it-IT': 'it',
  'es-ES': 'es',
  'vi-VN': 'vi',
}
