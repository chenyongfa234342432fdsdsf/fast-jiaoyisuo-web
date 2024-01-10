import { Typography } from '@nbit/arco'
import classNames from 'classnames'
import { MouseEventHandler, ReactNode } from 'react'
import styles from './index.module.css'

interface IDisplayCardProps {
  title: string
  description: string
  icon: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

export default DisplayCard

function DisplayCard(props: IDisplayCardProps) {
  const { title, description, icon, onClick } = props

  return (
    <div className={classNames(styles.scoped)} onClick={onClick}>
      {icon}
      <Typography className="text-text_color_01 font-medium text-xl">{title}</Typography>
      <Typography className="text-text_color_02">{description}</Typography>
    </div>
  )
}
