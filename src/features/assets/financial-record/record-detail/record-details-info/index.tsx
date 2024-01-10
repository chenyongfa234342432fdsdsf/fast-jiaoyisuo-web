/**
 *记录详情 - 详情
 */
import { t } from '@lingui/macro'
import {
  FinancialRecordStateEnum,
  FinancialRecordTypeEnum,
  RecordTransactionDetailsList,
  RecordExpenseDetailsList,
  RecordRechargeTypeList,
  RecordRebateTypeList,
  RecordC2CTypeList,
  RecordFeeTypeList,
  RecordFusionTypeList,
} from '@/constants/assets'
import { EntrustTypeEnum, getEntrustTypeEnumName, PerpetualMigrateTypeEnum } from '@/constants/assets/futures'
import { IncreaseTag } from '@nbit/react'
import { ReactNode, useEffect, useState } from 'react'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsStore } from '@/store/assets'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import styles from './index.module.css'
import { RechargeInfo } from './spot-recharge'
import { SpotFeeInfo } from './spot-feeinfo'
import { WithdrawFeeInfo } from './withdraw-feeinfo'
import { RebateDetail } from './rebate'
import { C2CDetails } from './c2c-details'
import { FusionDetails } from './fusion-details'
import { CreateTimeItem } from './create-time-item'

interface IListEnum {
  label: string
  value: ReactNode | string
}

