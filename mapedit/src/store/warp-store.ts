
export interface Warp {
    mapId: string,
    x: number,
    y: number
}

// action declarations

interface SetWarp {
    type: "SET_WARP",
    mapId: string,
    x: number,
    y: number
}

export function setWarp(mapId: string, x: number, y: number): SetWarp {
    return {
        type: "SET_WARP",
        mapId: mapId,
        x: x,
        y: y
    }
}

export function WarpReducer(state: Warp = { mapId: "", x: 0, y: 0 }, action: SetWarp) {
    if(action.type != "SET_WARP") {
        return state
    }

    return { mapId: action.mapId, x: action.x, y: action.y }
}
