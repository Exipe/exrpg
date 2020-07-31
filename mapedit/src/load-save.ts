
import { store } from "./store";
import * as Electron from "electron"

export function load() {
    const state = store.getState()
    const defaultPath = state.options.mapDirectory
    const onLoadMap = state.details.onLoadMap

    const remote = Electron.remote
    const window = remote.getCurrentWindow()

    const loadDialog = remote.dialog.showOpenDialog(window, {
        defaultPath: defaultPath,
        filters: [
            { name: "JSON", extensions: ["json"] }
        ],
        properties: ["openFile"]
    })

    loadDialog.then(result => {
        if(result.canceled) return

        const fs = remote.require('fs')
        fs.readFile(result.filePaths[0], (err, data) => {
            if(err) throw err
            onLoadMap(data)
        })
    })
}

export function save() {
    const state = store.getState()
    const defaultPath = state.options.mapDirectory
    const getMapSave = state.details.getMapSave

    const remote = Electron.remote
    const window = remote.getCurrentWindow()

    const saveDialog = remote.dialog.showSaveDialog(window, {
        defaultPath: defaultPath,
        filters: [
            { name: "JSON", extensions: ["json"] }
        ]
    })

    saveDialog.then(result => {
        if(result.canceled) return

        const fs = remote.require('fs')
        fs.writeFile(result.filePath, getMapSave(), _ => {})
    })
    
}
