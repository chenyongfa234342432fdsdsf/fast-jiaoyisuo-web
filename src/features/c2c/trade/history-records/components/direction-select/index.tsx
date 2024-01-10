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

function C2cHrDirectionSelect(props: Props) {
  const store = useC2CHrStore()
  const selectList = c2cHrConstants.getDirectOptions()
  const value = store.requestData.directCd

  const setChangeInput = e => {
    store.setRequestData({
      directCd: e,
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
        placeholder={t`order.columns.direction`}
      >
        {setSelectList(selectList)}
      </C2cMaSimpleSelect>
    </div>
  )
}

export default C2cHrDirectionSelect
