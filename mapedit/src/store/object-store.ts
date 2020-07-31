
interface Objects {
    selectedObject: string,
    objectSprite: string
}

interface SetSelectedObject {
    type: "SET_SELECTED_OBJECT",
    selectedObject: string,
    objectSprite: string
}

export function setSelectedObject(selectedObject: string, objectSprite: string): SetSelectedObject {
    return {
        type: "SET_SELECTED_OBJECT",
        selectedObject: selectedObject,
        objectSprite: objectSprite
    }
}

const initial: Objects = {
    selectedObject: "",
    objectSprite: ""
}

export function objectReducer(state = initial, action: SetSelectedObject) {
    if(action.type != "SET_SELECTED_OBJECT") {
        return state
    }

    return {
        ...state,
        selectedObject: action.selectedObject,
        objectSprite: action.objectSprite
    }
}
