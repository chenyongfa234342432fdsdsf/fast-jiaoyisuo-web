/**
 * 正则校验
 */

/** 验证由数字和 26 个英文字母组成的字符串 */
const strReg = /^[A-Za-z0-9]+$/
const numReg = /^[0-9]+$/
const nameReg = /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/ // 只能输入数字、字母、汉字、空格

// valid email format pattern
const emailRegex = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/

export const onCheckStr = (str: string) => strReg.test(str)

/**
 * 校验数字
 */
export const onCheckNum = (num: string) => numReg.test(num)

// to check for valid email
export const checkValidEmailInput = (input: string) => emailRegex.test(input)

/**
 * 校验逐仓名称
 */
export const onCheckPositionName = (name: string) => nameReg.test(name)
