
import { TILE_SIZE } from ".."
import { EntityList } from "./entity-list"
import { InputHandler } from "../input-handler"

export function feetCoords(tileX: number, tileY: number) {
    return [ tileX * TILE_SIZE, tileY * TILE_SIZE ]
}

export abstract class Entity {

    protected readonly tileSpan: number

    protected drawX = 0
    protected drawY = 0

    public tileX: number
    public tileY: number

    public _onMove: () => any = null

    //position of feet
    private _feetX: number
    private _feetY: number

    private _width: number
    private _height: number

    //neighbouring entities in list
    public ahead: Entity = null
    public behind: Entity = null

    public list: EntityList = null

    constructor(tileX: number, tileY: number, width = 0, height = 0, tileSpan = 1) {
        this.tileX = tileX
        this.tileY = tileY
        this.tileSpan = tileSpan

        const [feetX, feetY] = feetCoords(tileX, tileY)
        this._feetX = feetX
        this._feetY = feetY

        this._width = width
        this._height = height
        this.updateDrawCoords()
    }

    private inClickBox(x: number, y: number) {
        x -= this.drawX
        y -= this.drawY

        return x >= 0 && x < this._width && y >= 0 && y < this._height
    }

    protected onClick(_: InputHandler) {
        return false
    }

    public click(inputHandler: InputHandler, x: number, y: number) {
        if(!this.inClickBox(x, y)) {
            return false
        }

        return this.onClick(inputHandler)
    }

    protected onContext(_: InputHandler) {}

    public context(inputHandler: InputHandler, x: number, y: number) {
        if(!this.inClickBox(x, y)) {
            return
        }

        this.onContext(inputHandler)
    }

    public get feetX() {
        return this._feetX
    }

    public get feetY() {
        return this._feetY
    }

    public get width() {
        return this._width
    }

    public get height() {
        return this._height
    }

    public abstract draw(): any

    public moveTile(x: number, y: number) {
        this.tileX = x
        this.tileY = y

        const [feetX, feetY] = feetCoords(x, y)
        this.moveFeet(feetX, feetY)
    }

    protected updateDrawCoords() {
        this.drawX = this._feetX + (TILE_SIZE * this.tileSpan - this._width) / 2
        this.drawY = this._feetY + TILE_SIZE - this._height
    }

    protected setDimensions(width: number, height: number) {
        this._width = width
        this._height = height
        this.updateDrawCoords()
    }

    public setAhead(other: Entity) {
        this.ahead = other
        other.behind = this
    }

    public setBehind(other: Entity) {
        this.behind = other
        other.ahead = this
    }

    public isAhead(other: Entity) {
        return this._feetY >= other._feetY
    }

    public isBehind(other: Entity) {
        return this._feetY <= other._feetY
    }

    private moveDown() {
        if(this.ahead == null || this.ahead.isAhead(this)) {
            return
        }

        let ahead = this.ahead
        this.remove()
        ahead.placeAhead(this)
    }

    private moveUp() {
        if(this.behind == null || this.behind.isBehind(this)) {
            return
        }

        let behind = this.behind
        this.remove()
        behind.placeBehind(this)
    }

    public placeAhead(other: Entity) {
        if(this.ahead == null) {
            this.setAhead(other)
            this.list.furthestAhead = other
        } else if(this.ahead.isAhead(other)) {
            other.setAhead(this.ahead)
            this.setAhead(other)
        } else {
            this.ahead.placeAhead(other)
        }
    }

    public placeBehind(other: Entity) {
        if(this.behind == null) {
            this.setBehind(other)
            this.list.furthestBehind = other
        } else if(this.behind.isBehind(other)) {
            other.setBehind(this.behind)
            this.setBehind(other)
        } else {
            this.behind.placeBehind(other)
        }
    }

    public moveFeet(x: number, y: number) {
        let oldY = this._feetY

        this._feetX = x
        this._feetY = y

        this.updateDrawCoords()
        if(this._onMove != null) {
            this._onMove()
        }

        if(y > oldY) {
            this.moveDown()
        } else if(y < oldY) {
            this.moveUp()
        }
    }

    public remove() {
        if(this.behind == null) {
            this.list.furthestBehind = this.ahead
        } else {
            this.behind.ahead = this.ahead
        }

        if(this.ahead == null) {
            this.list.furthestAhead = this.behind
        } else {
            this.ahead.behind = this.behind
        }

        this.ahead = null
        this.behind = null
    }

}