
import { EquipSlot } from "../../item/equipment";
import { AttribId } from "../attrib";

export interface SaveItem {
    id: string,
    amount: number
}

export interface SaveEquip {
    slot: EquipSlot,
    id: string
}

export interface SaveAttrib {
    id: AttribId,
    base: number
}

export interface Progress {
    position: {
        x: number,
        y: number,
        map: string
    }

    inventory: SaveItem[]

    equipment: SaveEquip[]

    attributes: SaveAttrib[]
}