import { randomChance } from "../util/util";
import { actionHandler, itemDataHandler, npcDataHandler, sceneHandler } from "../world";

function addDrop(npcId: string, probability: number, item: string, amount: number) {
    if(!npcDataHandler.get(npcId)) {
        throw `[Invalid NPC drop] unknown NPC: ${npcId}`
    }

    if(!itemDataHandler.get(item)) {
        throw `[Invalid NPC drop] unknown item: ${item}`
    }

    actionHandler.onNpcDeath(npcId, (_killer, npc) => {
        if(!randomChance(probability)) {
            return
        }

        sceneHandler.get(npc.mapId)
        .dropItem(itemDataHandler.get(item), amount, npc.x, npc.y)
    })
}

export function initDrops() {
    addDrop("slime_weak", 3, "coins", 5)
    addDrop("slime_weak", 5, "pickaxe_crude", 1)
}