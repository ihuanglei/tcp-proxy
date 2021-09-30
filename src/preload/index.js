const { contextBridge, ipcRenderer } = require('electron')
const { MSG } = require('./message.js')

let callbacks = {}

contextBridge.exposeInMainWorld(
  '$TPSDK',
  {
    minimize () {
      ipcRenderer.send(MSG.minimize)
    },
    close () {
      ipcRenderer.send(MSG.close)
    },
    createProxy (data, callback) {
      if (callbacks[data.localPort]) {
        callback(500, '端口已经打开')
        return
      }
      callbacks[data.localPort] = callback
      ipcRenderer.send(MSG.createProxy, data)
    },
    closeProxy (data) {
      ipcRenderer.send(MSG.closeProxy, data)
    },
    toggleDevTools () {
      ipcRenderer.send(MSG.toggleDevTools)
    },
    save (key, data) {
      ipcRenderer.send(MSG.save, { key: key, data: data })
    },
    async load (key) {
      return await ipcRenderer.invoke(MSG.load, key)
    }

  }
)

ipcRenderer.on(MSG.tpData, (event, localPort, code, err) => {
  callbacks[localPort](code, err)
  if (code === 300) {
    callbacks[localPort] = undefined
  }
})
