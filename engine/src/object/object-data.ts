
import { Sprite } from "../texture/sprite"
import { Engine, Light } from ".."
import { loadTexture } from "../texture/texture"
import { ShadowData } from "../entity/entity-shadow"

export type ObjectOption = [string, string]

export class ObjectData {

    public readonly id: string
    public readonly name: string

    public readonly spritePath: string
    
    private sprite: Sprite = null

    public readonly options: ObjectOption[]

    public light = 0
    public width = 1

    public shadowData = null as ShadowData

    constructor(id: string, name: string, spritePath: string, options: ObjectOption[]) {
        this.id = id
        this.name = name
        this.spritePath = spritePath
        this.options = options
    }

    public async getSprite(engine: Engine) {
        if(this.sprite == null) {
            const texture = await loadTexture(engine.gl, this.spritePath)
            this.sprite = new Sprite(engine, texture)
        }

        return this.sprite
    }

}