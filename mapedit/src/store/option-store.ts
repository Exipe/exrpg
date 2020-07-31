
interface SetOptions {
    type: "SET_OPTIONS",
    staticPath: string,
    mapDirectory: string
}

function initOptions() {
    return {
        staticPath: localStorage.staticPath,
        mapDirectory: localStorage.mapDirectory
    }
}

export function setOptions(staticPath: string, mapDirectory: string): SetOptions {
    return {
        type: "SET_OPTIONS",
        staticPath: staticPath,
        mapDirectory: mapDirectory
    }
}

export function optionReducer(state = initOptions(), action: SetOptions) {
    if(action.type != "SET_OPTIONS") return state

    return {
        staticPath: action.staticPath,
        mapDirectory: action.mapDirectory
    }
}
