
import { Sprite, EquipmentData, Engine, MergeTexture } from "exrpg";
import { Equipment } from "../../ui/equipment";

type Equipment = [EquipmentData, Sprite]

function isEquipment(equipment: any): equipment is Equipment {
    return Array.isArray(equipment) 
        && (equipment[0] == null || equipment[0] instanceof EquipmentData)
        && (equipment[1] == null || equipment[1] instanceof Sprite)
}

export class PlayerSprite {

    private engine: Engine

    private baseSprite: Sprite

    private legs = [null, null] as Equipment
    private plate = [null, null] as Equipment
    private helm = [null, null] as Equipment
    private shield = [null, null] as Equipment

    private readonly mergeTexture: MergeTexture
    private readonly sprite: Sprite 

    constructor(engine: Engine, baseSprite: Sprite, legs: EquipmentData, plate: EquipmentData, helm: EquipmentData, shield: EquipmentData) {
        this.engine = engine
        this.baseSprite = baseSprite

        this.mergeTexture = new MergeTexture(engine, baseSprite.width, baseSprite.height)
        this.sprite = new Sprite(engine, this.mergeTexture.texture)

        this.set("legs", legs)
        this.set("plate", plate)
        this.set("helm", helm)
        this.set("shield", shield)

        this.redraw()
    }

    public get width() {
        return this.baseSprite.width
    }

    public get height() {
        return this.baseSprite.height
    }

    public set(slot: string, equipmentData: EquipmentData) {
        const equipment = this[slot]
        if(!isEquipment(equipment)) {
            throw `Invalid slot: ${slot}`
        }

        equipment[0] = equipmentData
        if(equipmentData == null) {
            equipment[1] = null
            this.redraw()
            return
        }

        equipmentData.getSprite(this.engine).then(sprite => {
            if(equipment[0] == equipmentData) { // check that it wasn't overriden while loading
                equipment[1] = sprite
                this.redraw()
            }
        })
    }

    private redraw() {
        this.mergeTexture.bind()

        let sprites = [this.baseSprite, this.legs[1], this.plate[1], this.helm[1], this.shield[1]]
        sprites.forEach(s => {
            if(s != null) {
                s.draw(0, 0)
            }
        })

        this.mergeTexture.unbind()
    }
    
    public draw(x: number, y: number) {
        this.sprite.draw(x, y)
    }

}