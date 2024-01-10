import { MutableRefObject } from 'react'
import { t } from '@lingui/macro'

/** c2c 中心 - 添加收款方式验证 */
export const C2CCenterRules = () => {
  return {
    legalCurrencyId: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请选择交易币种')
        // if (!value || (value && !(+value > 0))) {
        //   return cb('仅限输入正整数')
        // }
        return cb()
      },
    },
    paymentTypeCd: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请选择收款方式')
        return cb()
      },
    },
    name: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请输入姓名')
        return cb()
      },
    },
    bankOfDeposit: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请输入开户行')
        return cb()
      },
    },
    bankAccount: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请输入银行卡号')
        return cb()
      },
    },
    alipayAccount: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请输入支付宝账号')
        return cb()
      },
    },
    wechatAccount: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请输入微信账号')
        return cb()
      },
    },
    qrCodeAddr: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value) return cb('请上传二维码图片')
        return cb()
      },
    },
  }
}
