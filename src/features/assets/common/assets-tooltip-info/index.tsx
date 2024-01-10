/**
 * tooltip 内容组件 - 用于币种资产和 c2c 资产列表
 */
import { formatCoinAmount } from '@/helper/assets'
import { AssetsEncrypt } from '../assets-encrypt'
import styles from './index.module.css'

interface ListData {
  label: string
  value: string | number | undefined
  symbol: string | undefined
}

interface ToolTipContentProps {
  data: ListData[]
}

function ToolTipContent({ data }: ToolTipContentProps) {
  return (
    <div className={styles.scoped}>
      {data.map((item, index) => {
        return (
          <div className="details-item-info" key={index}>
            <span className="label">{item.label}：</span>
            <span className="value">
              <AssetsEncrypt content={formatCoinAmount(item.symbol, item.value)} />
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { ToolTipContent }
