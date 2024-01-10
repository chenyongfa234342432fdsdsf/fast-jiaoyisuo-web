import { t } from '@lingui/macro'

export enum C2cHistoryRecordTabEnum {
  all = '',
  pending = 'UN_FINISH',
  completed = 'WAS_FINISH',
  cancelled = 'WAS_CANCEL',
}

export enum C2cHistoryRecordDirectCd {
  all = '',
  buy = 'BUY',
  sell = 'SELL',
}

export enum C2cHistoryUserRole {
  buyer = 'BUYER',
  seller = 'SELLER',
}

export const getC2cHistoryDirectionTitle = (status: string) => {
  const map = {
    [C2cHistoryUserRole.buyer]: t`trade.c2c.buy`,
    [C2cHistoryUserRole.seller]: t`trade.c2c.sell`,
  }

  const title = map[status] || ''
  return title
}

export enum C2cHistoryRecordDealTypeCd {
  all = '',
  inside = 'INSIDE',
  outside = 'OUTSIDE',
  otc = 'OTC',
}

export const getC2cHistoryDealTypeTitle = (status: string) => {
  const map = {
    [C2cHistoryRecordDealTypeCd.inside]: t`features_c2c_center_index_b-xzvpxaowued-9lzhztl`,
    [C2cHistoryRecordDealTypeCd.outside]: t`features_c2c_center_index_0n_wqepvujaj0_5sf7y--`,
    [C2cHistoryRecordDealTypeCd.otc]: t`constants_c2c_history_records_index_mwq4jpefwc`,
  }

  const title = map[status] || ''
  return title
}

export enum C2cHistoryRecordCoinId {
  all = '',
}

export enum C2cHistoryRecordAreaId {
  all = '',
}

export const getC2cHistoryRecordsTab = () => {
  return [
    {
      id: C2cHistoryRecordTabEnum.all,
      title: t`constants_c2c_history_records_index_pr3wgudbkcuenzgg9m-ki`,
    },
    {
      id: C2cHistoryRecordTabEnum.pending,
      title: t`constants_c2c_history_records_index_giygvnc2otzqgl_i07dlo`,
    },
    {
      id: C2cHistoryRecordTabEnum.completed,
      title: t`constants_c2c_history_records_index_ltneyldd9wtw7dpug4yzo`,
    },
    {
      id: C2cHistoryRecordTabEnum.cancelled,
      title: t`constants_c2c_advertise_pg3zzcd3uwjh4-5rco73n`,
    },
  ]
}

const getDirectOptions = () => {
  return [
    {
      id: C2cHistoryRecordDirectCd.all,
      title: t`common.all`,
    },
    {
      id: C2cHistoryRecordDirectCd.buy,
      title: t`trade.c2c.buy`,
    },
    {
      id: C2cHistoryRecordDirectCd.sell,
      title: t`trade.c2c.sell`,
    },
  ]
}

const getTradeAreaAllOption = () => {
  return {
    legalCurrencyId: C2cHistoryRecordAreaId.all,
    title: t`features_c2c_center_coll_pay_manage_index_tk8a8vmjwcwnlsbxvcbpj`,
  }
}

const getCurrencyAllOption = () => {
  return {
    id: C2cHistoryRecordCoinId.all,
    title: t`constants_c2c_history_records_index_fe-dvjjmy-crdaxgmkdjx`,
  }
}

const getDealTypeOptions = () => {
  return [
    {
      id: C2cHistoryRecordDealTypeCd.all,
      title: t`constants_c2c_history_records_index_sqmod462gxas21d8zhwde`,
    },
    {
      id: C2cHistoryRecordDealTypeCd.inside,
      title: t`constants_c2c_advertise_cihh88stqngpq0qdxlpkw`,
    },
    {
      id: C2cHistoryRecordDealTypeCd.outside,
      title: t`constants_c2c_advertise_lgzilafiawicqgzklvhak`,
    },
    {
      id: C2cHistoryRecordDealTypeCd.otc,
      title: t`features_c2c_trade_history_records_content_table_order_detail_modal_atbry5spxl`,
    },
  ]
}

const getDefaultPage = () => {
  return {
    total: 0,
    current: 1,
    showTotal: true,
    showJumper: true,
    sizeCanChange: true,
    hideOnSinglePage: false,
    pageSize: 20,
  }
}
export const c2cHrConstants = {
  getDirectOptions,
  getTradeAreaOptions: getTradeAreaAllOption,
  getCurrencyOptions: getCurrencyAllOption,
  getDealTypeOptions,
  getDefaultPage,
}
