
import { Character } from "../character/character";
import { NpcDataHandler, NpcData } from "./npc-data";
import { MoveNpcPacket } from "../connection/outgoing-packet";
import { Scene } from "../scene/scene";
import { Task } from "../character/task";
import { randomChance, randomOffset } from "../util";

export class NpcHandler {

    private idCount = 0
    private npcMap = new Map<number, Npc>()

    private readonly npcDataHandler: NpcDataHandler

    constructor(npcDataHandler: NpcDataHandler) {
        this.npcDataHandler = npcDataHandler
    }

    public get(id: number) {
        return this.npcMap.get(id)
    }

    public create(dataId: string, map: Scene, x: number, y: number) {
        const data = this.npcDataHandler.get(dataId)
        if(data == null) {
            return null
        }

        const id = this.idCount++
        const npc = new Npc(id, data, map, x, y)
        this.npcMap.set(id, npc)
        return npc
    }

}

export class Npc extends Character {

    public readonly id: number
    public readonly data: NpcData

    private readonly centerX: number
    private readonly centerY: number

    constructor(id: number, data: NpcData, map: Scene, x: number, y: number) {
        super(0.85, map, x, y)
        this.centerX = x
        this.centerY = y
        this.id = id
        this.data = data
    }

    public walkable(x: number, y: number) {
        return !this.map.isNpcBlocked(x, y)
    }

    private idleTask: Task = {
        timer: 250,

        tick: () => {
            if(!randomChance(5)) {
                return
            }

            const rad = this.data.walkRadius
            const goalX = randomOffset(this.centerX, rad)
            const goalY = randomOffset(this.centerY, rad)

            this.walking.clear()
            this.walking.addSteps(goalX, goalY)
        }
    };

    public ready() {
        this.walking.idle = () => {
            this.taskHandler.setTask(this.idleTask)
        }
    }

    public enterMap() {
        this.map.addNpc(this)
    }

    protected leaveMap() {
        this.map.removeNpc(this)
    }
    
    protected onMove(animate: boolean) {
        this.map.broadcast(new MoveNpcPacket(this.id, this.x, this.y, animate ? this.walkDelay : -1))
    }

}