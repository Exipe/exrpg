
import { Entity } from "../entity/entity";
import { NpcData } from "./npc-data";
import { Sprite, Engine } from "..";
import { InputHandler } from "../input-handler";

export class NpcEntity extends Entity {

    public readonly data: NpcData

    private sprite: Sprite = null

    constructor(engine: Engine, npcData: NpcData, tileX: number, tileY: number) {
        super(tileX, tileY)

        this.data = npcData

        npcData.getSprite(engine)
        .then(sprite => {
            this.sprite = sprite
            this.setDimensions(sprite.width, sprite.height)
        })
    }

    protected onClick(inputHandler: InputHandler) {
        if(inputHandler.onNpcClick != null) {
            inputHandler.onNpcClick(this)
            return true
        }

        return false
    }

    protected onContext(inputHandler: InputHandler) {
        if(inputHandler.onNpcContext != null) {
            inputHandler.onNpcContext(this)
        }
    }

    public draw() {
        if(this.sprite == null) {
            return
        }

        this.sprite.draw(this.drawX, this.drawY)
    }
    
}