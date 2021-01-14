import { MessagePacket, UpdateLevelPacket } from "../connection/outgoing-packet"
import { experienceRequired, maxHealth } from "../formula"
import { playerHandler } from "../world"
import { Player } from "./player"

export class PlayerLevel {

    private readonly player: Player

    constructor(player: Player) {
        this.player = player
    }

    private _level: number
    private requiredExperience: number
    public experience = 0

    public get level() {
        return this._level
    }

    public set level(value: number) {
        this.requiredExperience = experienceRequired(value)
        this.player.combatHandler.maxHealth = maxHealth(value)
        this._level = value
    }

    public update() {
        this.player.send(new UpdateLevelPacket(this._level, this.experience, this.requiredExperience))
    }

    public addExperience(xp: number) {
        this.experience += xp

        while(this.experience >= this.requiredExperience) {
            this.experience -= this.requiredExperience
            this.level++

            this.player.sendMessage("Congratulations, you have gained a level!")

            if(this.level % 10 == 0) {
                playerHandler.broadcast(new MessagePacket(`${this.player.name} has advanced to level ${this.level}!`))
            }
        }

        this.update()
    }

}