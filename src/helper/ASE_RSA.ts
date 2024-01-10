/**
 * 加密解密工具类
 *
 */

import CryptoJS from 'crypto-js'
import { envIsServer } from './env'
// //AES key
// self.RANDOMKEY = ''
// //AES 向量
// self.RANDOMIV = ''
let self = {
  RANDOMKEY: '',
  RANDOMIV: '',

  /**
   * RSA 加密，
   * 使用 RSA 公钥加密并做 Base64 编码
   * _str：需要加密的字符串
   * **/
  encrypt: async _str => {
    if (envIsServer) {
      const NodeRSA = await import('node-rsa')
      const key = new NodeRSA.default(MattsPublicKeyString)
      // key.setOptions({ encryptionScheme: 'pkcs1' })
      return key.encrypt(_str, 'base64')
    }
    const jsencrypt = await import('jsencrypt')
    //实例化加密对象
    let encrypt = new jsencrypt.JSEncrypt()
    //设置加密公钥
    encrypt.setPublicKey(MattsPublicKeyString)

    return encrypt.encrypt(_str)
    },
  /**
   * AES 加密
   * params: 加密参数
   * key: 16 位秘钥
   * iv：16 位秘钥向量
   * **/
  encryptAES: (params: string, key?: string | CryptoJS.lib.WordArray, iv?: CryptoJS.lib.WordArray) => {
    params = JSON.stringify(params)
    let data = CryptoJS.enc.Utf8.parse(params)
    key = CryptoJS.enc.Utf8.parse(MattsPublicKeyString)
    iv = CryptoJS.enc.Utf8.parse(IVParameter)

    //后端采用 CBC/Pkcs7
    let encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })

    return encrypted.toString()
  },
  /**
   * AES 解密
   * params: 加密参数
   * key: 16 位秘钥
   * iv：16 位秘钥向量
   * **/
  decryptedAES: (
    params: string | CryptoJS.lib.CipherParams,
    key?: string | CryptoJS.lib.WordArray,
    iv?: CryptoJS.lib.WordArray
  ) => {
    key = CryptoJS.enc.Utf8.parse(self.RANDOMKEY)
    iv = CryptoJS.enc.Utf8.parse(self.RANDOMIV)

    //后端采用 CBC/Pkcs7
    let decrypt = CryptoJS.AES.decrypt(params, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

    return decryptedStr.toString()
  },
  /**
   * HmacSHA256 签名运算
   * 需要加密的接口都需要使用签名运算
   * secretKey: 签名的 Key, 从后端接口获取
   * params: 需要签名的参数，
   * 参数按照 ASCII 码的顺序对参数名进行排序 (使用 UTF-8 编码，且进行了 URI 编码，十六进制字符必须大写，如‘:'会被编码为'%3A'，空格被编码为'%20')。
   * 接口：
   * **/
  hmacSHA256: (secretKey, params) => {
    // 有些字符 encodeURIComponent 编码不了，用正则手动替换
    /*  params = params.replace(/!/g, '%21')
                  .replace(/\^/g, '%5E')
                  .replace(/\)/g, '%29')
                  .replace(/\(/g, '%28')
                  .replace(/~/g, '%7E')
                  .replace(/{/g, '%7B')
                  .replace(/}/g, '%7D')
                  .replace(/>/g, '%3E')
                  .replace(/</g, '%3C')*/

    let hash = CryptoJS.HmacSHA256(params, secretKey)
    let hashInBash64 = CryptoJS.enc.Base64.stringify(hash)

    return hashInBash64
  },
  /**
   * json 按照 ASCII 排序
   * obj: 要排序的 json 对象
   * **/
  sortASCII: obj => {
    return removeNullKey(obj)
  },
  /**
   * 随机 (大小写 + 数字) 字符串
   * 默认 16 位，len: 位数
   * **/
  len16Str: (len?: any) => {
    len = len || 16
    //默认取消了容易混淆的字符 oOLl,9gq,Vv,Uu,I1
    let $chars = 'ABCDEFJHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let maxPos = $chars.length
    let str = ''
    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }

    return str
  },
}
// 后端公钥
// const MattsPublicKeyString = `
// -----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm7WLLvc396rGJz77y1PsZkER7279EisCxmmI0riAL8HsNGnnkOZhhREZXNdxijPJp4QBGG0mf4KFYAggrDmGMcofpzYJPs4C3OLvQT0Ds9hNVl0o2biCIShTEkQgbBaWyamONgaGLwkgOxYhdBW3kLwdGuKPjUGjiEP+W7qOltNYT1hlyyx5uANbO2IhIWULOBRtjJWn6lsg0qNAl3awARK/YgaCoKALNJ1UGLMEUykP6IkWHgv6YX7j8LwnLO1yLaUQvE80dHqdj9n4PLo6KB7VS6iVzm0cOpqfM6twHIpI1Iiv7ULS9Y+AJWParImRED9fQv7WFSv5fq/xLsHm2wIDAQAB
// -----END PUBLIC KEY-----
// `
const MattsPublicKeyString = 'snra6h1yki7fvgzo'
const IVParameter = '46kd4xzguyt1xs3c'

/**
 * 去掉对象中的 null 和 undefined 值
 * **/
let removeNullKey = obj => {
  if (typeof obj !== 'object') return

  for (let key in obj) {
    if (typeof obj[key] === 'undefined' || obj[key] === null) {
      delete obj[key]
    }
    if (typeof obj[key] === 'object') {
      //递归去 null，undefined
      removeNullKey(obj[key])
    }
  }

  return sort(obj)
}

/**
 * json 按照 ASCII 排序
 * **/
let sort = obj => {
  let arr = new Array()
  let num = 0
  for (let i in obj) {
    arr[num] = i
    num++
  }
  let sortArr = arr.sort()
  let sortObj = {}
  for (let i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]]
  }

  return sortObj
}
self.RANDOMKEY = self.len16Str()
self.RANDOMIV = self.len16Str()
export default self
