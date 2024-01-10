import { t } from '@lingui/macro'

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
  }
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: {
        title: t`features_user_personal_center_account_security_transaction_password_index_2437`,
      },
    },
  }
}

export { onBeforeRender }
