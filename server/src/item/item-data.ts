
import fetch from "node-fetch"
import { RES_PATH } from ".."
import { AttribId, isAttribId } from "../player/attrib"
import { EquipSlot, isEquipSlot } from "./equipment"

export class ItemData {

    public readonly id: string
    public readonly name: string
    public readonly equipSlot: EquipSlot
    public readonly equipBonuses: [AttribId, number][]
    public readonly stack: number
    public readonly value: number

    public readonly actions: string[]

    constructor(id: string, name: string, equipSlot: EquipSlot, equipBonuses: [AttribId, number][], actions: string[], 
        stack: number, value: number) {
        this.id = id
        this.name = name
        this.equipSlot = equipSlot
        this.equipBonuses = equipBonuses
        this.actions = actions
        this.stack = stack
        this.value = value
    }

    public get equipable() {
        return this.equipSlot != null
    }

}

export async function loadItemData() {
    const itemDataMap = new Map<string, ItemData>()
    const data = await fetch(RES_PATH + "data/item.json")
    .then(res => res.json())

    data.forEach((item: any) => {
        if(itemDataMap.get(item.id) != null) {
            throw "IMPORTANT - duplicate item ID: " + item.id
        }

        let equipSlot = null as EquipSlot
        let equipBonuses = [] as [AttribId, number][]

        const equip = item.equip
        if(equip != null) {
            const slot = equip.slot

            if(isEquipSlot(slot)) {
                equipSlot = slot
            } else {
                throw `IMPORTANT - Invalid equipment slot [${slot}] on item: ${item.id}`
            }

            const bonuses = equip.bonuses
            if(bonuses != null) {
                for(let id in bonuses) {
                    if(isAttribId(id)) {
                        equipBonuses.push([id, bonuses[id]])
                    } else {
                        throw `IMPORTANT - Invalid bonus attribute [${id}] on item: ${item.id}`
                    }
                }
            }
        }

        let stack = item.stack ? item.stack : 1
        let value = item.value ? item.value : 0
        let actions = item.options ? item.options.map((action: string) => 
            action.toLowerCase().replace(" ", "_")) : []

        const itemData = new ItemData(item.id, item.name, equipSlot, equipBonuses, actions, 
            stack, value)
        itemDataMap.set(item.id, itemData)
    })

    return new ItemDataHandler(itemDataMap)
}

export class ItemDataHandler {

    private readonly itemDataMap: Map<string, ItemData>

    constructor(itemDataMap: Map<string, ItemData>) {
        this.itemDataMap = itemDataMap
    }

    public get(id: string) {
        if(id == "") {
            return null
        }

        const itemData = this.itemDataMap.get(id)
        return itemData ? itemData : null
    }

}
