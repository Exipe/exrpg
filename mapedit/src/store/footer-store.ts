
interface Footer {
    hoverX: number,
    hoverY: number
}

interface SetHover {
    type: "SET_HOVER",
    x: number,
    y: number
}

export function setHover(x: number, y: number): SetHover {
    return {
        type: "SET_HOVER",
        x: x,
        y: y
    }
}

export function footerReducer(state: Footer = { hoverX: 0, hoverY: 0 }, action: SetHover) {
    if(action.type != "SET_HOVER") {
        return state
    }

    return {
        ...state,
        hoverX: action.x,
        hoverY: action.y
    }
}
