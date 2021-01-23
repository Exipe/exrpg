
import { Sprite } from "../texture/sprite"
import { Engine } from ".."
import { loadTexture } from "../texture/texture"
import { PlayerSprite } from "../texture/player-sprite"
import { ShadowData } from "../entity/entity-shadow"

export type NpcOption = [string, string]

export class NpcData {

    public readonly id: string
    public readonly name: string
    public readonly spritePath: string

    private sprite: Sprite = null

    public readonly options: NpcOption[]

    public equip = [] as string[]

    public shadowData = null as ShadowData

    constructor(id: string, name: string, spritePath: string, options: NpcOption[]) {
        this.id = id
        this.name = name
        this.spritePath = spritePath
        this.options = options
    }

    private async getPlayerSprite(engine: Engine, baseSprite: Sprite) {
        const itemHandler = engine.itemHandler
        const equipData = this.equip.map(id => itemHandler.get(id).equipData)

        const playerSprite = new PlayerSprite(engine, baseSprite, equipData)
        await playerSprite.setAppearanceValues(equipData)
        return playerSprite.sprite
    }

    public async getSprite(engine: Engine) {
        if(this.sprite != null) {
            return this.sprite
        }

        const texture = await loadTexture(engine.gl, this.spritePath)
        const baseSprite = new Sprite(engine, texture)

        if(this.equip.length == 0) {
            this.sprite = baseSprite;
            return baseSprite;
        }

        this.sprite = await this.getPlayerSprite(engine, baseSprite)
        return this.sprite
    }

}