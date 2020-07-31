
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import * as React from "react"
import { Button } from "./component";
import { selectTool, setToolMode } from "../store/tool-store";

export function ToolWindow() {
    const dispatch = useDispatch()
    const toolState = useSelector((state: RootState) => state.tool)
    const current = toolState.tools.find(t => t.tool.name == toolState.current)

    const toolButtons = toolState.tools.map(t => {
        const name = t.tool.name
        const enabled = t != current

        return <Button key={name} enabled={enabled} onClick={() => { dispatch(selectTool(name)); }}>{
            t.tool.name}</Button>
    })

    let currentName = "None"
    let toolModes: React.ReactNode = <>N/A</>

    if(current != null) {
        const tool = current.tool
        currentName = tool.name

        toolModes = tool.modes.map(m => 
            <Button key={m} enabled={current.mode != m} onClick={() => { dispatch(setToolMode(currentName, m)) }}>{m}</Button>
        )
    }

    return <div>
        Current: {currentName}

        <div id="toolSelects">
            {toolButtons}
        </div>

        <div id="toolModes">
            {toolModes}
        </div>
    </div>
}