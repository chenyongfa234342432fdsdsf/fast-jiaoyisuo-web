import { useState, memo, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Button, Modal, ModalProps } from '@nbit/arco'
import Icon from '@/components/icon'
import { baseCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import Tabs from '@/components/tabs'
import LimitOrder from './limit-order'
import MarketOrder from './market-order'
import PlanDelegation from './plan-delegation'
import { useTradeEntrust } from './tradeentrust'
import styles from './index.module.css'

interface Props extends ModalProps {
  okText?: string
  onOk?: (e?: MouseEvent) => Promise<any> | void
}

function TradeEntrustModal(props: Props, ref) {
  const [modalVisibl, setModalVisibl] = useState<boolean>(false)

  const [selectedTab, setSelectedTab] = useState<string>('marketOrder')

  const [imgName, setImgName] = useState<string>('black')

  const { theme } = baseCommonStore.getState()

  const setThemeChange = () => {
    switch (theme) {
      case ThemeEnum.dark:
        return setImgName('white')
      case ThemeEnum.light:
        return setImgName('black')
      default:
        setImgName('black')
    }
  }

  useEffect(() => {
    setThemeChange()
  }, [theme])

  const {
    okText,
    onOk = () => {
      setModalVisibl(false)
    },
  } = props

  const { entrustTabList } = useTradeEntrust()

  const tradeEntrustModalRef = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalVisibl(true)
    },
    closeModal() {
      setModalVisibl(false)
    },
  }))

  const setTabContent = () => {
    switch (selectedTab) {
      case 'marketOrder':
        return <MarketOrder imgName={imgName} />
      case 'limitOrder':
        return <LimitOrder imgName={imgName} />
      case 'planDelegation':
        return <PlanDelegation imgName={imgName} />
      default:
        break
    }
  }

  return (
    <div ref={tradeEntrustModalRef}>
      <div>
        <Modal
          {...props}
          onCancel={() => setModalVisibl(false)}
          visible={modalVisibl}
          closable={false}
          wrapClassName={styles['free-trade-modal']}
          footer={null}
        >
          <div className="modal-container-tab">
            <div className="container-tab-item">
              <Tabs
                value={selectedTab}
                mode="line"
                tabList={entrustTabList}
                onChange={item => setSelectedTab(item.id)}
              />
            </div>
            <Icon name="close" hasTheme className="tab-close" onClick={() => setModalVisibl(false)} />
          </div>
          <div className="modalDetail">{setTabContent()}</div>
          <div className="modal-container-button">
            <Button long type="primary" onClick={() => onOk()} className="container-button-detail">
              {okText}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default memo(forwardRef(TradeEntrustModal))
