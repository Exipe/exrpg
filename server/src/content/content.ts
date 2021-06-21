
import { actionHandler, craftingHandler, itemDataHandler, objDataHandler, shopHandler } from "../world"
import { Woodcutting, Mining } from "./gathering"
import { Dialogue } from "../player/window/dialogue"
import { randomChance, randomInt } from "../util/util"
import { initFood } from "./food"
import { initDrops } from "./drops"

export function initContent() {
    initFood()
    initDrops()

    actionHandler.onObject("door_open", (player, _action, ox, oy) => {
        player.map.addTempObj("door_closed", ox, oy)
    })

    actionHandler.onObject("door_closed", (player, _action, ox, oy) => {
        player.map.addTempObj("door_open", ox, oy)
    })

    actionHandler.onObject("anvil", player => {
        player.window = craftingHandler.get("Anvil")
    })

    actionHandler.onObject("furnace", player => {
        player.window = craftingHandler.get("Furnace")
    })

    actionHandler.onObject("car", (player, action) => {
        if(action == "drive") {
            player.sendMessage("Car racing - coming soon™!")
        }
    })

    actionHandler.onObject("crate_small", (player, action) => {
        if(action != "search") {
            return
        }

        if(randomChance(2)) {
            player.sendMessage("You find an apple.")
            player.inventory.add("apple", 1)
        } else {
            player.sendMessage("You find some coins.")
            player.inventory.add("coins", randomInt(50, 60))
        }
    })

    const treeCommon = objDataHandler.get("tree_common")
    actionHandler.onObject(treeCommon.id, (player, action, ox, oy) => {
        if(action == "chop_down") {
            new Woodcutting(player, treeCommon, ox, oy).start()
        }
    })

    const oreCopper = objDataHandler.get("ore_copper")
    actionHandler.onObject(oreCopper.id, (player, action, ox, oy) => {
        if(action == "mine") {
            new Mining(player, oreCopper, ox, oy).start()
        }
    })

    actionHandler.onNpc("t_t_c", (player, npc, action) => {
        if(action != "talk-to") {
            return
        }

        const dialogue = new Dialogue(npc.data.name, [
            `Hello, ${player.name}.`, "What can I help you with?"
        ])

        dialogue.addOption("Let's trade", () => {
            player.window = shopHandler.get("Test Shop")
            return null
        })

        dialogue.addOption("Never mind", () => null)

        player.window = dialogue
    })

    actionHandler.onNpc("carl_armor", (player, npc, action) => {
        const shop = shopHandler.get("Carl's Armor")
        
        const dialoge = new Dialogue(npc.data.name, [
            "Greetings adventurer.",
            "Would you like to see my selection of armor?"
        ])

        dialoge.addOption("Yes please", () => {
            player.window = shop
            return null
        })

        dialoge.addOption("I'm fine", () => null)

        switch(action) {
            case "trade":
                player.window = shop
                break
            case "talk-to":
                player.window = dialoge
                break
        }
    })

    actionHandler.onNpc("cat_white", (player, npc, action) => {
        if(action != "pet") {
            return
        }

        const dialogue = randomChance(50) ? 
            new Dialogue("猫", [ "にゃー。" ]) :
            new Dialogue(npc.data.name, [ "Meow." ])
        player.window = dialogue
    })
}
