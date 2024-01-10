import { isValidUploadVideo } from '@/helper/c2c/merchant-application/utils'
import { AwsS3FolderModuleName, AwsS3FolderModuleUseCaseName } from '@/plugins/aws-s3/constants'
import { awsS3UploadFile } from '@/plugins/aws-s3/utils'
import { Button, Upload } from '@nbit/arco'
import { UploadItem } from '@nbit/arco/es/Upload'
import { useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import styles from './index.module.css'

export function UploadVideo({
  onSettledCallback,
  videoPlaceholder,
  noDataPlaceholder,
  showUploadButton,
  folderName,
  usercaseName,
  isAutoUpload,
}: {
  // 当文件变化后是否自动上传
  isAutoUpload?: boolean

  // 自动上传时需要
  folderName?: AwsS3FolderModuleName
  usercaseName?: AwsS3FolderModuleUseCaseName

  /** 自动上传结果 / 文件变动回掉 */
  onSettledCallback: ({ url, errorMessage }: { url?: string | UploadItem; errorMessage?: string }) => void

  videoPlaceholder?: (file: UploadItem) => React.ReactNode
  noDataPlaceholder?: React.ReactNode

  /** 是否展示上传按钮 */
  showUploadButton?: boolean
}) {
  const [file, setFile] = useState<UploadItem>()
  // 记录已经上传文件的本地连接
  const uploadedVideoRef = useRef<{ fileLocalObjectUrl?: string }>()
  const [isLoading, setIsLoading] = useState(false)

  useUpdateEffect(() => {
    if (!isAutoUpload || !file) return
    const { isValid, errorMessage } = isValidUploadVideo(file)

    if (!isValid || errorMessage || !file) {
      onSettledCallback({
        url: '',
        errorMessage,
      })
      return
    }

    if (isLoading) return
    // 文件已经上传
    if (file.url && uploadedVideoRef.current?.fileLocalObjectUrl === file?.url) return
    handleUpload()
  }, [file])

  const handleUpload = () => {
    if (!file?.originFile || !file) return
    if (!folderName || !usercaseName) {
      console.error('folderName and usercaseName defined for auto upload mode')
      return
    }
    setIsLoading(true)
    awsS3UploadFile(file.originFile, folderName, usercaseName)
      .then(res => {
        uploadedVideoRef.current = {
          fileLocalObjectUrl: file.url,
        }
        onSettledCallback({
          errorMessage: '',
          url: res.url,
        })
      })
      .catch(e => {
        uploadedVideoRef.current = {
          fileLocalObjectUrl: '',
        }
        onSettledCallback({
          url: '',
          errorMessage: e.message,
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className={classNames(styles.scope)}>
      <Upload
        accept="video/*"
        fileList={file ? [file] : []}
        autoUpload={false}
        showUploadList={false}
        onChange={(_, currentFile) => {
          const { isValid, errorMessage } = isValidUploadVideo(currentFile)

          if (currentFile.originFile && isValid) {
            const newFile = {
              ...currentFile,
              url: URL.createObjectURL(currentFile.originFile),
            }
            onSettledCallback({
              url: newFile,
              errorMessage,
            })

            setFile(newFile)
          } else {
            onSettledCallback({
              url: '',
              errorMessage,
            })
          }
        }}
      >
        {file && file.url ? videoPlaceholder && videoPlaceholder(file) : noDataPlaceholder || null}
      </Upload>

      {showUploadButton && (
        <Button
          onClick={() => {
            handleUpload()
          }}
        >
          upload video
        </Button>
      )}
    </div>
  )
}
