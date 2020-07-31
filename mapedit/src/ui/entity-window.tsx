
import * as React from "react"
import { RootState, store } from "../store"
import { useSelector, useDispatch } from "react-redux"
import { engine } from "../engine-setup"
import { setSelectedObject } from "../store/object-store"
import { Button } from "./component"
import { objectTool, npcTool, itemTool } from "../tool"
import { selectTool, Tool } from "../store/tool-store"
import { SetSelectedNpc } from "../store/npc-store"
import { setSelectedItem } from "../store/item-store"

interface EntityWindowProps {
    placeHolder: string,
    search: (input: string) => string[],
    selectEntity: (id: string) => any,
    selectedEntity: string,
    entitySprite: string,
    tool: Tool
}

function EntityWindow(props: EntityWindowProps) {
    const [input, setInput] = React.useState("")

    const currentTool = useSelector((state: RootState) => state.tool.current)
    const dispatch = useDispatch()

    return <div className="entityWindow">
        <input className="search-input" value={input} onChange={(e) => { setInput(e.target.value) }} placeholder={props.placeHolder}></input>

        { input.length > 0 &&
            <ul className="search-list">
                {props.search(input).map(entity => (
                    <li onClick={() => { setInput(""); props.selectEntity(entity) }} key={entity}>{entity}</li>
                ))}
            </ul>
        }

        { props.selectedEntity != "" && <p>{props.selectedEntity}</p> }

        { props.entitySprite != "" &&
            <div className="entityPreview" style={{backgroundImage: "url('" + props.entitySprite + "')"}}></div>
        }

        <Button enabled = { currentTool != props.tool.name } onClick = { () => { dispatch(selectTool(props.tool.name)) } }>Select</Button>
    </div>
}

export function ItemWindow(props: any) {
    const selectedItem = useSelector((state: RootState) => state.items.selectedItem)
    const itemSprite = useSelector((state: RootState) => state.items.itemSprite)
    const dispatch = useDispatch()

    const selectItem = (id: string) => {
        const item = engine.itemHandler.get(id)
        dispatch(setSelectedItem(item.id, item.spritePath))
    }

    return <EntityWindow
        placeHolder="Item ID"
        search={ (id) => engine.itemHandler.search(id) }
        selectEntity={ (id) => selectItem(id) }
        selectedEntity={selectedItem}
        entitySprite={itemSprite}
        tool={itemTool}
    />
}

export function ObjectWindow(props: any) {
    const selectedObject = useSelector((state: RootState) => state.objects.selectedObject)
    const objectSprite = useSelector((state: RootState) => state.objects.objectSprite)
    const dispatch = useDispatch()

    const selectObject = (id: string) => {
        const obj = engine.objectHandler.get(id)
        dispatch(setSelectedObject(obj.id, obj.spritePath))
    }

    return <EntityWindow 
        placeHolder="Object ID"
        search={ (id) => engine.objectHandler.search(id) }
        selectEntity={ (id) => { selectObject(id) } }
        selectedEntity={selectedObject}
        entitySprite={objectSprite}
        tool={objectTool}
    />
}

export function NpcWindow(props: any) {
    const selectedNpc = useSelector((state: RootState) => state.npcs.selectedNpc)
    const npcSprite = useSelector((state: RootState) => state.npcs.npcSprite)
    const dispatch = useDispatch()

    const selectNpc = (id: string) => {
        const npc = engine.npcHandler.get(id)
        dispatch(SetSelectedNpc(npc.id, npc.spritePath))
    }

    return <EntityWindow 
        placeHolder="NPC ID"
        search={ (id) => engine.npcHandler.search(id) }
        selectEntity={ (id) => { selectNpc(id) } }
        selectedEntity={selectedNpc}
        entitySprite={npcSprite}
        tool={npcTool}
    />
}
