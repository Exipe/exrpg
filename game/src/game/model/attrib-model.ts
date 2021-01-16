
import { Game } from "../game"

export type AttribId = "accuracy" | "damage" | "defence" | "speed_attack" | "speed_move"

export const ATTRIBUTES = [ 
    ["accuracy", "Accuracy", "Increased chance of hitting high numbers."], 
    ["damage", "Damage", "Increased highest hit."], 
    ["defence", "Defence", "Decreased chance of taking high hits."], 
    ["speed_attack", "Attack speed", "Increased speed of your attacks."], 
    ["speed_move", "Movement", "Increased movement speed."] 
] as [AttribId, string, string][]

export interface Attribute {
    value: number,
    armor: number
    total: number
}

export class Attributes {

    private readonly attribs = new Map<AttribId, Attribute>()

    private _walkSpeed = 1

    public get walkSpeed() {
        return this._walkSpeed
    }

    public points = 0

    constructor() {
        ATTRIBUTES.forEach(attrib => {
            this.attribs.set(attrib[0], {
                total: 0,
                value: 0,
                armor: 0
            })
        })
    }

    public set(id: AttribId, value: Attribute) {
        this.attribs.set(id, value)

        if(id == "speed_move") {
            this._walkSpeed = walkSpeed(value.total)
        }
    }

    public get(id: AttribId) {
        return this.attribs.get(id)
    }

}

export function initAttribs(game: Game) {
    const connection = game.connection

    connection.on("ATTRIB", (data: any) => {
        const attribs = new Attributes()
        attribs.points = data.points

        const values = data.attribs as [AttribId, number, number][]
        values.forEach(value => {
            attribs.set(value[0], {
                total: value[1] + value[2],
                value: value[1],
                armor: value[2]
            })
        })

        game.attributes.attributes = attribs
    })
}

function walkSpeed(x: number) {
    return 1 + (x >= 0 ? 1 : -1) * Math.log10(Math.abs(x) / 25 + 1)
}

export class AttributeModel {

    public onAttributeUpdate: (attributes: Attributes) => void = null

    private _attributes = new Attributes()

    public set attributes(attributes: Attributes) {
        this._attributes = attributes

        if(this.onAttributeUpdate != null) {
            this.onAttributeUpdate(attributes)
        }
    }

    public get attributes() {
        return this._attributes
    }

}