
import { Player } from "../player/player";
import { ItemData } from "./item-data";
import { itemDataHandler } from "../world";
import { UpdateInventoryPacket } from "../connection/outgoing-packet";
import { Item } from "./item";

export const INVENTORY_SIZE = 30

export class Inventory {

    private readonly player: Player

    private readonly items: Item[]

    constructor(player: Player) {
        this.player = player

        this.items = []
        for(let i = 0; i < INVENTORY_SIZE; i++) {
            this.items.push(null)
        }
    }

    public empty(update = true) {
        for(let i = 0; i < INVENTORY_SIZE; i++) {
            this.items[i] = null
        }

        if(update) {
            this.update()
        }
    }

    public hasItem(itemId: string) {
        return this.items.find(i => i != null && i.id == itemId) != null
    }

    public hasSpace() {
        for(let i = 0; i < INVENTORY_SIZE; i++) {
            if(this.items[i] == null) {
                return true
            }
        }

        return false
    }

    private update() {
        this.player.send(new UpdateInventoryPacket(this.itemIds))
    }

    public seItemIds(itemIds: [string, number][], update = true) {
        if(itemIds.length != INVENTORY_SIZE) {
            throw `The length of the id array must match the size of the inventory (${itemIds.length} / ${INVENTORY_SIZE})`
        }

        for(let i = 0; i < INVENTORY_SIZE; i++) {
            const itemId = itemIds[i]
            if(itemId == null) {
                this.items[i] = null
            } else {
                this.items[i] = new Item(itemId[0], itemId[1])
            }
        }

        if(update) {
            this.update()
        }
    }

    public get itemIds() {
        return this.items.map(item => (
            item != null ? ([item.id, item.amount] as [string, number]) : null
        ))
    }

    private checkRange(slot: number) {
        if(slot < 0 || slot >= INVENTORY_SIZE) {
            throw `Slot must be in range of 0-${INVENTORY_SIZE}` 
        }
    }

    public get(slot: number) {
        this.checkRange(slot)

        return this.items[slot]
    }

    public remove(slot: number, update = true) {
        this.checkRange(slot)
        
        const item = this.items[slot]
        this.items[slot] = null
        
        if(update) {
            this.update()
        }

        return item
    }

    public swap(fromSlot: number, toSlot: number, update = true) {
        this.checkRange(fromSlot)
        this.checkRange(toSlot)

        const temp = this.items[fromSlot]
        this.items[fromSlot] = this.items[toSlot]
        this.items[toSlot] = temp

        if(update) {
            this.update()
        }
    }

    public add(id: string, amount: number, update = true) {
        const itemData = itemDataHandler.get(id)
        if(itemData == null) {
            throw `Invalid item ID: ${id}`
        }

        this.addData(itemData, amount, update)
    }

    public addData(itemData: ItemData, amount: number, update = true) {
        if(amount <= 0) {
            throw "Can't add a negative number of items"
        }

        for(let i = 0; i < INVENTORY_SIZE; i++) {
            if(amount <= 0) {
                amount = 0
                continue
            }

            if(this.items[i] == null) {
                const item = new Item(itemData, Math.min(amount, itemData.stack))
                amount -= item.amount
                this.items[i] = item
                continue
            }

            if(this.items[i].id != itemData.id) {
                continue
            }

            const item = this.items[i]
            amount = item.add(amount)
        }

        if(update) {
            this.update()
        }
        return amount
    }

}