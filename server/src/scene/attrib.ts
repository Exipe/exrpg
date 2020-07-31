
import { Player } from "../player/player";

export abstract class Attrib {

    public abstract walked(p: Player): void

}

export class WarpAttrib extends Attrib {
    
    private readonly mapId: string
    private readonly x: number
    private readonly y: number

    constructor(mapId: string, x: number, y: number) {
        super()

        this.mapId = mapId
        this.x = x
        this.y = y
    }

    public walked(p: Player) {
        p.goTo(this.mapId, this.x, this.y)
    }

}
