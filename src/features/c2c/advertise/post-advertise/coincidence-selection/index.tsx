/**
 * 重合度选择按钮组建 - 重合度选择
 */

import { useState } from 'react'
import { CoincidentEnumType } from '@/constants/c2c/advertise'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import CoincidencePopBox from './coincidence-pop-box'
import styles from './index.module.css'

function CoincidenceSelection({ form, getLatestPriceData }) {
  const [selectIndex, setIndex] = useState<string>(CoincidentEnumType.LowCoexistence)
  const [visible, setvisible] = useState(false)
  const CoincidentList = [
    {
      label: t`features_c2c_advertise_post_advertise_coincidence_selection_index_9sma6kjswo`,
      value: CoincidentEnumType.LowCoexistence,
    },
    {
      label: t`features_c2c_advertise_post_advertise_coincidence_selection_index_ek1iosyqug`,
      value: CoincidentEnumType.CoincidenceDegree,
    },
    {
      label: t`features_c2c_advertise_post_advertise_coincidence_selection_index_xmixxddexw`,
      value: CoincidentEnumType.HighCoincidence,
    },
  ]

  /**
   * 获取重合度查询数据
   */
  const getTheCoincidenceQuery = valueType => {
    form.setFieldValue('coincidenceDegree', valueType)
    getLatestPriceData()
  }

  /**
   * 重合度按钮切换事件
   */
  const onButtonClick = row => {
    if (row.value !== selectIndex) {
      setIndex(row.value)
      getTheCoincidenceQuery(row.value)
    }
  }
  return (
    <div className={styles.scoped}>
      <div className="coincident-flex">
        {CoincidentList.map(row => {
          return (
            <div
              className={selectIndex === row.value ? 'coincident-index' : ''}
              onClick={() => onButtonClick(row)}
              key={row.value}
            >
              {row.label}
            </div>
          )
        })}
      </div>
      <div>
        <span>
          <Icon name="msg" fontSize={12} hasTheme onClick={() => setvisible(true)} />
        </span>
      </div>
      <div
        onClick={() => {
          getTheCoincidenceQuery(selectIndex)
        }}
      >{t`features_c2c_advertise_post_advertise_coincidence_selection_index_fsottad_y3`}</div>

      <CoincidencePopBox setvisible={setvisible} coincidencevisible={visible} />
    </div>
  )
}
export default CoincidenceSelection
