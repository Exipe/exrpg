
import WebSocket from "ws"
import { Connection, ConnectionState } from "./connection"

type PacketCallback = (connection: Connection, data: any) => any
type PacketEntry = [ConnectionState, PacketCallback]


export class ConnectionHandler {

    private serverSocket: WebSocket.Server

    private readonly packets = new Map<String, PacketEntry>()

    constructor(options: WebSocket.ServerOptions) {
        this.serverSocket = new WebSocket.Server(options)
        this.serverSocket.on("connection", (ws) => {
            this.handleConnection(ws)
        })
    }

    public on(id: string, callback: PacketCallback, state = "playing" as ConnectionState) {
        this.packets.set(id, [state, callback])
    }

    private handleMessage(connection: Connection, e: WebSocket.Data) {
        let msg: any
        try {
            msg = JSON.parse(e.toString())
        } catch(ex) {
            console.log("Error parsing packet JSON: " + e.toString())
            return
        }

        if(msg.id === undefined || msg.data === undefined || !this.packets.has(msg.id)) {
            console.log("Invalid packet: ", msg.id, ", ", msg.data)
            return
        }

        const packet = this.packets.get(msg.id)
        if(packet[0] != connection.state) {
            console.log(`Connection's state (${connection.state}) does not match packet state: ${packet[0]}`)
            return
        }

        packet[1](connection, msg.data)
    }

    private handleConnection(ws: WebSocket) {
        const connection = new Connection(ws)
        ws.on("message", (data) => {
            this.handleMessage(connection, data)
        })
        ws.on("close", () => {
            if(connection.player != null) {
                connection.player.remove()
            }
        })
    }

}