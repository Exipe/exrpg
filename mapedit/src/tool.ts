
import { store } from "./store";
import { Tool, addTool } from "./store/tool-store";

export const waterTool: Tool = {
    name: "Water",
    modes: ["Draw", "Erase", "Fill"],

    apply: (scene, mode, x, y) => {
        switch(mode) {
            case "Draw":
                scene.putWater(x, y)
                break
            case "Erase":
                scene.removeBase(x, y)
                break
            case "Fill":
                scene.fillWater(x, y)
                break
        }
    }
}

export const groundTool: Tool = {
    name: "Ground",
    modes: ["Draw", "Erase", "Fill"],

    apply: (scene, mode, x, y) => {
        const tex = store.getState().tileTexture.groundTexture

        switch(mode) {
            case "Draw":
                scene.putGround(x, y, tex.selectX, tex.selectY)
                break
            case "Erase":
                scene.removeBase(x, y)
                break
            case "Fill":
                scene.fillGround(x, y, tex.selectX, tex.selectY)
                break
        }
    }
}

export const shapeTool: Tool = {
    name: "Shape",
    modes: ["Draw", "Erase"],
    
    apply: (scene, mode, x, y) => {
        if(mode == "Erase") {
            scene.removeOverlay(x, y)
            return
        }

        const tileTexture = store.getState().tileTexture
        const gTex = tileTexture.groundTexture
        const sTex = tileTexture.shapeTexture
        
        scene.putOverlay(x, y, gTex.selectX, gTex.selectY, sTex.selectX, sTex.selectY)
    }
}

export const wallTool: Tool = {
    name: "Wall",
    modes: ["Draw", "Erase", "Fill"],

    apply: (scene, mode, x, y) => {
        const tex = store.getState().tileTexture.wallTexture
        switch(mode) {
            case "Draw":
                scene.putWall(x, y, tex.selectX, tex.selectY)
                break
            case "Erase":
                scene.removeWall(x, y)
                break
            case "Fill":
                scene.fillWall(x, y, tex.selectX, tex.selectY)
                break
        }
    }
}

export const decoTool: Tool = {
    name: "Decoration",
    modes: ["Draw", "Erase"],

    apply: (scene, mode, x, y) => {
        const tex = store.getState().tileTexture.decoTexture

        switch(mode) {
            case "Draw":
                scene.putDeco(x, y, tex.selectX, tex.selectY)
                break
            case "Erase":
                scene.removeDeco(x, y)
                break
        }
    }
}

export const objectTool: Tool = {
    name: "Object",
    modes: ["Place", "Remove"],

    apply: (scene, mode, x, y) => {
        if(mode == "Remove") {
            scene.removeAttrib(x, y)
            return
        }

        const objectId = store.getState().objects.selectedObject
        scene.putObject(x, y, objectId)
    }
}

export const npcTool: Tool = {
    name: "NPC",
    modes: ["Place", "Remove"],

    apply: (scene, mode, x, y) => {
        if(mode == "Remove") {
            scene.removeAttrib(x, y)
            return
        }

        const npcId = store.getState().npcs.selectedNpc
        scene.putNpc(x, y, npcId)
    }
}

export const itemTool: Tool = {
    name: "Item",
    modes: ["Place", "Remove"],

    apply: (scene, mode, x, y) => {
        if(mode == "Remove") {
            scene.removeAttrib(x, y)
            return
        }

        const itemId = store.getState().items.selectedItem
        scene.putItem(x, y, itemId)
    }
}

export const blockTool: Tool = {
    name: "Block",
    modes: ["On", "Off"],

    apply: (scene, mode, x, y) => {
        switch(mode) {
            case "On":
                scene.putBlock(x, y)
                break
            case "Off":
                scene.removeAttrib(x, y)
                break
        }
    }
}

export const npcAvoidTool: Tool = {
    name: "NPC-avoid",
    modes: ["On", "Off"],

    apply: (scene, mode, x, y) => {
        switch(mode) {
            case "On":
                scene.putNpcAvoid(x, y)
                break
            case "Off":
                scene.removeAttrib(x, y)
                break
        }
    }
}

export const islandTool: Tool = {
    name: "Island",
    modes: ["Place", "Remove"],

    apply: (scene, mode, x, y) => {
        switch(mode) {
            case "Place":
                scene.putIsland(x, y)
                break
            case "Remove":
                scene.removeAttrib(x, y)
                break
        }
    }
}

export const warpTool: Tool = {
    name: "Warp",
    modes: ["Place", "Remove"],

    apply: (scene, mode, x, y) => {
        const warp = store.getState().warp

        switch(mode) {
            case "Place":
                scene.putWarp(x, y, warp.mapId, warp.x, warp.y)
                break
            case "Remove":
                scene.removeAttrib(x, y)
                break
        }
    }

};

const tools = [
    waterTool,
    groundTool,
    shapeTool,
    wallTool,
    decoTool,
    objectTool,
    npcTool,
    itemTool,
    blockTool,
    npcAvoidTool,
    islandTool,
    warpTool
]

tools.forEach(tool => {
    store.dispatch(addTool(tool))
})
