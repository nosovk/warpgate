import { api, type Info } from './api'

class ServerInfoState {
    value: Info | undefined = $state()
}

export const serverInfo = new ServerInfoState()

export async function reloadServerInfo(): Promise<void> {
    const info = await api.getInfo()
    serverInfo.value = info
}
