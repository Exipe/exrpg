
import { actionHandler, objDataHandler } from "../world"
import { Woodcutting, Mining } from "./gathering"
import { Dialogue } from "../player/dialogue"
import { randomChance, randomInt } from "../util/util"
import { initFood } from "./food"
import { initDrops } from "./drops"

export function initContent() {
    initFood()
    initDrops()

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

        dialogue.addOption("Let's trade", () =>
            new Dialogue(npc.data.name, ["Sorry.", "I am completely out of stock right now."])
        )

        dialogue.addOption("Never mind", () => null)

        player.openDialogue(dialogue)
    })

    actionHandler.onNpc("cat_white", (player, npc, action) => {
        if(action != "pet") {
            return
        }

        const dialogue = randomChance(50) ? 
            new Dialogue("猫", [ "にゃー。" ]) :
            new Dialogue(npc.data.name, [ "Meow." ])
        player.openDialogue(dialogue)
    })
}
