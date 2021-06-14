
import { loadNpcData, NpcDataHandler } from "./npc/npc-data"
import { loadScenes, SceneHandler } from "./scene/scene-handler"
import { NpcHandler } from "./npc/npc"
import { PlayerHandler } from "./player/player-handler"
import { ObjectDataHandler, loadObjectData } from "./object/object-data"
import { ItemDataHandler, loadItemData } from "./item/item-data"
import { ActionHandler } from "./action-handler"
import { initContent } from "./content/content"
import { CommandHandler } from "./command/command-handler"
import { initCommands } from "./command/command"
import { initWeather, WeatherHandler } from "./weather"
import { CraftingStationHandler, loadCraftingData } from "./crafting/crafting-data"

export let npcDataHandler: NpcDataHandler = null
export let objDataHandler: ObjectDataHandler = null
export let itemDataHandler: ItemDataHandler = null

export let craftingHandler: CraftingStationHandler

export let playerHandler: PlayerHandler = null
export let npcHandler: NpcHandler = null
export let sceneHandler: SceneHandler = null
export let actionHandler: ActionHandler = null
export let commandHandler: CommandHandler = null

export let weatherHandler: WeatherHandler = null

function currTime() {
    return new Date().getTime()
}

const TICK_INTERVAL = 250

function tick() {
    npcHandler.tick()
}

export async function initWorld() {
    console.log("Loading NPC data")
    let start = currTime()

    npcDataHandler = await loadNpcData()
    console.log(`Finished loading NPC data. Took: ${currTime() - start} ms`)
    
    console.log("Loading object data")
    start = currTime()

    objDataHandler = await loadObjectData()
    console.log(`Finished loading object data. Took: ${currTime() - start} ms`)

    console.log("Loading item data")
    start = currTime()

    itemDataHandler = await loadItemData()
    console.log(`Finished loading item data. Took: ${currTime() - start} ms`)

    npcHandler = new NpcHandler(npcDataHandler)

    console.log("Loading maps")
    start = currTime()

    sceneHandler = await loadScenes()
    console.log(`Finished loading maps. Took: ${currTime() - start} ms`)

    npcHandler.spawnAll()

    craftingHandler = loadCraftingData()

    playerHandler = new PlayerHandler()
    actionHandler = new ActionHandler()
    commandHandler = new CommandHandler()

    initCommands()
    initContent()

    weatherHandler = initWeather()

    setInterval(tick, TICK_INTERVAL)
}
