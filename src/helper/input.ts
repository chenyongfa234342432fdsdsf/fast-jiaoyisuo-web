// 过滤表情符号
export const defaultFilterEmoji = (value = '') => {
  return value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
}

// 过滤中文字符
export const defaultFilterChinese = (value = '') => {
  return value.replace(/[\u4e00-\u9fa5]/g, '')
}
