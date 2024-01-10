import { useEffect, useState } from 'react'
import { useBoolean } from 'react-use'
import { Button, Carousel } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { useTradeStore } from '@/store/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { TradeModeEnum } from '@/constants/trade'
import { queryTradeNotifications } from '@/apis/trade'
import { ITradeNotification } from '@/typings/api/trade'
import chunk from 'lodash/chunk'
import Icon from '@/components/icon'
import styles from './index.module.css'

enum ScrollLengthEnum {
  zero = 0,
  three = 3,
  nine = 9,
}

enum SpotEnum {
  isSpot = 1,
  noSpot,
}

enum bulletinBoardTypeEnum {
  spot = 'spot', // 现货
  swap = 'swap', // 合约
}

function TransactionBulletinBoard() {
  const [visibleTips, setVisibleTips] = useState<boolean>(false)
  const [itemList, setItemList] = useState<Array<Array<ITradeNotification>>>([])
  const [cacheList, setCachelist] = useState<Array<ITradeNotification>>([])
  const [popUpShowList, setPopUpShowList] = useState<Array<ITradeNotification>>([])
  const [popUpStatusList, setPopUpStatusList] = useState<Array<boolean>>([])

  const [isShow, toggleIsShow] = useBoolean(false)

  const TradeStore = useTradeStore()
  const pageContext = usePageContext()
  const { setLayout } = TradeStore

  const spotStore = useMarketStore()
  const contractStrore = useContractMarketStore()

  const { pathname } = pageContext.urlParsed
  const isFutures = pathname.includes(TradeModeEnum.futures)
  const store = isFutures ? contractStrore : spotStore
  const { id, symbolWassName } = store.currentCoin

  const getTradeNotifications = async () => {
    const res = await queryTradeNotifications({
      operateType: 3, // 针对币对的类型
      symbol: isFutures ? bulletinBoardTypeEnum.swap : bulletinBoardTypeEnum.spot, // spot 现货 swap 合约
      coindIdList: [`${id}`],
    })

    if (res.isOk) {
      let list: Array<ITradeNotification> = []
      let lampList = res.data?.lampList || []

      /** 判断币对公告是否需要弹窗 */
      const showList = lampList.filter(v => v.forceViewModal === SpotEnum.isSpot)

      setPopUpStatusList(new Array(showList.length).fill(true))
      setPopUpShowList(showList)

      /** 最多展示 9 条公告 超出的截取 */
      lampList && lampList.length > ScrollLengthEnum.nine
        ? (list = [...lampList].splice(ScrollLengthEnum.zero, ScrollLengthEnum.nine) as Array<ITradeNotification>)
        : (list = [...lampList] as Array<ITradeNotification>)

      /** 币对没有公告时 填充提示文 */
      if (list.length === ScrollLengthEnum.zero) {
        list.push(
          ...new Array(1).fill({
            name: t`features_announcement_bulletin_board_index_5101191`,
            id: null,
          })
        )
      }

      /** 三个一组 */
      setItemList(chunk([...list], ScrollLengthEnum.three))
      setCachelist([...list])
    }
  }

  useEffect(() => {
    symbolWassName && getTradeNotifications()
  }, [symbolWassName])

  const handleBulletinBoardShow = () => {
    setVisibleTips(false)
    setLayout('announcementShow', false)
  }

  return (
    <div className={`transaction-bulletin-board ${styles.scoped}`}>
      <div className={`transaction-bulletin-board-wrap ${isShow ? '' : 'show-list'}`}>
        {isShow ? (
          <div className="content-wrap">
            {cacheList.map((value, index) => (
              <div className="item" key={`itemKey${index}`}>
                <div className="item-wrap">
                  <label
                    onClick={() => value.id && link(`/announcement/article/${value.id}?subMenuId=${value.parentId}`)}
                  >
                    {value.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Carousel indicatorType="never" direction="vertical" autoPlay={{ interval: 5000 }}>
            {itemList.map((item, index) => (
              <div key={`itemKey${index}`} className="item">
                {item.map((value, row) => (
                  <div key={`rowKey${row}`} className="item-wrap">
                    <label
                      onClick={() => value.id && link(`/announcement/article/${value.id}?subMenuId=${value.parentId}`)}
                    >
                      {value.name}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </Carousel>
        )}

        {cacheList.length > ScrollLengthEnum.three && (
          <div className="drop-down">
            <Icon name={isShow ? 'trade_put_away' : 'trade_expand'} hasTheme onClick={toggleIsShow} fontSize={14} />
          </div>
        )}
        <div className="close">
          <Icon name="del_input_box" hover hasTheme onClick={() => setVisibleTips(true)} fontSize={20} />
        </div>
      </div>

      <UserPopUp
        closable={false}
        maskClosable={false}
        className="user-popup user-popup-tips"
        visible={visibleTips}
        footer={null}
        style={{ paddingBottom: 0 }}
      >
        <UserPopupTipsContent
          slotContent={
            <>
              <p>{t`features_announcement_bulletin_board_index_2700`}</p>
              <Button
                type="primary"
                onClick={handleBulletinBoardShow}
                style={{ width: '100%', marginTop: 32 }}
              >{t`features_trade_spot_index_2510`}</Button>
            </>
          }
        />
      </UserPopUp>

      {popUpShowList.length > ScrollLengthEnum.zero &&
        popUpShowList.map((v, i) => (
          <UserPopUp
            key={`popupShow${i}`}
            closable={false}
            maskClosable={false}
            className={`user-popup user-popup-tips ${styles['user-popup-customize-brand-btn']}`}
            autoFocus={false}
            mask={i === ScrollLengthEnum.zero}
            visible={popUpStatusList[i]}
            onOk={() =>
              setPopUpStatusList(value => {
                const newState = [...value]
                newState[i] = false
                return newState
              })
            }
            okText={t`user.field.reuse_10`}
            cancelText={t`features_announcement_bulletin_board_index_5101190`}
            onCancel={() => link(`/announcement/article/${v.id}?subMenuId=${v.parentId}`)}
          >
            <UserPopupTipsContent slotContent={<p>{v.name}</p>} />
          </UserPopUp>
        ))}
    </div>
  )
}

export default TransactionBulletinBoard
