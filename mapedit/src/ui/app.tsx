
import { useSelector, useDispatch } from "react-redux"
import { RootState, store } from "../store"
import { WindowCategory, toggleWindow, moveWindow, moveWindowForward, createWindow } from "../store/window-store"
import { Window, ToggleButton } from "./component"
import React = require("react")
import { OptionWindow } from "./option-window"
import { DetailWindow } from "./detail-window"
import { ToolWindow } from "./tool-window"
import { TileWindow } from "./tile-window"
import { groundTool, shapeTool, wallTool, decoTool } from "../tool"
import { save, load } from "../load-save"
import { ObjectWindow, NpcWindow, ItemWindow } from "./entity-window"
import { WarpWindow } from "./warp-window"
import { engine } from "../engine-setup"

const createWindows = [
    createWindow("new", "New", <>New</>, WindowCategory.OptionTool),
    createWindow("options", "Options", <OptionWindow />, WindowCategory.OptionTool),
    createWindow("details", "Details", <DetailWindow />),
    createWindow("tool", "Tool", <ToolWindow />),
    createWindow("ground", "Ground", <TileWindow texture={"groundTexture"} tool={groundTool} />),
    createWindow("shape", "Shape", <TileWindow texture={"shapeTexture"} tool={shapeTool} />),
    createWindow("wall", "Wall", <TileWindow texture={"wallTexture"} tool={wallTool} />),
    createWindow("decoration", "Decoration", <TileWindow texture={"decoTexture"} tool={decoTool} />),
    createWindow("warp", "Warp", <WarpWindow />),
    createWindow("npc", "NPC", <NpcWindow />),
    createWindow("object", "Object", <ObjectWindow />),
    createWindow("item", "Item", <ItemWindow />)
]

createWindows.forEach(action => store.dispatch(action));

export function App() {
    const windows = useSelector((state: RootState) => state.windows)
    const footer = useSelector((state: RootState) => state.footer)

    const dispatch = useDispatch()

    function toolToggles(category: WindowCategory) {
        return windows.filter(window => window.category == category).map(window => 
            <ToggleButton key={window.id}
                enabled={window.visible} 
                onClick={ () => dispatch(toggleWindow(window.id)) }>
                    {window.title}
            </ToggleButton>
        )
    }

    const mapToolToggles = toolToggles(WindowCategory.MapTool)
    const optionToolToggles = toolToggles(WindowCategory.OptionTool)

    const windowComponents = windows.filter(window => window.visible).map(window =>
        <Window key={window.id}
            window={window} 
            onClose= { () => dispatch(toggleWindow(window.id)) }
            onMove={ (x, y) => dispatch(moveWindow(window.id, x, y)) } 
            onMoveForward={ () => dispatch(moveWindowForward(window.id)) } />
    )

    return <>
        <div className="toolToggles" id="optionToolToggles">
            <ToggleButton onClick={ load } enabled={false}>Open</ToggleButton>
            <ToggleButton onClick={ save } enabled={false}>Save</ToggleButton>
            {optionToolToggles}
            <ToggleButton onClick={ () => { engine.map.islandMap.rebuild() } } enabled={false}>R Island</ToggleButton>
        </div>

        <div className="toolToggles" id="mapToolToggles">
            {mapToolToggles}
        </div>

        <div className="footer">
            Hovering tile: ({footer.hoverX}, {footer.hoverY}) Island: {footer.island}
        </div>

        {windowComponents}
    </>
}
