import { useMount, useUnmount } from 'ahooks'

const useRefreshWindowVisible = handleVisibilityChange => {
  useMount(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })
  useUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
}

export { useRefreshWindowVisible }
