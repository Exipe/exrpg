
import { Player } from "./player";
import { UpdateAttribPacket } from "../connection/outgoing-packet";
import { ItemData } from "../item/item-data";

export type AttribId = "accuracy" | "damage" | "defence" | "speed_attack" | "speed_move"

export const ATTRIBUTES = [ "accuracy", "damage", "defence", "speed_attack", "speed_move" ] as AttribId[]

export function isAttribId(id: string): id is AttribId {
    return ATTRIBUTES.includes(id as AttribId)
}

interface PlayerAttrib {
    base: number,
    armor: number
}

export type ChangeListener = (value: number) => void

export class PlayerAttribHandler {

    private readonly player: Player

    private attribs = new Map<AttribId, PlayerAttrib>()
    private listeners = new Map<AttribId, ChangeListener>()

    public constructor(player: Player) {
        this.player = player

        ATTRIBUTES.forEach(attribId => {
            this.attribs.set(attribId, {
                base: 0,
                armor: 0
            })
        })
    }

    public onChange(id: AttribId, listener: ChangeListener) {
        this.listeners.set(id, listener)
    }

    public get(id: AttribId): number {
        const attrib = this.attribs.get(id)
        return attrib.base + attrib.armor
    }

    public getBase(id: AttribId): number {
        return this.attribs.get(id).base
    }

    public update() {
        this.player.send(new UpdateAttribPacket(ATTRIBUTES.map(attribId => {
            const attrib = this.attribs.get(attribId)
            return [attribId, attrib.base, attrib.armor]
        })))
    }

    private didChange(id: AttribId) {
        const listener = this.listeners.get(id)
        if(listener == null) {
            return
        }

        const attrib = this.attribs.get(id)
        listener(attrib.base + attrib.armor)
    }

    public setArmor(itemData: ItemData, update = true) {
        itemData.equipBonuses.forEach(bonus => {
            this.attribs.get(bonus[0]).armor += bonus[1]
            this.didChange(bonus[0])
        })

        if(update) {
            this.update()
        }
    }

    public unsetArmor(itemData: ItemData, update = true) {
        itemData.equipBonuses.forEach(bonus => {
            this.attribs.get(bonus[0]).armor -= bonus[1]
            this.didChange(bonus[0])
        })

        if(update) {
            this.update()
        }
    }
    
    public setBase(id: AttribId, value: number, update = true) {
        this.attribs.get(id).base = value
        this.didChange(id)

        if(update) {
            this.update()
        }
    }

}