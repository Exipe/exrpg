
export type MapId = "main" | "cave" | "forest"

export const maps = [ "main", "cave", "forest" ] as MapId[]

export function isMapId(id: string): id is MapId {
    return maps.includes(id as MapId)
}