
import { Player, SPAWN_POINT } from "../player";
import { Progress } from "./progress";
import { itemDataHandler } from "../../world";
import { isEquipSlot } from "../../item/equipment";
import { Item } from "../../item/item";
import { isAttribId } from "../attrib";
import { isMapId } from "../../scene/map-id";

export function loadProgress(player: Player, progress: Progress) {
    player.level.setLevel(progress.level, false)
    player.level.experience = progress.experience

    player.combatHandler.health = progress.health

    for(let i = 0; i < progress.inventory.length; i++) {
        const saveItem = progress.inventory[i]
        if(saveItem == null) {
            continue
        }
        
        player.inventory.set(i, new Item(saveItem.id, saveItem.amount))
    }

    for(let equip of progress.equipment) {
        const item = itemDataHandler.get(equip.id)
        if(item == null || !isEquipSlot(equip.slot)) {
            continue
        }

        player.equipment.set(equip.slot, item, false)
        player.attributes.setArmor(item, false)
    }

    player.attributes.setPoints(progress.points, false)

    for(let attrib of progress.attributes) {
        if(!isAttribId(attrib.id)) {
            continue
        }

        player.attributes.setBase(attrib.id, attrib.base, false)
    }

    player.equipment.update()
    player.attributes.update()
    
    const position = progress.position

    if(isMapId(position.map)) {
        player.goTo(position.map, position.x, position.y)
    } else {
        player.goTo(...SPAWN_POINT)
    }
}