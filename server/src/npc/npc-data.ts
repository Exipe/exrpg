
import fetch from "node-fetch"
import { RES_PATH } from ".."

export class NpcData {

    public readonly id: string
    public readonly name: string
    public readonly walkRadius: number
    public readonly actions: string[]

    constructor(id: string, name: string, walkRadius: number, actions: string[]) {
        this.id = id
        this.name = name
        this.walkRadius = walkRadius
        this.actions = actions
    }

}

export async function loadNpcData() {
    const npcDataMap = new Map<string, NpcData>()
    const data = await fetch(RES_PATH + "data/npc.json")
    .then(res => res.json())

    data.forEach((npc: any) => {
        if(npcDataMap.get(npc.id) != null) {
            throw "IMPORTANT - duplicate NPC ID: " + npc.id
        }

        const actions = npc.options ? npc.options.map((action: string) =>
            action.toLowerCase().replace(" ", "_")) : []

        const npcData = new NpcData(npc.id, npc.name, npc.walkRadius, actions)
        npcDataMap.set(npc.id, npcData)
    })

    return new NpcDataHandler(npcDataMap)
}

export class NpcDataHandler {

    private readonly npcDataMap: Map<string, NpcData>

    constructor(npcDataMap: Map<string, NpcData>) {
        this.npcDataMap = npcDataMap
    }

    public get(id: string) {
        return this.npcDataMap.get(id)
    }

}
