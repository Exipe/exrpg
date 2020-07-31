
import { Connection } from "../../connection/connection";
import { ItemData } from "exrpg";
import { Game } from "../game";
import { UnequipItemPacket } from "../../connection/packet";

export class EquippedItems {

    public readonly helm: ItemData
    public readonly plate: ItemData
    public readonly legs: ItemData
    public readonly shield: ItemData
    public readonly sword: ItemData

    constructor(helm: ItemData = null, plate: ItemData = null, legs: ItemData = null, shield: ItemData = null, sword: ItemData = null) {
        this.helm = helm
        this.plate = plate
        this.legs = legs
        this.shield = shield
        this.sword = sword
    }

}

export function initEquipment(game: Game) {
    const connection = game.connection
    const engine = game.engine

    function get(id: string) {
        return id == "" ? null : engine.itemHandler.get(id)
    }

    connection.on("EQUIPMENT", equipment => {
        const equippedItems = new EquippedItems(
            get(equipment.helm),
            get(equipment.plate),
            get(equipment.legs),
            get(equipment.shield),
            get(equipment.sword)
        )

        game.equipment.setEquippedItems(equippedItems)
    })
}

export class EquipmentModel {

    private readonly connection: Connection

    public onEquipmentUpdate: (equippedItems: EquippedItems) => void = null

    private _equippedItems: EquippedItems = new EquippedItems()

    constructor(connection: Connection) {
        this.connection = connection
    }

    public setEquippedItems(equippedItems: EquippedItems) {
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