import { Camera } from "exrpg/dist/camera"

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

export type TextStyle = "playerName" | "npcName" | "hitSplat"

export class TextModel extends OverlayModel {

    public readonly text: string
    public readonly textStyle: TextStyle

    constructor(id: number, camera: Camera, text: string, textStyle: TextStyle, x: number, y: number) {
        super(id, camera, x, y)
        this.text = text
        this.textStyle = textStyle
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

    public addText(text: string, textStyle: TextStyle, x: number, y: number, duration: number = undefined) {
        const textModel = new TextModel(this.idCount++, this.camera, text, textStyle, x, y)
        this.addOverlay(textModel, duration)
        return textModel
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
