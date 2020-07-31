
import { ItemData } from "./item-data";
import { Scene } from "../scene/scene";

export class GroundItem {

    private readonly scene: Scene

    public readonly itemData: ItemData
    private timeout: NodeJS.Timeout = null

    public respawnTimer: number = -1

    public readonly id: number
    public readonly x: number
    public readonly y: number

    public readonly amount: number

    constructor(scene: Scene, itemData: ItemData, id: number, x: number, y: number, amount: number) {
        this.scene = scene
        this.itemData = itemData
        this.id = id
        this.x = x
        this.y = y
        this.amount = amount
    }

    public setLifeTime(ms: number) {
        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            this.remove()
        }, ms)
    }

    public remove() {
        clearTimeout(this.timeout)
        this.scene.removeItem(this.id)

        if(this.respawnTimer >= 0) {
            setTimeout(() => {
                this.scene.addItem(this.itemData, this.amount, this.x, this.y)
            }, this.respawnTimer)
        }
    }

}