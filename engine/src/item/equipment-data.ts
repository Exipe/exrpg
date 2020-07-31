
import { Sprite } from "../texture/sprite";
import { Engine, PLAYER_SIZE } from "..";
import { loadTexture } from "../texture/texture";
import { MultiTexture } from "../texture/multi-texture";

export class EquipmentSprite {

    private sprites = [] as Sprite[]
    private readonly spritePath: string

    constructor(spritePath: string) {
        this.spritePath = spritePath
    }

    public async get(engine: Engine, idx: number) {
        if(this.sprites.length == 0) {
            const texture = await loadTexture(engine.gl, this.spritePath)
            const multiTexture = new MultiTexture(texture, PLAYER_SIZE[0], PLAYER_SIZE[1])

            for(let i = 0; i < multiTexture.width; i++) {
                this.sprites.push(new Sprite(engine, multiTexture.get(i, 0)))
            }
        }

        return this.sprites[idx]
    }

}

export class EquipmentData {

    private readonly sprite: EquipmentSprite
    private readonly idx: number

    public readonly slot: string

    constructor(sprite: EquipmentSprite, idx: number, slot: string) {
        this.sprite = sprite
        this.idx = idx
        this.slot = slot
    }

    public getSprite(engine: Engine) {
        return this.sprite.get(engine, this.idx)
    }

}
