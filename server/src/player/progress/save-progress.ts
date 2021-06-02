
import { Player } from "../player";
import { Progress, SaveAttrib, SaveEquip, SaveItem } from "./progress";
import { EQUIP_SLOTS } from "../../item/equipment";
import { INVENTORY_SIZE } from "../../item/inventory";
import { ATTRIBUTES } from "../attrib";

export function saveProgress(player: Player): Progress {
    const position = {
        x: player.x,
        y: player.y,
        map: player.map.id
    }

    const inventory: SaveItem[] = Array.from({ length: INVENTORY_SIZE }, (_, slot) => {
        const item = player.inventory.get(slot)
        return item != null ? {
            id: item.id,
            amount: item.amount
        } : null
    })
    
    const equipment: SaveEquip[] = EQUIP_SLOTS.map(slot => ({
        slot: slot,
        id: player.equipment.idOf(slot)
    }))

    const attributes: SaveAttrib[] = ATTRIBUTES.map(attrib => ({
        id: attrib,
        base: player.attributes.getBase(attrib)
    }))

    return {
        level: player.level.level,
        experience: player.level.experience,
        rank: player.rank,
        health: player.combatHandler.health,
        position: position,
        inventory: inventory,
        equipment: equipment,
        attributes: attributes,
        points: player.attributes.getPoints()
    }
}