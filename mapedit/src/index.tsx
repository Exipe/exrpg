
import * as React from "react"
import * as ReactDom from "react-dom"

import { store } from "./store"
import { Provider } from "react-redux"
import { App } from "./ui/app"
import { setupEngine } from "./engine-setup"

ReactDom.render(<Provider store={store}><App /></Provider>, document.querySelector("#container"))

const resPath = store.getState().options.staticPath.replace(/\\/g, "/")

fetch(resPath + "/exrpg").then(response => { //simple check to make sure the user didn't set a faulty path
    if(!response.ok) {
        throw "Static path is not a valid resource path"
    }

    setupEngine(resPath) 
})
