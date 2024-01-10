import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Tag, Message } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import { t } from '@lingui/macro'
import { UserEnableEnum } from '@/constants/user'
import { OrderBookLimitTypeEnum } from '@/store/order-book/common'
import UserPopUp from '@/features/user/components/popup'
import { getMemberContractGroupAll, postMemberContractGroupSettings } from '@/apis/future/preferences'
import { ContractGrouplistType, ContractGroupSettingsListType } from '@/typings/api/future/preferences'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatNumberDecimal } from '@/helper/decimal'
import Icon from '@/components/icon'
import styles from '../index.module.css'
import stylesCommon from '../../../index.module.css'

const CheckboxGroup = Checkbox.Group

interface MarginCurrencyPopUpProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean
  /** 是否设置成功 */
  onSuccess?(isTrue: boolean): void
}

interface stateType {
  contractGroupValues: Array<string>
  contractGroupList: Array<ContractGrouplistType>
}

function FuturesContractGroupPopUp({ visible, setVisible, hasCloseIcon, onSuccess }: MarginCurrencyPopUpProps) {
  const [state, setState] = useState<stateType>({
    contractGroupValues: [],
    contractGroupList: [],
  })

  const { offset = OrderBookLimitTypeEnum.double } = useAssetsFuturesStore().futuresCurrencySettings

  /** 获取所以合约组 */
  const getContractGroupAll = async () => {
    const res = await getMemberContractGroupAll({})
    if (res.isOk) {
      const groupList = [...(res.data?.list as Array<ContractGrouplistType>)]
      const groupValues: Array<string> = []
      groupList.forEach(v => {
        if (v.isAutoAdd === UserEnableEnum.yes) groupValues.push(v.id)
      })

      setState({
        contractGroupList: groupList,
        contractGroupValues: groupValues,
      })
    }
  }

  /** 设置合约组 */
  const postContractGroupSettings = async () => {
    const groupList: Array<ContractGroupSettingsListType> = []
    state.contractGroupList.forEach(v => {
      state.contractGroupValues.includes(v.id)
        ? groupList.push({ groupId: v.id, isAutoAdd: UserEnableEnum.yes })
        : groupList.push({ groupId: v.id, isAutoAdd: UserEnableEnum.no })
    })

    const res = await postMemberContractGroupSettings({ groupAutoMarginSettingData: groupList })
    if (res.isOk) {
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      setVisible(false)
      onSuccess && onSuccess(true)
    }
  }

  const { run: getGroupAll, loading } = useRequest(getContractGroupAll, { manual: true })
  const { run: setContractGroup, loading: submitLoading } = useRequest(postContractGroupSettings, { manual: true })

  useEffect(() => {
    visible && getGroupAll()
  }, [visible])

  return (
    <UserPopUp
      className="user-popup"
      title={
        <div
          style={{ textAlign: 'left' }}
        >{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101369`}</div>
      }
      visible={visible}
      closable={hasCloseIcon}
      maskClosable={false}
      autoFocus={false}
      closeIcon={<Icon name="close" hasTheme />}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <div className={`contract-group ${styles['automatic-margin-call-contract-group']}`}>
        <div className={`container ${stylesCommon['contract-setting-pop-up-no-result']}`}>
          {state.contractGroupList.length > 0 ? (
            <>
              <div className="group-list">
                <CheckboxGroup
                  value={state.contractGroupValues}
                  onChange={v => setState({ ...state, contractGroupValues: v })}
                  direction="vertical"
                >
                  {state.contractGroupList.map((v, index) => (
                    <Checkbox value={v.id} style={{ zIndex: 9999 }} key={index}>
                      {({ checked }) => {
                        return (
                          <div className={`options ${checked ? 'checked' : ''}`}>
                            <div className="header">
                              <div className="tag">
                                {/* <label>{t`features_orders_order_columns_future_5101348`}</label> */}
                                <Tag color="orange">{v.name}</Tag>
                              </div>
                              <div className="status">
                                {checked ? (
                                  <Icon name="login_verify_selected" />
                                ) : (
                                  <Icon name="login_verify_unselected" hasTheme />
                                )}
                              </div>
                            </div>
                            <div className="footer">
                              <div className="text">
                                <label>{t`features/orders/order-columns/holding-6`}</label>
                              </div>
                              <div className="income">
                                <IncreaseTag value={formatNumberDecimal(v.unrealizedProfit, offset)} />
                                <label>{v.baseCoin}</label>
                              </div>
                            </div>
                          </div>
                        )
                      }}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>

              <div className="btn">
                <Button type="default" onClick={() => setVisible(false)}>{t`trade.c2c.cancel`}</Button>
                <Button
                  loading={submitLoading}
                  type="primary"
                  onClick={setContractGroup}
                >{t`user.field.reuse_17`}</Button>
              </div>
            </>
          ) : (
            <>
              <div className="no-result">
                <Icon name="no_data" hasTheme isRemoteUrl width={108} height={80} />
                <label>{t`features_trade_trade_setting_futures_automatic_margin_call_contract_group_popup_index_5101546`}</label>
              </div>

              <FullScreenSpin isShow={loading} />
            </>
          )}
        </div>
      </div>
    </UserPopUp>
  )
}

export default FuturesContractGroupPopUp
