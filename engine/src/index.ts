
import { initShaders, ShaderHandler } from "./shader/shader-handler"
import { TileHandler, initTileTextures } from "./tile/tile-handler"
import { Camera } from "./camera"
import { InputHandler } from "./input-handler"
import { Scene } from "./scene/scene"
import { SceneBuilder } from "./scene/scene-builder"
import { saveScene } from "./scene/save"
import { loadScene } from "./scene/load"
import { loadTexture } from "./texture/texture"
import { Sprite } from "./texture/sprite"
import { initObjects, ObjectHandler } from "./object/object-handler"
import { initNpcs, NpcHandler } from "./npc/npc-handler"
import { feetCoords, Entity } from "./entity/entity"
import { NpcEntity } from "./npc/npc-entity"
import { NpcData } from "./npc/npc-data"
import { initItems, ItemHandler } from "./item/item-handler"
import { ItemData } from "./item/item-data"
import { Item } from "./item/item"
import { MergeTexture } from "./texture/merge-texture"
import { EquipmentData } from "./item/equipment-data"
import { ObjectEntity } from "./object/object-entity"

export { Scene, SceneBuilder, Sprite, MergeTexture, loadScene, saveScene, feetCoords, 
    Entity, NpcData, NpcEntity, ItemData, EquipmentData, Item, ObjectEntity }

export const TILE_SIZE = 16
export const ITEM_SIZE = 16
export const PLAYER_SIZE = [ 24, 32 ] as [number, number]
export const SHADOW_OUTLINE = [ 0, 0, 0, 0.20 ] as [number, number, number, number]

export * from "./matrix"

export async function initEngine(canvas: HTMLCanvasElement, resPath: string, previewMode = false) {
    const gl = canvas.getContext("webgl2")
    if(gl == null) throw "Could not initialize WebGL"

    const results = await Promise.all([
        initTileTextures(gl, resPath + "/tile", previewMode), 
        initShaders(gl, resPath + "/shader"),
        initObjects(resPath),
        initNpcs(resPath),
        initItems(resPath)
    ])
    
    const tileHandler = results[0]
    const shaderHandler = results[1]
    const objectHandler = results[2]
    const npcHandler = results[3]
    const itemHandler = results[4]

    const camera = new Camera(shaderHandler)
    const inputHandler = new InputHandler(canvas, camera)

    return new Engine(gl, resPath, inputHandler, tileHandler, shaderHandler, objectHandler, npcHandler, itemHandler, 
        camera, canvas.width, canvas.height)
}

export type AnimateCallback = (dt: number) => void

export type DrawCallback = () => void

export class Engine {

    gl: WebGL2RenderingContext

    resPath: string

    inputHandler: InputHandler
    shaderHandler: ShaderHandler
    tileHandler: TileHandler

    public readonly objectHandler: ObjectHandler
    public readonly npcHandler: NpcHandler
    public readonly itemHandler: ItemHandler

    private scene: Scene

    public camera: Camera

    public onAnimate: AnimateCallback = null
    public onDraw: DrawCallback = null

    constructor(gl: WebGL2RenderingContext, resPath: string, inputHandler: InputHandler, tileHandler: TileHandler, shaderHandler: ShaderHandler, 
                objectHandler: ObjectHandler, npcHandler: NpcHandler, itemHandler: ItemHandler, camera: Camera, width: number, height: number) 
    {
        this.gl = gl
        this.resPath = resPath

        this.shaderHandler = shaderHandler
        this.tileHandler = tileHandler
        this.inputHandler = inputHandler
        this.objectHandler = objectHandler
        this.npcHandler = npcHandler
        this.itemHandler = itemHandler
        this.camera = camera

        gl.enable(gl.BLEND)
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE)

        this.resize(width, height)
        camera.scale = 3

        const now = Date.now()
        requestAnimationFrame(() => { this.update(now) })
    }

    async loadTexture(url: string) {
        return await loadTexture(this.gl, this.resPath + "/" + url)
    }

    public set map(map: Scene) {
        this.scene = map
        this.inputHandler.scene = map
    }

    public get map() {
        return this.scene
    }

    resize(width: number, height: number) {
        this.gl.viewport(0, 0, width, height)
        this.camera.setDimensions(width, height)
    }

    update(lastUpdate: number) {
        const now = Date.now()
        const dt = Date.now() - lastUpdate

        this.tileHandler.animateWater(dt)

        if(this.onAnimate != null) {
            this.onAnimate(dt)
        }

        this.gl.clearColor(0, 0, 0, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        if(this.scene != null) {
            this.scene.draw()
        }

        if(this.onDraw != null) {
            this.onDraw()
        }

        requestAnimationFrame(() => { this.update(now) })
    }

}
