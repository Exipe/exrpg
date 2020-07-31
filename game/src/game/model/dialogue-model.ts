
import { Game } from "../game"
import { Connection } from "../../connection/connection"
import { DialogueOptionPacket } from "../../connection/packet"

export class Dialogue {

    public readonly id: number
    public readonly name: string
    public readonly lines: string[]
    public readonly options: string[]

    constructor(id: number, name: string, lines: string[], options: string[]) {
        this.id = id
        this.name = name
        this.lines = lines
        this.options = options
    }

}

export function initDialogue(game: Game) {
    const connection = game.connection
    
    connection.on("DIALOGUE", data => {
        game.dialogue.openDialogue(new Dialogue(data.id, data.name, data.lines, data.options))
    })

    connection.on("CLOSE_DIALOGUE", _ => {
        game.dialogue.closeDialogue()
    })
}

export class DialogueModel {

    private readonly connection: Connection

    constructor(connection: Connection) {
        this.connection = connection
    }

    public onOpenDialogue: (dialogue: Dialogue) => void = null

    public onCloseDialogue: () => void = null

    public openDialogue(dialogue: Dialogue) {
        if(this.onOpenDialogue != null) {
            this.onOpenDialogue(dialogue)
        }
    }

    public closeDialogue() {
        if(this.onCloseDialogue != null) {
            this.onCloseDialogue()
        }
    }

    public clickOption(id: number, index: number) {
        this.connection.send(new DialogueOptionPacket(id, index))
    }

}
