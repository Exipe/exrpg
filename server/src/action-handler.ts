
import { Player } from "./player/player"
import { Npc } from "./npc/npc"
import { MultiMap } from "./util/multi-map"

export type ObjectActionCallback = (player: Player, action: string, objX: number, objY: number) => void
export type NpcActionCallback = (player: Player, npc: Npc, action: string) => void
export type NpcDeathCallback = (killer: Player, npc: Npc) => void
export type ItemActionCallback = (player: Player, action: string, slot: number) => void

export class ActionHandler {

    private readonly objMap = new MultiMap<string, ObjectActionCallback>()
    private readonly npcMap = new MultiMap<string, NpcActionCallback>()
    private readonly npcDeathMap = new MultiMap<string, NpcDeathCallback>()
    private readonly itemMap = new MultiMap<string, ItemActionCallback>()

    public onObject(objId: string, action: ObjectActionCallback) {
        this.objMap.add(objId, action)
    }

    public onNpc(npcId: string, action: NpcActionCallback) {
        this.npcMap.add(npcId, action)
    }

    public onNpcDeath(npcId: string, action: NpcDeathCallback) {
        this.npcDeathMap.add(npcId, action)
    }

    public onItem(itemId: string, action: ItemActionCallback) {
        this.itemMap.add(itemId, action)
    }

    public objectAction(player: Player, objId: string, action: string, objX: number, objY: number) {
        this.objMap.forEach(objId, 
            (callback) => callback(player, action, objX, objY))
    }

    public npcAction(player: Player, npc: Npc, action: string) {
        this.npcMap.forEach(npc.data.id,
            (callback) => callback(player, npc, action))
    }

    public npcDeath(player: Player, npc: Npc) {
        this.npcDeathMap.forEach(npc.data.id,
            (callback) => callback(player, npc))
    }

    public itemAction(player: Player, itemId: string, action: string, slot: number) {
        this.itemMap.forEach(itemId,
            (callback) => callback(player, action, slot))
    }

}
