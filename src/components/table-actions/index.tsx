/**
 * 用于表格操作列的菜单
 */

import { replaceEmpty } from '@/helper/filters'
import { Button, Dropdown, Menu } from '@nbit/arco'
import classNames from 'classnames'
import { ReactNode } from 'react'
import Icon from '../icon'

export type ITableAction = {
  name?: string
  onClick?: () => void
  id: string
  node?: ReactNode
  visible: boolean
}
export type ITableActionsProps = {
  max?: number
  actions: ITableAction[]
  children?: ReactNode
  onClick?: (id: any) => void
}

function TableActions({ max = 2, actions, onClick, children }: ITableActionsProps) {
  const visibleActions = actions.filter(action => action.visible)
  const restActions = visibleActions.slice(max)
  const showActions = visibleActions.slice(0, max)
  const dropList = (
    <Menu>
      {restActions.map(action => {
        const onClickAction = () => {
          action.onClick?.()
          onClick?.(action.id)
        }
        return (
          <Menu.Item key={action.id} onClick={onClickAction}>
            {action.name || action.node}
          </Menu.Item>
        )
      })}
    </Menu>
  )
  return (
    <div className="inline-flex items-center">
      {children}
      {visibleActions.length === 0 && replaceEmpty()}
      <div className="flex items-center">
        {showActions.map(action => {
          const onClickAction = () => {
            action.onClick?.()
            onClick?.(action.id)
          }
          return (
            <span key={action.id} onClick={onClickAction} className="table-text-button">
              {action.name || action.node}
            </span>
          )
        })}
      </div>
      {restActions.length > 0 && (
        // TODO: hover 时不显示下拉菜单
        <Dropdown trigger="hover" droplist={dropList} position="bl">
          <div>
            <Icon
              name="msg_more_def"
              className={classNames('text-xs translate-y-px', {
                'ml-4': showActions.length > 0,
              })}
              hasTheme
            />
          </div>
        </Dropdown>
      )}
    </div>
  )
}

export default TableActions
