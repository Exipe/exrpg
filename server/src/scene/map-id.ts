
export type MapId = "main" | "cave" | "forest" | "rework"

export const maps = [ "main", "cave", "forest", "rework" ] as MapId[]

export function isMapId(id: string): id is MapId {
    return maps.includes(id as MapId)
}