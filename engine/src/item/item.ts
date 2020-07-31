
import { Engine, ItemData, Sprite, TILE_SIZE } from "..";

export class Item {

    public readonly data: ItemData
    public readonly x: number
    public readonly y: number

    private sprite: Sprite = null

    constructor(engine: Engine, itemData: ItemData, x: number, y: number) {
        this.data = itemData
        this.x = x
        this.y = y

        itemData.getSprite(engine)
        .then(sprite => this.sprite = sprite)
    }

    public inClickBox(x: number, y: number) {
        return Math.floor(x / TILE_SIZE) == this.x && Math.floor(y / TILE_SIZE) == this.y
    }

    public draw() {
        if(this.sprite == null) {
            return
        }

        this.sprite.draw(this.x * TILE_SIZE, this.y * TILE_SIZE)
    }

}