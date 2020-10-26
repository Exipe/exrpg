
import { ShaderHandler } from "./shader/shader-handler"
import { Entity } from "./entity/entity"

export class Camera {

    private shaderHandler: ShaderHandler

    private _x: number = 0
    private _y: number = 0
    private _scale: number = 1

    private followEntity: Entity = null

    private _width: number
    private _height: number

    public onUpdate = (_x: number, _y: number, _scale: number) => {}

    constructor(shaderHandler: ShaderHandler) {
        this.shaderHandler = shaderHandler
    }

    public get realX() {
        return this._x
    }

    public get realY() {
        return this._y
    }

    public get realWidth() {
        return this._width
    }

    public get realHeight() {
        return this._height
    }

    public follow(entity: Entity) {
        if(this.followEntity != null) {
            this.followEntity._onMove = null
        }

        this.followEntity = entity
        entity._onMove = () => {
            this.centerAroundEntity()
        }

        this.centerAroundEntity()
    }

    private centerAroundEntity() {
        const entityX = Math.floor((this.followEntity.feetX + this.followEntity.width / 2) * this._scale)
        const entityY = Math.floor((this.followEntity.feetY - this.followEntity.height / 2) * this._scale)
        this._move(entityX - this._width / 2, entityY - this._height / 2)
    }

    translateClick(mouseX: number, mouseY: number) {
        return [
            (this._x + mouseX) / this._scale,
            (this._y + mouseY) / this._scale
        ]
    }

    get scale() { return this._scale }
    get x() { return this._x / this._scale }
    get y() { return this._y / this._scale }

    get width() {
        return this._width / this._scale
    }

    get height() {
        return this._height / this._scale
    }

    set scale(scale: number) {
        if(this.followEntity != null) {
            this._scale = scale
            this.centerAroundEntity()
            return
        }

        const x = this.x
        const y = this.y
        this._scale = scale
        this.move(x, y)
    }

    setDimensions(width: number, height: number) {
        this._width = width
        this._height = height

        this.shaderHandler.setProjection(width, height)

        if(this.followEntity != null) {
            this.centerAroundEntity()
        }
    }

    private _move(x: number, y: number) {
        this._x = Math.floor(x)
        this._y = Math.floor(y)

        this.onUpdate(this._x, this._y, this._scale)
        this.shaderHandler.setView(this._x, this._y, this._scale)
    }

    move(x: number, y: number) {
        this._move(x * this._scale, y * this._scale)
    }

}