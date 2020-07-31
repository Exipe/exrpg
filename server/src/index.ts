
import { ConnectionHandler } from "./connection/connection-handler"
import { bindIncomingPackets } from "./connection/incoming-packet"
import { initWorld } from "./world"

import fs from "fs"
import {createServer, Server} from "https"
import WebSocket from "ws"

export let RES_PATH: string

async function start() {
    const config = JSON.parse(
        fs.readFileSync("exconfig.json").toString())

    RES_PATH = config.resPath
    const PORT = config.port

    let options = {
        port: PORT
    } as WebSocket.ServerOptions

    let https = null as Server

    if(config.wss != null) {
        https = createServer({
            cert: fs.readFileSync(config.wss.cert),
            key: fs.readFileSync(config.wss.key)
        })

        options = { server: https }
    }

    console.log("- Starting ExRPG server -")

    await initWorld()

    const connectionHandler = new ConnectionHandler(options)
    bindIncomingPackets(connectionHandler)

    if(https != null) {
        https.listen(PORT)
    }

    console.log(`Accepting connections on port: ${PORT}`)
}

start().catch(reason => {
    console.log("Error starting server: ", reason)
})
