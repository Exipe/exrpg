
import { Connection } from "../../connection/connection"

import { ItemData } from "exrpg"
import { MoveItemPacket, UseItemPacket } from "../../connection/packet"
import { Game } from "../game"
import { Observable } from "./observable"

export type Item = [ItemData, number]

export function initInventory(game: Game) {
    const connection = game.connection
    const engine = game.engine

    connection.on("INVENTORY", (data: [string, number][]) => {
        const items: Item[] = data.map(item => (
            item != null ? [engine.itemHandler.get(item[0]), item[1]] : null
        ))
        game.inventory.observable.value = new Inventory(items)
    })
}

const INVENTORY_SIZE = 30

export class Inventory {
    
    public readonly items: Item[]

    public count(item: ItemData) {
        return this.items.reduce((sum, current) => (
            sum + (current != null && current[0] == item ? current[1] : 0)), 0)
    }

    constructor(items: Item[]) {
        this.items = items
    }

}

export class InventoryModel {

    private readonly connection: Connection

    public readonly observable = new Observable<Inventory>(new Inventory([]))

    constructor(connection: Connection) {
        this.connection = connection

        for(let i = 0; i < INVENTORY_SIZE; i++) {
            this.observable.value.items.push(null)
        }
    }

    public moveItem(fromSlot: number, toSlot: number) {
        this.connection.send(new MoveItemPacket(fromSlot, toSlot))
    }

    public useItem(action: string, id: string, slot: number) {
        this.connection.send(new UseItemPacket(action, id, slot))
    }

}