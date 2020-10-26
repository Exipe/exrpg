import { Character } from "../character/character";
import { Npc } from "../npc/npc";
import { CombatHandler } from "./combat";

export class NpcCombatHandler extends CombatHandler {

    private readonly npc: Npc

    protected readonly accuracy: number

    protected readonly defence: number

    protected readonly heldItem: string

    constructor(npc: Npc, data = npc.data.combatData) {
        super(npc, data.health, data.attackSpeed, data.maxHit)
        this.npc = npc
        this.accuracy = data.accuracy
        this.defence = data.defence
        this.heldItem = data.weapon
    }

    protected retaliate(other: Character) {
        const self = this.npc

        if(self.target != null) {
            return
        }

        self.stop()
        self.attack(other)
    }

    protected die() {
        this.npc.remove()
        this.health = this.maxHealth

        setTimeout(() => {
            this.npc.spawn()
        }, this.npc.data.combatData.respawnTime * 1000)
    }

}