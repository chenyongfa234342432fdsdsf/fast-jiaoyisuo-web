import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { newbitEnv, envIsBuild } from '../../env'

export function initSentry() {
  if (envIsBuild && ['dev', 'test', 'production'].includes(newbitEnv)) {
    Sentry.init({
      ignoreErrors: [
        'Non-Error exception captured',
        'Non-Error promise rejection captured',
        'ResizeObserver loop limit exceeded',
        `Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`,
        `Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.`,
      ],
      dsn: 'https://f8e9a598e62d458ba76000ad5cb5ca0c@o4504779517198336.ingest.sentry.io/4504779521654784',
      integrations: [new BrowserTracing()],
      environment: newbitEnv,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    })
  }
}
