import { t } from '@lingui/macro'

type Advertise = {
  bankInfoIds: number[]
}

type PlaceholderText = {
  maxCurrency: string
  minCurrency: string
  maxPaytime: string
}

const getCommercialActivity = () => {
  return [
    { id: 1, name: t`trade.c2c.buy` },
    { id: 2, name: t`trade.c2c.sell` },
  ]
}

const matchingSelectOption = {
  otcCoinList: {
    id: 'coinId',
    name: 'symbol',
  },
  default: {
    id: 'id',
    name: 'name',
  },
}

const setMessage = () => {
  return [{ required: true, message: t`features/c2c-trade/creates-advertisements/createsadvertisements-0` }]
}

const setValidates = {
  // 价格的验证
  price: advParams => {
    return [
      {
        validator: (value, callback) => {
          if (!value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-1`)
          } else if (value > advParams.maxPrice) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-2`)
          } else if (value < advParams.minPrice) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-3`)
          }
        },
      },
    ]
  },
  // 浮动比例的验证
  floatRatio: advParams => {
    return [
      {
        validator: (value, callback) => {
          if (!value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-4`)
          } else if (value > advParams.priceDevMax) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-5`)
          } else if (value < advParams.priceDevMin) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-6`)
          }
        },
      },
    ]
  },
  // 最大单笔限额的验证
  maxCurrency: advParams => {
    return [
      {
        validator: (value, callback) => {
          let boolean = /^[1-9][0-9]*$/.test(value)
          if (!value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-7`)
          } else if (!boolean) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-8`)
          } else if (value > advParams.singleOrderMaxAmount) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-9`)
          } else if (value < advParams.singleOrderMinAmount) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-10`)
          }
        },
      },
    ]
  },
  // 最小单笔限额的验证
  minCurrency: (advParams, getAdviseNums) => {
    return [
      {
        required: true,
        validator: (value, callback) => {
          let boolean = /^[1-9][0-9]*$/.test(value)
          if (!value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-11`)
            return
          } else if (!boolean) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-8`)
            return
          } else if (value < advParams.singleOrderMinAmount) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-10`)
            return
          } else if (value > advParams.singleOrderMaxAmount) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-9`)
            return
          }
          const adviseNums = getAdviseNums()
          if (adviseNums < advParams.singleOrderMinAmount) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-12`)
          } else if (adviseNums < value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-13`)
          }
        },
      },
    ]
  },
  // 请输入付款期限的验证
  maxPaytime: advParams => {
    return [
      {
        validator: (value, callback) => {
          if (!value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-14`)
          } else if (value > advParams.maxTime) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-15`)
          } else if (value < advParams.minTime) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-16`)
          }
        },
      },
    ]
  },
  // 支付方式的验证
  bankInfoIdList: () => {
    return [
      {
        validator: (value, callback) => {
          if (value?.length === 0 || !value) {
            callback(t`features/c2c-trade/creates-advertisements/createsadvertisements-17`)
          }
        },
      },
    ]
  },
}

const spliceDecimal = (data, decimal) => {
  const index = data.indexOf('.')
  if (index !== -1) {
    if (decimal !== 0) {
      data = data.slice(0, index + 1 + parseInt(decimal))
    } else {
      data = data.slice(0, index)
    }
  }
  return data
}

export {
  getCommercialActivity,
  matchingSelectOption,
  setMessage,
  setValidates,
  spliceDecimal,
  Advertise,
  PlaceholderText,
}
