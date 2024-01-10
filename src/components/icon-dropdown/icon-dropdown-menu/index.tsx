import LazyImage from '@/components/lazy-image'
import { useLayoutStore } from '@/store/layout'
import { Card } from '@nbit/arco'
import classNames from 'classnames'
import { QRCodeCanvas } from 'qrcode.react'
import styles from './index.module.css'

const { Meta } = Card

export type DropListElement = {
  image?: string
  QRCodeUrl?: string
  title: string
}

interface IIconDropdownMenu {
  droplist: DropListElement[]
}

export default IconDropdownMenu

function IconDropdownMenu(props: IIconDropdownMenu) {
  const { headerData } = useLayoutStore()
  const { imgWebLogo } = headerData || {}
  const { droplist } = props
  const renderCover = (element: DropListElement) => {
    if (element.image) return <LazyImage src={element.image} />
    else if (element.QRCodeUrl)
      return (
        <QRCodeCanvas
          value={element.QRCodeUrl}
          imageSettings={{
            src: imgWebLogo || '',
            x: undefined,
            y: undefined,
            height: 22,
            width: 22,
            excavate: true,
          }}
        />
      )
  }
  return (
    <Card className={classNames(styles.scoped)} size={'small'} bordered={false}>
      {droplist.map((each, index) => (
        <Card key={index} size={'small'} bordered={false} cover={renderCover(each)}>
          <Meta title={each.title} />
        </Card>
      ))}
    </Card>
  )
}
