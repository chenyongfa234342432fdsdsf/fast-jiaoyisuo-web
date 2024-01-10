import { c2cHrConstants } from '@/constants/c2c/history-records'
import { C2cMaSimpleSelect } from '@/features/c2c/trade/merchant-apply/common/simple-select'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { t } from '@lingui/macro'
import { Select } from '@nbit/arco'
import styles from './index.module.css'

type Props = {
  value?: string
  onChange?: (e: string) => void
}

const Option = Select.Option

function C2cHrDealTypeSelect(props: Props) {
  const store = useC2CHrStore()
  const value = store.requestData.dealTypeCds
  const selectList = c2cHrConstants.getDealTypeOptions()

  const setChangeInput = e => {
    store.setRequestData({
      dealTypeCds: e,
    })
  }

  const setSelectList = (list): React.ReactNode => {
    return list?.map(option => (
      <Option key={option.id} value={option.id} extra={option}>
        {/* <img className="select-img" src={option.imgUrl} alt="" /> */}
        <span className="select-text">{option.title}</span>
      </Option>
    ))
  }

  return (
    <div className={styles.scope}>
      <C2cMaSimpleSelect
        value={value}
        onChange={setChangeInput}
        defaultValue={selectList[0].title}
        placeholder={t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`}
      >
        {setSelectList(selectList)}
      </C2cMaSimpleSelect>
    </div>
  )
}

export default C2cHrDealTypeSelect
