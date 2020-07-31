
import { Sprite } from "../texture/sprite";
import { Engine } from "..";
import { ObjectData } from "./object-data";
import { Entity } from "../entity/entity";
import { InputHandler } from "../input-handler";

export class ObjectEntity extends Entity {

    public readonly data: ObjectData

    private sprite: Sprite = null

    constructor(engine: Engine, objectData: ObjectData, tileX: number, tileY: number) {
        super(tileX, tileY, 0, 0, objectData.width)

        this.data = objectData

        objectData.getSprite(engine)
        .then(sprite => {
            this.sprite = sprite
            this.setDimensions(sprite.width, sprite.height)
        })
    }

    protected onClick(inputHandler: InputHandler) {
        if(inputHandler.onObjectClick != null) {
            inputHandler.onObjectClick(this)
            return true
        }

        return false
    }

    protected onContext(inputHandler: InputHandler) {
        if(inputHandler.onObjectContext != null) {
            inputHandler.onObjectContext(this)
        }
    }

    public draw() {
        if(this.sprite == null) {
            return
        }

        this.sprite.draw(this.drawX, this.drawY)
    }

}