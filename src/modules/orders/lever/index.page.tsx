import { OrderLayout } from '@/features/orders/order-layout'
import { useCreation } from 'ahooks'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { geOrderTabTypeEnumName, OrderTabTypeEnum } from '@/constants/order'
import { usePageContext } from '@/hooks/use-page-context'
import { SpotOrder } from '@/features/orders/composite/spot'
import { Radio } from '@nbit/arco'

export function Page() {
  const pageContext = usePageContext()
  const [tab, setTab] = useState(Number(pageContext.urlParsed.search.type || OrderTabTypeEnum.current))
  const positionTypes = [
    {
      label: t`constants/order-4`,
      id: 'isolated',
    },
    {
      label: t`constants/order-5`,
      id: 'cross',
    },
  ]
  const [selectedPositionType, setSelectedPositionType] = useState(positionTypes[0].id)
  const positionTypesNode = (
    <div className="ml-8">
      <Radio.Group size="large" type="button" value={selectedPositionType}>
        {positionTypes.map(({ label, id }) => {
          return (
            <Radio key={id} value={id} onClick={() => setSelectedPositionType(id)}>
              {label}
            </Radio>
          )
        })}
      </Radio.Group>
    </div>
  )
  const customParams = useCreation(() => {
    return {
      marginMode: selectedPositionType,
    } as any
  }, [selectedPositionType])
  const types = useCreation(() => {
    return [
      {
        name: geOrderTabTypeEnumName(OrderTabTypeEnum.current),
        type: OrderTabTypeEnum.current,
        // 避免被复用
        content: <SpotOrder customParams={customParams} key={1} tab={OrderTabTypeEnum.current} />,
      },
      {
        type: OrderTabTypeEnum.history,
        name: geOrderTabTypeEnumName(OrderTabTypeEnum.history),
        content: <SpotOrder customParams={customParams} key={2} tab={OrderTabTypeEnum.history} />,
      },
    ]
  }, [selectedPositionType])

  return <OrderLayout title={t`order.titles.lever`} />
}
