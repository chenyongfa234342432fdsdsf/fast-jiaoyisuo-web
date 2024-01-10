import { Spin } from '@nbit/arco'
import { envIsServer } from '@/helper/env'
import React, { useEffect, useState } from 'react'

function AsyncSuspense({ children }) {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  if (envIsServer) {
    return <Spin />
  }

  return <React.Suspense fallback={<Spin />}>{children}</React.Suspense>
}
export default AsyncSuspense
