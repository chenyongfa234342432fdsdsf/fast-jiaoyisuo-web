import { I18nsEnum, I18nsMap } from '@/constants/i18n'
import { setLocale } from '@/helper/i18n'
import { useCommonStore } from '@/store/common'
import { Modal } from '@nbit/arco'

function I18nSelect() {
  const { locale } = useCommonStore()

  const changeI18n = (lang: I18nsEnum) => {
    if (lang === locale) {
      Modal.destroyAll()
      return
    }
    setLocale(lang)
  }
  return (
    <div className="i18n-select-wrap flex-wrap gap-x-10 gap-y-8">
      {Object.keys(I18nsMap).map(lang => {
        return (
          <div className="it" key={lang} onClick={() => changeI18n(lang as I18nsEnum)}>
            {I18nsMap[lang]}
          </div>
        )
      })}
    </div>
  )
}
export default I18nSelect
