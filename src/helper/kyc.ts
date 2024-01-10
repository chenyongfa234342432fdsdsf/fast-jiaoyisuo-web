import Axios from 'axios'
/**
  @params {string}reportUrl 是下载地址
  @params {string}name 下载文件名
 */
const download = async (downloadUrls, name) => {
  const res = await Axios.get(downloadUrls, {
    responseType: 'blob',
  })
  if (res?.status === 200) {
    const url = window.URL.createObjectURL(res.data)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return true
  } else {
    return false
  }
}

// 生成独一无二的值
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0
    let v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export { download, guid }
