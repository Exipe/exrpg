
import { Sprite, TILE_SIZE, rotation, translation, identity, ITEM_SIZE } from "exrpg";
import { Game } from "./game";
import { connection } from "../connection/connection";

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
    private readonly drawX: number
    private readonly drawY: number

    constructor(spritePromise: Promise<Sprite>, x: number, y: number, offX: number, offY: number, duration: number) {
        this.duration = duration

        this.speed = (SWING_DEGREES * 2) / duration

        if(offX == 0 && offY == -1) {
            this.initialRotation = 0
        } else if(offX == 1 && offY == 0) {
            this.initialRotation = 90
        } else if(offX == 0 && offY == 1) {
            this.initialRotation = 180
        } else if(offX == -1 && offY == 0) {
            this.initialRotation = 270
        }

        this.offsetX = offX * TILE_SIZE
        this.offsetY = offY * TILE_SIZE
        this.drawX = x * TILE_SIZE + CENTER_OFFSET
        this.drawY = y * TILE_SIZE + CENTER_OFFSET

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
        .translate(this.drawX, this.drawY)
        
        this.sprite.drawMatrix(matrix)
    }

}

export function initSwingItems(game: Game) {
    const engine = game.engine

    connection.on("SWING_ITEM", data => {
        const spritePromise = engine.itemHandler.get(data.itemId).getSprite(engine)
        const swingItem = new SwingItem(spritePromise, 
            data.x, data.y, data.offX, data.offY, data.duration)
        game.addSwingItem(swingItem)
    })
}
