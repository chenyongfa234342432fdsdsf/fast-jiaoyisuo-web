// 格式化 时间
export const formatTime = (time = 0) => {
  // if (time === 0) return '0″'

  const divide = (time / 60) | 0
  const second = time % 60

  return `${divide < 10 ? `0${divide}` : divide}′${second < 10 ? `0${second}` : second}″`
}
