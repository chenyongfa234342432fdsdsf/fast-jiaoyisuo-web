import Icon from '@/components/icon'

/** 资产加密小眼睛 */
export default function SupportIcon(val: any) {
  return <Icon className={'ml-2 w-5 h-auto'} name={val ? 'login_satisfied' : 'icon_fail'} />
}
