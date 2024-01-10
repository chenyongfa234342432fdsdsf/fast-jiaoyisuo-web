import { TriggerPriceTypeEnum, EntrustTypeEnum } from '@/constants/assets/futures'

/**
 * 合约 - 合约组详情总览
 */
export type FuturesGroupDetailReq = {
    /** 合约组 id */
    groupId: string;
}

export type GroupDetailMarginCoin = {
    /** 币种名称 */
    coinName: string;
    /** 折算价值 */
    coinConvert: string;
}

export type GroupDetailPositionAsset = {
    /** 币种名称 */
    coinName: string;
    /** long: 多仓位 short:空仓位 */
    sideInd: string;
    /** 名义价值 */
    nominalValue: string;
}

export type FuturesGroupDetailResp = {
    /** 合约组 ID */
    groupId: string;
    /** 合约组名称 */
    groupName: string;
    /** 计价币 */
    baseCoin: string;
    /** 合约组总价值 */
    groupAsset: string;
    /** 合约组可用保证金 */
    marginAvailable: string;
    /** 仓位保证金 */
    positionMargin: string;
    /** 保证金币种信息 */
    marginCoin: GroupDetailMarginCoin[];
    /** 持仓风险占比 */
    positionAsset: GroupDetailPositionAsset[]
}

export type PositionModuleStrategyInfoProps = {
    /** 止盈止损触发类型 */
    triggerPriceType: TriggerPriceTypeEnum,
    /** 止盈止损委托类型 */
    entrustType: EntrustTypeEnum,
    /** 仓位止盈触发类型 */
    profitTriggerPriceType: TriggerPriceTypeEnum,
    /** 仓位止盈触发类型 */
    lossTriggerPriceType: TriggerPriceTypeEnum,
    /** 平仓委托类型 */
    closeEntrustType: EntrustTypeEnum,
  }
