
interface Npcs {
    selectedNpc: string,
    npcSprite: string
}

interface SetSelectedNpc {
    type: "SET_SELECTED_NPC",
    selectedNpc: string,
    npcSprite: string
}

export function SetSelectedNpc(selectedNpc: string, npcSprite: string) {
    return {
        type: "SET_SELECTED_NPC",
        selectedNpc: selectedNpc,
        npcSprite: npcSprite
    }
}

const initial: Npcs = {
    selectedNpc: "",
    npcSprite: ""
}

export function npcReducer(state = initial, action: SetSelectedNpc) {
    if(action.type != "SET_SELECTED_NPC") {
        return state
    }

    return {
        ...state,
        selectedNpc: action.selectedNpc,
        npcSprite: action.npcSprite
    }
}
