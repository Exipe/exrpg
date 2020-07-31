
import {ReactNode} from "react"

interface CreateWindow {
    type: "CREATE_WINDOW",
    id: string,
    title: string,
    category: WindowCategory,
    body: ReactNode
}

interface MoveWindow {
    type: "MOVE_WINDOW",
    id: string,
    x: number,
    y: number
}

interface ToggleWindow {
    type: "TOGGLE_WINDOW",
    id: string
}

interface MoveWindowForward {
    type: "MOVE_WINDOW_FORWARD",
    id: string
}

export function createWindow(id: string, title: string, body: ReactNode, category: WindowCategory = WindowCategory.MapTool): CreateWindow {
    return {
        type: "CREATE_WINDOW",
        id: id,
        title: title,
        category: category,
        body: body
    }
}

export function moveWindow(id: string, x: number, y: number): MoveWindow {
    return {
        type: "MOVE_WINDOW",
        id: id,
        x: x,
        y: y
    }
}

export function toggleWindow(id: string): ToggleWindow {
    return {
        type: "TOGGLE_WINDOW",
        id: id
    }
}

export function moveWindowForward(id: string): MoveWindowForward {
    return {
        type: "MOVE_WINDOW_FORWARD",
        id: id
    }
}

let zCounter = 0

export enum WindowCategory {
    MapTool,
    OptionTool
}

export class WindowDetails {

    id: string
    title: string
    body: React.ReactNode
    category: WindowCategory
    visible = false
    x = 0
    y = 0
    z = 0

    constructor(id: string = "", title: string = "", category: WindowCategory = null, body: React.ReactNode = null) {
        this.id = id
        this.title = title
        this.category = category
        this.body = body
    }

    copy(): WindowDetails {
        const window = new WindowDetails()
        Object.assign(window, this)
        return window
    }

    move(x: number, y: number): WindowDetails {
        const window = this.copy()
        window.x = x
        window.y = y
        return window
    }

    toggleVisibility() {
        const window = this.copy()
        window.visible = !this.visible
        return window
    }

    moveForward() {
        const window = this.copy()
        window.z = zCounter++
        return window
    }

}

export function windowReducer(state: WindowDetails[] = [], action: CreateWindow | MoveWindow | ToggleWindow | MoveWindowForward) {
    switch(action.type) {
        case "CREATE_WINDOW":
            return [...state, new WindowDetails(action.id, action.title, action.category, action.body)]

        case "MOVE_WINDOW":
            return state.map(window => window.id == action.id ? window.move(action.x, action.y) : window)

        case "TOGGLE_WINDOW":
            return state.map(window => window.id == action.id ? window.toggleVisibility() : window)

        case "MOVE_WINDOW_FORWARD":
            return state.map(window => window.id == action.id ? window.moveForward() : window)

        default:
            return state
    }
}
