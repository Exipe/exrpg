
import { combineReducers, createStore } from "redux";
import { windowReducer } from "./window-store";
import { optionReducer } from "./option-store";
import { tileTextureReducer } from "./tile-texture-store";
import { toolReducer } from "./tool-store";
import { detailReducer } from "./detail-store";
import { objectReducer } from "./object-store";
import { WarpReducer } from "./warp-store";
import { footerReducer } from "./footer-store";
import { npcReducer } from "./npc-store";
import { itemReducer } from "./item-store";



const rootReducer = combineReducers({
    windows: windowReducer,
    footer: footerReducer,
    options: optionReducer,
    details: detailReducer,
    tileTexture: tileTextureReducer,
    tool: toolReducer,
    objects: objectReducer,
    npcs: npcReducer,
    items: itemReducer,
    warp: WarpReducer
})

export type RootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer)
