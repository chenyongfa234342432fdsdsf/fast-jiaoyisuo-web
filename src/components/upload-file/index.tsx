import React, { memo } from 'react'
import { Upload } from '@nbit/arco'
import type { UploadProps } from '@nbit/arco/lib/Upload'
import { baseUrl } from '@/helper/env'

interface Props extends UploadProps {
  children: React.ReactNode
  filedir?: string
}

function UploadFile(props: Props) {
  const { children, action = `${baseUrl}v1/file/upload_file_by_base64` } = props

  return (
    <Upload {...props} action={action}>
      {children}
    </Upload>
  )
}

export default memo(UploadFile)
