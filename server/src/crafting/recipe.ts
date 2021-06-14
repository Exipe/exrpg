
import { OutgoingRecipe } from "../connection/outgoing-packet";
import { Inventory } from "../item/inventory";
import { ItemData } from "../item/item-data";
import { Player } from "../player/player";

export class Recipe {

    public readonly unlockable: boolean
    public readonly item: ItemData
    public readonly materials: [ItemData, number][]
    public readonly delay: number

    constructor(unlockable: boolean, item: ItemData, materials: [ItemData, number][], delay: number) {
        this.unlockable = unlockable
        this.item = item
        this.materials = materials
        this.delay = delay
    }

    private get unlocked() {
        return !this.unlockable
    }

    public craftable(player: Player) {
        const inventory = player.inventory
        return this.unlocked && this.materials.every(m => inventory.count(m[0].id) >= m[1])
    }

    public craft(player: Player) {
        if(!this.craftable(player)) {
            return false
        }

        const inventory = player.inventory

        this.materials.forEach(m => {
            inventory.removeData(m[0], m[1], false)
        })

        inventory.addData(this.item, 1)
        return true
    }

    public get outgoing(): OutgoingRecipe {
        return {
            item: this.item.id,
            unlocked: this.unlocked, // todo: check if player has unlocked item
            materials: this.materials.map(m => [m[0].id, m[1]])
        }
    }

}