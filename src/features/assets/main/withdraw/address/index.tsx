/**
 * 提币地址管理
 */
import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout, ChildrenClassNameEnum } from '@/features/assets/assets-layout'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import Icon from '@/components/icon'
import WithdrawAddressAdd from '@/features/assets/main/withdraw/address/withdraw-address-add'
import { IWithdrawAddressList } from '@/typings/api/assets/assets'
import { getWithdrawAddress } from '@/helper/assets'
import { WithdrawAddressList } from './address-list'

export function WithdrawAddressLayout() {
  const [visibleAddressAdd, setVisibleAddressAdd] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<IWithdrawAddressList>()
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<IWithdrawAddressList[]>([])
  // 获取币地址
  const getWithdrawAddressData = async () => {
    setLoading(true)
    const withdrawAddressList = await getWithdrawAddress()
    withdrawAddressList && setTableData(withdrawAddressList)

    setLoading(false)
  }
  useEffect(() => {
    getWithdrawAddressData()
  }, [])

  /** 点击编辑按钮 */
  const onClickEdit = data => {
    setSelectedAddress(data)
    setVisibleAddressAdd(true)
  }

  /** 添加常用提币地址回调 */
  const onSaveWithdrawAddress = async () => {
    setVisibleAddressAdd(false)
    // 保存成功后清空
    setSelectedAddress(undefined)
    getWithdrawAddressData()
  }

  /** 新增提币地址 */
  const openAddAddressModal = () => {
    setVisibleAddressAdd(true)
    setSelectedAddress(undefined)
  }

  /** 常用提现地址 */

  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.coins}
      header={
        <AssetsHeader
          title={t`assets.withdraw.withdrawAddressList`}
          headerChildren={
            tableData.length < 10 && (
              <>
                <Icon name="property_icon_increase" />
                <span
                  onClick={() => {
                    openAddAddressModal()
                  }}
                >
                  {t`assets.withdraw.addWithdrawAddress`}
                </span>
              </>
            )
          }
          showRight={false}
        />
      }
    >
      <WithdrawAddressList
        onClickEdit={onClickEdit}
        getWithdrawAddressData={getWithdrawAddressData}
        loading={loading}
        addressList={tableData}
      />
      {visibleAddressAdd && (
        <WithdrawAddressAdd
          visibleAddressAdd={visibleAddressAdd}
          setVisibleAddressAdd={setVisibleAddressAdd}
          addressInfo={selectedAddress}
          onSubmitFn={onSaveWithdrawAddress}
        />
      )}
    </AssetsLayout>
  )
}
