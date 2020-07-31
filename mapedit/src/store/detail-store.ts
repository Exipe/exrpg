
interface Details {
    width: number,
    height: number,
    onResize: (width: number, height: number, anchorX: number, anchorY: number) => any,
    onLoadMap: (save: string) => any,
    getMapSave: () => string,
}

//action declarations

interface SetMapSize {
    type: "SET_MAP_SIZE",
    width: number,
    height: number
}

export function setMapSize(width: number, height: number): SetMapSize {
    return {
        type: "SET_MAP_SIZE",
        width: width,
        height: height
    }
}

interface SetOnResize {
    type: "SET_ON_RESIZE",
    onResize: (width: number, height: number, anchorX: number, anchorY: number) => any
}

export function setOnResize(onResize: (width: number, height: number, anchorX: number, anchorY: number) => any): SetOnResize {
    return {
        type: "SET_ON_RESIZE",
        onResize: onResize
    }
}

interface SetOnLoadMap {
    type: "SET_ON_LOAD_MAP",
    onLoadMap: (save: string) => any
}

export function setOnLoadMap(onLoadMap: (save: string) => any): SetOnLoadMap {
    return {
        type: "SET_ON_LOAD_MAP",
        onLoadMap: onLoadMap
    }
}

interface SetGetMapSave {
    type: "SET_GET_MAP_SAVE",
    getMapSave: () => string
}

export function setGetMapSave(getMapSave: () => string): SetGetMapSave {
    return {
        type: "SET_GET_MAP_SAVE",
        getMapSave: getMapSave
    }
}

//reducer

const initial: Details = {
    width: -1, 
    height: -1, 
    onResize: () => {}, 
    onLoadMap: _ => {},
    getMapSave: () => ""
}

export function detailReducer(state = initial, action: SetMapSize | SetOnResize | SetOnLoadMap | SetGetMapSave) {
    switch(action.type) {
        case "SET_MAP_SIZE":
            return { ...state, width: action.width, height: action.height }
        case "SET_ON_RESIZE":
            return { ...state, onResize: action.onResize }
        case "SET_ON_LOAD_MAP":
            return { ...state, onLoadMap: action.onLoadMap }
        case "SET_GET_MAP_SAVE":
            return { ...state, getMapSave: action.getMapSave }
        default:
            return state
    }

}
