import * as path from 'path'
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import Store from 'electron-store'
import { MSG } from '../message'
import { createProxy, closeProxy } from './forwarder'

const isDevelopment = process.env.NODE_ENV !== 'production'

let win = undefined

const store = new Store()

function createWindow () {
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        center: true,
        thickFrame: true,
        frame: false,
        title: 'TCP Proxy',
        webPreferences: {
            preload: path.join(app.getAppPath(), './preload/index.js'),
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: false,
            nativeWindowOpen: true,
        },
    })

    if (isDevelopment) {
        win.loadURL('http://localhost:8882')
    } else {
        win.loadFile('index.html')
    }
}

function initBrowserWindow () {
    app.whenReady().then(() => {
        createWindow()
    })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
}

function initMessage () {
    ipcMain.on(MSG.close, (event, arg) => {
        win && win.close()
        console.log('close')
    })

    ipcMain.on(MSG.minimize, (event, arg) => {
        win && win.minimize()
        console.log('minimize')
    })

    ipcMain.on(MSG.createProxy, (event, arg) => {
        createProxy(arg.localPort, arg.remoteHost, arg.remotePort, (code, err) => {
            event.sender.send(MSG.tpData, arg.localPort, code, err)
        })
    })

    ipcMain.on(MSG.closeProxy, (event, arg) => {
        closeProxy(arg, (code, err) => {
            event.sender.send(MSG.tpData, arg, code, err)
        })
    })

    ipcMain.handle(MSG.load, (event, arg) => {
        let data = store.get(arg)
        return data
    })

    ipcMain.on(MSG.save, (event, arg) => {
        let key = arg.key
        let data = arg.data
        store.set(key, data)
    })

    ipcMain.on(MSG.toggleDevTools, (event, arg) => {
        win.toggleDevTools()
    })

}

function initShortcut () {
    // globalShortcut.register('F12', () => {
    //     win.toggleDevTools()
    // })
}

export function main () {
    initBrowserWindow()
    initMessage()
    initShortcut()
}