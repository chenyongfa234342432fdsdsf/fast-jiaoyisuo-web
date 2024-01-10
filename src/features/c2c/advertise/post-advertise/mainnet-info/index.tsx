/**
 * 发布广告单 - 选择主链类型对应的主链信息输入项
 */

import { Input } from '@nbit/arco'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import FormItem from '@/features/assets/common/form-item'
import { t } from '@lingui/macro'
import { CoinStateEnum } from '@/constants/assets'
import { C2CMainTypeListResp } from '@/typings/api/c2c/common'
import { verifyWithdrawAddress } from '@/apis/assets/main'
import { useState } from 'react'

interface MainnetInfoProps {
  isValidator?: boolean
}
function MainnetInfo({ isValidator = false }: MainnetInfoProps) {
  const advertiseStore = useC2CAdvertiseStore()
  const {
    postOptions: { chainAddressListSelected = [] },
  } = { ...advertiseStore }
  const [addressList, setAddressList] = useState({})
  /**
   * 校验充币地址是否填写正确
   */
  const onCheckDepositAddress = async (item: C2CMainTypeListResp, address: string) => {
    const res = await verifyWithdrawAddress({
      symbol: item?.symbol,
      address,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return false

    if (!data?.isSuccess) {
      return false
    }
    return true
  }

  return (
    <div className="advertise-content-container">
      <div className="sub-title">{t`features_c2c_advertise_post_advertise_mainnet_info_index_muhye_jfzuqxsssmak4gq`}</div>
      {chainAddressListSelected.map(item => {
        return (
          <div className="form-row-wrap" key={item.id}>
            <FormItem
              label={item.mainType}
              field={`chainAddress_${item.mainType}`}
              // validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  validateTrigger: ['onBlur', 'onSubmit'],
                  validator: async (value, cb) => {
                    if (!value && isValidator) {
                      return cb(t`features_c2c_advertise_post_advertise_mainnet_info_index_q-r68h5iq3oivghv5nal3`)
                    } else if (
                      isValidator &&
                      !(value !== addressList[item.mainType] && (await onCheckDepositAddress(item, value)))
                    ) {
                      // 接口触发异常后，值有变化时才调接口
                      addressList[item.mainType] = value
                      setAddressList(addressList)
                      return cb(
                        t({
                          id: 'features_c2c_advertise_post_advertise_mainnet_form_index_gssgliw0ffyxeceveu8gt',
                          values: { 0: item?.mainType },
                        })
                      )
                    }
                    return cb()
                  },
                },
              ]}
            >
              <Input
                autoComplete="off"
                placeholder={t`features_c2c_advertise_post_advertise_mainnet_info_index_q-r68h5iq3oivghv5nal3`}
              />
            </FormItem>
            {item.isUseMemo === CoinStateEnum.open ? (
              <FormItem
                label={`${item.mainType} Memo`}
                field={`chainAddress_Memo_${item.mainType}`}
                rules={[
                  {
                    required: true,
                    validator: (value, cb) => {
                      if (!value && isValidator) {
                        return cb(t`features_c2c_advertise_post_advertise_mainnet_info_index_htviotnuz_6fl25cg1c0y`)
                      }
                      return cb()
                    },
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={t`features_c2c_advertise_post_advertise_mainnet_info_index_htviotnuz_6fl25cg1c0y`}
                />
              </FormItem>
            ) : (
              <FormItem>
                <div></div>
              </FormItem>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MainnetInfo
