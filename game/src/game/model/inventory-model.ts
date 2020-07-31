
import { Connection } from "../../connection/connection"

import { ItemData } from "exrpg"
import { MoveItemPacket, UseItemPacket } from "../../connection/packet"
import { Game } from "../game"

export type Item = [ItemData, number]

export function initInventory(game: Game) {
    const connection = game.connection
    const engine = game.engine

    connection.on("INVENTORY", (items: [string, number][]) => {
        game.inventory.items = items.map(item => 
            item != null ? [engine.itemHandler.get(item[0]), item[1]] : null)
    })
}

const INVENTORY_SIZE = 30

export class InventoryModel {

    private readonly connection: Connection

    public onInventoryUpdate: (items: Item[]) => void = null
    private _items: Item[] = []

    constructor(connection: Connection) {
        this.connection = connection

        for(let i = 0; i < INVENTORY_SIZE; i++) {
            this._items.push(null)
        }
    }

    public get items() {
        return this._items
    }

    public set items(items: Item[]) {
        this._items = items
        if(this.onInventoryUpdate != null) {
            this.onInventoryUpdate(items)
        }
    }

    public moveItem(fromSlot: number, toSlot: number) {
        this.connection.send(new MoveItemPacket(fromSlot, toSlot))
    }

    public useItem(action: string, id: string, slot: number) {
        this.connection.send(new UseItemPacket(action, id, slot))
    }

}