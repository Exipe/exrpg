import { Entity } from "exrpg";
import { Game } from "../game";
import { HealthBarComponent } from "./component/health-bar";
import { NameTagComponent } from "./component/name-tag";
import { Walking } from "./walking";

export abstract class Character extends Entity {

    private game: Game

    private walking: Walking = null

    public nameTagComponent: NameTagComponent
    public healthBarComponent: HealthBarComponent

    constructor(game: Game, tileX: number, tileY: number, width = 0, height = 0) {
        super(tileX, tileY, width, height)
        this.game = game
        this.nameTagComponent = new NameTagComponent(this, game.overlayArea)
        this.healthBarComponent = new HealthBarComponent(this, game.overlayArea)

        this.componentHandler.add(this.nameTagComponent)
        this.componentHandler.add(this.healthBarComponent)
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

}