
interface TileTextures {
    groundTexture: Texture,
    shapeTexture: Texture,
    wallTexture: Texture,
    decoTexture: Texture
}

export type TextureId = keyof TileTextures

export interface Texture {
    src: string,
    width: number,
    height: number,
    selectX: number,
    selectY: number
}

interface SetTexture {
    type: "SET_TEXTURE",
    id: TextureId,
    texture: Texture
}

interface SelectTexture {
    type: "SELECT_TEXTURE",
    id: TextureId,
    x: number, y: number
}

export function setTexture(textureId: TextureId, src: string, width: number, height: number): SetTexture {
    return {
        type: "SET_TEXTURE",
        id: textureId,
        texture: {
            src: src,
            width: width,
            height: height,
            selectX: 0,
            selectY: 0
        }
    }
}

export function selectTexture(id: TextureId, x: number, y: number): SelectTexture {
    return {
        type: "SELECT_TEXTURE",
        id: id,
        x: x,
        y: y
    }
}

export function tileTextureReducer(state: TileTextures = null, action: SetTexture | SelectTexture) {
    if(action.type != "SET_TEXTURE" && action.type != "SELECT_TEXTURE") return state

    const tileTextures = {...state}
    switch(action.type) {
        case "SET_TEXTURE":
            tileTextures[action.id] = { ...action.texture }
            break
        case "SELECT_TEXTURE":
            tileTextures[action.id] = { ...(tileTextures[action.id]), selectX: action.x, selectY: action.y }
            break
    }

    return tileTextures
}
