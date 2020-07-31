
import { setTexture, TextureId, selectTexture } from "../store/tile-texture-store"
import * as React from "react"
import { store, RootState } from "../store"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "./component"
import { TileTextures } from "./component/tile-texture"
import { selectTool, Tool } from "../store/tool-store"

export function TileWindow(props: { texture: TextureId, tool: Tool }) {
    const dispatch = useDispatch()
    const currentTool = useSelector((state: RootState) => state.tool.current)
    const src = useSelector((state: RootState) => state.tileTexture[props.texture])

    function select(x: number, y: number) {
        dispatch(selectTexture(props.texture, x, y))
    }

    function selected(x: number, y: number) {
        return x == src.selectX && y == src.selectY
    }

    function selectClick() {
        dispatch(selectTool(props.tool.name))
    }

    return <div className="tileWindow">
        <TileTextures src={src.src} width={src.width} height={src.height} onClick={select} isSelected={selected} />
        <Button enabled={currentTool != props.tool.name} onClick={selectClick}>Select</Button>
    </div>
}

class TileSource {

    img: HTMLImageElement
    fileName: string

    constructor(id: TextureId, fileName: string) {
        this.img = new Image()
        this.fileName = fileName

        this.img.onload = () => {
            store.dispatch(setTexture(id, this.img.src, this.img.width, this.img.height))
        }
    }

    updatePath(path: string) {
        this.img.src = path + "/tile/" + this.fileName + ".png"
    }

}

const tileSources: TileSource[] = [
    new TileSource("groundTexture", "ground"),
    new TileSource("shapeTexture", "shape"),
    new TileSource("wallTexture", "wall"),
    new TileSource("decoTexture", "deco")
]

// When the static path changes, update all tile textures

let staticPath = "";

store.subscribe(() => {
    const staticPathNew = store.getState().options.staticPath
    if(staticPath == staticPathNew) return

    staticPath = staticPathNew
    tileSources.forEach(source => {
        source.updatePath(staticPath)
    })
})
