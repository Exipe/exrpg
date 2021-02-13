
interface Footer {
    hoverX: number,
    hoverY: number,
    island: string
}

interface SetHover {
    type: "SET_HOVER",
    x: number,
    y: number,
    island: string
}

export function setHover(x: number, y: number, island: string): SetHover {
    return {
        type: "SET_HOVER",
        x: x,
        y: y,
        island: island
    }
}

export function footerReducer(state: Footer = { hoverX: 0, hoverY: 0, island: "-" }, action: SetHover) {
    if(action.type != "SET_HOVER") {
        return state
    }

    return {
        hoverX: action.x,
        hoverY: action.y,
        island: action.island
    }
}
