
import { initEngine, Engine, Scene, saveScene, loadScene, Sprite, TILE_SIZE } from "exrpg"
import { store } from "./store"
import { setMapSize, setOnResize, setGetMapSave, setOnLoadMap } from "./store/detail-store"
import { setHover } from "./store/footer-store"

export let engine: Engine = null



let cursor: Sprite

let lastX: number = 0
let lastY: number = 0



function draw() {
    cursor.draw(lastX * TILE_SIZE, lastY * TILE_SIZE)
}

function mouseDrag(dx: number, dy: number, altKey: boolean) {
    if(!altKey) return

    const camera = engine.camera
    camera.move(camera.x - dx, camera.y - dy)
}

function tileHover(x: number, y: number) {
    const map = engine.map
    if(x < 0 || y < 0 || x >= map.width || y >= map.height || (x == lastX && y == lastY)) {
        return
    }

    store.dispatch(setHover(x, y, map.islandMap.get(x, y)))

    lastX = x
    lastY = y
}

function tileClick(x: number, y: number, altKey: boolean) {
    if(altKey) return

    const toolStore = store.getState().tool
    const toolEntry = toolStore.tools.find(t => t.tool.name == toolStore.current)
    if(toolEntry) toolEntry.tool.apply(engine.map.builder, toolEntry.mode, x, y)
}



function windowResize(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    engine.resize(canvas.width, canvas.height)
}

function resizeMap(width: number, height: number, anchorX: 0 | 1 | 2, anchorY: 0 | 1 | 2) {
    engine.map.resize(width, height, anchorX, anchorY)
    store.dispatch(setMapSize(width, height))
}

function loadMap(save: string) {
    engine.map = loadScene(engine, save)
    engine.map.builder.autoUpdate = true
    store.dispatch(setMapSize(engine.map.width, engine.map.height))
}

function getMapSave() {
    return saveScene(engine.map)
}



export async function setupEngine(resPath: string) {
    const canvas = document.querySelector("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    engine = await initEngine(canvas, resPath, true)
    cursor = new Sprite(engine, await engine.loadTexture("tile/cursor.png"))

    engine.camera.scale = 2

    engine.map = new Scene(engine, 10, 10)
    engine.map.builder.autoUpdate = true
    engine.onDraw = () => {
        draw()
    }

    store.dispatch(setMapSize(10, 10))
    store.dispatch(setOnResize(resizeMap))
    store.dispatch(setOnLoadMap(loadMap))
    store.dispatch(setGetMapSave(getMapSave))

    engine.inputHandler.onMouseDrag = mouseDrag
    engine.inputHandler.onTileHover = tileHover
    engine.inputHandler.onTileClick = tileClick
    engine.inputHandler.clickOnDrag = true

    window.onresize = () => windowResize(canvas)
}
