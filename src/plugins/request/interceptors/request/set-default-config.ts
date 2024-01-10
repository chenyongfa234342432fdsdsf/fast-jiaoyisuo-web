import { MarkcoinRequestConfig } from '@/plugins/request'

/**
 *
 * @link https://axios-http.com/docs/req_config
 * `baseURL`: will be prepended to `url` unless `url` is absolute.
 * @param config
 * @returns
 *
 */
const onFulfilled = (config: MarkcoinRequestConfig) => {
  const { path, method, headers } = config

  config.url = path
  // axios default
  config.responseType = 'json'
  // axios default
  config.method = method || 'GET'
  // axios default header
  config.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  }

  return config
}

export default {
  onFulfilled,
}
