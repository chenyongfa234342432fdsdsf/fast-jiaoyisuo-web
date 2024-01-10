import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'

const locales = ['en-US', 'zh-CN', 'zh-HK', 'ta-IN', 'hi-IN', 'pt-BR', 'vi-VN', 'ko-KR', 'id-ID', 'th-TH', 'ja-JP']
const jsonList: any[] = []
locales.forEach(locale => {
  const string = fs.readFileSync(path.join(__dirname, `../../../src/locales/${locale}/messages.json`), 'utf-8')
  const json = JSON.parse(string)
  jsonList.push(json)
})

const sheetName = 'Web-FASTPAY' // 工作表名称
const header = ['key', ...locales] // 表头
const data = Object.entries(jsonList[0]) // 将 JSON 转换为二维数组
data.forEach(item => {
  item.push(...jsonList.slice(1).map(json => json[item[0]]))
})

const workSheet = xlsx.utils.aoa_to_sheet([header, ...data])
const workBook = xlsx.utils.book_new()
xlsx.utils.book_append_sheet(workBook, workSheet, sheetName)

const excelData = xlsx.write(workBook, { bookType: 'xlsx', type: 'buffer' })
fs.writeFileSync(`i18n.xlsx`, excelData)
