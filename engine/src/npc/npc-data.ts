
import { Sprite } from "../texture/sprite"
import { Engine } from ".."
import { loadTexture } from "../texture/texture"

export type NpcOption = [string, string]

export class NpcData {

    public readonly id: string
    public readonly name: string
    public readonly spritePath: string

    private sprite: Sprite = null

    public readonly options: NpcOption[]

    constructor(id: string, name: string, spritePath: string, options: NpcOption[]) {
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