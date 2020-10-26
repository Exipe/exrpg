
import { Player, SPAWN_POINT } from "../player/player";
import { speedBonus } from "../util";
import { CombatHandler } from "./combat";

const HEALTH = 100
const MIN_DAMAGE = 10

function maxDamage(x: number) {
    if(x <= 0) {
        return MIN_DAMAGE
    }

    let result = MIN_DAMAGE
    if(x > 10) {
        result += 2.5 * (x - 10)
        x = 10
    }

    result += 4 * x

    return Math.floor(result)
}

export class PlayerCombatHandler extends CombatHandler {

    private readonly player: Player

    constructor(player: Player) {
        super(player, HEALTH)
        this.player = player
        player.attributes.onChange('speed_attack', value => this.attackSpeed = speedBonus(value))
        player.attributes.onChange('damage', value => this.maxDamage = maxDamage(value))
    }

    protected get accuracy(): number {
        return this.player.attributes.get("accuracy")
    }

    protected get defence(): number {
        return this.player.attributes.get("defence")
    }

    protected get heldItem(): string {
        return this.player.equipment.idOf("sword")
    }

    protected retaliate() {
        //todo: auto retaliate?
    }

    protected die() {
        this.player.stop()
        this.player.sendMessage("Goodness gracious! You die")
        this.health = this.maxHealth
        this.player.goTo(...SPAWN_POINT)
    }
    
}