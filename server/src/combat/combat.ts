
import { Character } from "../character/character";
import { HealthBarPacket, HitSplatPacket } from "../connection/outgoing-packet";

function highHitChance(accuracy: number, defence: number) {
    let remainder = Math.abs(accuracy - defence)
    let result = 0

    if(remainder > 20) {
        result += 0.0025 * (remainder - 20)
        remainder = 20
    }

    result += 0.01 * remainder

    result = Math.min(0.45, result)
    return 0.5 + (accuracy > defence ? 1 : -1) * result
}

function calculateDamage(maxDamage: number, accuracy: number, defence: number) {
    const halfDmg = maxDamage / 2

    let damage = Math.random() * halfDmg
    if(Math.random() < highHitChance(accuracy, defence)) {
        damage += halfDmg
    }
    return Math.ceil(damage)
}

const ATTACK_DELAY = 2000

export abstract class CombatHandler {

    private readonly character: Character

    public attackDelay: number

    public maxDamage: number

    public maxHealth: number

    public health: number

    constructor(character: Character, health = 0, attackSpeed = 1, maxDamage = 1) {
        this.character = character
        this.maxHealth = this.health = health
        this.attackSpeed = attackSpeed
        this.maxDamage = maxDamage
    }

    public set attackSpeed(value: number) {
        this.attackDelay = Math.trunc(ATTACK_DELAY / value)
    }

    protected abstract get accuracy(): number

    protected abstract get defence(): number

    protected abstract get heldItem(): string

    protected abstract retaliate(other: Character): void

    protected abstract die(): void;

    public attack(other: CombatHandler) {
        const self = this.character
        const target = other.character

        const distX = target.x - self.x
        const distY = target.y - self.y

        if((distX == 0 && distY == 0) || Math.abs(distX) > 1 || Math.abs(distY) > 1) {
            return
        }

        const damage = calculateDamage(this.maxDamage, this.accuracy, other.defence)

        const heldItem = this.heldItem
        if(heldItem != "") {
            self.swingItem(heldItem, distX, distY, this.attackDelay / 5)
        }

        other.retaliate(self)
        other.damage(damage)
    }

    public damage(value: number) {
        const self = this.character
        const damage = Math.min(this.health, value)

        self.map.broadcast(
            new HitSplatPacket(self.type, self.id, damage)
        )

        this.health -= damage
        self.map.broadcast(
            new HealthBarPacket(self.type, self.id, this.health / this.maxHealth)
        )

        if(this.health <= 0) {
            this.die()
        }
    }

}