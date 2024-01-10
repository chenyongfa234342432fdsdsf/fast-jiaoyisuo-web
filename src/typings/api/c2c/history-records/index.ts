import { C2cHistoryRecordTabEnum } from '@/constants/c2c/history-records'
import { YapiGetV1C2cOrderGetsPageByApiRequest, YapiGetV1C2COrderGetsPageByListData } from '@/typings/yapi/C2cOrderGetsPageByV1GetApi'

export type C2cHistoryRecordsRequest = Partial<Omit<YapiGetV1C2cOrderGetsPageByApiRequest, 'statusCd'> & {
  statusCd: C2cHistoryRecordTabEnum,
  coinId: string
}>



export type C2cHistoryRecordsResponse = Partial<YapiGetV1C2COrderGetsPageByListData> & {
  dummy?: string
  currencyPrecision?: string | number
  coinPrecision?: string | number
}
