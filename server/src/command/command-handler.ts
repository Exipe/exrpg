
import { Player } from "../player/player"

export type CommandCallback = (player: Player, args: string[]) => void

export class CommandHandler {

    private callbacks = new Map<string, CommandCallback>()

    public on(command: string, callback: CommandCallback) {
        this.callbacks.set(command, callback)
    }

    public execute(player: Player, line: string) {
        //find arguments separated by space, or surrounded by 2 quotes
        const regex = /[^\s"]+|"([^"]+)"/g

        let args = [] as string[]

        let match: RegExpExecArray;
        while((match = regex.exec(line)) != null) {
            args.push(match[1] != null ? match[1] : match[0])
        }
        
        const command = args.shift()
        const callback = this.callbacks.get(command)

        if(callback == null) {
            return
        }

        callback(player, args)
    }

}
