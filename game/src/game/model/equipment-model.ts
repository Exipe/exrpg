
import { Connection } from "../../connection/connection";
import { ItemData } from "exrpg";
import { Game } from "../game";
import { SpendPointsPacket, UnequipItemPacket } from "../../connection/packet";
import { AttribId } from "./attrib-model";

export function initEquipment(game: Game) {
    const connection = game.connection
    const engine = game.engine

    connection.on("EQUIPMENT", equipment => {
        const equippedItems = new Map<string, ItemData>()
        equipment.forEach((equip: [string, string]) => {
            const id = equip[1]
            const item = id == "" ? null : engine.itemHandler.get(id)
            equippedItems.set(equip[0], item)
        });

        game.equipment.setEquippedItems(equippedItems)
    })
}

export class EquipmentModel {

    private readonly connection: Connection

    public onEquipmentUpdate: (equippedItems: Map<string, ItemData>) => void = null

    private _equippedItems = new Map<string, ItemData>()

    constructor(connection: Connection) {
        this.connection = connection
    }

    public spendPoints(points: [AttribId, number][]) {
        this.connection.send(new SpendPointsPacket(points))
    }

    public setEquippedItems(equippedItems: Map<string, ItemData>) {
        this._equippedItems = equippedItems

        if(this.onEquipmentUpdate != null) {
            this.onEquipmentUpdate(equippedItems)
        }
    }

    public get equippedItems() {
        return this._equippedItems
    }

    public unequipItem(id: string, slot: string) {
        this.connection.send(new UnequipItemPacket(id, slot))
    }

}