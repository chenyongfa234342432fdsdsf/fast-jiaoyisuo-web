import { targetLanguages } from '@/constants/i18n'
import _ from 'lodash'

const { Translate } = require('@google-cloud/translate').v2
const fs = require('fs')
const fspromises = require('fs').promises

type WriteFileArrObj = {
  filename: string
  filejson: string[]
}

const apiKey = 'AIzaSyDp6HkuLeqGGoVqDykZgpWgEQ2p3iBqpVE'

// 创建 Translate 客户端
const translate = new Translate({
  key: apiKey,
})
// 读取 JSON 文件
const jsonFilePath = 'src/locales/zh-CN/messages.json'
const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')) as object
// 用于存储对象 key
const jsonContentTransform = {}
// 用于存储对象里面{}的值
const jsonReplacedContent = {}
const jsonContentParse = { ...jsonContent }

Object.keys(jsonContent).forEach((item, index) => {
  if (jsonContent?.[item]) {
    const matchResult = jsonContent?.[item].match(/\{(.+?)\}/)

    if (matchResult) {
      const extractedContent = matchResult[1]
      const isEnglish = /^[A-Za-z\s]+$/.test(extractedContent)
      if (isEnglish) {
        // 从 10000 的 key 开始插入存储对象里面
        const replacedStringName = 10000 + index
        // 把{}里面的英文先替换成数字
        const replacedString = jsonContent?.[item].replace(/\{(.+?)\}/g, `{${replacedStringName}}`)
        // 给之后需要遍历的对象
        jsonContentParse[item] = replacedString?.replace(/ /g, '\u00A0')
        jsonReplacedContent[replacedStringName] = extractedContent.replace(/ /g, '\u00A0')
      } else {
        jsonContentParse[item] = jsonContent?.[item]?.replace(/ /g, '\u00A0')
      }
    } else {
      jsonContentParse[item] = jsonContent?.[item]?.replace(/ /g, '\u00A0')
    }
    jsonContentTransform[index] = item
  }
})

// 'ta' - 南印度（泰米尔语）
// 'hi' - 北印度（印地语）
// 'pt' - 巴西葡萄牙语
// 'vi' - 越南语
// 'ko' - 韩语
// 'id' - 印尼语
// 'th' - 泰语
// 'ja' - 日语

const writeFileArr = [] as WriteFileArrObj[]

function replaceKeys(replaceobj) {
  const result = {}

  replaceobj.forEach((item, index) => {
    const matchResult = item.match(/\{(.+?)\}/)

    if (matchResult) {
      const extractedContent = matchResult[1]

      if (jsonReplacedContent[extractedContent]) {
        result[jsonContentTransform[index]] = item.replace(/\{(.+?)\}/g, `{${jsonReplacedContent[extractedContent]}}`)
      } else {
        result[jsonContentTransform[index]] = item
      }
    } else {
      result[jsonContentTransform[index]] = item
    }
  })

  return result
}

// 递归函数，用于遍历 JSON 对象并翻译值
async function translateJSON(jsonObject) {
  const batchSize = 100
  const totalKeys = Object.keys(jsonObject).length

  for (let i = 0; i < totalKeys; i += batchSize) {
    const batchKeys = Object.keys(jsonObject).slice(i, i + batchSize)
    const batchObject = {}
    for (const key of batchKeys) {
      batchObject[key] = jsonObject[key]
    }

    for (const targetLanguagesKey of Object.keys(targetLanguages)) {
      let translations = []
      try {
        // eslint-disable-next-line no-await-in-loop
        const results = await translate.translate(Object.values(batchObject), targetLanguages[targetLanguagesKey])

        translations = results[0]
      } catch (err) {
        console.error('翻译时出现错误：', err)
      }

      // 查找并解构相应的元素到 filejson
      const matchingFile = writeFileArr.find(file => file.filename === targetLanguagesKey)
      if (matchingFile) {
        matchingFile.filejson = [...matchingFile.filejson, ...translations]
      } else {
        writeFileArr.push({
          filename: targetLanguagesKey,
          filejson: translations,
        })
      }
    }
  }
}

const removeNullAndEmptyStringProperties = obj => {
  return _.omitBy(obj, value => _.isNull(value) || value === '')
}

// 源文件路径
const sourceFilePath = 'src/locales/zh-CN/messages.d.ts'

async function writeTranslationFiles() {
  for (const item of writeFileArr) {
    const folderName = item.filename
    const filePath = `src/locales/${folderName}/messages.json`
    // 目标文件路径
    const targetFilePath = `src/locales/${folderName}/messages.d.ts`

    try {
      // 创建文件夹
      // eslint-disable-next-line no-await-in-loop
      await fspromises.mkdir(`src/locales/${folderName}`, { recursive: true })
      // 写入文件内容

      const jsonOtherFilePath = `src/locales/${folderName}/messages.json`
      const jsonOtheContent = JSON.parse(fs.readFileSync(jsonOtherFilePath, 'utf8')) as object

      const writeJson = { ...replaceKeys(item.filejson), ...removeNullAndEmptyStringProperties(jsonOtheContent) }

      // eslint-disable-next-line no-await-in-loop
      await fspromises.writeFile(filePath, JSON.stringify(writeJson, null, 2), 'utf8')

      // 使用 fs.createReadStream 和 fs.createWriteStream 复制文件
      const sourceStream = fs.createReadStream(sourceFilePath)
      const targetStream = fs.createWriteStream(targetFilePath)

      // 将数据从源文件流复制到目标文件流
      sourceStream.pipe(targetStream)

      // 当复制完成时，关闭流
      sourceStream.on('end', () => {
        console.log(`文件复制到${folderName}完成`)
      })

      sourceStream.on('error', err => {
        console.error(`文件复制到${folderName}发生错误：`, err)
      })
    } catch (err) {
      console.error(`写入文件时出现错误：${err}`)
    }
  }
}

async function main() {
  await translateJSON(jsonContentParse)
  writeTranslationFiles()
}

main()
