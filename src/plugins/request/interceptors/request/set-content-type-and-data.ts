import { MarkcoinRequestConfig } from '@/plugins/request'
import { EncryptionKey } from '@/constants/encryption-key'
import decryption from '@/helper/ASE_RSA'

/**
 *
 * Usage: @link https://stackoverflow.com/questions/4526273/what-does-enctype-multipart-form-data-mean
 */
export enum contentTypeEnum {
  'application/x-www-form-urlencoded' = 1,
  'multipart/form-data',
}
/**
 *
 * @param config
 * @returns
 */

const onFulfilled = (config: MarkcoinRequestConfig) => {
  const { contentType, method } = config

  if (!['POST', 'PUT'].includes(String(method).toUpperCase())) {
    return config
  }

  switch (contentType) {
    // form 表单提交
    case contentTypeEnum['application/x-www-form-urlencoded']: {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      break
    }
    // 适用文件上传 file 文件格式
    case contentTypeEnum['multipart/form-data']: {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      }
      break
    }

    default: {
      // 通过加密表判断需要加密的字段，对其进行加密。
      if (config.signature) {
        const keys = Object.keys(config.data)
        EncryptionKey.map(key => keys.includes(key) && (config.data[key] = decryption.encryptAES(config.data[key])))
      }

      break
    }
  }

  return config
}

export default {
  onFulfilled,
}
