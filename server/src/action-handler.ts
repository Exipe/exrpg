
import { Player } from "./player/player"
import { Npc } from "./npc/npc"

export type ObjectActionCallback = (player: Player, action: string, objX: number, objY: number) => void
export type NpcActionCallback = (player: Player, npc: Npc, action: string) => void
export type ItemActionCallback = (player: Player, action: string, slot: number) => void

export class ActionHandler {

    private readonly objMap = new Map<string, ObjectActionCallback[]>()
    private readonly npcMap = new Map<string, NpcActionCallback[]>()
    private readonly itemMap = new Map<string, ItemActionCallback[]>()

    public onObject(objId: string, action: ObjectActionCallback) {
        let actions = this.objMap.get(objId)
        if(actions == null) {
            actions = []
            this.objMap.set(objId, actions)
        }

        actions.push(action)
    }

    public onNpc(npcId: string, action: NpcActionCallback) {
        let actions = this.npcMap.get(npcId)
        if(actions == null) {
            actions = []
            this.npcMap.set(npcId, actions)
        }

        actions.push(action)
    }

    public onItem(itemId: string, action: ItemActionCallback) {
        let actions = this.itemMap.get(itemId)
        if(actions == null) {
            actions = []
            this.itemMap.set(itemId, actions)
        }

        actions.push(action)
    }

    public objectAction(player: Player, objId: string, action: string, objX: number, objY: number) {
        const actions = this.objMap.get(objId)
        if(actions == null) {
            return
        }

        actions.forEach(callback => callback(player, action, objX, objY))
    }

    public npcAction(player: Player, npc: Npc, action: string) {
        const actions = this.npcMap.get(npc.data.id)
        if(actions == null) {
            return
        }

        actions.forEach(callback => callback(player, npc, action))
    }

    public itemAction(player: Player, itemId: string, action: string, slot: number) {
        const actions = this.itemMap.get(itemId)
        if(actions == null) {
            return
        }

        actions.forEach(callback => callback(player, action, slot))
    }

}
