import { envIsClient, envIsServer } from '@/helper/env'
import { dynamicActivate, extractLocale, localeDefault } from '@/helper/i18n'
import { getMaintenanceRoutePath } from '@/helper/route'
import { baseCommonStore } from '@/store/common'

export async function onBeforeRoute(pageContext) {
  let { urlOriginal, locale, path } = pageContext
  const { maintenanceMode } = baseCommonStore.getState()
  if (!path) {
    const { urlWithoutLocale, locale: currentLocale } = extractLocale(urlOriginal)
    path = urlWithoutLocale
    locale = currentLocale || localeDefault
  }

  // 修复服务端 ssr 多语言没同步问题
  await dynamicActivate(locale)

  // overwrite to maintenance path on maintenance mode on client
  if (maintenanceMode.isMaintenance && envIsClient) path = getMaintenanceRoutePath()

  return {
    pageContext: {
      urlOriginal: envIsServer ? urlOriginal : path,
      path,
      locale,
    },
  }
}
