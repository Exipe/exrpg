
import { loadScene } from "exrpg";
import { Game } from "../game/game";
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

    const coords = character.centerCoords
    game.overlayArea.addText(`-${data.damage}`, "hitSplat", coords[0], coords[1], 2000)
}

function onHealthBar(game: Game, data: any) {
    const character = data.character == "player" ? game.getPlayer(data.characterId) 
        : game.getNpc(data.characterId)
    character.healthRatio = data.ratio
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
}