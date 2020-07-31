import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";

import React = require("react");
import { Button } from "./component";
import { setWarp } from "../store/warp-store";

export function WarpWindow() {
    const [editing, setEditing] = React.useState(false)

    const warpStore = useSelector((state: RootState) => state.warp)
    const dispatch = useDispatch()

    const [idInput, setIdInput] = React.useState(warpStore.mapId)
    const [xInput, setXInput] = React.useState(warpStore.x.toString())
    const [yInput, setYInput] = React.useState(warpStore.y.toString())

    function update() {
        setEditing(false)
        dispatch(setWarp(idInput, Number(xInput), Number(yInput)))
    }

    let validEdit = !isNaN(Number(xInput)) && !isNaN(Number(yInput))

    return <div>
        <div id="warpOptions">
            <div className="optionGrid">
                <div>Map ID:</div>
                <input size={12} disabled={!editing} onChange={ (e) => setIdInput(e.target.value) } value={idInput}></input>

                <div>To X:</div>
                <input size={3} disabled={!editing} onChange={ (e) => setXInput(e.target.value) } value={xInput}></input>

                <div>To Y:</div>
                <input size={3} disabled={!editing} onChange={ (e) => setYInput(e.target.value) } value={yInput}></input>
            </div>

            {editing &&
                <Button enabled = {validEdit} onClick = { () => { update() } }>Save</Button>
            }

            {!editing &&
                <Button enabled = {true} onClick = { () => { setEditing(true) } }>Edit</Button>
            }
            
        </div>

        <Button enabled = {true} /*{ currentTool != objectTool.name }*/ onClick = { () => { /*dispatch(selectTool(objectTool.name))*/ } }>Select</Button>
    </div>
}