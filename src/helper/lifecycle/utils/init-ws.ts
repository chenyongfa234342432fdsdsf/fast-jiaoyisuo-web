import { baseUserStore } from '@/store/user'
import ws from '@/plugins/ws'
import futuresWs from '@/plugins/ws/futures'
import { wsUrl, wsFuturesUrl } from '../../env'

export async function initWS() {
  ws.setOptions({
    wsUrl,
    success() {
      if (baseUserStore.getState().isLogin) {
        ws.login()
      }
    },
    getToken: () => {
      return baseUserStore.getState().token?.accessToken as unknown as string
    },
  })
  ws.connect()
  futuresWs.setOptions({
    wsUrl: wsFuturesUrl,
    success() {
      if (baseUserStore.getState().isLogin) {
        futuresWs.login()
      }
    },
    getToken: () => {
      return baseUserStore.getState().token?.accessToken as unknown as string
    },
  })
  futuresWs.connect()
}

baseUserStore.subscribe(
  userState => userState.isLogin,
  () => {
    if (baseUserStore.getState().isLogin) {
      ws.login()
      futuresWs.login()
    } else {
      ws.logout()
      futuresWs.logout()
    }
  }
)
