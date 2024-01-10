import { t } from '@lingui/macro'

export const kycTypeKV = key => {
  return (
    {
      0: '无' ?? '--',
      1: '无',
      2: '个人标准认证',
      3: '个人高级认证',
      4: '企业认证',
    } as const
  )[key]
}

export enum C2cWeekEnum {
  Monday = '1',
  Tuesday = '2',
  Wednesday = '3',
  Thursday = '4',
  Friday = '5',
  Saturday = '6',
  Sunday = '0',
  SundayCopy = '7',
}

export const weekKV = date => {
  const WeekObj = {
    '': '',
    [C2cWeekEnum.Monday]: t`features_c2c_center_my_status_index_2222222225101405`,
    [C2cWeekEnum.Tuesday]: t`features_c2c_center_my_status_index_2222222225101406`,
    [C2cWeekEnum.Wednesday]: t`features_c2c_center_my_status_index_2222222225101407`,
    [C2cWeekEnum.Thursday]: t`features_c2c_center_my_status_index_2222222225101408`,
    [C2cWeekEnum.Friday]: t`features_c2c_center_my_status_index_2222222225101409`,
    [C2cWeekEnum.Saturday]: t`features_c2c_center_my_status_index_2222222225101410`,
    [C2cWeekEnum.Sunday]: t`features_c2c_center_my_status_index_2222222225101411`,
    [C2cWeekEnum.SundayCopy]: t`features_c2c_center_my_status_index_2222222225101411`, // 兼容数值为 7 的周天的数据
  }

  return WeekObj[date] || ''
}
