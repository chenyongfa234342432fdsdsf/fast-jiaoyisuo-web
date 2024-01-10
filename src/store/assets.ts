import create from 'zustand'
import produce from 'immer'
import { createTrackedSelector } from 'react-tracked'
import cacheUtils from 'store'
import { assetSetting, getAssetsDepositCoinHistoryCache, setAssetsDepositCoinHistoryCache } from '@/helper/cache'
import { IMarginIsolatedPairResp } from '@/typings/api/assets/margin'
import {
  WithDrawTypeEnum,
  AssetsDictionaryTypeEnum,
  FinancialRecordLogTypeEnum,
  CoinListTypeEnum,
} from '@/constants/assets'
import { IStoreEnum } from '@/typings/store/common'
import { getCodeDetailListBatch } from '@/apis/common'
import { getCoinRate } from '@/apis/assets/common'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@nbit/chart-utils'
import ws from '@/plugins/ws'
import { Asset_Body } from '@/plugins/ws/protobuf/ts/proto/Asset'
import { formatCoinAmount, removeRepeatData } from '@/helper/assets'
import { AssetsOverviewResp, AssetsRecordsDetails, FinancialAssetsData } from '@/typings/api/assets/assets'
import { Rate } from '@/plugins/ws/protobuf/ts/proto/Rate'
import { YapiGetV1C2CBalanceAllListData } from '@/typings/api/assets/c2c'

type IStore = ReturnType<typeof getStore>

