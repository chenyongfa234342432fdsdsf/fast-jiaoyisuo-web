export type IStoreEnum = {
  codeKey: string
  enums: {
    label: string
    value: string | number
  }[]
  /** 获取默认值函数，规避初始化时多语言未载入的问题 */
  getDefault?: () => IStoreEnum['enums']
}