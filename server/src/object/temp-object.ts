
import { Scene } from "../scene/scene";
import { ObjectData } from "./object-data";

export class TempObject {

    private readonly scene: Scene

    public readonly objData: ObjectData
    public replacedObjData: ObjectData

    public readonly x: number
    public readonly y: number

    public timeout: NodeJS.Timeout = null

    constructor(scene: Scene, obj: ObjectData, x: number, y: number) {
        this.scene = scene
        this.objData = obj
        this.x = x
        this.y = y
    }

    public setLifeTime(ms: number) {
        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            this.remove()
        }, ms)
    }

    public remove() {
        clearTimeout(this.timeout)
        this.scene.removeTempObj(this)
    }

}