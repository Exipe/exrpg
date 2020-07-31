
import { Player } from "../player";
import { Progress } from "./progress";
import { ATTRIBUTES } from "../../character/attrib";

export function saveProgress(player: Player): Progress {
    const position = {
        x: player.x,
        y: player.y,
        map: player.map.id
    }

    const inventory = player.inventory.itemIds

    const equipment = {
        helm: player.equipment.idOf("helm"),
        plate: player.equipment.idOf("plate"),
        legs: player.equipment.idOf("legs"),
        shield: player.equipment.idOf("shield")
    }

    const attributes = ATTRIBUTES.map(attrib => 
        [attrib, player.attributes.get(attrib)] as [string, number])

    return {
        position: position,
        inventory: inventory,
        equipment: equipment,
        attributes: attributes
    }
}