export function RecordDetailsInfo() {
  const { financialRecordDetail, assetsEnums } = useAssetsStore()
  const {
    typeInd,
    createdByTime,
    updatedByTime,
    statusCd,
    reason,
    side,
    groupName = '--',
    operationType = '',
    toGroupName = '--',
    lever,
    entrustTypeInd,
    price,
    size,
    tradeSize,
    tradePrice,
    realizedProfit,
    quoteCoinShortName,
    baseCoinShortName,
    migrateMargin,
    migrateType = '',
    orderTypeInd,
    orderStatus,
    transferIn,
    transferOut,
  } = financialRecordDetail
  const [list, setList] = useState<IListEnum[]>([])

  useEffect(() => {
    let nList: IListEnum[] = []
    const createTimeItem = [
      { label: t`assets.financial-record.creationTime`, value: createdByTime ? formatDate(createdByTime) : '--' },
      { label: t`assets.financial-record.completionTime`, value: updatedByTime ? formatDate(updatedByTime) : '--' },
    ]

    // 平仓/开仓/强制平仓/强制减仓
    if (RecordTransactionDetailsList.indexOf(typeInd) > -1) {
      nList = [
        { label: t`features_assets_futures_index_futures_list_index_5101349`, value: groupName },
        {
          label: t`features/orders/filters/future-0`,
          value: getTextFromStoreEnums(String(side), assetsEnums.financialRecordTypeCttSideList.enums), // getTransactionDirectionName(side),
        },
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_5101563`,
          value: `${lever}X`,
        },
        {
          label: t`features/trade/trade-order-confirm/index-1`,
          value:
            entrustTypeInd === EntrustTypeEnum.market
              ? getEntrustTypeEnumName(entrustTypeInd)
              : `${formatCurrency(price)} ${quoteCoinShortName}`,
        },
        {
          label: t`order.columns.entrustType`,
          value: getTextFromStoreEnums(orderTypeInd || '', assetsEnums.financialRecordTypeCttOrderList.enums),
        },
        {
          label: t`order.filters.status.label`,
          value: getTextFromStoreEnums(orderStatus || '', assetsEnums.financialRecordTypeEntrustStatusList.enums),
        },
        { label: t`features/trade/trade-order-confirm/index-3`, value: `${formatCurrency(size)} ${baseCoinShortName}` },
        { label: t`order.columns.logCount`, value: `${formatCurrency(tradeSize)} ${baseCoinShortName}` },
        {
          label: t`features/orders/details/future-1`,
          value: createdByTime ? formatDate(createdByTime) : '--',
        },
        { label: t`assets.financial-record.completionTime`, value: updatedByTime ? formatDate(updatedByTime) : '--' },
        {
          label: t`order.columns.averagePrice`,
          value: formatCurrency(tradePrice),
        },
        {
          label: t`features/orders/order-columns/future-2`,
          value: (
            <span>
              <IncreaseTag hasPrefix={false} value={realizedProfit} /> {quoteCoinShortName}
            </span>
          ),
        },
      ]
    } else if (typeInd === FinancialRecordTypeEnum.migrate) {
      // 迁移
      nList = [
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_a1opfywree1fcds6maplg`,
          value: groupName,
        },
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_5j2eqzfwqqomw0pxbyojy`,
          value: toGroupName,
        },
        {
          label:
            migrateType === PerpetualMigrateTypeEnum.merge
              ? t`features_assets_financial_record_record_detail_record_details_info_index_5101581`
              : t`features_assets_financial_record_record_detail_record_details_info_index_5101575`,
          value: `${migrateMargin} ${quoteCoinShortName || '--'}`,
        },
        {
          label: t`assets.coin.trade-records.table.type`,
          value: getTextFromStoreEnums(migrateType, assetsEnums.financialRecordTypePerpetualMigrateList.enums),
        },
        ...createTimeItem,
      ]
    } else if (
      typeInd === FinancialRecordTypeEnum.futuresTransfer ||
      typeInd === FinancialRecordTypeEnum.spotFuturesTransfer
    ) {
      // 合约划转
      nList = [
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_a1opfywree1fcds6maplg`,
          value: transferOut || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`,
        },
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_zykzsnba75qynejc48cdt`,
          value: transferIn || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`,
        },
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_ii3vigoelumbckpppw85o`,
          value: getTextFromStoreEnums(operationType, assetsEnums.financialRecordTypeOperationList.enums),
        },
        ...createTimeItem,
      ]
    } else if (typeInd === FinancialRecordTypeEnum.rechargeBond || typeInd === FinancialRecordTypeEnum.extractBond) {
      // 保证金充值/保证金提取
      nList = [
        { label: t`features_assets_futures_index_futures_list_index_5101349`, value: groupName },
        {
          label: `${
            typeInd === FinancialRecordTypeEnum.rechargeBond
              ? t`features_assets_financial_record_record_detail_record_details_info_index_5101567`
              : t`features_assets_financial_record_record_detail_record_details_info_index_5101568`
          }`,
          value: getTextFromStoreEnums(operationType, assetsEnums.financialRecordTypeOperationList.enums),
        },
        ...createTimeItem,
      ]
    } else if (RecordExpenseDetailsList.indexOf(typeInd) > -1) {
      // 资金费用/强平返还/强平手续费/开仓手续费/平仓手续费/平仓盈亏/锁仓手续费
      nList = [
        { label: t`features_assets_futures_index_futures_list_index_5101349`, value: groupName },
        {
          label: t`features/orders/order-columns/holding-0`,
          value: getTextFromStoreEnums(String(side), assetsEnums.financialRecordTypeCttPositionSideList.enums),
        },
        {
          label: t`features_assets_financial_record_record_detail_record_details_info_index_5101563`,
          value: lever ? `${lever}X` : '--',
        },
        ...createTimeItem,
      ]
    } else if (typeInd === FinancialRecordTypeEnum.benefitsInjection) {
      //  穿仓保险金注入
      nList = [
        { label: t`features_assets_futures_index_futures_list_index_5101349`, value: groupName },
        ...createTimeItem,
      ]
    }
    // TODO 代理商返佣

    setList(nList)
  }, [typeInd])

  /**
   * 列表 item 渲染
   */
  const onRenderItem = _list => {
    return (
      <>
        {_list.map((item, index) => {
          return (
            <div className="details-item-info" key={index}>
              <span className="label">{item.label}</span>
              <span className="value">{item.value}</span>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div className={styles.scoped}>
      {/* 充值/冲正/提币/pay */}
      {RecordRechargeTypeList.indexOf(typeInd) > -1 && <RechargeInfo />}
      {/* 现货手续费 */}
      {+typeInd === +FinancialRecordTypeEnum.spotCommission && <SpotFeeInfo />}
      {/* C2C 记录详情 */}
      {RecordC2CTypeList.includes(typeInd) && <C2CDetails />}
      {/* 提币手续费和其他手续费 */}
      {RecordFeeTypeList.indexOf(typeInd) > -1 && <WithdrawFeeInfo />}
      {/* 合约财务记录 */}
      {RecordRechargeTypeList.indexOf(typeInd) === -1 &&
        RecordFeeTypeList.indexOf(typeInd) === -1 &&
        onRenderItem(list)}
      {/* 代理商返佣 */}
      {RecordRebateTypeList.indexOf(typeInd) > -1 && <RebateDetail />}
      {/* 融合模式记录详情 */}
      {RecordFusionTypeList.includes(typeInd) && <FusionDetails />}
      {/* 不在财务记录类型白名单的，走默认配置 */}
      {!FinancialRecordTypeEnum[typeInd] && <CreateTimeItem cssName="details-item-info" />}
      {/* 失败原因 */}
      {statusCd === FinancialRecordStateEnum.fail && (
        <div className="detail-item">
          <div className="label">{t`features_assets_financial_record_record_detail_index_2736`}</div>
          <div className="value">{reason}</div>
        </div>
      )}
    </div>
  )
}
