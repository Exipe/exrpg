
import { Sprite, TILE_SIZE, rotation, translation, identity, ITEM_SIZE, Entity } from "exrpg";
import { Game } from "./game";
import { connection } from "../connection/connection";
import { Character } from "./character/character";

const SWING_DEGREES = 90 / 2
const CENTER_OFFSET = ITEM_SIZE / 2

export class SwingItem {

    private sprite: Sprite = null
    private readonly duration: number

    private timer = 0
    private speed: number

    private readonly initialRotation: number
    private readonly offsetX: number
    private readonly offsetY: number

    private readonly entity: Entity

    constructor(spritePromise: Promise<Sprite>, entity: Entity, offX: number, offY: number, duration: number) {
        this.entity = entity

        this.duration = duration
        this.speed = (SWING_DEGREES * 2) / duration

        /*
        this can probably be cleaned up xd
        */

        if(offX == 0 && offY == -1) {
            this.initialRotation = 0
        } else if(offX == 1 && offY == -1) {
            this.initialRotation = 45
        } else if(offX == 1 && offY == 0) {
            this.initialRotation = 90
        } else if(offX == 1 && offY == 1) {
            this.initialRotation = 135
        } else if(offX == 0 && offY == 1) {
            this.initialRotation = 180
        } else if(offX == -1 && offY == 1) {
            this.initialRotation = 225
        } else if(offX == -1 && offY == 0) {
            this.initialRotation = 270
        } else if(offX == -1 && offY == -1) {
            this.initialRotation = 315
        }

        this.offsetX = offX * TILE_SIZE
        this.offsetY = offY * TILE_SIZE

        spritePromise.then(sprite => this.sprite = sprite)
    }

    public animate(dt: number) {
        this.timer += dt
        if(this.timer >= this.duration) {
            return false
        }

        return true
    }

    public draw() {
        if(this.sprite == null) {
            return
        }

        const swungDegrees = -SWING_DEGREES + this.timer * this.speed
        const matrix = translation(-CENTER_OFFSET, -CENTER_OFFSET)
        .rotate(this.initialRotation)
        .translate(this.offsetX, this.offsetY)
        .rotate(swungDegrees)
        .translate(this.entity.feetX + CENTER_OFFSET, this.entity.feetY + CENTER_OFFSET)
        
        this.sprite.drawMatrix(matrix)
    }

}

export function initSwingItems(game: Game) {
    const engine = game.engine

    connection.on("SWING_ITEM", data => {
        const spritePromise = engine.itemHandler.get(data.itemId).getSprite(engine)
        const character = data.character == "player" ? game.getPlayer(data.characterId) 
            : game.getNpc(data.characterId)
        const swingItem = new SwingItem(spritePromise, character,
            data.offX, data.offY, data.duration)
        game.addSwingItem(swingItem)
    })
}
