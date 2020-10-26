
import { Player } from "../player/player";
import { MapId } from "./map-id";

export abstract class Attrib {

    public abstract walked(p: Player): void

}

export class WarpAttrib extends Attrib {
    
    private readonly mapId: MapId
    private readonly x: number
    private readonly y: number

    constructor(mapId: MapId, x: number, y: number) {
        super()

        this.mapId = mapId
        this.x = x
        this.y = y
    }

    public walked(p: Player) {
        p.goTo(this.mapId, this.x, this.y)
    }

}
