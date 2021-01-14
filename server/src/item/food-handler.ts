
import { Player } from "../player/player";
import { currentTime, timeSince } from "../util";

export interface Food {
    delay: number
    heal: number
}

export class FoodHandler {

    private readonly player: Player
    private timestamp = 0

    constructor(player: Player) {
        this.player = player
    }

    eat(slot: number, food: Food) {
        if(timeSince(this.timestamp) < food.delay) {
            this.player.sendMessage("If you try to eat any faster you might choke")
            return
        }

        this.timestamp = currentTime()
        this.player.inventory.remove(slot)

        this.player.playerCombat.heal(food.heal)
    }

}