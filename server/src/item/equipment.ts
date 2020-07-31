
import { ItemData } from "./item-data";
import { Player } from "../player/player";
import { UpdateEquipmentPacket } from "../connection/outgoing-packet";
import { itemDataHandler } from "../world";

export type EquipSlot = "helm" | "plate" | "legs" | "shield" | "sword"

export function isEquipSlot(slot: string): slot is EquipSlot {
    return [ "helm", "plate", "legs", "shield", "sword" ].includes(slot)
}

export class Equipment {

    private readonly player: Player

    private helm: ItemData
    private plate: ItemData
    private legs: ItemData
    private shield: ItemData
    private sword: ItemData

    constructor(player: Player) {
        this.player = player
    }

    public update() {
        const packet = new UpdateEquipmentPacket(
            this.helm != null ? this.helm.id : "",
            this.plate != null ? this.plate.id : "",
            this.legs != null ? this.legs.id : "",
            this.shield != null ? this.shield.id : "",
            this.sword != null ? this.sword.id : ""
        )

        this.player.send(packet)
    }

    public get(slot: EquipSlot) {
        return this[slot]
    }

    public idOf(slot: EquipSlot) {
        const item = this[slot]
        return item != null ? item.id : ""
    }

    public remove(slot: EquipSlot, update = true) {
        const old = this[slot]
        this[slot] = null

        if(update) {
            this.update()
        }

        return old
    }

    public setId(slot: EquipSlot, id: string, update = true) {
        const item = itemDataHandler.get(id)
        if(item == null) {
            return
        }

        this[slot] = item

        if(update) {
            this.update()
        }
    }

    public set(slot: EquipSlot, itemData: ItemData, update = true) {
        if(!itemData.equipable) {
            throw `Can't equip item: ${itemData.id}`
        }

        const unequipped = this[slot]
        this[slot] = itemData

        if(update) {
            this.update()
        }

        return unequipped
    }

}