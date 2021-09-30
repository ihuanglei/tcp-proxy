import net from 'net'

let servers = {}

export function createProxy (localPort, remoteHost, remotePort, callback) {

    callback = callback || function () { }

    let server = net.createServer((from) => {
        console.log(`[INFO] 客户端${from.remoteAddress}:${from.remotePort}连接成功`)
        let timer, timeout = 5000
        let remote = net.createConnection({
            host: remoteHost,
            port: remotePort
        })
        remote.on('error', (err) => {
            console.log(`[INFO] 远程服务${remoteHost}:${remotePort}[${from.remoteAddress}:${from.remotePort}]连接失败:${err}`)
            callback(501, `远程服务连接失败：${err}`)
        })
        remote.on('connect', () => {
            clearTimeout(timer)

            console.log(`[INFO] 远程服务${remoteHost}:${remotePort}[${from.remoteAddress}:${from.remotePort}]连接成功`)
            callback(201, `远程服务连接成功`)

            servers[localPort].connections.push({ remote, from })

            from.pipe(remote)
            remote.pipe(from)
        })
        remote.on('close', () => {
            console.log(`[INFO] 远程服务${remoteHost}:${remotePort}[${from.remoteAddress}:${from.remotePort}]关闭成功`)
        })
        remote.on('data', (buff) => {
            callback(600, buff)
        })

        from.on('close', () => {
            console.log(`[INFO] 客户端${from.remoteAddress}:${from.remotePort}关闭成功`)
        })
        from.on('data', (buff) => {
            callback(600, buff)
        })

        timer = setTimeout(() => {
            console.log(`[INFO] 远程服务${remoteHost}:${remotePort}[${from.remoteAddress}:${from.remotePort}]连接超时`)
            callback(501, `远程服务${remoteHost}:${remotePort}连接超时`)
            remote.destroy()
            from.destroy()
        }, timeout)
    })

    server.on('error', (err) => {
        callback(500, `[INFO] 本地服务启动失败：${err}`)
    })

    server.on('data', (buff) => {
        console.log(buff)
    })

    server.on('close', () => {
        servers[localPort] = undefined
    })

    server.listen(localPort, () => {
        servers[localPort] = { server: server, connections: [] }
        console.log(`[INFO] 本地服务${localPort}连接成功`)
        callback(200, '本地服务启动成功')
    })

}

export function closeProxy (localPort, callback) {
    if (servers[localPort]) {
        let { server, connections } = servers[localPort]
        connections.forEach(e => {
            let { remote, from } = e
            remote && remote.destroy()
            from && from.destroy()
        })
        server && server.close()
    }
    callback(300, '本地服务关闭成功')
}
