
import { HealthPacket, MessagePacket } from "../connection/outgoing-packet";
import { maxHealth, speedBonus } from "../formula";
import { Player, SPAWN_POINT } from "../player/player";
import { playerHandler } from "../world";
import { CombatHandler } from "./combat";

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
        super(player, maxHealth(1), 1, maxDamage(1))
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

    protected die(killer: Player) {
        this.player.stop()

        if(killer != null) {
            const msg = `${this.player.name} was killed by ${killer.name}!`
            playerHandler.broadcast(new MessagePacket(msg))
        }

        this.player.sendMessage("Goodness gracious! You die")
        this.health = this.maxHealth
        this.player.goTo(...SPAWN_POINT)
    }

    public updateHealth() {
        this.player.send(new HealthPacket(this.health, this.maxHealth))
    }

    public setMaxHealth(maxHealth: number, update = true) {
        this.maxHealth = maxHealth

        if(update) {
            this.updateHealth()
        }
    }

    public setHealth(health: number, update = true) {
        this.health = health

        if(update) {
            this.updateHealth()
        }
    }

    public heal(value: number, update = true) {
        this.health += value

        if(update) {
            this.updateHealth()
        }
    }

    public damage(value: number) {
        super.damage(value)
        this.updateHealth()
    }
    
}