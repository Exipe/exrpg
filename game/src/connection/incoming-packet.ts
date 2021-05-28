
import { loadScene } from "exrpg";
import { Game } from "../game/game";
import { Dialogue } from "../game/model/dialogue-model";
import { TextStyle } from "../game/model/overlay-model";
import { ShopSelect, Shop } from "../game/model/shop-model";
import { SwingItem } from "../game/swing-item";

function onSwingItem(game: Game, data: any) {
    const engine = game.engine
    const spritePromise = engine.itemHandler.get(data.itemId).getSprite(engine)
    const character = data.character == "player" ? game.getPlayer(data.characterId) 
        : game.getNpc(data.characterId)
    const swingItem = new SwingItem(spritePromise, character,
        data.offX, data.offY, data.duration)
    game.addSwingItem(swingItem)
}

function onHitSplat(game: Game, data: any) {
    const character = data.character == "player" ? game.getPlayer(data.characterId) 
        : game.getNpc(data.characterId)
    let style: TextStyle
    let text: string

    switch(data.type) {
        case "hit":
            style = "hitSplat"
            text = `-${data.damage}`
            break
        case "miss":
            style = "missSplat"
            text = `-${data.damage}`
            break
        case "heal":
            style = "healSplat"
            text = `+${data.damage}`
            break
    }

    const coords = character.centerCoords
    game.overlayArea.addText(text, style, coords[0], coords[1], 2000)
}

function onHealthBar(game: Game, data: any) {
    const character = data.character == "player" ? game.getPlayer(data.characterId) 
        : game.getNpc(data.characterId)

    character.healthBarComponent.healthRatio = data.ratio
}

function onHealth(game: Game, data: any) {
    game.status.setHealth(data.health, data.totalHealth)
}

function onBrightness(game: Game, brightness: number) {
    game.engine.lightHandler.brightness = brightness
}

async function onLoadMap(game: Game, mapId: string) {
    game.clear()

    const mapData = await fetch("res/map/" + mapId + ".json").then(res => res.text())
    const map = loadScene(game.engine, mapData)
    map.attribLayer.visible = false

    game.enterMap(map)
}

async function onSetObject(game: Game, objects: [string, number, number][]) {
    objects.forEach(o => {
        game.setObject(o[0], o[1], o[2])
    })
}

function onLevel(game: Game, data: any) {
    game.status.setLevel(data.level, data.experience, data.requiredExperience)
}

function onCloseWindow(game: Game, _: any) {
    game.primaryWindow.value = "None"
}

function onOpenDialogue(game: Game, data: any) {
    const dialogue = new Dialogue(data.id, data.name, data.lines, data.options)
    game.dialogue.observable.value = dialogue
    game.primaryWindow.value = "Dialogue"
}

function onOpenShop(game: Game, data: any) {
    const shop = new Shop(data.name, data.items.map((id: string) =>
        game.engine.itemHandler.get(id)))
    game.shop.open(shop)
}

function onSelectBuy(game: Game, data: any) {
    const itemHandler = game.engine.itemHandler
    const item = itemHandler.get(data.item)
    const currency = itemHandler.get(data.currency)
    game.shop.selectedBuy.value = new ShopSelect(data.slot, item, currency, data.price)
}

function onSelectSell(game: Game, data: any) {
    const itemHandler = game.engine.itemHandler
    const item = itemHandler.get(data.item)
    const currency = itemHandler.get(data.currency)
    game.shop.selectedSell.value = new ShopSelect(data.slot, item, currency, data.value)
}

export function bindIncomingPackets(game: Game) {
    const connection = game.connection

    let bind = (packet: string, listener: (game: Game, data: any) => void) => {
        connection.on(packet, data => listener(game, data))
    }

    bind("SWING_ITEM", onSwingItem)
    bind("HIT_SPLAT", onHitSplat)
    bind("HEALTH_BAR", onHealthBar)
    bind("HEALTH", onHealth)
    bind("LOAD_MAP", onLoadMap)
    bind("SET_OBJECT", onSetObject)
    bind("BRIGHTNESS", onBrightness)
    bind("LEVEL", onLevel)
    bind("CLOSE_WINDOW", onCloseWindow)
    bind("DIALOGUE", onOpenDialogue)
    bind("SHOP", onOpenShop)
    bind("SELECT_BUY", onSelectBuy)
    bind("SELECT_SELL", onSelectSell)
}