/**
 * 广告单 - 收款方式展示组件
 */
import { AreaTransactionTypeEnum } from '@/constants/c2c/advertise'
import { IAdvertList } from '@/typings/api/c2c/advertise/post-advertise'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { Popover } from '@nbit/arco'
import { getTextFromStoreEnums } from '@/helper/store'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { IStoreEnum } from '@/typings/store/common'
import styles from './index.module.css'

interface MainChainAddressProps {
  advertDetail: IAdvertList
  classNameTag?: string
  advertDealTypeEnum?: IStoreEnum['enums']
}

function MainChainAddress(props: MainChainAddressProps) {
  const { advertiseEnums } = useC2CAdvertiseStore()
  const { advertDetail, advertDealTypeEnum = advertiseEnums.advertDealTypeEnum.enums } = props || {}
  return (
    <div className={styles['main-chain-wrap']}>
      <span
        className={classNames('trade-type-text mr-2', {
          'trade-type-in': advertDetail.tradeTypeCd === AreaTransactionTypeEnum.inside,
          'trade-type-out': advertDetail.tradeTypeCd === AreaTransactionTypeEnum.outside,
        })}
      >
        {getTextFromStoreEnums(advertDetail.tradeTypeCd, advertDealTypeEnum)}
      </span>
      {advertDetail.mainchainAddrs && advertDetail.mainchainAddrs?.length > 1 && (
        <span className="cursor-pointer">
          <span>{advertDetail.mainchainAddrs[0].name}</span>
          <Popover
            position="bottom"
            content={
              <div className="flex flex-row gap-x-2 text-text_color_01">
                {advertDetail.mainchainAddrs.slice(1).map(option => (
                  <span key={option.name}>{option.name}</span>
                ))}
              </div>
            }
          >
            <span>
              <Icon className="w-2 h-2 ml-1" name="arrow_open" hasTheme />
            </span>
          </Popover>
        </span>
      )}
      {advertDetail.mainchainAddrs && advertDetail.mainchainAddrs?.length === 1 && (
        <span>{advertDetail.mainchainAddrs[0].name}</span>
      )}
    </div>
  )
}

export { MainChainAddress }
