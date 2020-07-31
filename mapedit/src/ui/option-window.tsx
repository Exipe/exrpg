
import { useSelector, useDispatch } from "react-redux"
import { RootState, store } from "../store"
import { setOptions } from "../store/option-store"
import { Button } from "./component"

import * as Electron from "electron"
import * as React from "react"

async function selectFolder(setter: (s: string) => any) {
    const remote = Electron.remote
    const window = remote.getCurrentWindow()

    let returnValue = await remote.dialog.showOpenDialog(window, {
        properties: ["openDirectory"]
    })

    if(!returnValue.canceled) setter(returnValue.filePaths[0])
}

export function OptionWindow() {
    let options = useSelector((state: RootState) => state.options)
    let dispatch = useDispatch()

    let [staticPath, setStaticPath] = React.useState(options.staticPath)
    let [mapDirectory, setMapDirectory] = React.useState(options.mapDirectory)

    let enableSave = options.mapDirectory != mapDirectory || options.staticPath != staticPath

    return <div id="optionWindow">
        <div className="separate">
            Static path
            <a  href="#"
                onClick= { () => { selectFolder(setStaticPath) } }>
                    Browse...
            </a>
        </div>
        <input onChange={ (e) => { setStaticPath(e.target.value) } } value={ staticPath }></input>

        <div className="separate">
            Map directory
            <a  href="#"
                onClick= { () => { selectFolder(setMapDirectory) } }>
                    Browse...
            </a>
        </div>
        <input onChange={ (e) => { setMapDirectory(e.target.value) } } value={ mapDirectory }></input>

        <Button enabled={ enableSave } onClick={ () => { if(!enableSave) return; dispatch(setOptions(staticPath, mapDirectory)) } }>Save</Button>
    </div>
}

// Save options to local storage
store.subscribe(() => {
    let options = store.getState().options
    localStorage.setItem("staticPath", options.staticPath)
    localStorage.setItem("mapDirectory", options.mapDirectory)
})
