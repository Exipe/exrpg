import { Camera } from "exrpg/dist/camera"
import { PlayerRank } from "../character/player"

export class OverlayModel {

    public readonly id: number
    
    private _x: number
    private _y: number

    private readonly camera: Camera

    constructor(id: number, camera: Camera, x: number, y: number) {
        this.id = id
        this.camera = camera
        this._x = x
        this._y = y
    }

    public get x() {
        return Math.floor(this._x * this.camera.scale) - this.camera.realX
    }

    public get y() {
        return Math.floor(this._y * this.camera.scale) - this.camera.realY
    }

    public onMove = null as (x: number, y: number) => void

    public update() {
        if(this.onMove != null) {
            this.onMove(this.x, this.y)
        }
    }

    public move(x: number, y: number) {
        this._x = x
        this._y = y

        this.update()
    }

}

export class HealthBarModel extends OverlayModel {

    private _ratio: number

    constructor(id: number, camera: Camera, x: number, y: number, ratio: number) {
        super(id, camera, x, y)
        this._ratio = ratio
    }

    public onRatioUpdate = null as (ratio: number) => void

    public get ratio() {
        return this._ratio
    }

    public set ratio(value: number) {
        this._ratio = value

        if(this.onRatioUpdate != null) {
            this.onRatioUpdate(value)
        }
    }

}

export type HitSplatStyle = "hit" | "miss" | "heal"

export class HitSplatModel extends OverlayModel {
    public readonly hit: number
    public readonly style: HitSplatStyle

    constructor(id: number, camera: Camera, hit: number, style: HitSplatStyle, x: number, y: number) {
        super(id, camera, x, y)
        this.hit = hit
        this.style = style
    }
}

export type NameTagStyle = "npc" | PlayerRank

export class NameTagModel extends OverlayModel {
    public readonly name: string
    public readonly style: NameTagStyle

    constructor(id: number, camera: Camera, name: string, style: NameTagStyle, x: number, y: number) {
        super(id, camera, x, y)
        this.name = name
        this.style = style
    }
}

export class OverlayAreaModel {

    private idCount = 0
    private _overlayModels = [] as OverlayModel[]

    public onOverlayUpdate = null as (overlayModels: OverlayModel[]) => void

    private readonly camera: Camera

    constructor(camera: Camera) {
        camera.onUpdate = () => {
            this._overlayModels.forEach(o => o.update())
        }
        this.camera = camera
    }

    public addHealthBar(ratio: number, x: number, y: number) {
        const healthBarModel = new HealthBarModel(this.idCount++, this.camera, x, y, ratio)
        this.addOverlay(healthBarModel)
        return healthBarModel
    }

    public addHitSplat(hit: number, style: HitSplatStyle, x: number, y: number, duration: number) {
        const hitSplatModel = new HitSplatModel(this.idCount++, this.camera, hit, style, x, y)
        this.addOverlay(hitSplatModel, duration)
        return hitSplatModel
    }

    public addNameTag(name: string, style: NameTagStyle, x: number, y: number) {
        const nameTagModel = new NameTagModel(this.idCount++, this.camera, name, style, x, y)
        this.addOverlay(nameTagModel)
        return nameTagModel
    }

    public addOverlay(overlay: OverlayModel, duration: number = undefined) {
        this._overlayModels = this._overlayModels.concat(overlay)
        if(this.onOverlayUpdate != null) {
            this.onOverlayUpdate(this._overlayModels)
        }

        if(duration != undefined) {
            setTimeout(() => this.removeOverlay(overlay), duration)
        }
    }

    public removeOverlay(overlay: OverlayModel) {
        this._overlayModels = this._overlayModels.filter(other => other != overlay)

        if(this.onOverlayUpdate != null) {
            this.onOverlayUpdate(this._overlayModels)
        }
    }

    public get overlayModels() {
        return this._overlayModels
    }

}
