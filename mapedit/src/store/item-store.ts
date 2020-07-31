
interface Items {
    selectedItem: string,
    itemSprite: string
}

interface SetSelectedItem {
    type: "SET_SELECTED_ITEM",
    selectedItem: string,
    itemSprite: string
}

export function setSelectedItem(selectedItem: string, itemSprite: string): SetSelectedItem {
    return {
        type: "SET_SELECTED_ITEM",
        selectedItem: selectedItem,
        itemSprite: itemSprite
    }
}

const initial: Items = {
    selectedItem: "",
    itemSprite: ""
}

export function itemReducer(state = initial, action: SetSelectedItem) {
    if(action.type != "SET_SELECTED_ITEM") {
        return state
    }

    return {
        ...state,
        selectedItem: action.selectedItem,
        itemSprite: action.itemSprite
    }
}