interface AssetSettingType {
  /** 是否加密资产金额 */
  encryptState?: boolean
}
/** 币种资产默认数据 */
export const defaultCoinAsset = {
  totalAmount: '0', // 总资产
  lockAmount: '0', // 锁定资产
  availableAmount: '0', // 可用资产
  positionAmount: '0', // 仓位资产
  totalAmountText: '0', // 总资产 - 千分位
  lockAmountText: '0', // 锁定资产 - 千分位
  availableAmountText: '0', // 可用资产 - 千分位
  positionAmountText: '0', // 仓位资产 - 千分位
  coinName: '', // 币名称
  symbol: '', // 币符号
  coinId: 0,
}
const defaultOverviewData: FinancialAssetsData = {
  totalAmount: '',
  coinName: '',
  availableAmount: '',
  lockAmount: '',
  symbol: '',
  positionAmount: '',
}
function getStore(set, get) {
  return {
    /** 资产 */
    assetsModule: {
      /** 资产总览数据 */
      assetsData: {
        totalAmount: '',
        availableAmount: '',
        lockAmount: '',
        coinName: '',
        symbol: '',
        positionAmount: '',
        coinAssetsData: defaultOverviewData,
        futuresAssetsData: defaultOverviewData,
        marginAssetsData: defaultOverviewData,
        financialAssetsData: defaultOverviewData,
        c2cAssetsData: defaultOverviewData,
      } as AssetsOverviewResp,
      c2cAssetsListAll: [] as YapiGetV1C2CBalanceAllListData[],
      /** 资产合约 - 资金列表 -  */
      updateAssetsModule: (values: any) => {
        set((store: IStore) => {
          return produce(store, _store => {
            const newAssetsModule = { ..._store.assetsModule, ...values }

            _store.assetsModule = newAssetsModule
          })
        })
      },
      async fetchCoinRate() {
        const res = await getCoinRate({})
        if (!res.isOk || !res.data) {
          return
        }
        const store: IStore = get()
        store.assetsModule.updateAssetsModule({ coinRate: res.data })
      },
    },
    /** 汇率信息，{coinRate：币种汇率，legalCurrencyRate：法币汇率} */
    coinRate: {
      coinRate: [], // 币种汇率
      legalCurrencyRate: {}, // 法币汇率
    },
    /** 汇率接口异常时，接口重试次数限制，最多重试 3 次 */
    coinRateAPINum: 0,
    /** 是否开启两项验证 */
    isOpenSafeVerify: true,
    /** 提币申请结果页信息 */
    withdrawResult: {
      withdrawType: WithDrawTypeEnum.blockChain, // 提币类型
      withdrawAmount: '0.00', // 提币数量
      coinName: '--', // 币种名字
      submitTime: '', // 创建时间
      estimatedFinishTime: '', // 预计完成时间
      coinPrecision: 2, // 提币精度
    },
    /** 充提币 - 币种选择 - 搜索历史 */
    coinSearchHistory: getAssetsDepositCoinHistoryCache() || {
      /** 提币 */
      withdraw: [],
      /** 充值 */
      deposit: [],
    },
    updateCoinSearchHistory: (type: CoinListTypeEnum, values: any) =>
      set((store: IStore) => {
        return produce(store, _store => {
          let newCoinSearchHistoryData = {}
          if (type === CoinListTypeEnum.withdraw) {
            newCoinSearchHistoryData = { withdraw: values }
          } else if (type === CoinListTypeEnum.deposit) {
            newCoinSearchHistoryData = { deposit: values }
          }
          const newCoinSearchHistory = { ..._store.coinSearchHistory, ...newCoinSearchHistoryData }
          _store.coinSearchHistory = newCoinSearchHistory
          setAssetsDepositCoinHistoryCache(newCoinSearchHistory)
        })
      }),
    /** 所有主币列表 - 充提币种选择用到 */
    allCoinInfoList: [],
    /** 交易页持仓资产 - 是否隐藏小额资产 */
    hideSmallAssets: false,
    /** 是否有资产 WS 推送 */
    isHasAssetsWSInfo: false,
    /**
     * 现货资产 - 币对资产信息 - 交易页用
     * totalAmount: 总资产数，availableAmount: 可用数量，positionAmount: 仓位数量，lockAmount: 冻结数量
     * */
    userAssetsSpot: {
      buyCoin: defaultCoinAsset || {},
      sellCoin: defaultCoinAsset || {},
    },
    /** 合约资产 - 交易页用
     * TODO: https://yapi.nbttfc365.com/project/44/interface/api/4247
     */
    userAssetsFutures: {
      /** 可用、可用保证金 - 根据设置的保证金币种折算 */
      availableBalanceValue: '1000',
      positionAccountRightsValue: '0', // 账户权益
      unRealizedSurplusValue: '0', // 未实现盈亏
      realizedSurplus: '0', // 已实现盈亏
      positionMargin: '0', // 仓位保证金
    },
    /** 杠杆资产 - 交易页用 */
    userAssetsMargin: {
      leverInfo: {
        marginLevel: '',
        marginLevelRisk: '',
        ladder: '', // 逐仓档位
      },
      buyCoin: {
        isDebt: '0', // 是否负债 0-否，1-是
        debt: '', // 单币种负债
        free: '', // 真实可用
        maxBorrow: '', // 最大可借
        maxReturnable: '',
        ...defaultCoinAsset,
      },
      sellCoin: {
        isDebt: '0',
        debt: '',
        free: '', // 真实可用
        maxBorrow: '',
        maxReturnable: '',
        ...defaultCoinAsset,
      },
    },
    /** 杠杆账户资产 - 杠杠账户首页资产信息 */
    allMarginAssets: {
      allCrossAssetsInCny: '0',
      allCrossAssetsInUsdt: '0',
      allCrossDebtInCny: '0',
      allCrossDebtInUsdt: '0',
      allCrossNetAssetsInCny: '0',
      allCrossNetAssetsInUsdt: '0',
      marginLevel: '',
      marginLevelRisk: 1,
      marginRatio: '',
      riskPath: '',
      riskText: '',
      smallAssetsHideThreshold: '',
    },
    /** 杠杠 - 逐仓交易对 */
    marginTradePair: <IMarginIsolatedPairResp[]>[],
    /** 资金划转成功 1 是成功，0 初始化 */
    transferSuccess: 0,
    /** 当前货币信息 */
    currencyInfo: {
      chineseName: '',
      currencyCode: 'CNY',
      englishName: '',
      exchangeRate: 1,
      precision: 2,
      symbol: '¥',
    },
    /** 是否加密资产金额（金额打星） */
    encryption: false,
    /** 需要存缓存中的资产设置 - 是否加密资产金额（金额打星） */
    assetSetting: cacheUtils.get(assetSetting) || <AssetSettingType>{ encryption: false },
    // getAssetSetting: () => {
    //   const state: IStore = get()
    //   const info = state.assetSetting
    //   return cacheUtils.get(assetSetting) || info
    // },
    setAssetSetting: (value: AssetSettingType) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.assetSetting = value
          cacheUtils.set(assetSetting, value)
        })
      }),
    removeAssetSetting: () =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.assetSetting = <AssetSettingType>{}
          cacheUtils.set(assetSetting, '')
        })
      }),
    /** 币种资产详情 */
    assetsDetailCoin: { coinName: '' },
    /** 财务记录 - 选中 tabType */
    financialRecordTabType: <FinancialRecordLogTypeEnum>FinancialRecordLogTypeEnum.overview,
    /** 财务记录列表 loading 状态 */
    financialRecordListLoading: <boolean>false,
    updateFinancialRecordListLoading: newFinancialRecordListLoading =>
      set(produce(() => ({ financialRecordListLoading: newFinancialRecordListLoading }))),
    /** 财务记录详情 */
    financialRecordDetail: <AssetsRecordsDetails>{},
    updateFinancialRecordDetail: newFinancialRecordDetail =>
      set(produce(() => ({ financialRecordDetail: newFinancialRecordDetail }))),
    /** 资产枚举，从后端获取的数据字典 */
    assetsEnums: {
      /** 财务日志状态 */
      financialRecordStateEnum: {
        codeKey: AssetsDictionaryTypeEnum.recordStatusType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志类型 */
      financialRecordTypeEnum: {
        codeKey: AssetsDictionaryTypeEnum.recordType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志类型 - 充提 */
      financialRecordTypeMainList: {
        codeKey: AssetsDictionaryTypeEnum.recordWithdrawType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志类型 - 手续费 */
      financialRecordTypeFeeList: {
        codeKey: AssetsDictionaryTypeEnum.recordFeeType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志类型 - 合约 */
      financialRecordTypePerpetualList: {
        codeKey: AssetsDictionaryTypeEnum.recordPerpetualType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约类型 */
      financialRecordTypeSwapList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualSwapType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 -合约 - 保证金记录类型 */
      financialRecordTypeMarginList: {
        codeKey: AssetsDictionaryTypeEnum.recordPerpetualMarginType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 保证金触发类型 */
      financialRecordTypeOperationList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualOperationType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 委托价格类型 */
      financialRecordTypeCttEntrustList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualOrderEntrustType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 委托类型 */
      financialRecordTypeCttOrderList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualOrderType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 订单类型 */
      financialRecordTypeEntrustStatusList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualOrderEntrustStatusType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 交易方向 */
      financialRecordTypeCttSideList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualOrderSideType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 仓位类型 */
      financialRecordTypeCttPositionSideList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualPositionType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 资金明细类型 */
      financialRecordTypePerpetualBillList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualBillType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 合约 - 迁移类型 */
      financialRecordTypePerpetualMigrateList: {
        codeKey: AssetsDictionaryTypeEnum.perpetualMigrateType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志类型 - 返佣 */
      financialRecordTypeCommissionList: {
        codeKey: AssetsDictionaryTypeEnum.recordCommissionType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志类型-c2c */
      financialRecordTypeC2CList: {
        codeKey: AssetsDictionaryTypeEnum.recordC2CType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志-c2c-业务类型 */
      c2cBillLogTypeList: {
        codeKey: AssetsDictionaryTypeEnum.c2cBillLogType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志-c2c-划转账户类型 */
      assetAccountTypeList: {
        codeKey: AssetsDictionaryTypeEnum.assetAccountType,
        enums: [],
      } as IStoreEnum,
      /** 财务日志-c2c-赔付原因 */
      c2cOrderAppealReason: {
        codeKey: AssetsDictionaryTypeEnum.c2cOrderAppealReason,
        enums: [],
      } as IStoreEnum,
      /** 财务日志 - 代理商返佣类型 - */
      financialRecordRebateType: {
        codeKey: AssetsDictionaryTypeEnum.rebateType,
        enums: [],
      } as IStoreEnum,
      /** 钱包财务日志类型 */
      walletFinancialRecordTypeEnum: {
        codeKey: AssetsDictionaryTypeEnum.walletOverviewType,
        enums: [],
      } as IStoreEnum,
    },
    /** 资产数据字典 */
    async fetchAssetEnums() {
      const state: IStore = get()
      const data = await getCodeDetailListBatch(Object.values(state.assetsEnums).map(item => item.codeKey))
      set(
        produce((draft: IStore) => {
          const items = Object.values(draft.assetsEnums)
          items.forEach((item, index) => {
            item.enums = data[index].map(enumValue => {
              return {
                label: enumValue.codeKey,
                value:
                  parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
                    ? parseInt(enumValue.codeVal, 10)
                    : enumValue.codeVal,
              }
            })
          })
        })
      )
    },
    /** 汇率接口 */
    async fetchCoinRate() {
      const res = await getCoinRate({})
      if (!res.isOk || !res.data) {
        return
      }
      const store: IStore = get()
      store.updateCoinRate(res.data)
    },
    /** ws 回调 - 现货资产 */
    async wsSpotAssetsCallback(SpotAssetsData: Asset_Body) {
      const data = SpotAssetsData
      const store: IStore = get()

      // 下单成功，data 里会包含标的币和计价币的资产数据
      // WS 回调数据去重 - 回调会返回重复记录，取最新的一条，最后一条是最新的
      store.updateIsHasAssetsWSInfo(true)
      let result: any = data
      result = removeRepeatData(result.reverse())

      const assetData = store.userAssetsSpot
      let newAssetData = JSON.parse(JSON.stringify(assetData))
      result.forEach((item, index) => {
        if (assetData?.buyCoin?.coinId === item?.coinId) {
          const { balance = '0', locked = '0', total = '0' } = item

          newAssetData = {
            ...newAssetData,
            buyCoin: {
              ...assetData.buyCoin,
              totalAmount: total,
              lockAmount: locked,
              // positionAmount: +position,
              availableAmount: balance,
              totalAmountText: formatCoinAmount(assetData.buyCoin.symbol, total, true),
              availableAmountText: formatCoinAmount(assetData.buyCoin.symbol, balance, true),
              lockAmountText: formatCoinAmount(assetData.buyCoin.symbol, locked, true),
              // positionAmountText: formatCoinAmount(symbol, position, false),
            },
          }
        }
        if (assetData?.sellCoin?.coinId === item?.coinId) {
          const { balance = '0', locked = '0', total = '0' } = item

          newAssetData = {
            ...newAssetData,
            sellCoin: {
              ...assetData.sellCoin,
              totalAmount: total,
              lockAmount: locked,
              // positionAmount: +position,
              availableAmount: balance,
              totalAmountText: formatCoinAmount(assetData.sellCoin.symbol, total, true),
              availableAmountText: formatCoinAmount(assetData.sellCoin.symbol, balance, true),
              lockAmountText: formatCoinAmount(assetData.sellCoin.symbol, locked, true),
              // positionAmountText: formatCoinAmount(symbol, position, false),
            },
          }
        }

        // 更新资产持仓
        store.updateUserAssetsSpot(newAssetData)
        if (index === result.length - 1) {
          store.updateUserAssetsSpot(newAssetData)
        }
      })
    },
    /** 订阅 - 现货资产 */
    wsSpotAssetsSubscribe: (callback?) => {
      const state: IStore = get()
      ws.subscribe({
        subs: { biz: WsBizEnum.spot, type: WsTypesEnum.asset },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.increment,
        callback: callback || state.wsSpotAssetsCallback,
      })
    },
    /** 取消订阅 - 现货资产 */
    wsSpotAssetsUnSubscribe: (callback?) => {
      const state: IStore = get()
      ws.unsubscribe({
        subs: { biz: WsBizEnum.spot, type: WsTypesEnum.asset },
        callback: callback || state.wsSpotAssetsCallback,
      })
    },
    wsRateCallback: (data: Rate) => {
      const store: IStore = get()
      let rateData = JSON.parse(JSON.stringify(data[0]))
      const newLegalCurrencyRate = {}
      // 推送和接口返回数据结构不一致，需要转换
      rateData.legalCurrencyRate.forEach(item => {
        newLegalCurrencyRate[item.currency] = item.rate
      })

      const newData = { ...rateData, legalCurrencyRate: newLegalCurrencyRate }
      store.updateCoinRate(newData)
    },
    /** 币种汇率推送 */
    wsRateSubscribe: (callback?) => {
      const state: IStore = get()
      ws.subscribe({
        subs: { biz: WsBizEnum.spot, type: WsTypesEnum.rate },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.cover,
        callback: callback || state.wsRateCallback,
      })
    },
    wsRateUnSubscribe: (callback?) => {
      const state: IStore = get()
      ws.unsubscribe({
        subs: { biz: WsBizEnum.spot, type: WsTypesEnum.rate },
        callback: callback || state.wsRateCallback,
      })
    },
    /** 币种汇率推送 */
    wsC2CAccountSubscribe: (callback?) => {
      ws.subscribe({
        subs: { biz: WsBizEnum.c2c, type: WsTypesEnum.c2cAccount },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.cover,
        callback,
      })
    },
    wsC2CAccountUnSubscribe: (callback?) => {
      ws.unsubscribe({
        subs: { biz: WsBizEnum.c2c, type: WsTypesEnum.c2cAccount },
        callback,
      })
    },
    updateCoinRateAPINum: newCoinRateAPINum => set(produce(() => ({ coinRateAPINum: newCoinRateAPINum }))),
    updateCoinRate: newCoinRate => set(produce(() => ({ coinRate: newCoinRate }))),
    updateIsOpenSafeVerify: newIsOpenSafeVerify => set(produce(() => ({ isOpenSafeVerify: newIsOpenSafeVerify }))),
    updateWithdrawResult: newWithdrawResult => set(produce(() => ({ withdrawResult: newWithdrawResult }))),
    updateAllCoinInfoList: newAllCoinInfoList => set(produce(() => ({ allCoinInfoList: newAllCoinInfoList }))),
    updateHideSmallAssets: newHideSmallAssets => set(produce(() => ({ hideSmallAssets: newHideSmallAssets }))),
    updateUserAssetsSpot: newUserAssetsSpot => set(produce(() => ({ userAssetsSpot: newUserAssetsSpot }))),
    updateIsHasAssetsWSInfo: newIsHasAssetsWSInfo => set(produce(() => ({ isHasAssetsWSInfo: newIsHasAssetsWSInfo }))),
    updateUserAssetsMargin: newUserAssetsMargin => set(produce(() => ({ userAssetsMargin: newUserAssetsMargin }))),
    updateAllMarginAssets: newAllMarginAssets => set(produce(() => ({ allMarginAssets: newAllMarginAssets }))),
    updateMarginTradePair: newMarginTradePair => set(produce(() => ({ marginTradePair: newMarginTradePair }))),
    updateTransferSuccess: newTransferSuccess => set(produce(() => ({ transferSuccess: newTransferSuccess }))),
    updateEncryption: newEncryption => set(produce(() => ({ encryption: newEncryption }))),
    updateCurrencyInfo: newCurrencyInfo => set(produce(() => ({ currencyInfo: newCurrencyInfo }))),
    updateAssetsDetailCoin: newAssetsDetailCoin => set(produce(() => ({ assetsDetailCoin: newAssetsDetailCoin }))),
    updateFinancialRecordTabType: newFinancialRecordTabType =>
      set(produce(() => ({ financialRecordTabType: newFinancialRecordTabType }))),
  }
}
const baseAssetsStore = create<IStore>(getStore)

const useAssetsStore = createTrackedSelector(baseAssetsStore)

export { useAssetsStore, baseAssetsStore }
