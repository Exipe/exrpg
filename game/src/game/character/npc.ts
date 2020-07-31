
import { NpcEntity, Engine, NpcData } from "exrpg";
import { Game } from "../game";
import { Walking } from "./walking";
import { Goal } from "./path-finder";
import { NpcActionPacket } from "../../connection/packet";

export class Npc extends NpcEntity {
    
    public readonly id: number

    private walking: Walking = null

    constructor(engine: Engine, id: number, dataId: string, tileX: number, tileY: number) {
        super(engine, engine.npcHandler.get(dataId), tileX, tileY)
        this.id = id
    }

    public animate(dt: number) {
        if(this.walking == null) {
            return
        }

        if(this.walking.animate(dt)) {
            this.walking = null
        }
    }

    public walkTo(x: number, y: number, animationSpeed: number) {
        this.walking = new Walking(this, x, y, animationSpeed)
    }

    public place(x: number, y: number) {
        this.walking = null
        this.moveTile(x, y)
    }

}

export function initNpcs(game: Game): void {
    const connection = game.connection
    const engine = game.engine

    const npcAction = (npc: Npc, action: string) => {
        const goal: Goal = {
            x: npc.tileX,
            y: npc.tileY,
            width: 1,
            height: 1,
            distance: 1
        }

        game.walkToGoal(goal)

        if(action != null) {
            connection.send(new NpcActionPacket(npc.id, action))
        }
    }

    engine.inputHandler.onNpcContext = npc => {
        if(!(npc instanceof Npc)) {
            return
        }

        const data = npc.data
        data.options.forEach(option => {
            game.ctxMenu.add([option[0] + " " + data.name, () => {
                npcAction(npc, option[1])
            }])
        })
    }

    engine.inputHandler.onNpcClick = npc => {
        if(!(npc instanceof Npc)) {
            return
        }

        const action = npc.data.options.length > 0 ? npc.data.options[0][1] : null
        npcAction(npc, action)
    }

    connection.on("ADD_NPC", data => {
        data.forEach((n: [number, string, number, number]) => {
            const npc = new Npc(engine, n[0], n[1], n[2], n[3])
            game.addNpc(npc)
        })
    })

    connection.on("MOVE_NPC", data => {
        const npc = game.getNpc(data.id)
        
        if(data.animate) {
            npc.walkTo(data.x, data.y, data.animationSpeed)
        } else {
            npc.place(data.x, data.y)
        }
    })

    connection.on("REMOVE_NPC", (id: number) => {
        game.removeNpc(id)
    })
}
