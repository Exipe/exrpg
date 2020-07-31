
import { Player } from "../player";
import { Progress } from "./progress";
import { itemDataHandler } from "../../world";
import { isEquipSlot } from "../../item/equipment";
import { isAttribId } from "../../character/attrib";

export function loadProgress(player: Player, progress: Progress) {
    player.inventory.seItemIds(progress.inventory, true)
    
    for(const [key, value] of Object.entries(progress.equipment)) {
        const item = itemDataHandler.get(value)
        if(item == null || !isEquipSlot(key)) {
            continue
        }

        player.equipment.set(key, item, false)
        player.attributes.setArmor(item, false)
    }

    for(let attrib of progress.attributes) {
        const attribId = attrib[0]
        if(!isAttribId(attribId)) {
            continue
        }

        player.attributes.setBase(attribId, attrib[1], false)
    }

    player.equipment.update()
    player.attributes.update()
    
    const position = progress.position
    player.goTo(position.map, position.x, position.y)
}