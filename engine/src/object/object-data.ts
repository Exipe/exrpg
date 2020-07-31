
import { Sprite } from "../texture/sprite"
import { Engine } from ".."
import { loadTexture } from "../texture/texture"

export type ObjectOption = [string, string]

export class ObjectData {

    public readonly id: string
    public readonly name: string

    public readonly spritePath: string

    public readonly width: number

    private sprite: Sprite = null

    public readonly options: ObjectOption[]

    constructor(id: string, name: string, spritePath: string, width: number, options: ObjectOption[]) {
        this.id = id
        this.name = name
        this.spritePath = spritePath
        this.width = width
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