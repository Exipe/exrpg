import { Entity, Light } from "exrpg";
import { Game } from "../game";
import { HealthBarModel, TextModel, TextStyle } from "../model/overlay-model";
import { Walking } from "./walking";

const HIDE_HEALTHBAR_TIME = 5_000

export abstract class Character extends Entity {

    private game: Game

    private healthBar = null as HealthBarModel
    private healthBarTimeout = -1

    private nameTag = null as TextModel

    private walking: Walking = null

    private light = null as Light

    constructor(game: Game, tileX: number, tileY: number, width = 0, height = 0) {
        super(tileX, tileY, width, height)
        this.game = game
    }

    private removeHealthBar() {
        this.game.overlayArea.removeOverlay(this.healthBar)
        this.healthBar = null
        this.healthBarTimeout = -1
    }

    public set healthRatio(value: number) {
        if(this.healthBar != null) {
            this.healthBar.ratio = value
            clearTimeout(this.healthBarTimeout)
        } else {
            const overlayArea = this.game.overlayArea
            this.healthBar = overlayArea.addHealthBar(value, ...this.centerBelowCoords)
        }

        this.healthBarTimeout = window.setTimeout(() => {
            this.removeHealthBar()
        }, HIDE_HEALTHBAR_TIME)
    }

    public removeLight() {
        if(this.light == null) {
            return
        }

        const lightHandler = this.game.engine.lightHandler
        lightHandler.removeLight(this.light)
    }

    public setLight(radius: number) {
        const lightHandler = this.game.engine.lightHandler

        this.removeLight()

        const [x, y] = this.centerCoords
        this.light = {
            x: x,
            y: y,
            radius: radius
        }
        lightHandler.addLight(this.light)
    }

    protected setNameTag(style: TextStyle, name: string) {
        const overlayArea = this.game.overlayArea

        if(this.nameTag != null) {
            overlayArea.removeOverlay(this.nameTag)
        }

        this.nameTag = overlayArea.addText(name, style, ...this.centerAboveCoords)
    }

    public get centerCoords(): [number, number] {
        return [this.drawX + this.width / 2, this.drawY + this.height / 2]
    }

    public get centerAboveCoords(): [number, number] {
        return [this.drawX + this.width / 2, this.drawY]
    }

    public get centerBelowCoords(): [number, number] {
        return [this.drawX + this.width / 2, this.drawY + this.height]
    }

    protected updateDrawCoords() {
        super.updateDrawCoords()

        if(this.light != null) {
            const [x, y] = this.centerCoords
            this.light.x = x
            this.light.y = y
        }

        if(this.nameTag != null) {
            this.nameTag.move(...this.centerAboveCoords)
        }

        if(this.healthBar != null) {
            this.healthBar.move(...this.centerBelowCoords)
        }
    }

    public animate(dt: number) {
        if(this.walking != null && this.walking.animate(dt)) {
            this.walking = null
        }
    }

    public walkTo(x: number, y: number, animationSpeed: number) {
        this.tileX = x
        this.tileY = y
        this.walking = new Walking(this, x, y, animationSpeed)
    }

    public place(x: number, y: number) {
        this.walking = null
        this.moveTile(x, y)
    }

    public leave() {
        super.remove()
        this.removeLight()

        const overlayArea = this.game.overlayArea

        if(this.nameTag != null) {
            overlayArea.removeOverlay(this.nameTag)
        }

        if(this.healthBar != null) {
            clearTimeout(this.healthBarTimeout)
            this.removeHealthBar()
        }
    }

}