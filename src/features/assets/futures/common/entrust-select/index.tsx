import { Select, SelectProps } from '@nbit/arco'
import { getEntrustTypeList, getTriggerPriceTypeList } from '@/constants/assets/futures'
import { AssetSelect } from '@/features/assets/common/assets-select'
/**
 * 触发类型 - 限价/市价
 * @param props
 * @returns
 */
export function EntrustTypeSelect(props: SelectProps) {
  const entrustTypeList = getEntrustTypeList()

  return (
    <AssetSelect {...props}>
      {entrustTypeList &&
        entrustTypeList.map(
          option =>
            option && (
              <Select.Option key={`type_${option.type}`} value={option.type}>
                {option.name}
              </Select.Option>
            )
        )}
    </AssetSelect>
  )
}
/**
 * 触发类型 - 最新价格/标记价格
 * @param props
 * @returns
 */
export function EntrustTriggerTypeSelect(props: SelectProps) {
  const triggerTypeList = getTriggerPriceTypeList()

  return (
    <AssetSelect {...props}>
      {triggerTypeList &&
        triggerTypeList.map(
          option =>
            option && (
              <Select.Option key={`type_${option.type}`} value={option.type}>
                {option.name}
              </Select.Option>
            )
        )}
    </AssetSelect>
  )
}
