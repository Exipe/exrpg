
import { Connection } from "../../connection/connection";
import { SayPacket, CommandPacket } from "../../connection/packet";
import { Game } from "../game";

export function initChat(game: Game) {
    const connection = game.connection

    connection.on("MESSAGE", (message: string) => {
        game.chat.addMessage(message)
    })
}

const COMMAND_PREFIX = "/"

export class ChatModel {

    private readonly connection: Connection

    private _messages: string[] = []

    constructor(connection: Connection) {
        this.connection = connection
    }

    public onMessageUpdate: (messages: string[]) => void = null

    public get messages() {
        return this._messages
    }

    public addMessage(message: string) {
        this._messages = [ message ].concat(this._messages)

        if(this.onMessageUpdate != null) {
            this.onMessageUpdate(this._messages)
        }
    }

    public sendMessage(message: string) {
        let packet = message.startsWith(COMMAND_PREFIX) ?
            new CommandPacket(message.substr(1)) :
            new SayPacket(message)

        this.connection.send(packet)
    }

}