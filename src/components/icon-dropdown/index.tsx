import { Dropdown, DropdownProps } from '@nbit/arco'
import { ReactNode } from 'react'
import IconDropdownMenu, { DropListElement } from './icon-dropdown-menu'

interface IIconDropdown extends DropdownProps {
  icon: ReactNode
  droplist: DropListElement[]
  title?: string
}

export default IconDropdown

function IconDropdown(props: IIconDropdown) {
  const { icon, droplist, title, ...rest } = props
  return (
    <Dropdown {...rest} droplist={<IconDropdownMenu droplist={droplist} />}>
      {icon}
      <div>{title}</div>
    </Dropdown>
  )
}
